import { useEffect, useRef, useState } from 'react'
import { useOS, isMobile } from '../os'
import { Glyph, AppIcon } from '../icons'
import { projects, certificates } from '../data'
import { Ico } from '../ico'

export const HOME_URL = 'https://inukaasith.vercel.app/'
// Portfolio v1 ships inside this site (public/v1) so it opens instantly; everything else goes
// through the sandboxed proxy so sites that refuse framing still render.
const resolve = (u) => {
  try {
    const x = new URL(u)
    if (x.hostname === 'inukaasith.vercel.app') return `/v1${x.pathname === '/' ? '/index.html' : x.pathname}${x.search}${x.hash}`
    // Google allows itself to be framed in "igu" mode   load it directly from the visitor's browser
    if (isGoogle(x)) { x.searchParams.set('igu', '1'); return x.href }
  } catch { /* not a url */ }
  return `/api/proxy?url=${encodeURIComponent(u)}`
}
const isGoogle = (x) => /(^|\.)google\.[a-z.]+$/.test(x.hostname)
const direct = (u) => { try { return isGoogle(new URL(u)) } catch { return false } }
const googleSearch = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`

const FAVS = [
  { title: 'Portfolio v1', url: HOME_URL, icon: <AppIcon id="about" /> },
  { title: 'v1 Source', url: 'https://github.com/InukaAsith/MyPortfolio', icon: <span className="fav-letter" style={{ background: '#24292f' }}>{'</>'}</span> },
  { title: 'GitHub', url: 'https://github.com/InukaAsith', icon: <AppIcon id="github" /> },
  { title: 'LinkedIn ↗', url: 'https://linkedin.com/in/inukaasith', icon: <AppIcon id="linkedin" /> },
  { title: 'Instagram ↗', url: 'https://instagram.com/inukaasith7', icon: <AppIcon id="instagram" /> },
  { title: 'CS50x', url: certificates[0].url, app: ['finder', { section: 'achievements' }], icon: <span className="fav-letter" style={{ background: '#a51c30' }}>50</span> },
  { title: 'IEEEXtreme', url: certificates[1].url, app: ['finder', { section: 'achievements' }], icon: <span className="fav-letter" style={{ background: '#00629b' }}>IE</span> },
  { title: 'Golden Gate', url: 'https://en.wikipedia.org/wiki/Golden_Gate_Bridge', icon: <span className="fav-letter" style={{ background: '#c0362c' }}>W</span> },
]

const normalize = (v) => {
  const s = (v || '').trim()
  if (!s) return null
  if (s === 'home') return s
  if (/^https?:\/\//i.test(s)) return s
  if (/^[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/.test(s)) return `https://${s}`
  return googleSearch(s)
}
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, '') } catch { return u } }
const SOCIAL = /^https?:\/\/([\w-]+\.)*(linkedin|instagram|x|twitter|facebook|youtube)\.com\b/i
const hue = (s) => [...s].reduce((a, c) => a + c.charCodeAt(0), 0) % 360

let tid = 0
const makeTab = (url) => ({ id: ++tid, stack: [url], i: 0, title: null, loading: url.startsWith('http'), reload: 0, away: false })

export default function SafariApp(props) {
  return isMobile() ? <MobileSafari /> : <Safari {...props} />
}

// Phones: no in-app browsing — a start page whose links open in the real browser
function MobileSafari() {
  const os = useOS()
  const [q, setQ] = useState('')
  const out = (u) => { const n = normalize(u); if (n && n !== 'home') os.external(n) }
  return (
    <div className="app safari">
      <header className="toolbar sf-bar">
        <form className="sf-url" onSubmit={(e) => { e.preventDefault(); out(q) }}>
          <Glyph.search />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search Google or enter website" enterKeyHint="go" aria-label="Address" />
        </form>
      </header>
      <p className="sf-note">Searches and websites open in Google / your browser.</p>
      <div className="sf-page"><StartPage nav={out} mobile /></div>
    </div>
  )
}

