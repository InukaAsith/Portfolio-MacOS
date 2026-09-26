import { useEffect, useState } from 'react'
import { useOS } from '../os'
import { profile, skills, projects, socials, education } from '../data'
import { Ico } from '../ico'

const FILES = {
  'README.md': {
    lang: 'md',
    text: `# Hi, I'm ${profile.first}

> ${profile.tagline}

${profile.bio.join('\n\n')}

## Quick links
- GitHub: https://github.com/${profile.github}
- LinkedIn: https://linkedin.com/in/inukaasith
- Email: ${profile.email}

## Try this
Open \`about.py\` and hit ▶ Run.`,
  },
  'about.py': {
    lang: 'py',
    text: `class Inuka:
    """${profile.role}"""

    def __init__(self):
        self.name = "${profile.name}"
        self.university = "${education[0].org}"
        self.degree = "${education[0].title}"
        self.location = "${profile.location}"
        self.languages = ${JSON.stringify(skills.Programming)}
        self.frameworks = ${JSON.stringify(skills.Backend.slice(0, 3))}
        self.hobbies = ["movies", "reading", "gaming"]

    def say_hi(self):
        return "${profile.tagline}!"


if __name__ == "__main__":
    me = Inuka()
    print(me.say_hi())`,
  },
  'skills.json': { lang: 'json', text: JSON.stringify(skills, null, 2) },
  'projects.js': {
    lang: 'js',
    text: `// ${projects.length} projects   open the Projects app for the full story
export const projects = [
${projects.map((p) => `  { name: '${p.name}', stack: ${JSON.stringify(p.tags.slice(0, 3)).replace(/"/g, "'")}, stars: ${p.stars} },`).join('\n')}
]

export const favourite = projects.find((p) => p.name === 'DaisyXMusic') // 800+ forks`,
  },
  'contact.sh': {
    lang: 'sh',
    text: `#!/usr/bin/env zsh
# ping me   I usually reply within a day

${socials.map((s) => `echo "${s.label.padEnd(10)} → ${s.url.replace('mailto:', '')}"`).join('\n')}`,
  },
}

const RX = /(#(?!!).*$|\/\/.*$|""".*?"""|#!.*$)|("(?:[^"\\]|\\.)*"(?=\s*:))|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`)|\b(\d+(?:\.\d+)?)\b|\b(class|def|return|self|import|from|export|const|let|function|true|false|null|None|True|False|if|else|for|in|new|async|await|echo|print)\b|(\b[A-Za-z_]\w*(?=\())/g

function highlight(line, lang) {
  if (lang === 'md') {
    if (/^#{1,6} /.test(line)) return <span className="tk-h">{line}</span>
    if (/^> /.test(line)) return <span className="tk-c">{line}</span>
    const parts = line.split(/(`[^`]+`|https?:\/\/\S+)/)
    return parts.map((p, i) => (p.startsWith('`') ? <span key={i} className="tk-s">{p}</span> : p.startsWith('http') ? <span key={i} className="tk-l">{p}</span> : p.startsWith('- ') ? <span key={i}><span className="tk-k">-</span>{p.slice(1)}</span> : p))
  }
  const out = []
  let last = 0, m
  RX.lastIndex = 0
  while ((m = RX.exec(line))) {
    if (m.index > last) out.push(line.slice(last, m.index))
    const cls = m[1] ? 'tk-c' : m[2] ? 'tk-key' : m[3] ? 'tk-s' : m[4] ? 'tk-n' : m[5] ? 'tk-k' : 'tk-f'
    out.push(<span key={m.index} className={cls}>{m[0]}</span>)
    last = m.index + m[0].length
    if (!m[0].length) RX.lastIndex++
  }
  if (last < line.length) out.push(line.slice(last))
  return out
}

const ICON = { md: ['M↓', '#519aba'], py: ['py', '#ffd43b'], json: ['{}', '#cbcb41'], js: ['JS', '#f1e05a'], sh: ['$_', '#89e051'] }

export default function VSCode({ win }) {
  const os = useOS()
  const [tabs, setTabs] = useState(['README.md', win.props?.file].filter((f, i, a) => f && a.indexOf(f) === i))
  const [active, setActive] = useState(win.props?.file || 'README.md')
  const [cur, setCur] = useState(0)
  useEffect(() => {
    const f = win.props?.file
    if (f) { setTabs((t) => (t.includes(f) ? t : [...t, f])); setActive(f) }
  }, [win.props?.nonce]) // eslint-disable-line
  const open = (f) => { setTabs((t) => (t.includes(f) ? t : [...t, f])); setActive(f); setCur(0) }
  const close = (f, e) => {
    e.stopPropagation()
    const rest = tabs.filter((t) => t !== f)
    setTabs(rest)
    if (active === f) setActive(rest[rest.length - 1] || null)
  }
  const file = FILES[active]
  const lines = file ? file.text.split('\n') : []

  return (
    <div className="app vscode">
      <div className="vs-title" data-drag>{active ? `${active}   portfolio` : 'portfolio'}   Visual Studio Code</div>
      <div className="vs-main">
        <nav className="vs-activity">
          {['files', 'search', 'branch', 'play', 'extensions'].map((g, i) => <span key={g} className={i === 0 ? 'on' : ''}><Ico n={g} /></span>)}
        </nav>
        <aside className="vs-explorer">
          <div className="vs-head">EXPLORER</div>
          <div className="vs-folder">⌄ PORTFOLIO</div>
          {Object.keys(FILES).map((f) => {
            const [g, c] = ICON[FILES[f].lang]
            return <button key={f} className={`vs-file${active === f ? ' on' : ''}`} onClick={() => open(f)}><i style={{ color: c }}>{g}</i>{f}</button>
          })}
        </aside>
        <section className="vs-editor">
          <div className="vs-tabs">
            {tabs.map((t) => (
              <button key={t} className={`vs-tab${t === active ? ' on' : ''}`} onClick={() => setActive(t)}>
                <i style={{ color: ICON[FILES[t].lang][1] }}>{ICON[FILES[t].lang][0]}</i>{t}<span onClick={(e) => close(t, e)}>×</span>
              </button>
            ))}
            {active === 'about.py' && <button className="vs-run" onClick={() => os.open('terminal', { run: 'python3 about.py' })} title="Run Python File">▶ Run</button>}
          </div>
          {file ? (
            <div className="vs-code scroll">
              <div className="vs-crumbs">portfolio › {active}</div>
              {lines.map((l, i) => (
                <div key={i} className={`vs-ln${cur === i ? ' cur' : ''}`} onClick={() => setCur(i)}>
                  <span className="vs-no">{i + 1}</span>
                  <span className="vs-tx">{highlight(l, file.lang)}{'​'}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="vs-empty"><div className="vs-logo">⌘</div><p>Open a file from the Explorer</p></div>
          )}
        </section>
      </div>
      <footer className="vs-status">
        <span>⑂ main</span><span>✓ 0 problems</span>
        <span className="sp" />
        <span>Ln {cur + 1}, Col 1</span><span>Spaces: 2</span><span>UTF-8</span><span>{file ? { md: 'Markdown', py: 'Python', json: 'JSON', js: 'JavaScript', sh: 'Shell Script' }[file.lang] : ''}</span>
      </footer>
    </div>
  )
}
