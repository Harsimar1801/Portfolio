import { BUILDINGS, FENCES, LANDMARK, RIVER, TREES, WORLD } from './townMap.js'

// Original artwork, authored in logical pixels. The atlas is shared by all town sprites.
// Terrain variation is deterministic decoration of the existing map, not world generation.
export const TOWN_ATLAS = 'original-town-atlas'
const INK = '#172338'
const GLYPHS = {
  A: ['01110','10001','10001','11111','10001','10001','10001'], B: ['11110','10001','10001','11110','10001','10001','11110'],
  C: ['01111','10000','10000','10000','10000','10000','01111'], D: ['11110','10001','10001','10001','10001','10001','11110'],
  E: ['11111','10000','10000','11110','10000','10000','11111'], F: ['11111','10000','10000','11110','10000','10000','10000'],
  G: ['01111','10000','10000','10111','10001','10001','01111'], H: ['10001','10001','10001','11111','10001','10001','10001'],
  I: ['11111','00100','00100','00100','00100','00100','11111'], J: ['00111','00010','00010','00010','10010','10010','01100'],
  K: ['10001','10010','10100','11000','10100','10010','10001'], L: ['10000','10000','10000','10000','10000','10000','11111'],
  M: ['10001','11011','10101','10101','10001','10001','10001'], N: ['10001','11001','11001','10101','10011','10011','10001'],
  O: ['01110','10001','10001','10001','10001','10001','01110'], P: ['11110','10001','10001','11110','10000','10000','10000'],
  Q: ['01110','10001','10001','10001','10101','10010','01101'], R: ['11110','10001','10001','11110','10100','10010','10001'],
  S: ['01111','10000','10000','01110','00001','00001','11110'], T: ['11111','00100','00100','00100','00100','00100','00100'],
  U: ['10001','10001','10001','10001','10001','10001','01110'], V: ['10001','10001','10001','10001','10001','01010','00100'],
  W: ['10001','10001','10001','10101','10101','10101','01010'], X: ['10001','10001','01010','00100','01010','10001','10001'],
  Y: ['10001','10001','01010','00100','00100','00100','00100'], Z: ['11111','00001','00010','00100','01000','10000','11111'],
}

function painter(context) {
  const rect = (x, y, w, h, color) => { context.fillStyle = color; context.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)) }
  // Scanline polygons have staircase edges, with no antialiased half-pixels.
  const polygon = (points, color) => {
    const top = Math.min(...points.map((p) => p[1])), bottom = Math.max(...points.map((p) => p[1]))
    for (let y = top; y < bottom; y++) {
      const intersections = []
      for (let i = 0; i < points.length; i++) {
        const a = points[i], b = points[(i + 1) % points.length]
        if ((a[1] <= y && b[1] > y) || (b[1] <= y && a[1] > y)) intersections.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]))
      }
      intersections.sort((a, b) => a - b)
      for (let i = 0; i < intersections.length; i += 2) rect(Math.ceil(intersections[i]), y, Math.ceil(intersections[i + 1]) - Math.ceil(intersections[i]), 1, color)
    }
  }
  const text = (value, x, y, color) => {
    for (const [index, letter] of [...value].entries()) GLYPHS[letter]?.forEach((row, yy) => [...row].forEach((pixel, xx) => { if (pixel === '1') rect(x + index * 6 + xx, y + yy, 1, 1, color) }))
  }
  const oval = (x, y, w, h, color) => {
    for (let row = 0; row < h; row++) {
      const inset = Math.round(w / 2 * (1 - Math.sqrt(Math.max(0, 1 - ((row + .5 - h / 2) / (h / 2)) ** 2))))
      rect(x + inset, y + row, w - inset * 2, 1, color)
    }
  }
  return { rect, polygon, text, oval }
}

const architecture = {
  house: { roof: '#a45b52', light: '#d18b69', dark: '#693b4a', wall: '#d3b48a', shade: '#a17f71', trim: '#e8c99a' },
  lab: { roof: '#3f6687', light: '#83b4c1', dark: '#2c3c60', wall: '#afbec9', shade: '#77899e', trim: '#d5ded1' },
  hq: { roof: '#796393', light: '#b19cc4', dark: '#493c66', wall: '#c2b4ba', shade: '#8a7d98', trim: '#ead7bd' },
  hall: { roof: '#99664d', light: '#d5a06a', dark: '#613b4b', wall: '#d7c093', shade: '#a38e76', trim: '#f0dca9' },
  comms: { roof: '#3e7c83', light: '#84bcb1', dark: '#30485f', wall: '#b3b9b1', shade: '#788d91', trim: '#e0cfad' },
}

