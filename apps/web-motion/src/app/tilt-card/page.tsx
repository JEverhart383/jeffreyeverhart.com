"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const CARDS = [
  {
    eyebrow: "LAUNCH",
    title: "Ship faster",
    body: "Zero-config deployments with instant global rollback.",
    accent: "#6d6aff",
    dot1: "#6d6aff",
    dot2: "#e879f9",
    lines: 3,
  },
  {
    eyebrow: "OBSERVE",
    title: "Real-time metrics",
    body: "Edge latency, request volume, and error rates at a glance.",
    accent: "#38bdf8",
    dot1: "#38bdf8",
    dot2: "#6d6aff",
    lines: 4,
  },
];

type TiltState = {
  rotX: number;
  rotY: number;
  shineX: number;
  shineY: number;
  targetRotX: number;
  targetRotY: number;
  targetShineX: number;
  targetShineY: number;
  hovered: boolean;
};

export default function TiltCardPage() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>(Array(CARDS.length).fill(null));
  const shineRefs = useRef<(HTMLDivElement | null)[]>(Array(CARDS.length).fill(null));

  const tiltState = useRef<TiltState[]>(
    CARDS.map(() => ({
      rotX: 0, rotY: 0, shineX: 50, shineY: 50,
      targetRotX: 0, targetRotY: 0, targetShineX: 50, targetShineY: 50,
      hovered: false,
    }))
  );

  const stateRef = useRef({ maxTilt: 18, perspective: 700, shine: 0.14, follow: 0.12, scale: true });

  const [maxTilt, setMaxTilt] = useState(18);
  const [perspective, setPerspective] = useState(700);
  const [shine, setShine] = useState(0.14);
  const [follow, setFollow] = useState(0.12);
  const [scaleOnHover, setScaleOnHover] = useState(true);

  useEffect(() => { stateRef.current.maxTilt = maxTilt; }, [maxTilt]);
  useEffect(() => { stateRef.current.perspective = perspective; }, [perspective]);
  useEffect(() => { stateRef.current.shine = shine; }, [shine]);
  useEffect(() => { stateRef.current.follow = follow; }, [follow]);
  useEffect(() => { stateRef.current.scale = scaleOnHover; }, [scaleOnHover]);

  // Mouse handlers update targets; RAF loop lerps current state toward them
  function handleMove(e: React.MouseEvent<HTMLDivElement>, i: number) {
    const card = cardRefs.current[i];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    const { maxTilt } = stateRef.current;
    const s = tiltState.current[i];
    s.targetRotX = -dy * maxTilt;
    s.targetRotY = dx * maxTilt;
    s.targetShineX = ((e.clientX - rect.left) / rect.width) * 100;
    s.targetShineY = ((e.clientY - rect.top) / rect.height) * 100;
    s.hovered = true;
  }

  function handleLeave(i: number) {
    const s = tiltState.current[i];
    s.targetRotX = 0;
    s.targetRotY = 0;
    s.hovered = false;
  }

  useEffect(() => {
    let raf: number;

    function tick() {
      const { perspective, follow, shine, scale } = stateRef.current;

      tiltState.current.forEach((s, i) => {
        const card = cardRefs.current[i];
        const shineEl = shineRefs.current[i];
        if (!card) return;

        s.rotX += (s.targetRotX - s.rotX) * follow;
        s.rotY += (s.targetRotY - s.rotY) * follow;
        s.shineX += (s.targetShineX - s.shineX) * follow;
        s.shineY += (s.targetShineY - s.shineY) * follow;

        const scaleVal = scale && s.hovered ? 1.035 : 1;
        card.style.transform = [
          `perspective(${perspective}px)`,
          `rotateX(${s.rotX.toFixed(3)}deg)`,
          `rotateY(${s.rotY.toFixed(3)}deg)`,
          `scale(${scaleVal})`,
        ].join(" ");

        if (shineEl) {
          const opacity = s.hovered ? shine : 0;
          shineEl.style.background = `radial-gradient(circle at ${s.shineX.toFixed(1)}% ${s.shineY.toFixed(1)}%, rgba(255,255,255,${(opacity * 2).toFixed(3)}) 0%, transparent 55%)`;
          shineEl.style.opacity = s.hovered ? "1" : "0";
        }
      });

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <PageLayout
      title="Tilt Card"
      description="A cursor-driven 3D tilt using CSS perspective + rotateX/rotateY, with a radial shine that tracks the cursor within the card. Rotation and shine are lerp-smoothed in a RAF loop so the card lags behind the cursor rather than snapping instantly."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex items-center justify-center p-8"
          style={{ border: "1px solid var(--border)", minHeight: 460 }}
        >
          <div className="flex flex-wrap gap-8 items-center justify-center">
            {CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                onMouseMove={(e) => handleMove(e, i)}
                onMouseLeave={() => handleLeave(i)}
                style={{
                  width: 260,
                  minHeight: 172,
                  borderRadius: 18,
                  background: "linear-gradient(145deg, #15152a 0%, #0d0d1e 100%)",
                  border: "1px solid var(--border)",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "none",
                  transformStyle: "preserve-3d",
                  transition: "box-shadow 0.3s ease",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                  userSelect: "none",
                  padding: "22px 22px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  willChange: "transform",
                }}
              >
                {/* Radial shine layer */}
                <div
                  ref={(el) => { shineRefs.current[i] = el; }}
                  style={{
                    position: "absolute",
                    inset: 0,
                    pointerEvents: "none",
                    transition: "opacity 0.25s ease",
                    opacity: 0,
                  }}
                />

                {/* Corner accent dots */}
                <span style={{ position: "absolute", top: 14, right: 14, width: 6, height: 6, borderRadius: "50%", background: card.dot1, opacity: 0.8, display: "block" }} />
                <span style={{ position: "absolute", top: 24, right: 14, width: 4, height: 4, borderRadius: "50%", background: card.dot2, opacity: 0.5, display: "block" }} />

                {/* Content */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "relative" }}>
                  <span style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: "0.14em", color: card.accent, fontWeight: 600 }}>
                    {card.eyebrow}
                  </span>
                  <span style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", lineHeight: 1.2 }}>
                    {card.title}
                  </span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: 190 }}>
                    {card.body}
                  </span>
                </div>

                {/* Decorative skeleton lines */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4, position: "relative" }}>
                  {Array.from({ length: card.lines }).map((_, j) => (
                    <div
                      key={j}
                      style={{
                        height: 3,
                        borderRadius: 2,
                        background: `rgba(109,106,255,${0.08 + j * 0.03})`,
                        width: `${90 - j * 15}%`,
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <ControlPanel>
          <SliderControl label="max tilt" value={maxTilt} min={2} max={35} step={1} unit="°" onChange={setMaxTilt} />
          <SliderControl label="perspective" value={perspective} min={300} max={1400} step={50} unit="px" onChange={setPerspective} />
          <SliderControl label="shine" value={shine} min={0} max={0.4} step={0.01} onChange={setShine} />
          <SliderControl label="follow speed" value={follow} min={0.03} max={0.4} step={0.01} onChange={setFollow} />
          <SwitchControl label="scale on hover" checked={scaleOnHover} onChange={setScaleOnHover} />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "cursor → rotation mapping",
            text: "Mouse offset within the card is normalized to [-1, 1] by dividing by half the card's width/height, then multiplied by the max tilt angle in degrees.",
          },
          {
            label: "lerp smoothing",
            text: "Each RAF frame: current += (target - current) * speed. The card always moves a fixed fraction toward its target, creating an organic lag behind the cursor.",
          },
          {
            label: "perspective — the viewer's eye distance",
            text: "perspective(700px) tells the browser how far the viewer's eye is from the z=0 plane. Without it, rotateX/rotateY produce flat, isometric-looking transforms — there's no foreshortening so depth is invisible. Lower values (e.g. 300px) place the eye close to the surface, making tilts look dramatic and exaggerated. Higher values (e.g. 1400px) push the eye back, flattening the effect toward no perspective at all. Used inline inside transform, it applies to this element only — no parent .scene wrapper needed, though it can't be shared across siblings.",
          },
          {
            label: "radial shine",
            text: "A radial-gradient overlay is centered at the cursor's card-relative coordinates and fades to transparent. This fakes a specular highlight that tracks the light source.",
          },
        ]}
        code={`// mousemove — update targets, no DOM writes
const dx = (mouseX - cardCenterX) / halfWidth;  // [-1, 1]
const dy = (mouseY - cardCenterY) / halfHeight;
targetRotY =  dx * maxTilt;
targetRotX = -dy * maxTilt;

// RAF loop — lerp current values toward targets each frame
rotX += (targetRotX - rotX) * 0.12;
rotY += (targetRotY - rotY) * 0.12;
card.style.transform =
  \`perspective(700px) rotateX(\${rotX}deg) rotateY(\${rotY}deg)\`;`}
      />
    </PageLayout>
  );
}
