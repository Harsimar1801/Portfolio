import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile.js'
import { playUiTone } from '../game/sound.js'

const menu = [
  { label: 'New Game', action: 'new' },
  { label: 'View Portfolio', action: 'portfolio' },
  { label: 'Settings', action: 'settings' },
]

export default function TitleScreen({ onNewGame, onPortfolio, soundEnabled, onToggleSound, disabled = false }) {
  const [selected, setSelected] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const buttons = useRef([])
  const settingsButton = useRef(null)
  const settingsClose = useRef(null)
  const settingsBack = useRef(null)

  function closeSettings() {
    setSettingsOpen(false)
    buttons.current[2]?.focus()
  }

  function choose(action) {
    if (action === 'new') onNewGame()
    if (action === 'portfolio') onPortfolio()
    if (action === 'settings') { playUiTone(soundEnabled, 'select'); setSettingsOpen(true) }
  }

  useEffect(() => { if (settingsOpen) settingsButton.current?.focus() }, [settingsOpen])

  useEffect(() => {
    function onKeyDown(event) {
      if (disabled) return
      if (settingsOpen) {
        if (event.key === 'Escape') closeSettings()
        if (event.key === 'Tab') {
          const focusables = [settingsClose.current, settingsButton.current, settingsBack.current]
          const current = focusables.indexOf(document.activeElement)
          const next = (current + (event.shiftKey ? 2 : 1)) % focusables.length
          event.preventDefault()
          focusables[next]?.focus()
        }
        return
      }
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') {
        event.preventDefault()
        const next = (selected + 1) % menu.length
        setSelected(next)
        buttons.current[next]?.focus()
        playUiTone(soundEnabled)
      } else if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') {
        event.preventDefault()
        const next = (selected - 1 + menu.length) % menu.length
        setSelected(next)
        buttons.current[next]?.focus()
        playUiTone(soundEnabled)
      } else if (event.key === 'Enter' && !(event.target instanceof HTMLButtonElement)) {
        event.preventDefault()
        choose(menu[selected].action)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selected, settingsOpen, soundEnabled, onNewGame, onPortfolio, disabled])

  return (
    <main className="title-screen">
      <div className="title-art" aria-hidden="true" />
      <div className="title-stars" aria-hidden="true" />
      <div className="title-vignette" aria-hidden="true" />
      <div className="title-topline"><span>{profile.name.split(' ').map((part) => part[0]).join('')}_ / PLAYER ONE</span><span>V 01.00</span></div>
      <div className="title-content">
        <p className="title-prelude">A WORLD BUILT BY {profile.name.toUpperCase()}</p>
        <h1>HARSIMAR<span>.EXE</span></h1>
        <p className="title-subtitle">THE DEVELOPER QUEST</p>
        <div className="title-rule"><span>✦</span></div>
        <nav className="title-menu" aria-label="Title menu">
          {menu.map((item, index) => <button
            key={item.action}
            type="button"
            ref={(element) => { buttons.current[index] = element }}
            className={selected === index ? 'selected' : ''}
            onMouseEnter={() => setSelected(index)}
            onFocus={() => setSelected(index)}
            onClick={() => choose(item.action)}
          ><span className="menu-pointer" aria-hidden="true">▶</span>{item.label}<span className="menu-end" aria-hidden="true">{index === 0 ? '01' : index === 1 ? '02' : '03'}</span></button>)}
        </nav>
        <p className="title-hint">↑ ↓ SELECT <span>·</span> ENTER CONFIRM</p>
      </div>
      <div className="title-bottomline"><span>✦ NO SAVE DATA REQUIRED</span><span>EST. 2026 / {profile.education.toUpperCase()}</span></div>

      {settingsOpen && <div className="settings-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeSettings() }}>
        <section className="settings-panel" role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className="settings-top"><span>OPTIONS / 01</span><button ref={settingsClose} type="button" onClick={closeSettings} aria-label="Close settings">×</button></div>
          <h2 id="settings-title">Settings</h2>
          <p>Keep the journey quiet, or turn on small interface sounds.</p>
          <button className="sound-toggle" ref={settingsButton} type="button" role="switch" aria-checked={soundEnabled} onClick={onToggleSound}>
            <span>Sound effects</span><span className={soundEnabled ? 'sound-state on' : 'sound-state'}>{soundEnabled ? 'ON' : 'OFF'}</span>
          </button>
          <button ref={settingsBack} className="settings-back" type="button" onClick={closeSettings}>← BACK TO MENU</button>
        </section>
      </div>}
    </main>
  )
}
