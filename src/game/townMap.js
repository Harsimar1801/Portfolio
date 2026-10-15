// Authored town layout. All coordinates are world pixels; one ground tile is 16px.
export const WORLD = { width: 672, height: 512, tile: 16 }
export const PLAYER_START = { x: 336, y: 336 }
export const INTERACTION_RANGE = 42
export const CRYSTAL_PICKUP_RANGE = 13

// A few optional, authored pickups. They do not unlock portfolio content.
export const CRYSTALS = [
  { id: 'west-path', name: 'West Path Crystal', x: 180, y: 260 },
  { id: 'plaza', name: 'Plaza Crystal', x: 370, y: 330 },
  { id: 'east-path', name: 'East Path Crystal', x: 522, y: 260 },
]

export const BUILDINGS = [
  { id: 'about', name: 'ABOUT ME', kind: 'house', x: 64, y: 64, w: 96, h: 80, accent: 0xc6a685 },
  { id: 'skills', name: 'DEVELOPER LAB', kind: 'lab', x: 224, y: 48, w: 112, h: 96, accent: 0x97c7bf },
  { id: 'projects', name: 'PROJECT CENTER', kind: 'hq', x: 416, y: 64, w: 112, h: 96, accent: 0xb1a4c8 },
  { id: 'achievements', name: 'HALL OF FAME', kind: 'hall', x: 104, y: 352, w: 112, h: 88, accent: 0xd2b37d },
  { id: 'contact', name: 'CONTACT CENTER', kind: 'comms', x: 400, y: 352, w: 112, h: 88, accent: 0x9bbfc4 },
].map((building) => ({
  ...building,
  door: { x: building.x + building.w / 2, y: building.y + building.h + 15 },
}))

export const TREES = [
  [29, 34], [185, 35], [377, 34], [563, 42], [651, 60],
  [26, 127], [192, 141], [368, 132], [558, 148],
  [35, 285], [91, 276], [558, 300], [654, 302],
  [31, 398], [263, 410], [337, 402], [549, 420], [645, 438],
  [71, 479], [190, 486], [311, 482], [559, 480],
].map(([x, y]) => ({ x, y }))

export const FENCES = [
  { x: 47, y: 180, w: 105, h: 7 }, { x: 169, y: 180, w: 28, h: 7 },
  { x: 217, y: 180, w: 41, h: 7 }, { x: 313, y: 180, w: 51, h: 7 },
  { x: 406, y: 193, w: 36, h: 7 }, { x: 498, y: 193, w: 53, h: 7 },
  { x: 34, y: 350, w: 7, h: 105 }, { x: 550, y: 353, w: 7, h: 92 },
]

export const RIVER = { x: 590, w: 48, bridgeTop: 232, bridgeBottom: 280 }
export const LANDMARK = { x: 300, y: 237, w: 72, h: 66 }

export const SOLIDS = [
  ...BUILDINGS.map(({ x, y, w, h }) => ({ x, y, w, h })),
  ...TREES.map(({ x, y }) => ({ x: x - 10, y: y - 7, w: 20, h: 15 })),
  ...FENCES,
  { x: RIVER.x, y: 0, w: RIVER.w, h: RIVER.bridgeTop },
  { x: RIVER.x, y: RIVER.bridgeBottom, w: RIVER.w, h: WORLD.height - RIVER.bridgeBottom },
  { x: LANDMARK.x + 15, y: LANDMARK.y + 18, w: 42, h: 42 },
]
