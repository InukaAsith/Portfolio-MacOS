import { useState } from 'react'
import { Glyph } from '../glyphs'
import { profile, education, skills, projects, certificates, socials, whatIDo } from '../data'

function printResume() {
  const src = document.querySelector('.resume-page')
  if (!src) return
  const root = document.createElement('div')
  root.id = 'print-root'
  const copy = src.cloneNode(true)
  copy.style.transform = 'none'
  root.appendChild(copy)
  document.body.appendChild(root)
  const clean = () => { root.remove(); removeEventListener('afterprint', clean) }
  addEventListener('afterprint', clean)
  window.print()
}

export default function Resume() {
  const [zoom, setZoom] = useState(innerWidth < 768 ? 0.5 : 0.85)
  return (
    <div className="app preview">
      <header className="toolbar" data-drag>
        <div className="tb-title left"><b>Resume.pdf</b><small>Page 1 of 1</small></div>
        <div className="tb-actions">
          <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.1).toFixed(2)))} aria-label="Zoom out"><Glyph.zoomOut /></button>
          <button onClick={() => setZoom((z) => Math.min(1.6, +(z + 0.1).toFixed(2)))} aria-label="Zoom in"><Glyph.zoomIn /></button>
          <button onClick={printResume} title="Print or save as PDF" aria-label="Print"><Glyph.print /></button>
        </div>
      </header>
      <div className="pv-canvas scroll">
        <div className="pv-sizer" style={{ width: 794 * zoom, height: 1123 * zoom }}>
          <article className="resume-page" style={{ transform: `scale(${zoom})` }}>
            <header className="rs-head">
              <div>
                <h1>{profile.name}</h1>
                <p className="rs-role">{profile.role}</p>
              </div>
              <ul className="rs-contact">
                <li>{profile.email}</li>
                <li>{profile.phone}</li>
                <li>github.com/{profile.github}</li>
                <li>linkedin.com/in/inukaasith</li>
                <li>{profile.location}</li>
              </ul>
            </header>
            <section>
              <h2>Profile</h2>
              <p>{profile.bio.join(' ')}</p>
            </section>
            <section>
              <h2>Education</h2>
              {education.map((e) => (
                <div key={e.title} className="rs-item">
                  <div className="rs-line"><b>{e.title}</b><span>{e.year}</span></div>
                  <div className="rs-sub">{e.org}</div>
                  <p>{e.text}</p>
                </div>
              ))}
            </section>
            <section>
              <h2>Selected Projects</h2>
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="rs-item">
                  <div className="rs-line"><b>{p.name}</b><span>{p.tags.slice(0, 3).join(' · ')}</span></div>
                  <p>{p.long.split('. ')[0]}. {p.stars > 10 ? `${p.stars}+ stars, ${p.forks}+ forks on GitHub.` : ''}</p>
                </div>
              ))}
            </section>
            <div className="rs-cols">
              <section>
                <h2>Skills</h2>
                {Object.entries(skills).map(([k, v]) => <p key={k}><b>{k}:</b> {v.join(', ')}</p>)}
              </section>
              <section>
                <h2>Certificates & Awards</h2>
                {certificates.map((c) => <p key={c.title}><b>{c.title}</b> ({c.year})</p>)}
                <p><b>GCE A/L Island Rank 101</b>   Mathematics stream (2023)</p>
              </section>
            </div>
            <section>
              <h2>Focus Areas</h2>
              <p>{whatIDo.map((w) => w.title).join(' · ')}</p>
            </section>
            <footer className="rs-foot">{socials.map((s) => s.user).join('  ·  ')}</footer>
          </article>
        </div>
      </div>
    </div>
  )
}
