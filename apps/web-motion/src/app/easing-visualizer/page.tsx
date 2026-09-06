"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const PRESETS: Record<string, [number, number, number, number]> = {
  linear: [0, 0, 1, 1],
  ease: [0.25, 0.1, 0.25, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-out": [0, 0, 0.58, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "ease-in-back": [0.36, 0, 0.66, -0.56],
  "ease-out-back": [0.34, 1.56, 0.64, 1],
  "ease-in-out-back": [0.68, -0.6, 0.32, 1.6],
};

// Parametric cubic bezier (CSS convention: P0=0,0  P3=1,1)
function bx(t: number, x1: number, x2: number) {
  return 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t;
}
function by(t: number, y1: number, y2: number) {
  return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
}
function dbx(t: number, x1: number, x2: number) {
  return 3 * (1 - t) * (1 - t) * x1 + 6 * (1 - t) * t * (x2 - x1) + 3 * t * t * (1 - x2);
}

function solveY(x: number, x1: number, y1: number, x2: number, y2: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  let t = x;
  for (let i = 0; i < 10; i++) {
    const dx = bx(t, x1, x2) - x;
    const d = dbx(t, x1, x2);
    if (Math.abs(d) < 1e-8) break;
    t = Math.max(0, Math.min(1, t - dx / d));
  }
  return by(t, y1, y2);
}

