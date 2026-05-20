function bootAimarIdentity(){
  const header=document.querySelector('header .flex.min-w-0.items-center.gap-3');
  if(header&&!header.querySelector('.aimar-header-mark')){
    const old=header.querySelector('svg');
    if(old)old.style.display='none';
    const mark=document.createElement('span');
    mark.className='aimar-header-mark';
    header.prepend(mark);
  }
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
  const zone=190;
  const force=Math.max(0,1-dist/zone);
  const push=force*34;
  const x=(dx/dist)*push;
  const y=(dy/dist)*push;
  orb.style.setProperty('--aimar-repel-x',`${x.toFixed(2)}px`);
  orb.style.setProperty('--aimar-repel-y',`${y.toFixed(2)}px`);
  document.documentElement.style.setProperty('--aimar-bg-x',`${Math.round((event.clientX/window.innerWidth)*100)}%`);
  document.documentElement.style.setProperty('--aimar-bg-y',`${Math.round((event.clientY/window.innerHeight)*100)}%`);
}
function relaxRepel(){
  const orb=document.querySelector('.aurora-orb');
  if(!orb)return;
  orb.style.setProperty('--aimar-repel-x','0px');
  orb.style.setProperty('--aimar-repel-y','0px');
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
