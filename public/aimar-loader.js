const AIMAR_MOBILE_QUERY = '(max-width: 760px), (pointer: coarse)';
const isMobile = () => window.matchMedia(AIMAR_MOBILE_QUERY).matches;

function ensureFavicon() {
  const href = '/ari-v2/favicon.svg?v=8';
  document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(link => link.remove());
  [
    ['icon', 'image/svg+xml'],
    ['shortcut icon', 'image/svg+xml'],
    ['apple-touch-icon', 'image/svg+xml']
  ].forEach(([rel, type]) => {
    const link = document.createElement('link');
    link.rel = rel;
    link.type = type;
    link.href = href;
    document.head.appendChild(link);
  });
}

function bootMobileSafeMode() {
  document.documentElement.classList.add('aimar-mobile-safe-mode');
  ensureFavicon();
}

function loadDesktopIdentity() {
  ensureFavicon();
  const script = document.createElement('script');
  script.type = 'module';
  script.src = '/aimar-logo.js?v=8';
  document.body.appendChild(script);
}

if (isMobile()) {
  bootMobileSafeMode();
} else {
  loadDesktopIdentity();
}
