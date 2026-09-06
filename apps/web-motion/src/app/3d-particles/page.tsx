"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";
import { THEMES } from "./ParticleCloud";
import type { ColorTheme } from "./ParticleCloud";

const ParticleCloud = dynamic(() => import("./ParticleCloud"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full flex items-center justify-center text-xs font-mono"
      style={{ height: "100%", color: "var(--text-muted)" }}
    >
      loading…
    </div>
  ),
});

const THEME_NAMES = Object.keys(THEMES) as ColorTheme[];

export default function ThreeDParticlesPage() {
  const [count, setCount]         = useState(4000);
  const [pointSize, setPointSize] = useState(0.035);
  const [speed, setSpeed]         = useState(1);
  const [theme, setTheme]         = useState<ColorTheme>("nebula");

  return (
    <PageLayout
      title="3D Particle Cloud"
      description="Thousands of points rendered with THREE.Points — a single draw call regardless of count. Vertex colors gradient from the cloud center outward. Drag to orbit, scroll to zoom."
      library="Three.js"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420, height: 480 }}
        >
          <ParticleCloud count={count} pointSize={pointSize} speed={speed} theme={theme} />
        </div>

        <ControlPanel>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>color theme</span>
            <div className="flex flex-wrap gap-1.5">
              {THEME_NAMES.map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className="px-2 py-1 rounded text-xs font-mono transition-colors"
                  style={{
                    background: theme === t ? "rgba(109,106,255,0.2)" : "var(--surface-2)",
                    color: theme === t ? "var(--accent)" : "var(--text-muted)",
                    border: `1px solid ${theme === t ? "var(--accent)" : "var(--border)"}`,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <SliderControl label="count"      value={count}     min={500}  max={12000} step={500}   onChange={setCount} />
          <SliderControl label="point size" value={pointSize} min={0.01} max={0.12}  step={0.005} onChange={setPointSize} />
          <SliderControl label="speed"      value={speed}     min={0}    max={5}     step={0.1}   onChange={setSpeed} />
        </ControlPanel>
      </div>

      <ConceptSection
        concepts={[
          {
            label: "THREE.Points",
            text: "Renders a BufferGeometry as instanced quads, one per vertex. Ten thousand particles cost roughly the same as one draw call — unlike individual Mesh objects which each need their own.",
          },
          {
            label: "BufferGeometry attributes",
            text: "Position and color live in typed Float32Arrays uploaded to the GPU. Modifying them from JS requires setting needsUpdate = true, which re-uploads the buffer.",
          },
          {
            label: "vertexColors",
            text: "Setting vertexColors: true on the material tells Three.js to read per-vertex color from the geometry's 'color' attribute instead of using a single uniform material color.",
          },
          {
            label: "sizeAttenuation",
            text: "When true, point size shrinks with distance from the camera (perspective). When false, all points are the same screen-space pixel size regardless of depth.",
          },
        ]}
        code={`const positions = new Float32Array(count * 3);
const colors    = new Float32Array(count * 3);
// fill positions & per-vertex colors …

const geo = new THREE.BufferGeometry();
geo.setAttribute("position",
  new THREE.BufferAttribute(positions, 3));
geo.setAttribute("color",
  new THREE.BufferAttribute(colors, 3));

const mat = new THREE.PointsMaterial({
  size: 0.035,
  vertexColors: true,   // read 'color' attribute
  sizeAttenuation: true,
});

scene.add(new THREE.Points(geo, mat));`}
      />
    </PageLayout>
  );
}
