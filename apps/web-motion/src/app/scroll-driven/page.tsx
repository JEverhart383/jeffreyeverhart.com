"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import PageLayout from "@/components/PageLayout";
import { ConceptSection } from "@/components/ConceptSection";

const CONTAINER_H = 500;
const TRIGGER_RANGE = 220; // px of scroll over which each animation plays

const ITEMS = [
  { label: "01", title: "Fade & Rise",   description: "Opacity and Y translate tied to scroll progress.", color: "#6d6aff" },
  { label: "02", title: "Scale In",      description: "Scale from 0.85→1 as the card enters the viewport.", color: "#ff6b9d" },
  { label: "03", title: "Rotate",        description: "A subtle Z rotation unwinds from ±6° to 0° on scroll.", color: "#38bdf8" },
  { label: "04", title: "Slide Left",    description: "Translates in from -40px on the x-axis.", color: "#86efac" },
  { label: "05", title: "Blur Clear",    description: "A blur filter resolves from 10px to 0 as it scrolls in.", color: "#fbbf24" },
  { label: "06", title: "Clip Reveal",   description: "clip-path wipes right-to-left as the card enters.", color: "#fb923c" },
];

type Effect = "fade-rise" | "scale" | "rotate" | "slide" | "blur" | "clip";
const EFFECTS: Effect[] = ["fade-rise", "scale", "rotate", "slide", "blur", "clip"];

function ScrollCard({
  item, effect, i, scrollTopMV,
}: {
  item: typeof ITEMS[number];
  effect: Effect;
  i: number;
  scrollTopMV: MotionValue<number>;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const offsetTopRef = useRef(0);

  useEffect(() => {
    // offsetTop is relative to the scroll container (the flex parent)
    offsetTopRef.current = cardRef.current?.offsetTop ?? 0;
  }, []);

  // Map scrollTop → 0..1 progress for this card.
  // Animation window: card top crosses container bottom → TRIGGER_RANGE px later.
  const rawProgress = useTransform(scrollTopMV, (st) => {
    const start = offsetTopRef.current - CONTAINER_H;
    return Math.max(0, Math.min(1, (st - start) / TRIGGER_RANGE));
  });

  const p = useSpring(rawProgress, { stiffness: 80, damping: 20 });

  const opacity   = useTransform(p, [0, 1], [0, 1]);
  const y         = useTransform(p, [0, 1], [40, 0]);
  const scale     = useTransform(p, [0, 1], [0.85, 1]);
  const rotate    = useTransform(p, [0, 1], [i % 2 === 0 ? -6 : 6, 0]);
  const x         = useTransform(p, [0, 1], [-40, 0]);
  const blurN     = useTransform(p, [0, 1], [10, 0]);
  const filter    = useTransform(blurN, (b) => `blur(${b.toFixed(1)}px)`);
  const clipPct   = useTransform(p, [0, 1], [0, 100]);
  const clipPath  = useTransform(clipPct, (v) => `polygon(0 0, ${v.toFixed(1)}% 0, ${v.toFixed(1)}% 100%, 0 100%)`);

  const styleMap: Record<Effect, MotionStyle> = {
    "fade-rise": { opacity, y },
    scale:       { opacity, scale },
    rotate:      { opacity, rotate },
    slide:       { opacity, x },
    blur:        { opacity, filter },
    clip:        { clipPath },
  };

  return (
    <motion.div
      ref={cardRef}
      style={{ minHeight: 260, ...styleMap[effect] }}
      className="rounded-xl p-8 flex gap-5 items-center shrink-0"
    >
      <div
        className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-mono font-bold shrink-0"
        style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}` }}
      >
        {item.label}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{item.title}</h3>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>{item.description}</p>
      </div>
    </motion.div>
  );
}

export default function ScrollDrivenPage() {
  const containerRef   = useRef<HTMLDivElement>(null);
  const scrollTopMV    = useMotionValue(0);
  const totalProgressMV = useMotionValue(0);
  const scaleX         = useSpring(totalProgressMV, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      scrollTopMV.set(el.scrollTop);
      totalProgressMV.set(max > 0 ? el.scrollTop / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [scrollTopMV, totalProgressMV]);

  return (
    <PageLayout
      title="Scroll-Driven"
      description="A MotionValue tracks the container's scrollTop. Each card reads its own offsetTop after mount and uses useTransform to map scroll position to animation progress."
      library="Framer Motion"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="rounded-xl overflow-hidden relative" style={{ border: "1px solid var(--border)" }}>
          <div className="sticky top-0 z-10 h-1 w-full" style={{ background: "var(--border)" }}>
            <motion.div className="h-full origin-left" style={{ scaleX, background: "var(--accent)" }} />
          </div>

          <div
            ref={containerRef}
            className="overflow-y-scroll flex flex-col gap-3"
            style={{ height: CONTAINER_H, background: "var(--surface)" }}
          >
            {/* Spacer = container height so first card starts just below the fold */}
            <div
              className="flex items-center justify-center shrink-0 text-xs font-mono"
              style={{ height: CONTAINER_H, color: "var(--text-muted)" }}
            >
              ↓ scroll down
            </div>

            {ITEMS.map((item, i) => (
              <ScrollCard
                key={item.label}
                item={item}
                effect={EFFECTS[i]}
                i={i}
                scrollTopMV={scrollTopMV}
              />
            ))}
            <div className="shrink-0" style={{ height: 40 }} />
          </div>
        </div>

        <div className="rounded-xl p-5 self-start" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
          <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>how it works</p>
          <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
            A <span style={{ color: "var(--text)" }}>MotionValue</span> tracks <span style={{ color: "var(--accent)" }}>scrollTop</span> via a plain scroll listener — no re-renders.<br /><br />
            Each card reads its <span style={{ color: "var(--text)" }}>offsetTop</span> on mount, then <span style={{ color: "var(--accent)" }}>useTransform</span> maps:<br /><br />
            <span style={{ color: "#86efac" }}>scrollTop = offsetTop − 500</span><br />→ progress 0 (card just entering)<br /><br />
            <span style={{ color: "#fbbf24" }}>scrollTop = offsetTop − 280</span><br />→ progress 1 (animation done)
          </p>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "MotionValue",
            text: "A reactive container that updates without triggering React re-renders. Framer Motion reads it synchronously to style elements directly each frame.",
          },
          {
            label: "useTransform",
            text: "Maps one MotionValue range to another — like a scale function for reactive values. scrollTop [start, end] → progress [0, 1] → CSS property value.",
          },
          {
            label: "per-element scroll windows",
            text: "Each card reads its own offsetTop on mount and defines a unique [start, end] scroll range. Cards higher in the list animate at different scroll positions.",
          },
          {
            label: "useSpring wrapping",
            text: "Wrapping a derived value in useSpring smooths sudden scroll jumps into organic deceleration, so fast scrolling doesn't cause jarring animation snaps.",
          },
        ]}
        code={`const scrollMV = useMotionValue(0);
container.addEventListener("scroll", () =>
  scrollMV.set(container.scrollTop)
);

// Per card — unique animation window based on its offsetTop
const progress = useTransform(
  scrollMV,
  [cardTop - containerH, cardTop - containerH + 220],
  [0, 1],
  { clamp: true }
);
const opacity = useTransform(progress, [0, 1], [0, 1]);
const y       = useTransform(progress, [0, 1], [40, 0]);`}
      />
    </PageLayout>
  );
}
