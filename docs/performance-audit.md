# Aimar Command Deck Public Performance Audit

## Current status
The public deck is a Vite + React single-page command surface with static public subpages. The app has a small dependency footprint: React, Vite, TypeScript, Tailwind/PostCSS, and lucide-react. There are no heavy 3D/WebGL libraries in package.json.

## Immediate bottlenecks identified
1. Animated logo canvas runs continuously with requestAnimationFrame.
2. Pointer-reactive card tilt and magnetic buttons add extra motion work.
3. Mobile route gestures can conflict with natural scroll behavior if thresholds are too low.
4. Several CSS overlays create visual depth but can be expensive on mobile.
5. Public SEO/PWA basics were previously incomplete.

## Fixes applied
- Added robots.txt and sitemap.xml.
- Added site.webmanifest.
- Added canonical/OpenGraph/Twitter metadata.
- Added mobile performance guardrail CSS.
- Added favicon cache-busting.
- Reduced mobile motion cost with CSS.
- Added public audit notes for future cleanup.

## Next cleanup targets
1. Replace runtime DOM-injected enhancements with first-class React components.
2. Collapse overlapping logo CSS files into one maintained identity file.
3. Add a dedicated mobile module list view as an alternative to forced deck routing.
4. Run Lighthouse locally in the development environment.
5. Add build/test checks to a lightweight CI workflow.
