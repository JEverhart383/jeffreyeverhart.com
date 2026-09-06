"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

// ─── Perlin noise ─────────────────────────────────────────────────────────────
function buildPerm(): Uint8Array {
  const p = Uint8Array.from({ length: 256 }, (_, i) => i);
  for (let i = 255; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const tmp = p[i]; p[i] = p[j]; p[j] = tmp;
  }
  const perm = new Uint8Array(512);
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  return perm;
}

const PERM = buildPerm();

function fade(t: number) { return t * t * t * (t * (t * 6 - 15) + 10); }
function lerp(t: number, a: number, b: number) { return a + t * (b - a); }
function grad(h: number, x: number, y: number) {
  const H = h & 3;
  const u = H < 2 ? x : y;
  const v = H < 2 ? y : x;
  return ((H & 1) ? -u : u) + ((H & 2) ? -v : v);
}

function noise2d(x: number, y: number): number {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  x -= Math.floor(x); y -= Math.floor(y);
  const u = fade(x); const v = fade(y);
  const a = PERM[X] + Y; const b = PERM[X + 1] + Y;
  return lerp(v,
    lerp(u, grad(PERM[a],     x,     y),
            grad(PERM[b],     x - 1, y)),
    lerp(u, grad(PERM[a + 1], x,     y - 1),
            grad(PERM[b + 1], x - 1, y - 1))
  );
}
// ─────────────────────────────────────────────────────────────────────────────

interface FlowParticle {
  x: number;
  y: number;
  life: number;
  maxLife: number;
  hue: number;
}

type MouseMode = "off" | "repel" | "attract" | "vortex";

