function bootAimarIdentity(){
  const header=document.querySelector('header .flex.min-w-0.items-center.gap-3');
  if(header&&!header.querySelector('.aimar-header-mark')){
    const old=header.querySelector('svg');
    if(old)old.style.display='none';
    const mark=document.createElement('span');
    mark.className='aimar-header-mark';
    header.prepend(mark);
  }
  bootWordmark();
  bootNeuralOrb();
}

function bootWordmark(){
  const h1=Array.from(document.querySelectorAll('main section h1')).find(el=>el.textContent.trim().toLowerCase()==='aimar');
  if(!h1||h1.querySelector('.aimar-wordmark-kerned'))return;
  h1.setAttribute('aria-label','Aimar');
  h1.innerHTML='<span class="aimar-wordmark-kerned" aria-hidden="true"><span>A</span><span>i</span><span>m</span><span>a</span><span>r</span></span>';
}

function bootNeuralOrb(){
  const orb=document.querySelector('.aurora-orb');
  if(!orb)return;
  orb.querySelectorAll('.aimar-gyro').forEach(el=>el.remove());
  if(orb.querySelector('.aimar-neural-orb'))return;
  const system=document.createElement('div');
  system.className='aimar-neural-orb';
  system.innerHTML='<span class="aimar-orb-aura"></span><span class="aimar-orbit orbit-one"></span><span class="aimar-orbit orbit-two"></span><span class="aimar-orbit orbit-three"></span><span class="aimar-orb-sphere"></span><canvas class="aimar-neural-canvas"></canvas><span class="aimar-orb-core"></span><span class="aimar-orb-glass"></span>';
  orb.appendChild(system);
  bootNeuralCanvas(system.querySelector('.aimar-neural-canvas'));
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
  const zone=260;
  const force=Math.max(0,1-dist/zone);
  const push=force*48;
  orb.style.setProperty('--aimar-repel-x',`${((dx/dist)*push).toFixed(2)}px`);
  orb.style.setProperty('--aimar-repel-y',`${((dy/dist)*push).toFixed(2)}px`);
  orb.style.setProperty('--aimar-tilt-y',`${Math.max(-16,Math.min(16,(event.clientX-cx)/18)).toFixed(2)}deg`);
  orb.style.setProperty('--aimar-tilt-x',`${Math.max(-14,Math.min(14,-(event.clientY-cy)/18)).toFixed(2)}deg`);
  document.documentElement.style.setProperty('--aimar-bg-x',`${Math.round((event.clientX/window.innerWidth)*100)}%`);
  document.documentElement.style.setProperty('--aimar-bg-y',`${Math.round((event.clientY/window.innerHeight)*100)}%`);
}

function relaxRepel(){
  const orb=document.querySelector('.aurora-orb');
  if(!orb)return;
  orb.style.setProperty('--aimar-repel-x','0px');
  orb.style.setProperty('--aimar-repel-y','0px');
  orb.style.setProperty('--aimar-tilt-x','0deg');
  orb.style.setProperty('--aimar-tilt-y','0deg');
}

