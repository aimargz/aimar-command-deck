function createNeuralLogo(){
  const wrap=document.createElement('div');
  wrap.className='aimar-neural-logo';
  wrap.innerHTML='<canvas aria-hidden="true"></canvas><span class="aimar-neural-axis"></span><span class="aimar-neural-core"></span><span class="aimar-neural-word">neural systems</span>';
  const canvas=wrap.querySelector('canvas');
  const ctx=canvas.getContext('2d');
  const state={mx:0,my:0,hover:false,t:0,nodes:[]};
  const seed=[
    [0,-.62],[.18,-.34],[-.18,-.34],[.36,.08],[-.36,.08],[.18,.38],[-.18,.38],[0,.02],[.48,.34],[-.48,.34],[.31,-.08],[-.31,-.08],[0,.56]
  ];
  function resize(){const r=wrap.getBoundingClientRect();const d=Math.min(window.devicePixelRatio||1,2);canvas.width=Math.max(1,Math.floor(r.width*d));canvas.height=Math.max(1,Math.floor(r.height*d));canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';ctx.setTransform(d,0,0,d,0,0)}
  function init(){state.nodes=seed.map((p,i)=>({x:p[0],y:p[1],r:1.4+(i%3)*.45,phase:i*.72}))}
  function draw(){const w=canvas.clientWidth,h=canvas.clientHeight,cx=w/2,cy=h/2,rad=Math.min(w,h)*.42;state.t+=.012;ctx.clearRect(0,0,w,h);ctx.save();ctx.translate(cx,cy);ctx.rotate(state.t*.035);ctx.strokeStyle='rgba(125,239,255,.20)';ctx.lineWidth=1;for(let r of [.45,.66,.86]){ctx.beginPath();ctx.arc(0,0,rad*r,0,Math.PI*2);ctx.stroke()}ctx.restore();const pts=state.nodes.map(n=>{const drift=Math.sin(state.t+n.phase)*.018;const pull=state.hover?.035:0;return{x:cx+(n.x+drift+state.mx*pull)*rad,y:cy+(n.y+Math.cos(state.t+n.phase)*.014+state.my*pull)*rad,r:n.r}});ctx.lineWidth=.75;for(let i=0;i<pts.length;i++){for(let j=i+1;j<pts.length;j++){const a=pts[i],b=pts[j];const dist=Math.hypot(a.x-b.x,a.y-b.y);if(dist<rad*.62){const alpha=(1-dist/(rad*.62))*(state.hover?.48:.28);ctx.strokeStyle=`rgba(125,239,255,${alpha})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}ctx.strokeStyle=state.hover?'rgba(245,251,255,.82)':'rgba(245,251,255,.58)';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(cx-rad*.30,cy+rad*.34);ctx.lineTo(cx,cy-rad*.43);ctx.lineTo(cx+rad*.30,cy+rad*.34);ctx.stroke();ctx.strokeStyle='rgba(125,239,255,.30)';ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(cx-rad*.16,cy+rad*.16);ctx.lineTo(cx,cy-rad*.18);ctx.lineTo(cx+rad*.16,cy+rad*.16);ctx.stroke();for(const p of pts){const pulse=.65+Math.sin(state.t*2+p.r)*.35;ctx.fillStyle=`rgba(180,248,255,${.42+pulse*.42})`;ctx.beginPath();ctx.arc(p.x,p.y,p.r*(state.hover?1.25:1),0,Math.PI*2);ctx.fill();ctx.shadowColor='rgba(125,239,255,.8)';ctx.shadowBlur=8;ctx.fill();ctx.shadowBlur=0}requestAnimationFrame(draw)}
  wrap.addEventListener('pointermove',e=>{const r=wrap.getBoundingClientRect();state.mx=((e.clientX-r.left)/r.width-.5)*2;state.my=((e.clientY-r.top)/r.height-.5)*2;state.hover=true});
  wrap.addEventListener('pointerleave',()=>{state.mx=0;state.my=0;state.hover=false});
  resize();init();requestAnimationFrame(draw);new ResizeObserver(resize).observe(wrap);return wrap;
}
function injectAimarLogo(){const hero=document.querySelector('.aurora-orb');if(hero&&!hero.querySelector('.aimar-neural-logo')){hero.appendChild(createNeuralLogo())}const header=document.querySelector('header .flex.min-w-0.items-center.gap-3');if(header&&!header.querySelector('.aimar-header-mark')){const old=header.querySelector('svg');if(old)old.style.display='none';const mark=document.createElement('span');mark.className='aimar-header-mark';header.prepend(mark)}}
function boot(){injectAimarLogo();new MutationObserver(injectAimarLogo).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
