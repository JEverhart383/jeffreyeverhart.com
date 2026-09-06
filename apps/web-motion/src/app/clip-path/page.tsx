"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

type ClipShape = keyof typeof CLIP_SHAPES;

const CLIP_SHAPES = {
  "circle — center": {
    hidden: "circle(0% at 50% 50%)",
    visible: "circle(75% at 50% 50%)",
  },
  "circle — corner": {
    hidden: "circle(0% at 0% 0%)",
    visible: "circle(150% at 0% 0%)",
  },
  "inset box": {
    hidden: "inset(50%)",
    visible: "inset(0% round 0px)",
  },
  "wipe right": {
    hidden: "polygon(0 0, 0 0, 0 100%, 0 100%)",
    visible: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  },
  "wipe up": {
    hidden: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
    visible: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
  },
  diamond: {
    hidden: "polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%)",
    visible: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  },
};

const PANELS = [
  { bg: "#6d6aff", label: "A" },
  { bg: "#ff6b9d", label: "B" },
  { bg: "#38bdf8", label: "C" },
  { bg: "#86efac", label: "D" },
  { bg: "#fbbf24", label: "E" },
  { bg: "#fb923c", label: "F" },
];

export default function ClipPathPage() {
  const [shape, setShape] = useState<ClipShape>("circle — center");
  const [duration, setDuration] = useState(500);
  const [revealed, setRevealed] = useState<boolean[]>(PANELS.map(() => false));

  function toggle(i: number) {
    setRevealed((prev) => prev.map((v, j) => (j === i ? !v : v)));
  }

  function revealAll() {
    setRevealed(PANELS.map(() => true));
  }

  function hideAll() {
    setRevealed(PANELS.map(() => false));
  }

  const { hidden, visible } = CLIP_SHAPES[shape];

  return (
    <PageLayout
      title="Clip-Path Reveals"
      description="clip-path defines the visible region of an element. Animating between shapes creates reveal transitions — the browser interpolates between compatible path types."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl p-8 flex flex-col gap-6"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          {/* Panel grid */}
          <div className="grid grid-cols-3 gap-4 flex-1">
            {PANELS.map((panel, i) => (
              <div
                key={i}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                style={{ aspectRatio: "1", background: "var(--surface-2)" }}
                onClick={() => toggle(i)}
              >
                {/* Ghost layer to show clickable area */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold opacity-10" style={{ color: panel.bg }}>{panel.label}</span>
                </div>
                {/* Revealed layer */}
                <div
                  className="absolute inset-0 flex items-center justify-center rounded-lg"
                  style={{
                    background: panel.bg,
                    clipPath: revealed[i] ? visible : hidden,
                    transition: `clip-path ${duration}ms ease-in-out`,
                  }}
                >
                  <span className="text-2xl font-bold text-white select-none">{panel.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={revealAll}
              className="px-4 py-2 rounded-lg text-sm font-mono font-semibold"
              style={{ background: "var(--accent)", color: "white" }}
            >
              reveal all
            </button>
            <button
              onClick={hideAll}
              className="px-4 py-2 rounded-lg text-sm font-mono font-semibold"
              style={{ background: "var(--surface-2)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              hide all
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>shape</span>
              <div className="flex flex-col gap-1.5">
                {(Object.keys(CLIP_SHAPES) as ClipShape[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setShape(key)}
                    className="text-left px-3 py-1.5 rounded-lg text-xs font-mono transition-colors"
                    style={{
                      background: shape === key ? "rgba(109,106,255,0.2)" : "transparent",
                      color: shape === key ? "var(--accent)" : "var(--text-muted)",
                      border: `1px solid ${shape === key ? "var(--accent)" : "transparent"}`,
                    }}
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <SliderControl label="duration" value={duration} min={100} max={2000} step={50} unit="ms" onChange={setDuration} />
          </ControlPanel>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed break-all" style={{ color: "var(--text-muted)" }}>
              <span style={{ color: "var(--accent)" }}>hidden</span><br />
              {hidden}<br /><br />
              <span style={{ color: "#ff6b9d" }}>visible</span><br />
              {visible}
            </p>
          </div>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "clip-path",
            text: "Defines the visible region of an element using CSS shape functions. Pixels outside the shape are hidden — but the element still occupies space in the layout.",
          },
          {
            label: "animatable shapes",
            text: "The browser interpolates between compatible shape types: circle↔circle, polygon↔polygon (same vertex count), inset↔inset. Mixing types causes a jump instead of a transition.",
          },
          {
            label: "wipe pattern",
            text: "A polygon that starts as a zero-width strip on one edge and expands to fill the element — polygon(0 0, 0 0, 0 100%, 0 100%) → polygon(0 0, 100% 0, 100% 100%, 0 100%).",
          },
          {
            label: "circle reveal",
            text: "circle(0% at X% Y%) expands from a radius of zero. The origin point controls the feel: center = iris open, corner = burst, edge = sweep.",
          },
        ]}
        code={`.panel {
  clip-path: circle(0% at 50% 50%);  /* hidden — radius = 0 */
  transition: clip-path 500ms ease-in-out;
}
.panel.revealed {
  clip-path: circle(75% at 50% 50%); /* visible */
}

/* Wipe-right variant */
.hidden  { clip-path: polygon(0 0, 0 0, 0 100%, 0 100%); }
.visible { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }`}
      />
    </PageLayout>
  );
}
