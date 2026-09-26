// Time in any IANA timezone (or local when tz is omitted)
export function tzTime(tz, now = new Date()) {
  if (!tz) return { h: now.getHours(), m: now.getMinutes(), s: now.getSeconds() }
  const p = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: tz, hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false }).formatToParts(now).map((x) => [x.type, x.value]))
  return { h: +p.hour % 24, m: +p.minute, s: +p.second }
}

export default function AnalogClock({ h, m, s, night }) {
  const mm = m + s / 60, hh = (h % 12) + mm / 60
  return (
    <svg viewBox="0 0 100 100" className={`analog${night ? ' night' : ''}`}>
      <circle cx="50" cy="50" r="46" className="face" />
      {Array.from({ length: 12 }, (_, i) => (
        <text key={i} x={50 + 34 * Math.sin((i + 1) * Math.PI / 6)} y={50 - 34 * Math.cos((i + 1) * Math.PI / 6) + 4.2} textAnchor="middle" className="num">{i + 1}</text>
      ))}
      <line x1="50" y1="50" x2="50" y2="28" className="hand h" transform={`rotate(${hh * 30} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="17" className="hand m" transform={`rotate(${mm * 6} 50 50)`} />
      <line x1="50" y1="58" x2="50" y2="14" className="hand s" transform={`rotate(${s * 6} 50 50)`} />
      <circle cx="50" cy="50" r="2.6" className="pin" />
    </svg>
  )
}
