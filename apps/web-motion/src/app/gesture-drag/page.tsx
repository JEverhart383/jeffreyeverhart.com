"use client";

import { useState, useRef } from "react";
import { motion, animate, useSpring, useMotionValue } from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const CARDS = [
  { id: 1, label: "A", color: "#6d6aff" },
  { id: 2, label: "B", color: "#ff6b9d" },
  { id: 3, label: "C", color: "#38bdf8" },
  { id: 4, label: "D", color: "#86efac" },
];

export default function GestureDragPage() {
  const [elastic, setElastic] = useState(0.3);
  const [snapBack, setSnapBack] = useState(true);
  const [showVelocity, setShowVelocity] = useState(true);
  const constraintRef = useRef<HTMLDivElement>(null);

  return (
    <PageLayout
      title="Gesture & Drag"
      description="Drag the cards around. Elastic controls how much the cards can be pulled past their constraints. With snap-back off, cards settle where you drop them."
      library="Framer Motion"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          ref={constraintRef}
          className="rounded-xl relative overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          {CARDS.map((card, i) => (
            <DragCard
              key={card.id}
              card={card}
              initialX={80 + i * 60}
              initialY={160 + (i % 2) * 80}
              constraintRef={constraintRef}
              dragElastic={elastic}
              snapBack={snapBack}
              showVelocity={showVelocity}
            />
          ))}
          <span
            className="absolute bottom-4 left-0 right-0 text-center text-xs font-mono pointer-events-none"
            style={{ color: "var(--text-muted)" }}
          >
            drag the cards
          </span>
        </div>

        <ControlPanel>
          <SliderControl label="drag elastic" value={elastic} min={0} max={1} step={0.05} onChange={setElastic} />
          <SwitchControl label="snap back" checked={snapBack} onChange={setSnapBack} />
          <SwitchControl label="show velocity" checked={showVelocity} onChange={setShowVelocity} />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "drag prop",
            text: "Framer Motion tracks pointer events, calculates velocity, and updates a MotionValue each frame — no React re-renders required during the drag.",
          },
          {
            label: "dragConstraints",
            text: "A ref to a container element. The draggable can't be moved outside its bounding box. When released, elastic controls whether it snaps back.",
          },
          {
            label: "dragElastic",
            text: "How far past the constraints the element can be pulled — 0 is a rigid wall, 1 is a fully elastic rubber band that stretches freely.",
          },
          {
            label: "dragMomentum",
            text: "When true, the element continues moving after release and decelerates naturally based on its velocity at the moment of release.",
          },
        ]}
        code={`<motion.div
  drag
  dragConstraints={containerRef}  // can't leave this box
  dragElastic={0.3}               // 30% stretch past the edge
  dragMomentum={true}             // coasts after release
  whileDrag={{ scale: 1.08 }}     // visual feedback while held
/>`}
      />
    </PageLayout>
  );
}

function DragCard({
  card,
  initialX,
  initialY,
  constraintRef,
  dragElastic,
  snapBack,
  showVelocity,
}: {
  card: { id: number; label: string; color: string };
  initialX: number;
  initialY: number;
  constraintRef: React.RefObject<HTMLDivElement | null>;
  dragElastic: number;
  snapBack: boolean;
  showVelocity: boolean;
}) {
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });
  const [tilt, setTilt] = useState(0);
  const x = useMotionValue(initialX);
  const y = useMotionValue(initialY);
  const rotateZ = useSpring(tilt, { stiffness: 300, damping: 30 });

  return (
    <motion.div
      drag
      dragConstraints={constraintRef}
      dragElastic={dragElastic}
      dragMomentum={!snapBack}
      style={{
        x, y, rotateZ,
        position: "absolute", top: 0, left: 0,
        background: `${card.color}22`,
        border: `1.5px solid ${card.color}`,
      }}
      whileDrag={{ scale: 1.08, zIndex: 10 }}
      onDrag={(_, info) => {
        setTilt(info.velocity.x * 0.02);
        if (showVelocity) setVelocity({ x: Math.round(info.velocity.x), y: Math.round(info.velocity.y) });
      }}
      onDragEnd={() => {
        setVelocity({ x: 0, y: 0 });
        setTilt(0);
        if (snapBack) {
          animate(x, initialX, { type: "spring", stiffness: 300, damping: 30 });
          animate(y, initialY, { type: "spring", stiffness: 300, damping: 30 });
        }
      }}
      className="w-20 h-24 rounded-xl flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing select-none"
    >
      <span className="text-lg font-bold" style={{ color: card.color }}>{card.label}</span>
      {showVelocity && (velocity.x !== 0 || velocity.y !== 0) && (
        <span className="text-[9px] font-mono tabular-nums text-center leading-tight" style={{ color: card.color }}>
          {velocity.x},{velocity.y}
        </span>
      )}
    </motion.div>
  );
}
