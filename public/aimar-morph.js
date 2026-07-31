const AIMAR_LOCK_MS = 650;
const WHEEL_THRESHOLD = 48;
const WHEEL_RESET_MS = 260;
const SCROLL_EDGE_PX = 24;
const SWIPE_THRESHOLD = 86;

let locked = false;
let wheelTotal = 0;
let lastWheelAt = 0;
let lastRouteAt = 0;
let wheelReleaseTimer = null;
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;

const isMobile = () => window.matchMedia('(max-width: 760px), (pointer: coarse)').matches;

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target?.isContentEditable;
}

function isInteractiveTarget(target) {
  return Boolean(target?.closest?.('a, button, input, textarea, select, [role="button"], [contenteditable="true"]'));
}


function canScrollInDirection(target, delta) {
  let node = target;

  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const scrollable = /(auto|scroll)/.test(style.overflowY)
      && node.scrollHeight > node.clientHeight + 8;

    if (scrollable) {
      const atTop = node.scrollTop <= SCROLL_EDGE_PX;
      const atBottom = node.scrollTop + node.clientHeight
        >= node.scrollHeight - SCROLL_EDGE_PX;

      if (delta < 0 && !atTop) return true;
      if (delta > 0 && !atBottom) return true;
    }

    node = node.parentElement;
  }

  const page = document.scrollingElement;
  if (!page || page.scrollHeight <= page.clientHeight + 8) return false;

  const atTop = page.scrollTop <= SCROLL_EDGE_PX;
  const atBottom = page.scrollTop + page.clientHeight
    >= page.scrollHeight - SCROLL_EDGE_PX;

  if (delta < 0 && !atTop) return true;
  if (delta > 0 && !atBottom) return true;

  return false;
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

function route(direction) {
  const now = performance.now();
  if (locked || now - lastRouteAt < AIMAR_LOCK_MS) return false;
  if (isTypingTarget(document.activeElement)) return false;

  const { prev, next } = getFooterButtons();
  const button = direction > 0 ? next : prev;
  if (!canClick(button)) return false;

  locked = true;
  lastRouteAt = now;
  wheelTotal = 0;

  button.click();

  window.setTimeout(() => {
    locked = false;
  }, AIMAR_LOCK_MS);

  return true;
}

function onWheel(event) {
  const paletteOpen = document.querySelector('.fixed.inset-0.z-50');

  if (
    paletteOpen
    || event.ctrlKey
    || isTypingTarget(event.target)
    || isInteractiveTarget(event.target)
  ) {
    return;
  }

  const primary = normalizeWheel(event);
  if (!primary || canScrollInDirection(event.target, primary) || locked) return;

  if (wheelReleaseTimer) window.clearTimeout(wheelReleaseTimer);

  wheelReleaseTimer = window.setTimeout(() => {
    wheelTotal = 0;
  }, WHEEL_RESET_MS);

  if (
    performance.now() - lastWheelAt > WHEEL_RESET_MS
    || Math.sign(primary) !== Math.sign(wheelTotal || primary)
  ) {
    wheelTotal = 0;
  }

  lastWheelAt = performance.now();
  wheelTotal += primary;

  if (Math.abs(wheelTotal) >= WHEEL_THRESHOLD) {
    route(wheelTotal > 0 ? 1 : -1);
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
  if (elapsed > 800) return;

  if (isMobile()) {
    const mostlyVertical = Math.abs(dy) > Math.abs(dx) * 1.55;
    if (!mostlyVertical || Math.abs(dy) < SWIPE_THRESHOLD) return;

    const direction = dy < 0 ? 1 : -1;
    if (canScrollInDirection(event.target, direction)) return;

    route(direction);
    return;
  }

  const primary = Math.abs(dx) > Math.abs(dy) ? dx : -dy;
  if (Math.abs(primary) < 48) return;
  route(primary < 0 ? 1 : -1);
}

function boot() {
  document.body.classList.add('aimar-morph-ready');
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchend', onTouchEnd, { passive: true });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