function Safari({ win }) {
  const os = useOS()
  const [tabs, setTabs] = useState(() => [makeTab(normalize(win.props?.url) || HOME_URL)])
  const [active, setActive] = useState(() => tabs[0].id)
  const [field, setField] = useState('')
  const [editing, setEditing] = useState(false)
  const frames = useRef({})
  const handled = useRef(win.props?.nonce)
  const tab = tabs.find((t) => t.id === active) || tabs[0]
  const url = tab.stack[tab.i]

  const upd = (id, fn) => setTabs((ts) => ts.map((t) => (t.id === id ? { ...t, ...fn(t) } : t)))
  const nav = (u, id = active) => {
    const n = normalize(u)
    if (!n) return
    if (SOCIAL.test(n)) { os.external(n); return } // social profiles (not GitHub) open in the real browser
    upd(id, (t) => ({ stack: [...t.stack.slice(0, t.i + 1), n], i: t.i + 1, loading: n.startsWith('http'), title: null, away: false }))
    setEditing(false)
  }
  const loads = useRef({})
  // Back from a page opened *inside* a directly framed site (e.g. a Google result) returns to that site's page
  const go = (d) => upd(active, (t) => (d < 0 && t.away
    ? { reload: t.reload + 1, away: false, loading: true }
    : { i: Math.min(t.stack.length - 1, Math.max(0, t.i + d)), loading: t.stack[t.i + d]?.startsWith('http'), away: false }))
  const openTab = (u) => { const t = makeTab(normalize(u) || 'home'); setTabs((ts) => [...ts, t]); setActive(t.id) }
  const closeTab = (id, e) => {
    e?.stopPropagation()
    if (tabs.length === 1) return os.close(win.id)
    const idx = tabs.findIndex((t) => t.id === id)
    const rest = tabs.filter((t) => t.id !== id)
    setTabs(rest)
    if (id === active) setActive(rest[Math.max(0, idx - 1)].id)
  }

  // links opened from elsewhere in the OS arrive as props → new tab
  useEffect(() => {
    if (win.props?.nonce === handled.current) return
    handled.current = win.props?.nonce
    if (win.props?.url) openTab(win.props.url)
  }, [win.props?.nonce]) // eslint-disable-line

  // messages from proxied pages (link clicks, title)
  useEffect(() => {
    const h = (e) => {
      const d = e.data
      if (!d || !d.__safari) return
      const t = tabs.find((x) => frames.current[x.id]?.contentWindow === e.source)
      if (!t) return
      if (d.__safari === 'nav') nav(d.url, t.id)
      else if (d.__safari === 'newtab') openTab(d.url)
      else if (d.__safari === 'loaded') upd(t.id, () => ({ title: d.title || null, loading: false }))
    }
    addEventListener('message', h)
    return () => removeEventListener('message', h)
  }, [tabs]) // eslint-disable-line

  useEffect(() => { if (!editing) setField(url === 'home' ? '' : url) }, [url, editing])

  const query = (u) => { try { const x = new URL(u); return isGoogle(x) && x.searchParams.get('q') } catch { return null } }
  const label = (t) => { const u = t.stack[t.i]; return u === 'home' ? 'Start Page' : query(u) ? `${query(u)} - Google Search` : t.title || host(u) }
  const display = url === 'home' ? '' : query(url) || host(url)
  const web = url.startsWith('http')

  return (
    <div className="app safari">
      <header className="toolbar sf-bar" data-drag>
        <div className="tb-nav">
          <button disabled={tab.i === 0 && !tab.away} onClick={() => go(-1)} aria-label="Back"><Glyph.back /></button>
          <button disabled={tab.i >= tab.stack.length - 1} onClick={() => go(1)} aria-label="Forward"><Glyph.fwd /></button>
        </div>
        <form className="sf-url" onSubmit={(e) => { e.preventDefault(); nav(field) }} data-nodrag>
          {!editing && web && <Glyph.lock />}
          {!editing && !web && <Glyph.search />}
          <input
            value={editing ? field : display}
            placeholder="Search Google or enter website name"
            onFocus={(e) => { setEditing(true); setField(url === 'home' ? '' : query(url) || url); setTimeout(() => e.target.select()) }}
            onBlur={() => setTimeout(() => setEditing(false), 150)}
            onChange={(e) => setField(e.target.value)}
            spellCheck={false}
            aria-label="Address"
          />
          {web && !editing && <button type="button" onClick={() => upd(active, (t) => ({ reload: t.reload + 1, loading: true }))} aria-label="Reload"><Glyph.reload /></button>}
          {tab.loading && <i className="sf-progress" key={`${tab.id}${url}${tab.reload}`} />}
        </form>
        <button className="sf-out" disabled={!web} onClick={() => os.external(url)} title="Open this page in your real browser">
          <Glyph.ext /><span>Open in browser</span>
        </button>
        <div className="tb-actions">
          <button onClick={() => openTab('home')} title="New Tab" aria-label="New tab"><Glyph.plus /></button>
        </div>
      </header>
      {tabs.length > 1 && (
        <div className="sf-tabs">
          {tabs.map((t) => {
            const h = host(t.stack[t.i])
            return (
              <button key={t.id} className={`sf-tab${t.id === active ? ' on' : ''}`} onClick={() => setActive(t.id)} title={label(t)}>
                <span className="sf-tab-x" onClick={(e) => closeTab(t.id, e)} role="button" aria-label="Close tab">×</span>
                <i className="sf-fav" style={{ background: t.stack[t.i] === 'home' ? 'var(--accent)' : `hsl(${hue(h)} 60% 48%)` }}>{t.stack[t.i] === 'home' ? '★' : h[0]?.toUpperCase()}</i>
                <span className="sf-tab-t">{label(t)}</span>
              </button>
            )
          })}
        </div>
      )}
      <div className="sf-page">
        {tabs.map((t) => {
          const u = t.stack[t.i]
          return (
            <div key={t.id} className="sf-view" style={{ display: t.id === active ? 'block' : 'none' }}>
              {u === 'home' && <StartPage nav={(x) => nav(x, t.id)} />}
              {u.startsWith('http') && (
                <iframe
                  key={`${u}#${t.reload}`}
                  ref={(el) => { frames.current[t.id] = el }}
                  src={resolve(u)}
                  title={label(t)}
                  onLoad={() => {
                    const k = `${t.id}${u}${t.reload}`
                    loads.current[k] = (loads.current[k] || 0) + 1
                    upd(t.id, () => ({ loading: false, away: direct(u) && loads.current[k] > 1 }))
                  }}
                  sandbox={`allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox${direct(u) ? ' allow-same-origin' : ''}`}
                  referrerPolicy="no-referrer"
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StartPage({ nav, mobile }) {
  const os = useOS()
  const h = new Date().getHours()
  const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening'
  return (
    <div className="sf-start scroll">
      <div className="sf-inner">
        <h2>{greet} <Ico n="wave" /></h2>
        <h4>Favourites</h4>
        <div className="sf-favs">
          {FAVS.filter((f) => !mobile || f.url !== HOME_URL).map((f) => (
            <button key={f.title} onClick={() => (mobile && f.app ? os.open(...f.app) : nav(f.url))}>
              <span className="fav-ico">{f.icon}</span>
              <span>{f.title}</span>
            </button>
          ))}
        </div>
        <h4>Frequently Visited</h4>
        <div className="sf-freq">
          {projects.slice(0, 4).map((p) => (
            <button key={p.id} onClick={() => (mobile ? os.open('projects', { id: p.id }) : nav(`https://github.com/${p.repo}`))} className="sf-card">
              <span className="sf-thumb" style={{ background: p.image ? `url(${p.image}) center/cover` : `linear-gradient(135deg, ${p.color || '#555'}, #111)` }}>{!p.image && <Ico n={p.ico} />}</span>
              <b>{p.name}</b>
              <small>github.com/{p.repo}</small>
            </button>
          ))}
        </div>
        <h4>Privacy Report</h4>
        <div className="sf-privacy card">
          <span className="sf-shield"><Ico n="shield" /></span>
          <div><b>0 trackers</b> on this site: no analytics, no cookies.{mobile ? ' ' : ' Pages you visit here are fetched privately and sandboxed. '}<button className="linkish" onClick={() => os.open('projects')}>See my projects →</button></div>
        </div>
      </div>
    </div>
  )
}
