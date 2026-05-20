function logoSvg(size='hero'){
  const nodes=size==='hero'?'<path class="aimar-network-line" d="M70 166 C96 142 110 144 128 148 C146 144 160 142 186 166"/><path class="aimar-network-line" d="M64 128 C91 116 105 124 128 148 C151 124 165 116 192 128"/><circle class="aimar-node" cx="82" cy="158" r="2.2"/><circle class="aimar-node" cx="101" cy="139" r="1.8"/><circle class="aimar-node" cx="154" cy="139" r="1.8"/><circle class="aimar-node" cx="174" cy="158" r="2.2"/>':'';
  return `<svg class="aimar-animated-mark" viewBox="0 0 256 256" aria-label="Aimar animated logo" role="img">
    <defs>
      <radialGradient id="aimarOrbFill" cx="50%" cy="42%" r="58%"><stop offset="0%" stop-color="#7df7ff" stop-opacity=".20"/><stop offset="46%" stop-color="#0b5cff" stop-opacity=".10"/><stop offset="100%" stop-color="#02040a" stop-opacity=".10"/></radialGradient>
      <radialGradient id="aimarCenterFill" cx="45%" cy="34%" r="60%"><stop offset="0%" stop-color="#fff" stop-opacity=".90"/><stop offset="26%" stop-color="#77f7ff" stop-opacity=".74"/><stop offset="100%" stop-color="#092c75" stop-opacity=".58"/></radialGradient>
      <linearGradient id="aimarStrokeGradient" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#f9fdff"/><stop offset="42%" stop-color="#77f7ff"/><stop offset="100%" stop-color="#1f6bff"/></linearGradient>
      <linearGradient id="aimarBeamGradient" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#fff"/><stop offset="50%" stop-color="#77f7ff"/><stop offset="100%" stop-color="#1f6bff"/></linearGradient>
      <filter id="aimarGlow" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4" result="blur"/><feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.25 0 0 0 0 0.82 0 0 0 0 1 0 0 0 .9 0" result="glow"/><feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle class="aimar-orb-shell" cx="128" cy="128" r="102"/>
    <circle class="aimar-outer-ring" cx="128" cy="128" r="113"/>
    <circle class="aimar-inner-ring" cx="128" cy="128" r="82"/>
    <ellipse class="aimar-equator-ring" cx="128" cy="150" rx="74" ry="20"/>
    ${nodes}
    <path class="aimar-a-stroke" d="M62 194 L128 48 L194 194"/>
    <path class="aimar-a-core" d="M82 178 L128 77 L174 178"/>
    <circle class="aimar-center-orb" cx="128" cy="148" r="23"/>
    <line class="aimar-beam" x1="128" y1="20" x2="128" y2="232"/>
    <circle class="aimar-star top" cx="128" cy="30" r="4.8"/>
    <circle class="aimar-star mid" cx="128" cy="148" r="5.2"/>
    <circle class="aimar-star bottom" cx="128" cy="218" r="3.8"/>
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
