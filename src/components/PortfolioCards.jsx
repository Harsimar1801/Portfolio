import { useEffect, useState } from 'react'

export function EmptyState({ children }) {
  return <p className="empty-state">{children}</p>
}

function OptionalImage({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => { setFailed(false) }, [src])
  if (!src || failed) return null
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}

function ProjectCard({ project }) {
  return <article className="portfolio-card project-card" data-project-id={project.id}>
    <OptionalImage src={project.image} alt={`Preview of ${project.title}`} className="portfolio-card-image" />
    <div className="card-topline"><span className="card-category">{project.category}</span><span className="card-status">{project.status}</span></div>
    <h3>{project.title}</h3>
    {project.featured && <span className="card-featured">✦ FEATURED</span>}
    <p>{project.shortDescription}</p>
    <details className="portfolio-details"><summary>More details</summary><p>{project.detailedDescription}</p></details>
    {project.technologies.length > 0 && <div className="project-tags">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>}
    <div className="portfolio-card-links">
      {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer">GITHUB ↗</a>}
      {project.demoUrl && <a href={project.demoUrl} target="_blank" rel="noreferrer">LIVE DEMO ↗</a>}
    </div>
  </article>
}

export function ProjectGallery({ projects }) {
  const [featuredOnly, setFeaturedOnly] = useState(false)
  if (!projects.length) return <EmptyState>Projects will appear here as I add them.</EmptyState>
  const visible = featuredOnly ? projects.filter((project) => project.featured) : projects
  return <>
    <div className="portfolio-filter" role="group" aria-label="Filter projects">
      <button type="button" aria-pressed={!featuredOnly} onClick={() => setFeaturedOnly(false)}>All projects</button>
      <button type="button" aria-pressed={featuredOnly} onClick={() => setFeaturedOnly(true)}>Featured</button>
    </div>
    {visible.length ? <div className="card-grid">{visible.map((project) => <ProjectCard key={project.id} project={project} />)}</div> : <EmptyState>No featured projects have been added yet.</EmptyState>}
  </>
}

export function SkillGroups({ skills }) {
  if (!skills.length) return <EmptyState>Skills will appear here as I add them.</EmptyState>
  const groups = new Map()
  for (const skill of skills) {
    if (!groups.has(skill.category)) groups.set(skill.category, [])
    groups.get(skill.category).push(skill)
  }
  return <div className="skill-groups">{[...groups].map(([category, entries]) => <section className="skill-group" key={category} aria-label={category}>
    <h3>{category}</h3>
    <div className="skill-list">{entries.map((skill) => <div className="skill-item" key={skill.id} title={skill.description || undefined}>
      <span className="skill-token" aria-hidden="true">{skill.icon ? (skill.icon.startsWith('/') || /^https?:\/\//.test(skill.icon) ? <OptionalImage src={skill.icon} alt="" className="skill-icon" /> : <span className="skill-glyph">{skill.icon}</span>) : <span className="skill-token-mark" />}</span>
      <span className="skill-name">{skill.name}</span>
      {skill.description && <small>{skill.description}</small>}
    </div>)}</div>
  </section>)}</div>
}

function TrophyIcon() {
  return <svg viewBox="0 0 32 32" width="32" height="32" shapeRendering="crispEdges" aria-hidden="true">
    <path fill="currentColor" d="M8 4h16v4h4v4h-4v6h-4v4h-2v4h6v3H8v-3h6v-4h-2v-4H8v-6H4V8h4V4Zm4 4v10h8V8h-8ZM7 11v3h2v-3H7Zm18 0v3h2v-3h-2Z" />
  </svg>
}

function AchievementCard({ achievement, index }) {
  return <article className="portfolio-card achievement-card" data-achievement-id={achievement.id}>
    <div className="achievement-topline"><span className="achievement-emblem"><TrophyIcon /></span><span>COLLECTION {String(index + 1).padStart(2, '0')}</span></div>
    <OptionalImage src={achievement.image} alt={`Image for ${achievement.title}`} className="portfolio-card-image" />
    {achievement.date && <span className="achievement-date">{achievement.date}</span>}
    <h3>{achievement.title}</h3>
    <p>{achievement.description}</p>
    {achievement.credentialUrl && <a href={achievement.credentialUrl} target="_blank" rel="noreferrer">VIEW CREDENTIAL ↗</a>}
  </article>
}

export function AchievementList({ achievements }) {
  return achievements.length ? <div className="card-grid achievement-list">{achievements.map((achievement, index) => <AchievementCard key={achievement.id} index={index} achievement={achievement} />)}</div> : <div className="collection-empty"><span className="achievement-emblem"><TrophyIcon /></span><div><span>COLLECTION / 00</span><p>Milestones will appear here as I add them.</p></div></div>
}
