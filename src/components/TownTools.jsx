import { BUILDINGS, CRYSTALS, WORLD } from '../game/townMap.js'

function ToolPanel({ id, title, onClose, children }) {
  return <aside className="town-tool-panel game-hud" id={id} aria-label={title}>
    <div className="town-tool-heading"><h2>{title}</h2><button type="button" onClick={onClose} aria-label={`Close ${title}`}>×</button></div>
    {children}
  </aside>
}

export function QuestPanel({ visited, onOpenSection, onClose }) {
  return <ToolPanel id="town-quest" title="FIELD GUIDE" onClose={onClose}>
    <p className="town-tool-lead">Explore the five buildings to discover each portfolio section. No collection is required.</p>
    <div className="quest-progress"><span>EXPLORE THE TOWN</span><strong>{visited.length} / {BUILDINGS.length}</strong></div>
    <progress value={visited.length} max={BUILDINGS.length} aria-label="Portfolio sections visited" />
    <div className="town-tool-list">{BUILDINGS.map((building, index) => <button type="button" key={building.id} onClick={() => onOpenSection(building.id)}>
      <span>{String(index + 1).padStart(2, '0')}</span><span>{building.name}</span><span className={visited.includes(building.id) ? 'found' : ''}>{visited.includes(building.id) ? '✓' : '◇'}</span>
    </button>)}</div>
  </ToolPanel>
}

export function MapPanel({ onOpenSection, onClose }) {
  return <ToolPanel id="town-map" title="TOWN MAP" onClose={onClose}>
    <p className="town-tool-lead">Five locations around the clock plaza. Select any marker to open its section.</p>
    <div className="town-map" role="group" aria-label="Five portfolio locations">
      <span className="town-map-river" aria-hidden="true" />
      <span className="town-map-plaza" aria-hidden="true">✦</span>
      {BUILDINGS.map((building, index) => <button type="button" key={building.id} className="town-map-marker" style={{ left: `${((building.x + building.w / 2) / WORLD.width) * 100}%`, top: `${((building.y + building.h / 2) / WORLD.height) * 100}%` }} onClick={() => onOpenSection(building.id)} aria-label={`Open ${building.name}`} title={building.name}>{String(index + 1).padStart(2, '0')}</button>)}
    </div>
    <div className="town-map-key">{BUILDINGS.map((building, index) => <button type="button" key={building.id} onClick={() => onOpenSection(building.id)}><span>{String(index + 1).padStart(2, '0')}</span>{building.name}</button>)}</div>
  </ToolPanel>
}

export function InventoryPanel({ collected, onClose }) {
  return <ToolPanel id="town-inventory" title="INVENTORY" onClose={onClose}>
    <p className="town-tool-lead">Optional crystals found while walking through town.</p>
    <div className="inventory-count">CRYSTALS <strong>{collected.length} / {CRYSTALS.length}</strong></div>
    {collected.length ? <ul className="inventory-list">{CRYSTALS.filter((crystal) => collected.includes(crystal.id)).map((crystal) => <li key={crystal.id}><span className="inventory-crystal" aria-hidden="true">◆</span>{crystal.name}</li>)}</ul> : <p className="inventory-empty">Your bag is empty. Walk over a crystal to collect it.</p>}
  </ToolPanel>
}
