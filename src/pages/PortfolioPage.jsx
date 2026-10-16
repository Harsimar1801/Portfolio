import { useEffect, useRef, useState } from 'react'
import PortfolioSection from '../components/PortfolioSection.jsx'
import DialogueBox from '../components/DialogueBox.jsx'
import ProjectArchive from '../components/ProjectArchive.jsx'
import { projects } from '../data/projects.js'
import { profile } from '../data/profile.js'
import { navigation } from '../data/navigation.js'

export default function PortfolioPage({ selectedProject, onSelectProject, activeSection, onSelectSection, onClose }) {
  const closeButton = useRef(null)
  const scrollArea = useRef(null)
  const tabs = useRef(null)
  useEffect(() => {
    const tab = tabs.current?.querySelector('[aria-current="page"]')
    if (tab && tabs.current) tabs.current.scrollLeft = Math.max(0, tab.offsetLeft - tabs.current.offsetLeft - (tabs.current.clientWidth - tab.offsetWidth) / 2)
  }, [activeSection])
  const [displayedSection, setDisplayedSection] = useState(activeSection)
  const [phase, setPhase] = useState('idle')
  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    let swapTimer, finishTimer
    const finish = () => { setDisplayedSection(activeSection); setPhase('idle') }
    const onPreference = () => { if (media.matches) { clearTimeout(swapTimer); clearTimeout(finishTimer); finish() } }
    if (media?.matches || activeSection === displayedSection) finish()
    else {
      setPhase('out')
      swapTimer = setTimeout(() => {
        setDisplayedSection(activeSection)
        setPhase('in')
      }, 100)
      finishTimer = setTimeout(() => setPhase('idle'), 240)
    }
    media?.addEventListener?.('change', onPreference)
    return () => { clearTimeout(swapTimer); clearTimeout(finishTimer); media?.removeEventListener?.('change', onPreference) }
    // Each requested destination owns its timers; a newer request cancels them.
  }, [activeSection])
  const section = navigation.find((item) => item.id === displayedSection) ?? navigation[0]
  const isArchive = section.id === 'projects'

  useEffect(() => { closeButton.current?.focus() }, [])
  useEffect(() => { scrollArea.current?.scrollTo?.(0, 0) }, [displayedSection])
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return <div className={`portfolio-backdrop${isArchive ? ' archive-backdrop' : ''}`} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className="portfolio-overlay" role="dialog" aria-modal="true" aria-labelledby="portfolio-title">
      <header className="portfolio-overlay-header">
        <div><span className="portfolio-overline">PLAYER FILE / {profile.education.toUpperCase()}</span><h1 id="portfolio-title">{isArchive ? 'PROJECT ARCHIVE' : section.label}<span>_</span></h1><p>{profile.name} · {profile.role}</p></div>
        <button ref={closeButton} type="button" onClick={onClose} aria-label="Close section and return to town">×</button>
      </header>
      <nav ref={tabs} className="portfolio-tabs" aria-label="Portfolio sections">{navigation.map((item) => <button key={item.id} type="button" className={activeSection === item.id ? 'active' : ''} aria-current={activeSection === item.id ? 'page' : undefined} onClick={() => onSelectSection(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
      <div className={`portfolio-stage stage-${phase}`} inert={phase === 'out' ? true : undefined}>
      {isArchive ? <ProjectArchive selectedProject={selectedProject} onSelectProject={onSelectProject} projects={projects} keyboardEnabled={phase !== 'out'} /> : <><DialogueBox key={section.id} text={section.dialogue} label={section.label} />
      <div className="portfolio-scroll" ref={scrollArea}>
        <PortfolioSection key={section.id} section={section} />
        <p className="portfolio-end">END OF FILE <span>✦</span> {new Date().getFullYear()} {profile.name}</p>
      </div></>}
      </div>
    </section>
  </div>
}
