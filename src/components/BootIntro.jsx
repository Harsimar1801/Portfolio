import { useEffect, useRef, useState } from 'react'
import titleArt from '../assets/title-landscape.svg'

// Original integer-coordinate pixel landscape, painted once at 480 x 270.
function paint(canvas) {
  const c = canvas.getContext('2d')
  if (!c) return
  c.imageSmoothingEnabled = false
  const r = (x,y,w,h,color) => { c.fillStyle=color; c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h)) }
  for(let y=0;y<270;y++) r(0,y,480,1,y<70?'#10182f':y<110?'#242640':y<155?'#3b3654':'#494259')
  let seed=814
  const rand=()=>{seed=seed*16807%2147483647;return seed/2147483647}
  for(let i=0;i<130;i++)r(rand()*480,rand()*110,1,1,i%4?'#65748f':'#c8d8d8')
  for(const [x,y,w,h] of [[366,27,16,2],[362,29,24,4],[360,33,28,12],[362,45,24,4],[366,49,16,2]])r(x,y,w,h,'#e5dab6')
  for(const [x,y,w,h] of [[374,25,15,5],[370,30,20,14],[374,44,15,3]])r(x,y,w,h,'#10182f')
  for(const [x,y,w] of [[23,46,65],[42,49,63],[330,65,74],[350,68,70],[181,29,31]]){r(x,y,w,2,'#30334c');r(x+8,y-2,w-20,2,'#262e46')}
  const ridge=(points,base,color,edge)=>{
    for(let x=0;x<480;x+=3){let i=0;while(i<points.length-2&&x>points[i+1][0])i++
      const [ax,ay]=points[i],[bx,by]=points[i+1],y=Math.floor((ay+(by-ay)*(x-ax)/(bx-ax))/3)*3
      r(x,y,3,base-y,color);if(by>ay)r(x,y,3,3,edge)
    }
  }
  ridge([[0,118],[55,72],[90,105],[157,57],[218,111],[275,76],[340,109],[400,68],[480,123]],190,'#353652','#544963')
  ridge([[0,153],[54,123],[113,143],[182,102],[254,147],[319,112],[389,143],[441,108],[480,134]],220,'#26334b','#3f455c')
  ridge([[0,177],[73,153],[140,171],[205,147],[275,165],[352,147],[418,165],[480,142]],270,'#244048','#35565a')
  const pine=(x,y,h,color)=>{r(x-1,y,3,h,'#282c3c');for(let row=0;row<h-3;row+=3){const w=2+Math.floor(row*.42);r(x-w,y+row,w*2+1,3,color);if(row%6===0)r(x-w,y+row,w,1,'#2b494f')}}
  for(let x=0;x<480;x+=7)pine(x,146+rand()*18,18+rand()*13,'#20363f')
  for(let y=175;y<270;y+=2){const x=280+Math.sin(y/25)*34,w=8+(y-175)*.4;r(x,y,w,2,'#365f70');if(y%6===1)r(x+3,y,w-6,1,'#698b96')}
  r(0,214,205,56,'#19323b');r(370,223,110,47,'#19323b')
  const house=(x,y,w,roof)=>{r(x+2,y+11,w-4,17,'#5e5b69');r(x+4,y+14,w-8,12,'#8a7775');for(let row=0;row<12;row+=2)r(x+6-row/2,y+row,w-12+row,2,roof);r(x,y+12,w,2,'#252c41');r(x+5,y+18,3,4,'#f5cd83');r(x+w-9,y+18,3,4,'#f5cd83');r(x+w/2-2,y+20,4,8,'#32364b')}
  house(82,175,30,'#826477');house(120,165,38,'#6f5e87');house(164,180,27,'#a47c6f');house(335,185,30,'#65758b')
  r(134,155,8,13,'#7a738b');r(136,158,3,5,'#f7d58c');r(132,154,12,3,'#393a59')
  for(let i=0;i<100;i++){const x=rand()*480,y=216+rand()*54;if(x<220||x>370)r(x,y,2,1,i%4?'#2b484e':'#5b6862')}
  for(const [x,y,h] of [[8,165,85],[32,182,70],[53,203,64],[454,162,96],[477,183,85],[423,218,52]])pine(x,y,h,'#102a35')
  for(const [x,y] of [[64,223],[207,235],[383,241]]){r(x,y,2,10,'#7a6563');r(x-2,y-4,6,5,'#d2a469');r(x-1,y-3,4,3,'#f4d593')}
}

export default function BootIntro({ onComplete, backdrop = null }) {
  const canvas=useRef(null)
  const [ready,setReady]=useState(false),[leaving,setLeaving]=useState(false)
  useEffect(()=>{
    paint(canvas.current)
    const started = performance.now()
    let cancelled=false,finished=false,readyTimer,exitTimer
    const artwork=new Image()
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    const finish=()=>{
      if(cancelled||finished)return
      finished=true;clearTimeout(fallback);artwork.onload=artwork.onerror=null;setReady(true)
      // Seven-second cinematic boot sequence; actual resource readiness is separate.
      readyTimer=setTimeout(()=>{if(cancelled)return;setLeaving(true);exitTimer=setTimeout(()=>{if(!cancelled)onComplete()},reduced?0:450)},reduced?150:Math.max(0, 6550 - (performance.now() - started)))
    }
    const fallback=setTimeout(finish,2500)
    artwork.onload=finish;artwork.onerror=finish;artwork.src=titleArt
    return()=>{cancelled=true;artwork.onload=artwork.onerror=null;clearTimeout(fallback);clearTimeout(readyTimer);clearTimeout(exitTimer)}
  },[onComplete])
  return <>{leaving && <div inert aria-hidden="true">{backdrop}</div>}<main className={`boot-intro${ready?' is-ready':''}${leaving?' is-leaving':''}`} aria-label="Harsimar.EXE opening intro">
    <canvas ref={canvas} className="boot-landscape" width="480" height="270" aria-hidden="true" />
    <div className="boot-atmosphere" aria-hidden="true"/><div className="boot-stars" aria-hidden="true">✦</div><div className="boot-meteor" aria-hidden="true"/>
    <div className="boot-edge boot-top">HS / WORLD INITIALIZATION<span>ORIGINAL WORLD · 01</span></div>
    <section className="boot-brand"><p className="boot-kicker">A SMALL WORLD. A NEW ADVENTURE.</p><h1>HARSIMAR<span>.EXE</span></h1><p className="boot-subtitle">THE DEVELOPER QUEST</p><div className="boot-rule" aria-hidden="true">◆</div>
      <div className="boot-track boot-sequence" role="progressbar" aria-label="Cinematic boot sequence"><span/></div>
      <p className="boot-sequence-label">BOOT SEQUENCE</p><p className="boot-status" role="status">{ready?'WORLD READY':'PREPARING TITLE ARTWORK'}<span aria-hidden="true">{ready?'  ◆':' …'}</span></p>
    </section>
    <div className="boot-edge boot-bottom"><span>EXPLORE · CREATE · DISCOVER</span><span>A PORTFOLIO ADVENTURE</span></div>
  </main></>
}

