const directions = [
  { id: 'up', label: 'Move up', glyph: '▲' },
  { id: 'left', label: 'Move left', glyph: '◀' },
  { id: 'right', label: 'Move right', glyph: '▶' },
  { id: 'down', label: 'Move down', glyph: '▼' },
]

export default function TouchControls({ onDirectionChange, onInteract, disabled = false }) {
  function press(event, direction) {
    event.preventDefault()
    event.currentTarget.setPointerCapture?.(event.pointerId)
    onDirectionChange(direction, true)
  }

  function release(event, direction) {
    event.preventDefault()
    onDirectionChange(direction, false)
  }

  return <div className={`touch-controls${disabled ? ' is-disabled' : ''}`} aria-label="Touch game controls" aria-hidden={disabled}>
    <div className="touch-dpad" role="group" aria-label="Move player">
      {directions.map((direction) => <button key={direction.id} type="button" className={`touch-direction touch-${direction.id}`} aria-label={direction.label} disabled={disabled} onPointerDown={(event) => press(event, direction.id)} onPointerUp={(event) => release(event, direction.id)} onPointerCancel={(event) => release(event, direction.id)} onLostPointerCapture={(event) => release(event, direction.id)} onBlur={() => onDirectionChange(direction.id, false)}>{direction.glyph}</button>)}
    </div>
    <button type="button" className="touch-interact" onClick={onInteract} disabled={disabled} aria-label="Interact with nearby building">INTERACT<span>E</span></button>
  </div>
}