export default function FlowFieldPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef  = useRef({
    detail: 6,
    speed: 1.5,
    count: 1500,
    evolution: 0.0003,
    showField: false,
    trails: true,
    mouseMode: "off" as MouseMode,
    mouseX: -1,
    mouseY: -1,
  });
  const particlesRef = useRef<FlowParticle[]>([]);
  const rafRef = useRef<number>(0);
  const timeRef = useRef(0);

  const [detail, setDetail]       = useState(6);
  const [speed, setSpeed]         = useState(1.5);
  const [count, setCount]         = useState(1500);
  const [evolution, setEvolution] = useState(0.0003);
  const [showField, setShowField] = useState(false);
  const [trails, setTrails]       = useState(true);
  const [mouseMode, setMouseMode] = useState<MouseMode>("off");

  useEffect(() => { stateRef.current.detail    = detail;    }, [detail]);
  useEffect(() => { stateRef.current.speed     = speed;     }, [speed]);
  useEffect(() => { stateRef.current.count     = count;     }, [count]);
  useEffect(() => { stateRef.current.evolution = evolution; }, [evolution]);
  useEffect(() => { stateRef.current.showField = showField; }, [showField]);
  useEffect(() => { stateRef.current.trails    = trails;    }, [trails]);
  useEffect(() => { stateRef.current.mouseMode = mouseMode; }, [mouseMode]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function spawn(w: number, h: number): FlowParticle {
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        life: 0,
        maxLife: 100 + Math.random() * 200,
        hue: Math.random() * 360,
      };
    }

    particlesRef.current = Array.from(
      { length: stateRef.current.count },
      () => spawn(canvas.width, canvas.height)
    );

    function tick() {
      const s = stateRef.current;
      const w = canvas.width;
      const h = canvas.height;
      const scale = s.detail * 0.0005;
      timeRef.current += s.evolution;

      if (s.trails) {
        ctx.fillStyle = "rgba(10,10,15,0.08)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      if (s.showField) {
        const cols = 32, rows = 22;
        const cw = w / cols, ch = h / rows;
        ctx.lineWidth = 1;
        for (let c = 0; c < cols; c++) {
          for (let r = 0; r < rows; r++) {
            const px = c * cw + cw * 0.5;
            const py = r * ch + ch * 0.5;
            const angle = noise2d(px * scale, py * scale + timeRef.current) * Math.PI * 4;
            const len = Math.min(cw, ch) * 0.45;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(px + Math.cos(angle) * len, py + Math.sin(angle) * len);
            ctx.strokeStyle = "rgba(100,100,160,0.35)";
            ctx.stroke();
          }
        }
      }

      // Maintain particle count
      while (particlesRef.current.length < s.count) {
        particlesRef.current.push(spawn(w, h));
      }
      if (particlesRef.current.length > s.count) {
        particlesRef.current.length = s.count;
      }

      const REPEL_R = 120;

      for (const p of particlesRef.current) {
        const angle = noise2d(p.x * scale, p.y * scale + timeRef.current) * Math.PI * 4;
        p.x += Math.cos(angle) * s.speed;
        p.y += Math.sin(angle) * s.speed;

        // Mouse interaction
        if (s.mouseMode !== "off" && s.mouseX >= 0) {
          const dx   = p.x - s.mouseX;
          const dy   = p.y - s.mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;
          if (dist < REPEL_R) {
            const force = (1 - dist / REPEL_R) * s.speed * 1.8;
            if (s.mouseMode === "repel") {
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            } else if (s.mouseMode === "attract") {
              p.x -= (dx / dist) * force * 0.6;
              p.y -= (dy / dist) * force * 0.6;
            } else if (s.mouseMode === "vortex") {
              // Tangent to the circle around cursor → swirling
              p.x += (-dy / dist) * force;
              p.y += ( dx / dist) * force;
            }
          }
        }

        p.life++;

        const t = p.life / p.maxLife;
        const alpha = t < 0.1 ? t * 10 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

        if (p.life > p.maxLife || p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) {
          Object.assign(p, spawn(w, h));
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha * 0.7})`;
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

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect();
    stateRef.current.mouseX = e.clientX - rect.left;
    stateRef.current.mouseY = e.clientY - rect.top;
  }

  function handleMouseLeave() {
    stateRef.current.mouseX = -1;
    stateRef.current.mouseY = -1;
  }

  const MOUSE_MODES: MouseMode[] = ["off", "repel", "attract", "vortex"];

  return (
    <PageLayout
      title="Flow Field"
      description="Particles follow directions sampled from a Perlin noise field. The field evolves over time — increase evolution speed to watch it shift. Toggle the vector grid to see the underlying field."
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
            style={{ minHeight: 420, background: "var(--background)" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          />
        </div>

        <ControlPanel>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>mouse mode</span>
            <div className="flex flex-wrap gap-1.5">
              {MOUSE_MODES.map((m) => (
                <button
                  key={m}
                  onClick={() => setMouseMode(m)}
                  className="px-2 py-1 rounded text-xs font-mono transition-colors"
                  style={{
                    background: mouseMode === m ? "rgba(109,106,255,0.2)" : "var(--surface-2)",
                    color: mouseMode === m ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${mouseMode === m ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <SliderControl label="detail"    value={detail}    min={1}      max={20}     step={1}      onChange={setDetail} />
          <SliderControl label="speed"     value={speed}     min={0.1}    max={5}      step={0.1}    onChange={setSpeed} />
          <SliderControl label="particles" value={count}     min={100}    max={5000}   step={100}    onChange={setCount} />
          <SliderControl label="evolution" value={evolution} min={0}      max={0.002}  step={0.0001} onChange={setEvolution} />
          <SwitchControl label="show field"  checked={showField} onChange={setShowField} />
          <SwitchControl label="trails"      checked={trails}    onChange={setTrails} />
        </ControlPanel>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "Perlin noise",
            text: "Smooth, continuous random function where nearby inputs give similar outputs. Generated by interpolating between gradient vectors at integer lattice points — no harsh jumps like Math.random().",
          },
          {
            label: "noise → angle",
            text: "The scalar noise output (−1 to 1) is multiplied by 4π to map onto angles. Larger multipliers create tighter swirls; smaller values produce wide, sweeping curves.",
          },
          {
            label: "time evolution",
            text: "Adding a slowly-incrementing offset to the noise Y-coordinate creates smooth temporal change — equivalent to moving through a 3D noise volume one horizontal slice at a time.",
          },
          {
            label: "trails via alpha fill",
            text: "A semi-transparent fill each frame leaves fading echoes of past positions. Lower alpha = longer memory. clearRect erases everything; fillStyle rgba(…, 0.08) fades it gradually.",
          },
          {
            label: "mouse forces",
            text: "Repel pushes particles radially outward from the cursor. Attract reverses that. Vortex applies the tangent vector — perpendicular to the radial direction — creating a local swirl that fights the noise field.",
          },
        ]}
        code={`// Each frame, move particle along the noise angle
const scale = detail * 0.0005;
time += evolution;

const angle = perlinNoise(
  p.x * scale,
  p.y * scale + time  // time offset drives evolution
) * Math.PI * 4;

p.x += Math.cos(angle) * speed;
p.y += Math.sin(angle) * speed;

// Trail: fade previous frame instead of clearing
ctx.fillStyle = "rgba(10,10,15, 0.08)";
ctx.fillRect(0, 0, w, h);`}
      />
    </PageLayout>
  );
}
