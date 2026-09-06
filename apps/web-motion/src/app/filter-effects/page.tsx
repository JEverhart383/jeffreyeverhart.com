"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const DEFAULTS = { blur: 0, brightness: 100, saturate: 100, contrast: 100, hueRotate: 0 };

export default function FilterEffectsPage() {
  const [blur, setBlur] = useState(DEFAULTS.blur);
  const [brightness, setBrightness] = useState(DEFAULTS.brightness);
  const [saturate, setSaturate] = useState(DEFAULTS.saturate);
  const [contrast, setContrast] = useState(DEFAULTS.contrast);
  const [hueRotate, setHueRotate] = useState(DEFAULTS.hueRotate);

  const parts = [
    blur > 0 ? `blur(${blur}px)` : "",
    brightness !== 100 ? `brightness(${brightness}%)` : "",
    saturate !== 100 ? `saturate(${saturate}%)` : "",
    contrast !== 100 ? `contrast(${contrast}%)` : "",
    hueRotate !== 0 ? `hue-rotate(${hueRotate}deg)` : "",
  ].filter(Boolean);

  const filter = parts.length > 0 ? parts.join(" ") : "none";

  function reset() {
    setBlur(DEFAULTS.blur);
    setBrightness(DEFAULTS.brightness);
    setSaturate(DEFAULTS.saturate);
    setContrast(DEFAULTS.contrast);
    setHueRotate(DEFAULTS.hueRotate);
  }

  return (
    <PageLayout
      title="Filter Effects"
      description="CSS filter applies GPU-accelerated visual effects — blur, brightness, saturation, contrast, and hue rotation. All composable in a single property declaration, applied left to right."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex items-center justify-center"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          <div
            style={{
              width: 260,
              height: 260,
              borderRadius: 24,
              filter,
              transition: "filter 0.15s ease",
              background: "conic-gradient(from 0deg, #6d6aff, #ff6b9d, #ffb347, #38bdf8, #86efac, #6d6aff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 14,
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.45)",
                backdropFilter: "blur(8px)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="blur" value={blur} min={0} max={20} step={0.5} unit="px" onChange={setBlur} />
            <SliderControl label="brightness" value={brightness} min={0} max={200} unit="%" onChange={setBrightness} />
            <SliderControl label="saturate" value={saturate} min={0} max={200} unit="%" onChange={setSaturate} />
            <SliderControl label="contrast" value={contrast} min={0} max={200} unit="%" onChange={setContrast} />
            <SliderControl label="hue-rotate" value={hueRotate} min={0} max={360} unit="°" onChange={setHueRotate} />
            <button
              onClick={reset}
              className="text-xs font-mono py-1.5 px-3 rounded-lg self-start transition-opacity hover:opacity-70"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              reset
            </button>
          </ControlPanel>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed break-all" style={{ color: "var(--text-muted)" }}>
              {`filter: ${filter};`}
            </p>
          </div>
        </div>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "GPU-accelerated",
            text: "filter triggers compositor-layer promotion, just like transform and opacity. The browser offloads rendering to the GPU, so animating it is generally smooth even on complex elements.",
          },
          {
            label: "order matters",
            text: "Filter functions are applied left to right. blur() then brightness() is a different result from brightness() then blur() when the effects interact — the sequence is part of the effect.",
          },
          {
            label: "backdrop-filter",
            text: "backdrop-filter applies the same functions to whatever is rendered behind the element, not the element itself. This is how frosted-glass and blur-behind UI patterns work.",
          },
          {
            label: "drop-shadow vs box-shadow",
            text: "filter: drop-shadow() traces the element's actual alpha shape, including transparency and irregular edges. box-shadow always applies to the rectangular bounding box.",
          },
        ]}
        code={`/* Composable — functions apply left to right */
filter:
  blur(4px)
  brightness(120%)
  saturate(150%)
  contrast(90%)
  hue-rotate(30deg);

/* Animating filter is GPU-accelerated */
.element {
  filter: blur(0px) brightness(100%);
  transition: filter 0.3s ease;
}
.element:hover {
  filter: blur(4px) brightness(140%);
}

/* backdrop-filter for frosted glass */
.glass {
  backdrop-filter: blur(12px) brightness(0.9);
}`}
      />
    </PageLayout>
  );
}
