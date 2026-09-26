import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Glyph } from '../glyphs'
import { useOS, wallpaperFor } from '../os'
import { profile } from '../data'
import { Ico } from '../ico'

/* Intro: the Golden Gate draws itself in gold line-art while the site loads  
   the deck is the progress bar   then "hello", "hola" and "ආයුබෝවන්" are written in ink,
   and the sketch dissolves into the real bridge on the lock screen. */
const DECK = 250
const q = (a, c, b, t) => (1 - t) ** 2 * a + 2 * (1 - t) * t * c + t ** 2 * b
const spans = [
  [[60, 238], [270, 236], [330, 72]],
  [[330, 72], [500, 380], [670, 72]],
  [[670, 72], [730, 236], [940, 238]],
]
const hangers = spans.flatMap(([a, c, b], si) => Array.from({ length: si === 1 ? 17 : 9 }, (_, i) => {
  const t = (i + 1) / (si === 1 ? 18 : 10)
  return [q(a[0], c[0], b[0], t), q(a[1], c[1], b[1], t)]
})).filter(([, y]) => y < DECK - 6)
const legs = [316, 344, 656, 684]
const portals = [92, 128, 168, 212]
const words = [
  { text: 'hello', cls: 'script', y: 180 },
  { text: 'hola', cls: 'script', y: 180 },
  { text: 'ආයුබෝවන්', cls: 'si', y: 170 },
]
const stages = [[0.3, 'pouring foundations'], [0.55, 'raising towers'], [0.85, 'spinning cables'], [1.01, 'opening the gate']]
const seg = (p, a, b) => Math.min(1, Math.max(0, (p - a) / (b - a)))

// Linux-style boot log behind the intro: kernel lines, then systemd units — printed line by line
const BOOT_LOG = [
  'MacOS version 27.9.0- (inuka@macbook) (gcc 14.1.1, GNU ld 2.42) #1 SMP PREEMPT_DYNAMIC',
  'Command line: BOOT_IMAGE=/vmlinuz-golden-gate root=UUID=1937-0527 ro quiet splash',
  'BIOS-provided physical RAM map:',
  'ACPI: Early table checksum verification disabled',
  'DMI: Inuka Asith InukaBook Pro/Golden Gate, BIOS 26.0 09/26/2026',
  'smpboot: CPU0: Brain(TM) M4 Max @ 4.05GHz (family: 0x6, model: 0xb7)',
  'Memory: 16384000K/16777216K available (20480K kernel code)',
  'rcu: Hierarchical RCU implementation.',
  'PCI: Using configuration type 1 for base access',
  'NET: Registered PF_INET protocol family',
  'nvme nvme0: 8/0/0 default/read/poll queues',
  'EXT4-fs (nvme0n1p2): mounted filesystem with ordered data mode',
  'usb 1-1: new high-speed USB device number 2 using xhci_hcd',
  'input: Magic Keyboard as /devices/virtual/input/input3',
  'systemd[1]: Detected architecture x86-64.',
  'systemd[1]: Hostname set to <golden-gate>.',
  'OK|Started Journal Service.',
  'OK|Mounted /home/inuka.',
  'OK|Started Network Manager.',
  'OK|Reached target Network is Online.',
  'OK|Started foundations.service - Pour Foundations.',
  'OK|Started towers.service - Raise Towers (227 m).',
  'OK|Started cables.service - Spin Main Cables (27,572 wires).',
  'OK|Started deck.service - Pave Bridge Deck.',
  'OK|Started projects.service - Load 9 Projects.',
  'OK|Started skills.service - Mount Skills (C, Python, Java, JS…).',
  'OK|Started portfolio.service - Inuka Asith Portfolio.',
  'OK|Reached target Graphical Interface.',
  '..|Starting gdm.service - InukaOS Login Manager...',
]
// deterministic, slightly irregular timing like a real boot
const bootTimes = BOOT_LOG.reduce((acc, l, i) => [...acc, (acc[i - 1] || 0) + (l.startsWith('OK|') ? 120 : 60) + ((i * 97) % 140)], [])

