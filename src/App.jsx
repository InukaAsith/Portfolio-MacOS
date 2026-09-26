import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { OSProvider, useOS, useMobile, wallpaperFor } from './os'
import { wallpapers } from './data'
import { Boot, Lock, IOSLock, Off } from './components/Boot'
// Only the shell for this device is downloaded; it's fetched during the intro.
const loadDesktop = () => import('./components/Desktop')
const loadPhone = () => import('./components/Phone')
const Desktop = lazy(loadDesktop)
const Phone = lazy(loadPhone)

function Wallpaper() {
  const os = useOS()
  const w = wallpapers.find((x) => x.id === os.wallpaper) || wallpapers[0]
  const bg = w.css || `url(${wallpaperFor(w.id, os.dark)}) center/cover no-repeat`
  const [layers, setLayers] = useState([{ bg, k: 0 }])
  const k = useRef(0)
  useEffect(() => {
    if (layers[layers.length - 1].bg === bg) return
    const next = { bg, k: ++k.current }
    setLayers((l) => [...l.slice(-1), next])
    const t = setTimeout(() => setLayers([next]), 900)
    return () => clearTimeout(t)
  }, [bg]) // eslint-disable-line
  return (
    <div className="wallpaper">
      {layers.map((l) => <div key={l.k} className="wall-layer" style={{ background: l.bg }} />)}
    </div>
  )
}

// ?skip jumps straight to the desktop; ?open=projects (etc.) also opens that app   handy for sharing
const params = new URLSearchParams(location.search)
const direct = params.has('skip') || params.has('open')

function Shell() {
  const os = useOS()
  const mobile = useMobile()
  useEffect(() => { (mobile ? loadPhone : loadDesktop)() }, [mobile])
  const [phase, setPhase] = useState(direct ? 'desktop' : 'boot') // boot | lock | desktop | sleep | off | down
  const [mounted, setMounted] = useState(direct)
  const [leaving, setLeaving] = useState(false)
  const [gen, setGen] = useState(0)
  const [intro, setIntro] = useState(!direct)

  const power = (kind) => {
    os.overlay(null, false)
    if (kind === 'lock') return setPhase('lock')
    if (kind === 'sleep') return setPhase('sleep')
    setPhase('down')
    os.closeAll()
    setTimeout(() => {
      os.reset()
      setMounted(false)
      setGen((g) => g + 1)
      setPhase(kind === 'restart' ? 'boot' : 'off')
      if (kind === 'restart') setIntro(true)
    }, 900)
  }

  const unlock = () => {
    if (leaving) return
    setLeaving(true)
    setMounted(true)
    setTimeout(() => { setPhase('desktop'); setLeaving(false) }, 750)
  }

  useEffect(() => {
    if (phase !== 'sleep') return
    const wake = () => setPhase('lock')
    const t = setTimeout(() => { addEventListener('pointerdown', wake); addEventListener('keydown', wake) }, 400)
    return () => { clearTimeout(t); removeEventListener('pointerdown', wake); removeEventListener('keydown', wake) }
  }, [phase])

  const wall = wallpapers.find((x) => x.id === os.wallpaper) || wallpapers[0]
  const lockBg = wall.css || `url(${wallpaperFor(wall.id, os.dark)}) center/cover no-repeat`
  // a tiny pre-blurred wallpaper is the frosted fill for the glass clock (like the password field)
  const glassImg = wall.css ? wall.css.replace(/,?\s*$/, '') : `url(${wallpaperFor(wall.id, os.dark, 'blur')})`

  return (
    <div className={`shell phase-${phase}`}>
      <Wallpaper />
      {mounted && <Suspense fallback={null}>{mobile ? <Phone key={gen} power={power} /> : <Desktop key={gen} power={power} />}</Suspense>}
      {(phase === 'lock' || leaving) && <div className={`lock-bg${leaving ? ' out' : ''}`} style={{ background: lockBg }} />}
      {(phase === 'lock' || leaving) && (mobile ? <IOSLock onUnlock={unlock} leaving={leaving} wall={glassImg} /> : <Lock onUnlock={unlock} leaving={leaving} wall={glassImg} />)}
      {intro && <Boot key={gen} onReveal={() => setPhase('lock')} onFinish={() => setIntro(false)} />}
      {phase === 'off' && <Off onPower={() => { setPhase('boot'); setIntro(true) }} />}
      <div className={`blackout${phase === 'sleep' || phase === 'down' ? ' on' : ''}`} />
      <div className="dimmer" style={{ opacity: (100 - os.brightness) / 100 }} />
    </div>
  )
}

export default function App() {
  return <OSProvider><Shell /></OSProvider>
}
