import { useState } from 'react'

// Page-session preference only: a reload offers the guide again.
let minimized = null

export default function ControlsGuide() {
  const [collapsed, setCollapsed] = useState(() => minimized ?? Boolean(window.matchMedia?.('(pointer: coarse), (max-width: 620px), (max-width: 950px) and (max-height: 500px)').matches))
  return <aside className={`controls-guide${collapsed ? ' is-collapsed' : ''}`} aria-label="Exploration controls">
    <button type="button" aria-expanded={!collapsed} aria-controls="exploration-instructions"
      onClick={() => { minimized = !collapsed; setCollapsed(minimized) }}>
      <span>HOW TO EXPLORE</span><span aria-hidden="true">{collapsed ? '+' : '−'}</span>
    </button>
    {!collapsed && <div id="exploration-instructions">
      <dl className="guide-desktop">
        <div><dt>Move</dt><dd>WASD or Arrow Keys</dd></div>
        <div><dt>Interact</dt><dd>E or Space</dd></div>
        <div><dt>Enter a house</dt><dd>Walk to the entrance + E, or click the house</dd></div>
        <div><dt>View résumé</dt><dd>Approach the World Clock + E</dd></div>
        <div><dt>Return to spawn</dt><dd>R</dd></div>
        <div><dt>Close a panel</dt><dd>Escape</dd></div>
      </dl>
      <p className="guide-mobile">Move with the D-pad. Tap INTERACT near an entrance or the World Clock. You can also tap a house to enter. Use × to close panels and EXIT ROOM to leave.</p>
      <p className="guide-shortcut">Prefer browsing? Use Portfolio / Sections above.</p>
    </div>}
  </aside>
}