function bootNeuralCanvas(canvas){
  if(!canvas||canvas.dataset.ready)return;
  canvas.dataset.ready='true';
  const ctx=canvas.getContext('2d');
  if(!ctx)return;

  const nodeCount=54;
  const linkCount=44;
  const nodes=Array.from({length:nodeCount},(_,i)=>{
    const u=(i+.5)/nodeCount;
    const phi=Math.acos(1-2*u);
    const theta=i*2.399963229728653+(i%5)*.11;
    return {theta,phi,r:.38+(i%7)*.078,s:.0016+(i%6)*.00042,p:i*.53};
  });
  const links=Array.from({length:linkCount},(_,i)=>({
    a:i%nodeCount,
    b:(i*7+13)%nodeCount,
    t:(i%11)/11,
    s:.0038+(i%5)*.00115
  }));

  function resize(){
    const rect=canvas.getBoundingClientRect();
    const d=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.max(1,Math.floor(rect.width*d));
    canvas.height=Math.max(1,Math.floor(rect.height*d));
    ctx.setTransform(d,0,0,d,0,0);
  }

  function projectNode(n,now,w,h){
    const cx=w/2,cy=h/2;
    const base=Math.min(w,h)*.285;
    const theta=n.theta+now*.00017+n.s*80;
    const phi=n.phi+.08*Math.sin(now*.0007+n.p);
    const rr=n.r+.025*Math.sin(now*.0011+n.p*1.7);
    let x=Math.sin(phi)*Math.cos(theta)*rr;
    let y=Math.cos(phi)*rr;
    let z=Math.sin(phi)*Math.sin(theta)*rr;
    const rotY=now*.00022;
    const rotX=Math.sin(now*.00025)*.26;
    const x1=x*Math.cos(rotY)-z*Math.sin(rotY);
    const z1=x*Math.sin(rotY)+z*Math.cos(rotY);
    const y1=y*Math.cos(rotX)-z1*Math.sin(rotX);
    const z2=y*Math.sin(rotX)+z1*Math.cos(rotX);
    const depth=.72+.38*((z2+1)/2);
    return {x:cx+x1*base*depth,y:cy+y1*base*depth,z:z2,depth,r:n.r};
  }

  function draw(){
    const w=canvas.clientWidth||300;
    const h=canvas.clientHeight||300;
    const now=performance.now();
    ctx.clearRect(0,0,w,h);
    const cx=w/2,cy=h/2;
    const radius=Math.min(w,h)*.34;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx,cy,radius,0,Math.PI*2);
    ctx.clip();

    const glow=ctx.createRadialGradient(cx,cy,0,cx,cy,radius);
    glow.addColorStop(0,'rgba(125,239,255,.085)');
    glow.addColorStop(.52,'rgba(61,139,255,.042)');
    glow.addColorStop(1,'rgba(0,0,0,0)');
    ctx.fillStyle=glow;
    ctx.fillRect(cx-radius,cy-radius,radius*2,radius*2);

    const pts=nodes.map(n=>projectNode(n,now,w,h));

    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const a=pts[i],b=pts[j];
        const d=Math.hypot(a.x-b.x,a.y-b.y);
        if(d<radius*.46){
          const alpha=(1-d/(radius*.46))*.28*Math.min(a.depth,b.depth);
          ctx.strokeStyle=`rgba(125,239,255,${alpha})`;
          ctx.lineWidth=.65*Math.min(a.depth,b.depth);
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
    }

    for(const l of links){
      l.t=(l.t+l.s)%1;
      const a=pts[l.a],b=pts[l.b];
      const x=a.x+(b.x-a.x)*l.t;
      const y=a.y+(b.y-a.y)*l.t;
      const pulse=.5+.5*Math.sin(now*.006+l.a);
      ctx.fillStyle=`rgba(236,252,255,${.55+.35*pulse})`;
      ctx.shadowColor='rgba(125,239,255,.95)';
      ctx.shadowBlur=12;
      ctx.beginPath();ctx.arc(x,y,1.45+.75*pulse,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }

    for(const p of pts.sort((a,b)=>a.z-b.z)){
      const visible=.38+.48*p.depth;
      ctx.fillStyle=`rgba(125,239,255,${visible})`;
      ctx.shadowColor='rgba(125,239,255,.75)';
      ctx.shadowBlur=7*p.depth;
      ctx.beginPath();ctx.arc(p.x,p.y,1.05+1.5*p.depth,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }

    ctx.restore();

    const orbitRadius=Math.min(w,h)*.39;
    for(let i=0;i<12;i++){
      const a=now*.00045+i*Math.PI*2/12;
      const x=cx+Math.cos(a)*orbitRadius;
      const y=cy+Math.sin(a)*orbitRadius*.92;
      const size=i%3===0?2.4:1.55;
      ctx.fillStyle=i%3===0?'rgba(240,252,255,.88)':'rgba(125,239,255,.58)';
      ctx.shadowColor='rgba(125,239,255,.9)';
      ctx.shadowBlur=10;
      ctx.beginPath();ctx.arc(x,y,size,0,Math.PI*2);ctx.fill();
      ctx.shadowBlur=0;
    }

    requestAnimationFrame(draw);
  }

  resize();
  try{new ResizeObserver(resize).observe(canvas)}catch(e){window.addEventListener('resize',resize)}
  requestAnimationFrame(draw);
}

function boot(){
  bootAimarIdentity();
  let attempts=0;
  const timer=setInterval(()=>{bootAimarIdentity();attempts+=1;if(attempts>40)clearInterval(timer)},200);
  window.addEventListener('pointermove',updateRepel,{passive:true});
  window.addEventListener('pointerleave',relaxRepel,{passive:true});
  new MutationObserver(bootAimarIdentity).observe(document.body,{childList:true,subtree:true});
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
