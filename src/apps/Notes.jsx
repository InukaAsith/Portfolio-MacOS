import { useEffect, useState } from 'react'
import { Glyph } from '../glyphs'
import { profile, interests, beyondCode, whatIDo } from '../data'

const seed = [
  { id: 'welcome', title: 'Welcome 👋', date: 'Today', body: `Welcome to my notes!\n\nThis is a real, editable Notes app type anything. Your changes are saved in your browser only.\n\n☑ Boot the Mac\n☑ Unlock with any password\n☐ Try \`neofetch\` in Terminal\n☐ Open Projects from the Dock\n☐ Press ⌘K for Spotlight\n☐ Say hi via Mail` },
  { id: 'about', title: 'About me', date: 'Today', body: `${profile.name}\n${profile.role}\n\n${profile.bio.join('\n\n')}` },
  { id: 'do', title: 'What I do', date: 'Yesterday', body: whatIDo.map((w) => `${w.icon} ${w.title}\n${w.text}`).join('\n\n') },
  { id: 'drives', title: 'What drives me', date: 'Yesterday', body: interests.map((w) => `${w.icon} ${w.title}   ${w.text}`).join('\n\n') },
  { id: 'beyond', title: 'Beyond code', date: 'Last week', body: beyondCode.map((w) => `${w.icon} ${w.title}   ${w.text}`).join('\n\n') },
  { id: 'now', title: 'Now', date: 'Last week', body: '• Studying for my BSc in Computer Science at UCSC\n• Building hobby projects whenever I get the time\n• Competing in programming contests \n• Making a website that feels like an operating system 😄' },
].map((n) => ({ ...n, body: `${n.title}\n${n.body}` }))

const load = () => { try { return JSON.parse(localStorage.getItem('ia-notes')) || seed } catch { return seed } }

export default function Notes() {
  const [notes, setNotes] = useState(load)
  const [sel, setSel] = useState(notes[0]?.id)
  const [q, setQ] = useState('')
  const [list, setList] = useState(false) // phones: the notes list slides over the note
  useEffect(() => { try { localStorage.setItem('ia-notes', JSON.stringify(notes)) } catch { /* ignore */ } }, [notes])
  const note = notes.find((n) => n.id === sel)
  const shown = notes.filter((n) => `${n.title} ${n.body}`.toLowerCase().includes(q.toLowerCase()))
  const edit = (body) => setNotes((ns) => ns.map((n) => (n.id === sel ? { ...n, body, title: body.split('\n')[0].slice(0, 40) || 'New Note', date: 'Just now' } : n)))
  const add = () => { const id = `n${Date.now()}`; setNotes((ns) => [{ id, title: 'New Note', date: 'Just now', body: '' }, ...ns]); setSel(id) }
  const del = () => { const rest = notes.filter((n) => n.id !== sel); setNotes(rest.length ? rest : seed); setSel((rest[0] || seed[0]).id) }

  return (
    <div className={`app split notes${list ? ' show-list' : ''}`}>
      <aside className="sidebar notes-list" data-drag>
        <div className="notes-search" data-nodrag><Glyph.search /><input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div className="sb-head">Notes</div>
        <div className="scroll">
          {shown.map((n) => (
            <button key={n.id} className={`note-item${sel === n.id ? ' on' : ''}`} onClick={() => { setSel(n.id); setList(false) }}>
              <b>{n.title}</b>
              <span><em>{n.date}</em> {n.body.split('\n').slice(1).join(' ').slice(0, 60)}</span>
            </button>
          ))}
        </div>
      </aside>
      <main className="main">
        <header className="toolbar" data-drag>
          <button className="notes-back" onClick={() => setList(true)}><Glyph.back /> Notes</button>
          <div className="tb-title" />
          <div className="tb-actions">
            <button onClick={del} aria-label="Delete note" title="Delete"><Glyph.trash /></button>
            <button onClick={add} aria-label="New note" title="New note"><Glyph.compose /></button>
          </div>
        </header>
        {note && (
          <div className="note-page">
            <div className="note-date">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
            <textarea value={note.body} onChange={(e) => edit(e.target.value)} spellCheck={false} placeholder="Start typing…" />
          </div>
        )}
      </main>
    </div>
  )
}
