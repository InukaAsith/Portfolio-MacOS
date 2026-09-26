import { useEffect, useState } from 'react'
import { Glyph } from '../glyphs'
import AnalogClock, { tzTime } from '../components/AnalogClock'
import { getForecast } from '../live'
import { Ico } from '../ico'

function useNow(ms = 1000) {
  const [now, set] = useState(new Date())
  useEffect(() => { const t = setInterval(() => set(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

/* ——— Calendar: month view ——— */
export function Calendar() {
  const today = useNow(60000)
  const [cur, setCur] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))
  const [sel, setSel] = useState(null)
  const y = cur.getFullYear(), m = cur.getMonth()
  const first = new Date(y, m, 1).getDay()
  const cells = Array.from({ length: 42 }, (_, i) => new Date(y, m, i - first + 1))
  const same = (a, b) => a.toDateString() === b.toDateString()
  const shift = (d) => setCur(new Date(y, m + d, 1))

  return (
    <div className="app cal-app">
      <header className="toolbar" data-drag>
        <div className="tb-title left"><b>{cur.toLocaleDateString('en-US', { month: 'long' })} <span className="cal-year">{y}</span></b></div>
        <div className="tb-actions">
          <button onClick={() => shift(-1)} aria-label="Previous month"><Glyph.back /></button>
          <button onClick={() => { setCur(new Date(today.getFullYear(), today.getMonth(), 1)); setSel(null) }}>Today</button>
          <button onClick={() => shift(1)} aria-label="Next month"><Glyph.fwd /></button>
        </div>
      </header>
      <div className="cal-head">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <span key={d}>{d}</span>)}</div>
      <div className="cal-grid">
        {cells.map((d) => (
          <button key={d.toISOString()} className={`cal-cell${d.getMonth() !== m ? ' out' : ''}${sel && same(d, sel) ? ' sel' : ''}${[0, 6].includes(d.getDay()) ? ' wk' : ''}`} onClick={() => setSel(d)}>
            <span className={same(d, today) ? 'today' : ''}>{d.getDate() === 1 && d.getMonth() !== m ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : d.getDate()}</span>
            {same(d, today) && <em>You’re visiting <Ico n="wave" /></em>}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ——— Clock: world clock + stopwatch ——— */
const CITIES = [
  ['Colombo', 'Asia/Colombo'], ['San Francisco', 'America/Los_Angeles'], ['London', 'Europe/London'],
  ['New York', 'America/New_York'], ['Tokyo', 'Asia/Tokyo'], ['Sydney', 'Australia/Sydney'],
]

// real UTC offsets (handles half-hour zones and day boundaries)
function offsetLabel(tz, now) {
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(now).map((x) => [x.type, +x.value || 0]))
  const there = Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute)
  const here = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
  const diff = Math.round((there - here) / 1800000) / 2
  const dayDiff = Math.round((Date.UTC(p.year, p.month - 1, p.day) - Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())) / 864e5)
  return `${dayDiff > 0 ? 'Tomorrow' : dayDiff < 0 ? 'Yesterday' : 'Today'}, ${diff >= 0 ? '+' : ''}${diff}HRS`
}

export function Clock() {
  const [tab, setTab] = useState('world')
  return (
    <div className="app clock-app">
      <header className="toolbar" data-drag>
        <div className="tb-title" />
        <div className="tb-seg clock-tabs" data-nodrag>
          <button className={tab === 'world' ? 'on' : ''} onClick={() => setTab('world')}>World Clock</button>
          <button className={tab === 'stop' ? 'on' : ''} onClick={() => setTab('stop')}>Stopwatch</button>
        </div>
        <div className="tb-title" />
      </header>
      {tab === 'world' ? <World /> : <Stopwatch />}
    </div>
  )
}

function World() {
  const now = useNow()
  return (
    <div className="content scroll">
      <div className="world">
        {CITIES.map(([name, tz]) => {
          const t = tzTime(tz, now)
          return (
            <div key={name} className="world-card">
              <AnalogClock {...t} night={t.h < 6 || t.h >= 18} />
              <b>{name}</b>
              <small>{offsetLabel(tz, now)}</small>
              <span className="world-digital">{now.toLocaleTimeString('en-US', { timeZone: tz, hour: 'numeric', minute: '2-digit' })}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const fmt = (ms) => {
  const cs = Math.floor(ms / 10) % 100, s = Math.floor(ms / 1000) % 60, m = Math.floor(ms / 60000)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`
}

function Stopwatch() {
  const [base, setBase] = useState(0)
  const [start, setStart] = useState(null)
  const [laps, setLaps] = useState([])
  const [, tick] = useState(0)
  useEffect(() => { if (start === null) return; const t = setInterval(() => tick((x) => x + 1), 31); return () => clearInterval(t) }, [start])
  const elapsed = base + (start !== null ? Date.now() - start : 0)
  const running = start !== null
  const lapTimes = laps.map((l, i) => l - (laps[i - 1] || 0))
  const best = lapTimes.length > 1 ? Math.min(...lapTimes) : null, worst = lapTimes.length > 1 ? Math.max(...lapTimes) : null
  return (
    <div className="stopwatch">
      <div className="sw-time">{fmt(elapsed)}</div>
      <div className="sw-btns">
        <button className="sw-btn" disabled={!running && !elapsed} onClick={() => (running ? setLaps([...laps, elapsed]) : (setBase(0), setLaps([])))}>{running || !elapsed ? 'Lap' : 'Reset'}</button>
        <button className={`sw-btn ${running ? 'stop' : 'go'}`} onClick={() => (running ? (setBase(elapsed), setStart(null)) : setStart(Date.now()))}>{running ? 'Stop' : 'Start'}</button>
      </div>
      <div className="sw-laps scroll">
        {running && <div className="sw-lap"><span>Lap {laps.length + 1}</span><span>{fmt(elapsed - (laps[laps.length - 1] || 0))}</span></div>}
        {[...lapTimes].reverse().map((t, i) => (
          <div key={i} className={`sw-lap${t === best ? ' best' : ''}${t === worst ? ' worst' : ''}`}><span>Lap {lapTimes.length - i}</span><span>{fmt(t)}</span></div>
        ))}
      </div>
    </div>
  )
}

/* ——— Weather ——— */
const PLACES = [
  { name: 'Colombo', lat: 6.93, lon: 79.85, tz: 'Asia/Colombo', note: 'Home' },
  { name: 'Matara', lat: 5.95, lon: 80.54, tz: 'Asia/Colombo', note: 'Hometown' },
  { name: 'San Francisco', lat: 37.77, lon: -122.42, tz: 'America/Los_Angeles', note: 'Golden Gate' },
]

const skin = (n) => {
  if (!n) return 'wx-day'
  if ([95, 96, 99].includes(n.code)) return 'wx-storm'
  if (n.code >= 51) return n.day ? 'wx-rain' : 'wx-rain-night'
  if (n.code >= 2) return n.day ? 'wx-cloud' : 'wx-cloud-night'
  return n.day ? 'wx-day' : 'wx-night'
}

export function Weather() {
  const [sel, setSel] = useState(0)
  const [data, setData] = useState({})
  const now = useNow(30000)
  useEffect(() => {
    PLACES.forEach((p, i) => getForecast(p.lat, p.lon).then((d) => setData((x) => ({ ...x, [i]: d }))).catch(() => setData((x) => ({ ...x, [i]: 'error' }))))
  }, [])
  const d = data[sel], p = PLACES[sel]
  const ok = d && d !== 'error'
  const lo = ok ? Math.min(...d.daily.map((x) => x.lo)) : 0, hi = ok ? Math.max(...d.daily.map((x) => x.hi)) : 1

  return (
    <div className={`app split weather ${skin(ok && d.now)}`}>
      <aside className="sidebar wx-side" data-drag>
        {PLACES.map((pl, i) => {
          const x = data[i]
          return (
            <button key={pl.name} className={`wx-card ${skin(x && x !== 'error' && x.now)}${sel === i ? ' on' : ''}`} onClick={() => setSel(i)}>
              <div><b>{pl.name}</b><small>{now.toLocaleTimeString('en-US', { timeZone: pl.tz, hour: 'numeric', minute: '2-digit' })} · {pl.note}</small></div>
              <strong>{x && x !== 'error' ? `${x.now.temp}°` : '--'}</strong>
              <small className="wx-card-foot">{x && x !== 'error' ? <>{x.now.label}<span>H:{x.daily[0].hi}° L:{x.daily[0].lo}°</span></> : '…'}</small>
            </button>
          )
        })}
      </aside>
      <main className="main wx-main">
        <header className="toolbar" data-drag />
        <div className="content scroll">
          {!d && <div className="wx-empty">Loading weather…</div>}
          {d === 'error' && <div className="wx-empty">Couldn’t reach the weather service.</div>}
          {ok && (
            <>
              <div className="wx-hero">
                <h2>{p.name}</h2>
                <div className="wx-temp">{d.now.temp}°</div>
                <div className="wx-cond">{d.now.label}</div>
                <div className="wx-hl">H:{d.daily[0].hi}°  L:{d.daily[0].lo}°</div>
              </div>
              <section className="wx-panel">
                <h4>Hourly forecast</h4>
                <div className="wx-hours">
                  {d.hourly.map((h) => <div key={h.t + h.temp} className="wx-hour"><small>{h.t}</small><span><Ico n={h.icon} /></span><b>{h.temp}°</b></div>)}
                </div>
              </section>
              <div className="wx-row">
                <section className="wx-panel wx-days">
                  <h4>7-day forecast</h4>
                  {d.daily.map((x) => (
                    <div key={x.t} className="wx-day-row">
                      <b>{x.t}</b><span className="wx-ico"><Ico n={x.icon} /></span><small>{x.lo}°</small>
                      <i className="wx-range"><em style={{ left: `${((x.lo - lo) / (hi - lo || 1)) * 100}%`, right: `${100 - ((x.hi - lo) / (hi - lo || 1)) * 100}%` }} /></i>
                      <b>{x.hi}°</b>
                    </div>
                  ))}
                </section>
                <div className="wx-tiles">
                  {[['Feels like', `${d.now.feels}°`], ['Humidity', `${d.now.humidity}%`], ['Wind', `${d.now.wind} km/h`], ['UV index', d.uv], ['Sunrise', d.sunrise], ['Sunset', d.sunset]].map(([k, v]) => (
                    <section key={k} className="wx-panel wx-tile"><h4>{k}</h4><b>{v}</b></section>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
