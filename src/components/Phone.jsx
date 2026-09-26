import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useOS } from '../os'
import { apps, preloadApps } from '../apps'
import { AppIcon, Glyph } from '../icons'
import { socials } from '../data'
import { ProfileWidget, WeatherWidget, CalendarWidget } from './Widgets'
import { Spotlight, Toasts } from './Overlays'
import { AppBoundary } from './Window'

// iOS-style home screen for phones: two pages, a dock, full-screen apps and AssistiveTouch.
const LABEL = { finder: 'About Me', resume: 'Résumé', vscode: 'VS Code', settings: 'Settings', github: 'GitHub', linkedin: 'LinkedIn', instagram: 'Instagram' }
const TITLE = { safari: 'Safari', terminal: 'Terminal', mail: 'Mail', notes: 'Notes', projects: 'Projects', photos: 'Photos', calculator: 'Calculator', calendar: 'Calendar', clock: 'Clock', weather: 'Weather' }
// home screen icons in order: whatever doesn't fit in whole rows under the widgets flows onto the next page
const HOME = ['finder', 'resume', 'notes', 'photos', 'vscode', 'github', 'linkedin', 'instagram', 'calendar', 'weather', 'clock', 'calculator', 'settings']
const COLS = 4
const DOCK = ['projects', 'terminal', 'safari', 'mail']
const EASE = 'cubic-bezier(.2,.9,.25,1)'

