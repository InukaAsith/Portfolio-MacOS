// Window metadata only (no components) so the OS store can import it without cycles.
export const registry = {
  finder: { title: 'Finder', w: 900, h: 580 },
  safari: { title: 'Safari', w: 1040, h: 660 },
  terminal: { title: 'Terminal', w: 740, h: 470, bar: 'short' },
  mail: { title: 'Mail', w: 940, h: 600 },
  notes: { title: 'Notes', w: 860, h: 560 },
  projects: { title: 'Projects', w: 1000, h: 640 },
  vscode: { title: 'Visual Studio Code', w: 980, h: 620, bar: 'short' },
  photos: { title: 'Photos', w: 900, h: 600 },
  calculator: { title: 'Calculator', w: 250, h: 400, fixed: true, bar: 'short' },
  settings: { title: 'System Settings', w: 780, h: 560 },
  resume: { title: 'Preview', w: 760, h: 700 },
  about: { title: 'About This Mac', w: 300, h: 470, fixed: true, bar: 'short' },
  calendar: { title: 'Calendar', w: 860, h: 600 },
  clock: { title: 'Clock', w: 760, h: 520 },
  weather: { title: 'Weather', w: 940, h: 640 },
}

export const dockApps = ['finder', 'launchpad', 'safari', 'terminal', 'mail', 'notes', 'calendar', 'projects', 'vscode', 'photos', 'weather', 'clock', 'calculator', 'settings']
