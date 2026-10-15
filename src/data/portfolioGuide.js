import { profile } from './profile.js'
import { projects } from './projects.js'
import { skills } from './skills.js'
import { achievements } from './achievements.js'

export const suggestedQuestions = ['Who is Harsimar?', 'What projects has he built?', 'What technologies does he know?', 'Tell me about Patient Health Hub.', 'Where can I find his GitHub?', 'How can I contact him?']
const normalize = (value) => value.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim()
const stopWords = new Set('who what where when how is are a an the his he has built tell me about does know can i find project projects please'.split(' '))

// Deterministic local matching, intentionally separate from the chat interface.
// An API-backed responder can later return the same { text, section, links } shape.
export function answerPortfolioQuestion(question, data = { profile, projects, skills, achievements }) {
  const q = normalize(question)
  const tokens = q.split(' ').filter((word) => word.length > 2 && !stopWords.has(word))
  const reply = (text, section, links = []) => ({ text, section, links })
  const project = data.projects.find((entry) => q.includes(normalize(entry.title)))
  const describeProject = (entry) => reply(`${entry.title}: ${entry.description ?? entry.detailedDescription ?? entry.shortDescription}\nTechnologies: ${entry.technologies.join(', ') || 'Not listed yet'}.\nStatus: ${entry.status}.`, 'projects', [
    { label: 'GitHub repository', url: entry.github ?? entry.githubUrl },
    { label: 'Live demo', url: entry.liveDemo ?? entry.demoUrl },
  ].filter((link) => link.url))
  if (project) return describeProject(project)
  if (/github|contact|email|phone|linkedin|resume|reach/.test(q)) {
    const contact = data.profile.contact
    const keys = /github/.test(q) ? ['github'] : /linkedin/.test(q) ? ['linkedin'] : /resume/.test(q) ? ['resume'] : /phone/.test(q) ? ['phone'] : ['email', 'phone', 'github', 'linkedin', 'resume']
    const links = keys.filter((key) => contact[key]).map((key) => ({ label: key === 'email' || key === 'phone' ? contact[key] : key, url: key === 'email' ? `mailto:${contact.email}` : key === 'phone' ? `tel:${contact.phone}` : contact[key] }))
    return reply(links.length ? 'Here are the contact links currently listed in the portfolio.' : 'Those contact details haven’t been added yet. I can show you Contact Center, meow.', 'contact', links)
  }
  if (/achievement|award|certificat|milestone|hall of fame/.test(q)) return reply(data.achievements.length ? data.achievements.map((entry) => `${entry.title}: ${entry.description}${entry.date ? ` (${entry.date})` : ''}`).join('\n\n') : 'No achievements have been listed yet. I won’t guess, but you can visit the Hall of Fame.', 'achievements', data.achievements.filter((entry) => entry.credentialUrl).map((entry) => ({ label: entry.title, url: entry.credentialUrl })))
  if (/skill|technolog|language|stack|developer lab/.test(q)) return reply(data.skills.length ? data.skills.map((entry) => `${entry.name} — ${entry.category}${entry.description ? `: ${entry.description}` : ''}`).join('\n') : 'Technical skills haven’t been listed yet. Developer Lab will show them as they are added.', 'skills')
  if (/who|education|study|student|introduction|about harsimar|interests|vit|experience|learning/.test(q)) return reply(`${data.profile.about}\n${data.profile.role} · ${data.profile.education}\n${data.profile.introduction}${data.profile.interests.length ? `\nInterests: ${data.profile.interests.join(', ')}.` : ''}\n${[...(data.profile.educationRecords ?? []), ...(data.profile.experience ?? [])].map((entry) => `${entry.title}: ${entry.description}`).join('\n\n')}`, 'about')
  if (/^(what projects|show projects|projects|list projects|what has he built)/.test(q)) return reply(data.projects.length ? `Explore these project files, meow:\n${data.projects.map((entry) => `${entry.title} — ${entry.status}`).join('\n')}\nAsk me about a project by name for its details and links.` : 'No projects have been added to the archive yet. I can open Project Center for you.', 'projects')
  // Require meaningful overlap so an unknown named project is never invented.
  const matches = data.projects.map((entry) => ({ entry, score: tokens.filter((token) => normalize([entry.title, entry.description, entry.detailedDescription, ...entry.technologies].join(' ')).split(' ').includes(token)).length })).filter(({ score }) => score >= Math.min(2, tokens.length) && score > 0).sort((a, b) => b.score - a.score)
  if (matches.length === 1 || (matches.length > 1 && matches[0].score > matches[1].score)) return describeProject(matches[0].entry)
  const skill = data.skills.find((entry) => ` ${q} `.includes(` ${normalize(entry.name)} `))
  if (skill) return reply(`${skill.name} — ${skill.category}.${skill.description ? ` ${skill.description}` : ''}`, 'skills')
  return reply('I don’t have that information in the portfolio yet. I’m a local portfolio guide, so I only answer from the published data. Try asking about education, skills, projects, achievements, or contact details.', /project|built|tell me about/.test(q) ? 'projects' : 'about')
}
