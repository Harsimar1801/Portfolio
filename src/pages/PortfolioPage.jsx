import { useEffect, useRef } from 'react'
import PortfolioSection from '../components/PortfolioSection.jsx'
import DialogueBox from '../components/DialogueBox.jsx'
import ProjectArchive from '../components/ProjectArchive.jsx'
import { projects } from '../data/projects.js'
import { profile } from '../data/profile.js'
import { navigation } from '../data/navigation.js'

export default function PortfolioPage({ activeSection, onSelectSection, onClose }) {
  const closeButton = useRef(null)
  const scrollArea = useRef(null)
  const section = navigation.find((item) => item.id === activeSection) ?? navigation[0]
  const isArchive = section.id === 'projects'

  useEffect(() => { closeButton.current?.focus() }, [])
  useEffect(() => { scrollArea.current?.scrollTo?.(0, 0) }, [activeSection])
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
      <nav className="portfolio-tabs" aria-label="Portfolio sections">{navigation.map((item) => <button key={item.id} type="button" className={section.id === item.id ? 'active' : ''} aria-current={section.id === item.id ? 'page' : undefined} onClick={() => onSelectSection(item.id)}><span>{item.number}</span>{item.label}</button>)}</nav>
      {isArchive ? <ProjectArchive projects={projects} /> : <><DialogueBox key={section.id} text={section.dialogue} label={section.label} />
      <div className="portfolio-scroll" ref={scrollArea}>
        <PortfolioSection key={section.id} section={section} />
        <p className="portfolio-end">END OF FILE <span>✦</span> {new Date().getFullYear()} {profile.name}</p>
      </div></>}
    </section>
  </div>
}
