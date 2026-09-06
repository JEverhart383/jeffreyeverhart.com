"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

type Point = [number, number];
type ShapeName = "circle" | "star" | "square" | "triangle";

// All shapes share 12 points so we can linearly interpolate coordinates
const SHAPES: Record<ShapeName, Point[]> = {
  circle: [
    [50,6],[72,12],[88,28],[94,50],[88,72],[72,88],
    [50,94],[28,88],[12,72],[6,50],[12,28],[28,12],
  ],
  star: [
    [50,6],[60,33],[88,28],[70,50],[88,72],[60,67],
    [50,94],[40,67],[12,72],[30,50],[12,28],[40,33],
  ],
  square: [
    [6,6],[35,6],[65,6],[94,6],[94,35],[94,65],
    [94,94],[65,94],[35,94],[6,94],[6,65],[6,35],
  ],
  triangle: [
    [50,6],[61,27],[72,48],[83,69],[94,90],[72,90],
    [50,90],[28,90],[6,90],[17,69],[28,48],[39,27],
  ],
};

const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];
const SHAPE_COLORS: Record<ShapeName, string> = {
  circle: "#6d6aff",
  star: "#ff6b9d",
  square: "#38bdf8",
  triangle: "#86efac",
};

function lerpPoints(a: Point[], b: Point[], t: number): Point[] {
  return a.map(([ax, ay], i) => [ax + (b[i][0] - ax) * t, ay + (b[i][1] - ay) * t]);
}

function ptsToStr(pts: Point[]): string {
  return pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
}

export default function SvgMorphingPage() {
  const polygonRef = useRef<SVGPolygonElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const [from, setFrom] = useState<ShapeName>("circle");
  const [to, setTo] = useState<ShapeName>("star");
  const [duration, setDuration] = useState(1.2);
  const [ease, setEase] = useState("power2.inOut");
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const EASES = ["linear", "power1.inOut", "power2.inOut", "power3.inOut", "back.inOut(1.7)", "elastic.out(1, 0.3)", "bounce.out"];

  function morph() {
    if (tweenRef.current) tweenRef.current.kill();
    const proxy = { t: 0 };
    tweenRef.current = gsap.to(proxy, {
      t: 1,
      duration,
      ease,
      onStart: () => setIsPlaying(true),
      onUpdate() {
        const pts = lerpPoints(SHAPES[from], SHAPES[to], proxy.t);
        polygonRef.current?.setAttribute("points", ptsToStr(pts));
        setProgress(proxy.t);
      },
      onComplete: () => setIsPlaying(false),
    });
  }

  // Set initial shape
  useEffect(() => {
    polygonRef.current?.setAttribute("points", ptsToStr(SHAPES[from]));
    setProgress(0);
  }, [from]);

  const fromColor = SHAPE_COLORS[from];
  const toColor = SHAPE_COLORS[to];
  const blendedColor = `#${[0, 2, 4].map((offset) => {
    const f = parseInt(fromColor.slice(1 + offset, 3 + offset), 16);
    const t = parseInt(toColor.slice(1 + offset, 3 + offset), 16);
    return Math.round(f + (t - f) * progress).toString(16).padStart(2, "0");
  }).join("")}`;

  return (
    <PageLayout
      title="SVG Path Morphing"
      description="GSAP tweens a proxy value from 0→1 and the onUpdate callback linearly interpolates between two sets of polygon points. All shapes share 12 vertices so coordinates can be directly interpolated."
      library="GSAP"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex flex-col items-center justify-center gap-6 p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          <svg viewBox="0 0 100 100" className="w-64 h-64">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            <polygon
              ref={polygonRef}
              points={ptsToStr(SHAPES[from])}
              fill={`${blendedColor}33`}
              stroke={blendedColor}
              strokeWidth="1.5"
              strokeLinejoin="round"
              filter="url(#glow)"
            />
          </svg>

          {/* Shape selectors */}
          <div className="flex gap-8 items-center">
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>from</span>
              <div className="flex gap-2">
                {SHAPE_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => setFrom(name)}
                    className="px-2 py-1 rounded text-xs font-mono transition-colors"
                    style={{
                      background: from === name ? `${SHAPE_COLORS[name]}33` : "transparent",
                      color: from === name ? SHAPE_COLORS[name] : "var(--text-muted)",
                      border: `1px solid ${from === name ? SHAPE_COLORS[name] : "var(--border)"}`,
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={morph}
              disabled={isPlaying || from === to}
              className="px-4 py-2 rounded-lg text-sm font-mono font-semibold transition-opacity"
              style={{
                background: "var(--accent)", color: "white",
                opacity: (isPlaying || from === to) ? 0.4 : 1,
              }}
            >
              morph →
            </button>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>to</span>
              <div className="flex gap-2">
                {SHAPE_NAMES.map((name) => (
                  <button
                    key={name}
                    onClick={() => setTo(name)}
                    className="px-2 py-1 rounded text-xs font-mono transition-colors"
                    style={{
                      background: to === name ? `${SHAPE_COLORS[name]}33` : "transparent",
                      color: to === name ? SHAPE_COLORS[name] : "var(--text-muted)",
                      border: `1px solid ${to === name ? SHAPE_COLORS[name] : "var(--border)"}`,
                    }}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full max-w-xs h-1 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-none"
              style={{ width: `${progress * 100}%`, background: "var(--accent)" }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="duration" value={duration} min={0.2} max={4} step={0.1} unit="s" onChange={setDuration} />
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>ease</span>
              <div className="flex flex-col gap-1">
                {EASES.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEase(e)}
                    className="text-left px-2 py-1 rounded text-xs font-mono transition-colors"
                    style={{
                      background: ease === e ? "rgba(109,106,255,0.2)" : "transparent",
                      color: ease === e ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>
          </ControlPanel>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "SVG points attribute",
            text: "A space-separated string of x,y coordinate pairs: \"50,6 72,12 88,28 ...\". It's plain text — GSAP has no built-in way to tween it directly.",
          },
          {
            label: "proxy tween",
            text: "Animate a plain JS object {t: 0} from 0→1. In onUpdate, read t and manually lerp each vertex pair. GSAP handles timing and easing; you handle the geometry.",
          },
          {
            label: "lerp formula",
            text: "a + (b - a) * t for each coordinate. At t=0 you have shape A; at t=1, shape B. Values in between are a smooth blend of the two vertex sets.",
          },
          {
            label: "vertex count must match",
            text: "You can only interpolate between shapes with the same number of points. All four shapes here use exactly 12 vertices so coordinates can be directly mapped.",
          },
        ]}
        code={`const proxy = { t: 0 };
gsap.to(proxy, {
  t: 1, duration: 1.2, ease: "power2.inOut",
  onUpdate() {
    const pts = shapeA.map(([ax, ay], i) => [
      ax + (shapeB[i][0] - ax) * proxy.t,  // lerp X
      ay + (shapeB[i][1] - ay) * proxy.t,  // lerp Y
    ]);
    polygon.setAttribute("points", pts.flat().join(" "));
  },
});`}
      />
    </PageLayout>
  );
}
