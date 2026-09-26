import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { registry } from './apps/registry'

const OS = createContext(null)
export const useOS = () => useContext(OS)

export const MENUBAR_H = 28
export const isMobile = () => window.innerWidth < 768
export function useMobile() {
  const [m, set] = useState(isMobile)
  useEffect(() => { const h = () => set(isMobile()); addEventListener('resize', h); return () => removeEventListener('resize', h) }, [])
  return m
}
const EXTERNAL = /^https?:\/\/([\w-]+\.)*(linkedin\.com|instagram\.com|x\.com|twitter\.com|facebook\.com|youtube\.com)\b/i

const SETTINGS = ['theme', 'wallpaper', 'accent', 'dockSize', 'magnify', 'showWidgets', 'brightness', 'volume']
const saved = (() => {
  try { return JSON.parse(localStorage.getItem('ia-settings') || '{}') } catch { return {} }
})()

const initial = {
  windows: [],
  focused: null,
  z: 10,
  layer: null,
  toasts: [],
  theme: 'auto',
  wallpaper: 'dynamic',
  accent: '#0a84ff',
  dockSize: 50,
  magnify: true,
  showWidgets: true,
  brightness: 100,
  volume: 60,
  wifi: true,
  bluetooth: true,
  airdrop: false,
  dnd: false,
  ...saved,
}

let uid = 0
function placeWindow(app, count) {
  const meta = registry[app] || {}
  const vw = window.innerWidth, vh = window.innerHeight
  if (isMobile()) return { x: 0, y: MENUBAR_H, w: vw, h: vh - MENUBAR_H - 78, max: true }
  const w = Math.min(meta.w || 760, vw - 40)
  const h = Math.min(meta.h || 520, vh - MENUBAR_H - 110)
  const off = (count % 6) * 26
  const x = Math.max(12, Math.round((vw - w) / 2) + off - 40)
  const y = Math.max(MENUBAR_H + 8, Math.round((vh - h) / 2) - 36 + off)
  return { x, y, w, h, max: false }
}

function reducer(s, a) {
  switch (a.type) {
    case 'OPEN': {
      const existing = !a.fresh && s.windows.find((w) => w.app === a.app && !w.closing)
      if (existing) {
        return {
          ...s, z: s.z + 1, focused: existing.id, layer: null,
          windows: s.windows.map((w) => (w.id === existing.id
            ? { ...w, min: false, z: s.z + 1, props: a.props ? { ...a.props, nonce: ++uid } : w.props }
            : w)),
        }
      }
      const id = `${a.app}-${++uid}`
      const win = { id, app: a.app, z: s.z + 1, min: false, props: { ...(a.props || {}), nonce: uid }, ...placeWindow(a.app, s.windows.length) }
      return { ...s, z: s.z + 1, focused: id, layer: null, windows: [...s.windows, win] }
    }
    case 'CLOSING':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, closing: true } : w)) }
    case 'CLOSE': {
      const windows = s.windows.filter((w) => w.id !== a.id)
      const top = [...windows].filter((w) => !w.min).sort((p, q) => q.z - p.z)[0]
      return { ...s, windows, focused: s.focused === a.id ? top?.id || null : s.focused }
    }
    case 'FOCUS':
      if (s.focused === a.id && s.windows.find((w) => w.id === a.id)?.z === s.z) return s
      return { ...s, z: s.z + 1, focused: a.id, windows: s.windows.map((w) => (w.id === a.id ? { ...w, z: s.z + 1, min: false } : w)) }
    case 'MIN': {
      const windows = s.windows.map((w) => (w.id === a.id ? { ...w, min: true } : w))
      const top = windows.filter((w) => !w.min).sort((p, q) => q.z - p.z)[0]
      return { ...s, windows, focused: top?.id || null }
    }
    case 'MAX':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, max: !w.max } : w)) }
    case 'RECT':
      return { ...s, windows: s.windows.map((w) => (w.id === a.id ? { ...w, ...a.rect } : w)) }
    case 'CLOSE_APP':
      return { ...s, windows: s.windows.map((w) => (w.app === a.app ? { ...w, closing: true } : w)) }
    case 'CLOSE_ALL':
      return { ...s, windows: s.windows.map((w) => ({ ...w, closing: true })) }
    case 'RESET':
      return { ...s, windows: [], focused: null, layer: null, toasts: [] }
    case 'SET':
      return { ...s, ...a.values }
    case 'OVERLAY':
      return { ...s, layer: s.layer === a.value && a.toggle ? null : a.value }
    case 'TOAST':
      return { ...s, toasts: [...s.toasts, { id: ++uid, ...a.toast }].slice(-4) }
    case 'UNTOAST':
      return { ...s, toasts: s.toasts.filter((t) => t.id !== a.id) }
    default:
      return s
  }
}

