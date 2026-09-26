import { useEffect, useRef, useState } from 'react'
import { useOS, uptime, isMobile } from '../os'
import { registry } from './registry'
import { profile, projects, skills, education, certificates, socials } from '../data'
import { getWeather } from '../live'
import { Ico } from '../ico'

const HOST = 'macbook'
const C = ({ c, children }) => <span className={`t-${c}`}>{children}</span>

const files = {
  'about.txt': () => profile.bio.join('\n\n'),
  'skills.json': () => JSON.stringify(skills, null, 2),
  'education.md': () => education.map((e) => `## ${e.title} (${e.year})\n${e.org}\n${e.text}`).join('\n\n'),
  'contact.vcf': () => `BEGIN:VCARD\nFN:${profile.name}\nEMAIL:${profile.email}\nTEL:${profile.phone}\nURL:https://github.com/${profile.github}\nEND:VCARD`,
  'resume.pdf': null,
  '.secret': () => 'You found it.\nThe real secret: run `hire` and say hi.',
}
const projFiles = Object.fromEntries(projects.map((p) => [`${p.id}.md`, () => `# ${p.name}  ★ ${p.stars}  ⑂ ${p.forks}\n${p.long}\n\nstack: ${p.tags.join(', ')}\nrepo:  https://github.com/${p.repo}`]))

const fortunes = [
  'Talk is cheap. Show me the code.   Linus Torvalds',
  'First, solve the problem. Then, write the code.   John Johnson',
  'It works on my machine.   every developer, ever',
  'Simplicity is prerequisite for reliability.   Edsger Dijkstra',
  "There are only two hard things in CS: cache invalidation, naming things, and off-by-one errors.",
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.   Martin Fowler',
]

const COMMANDS = ['help', 'about', 'whoami', 'neofetch', 'skills', 'projects', 'education', 'certs', 'contact', 'socials', 'resume', 'open', 'github', 'linkedin', 'instagram', 'google', 'mail', 'hire', 'ls', 'cd', 'pwd', 'cat', 'echo', 'date', 'uname', 'uptime', 'history', 'clear', 'exit', 'theme', 'wallpaper', 'weather', 'cowsay', 'fortune', 'cmatrix', 'sl', 'banner', 'sudo', 'lock', 'reboot', 'shutdown', 'vim', 'rm']

// tap-to-run commands (shown on phones, where typing is a pain)
const QUICK = ['help', 'about', 'projects', 'skills', 'education', 'certs', 'contact', 'neofetch', 'resume', 'weather', 'cowsay', 'cmatrix', 'clear']

const LOGO = [
  ['g', '        ██╗ █████╗ '],
  ['y', '        ██║██╔══██╗'],
  ['o', '        ██║███████║'],
  ['r', '        ██║██╔══██║'],
  ['p', '        ██║██║  ██║'],
  ['b', '        ╚═╝╚═╝  ╚═╝'],
]

