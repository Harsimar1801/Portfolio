import test from 'node:test'
import assert from 'node:assert/strict'
import { BUILDINGS, PLAYER_START, WORLD } from './townMap.js'
import { canStandAt, movePlayer, nearbyBuilding } from './movement.js'
import { navigation } from '../data/navigation.js'

test('spawn and four cardinal moves are valid', () => {
  assert.equal(canStandAt(PLAYER_START.x, PLAYER_START.y), true)
  for (const [dx, dy] of [[4, 0], [-4, 0], [0, 4], [0, -4]]) {
    assert.deepEqual(movePlayer(PLAYER_START, dx, dy), { x: PLAYER_START.x + dx, y: PLAYER_START.y + dy })
  }
})

test('buildings, trees, and river banks stop movement', () => {
  assert.deepEqual(movePlayer({ x: 112, y: 150 }, 0, -4), { x: 112, y: 150 })
  assert.deepEqual(movePlayer({ x: 185, y: 48 }, 0, -2), { x: 185, y: 48 })
  assert.deepEqual(movePlayer({ x: 583, y: 100 }, 2, 0), { x: 583, y: 100 })
})

test('bridge is passable and world edges hold the player', () => {
  assert.deepEqual(movePlayer({ x: 583, y: 256 }, 3, 0), { x: 586, y: 256 })
  assert.equal(canStandAt(-1, 250), false)
  assert.equal(canStandAt(WORLD.width + 1, 250), false)
  assert.equal(canStandAt(300, WORLD.height + 1), false)
})

test('interactions require proximity to a building door', () => {
  assert.equal(nearbyBuilding(PLAYER_START), null)
  for (const building of BUILDINGS) {
    assert.equal(nearbyBuilding({ x: building.door.x, y: building.door.y + 12 })?.id, building.id)
  }
})

test('every building opens a named portfolio section', () => {
  assert.deepEqual(BUILDINGS.map(({ id }) => id), navigation.map(({ id }) => id))
  assert.deepEqual(BUILDINGS.map(({ name }) => name), navigation.map(({ label }) => label.toUpperCase()))
})

test('all building doors are reachable from spawn around the authored obstacles', () => {
  const step = 4
  const key = ({ x, y }) => `${x},${y}`
  const seen = new Set([key(PLAYER_START)])
  const queue = [PLAYER_START]
  const found = new Set()
  for (let index = 0; index < queue.length && found.size < BUILDINGS.length; index++) {
    const point = queue[index]
    const nearby = nearbyBuilding(point)
    if (nearby) found.add(nearby.id)
    for (const [dx, dy] of [[step, 0], [-step, 0], [0, step], [0, -step]]) {
      const next = movePlayer(point, dx, dy)
      const id = key(next)
      if (id !== key(point) && !seen.has(id)) { seen.add(id); queue.push(next) }
    }
  }
  assert.deepEqual([...found].sort(), BUILDINGS.map((building) => building.id).sort())
})
