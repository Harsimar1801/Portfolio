import Section from './Section.jsx'
import { EmptyState, ProjectGallery, SkillGroups, AchievementList } from './PortfolioCards.jsx'
import { profile } from '../data/profile.js'
import { skills } from '../data/skills.js'
import { projects } from '../data/projects.js'
import { achievements } from '../data/achievements.js'

function ContactLink({ label, value, email = false, phone = false }) {
  const href = value ? email ? `mailto:${value}` : phone ? `tel:${value}` : value : ''
  return <div className="contact-item"><span>{label}</span>{href ? <a className="contact-link" href={href} target={email ? undefined : '_blank'} rel={email ? undefined : 'noreferrer'}>{email ? value : 'OPEN LINK ↗'}</a> : <span className="contact-pending">Coming soon</span>}</div>
}

export default function PortfolioSection({ section }) {
  const common = { id: section.id, number: section.number }

  switch (section.id) {
    case 'about':
      return <Section {...common} eyebrow="THE PERSON" title={profile.name}>
        <p className="section-intro">{profile.introduction}</p>
        <p>{profile.about}</p>
        <div className="info-chips"><span>⌁ {profile.role}</span><span>⌁ {profile.education}</span></div>
        {['educationRecords', 'experience'].map((field) => profile[field]?.length > 0 && <div key={field}><h3>{field === 'educationRecords' ? 'Education' : 'Student leadership & experience'}</h3>{profile[field].map((entry) => <article key={entry.id}><h4>{entry.title}</h4><p style={{ whiteSpace: 'pre-line' }}>{entry.description}</p></article>)}</div>)}
        {!!profile.learningPriorities?.length && <div><h3>Current learning priorities</h3><ul>{profile.learningPriorities.map((item) => <li key={item}>{item}</li>)}</ul></div>}
        <h3 className="section-subtitle">Interests</h3>
        {profile.interests.length ? <div className="skill-list">{profile.interests.map((interest) => <span key={interest}>{interest}</span>)}</div> : <EmptyState>Interests will appear here soon.</EmptyState>}
      </Section>
    case 'skills':
      return <Section {...common} eyebrow="THE TOOLKIT" title="Skills & tools"><SkillGroups skills={skills} /></Section>
    case 'projects':
      return <Section {...common} eyebrow="THE BUILDS" title="Selected projects"><ProjectGallery projects={projects} /></Section>
    case 'achievements':
      return <Section {...common} eyebrow="THE MILESTONES" title="Achievements"><AchievementList achievements={achievements} /></Section>
    case 'contact':
      return <Section {...common} eyebrow="THE SIGNAL" title="Get in touch">
        <p>Find my contact details and work profiles here.</p>
        <div className="contact-list">
          <ContactLink label="Email" value={profile.contact.email} email />
          <ContactLink label={`Phone ${profile.contact.phone || ''}`} value={profile.contact.phone} phone />
          <ContactLink label="GitHub" value={profile.contact.github} />
          <ContactLink label="LinkedIn" value={profile.contact.linkedin} />
          <ContactLink label="Résumé" value={profile.contact.resume} />
        </div>
      </Section>
    default:
      return null
  }
}
