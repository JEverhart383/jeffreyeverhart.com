"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, ControlRow, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";
import {
  ParticleCta,
  PIXEL_VARIANTS,
  type HeadingFont,
  type SampleLayout,
} from "@/components/ParticleCta";
import type { Shape } from "@/lib/particle-text";

type Mode = "repel" | "attract";
const FONTS: HeadingFont[] = ["square", "grid", "circle", "triangle", "line", "inter"];
const SHAPES: Shape[] = ["square", "circle", "triangle", "line"];

export default function ParticleCtaPage() {
  const [radius, setRadius] = useState(90);
  const [strength, setStrength] = useState(3);
  const [spring, setSpring] = useState(0.055);
  const [size, setSize] = useState(1.3);
  const [gap, setGap] = useState(1);
  const [mode, setMode] = useState<Mode>("repel");
  const [font, setFont] = useState<HeadingFont>("square");
  const [layout, setLayout] = useState<SampleLayout>("cells");
  const [subdivide, setSubdivide] = useState(2);
  const [shape, setShape] = useState<Shape>("square");
  const [fill, setFill] = useState(1);
  const [tint, setTint] = useState(true);
  const [debug, setDebug] = useState(false);

  const btnStyle = (on: boolean) => ({
    background: on ? "#e879f920" : "transparent",
    color: on ? "#e879f9" : "var(--text-muted)",
    border: `1px solid ${on ? "#e879f9" : "var(--border)"}`,
  });

  const pickFont = (f: HeadingFont) => {
    setFont(f);
    if (f === "inter") {
      setShape("circle");
      return;
    }
    setShape(PIXEL_VARIANTS[f].shape);
    setFill(PIXEL_VARIANTS[f].fill);
  };
  const cells = font !== "inter" && layout === "cells";

  const buttons = <T extends string>(items: readonly T[], current: T, onPick: (v: T) => void) => (
    <div className="flex flex-wrap gap-1.5">
      {items.map((v) => (
        <button
          key={v}
          onClick={() => onPick(v)}
          className="rounded px-2 py-1 font-mono text-xs transition-colors"
          style={btnStyle(current === v)}
        >
          {v}
        </button>
      ))}
    </div>
  );

  return (
    <PageLayout
      title="Particle CTA"
      description="The particle text shader as a production-style call-to-action. Particles are sampled from a real <h2>'s rendered layout — font, wrapping and per-span color included — so the markup stays plain, accessible HTML and the canvas is pure decoration."
      library="WebGL"
      libraryColor="#e879f9"
    >
      <ParticleCta
        debug={debug}
        font={font}
        layout={layout}
        subdivide={subdivide}
        tunables={{ radius, strength, spring, size, gap, fill, shape, mode, activeColor: tint ? "#f2541b" : null }}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_1fr]">
        <ControlPanel>
          <ControlRow label="font">{buttons(FONTS, font, pickFont)}</ControlRow>
          {font !== "inter" && (
            <ControlRow label="particles from">{buttons(["cells", "dense"] as const, layout, setLayout)}</ControlRow>
          )}
          <ControlRow label="particle shape">{buttons(SHAPES, shape, setShape)}</ControlRow>
          <ControlRow label="mouse mode">{buttons(["repel", "attract"] as const, mode, setMode)}</ControlRow>
          <SliderControl label="radius" value={radius} min={30} max={200} step={10} unit="px" onChange={setRadius} />
          <SliderControl label="strength" value={strength} min={0.5} max={8} step={0.5} onChange={setStrength} />
          <SliderControl label="spring" value={spring} min={0.01} max={0.15} step={0.005} onChange={setSpring} />
          {cells ? (
            <>
              <SliderControl label="subdivide" value={subdivide} min={1} max={4} step={1} unit="×" onChange={setSubdivide} />
              <SliderControl label="fill" value={fill} min={0.3} max={1} step={0.05} onChange={setFill} />
            </>
          ) : (
            <>
              <SliderControl label="particle px" value={size} min={0.4} max={6} step={0.1} unit="px" onChange={setSize} />
              <SliderControl label="sample gap" value={gap} min={0.5} max={6} step={0.25} unit="px" onChange={setGap} />
            </>
          )}
          <SwitchControl label="tint when displaced" checked={tint} onChange={setTint} />
          <SwitchControl label="show real <h2>" checked={debug} onChange={setDebug} />
        </ControlPanel>

        <ConceptSection
          concepts={[
            {
              label: "the font is the model",
              text: "Geist Pixel draws every glyph on a 38-unit grid at 1000 units/em, anchored to the pen origin and baseline. In cells mode each filled font pixel becomes exactly one particle (or N×N when subdivided), sized from the grid — so at rest the canvas reproduces the font, and particle shape mirrors the variant.",
            },
            {
              label: "sample the DOM, not a string",
              text: "A Range per character gives the exact box the browser laid each glyph out in. Each one is redrawn offscreen with its computed font and color, then sampled — so a <span> in a different color becomes particles in that color.",
            },
            {
              label: "progressive enhancement",
              text: "The <h2> stays real text. It only drops to opacity: 0 once WebGL is drawing — not visibility: hidden, which would remove it from the accessibility tree. No JS, no WebGL, or reduced motion leaves the plain heading.",
            },
            {
              label: "transparent canvas",
              text: "The fragment shader outputs premultiplied color with blendFunc(ONE, ONE_MINUS_SRC_ALPHA), so particles composite cleanly over any background without dark or bright fringes.",
            },
            {
              label: "costs nothing at rest",
              text: "The loop stops when off-screen (IntersectionObserver), when the tab is hidden, and when particles settle. A pointer move wakes it. Physics runs on a fixed 60Hz step so 120Hz displays feel the same.",
            },
          ]}
          code={`<section aria-labelledby="cta">
  <canvas aria-hidden="true"></canvas>   <!-- decoration -->
  <h2 id="cta" style="opacity: 0">       <!-- still read aloud -->
    Ready to <span class="accent">identify?</span>
  </h2>
</section>

// per character: real layout box + computed style
range.setStart(node, i); range.setEnd(node, i + 1);
const r = range.getBoundingClientRect();
ctx.font = \`\${cs.fontWeight} \${cs.fontSize} \${cs.fontFamily}\`;
ctx.fillStyle = cs.color;
ctx.fillText(ch, r.left - origin.left, baseline);`}
        />
      </div>
    </PageLayout>
  );
}