function BootLog() {
  const [n, setN] = useState(0)
  useEffect(() => {
    const t0 = Date.now() + 250
    const iv = setInterval(() => {
      const el = Date.now() - t0
      const c = bootTimes.filter((t) => t <= el).length
      setN(c)
      if (c >= BOOT_LOG.length) clearInterval(iv)
    }, 40)
    return () => clearInterval(iv)
  }, [])
  const max = Math.max(8, Math.floor((innerHeight * 0.82) / 19))
  const shown = BOOT_LOG.slice(0, n).map((l, i) => [l, i]).slice(-max)
  return (
    <pre className="cb-col">
      {shown.map(([l, i]) => {
        const [tag, text] = l.includes('|') ? l.split('|') : [null, l]
        return (
          <div key={i}>
            {tag === 'OK' ? <><span className="cb-ok">[  OK  ]</span> {text}</>
              : tag === '..' ? <><span className="cb-dim">{'        '}</span> {text}</>
              : <><span className="cb-dim">[{(bootTimes[i] / 1000 * 0.37).toFixed(6).padStart(12)}]</span> {text}</>}
          </div>
        )
      })}
      {n < BOOT_LOG.length && <i className="cb-caret" />}
    </pre>
  )
}

function Bridge({ p }) {
  const deck = seg(p, 0, 0.35), tower = seg(p, 0.2, 0.55), cable = seg(p, 0.5, 0.85), hang = seg(p, 0.75, 1)
  return (
    <g>
      <path d={`M40,${DECK + 12}H960`} className="ib-horizon" />
      <path d={`M60,${DECK}H940`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - deck} className="ib-deck" />
      {legs.map((x) => <path key={x} d={`M${x},${DECK + 12}V70`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - tower} className="ib-tower" />)}
      {[0, 2].map((i) => portals.map((y, j) => (
        <path key={`${i}-${y}`} d={`M${legs[i]},${y}H${legs[i + 1]}`} className="ib-portal" style={{ opacity: tower > 0.3 + j * 0.17 ? 1 : 0 }} />
      )))}
      {spans.map(([a, c, b], i) => (
        <path key={i} d={`M${a[0]},${a[1]}Q${c[0]},${c[1]} ${b[0]},${b[1]}`} pathLength="1" strokeDasharray="1" strokeDashoffset={1 - cable} className="ib-cable" />
      ))}
      {hangers.map(([x, y], i) => (
        <path key={i} d={`M${x.toFixed(1)},${y.toFixed(1)}V${DECK}`} className="ib-hanger" style={{ opacity: hang * hangers.length > i ? 0.75 : 0 }} />
      ))}
    </g>
  )
}

