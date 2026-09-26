import { useEffect, useState } from 'react'
import { useOS, wallpaperFor } from '../os'
import { Glyph } from '../glyphs'
import { profile, wallpapers, accents, education, skills, projects, certificates } from '../data'
import { Ico } from '../ico'

const PANES = [['about', 'General', '#8e8e93', <Ico key="g" n="gear" />], ['appearance', 'Appearance', '#1c1c1e', '◐'], ['wallpaper', 'Wallpaper', '#32ade6', <Ico key="w" n="bridge" />], ['dock', 'Desktop & Dock', '#1c1c1e', '▭'], ['display', 'Displays', '#0a84ff', '☀︎']]

function Toggle({ on, onChange }) {
  return <button className={`toggle${on ? ' on' : ''}`} onClick={() => onChange(!on)} role="switch" aria-checked={on}><i /></button>
}

export default function Settings({ win }) {
  const os = useOS()
  const [pane, setPane] = useState(win.props?.pane || 'about')
  useEffect(() => { if (win.props?.pane) setPane(win.props.pane) }, [win.props?.nonce]) // eslint-disable-line
  const title = PANES.find((p) => p[0] === pane)?.[1]

  return (
    <div className="app split settings">
      <aside className="sidebar" data-drag>
        <button className="set-user" onClick={() => setPane('about')}>
          <img src={profile.avatar} alt="" />
          <div><b>{profile.name}</b><small>Portfolio Account</small></div>
        </button>
        <div className="sb-group">
          {PANES.map(([id, t, c, g]) => (
            <button key={id} className={`sb-item${pane === id ? ' on' : ''}`} onClick={() => setPane(id)}>
              <span className="set-ico" style={{ background: c }}>{g}</span>{t}
            </button>
          ))}
        </div>
      </aside>
      <main className="main">
        <header className="toolbar" data-drag><div className="tb-title left"><b>{title}</b></div></header>
        <div className="content scroll set-body">
          {pane === 'about' && (
            <>
              <div className="set-hero">
                <div className="mbp small"><div className="mbp-screen" style={{ backgroundImage: `url(${wallpaperFor(os.wallpaper, os.dark, true) || '/wall/sunset-thumb.webp'})` }} /><div className="mbp-base" /></div>
                <h2>InukaBook Pro</h2>
                <small>{profile.role}</small>
              </div>
              <div className="set-group">
                {[['Name', profile.name], ['Education', `${education[0].title}, ${education[0].org}`], ['Location', profile.location], ['Projects', `${projects.length} shipped`], ['Skills', `${Object.values(skills).flat().length} technologies`], ['Certificates', certificates.map((c) => c.title.split('  ')[0]).join(', ')], ['macOS', 'Golden Gate 26.0']].map(([k, v]) => (
                  <div key={k} className="set-row"><span>{k}</span><span className="muted">{v}</span></div>
                ))}
              </div>
              <div className="set-group">
                <div className="set-row"><span>Résumé</span><button className="btn small" onClick={() => os.open('resume')}>Open</button></div>
                <div className="set-row"><span>Say hello</span><button className="btn small" onClick={() => os.open('mail')}>Compose</button></div>
              </div>
            </>
          )}
          {pane === 'appearance' && (
            <>
              <div className="set-group">
                <div className="set-row col">
                  <span>Appearance</span>
                  <div className="theme-pick">
                    {[['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([id, t]) => (
                      <button key={id} className={os.theme === id ? 'on' : ''} onClick={() => os.set({ theme: id })}>
                        <span className={`tp tp-${id}`}><i /><i /></span>{t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="set-group">
                <div className="set-row">
                  <span>Accent colour</span>
                  <div className="accents">{accents.map((c) => <button key={c} aria-label={c} className={os.accent === c ? 'on' : ''} style={{ background: c }} onClick={() => os.set({ accent: c })} />)}</div>
                </div>
              </div>
            </>
          )}
          {pane === 'wallpaper' && (
            <>
              <div className="wall-current" style={{ background: wallpapers.find((w) => w.id === os.wallpaper)?.css || `url(${wallpaperFor(os.wallpaper, os.dark, true)}) center/cover` }}>
                <span>{wallpapers.find((w) => w.id === os.wallpaper)?.name}</span>
              </div>
              <div className="set-sub">Golden Gate wallpapers were generated for this site. “Dynamic” follows light / dark appearance.</div>
              <div className="wall-grid">
                {wallpapers.map((w) => (
                  <button key={w.id} className={os.wallpaper === w.id ? 'on' : ''} onClick={() => os.set({ wallpaper: w.id })}>
                    <span style={{ background: w.css || `url(${w.thumb}) center/cover` }}>{w.thumb2 && <i style={{ background: `url(${w.thumb2}) center/cover` }} />}</span>
                    {w.name}
                  </button>
                ))}
              </div>
            </>
          )}
          {pane === 'dock' && (
            <div className="set-group">
              <div className="set-row"><span>Size</span><input type="range" min="38" max="72" value={os.dockSize} onChange={(e) => os.set({ dockSize: +e.target.value })} style={{ '--v': `${((os.dockSize - 38) / 34) * 100}%` }} className="set-range" /></div>
              <div className="set-row"><span>Magnification</span><Toggle on={os.magnify} onChange={(v) => os.set({ magnify: v })} /></div>
              <div className="set-row"><span>Show widgets on desktop</span><Toggle on={os.showWidgets} onChange={(v) => os.set({ showWidgets: v })} /></div>
            </div>
          )}
          {pane === 'display' && (
            <div className="set-group">
              <div className="set-row"><span><Glyph.sun /> Brightness</span><input type="range" min="45" max="100" value={os.brightness} onChange={(e) => os.set({ brightness: +e.target.value })} style={{ '--v': `${((os.brightness - 45) / 55) * 100}%` }} className="set-range" /></div>
              <div className="set-row"><span>Resolution</span><span className="muted">{innerWidth} × {innerHeight} · {devicePixelRatio}x</span></div>
              <div className="set-row"><span>Full screen</span><button className="btn small" onClick={() => (document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen?.())}>Toggle</button></div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
