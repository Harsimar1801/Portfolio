import { readSession, saveSession } from '../data/visitState.js'
import { roomExhibits } from '../game/interiors.js'
import { resumeExhibit } from '../data/resume.js'
import { useCallback, useEffect, useRef, useState } from 'react'
import ControlsGuide from '../components/ControlsGuide.jsx'
import ExhibitInspection from '../components/ExhibitInspection.jsx'
import GameCanvas from '../components/GameCanvas.jsx'
import TouchControls from '../components/TouchControls.jsx'
import MusicControls from '../components/MusicControls.jsx'
import DeveloperSecret from '../components/DeveloperSecret.jsx'
import { InventoryPanel, MapPanel, QuestPanel } from '../components/TownTools.jsx'
import PortfolioPage from './PortfolioPage.jsx'
import { BUILDINGS, CRYSTALS } from '../game/townMap.js'
import { playUiTone } from '../game/sound.js'
import { profile } from '../data/profile.js'

export default function GamePage({ selectedProject, onSelectProject, onTitle, onPortfolio, onSection, portfolioOpen, selectedSection, onSelectSection, onClosePortfolio, soundEnabled = false, onToggleSound = () => {}, CanvasComponent = GameCanvas, assistantOpen = false }) {
  const [visited, setVisited] = useState([])
  const [collected, setCollected] = useState([])
  const [prompt, setPrompt] = useState('MOVE · WASD / ARROWS / D-PAD')
  const [activeTool, setActiveTool] = useState(null)
  const [secretOpen, setSecretOpen] = useState(false)
  const [room, setRoom] = useState(null)
  const [exhibit, setExhibit] = useState(() => {
    if (portfolioOpen) return null
    const saved = readSession('harsimar-exhibit-v1')
    if (saved?.id === resumeExhibit().id) return resumeExhibit()
    if (!BUILDINGS.some((building) => building.id === saved?.section)) return null
    return roomExhibits(saved.section).find((entry) => entry.id === saved.id) ?? null
  })
  useEffect(() => { saveSession('harsimar-exhibit-v1', exhibit ? { id: exhibit.id, section: exhibit.section } : null) }, [exhibit])
  const [exitRoomSignal, setExitRoomSignal] = useState(0)
  const closeExhibit = useCallback(() => { setExhibit(null); requestAnimationFrame(() => document.querySelector('.game-canvas')?.focus()) }, [])
  const [interactSignal, setInteractSignal] = useState(0)
  const virtualControls = useRef({ up: false, down: false, left: false, right: false })

  useEffect(() => {
    if (portfolioOpen) setExhibit(null)
    if (portfolioOpen && selectedSection) setVisited((current) => current.includes(selectedSection) ? current : [...current, selectedSection])
  }, [portfolioOpen, selectedSection])

  useEffect(() => {
    if (!activeTool || portfolioOpen) return undefined
    const closeOnEscape = (event) => { if (event.key === 'Escape') setActiveTool(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [activeTool, portfolioOpen])

  useEffect(() => {
    if (portfolioOpen || activeTool || assistantOpen || secretOpen || exhibit) {
      for (const direction of ['up', 'down', 'left', 'right']) virtualControls.current[direction] = false
    }
  }, [portfolioOpen, activeTool, assistantOpen, secretOpen, exhibit])

  function openSection(id) {
    if (typeof id === 'object' && id.exhibit) {
      setExhibit(id.exhibit)
      setVisited((current) => current.includes(id.exhibit.section) ? current : [...current, id.exhibit.section])
      return
    }
    setActiveTool(null)
    setVisited((current) => current.includes(id) ? current : [...current, id])
    onSection(id)
  }

  function openPortfolio() {
    setActiveTool(null)
    onPortfolio()
  }

  function collectCrystal(id) {
    setCollected((current) => current.includes(id) ? current : [...current, id])
    playUiTone(soundEnabled, 'collect')
  }

  function toggleTool(name) { setActiveTool((current) => current === name ? null : name) }

  return <main className="game-page" aria-label="Playable pixel town">
    <CanvasComponent onNavigate={openSection} onPrompt={setPrompt} onCollect={collectCrystal} onRoomChange={setRoom} exitRoomSignal={exitRoomSignal} paused={portfolioOpen || assistantOpen || secretOpen || Boolean(exhibit) || Boolean(activeTool)} virtualControls={virtualControls} interactSignal={interactSignal} />

    <header className="game-hud game-hud-top">
      <div className="game-hud-brand"><button type="button" className="game-logo" onClick={onTitle}><span className="desktop-label">HARSIMAR<span>.EXE</span></span><span className="mobile-label">HS<span>_</span></span></button><span>THE DEVELOPER QUEST / {profile.name.split(' ')[0].toUpperCase()}’S TOWN</span></div>
      <div className="game-header-actions">
        <button type="button" onClick={() => toggleTool('quest')} aria-expanded={activeTool === 'quest'} aria-controls="town-quest"><span className="desktop-label">QUEST</span><span className="mobile-label">QUEST</span></button>
        <button type="button" onClick={() => toggleTool('map')} aria-expanded={activeTool === 'map'} aria-controls="town-map">MAP</button>
        <button type="button" onClick={() => toggleTool('inventory')} aria-expanded={activeTool === 'inventory'} aria-controls="town-inventory"><span className="desktop-label">INVENTORY</span><span className="mobile-label">BAG</span></button>
        <button type="button" onClick={onToggleSound} aria-pressed={soundEnabled} aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}><span className="desktop-label">SFX {soundEnabled ? 'ON' : 'OFF'}</span><span className="mobile-label">SFX {soundEnabled ? '●' : '○'}</span></button>
        <MusicControls />
        {room && <button className="room-exit-button" onClick={() => setExitRoomSignal((value) => value+1)}>EXIT ROOM ↩</button>}
        <button type="button" onClick={openPortfolio}><span className="desktop-label">PORTFOLIO ↗</span><span className="mobile-label">SECTIONS</span></button>
        <button type="button" onClick={onTitle} aria-label="Return to main menu"><span className="desktop-label">MAIN MENU ×</span><span className="mobile-label">MENU</span></button>
      </div>
    </header>

    {activeTool === 'quest' && <QuestPanel visited={visited} onOpenSection={openSection} onClose={() => setActiveTool(null)} />}
    {activeTool === 'map' && <MapPanel onOpenSection={openSection} onClose={() => setActiveTool(null)} />}
    {activeTool === 'inventory' && <InventoryPanel collected={collected} onClose={() => setActiveTool(null)} />}

    <TouchControls onDirectionChange={(direction, pressed) => { virtualControls.current[direction] = pressed }} onInteract={() => setInteractSignal((current) => current + 1)} disabled={portfolioOpen || assistantOpen || secretOpen || Boolean(exhibit) || Boolean(activeTool)} />

    <div className="game-hud game-hud-bottom">
      {!portfolioOpen && !assistantOpen && !secretOpen && !exhibit && !activeTool && <ControlsGuide />}
      <div className="game-progress"><span><span aria-hidden="true">◆</span> {collected.length}/{CRYSTALS.length}</span><span>QUEST {visited.length}/{BUILDINGS.length}</span></div>
      <p role="status" aria-live="polite">{prompt}</p>
      <span className="game-hud-controls">WASD / ARROWS TO MOVE</span>
    </div>

    {portfolioOpen && <PortfolioPage selectedProject={selectedProject} onSelectProject={onSelectProject} activeSection={selectedSection} onSelectSection={onSelectSection} onClose={onClosePortfolio} />}
    {exhibit && <ExhibitInspection exhibit={exhibit} onClose={closeExhibit} />}
    <DeveloperSecret blocked={portfolioOpen || assistantOpen || Boolean(room) || Boolean(exhibit) || Boolean(activeTool)} open={secretOpen} onChange={setSecretOpen} />
  </main>
}

