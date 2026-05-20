function bootAimarIdentity(){
  const header=document.querySelector('header .flex.min-w-0.items-center.gap-3');
  if(header&&!header.querySelector('.aimar-header-mark')){
    const old=header.querySelector('svg');
    if(old)old.style.display='none';
    const mark=document.createElement('span');
    mark.className='aimar-header-mark';
    header.prepend(mark);
  }
  bootOrbNetwork();
}

function updateRepel(event){
  const orb=document.querySelector('.aurora-orb');
  if(!orb)return;
  const r=orb.getBoundingClientRect();
  const cx=r.left+r.width/2;
  const cy=r.top+r.height/2;
  const dx=cx-event.clientX;
  const dy=cy-event.clientY;
  const dist=Math.max(1,Math.hypot(dx,dy));
  const zone=210;
  const force=Math.max(0,1-dist/zone);
  const push=force*38;
  orb.style.setProperty('--aimar-repel-x',`${((dx/dist)*push).toFixed(2)}px`);
  orb.style.setProperty('--aimar-repel-y',`${((dy/dist)*push).toFixed(2)}px`);
  document.documentElement.style.setProperty('--aimar-bg-x',`${Math.round((event.clientX/window.innerWidth)*100)}%`);
  document.documentElement.style.setProperty('--aimar-bg-y',`${Math.round((event.clientY/window.innerHeight)*100)}%`);
}
function relaxRepel(){
  const orb=document.querySelector('.aurora-orb');
  if(!orb)return;
  orb.style.setProperty('--aimar-repel-x','0px');
  orb.style.setProperty('--aimar-repel-y','0px');
}

function bootOrbNetwork(){
  const orb=document.querySelector('.aurora-orb');
  if(!orb||orb.querySelector('.aimar-orb-network'))return;
  const layer=document.createElement('div');
  layer.className='aimar-orb-network';
  const canvas=document.createElement('canvas');
  layer.appendChild(canvas);
  orb.appendChild(layer);
  const ctx=canvas.getContext('2d');
  if(!ctx)return;
  const nodes=Array.from({length:18},(_,i)=>({
    a:(Math.PI*2*i)/18+(i%3)*.09,
    r:.38+(i%5)*.075,
    s:.0028+((i%4)*.0007),
    p:i*.71
  }));
  const packets=Array.from({length:9},(_,i)=>({from:i*2,to:(i*2+5)%18,t:i/9,s:.006+(i%3)*.002}));
  function resize(){
    const rect=layer.getBoundingClientRect();
    const d=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.floor(rect.width*d));
    canvas.height=Math.max(1,Math.floor(rect.height*d));
    canvas.style.width=rect.width+'px';
    canvas.style.height=rect.height+'px';
    ctx.setTransform(d,0,0,d,0,0);
  }
  function draw(){
    const w=canvas.clientWidth||260;
    const h=canvas.clientHeight||260;
    const cx=w/2,cy=h/2;
    const base=Math.min(w,h)*.36;
    ctx.clearRect(0,0,w,h);
    const pts=nodes.map((n,i)=>{
      n.a+=n.s;
      const rr=base*(n.r+.018*Math.sin(performance.now()/1400+n.p));
      return {x:cx+Math.cos(n.a)*rr,y:cy+Math.sin(n.a)*rr,z:n.r,i};
    });
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<base*.62){
          const alpha=(1-d/(base*.62))*.26;
          ctx.strokeStyle=`rgba(125,239,255,${alpha})`;
          ctx.lineWidth=.75;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }
    for(const p of packets){
      p.t=(p.t+p.s)%1;
      const a=pts[p.from],b=pts[p.to];
      const x=a.x+(b.x-a.x)*p.t;
      const y=a.y+(b.y-a.y)*p.t;
      ctx.fillStyle='rgba(235,252,255,.86)';
      ctx.shadowColor='rgba(125,239,255,.9)';
      ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(x,y,1.8,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }
    for(const p of pts){
      ctx.fillStyle='rgba(125,239,255,.54)';
      ctx.beginPath();ctx.arc(p.x,p.y,1.45+p.z*.8,0,Math.PI*2);ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  resize();
  try{new ResizeObserver(resize).observe(layer)}catch(e){window.addEventListener('resize',resize)}
  requestAnimationFrame(draw);
}

function boot(){
  bootAimarIdentity();
  let attempts=0;
  const timer=setInterval(()=>{bootAimarIdentity();attempts+=1;if(attempts>30)clearInterval(timer)},250);
  window.addEventListener('pointermove',updateRepel,{passive:true});
  window.addEventListener('pointerleave',relaxRepel,{passive:true});
  new MutationObserver(bootAimarIdentity).observe(document.body,{childList:true,subtree:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
