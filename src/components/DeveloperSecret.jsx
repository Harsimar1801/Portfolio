import { useEffect, useRef } from 'react'
import { profile } from '../data/profile.js'

const code = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a']

export default function DeveloperSecret({ blocked, open, onChange }) {
  const closeButton = useRef(null)
  useEffect(() => {
    if (open) closeButton.current?.focus()
  }, [open])
  useEffect(() => {
    let buffer = [], lastKey = 0, triggered = false
    const reset = () => { buffer = []; lastKey = 0 }
    const close = () => {
      onChange(false)
      requestAnimationFrame(() => document.querySelector('.game-canvas')?.focus())
    }
    const keydown = (event) => {
      if (open) {
        if (event.key === 'Tab') { event.preventDefault(); closeButton.current?.focus() }
        if (!event.repeat && (event.key === 'Escape' || event.key === 'Enter')) { event.preventDefault(); event.stopImmediatePropagation(); close() }
        return
      }
      if (blocked || triggered || event.target?.closest?.('input, textarea, select, button, a, [contenteditable], [role="dialog"]') || event.ctrlKey || event.altKey || event.metaKey) { reset(); return }
      if (event.repeat) return
      if (Date.now() - lastKey > 3000) reset()
      lastKey = Date.now()
      buffer.push(event.key.toLowerCase())
      while (buffer.length && !buffer.every((key, index) => key === code[index])) buffer.shift()
      if (buffer.length === code.length) {
        triggered = true
        reset()
        // Consume only the completing A so it cannot start a stray left step.
        event.preventDefault()
        event.stopImmediatePropagation()
        onChange(true)
      }
    }
    window.addEventListener('keydown', keydown, true)
    window.addEventListener('blur', reset)
    return () => { window.removeEventListener('keydown', keydown, true); window.removeEventListener('blur', reset) }
  }, [blocked, open, onChange])
  if (!open) return null
  return <div className="secret-backdrop"><section className="secret-terminal" role="dialog" aria-modal="true" aria-labelledby="secret-title">
    <div className="secret-topline"><span>HS:// HIDDEN TERMINAL</span><span aria-hidden="true">■ ■ □</span></div>
    <div className="secret-pixel" aria-hidden="true">&gt;_</div>
    <p className="secret-accepted">CHEAT CODE ACCEPTED</p>
    <h2 id="secret-title">DEVELOPER MODE<br />UNLOCKED</h2>
    <div className="secret-fact"><span>DEVELOPER FILE / 01</span><p>{profile.name} · {profile.role} at {profile.education}.</p></div>
    <p className="secret-note">You found the hidden shortcut. Keep exploring.</p>
    <button ref={closeButton} onClick={() => { onChange(false); requestAnimationFrame(() => document.querySelector('.game-canvas')?.focus()) }}>RETURN TO TOWN <span>↵</span></button>
    <small>ENTER / ESC TO RESUME</small>
  </section></div>
}
