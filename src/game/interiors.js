import { projects } from '../data/projects.js'
import { skills } from '../data/skills.js'
import { achievements } from '../data/achievements.js'
import { profile } from '../data/profile.js'
import { navigation } from '../data/navigation.js'

export const ROOM_THEMES = {
  projects: { wall: 0x34354d, trim: 0xa797bd, floor: 0x464455, name: 'PROJECT GALLERY', furniture: 'studio' },
  skills: { wall: 0x263e49, trim: 0x91babb, floor: 0x344651, name: 'DEVELOPER LAB', furniture: 'lab' },
  about: { wall: 0x423849, trim: 0xc3a27f, floor: 0x574c49, name: 'PERSONAL OFFICE', furniture: 'office' },
  achievements: { wall: 0x39364b, trim: 0xd0b077, floor: 0x4e4854, name: 'HALL OF FAME', furniture: 'gallery' },
  contact: { wall: 0x293d4a, trim: 0x97b7bd, floor: 0x3b4753, name: 'COMMUNICATION OFFICE', furniture: 'comms' },
}

export function roomExhibits(section, data = { projects, skills, achievements, profile }) {
  let entries = []
  if (section === 'projects') entries = data.projects.map((project) => ({ id: `project:${project.id}`, title: project.title, type: 'project', project }))
  if (section === 'skills') {
    const categories = [...new Set(data.skills.map((skill) => skill.category))]
    entries = categories.map((category) => ({ id: `skills:${category}`, title: category, type: 'skills', skills: data.skills.filter((skill) => skill.category === category) }))
  }
  if (section === 'achievements') entries = data.achievements.map((achievement) => ({ id: `achievement:${achievement.id}`, title: achievement.title, type: 'achievement', achievement }))
  if (section === 'about') entries = [
    { id: 'profile:biography', title: data.profile.name, text: `${data.profile.introduction}\n\n${data.profile.about}` },
    ...(data.profile.educationRecords?.length ? data.profile.educationRecords.map((entry) => ({ id: `education:${entry.id}`, title: entry.title, text: entry.description })) : [{ id: 'profile:education', title: 'Education', text: `${data.profile.role}\n${data.profile.education}` }]),
    ...(data.profile.experience ?? []).map((entry) => ({ id: `experience:${entry.id}`, title: entry.title, text: entry.description })),
    ...(data.profile.learningPriorities?.length ? [{ id: 'profile:learning', title: 'Current learning priorities', text: data.profile.learningPriorities.join('\n') }] : []),
    ...(data.profile.interests.length ? [{ id: 'profile:interests', title: 'Interests', text: data.profile.interests.join(' · ') }] : []),
  ]
  if (section === 'contact') entries = [{ id: 'profile:contact', title: 'Contact terminal', text: navigation.find((entry) => entry.id === 'contact').dialogue, links: Object.entries(data.profile.contact).filter(([,value]) => value).map(([label,value]) => ({ label: `${label}: ${value}`, url: label === 'email' ? `mailto:${value}` : label === 'phone' ? `tel:${value}` : value })) }]
  if (!entries.length) entries = [{ id: `${section}:information`, title: 'Collection information', text: `No ${section} have been added to this portfolio yet. This room will display them automatically as they are added.`, empty: true }]
  return entries.map((entry) => ({ ...entry, section }))
}

export function createRoom(section, data) {
  const exhibits = roomExhibits(section, data)
  const bays = Math.max(1, Math.ceil(exhibits.length / 3))
  const width = bays * 480, height = 360
  const furniture = Array.from({ length: bays }, (_, i) => ({ x: i * 480 + 190, y: 224, w: 100, h: 30 }))
  const decorations = Array.from({ length: bays }, (_, i) => [
    { x: i * 480 + 25, y: 180, w: 25, h: 50 },
    { x: i * 480 + 30, y: 148, w: 14, h: 14 },
    { x: i * 480 + 438, y: 148, w: 14, h: 14 },
    ...(section === 'about' ? [{ x: i * 480 + 234, y: 265, w: 16, h: 14 }] : []),
  ]).flat()
  const solids = [{ x: 0, y: 0, w: width, h: 112 }, { x: 0, y: 0, w: 20, h: height }, { x: width - 20, y: 0, w: 20, h: height }, { x: 0, y: height - 16, w: width, h: 16 }, ...furniture, ...decorations]
  return { section, title: navigation.find((entry) => entry.id === section)?.label, theme: ROOM_THEMES[section], width, height, furniture, solids,
    spawn: { x: 240, y: 304 }, exit: { x: 240, y: 326 },
    exhibits: exhibits.map((entry, index) => ({ ...entry, x: Math.floor(index / 3) * 480 + 90 + (index % 3) * 150, y: 142,
      interactionPoints: section === 'contact' ? [{ x: 240, y: 270 }] : [],
    })),
  }
}

export function moveInRoom(room, player, dx, dy) {
  const canStand = (x,y) => x >= 6 && x <= room.width-6 && y >= 4 && y <= room.height-4 && !room.solids.some((s) => x+6>s.x && x-6<s.x+s.w && y+4>s.y && y-4<s.y+s.h)
  const next = { ...player }
  if (canStand(next.x+dx,next.y)) next.x += dx
  if (canStand(next.x,next.y+dy)) next.y += dy
  return next
}

export function nearbyExhibit(room, player) {
  return room.exhibits.find((entry) => Math.hypot(entry.x-player.x,entry.y-player.y) < 42 || entry.interactionPoints?.some((point) => Math.hypot(point.x-player.x,point.y-player.y) < 28))
}
