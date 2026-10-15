import test from 'node:test'
import assert from 'node:assert/strict'
import { createRoom, moveInRoom, nearbyExhibit, roomExhibits } from './interiors.js'

test('every room has reachable exhibits and a walkable exit', () => {
  for (const section of ['projects','skills','about','achievements','contact']) {
    const room=createRoom(section), visited=new Set(), queue=[room.spawn]
    for(let i=0;i<queue.length;i++) {
      const p=queue[i],key=`${p.x},${p.y}`
      if(visited.has(key))continue
      visited.add(key)
      for(const [dx,dy] of [[4,0],[-4,0],[0,4],[0,-4]]) {
        const next=moveInRoom(room,p,dx,dy)
        if((next.x!==p.x||next.y!==p.y)&&!visited.has(`${next.x},${next.y}`))queue.push(next)
      }
    }
    for(const exhibit of room.exhibits)assert.ok(queue.some((p)=>nearbyExhibit(room,p)?.id===exhibit.id), `${section}: ${exhibit.id} reachable`)
    assert.ok(queue.some((p)=>Math.hypot(p.x-room.exit.x,p.y-room.exit.y)<20))
    assert.deepEqual(moveInRoom(room,{x:240,y:260},0,-4),{x:240,y:260},'Desk blocks feet')
    assert.deepEqual(moveInRoom(room,{x:100,y:116},0,-4),{x:100,y:116},'Wall blocks feet')
  }
})

test('project collection creates stable exhibits and grows into additional gallery bays', () => {
  const projects=Array.from({length:8},(_,i)=>({id:`qa-${i}`,title:`QA ${i}`,description:'Test only',technologies:[],status:'Test',featured:false}))
  const room=createRoom('projects',{projects})
  assert.equal(room.width,1440)
  assert.equal(room.exhibits.length,8)
  assert.equal(room.exhibits[7].project,projects[7])
  assert.equal(room.exhibits[7].id,'project:qa-7')
  assert.equal(roomExhibits('skills',{skills:[{id:'x',name:'X',category:'Test'},{id:'y',name:'Y',category:'Test'}]}).length,1)
})

test('contact computer and wall display inspect the same data without blocking the exit', () => {
  const room = createRoom('contact')
  assert.equal(nearbyExhibit(room, { x: 240, y: 270 })?.id, 'profile:contact')
  assert.equal(nearbyExhibit(room, { x: 90, y: 142 })?.id, 'profile:contact')
  assert.equal(nearbyExhibit(room, room.spawn), undefined)
})
