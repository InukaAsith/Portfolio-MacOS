import { useEffect, useMemo, useRef, useState } from 'react'
import { useOS } from '../os'
import { registry, dockApps } from '../apps/registry'
import { AppIcon, Glyph } from '../icons'
import { projects, socials, skills, profile } from '../data'
import { Ico } from '../ico'

function useIndex(power) {
  const os = useOS()
  return useMemo(() => {
    const apps = [...dockApps.filter((a) => a !== 'launchpad'), 'resume'].map((id) => ({
      group: 'Applications', title: registry[id].title, icon: <AppIcon id={id} />, run: () => os.open(id), keys: `${id} ${registry[id].title}`,
    }))
    const sections = [
      ['About Me', 'about', 'bio who inuka'], ['Education', 'education', 'ucsc school university journey'],
      ['Achievements & Certificates', 'achievements', 'cs50 harvard ieee xtreme hackathon'], ['Documents', 'docs', 'files resume'],
    ].map(([title, section, k]) => ({ group: 'Finder', title, sub: 'Finder', icon: <AppIcon id="folder" />, run: () => os.open('finder', { section }), keys: `${title} ${k}` }))
    const proj = projects.map((p) => ({
      group: 'Projects', title: p.name, sub: p.desc, icon: <span className="emoji-ico"><Ico n={p.ico} /></span>, run: () => os.open('projects', { id: p.id }), keys: `${p.name} ${p.tags.join(' ')} ${p.lang}`,
    }))
    const sk = Object.entries(skills).map(([cat, list]) => ({
      group: 'Skills', title: cat, sub: list.join(' · '), icon: <AppIcon id="vscode" />, run: () => os.open('vscode', { file: 'skills.json' }), keys: `${cat} ${list.join(' ')} skills stack`,
    }))
    const actions = [
      ['Toggle Dark Mode', () => os.set({ theme: os.dark ? 'light' : 'dark' }), 'theme appearance light'],
      ['Change Wallpaper', () => os.open('settings', { pane: 'wallpaper' }), 'background'],
      ['Lock Screen', () => power('lock'), 'sleep'],
      ['Restart', () => power('restart'), 'reboot boot'],
      ['Copy Email Address', () => { navigator.clipboard?.writeText(profile.email); os.toast({ app: 'mail', title: 'Copied', body: profile.email }) }, 'contact mail'],
    ].map(([title, run, k]) => ({ group: 'Actions', title, icon: <AppIcon id="settings" />, run, keys: `${title} ${k}` }))
    const links = socials.map((s) => ({ group: 'Links', title: s.label, sub: s.user, icon: <AppIcon id={s.id === 'email' ? 'mail' : s.id} />, run: () => os.link(s.url), keys: `${s.label} ${s.user}` }))
    return [...apps, ...sections, ...proj, ...sk, ...actions, ...links]
  }, [os.dark]) // eslint-disable-line
}

