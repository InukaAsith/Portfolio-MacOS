import { Component, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useOS, MENUBAR_H, isMobile } from '../os'
import { registry } from '../apps/registry'

const EASE = 'cubic-bezier(.2,.9,.25,1)'

// If an app crashes, show a macOS-style notice inside its window instead of blanking the desktop.
export class AppBoundary extends Component {
  state = { error: null }
  static getDerivedStateFromError(error) { return { error } }
  render() {
    if (!this.state.error) return this.props.children
    return (
      <div className="app app-crash" data-drag>
        <b>{this.props.name} quit unexpectedly.</b>
        <button className="btn primary" onClick={() => this.setState({ error: null })}>Reopen</button>
      </div>
    )
  }
}

function dockTarget(app) {
  const icon = document.querySelector(`[data-dock="${app}"]`) || document.querySelector('.dock')
  if (icon) return icon.getBoundingClientRect()
  return { left: innerWidth / 2, top: innerHeight, width: 0, height: 0 }
}

function genie(el, app) {
  const r = el.getBoundingClientRect()
  const t = dockTarget(app)
  const dx = t.left + t.width / 2 - (r.left + r.width / 2)
  const dy = t.top + t.height / 2 - (r.top + r.height / 2)
  return [
    { transform: 'none', opacity: 1, filter: 'none' },
    { transform: `translate(${dx * 0.35}px, ${dy * 0.5}px) scale(.6,.62) skewX(${dx > 0 ? -4 : 4}deg)`, opacity: 0.95, offset: 0.45 },
    { transform: `translate(${dx}px, ${dy}px) scale(${Math.max(0.05, t.width / r.width)}, 0.04)`, opacity: 0 },
  ]
}

export default function Window({ win, children }) {
  const os = useOS()
  const ref = useRef(null)
  const meta = registry[win.app] || {}
  const focused = os.focused === win.id
  const mobile = isMobile()
  const [hidden, setHidden] = useState(false)
  const [tx, setTx] = useState(false)
  const prevMin = useRef(win.min)
  const prevMax = useRef(win.max)

  useLayoutEffect(() => {
    ref.current.animate(
      [{ opacity: 0, transform: 'scale(.88) translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 300, easing: EASE },
    )
  }, [])

  useEffect(() => {
    if (!win.closing) return
    const a = ref.current.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(.9)' }], { duration: 180, easing: 'ease-in', fill: 'forwards' })
    a.onfinish = () => os.dispatch({ type: 'CLOSE', id: win.id })
  }, [win.closing]) // eslint-disable-line

  useEffect(() => {
    if (prevMin.current === win.min) return
    prevMin.current = win.min
    const el = ref.current
    el.getAnimations().forEach((a) => a.cancel())
    if (win.min) {
      const a = el.animate(genie(el, win.app), { duration: 520, easing: 'cubic-bezier(.5,0,.7,.4)', fill: 'forwards' })
      a.onfinish = () => setHidden(true)
    } else {
      setHidden(false)
      el.animate(genie(el, win.app).reverse(), { duration: 480, easing: 'cubic-bezier(.3,.6,.4,1)' })
    }
  }, [win.min, win.app])

  useEffect(() => {
    if (prevMax.current === win.max) return
    prevMax.current = win.max
    setTx(true)
    const t = setTimeout(() => setTx(false), 380)
    return () => clearTimeout(t)
  }, [win.max])

  const startDrag = (e) => {
    if (e.button !== 0 || mobile) return
    if (!e.target.closest('[data-drag]') || e.target.closest('button, input, textarea, select, a, [data-nodrag]')) return
    const el = ref.current
    const sx = e.clientX, sy = e.clientY
    let ox = win.x, oy = win.y, x = ox, y = oy, moved = false
    const move = (ev) => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 3) return
      if (!moved && win.max) {
        // drag out of zoomed state like macOS: re-center restored window under cursor
        ox = ev.clientX - win.w / 2
        oy = MENUBAR_H
        os.maximize(win.id)
      }
      moved = true
      document.body.classList.add('dragging')
      x = Math.min(innerWidth - 80, Math.max(-win.w + 100, ox + ev.clientX - sx))
      y = Math.min(innerHeight - 60, Math.max(MENUBAR_H, oy + ev.clientY - sy))
      el.style.left = `${x}px`
      el.style.top = `${y}px`
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      document.body.classList.remove('dragging')
      if (moved) os.setRect(win.id, { x, y })
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }

  const startResize = (dir) => (e) => {
    e.stopPropagation()
    e.preventDefault()
    const el = ref.current
    const sx = e.clientX, sy = e.clientY
    const o = { x: win.x, y: win.y, w: win.w, h: win.h }
    const minW = meta.minW || 360, minH = meta.minH || 240
    let r = { ...o }
    document.body.classList.add('dragging')
    const move = (ev) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy
      r = { ...o }
      if (dir.includes('e')) r.w = Math.max(minW, o.w + dx)
      if (dir.includes('s')) r.h = Math.max(minH, o.h + dy)
      if (dir.includes('w')) { r.w = Math.max(minW, o.w - dx); r.x = o.x + o.w - r.w }
      if (dir.includes('n')) { r.h = Math.max(minH, o.h - dy); r.y = Math.max(MENUBAR_H, o.y + o.h - r.h); r.h = o.y + o.h - r.y }
      Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` })
    }
    const up = () => {
      removeEventListener('pointermove', move)
      removeEventListener('pointerup', up)
      document.body.classList.remove('dragging')
      os.setRect(win.id, r)
    }
    addEventListener('pointermove', move)
    addEventListener('pointerup', up)
  }

  const onDouble = (e) => {
    if (e.target.closest('[data-drag]') && !e.target.closest('button, input, a, [data-nodrag]') && !meta.fixed) os.maximize(win.id)
  }

  const style = win.max
    ? { left: 0, top: MENUBAR_H, width: '100%', height: `calc(100% - ${MENUBAR_H}px - var(--dock-space))`, zIndex: win.z }
    : { left: win.x, top: win.y, width: win.w, height: win.h, zIndex: win.z }

  return (
    <div
      ref={ref}
      className={`win app-${win.app}${focused ? ' focused' : ' inactive'}${win.max ? ' maxed' : ''}${hidden ? ' is-min' : ''}${tx ? ' tx' : ''}${meta.bar === 'short' ? ' short-bar' : ''}`}
      style={style}
      onPointerDownCapture={() => !focused && os.focus(win.id)}
      onPointerDown={startDrag}
      onDoubleClick={onDouble}
    >
      <div className="traffic" data-nodrag>
        <button className="tl close" aria-label="Close" onClick={() => os.close(win.id)}><svg viewBox="0 0 12 12"><path d="M3.5 3.5l5 5M8.5 3.5l-5 5" /></svg></button>
        <button className="tl min" aria-label="Minimize" onClick={() => os.minimize(win.id)}><svg viewBox="0 0 12 12"><path d="M2.8 6h6.4" /></svg></button>
        <button className="tl max" aria-label="Zoom" disabled={meta.fixed} onClick={() => os.maximize(win.id)}><svg viewBox="0 0 12 12"><path className="fill" d="M3.2 8.8V4.6l4.2 4.2zM8.8 3.2v4.2L4.6 3.2z" /></svg></button>
      </div>
      <div className="win-body"><AppBoundary name={meta.title}>{children}</AppBoundary></div>
      {!meta.fixed && !win.max && !mobile && ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'].map((d) => (
        <div key={d} className={`rz rz-${d}`} onPointerDown={startResize(d)} />
      ))}
    </div>
  )
}
