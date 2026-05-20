const AIMAR_MORPH_MS = 520;
const AIMAR_LOCK_MS = 760;
const WHEEL_THRESHOLD = 48;
const SWIPE_THRESHOLD = 46;

let locked = false;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target?.isContentEditable;
}

function getFooterButtons() {
  const buttons = Array.from(document.querySelectorAll('footer button'));
  return { prev: buttons[0], next: buttons[buttons.length - 1] };
}

function canClick(button) {
  return button && !button.disabled && button.getAttribute('aria-disabled') !== 'true';
}

function ensureToolsLink() {
  if (document.querySelector('.aimar-tools-link')) return;
  const link = document.createElement('a');
  link.href = '/nested-tools.html';
  link.className = 'aimar-tools-link';
  link.textContent = 'Nested Tools';
  document.body.appendChild(link);
}

function route(direction) {
  if (locked) return;
  if (isTypingTarget(document.activeElement)) return;

  const { prev, next } = getFooterButtons();
  const button = direction > 0 ? next : prev;
  if (!canClick(button)) return;

  locked = true;
  const body = document.body;
  body.classList.remove('aimar-morph-forward', 'aimar-morph-back', 'aimar-morph-settle');
  body.classList.add(direction > 0 ? 'aimar-morph-forward' : 'aimar-morph-back');

  window.setTimeout(() => {
    button.click();
    body.classList.remove('aimar-morph-forward', 'aimar-morph-back');
    body.classList.add('aimar-morph-settle');
  }, Math.floor(AIMAR_MORPH_MS * 0.48));

  window.setTimeout(() => {
    body.classList.remove('aimar-morph-settle');
    locked = false;
  }, AIMAR_LOCK_MS);
}

function onWheel(event) {
  const paletteOpen = document.querySelector('.fixed.inset-0.z-50');
  if (paletteOpen || isTypingTarget(event.target)) return;
  const absX = Math.abs(event.deltaX);
  const absY = Math.abs(event.deltaY);
  const primary = absY >= absX ? event.deltaY : event.deltaX;
  if (Math.abs(primary) < WHEEL_THRESHOLD) return;
  event.preventDefault();
  route(primary > 0 ? 1 : -1);
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
  if (!touch || isTypingTarget(event.target)) return;
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
  ensureToolsLink();
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
