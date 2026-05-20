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
function boot(){bootAimarIdentity();let attempts=0;const timer=setInterval(()=>{bootAimarIdentity();attempts+=1;if(attempts>30)clearInterval(timer)},250);new MutationObserver(bootAimarIdentity).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