function buildingArt(p, b) {
  const { rect: r, polygon: poly } = p
  const colors = architecture[b.kind], x = 12, y = 30, w = b.w, h = b.h
  // Stepped cast shadow and sandstone foundation.
  poly([[x + 5,y + 18],[x + w + 7,y + 18],[x + w + 13,y + h + 8],[x + 13,y + h + 12],[x - 3,y + h + 5]], '#142338aa')
  r(x - 2,y + 25,w + 4,h - 20,INK)
  r(x,y + 26,w,h - 26,colors.shade)
  r(x + 5,y + 29,w - 11,h - 31,colors.wall)
  for (let yy = y + 34; yy < y + h - 3; yy += 9) {
    r(x + 7,yy,w - 15,1,colors.trim)
    for (let xx = x + 8 + (yy % 2) * 7; xx < x + w - 8; xx += 17) r(xx,yy - 8,1,8,colors.shade)
  }
  r(x - 2,y + h - 5,w + 4,5,'#7d777d')
  r(x - 3,y + h,w + 6,3,'#bbab91')
  // Pitched roof made from individually shaded tiles.
  poly([[x + 13,y - 20],[x + w - 13,y - 20],[x + w + 7,y + 24],[x - 7,y + 24]],INK)
  poly([[x + 14,y - 18],[x + w - 14,y - 18],[x + w + 4,y + 20],[x - 4,y + 20]],colors.roof)
  for (let row = 0; row < 6; row++) {
    const yy = y - 15 + row * 6, inset = 13 - row * 3
    r(x + inset,yy,w - inset * 2,1,colors.light)
    for (let xx = x + inset + (row % 2) * 5; xx < x + w - inset - 1; xx += 10) {
      r(xx,yy + 1,1,4,colors.dark)
      r(xx + 2,yy + 4,6,1,colors.dark)
      r(xx + 1,yy + 1,2,1,colors.light)
    }
  }
  r(x + 13,y - 21,w - 26,3,colors.light)
  r(x - 5,y + 21,w + 10,4,colors.dark)
  r(x - 5,y + 25,w + 10,2,colors.trim)
  // Architectural silhouettes and rooftop details.
  if (b.kind === 'house') {
    r(x + w - 27,y - 27,12,25,INK); r(x + w - 25,y - 25,8,22,'#9d7469')
    for (let yy = y - 24; yy < y - 4; yy += 5) r(x + w - 25,yy,8,1,'#d3a187')
    r(x + w - 29,y - 28,16,4,'#d9b892')
  } else if (b.kind === 'lab') {
    poly([[x + 25,y - 11],[x + 38,y - 20],[x + 71,y - 20],[x + 84,y - 11],[x + 84,y + 8],[x + 25,y + 8]],colors.dark)
    poly([[x + 29,y - 10],[x + 40,y - 16],[x + 69,y - 16],[x + 80,y - 10],[x + 80,y + 4],[x + 29,y + 4]],'#6aabb3')
    for (let xx = x + 38; xx < x + 80; xx += 14) r(xx,y - 13,2,17,'#c0d4cc')
    r(x + 29,y - 4,51,2,'#c0d4cc'); r(x + 43,y - 12,9,3,'#aee1cf')
    r(x + 8,y - 15,7,10,'#c8ccd0'); r(x + 6,y - 17,11,3,'#7b899f')
  } else if (b.kind === 'hq') {
    poly([[x + 35,y + 14],[x + 56,y - 10],[x + 77,y + 14]],colors.dark)
    poly([[x + 40,y + 12],[x + 56,y - 5],[x + 72,y + 12]],colors.light)
    r(x + 48,y + 1,16,11,INK); r(x + 50,y + 3,12,7,'#7bafbf')
    r(x + 52,y + 5,3,2,'#d6f0dc'); r(x + 57,y + 8,4,1,'#d6f0dc')
    r(x + w - 18,y - 25,2,14,'#d6b486'); r(x + w - 16,y - 24,11,7,'#af7f9b')
  } else if (b.kind === 'hall') {
    poly([[x + 28,y + 14],[x + 56,y - 12],[x + 84,y + 14]],colors.dark)
    poly([[x + 35,y + 11],[x + 56,y - 7],[x + 77,y + 11]],colors.trim)
    r(x + 52,y - 2,8,8,'#bb864d'); r(x + 50,y,2,4,'#bb864d'); r(x + 60,y,2,4,'#bb864d')
    r(x + 55,y + 6,2,5,'#bb864d'); r(x + 52,y + 10,8,2,'#bb864d')
    for (const xx of [x + 8,x + w - 15]) { r(xx,y + 46,7,h - 50,colors.trim); r(xx - 2,y + 45,11,4,'#ece0b9'); r(xx - 2,y + h - 8,11,4,'#ece0b9') }
  } else {
    r(x + w - 25,y - 29,3,23,'#c8c8bc'); r(x + w - 32,y - 22,17,2,'#d9cbaa')
    poly([[x + w - 40,y - 24],[x + w - 26,y - 10],[x + w - 13,y - 24]],'#a8c4c3')
    r(x + w - 27,y - 24,3,4,'#f2be79')
    r(x + 15,y - 5,22,12,INK); r(x + 17,y - 3,18,8,'#b3d6cc')
    poly([[x + 17,y - 3],[x + 26,y + 3],[x + 35,y - 3]],'#5d8e9b')
  }
  // Illuminated windows, shutters, window boxes, and a recessed entrance.
  for (const wx of [x + 18,x + w - 36]) {
    r(wx - 3,y + 48,24,24,colors.dark); r(wx,y + 50,18,19,'#8b674f')
    r(wx + 2,y + 51,14,15,'#e6ad68'); r(wx + 3,y + 52,6,8,'#ffe0a0')
    r(wx + 8,y + 50,2,18,colors.dark); r(wx,y + 59,18,2,colors.dark)
    r(wx - 4,y + 47,26,3,colors.trim); r(wx - 3,y + 70,24,3,colors.trim)
    if (b.kind === 'house' || b.kind === 'comms') {
      r(wx - 1,y + 72,20,5,'#754f4b'); r(wx,y + 71,18,2,'#628466')
      for (let xx = wx + 2; xx < wx + 19; xx += 6) { r(xx,y + 69,3,3,'#cf8295'); r(xx + 1,y + 69,1,1,'#f4cf92') }
    }
  }
  const doorX = x + w / 2 - 10
  r(doorX - 3,y + h - 31,26,31,colors.dark); r(doorX,y + h - 28,20,28,'#5b4550')
  r(doorX + 2,y + h - 26,16,11,'#91b4b6'); r(doorX + 4,y + h - 24,5,6,'#d5dbbc')
  r(doorX + 2,y + h - 11,16,8,'#866053'); r(doorX + 14,y + h - 13,2,3,'#efd193')
  r(doorX - 5,y + h + 3,30,4,'#e2c7a2'); r(doorX - 8,y + h + 7,36,3,'#8e8390')
}

