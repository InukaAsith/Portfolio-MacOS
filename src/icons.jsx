import { useId } from 'react'

const SQ = 'M50,0C89,0 100,11 100,50C100,89 89,100 50,100C11,100 0,89 0,50C0,11 11,0 50,0Z'

const useUid = () => useId().replace(/[^\w-]/g, '')

function Tile({ id, from, to, children, stroke = true }) {
  const u = useUid()
  return (
    <svg viewBox="0 0 100 100" className="app-svg">
      <defs>
        <linearGradient id={`g-${id}${u}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <clipPath id={`c-${id}${u}`}><path d={SQ} /></clipPath>
      </defs>
      <path d={SQ} fill={`url(#g-${id}${u})`} />
      <g clipPath={`url(#c-${id}${u})`}>{children}</g>
      {stroke && <path d={SQ} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />}
    </svg>
  )
}

const GH = 'M50 16C31 16 16 31.2 16 50c0 15 9.7 27.8 23.3 32.3 1.7.3 2.3-.7 2.3-1.6v-5.8c-9.5 2-11.5-4.5-11.5-4.5-1.5-3.9-3.8-5-3.8-5-3.1-2.1.2-2.1.2-2.1 3.4.2 5.2 3.5 5.2 3.5 3 5.2 8 3.7 9.9 2.8.3-2.2 1.2-3.7 2.2-4.5-7.6-.9-15.5-3.8-15.5-16.8 0-3.7 1.3-6.8 3.5-9.2-.4-.9-1.5-4.3.3-9 0 0 2.9-.9 9.4 3.5a32 32 0 0 1 17 0c6.5-4.4 9.3-3.5 9.3-3.5 1.9 4.7.7 8.1.4 9 2.2 2.4 3.5 5.5 3.5 9.2 0 13.1-8 15.9-15.6 16.8 1.2 1.1 2.3 3.2 2.3 6.4v9.5c0 .9.6 2 2.4 1.6C74.4 77.8 84 65 84 50c0-18.8-15.2-34-34-34z'


function Safari() {
  const u = useUid()
  return (
    <Tile id="safari" from="#ffffff" to="#dfe3ea">
      <defs>
        <linearGradient id={`sf${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2dd1ff" /><stop offset="1" stopColor="#1a5ff0" /></linearGradient>
      </defs>
      <circle cx="50" cy="50" r="38" fill={`url(#sf${u})`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke="#fff" strokeWidth="3" strokeDasharray="0.9 4.28" opacity=".9" />
      <g transform="rotate(45 50 50)">
        <path d="M50,18L57,50H43Z" fill="#ff3b30" />
        <path d="M50,82L57,50H43Z" fill="#f2f2f7" />
      </g>
    </Tile>
  )
}

function Instagram() {
  const u = useUid()
  return (
    <svg viewBox="0 0 100 100" className="app-svg">
      <defs>
        <radialGradient id={`ig${u}`} cx="28" cy="108" r="118" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffdd55" />
          <stop offset=".12" stopColor="#ffd046" />
          <stop offset=".32" stopColor="#ff6a2b" />
          <stop offset=".55" stopColor="#ff1f6b" />
          <stop offset=".78" stopColor="#c81fc9" />
          <stop offset="1" stopColor="#5b3cf0" />
        </radialGradient>
        <radialGradient id={`igb${u}`} cx="10" cy="4" r="44" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#3f6dff" stopOpacity=".85" />
          <stop offset="1" stopColor="#5b3cf0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={SQ} fill={`url(#ig${u})`} />
      <path d={SQ} fill={`url(#igb${u})`} />
      <rect x="23" y="23" width="54" height="54" rx="16" fill="none" stroke="#fff" strokeWidth="6.5" />
      <circle cx="50" cy="50" r="12.5" fill="none" stroke="#fff" strokeWidth="6.5" />
      <circle cx="66.5" cy="33.5" r="4" fill="#fff" />
      <path d={SQ} fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1" />
    </svg>
  )
}

function Folder() {
  const u = useUid()
  return (
    <svg viewBox="0 0 100 100" className="app-svg">
      <defs>
        <linearGradient id={`fd${u}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#8fd3ff" /><stop offset="1" stopColor="#3aa2f5" /></linearGradient>
      </defs>
      <path d="M8,22Q8,16 14,16H38L45,23H86Q92,23 92,29V78Q92,84 86,84H14Q8,84 8,78Z" fill="#3c96e0" />
      <path d="M8,33Q8,29 12,29H88Q92,29 92,33V78Q92,84 86,84H14Q8,84 8,78Z" fill={`url(#fd${u})`} />
      <path d="M10,31H90" stroke="rgba(255,255,255,.5)" strokeWidth="1.5" />
    </svg>
  )
}

function Trash() {
  const u = useUid()
  return (
    <svg viewBox="0 0 100 100" className="app-svg">
      <defs>
        <linearGradient id={`tr${u}`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#d9dbe0" /><stop offset=".5" stopColor="#ffffff" /><stop offset="1" stopColor="#c9ccd2" /></linearGradient>
      </defs>
      <ellipse cx="50" cy="18" rx="34" ry="7" fill="#bfc3ca" />
      <path d="M17,19L24,88Q25,94 32,94H68Q75,94 76,88L83,19Z" fill={`url(#tr${u})`} opacity=".92" />
      {[30, 40, 50, 60, 70].map((x) => <path key={x} d={`M${x},26L${x + (x - 50) * 0.08},88`} stroke="#aeb2ba" strokeWidth="2" />)}
      <ellipse cx="50" cy="19" rx="33" ry="6" fill="none" stroke="#9ea3ab" strokeWidth="2" />
    </svg>
  )
}

function CalendarIcon() {
  const d = new Date()
  return (
    <Tile id="calendar" from="#ffffff" to="#f1f1f4">
      <text x="50" y="30" textAnchor="middle" fontSize="15" fontWeight="700" fill="#ff3b30" fontFamily="Inter, -apple-system, sans-serif">{d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}</text>
      <text x="50" y="80" textAnchor="middle" fontSize="50" fontWeight="400" fill="#1d1d1f" fontFamily="Inter, -apple-system, sans-serif">{d.getDate()}</text>
    </Tile>
  )
}

const icons = {
  finder: (
    <Tile id="finder" from="#5ecbff" to="#1473e6">
      <path d="M55,0H100V100H47C48,88 49,78 47,66H39C42,42 49,22 55,0Z" fill="#eef4fb" />
      <path d="M55,0C49,22 42,42 39,66H47C49,78 48,88 47,100" fill="none" stroke="#1d2a3a" strokeWidth="3" />
      <path d="M30,30V42M72,30V42" stroke="#1d2a3a" strokeWidth="5" strokeLinecap="round" />
      <path d="M24,70Q50,86 78,70" fill="none" stroke="#1d2a3a" strokeWidth="4" strokeLinecap="round" />
    </Tile>
  ),
  launchpad: (
    <Tile id="launchpad" from="#4b4b52" to="#1c1c20">
      {['#ff453a', '#ff9f0a', '#ffd60a', '#30d158', '#64d2ff', '#0a84ff', '#5e5ce6', '#bf5af2', '#ff375f'].map((c, i) => (
        <rect key={c} x={20 + (i % 3) * 22} y={20 + Math.floor(i / 3) * 22} width="16" height="16" rx="5" fill={c} />
      ))}
    </Tile>
  ),
  safari: <Safari />,
  terminal: (
    <Tile id="terminal" from="#4a4a4f" to="#1c1c1e">
      <rect x="10" y="14" width="80" height="72" rx="9" fill="#0d0d0f" stroke="#6e6e73" strokeWidth="1.5" />
      <path d="M24,36L37,47L24,58" fill="none" stroke="#f2f2f2" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42,60H58" stroke="#f2f2f2" strokeWidth="5" strokeLinecap="round" />
    </Tile>
  ),
  mail: (
    <Tile id="mail" from="#27c6ff" to="#0a64f5">
      <rect x="16" y="28" width="68" height="46" rx="6" fill="#fff" />
      <path d="M19,32L50,56L81,32" fill="none" stroke="#2d7ff9" strokeWidth="3.5" strokeLinejoin="round" />
    </Tile>
  ),
  notes: (
    <Tile id="notes" from="#ffffff" to="#f1f1f4">
      <rect x="0" y="0" width="100" height="30" fill="#ffd426" />
      <rect x="0" y="27" width="100" height="3" fill="#e0b400" />
      <path d="M16,33.5H84" stroke="#d6d6db" strokeWidth="1.5" strokeDasharray="2 2.6" />
      {[48, 62, 76].map((y) => <path key={y} d={`M16,${y}H84`} stroke="#d1d1d6" strokeWidth="2" />)}
    </Tile>
  ),
  projects: (
    <Tile id="projects" from="#8e6bff" to="#2f6bff">
      <text x="50" y="63" textAnchor="middle" fontSize="42" fontWeight="700" fill="#fff" fontFamily="SF Mono, JetBrains Mono, Menlo, monospace">{'{}'}</text>
      <circle cx="75" cy="25" r="7" fill="#ffd60a" />
    </Tile>
  ),
  vscode: (
    <Tile id="vscode" from="#f7f9fc" to="#dde4ee">
      <path d="M68,14L84,22V78L68,86L36,56L22,67L15,63V37L22,33L36,44Z" fill="#1f8ad2" />
      <path d="M68,33L48,50L68,67Z" fill="#e8eef6" />
      <path d="M68,14L84,22V78L68,86Z" fill="#0e6fb8" />
    </Tile>
  ),
  photos: (
    <Tile id="photos" from="#ffffff" to="#f2f2f5">
      {['#ff9f0a', '#ffd60a', '#a5de37', '#30d158', '#40c8e0', '#5e5ce6', '#bf5af2', '#ff375f'].map((c, i) => (
        <ellipse key={c} cx="50" cy="31" rx="10.5" ry="17" fill={c} opacity=".82" transform={`rotate(${i * 45} 50 50)`} style={{ mixBlendMode: 'multiply' }} />
      ))}
    </Tile>
  ),
  calculator: (
    <Tile id="calculator" from="#4a4a4f" to="#1f1f22">
      {[[33, 36, '#a5a5aa'], [67, 36, '#a5a5aa'], [33, 68, '#5a5a5f'], [67, 68, '#ff9f0a']].map(([x, y, c]) => <circle key={x + '' + y} cx={x} cy={y} r="13" fill={c} />)}
      <path d="M27,36H39M61,36H73M29,64L37,72M37,64L29,72M61,65H73M61,71H73" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
    </Tile>
  ),
  settings: (
    <Tile id="settings" from="#9a9aa1" to="#4d4d52">
      <circle cx="50" cy="50" r="30" fill="none" stroke="#dcdce1" strokeWidth="11" strokeDasharray="7.2 8.5" />
      <circle cx="50" cy="50" r="24" fill="#6e6e74" stroke="#e5e5ea" strokeWidth="5" />
      <circle cx="50" cy="50" r="9" fill="#3a3a3e" stroke="#c7c7cc" strokeWidth="3" />
      {[0, 60, 120].map((r) => <path key={r} d="M50,29V41M50,59V71" stroke="#c7c7cc" strokeWidth="3" transform={`rotate(${r} 50 50)`} />)}
    </Tile>
  ),
  resume: (
    <Tile id="resume" from="#e9f1ff" to="#a9c6f5">
      <path d="M28,14H62L76,28V86H28Z" fill="#fff" />
      <path d="M62,14V28H76" fill="#dfe6f1" />
      {[38, 46, 54, 62].map((y) => <path key={y} d={`M36,${y}H68`} stroke="#c9d3e3" strokeWidth="3" strokeLinecap="round" />)}
      <rect x="22" y="66" width="36" height="16" rx="4" fill="#ff3b30" />
      <text x="40" y="78" textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">PDF</text>
    </Tile>
  ),
  calendar: <CalendarIcon />,
  clock: (
    <Tile id="clock" from="#3a3a3f" to="#111114">
      <circle cx="50" cy="50" r="36" fill="#fff" />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d="M50,17V22" stroke="#1d1d1f" strokeWidth={i % 3 ? 1.6 : 3} transform={`rotate(${i * 30} 50 50)`} />)}
      <path d="M50,50L37,39" stroke="#1d1d1f" strokeWidth="4" strokeLinecap="round" />
      <path d="M50,50L66,30" stroke="#1d1d1f" strokeWidth="3" strokeLinecap="round" />
      <path d="M50,56L50,22" stroke="#ff9f0a" strokeWidth="1.4" transform="rotate(130 50 50)" />
      <circle cx="50" cy="50" r="3" fill="#ff9f0a" />
    </Tile>
  ),
  weather: (
    <Tile id="weather" from="#3aa0ff" to="#1661d8">
      <circle cx="40" cy="40" r="16" fill="#ffd60a" />
      <path d="M34,74H72A13,13 0 0 0 70,48A18,18 0 0 0 36,52A11,11 0 0 0 34,74Z" fill="#fff" />
    </Tile>
  ),
  github: (
    <Tile id="github" from="#3a3f47" to="#15181c">
      <path d={GH} fill="#fff" />
    </Tile>
  ),
  linkedin: (
    <Tile id="linkedin" from="#1d86e0" to="#0a55a8">
      <text x="50" y="68" textAnchor="middle" fontSize="48" fontWeight="800" fill="#fff" fontFamily="Inter, Helvetica, sans-serif">in</text>
    </Tile>
  ),
  instagram: <Instagram />,
  about: (
    <Tile id="about" from="#3a3a3f" to="#141416">
      <text x="50" y="62" textAnchor="middle" fontSize="36" fontWeight="700" fill="#fff" fontFamily="SF Mono, JetBrains Mono, monospace">{'>_'}</text>
    </Tile>
  ),
  folder: <Folder />,
  pdf: (
    <svg viewBox="0 0 100 100" className="app-svg">
      <path d="M22,6H62L80,24V94H22Z" fill="#fff" stroke="#d1d1d6" strokeWidth="1.5" />
      <path d="M62,6V24H80" fill="#eceef2" stroke="#d1d1d6" strokeWidth="1.5" />
      {[34, 42, 50].map((y) => <path key={y} d={`M32,${y}H70`} stroke="#d8dce4" strokeWidth="3" />)}
      <rect x="22" y="62" width="58" height="20" fill="#ff3b30" />
      <text x="51" y="77" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily="Inter, sans-serif">PDF</text>
    </svg>
  ),
  image: (
    <svg viewBox="0 0 100 100" className="app-svg">
      <rect x="10" y="18" width="80" height="64" rx="6" fill="#fff" stroke="#d1d1d6" strokeWidth="1.5" />
      <rect x="16" y="24" width="68" height="52" rx="3" fill="#8fd3ff" />
      <path d="M16,76L40,50L56,64L66,56L84,72V76Z" fill="#30d158" />
      <circle cx="68" cy="38" r="6" fill="#ffd60a" />
    </svg>
  ),
  trash: <Trash />,
}

export function AppIcon({ id, size }) {
  return <span className="app-icon" style={size ? { width: size, height: size } : undefined}>{icons[id] || icons.folder}</span>
}

export function Logo({ size = 16 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className="logo-mark" aria-hidden>
      <path d="M4.5 6.5L10.5 12L4.5 17.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13 18H20" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  )
}

export { Glyph } from './glyphs'
