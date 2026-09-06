"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

export default function CssMaskingPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const targetRef = useRef({ x: -500, y: -500 });
  const posRef = useRef({ x: -500, y: -500 });
  const velRef = useRef({ x: 0, y: 0 });
  const radiusRef = useRef(120);
  const featherRef = useRef(60);

  const [radius, setRadius] = useState(120);
  const [feather, setFeather] = useState(60);

  useEffect(() => { radiusRef.current = radius; }, [radius]);
  useEffect(() => { featherRef.current = feather; }, [feather]);

  useEffect(() => {
    const container = containerRef.current;
    const reveal = revealRef.current;
    if (!container || !reveal) return;

    function onMove(e: MouseEvent) {
      const rect = container!.getBoundingClientRect();
      targetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function onLeave() {
      targetRef.current = { x: -500, y: -500 };
    }

    const STIFFNESS = 0.18;
    const DAMPING = 0.80;

    function tick() {
      const pos = posRef.current;
      const vel = velRef.current;
      const tgt = targetRef.current;

      // Spring physics: pull toward target, damp velocity
      vel.x += (tgt.x - pos.x) * STIFFNESS;
      vel.y += (tgt.y - pos.y) * STIFFNESS;
      vel.x *= DAMPING;
      vel.y *= DAMPING;
      pos.x += vel.x;
      pos.y += vel.y;

      const r = radiusRef.current;
      const f = featherRef.current;
      const speed = Math.sqrt(vel.x * vel.x + vel.y * vel.y);

      // Stretch satellite blobs along the velocity vector
      const stretch = Math.min(speed * 2.2, r * 0.85);
      const invLen = speed > 0.3 ? 1 / speed : 0;
      const dx = vel.x * invLen;
      const dy = vel.y * invLen;

      const sr = r * 0.62;
      const lx = pos.x + dx * stretch * 0.6;  // leading blob
      const ly = pos.y + dy * stretch * 0.6;
      const tx = pos.x - dx * stretch * 0.3;  // trailing blob
      const ty = pos.y - dy * stretch * 0.3;

      const mask = [
        `radial-gradient(circle at ${pos.x}px ${pos.y}px, black ${r}px, transparent ${r + f}px)`,
        `radial-gradient(circle at ${lx}px ${ly}px, black ${sr}px, transparent ${sr + f}px)`,
        `radial-gradient(circle at ${tx}px ${ty}px, black ${sr}px, transparent ${sr + f}px)`,
      ].join(", ");
      reveal!.style.maskImage = mask;
      // @ts-expect-error webkit prefix
      reveal!.style.webkitMaskImage = mask;

      rafRef.current = requestAnimationFrame(tick);
    }

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <PageLayout
      title="CSS Masking"
      description="mask-image defines which parts of an element are visible using pixel alpha values — unlike clip-path's hard edges. A radial gradient at the cursor position creates a soft blob that reveals the layer beneath as you move."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-6">
        <div
          ref={containerRef}
          className="relative rounded-xl overflow-hidden select-none"
          style={{
            height: 460,
            cursor: "none",
            background: "#07070f",
            backgroundImage: "radial-gradient(circle, #1a1a2e 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        >
          {/* Base layer — faint text visible through the dark */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
            <p className="text-7xl font-bold font-mono tracking-tighter" style={{ color: "rgba(255,255,255,0.06)" }}>
              REVEAL
            </p>
            <p className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.12)" }}>
              move cursor to unmask
            </p>
          </div>

          {/* Reveal layer — conic gradient, masked to blob cursor */}
          <div
            ref={revealRef}
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none"
            style={{
              background:
                "conic-gradient(from 0deg at 40% 60%, #6d6aff 0deg, #ff6b9d 80deg, #fbbf24 160deg, #38bdf8 240deg, #86efac 300deg, #6d6aff 360deg)",
              maskImage: "radial-gradient(circle at -500px -500px, black 0px, transparent 1px)",
            }}
          >
            <p className="text-7xl font-bold font-mono tracking-tighter text-white drop-shadow-lg">
              REVEAL
            </p>
            <p className="text-sm font-mono text-white/70">move cursor to unmask</p>
          </div>
        </div>

        <ControlPanel>
          <SliderControl
            label="radius"
            value={radius}
            min={20}
            max={300}
            step={10}
            unit="px"
            onChange={setRadius}
          />
          <SliderControl
            label="feather"
            value={feather}
            min={0}
            max={150}
            step={5}
            unit="px"
            onChange={setFeather}
          />
        </ControlPanel>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "mask-image",
            text: "Defines a mask layer using an image, gradient, or SVG shape. Black pixels = fully visible; transparent pixels = hidden. Unlike clip-path (hard vector edge), masks use alpha values — enabling soft, anti-aliased falloffs.",
          },
          {
            label: "radial-gradient as mask",
            text: "A radial-gradient centered at the cursor position fills a circle with black (opaque) then fades to transparent. Only the element pixels beneath the black region are visible — everything else is hidden.",
          },
          {
            label: "feather / soft edge",
            text: "The gap between the inner stop (solid black) and outer stop (transparent) controls edge hardness. A tight gap gives a crisp cut; a wide gap creates a soft glowing blob that bleeds into the dark layer.",
          },
          {
            label: "spring physics",
            text: "Instead of lerp (exponential decay toward target), a spring adds velocity each frame — vel += (target - pos) * stiffness — then damps it: vel *= damping. Damping < 1 means the blob overshoots and oscillates when it stops, which reads as liquid weight.",
          },
          {
            label: "blob stretching",
            text: "Two satellite circles are placed ahead of and behind the main blob, offset along the velocity vector. Their distance from center scales with speed — at low speed they collapse onto the main blob; at high speed the trio merges into a teardrop. Multiple mask-image layers union by default via mask-composite: add.",
          },
        ]}
        code={`// Spring physics — overshoots, oscillates, feels heavy
vel.x += (target.x - pos.x) * STIFFNESS; // 0.18
vel.y += (target.y - pos.y) * STIFFNESS;
vel.x *= DAMPING; // 0.80
vel.y *= DAMPING;
pos.x += vel.x;
pos.y += vel.y;

// Stretch along velocity vector
const speed = Math.hypot(vel.x, vel.y);
const stretch = Math.min(speed * 2.2, radius * 0.85);
const dx = vel.x / (speed || 1);
const dy = vel.y / (speed || 1);

// Three overlapping circles → one organic blob via mask-composite: add
el.style.maskImage = [
  \`radial-gradient(circle at \${pos.x}px \${pos.y}px, black \${r}px, transparent \${r+f}px)\`,
  \`radial-gradient(circle at \${pos.x+dx*stretch*.6}px \${pos.y+dy*stretch*.6}px, black \${r*.62}px, transparent \${r*.62+f}px)\`,
  \`radial-gradient(circle at \${pos.x-dx*stretch*.3}px \${pos.y-dy*stretch*.3}px, black \${r*.62}px, transparent \${r*.62+f}px)\`,
].join(", ");`}
      />
    </PageLayout>
  );
}
