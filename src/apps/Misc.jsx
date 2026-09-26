import { useCallback, useEffect, useState } from 'react'
import { useOS, wallpaperFor } from '../os'
import { Glyph } from '../glyphs'
import { profile, projects, certificates } from '../data'
import { Ico } from '../ico'

/*  —— Photos  —— */
const PHOTOS = [
  { src: profile.photo, title: 'Me', album: 'Me', caption: `${profile.name}   hi there!` },
  ...certificates.map((c) => ({ src: c.image, title: c.title, album: 'Certificates', caption: `${c.title} · ${c.year}` })),
  ...projects.filter((p) => p.image).map((p) => ({ src: p.image, title: p.name, album: 'Projects', caption: `${p.name}   ${p.desc}` })),
  { src: '/wall/sunset-1920.webp', title: 'Golden Gate Sunset', album: 'Wallpapers', caption: 'Golden Gate Sunset   generated for this site' },
  { src: '/wall/night-1920.webp', title: 'Golden Gate Night', album: 'Wallpapers', caption: 'Golden Gate Night   generated for this site' },
]
const ALBUMS = [['All Photos', 'image'], ['Me', 'smile'], ['Certificates', 'certificate'], ['Projects', 'briefcase'], ['Wallpapers', 'bridge']]

export function Photos({ win }) {
  const [album, setAlbum] = useState(win.props?.album || 'All Photos')
  const [view, setView] = useState(win.props?.view ?? null)
  useEffect(() => { if (win.props?.album) { setAlbum(win.props.album); setView(win.props.view ?? null) } }, [win.props?.nonce]) // eslint-disable-line
  const list = PHOTOS.filter((p) => album === 'All Photos' || p.album === album)
  const step = useCallback((d) => setView((v) => (v + d + list.length) % list.length), [list.length])
  useEffect(() => {
    if (view === null) return
    const k = (e) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1); if (e.key === 'Escape') setView(null) }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [view, step])
  const cur = view !== null && list[view]

  return (
    <div className="app split">
      <aside className="sidebar" data-drag>
        <div className="sb-group">
          <div className="sb-head">Library</div>
          {ALBUMS.map(([a, e]) => (
            <button key={a} className={`sb-item${album === a ? ' on' : ''}`} onClick={() => { setAlbum(a); setView(null) }}>
              <span className="sb-ico"><Ico n={e} /></span>{a}<span className="sb-count">{a === 'All Photos' ? PHOTOS.length : PHOTOS.filter((p) => p.album === a).length}</span>
            </button>
          ))}
        </div>
      </aside>
      <main className="main">
        <header className="toolbar" data-drag>
          <div className="tb-nav">{cur && <button onClick={() => setView(null)} aria-label="Back to grid"><Glyph.back /></button>}</div>
          <div className="tb-title">{cur ? cur.title : album}</div>
          <div className="tb-actions">{cur && <><button onClick={() => step(-1)} aria-label="Previous"><Glyph.back /></button><button onClick={() => step(1)} aria-label="Next"><Glyph.fwd /></button></>}</div>
        </header>
        {!cur && (
          <div className="content scroll">
            <div className="ph-grid">
              {list.map((p, i) => (
                <button key={p.src} className="ph-cell" style={{ '--i': i }} onClick={() => setView(i)}>
                  <img src={p.src} alt={p.title} loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        )}
        {cur && (
          <div className="ph-view">
            <img key={cur.src} src={cur.src} alt={cur.title} />
            <div className="ph-cap">{cur.caption}</div>
          </div>
        )}
      </main>
    </div>
  )
}

/*  —— Calculator  —— */
export function Calculator({ win }) {
  const os = useOS()
  const [s, setS] = useState({ disp: '0', acc: null, op: null, fresh: true })
  const calc = (a, b, op) => ({ '+': a + b, '−': a - b, '×': a * b, '÷': b === 0 ? NaN : a / b }[op])
  const fmt = (n) => (Number.isNaN(n) || !Number.isFinite(n) ? 'Error' : String(+n.toPrecision(12)).length > 11 ? n.toExponential(5) : String(+n.toPrecision(12)))
  const press = useCallback((k) => setS((st) => {
    const val = parseFloat(st.disp) || 0
    if (/^[0-9]$/.test(k)) return { ...st, disp: st.fresh || st.disp === '0' ? k : (st.disp + k).slice(0, 11), fresh: false }
    if (k === '.') return { ...st, disp: st.fresh ? '0.' : st.disp.includes('.') ? st.disp : st.disp + '.', fresh: false }
    if (k === 'AC') return { disp: '0', acc: null, op: null, fresh: true }
    if (k === 'C') return { ...st, disp: '0', fresh: true }
    if (k === '±') return { ...st, disp: fmt(-val) }
    if (k === '%') return { ...st, disp: fmt(val / 100) }
    if (k === '⌫') return { ...st, disp: st.disp.length > 1 ? st.disp.slice(0, -1) : '0' }
    if (k === '=') return st.op ? { disp: fmt(calc(st.acc, val, st.op)), acc: null, op: null, fresh: true } : st
    const acc = st.op && !st.fresh ? calc(st.acc, val, st.op) : st.acc ?? val
    return { disp: st.op && !st.fresh ? fmt(acc) : st.disp, acc: st.op && !st.fresh ? acc : val, op: k, fresh: true }
  }), [])
  useEffect(() => {
    if (os.focused !== win.id) return
    const map = { '+': '+', '-': '−', '*': '×', x: '×', '/': '÷', Enter: '=', '=': '=', Escape: 'AC', Backspace: '⌫', '%': '%', '.': '.', ',': '.' }
    const k = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      const key = /^[0-9]$/.test(e.key) ? e.key : map[e.key]
      if (key) { e.preventDefault(); press(key) }
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [os.focused, win.id, press])
  const keys = [[s.disp !== '0' && !s.fresh ? 'C' : 'AC', 'fn'], ['±', 'fn'], ['%', 'fn'], ['÷', 'op'], ['7'], ['8'], ['9'], ['×', 'op'], ['4'], ['5'], ['6'], ['−', 'op'], ['1'], ['2'], ['3'], ['+', 'op'], ['0', 'zero'], ['.'], ['=', 'op']]
  const size = s.disp.length > 9 ? 34 : s.disp.length > 7 ? 42 : 52
  return (
    <div className="app calc">
      <div className="calc-disp" data-drag style={{ fontSize: size }}>{s.disp}</div>
      <div className="calc-keys">
        {keys.map(([k, c]) => <button key={k} className={`ck ${c || ''}${c === 'op' && s.op === k && s.fresh ? ' on' : ''}`} onClick={() => press(k)}>{k}</button>)}
      </div>
    </div>
  )
}

/*  —— About This Mac  —— */
export function AboutMac() {
  const os = useOS()
  const wall = wallpaperFor(os.wallpaper, os.dark, true) || '/wall/sunset-thumb.webp'
  const rows = [['Chip', 'Brain™ M4 Max (caffeinated)'], ['Memory', '400+ GitHub ★'], ['Startup disk', 'Macintosh HD'], ['Serial number', 'IA-UCSC-2024'], ['macOS', 'Golden Gate 26.0']]
  return (
    <div className="app about-mac" data-drag>
      <div className="mbp"><div className="mbp-screen" style={{ backgroundImage: `url(${wall})` }} /><div className="mbp-base" /></div>
      <h2>InukaBook Pro</h2>
      <small>14-inch, 2026</small>
      <dl>{rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      <button className="btn" onClick={() => os.open('settings', { pane: 'about' })}>More Info…</button>
      <p className="legal">™ and © 2026 {profile.name}. All rights reserved.</p>
    </div>
  )
}
