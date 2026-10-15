import { useEffect, useRef, useState } from 'react'

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export default function DialogueBox({ text, label }) {
  const [visibleLength, setVisibleLength] = useState(() => prefersReducedMotion() ? text.length : 0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setVisibleLength(text.length)
      return undefined
    }
    setVisibleLength(0)
    let length = 0
    timerRef.current = window.setInterval(() => {
      length = Math.min(text.length, length + 2)
      setVisibleLength(length)
      if (length === text.length) window.clearInterval(timerRef.current)
    }, 28)
    return () => window.clearInterval(timerRef.current)
  }, [text])

  function skip() {
    window.clearInterval(timerRef.current)
    setVisibleLength(text.length)
  }

  return <div className="rpg-dialogue">
    <span className="rpg-dialogue-name">{label}</span>
    <p aria-hidden="true">{text.slice(0, visibleLength)}<span className="rpg-dialogue-cursor" /></p>
    <span className="visually-hidden">{text}</span>
    {visibleLength < text.length && <button type="button" onClick={skip} aria-label="Skip dialogue animation">SKIP ▸</button>}
  </div>
}
