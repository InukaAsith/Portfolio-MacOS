/* Line icons that stand in for emoji. Sized in em so they follow the slot's font-size.
   Usage: <Ico n="star" />  (unknown names render nothing) */
const Y = '#ffd60a'
const W = '#f2f4f8'
const B = '#64d2ff'

const cloud = 'M7 18.5h10.5a4 4 0 0 0 .6-7.95A5.5 5.5 0 0 0 7.6 9.1 4.7 4.7 0 0 0 7 18.5z'
const smallCloud = 'M8 17h9a3.4 3.4 0 0 0 .5-6.77A4.7 4.7 0 0 0 8.6 9.3 4 4 0 0 0 8 17z'
const rays = 'M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4'

const I = {
  // people & places
  user: <><circle cx="12" cy="8" r="3.8" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></>,
  wave: <path d="M8.5 11.5V5.8a1.4 1.4 0 0 1 2.8 0v4.7M11.3 10V4.3a1.4 1.4 0 0 1 2.8 0V10M14.1 10V5.3a1.4 1.4 0 0 1 2.8 0v7.2M8.5 11.5l-1.3-1.7a1.5 1.5 0 0 0-2.4 1.8l3 4.3A7 7 0 0 0 13.6 19h.3a3 3 0 0 0 3-3v-3.5M3.5 6.5a4 4 0 0 1 2-2.8M18.8 17.8a4 4 0 0 1-2.2 2.6" />,
  smile: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14a4.2 4.2 0 0 0 7 0M9.2 9.5v.5M14.8 9.5v.5" /></>,
  pin: <><path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z" /><circle cx="12" cy="10" r="2.3" /></>,
  cap: <><path d="M2.5 9.5L12 5l9.5 4.5L12 14z" /><path d="M6.5 11.5V16c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3v-4.5M21.5 9.5v5" /></>,
  compass: <><circle cx="12" cy="12" r="8.5" /><path d="M15.5 8.5l-2 5-5 2 2-5z" /></>,
  // work
  code: <><path d="M8 7.5L3.5 12 8 16.5M16 7.5l4.5 4.5-4.5 4.5M13.5 5l-3 14" /></>,
  laptop: <><rect x="4.5" y="5" width="15" height="10.5" rx="1.5" /><path d="M2.5 19h19" /></>,
  monitor: <><rect x="3" y="4" width="18" height="12.5" rx="2" /><path d="M9 20.5h6M12 16.5v4" /></>,
  script: <><path d="M7 3.5h8.5L19.5 7.5v13h-12.5z" /><path d="M15 3.5v4.5h4.5M10 12h6.5M10 15.5h6.5" /></>,
  doc: <><path d="M6 3.5h8.5L18.5 7.5v13H6z" /><path d="M14 3.5v4.5h4.5M9 12.5h6.5M9 16h4.5" /></>,
  certificate: <><rect x="3" y="4.5" width="18" height="12" rx="1.5" /><path d="M7 8.5h10M7 12h5" /><circle cx="16.5" cy="15.5" r="2.5" /><path d="M15.2 17.6l-.7 3.4 2-1 2 1-.7-3.4" /></>,
  bot: <><rect x="4.5" y="8" width="15" height="11" rx="3" /><path d="M12 4.5V8M9.5 12.5v1.5M14.5 12.5v1.5M2.5 12.5v3M21.5 12.5v3" /><circle cx="12" cy="4" r="1" /></>,
  database: <><ellipse cx="12" cy="6" rx="7" ry="2.8" /><path d="M5 6v12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8" /></>,
  briefcase: <><rect x="3" y="7" width="18" height="12.5" rx="2" /><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18" /></>,
  package: <><path d="M12 3l8 4.3v9.4L12 21l-8-4.3V7.3z" /><path d="M4 7.3l8 4.4 8-4.4M12 11.7V21M8 5.1l8 4.4" /></>,
  keyboard: <><rect x="2.5" y="6" width="19" height="12" rx="2" /><path d="M6 10h.01M9.3 10h.01M12.6 10h.01M16 10h.01M6 13.5h.01M18 13.5h.01M8.5 14.5h7" /></>,
  thread: <><path d="M7 4h10M7 20h10" /><rect x="8" y="6" width="8" height="12" rx="1" /><path d="M8 9.5l8 2M8 13l8 2" /></>,
  wrench: <path d="M14.7 6.3a4 4 0 0 0 5 5L20.5 12 12 20.5a2.1 2.1 0 0 1-3-3L17.5 9l.7-.7a4 4 0 0 1-3.5-2zM14.7 6.3a4 4 0 0 1 5-3l-2.7 2.7.4 2.3 2.3.4 2.7-2.7a4 4 0 0 1-3 5M4 4l4.5 4.5M3 7l1-1" />,
  rocket: <><path d="M12 15.5l-3.5-3.5c1.5-4.5 4.5-8 11-8.5-.5 6.5-4 9.5-7.5 12z" /><path d="M8.5 12H5l2.5-3.5H11M12 15.5V19l3.5-2.5V13" /><path d="M6.5 16c-1.5.5-2.5 2-2.5 4 2 0 3.5-1 4-2.5" /><circle cx="15" cy="9" r="1.3" /></>,
  puzzle: <path d="M5 8.5h3.2a2 2 0 1 1 3.6 0H15v3.2a2 2 0 1 1 0 3.6V19H11.8a2 2 0 1 0-3.6 0H5v-3.8a2 2 0 1 0 0-3.4z" />,
  film: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14M17 5v14M3 9.5h4M3 14.5h4M17 9.5h4M17 14.5h4" /></>,
  book: <><path d="M12 6.5C10.5 5 8 4.5 4 4.5v13c4 0 6.5.5 8 2 1.5-1.5 4-2 8-2v-13c-4 0-6.5.5-8 2z" /><path d="M12 6.5v13" /></>,
  gamepad: <><path d="M7.5 7h9a4.5 4.5 0 0 1 4.4 5.5l-.9 4a2.5 2.5 0 0 1-4.3 1.1L14.2 16H9.8l-1.5 1.6A2.5 2.5 0 0 1 4 16.5l-.9-4A4.5 4.5 0 0 1 7.5 7z" /><path d="M8 10v3M6.5 11.5h3M15.5 11h.01M17 12.8h.01" /></>,
  chat: <path d="M4 5.5h16v10H10l-4.5 4v-4H4z" />,
  music: <><path d="M9 18V5.5l10-2V16" /><circle cx="6.5" cy="18" r="2.5" /><circle cx="16.5" cy="16" r="2.5" /></>,
  flower: <><circle cx="12" cy="12" r="2.4" /><path d="M12 9.6a3 3 0 1 1 0-6 3 3 0 1 1 0 6zM12 14.4a3 3 0 1 1 0 6 3 3 0 1 1 0-6zM9.6 12a3 3 0 1 1-6 0 3 3 0 1 1 6 0zM14.4 12a3 3 0 1 1 6 0 3 3 0 1 1-6 0z" /></>,
  tv: <><rect x="3" y="7" width="18" height="12.5" rx="2" /><path d="M8 3l4 4 4-4" /></>,
  incognito: <><path d="M3 11h18M6 11l1.5-6h9L18 11" /><circle cx="7.5" cy="16" r="2.7" /><circle cx="16.5" cy="16" r="2.7" /><path d="M10.2 16a2 2 0 0 1 3.6 0" /></>,
  // ui
  star: <path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8l-5.4 2.9 1.2-5.9-4.4-4.1 6-.7z" />,
  fork: <><circle cx="6.5" cy="5" r="2" /><circle cx="17.5" cy="5" r="2" /><circle cx="12" cy="19" r="2" /><path d="M6.5 7v2a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3V7M12 12v5" /></>,
  trophy: <path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8.5 20h7M10 17h4v3h-4z" />,
  medal: <><circle cx="12" cy="15" r="5" /><path d="M8.5 11.5L5.5 3.5h4l2.5 6M15.5 11.5l3-8h-4l-1.2 3.2" /><path d="M12 12.8l.7 1.4 1.5.2-1.1 1 .3 1.5-1.4-.7-1.4.7.3-1.5-1.1-1 1.5-.2z" /></>,
  folder: <path d="M3.5 7a1.5 1.5 0 0 1 1.5-1.5h4.5l2 2H19a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18z" />,
  trash: <path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l1 13h9l1-13M10 11v5.5M14 11v5.5" />,
  mail: <><rect x="3" y="5.5" width="18" height="13" rx="2" /><path d="M3.5 7l8.5 6.5L20.5 7" /></>,
  inbox: <><path d="M3.5 13.5L6 5h12l2.5 8.5V19H3.5z" /><path d="M3.5 13.5H8.5a3.5 3.5 0 0 0 7 0h5" /></>,
  note: <><path d="M13 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h12a1.5 1.5 0 0 0 1.5-1.5v-7" /><path d="M17.8 3.8a1.8 1.8 0 0 1 2.5 2.5L12 14.6l-3.3.8.8-3.3z" /></>,
  sent: <><path d="M3.5 13.5V19h17v-5.5" /><path d="M12 15V4M7.5 8.5L12 4l4.5 4.5" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M12 2.8l1.6 2.5 2.9-.7.7 2.9 2.5 1.6-1.4 2.6 1.4 2.6-2.5 1.6-.7 2.9-2.9-.7L12 21.2l-1.6-2.5-2.9.7-.7-2.9-2.5-1.6 1.4-2.6-1.4-2.6 2.5-1.6.7-2.9 2.9.7z" /></>,
  image: <><rect x="3" y="4.5" width="18" height="15" rx="2" /><circle cx="8.5" cy="9.5" r="1.7" /><path d="M3.5 17.5l5-5 4 4 3-3 5 5" /></>,
  bridge: <><path d="M2.5 16h19M6.5 20V5M17.5 20V5M6.5 6c1.5 4 3.5 6.5 5.5 7.5 2-1 4-3.5 5.5-7.5M2.5 11c2-.5 3.2-2.2 4-5M21.5 11c-2-.5-3.2-2.2-4-5M10 13v3M14 13v3" /></>,
  sparkles: <><path d="M10 3.5l1.6 4.4L16 9.5l-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6z" /><path d="M17.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></>,
  flame: <path d="M12 21a6.5 6.5 0 0 0 6.5-6.5c0-4.5-3.5-6.5-4.5-11-2.5 2-3.5 4.5-3.5 7-1-.5-2-1.8-2.2-3.2C6.6 9.2 5.5 11.5 5.5 14.5A6.5 6.5 0 0 0 12 21zM12 21a2.8 2.8 0 0 1-2.8-2.8c0-2 1.8-3 2.8-4.7 1 1.7 2.8 2.7 2.8 4.7A2.8 2.8 0 0 1 12 21z" />,
  flask: <><path d="M9.5 3.5h5M10 3.5v6L4.8 18a1.8 1.8 0 0 0 1.6 2.5h11.2a1.8 1.8 0 0 0 1.6-2.5L14 9.5v-6" /><path d="M7.2 14.5h9.6" /></>,
  shield: <><path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.3-7.5 9.5-4.3-1.2-7.5-4.9-7.5-9.5V6z" /><path d="M8.8 12l2.2 2.2 4.2-4.4" /></>,
  files: <><path d="M8 3.5h7.5L19.5 7.5V17H8z" /><path d="M15 3.5V8h4.5M5 7v13.5h10.5" /></>,
  search: <><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5l5 5" /></>,
  branch: <><circle cx="6.5" cy="5.5" r="2" /><circle cx="6.5" cy="18.5" r="2" /><circle cx="17.5" cy="7.5" r="2" /><path d="M6.5 7.5v9M17.5 9.5c0 4-4 4.5-11 7" /></>,
  play: <path d="M7 4.5v15l12-7.5z" />,
  extensions: <><rect x="3.5" y="10.5" width="5" height="5" rx="1" /><rect x="3.5" y="15.5" width="5" height="5" rx="1" /><rect x="8.5" y="15.5" width="5" height="5" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" transform="rotate(15 17 7)" /></>,
  droplet: <path d="M12 3.5s6 6.4 6 10.7a6 6 0 0 1-12 0C6 9.9 12 3.5 12 3.5z" />,
  wind: <path d="M3 9h11a2.8 2.8 0 1 0-2.8-2.8M3 13h15.5a2.8 2.8 0 1 1-2.8 2.8M3 17h7" />,
  // weather (tinted)
  sun: <><circle cx="12" cy="12" r="4" fill={Y} stroke={Y} /><path d={rays} stroke={Y} /></>,
  moon: <path d="M19.5 14.5A8 8 0 1 1 9.5 4.5a6.5 6.5 0 0 0 10 10z" fill={W} stroke={W} />,
  'cloud-sun': <><circle cx="9" cy="9" r="3.3" fill={Y} stroke={Y} /><path d="M9 2.8v1.4M2.8 9h1.4M4.6 4.6l1 1M13.4 4.6l-1 1" stroke={Y} /><path d={smallCloud} transform="translate(2 2.5)" fill={W} stroke={W} /></>,
  'cloud-moon': <><path d="M14 4.2A5 5 0 0 0 19.8 10 5 5 0 1 1 14 4.2z" fill={W} stroke={W} opacity=".75" /><path d={smallCloud} transform="translate(-2 3)" fill={W} stroke={W} /></>,
  cloud: <path d={cloud} fill={W} stroke={W} />,
  fog: <><path d="M7 13.5h10.5a3.5 3.5 0 0 0 .5-6.96A5 5 0 0 0 8.4 5.3 4 4 0 0 0 7 13.5z" fill={W} stroke={W} /><path d="M4 17h16M6.5 20.5h11" stroke={W} /></>,
  drizzle: <><path d={cloud} transform="translate(0 -3)" fill={W} stroke={W} /><path d="M9 18.5v1M13 18.5v1M17 18.5v1" stroke={B} /></>,
  rain: <><path d={cloud} transform="translate(0 -3)" fill={W} stroke={W} /><path d="M8.5 18l-1 3M12.5 18l-1 3M16.5 18l-1 3" stroke={B} /></>,
  storm: <><path d={cloud} transform="translate(0 -3)" fill={W} stroke={W} /><path d="M12.5 15.5l-2.5 3.5h3l-2 3.5" stroke={Y} /></>,
}

export function Ico({ n, className = '', ...p }) {
  const g = I[n]
  if (!g) return null
  return (
    <svg viewBox="0 0 24 24" width="1em" height="1em" className={`ico ${className}`} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>{g}</svg>
  )
}
