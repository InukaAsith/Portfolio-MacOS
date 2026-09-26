import { useEffect, useRef, useState } from 'react'
import { useOS } from '../os'
import { registry } from '../apps/registry'
import { Logo, Glyph } from '../icons'
import { profile, socials, wallpapers } from '../data'

function useClock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  return now
}

function useBattery() {
  const [b, setB] = useState({ level: 0.86, charging: false })
  useEffect(() => {
    let bat
    const upd = () => setB({ level: bat.level, charging: bat.charging })
    navigator.getBattery?.().then((x) => { bat = x; upd(); x.addEventListener('levelchange', upd); x.addEventListener('chargingchange', upd) }).catch(() => {})
    return () => { if (bat) { bat.removeEventListener('levelchange', upd); bat.removeEventListener('chargingchange', upd) } }
  }, [])
  return b
}

export default function MenuBar({ power }) {
  const os = useOS()
  const now = useClock()
  const bat = useBattery()
  const open = os.layer?.startsWith('menu:') ? os.layer.slice(5) : null
  const barRef = useRef(null)
  const win = os.windows.find((w) => w.id === os.focused)
  const app = win ? registry[win.app]?.title : 'Finder'
  const short = app === 'Visual Studio Code' ? 'Code' : app

  useEffect(() => {
    if (!open && os.layer !== 'control') return
    const h = (e) => { if (!e.target.closest('.menubar, .cc')) os.overlay(null, false) }
    addEventListener('pointerdown', h)
    return () => removeEventListener('pointerdown', h)
  }, [open, os.layer]) // eslint-disable-line

  const act = (fn) => () => { os.overlay(null, false); fn?.() }
  const copyEmail = () => { navigator.clipboard?.writeText(profile.email); os.toast({ app: 'finder', title: 'Copied', body: `${profile.email} copied to clipboard` }) }

  const menus = [
    { id: 'logo', label: <Logo size={15} />, items: [
      ['About This Mac', () => os.open('about')],
      '-',
      ['System Settings…', () => os.open('settings')],
      ['Launchpad', () => os.overlay('launchpad', false)],
      '-',
      ['Force Quit All…', () => os.closeAll(), '⌥⌘⎋'],
      '-',
      ['Sleep', () => power('sleep')],
      ['Restart…', () => power('restart')],
      ['Shut Down…', () => power('off')],
      '-',
      ['Lock Screen', () => power('lock'), '⌃⌘Q'],
      [`Log Out ${profile.first}…`, () => power('lock'), '⇧⌘Q'],
    ] },
    { id: 'app', label: <b>{short}</b>, items: [
      [`About ${short}`, () => os.open('about')],
      '-',
      ['Settings…', () => os.open('settings'), '⌘,'],
      '-',
      [`Hide ${short}`, win && (() => os.minimize(win.id)), '⌘H'],
      [`Quit ${short}`, win && (() => os.quit(win.app)), '⌘Q'],
    ] },
    { id: 'file', label: 'File', items: [
      ['New Finder Window', () => os.open('finder', null, true), '⌘N'],
      ['New Terminal Window', () => os.open('terminal', null, true)],
      ['Open Resume.pdf', () => os.open('resume'), '⌘O'],
      '-',
      ['Close Window', win && (() => os.close(win.id)), '⌘W'],
    ] },
    { id: 'edit', label: 'Edit', items: [['Undo', null, '⌘Z'], ['Redo', null, '⇧⌘Z'], '-', ['Cut', null, '⌘X'], ['Copy', null, '⌘C'], ['Paste', null, '⌘V'], '-', ['Copy Email Address', copyEmail]] },
    { id: 'view', label: 'View', items: [
      [os.dark ? 'Use Light Appearance' : 'Use Dark Appearance', () => os.set({ theme: os.dark ? 'light' : 'dark' })],
      [os.showWidgets ? 'Hide Desktop Widgets' : 'Show Desktop Widgets', () => os.set({ showWidgets: !os.showWidgets })],
      '-',
      ['Enter Full Screen', () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.()), '⌃⌘F'],
    ] },
    { id: 'go', label: 'Go', items: [
      ['About Me', () => os.open('finder', { section: 'about' }), '⇧⌘A'],
      ['Projects', () => os.open('projects')],
      ['Applications', () => os.open('finder', { section: 'apps' })],
      ['Documents', () => os.open('finder', { section: 'docs' })],
      '-',
      ...socials.filter((s) => s.id !== 'email').map((s) => [s.label, () => os.link(s.url)]),
    ] },
    { id: 'window', label: 'Window', items: [
      ['Minimize', win && (() => os.minimize(win.id)), '⌘M'],
      ['Zoom', win && (() => os.maximize(win.id))],
      '-',
      ...(os.windows.length ? os.windows.map((w) => [`${w.id === os.focused ? '✓ ' : ''}${registry[w.app]?.title}`, () => os.focus(w.id)]) : [['No Windows', null]]),
    ] },
    { id: 'help', label: 'Help', items: [
      ['Portfolio Help (Terminal)', () => os.open('terminal', { run: 'help' })],
      ['Keyboard Shortcuts', () => os.toast({ app: 'settings', title: 'Shortcuts', body: '⌘K / Ctrl+K Spotlight · Esc close overlays · F4 Launchpad · double-click title to zoom' })],
      ['Contact Inuka', () => os.open('mail')],
    ] },
  ]

  const time = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  const day = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })
  const pct = Math.round(bat.level * 100)

  return (
    <>
      <header className="menubar" ref={barRef} onDoubleClick={(e) => e.stopPropagation()}>
        <nav className="mb-left">
          {menus.map((m) => (
            <div key={m.id} className={`mb-item-wrap mb-${m.id}`}>
              <button
                className={`mb-item${open === m.id ? ' on' : ''}`}
                onPointerDown={(e) => { e.preventDefault(); os.overlay(`menu:${m.id}`) }}
                onPointerEnter={() => open && open !== m.id && os.overlay(`menu:${m.id}`, false)}
              >{m.label}</button>
              {open === m.id && (
                <div className="menu glass">
                  {m.items.map((it, i) => it === '-'
                    ? <hr key={i} />
                    : <button key={i} className="menu-row" disabled={!it[1]} onClick={act(it[1])}><span>{it[0]}</span>{it[2] && <kbd>{it[2]}</kbd>}</button>)}
                </div>
              )}
            </div>
          ))}
        </nav>
        <div className="mb-right">
          <a className="mb-icon hide-sm" href={socials[0].url} target="_blank" rel="noreferrer" title="GitHub">
            <svg viewBox="0 0 100 100" width="15" height="15"><path fill="currentColor" d="M50 12C29 12 12 29 12 50c0 16.8 10.9 31 26 36 1.9.4 2.6-.8 2.6-1.8v-6.5c-10.6 2.3-12.8-4.5-12.8-4.5-1.7-4.4-4.2-5.6-4.2-5.6-3.5-2.4.3-2.3.3-2.3 3.8.3 5.8 3.9 5.8 3.9 3.4 5.8 8.9 4.1 11.1 3.2.3-2.5 1.3-4.1 2.4-5-8.5-1-17.4-4.2-17.4-18.8 0-4.2 1.5-7.6 3.9-10.2-.4-1-1.7-4.8.4-10.1 0 0 3.2-1 10.5 3.9a36 36 0 0 1 19 0c7.3-4.9 10.5-3.9 10.5-3.9 2.1 5.3.8 9.1.4 10.1 2.5 2.7 3.9 6 3.9 10.2 0 14.6-8.9 17.8-17.4 18.8 1.4 1.2 2.6 3.5 2.6 7.1v10.5c0 1 .7 2.2 2.6 1.8C77.1 81 88 66.8 88 50c0-21-17-38-38-38z" /></svg>
          </a>
          <span className="mb-icon batt-wrap hide-sm" title={`${pct}%${bat.charging ? '   charging' : ''}`}>
            <span className="mb-pct">{pct}%</span>
            <span className={`batt${bat.charging ? ' charging' : ''}${pct < 20 ? ' low' : ''}`}><i style={{ width: `${Math.max(8, pct)}%` }} /></span>
          </span>
          <span className="mb-icon hide-sm" title={os.wifi ? 'Wi-Fi: InukaNet' : 'Wi-Fi off'} style={{ opacity: os.wifi ? 1 : 0.4 }}><Glyph.wifi /></span>
          <button className="mb-icon" onClick={() => os.overlay('spotlight')} aria-label="Spotlight"><Glyph.search /></button>
          <button className={`mb-icon${os.layer === 'control' ? ' on' : ''}`} onPointerDown={(e) => { e.preventDefault(); os.overlay('control') }} aria-label="Control Center"><Glyph.control /></button>
          <button className="mb-clock" onClick={() => os.overlay('control')}><span className="hide-sm">{day}&nbsp;&nbsp;</span>{time}</button>
        </div>
      </header>
      {os.layer === 'control' && <ControlCenter />}
    </>
  )
}

