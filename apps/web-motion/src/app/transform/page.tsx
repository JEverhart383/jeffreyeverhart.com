"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const ORIGIN_PRESETS = [
  [0, 0], [50, 0], [100, 0],
  [0, 50], [50, 50], [100, 50],
  [0, 100], [50, 100], [100, 100],
] as const;

export default function TransformPage() {
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [skewX, setSkewX] = useState(0);
  const [skewY, setSkewY] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [originX, setOriginX] = useState(50);
  const [originY, setOriginY] = useState(50);

  const transform = [
    `translate(${translateX}px, ${translateY}px)`,
    `rotate(${rotate}deg)`,
    `scale(${scaleX}, ${scaleY})`,
    `skew(${skewX}deg, ${skewY}deg)`,
  ].join(" ");

  return (
    <PageLayout
      title="Transform"
      description="Compose CSS transforms and see how their order affects the result. CSS transforms are applied right-to-left — scale before rotate produces a different result than rotate before scale."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex items-center justify-center overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          <div className="relative w-full h-full flex items-center justify-center" style={{ minHeight: 420 }}>
            <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            <div
              className="relative w-32 h-32 rounded-lg flex items-center justify-center text-xs font-mono font-semibold"
              style={{
                background: "rgba(109,106,255,0.2)",
                border: "2px solid var(--accent)",
                transform,
                transformOrigin: `${originX}% ${originY}%`,
                transition: "transform 0.05s linear",
                color: "var(--accent)",
              }}
            >
              element
              <div
                style={{
                  position: "absolute",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f472b6",
                  left: `${originX}%`,
                  top: `${originY}%`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  boxShadow: "0 0 0 2px rgba(244,114,182,0.35)",
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="translateX" value={translateX} min={-150} max={150} unit="px" onChange={setTranslateX} />
            <SliderControl label="translateY" value={translateY} min={-150} max={150} unit="px" onChange={setTranslateY} />
            <SliderControl label="rotate" value={rotate} min={-180} max={180} unit="°" onChange={setRotate} />
            <SliderControl label="scaleX" value={scaleX} min={0.1} max={3} step={0.05} onChange={setScaleX} />
            <SliderControl label="scaleY" value={scaleY} min={0.1} max={3} step={0.05} onChange={setScaleY} />
            <SliderControl label="skewX" value={skewX} min={-60} max={60} unit="°" onChange={setSkewX} />
            <SliderControl label="skewY" value={skewY} min={-60} max={60} unit="°" onChange={setSkewY} />
          </ControlPanel>

          <div
            className="rounded-xl p-5 flex flex-col gap-3"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
                transform-origin
              </span>
              <span className="text-xs font-mono tabular-nums" style={{ color: "#f472b6" }}>
                {originX}% {originY}%
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5" style={{ width: 90 }}>
              {ORIGIN_PRESETS.map(([ox, oy]) => {
                const active = ox === originX && oy === originY;
                return (
                  <button
                    key={`${ox}-${oy}`}
                    onClick={() => { setOriginX(ox); setOriginY(oy); }}
                    className="w-7 h-7 rounded transition-all"
                    style={{
                      background: active ? "rgba(244,114,182,0.2)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${active ? "#f472b6" : "var(--border)"}`,
                    }}
                    title={`${ox}% ${oy}%`}
                  />
                );
              })}
            </div>
          </div>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed break-all" style={{ color: "var(--text-muted)" }}>
              {`transform:`}<br />
              {`  translate(${translateX}px, ${translateY}px)`}<br />
              {`  rotate(${rotate}deg)`}<br />
              {`  scale(${scaleX}, ${scaleY})`}<br />
              {`  skew(${skewX}deg, ${skewY}deg);`}<br />
              {`transform-origin: ${originX}% ${originY}%;`}
            </p>
          </div>
        </div>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "application order",
            text: "CSS transforms are applied right-to-left. translate → rotate first rotates around the origin, then moves the already-rotated element.",
          },
          {
            label: "coordinate system shift",
            text: "Each function modifies the local axes. rotate spins the axes; any subsequent translate moves along those rotated axes, not the original ones.",
          },
          {
            label: "transform-origin",
            text: "The pink dot marks the pivot point for rotate and scale. Try rotating with origin at 0% 0% — the element orbits its top-left corner instead of its center. Same transform, completely different result.",
          },
          {
            label: "skew",
            text: "Shears the element along an axis — slanting it like italic text — without changing its dimensions or position.",
          },
        ]}
        code={`/* transform-origin shifts the pivot point for rotate and scale */
transform-origin: 0% 0%;     /* top-left corner */
transform-origin: 50% 50%;   /* center (default) */
transform-origin: 100% 100%; /* bottom-right */

/* Applied right-to-left:
   skew first, then scale, then rotate, then translate */
transform:
  translate(50px, 0px)
  rotate(30deg)
  scale(1.5, 1.5)
  skew(10deg, 0deg);`}
      />
    </PageLayout>
  );
}
