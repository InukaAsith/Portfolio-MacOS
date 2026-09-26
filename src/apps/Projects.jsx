import { useEffect, useState } from 'react'
import { useOS } from '../os'
import { Glyph } from '../glyphs'
import { projects, techIcons } from '../data'
import { useGitHub } from '../live'
import { Ico } from '../ico'

const CATS = [['All', 'sparkles'], ['Featured', 'star'], ['Biggest Hits', 'flame'], ['Learning', 'flask']]

function useStats() {
  const gh = useGitHub()
  return (p) => {
    const live = gh?.byName[p.repo.split('/')[1].toLowerCase()]
    return live ? { stars: live.stars, forks: live.forks, live: true } : { stars: p.stars, forks: p.forks }
  }
}

function Thumb({ p, big }) {
  return (
    <div className={`pj-thumb${big ? ' big' : ''}`} style={{ background: p.image ? `url(${p.image}) top center/cover` : `radial-gradient(120% 120% at 20% 0%, ${p.color}cc, #101014 70%)` }}>
      {!p.image && <span><Ico n={p.ico} /></span>}
    </div>
  )
}

export default function Projects({ win }) {
  const os = useOS()
  const stats = useStats()
  const [cat, setCat] = useState('All')
  const [open, setOpen] = useState(win.props?.id || null)
  useEffect(() => { if (win.props?.id) setOpen(win.props.id) }, [win.props?.nonce]) // eslint-disable-line
  const list = projects.filter((p) => cat === 'All' || p.category === cat)
  const p = projects.find((x) => x.id === open)
  const total = projects.reduce((a, x) => a + stats(x).stars, 0)

  return (
    <div className="app split">
      <aside className="sidebar" data-drag>
        <div className="sb-group">
          <div className="sb-head">Library</div>
          {CATS.map(([c, e]) => (
            <button key={c} className={`sb-item${cat === c && !open ? ' on' : ''}`} onClick={() => { setCat(c); setOpen(null) }}>
              <span className="sb-ico"><Ico n={e} /></span>{c}<span className="sb-count">{c === 'All' ? projects.length : projects.filter((x) => x.category === c).length}</span>
            </button>
          ))}
        </div>
        <div className="sb-group">
          <div className="sb-head">Repositories</div>
          {projects.map((x) => (
            <button key={x.id} className={`sb-item${open === x.id ? ' on' : ''}`} onClick={() => setOpen(x.id)}><span className="sb-ico"><Ico n={x.ico} /></span>{x.name}</button>
          ))}
        </div>
      </aside>
      <main className="main">
        <header className="toolbar" data-drag>
          <div className="tb-nav"><button disabled={!open} onClick={() => setOpen(null)} aria-label="Back"><Glyph.back /></button></div>
          <div className="tb-title">{p ? p.name : cat === 'All' ? 'All Projects' : cat}</div>
          <div className="tb-actions"><span className="tb-pill"><Glyph.star /> {total} stars</span></div>
        </header>
        <div className="content scroll">
          {!p && (
            <>
              {cat === 'All' && (
                <div className="pj-hero">
                  <div>
                    <h2>Things I’ve built</h2>
                    <p>Telegram bots used by thousands, an Android TV browser, real-time web apps and a few experiments. Most are open source   {total}+ stars and counting.</p>
                  </div>
                  <div className="pj-stack">{techIcons.slice(0, 10).map((t) => <img key={t.name} src={t.src} alt={t.name} title={t.name} />)}</div>
                </div>
              )}
              <div className="pj-grid">
                {list.map((x, i) => {
                  const s = stats(x)
                  return (
                    <button key={x.id} className="pj-card" style={{ '--i': i }} onClick={() => setOpen(x.id)}>
                      <Thumb p={x} />
                      <div className="pj-body">
                        <div className="pj-top"><b>{x.name}</b><span className="pj-cat">{x.category}</span></div>
                        <p>{x.desc}</p>
                        <div className="pj-meta">
                          <span><i className="lang-dot" data-lang={x.lang} />{x.lang}</span>
                          <span><Glyph.star /> {s.stars}</span>
                          <span><Glyph.fork /> {s.forks}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          )}
          {p && (() => {
            const s = stats(p)
            return (
              <article className="pj-detail" key={p.id}>
                <Thumb p={p} big />
                <div className="pj-d-head">
                  <div>
                    <span className="pj-cat">{p.category} · {p.platform}</span>
                    <h1><Ico n={p.ico} /> {p.name}</h1>
                    <p className="lead">{p.desc}</p>
                  </div>
                  <div className="btn-row">
                    {p.live && <button className="btn primary" onClick={() => os.link(p.live)}>Open live site</button>}
                    <button className={`btn${p.live ? '' : ' primary'}`} onClick={() => os.link(`https://github.com/${p.repo}`)}>View on GitHub</button>
                    <button className="btn" onClick={() => os.open('terminal', { run: `cat projects/${p.id}.md` })}>Open in Terminal</button>
                  </div>
                </div>
                <div className="stats">
                  <div className="stat"><span><Ico n="star" /></span><b>{s.stars}</b><small>Stars{s.live ? ' · live' : ''}</small></div>
                  <div className="stat"><span><Ico n="fork" /></span><b>{s.forks}</b><small>Forks</small></div>
                  <div className="stat"><span><Ico n="code" /></span><b>{p.lang}</b><small>Language</small></div>
                  <div className="stat"><span><Ico n="package" /></span><b>{p.platform}</b><small>Platform</small></div>
                </div>
                <h3 className="h-sec">About</h3>
                <p className="prose-p">{p.long}</p>
                <h3 className="h-sec">Built with</h3>
                <div className="chips">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </article>
            )
          })()}
        </div>
      </main>
    </div>
  )
}
