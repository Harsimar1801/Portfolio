import test from 'node:test'
import assert from 'node:assert/strict'
import { restoreVisit, saveSession, VISIT_KEY } from './visitState.js'

test('new visits boot, current-tab visits restore, and explicit URLs take precedence', () => {
  const original = globalThis.window
  const entries = new Map()
  globalThis.window = { sessionStorage: { getItem: (key) => entries.get(key) ?? null, setItem: (key, value) => entries.set(key, value) } }
  try {
    assert.equal(restoreVisit(''), null)
    saveSession(VISIT_KEY, { route: '#title' })
    assert.equal(restoreVisit('').screen, 'title')
    saveSession(VISIT_KEY, { route: '#town' })
    assert.equal(restoreVisit('').screen, 'game')
    assert.equal(restoreVisit('#contact').section, 'contact')
    assert.equal(restoreVisit('#missing'), null)
    entries.set(VISIT_KEY, '{invalid JSON')
    assert.equal(restoreVisit(''), null)
    saveSession(VISIT_KEY, { route: '#projects/deleted-project' })
    assert.equal(restoreVisit(''), null)
    globalThis.window.sessionStorage.getItem = () => { throw new Error('Disabled storage') }
    assert.equal(restoreVisit(''), null)
    assert.equal(restoreVisit('#skills').section, 'skills')
  } finally { globalThis.window = original }
})