export default function EasingVisualizerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRafRef = useRef<number>(0);
  const [x1, setX1] = useState(0.25);
  const [y1, setY1] = useState(0.1);
  const [x2, setX2] = useState(0.25);
  const [y2, setY2] = useState(1);
  const [preset, setPreset] = useState("ease");
  const [duration, setDuration] = useState(1200);
  const [playing, setPlaying] = useState(false);

  function applyPreset(name: string) {
    const [px1, py1, px2, py2] = PRESETS[name];
    setX1(px1); setY1(py1); setX2(px2); setY2(py2);
    setPreset(name);
  }

  const drawCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const PAD = 40;
    const PW = W - PAD * 2;
    const PH = H - PAD * 2;

    ctx.clearRect(0, 0, W, H);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.06)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const gx = PAD + (i / 4) * PW;
      const gy = PAD + (i / 4) * PH;
      ctx.beginPath(); ctx.moveTo(gx, PAD); ctx.lineTo(gx, PAD + PH); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(PAD, gy); ctx.lineTo(PAD + PW, gy); ctx.stroke();
    }

    // Axis labels
    ctx.fillStyle = "rgba(255,255,255,0.25)";
    ctx.font = "10px monospace";
    ctx.fillText("time →", PAD + PW - 30, PAD + PH + 22);
    ctx.save(); ctx.translate(PAD - 22, PAD + 30); ctx.rotate(-Math.PI / 2);
    ctx.fillText("value →", 0, 0); ctx.restore();

    // Control point handles
    const cp1x = PAD + x1 * PW;
    const cp1y = PAD + (1 - y1) * PH;
    const cp2x = PAD + x2 * PW;
    const cp2y = PAD + (1 - y2) * PH;

    ctx.strokeStyle = "rgba(109,106,255,0.4)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(PAD, PAD + PH); ctx.lineTo(cp1x, cp1y); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(PAD + PW, PAD); ctx.lineTo(cp2x, cp2y); ctx.stroke();
    ctx.setLineDash([]);

    // Control point dots
    [{ cx: cp1x, cy: cp1y }, { cx: cp2x, cy: cp2y }].forEach(({ cx, cy }) => {
      ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI * 2);
      ctx.fillStyle = "var(--accent, #6d6aff)"; ctx.fill();
      ctx.strokeStyle = "white"; ctx.lineWidth = 1.5; ctx.stroke();
    });

    // Curve
    ctx.beginPath();
    ctx.moveTo(PAD, PAD + PH);
    for (let i = 0; i <= 120; i++) {
      const t = i / 120;
      const cx = PAD + bx(t, x1, x2) * PW;
      const cy = PAD + (1 - by(t, y1, y2)) * PH;
      ctx.lineTo(cx, cy);
    }
    ctx.strokeStyle = "#6d6aff";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // End points
    [[PAD, PAD + PH], [PAD + PW, PAD]].forEach(([ex, ey]) => {
      ctx.beginPath(); ctx.arc(ex, ey, 4, 0, Math.PI * 2);
      ctx.fillStyle = "white"; ctx.fill();
    });
  }, [x1, y1, x2, y2]);

  useEffect(() => { drawCurve(); }, [drawCurve]);

  function playAnimation() {
    if (playing) return;
    setPlaying(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;
    const PAD = 40;
    const PW = W - PAD * 2;
    const PH = H - PAD * 2;

    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = solveY(progress, x1, y1, x2, y2);

      drawCurve();

      // Scrub line
      const scrubX = PAD + progress * PW;
      ctx.strokeStyle = "rgba(255,107,157,0.6)";
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
      ctx.beginPath(); ctx.moveTo(scrubX, PAD); ctx.lineTo(scrubX, PAD + PH); ctx.stroke();
      ctx.setLineDash([]);

      // Eased dot on curve
      const dotX = PAD + bx(progress, x1, x2) * PW;
      const dotY = PAD + (1 - by(progress, y1, y2)) * PH;
      ctx.beginPath(); ctx.arc(dotX, dotY, 7, 0, Math.PI * 2);
      ctx.fillStyle = "#ff6b9d"; ctx.fill();

      // Side bar showing eased value
      const barX = W - 16;
      const barY = PAD + (1 - eased) * PH;
      ctx.beginPath(); ctx.arc(barX, barY, 5, 0, Math.PI * 2);
      ctx.fillStyle = "#ff6b9d"; ctx.fill();

      if (progress < 1) {
        animRafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    }
    animRafRef.current = requestAnimationFrame(tick);
  }

  useEffect(() => () => cancelAnimationFrame(animRafRef.current), []);

  return (
    <PageLayout
      title="Easing Visualizer"
      description="A cubic-bezier curve defines how CSS animations interpolate between values. The x-axis is time; the y-axis is the animated value. Adjust the control points or pick a preset, then hit play."
      library="Canvas"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col gap-4">
          <div
            className="rounded-xl overflow-hidden"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <canvas ref={canvasRef} width={560} height={400} className="w-full" style={{ display: "block" }} />
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2">
            {Object.keys(PRESETS).map((name) => (
              <button
                key={name}
                onClick={() => applyPreset(name)}
                className="px-3 py-1 rounded-full text-xs font-mono transition-colors"
                style={{
                  background: preset === name ? "var(--accent)" : "var(--surface)",
                  color: preset === name ? "white" : "var(--text-muted)",
                  border: `1px solid ${preset === name ? "var(--accent)" : "var(--border)"}`,
                }}
              >
                {name}
              </button>
            ))}
          </div>

          <button
            onClick={playAnimation}
            disabled={playing}
            className="self-start px-5 py-2 rounded-lg text-sm font-mono font-semibold transition-opacity"
            style={{ background: playing ? "var(--border)" : "#ff6b9d", color: "white", opacity: playing ? 0.5 : 1 }}
          >
            {playing ? "playing…" : "▶ play"}
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="x1" value={x1} min={0} max={1} step={0.01} onChange={(v) => { setX1(v); setPreset("custom"); }} />
            <SliderControl label="y1" value={y1} min={-2} max={2} step={0.01} onChange={(v) => { setY1(v); setPreset("custom"); }} />
            <SliderControl label="x2" value={x2} min={0} max={1} step={0.01} onChange={(v) => { setX2(v); setPreset("custom"); }} />
            <SliderControl label="y2" value={y2} min={-2} max={2} step={0.01} onChange={(v) => { setY2(v); setPreset("custom"); }} />
            <SliderControl label="duration" value={duration} min={200} max={3000} step={100} unit="ms" onChange={setDuration} />
          </ControlPanel>

          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed break-all" style={{ color: "var(--text-muted)" }}>
              {`cubic-bezier(`}<br />
              {`  ${x1}, ${y1},`}<br />
              {`  ${x2}, ${y2}`}<br />
              {`)`}
            </p>
          </div>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "cubic-bezier(x1, y1, x2, y2)",
            text: "A cubic Bézier with fixed endpoints at (0,0) and (1,1). P1 and P2 are the \"handles\" that bend the curve between those anchors.",
          },
          {
            label: "X = time, Y = value",
            text: "The X-axis is animation progress from 0→1; the Y-axis is the interpolated output value. Moving Y outside [0, 1] creates overshoot (Y > 1) or undershoot (Y < 0).",
          },
          {
            label: "solving for Y at time X",
            text: "The curve is parametric — you get (x, y) at parameter t, but the browser needs y at a specific x. Newton–Raphson iteration finds the t that gives the desired x.",
          },
          {
            label: "X constraints",
            text: "x1 and x2 must stay in [0, 1] to keep time monotonically increasing. Y values have no constraint — negative Y and Y > 1 are both valid and produce bounce/elastic effects.",
          },
        ]}
        code={`cubic-bezier(x1, y1, x2, y2)
  x1, x2 ∈ [0, 1]  time handles (must be monotonic)
  y1, y2 ∈ any     value handles (can overshoot)

ease-out-back:
  cubic-bezier(0.34, 1.56, 0.64, 1)
                         ↑ y1 > 1 → overshoots the target

Newton–Raphson (solve for t given x, ~10 iterations):
  t -= (Bx(t) - x) / Bx_prime(t)
  return By(t)`}
      />
    </PageLayout>
  );
}
