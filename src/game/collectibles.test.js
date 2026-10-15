import test from 'node:test'
import assert from 'node:assert/strict'
import { CRYSTALS, PLAYER_START } from './townMap.js'
import { canStandAt, movePlayer } from './movement.js'
import { nearbyCrystal } from './collectibles.js'

test('authored crystals sit on walkable ground and collect once within range', () => {
  assert.equal(nearbyCrystal(PLAYER_START, new Set()), null)
  for (const crystal of CRYSTALS) {
    assert.equal(canStandAt(crystal.x, crystal.y), true, `${crystal.id} is on walkable ground`)
    assert.equal(nearbyCrystal({ x: crystal.x, y: crystal.y }, new Set())?.id, crystal.id)
    assert.equal(nearbyCrystal({ x: crystal.x, y: crystal.y }, new Set([crystal.id])), null)
  }
})

test('every crystal can be reached from the player start', () => {
  const seen = new Set([`${PLAYER_START.x},${PLAYER_START.y}`])
  const queue = [PLAYER_START]
  const reached = new Set()
  for (let index = 0; index < queue.length && reached.size < CRYSTALS.length; index++) {
    const point = queue[index]
    const crystal = nearbyCrystal(point, reached)
    if (crystal) reached.add(crystal.id)
    for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
      const next = movePlayer(point, dx, dy)
      const key = `${next.x},${next.y}`
      if (!seen.has(key)) { seen.add(key); queue.push(next) }
    }
  }
  assert.deepEqual([...reached].sort(), CRYSTALS.map(({ id }) => id).sort())
})
