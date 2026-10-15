import { useEffect, useRef } from 'react'
import ProjectArchive from './ProjectArchive.jsx'
import { SkillGroups, AchievementList } from './PortfolioCards.jsx'

export default function ExhibitInspection({ exhibit, onClose }) {
  const button=useRef(null)
  useEffect(()=>{button.current?.focus();const key=(event)=>{if(event.target?.closest?.('.milo-panel'))return;if(event.key==='Escape'){event.preventDefault();event.stopImmediatePropagation();onClose()}}
    window.addEventListener('keydown',key,true);return()=>window.removeEventListener('keydown',key,true)
  },[onClose])
  return <div className="exhibit-backdrop"><section className="exhibit-panel portfolio-overlay" role="dialog" aria-modal="true" aria-labelledby="exhibit-title">
    <header className="portfolio-overlay-header"><div><span className="portfolio-overline">EXHIBITION VIEW / {exhibit.section.toUpperCase()}</span><h1 id="exhibit-title">{exhibit.title}</h1><p>Inspecting a room exhibit</p></div><button ref={button} onClick={onClose} aria-label="Close exhibit">×</button></header>
    {exhibit.type==='project' ? <ProjectArchive projects={[exhibit.project]}/> : <div className="portfolio-scroll">
      {exhibit.type==='skills' ? <SkillGroups skills={exhibit.skills}/> : exhibit.type==='achievement' ? <AchievementList achievements={[exhibit.achievement]}/> : <><p className="exhibit-copy">{exhibit.text}</p><div className="archive-links">{exhibit.links?.map((link)=><a key={link.label} href={link.url} target="_blank" rel="noopener noreferrer">{link.label} ↗</a>)}</div>{exhibit.links?.length===0&&<p>Contact links haven’t been added yet.</p>}</>}
    </div>}
    <footer className="exhibit-footer">ESC / CLOSE · RETURN TO YOUR PLACE</footer>
  </section></div>
}
