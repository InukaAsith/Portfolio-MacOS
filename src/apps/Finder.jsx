import { useEffect, useState } from 'react'
import { useOS } from '../os'
import { registry } from './registry'
import { AppIcon, Glyph } from '../icons'
import { profile, whatIDo, interests, beyondCode, education, certificates, achievements, projects, socials } from '../data'
import { Ico } from '../ico'

const SECTIONS = [
  ['Favourites', [['about', 'About Me', 'user'], ['education', 'Education', 'cap'], ['achievements', 'Achievements', 'trophy'], ['projects', 'Projects', 'folder'], ['apps', 'Applications', 'compass'], ['docs', 'Documents', 'doc']]],
  ['Locations', [['trash', 'Trash', 'trash']]],
]
const titles = Object.fromEntries(SECTIONS.flatMap(([, l]) => l.map(([id, t]) => [id, t])))

export default function Finder({ win }) {
  const [hist, setHist] = useState([win.props?.section || 'about'])
  const [pos, setPos] = useState(0)
  const [sel, setSel] = useState(null)
  const cur = hist[pos]
  const go = (id) => { if (id === cur) return; setHist((h) => [...h.slice(0, pos + 1), id]); setPos((p) => p + 1); setSel(null) }
  useEffect(() => { if (win.props?.section) go(win.props.section) }, [win.props?.nonce]) // eslint-disable-line

  return (
    <div className="app split">
      <aside className="sidebar" data-drag>
        {SECTIONS.map(([g, list]) => (
          <div key={g} className="sb-group">
            <div className="sb-head">{g}</div>
            {list.map(([id, t, e]) => (
              <button key={id} className={`sb-item${cur === id ? ' on' : ''}`} onClick={() => go(id)}><span className="sb-ico"><Ico n={e} /></span>{t}</button>
            ))}
          </div>
        ))}
        <div className="sb-group">
          <div className="sb-head">Tags</div>
          {[['#ff453a', 'Featured', 'projects'], ['#ff9f0a', 'Hackathons', 'achievements'], ['#30d158', 'Open Source', 'projects'], ['#0a84ff', 'Learning', 'education']].map(([c, t, id]) => (
            <button key={t} className="sb-item" onClick={() => go(id)}><i className="sb-tag" style={{ background: c }} />{t}</button>
          ))}
        </div>
      </aside>
      <main className="main">
        <header className="toolbar" data-drag>
          <div className="tb-nav">
            <button disabled={pos === 0} onClick={() => setPos(pos - 1)} aria-label="Back"><Glyph.back /></button>
            <button disabled={pos >= hist.length - 1} onClick={() => setPos(pos + 1)} aria-label="Forward"><Glyph.fwd /></button>
          </div>
          <div className="tb-title">{titles[cur]}</div>
          <div className="tb-actions hide-sm">
            <span className="tb-seg"><button className="on"><Glyph.grid /></button><button><Glyph.list /></button></span>
          </div>
        </header>
        <div className="content scroll" onPointerDown={(e) => e.target === e.currentTarget && setSel(null)}>
          {cur === 'about' && <About />}
          {cur === 'education' && <Education />}
          {cur === 'achievements' && <Achievements />}
          {cur === 'projects' && <ProjectGrid sel={sel} setSel={setSel} />}
          {cur === 'apps' && <Apps sel={sel} setSel={setSel} />}
          {cur === 'docs' && <Docs sel={sel} setSel={setSel} />}
          {cur === 'trash' && <Trash />}
        </div>
        <footer className="statusbar">{footer(cur)}</footer>
      </main>
    </div>
  )
}

const footer = (cur) => ({
  projects: `${projects.length} items`, apps: `${Object.keys(registry).length} items`, docs: '5 items', trash: 'Trash',
}[cur] || `Macintosh HD › Users › ${profile.handle} › ${titles[cur]}`)

function About() {
  const os = useOS()
  return (
    <div className="about">
      <section className="about-hero">
        <img src={profile.photo} alt={profile.name} />
        <div>
          <span className="pill"><i /> Open to opportunities</span>
          <h1>{profile.name}</h1>
          <p className="role">{profile.role}</p>
          <p className="loc"><Ico n="pin" /> {profile.location} · <Ico n="cap" /> UCSC · <Ico n="mail" /> {profile.email}</p>
          <div className="btn-row">
            <button className="btn primary" onClick={() => os.open('resume')}>View Résumé</button>
            <button className="btn" onClick={() => os.open('mail')}>Contact</button>
            <button className="btn" onClick={() => os.link(socials[0].url)}>GitHub ↗</button>
          </div>
        </div>
      </section>
      <section className="prose">{profile.bio.map((b) => <p key={b}>{b}</p>)}</section>
      <h3 className="h-sec">What I do</h3>
      <div className="cards two">
        {whatIDo.map((w) => <div key={w.title} className="card"><span className="card-emoji"><Ico n={w.ico} /></span><b>{w.title}</b><p>{w.text}</p></div>)}
      </div>
      <h3 className="h-sec">What drives me</h3>
      <div className="cards four">
        {interests.map((w) => <div key={w.title} className="card small"><span className="card-emoji"><Ico n={w.ico} /></span><b>{w.title}</b><p>{w.text}</p></div>)}
      </div>
      <h3 className="h-sec">Beyond code</h3>
      <div className="cards three">
        {beyondCode.map((w) => <div key={w.title} className="card small"><span className="card-emoji"><Ico n={w.ico} /></span><b>{w.title}</b><p>{w.text}</p></div>)}
      </div>
    </div>
  )
}

