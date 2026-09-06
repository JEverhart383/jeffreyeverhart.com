"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, SliderControl, SwitchControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

const ThreeCanvas = dynamic(() => import("./ThreeCanvas"), {
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

import type { GeomType } from "./ThreeCanvas";
const GEOMS: GeomType[] = ["box", "sphere", "torus", "icosahedron", "torusKnot"];

export default function ThreeDScenePage() {
  const [geom, setGeom] = useState<GeomType>("icosahedron");
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotateSpeed, setRotateSpeed] = useState(1);
  const [ambientIntensity, setAmbientIntensity] = useState(0.5);
  const [pointIntensity, setPointIntensity] = useState(2);
  const [color, setColor] = useState("#6d6aff");

  return (
    <PageLayout
      title="3D Scene"
      description="React Three Fiber wraps Three.js as React components. OrbitControls lets you rotate and zoom. Drag the canvas to orbit, scroll to zoom."
      library="Three.js"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ background: "var(--surface)", border: "1px solid var(--border)", minHeight: 420, height: 480 }}
        >
          <ThreeCanvas
            geom={geom}
            wireframe={wireframe}
            color={color}
            autoRotate={autoRotate}
            rotateSpeed={rotateSpeed}
            ambientIntensity={ambientIntensity}
            pointIntensity={pointIntensity}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ControlPanel>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>geometry</span>
              <div className="flex flex-wrap gap-1.5">
                {GEOMS.map((g) => (
                  <button
                    key={g}
                    onClick={() => setGeom(g)}
                    className="px-2 py-1 rounded text-xs font-mono transition-colors"
                    style={{
                      background: geom === g ? "rgba(109,106,255,0.2)" : "var(--surface-2)",
                      color: geom === g ? "var(--accent)" : "var(--text-muted)",
                      border: `1px solid ${geom === g ? "var(--accent)" : "var(--border)"}`,
                    }}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-mono" style={{ color: "var(--text-muted)" }}>color</span>
              <div className="flex gap-2 flex-wrap">
                {["#6d6aff", "#ff6b9d", "#38bdf8", "#86efac", "#fbbf24", "#fb923c"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className="w-7 h-7 rounded-full transition-transform hover:scale-110"
                    style={{
                      background: c,
                      outline: color === c ? `2px solid white` : "none",
                      outlineOffset: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            <SliderControl label="rotate speed" value={rotateSpeed} min={0.1} max={5} step={0.1} onChange={setRotateSpeed} />
            <SliderControl label="ambient light" value={ambientIntensity} min={0} max={2} step={0.05} onChange={setAmbientIntensity} />
            <SliderControl label="point light" value={pointIntensity} min={0} max={8} step={0.1} onChange={setPointIntensity} />
            <SwitchControl label="wireframe" checked={wireframe} onChange={setWireframe} />
            <SwitchControl label="auto-rotate" checked={autoRotate} onChange={setAutoRotate} />
          </ControlPanel>
        </div>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "scene graph",
            text: "Three.js organizes a scene as a tree: Mesh = Geometry + Material. Lights affect how PBR materials render. Everything hangs on a root Scene object.",
          },
          {
            label: "geometry",
            text: "Defines the shape as vertices, normals, and UVs. IcosahedronGeometry, BoxGeometry, TorusKnotGeometry etc. are built-in primitives you can swap without touching the material.",
          },
          {
            label: "material",
            text: "MeshStandardMaterial uses physically-based rendering and responds to lights. MeshBasicMaterial ignores lights entirely — useful for wireframes and UI overlays.",
          },
          {
            label: "React Three Fiber",
            text: "JSX bindings for Three.js: <mesh> = new THREE.Mesh(), <pointLight> = new THREE.PointLight(). React state changes automatically update the underlying 3D objects.",
          },
        ]}
        code={`<Canvas>
  <ambientLight intensity={0.5} />
  <pointLight position={[5, 5, 5]} intensity={2} />

  <mesh>
    <icosahedronGeometry args={[1, 1]} />
    <meshStandardMaterial color="#6d6aff" wireframe={false} />
  </mesh>

  <OrbitControls autoRotate autoRotateSpeed={1} />
</Canvas>`}
      />
    </PageLayout>
  );
}