function useSystemDark() {
  const mq = useMemo(() => window.matchMedia('(prefers-color-scheme: dark)'), [])
  const [dark, force] = useReducer((_, v) => v, mq.matches)
  useEffect(() => {
    const h = (e) => force(e.matches)
    mq.addEventListener('change', h)
    return () => mq.removeEventListener('change', h)
  }, [mq])
  return dark
}

export function OSProvider({ children }) {
  const [s, dispatch] = useReducer(reducer, initial)
  const systemDark = useSystemDark()
  const dark = s.theme === 'dark' || (s.theme === 'auto' && systemDark)
  const bootTime = useRef(Date.now())

  useEffect(() => {
    const out = {}
    SETTINGS.forEach((k) => { out[k] = s[k] })
    try { localStorage.setItem('ia-settings', JSON.stringify(out)) } catch { /* private mode */ }
  }, [s.theme, s.wallpaper, s.accent, s.dockSize, s.magnify, s.showWidgets, s.brightness, s.volume]) // eslint-disable-line

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = dark ? 'dark' : 'light'
    root.style.setProperty('--accent', s.accent)
    root.style.setProperty('--dock-icon', `${s.dockSize}px`)
  }, [dark, s.accent, s.dockSize])

  const api = useMemo(() => ({
    open: (app, props, fresh) => dispatch({ type: 'OPEN', app, props, fresh }),
    close: (id) => dispatch({ type: 'CLOSING', id }),
    focus: (id) => dispatch({ type: 'FOCUS', id }),
    minimize: (id) => dispatch({ type: 'MIN', id }),
    maximize: (id) => dispatch({ type: 'MAX', id }),
    setRect: (id, rect) => dispatch({ type: 'RECT', id, rect }),
    quit: (app) => dispatch({ type: 'CLOSE_APP', app }),
    closeAll: () => dispatch({ type: 'CLOSE_ALL' }),
    set: (values) => dispatch({ type: 'SET', values }),
    overlay: (value, toggle = true) => dispatch({ type: 'OVERLAY', value, toggle }),
    toast: (toast) => dispatch({ type: 'TOAST', toast }),
    untoast: (id) => dispatch({ type: 'UNTOAST', id }),
    reset: () => dispatch({ type: 'RESET' }),
    // Web links open in the built-in Safari on desktop. Social profiles (except GitHub) and
    // everything on phones open in the real browser instead.
    link: (url) => {
      if (/^(mailto|tel):/i.test(url)) { window.location.href = url; return }
      if (isMobile() || EXTERNAL.test(url)) { window.open(url, '_blank', 'noopener,noreferrer'); return }
      dispatch({ type: 'OPEN', app: 'safari', props: { url } })
    },
    external: (url) => window.open(url, '_blank', 'noopener,noreferrer'),
    dispatch,
  }), [])

  const value = useMemo(() => ({ ...s, dark, bootTime: bootTime.current, ...api }), [s, dark, api])
  return <OS.Provider value={value}>{children}</OS.Provider>
}

// Responsive WebP wallpapers: 1280 / 1920 / 2752px wide, picked for the screen (phones get 1920).
const wallWidth = () => {
  if (isMobile()) return 1920
  const need = Math.max(innerWidth, innerHeight * (2752 / 1536)) * Math.min(devicePixelRatio || 1, 2)
  return need <= 1280 ? 1280 : need <= 1920 ? 1920 : 2752
}
export function wallpaperFor(id, dark, thumb) {
  const name = id === 'dynamic' ? (dark ? 'night' : 'sunset') : id === 'sunset' || id === 'night' ? id : null
  if (!name) return null
  if (thumb === 'blur') return `/wall/${name}-blur.webp`
  return thumb ? `/wall/${name}-thumb.webp` : `/wall/${name}-${wallWidth()}.webp`
}

export function uptime(since) {
  const m = Math.floor((Date.now() - since) / 60000)
  const sec = Math.floor((Date.now() - since) / 1000) % 60
  return m ? `${m} min${m > 1 ? 's' : ''}, ${sec} sec` : `${sec} sec`
}
