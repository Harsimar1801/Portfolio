import test from 'node:test'
import assert from 'node:assert/strict'
import { drawPlayer } from './playerArt.js'

function render(direction, step) {
  const pixels = Array(24*34).fill(null)
  drawPlayer({ oval() {}, rect(x,y,w,h,color) {
    assert.ok([x,y,w,h].every(Number.isInteger))
    assert.ok(x>=0 && y>=0 && x+w<=24 && y+h<=34)
    for(let yy=y;yy<y+h;yy++)for(let xx=x;xx<x+w;xx++)pixels[yy*24+xx]=color
  } },direction,step)
  return pixels
}

test('all player frames fit the original atlas cell and keep head registration during walking', () => {
  const directions=['down','up','left','right']
  const heads=[]
  for(const direction of directions) {
    const idle=render(direction,0),walk=render(direction,1)
    assert.deepEqual(idle.slice(0,16*24),walk.slice(0,16*24),'Pagdi and face stay fixed')
    assert.notDeepEqual(idle,walk,'Feet and arms animate')
    assert.ok(idle.includes('#244793'),'Royal blue cloth is present')
    if(direction!=='up')assert.ok(idle.includes('#42404a'),'Beard highlights are present')
    heads.push(JSON.stringify(idle.slice(0,19*24)))
  }
  assert.equal(new Set(heads).size,4,'Each facing has distinct artwork')
})
