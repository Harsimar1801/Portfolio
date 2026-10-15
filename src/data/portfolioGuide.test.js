import test from 'node:test'
import assert from 'node:assert/strict'
import { answerPortfolioQuestion } from './portfolioGuide.js'

test('guide uses existing profile and refuses unknown project information', () => {
  assert.match(answerPortfolioQuestion('Who is Harsimar?').text, /VIT Vellore/)
  assert.match(answerPortfolioQuestion('Tell me about Patient Health Hub.').text, /PLANNED/)
  assert.match(answerPortfolioQuestion('Tell me about Unlisted Moon Project.').text, /don’t have/)
  assert.equal(answerPortfolioQuestion('Where is his GitHub?').links.length, 0)
})
test('new data entries are searchable without changing the guide UI', () => {
  const data = { profile: { contact: {} }, projects: [{ id: 'test', title: 'Example Tracker', description: 'A test-only description', technologies: ['React'], status: 'In progress', github: 'https://example.com/repo' }], skills: [{ name: 'Rust', category: 'Languages', description: 'Test only' }], achievements: [{ title: 'Test milestone', description: 'Test only' }] }
  const answer = answerPortfolioQuestion('Tell me about Example Tracker', data)
  assert.match(answer.text, /test-only description/)
  assert.match(answer.text, /React/)
  assert.equal(answer.links[0].url, 'https://example.com/repo')
  assert.match(answerPortfolioQuestion('What technologies does he know?', data).text, /Rust/)
  assert.match(answerPortfolioQuestion('Any achievements?', data).text, /Test milestone/)
})
