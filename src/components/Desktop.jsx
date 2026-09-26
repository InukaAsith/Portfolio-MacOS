import { Suspense, useEffect, useState } from 'react'
import { useOS } from '../os'
import MenuBar from './MenuBar'
import Dock from './Dock'
import Widgets from './Widgets'
import Window from './Window'
import { Spotlight, Launchpad, Toasts, ContextMenu, DesktopIcons } from './Overlays'
import { apps, preloadApps } from '../apps'
import { registry } from '../apps/registry'

export default function Desktop({ power }) {
  const os = useOS()
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    const k = (e) => {
      const mod = e.metaKey || e.ctrlKey
      if (mod && e.key.toLowerCase() === 'k') { e.preventDefault(); os.overlay('spotlight') }
      else if (e.key === 'F4') { e.preventDefault(); os.overlay('launchpad') }
      else if (e.key === 'Escape' && os.layer) os.overlay(null, false)
    }
    addEventListener('keydown', k)
    return () => removeEventListener('keydown', k)
  }, [os.layer]) // eslint-disable-line

  // plain <a href="http…"> anywhere on the desktop → built-in Safari (⌘/Ctrl-click still opens a real tab)
  useEffect(() => {
    const h = (e) => {
      const a = e.target.closest?.('a[href]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const href = a.getAttribute('href')
      if (!/^https?:\/\//i.test(href)) return
      e.preventDefault()
      os.link(href)
    }
    document.addEventListener('click', h)
    return () => document.removeEventListener('click', h)
  }, []) // eslint-disable-line

  useEffect(() => { preloadApps() }, [])

  useEffect(() => {
    // open About Me by default (or the app named in ?open=)
    const app = new URLSearchParams(location.search).get('open')
    const t = setTimeout(() => (app && registry[app] ? os.open(app) : os.open('finder', { section: 'about' })), 900)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line


  const onContext = (e) => {
    if (e.target.closest('.win, .dock, .menubar, .widget, .menu')) return
    e.preventDefault()
    setCtx({
      x: e.clientX, y: e.clientY, items: [
        ['New Terminal Window', () => os.open('terminal', null, true)],
        ['Open About Me', () => os.open('finder', { section: 'about' })],
        '-',
        ['Change Wallpaper…', () => os.open('settings', { pane: 'wallpaper' })],
        [os.dark ? 'Use Light Appearance' : 'Use Dark Appearance', () => os.set({ theme: os.dark ? 'light' : 'dark' })],
        [os.showWidgets ? 'Hide Widgets' : 'Show Widgets', () => os.set({ showWidgets: !os.showWidgets })],
        '-',
        ['Spotlight Search', () => os.overlay('spotlight', false)],
        ['Launchpad', () => os.overlay('launchpad', false)],
      ],
    })
  }

  return (
    <div className="desktop" onContextMenu={onContext}>
      <MenuBar power={power} />
      {os.showWidgets && <Widgets />}
      <DesktopIcons />
      <div className="windows">
        {os.windows.map((w) => {
          const App = apps[w.app]
          return <Window key={w.id} win={w}><Suspense fallback={<div className="app-loading" />}>{App ? <App win={w} power={power} /> : null}</Suspense></Window>
        })}
      </div>
      <Dock />
      {os.layer === 'spotlight' && <Spotlight power={power} />}
      {os.layer === 'launchpad' && <Launchpad />}
      <Toasts />
      {ctx && <ContextMenu {...ctx} onClose={() => setCtx(null)} />}
    </div>
  )
}
