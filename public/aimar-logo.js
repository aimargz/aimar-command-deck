function logoSvg(size='hero'){
  const showFlows=size==='hero';
  return `<svg class="aimar-animated-mark" viewBox="0 0 256 256" aria-label="Aimar animated logo" role="img">
    <defs>
      <radialGradient id="shellFill" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="#9ff6ff" stop-opacity=".20"/><stop offset="48%" stop-color="#245cff" stop-opacity=".08"/><stop offset="100%" stop-color="#02040a" stop-opacity=".02"/></radialGradient>
      <radialGradient id="coreFill" cx="45%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity=".92"/><stop offset="30%" stop-color="#77f7ff" stop-opacity=".74"/><stop offset="100%" stop-color="#0b367a" stop-opacity=".52"/></radialGradient>
      <linearGradient id="markGrad" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f8fcff"/><stop offset="45%" stop-color="#77f7ff"/><stop offset="100%" stop-color="#236dff"/></linearGradient>
      <linearGradient id="axisGrad" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#77f7ff"/><stop offset="100%" stop-color="#1f6bff"/></linearGradient>
      <filter id="softGlow" x="-70%" y="-70%" width="240%" height="240%"><feGaussianBlur stdDeviation="2.8" result="blur"/><feColorMatrix in="blur" type="matrix" values="0 0 0 0 .25 0 0 0 0 .78 0 0 0 0 1 0 0 0 .78 0" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle class="aimar-logo-shell" cx="128" cy="128" r="94"/>
    <circle class="aimar-logo-ring" cx="128" cy="128" r="103"/>
    <circle class="aimar-logo-ring r2" cx="128" cy="128" r="74"/>
    <ellipse class="aimar-logo-ring r3" cx="128" cy="151" rx="62" ry="17"/>
    ${showFlows?'<path class="aimar-logo-flow" d="M66 166 C94 146 109 149 128 151 C147 149 162 146 190 166"/><path class="aimar-logo-flow" d="M72 130 C98 119 111 129 128 151 C145 129 158 119 184 130"/>':''}
    <path class="aimar-logo-mark" d="M74 186 L128 70 L182 186"/>
    <path class="aimar-logo-mark-inner" d="M96 170 L128 101 L160 170"/>
    <line class="aimar-logo-axis" x1="128" y1="34" x2="128" y2="220"/>
    <circle class="aimar-logo-core" cx="128" cy="151" r="18"/>
    <circle class="aimar-logo-node n1" cx="128" cy="45" r="3.6"/>
    <circle class="aimar-logo-node n2" cx="128" cy="151" r="4.4"/>
    <circle class="aimar-logo-node n3" cx="128" cy="211" r="3"/>
  </svg>`;
}
function injectAimarLogo(){
  const hero=document.querySelector('.aurora-orb');
  if(hero && !hero.querySelector('.aimar-animated-mark')) hero.insertAdjacentHTML('beforeend',logoSvg('hero'));
  const header=document.querySelector('header .flex.min-w-0.items-center.gap-3');
  if(header && !header.querySelector('.aimar-header-mark')){
    const old=header.querySelector('svg'); if(old) old.style.display='none';
    const wrap=document.createElement('span'); wrap.className='aimar-header-mark'; wrap.innerHTML=logoSvg('header'); header.prepend(wrap);
  }
}
function boot(){injectAimarLogo(); new MutationObserver(injectAimarLogo).observe(document.body,{childList:true,subtree:true});}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
