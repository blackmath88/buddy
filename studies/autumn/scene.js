/* Adapted from blackmath88/library-ui PR #1, head 789ac5cad69a2c57318d0933d53d0877e9c8f059.
   Study only. No network, geolocation, external font or package dependencies. */
(() => {
'use strict';
const body=document.body,cv=document.getElementById('stage'),ctx=cv.getContext('2d');
const status=document.getElementById('status');
if(!ctx){status.textContent='Static background: canvas is unavailable.';return;}
const KEYS=['sky-1','sky-2','sky-3','sky-4','sky-5','sun','sun-core','star','hill-far','hill-near','tree-1','tree-2','tree-3','tree-4','trunk','bridge','bridge-lit','ground','leaf-0','leaf-1','leaf-2','leaf-3','leaf-4'];
const bg=document.createElement('canvas'),BAYER=[0,8,2,10,12,4,14,6,3,11,1,9,15,7,13,5].map(v=>v/16);
const KINDS=['maple','oak','birch'],BASES=[1,2,3],SS=11,SC=5,FR=16,frames={};
let C={},W=0,H=0,groundY=0,leaves=[],t=0,last=0,raf=0,paused=false;
function readTokens(){const css=getComputedStyle(body);for(const k of KEYS)C[k]=css.getPropertyValue('--gu-'+k).trim();}
function rng(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let n=Math.imul(a^a>>>15,1|a);n=n+Math.imul(n^n>>>7,61|n)^n;return((n^n>>>14)>>>0)/4294967296;};}
function noise(seed){const r=rng(seed),g=Array.from({length:256},r);return x=>{const i=Math.floor(x),f=x-i,u=f*f*(3-2*f);return g[i&255]+(g[(i+1)&255]-g[i&255])*u;};}
function disc(b,cx,cy,r,col){b.fillStyle=col;for(let y=-r;y<=r;y++)for(let x=-r;x<=r;x++)if(x*x+y*y<=r*r)b.fillRect(cx+x,cy+y,1,1);}
function grid(kind){
 const px=new Set(),add=(x,y)=>{x=Math.round(x);y=Math.round(y);if(x>=0&&y>=0&&x<SS&&y<SS)px.add(x+','+y);};
 if(kind==='maple'){for(const[a,L]of[[-90,5.2],[-152,4.2],[-28,4.2],[28,3.6],[152,4.2]]){const r=a*Math.PI/180,dx=Math.cos(r),dy=Math.sin(r);for(let d=1;d<=L;d+=.22){const w=.35+(1-d/L)*1.5;for(let o=-w;o<=w;o+=.3)add(SC+dx*d-dy*o,SC+dy*d+dx*o);}}}
 else if(kind==='oak'){for(let y=0;y<SS;y++)for(let x=0;x<SS;x++){const nx=(x-SC)/4.4,ny=(y-SC)/3.2,a=Math.atan2(ny,nx);if(Math.hypot(nx,ny)*(1+.16*Math.cos(3*a)+.08*Math.cos(5*a))<=1)add(x,y);}}
 else{for(let y=0;y<SS;y++)for(let x=0;x<SS;x++){const ny=(y-SC)/4.8;if(Math.abs(ny)<=1&&Math.abs(x-SC)<=2.6*(1-Math.abs(ny))*(ny<0?1.25:.9)+.5)add(x,y);}}
 for(let y=SC+2;y<SS;y++)add(SC,y);
 return Array.from({length:SS},(_,y)=>Array.from({length:SS},(_,x)=>px.has(x+','+y)?1:[[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>px.has((x+dx)+','+(y+dy)))?2:0));
}
function buildFrames(){for(const kind of KINDS){const g=grid(kind);frames[kind]={};for(const base of BASES){frames[kind][base]=[];for(let r=0;r<8;r++){const f=document.createElement('canvas');f.width=FR;f.height=FR;const b=f.getContext('2d');b.imageSmoothingEnabled=false;b.translate(FR/2,FR/2);b.rotate(r*Math.PI/4);for(let y=0;y<SS;y++)for(let x=0;x<SS;x++){const v=g[y][x];if(!v)continue;b.fillStyle=v===2?C['leaf-0']:C['leaf-'+(y>0&&g[y-1][x]===0?Math.min(base+1,4):base)];b.fillRect(x-SC-.5,y-SC-.5,1,1);}frames[kind][base].push(f);}}}}
function backdrop(){
 bg.width=W;bg.height=H;const b=bg.getContext('2d');b.imageSmoothingEnabled=false;
 const horizon=Math.round(H*.6);groundY=Math.round(H*.86);
 const stops=[1,2,3,4,5].map(i=>C['sky-'+i]).map(h=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)));
 const img=b.createImageData(W,horizon+1);for(let y=0;y<=horizon;y++){const p=y/horizon*4,i=Math.min(3,Math.floor(p)),f=p-i;for(let x=0;x<W;x++){const c=stops[f>BAYER[(y&3)*4+(x&3)]?i+1:i],o=(y*W+x)*4;img.data[o]=c[0];img.data[o+1]=c[1];img.data[o+2]=c[2];img.data[o+3]=255;}}b.putImageData(img,0,0);
 if(body.dataset.mood==='night'){const r=rng(7);b.fillStyle=C.star;for(let i=0;i<W/5;i++)b.fillRect(Math.floor(r()*W),Math.floor(r()*horizon*.7),1,1);}
 const sx=Math.round(W*.7),sy=Math.round(horizon-H*.11),sr=Math.max(6,Math.round(H*.075));disc(b,sx,sy,sr,C.sun);disc(b,sx,sy,Math.round(sr*.62),C['sun-core']);
 const n1=noise(11),far=x=>Math.round(horizon-2-n1(x*.02)*H*.07);b.fillStyle=C['hill-far'];for(let x=0;x<W;x++)b.fillRect(x,far(x),1,H-far(x));
 const r=rng(23);for(let x=2;x<W-3;x+=3+Math.floor(r()*5)){const y=far(x),h=2+Math.floor(r()*3),cr=2+Math.floor(r()*3);b.fillStyle=C.trunk;b.fillRect(x,y-h,1,h);disc(b,x+1,y-h-Math.round(cr*.4),cr,C['tree-'+(1+Math.floor(r()*4))]);}
 const n2=noise(47),near=x=>Math.round(H*.76-n2(x*.03)*H*.05);b.fillStyle=C['hill-near'];for(let x=0;x<W;x++)b.fillRect(x,near(x),1,H-near(x));
 const w=Math.max(26,Math.round(W*.14)),h=Math.max(8,Math.round(H*.05)),x0=Math.round(W*.5-w/2),y0=near(Math.round(W*.5))-h,roof=Math.round(h*.7);b.fillStyle=C.bridge;b.fillRect(x0,y0,w,h);for(let i=0;i<w;i+=2)b.fillRect(x0+i,y0-Math.round(roof*(1-Math.abs(i/w-.5)*2)),2,roof);b.fillStyle=C['bridge-lit'];for(let x=x0+4;x<x0+w-5;x+=6)b.fillRect(x,y0+Math.floor(h*.35),3,Math.max(2,Math.round(h*.3)));
 b.fillStyle=C.ground;b.fillRect(0,groundY,W,H-groundY);const litter=rng(99);for(let i=0;i<W*H*.02;i++){b.fillStyle=C['leaf-'+(1+Math.floor(litter()*3))];b.fillRect(Math.floor(litter()*W),groundY+Math.floor(litter()*(H-groundY)),1,1);}
}
function spawn(){return{kind:KINDS[Math.floor(Math.random()*3)],base:BASES[Math.floor(Math.random()*3)],x:Math.random()*W,y:Math.random()*groundY,z:[.5,.75,1][Math.floor(Math.random()*3)],vy:16+Math.random()*26,phase:Math.random()*6.28,sway:5+Math.random()*9,rot:Math.random()*6.28,spin:(Math.random()*2-1)*1.4};}
function render(dt){t+=dt;ctx.imageSmoothingEnabled=false;ctx.drawImage(bg,0,0);const wind=6+16*Math.pow(Math.max(0,Math.sin(t*2*Math.PI/13)),3);for(const l of leaves){if(dt){l.x+=wind*l.z*dt;l.y+=l.vy*l.z*dt;l.rot+=l.spin*dt;if(l.x>W+16)l.x=-16;if(l.y>=groundY){const b=bg.getContext('2d');b.fillStyle=C['leaf-'+l.base];b.fillRect(Math.round(l.x),groundY+Math.floor(Math.random()*(H-groundY)),1,1);l.x=Math.random()*W;l.y=-16;}}const size=Math.max(2,Math.round(FR*l.z)),frame=((Math.floor(l.rot/(Math.PI/4))%8)+8)%8;ctx.globalAlpha=.35+.65*l.z;ctx.drawImage(frames[l.kind][l.base][frame],Math.round(l.x+Math.sin(t+l.phase)*l.sway-size/2),Math.round(l.y-size/2),size,size);}ctx.globalAlpha=1;}
function tick(ts){raf=0;if(paused||document.hidden)return;const dt=Math.min(.05,(ts-last)/1000||.016);last=ts;render(dt);raf=requestAnimationFrame(tick);}
function schedule(){cancelAnimationFrame(raf);raf=0;last=performance.now();if(!paused&&!document.hidden)raf=requestAnimationFrame(tick);}
function resize(){const scale=Math.max(2,Math.round(Math.min(innerWidth/480,innerHeight/270)));W=Math.max(1,Math.min(640,Math.ceil(innerWidth/scale)));H=Math.max(1,Math.min(480,Math.ceil(innerHeight/scale)));cv.width=W;cv.height=H;backdrop();buildFrames();leaves=Array.from({length:Math.min(70,Math.round(W*H/1600))},spawn).sort((a,b)=>a.z-b.z);render(0);}
const still=document.getElementById('still'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
function setPaused(value){paused=value;still.setAttribute('aria-pressed',String(value));still.textContent=value?'Resume animation':'Pause animation';status.textContent=value?'Autumn preview — animation paused':'Autumn preview — animation running';render(0);schedule();}
for(const button of document.querySelectorAll('[data-mood-btn]'))button.addEventListener('click',()=>{body.dataset.mood=button.dataset.moodBtn;document.querySelectorAll('[data-mood-btn]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));readTokens();backdrop();buildFrames();render(0);});
still.addEventListener('click',()=>setPaused(!paused));
reduced.addEventListener('change',e=>{if(e.matches)setPaused(true);});
addEventListener('resize',resize);document.addEventListener('visibilitychange',schedule);
readTokens();resize();setPaused(reduced.matches);
})();
