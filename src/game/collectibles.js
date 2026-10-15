import { CRYSTALS, CRYSTAL_PICKUP_RANGE } from './townMap.js'

export function nearbyCrystal(player, collectedIds) {
  return CRYSTALS.find((crystal) => !collectedIds.has(crystal.id) && Math.hypot(player.x - crystal.x, player.y - crystal.y) <= CRYSTAL_PICKUP_RANGE) ?? null
}
