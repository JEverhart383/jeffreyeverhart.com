"use client";

import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

export default function PerspectivePage() {
  const [gridPerspective, setGridPerspective] = useState(600);
  const [originX, setOriginX] = useState(50);
  const [originY, setOriginY] = useState(50);

  const [stackPerspective, setStackPerspective] = useState(2000);

  return (
    <PageLayout
      title="Perspective"
      description="Two focused demos: move the vanishing point with perspective-origin, then see how camera distance changes perceived depth."
      library="CSS"
    >
      {/* Demo 1: Grid floor — perspective-origin */}
      <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        perspective-origin — vanishing point
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-12">
        <div
          className="rounded-xl overflow-hidden flex items-end justify-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            minHeight: 380,
            perspective: `${gridPerspective}px`,
            perspectiveOrigin: `${originX}% ${originY}%`,
          }}
        >
          <div
            style={{
              width: 700,
              height: 350,
              flexShrink: 0,
              backgroundImage: `linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              transform: "rotateX(75deg)",
              transformOrigin: "bottom center",
            }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="perspective" value={gridPerspective} min={100} max={1600} step={10} unit="px" onChange={setGridPerspective} />
            <SliderControl label="origin-x" value={originX} min={0} max={100} unit="%" onChange={setOriginX} />
            <SliderControl label="origin-y" value={originY} min={0} max={100} unit="%" onChange={setOriginY} />
          </ControlPanel>
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {`.scene {`}<br />
              {`  perspective: ${gridPerspective}px;`}<br />
              {`  perspective-origin:`}<br />
              {`    ${originX}% ${originY}%;`}<br />
              {`}`}
            </p>
          </div>
        </div>
      </div>

      {/* Demo 2: Depth stack — perspective distance */}
      <p className="text-xs font-mono font-semibold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
        perspective — camera distance
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6 mb-12">
        <div
          className="rounded-xl flex items-center justify-center"
          style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            minHeight: 380,
            perspective: `${stackPerspective}px`,
            perspectiveOrigin: "50% 50%",
          }}
        >
          <div style={{ position: "relative", width: 360, height: 290, transformStyle: "preserve-3d" }}>
            {/* baseX=(360-220-104)/2=18, baseY=(290-150-104)/2=18, step=52 */}
            <DepthCard z={-180} offsetX={122} offsetY={122} color="#38bdf8" />
            <DepthCard z={0}    offsetX={70}  offsetY={70}  color="#6d6aff" />
            <DepthCard z={180}  offsetX={18}  offsetY={18}  color="#fb923c" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <SliderControl label="perspective" value={stackPerspective} min={500} max={3000} step={10} unit="px" onChange={setStackPerspective} />
          </ControlPanel>
          <div
            className="rounded-xl p-4"
            style={{ background: "var(--surface)", border: "1px solid var(--border)" }}
          >
            <p className="text-xs font-mono leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {`.scene { perspective: ${stackPerspective}px; }`}<br /><br />
              {`.far  { transform: translateZ(-180px); }`}<br />
              {`.mid  { transform: translateZ(0px); }`}<br />
              {`.near { transform: translateZ(180px); }`}
            </p>
          </div>
        </div>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "perspective",
            text: "The virtual camera distance from the Z=0 plane. Lower values create dramatic distortion (wide-angle lens); higher values look nearly flat (telephoto). Drag the slider in demo 2 to extremes to feel the difference.",
          },
          {
            label: "perspective-origin",
            text: "The vanishing point — where parallel lines appear to converge. In demo 1, drag origin-x left and right to shift it. It is just a 2D coordinate on the scene container, not a 3D property.",
          },
          {
            label: "translateZ",
            text: "Moves an element toward or away from the viewer along the Z-axis. With perspective set, positive Z makes elements appear larger (closer) and negative Z makes them appear smaller (farther).",
          },
        ]}
        code={`.scene {
  perspective: 600px;
  perspective-origin: 50% 50%;
}

/* demo 1 — grid floor */
.grid { transform: rotateX(75deg); }

/* demo 2 — depth stack */
.far  { transform: translateZ(-180px); }
.mid  { transform: translateZ(0px); }
.near { transform: translateZ(180px); }`}
      />
    </PageLayout>
  );
}

function DepthCard({ z, offsetX, offsetY, color }: { z: number; offsetX: number; offsetY: number; color: string }) {
  return (
    <div
      className="absolute rounded-xl overflow-hidden"
      style={{
        width: 220,
        height: 150,
        top: offsetY,
        left: offsetX,
        background: "var(--surface)",
        border: `1.5px solid var(--border)`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
        transform: `translateZ(${z}px)`,
      }}
    >
      {/* accent strip */}
      <div style={{ height: 4, background: color }} />
      {/* skeleton content */}
      <div className="p-4 flex flex-col gap-2.5">
        <div className="rounded" style={{ height: 9, width: "55%", background: `${color}66` }} />
        <div className="rounded" style={{ height: 7, width: "80%", background: "var(--border)" }} />
        <div className="rounded" style={{ height: 7, width: "65%", background: "var(--border)" }} />
        <div className="rounded mt-1" style={{ height: 7, width: "40%", background: "var(--border)" }} />
      </div>
      {/* z annotation */}
      <span
        className="absolute bottom-2.5 right-3 text-xs font-mono"
        style={{ color }}
      >
        Z: {z > 0 ? "+" : ""}{z}px
      </span>
    </div>
  );
}
