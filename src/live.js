import { useEffect, useState } from 'react'
import { profile } from './data'

// One fetch per session, shared by every component that needs GitHub or weather data.
const cache = {}
function once(key, fn) {
  if (!cache[key]) {
    const stored = sessionStorage.getItem(key)
    cache[key] = stored ? Promise.resolve(JSON.parse(stored)) : fn().then((v) => { sessionStorage.setItem(key, JSON.stringify(v)); return v })
    cache[key].catch(() => { delete cache[key] })
  }
  return cache[key]
}

async function fetchGitHub() {
  const u = profile.github
  const [user, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${u}`).then((r) => { if (!r.ok) throw r; return r.json() }),
    fetch(`https://api.github.com/users/${u}/repos?per_page=100&type=owner`).then((r) => { if (!r.ok) throw r; return r.json() }),
  ])
  const own = repos.filter((r) => !r.fork)
  const byName = {}
  repos.forEach((r) => { byName[r.name.toLowerCase()] = { stars: r.stargazers_count, forks: r.forks_count, updated: r.pushed_at } })
  return {
    followers: user.followers,
    repos: user.public_repos,
    stars: own.reduce((a, r) => a + r.stargazers_count, 0),
    forks: own.reduce((a, r) => a + r.forks_count, 0),
    byName,
  }
}

const WMO = {
  0: ['Clear', 'sun', 'moon'], 1: ['Mostly Clear', 'cloud-sun', 'cloud-moon'], 2: ['Partly Cloudy', 'cloud-sun', 'cloud-moon'], 3: ['Cloudy', 'cloud', 'cloud'],
  45: ['Fog', 'fog', 'fog'], 48: ['Fog', 'fog', 'fog'], 51: ['Drizzle', 'drizzle', 'drizzle'], 53: ['Drizzle', 'drizzle', 'drizzle'], 55: ['Drizzle', 'drizzle', 'drizzle'],
  61: ['Rain', 'rain', 'rain'], 63: ['Rain', 'rain', 'rain'], 65: ['Heavy Rain', 'rain', 'rain'], 80: ['Showers', 'drizzle', 'drizzle'], 81: ['Showers', 'rain', 'rain'],
  82: ['Heavy Showers', 'storm', 'storm'], 95: ['Thunderstorm', 'storm', 'storm'], 96: ['Thunderstorm', 'storm', 'storm'], 99: ['Thunderstorm', 'storm', 'storm'],
}

async function fetchWeather() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=6.93&longitude=79.85&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1'
  const d = await fetch(url).then((r) => { if (!r.ok) throw r; return r.json() })
  const c = d.current
  const w = WMO[c.weather_code] || WMO[2]
  return {
    temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), humidity: c.relative_humidity_2m, wind: Math.round(c.wind_speed_10m),
    label: w[0], icon: c.is_day ? w[1] : w[2], day: !!c.is_day, hi: Math.round(d.daily.temperature_2m_max[0]), lo: Math.round(d.daily.temperature_2m_min[0]),
  }
}

function useLive(key, fn) {
  const [v, set] = useState(null)
  useEffect(() => { let on = true; once(key, fn).then((x) => on && set(x)).catch(() => {}); return () => { on = false } }, [key]) // eslint-disable-line
  return v
}

export const wmo = (code, day = true) => { const w = WMO[code] || WMO[2]; return { label: w[0], icon: day ? w[1] : w[2] } }

// Full forecast for the Weather app (one request per city per session)
export function getForecast(lat, lon) {
  return once(`ia-fc2-${lat},${lon}`, async () => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max&timezone=auto&forecast_days=7`
    const d = await fetch(url).then((r) => { if (!r.ok) throw r; return r.json() })
    const c = d.current
    const start = Math.max(0, d.hourly.time.findIndex((t) => t.slice(0, 13) >= c.time.slice(0, 13)))
    const hour = (t) => { const h = +t.slice(11, 13); return `${h % 12 || 12}${h < 12 ? 'AM' : 'PM'}` }
    const dayName = (t, i) => (i === 0 ? 'Today' : new Date(`${t}T12:00`).toLocaleDateString('en-US', { weekday: 'short' }))
    return {
      now: { temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature), humidity: c.relative_humidity_2m, wind: Math.round(c.wind_speed_10m), day: !!c.is_day, code: c.weather_code, ...wmo(c.weather_code, c.is_day) },
      hourly: d.hourly.time.slice(start, start + 24).map((t, i) => ({ t: i === 0 ? 'Now' : hour(t), temp: Math.round(d.hourly.temperature_2m[start + i]), icon: wmo(d.hourly.weather_code[start + i], d.hourly.is_day[start + i]).icon })),
      daily: d.daily.time.map((t, i) => ({ t: dayName(t, i), icon: wmo(d.daily.weather_code[i]).icon, hi: Math.round(d.daily.temperature_2m_max[i]), lo: Math.round(d.daily.temperature_2m_min[i]) })),
      sunrise: d.daily.sunrise[0].slice(11), sunset: d.daily.sunset[0].slice(11), uv: Math.round(d.daily.uv_index_max[0]),
    }
  })
}

export const useGitHub = () => useLive('ia-gh', fetchGitHub)
export const useWeather = () => useLive('ia-wx', fetchWeather)
export const getWeather = () => once('ia-wx2', fetchWeather)
