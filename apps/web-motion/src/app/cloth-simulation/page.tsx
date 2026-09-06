"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const COLS = 26;
const ROWS = 18;

interface Node {
  x: number;
  y: number;
  ox: number;
  oy: number;
  pinned: boolean;
}

interface Constraint {
  i: number;
  j: number;
  len: number;
}

function initNodes(w: number, h: number): Node[] {
  const startX = w * 0.15;
  const endX   = w * 0.85;
  const startY = h * 0.08;
  const clothH = h * 0.7;
  const dx = (endX - startX) / (COLS - 1);
  const dy = clothH / (ROWS - 1);
  const nodes: Node[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x = startX + c * dx;
      const y = startY + r * dy;
      nodes.push({ x, y, ox: x, oy: y, pinned: r === 0 });
    }
  }
  return nodes;
}

function initConstraints(nodes: Node[]): Constraint[] {
  const cs: Constraint[] = [];
  function add(i: number, j: number) {
    const dx = nodes[j].x - nodes[i].x;
    const dy = nodes[j].y - nodes[i].y;
    cs.push({ i, j, len: Math.sqrt(dx * dx + dy * dy) });
  }
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const idx = r * COLS + c;
      if (c < COLS - 1) add(idx, idx + 1);          // horizontal
      if (r < ROWS - 1) add(idx, idx + COLS);        // vertical
      if (c < COLS - 1 && r < ROWS - 1) {
        add(idx, idx + COLS + 1);                    // diagonal ↘
        add(idx + 1, idx + COLS);                    // diagonal ↙
      }
    }
  }
  return cs;
}

