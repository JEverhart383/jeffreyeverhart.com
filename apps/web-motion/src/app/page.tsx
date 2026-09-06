import Link from "next/link";

const LIBRARY_COLORS: Record<string, string> = {
  CSS: "#38bdf8",
  "Framer Motion": "#a78bfa",
  GSAP: "#86efac",
  "Three.js": "#fb923c",
  Canvas: "#fbbf24",
  WebGL: "#e879f9",
};

const topics = [
  {
    slug: "perspective",
    title: "Perspective",
    library: "CSS",
    description: "Explore CSS 3D perspective — depth, vanishing points, and the perspective-origin property.",
    status: "ready",
  },
  {
    slug: "transform",
    title: "Transform",
    library: "CSS",
    description: "Compose CSS transforms: scale, rotate, skew, translate, and their interaction order.",
    status: "ready",
  },
  {
    slug: "translation",
    title: "Translation",
    library: "CSS",
    description: "Animate elements along paths with fine-grained easing and timing control.",
    status: "ready",
  },
  {
    slug: "spring-physics",
    title: "Spring Physics",
    library: "Framer Motion",
    description: "Tune spring stiffness, damping, and mass to feel how physical systems behave.",
    status: "ready",
  },
  {
    slug: "gesture-drag",
    title: "Gesture & Drag",
    library: "Framer Motion",
    description: "Draggable elements with momentum, velocity, and elastic constraints.",
    status: "ready",
  },
  {
    slug: "particle-systems",
    title: "Particle Systems",
    library: "Canvas",
    description: "Raw canvas particle simulation — count, gravity, trails, and color fields.",
    status: "ready",
  },
  {
    slug: "tilt-card",
    title: "Tilt Card",
    library: "CSS",
    description: "Cursor-driven 3D tilt using CSS perspective + rotateX/rotateY. perspective() sets the viewer's eye distance from z=0 — without it, 3D rotations look flat. Lower values exaggerate depth; higher values flatten it. Lerp-smoothed in a RAF loop with a radial shine that tracks the cursor.",
    status: "ready",
  },
  {
    slug: "mouse-transforms",
    title: "Mouse-Driven Transforms",
    library: "CSS",
    description: "Same 9 elements, same properties — triggered two ways. Left grid: CSS transitions fire on hover. Right grid: scale, glow, and color lerp continuously from global cursor distance.",
    status: "ready",
  },
  {
    slug: "particle-shader",
    title: "Particle Text Shader",
    library: "WebGL",
    description: "Particles form text via WebGL gl.POINTS and a GLSL circle shader. Mouse hover scatters them with a radial force field — spring physics pulls them back to formation.",
    status: "ready",
  },
  {
    slug: "svg-morphing",
    title: "SVG Path Morphing",
    library: "GSAP",
    description: "Morph between SVG polygon shapes — GSAP tweens a proxy value and onUpdate interpolates vertex coordinates.",
    status: "ready",
  },
  {
    slug: "scroll-driven",
    title: "Scroll-Driven",
    library: "Framer Motion",
    description: "Per-element scroll tracking with useScroll — six different effects fire as each card enters the viewport.",
    status: "ready",
  },
  {
    slug: "3d-scene",
    title: "3D Scene",
    library: "Three.js",
    description: "Vanilla Three.js scene with geometry switching, lighting controls, wireframe mode, and OrbitControls.",
    status: "ready",
  },
  {
    slug: "clip-path",
    title: "Clip-Path Reveals",
    library: "CSS",
    description: "Animate clip-path polygons and circles for dramatic reveal transitions. Click panels to toggle.",
    status: "ready",
  },
  {
    slug: "css-variables",
    title: "CSS Custom Properties",
    library: "CSS",
    description: "Side-by-side demo showing why @property registration enables smooth gradient interpolation.",
    status: "ready",
  },
  {
    slug: "easing-visualizer",
    title: "Easing Visualizer",
    library: "Canvas",
    description: "Plot cubic-bezier curves on canvas, scrub the animation, and compare 8 built-in presets.",
    status: "ready",
  },
  {
    slug: "individual-transforms",
    title: "Individual Transforms",
    library: "CSS",
    description: "rotate, scale, and translate as standalone CSS properties — they don't clobber each other. Hover the spinning elements to see why that matters.",
    status: "ready",
  },
  {
    slug: "filter-effects",
    title: "Filter Effects",
    library: "CSS",
    description: "GPU-accelerated blur, brightness, saturation, contrast, and hue-rotate — composable in a single filter declaration.",
    status: "ready",
  },
  {
    slug: "opacity-visibility",
    title: "Opacity & Visibility",
    library: "CSS",
    description: "Three ways to hide an element — only opacity animates. Watch which ones collapse the layout and which preserve it.",
    status: "ready",
  },
  {
    slug: "rolling-text",
    title: "Rolling Text",
    library: "CSS",
    description: "Each character is an overflow-hidden slot holding two chars stacked vertically. Hover slides the column up, swapping words character by character with a staggered cascade.",
    status: "ready",
  },
  {
    slug: "css-masking",
    title: "CSS Masking",
    library: "CSS",
    description: "mask-image with a radial gradient tracks the cursor — a lerp-smoothed blob reveals a colorful layer beneath a dark overlay. Feather controls edge softness.",
    status: "ready",
  },
  {
    slug: "3d-particles",
    title: "3D Particle Cloud",
    library: "Three.js",
    description: "Thousands of points rendered with THREE.Points — a single draw call regardless of count. Vertex colors gradient from center to edge. Drag to orbit, scroll to zoom.",
    status: "ready",
  },
  {
    slug: "flow-field",
    title: "Flow Field",
    library: "Canvas",
    description: "Particles follow directions sampled from a Perlin noise field. The field evolves over time — toggle the vector grid to see the underlying flow directions.",
    status: "ready",
  },
  {
    slug: "cloth-simulation",
    title: "Cloth Simulation",
    library: "Canvas",
    description: "Spring-mass grid with Verlet physics. Top row pinned — drag the cloth to pull it. Release pins to watch it fall. Controls for gravity, wind, friction, and stiffness.",
    status: "ready",
  },
];

export default function Home() {
  return (
    <div>
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 tracking-tight">Animation Playground</h1>
        <p className="text-base" style={{ color: "var(--text-muted)" }}>
          Interactive explorations of web animation — CSS, Framer Motion, GSAP, and Three.js.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.map((topic) => {
          const color = LIBRARY_COLORS[topic.library] ?? "#6b6b80";
          const isReady = topic.status === "ready";

          const card = (
            <div
              className="rounded-xl p-5 flex flex-col gap-3 h-full transition-all duration-200"
              style={{
                background: "var(--surface)",
                border: `1px solid var(--border)`,
                opacity: isReady ? 1 : 0.55,
                cursor: isReady ? "pointer" : "default",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: `${color}20`, color }}
                >
                  {topic.library}
                </span>
                {!isReady && (
                  <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    soon
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold mb-1">{topic.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {topic.description}
                </p>
              </div>
            </div>
          );

          return isReady ? (
            <Link
              key={topic.slug}
              href={`/${topic.slug}`}
              className="block hover:-translate-y-0.5 transition-transform duration-150"
            >
              {card}
            </Link>
          ) : (
            <div key={topic.slug}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
