"use client";

import { useState, useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const EASINGS: Record<string, string> = {
  linear: "linear",
  "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
  "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
  "ease-in-back": "cubic-bezier(0.36, 0, 0.66, -0.56)",
  "ease-out-back": "cubic-bezier(0.34, 1.56, 0.64, 1)",
  "ease-out-elastic": "cubic-bezier(0.68, -0.6, 0.32, 1.6)",
};

const KEYS = Object.keys(EASINGS);
const BALL = 28; // px diameter

export default function TranslationPage() {
  const [duration, setDuration] = useState(900);
  const [delay, setDelay] = useState(0);
  const [loop, setLoop] = useState(true);
  const [highlight, setHighlight] = useState("ease-out");

  const ballRefs = useRef<(HTMLDivElement | null)[]>(Array(KEYS.length).fill(null));
  const trackRef = useRef<HTMLDivElement>(null);
  const forwardRef = useRef(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stateRef = useRef({ duration, delay });

  useEffect(() => { stateRef.current.duration = duration; }, [duration]);
  useEffect(() => { stateRef.current.delay = delay; }, [delay]);

  function fire() {
    const track = trackRef.current;
    if (!track) return;
    // Compute actual travel distance from the track's rendered width
    const travel = track.offsetWidth - BALL;
    const target = forwardRef.current ? travel : 0;
    forwardRef.current = !forwardRef.current;
    const { duration, delay } = stateRef.current;

    KEYS.forEach((key, i) => {
      const el = ballRefs.current[i];
      if (!el) return;
      el.style.transition = `transform ${duration}ms ${EASINGS[key]} ${delay}ms`;
      el.style.transform = `translateX(${target}px)`;
    });
  }

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (loop) {
      fire();
      intervalRef.current = setInterval(fire, duration + delay + 300);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, delay, loop]);

  return (
    <PageLayout
      title="Translation"
      description="All 7 easing curves animate together so you can compare them directly. The difference between ease-in and ease-out becomes obvious when they race side by side — same duration, same distance, completely different feel."
      library="CSS"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl flex flex-col justify-center gap-2.5 p-8"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420 }}
        >
          {KEYS.map((key, i) => {
            const active = key === highlight;
            return (
              <div key={key} className="flex items-center gap-4">
                <button
                  onClick={() => setHighlight(key)}
                  className="text-xs font-mono transition-colors shrink-0"
                  style={{
                    width: 116,
                    textAlign: "right",
                    color: active ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  {key}
                </button>

                {/* Track — first one gets the ref for width measurement */}
                <div
                  ref={i === 0 ? trackRef : undefined}
                  className="relative flex-1 rounded-md overflow-visible"
                  style={{
                    height: 44,
                    background: "var(--surface-2)",
                    border: `1px solid ${active ? "rgba(109,106,255,0.4)" : "var(--border)"}`,
                    overflow: "hidden",
                  }}
                >
                  <div
                    ref={(el) => { ballRefs.current[i] = el; }}
                    style={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: 0,
                      margin: "auto",
                      width: BALL,
                      height: BALL,
                      borderRadius: "50%",
                      background: active ? "var(--accent)" : "transparent",
                      border: `2px solid ${active ? "var(--accent)" : "rgba(109,106,255,0.35)"}`,
                      willChange: "transform",
                    }}
                  />
                </div>
              </div>
            );
          })}

          {!loop && (
            <button
              onClick={fire}
              className="self-start mt-3 px-4 py-2 rounded-lg text-sm font-mono font-semibold"
              style={{ background: "var(--accent)", color: "white" }}
            >
              play →
            </button>
          )}
        </div>

        <ControlPanel>
          <SliderControl label="duration" value={duration} min={200} max={3000} step={50} unit="ms" onChange={setDuration} />
          <SliderControl label="delay" value={delay} min={0} max={1000} step={50} unit="ms" onChange={setDelay} />
          <SwitchControl label="loop" checked={loop} onChange={setLoop} />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "CSS transition",
            text: "Smoothly interpolates a property when its value changes. Declaring the transition on the element and then assigning a new transform value is all it takes to animate.",
          },
          {
            label: "easing curves",
            text: "A cubic-bezier defines the velocity profile over time. ease-in starts slow and accelerates; ease-out-back overshoots the target before settling.",
          },
          {
            label: "same duration, different feel",
            text: "All 7 balls cover the same distance in the same time. The timing function alone determines whether motion feels snappy, sluggish, or elastic.",
          },
        ]}
        code={`// 1. Declare the easing on the element
el.style.transition = \`transform 900ms cubic-bezier(0.34, 1.56, 0.64, 1)\`;

// 2. Assigning a new value triggers the animation automatically
el.style.transform = \`translateX(\${target}px)\`;

// The easing curve controls velocity — not the duration`}
      />
    </PageLayout>
  );
}
