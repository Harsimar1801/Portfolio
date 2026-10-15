import test from 'node:test'
import assert from 'node:assert/strict'
import { movementVector, canStandAt, isTextEntry, nearResume } from './movement.js'
import { PLAYER_START, MOVEMENT_SPEED, BUILDINGS, isRoadAt } from './townMap.js'
import { resumeExhibit } from '../data/resume.js'

test('all eight directions use equal normalized speed in town and every interior', () => {
  for (const interior of [false,true]) for (const x of [-1,0,1]) for (const y of [-1,0,1]) {
    const {dx,dy}=movementVector({left:x<0,right:x>0,up:y<0,down:y>0},16,interior)
    assert.ok(Math.abs(Math.hypot(dx,dy)-(x||y ? MOVEMENT_SPEED[interior?'interior':'town']*.016 : 0))<1e-9)
  }
  assert.equal(MOVEMENT_SPEED.interior/MOVEMENT_SPEED.town,1.3)
  assert.deepEqual(movementVector({left:true,right:true,up:true,down:true},16),{dx:0,dy:0})
  assert.ok(canStandAt(PLAYER_START.x,PLAYER_START.y))
  assert.equal(isTextEntry({closest:()=>({})}),true)
  assert.equal(isTextEntry(null),false)
})

test('road-only walkable routes connect spawn to all doors and the aligned About gate', () => {
  const queue=[PLAYER_START], seen=new Set()
  for(let i=0;i<queue.length;i++) {
    const p=queue[i],key=`${p.x},${p.y}`;if(seen.has(key))continue;seen.add(key)
    for(const [dx,dy] of [[4,0],[-4,0],[0,4],[0,-4]]) {
      const x=p.x+dx,y=p.y+dy
      if(isRoadAt(x,y)&&canStandAt(x,y)&&!seen.has(`${x},${y}`))queue.push({x,y})
    }
  }
  for(const b of BUILDINGS)assert.ok(queue.some((p)=>Math.hypot(p.x-b.door.x,p.y-b.door.y)<12),b.id)
  for(let y=148;y<224;y+=2)assert.ok(canStandAt(112,y)&&isRoadAt(112,y),`gate ${y}`)
  assert.ok(nearResume(PLAYER_START))
  assert.match(resumeExhibit().text,/8\.05\/10/)
  assert.match(resumeExhibit().text,/IN DEVELOPMENT/)
  assert.ok(!resumeExhibit().links.some((l)=>l.label.includes('PDF')))
})