export function Boot({ onReveal, onFinish }) {
  const os = useOS()
  const [real, setReal] = useState(0)
  const [t0] = useState(() => performance.now())
  const [p, setP] = useState(0)
  const [word, setWord] = useState(-1)
  const [typed, setTyped] = useState(0)
  const [out, setOut] = useState(false)
  const [done, setDone] = useState(false)

  // real preloading: wallpapers, avatar and fonts
  useEffect(() => {
    const srcs = [wallpaperFor(os.wallpaper, os.dark), wallpaperFor(os.wallpaper, os.dark, 'blur'), profile.avatar].filter(Boolean)
    let n = 0
    const tick = () => setReal(++n / (srcs.length + 1))
    srcs.forEach((src) => { const i = new Image(); i.onload = i.onerror = tick; i.src = src })
    ;(document.fonts?.ready || Promise.resolve()).then(tick)
    const cap = setTimeout(() => setReal(1), 7000)
    return () => clearTimeout(cap)
  }, []) // eslint-disable-line

  // displayed progress = min(real, timeline) so the build always plays out
  useEffect(() => {
    let raf
    const f = (now) => {
      const tl = Math.min(1, (now - t0) / 4000)
      setP((prev) => Math.max(prev, Math.min(real, tl * (2 - tl))))
      raf = requestAnimationFrame(f)
    }
    raf = requestAnimationFrame(f)
    return () => cancelAnimationFrame(raf)
  }, [real, t0])

  useEffect(() => {
    const ts = [setTimeout(() => setWord(0), 400), setTimeout(() => setWord(1), 2300), setTimeout(() => setWord(2), 4100), setTimeout(() => setWord(3), 6100)]
    return () => ts.forEach(clearTimeout)
  }, [])

  // after the name writes in, the role types out letter by letter
  useEffect(() => {
    if (word < 3) return
    let iv
    const start = setTimeout(() => {
      const t = Date.now()
      iv = setInterval(() => { const n = Math.min(profile.role.length, Math.floor((Date.now() - t) / 45) + 1); setTyped(n); if (n >= profile.role.length) clearInterval(iv) }, 30)
    }, 1300)
    return () => { clearTimeout(start); clearInterval(iv) }
  }, [word])

  const finished = p >= 1 && word >= 3 && typed >= profile.role.length
  useEffect(() => { if (finished && !done) { const t = setTimeout(() => setDone(true), 1500); return () => clearTimeout(t) } }, [finished, done])

  useEffect(() => {
    if (!done || out) return
    setOut(true)
    onReveal()
    const t = setTimeout(onFinish, 1300)
    return () => clearTimeout(t)
  }, [done]) // eslint-disable-line

  useEffect(() => {
    const skip = () => setDone(true)
    const t = setTimeout(() => { addEventListener('keydown', skip); addEventListener('pointerdown', skip) }, 500)
    return () => { clearTimeout(t); removeEventListener('keydown', skip); removeEventListener('pointerdown', skip) }
  }, [])

  const status = stages.find(([lim]) => p < lim)?.[1] || 'opening the gate'

  return (
    <div className={`intro${out ? ' out' : ''}${p >= 1 ? ' built' : ''}`} onContextMenu={(e) => e.preventDefault()}>
      <div className="intro-stars" />
      <div className="intro-code" aria-hidden><BootLog /></div>
      <svg className="intro-bridge" viewBox="0 0 1000 380" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="ib-g" gradientUnits="userSpaceOnUse" x1="60" x2="940" y1="0" y2="0">
            <stop offset="0" stopColor="#ffd98a" /><stop offset=".5" stopColor="#ff9a4d" /><stop offset="1" stopColor="#ff5e3a" />
          </linearGradient>
          <linearGradient id="ib-fade" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="262" y2="392"><stop offset="0" stopColor="#fff" stopOpacity=".5" /><stop offset=".5" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <mask id="ib-m"><rect x="0" y={DECK + 12} width="1000" height="130" fill="url(#ib-fade)" /></mask>
        </defs>
        <g className="ib-main"><Bridge p={p} /></g>
        <g mask="url(#ib-m)"><g transform={`translate(0 ${2 * DECK + 24}) scale(1 -1)`} className="ib-reflect"><Bridge p={p} /></g></g>
        {Array.from({ length: 14 }, (_, i) => (
          <circle key={i} cx={770 + i * 12 + (i % 3) * 3} cy={DECK + 8 - (i % 4) * 2.5} r="1.6" className="ib-city" style={{ transitionDelay: `${i * 60}ms` }} />
        ))}
      </svg>
      <div className="intro-fog"><i /><i /><i /></div>
      <div className="intro-words">
        {words.map((w, i) => (
          <svg key={w.text} viewBox="0 0 1000 260" className={`iw-svg ${w.cls}${word === i ? ' in' : word > i ? ' gone' : ''}`} aria-label={w.text}>
            <defs>
              <linearGradient id={`iw-g${i}`} gradientUnits="userSpaceOnUse" x1="220" x2="780" y1="0" y2="0">
                <stop offset="0" stopColor="#ffe7ad" /><stop offset=".5" stopColor="#ffb36b" /><stop offset="1" stopColor="#ff7b4c" />
              </linearGradient>
            </defs>
            <text x="500" y={w.y} textAnchor="middle" fill={`url(#iw-g${i})`} stroke={`url(#iw-g${i})`}>{w.text}</text>
          </svg>
        ))}
        <span className={`iw name${word >= 3 ? ' in' : ''}`}>
          <span className="name-text">I’m {profile.first}.</span>
          <small className={typed ? 'typing' : ''}>{profile.role.slice(0, typed)}<i className={`caret${typed >= profile.role.length ? ' idle' : ''}`} /></small>
        </span>
      </div>
      <div className="intro-status">
        <span>{status}</span>
        <b>{Math.round(p * 100)}%</b>
      </div>
      <button className="intro-skip" onClick={() => setDone(true)}>Skip intro <Glyph.fwd style={{ width: 12, height: 12 }} /></button>
    </div>
  )
}

