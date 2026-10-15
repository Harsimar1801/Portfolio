let context

// Tiny original UI tones; audio is created only after a visitor enables sound.
export function playUiTone(enabled, kind = 'move') {
  if (!enabled || typeof window === 'undefined') return
  const AudioContext = window.AudioContext || window.webkitAudioContext
  if (!AudioContext) return
  try {
    context ||= new AudioContext()
    if (context.state === 'suspended') context.resume()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    const now = context.currentTime
    oscillator.type = 'square'
    const notes = kind === 'collect' ? [659, 880] : kind === 'select' ? [523, 659] : [392, 440]
    oscillator.frequency.setValueAtTime(notes[0], now)
    oscillator.frequency.setValueAtTime(notes[1], now + 0.055)
    gain.gain.setValueAtTime(0.018, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
    oscillator.connect(gain).connect(context.destination)
    oscillator.start(now)
    oscillator.stop(now + 0.12)
  } catch {
    // Browsers without Web Audio simply remain silent.
  }
}
