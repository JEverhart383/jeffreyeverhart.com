"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const N = 9;
const ACTIVE_SCALE = 1.28;
const REST = {
  transform: "scale(1)",
  boxShadow: "0 0 0px 0px rgba(109,106,255,0)",
  borderColor: "rgba(109,106,255,0.2)",
  background: "rgb(26,26,38)",
};

type ProxState = { scale: number; glow: number };

function transitionStr(dur: number) {
  return `transform ${dur}s ease, box-shadow ${dur}s ease, border-color ${dur}s ease, background ${dur}s ease`;
}

function applyActive(el: HTMLDivElement) {
  el.style.transform = `scale(${ACTIVE_SCALE})`;
  el.style.boxShadow = "0 0 28px 8px rgba(109,106,255,0.5)";
  el.style.borderColor = "rgba(109,106,255,1)";
  el.style.background = "rgb(40,30,62)";
}

function applyRest(el: HTMLDivElement) {
  el.style.transform = REST.transform;
  el.style.boxShadow = REST.boxShadow;
  el.style.borderColor = REST.borderColor;
  el.style.background = REST.background;
}

export default function MouseTransformsPage() {
  const hoverRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const proxRefs = useRef<(HTMLDivElement | null)[]>(Array(N).fill(null));
  const proxState = useRef<ProxState[]>(
    Array.from({ length: N }, () => ({ scale: 1, glow: 0 }))
  );
  const mouseRef = useRef({ x: 0, y: 0 });
  const stateRef = useRef({ radius: 200, speed: 0.07, transitionDur: 0.3 });

  const [transitionDur, setTransitionDur] = useState(0.3);
  const [radius, setRadius] = useState(200);
  const [speed, setSpeed] = useState(0.07);

  // Push transition duration changes directly to hover elements so re-renders aren't needed
  useEffect(() => {
    stateRef.current.transitionDur = transitionDur;
    hoverRefs.current.forEach((el) => {
      if (el) el.style.transition = transitionStr(transitionDur);
    });
  }, [transitionDur]);

  useEffect(() => { stateRef.current.radius = radius; }, [radius]);
  useEffect(() => { stateRef.current.speed = speed; }, [speed]);

  // Proximity RAF loop — runs once on mount
  useEffect(() => {
    function onMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }
    window.addEventListener("mousemove", onMove);

    let raf: number;
    function tick() {
      const { x, y } = mouseRef.current;
      const { radius, speed } = stateRef.current;

      proxRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const dist = Math.sqrt((x - (r.left + r.width / 2)) ** 2 + (y - (r.top + r.height / 2)) ** 2);
        const t = Math.max(0, 1 - dist / radius);
        const s = proxState.current[i];

        s.scale += (1 + t * (ACTIVE_SCALE - 1) - s.scale) * speed;
        s.glow += (t - s.glow) * speed;

        const g = s.glow;
        el.style.transform = `scale(${s.scale.toFixed(4)})`;
        el.style.boxShadow = `0 0 ${(g * 28).toFixed(1)}px ${(g * 8).toFixed(1)}px rgba(109,106,255,${(g * 0.5).toFixed(3)})`;
        el.style.borderColor = `rgba(109,106,255,${(0.2 + g * 0.8).toFixed(3)})`;
        el.style.background = `rgb(${Math.round(26 + g * 14)},${Math.round(26 + g * 4)},${Math.round(38 + g * 24)})`;
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  const baseElemStyle: React.CSSProperties = {
    width: 72,
    height: 72,
    borderRadius: 14,
    ...REST,
    border: `1px solid ${REST.borderColor}`,
    willChange: "transform, box-shadow",
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 72px)",
    gap: 12,
  };

  return (
    <PageLayout
      title="Mouse-Driven Transforms"
      description="The same 9 elements, the same CSS properties — triggered two different ways. Left: a CSS transition fires when the cursor enters each element. Right: the same scale, glow, and color continuously lerp toward targets set by global cursor distance, before you've even touched an element."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex items-center justify-center p-8"
          style={{ border: "1px solid var(--border)", minHeight: 460 }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 w-full place-items-center">

            {/* ── Hover grid ── */}
            <div className="flex flex-col items-center gap-5">
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                hover
              </span>
              <div style={gridStyle}>
                {Array.from({ length: N }).map((_, i) => (
                  <div
                    key={i}
                    ref={(el) => { hoverRefs.current[i] = el; }}
                    onMouseEnter={() => { const el = hoverRefs.current[i]; if (el) applyActive(el); }}
                    onMouseLeave={() => { const el = hoverRefs.current[i]; if (el) applyRest(el); }}
                    style={{ ...baseElemStyle, transition: transitionStr(transitionDur), cursor: "default" }}
                  />
                ))}
              </div>
              <p className="text-xs text-center leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 180 }}>
                fires on cursor enter/leave — binary, transition-driven
              </p>
            </div>

            {/* ── Proximity grid ── */}
            <div className="flex flex-col items-center gap-5">
              <span className="text-xs font-mono tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                proximity
              </span>
              <div style={gridStyle}>
                {Array.from({ length: N }).map((_, i) => (
                  <div
                    key={i}
                    ref={(el) => { proxRefs.current[i] = el; }}
                    style={{ ...baseElemStyle }}
                  />
                ))}
              </div>
              <p className="text-xs text-center leading-relaxed" style={{ color: "var(--text-muted)", maxWidth: 180 }}>
                lerps from cursor distance — continuous, no hover needed
              </p>
            </div>

          </div>
        </div>

        <ControlPanel>
          <SliderControl
            label="hover transition"
            value={transitionDur}
            min={0.05}
            max={1.2}
            step={0.05}
            unit="s"
            onChange={setTransitionDur}
          />
          <SliderControl
            label="prox radius"
            value={radius}
            min={80}
            max={420}
            step={20}
            unit="px"
            onChange={setRadius}
          />
          <SliderControl
            label="prox response"
            value={speed}
            min={0.01}
            max={0.25}
            step={0.01}
            onChange={setSpeed}
          />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "hover (binary)",
            text: "CSS transition fires on mouseenter / mouseleave. The state is strictly on or off — the browser handles interpolation, but only after the cursor crosses the element boundary.",
          },
          {
            label: "proximity (continuous)",
            text: "A RAF loop reads global cursor position every frame, computes distance to each element center, and lerps a 0–1 weight. Elements react before you touch them.",
          },
          {
            label: "distance formula",
            text: "dist = √((x − cx)² + (y − cy)²). Dividing by the radius normalizes to [0, 1]: 0 means far away, 1 means directly over the element center.",
          },
          {
            label: "why lerp instead of snap",
            text: "Lerping the scale each frame (scale += (target - scale) * speed) means the element always moves a fraction toward its target — producing smooth deceleration for free.",
          },
        ]}
        code={`// Each RAF frame, for each element:
const dist = Math.sqrt((mouseX - cx)**2 + (mouseY - cy)**2);
const t    = Math.max(0, 1 - dist / radius); // 0=far, 1=center

// Lerp scale toward the proximity-weighted target
scale += (1 + t * 0.28 - scale) * 0.07;
el.style.transform = \`scale(\${scale})\`;`}
      />
    </PageLayout>
  );
}
