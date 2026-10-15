import test from 'node:test'
import assert from 'node:assert/strict'
import { projects } from './projects.js'
import { skills } from './skills.js'
import { achievements } from './achievements.js'
import { profile } from './profile.js'
import { roomExhibits } from '../game/interiors.js'

test('supplied professional inventory reaches all five rooms without demo content', () => {
  assert.equal(projects.length, 9)
  assert.equal(roomExhibits('projects').length, 9)
  assert.deepEqual(projects.find((p) => p.id === 'squat-pose-analyser').technologies, ['OpenCV', 'MediaPipe', 'Machine Learning'])
  assert.equal(roomExhibits('skills').flatMap((e) => e.skills).length, skills.length)
  assert.equal(skills.length, 51)
  assert.equal(achievements.length, 5)
  const about = roomExhibits('about').map((e) => e.text).join('\n')
  for (const text of ['8.05/10', '89%', 'Gravitas', '2024']) assert.ok(about.includes(text))
  const links = roomExhibits('contact')[0].links.map((l) => l.url)
  assert.ok(links.includes('mailto:harsimar.singh1081@gmail.com'))
  assert.ok(links.includes('tel:+91-8090013900'))
  assert.ok(links.includes(profile.contact.linkedin))
  assert.doesNotMatch(JSON.stringify({ projects, skills, achievements, profile }), /example-user|example-profile|example\.com|DEMO|SAMPLE|demo-/)
  assert.ok(projects.every((p) => !p.github && !p.liveDemo && !p.image))
})
