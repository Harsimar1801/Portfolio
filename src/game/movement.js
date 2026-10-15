import { BUILDINGS, INTERACTION_RANGE, SOLIDS, WORLD, MOVEMENT_SPEED, RESUME_POINT } from './townMap.js'

export function movementVector(input, delta, interior = false) {
  const x = Number(Boolean(input.right)) - Number(Boolean(input.left))
  const y = Number(Boolean(input.down)) - Number(Boolean(input.up))
  const length = Math.hypot(x,y) || 1
  const distance = Math.min(delta,32) * MOVEMENT_SPEED[interior ? 'interior' : 'town'] / 1000
  return { dx: x / length * distance, dy: y / length * distance }
}
export function isTextEntry(target) { return Boolean(target?.closest?.('input, textarea, select, [contenteditable]:not([contenteditable="false"]), [role="textbox"]')) }
export function nearResume(player) { return Math.hypot(player.x-RESUME_POINT.x,player.y-RESUME_POINT.y) < 42 }

const FOOT_HALF_WIDTH = 6
const FOOT_HALF_HEIGHT = 4

export function canStandAt(x, y) {
  if (x < FOOT_HALF_WIDTH || x > WORLD.width - FOOT_HALF_WIDTH || y < FOOT_HALF_HEIGHT || y > WORLD.height - FOOT_HALF_HEIGHT) return false
  const foot = { left: x - FOOT_HALF_WIDTH, right: x + FOOT_HALF_WIDTH, top: y - FOOT_HALF_HEIGHT, bottom: y + FOOT_HALF_HEIGHT }
  return !SOLIDS.some((solid) => foot.left < solid.x + solid.w && foot.right > solid.x && foot.top < solid.y + solid.h && foot.bottom > solid.y)
}

export function movePlayer(player, dx, dy) {
  const next = { ...player }
  if (dx && canStandAt(next.x + dx, next.y)) next.x += dx
  if (dy && canStandAt(next.x, next.y + dy)) next.y += dy
  return next
}

export function nearbyBuilding(player) {
  let nearest = null
  let bestDistance = INTERACTION_RANGE
  for (const building of BUILDINGS) {
    const distance = Math.hypot(player.x - building.door.x, player.y - building.door.y)
    if (distance <= bestDistance) {
      nearest = building
      bestDistance = distance
    }
  }
  return nearest
}
