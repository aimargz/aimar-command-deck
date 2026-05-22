const AIMAR_MORPH_MS = 500;
const AIMAR_LOCK_MS = 700;
const WHEEL_THRESHOLD = 72;
const WHEEL_RESET_MS = 220;
const SWIPE_THRESHOLD = 48;

let locked = false;
let wheelTotal = 0;
let lastWheelAt = 0;
let lastRouteAt = 0;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target?.isContentEditable;
}

function isInteractiveTarget(target) {
  return Boolean(target?.closest?.('a, button, input, textarea, select, [role="button"], [contenteditable="true"]'));
}

function normalizeWheel(event) {
  const multiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
  const dx = event.deltaX * multiplier;
  const dy = event.deltaY * multiplier;
  return Math.abs(dy) >= Math.abs(dx) ? dy : dx;
}

function getFooterButtons() {
  const buttons = Array.from(document.querySelectorAll('footer button'));
  return { prev: buttons[0], next: buttons[buttons.length - 1] };
}

function canClick(button) {
  return button && !button.disabled && button.getAttribute('aria-disabled') !== 'true';
}

function ensureFloatingLink(href, className, text, bottom) {
  if (document.querySelector(`.${className}`)) return;
  const link = document.createElement('a');
  link.href = href;
  link.className = `aimar-floating-link ${className}`;
  link.textContent = text;
  link.style.bottom = bottom;
  document.body.appendChild(link);
}

function ensureToolLinks() {
  ensureFloatingLink('/nested-tools.html', 'aimar-tools-link', 'Nested Tools', '86px');
  ensureFloatingLink('/about.html', 'aimar-about-link', 'What Aimar Does', '132px');
  ensureFloatingLink('/contact.html', 'aimar-contact-link', 'Contact', '178px');
}

function route(direction) {
  const now = performance.now();
  if (locked || now - lastRouteAt < AIMAR_LOCK_MS) return;
  if (isTypingTarget(document.activeElement)) return;

  const { prev, next } = getFooterButtons();
  const button = direction > 0 ? next : prev;
  if (!canClick(button)) return;

  locked = true;
  lastRouteAt = now;
  wheelTotal = 0;

  const body = document.body;
  body.classList.remove('aimar-morph-forward', 'aimar-morph-back', 'aimar-morph-settle');
  body.classList.add(direction > 0 ? 'aimar-morph-forward' : 'aimar-morph-back');

  window.setTimeout(() => {
    button.click();
    body.classList.remove('aimar-morph-forward', 'aimar-morph-back');
    body.classList.add('aimar-morph-settle');
  }, Math.floor(AIMAR_MORPH_MS * 0.50));

  window.setTimeout(() => {
    body.classList.remove('aimar-morph-settle');
    locked = false;
  }, AIMAR_LOCK_MS);
}

function onWheel(event) {
  const paletteOpen = document.querySelector('.fixed.inset-0.z-50');
  if (paletteOpen || event.ctrlKey || isTypingTarget(event.target) || isInteractiveTarget(event.target)) return;

  const now = performance.now();
  const primary = normalizeWheel(event);
  if (!primary) return;

  event.preventDefault();

  if (now - lastWheelAt > WHEEL_RESET_MS || Math.sign(primary) !== Math.sign(wheelTotal || primary)) {
    wheelTotal = 0;
  }

  lastWheelAt = now;
  wheelTotal += primary;

  const fastIntent = Math.abs(primary) >= 54;
  const accumulatedIntent = Math.abs(wheelTotal) >= WHEEL_THRESHOLD;

  if (fastIntent || accumulatedIntent) {
    route((fastIntent ? primary : wheelTotal) > 0 ? 1 : -1);
  }
}

function onTouchStart(event) {
  const touch = event.touches?.[0];
  if (!touch) return;
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
  touchStartTime = Date.now();
}

function onTouchEnd(event) {
  const touch = event.changedTouches?.[0];
  if (!touch || isTypingTarget(event.target) || isInteractiveTarget(event.target)) return;
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;
  const elapsed = Date.now() - touchStartTime;
  if (elapsed > 900) return;
  const primary = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
  if (Math.abs(primary) < SWIPE_THRESHOLD) return;
  route(primary < 0 ? 1 : -1);
}

function boot() {
  document.body.classList.add('aimar-morph-ready');
  ensureToolLinks();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