export function createTownAtlas(scene) {
  if (scene.textures.exists(TOWN_ATLAS)) return
  const atlas = scene.textures.createCanvas(TOWN_ATLAS,1024,1024)
  const ctx = atlas.context
  ctx.imageSmoothingEnabled = false
  let cursorX = 0, cursorY = 0, rowHeight = 0
  function frame(name,w,h,draw) {
    if (cursorX + w > 1024) { cursorX = 0; cursorY += rowHeight + 2; rowHeight = 0 }
    ctx.save(); ctx.translate(cursorX,cursorY)
    ctx.beginPath(); ctx.rect(0,0,w,h); ctx.clip()
    draw(painter(ctx)); ctx.restore()
    atlas.add(name,0,cursorX,cursorY,w,h)
    cursorX += w + 2; rowHeight = Math.max(rowHeight,h)
  }
  for (let v = 0; v < 8; v++) frame(`grass-${v}`,16,16,({rect:r}) => {
    r(0,0,16,16,['#29483e','#2a493f','#29473e','#2b493f'][v % 4])
    for (let i = 0; i < 2 + v % 3; i++) {
      const x = (i * 7 + v * 3) % 14, y = (i * 5 + v * 7) % 13
      r(x,y,3,1,'#335442'); r(x + 1,y - 1,1,1,'#41644c'); r(x,y + 2,2,1,'#223d3b')
    }
  })
  frame('path',32,32,({rect:r}) => {
    r(0,0,32,32,'#77656a')
    for (let row = 0; row < 4; row++) for (let col = -1; col < 4; col++) {
      const x = col * 12 + (row % 2) * 6, y = row * 8
      r(x + 1,y + 1,10,6,['#b69b7c','#bfa687','#ae937b'][(row + col + 4) % 3])
      r(x + 2,y + 1,8,1,'#d0b692'); r(x + 2,y + 6,8,1,'#948074')
      if ((row + col) % 3 === 0) r(x + 6,y + 3,2,1,'#a58a74')
    }
  })
  for (let phase = 0; phase < 4; phase++) frame(`water-${phase}`,32,32,({rect:r}) => {
    r(0,0,32,32,'#285b78'); r(0,13,32,8,'#2b6380'); r(0,27,32,3,'#244f70')
    for (let i = 0; i < 4; i++) {
      const x = (i * 13 + phase * 2) % 32, y = (i * 9 + 3) % 30
      r(x,y,6,1,'#50949f'); r((x + 3) % 32,y + 1,7,1,'#36788b')
      if (i === phase) r((x + 2) % 32,y - 1,2,1,'#87b8b7')
    }
  })
  for (const purple of [false,true]) frame(purple ? 'tree-purple' : 'tree',48,58,({rect:r,oval}) => {
    oval(4,45,42,12,'#152738aa'); r(21,32,9,21,'#453e42'); r(23,33,4,20,'#9b7755'); r(27,40,2,12,'#6a5148')
    r(17,50,7,4,'#6a5148'); r(29,50,6,3,'#6a5148')
    const shades = purple ? ['#2c304e','#48435f','#686080','#8c7998','#a18aa6'] : ['#172f38','#245044','#3d6e50','#58865c','#7b9b69']
    const clusters = [[12,2,24,20],[5,12,24,23],[24,13,21,22],[2,27,27,21],[20,29,26,20],[11,20,27,25]]
    for (const [x,y,w,h] of clusters) {
      oval(x,y,w,h,shades[0]); oval(x + 1,y,w - 3,h - 4,shades[1]); oval(x + 2,y + 1,w - 6,h - 8,shades[2]); oval(x + 4,y + 2,w - 12,6,shades[3])
    }
    for (let i = 0; i < 25; i++) {
      const x = 8 + i * 17 % 31, y = 8 + i * 13 % 32
      r(x,y,3,1,shades[i % 3 + 2]); r(x + 1,y - 1,2,1,shades[i % 3 + 2])
    }
  })
  for (let color = 0; color < 3; color++) frame(`flowers-${color}`,18,14,({rect:r}) => {
    for (let i = 0; i < 3; i++) {
      const x = 2 + i * 6, y = i % 2 ? 2 : 5
      r(x + 1,y + 4,1,6,'#5b8054'); r(x - 1,y + 7,2,1,'#77a16b')
      r(x - 1,y + 1,5,3,['#d78d9e','#deba75','#a797ce'][color]); r(x,y,3,5,['#c4748d','#cf9a5f','#9384ba'][color]); r(x + 1,y + 2,1,1,'#f9df9e')
    }
  })
  frame('bush',26,20,({rect:r,oval}) => {
    oval(1,12,24,7,'#1b2c3b'); oval(2,5,22,12,'#315346'); oval(4,2,9,12,'#527458'); oval(12,4,10,10,'#608463')
    for (let i = 0; i < 6; i++) { const x = 5 + i * 7 % 16, y = 5 + i * 3 % 8; r(x,y,2,2,'#a57c89'); r(x,y,1,1,'#d4a6ac') }
  })
  frame('reeds',15,23,({rect:r}) => {
    for (let i = 0; i < 4; i++) { const x = 2 + i * 3, y = i % 2 * 5; r(x,y + 4,1,18 - y,'#789578'); r(x - 1,y,3,7,'#b2a47b'); r(x + 1,y + 12,2,1,'#4d7368') }
  })
  frame('lantern',32,46,({rect:r,oval}) => {
    oval(1,30,30,12,'#d5a05a12'); oval(6,32,20,8,'#e3b86817')
    r(15,12,3,28,INK); r(16,15,1,22,'#93807a'); r(11,39,11,3,'#343c4d')
    r(10,7,13,15,INK); r(12,8,9,11,'#b47c4f'); r(13,9,7,9,'#efbe74'); r(14,10,3,6,'#ffe4a7')
    r(9,6,15,3,'#55506a'); r(12,3,9,3,'#7d7485'); r(16,1,2,3,'#d4ad70'); r(10,21,13,2,'#766276')
  })
  frame('crystal',18,23,({rect:r,polygon:p,oval}) => {
    oval(2,18,14,4,'#14283c99'); p([[9,1],[15,8],[13,16],[9,20],[4,16],[2,8]],INK)
    p([[9,3],[13,8],[11,16],[9,18],[5,15],[4,8]],'#66b9c4'); p([[9,3],[9,17],[5,14],[4,8]],'#b7e4d4')
    r(7,6,2,4,'#e7f4de'); r(11,9,2,4,'#4b839f')
  })
  frame('clock',80,78,({rect:r,polygon:p,text}) => {
    p([[12,3],[67,3],[77,13],[77,62],[67,72],[12,72],[2,62],[2,13]],'#5c6177')
    p([[14,7],[65,7],[73,15],[73,60],[65,68],[14,68],[6,60],[6,15]],'#aaa3a0')
    for (let y = 12; y < 66; y += 9) for (let x = 9; x < 71; x += 11) r(x,y,9,7,(x + y) % 3 ? '#8e8993' : '#9a939a')
    r(23,23,34,41,INK); r(26,22,28,40,'#6b6380'); r(29,25,5,35,'#9c8eaa'); r(25,60,30,4,'#d5bd95')
    p([[18,22],[40,2],[62,22]],INK); p([[22,20],[40,6],[58,20]],'#927b9d'); r(20,22,40,4,'#c8b18b')
    r(32,29,17,18,'#3e425b'); r(34,30,13,15,'#ecd39c'); r(40,32,1,7,'#5c5266'); r(40,38,5,1,'#5c5266')
    r(37,49,7,9,'#403b55'); r(39,51,3,5,'#d1ab6f')
    r(3,65,74,13,INK); r(4,65,72,1,'#b69f82'); text('CLOCK PLAZA',7,68,'#f0d8ab')
  })
  for (const b of BUILDINGS) {
    frame(`building-${b.id}`,b.w + 24,b.h + 42,(p) => buildingArt(p,b))
      // Native 5×7 lettering remains 14 screen pixels tall at desktop 2× zoom.
    frame(`sign-${b.id}`,b.name.length * 6 + 11,16,({rect:r,text}) => {
      const w = b.name.length * 6 + 11
      r(0,0,w,16,INK); r(1,0,w - 2,14,architecture[b.kind].trim)
      r(2,1,w - 4,12,'#26314a'); text(b.name,6,4,'#fff1d2')
    })
  }
  for (const direction of ['down','up','left','right']) for (let step = 0; step < 2; step++) frame(`player-${direction}-${step}`,24,34,({rect:r,oval}) => {
    oval(3,27,19,5,'#13213699')
    r(6,24 + step,5,6 - step,INK); r(14,24,5,6,INK); r(6,29,6,2,'#b9aba7'); r(14,29 - step,6,2,'#b9aba7')
    r(5,15,15,11,INK); r(7,16,11,9,'#617da3'); r(7,17,4,7,'#9db8cb'); r(6,24,13,2,'#394764')
    r(3,18 + step,3,7,'#c5977f'); r(19,18 - step,3,7,'#c5977f')
    r(6,6,13,11,INK); r(7,7,11,9,'#d6a98a'); r(8,8,4,5,'#edc29d')
    r(5,4,15,6,'#263045'); r(7,2,11,3,'#33415b'); r(6,5,7,2,'#52607a'); r(5,9,3,4,'#263045')
    if (direction === 'down') { r(9,11,2,2,INK); r(15,11,2,2,INK); r(11,15,3,1,'#a67569') }
    if (direction === 'left') { r(7,11,2,2,INK); r(5,12,2,2,'#d6a98a') }
    if (direction === 'right') { r(16,11,2,2,INK); r(18,12,2,2,'#d6a98a') }
    if (direction === 'up') { r(7,8,11,6,'#263045'); r(8,17,9,8,'#946f66'); r(9,18,7,2,'#c29a79') }
    else { r(17,18,4,7,'#bb8b65'); r(18,19,2,3,'#e2b77f') }
  })
  atlas.refresh()
}

