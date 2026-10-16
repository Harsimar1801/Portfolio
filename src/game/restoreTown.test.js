import test from 'node:test'
import assert from 'node:assert/strict'
import { validateTownSnapshot } from './restoreTown.js'
import { BUILDINGS, PLAYER_START } from './townMap.js'
import { createRoom } from './interiors.js'
import { parseRoute } from '../data/visitState.js'
import { projects } from '../data/projects.js'

test('stable routes validate sections and project IDs', () => {
  for (const section of BUILDINGS) assert.equal(parseRoute(`#${section.id}`).section, section.id)
  assert.equal(parseRoute(`#projects/${projects[1].id}`).project, projects[1].id)
  assert.equal(parseRoute('#title').screen, 'title')
  assert.equal(parseRoute('#town').screen, 'game')
  for (const hash of ['#unknown', '#projects/missing', '#skills/not-project', '#projects/%XX']) assert.equal(parseRoute(hash), null)
})
test('all five interiors restore valid positions and safe town exit points', () => {
  for (const building of BUILDINGS) {
    const room = createRoom(building.id)
    const value = { version: 1, room: building.id, player: room.spawn, townPosition: PLAYER_START, facing: 'left' }
    const restored = validateTownSnapshot(value)
    assert.deepEqual(restored, { room: building.id, player: room.spawn, townPosition: PLAYER_START, facing: 'left' })
    const invalid = validateTownSnapshot({ ...value, player: { x: 5, y: 0 }, townPosition: { x: Infinity, y: -1 } })
    assert.deepEqual(invalid.player, room.spawn)
    assert.deepEqual(invalid.townPosition, PLAYER_START)
  }
})
test('malformed snapshots, unknown rooms, and impossible town coordinates are safe', () => {
  assert.equal(validateTownSnapshot({ version: 3 }), null)
  assert.equal(validateTownSnapshot(null), null)
  for (const player of [{ x: NaN, y: 20 }, { x: 80, y: 80 }, { x: -10, y: 100 }]) {
    assert.deepEqual(validateTownSnapshot({ version: 1, player }).player, PLAYER_START)
  }
  assert.equal(validateTownSnapshot({ version: 1, room: 'missing' }).room, null)
})
