import { useRef, useState } from 'react'
import { useOS } from '../os'
import { registry, dockApps } from '../apps/registry'
import { AppIcon } from '../icons'
import { socials } from '../data'

const titles = { launchpad: 'Launchpad', github: 'GitHub', linkedin: 'LinkedIn', trash: 'Trash' }

export default function Dock() {
  const os = useOS()
  const ref = useRef(null)
  const [bouncing, setBouncing] = useState(null)

  // Magnify from the *resting* icon centres and shift the dock so the point under the
  // cursor stays put   otherwise the centred dock drifts and clicks land on a neighbour.
  const bases = useRef(null)
  const settled = useRef(true)
  const timer = useRef(null)
  const measure = () => {
    clearTimeout(timer.current)
    if (!settled.current && bases.current) return
    bases.current = [...ref.current.querySelectorAll('.dock-item')].map((el) => { const r = el.getBoundingClientRect(); return r.left + r.width / 2 })
  }
  const magnify = (e) => {
    if (!os.magnify || innerWidth < 768) return
    if (!bases.current) measure()
    const base = ref.current.querySelector('.dock-item').offsetHeight // real icon size (CSS may shrink it)
    settled.current = false
    const x = e.clientX
    let left = 0, right = 0
    ref.current.querySelectorAll('.dock-item').forEach((el, i) => {
      const c = bases.current[i]
      const f = Math.max(0, 1 - Math.abs(x - c) / (base * 3.2))
      const s = 1 + 0.72 * (1 - Math.cos(f * Math.PI)) / 2
      const extra = (s - 1) * base
      const frac = Math.min(1, Math.max(0, (x - (c - base / 2)) / base))
      left += extra * frac
      right += extra * (1 - frac)
      el.style.setProperty('--s', s.toFixed(3))
    })
    ref.current.style.transform = `translateX(${((right - left) / 2).toFixed(1)}px)`
  }
  const reset = () => {
    ref.current.querySelectorAll('.dock-item').forEach((el) => el.style.setProperty('--s', 1))
    ref.current.style.transform = ''
    timer.current = setTimeout(() => { settled.current = true; bases.current = null }, 260)
  }

  const launch = (id) => {
    if (id === 'launchpad') return os.overlay('launchpad')
    if (id === 'trash') return os.open('finder', { section: 'trash' }, true)
    const s = socials.find((x) => x.id === id)
    if (s) return os.link(s.url)
    const wins = os.windows.filter((w) => w.app === id && !w.closing)
    if (!wins.length) {
      setBouncing(id)
      setTimeout(() => setBouncing(null), 900)
      setTimeout(() => os.open(id), 260)
      return
    }
    const top = [...wins].sort((a, b) => b.z - a.z)[0]
    os.focus(top.id)
  }

  const item = (id) => {
    const running = os.windows.some((w) => w.app === id && !w.closing)
    return (
      <button key={id} className={`dock-item${bouncing === id ? ' bounce' : ''}`} data-dock={id} onClick={() => launch(id)} aria-label={registry[id]?.title || titles[id]}>
        <span className="dock-label glass">{registry[id]?.title || titles[id]}</span>
        <AppIcon id={id} />
        <i className={`dock-dot${running ? ' on' : ''}`} />
      </button>
    )
  }

  return (
    <div className="dock-wrap">
      <div className="dock glass" ref={ref} onMouseEnter={measure} onMouseMove={magnify} onMouseLeave={reset}>
        {dockApps.map(item)}
        <span className="dock-sep" />
        {['github', 'linkedin', 'resume'].map(item)}
        {item('trash')}
      </div>
    </div>
  )
}
