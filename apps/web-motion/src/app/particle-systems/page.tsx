"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
}

export default function ParticleSystemsPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    count: 120,
    speed: 2,
    size: 3,
    gravity: 0.05,
    trail: true,
    mouseX: -1,
    mouseY: -1,
    attract: false,
  });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  const [count, setCount] = useState(120);
  const [speed, setSpeed] = useState(2);
  const [size, setSize] = useState(3);
  const [gravity, setGravity] = useState(0.05);
  const [trail, setTrail] = useState(true);
  const [attract, setAttract] = useState(false);

  // Sync controls to ref so the animation loop reads them without re-creating
  useEffect(() => { stateRef.current.count = count; }, [count]);
  useEffect(() => { stateRef.current.speed = speed; }, [speed]);
  useEffect(() => { stateRef.current.size = size; }, [size]);
  useEffect(() => { stateRef.current.gravity = gravity; }, [gravity]);
  useEffect(() => { stateRef.current.trail = trail; }, [trail]);
  useEffect(() => { stateRef.current.attract = attract; }, [attract]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width = canvas!.offsetWidth;
      canvas!.height = canvas!.offsetHeight;
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function spawnParticle(): Particle {
      const cx = canvas!.width / 2;
      const cy = canvas!.height / 2;
      const angle = Math.random() * Math.PI * 2;
      const s = stateRef.current.speed;
      return {
        x: cx + (Math.random() - 0.5) * 40,
        y: cy + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * s * (0.5 + Math.random()),
        vy: Math.sin(angle) * s * (0.5 + Math.random()) - s,
        life: 0,
        maxLife: 80 + Math.random() * 80,
        size: stateRef.current.size * (0.5 + Math.random()),
        hue: Math.random() * 60 + 220,
      };
    }

    particlesRef.current = Array.from({ length: stateRef.current.count }, spawnParticle);

    function tick() {
      const s = stateRef.current;
      const w = canvas!.width;
      const h = canvas!.height;

      if (s.trail) {
        ctx.fillStyle = "rgba(10,10,15,0.18)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      // maintain particle count
      while (particlesRef.current.length < s.count) {
        particlesRef.current.push(spawnParticle());
      }
      if (particlesRef.current.length > s.count) {
        particlesRef.current.length = s.count;
      }

      for (const p of particlesRef.current) {
        p.vy += s.gravity;

        if (s.attract && s.mouseX > 0) {
          const dx = s.mouseX - p.x;
          const dy = s.mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy) + 1;
          p.vx += (dx / dist) * 0.3;
          p.vy += (dy / dist) * 0.3;
          // cap speed
          const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (spd > s.speed * 3) {
            p.vx = (p.vx / spd) * s.speed * 3;
            p.vy = (p.vy / spd) * s.speed * 3;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const t = p.life / p.maxLife;
        const alpha = t < 0.1 ? t * 10 : t > 0.7 ? 1 - (t - 0.7) / 0.3 : 1;

        if (p.life > p.maxLife || p.y > h + 20) {
          Object.assign(p, spawnParticle());
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (1 - t * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${alpha})`;
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

  return (
    <PageLayout
      title="Particle Systems"
      description="A canvas-based particle simulation. Enable attract mode and move your mouse to pull particles toward the cursor. Trails leave a motion blur by painting a semi-transparent overlay each frame."
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
            onMouseLeave={() => { stateRef.current.mouseX = -1; stateRef.current.mouseY = -1; }}
          />
        </div>

        <ControlPanel>
          <SliderControl label="count" value={count} min={10} max={500} step={10} onChange={setCount} />
          <SliderControl label="speed" value={speed} min={0.5} max={8} step={0.5} onChange={setSpeed} />
          <SliderControl label="size" value={size} min={1} max={10} step={0.5} onChange={setSize} />
          <SliderControl label="gravity" value={gravity} min={-0.2} max={0.3} step={0.01} onChange={setGravity} />
          <SwitchControl label="trails" checked={trail} onChange={setTrail} />
          <SwitchControl label="attract to cursor" checked={attract} onChange={setAttract} />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "game loop",
            text: "requestAnimationFrame fires before each browser paint (~60 fps). The entire simulation — physics, state update, and draw — runs inside one tick function.",
          },
          {
            label: "state in refs",
            text: "Particle data lives in a mutable ref, not React state. Updating a ref never triggers a re-render, so the animation loop runs without React involvement.",
          },
          {
            label: "trail effect",
            text: "Instead of clearRect, painting a semi-transparent black fill each frame leaves a fading echo of past positions — a cheap motion-blur effect.",
          },
          {
            label: "gravity",
            text: "Each tick, vy += gravity accumulates downward acceleration. This compounds over time, making particles arc and fall like real objects.",
          },
        ]}
        code={`function tick() {
  // Semi-transparent fill = motion-blur trail
  ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
  ctx.fillRect(0, 0, w, h);

  for (const p of particles) {
    p.vy += gravity;   // accumulate downward force
    p.x  += p.vx;     // integrate velocity → position
    p.y  += p.vy;
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(tick);
}`}
      />
    </PageLayout>
  );
}
