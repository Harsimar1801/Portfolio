import test from 'node:test'
import assert from 'node:assert/strict'
import { WORLD } from './townMap.js'
import { pixelZoomForViewport, cameraViewport } from './viewport.js'

test('integer camera view stays inside both canvas and authored world', () => {
  for (const [width, height] of [[1920, 1080], [1366, 768], [390, 844], [320, 568], [768, 1024], [844, 390], [667, 375], [568, 320]]) {
    const zoom = pixelZoomForViewport(width, height)
    assert.equal(Number.isInteger(zoom), true)
    const view = cameraViewport(width, height)
    assert.ok(view.width / zoom <= WORLD.width)
    assert.ok(view.height / zoom <= WORLD.height)
    assert.ok(view.x >= 0 && view.x + view.width <= width)
    assert.ok(view.y >= 0 && view.y + view.height <= height)
  }
})

test('desktop defaults expose more town without shrinking the avatar below 2x', () => {
  for (const [width, height] of [[1366, 638], [1920, 950]]) {
    const view = cameraViewport(width, height)
    assert.equal(view.zoom, 2)
    assert.equal(view.width / view.zoom, WORLD.width)
    assert.ok(view.height / view.zoom >= 319)
  }
})