function Education() {
  return (
    <div className="timeline">
      {education.map((e, i) => (
        <div key={e.title} className="tl-item" style={{ '--i': i }}>
          <span className="tl-dot" />
          <div className="card">
            <span className="tl-year">{e.year}</span>
            <b>{e.title}</b>
            <div className="tl-org">{e.org}</div>
            <p>{e.text}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function Achievements() {
  const os = useOS()
  return (
    <div className="ach">
      <div className="stats">
        {achievements.map((a) => <div key={a.label} className="stat"><span><Ico n={a.ico} /></span><b>{a.value}</b><small>{a.label}</small></div>)}
      </div>
      <h3 className="h-sec">Certificates & competitions</h3>
      <div className="cards two">
        {certificates.map((c) => (
          <div key={c.title} className="card cert">
            <button className="cert-img" onClick={() => os.open('photos', { album: 'Certificates' })}><img src={c.image} alt={c.title} loading="lazy" /></button>
            <span className="tl-year">{c.year} · {c.kind}</span>
            <b>{c.title}</b>
            <p>{c.text}</p>
            <a href={c.url} target="_blank" rel="noreferrer">View credential ↗</a>
          </div>
        ))}
      </div>
      <div className="card highlight"><Ico n="medal" /> <b>GCE A/L   Island Rank 101</b> · 3 A’s in the Mathematics stream (2023)</div>
    </div>
  )
}

function IconGrid({ items, sel, setSel }) {
  return (
    <div className="icon-grid">
      {items.map((it) => (
        <button key={it.id} className={`grid-item${sel === it.id ? ' sel' : ''}`} onClick={() => (innerWidth < 768 ? it.open() : setSel(it.id))} onDoubleClick={it.open}>
          {it.icon}
          <span>{it.label}</span>
        </button>
      ))}
    </div>
  )
}

function ProjectGrid(p) {
  const os = useOS()
  return <IconGrid {...p} items={projects.map((x) => ({ id: x.id, label: x.name, icon: <span className="folder-ico"><AppIcon id="folder" /><em><Ico n={x.ico} /></em></span>, open: () => os.open('projects', { id: x.id }) }))} />
}

function Apps(p) {
  const os = useOS()
  return <IconGrid {...p} items={Object.keys(registry).filter((k) => k !== 'about').map((id) => ({ id, label: registry[id].title, icon: <AppIcon id={id} />, open: () => os.open(id) }))} />
}

function Docs(p) {
  const os = useOS()
  const items = [
    { id: 'resume', label: 'Resume.pdf', icon: <AppIcon id="pdf" />, open: () => os.open('resume') },
    { id: 'cs50', label: 'CS50x.png', icon: <img className="thumb" src="/img/certificate.webp" alt="" loading="lazy" />, open: () => os.open('photos', { album: 'Certificates' }) },
    { id: 'ieee', label: 'IEEEXtreme.png', icon: <img className="thumb" src="/img/IEEXtreme.webp" alt="" loading="lazy" />, open: () => os.open('photos', { album: 'Certificates' }) },
    { id: 'skills', label: 'skills.json', icon: <AppIcon id="vscode" />, open: () => os.open('vscode', { file: 'skills.json' }) },
    { id: 'notes', label: 'about.txt', icon: <AppIcon id="notes" />, open: () => os.open('notes') },
  ]
  return <IconGrid {...p} items={items} />
}

function Trash() {
  const [empty, setEmpty] = useState(false)
  const junk = ['old_portfolio_v1.html', 'bugs_fixed_at_3am.txt', 'sleep_schedule.pdf', 'node_modules (2.3 GB)', 'final_FINAL_v7.py']
  if (empty) return <div className="empty-state"><AppIcon id="trash" /><p>Trash is empty</p></div>
  return (
    <>
      <div className="trash-bar"><span>Items in the Trash are gone for good once you empty it. (They were bad anyway.)</span><button className="btn small" onClick={() => setEmpty(true)}>Empty</button></div>
      <div className="icon-grid">
        {junk.map((j) => <div key={j} className="grid-item"><AppIcon id={j.includes('node') ? 'folder' : 'pdf'} /><span>{j}</span></div>)}
      </div>
    </>
  )
}
