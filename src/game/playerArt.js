// Original 24×34 player artwork. Head registration stays fixed in both walk
// frames; only sleeves, hands and feet alternate. Light comes from upper left.
const palette = {
  o:'#121c30', s:'#172d62', b:'#244793', m:'#3968bd', h:'#7198dc',
  k:'#b67b60', t:'#daa17b', f:'#efbd90',
  d:'#242530', g:'#42404a', e:'#151b29', w:'#f1ddbc',
}
const heads = {
  down: [
    '......oooooo......',
    '....oobbmmmbboo....',
    '...obbmmhhmmbbo...',
    '..obbmmhhmmmbbbo..',
    '.obbmmhhmmssmbbbo.',
    '.obmmhhmmssmmmbbo.',
    '.obmhhmmssmmhhbbo.',
    '.obhhmmssmmhhmbbo.',
    '..obmmssmmhhmbbo..',
    '...ossmmhmmssso...',
    '...okffffttttko...',
    '...okddfttddtko...',
    '...otewfttewtko...',
    '...otfftfttttko...',
    '....dftggtttdd....',
    '....dddddkdddd....',
    '.....dgdddddd.....',
    '......dggddd......',
    '.......dddd.......',
  ],
  up: [
    '......oooooo......','....oobbbbbboo....','...obbmmmmmmbbo...',
    '..obbmmhhhmmmbbo..','.obbmmhhmmmmmbbbo.','.obmmhmmmssmmmbbo.',
    '.obhhhmmssmmmhbbo.','.obmmhhmmmmhhmbbo.','..obbbhhhhhmbbbo..',
    '...ossmmmmmbsso...','....osssbbsso.....','....odddddddo.....',
    '.....odddddo......','......okttko......',
  ],
  left: [
    '......oooooo......','....oobbbbbboo....','...obbmmmmmmbbo...',
    '..obbmmhhhmmmbbo..','.obbmmhhmmmssbbbo.','.obmmhhmmmssmmbbo.',
    '.obhhhmmssmmhmbbo.','.obmmmmssmmhhmbbo.','..ossmmhhmmbbbbo..',
    '...okffmmsssbbo...','...okffttttkdo....','...oddfttttkdo....',
    '..ofewfftttkdo....','..oftfttttkddo....','...odfgttkdddo....',
    '...oddddkdddo.....','....dggddddo......','.....dgdddo.......','......dddo........',
  ],
}

export function drawPlayer({rect:r,oval}, direction, step) {
  const side = direction === 'left' || direction === 'right'
  oval(4,28,16,4,'#101a2b88')
  // Trousers and leather shoes, with separated legs and small warm soles.
  r(7,24,10,4,'#172338'); r(8,25,3,4,'#384052');r(14,25,3,4,'#283247')
  r(7,28-step,5,3,'#171c29');r(13,28+step,5,3,'#171c29')
  r(7,29-step,4,1,'#65717b');r(13,29+step,4,1,'#4a5665')
  r(7,31-step,5,1,'#ac9a85');r(13,31+step,5,1,'#8d8077')
  // Teal jacket, pale shirt and brass fastening. Narrower torso in profile.
  r(side?7:5,16,side?11:14,10,'#142538')
  r(side?8:6,17,side?9:12,8,'#345b64');r(side?9:7,17,3,7,'#59838a')
  r(7,25,11,2,'#223b4c')
  if(direction==='down') {r(11,18,3,7,'#d5c3a1');r(10,20,1,5,'#1e394c');r(14,20,1,5,'#1e394c');r(14,23,1,1,'#caa775')}
  if(direction==='up') {
    r(8,17,9,8,'#694e44');r(9,18,7,5,'#a27b59');r(9,18,7,1,'#cfac7c');r(11,22,3,2,'#775d4b')
  }
  const arms=side ? [direction==='left'?14:6] : [4,18]
  for(const x of arms){const swing=x<12?step:-step;r(x,18+swing,3,6,'#1d394a');r(x,18+swing,2,4,'#5c8389');r(x,23+swing,3,3,'#b77f62');r(x,23+swing,2,2,'#e5b48a')}
  // Draw the complete head last so beard follows the jaw and overlaps collar.
  const rows=heads[side?'left':direction]
  rows.forEach((row,y)=>[...row].forEach((pixel,x)=>{
    if(palette[pixel])r(3+(direction==='right'?17-x:x),y,1,1,palette[pixel])
  }))
}