export default function Terminal({ win, power }) {
  const os = useOS()
  const [lines, setLines] = useState(() => [
    { k: 0, node: <span className="t-dim">Last login: {new Date(Date.now() - 36e5 * 7).toString().slice(0, 24)} on ttys000</span> },
    { k: 1, node: <span>Welcome to <C c="y">InukaOS</C>. Type <C c="g">help</C> to see what I can do, or <C c="g">neofetch</C> to say hi.</span> },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState([])
  const [hi, setHi] = useState(-1)
  const [cwd, setCwd] = useState('~')
  const [fx, setFx] = useState(null)
  const bodyRef = useRef(null)
  const inRef = useRef(null)
  const key = useRef(2)

  const push = (...nodes) => setLines((l) => [...l, ...nodes.map((node) => ({ k: key.current++, node }))])

  useEffect(() => { bodyRef.current.scrollTop = bodyRef.current.scrollHeight }, [lines, fx])
  useEffect(() => { if (os.focused === win.id && !isMobile()) inRef.current?.focus({ preventScroll: true }) }, [os.focused, win.id])
  useEffect(() => { if (win.props?.run) run(win.props.run) }, [win.props?.nonce]) // eslint-disable-line

  const suggestion = (() => {
    if (!input) return ''
    const [cmd, ...rest] = input.split(' ')
    if (!rest.length) return COMMANDS.find((c) => c.startsWith(cmd) && c !== cmd)?.slice(cmd.length) || hist.find((h) => h.startsWith(input) && h !== input)?.slice(input.length) || ''
    const last = rest[rest.length - 1]
    const pool = cmd === 'open' ? [...Object.keys(registry), ...Object.keys(files)] : cwd === '~' ? [...Object.keys(files), 'projects/'] : Object.keys(projFiles)
    const m = last && pool.find((f) => f.startsWith(last) && f !== last)
    return m ? m.slice(last.length) : ''
  })()

  const prompt = (dir = cwd) => (
    <span className="t-prompt"><C c="g">{profile.handle}@{HOST}</C> <C c="b">{dir}</C> <C c="w">%</C> </span>
  )

  function cat(name) {
    if (!name) return push(<span className="t-r">usage: cat &lt;file&gt;</span>)
    const clean = name.replace(/^~\//, '').replace(/^\.\//, '')
    const inProj = cwd === '~/projects' || clean.startsWith('projects/')
    const f = inProj ? projFiles[clean.replace('projects/', '')] : files[clean]
    if (clean === 'resume.pdf') return push(<span>resume.pdf is a binary file   opening it in Preview…</span>), os.open('resume')
    if (!f) return push(<span className="t-r">cat: {name}: No such file or directory</span>)
    push(<pre className="t-pre">{f()}</pre>)
  }

  function openThing(arg) {
    if (!arg) return push(<span className="t-r">usage: open &lt;app | file | url&gt;  e.g. open safari</span>)
    const a = arg.toLowerCase().replace(/\.app$/, '')
    const alias = { code: 'vscode', 'vs': 'vscode', settings: 'settings', preferences: 'settings', calc: 'calculator', browser: 'safari', about: 'finder', 'resume.pdf': 'resume', cv: 'resume' }
    const id = alias[a] || Object.keys(registry).find((k) => k === a || registry[k].title.toLowerCase() === a)
    if (id) { os.open(id); return push(<span className="t-dim">Opening {registry[id].title}…</span>) }
    if (/^(https?:\/\/|www\.)|\.[a-z]{2,}(\/|$)/i.test(arg)) { os.open('safari', { url: arg }); return push(<span className="t-dim">Opening {arg} in Safari…</span>) }
    if (files[a] !== undefined) return cat(a)
    push(<span className="t-r">The file {arg} does not exist.</span>)
  }

  async function run(raw) {
    const cmdline = raw.trim()
    push(<span>{prompt()}{raw}</span>)
    if (!cmdline) return
    setHist((h) => [cmdline, ...h.filter((x) => x !== cmdline)].slice(0, 50))
    const [cmd0, ...args] = cmdline.split(/\s+/)
    const cmd = cmd0.toLowerCase()
    const arg = args.join(' ')

    switch (cmd) {
      case 'help':
        return push(<Help />)
      case 'about': case 'bio':
        return cat('about.txt')
      case 'whoami':
        return push(<span>{profile.handle}   {profile.name}, {profile.role}</span>)
      case 'neofetch': case 'fastfetch':
        return push(<Neofetch os={os} />)
      case 'skills':
        return push(<div>{Object.entries(skills).map(([k, v]) => <div key={k}><C c="y">{k.padEnd(12)}</C> {v.map((s) => <span key={s} className="t-chip">{s}</span>)}</div>)}</div>)
      case 'projects': case 'project':
        if (arg) { const p = projects.find((x) => x.id === arg.toLowerCase() || x.name.toLowerCase() === arg.toLowerCase()); if (p) { os.open('projects', { id: p.id }); return push(<span className="t-dim">Opening {p.name}…</span>) } }
        return push(<div>{projects.map((p) => (
          <div key={p.id}><C c="c"><Ico n={p.ico} /> {p.name.padEnd(18)}</C><C c="y">★{String(p.stars).padStart(4)}</C> <C c="p">⑂{String(p.forks).padStart(4)}</C>  <span className="t-dim">{p.desc}</span></div>
        ))}<div className="t-dim" style={{ marginTop: 6 }}>Tip: `project daisyx` opens details · `open projects` for the app</div></div>)
      case 'education': case 'journey':
        return push(<div>{education.map((e) => <div key={e.title}><C c="y">{e.year.padEnd(16)}</C><b>{e.title}</b> <span className="t-dim">— {e.org}</span></div>)}</div>)
      case 'certs': case 'certifications': case 'achievements':
        return push(<div>{certificates.map((c) => <div key={c.title}><C c="g">✔</C> <b>{c.title}</b> <span className="t-dim">({c.year})</span> <a href={c.url} target="_blank" rel="noreferrer">view ↗</a></div>)}<div><C c="y">★</C> <b>Island Rank 101</b> <span className="t-dim">— GCE A/L Maths stream</span></div></div>)
      case 'contact':
        return push(<div><div><C c="c">email </C> <a href={`mailto:${profile.email}`}>{profile.email}</a></div><div><C c="c">phone </C> {profile.phone}</div>{socials.filter((s) => s.id !== 'email').map((s) => <div key={s.id}><C c="c">{s.id.padEnd(9)}</C> <a href={s.url} target="_blank" rel="noreferrer">{s.url.replace('https://', '')}</a></div>)}</div>)
      case 'socials':
        return push(<div>{socials.map((s) => <div key={s.id}><C c="c">{s.label.padEnd(10)}</C> <a href={s.url} target="_blank" rel="noreferrer">{s.user}</a></div>)}</div>)
      case 'github': case 'linkedin': case 'instagram': {
        const s = socials.find((x) => x.id === cmd)
        os.link(s.url)
        return push(<span className="t-dim">Opening {s.url}…</span>)
      }
      case 'google': case 'search':
        if (!arg) return push(<span className="t-r">usage: google &lt;query&gt;</span>)
        os.link(`https://www.google.com/search?q=${encodeURIComponent(arg)}`)
        return push(<span className="t-dim">Searching Google for “{arg}” in Safari…</span>)
      case 'mail': case 'email':
        os.open('mail')
        return push(<span className="t-dim">Opening Mail…</span>)
      case 'hire':
        os.open('mail', { subject: "Let's work together", body: `Hi ${profile.first},\n\nI came across your portfolio and would love to chat about…` })
        return push(<span><C c="g">❤</C> Great choice. Drafting an email to {profile.first}…</span>)
      case 'resume': case 'cv':
        os.open('resume')
        return push(<span className="t-dim">Opening resume.pdf in Preview…</span>)
      case 'open':
        return openThing(arg)
      case 'ls': {
        const all = args.includes('-a') || args.includes('-la') || args.includes('-al')
        const target = args.filter((x) => !x.startsWith('-'))[0]
        if ((target || '').replace(/\/$/, '') === 'projects' || (cwd === '~/projects' && !target)) return push(<div className="t-ls">{Object.keys(projFiles).map((f) => <span key={f}>{f}</span>)}</div>)
        return push(<div className="t-ls"><span className="t-b">projects/</span>{Object.keys(files).filter((f) => all || !f.startsWith('.')).map((f) => <span key={f}>{f}</span>)}</div>)
      }
      case 'cd': {
        const t = (arg || '~').replace(/\/$/, '')
        if (['~', '..', '/', '~/'].includes(t) || t === '') return setCwd('~')
        if (t === 'projects' || t === '~/projects') return setCwd('~/projects')
        return push(<span className="t-r">cd: no such file or directory: {arg}</span>)
      }
      case 'pwd':
        return push(<span>{cwd.replace('~', `/Users/${profile.handle}`)}</span>)
      case 'cat': case 'less': case 'more':
        return cat(args[0])
      case 'echo':
        return push(<span>{arg}</span>)
      case 'date':
        return push(<span>{new Date().toString()}</span>)
      case 'uname':
        return push(<span>{args.includes('-a') ? `InukaOS ${HOST} 26.0.0 Darwin Kernel Version 26.0.0: Golden Gate; RELEASE_ARM64 arm64` : 'Darwin'}</span>)
      case 'uptime':
        return push(<span>up {uptime(os.bootTime)}, 1 user, load averages: 1.42 1.37 1.21</span>)
      case 'history':
        return push(<div>{[...hist].reverse().map((h, i) => <div key={i}><span className="t-dim">{String(i + 1).padStart(4)}</span>  {h}</div>)}<div><span className="t-dim">{String(hist.length + 1).padStart(4)}</span>  history</div></div>)
      case 'clear': case 'cls':
        return setLines([])
      case 'exit': case 'logout':
        return os.close(win.id)
      case 'theme': {
        const t = ['dark', 'light', 'auto'].includes(args[0]) ? args[0] : os.dark ? 'light' : 'dark'
        os.set({ theme: t })
        return push(<span>Appearance set to <C c="y">{t}</C>.</span>)
      }
      case 'wallpaper': {
        const ids = ['dynamic', 'sunset', 'night', 'sequoia', 'graphite']
        if (!ids.includes(args[0])) return push(<span>usage: wallpaper {'<'}{ids.join(' | ')}{'>'}</span>)
        os.set({ wallpaper: args[0] })
        return push(<span>Wallpaper set to <C c="y">{args[0]}</C>.</span>)
      }
      case 'weather': {
        push(<span className="t-dim">Fetching weather for Colombo…</span>)
        try {
          const w = await getWeather()
          return push(<span><Ico n={w.icon} />  <b>{w.temp}°C</b> {w.label} · feels {w.feels}° · <Ico n="droplet" /> {w.humidity}% · <Ico n="wind" /> {w.wind} km/h <span className="t-dim">(Colombo, live)</span></span>)
        } catch { return push(<span className="t-r">weather: network unreachable</span>) }
      }
      case 'cowsay': {
        const msg = arg || 'Hire Inuka!'
        const bar = '─'.repeat(msg.length + 2)
        return push(<pre className="t-pre">{` ╭${bar}╮\n │ ${msg} │\n ╰${bar}╯\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`}</pre>)
      }
      case 'fortune':
        return push(<span className="t-y">{fortunes[Math.floor(Math.random() * fortunes.length)]}</span>)
      case 'banner': case 'figlet':
        return push(<pre className="t-pre t-banner">{`██╗███╗   ██╗██╗   ██╗██╗  ██╗ █████╗ \n██║████╗  ██║██║   ██║██║ ██╔╝██╔══██╗\n██║██╔██╗ ██║██║   ██║█████╔╝ ███████║\n██║██║╚██╗██║██║   ██║██╔═██╗ ██╔══██║\n██║██║ ╚████║╚██████╔╝██║  ██╗██║  ██║\n╚═╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝`}</pre>)
      case 'cmatrix': case 'matrix':
        return setFx('matrix')
      case 'sl':
        setFx('sl')
        return setTimeout(() => setFx(null), 5200)
      case 'sudo':
        if (args[0] === 'hire') return run('hire')
        return push(<span className="t-r">{profile.handle} is not in the sudoers file. This incident will be reported.</span>)
      case 'rm':
        if (arg.includes('-rf')) return push(<span className="t-r">Nice try. This portfolio is protected by SIP (Silly Intrusion Prevention).</span>)
        return push(<span className="t-r">rm: permission denied</span>)
      case 'python': case 'python3':
        if (/about\.py/.test(arg)) return push(<span>{profile.tagline}!</span>)
        return push(<span className="t-dim">Python 3.13.0   try `python3 about.py` (open it in VS Code first)</span>)
      case 'code':
        os.open('vscode', args[0] ? { file: args[0] } : undefined)
        return push(<span className="t-dim">Opening Visual Studio Code…</span>)
      case 'vim': case 'vi': case 'nano': case 'emacs':
        os.open('notes')
        return push(<span className="t-dim">Opening Notes instead   nobody should have to figure out how to exit {cmd}.</span>)
      case 'lock':
        return power('lock')
      case 'reboot': case 'restart':
        return power('restart')
      case 'shutdown': case 'poweroff':
        return power('off')
      default:
        if (registry[cmd]) return openThing(cmd)
        return push(<span>zsh: command not found: <C c="r">{cmd0}</C>{' '}<span className="t-dim">— try `help`</span></span>)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter') { run(input); setInput(''); setHi(-1) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const n = Math.min(hist.length - 1, hi + 1); if (hist[n]) { setHi(n); setInput(hist[n]) } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const n = hi - 1; setHi(Math.max(-1, n)); setInput(n < 0 ? '' : hist[n]) }
    else if ((e.key === 'Tab' || e.key === 'ArrowRight') && suggestion && e.target.selectionStart === input.length) { e.preventDefault(); setInput(input + suggestion) }
    else if (e.key === 'Tab') e.preventDefault()
    else if (e.ctrlKey && e.key === 'l') { e.preventDefault(); setLines([]) }
    else if (e.ctrlKey && e.key === 'c') { push(<span>{prompt()}{input}^C</span>); setInput('') }
  }

  return (
    <div className="term" onMouseUp={() => !isMobile() && !getSelection().toString() && inRef.current?.focus({ preventScroll: true })}>
      <div className="term-bar" data-drag>{profile.handle}   -zsh   {Math.round(win.w / 8.4)}×{Math.round((win.h - 28) / 18)}</div>
      <div className="term-body" ref={bodyRef}>
        {lines.map((l) => <div key={l.k} className="t-line">{l.node}</div>)}
        {!fx && (
          <div className="t-line t-input">
            {prompt()}
            <span className="t-field">
              <span className="t-ghost" aria-hidden><span>{input}</span>{suggestion}</span>
              <input ref={inRef} value={input} onChange={(e) => { setInput(e.target.value); setHi(-1) }} onKeyDown={onKey} spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label="Terminal input" />
            </span>
          </div>
        )}
      </div>
      <div className="t-quick" aria-label="Quick commands">
        {QUICK.map((c) => <button key={c} onClick={() => run(c)}>{c}</button>)}
      </div>
      {fx === 'matrix' && <Matrix onExit={() => { setFx(null); push(<span className="t-dim">Wake up, Neo… (matrix exited)</span>) }} />}
      {fx === 'sl' && <Train />}
    </div>
  )
}

function Help() {
  const groups = [
    ['About me', [['about', 'who I am'], ['neofetch', 'system info, portfolio edition'], ['skills', 'my tech stack'], ['projects [name]', 'things I have built'], ['education', 'my journey'], ['certs', 'certificates & competitions'], ['contact', 'how to reach me'], ['resume', 'open my résumé']]],
    ['Apps & links', [['open <app|file|url>', 'e.g. open safari, open github.com'], ['google <query>', 'search the web in Safari'], ['github · linkedin · instagram', 'open my profiles'], ['mail', 'write to me'], ['hire', 'say hi']]],
    ['System', [['ls · cd · cat · pwd', 'explore the file system'], ['theme [dark|light]', 'switch appearance'], ['wallpaper <name>', 'change wallpaper'], ['history · clear · date · uptime', 'the classics'], ['lock · reboot · shutdown', 'power menu'], ['exit', 'close this window']]],
    ['Fun', [['cmatrix', 'enter the matrix'], ['sl', 'choo choo'], ['cowsay <msg>', 'moo'], ['fortune · banner · weather', 'misc']]],
  ]
  return (
    <div className="t-help">
      {groups.map(([g, list]) => (
        <div key={g}>
          <div className="t-y t-head">{g}</div>
          {list.map(([c, d]) => <div key={c}><span className="t-g">{`  ${c}`.padEnd(34)}</span><span className="t-dim">{d}</span></div>)}
        </div>
      ))}
      <div className="t-dim">↑/↓ history · Tab or → accepts suggestions · Ctrl+L clears</div>
    </div>
  )
}

function Neofetch({ os }) {
  const rows = [
    ['OS', 'InukaOS 26.0 “Golden Gate” arm64'],
    ['Host', 'Portfolio Pro (UCSC, 2024)'],
    ['Kernel', 'React 19 · Vite'],
    ['Uptime', uptime(os.bootTime)],
    ['Packages', `${projects.length} projects, ${Object.values(skills).flat().length} skills`],
    ['Shell', 'zsh 5.9'],
    ['Resolution', `${innerWidth}x${innerHeight}`],
    ['Theme', os.dark ? 'Dark (Liquid Glass)' : 'Light (Liquid Glass)'],
    ['CPU', 'Brain™ M4 Max   caffeinated'],
    ['Stars', '400+ ★ on GitHub'],
    ['Location', `${profile.location} 🇱🇰`],
  ]
  return (
    <div className="t-neo">
      <pre className="t-pre t-logo">{LOGO.map(([c, l]) => <span key={l + c} className={`t-${c}`}>{l}{'\n'}</span>)}</pre>
      <div>
        <div><C c="g">{profile.handle}</C>@<C c="g">{HOST}</C></div>
        <div className="t-dim">{'─'.repeat(15)}</div>
        {rows.map(([k, v]) => <div key={k}><C c="y">{k}</C>: {v}</div>)}
        <div className="t-swatch">{['#1d1f21', '#cc6666', '#b5bd68', '#f0c674', '#81a2be', '#b294bb', '#8abeb7', '#c5c8c6'].map((c) => <i key={c} style={{ background: c }} />)}</div>
      </div>
    </div>
  )
}

function Matrix({ onExit }) {
  const ref = useRef(null)
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d')
    const r = cv.parentElement.getBoundingClientRect()
    cv.width = r.width; cv.height = r.height - 28
    const fs = 14, cols = Math.floor(cv.width / fs)
    const drops = Array.from({ length: cols }, () => Math.random() * -40)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789INUKA<>{}$#'
    let raf, last = 0
    const draw = (t) => {
      raf = requestAnimationFrame(draw)
      if (t - last < 45) return
      last = t
      ctx.fillStyle = 'rgba(0,0,0,.08)'
      ctx.fillRect(0, 0, cv.width, cv.height)
      ctx.font = `${fs}px monospace`
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.96 ? '#d8ffd8' : '#1fdc5a'
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fs, y * fs)
        drops[i] = y * fs > cv.height && Math.random() > 0.975 ? 0 : y + 1
      })
    }
    raf = requestAnimationFrame(draw)
    const k = () => onExit()
    const t = setTimeout(() => { addEventListener('keydown', k); cv.addEventListener('pointerdown', k) }, 300)
    return () => { cancelAnimationFrame(raf); clearTimeout(t); removeEventListener('keydown', k) }
  }, []) // eslint-disable-line
  return (
    <>
      <canvas ref={ref} className="t-matrix" />
      <div className="t-matrix-hint">press any key to exit</div>
    </>
  )
}

function Train() {
  const art = `      ====        ________                ___________
  _D _|  |_______/        \\__I_I_____===__|_________|
   |(_)---  |   H\\________/ |   |        =|___ ___|
   /     |  |   H  |  |     |   |         ||_| |_||
  |      |  |   H  |__--------------------| [___] |
  | ________|___H__/__|_____/[][]~\\_______|       |
  |/ |   |-----------I_____I [][] []  D   |=======|__
__/ =| o |=-~~\\  /~~\\  /~~\\  /~~\\ ____Y___________|__
 |/-=|___|=    ||    ||    ||    |_____/~\\___/
  \\_/      \\O=====O=====O=====O_/      \\_/`
  return <pre className="t-train">{art}</pre>
}
