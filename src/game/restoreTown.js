import { BUILDINGS, PLAYER_START } from './townMap.js'
import { canStandAt } from './movement.js'
import { createRoom } from './interiors.js'

export function validateTownSnapshot(value) {
  if (!value || value.version !== 1) return null
  const room = BUILDINGS.some((entry) => entry.id === value.room) ? value.room : null
  const finite = (point) => Number.isFinite(point?.x) && Number.isFinite(point?.y)
  const townPoint = (point) => finite(point) && canStandAt(point.x, point.y) ? { x: point.x, y: point.y } : { ...PLAYER_START }
  const townPosition = townPoint(value.townPosition)
  let player = townPoint(value.player)
  if (room) {
    const layout = createRoom(room)
    const p = value.player
    const safe = finite(p) && p.x >= 6 && p.x <= layout.width - 6 && p.y >= 4 && p.y <= layout.height - 4 && !layout.solids.some((s) => p.x + 6 > s.x && p.x - 6 < s.x + s.w && p.y + 4 > s.y && p.y - 4 < s.y + s.h)
    player = safe ? { x: p.x, y: p.y } : { ...layout.spawn }
  } else if (value.room) player = { ...PLAYER_START }
  return { room, player, townPosition, facing: ['up', 'down', 'left', 'right'].includes(value.facing) ? value.facing : 'down' }
}
