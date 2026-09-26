import { lazy } from 'react'
import '../apps.css'

// Apps are code-split so the first paint stays light; preloadApps() warms them in idle time.
const loaders = {
  finder: () => import('./Finder'),
  safari: () => import('./Safari'),
  terminal: () => import('./Terminal'),
  mail: () => import('./Mail'),
  notes: () => import('./Notes'),
  projects: () => import('./Projects'),
  vscode: () => import('./VSCode'),
  settings: () => import('./Settings'),
  resume: () => import('./Resume'),
  misc: () => import('./Misc'),
  util: () => import('./Utilities'),
}
const pick = (key, name) => lazy(() => loaders[key]().then((m) => ({ default: name ? m[name] : m.default })))

export const apps = {
  finder: pick('finder'), safari: pick('safari'), terminal: pick('terminal'), mail: pick('mail'), notes: pick('notes'),
  projects: pick('projects'), vscode: pick('vscode'), settings: pick('settings'), resume: pick('resume'),
  photos: pick('misc', 'Photos'), calculator: pick('misc', 'Calculator'), about: pick('misc', 'AboutMac'),
  calendar: pick('util', 'Calendar'), clock: pick('util', 'Clock'), weather: pick('util', 'Weather'),
}

export function preloadApps() {
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1200))
  idle(() => Object.values(loaders).forEach((l) => l().catch(() => {})))
}
