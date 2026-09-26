/* small UI glyphs (SF Symbols-like) */
const P = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' }
export const Glyph = {
  wifi: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M2.5 9.5a14 14 0 0 1 19 0M5.8 12.9a9.3 9.3 0 0 1 12.4 0M9.1 16.2a4.6 4.6 0 0 1 5.8 0" {...P} strokeWidth="2" /><circle cx="12" cy="19.2" r="1.5" fill="currentColor" /></svg>
  ),
  search: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><circle cx="10.5" cy="10.5" r="6.5" {...P} strokeWidth="2" /><path d="M15.5 15.5L20.5 20.5" {...P} strokeWidth="2.2" /></svg>),
  control: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" {...p}><rect x="3" y="4.5" width="18" height="6.5" rx="3.25" {...P} /><circle cx="17.7" cy="7.75" r="1.9" fill="currentColor" /><rect x="3" y="13" width="18" height="6.5" rx="3.25" {...P} /><circle cx="6.3" cy="16.25" r="1.9" fill="currentColor" /></svg>
  ),
  bluetooth: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9" {...P} strokeWidth="2" /></svg>),
  airdrop: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M5.6 17.5a9 9 0 1 1 12.8 0M8.5 14.8a5 5 0 1 1 7 0" {...P} strokeWidth="2" /><path d="M12 12.5v8" {...P} strokeWidth="2" /></svg>),
  moon: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" fill="currentColor" /></svg>),
  sun: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><circle cx="12" cy="12" r="4.2" fill="currentColor" /><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6" {...P} strokeWidth="2" /></svg>),
  speaker: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" {...P} strokeWidth="2" /></svg>),
  back: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M14.5 5.5L8 12l6.5 6.5" {...P} strokeWidth="2.2" /></svg>),
  fwd: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M9.5 5.5L16 12l-6.5 6.5" {...P} strokeWidth="2.2" /></svg>),
  reload: (p) => (<svg viewBox="0 0 24 24" width="14" height="14" {...p}><path d="M19 12a7 7 0 1 1-2.05-4.95M19 4.5V9h-4.5" {...P} strokeWidth="2" /></svg>),
  lock: (p) => (<svg viewBox="0 0 24 24" width="12" height="12" {...p}><rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" {...P} strokeWidth="2.2" /></svg>),
  share: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M12 3.5v11M8 7.5l4-4 4 4M7 11H5.5v9.5h13V11H17" {...P} /></svg>),
  plus: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M12 5v14M5 12h14" {...P} strokeWidth="2" /></svg>),
  sidebar: (p) => (<svg viewBox="0 0 24 24" width="17" height="17" {...p}><rect x="3" y="5" width="18" height="14" rx="3" {...P} /><path d="M9.5 5v14" {...P} /></svg>),
  grid: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" {...P} /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" {...P} /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" {...P} /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" {...P} /></svg>),
  list: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><path d="M8.5 6.5H20M8.5 12H20M8.5 17.5H20" {...P} /><circle cx="4.5" cy="6.5" r="1.2" fill="currentColor" /><circle cx="4.5" cy="12" r="1.2" fill="currentColor" /><circle cx="4.5" cy="17.5" r="1.2" fill="currentColor" /></svg>),
  compose: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M12 4.5H6.5a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V12" {...P} /><path d="M17.8 3.8a1.8 1.8 0 0 1 2.5 2.5L12 14.6l-3.3.8.8-3.3z" {...P} /></svg>),
  send: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M4 11.5L20 4l-6.5 16-2.3-6.2z" {...P} /><path d="M11.2 13.8L20 4" {...P} /></svg>),
  trash: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M5 7h14M9.5 7V5h5v2M7 7l.8 12.5h8.4L17 7" {...P} /></svg>),
  star: (p) => (<svg viewBox="0 0 24 24" width="13" height="13" {...p}><path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8l-5.4 2.9 1.2-5.9L3.4 9.7l6-.7z" fill="currentColor" /></svg>),
  fork: (p) => (<svg viewBox="0 0 24 24" width="13" height="13" {...p}><circle cx="6.5" cy="5" r="2" {...P} strokeWidth="2" /><circle cx="17.5" cy="5" r="2" {...P} strokeWidth="2" /><circle cx="12" cy="19" r="2" {...P} strokeWidth="2" /><path d="M6.5 7v2a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3V7M12 12v5" {...P} strokeWidth="2" /></svg>),
  ext: (p) => (<svg viewBox="0 0 24 24" width="13" height="13" {...p}><path d="M14 4.5h5.5V10M19.5 4.5L11 13M18 14v4.5a1 1 0 0 1-1 1H5.5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1H10" {...P} strokeWidth="2" /></svg>),
  power: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M12 3v8.5M7 5.8a8 8 0 1 0 10 0" {...P} strokeWidth="2.2" /></svg>),
  restart: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3M4.5 4v4.5H9" {...P} strokeWidth="2.2" /></svg>),
  expand: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" {...P} strokeWidth="2" /></svg>),
  shrink: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M9 4v5H4M15 4v5h5M9 20v-5H4M15 20v-5h5" {...P} strokeWidth="2" /></svg>),
  sleep: (p) => (<svg viewBox="0 0 24 24" width="18" height="18" {...p}><path d="M19 14.5A7.5 7.5 0 1 1 9.5 5a6 6 0 0 0 9.5 9.5z" {...P} strokeWidth="2" /></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" width="16" height="16" {...p}><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" {...P} strokeWidth="2.4" /></svg>),
  copy: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><rect x="8.5" y="8.5" width="11" height="11" rx="2.5" {...P} /><path d="M15.5 8.5V6a1.5 1.5 0 0 0-1.5-1.5H6A1.5 1.5 0 0 0 4.5 6v8A1.5 1.5 0 0 0 6 15.5h2.5" {...P} /></svg>),
  zoomIn: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><circle cx="10.5" cy="10.5" r="6.5" {...P} strokeWidth="2" /><path d="M15.5 15.5L20.5 20.5M8 10.5h5M10.5 8v5" {...P} strokeWidth="2" /></svg>),
  zoomOut: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><circle cx="10.5" cy="10.5" r="6.5" {...P} strokeWidth="2" /><path d="M15.5 15.5L20.5 20.5M8 10.5h5" {...P} strokeWidth="2" /></svg>),
  print: (p) => (<svg viewBox="0 0 24 24" width="15" height="15" {...p}><path d="M7 9V4h10v5M7 17H5a1.5 1.5 0 0 1-1.5-1.5v-5A1.5 1.5 0 0 1 5 9h14a1.5 1.5 0 0 1 1.5 1.5v5A1.5 1.5 0 0 1 19 17h-2M7 14h10v6H7z" {...P} /></svg>),
}
