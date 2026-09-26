import { useEffect, useState } from 'react'
import { useOS } from '../os'
import { Glyph } from '../glyphs'
import { profile, socials } from '../data'
import { Ico } from '../ico'

const inbox = [
  {
    id: 1, from: profile.name, subject: 'Thanks for stopping by', time: 'now', preview: 'Hi there   thanks for checking out my portfolio…',
    body: [
      'Hi there,',
      "Thanks for checking out my portfolio! I'm Inuka   a full-stack developer and Computer Science undergraduate at UCSC, Sri Lanka.",
      "I build backends with Flask and Django, Telegram bots used by thousands of people, and whatever else I find interesting. I'm open to internships, freelance work and collaborations.",
      "Hit Reply (or the compose button) and it'll go straight to my inbox.",
      'Cheers,\nInuka',
    ],
  },
  {
    id: 2, from: 'GitHub', subject: 'Your repositories passed 400 stars', time: 'Yesterday', preview: 'DaisyX and DaisyXMusic keep growing…',
    body: ['Congrats!', 'DaisyXMusic (200+ ★, 800+ forks) and DaisyX (150+ ★, 600+ forks) are still being forked by the community.', '— The GitHub team (well, sort of)'],
  },
  {
    id: 3, from: 'Harvard CS50', subject: 'CS50x certificate issued', time: '2024', preview: 'Congratulations on completing CS50x…',
    body: ["Congratulations on completing CS50's Introduction to Computer Science.", 'This is CS50.'],
  },
]

export default function Mail({ win }) {
  const os = useOS()
  const [box, setBox] = useState('Inbox')
  const [sel, setSel] = useState(1)
  const [compose, setCompose] = useState(!!win.props?.subject)
  const [draft, setDraft] = useState({ from: '', subject: win.props?.subject || '', body: win.props?.body || '' })
  const [sent, setSent] = useState([])
  const [open, setOpen] = useState(false) // phones: a message is pushed over the list

  useEffect(() => {
    if (win.props?.subject) { setCompose(true); setDraft((d) => ({ ...d, subject: win.props.subject, body: win.props.body || d.body })) }
  }, [win.props?.nonce]) // eslint-disable-line

  const send = (e) => {
    e.preventDefault()
    if (!draft.body.trim()) return os.toast({ app: 'mail', title: 'Message is empty', body: 'Write a few words first.' })
    const body = `${draft.body}${draft.from ? `\n\n— ${draft.from}` : ''}`
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(draft.subject || 'Hello from your portfolio')}&body=${encodeURIComponent(body)}`
    setSent((s) => [{ id: Date.now(), from: 'You', subject: draft.subject || 'Hello from your portfolio', time: 'now', preview: draft.body.slice(0, 60), body: [draft.body] }, ...s])
    setDraft({ from: '', subject: '', body: '' })
    setCompose(false)
    setBox('Sent')
    os.toast({ app: 'mail', title: 'Almost there', body: 'Your mail app should open with the message ready   just hit Send.' })
  }

  const list = box === 'Inbox' ? inbox : box === 'Sent' ? sent : []
  const msg = list.find((m) => m.id === sel) || list[0]

  return (
    <div className={`app split mail${open || compose ? ' reading' : ''}`}>
      <aside className="sidebar" data-drag>
        <div className="sb-group">
          <div className="sb-head">Mailboxes</div>
          {[['Inbox', 'inbox', inbox.length], ['Drafts', 'note', 0], ['Sent', 'sent', sent.length]].map(([b, e, n]) => (
            <button key={b} className={`sb-item${box === b && !compose ? ' on' : ''}`} onClick={() => { setBox(b); setCompose(false); setSel(null); setOpen(false) }}><span className="sb-ico"><Ico n={e} /></span>{b}{n > 0 && <span className="sb-count">{n}</span>}</button>
          ))}
        </div>
        <div className="sb-group">
          <div className="sb-head">Reach me</div>
          {socials.map((s) => <button key={s.id} className="sb-item" onClick={() => os.link(s.url)}><span className="sb-ico">↗</span>{s.label}</button>)}
        </div>
      </aside>
      <section className="mail-list">
        <header className="toolbar" data-drag>
          <div className="tb-title left"><b>{box}</b><small>{list.length} messages</small></div>
          <div className="tb-actions"><button onClick={() => setCompose(true)} aria-label="Compose" title="New message"><Glyph.compose /></button></div>
        </header>
        <div className="scroll">
          {list.length === 0 && <p className="muted pad">No messages</p>}
          {list.map((m) => (
            <button key={m.id} className={`mail-item${msg?.id === m.id && !compose ? ' on' : ''}`} onClick={() => { setSel(m.id); setCompose(false); setOpen(true) }}>
              <div className="mi-top"><b>{m.from}</b><small>{m.time}</small></div>
              <div className="mi-subj">{m.subject}</div>
              <div className="mi-prev">{m.preview}</div>
            </button>
          ))}
        </div>
      </section>
      <main className="main mail-read">
        <header className="toolbar" data-drag>
          <button className="mail-back" onClick={() => { setOpen(false); setCompose(false) }}><Glyph.back /> {box}</button>
          <div className="tb-actions">
            {!compose && <button onClick={() => { setCompose(true); setDraft((d) => ({ ...d, subject: msg ? `Re: ${msg.subject}` : '' })) }}>Reply</button>}
          </div>
        </header>
        {compose ? (
          <form className="compose" onSubmit={send}>
            <div className="c-row"><label>To:</label><span className="to-chip">{profile.name} &lt;{profile.email}&gt;</span>
              <button type="button" className="icon-btn" title="Copy address" onClick={() => { navigator.clipboard?.writeText(profile.email); os.toast({ app: 'mail', title: 'Copied', body: profile.email }) }}><Glyph.copy /></button>
            </div>
            <div className="c-row"><label>From:</label><input placeholder="Your name or email (optional)" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></div>
            <div className="c-row"><label>Subject:</label><input placeholder="Hello from your portfolio" value={draft.subject} onChange={(e) => setDraft({ ...draft, subject: e.target.value })} /></div>
            <textarea autoFocus placeholder={`Hi ${profile.first},\n\n`} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} />
            <div className="c-foot">
              <span className="muted">Opens in your mail app   nothing is stored here.</span>
              <button className="btn primary" type="submit"><Glyph.send /> Send</button>
            </div>
          </form>
        ) : msg ? (
          <article className="scroll mail-msg">
            <h2>{msg.subject}</h2>
            <div className="mm-from">
              <span className="avatar-sm">{msg.from === profile.name ? <img src={profile.avatar} alt="" /> : msg.from[0]}</span>
              <div><b>{msg.from}</b><small>To: you · {msg.time}</small></div>
            </div>
            {msg.body.map((p, i) => <p key={i}>{p}</p>)}
          </article>
        ) : <p className="muted pad">No message selected</p>}
      </main>
    </div>
  )
}