function useFullscreen() {
  const [fs, setFs] = useState(!!document.fullscreenElement)
  useEffect(() => {
    const upd = () => setFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', upd)
    return () => document.removeEventListener('fullscreenchange', upd)
  }, [])
  const toggle = () => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())?.catch?.(() => {})
  return [fs, toggle]
}

function ControlCenter() {
  const os = useOS()
  const [fs, toggleFs] = useFullscreen()
  const tile = (key, icon, label, sub) => (
    <button className={`cc-toggle${os[key] ? ' on' : ''}`} onClick={() => os.set({ [key]: !os[key] })}>
      <span className="cc-dot">{icon}</span>
      <span><b>{label}</b><small>{os[key] ? sub[0] : sub[1]}</small></span>
    </button>
  )
  return (
    <div className="cc glass">
      <div className="cc-grid">
        <div className="cc-card cc-net">
          {tile('wifi', <Glyph.wifi />, 'Wi-Fi', ['InukaNet', 'Off'])}
          {tile('bluetooth', <Glyph.bluetooth />, 'Bluetooth', ['On', 'Off'])}
          {tile('airdrop', <Glyph.airdrop />, 'AirDrop', ['Everyone', 'Contacts Only'])}
        </div>
        <div className="cc-side">
          <button className={`cc-card cc-mode${os.dark ? ' on' : ''}`} onClick={() => os.set({ theme: os.dark ? 'light' : 'dark' })}>
            <span className="cc-dot">{os.dark ? <Glyph.moon /> : <Glyph.sun />}</span><b>{os.dark ? 'Dark Mode' : 'Light Mode'}</b>
          </button>
          <button className={`cc-card cc-mode${fs ? ' on' : ''}`} onClick={toggleFs}>
            <span className="cc-dot">{fs ? <Glyph.shrink /> : <Glyph.expand />}</span><b>Full Screen</b>
          </button>
        </div>
      </div>
      <div className="cc-card cc-slider">
        <b>Display</b>
        <label><Glyph.sun /><input type="range" min="45" max="100" value={os.brightness} onChange={(e) => os.set({ brightness: +e.target.value })} style={{ '--v': `${((os.brightness - 45) / 55) * 100}%` }} /></label>
      </div>
      <div className="cc-card cc-slider">
        <b>Sound</b>
        <label><Glyph.speaker /><input type="range" min="0" max="100" value={os.volume} onChange={(e) => os.set({ volume: +e.target.value })} style={{ '--v': `${os.volume}%` }} /></label>
      </div>
      <div className="cc-card cc-walls">
        <b>Wallpaper</b>
        <div>
          {wallpapers.map((w) => (
            <button key={w.id} title={w.name} className={os.wallpaper === w.id ? 'on' : ''} onClick={() => os.set({ wallpaper: w.id })}
              style={{ background: w.css || `url(${w.thumb}) center/cover` }}>
              {w.thumb2 && <i style={{ background: `url(${w.thumb2}) center/cover` }} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