const PATHS = [[262,155,34,331],[102,199,438,34],[32,242,606,32],[133,315,383,30],[144,334,32,127],[440,334,32,127],[321,303,30,42],[100,461,423,24],[100,144,24,57],[268,144,24,55],[460,160,24,39]]

export function drawTown(scene) {
  createTownAtlas(scene)
  const sprite = (x,y,frame,depth = -20) => scene.add.image(x,y,TOWN_ATLAS,frame).setOrigin(0).setDepth(depth)
  for (let y = 0; y < WORLD.height; y += 16) for (let x = 0; x < WORLD.width; x += 16) {
    const tile = ((x * 73856093) ^ (y * 19349663)) >>> 4
    sprite(x,y,`grass-${tile % 8}`,-100)
  }
  const ground = scene.add.graphics().setDepth(-95)
  ground.fillStyle(0x18283c).fillRect(0,0,WORLD.width,12).fillRect(0,0,10,WORLD.height).fillRect(WORLD.width - 9,0,9,WORLD.height)
  for (let x = 10; x < WORLD.width - 10; x += 14) {
    ground.fillStyle(x % 3 ? 0x55546c : 0x68627a).fillRect(x,2,12,9)
    ground.fillStyle(0x868096).fillRect(x,2,12,2)
  }
  const borders = scene.add.graphics().setDepth(-90)
  PATHS.forEach(([x,y,w,h]) => { borders.fillStyle(0x203b3c).fillRect(x - 3,y - 3,w + 6,h + 6); borders.fillStyle(0x7c7b74).fillRect(x - 1,y - 1,w + 2,h + 2) })
  PATHS.forEach(([x,y,w,h]) => scene.add.tileSprite(x,y,w,h,TOWN_ATLAS,'path').setOrigin(0).setDepth(-89))
  // Animated river is made of repeating tiles; the bridge remains independently drawn.
  const banks = scene.add.graphics().setDepth(-80)
  banks.fillStyle(0x172b43).fillRect(RIVER.x - 5,0,RIVER.w + 10,WORLD.height)
  for (let y = 0; y < WORLD.height; y += 8) {
    banks.fillStyle(y % 16 ? 0x71818a : 0x8c9290).fillRect(RIVER.x - 4,y,4,7).fillRect(RIVER.x + RIVER.w,y,4,7)
    banks.fillStyle(0x3e6e65).fillRect(RIVER.x - 7,y + 2,3,4)
  }
  const water = scene.add.tileSprite(RIVER.x,0,RIVER.w,WORLD.height,TOWN_ATLAS,'water-0').setOrigin(0).setDepth(-79)
  const bridge = scene.add.graphics().setDepth(-70)
  bridge.fillStyle(0x28354b).fillRect(RIVER.x - 8,RIVER.bridgeTop - 3,RIVER.w + 16,54)
  for (let y = RIVER.bridgeTop; y < RIVER.bridgeBottom; y += 6) {
    bridge.fillStyle(0x9c7863).fillRect(RIVER.x - 7,y,RIVER.w + 14,5)
    bridge.fillStyle(0xc09c78).fillRect(RIVER.x - 6,y,RIVER.w + 12,1)
    for (const x of [RIVER.x - 3,RIVER.x + RIVER.w + 1]) bridge.fillStyle(0x51444d).fillRect(x,y + 2,2,2)
  }
  for (const y of [RIVER.bridgeTop - 4,RIVER.bridgeBottom - 1]) {
    bridge.fillStyle(0x574659).fillRect(RIVER.x - 9,y,RIVER.w + 18,4)
    bridge.fillStyle(0xe0b988).fillRect(RIVER.x - 9,y,RIVER.w + 18,1)
    for (let x = RIVER.x - 9; x < RIVER.x + RIVER.w + 10; x += 16) bridge.fillStyle(0xb99879).fillRect(x,y - 3,4,8)
  }
  for (const fence of FENCES) {
    const g = scene.add.graphics().setDepth(fence.y + fence.h)
    if (fence.w > fence.h) {
      g.fillStyle(0x223044).fillRect(fence.x,fence.y + 5,fence.w,6)
      g.fillStyle(0x80605b).fillRect(fence.x,fence.y - 1,fence.w,3).fillRect(fence.x,fence.y + 5,fence.w,2)
      for (let x = fence.x; x < fence.x + fence.w; x += 11) { g.fillStyle(0xb69a7f).fillRect(x,fence.y - 5,4,15); g.fillStyle(0xe0c29a).fillRect(x,fence.y - 5,2,13) }
    } else {
      g.fillStyle(0x81645f).fillRect(fence.x,fence.y,4,fence.h)
      for (let y = fence.y; y < fence.y + fence.h; y += 12) { g.fillStyle(0xc2a58a).fillRect(fence.x - 2,y,8,5); g.fillStyle(0xe0c29a).fillRect(fence.x - 2,y,8,1) }
    }
  }
  TREES.forEach(({x,y},i) => sprite(x - 24,y - 45,i % 6 === 0 ? 'tree-purple' : 'tree',y + 8))
  TREES.forEach(({x,y},i) => { if (i % 3 === 0) sprite(x - 29,y - 2,'bush',y + 9) })
  for (const y of [32,102,175,305,371,462]) { sprite(RIVER.x - 15,y,'reeds',y + 23); sprite(RIVER.x + RIVER.w + 5,y + 23,'reeds',y + 46) }
  const gardens = [[53,155],[133,155],[234,157],[316,159],[428,175],[514,174],[49,205],[196,185],[350,185],[542,214],[54,304],[102,304],[220,294],[393,281],[531,283],[77,370],[235,367],[381,370],[523,369],[95,443],[220,443],[391,445],[523,447],[43,475],[369,489],[647,222],[644,288]]
  gardens.forEach(([x,y],i) => sprite(x,y,`flowers-${i % 3}`,y))
  for (const [x,y] of [[113,246],[215,308],[413,310],[548,235],[260,477],[490,477]]) sprite(x - 16,y - 36,'lantern',y + 4)
  sprite(LANDMARK.x - 4,LANDMARK.y - 7,'clock',LANDMARK.y + LANDMARK.h)
  BUILDINGS.forEach((b) => sprite(b.x - 12,b.y - 30,`building-${b.id}`,b.y + b.h))
  const signs = BUILDINGS.map((b) => {
    const width = b.name.length * 6 + 11
    return { building: b, homeX: Math.round(b.x + (b.w - width) / 2), homeY: b.y + 30, sprite: sprite(0,0,`sign-${b.id}`,10000) }
  })
  return { water, signs }
}