// how many icons fit in whole rows of a grid, from its size and its CSS row track / gap
function useCapacity() {
  const ref = useRef(null)
  const [n, setN] = useState(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const cs = getComputedStyle(el)
      const row = parseFloat(cs.getPropertyValue('--ios-row')) || 86, gap = parseFloat(cs.rowGap) || 0
      setN(Math.max(0, Math.floor((el.clientHeight + gap) / (row + gap))) * COLS)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return [ref, n]
}

function useClock() {
  const [now, set] = useState(new Date())
  useEffect(() => { const t = setInterval(() => set(new Date()), 15000); return () => clearInterval(t) }, [])
  return now
}

export default function Phone({ power }) {
  const os = useOS()
  const now = useClock()
  const [page, setPage] = useState(0)
  const [menu, setMenu] = useState(false)
  const pagesRef = useRef(null)
  const appRef = useRef(null)
  const origin = useRef(null)
  const [firstRef, first] = useCapacity()
  const [restRef, rest] = useCapacity()
  const pages = [HOME.slice(0, first ?? HOME.length)]
  for (let i = pages[0].length; i < HOME.length; i += Math.max(COLS, rest ?? HOME.length)) pages.push(HOME.slice(i, i + Math.max(COLS, rest ?? HOME.length)))
  if (pages.length < 2) pages.push([]) // keep a second page mounted so its capacity can be measured
  const top = [...os.windows].filter((w) => !w.closing).sort((a, b) => b.z - a.z)[0]
  const App = top && apps[top.app]

  // no window chrome on phones: anything asked to close just closes
  useEffect(() => { os.windows.filter((w) => w.closing).forEach((w) => os.dispatch({ type: 'CLOSE', id: w.id })) }, [os.windows]) // eslint-disable-line

  useEffect(() => { preloadApps() }, [])

  useEffect(() => {
    const t = setTimeout(() => os.toast({ app: 'finder', title: 'Welcome, I’m Inuka', body: 'Tap to read about me, then explore my apps.', ttl: 8000, action: { label: 'Open About Me', run: () => os.open('finder', { section: 'about' }) } }), 1500)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line

  const iconRect = (id) => document.querySelector(`[data-ios="${id}"] .app-icon`)?.getBoundingClientRect()
  const zoom = (r) => {
    const w = innerWidth, h = innerHeight
    const rr = r || { left: w / 2 - 30, top: h / 2 - 30, width: 60, height: 60 }
    return `translate(${rr.left}px, ${rr.top}px) scale(${rr.width / w}, ${rr.height / h})`
  }

  // zoom the app out of its icon
  useLayoutEffect(() => {
    if (!top || !appRef.current) return
    appRef.current.animate(
      [{ transform: zoom(origin.current || iconRect(top.app)), borderRadius: '90px', opacity: 0.4 }, { transform: 'none', borderRadius: '0px', opacity: 1 }],
      { duration: 420, easing: EASE },
    )
    origin.current = null
  }, [top?.id]) // eslint-disable-line

  const launch = (id, e) => {
    setMenu(false)
    const s = socials.find((x) => x.id === id)
    if (s) return os.link(s.url)
    origin.current = e?.currentTarget.querySelector('.app-icon')?.getBoundingClientRect() || null
    os.open(id)
  }

  const home = () => {
    setMenu(false)
    os.overlay(null, false)
    if (!top || !appRef.current) return
    const a = appRef.current.animate(
      [{ transform: 'none', borderRadius: '0px', opacity: 1 }, { transform: zoom(iconRect(top.app)), borderRadius: '90px', opacity: 0 }],
      { duration: 360, easing: 'cubic-bezier(.4,0,.2,1)', fill: 'forwards' },
    )
    a.onfinish = () => os.reset()
  }

  // swipe up on the home bar
  const swipe = (e) => {
    const y0 = e.clientY
    const up = (ev) => { removeEventListener('pointerup', up); if (y0 - ev.clientY > 30 || Math.abs(y0 - ev.clientY) < 6) home() }
    addEventListener('pointerup', up)
  }

  const icon = (id, label = true, cls = '') => (
    <button key={id} className={`ios-icon${cls}`} data-ios={id} onClick={(e) => launch(id, e)}>
      <AppIcon id={id} />
      {label && <span>{LABEL[id] || TITLE[id]}</span>}
    </button>
  )

  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).replace(/\s?[AP]M/, '')

  return (
    <div className={`ios${top ? ' in-app' : ''}`}>
      <div className="ios-status">
        <b>{time}</b>
        <span className="ios-status-r">
          <svg viewBox="0 0 20 12" width="18" height="11"><rect x="0" y="8" width="3.5" height="4" rx="1" fill="currentColor" /><rect x="5.5" y="5.5" width="3.5" height="6.5" rx="1" fill="currentColor" /><rect x="11" y="3" width="3.5" height="9" rx="1" fill="currentColor" /><rect x="16.5" y="0" width="3.5" height="12" rx="1" fill="currentColor" /></svg>
          <Glyph.wifi />
          <span className="batt"><i style={{ width: '70%' }} /></span>
        </span>
      </div>

      <div className="ios-home" aria-hidden={!!top}>
        <div className="ios-pages" ref={pagesRef} onScroll={(e) => setPage(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
          <section className="ios-page">
            <div className="ios-widgets">
              <ProfileWidget />
              <div className="ios-wrow"><WeatherWidget /><CalendarWidget /></div>
            </div>
            <div className="ios-grid" ref={firstRef}>{pages[0].map((id) => icon(id))}</div>
          </section>
          {pages.slice(1).map((ids, i) => (
            <section className="ios-page" key={i} hidden={!ids.length}>
              <div className="ios-grid" ref={i === 0 ? restRef : undefined}>{ids.map((id) => icon(id))}</div>
            </section>
          ))}
        </div>
        <div className="ios-dots">
          {pages.filter((ids, i) => i === 0 || ids.length).map((_, i) => <i key={i} className={page === i ? 'on' : ''} onClick={() => pagesRef.current.scrollTo({ left: i * pagesRef.current.clientWidth, behavior: 'smooth' })} />)}
        </div>
        <div className="ios-dock glass">{DOCK.map((id) => icon(id, false))}</div>
      </div>

      {top && App && (
        <div className="ios-app" ref={appRef} key={top.id}>
          <div className="ios-app-body">
            <AppBoundary name={TITLE[top.app] || LABEL[top.app] || 'App'}><Suspense fallback={<div className="app-loading" />}><App win={top} power={power} /></Suspense></AppBoundary>
          </div>
          <div className="ios-homebar" onPointerDown={swipe} aria-label="Swipe up or tap to go Home" />
        </div>
      )}

      <AssistiveTouch open={menu} setOpen={setMenu} actions={[
        ['Home', <HomeGlyph key="h" />, home],
        ['Search', <Glyph.search key="s" style={{ width: 22, height: 22 }} />, () => { setMenu(false); os.overlay('spotlight', false) }],
        [os.dark ? 'Light Mode' : 'Dark Mode', os.dark ? <Glyph.sun key="a" style={{ width: 22, height: 22 }} /> : <Glyph.moon key="a" style={{ width: 22, height: 22 }} />, () => { setMenu(false); os.set({ theme: os.dark ? 'light' : 'dark' }) }],
        ['Lock', <Glyph.lock key="l" style={{ width: 20, height: 20 }} />, () => { setMenu(false); power('lock') }],
      ]} />

      {os.layer === 'spotlight' && <Spotlight power={power} />}
      <Toasts />
    </div>
  )
}

function HomeGlyph() {
  return <svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
}

function AssistiveTouch({ open, setOpen, actions }) {
  const [pos, setPos] = useState(() => ({ x: innerWidth - 66, y: Math.round(innerHeight * 0.62) }))
  const [drag, setDrag] = useState(false)
  const down = (e) => {
    e.preventDefault()
    const sx = e.clientX, sy = e.clientY, ox = pos.x, oy = pos.y
    let moved = false
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 6) return
      moved = true
      setDrag(true)
      setPos({ x: ox + ev.clientX - sx, y: oy + ev.clientY - sy })
    }
    const up = (ev) => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      setDrag(false)
      if (!moved) return setOpen(!open)
      const x = ox + ev.clientX - sx
      setPos({ x: x + 28 < innerWidth / 2 ? 10 : innerWidth - 66, y: Math.min(innerHeight - 140, Math.max(50, oy + ev.clientY - sy)) })
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }
  return (
    <>
      <div className={`at${drag ? ' drag' : ''}${open ? ' on' : ''}`} style={{ left: pos.x, top: pos.y }} onPointerDown={down} role="button" aria-label="AssistiveTouch"><i /></div>
      {open && (
        <div className="at-back" onPointerDown={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div className="at-menu">
            {actions.map(([label, ico, run]) => <button key={label} onClick={run}><span>{ico}</span>{label}</button>)}
          </div>
        </div>
      )}
    </>
  )
}
