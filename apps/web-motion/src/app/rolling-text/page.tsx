"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const PAIRS = [
  { word: "DESIGN", color: "#a78bfa" },
  { word: "THINK", color: "#38bdf8" },
  { word: "HELLO", color: "#86efac" },
];

interface RollingWordProps {
  from: string;
  to: string;
  color: string;
  stagger: number;
  duration: number;
  reverseStagger: boolean;
}

function RollingWord({ from, to, color, stagger, duration, reverseStagger }: RollingWordProps) {
  const [hovered, setHovered] = useState(false);
  const len = Math.max(from.length, to.length);

  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "inline-flex", cursor: "default", userSelect: "none" }}
    >
      {Array.from({ length: len }).map((_, i) => {
        const staggerIndex = reverseStagger ? len - 1 - i : i;
        const delay = staggerIndex * stagger;
        const fromChar = from[i] ?? " ";
        const toChar = to[i] ?? " ";

        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              overflow: "hidden",
              height: "1em",
              lineHeight: 1,
            }}
          >
            <span
              style={{
                display: "flex",
                flexDirection: "column",
                transform: hovered ? "translateY(-1em)" : "translateY(0)",
                transition: `transform ${duration}ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
              }}
            >
              {/* Outgoing character — fades toward the incoming color as it exits */}
              <span
                style={{
                  flexShrink: 0,
                  color: hovered ? color : "var(--text)",
                  transition: `color ${duration}ms ease ${delay}ms`,
                }}
              >
                {fromChar}
              </span>
              {/* Incoming character — accent colored, slides up from below */}
              <span style={{ flexShrink: 0, color }}>
                {toChar}
              </span>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function RollingTextPage() {
  const [stagger, setStagger] = useState(40);
  const [duration, setDuration] = useState(400);
  const [reverseStagger, setReverseStagger] = useState(false);

  return (
    <PageLayout
      title="Rolling Text"
      description="Each character is wrapped in an overflow-hidden slot. An inner column of two characters slides up on hover — the outgoing char exits upward while the incoming char rises from below. Staggered transition-delay creates a cascading wave across the word."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex items-center justify-center p-12"
          style={{ border: "1px solid var(--border)", minHeight: 400 }}
        >
          <div className="flex flex-col items-center gap-10">
            {PAIRS.map((pair) => (
              <div key={pair.word} style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>
                <RollingWord
                  from={pair.word}
                  to={pair.word}
                  color={pair.color}
                  stagger={stagger}
                  duration={duration}
                  reverseStagger={reverseStagger}
                />
              </div>
            ))}
          </div>
        </div>

        <ControlPanel>
          <SliderControl
            label="stagger"
            value={stagger}
            min={0}
            max={100}
            step={5}
            unit="ms"
            onChange={setStagger}
          />
          <SliderControl
            label="duration"
            value={duration}
            min={100}
            max={800}
            step={25}
            unit="ms"
            onChange={setDuration}
          />
          <SwitchControl
            label="reverse stagger"
            checked={reverseStagger}
            onChange={setReverseStagger}
          />
        </ControlPanel>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "overflow clip + fixed height",
            text: "Each character slot is display: inline-block with overflow: hidden and height: 1em. This creates a viewport window that shows exactly one character at a time — anything above or below is clipped.",
          },
          {
            label: "two-character column",
            text: "Inside each slot, a flex column holds the outgoing char on top and the incoming char below. On hover, the entire column translateY(-1em), sliding the outgoing char up out of view and the incoming char up into the slot.",
          },
          {
            label: "staggered transition-delay",
            text: "Each slot gets transition-delay: i * staggerMs. The first character starts moving immediately; later characters wait proportionally. This creates a cascading left-to-right (or right-to-left) wave across the word.",
          },
          {
            label: "color transition",
            text: "The outgoing character transitions its color toward the incoming character's accent color as it exits. The incoming character is always pre-colored — no transition needed. Both fire on the same delay, so the color shift is synchronized with the slide.",
          },
        ]}
        code={`// Each character slot:
// <span style="overflow:hidden; height:1em">
//   <span style="display:flex; flex-direction:column;
//                transform: translateY(-1em) /* hovered */
//                transition: transform 400ms ease 80ms /* i=2 */">
//     <span style="color: accent /* fades in */">D</span>
//     <span style="color: accent">C</span>
//   </span>
// </span>

// Stagger calculation:
const delay = charIndex * staggerMs;
// i=0 → 0ms, i=1 → 40ms, i=2 → 80ms …

// Reverse stagger:
const staggerIndex = reversed ? len - 1 - i : i;
const delay = staggerIndex * staggerMs;`}
      />
    </PageLayout>
  );
}
