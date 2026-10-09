"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  GeistPixelCircle,
  GeistPixelGrid,
  GeistPixelLine,
  GeistPixelSquare,
  GeistPixelTriangle,
} from "geist/font/pixel";
import {
  createParticleText,
  elementSampler,
  GEIST_PIXEL_GRID_EM,
  type ElementSamplerOptions,
  type ParticleText,
  type Shape,
  type Tunables,
} from "@/lib/particle-text";

const ORANGE = "#f2541b";

// Shape and fill that reproduce each variant's own pixel when one particle sits in each cell.
export const PIXEL_VARIANTS = {
  square: { font: GeistPixelSquare, shape: "square", fill: 1 },
  grid: { font: GeistPixelGrid, shape: "square", fill: 30 / 38 }, // 30-unit squares on the 38-unit grid
  circle: { font: GeistPixelCircle, shape: "circle", fill: 1 },
  triangle: { font: GeistPixelTriangle, shape: "triangle", fill: 1 },
  line: { font: GeistPixelLine, shape: "line", fill: 1 },
} as const satisfies Record<string, { font: typeof GeistPixelSquare; shape: Shape; fill: number }>;

export type PixelVariant = keyof typeof PIXEL_VARIANTS;
export type HeadingFont = "inter" | PixelVariant;
export type SampleLayout = "cells" | "dense";

const FONT_VARIABLES = Object.values(PIXEL_VARIANTS)
  .map((v) => v.font.variable)
  .join(" ");

interface ParticleCtaProps {
  tunables?: Partial<Tunables>;
  font?: HeadingFont;
  layout?: SampleLayout; // pixel fonts only: one particle per font pixel, or dense sampling
  subdivide?: number; // particles per font-pixel edge in "cells" layout
  debug?: boolean; // shows the real <h2> faintly under the particles to check alignment
}

// Wait for the heading's actual face — next/font only fetches it once something uses it.
async function loadHeadingFont(el: HTMLElement) {
  const cs = getComputedStyle(el);
  await document.fonts.load(`${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`, el.textContent ?? undefined);
  await document.fonts.ready;
}

// Progressive enhancement: the <h2> is always real text. The canvas is aria-hidden
// decoration, and the heading only goes to opacity 0 (still in the accessibility
// tree, still selectable) once WebGL is actually drawing. No JS, no WebGL, or
// reduced motion → the plain heading simply stays visible.
export function ParticleCta({
  tunables = {},
  font = "inter",
  layout = "cells",
  subdivide = 1,
  debug = false,
}: ParticleCtaProps) {
  const headingId = useId();
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const engineRef = useRef<ParticleText | null>(null);
  const tunablesRef = useRef(tunables);
  tunablesRef.current = tunables;
  const isPixel = font !== "inter";
  const samplerOptsRef = useRef<ElementSamplerOptions>({});
  samplerOptsRef.current = {
    grid: isPixel && layout === "cells" ? { pitchEm: GEIST_PIXEL_GRID_EM, subdivide } : null,
  };
  const [active, setActive] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const canvas = canvasRef.current;
    const heading = headingRef.current;
    if (!card || !canvas || !heading) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const engine = createParticleText(canvas, {
      ...tunablesRef.current,
      sample: elementSampler(heading, canvas, () => samplerOptsRef.current),
      pointerTarget: card,
      intro: true,
      beforeBuild: () => loadHeadingFont(heading),
      onReady: () => setActive(true),
    });
    engineRef.current = engine;
    return () => {
      engine?.destroy();
      engineRef.current = null;
      setActive(false);
    };
  }, []);

  const { radius, strength, spring, damping, size, fill, shape, gap, mode, activeColor, activeMix } = tunables;
  useEffect(() => {
    engineRef.current?.set(tunablesRef.current);
  }, [radius, strength, spring, damping, size, fill, shape, gap, mode, activeColor, activeMix]);

  // A font or layout change moves every glyph without resizing the canvas, so resample by hand.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;
    let cancelled = false;
    loadHeadingFont(heading).then(() => {
      if (!cancelled) engineRef.current?.rebuild();
    });
    return () => {
      cancelled = true;
    };
  }, [font, layout, subdivide]);

  return (
    <section
      aria-labelledby={headingId}
      className={`${FONT_VARIABLES} rounded-xl px-4 py-14 sm:px-10`}
      style={{ background: "#f7f7f5" }}
    >
      <div className="relative mx-auto max-w-6xl border p-2.5 sm:p-3.5" style={{ borderColor: "#e4e4e0" }}>
        <Corners />
        <div
          ref={cardRef}
          className="relative overflow-hidden border px-6 py-16 text-center sm:py-24"
          style={{
            background: "#f8f8f6",
            borderColor: "#ebebe7",
            boxShadow: "0 1px 2px rgba(0,0,0,0.05), 0 3px 8px rgba(0,0,0,0.06)",
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 block h-full w-full"
          />
          <div className="relative">
            <h2
              id={headingId}
              ref={headingRef}
              // Pixel fonts keep default tracking: negative letter-spacing knocks glyphs off each other's grid.
              className={`text-5xl font-medium leading-none sm:text-7xl lg:text-8xl ${isPixel ? "" : "tracking-tight"}`}
              style={{
                color: "#171717",
                fontFamily: isPixel ? `var(--font-geist-pixel-${font})` : undefined,
                opacity: active ? (debug ? 0.3 : 0) : 1,
              }}
            >
              Ready to <span style={{ color: ORANGE }}>identify?</span>
            </h2>
            <p className="mx-auto mt-5 max-w-4xl text-lg sm:text-2xl" style={{ color: "#4a4a48" }}>
              Start building with a free trial or speak to an expert to explore our{" "}
              <strong className="font-semibold" style={{ color: "#3a3a38" }}>
                Enterprise plan.
              </strong>
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <a
                href="#"
                className="rounded-md border px-6 py-3 text-base font-medium text-white outline-none transition-[filter] hover:brightness-110 focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ background: ORANGE, borderColor: "#c4400f" }}
              >
                Get Started
              </a>
              <a
                href="#"
                className="rounded-md border bg-white px-6 py-3 text-base font-medium outline-none transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ color: "#171717", borderColor: "#dcdcd8" }}
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Corners() {
  const base = "pointer-events-none absolute h-3 w-3";
  const c = { borderColor: ORANGE };
  return (
    <>
      <span aria-hidden="true" className={`${base} -left-px -top-px border-l-2 border-t-2`} style={c} />
      <span aria-hidden="true" className={`${base} -right-px -top-px border-r-2 border-t-2`} style={c} />
      <span aria-hidden="true" className={`${base} -bottom-px -left-px border-b-2 border-l-2`} style={c} />
      <span aria-hidden="true" className={`${base} -bottom-px -right-px border-b-2 border-r-2`} style={c} />
    </>
  );
}
