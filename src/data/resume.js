import { profile } from './profile.js'
import { projects } from './projects.js'
import { skills } from './skills.js'
import { achievements } from './achievements.js'

// A view of the authoritative portfolio records, not a second résumé copy.
export function resumeExhibit() {
  const categories = [...new Set(skills.map((skill) => skill.category))]
  return {
    id: 'world-clock:resume', section: 'about', title: 'Résumé · Harsimar Singh',
    text: [profile.name, profile.role, profile.about,
      'EDUCATION', ...(profile.educationRecords ?? []).map((e) => `${e.title}\n${e.description}`),
      'SKILLS', ...categories.map((category) => `${category}\n${skills.filter((s) => s.category === category).map((s) => s.name).join(' · ')}`),
      'Current learning priorities\n' + (profile.learningPriorities ?? []).join(' · '),
      'PROJECTS', ...projects.map((p) => `${p.title} — ${p.status}\n${p.description}\nTechnologies: ${p.technologies.join(', ')}`),
      'STUDENT LEADERSHIP', ...(profile.experience ?? []).map((e) => `${e.title}\n${e.description}`),
      'ACHIEVEMENTS & INVOLVEMENT', ...achievements.map((e) => `${e.title}\n${e.description}`),
      'CONTACT', profile.contact.email, profile.contact.phone,
    ].filter(Boolean).join('\n\n'),
    links: [
      { label: 'Email', url: profile.contact.email && `mailto:${profile.contact.email}` },
      { label: 'LinkedIn', url: profile.contact.linkedin },
      { label: 'Open résumé PDF', url: profile.contact.resume },
    ].filter((link) => link.url),
  }
}
