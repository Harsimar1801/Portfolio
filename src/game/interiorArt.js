// Original layered pixel furniture and tile artwork, in the same world-pixel
// units as townArt. Only this room's objects are destroyed on exit.
export function drawInterior(scene, room) {
  const objects = [], frames = []
  const graphic = (depth=0) => { const g=scene.add.graphics().setDepth(depth);objects.push(g);return g }
  const tile=graphic(), wall=graphic(1)
  const r=(g,x,y,w,h,color)=>g.fillStyle(color).fillRect(x,y,w,h)
  const label=(x,y,text,size=9,color='#ece4cc')=>{const t=scene.add.text(x,y,text,{fontFamily:'monospace',fontSize:`${size}px`,color,align:'center',wordWrap:{width:108},backgroundColor:'#162332',padding:{x:4,y:3}}).setOrigin(.5,0).setDepth(5000);objects.push(t);return t}
  r(tile,0,0,room.width,room.height,0x111b2a)
  for(let y=112;y<344;y+=16)for(let x=20;x<room.width-20;x+=16){r(tile,x,y,15,15,room.theme.floor);r(tile,x+1,y+1,13,1,0x686072);r(tile,x+2,y+13,10,1,0x303343);if((x+y)%48===4)r(tile,x+5,y+6,5,1,0x64616b)}
  r(wall,0,0,room.width,112,room.theme.wall)
  for(let x=0;x<room.width;x+=24){r(wall,x,18,22,72,0x283044);r(wall,x+2,20,18,2,0x4b4961)}
  r(wall,0,108,room.width,4,room.theme.trim);r(wall,0,112,room.width,5,0x101a2a)
  r(wall,0,0,20,360,0x192637);r(wall,room.width-20,0,20,360,0x192637);r(wall,0,344,room.width,16,0x192637)
  for(let bay=0;bay<room.width/480;bay++){
    const offset=bay*480
    // Carpet borders, a tiled inlay, bookshelf, shaded lamps, and potted foliage.
    r(tile,offset+60,170,360,112,0x273343);r(tile,offset+63,173,354,106,0x756076);r(tile,offset+66,176,348,100,0x443e55)
    for(let x=offset+70;x<offset+410;x+=16){r(tile,x,179,4,2,0xa08a96);r(tile,x,270,4,2,0xa08a96)}
    const g=graphic(210)
    r(g,offset+25,182,25,54,0x141f2e);r(g,offset+26,180,22,48,0x856b62)
    for(let y=184;y<224;y+=13){r(g,offset+29,y,16,9,0x252b3e);for(let j=0;j<4;j++)r(g,offset+30+j*4,y+1,3,7,[0x9e8ba9,0x6b9694,0xc1a47b,0x9a7373][j]);r(g,offset+27,y+10,20,2,0xc2a488)}
    for(const x of [offset+37,offset+445]){r(g,x-7,148,14,10,0x8e6860);r(g,x-5,156,10,6,0x604b50);r(g,x-2,130,4,21,0x547666);r(g,x-10,134,9,6,0x6b9b81);r(g,x+1,128,8,7,0x7baa8b);r(g,x-6,125,6,7,0x4f8b76)}
    for(const x of [offset+25,offset+451]){r(g,x,54,4,23,0x6b5d64);r(g,x-4,48,12,9,0xc4a879);r(g,x-2,50,8,5,0xf1cf87);r(g,x-5,78,14,2,0x152333)}
    const desk=graphic(255),x=offset+190,y=224
    r(desk,x+4,y+7,100,30,0x152130);r(desk,x,y,100,26,0x977b71);r(desk,x+2,y+2,96,18,0xc0a18a);r(desk,x+5,y+26,7,7,0x594b51);r(desk,x+88,y+26,7,7,0x594b51)
    if(room.theme.furniture==='gallery'){
      r(desk,x+7,y-14,86,29,0x273c4c);r(desk,x+9,y-12,82,25,0x4a626c);r(desk,x+12,y-10,2,19,0x9ab8ba)
      const count=room.exhibits.slice(bay*3,bay*3+3).filter((entry)=>!entry.empty).length
      for(let i=0;i<count;i++){r(desk,x+21+i*25,y-6,8,10,0xc8ad7b);r(desk,x+23+i*25,y+3,4,5,0xb38e64);r(desk,x+19+i*25,y+8,12,3,0x6b5464)}
    }else{
      r(desk,x+30,y-19,36,25,0x17283b);r(desk,x+33,y-16,30,18,0x4e7e87);for(let row=0;row<3;row++)r(desk,x+36,y-12+row*4,12+row*3,1,0xa0c8ba);r(desk,x+44,y+6,8,4,0x283647);r(desk,x+33,y+12,29,4,0x4c5365)
      r(desk,x+9,y+4,13,10,0xd0c7ac);r(desk,x+11,y+6,8,1,0x7b7f88);r(desk,x+77,y+5,8,8,0x71688a)
    }
    if(room.theme.furniture==='office'){
      const chair=graphic(280)
      r(chair,offset+234,257,16,20,0x283044);r(chair,offset+236,259,12,12,0x8e789a)
      r(chair,offset+233,272,18,5,0xb09bb4);r(chair,offset+235,277,3,4,0x51495d);r(chair,offset+246,277,3,4,0x51495d)
    }
    label(offset+240,7,room.theme.name,9,'#c3becf')
  }
  for(const exhibit of room.exhibits){
    const g=graphic(120),x=exhibit.x-55,y=35
    r(g,x+3,y+5,112,76,0x121c2b);r(g,x,y,110,76,room.theme.trim);r(g,x+3,y+3,104,70,0x171f34);r(g,x+6,y+6,98,50,0x435367)
    // A small original exhibit illustration; data titles distinguish real entries.
    r(g,x+35,y+13,40,25,0x182b3b);r(g,x+38,y+16,34,19,0x739ca6);r(g,x+43,y+20,12,2,0xd2ddcc);r(g,x+43,y+25,22,2,0xb3cabb);r(g,x+51,y+39,8,4,0x9f8da9);r(g,x+44,y+43,22,3,0x9f8da9)
    label(exhibit.x,y+55,exhibit.title.length>38 ? `${exhibit.title.slice(0,35)}…` : exhibit.title,9)
    const outline=graphic(4999);outline.lineStyle(2,0xe8ca8f).strokeRect(x-2,y-2,114,80).setVisible(false)
    frames.push({ exhibit, outline })
  }
  const door=graphic(2)
  r(door,215,319,50,25,0x0a1526);r(door,212,317,56,3,room.theme.trim);r(door,218,322,44,20,0x8a796e)
  for(let y=324;y<342;y+=5)r(door,220,y,40,1,0xb29c82)
  label(240,337,'EXIT · E',9,'#f3d393')
  return { objects, frames }
}
