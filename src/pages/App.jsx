import { useCallback, useState } from 'react'
import BootIntro from '../components/BootIntro.jsx'
import TitleScreen from '../components/TitleScreen.jsx'
import GamePage from './GamePage.jsx'
import PortfolioCat from '../components/PortfolioCat.jsx'
import { navigation } from '../data/navigation.js'
import { playUiTone } from '../game/sound.js'

function initialSection() {
  if (typeof window === 'undefined') return null
  return navigation.find((item) => window.location.hash === `#${item.id}`)?.id ?? null
}

export default function App() {
  const [directSection] = useState(initialSection)
  const [bootComplete, setBootComplete] = useState(Boolean(directSection))
  const finishBoot = useCallback(() => setBootComplete(true), [])
  const [chatOpen, setChatOpen] = useState(false)
  const [screen, setScreen] = useState(directSection ? 'game' : 'title')
  const [portfolioOpen, setPortfolioOpen] = useState(Boolean(directSection))
  const [selectedSection, setSelectedSection] = useState(directSection ?? 'about')
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return typeof window !== 'undefined' && window.localStorage.getItem('harsimar-sound') === 'on' } catch { return false }
  })

  function openGame() {
    playUiTone(soundEnabled, 'select')
    setPortfolioOpen(false)
    setScreen('game')
  }

  function openPortfolio(id = 'about') {
    playUiTone(soundEnabled, 'select')
    setSelectedSection(id)
    setPortfolioOpen(true)
    setScreen('game')
  }

  function openTitle() {
    playUiTone(soundEnabled, 'select')
    setPortfolioOpen(false)
    setScreen('title')
  }

  function closePortfolio() {
    setPortfolioOpen(false)
    requestAnimationFrame(() => document.querySelector('.game-canvas')?.focus())
  }

  function toggleSound() {
    const next = !soundEnabled
    setSoundEnabled(next)
    try { window.localStorage.setItem('harsimar-sound', next ? 'on' : 'off') } catch { /* local storage is optional */ }
    playUiTone(next, 'select')
  }

  if (!bootComplete) return <BootIntro onComplete={finishBoot} backdrop={<TitleScreen disabled soundEnabled={soundEnabled} />} />

  return <>{screen === 'title' ? <TitleScreen onNewGame={openGame} onPortfolio={() => openPortfolio()} soundEnabled={soundEnabled} onToggleSound={toggleSound} /> : <GamePage assistantOpen={chatOpen} onTitle={openTitle} onPortfolio={() => openPortfolio()} onSection={openPortfolio} portfolioOpen={portfolioOpen} selectedSection={selectedSection} onSelectSection={setSelectedSection} onClosePortfolio={closePortfolio} soundEnabled={soundEnabled} onToggleSound={toggleSound} />}<PortfolioCat open={chatOpen} onOpenChange={setChatOpen} onNavigate={openPortfolio} /></>
}
