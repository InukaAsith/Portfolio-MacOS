import { useEffect, useState } from 'react'
import { useOS } from '../os'
import { profile, projects } from '../data'
import { useGitHub, useWeather } from '../live'
import { Glyph } from '../glyphs'
import AnalogClock from './AnalogClock'
import { Ico } from '../ico'

function useNow(ms = 1000) {
  const [now, set] = useState(new Date())
  useEffect(() => { const t = setInterval(() => set(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

export function ProfileWidget() {
  const os = useOS()
  const gh = useGitHub()
  return (
    <div className="widget w-profile glass" style={{ '--i': 0 }} role="button" tabIndex={0} onClick={() => os.open('finder', { section: 'about' })}>
      <img src={profile.avatar} alt={profile.name} />
      <div className="wp-info">
        <span className="wp-status"><i /> Open to opportunities</span>
        <h2>{profile.name}</h2>
        <p>{profile.role}</p>
        <div className="wp-stats">
          <span><b>{projects.length}</b>Projects</span>
          <span><b>{gh?.stars ?? '400+'}</b>Stars</span>
          <span><b>{gh?.forks ?? '1.4k'}</b>Forks</span>
        </div>
        <div className="wp-actions">
          <button onClick={(e) => { e.stopPropagation(); os.open('finder', { section: 'about' }) }}>About</button>
          <button onClick={(e) => { e.stopPropagation(); os.open('projects') }}>Projects</button>
          <button onClick={(e) => { e.stopPropagation(); os.open('mail') }}>Contact</button>
        </div>
      </div>
    </div>
  )
}

export function ClockWidget() {
  const os = useOS()
  const now = useNow()
  return (
    <button className="widget w-clock glass" style={{ '--i': 1 }} onClick={() => os.open('clock')} aria-label="Open Clock">
      <AnalogClock h={now.getHours()} m={now.getMinutes()} s={now.getSeconds()} />
    </button>
  )
}

export function CalendarWidget() {
  const os = useOS()
  const now = useNow(60000)
  const y = now.getFullYear(), mo = now.getMonth()
  const first = new Date(y, mo, 1).getDay()
  const days = new Date(y, mo + 1, 0).getDate()
  const cells = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)]
  return (
    <button className="widget w-cal glass" style={{ '--i': 2 }} onClick={() => os.open('calendar')} aria-label="Open Calendar">
      <div className="wc-head">{now.toLocaleDateString('en-US', { month: 'long' }).toUpperCase()}</div>
      <div className="wc-grid">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <b key={i}>{d}</b>)}
        {cells.map((d, i) => <span key={i} className={d === now.getDate() ? 'today' : ''}>{d || ''}</span>)}
      </div>
    </button>
  )
}

export function WeatherWidget() {
  const os = useOS()
  const w = useWeather()
  return (
    <button className={`widget w-weather ${w && !w.day ? 'night' : 'day'}`} style={{ '--i': 3 }} onClick={() => os.open('weather')} aria-label="Open Weather">
      <div className="ww-loc">Colombo <Glyph.arrow style={{ transform: 'rotate(-45deg)', width: 10, height: 10 }} /></div>
      <div className="ww-temp">{w ? `${w.temp}°` : '--°'}</div>
      <div className="ww-bottom">
        <span className="ww-icon"><Ico n={w?.icon || 'cloud-sun'} /></span>
        <span>{w?.label || 'Loading…'}</span>
        <span>{w ? `H:${w.hi}° L:${w.lo}°` : ''}</span>
      </div>
    </button>
  )
}

export function GitHubWidget() {
  const os = useOS()
  const g = useGitHub()
  const stats = [['Stars', g?.stars ?? '400+'], ['Forks', g?.forks ?? '1.4k'], ['Repos', g?.repos ?? '—'], ['Followers', g?.followers ?? '—']]
  return (
    <button className="widget w-gh glass" style={{ '--i': 4 }} onClick={() => os.link(`https://github.com/${profile.github}`)}>
      <div className="wg-head">
        <svg viewBox="0 0 100 100" width="18" height="18"><path fill="currentColor" d="M50 12C29 12 12 29 12 50c0 16.8 10.9 31 26 36 1.9.4 2.6-.8 2.6-1.8v-6.5c-10.6 2.3-12.8-4.5-12.8-4.5-1.7-4.4-4.2-5.6-4.2-5.6-3.5-2.4.3-2.3.3-2.3 3.8.3 5.8 3.9 5.8 3.9 3.4 5.8 8.9 4.1 11.1 3.2.3-2.5 1.3-4.1 2.4-5-8.5-1-17.4-4.2-17.4-18.8 0-4.2 1.5-7.6 3.9-10.2-.4-1-1.7-4.8.4-10.1 0 0 3.2-1 10.5 3.9a36 36 0 0 1 19 0c7.3-4.9 10.5-3.9 10.5-3.9 2.1 5.3.8 9.1.4 10.1 2.5 2.7 3.9 6 3.9 10.2 0 14.6-8.9 17.8-17.4 18.8 1.4 1.2 2.6 3.5 2.6 7.1v10.5c0 1 .7 2.2 2.6 1.8C77.1 81 88 66.8 88 50c0-21-17-38-38-38z" /></svg>
        <span>@{profile.github}</span>
      </div>
      <div className="wg-grid">
        {stats.map(([k, v]) => <div key={k}><b>{v}</b><small>{k}</small></div>)}
      </div>
    </button>
  )
}

export default function Widgets() {
  return (
    <aside className="widgets">
      <ProfileWidget />
      <div className="w-row"><ClockWidget /><CalendarWidget /></div>
      <div className="w-row"><WeatherWidget /><GitHubWidget /></div>
    </aside>
  )
}
