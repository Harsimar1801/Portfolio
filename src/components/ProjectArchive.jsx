import { useEffect, useRef, useState } from 'react'

function ProjectPreview({ project }) {
  const [failed, setFailed] = useState(false)
  return <div className="archive-preview">
    {project.image && !failed ? <img draggable={false} src={project.image} alt={`Preview of ${project.title}`} onError={() => setFailed(true)} /> : <div className="archive-placeholder">
      <svg viewBox="0 0 64 64" width="96" height="96" shapeRendering="crispEdges" aria-hidden="true"><path fill="currentColor" d="M8 10h48v34H36v8h12v4H16v-4h12v-8H8V10Zm4 4v26h40V14H12Zm8 8h8v4h-4v4h4v4h-8V22Zm16 0h8v12h-8v-4h4v-4h-4v-4Z" /></svg>
      <span>PREVIEW NOT AVAILABLE</span><p>The project details are ready to explore.</p>
    </div>}
    <span className="archive-preview-label">PROJECT FILE / {project.id}</span>
  </div>
}

export default function ProjectArchive({ projects, selectedProject, onSelectProject, keyboardEnabled = true }) {
  const [featuredOnly, setFeaturedOnly] = useState(false)
  const [index, setIndex] = useState(() => Math.max(0, projects.findIndex((entry) => entry.id === selectedProject)))
  const gesture = useRef(null)
  const visible = featuredOnly ? projects.filter((project) => project.featured) : projects
  const current = Math.min(index, Math.max(0, visible.length - 1))
  const project = visible[current]
  function choose(next) {
    setIndex(next)
    if (visible[next]) onSelectProject?.(visible[next].id)
  }
  const navigate = (direction) => choose(visible.length ? (current + direction + visible.length) % visible.length : 0)
  useEffect(() => {
    if (!selectedProject) { setIndex(0); return }
    const next = visible.findIndex((entry) => entry.id === selectedProject)
    if (next >= 0) setIndex(next)
    else { setFeaturedOnly(false); setIndex(Math.max(0, projects.findIndex((entry) => entry.id === selectedProject))) }
  }, [selectedProject])

  useEffect(() => {
    if (!keyboardEnabled) return undefined
    const handleKey = (event) => {
      if (event.target?.closest?.('.milo-panel')) return
      if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target?.tagName)) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault()
        event.stopPropagation()
        navigate(event.key === 'ArrowLeft' ? -1 : 1)
      }
    }
    window.addEventListener('keydown', handleKey, true)
    return () => window.removeEventListener('keydown', handleKey, true)
  }, [visible.length, current, keyboardEnabled, onSelectProject])

  return <div className="project-archive" aria-roledescription="carousel" aria-label="Project showcase">
    <div className="archive-toolbar">
      <div className="portfolio-filter" role="group" aria-label="Filter projects">
        <button type="button" aria-pressed={!featuredOnly} onClick={() => { setFeaturedOnly(false); setIndex(0); if (projects[0]) onSelectProject?.(projects[0].id) }}>All projects</button>
        <button type="button" aria-pressed={featuredOnly} onClick={() => { setFeaturedOnly(true); setIndex(0); const first = projects.find((entry) => entry.featured); if (first) onSelectProject?.(first.id) }}>Featured</button>
      </div>
      <span className="archive-counter" aria-live="polite" aria-atomic="true">{visible.length ? `Project ${current + 1} of ${visible.length}` : '0 projects'}</span>
    </div>
    {project ? <article className="archive-project" key={project.id} data-project-id={project.id}
      onPointerDown={(event) => { gesture.current = { x: event.clientX, y: event.clientY } }}
      onPointerCancel={() => { gesture.current = null }}
      onPointerUp={(event) => {
        if (!gesture.current) return
        const dx = event.clientX - gesture.current.x
        const dy = event.clientY - gesture.current.y
        gesture.current = null
        if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) navigate(dx < 0 ? 1 : -1)
      }}>
      <ProjectPreview key={`${project.id}:${project.image}`} project={project} />
      <div className="archive-details">
        <div className="card-topline"><span className="card-category">{project.category || 'PROJECT FILE'}</span><span className="card-status">{project.status}</span></div>
        <h2>{project.title}</h2>
        {project.featured && <span className="card-featured">✦ FEATURED PROJECT</span>}
        <p className="archive-description">{project.description ?? project.detailedDescription ?? project.shortDescription}</p>
        {!!project.technologies.length && <div className="project-tags" aria-label="Technologies">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}
        <div className="archive-links">
          {(project.github ?? project.githubUrl) && <a href={project.github ?? project.githubUrl} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {(project.liveDemo ?? project.demoUrl) && <a href={project.liveDemo ?? project.demoUrl} target="_blank" rel="noopener noreferrer">Live Demo ↗</a>}
        </div>
      </div>
    </article> : <div className="archive-empty"><span aria-hidden="true">◇</span><h2>{featuredOnly ? 'No featured projects yet' : 'The archive is ready'}</h2><p>{featuredOnly ? 'Choose All projects to explore the complete collection.' : 'Projects will appear here as I add them.'}</p></div>}
    <footer className="archive-navigation">
      <button type="button" aria-label="Previous project" disabled={visible.length < 2} onClick={() => navigate(-1)}>← <span>PREVIOUS PROJECT</span></button>
      <div className="archive-navigation-summary">
        <span>PROJECT NAVIGATION · {visible.length ? `${current + 1} OF ${visible.length}` : '0 PROJECTS'}</span>
        <strong>{project?.title || 'No project selected'}</strong>
        <small>{visible.length > 1 ? 'Arrow keys or swipe · Last project loops to first' : 'No other projects in this view'}</small>
      </div>
      <button type="button" aria-label="Next project" disabled={visible.length < 2} onClick={() => navigate(1)}><span>NEXT PROJECT</span> →</button>
    </footer>
  </div>
}
