import { useEffect, useRef, useState } from 'react'

export default function MusicControls() {
  const audio = useRef(null)
  const request = useRef(0)
  const [enabled, setEnabled] = useState(false)
  const [volume, setVolume] = useState(25)
  const [error, setError] = useState('')

  useEffect(() => {
    const player = audio.current
    player.volume = 0.25
    return () => {
      request.current++
      player.pause()
      player.removeAttribute('src')
      player.load()
    }
  }, [])

  async function toggle() {
    const player = audio.current
    const attempt = ++request.current
    setError('')
    if (enabled) {
      player.pause()
      player.currentTime = 0
      setEnabled(false)
      return
    }
    // Called directly by a visitor gesture, never from a mount effect.
    player.src ||= '/assets/audio/moonlit-commit.wav'
    setEnabled(true)
    try {
      await player.play()
    } catch {
      if (attempt === request.current) {
        setEnabled(false)
        setError('Music unavailable. Tap to retry.')
      }
    }
  }

  function changeVolume(event) {
    const next = Number(event.target.value)
    setVolume(next)
    audio.current.volume = next / 100
    audio.current.muted = next === 0
  }

  return <div className="music-controls" role="group" aria-label="Background music">
    <audio ref={audio} loop preload="none" aria-label="Town background soundtrack" />
    <button type="button" onClick={toggle} aria-pressed={enabled} aria-label={enabled ? 'Stop background music' : 'Play background music'}>♫ {enabled ? 'ON' : 'OFF'}</button>
    <label>VOL <input aria-label="Music volume" type="range" min="0" max="100" step="5" value={volume} onChange={changeVolume} onKeyDown={(event) => event.stopPropagation()} /></label>
    <output aria-live="polite">{volume === 0 ? 'MUTED' : `${volume}%`}</output>
    {error && <span className="music-error" role="status">{error}</span>}
  </div>
}
