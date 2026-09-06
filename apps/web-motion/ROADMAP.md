# Web Motion — Topic Roadmap

Ideas for future demos, organized by library/technology.

---

## Framer Motion

### AnimatePresence + Layout Animations
The biggest gap in FM coverage. `layoutId` enables shared-element transitions where elements smoothly reflow as list/grid layouts change. `AnimatePresence` handles mount/unmount exit animations. One of FM's most visually dramatic features and the most commonly asked-about.

**Demo ideas:** card expanding to full-screen detail, list item reordering with smooth relayout, tab content switching with shared underline indicator.

### Stagger / Orchestration
`staggerChildren` with `variants` — a grid of cards entering with cascading delays. Covers the `delayChildren`, `staggerDirection`, and `when` orchestration options. Short demo but extremely common in real UIs.

**Demo ideas:** grid of tiles fading/sliding in on mount, list items animating in one by one.

---

## CSS

### Motion Path (`offset-path` / `offset-distance`)
Animate elements *along an SVG path* — completely different from translation. Works natively in CSS with no library. Good visual contrast to the easing comparison demo since the motion follows geometry rather than a straight line.

**Demo ideas:** ball following a bezier curve, icon orbiting a circular path, particle following a hand-drawn path.

### View Transitions API
Native browser page and in-page transitions without any library. Cross-document and same-document modes. Still relatively new (broadly supported as of 2024) so it's timely. Would contrast well with the scroll-driven Framer Motion demo.

**Demo ideas:** page-to-page morph where a card expands into the next page, in-page list reorder with `startViewTransition`.

---

## Canvas / WebGL

### Noise-Based Animation (Perlin / Simplex)
Organic, noise-driven motion where positions, sizes, or colors evolve over time via a noise function. Shows why pure-easing animations feel mechanical by comparison. Pairs naturally with the existing particle system.

**Demo ideas:** flowing color field, noise-displaced grid of dots, terrain heightmap scrolling in real time.

### Audio-Driven Visualization (Web Audio API)
Canvas is covered but audio-reactive animation is a different axis entirely. Use `AnalyserNode` to get frequency/waveform data and drive canvas drawing each frame.

**Demo ideas:** waveform oscilloscope, frequency bar chart that pulses, particles that react to beat detection.

---

## GSAP

### Timeline Sequencing
SVG morphing exists but there's no multi-step timeline demo. GSAP's real power is `.to().from().addLabel()` chaining with precise overlap and repeat control — that should have its own page.

**Demo ideas:** multi-element choreographed sequence (logo reveal, loading sequence), timeline scrubber the user can drag.

---

## Rolling Text (enhancements)

### Custom Easing Control
Add an interactive cubic-bezier editor to the Rolling Text page's control panel. The user should be able to drag the two control points on a curve canvas and see the easing applied live to the character rolls. Expose the raw `cubic-bezier(x1, y1, x2, y2)` values as a copyable string so visitors can lift the curve directly into their own CSS.

**Reference:** the existing easing-visualizer page already plots bezier curves on canvas — the control-point drag logic could be extracted into a shared hook or component.

---

## Web Animations API (WAAPI)

### Native WAAPI
`element.animate()` — the browser-native imperative animation API that sits between CSS transitions and a full library. No dependencies, full keyframe control, playback rate, and effect timing. Useful contrast to show what's possible without Framer Motion or GSAP.

**Demo ideas:** side-by-side: same animation done with CSS transition, WAAPI, and Framer Motion.
