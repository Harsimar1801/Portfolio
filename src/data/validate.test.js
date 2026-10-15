import test from 'node:test'
import assert from 'node:assert/strict'
import { defineProjects, defineSkills, defineAchievements, defineProfile } from './validate.js'

const project = {
  id: 'sample', title: 'Sample', shortDescription: 'Short', detailedDescription: 'Detailed',
  technologies: [], category: 'Web', status: 'In progress', githubUrl: '', demoUrl: '', image: '', featured: false,
}

test('archive fields and legacy fields normalize without changing source objects', () => {
  const entry = { id: 'archive', title: 'Archive', description: 'Description', technologies: ['React'], status: 'Complete', github: 'https://example.com/repo', liveDemo: '', featured: true }
  const [result] = defineProjects([entry])
  assert.equal(result.description, entry.description)
  assert.equal(result.githubUrl, entry.github)
  assert.equal(result.demoUrl, '')
  assert.equal(entry.shortDescription, undefined)
  assert.equal(defineProjects([project])[0].description, 'Detailed')
  assert.throws(() => defineProjects([{ ...entry, github: 'javascript:bad' }]), /"github" must be an http/)
})

test('required portfolio fields are checked', () => {
  assert.throws(() => defineProjects([{ ...project, title: '' }]), /"title" must be a non-empty string/)
  assert.throws(() => defineProjects([{ ...project, technologies: 'React' }]), /"technologies" must be an array/)
  assert.throws(() => defineProjects([{ ...project, featured: 'yes' }]), /"featured" must be a boolean/)
  assert.throws(() => defineSkills([{ id: 'x', name: 'Skill', category: '' }]), /"category" must be a non-empty string/)
  assert.throws(() => defineAchievements([{ id: 'x', title: 'Award' }]), /"description" must be a non-empty string/)
})

test('duplicate IDs are rejected in every content list', () => {
  assert.throws(() => defineProjects([project, { ...project }]), /duplicate id "sample"/)
  assert.throws(() => defineProjects([project, { ...project, id: ' sample ' }]), /duplicate id "sample"/)
  assert.throws(() => defineSkills([{ id: 'x', name: 'A', category: 'One' }, { id: 'x', name: 'B', category: 'Two' }]), /duplicate id "x"/)
  assert.throws(() => defineAchievements([{ id: 'x', title: 'A', description: 'A' }, { id: 'x', title: 'B', description: 'B' }]), /duplicate id "x"/)
})

test('optional links can be empty but unsafe URLs are rejected', () => {
  assert.equal(defineProjects([project]).length, 1)
  assert.throws(() => defineProjects([{ ...project, demoUrl: 'javascript:alert(1)' }]), /"demoUrl" must be an http/)
  assert.throws(() => defineAchievements([{ id: 'x', title: 'A', description: 'A', credentialUrl: 'not-a-url' }]), /"credentialUrl" must be an http/)
  assert.throws(() => defineProfile({ name: 'A', role: 'B', education: 'C', introduction: 'D', about: 'E', interests: [], contact: { github: 'javascript:bad' } }), /"contact.github" must be an http/)
})
