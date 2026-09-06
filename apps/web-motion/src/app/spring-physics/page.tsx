"use client";

import { useState, useRef } from "react";
import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

export default function SpringPhysicsPage() {
  const [stiffness, setStiffness] = useState(200);
  const [damping, setDamping] = useState(20);
  const [mass, setMass] = useState(1);
  const [showTrail, setShowTrail] = useState(false);
  const areaRef = useRef<HTMLDivElement>(null);

  const ballX = useMotionValue(0);
  const ballY = useMotionValue(0);

  const scale = useTransform([ballX, ballY], ([bx, by]: number[]) => {
    const dist = Math.sqrt(bx * bx + by * by);
    return 1 + dist * 0.003;
  });

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = areaRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    // Teleport to click position, then spring back to center
    ballX.set(e.clientX - cx);
    ballY.set(e.clientY - cy);
    animate(ballX, 0, { type: "spring", stiffness, damping, mass });
    animate(ballY, 0, { type: "spring", stiffness, damping, mass });
  }

  const isUnderdamped = damping < 2 * Math.sqrt(stiffness * mass);

  return (
    <PageLayout
      title="Spring Physics"
      description="Click anywhere in the canvas to fling the ball. Tune stiffness (how strong the spring pulls back), damping (how quickly it loses energy), and mass (how heavy the object feels)."
      library="Framer Motion"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          ref={areaRef}
          className="rounded-xl flex items-center justify-center cursor-crosshair relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
          onClick={handleClick}
        >
          {showTrail && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    x: ballX,
                    y: ballY,
                    width: 48 - i * 5,
                    height: 48 - i * 5,
                    background: `rgba(109,106,255,${0.06 - i * 0.006})`,
                    left: "50%",
                    top: "50%",
                    translateX: "-50%",
                    translateY: "-50%",
                    filter: `blur(${i * 2}px)`,
                  }}
                />
              ))}
            </div>
          )}

          <motion.div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xs font-mono font-bold pointer-events-none"
            style={{
              x: ballX,
              y: ballY,
              scale,
              background: "var(--accent)",
              color: "white",
              boxShadow: "0 0 24px rgba(109,106,255,0.5)",
            }}
          >
            ●
          </motion.div>

          <span
            className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          >
            click to fling
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="stiffness" value={stiffness} min={1} max={1000} step={5} onChange={setStiffness} />
            <SliderControl label="damping" value={damping} min={0} max={100} step={1} onChange={setDamping} />
            <SliderControl label="mass" value={mass} min={0.1} max={10} step={0.1} onChange={setMass} />
            <SwitchControl label="trail" checked={showTrail} onChange={setShowTrail} />
          </ControlPanel>

          <div
            className="rounded-xl p-4 flex flex-col gap-2"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {`useSpring(x, {`}<br />
              {`  stiffness: ${stiffness},`}<br />
              {`  damping: ${damping},`}<br />
              {`  mass: ${mass},`}<br />
              {`})`}
            </p>
            <div
              className="text-xs font-mono px-2 py-1 rounded"
              style={{
                background: isUnderdamped ? "rgba(251,191,36,0.1)" : "rgba(134,239,172,0.1)",
                color: isUnderdamped ? "#fbbf24" : "#86efac",
              }}
            >
              {isUnderdamped ? "underdamped — oscillates" : "overdamped — no oscillation"}
            </div>
          </div>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "springs vs easing",
            text: "Easing animations have a fixed duration. Springs don't — they settle when kinetic energy runs out, so a heavy spring takes longer than a light one even with the same stiffness.",
          },
          {
            label: "stiffness",
            text: "How hard the spring pulls back. High stiffness produces a snappy, responsive feel; low stiffness makes the element feel sluggish and slow to react.",
          },
          {
            label: "damping",
            text: "How quickly the spring loses energy. Low damping causes long oscillation; high damping means the element creeps slowly to rest without overshooting.",
          },
          {
            label: "underdamped",
            text: "When damping < 2 × √(stiffness × mass), the spring overshoots and bounces. The badge at the bottom of the panel tells you which regime the current settings are in.",
          },
        ]}
        code={`// Teleport ball to click position, then spring it back
ballX.set(clickX - centerX);
ballY.set(clickY - centerY);

animate(ballX, 0, {
  type: "spring",
  stiffness: 200,  // pull-back force
  damping: 20,     // energy loss per frame
  mass: 1,         // inertia — heavier = slower
});`}
      />
    </PageLayout>
  );
}