// Keep labels on visible façades clear of the React HUD without moving the camera.
export function placeTownSigns(scene, signs, insets) {
  const view = scene.cameras.main.worldView, zoom = scene.cameras.main.zoom
  if (!view.width || !view.height) return
  const top = view.y + (insets.top + 8) / zoom
  const bottom = view.bottom - (insets.bottom + 8) / zoom
  for (const { building: b, homeX, homeY, sprite } of signs) {
    sprite.setScale(zoom === 1 ? 2 : 1)
    const visible = b.x + b.w > view.x && b.x < view.right && b.y + b.h > top + sprite.height && b.y < bottom
    sprite.setVisible(visible)
    if (!visible) continue
    const x = Math.max(view.x + 6 / zoom, Math.min(homeX,view.right - sprite.displayWidth - 6 / zoom))
    let y = Math.max(top,Math.min(homeY,bottom - sprite.displayHeight))
    // Touch controls occupy the lower corners, not the whole width of a phone.
    // Lift only a label that actually intersects one of those controls.
    for (let pass = 0; pass < 2; pass++) for (const control of insets.controls ?? []) {
      const left = (x - view.x) * zoom, right = left + sprite.displayWidth * zoom
      const labelTop = (y - view.y) * zoom, labelBottom = labelTop + sprite.displayHeight * zoom
      if (left < control.right && right > control.left && labelTop < control.bottom && labelBottom > control.top) {
        y = Math.max(top,view.y + (control.top - 8) / zoom - sprite.displayHeight)
      }
    }
    sprite.setPosition(Math.round(x),Math.round(y))
  }
}
