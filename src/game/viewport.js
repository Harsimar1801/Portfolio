import { WORLD } from './townMap.js'

// 16px tiles and a 34px avatar remain at 2x on desktop. Never zoom in merely
// to cover a wide screen; center the bounded town in the available canvas.
export function pixelZoomForViewport(width, height) {
  return width >= 720 && height >= 400 ? 2 : 1
}

export function cameraViewport(width, height) {
  const zoom = pixelZoomForViewport(width, height)
  const viewWidth = Math.min(width, WORLD.width * zoom)
  const viewHeight = Math.min(height, WORLD.height * zoom)
  return { x: Math.floor((width - viewWidth) / 2), y: Math.floor((height - viewHeight) / 2), width: viewWidth, height: viewHeight, zoom }
}