// Liquid Glass clock: map the wallpaper onto the digits exactly where it sits on screen
// (slightly magnified, like a lens) so each glyph reads as glass over the photo.
function useGlassClock(deps) {
  const ref = useRef(null)
  const [glass, setGlass] = useState({})
  useLayoutEffect(() => {
    const calc = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vw = innerWidth, vh = innerHeight, aspect = 2752 / 1536, k = 1.07 // same zoom as the lock wallpaper
      let w = vw, hh = vw / aspect
      if (hh < vh) { hh = vh; w = vh * aspect }
      w *= k; hh *= k
      setGlass({ '--gw': `${w}px`, '--gh': `${hh}px`, '--gx': `${(vw - w) / 2 - r.left}px`, '--gy': `${(vh - hh) / 2 - r.top}px` })
    }
    calc()
    const t = setTimeout(calc, 1250)
    addEventListener('resize', calc)
    return () => { clearTimeout(t); removeEventListener('resize', calc) }
  }, deps) // eslint-disable-line
  return [ref, glass]
}

/* iPhone lock screen: Face ID scans, the padlock opens, swipe up to unlock.
   Bottom shortcuts jump straight into Projects or Achievements. */
export function IOSLock({ onUnlock, leaving, wall }) {
  const os = useOS()
  const [now, setNow] = useState(new Date())
  const [stage, setStage] = useState('scan') // scan -> locked -> open
  const [dy, setDy] = useState(0)
  const [drag, setDrag] = useState(false)
  const [nudge, setNudge] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    const a = setTimeout(() => setStage('locked'), 1100)
    const b = setTimeout(() => setStage('open'), 1450)
    const k = (e) => { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowUp') onUnlock() }
    addEventListener('keydown', k)
    return () => { clearInterval(t); clearTimeout(a); clearTimeout(b); removeEventListener('keydown', k) }
  }, []) // eslint-disable-line

  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')
  const [timeRef, glass] = useGlassClock([h, m])
  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const jump = (app, props) => { os.open(app, props); onUnlock() }

  const down = (e) => {
    if (e.target.closest('button, .il-note')) return
    const y0 = e.clientY
    let d = 0
    setDrag(true)
    const move = (ev) => { d = Math.min(0, ev.clientY - y0); setDy(d) }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      setDrag(false)
      if (d < -90) return onUnlock()
      setDy(0)
      if (d > -8) { setNudge(true); setTimeout(() => setNudge(false), 650) } // a tap teaches the swipe
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }
  const p = Math.min(1, -dy / 260)

  return (
    <div className={`ioslock${leaving ? ' out' : ''}${nudge ? ' nudge' : ''}`} style={{ '--wall-img': wall }} onPointerDown={down}>
      <div className="il-content" style={{ transform: `translateY(${dy}px)`, opacity: 1 - p * 0.7, transition: drag ? 'none' : undefined }}>
        <div className={`il-lock ${stage}`} aria-label={stage === 'open' ? 'Unlocked' : 'Face ID'}>
          {stage === 'scan' ? (
            <svg viewBox="0 0 40 40"><path d="M4 12V8a4 4 0 0 1 4-4h4M28 4h4a4 4 0 0 1 4 4v4M36 28v4a4 4 0 0 1-4 4h-4M12 36H8a4 4 0 0 1-4-4v-4M14 15v3M26 15v3M20 15v7h-2M15 27c3 2.5 7 2.5 10 0" /></svg>
          ) : (
            <svg viewBox="0 0 40 40"><path className="il-shackle" d={stage === 'open' ? 'M26 19V11a6 6 0 0 0-12 0v2' : 'M14 19v-5a6 6 0 0 1 12 0v5'} /><rect x="10" y="19" width="20" height="15" rx="3.5" className="il-body" /></svg>
          )}
        </div>
        <div className="il-date">{date}</div>
        <div className="lock-time il-time" ref={timeRef} style={glass} data-time={`${h}:${m}`}>{h}:{m}</div>
        {stage === 'open' && (
          <div className="il-note" role="button" onClick={() => jump('finder', { section: 'about' })}>
            <img src={profile.avatar} alt="" />
            <div>
              <div className="il-note-top"><b>{profile.name}</b><small>now</small></div>
              <p>Hey <Ico n="wave" /> Swipe up to explore my portfolio: projects, résumé, terminal and more.</p>
            </div>
          </div>
        )}
      </div>
      <div className="il-bottom" style={{ opacity: 1 - p }}>
        <button className="il-btn" onClick={() => jump('projects')} aria-label="Open Projects">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 4c-2 0-3 1-3 3v2.5c0 1-.8 2-2 2.5 1.2.5 2 1.5 2 2.5V17c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2.5c0 1 .8 2 2 2.5-1.2.5-2 1.5-2 2.5V17c0 2-1 3-3 3" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <small>Projects</small>
        </button>
        <button className="il-btn" onClick={() => jump('finder', { section: 'achievements' })} aria-label="Open Achievements">
          <svg viewBox="0 0 24 24" width="22" height="22"><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8.5 20h7M10 17h4v3h-4z" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinejoin="round" strokeLinecap="round" /></svg>
          <small>Achievements</small>
        </button>
      </div>
      <div className="il-hint" style={{ opacity: 1 - p }}>
        <svg viewBox="0 0 24 24" width="18" height="18"><path d="M6 14l6-6 6 6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
        {stage === 'open' ? 'Swipe up to view portfolio' : 'Face ID'}
      </div>
      <div className="il-bar" />
    </div>
  )
}