export function Spotlight({ power }) {
  const os = useOS()
  const index = useIndex(power)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const results = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return []
    return index
      .map((r) => {
        const k = r.keys.toLowerCase(), title = r.title.toLowerCase()
        const score = title.startsWith(t) ? 3 : title.includes(t) ? 2 : k.includes(t) ? 1 : t.split(' ').every((w) => k.includes(w)) ? 0.5 : 0
        return { ...r, score }
      })
      .filter((r) => r.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 11)
      .concat({ group: 'Web', title: `Search Google for “${q.trim()}”`, icon: <AppIcon id="safari" />, run: () => os.link(`https://www.google.com/search?q=${encodeURIComponent(q.trim())}`) })
  }, [q, index]) // eslint-disable-line

  const run = (r) => { os.overlay(null, false); r.run() }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(results.length - 1, s + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
    if (e.key === 'Enter' && results[sel]) run(results[sel])
  }
  const suggestions = ['finder', 'terminal', 'projects', 'safari', 'mail', 'notes']

  let last = null
  return (
    <div className="spot-back" onPointerDown={(e) => e.target === e.currentTarget && os.overlay(null, false)}>
      <div className={`spotlight glass${results.length ? ' has' : ''}`}>
        <div className="spot-input">
          <Glyph.search style={{ width: 22, height: 22 }} />
          <input autoFocus placeholder="Spotlight Search" value={q} onChange={(e) => { setQ(e.target.value); setSel(0) }} onKeyDown={onKey} spellCheck={false} />
          {results[sel] && <span className="spot-kind">{results[sel].group}</span>}
        </div>
        {!q && (
          <div className="spot-suggest">
            {suggestions.map((id) => (
              <button key={id} onClick={() => run({ run: () => os.open(id) })}><AppIcon id={id} /><span>{registry[id].title}</span></button>
            ))}
          </div>
        )}
        {q && (
          <div className="spot-results">
            {results.length === 0 && <div className="spot-empty">No results for “{q}”</div>}
            {results.map((r, i) => {
              const head = r.group !== last ? (last = r.group) : null
              return (
                <div key={r.group + r.title}>
                  {head && <div className="spot-group">{i === 0 ? 'Top Hit' : head}</div>}
                  <button className={`spot-row${i === sel ? ' sel' : ''}`} onMouseEnter={() => setSel(i)} onClick={() => run(r)}>
                    <span className="spot-ico">{r.icon}</span>
                    <span className="spot-t">{r.title}</span>
                    {r.sub && <span className="spot-sub">{r.sub}</span>}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export function Launchpad() {
  const os = useOS()
  const [q, setQ] = useState('')
  const items = [
    ...Object.keys(registry).filter((id) => id !== 'about').map((id) => ({ id, title: registry[id].title, run: () => os.open(id) })),
    ...socials.filter((s) => s.id !== 'email').map((s) => ({ id: s.id, title: s.label, run: () => os.link(s.url) })),
  ].filter((i) => i.title.toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="launchpad" onPointerDown={(e) => (e.target === e.currentTarget || e.target.classList.contains('lp-grid')) && os.overlay(null, false)}>
      <div className="lp-search glass"><Glyph.search /><input autoFocus placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="lp-grid">
        {items.map((it, i) => (
          <button key={it.id} className="lp-item" style={{ '--i': i }} onClick={() => { os.overlay(null, false); it.run() }}>
            <AppIcon id={it.id} />
            <span>{it.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export function Toasts() {
  const os = useOS()
  return (
    <div className="toasts">
      {os.toasts.map((t) => <Toast key={t.id} t={t} />)}
    </div>
  )
}

function Toast({ t }) {
  const os = useOS()
  const [out, setOut] = useState(false)
  const [dy, setDy] = useState(0)
  const moved = useRef(false)
  const dismiss = () => { setOut(true); setTimeout(() => os.untoast(t.id), 320) }
  useEffect(() => { const x = setTimeout(dismiss, t.ttl || 6500); return () => clearTimeout(x) }, []) // eslint-disable-line
  // swipe up to dismiss (iOS-style)
  const down = (e) => {
    const y0 = e.clientY
    let d = 0
    moved.current = false
    const move = (ev) => { d = Math.min(0, ev.clientY - y0); if (d < -4) moved.current = true; setDy(d) }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      if (d < -28) dismiss()
      else setDy(0)
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }
  return (
    <div className={`toast glass${out ? ' out' : ''}`} style={dy ? { transform: `translateY(${dy}px)`, opacity: 1 + dy / 120, transition: 'none' } : undefined}
      onPointerDown={down} onClick={() => { if (moved.current) return; t.action?.run(); dismiss() }}>
      <AppIcon id={t.app || 'about'} />
      <div className="toast-body">
        <div className="toast-top"><b>{t.title}</b><small>now</small></div>
        <p>{t.body}</p>
        {t.action && <span className="toast-act">{t.action.label}</span>}
      </div>
      <button className="toast-x" onClick={(e) => { e.stopPropagation(); dismiss() }} aria-label="Dismiss">×</button>
      <i className="toast-grip" />
    </div>
  )
}

export function ContextMenu({ x, y, items, onClose }) {
  const ref = useRef(null)
  const [pos, setPos] = useState({ left: x, top: y })
  useEffect(() => {
    const r = ref.current.getBoundingClientRect()
    setPos({ left: Math.min(x, innerWidth - r.width - 8), top: Math.min(y, innerHeight - r.height - 8) })
    const h = (e) => !ref.current?.contains(e.target) && onClose()
    addEventListener('pointerdown', h)
    return () => removeEventListener('pointerdown', h)
  }, [x, y]) // eslint-disable-line
  return (
    <div ref={ref} className="menu glass ctx" style={pos}>
      {items.map((it, i) => (it === '-' ? <hr key={i} /> : (
        <button key={i} className="menu-row" disabled={!it[1]} onClick={() => { onClose(); it[1]() }}><span>{it[0]}</span></button>
      )))}
    </div>
  )
}

const deskItems = [
  { id: 'about', label: 'About Me', icon: 'folder', open: (os) => os.open('finder', { section: 'about' }) },
  { id: 'proj', label: 'Projects', icon: 'folder', open: (os) => os.open('projects') },
  { id: 'resume', label: 'Resume.pdf', icon: 'pdf', open: (os) => os.open('resume') },
  { id: 'certs', label: 'Certificates', icon: 'folder', open: (os) => os.open('photos', { album: 'Certificates' }) },
  { id: 'me', label: 'inuka.png', icon: 'image', open: (os) => os.open('photos', { album: 'All Photos', view: 0 }) },
]

export function DesktopIcons() {
  const os = useOS()
  const [sel, setSel] = useState(null)
  useEffect(() => {
    const h = (e) => !e.target.closest('.desk-icon') && setSel(null)
    addEventListener('pointerdown', h)
    return () => removeEventListener('pointerdown', h)
  }, [])
  return (
    <div className="desk-icons">
      {deskItems.map((d, i) => (
        <button key={d.id} className={`desk-icon${sel === d.id ? ' sel' : ''}`} style={{ '--i': i }}
          onClick={() => (innerWidth < 768 ? d.open(os) : setSel(d.id))}
          onDoubleClick={() => { setSel(null); d.open(os) }}
          onKeyDown={(e) => e.key === 'Enter' && d.open(os)}>
          <AppIcon id={d.icon} />
          <span>{d.label}</span>
        </button>
      ))}
    </div>
  )
}
