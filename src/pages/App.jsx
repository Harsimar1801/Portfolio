import { useCallback, useEffect, useState } from 'react'
import BootIntro from '../components/BootIntro.jsx'
import TitleScreen from '../components/TitleScreen.jsx'
import GamePage from './GamePage.jsx'
import PortfolioCat from '../components/PortfolioCat.jsx'
import { restoreVisit, parseRoute, saveSession, VISIT_KEY, GAME_KEY } from '../data/visitState.js'
import { playUiTone } from '../game/sound.js'

export default function App({ GameComponent = GamePage }) {
  const [initial] = useState(() => restoreVisit(typeof window === 'undefined' ? '' : window.location.hash))
  const [bootComplete, setBootComplete] = useState(Boolean(initial))
  const finishBoot = useCallback(() => setBootComplete(true), [])
  const [chatOpen, setChatOpen] = useState(false)
  const [screen, setScreen] = useState(initial?.screen ?? 'title')
  const [portfolioOpen, setPortfolioOpen] = useState(Boolean(initial?.section))
  const [selectedSection, setSelectedSection] = useState(initial?.section ?? 'about')
  const [selectedProject, setSelectedProject] = useState(initial?.project ?? null)
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try { return typeof window !== 'undefined' && window.localStorage.getItem('harsimar-sound') === 'on' } catch { return false }
  })

  useEffect(() => {
    if (!bootComplete) return undefined
    const navigate = () => {
      const route = parseRoute(window.location.hash) ?? { screen: 'title', section: null, project: null }
      setSelectedSection(route.section ?? 'about')
      setSelectedProject(route.project)
      setPortfolioOpen(Boolean(route.section))
      setScreen(route.screen)
    }
    window.addEventListener('hashchange', navigate)
    window.addEventListener('popstate', navigate)
    return () => {
      window.removeEventListener('hashchange', navigate)
      window.removeEventListener('popstate', navigate)
    }
  }, [bootComplete])

  useEffect(() => {
    if (!bootComplete) return
    const route = screen === 'title' ? '#title' : portfolioOpen ? `#${selectedSection}${selectedSection === 'projects' && selectedProject ? `/${encodeURIComponent(selectedProject)}` : ''}` : '#town'
    saveSession(VISIT_KEY, { route })
  }, [bootComplete, screen, portfolioOpen, selectedSection, selectedProject])

  function selectProject(id) {
    setSelectedProject(id)
    updateHash(`projects/${encodeURIComponent(id)}`)
  }

  function updateHash(id = '', replace = false) {
    const hash = id ? `#${id}` : ''
    if (window.location.hash === hash) return
    window.history[replace ? 'replaceState' : 'pushState'](null, '', `${window.location.pathname}${window.location.search}${hash}`)
  }

  function selectSection(id) {
    setSelectedSection(id)
    setSelectedProject(null)
    updateHash(id)
  }

  function openGame() {
    saveSession(GAME_KEY, null)
    saveSession('harsimar-exhibit-v1', null)
    updateHash('town')
    playUiTone(soundEnabled, 'select')
    setPortfolioOpen(false)
    setScreen('game')
  }

  function openPortfolio(id = 'about') {
    playUiTone(soundEnabled, 'select')
    selectSection(id)
    setPortfolioOpen(true)
    setScreen('game')
  }

  function openTitle() {
    updateHash('title')
    playUiTone(soundEnabled, 'select')
    setPortfolioOpen(false)
    setScreen('title')
  }

  function closePortfolio() {
    updateHash('town')
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

  return <>{screen === 'title' ? <TitleScreen onNewGame={openGame} onPortfolio={() => openPortfolio()} soundEnabled={soundEnabled} onToggleSound={toggleSound} /> : <GameComponent selectedProject={selectedProject} onSelectProject={selectProject} assistantOpen={chatOpen} onTitle={openTitle} onPortfolio={() => openPortfolio()} onSection={openPortfolio} portfolioOpen={portfolioOpen} selectedSection={selectedSection} onSelectSection={selectSection} onClosePortfolio={closePortfolio} soundEnabled={soundEnabled} onToggleSound={toggleSound} />}<PortfolioCat open={chatOpen} onOpenChange={setChatOpen} onNavigate={openPortfolio} /></>
}