/* Lock screen   macOS 26 style: date + huge clock top, user + password pill bottom */
export function Lock({ onUnlock, leaving, wall }) {
  const [now, setNow] = useState(new Date())
  const [pw, setPw] = useState('')
  const [entered, setEntered] = useState(false)
  const [note, setNote] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    const k = (e) => { if (e.key === 'Enter' || e.key === ' ') { if (document.activeElement?.tagName !== 'INPUT') unlock() } }
    const r = setTimeout(() => setEntered(true), 40)
    addEventListener('keydown', k)
    return () => { clearInterval(t); removeEventListener('keydown', k); clearTimeout(r) }
  }, []) // eslint-disable-line

  function unlock(e) {
    e?.preventDefault()
    onUnlock()
  }

  const date = now.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
  const h = now.getHours() % 12 || 12
  const m = String(now.getMinutes()).padStart(2, '0')

  const [timeRef, glass] = useGlassClock([h, m])

  return (
    <div className={`lock${entered ? ' in' : ''}${leaving ? ' out' : ''}`} style={{ '--wall-img': wall }}>
      <div className="lock-status">
        <Glyph.wifi />
        <span className="batt"><i /></span>
      </div>
      <div className={`il-note lock-note${note ? '' : ' gone'}`} role="button" onClick={unlock}>
        <img src={profile.avatar} alt="" />
        <div>
          <div className="il-note-top"><b>{profile.name}</b><small>now</small></div>
          <p>Hey <Ico n="wave" /> Unlock to explore my portfolio: projects, résumé, terminal and more.</p>
        </div>
        <button className="lock-note-x" onClick={(e) => { e.stopPropagation(); setNote(false) }} aria-label="Dismiss notification">×</button>
      </div>
      <div className="lock-top">
        <div className="lock-date">{date}</div>
        <div className="lock-time" ref={timeRef} style={glass} data-time={`${h}:${m}`}>{h}:{m}</div>
      </div>
      <form className="lock-user" onSubmit={unlock}>
        <button type="button" className="lock-avatar" onClick={unlock} aria-label="Unlock">
          <img src={profile.avatar} alt="" />
        </button>
        <div className="lock-name">{profile.name}</div>
        <div className="lock-pw">
          <input autoFocus type="password" placeholder="Enter Password" value={pw} onChange={(e) => setPw(e.target.value)} aria-label="Password (anything works)" />
          <button type="submit" aria-label="Log in" className={pw ? 'on' : ''}><Glyph.arrow /></button>
        </div>
        <div className="lock-hint">Press <kbd>return</kbd> or click your photo or any password works</div>
      </form>
    </div>
  )
}

/* Power states */
export function Off({ onPower, label = 'Press to start' }) {
  return (
    <div className="off" onClick={onPower}>
      <button className="power-btn" aria-label="Power on"><Glyph.power /></button>
      <span>{label}</span>
    </div>
  )
}