export default function ClothSimulationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef  = useRef<Node[]>([]);
  const csRef     = useRef<Constraint[]>([]);
  const rafRef    = useRef<number>(0);
  const grabRef   = useRef<number>(-1);
  const mouseRef  = useRef({ x: 0, y: 0 });
  const resetRef  = useRef<() => void>(() => {});
  const timeRef   = useRef(0);

  const stateRef = useRef({
    gravity: 0.45,
    wind: 0,
    friction: 0.015,
    iterations: 6,
  });

  const [gravity, setGravity]       = useState(0.45);
  const [wind, setWind]             = useState(0);
  const [friction, setFriction]     = useState(0.015);
  const [iterations, setIterations] = useState(6);

  useEffect(() => { stateRef.current.gravity    = gravity;    }, [gravity]);
  useEffect(() => { stateRef.current.wind       = wind;       }, [wind]);
  useEffect(() => { stateRef.current.friction   = friction;   }, [friction]);
  useEffect(() => { stateRef.current.iterations = iterations; }, [iterations]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      const n = initNodes(canvas.width, canvas.height);
      nodesRef.current  = n;
      csRef.current     = initConstraints(n);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    resetRef.current = () => {
      const n = initNodes(canvas.width, canvas.height);
      nodesRef.current  = n;
      csRef.current     = initConstraints(n);
    };

    function tick() {
      const s     = stateRef.current;
      const nodes = nodesRef.current;
      const cs    = csRef.current;
      const w     = canvas.width;
      const h     = canvas.height;
      const damp  = 1 - s.friction;
      timeRef.current += 0.016;

      // Handle mouse grab
      const grabbed = grabRef.current;
      if (grabbed >= 0) {
        const n = nodes[grabbed];
        n.ox = n.x;
        n.oy = n.y;
        n.x  = mouseRef.current.x;
        n.y  = mouseRef.current.y;
      }

      // Verlet integrate
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].pinned || i === grabbed) continue;
        const n  = nodes[i];
        const vx = (n.x - n.ox) * damp;
        const vy = (n.y - n.oy) * damp;
        n.ox = n.x;
        n.oy = n.y;
        // Sinusoidal turbulence keyed to x-position + time creates horizontal ripples.
        // Amplitude scales with |wind| so the cloth is still when wind is 0.
        const turbulence = Math.sin(n.x * 0.012 + timeRef.current * 4) * Math.abs(s.wind) * 0.45;
        n.x += vx + (s.wind + turbulence) * 0.07;
        n.y += vy + s.gravity * 0.25;
      }

      // Constraint relaxation
      for (let iter = 0; iter < s.iterations; iter++) {
        for (const c of cs) {
          const a  = nodes[c.i];
          const b  = nodes[c.j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
          const diff = (dist - c.len) / dist * 0.5;
          const ox = dx * diff;
          const oy = dy * diff;
          if (!a.pinned && c.i !== grabbed) { a.x += ox; a.y += oy; }
          if (!b.pinned && c.j !== grabbed) { b.x -= ox; b.y -= oy; }
        }
      }

      // Boundary clamp
      for (const n of nodes) {
        if (n.pinned) continue;
        if (n.x < 0)  { n.x = 0;  n.ox = n.x + (n.x - n.ox) * 0.2; }
        if (n.x > w)  { n.x = w;  n.ox = n.x + (n.x - n.ox) * 0.2; }
        if (n.y > h)  { n.y = h;  n.oy = n.y + (n.y - n.oy) * 0.2; }
      }

      // Draw
      ctx.clearRect(0, 0, w, h);

      // Filled quads
      ctx.beginPath();
      for (let r = 0; r < ROWS - 1; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const a = nodes[r * COLS + c];
          const b = nodes[r * COLS + c + 1];
          const d = nodes[(r + 1) * COLS + c];
          const e = nodes[(r + 1) * COLS + c + 1];
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.lineTo(e.x, e.y); ctx.closePath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(e.x, e.y); ctx.lineTo(d.x, d.y); ctx.closePath();
        }
      }
      ctx.fillStyle = "rgba(109,106,255,0.45)";
      ctx.fill();

      // Grid lines
      ctx.beginPath();
      ctx.lineWidth = 0.6;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS - 1; c++) {
          const a = nodes[r * COLS + c];
          const b = nodes[r * COLS + c + 1];
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        }
      }
      for (let c = 0; c < COLS; c++) {
        for (let r = 0; r < ROWS - 1; r++) {
          const a = nodes[r * COLS + c];
          const b = nodes[(r + 1) * COLS + c];
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        }
      }
      ctx.strokeStyle = "rgba(160,157,255,0.55)";
      ctx.stroke();

      // Pin indicators
      for (const n of nodes) {
        if (!n.pinned) continue;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ff6b9d";
        ctx.fill();
      }

      // Grabbed node indicator
      if (grabbed >= 0) {
        const n = nodes[grabbed];
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, []);

  function getNearest(ex: number, ey: number): number {
    const rect = canvasRef.current!.getBoundingClientRect();
    const mx = ex - rect.left;
    const my = ey - rect.top;
    mouseRef.current = { x: mx, y: my };
    let best = -1, bestD = 30 * 30;
    nodesRef.current.forEach((n, i) => {
      if (n.pinned) return;
      const d = (n.x - mx) ** 2 + (n.y - my) ** 2;
      if (d < bestD) { bestD = d; best = i; }
    });
    return best;
  }

  function handleMouseDown(e: React.MouseEvent) {
    grabRef.current = getNearest(e.clientX, e.clientY);
  }

  function handleMouseMove(e: React.MouseEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handleMouseUp() {
    grabRef.current = -1;
  }

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    grabRef.current = getNearest(t.clientX, t.clientY);
  }

  function handleTouchMove(e: React.TouchEvent) {
    e.preventDefault();
    const rect = canvasRef.current!.getBoundingClientRect();
    const t = e.touches[0];
    mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
  }

  return (
    <PageLayout
      title="Cloth Simulation"
      description="A spring-mass grid integrated with Verlet physics. The top row is pinned. Click and drag to grab and pull the cloth. Crank the wind up to see ripples propagate across the fabric."
      library="Canvas"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)", minHeight: 420 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            style={{ minHeight: 420, background: "var(--background)", cursor: "crosshair", touchAction: "none" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="gravity"    value={gravity}    min={-0.5} max={1.5} step={0.05} onChange={setGravity} />
            <SliderControl label="wind"       value={wind}       min={-10}  max={10}  step={0.5}  onChange={setWind} />
            <SliderControl label="friction"   value={friction}   min={0}    max={0.1} step={0.005} onChange={setFriction} />
            <SliderControl label="stiffness"  value={iterations} min={1}    max={20}  step={1}    onChange={setIterations} />
          </ControlPanel>

          <div className="flex gap-2">
            <button
              onClick={() => resetRef.current()}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-mono transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              reset
            </button>
            <button
              onClick={() => { nodesRef.current.forEach(n => { n.pinned = false; }); }}
              className="flex-1 px-3 py-2 rounded-lg text-xs font-mono transition-colors"
              style={{ background: "var(--surface)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
            >
              release pins
            </button>
          </div>
        </div>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "Verlet integration",
            text: "Position-based physics: next position = 2×current − previous + acceleration×dt². Velocity is implicit in the delta between positions — no separate velocity variable needed.",
          },
          {
            label: "constraint relaxation",
            text: "Springs are satisfied iteratively: for each pair, compute the error and nudge both nodes toward their rest length. More iterations (stiffness slider) = stiffer cloth per frame.",
          },
          {
            label: "spring topology",
            text: "Structural springs (horizontal + vertical) resist stretching. Shear springs (both diagonals) prevent the grid from collapsing sideways when the cloth folds.",
          },
          {
            label: "pinned nodes",
            text: "Pinned nodes are skipped during integration and constraint correction — they never move. The cloth hangs from them. Release them to watch the cloth fall freely.",
          },
          {
            label: "wind turbulence",
            text: "A sinusoidal term keyed to each node's x-position and time adds spatially-varying force. Nodes across the cloth experience different wind magnitudes at any given frame, seeding ripple waves.",
          },
        ]}
        code={`// Verlet step with turbulent wind
const turbulence =
  Math.sin(n.x * 0.012 + time * 4)
  * Math.abs(wind) * 0.45;

n.x += vx + (wind + turbulence) * 0.07;

// Satisfy one spring constraint
const dx   = b.x - a.x;
const dist = Math.sqrt(dx*dx + dy*dy);
const diff = (dist - restLen) / dist * 0.5;
if (!a.pinned) { a.x += dx * diff; }
if (!b.pinned) { b.x -= dx * diff; }`}
      />
    </PageLayout>
  );
}
