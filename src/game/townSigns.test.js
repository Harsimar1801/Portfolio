import test from 'node:test'
import assert from 'node:assert/strict'
import { BUILDINGS } from './townMap.js'
import { phoneSign } from './townSigns.js'

test('phone signs fit their façades and narrow portrait viewports without scaling glyphs', () => {
  for (const viewport of [320, 360, 390, 430]) {
    for (const building of BUILDINGS) {
      const sign = phoneSign(building)
      assert.ok(sign.width <= building.w)
      assert.ok(sign.width < viewport - 24)
      assert.equal(sign.height, 11)
      assert.ok(sign.width < (building.name.length * 6 + 11) * 2)
    }
  }
  assert.equal(phoneSign(BUILDINGS.find((b) => b.id === 'projects')).text, 'PROJECTS')
  assert.equal(phoneSign(BUILDINGS.find((b) => b.id === 'contact')).text, 'CONTACT')
})
