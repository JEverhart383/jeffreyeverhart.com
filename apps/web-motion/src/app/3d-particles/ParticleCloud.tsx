"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type ColorTheme = "nebula" | "ocean" | "forest" | "fire" | "mono";

export const THEMES: Record<ColorTheme, { a: string; b: string }> = {
  nebula: { a: "#6d6aff", b: "#ff6b9d" },
  ocean:  { a: "#38bdf8", b: "#0ea5e9" },
  forest: { a: "#86efac", b: "#34d399" },
  fire:   { a: "#fbbf24", b: "#ef4444" },
  mono:   { a: "#e2e8f0", b: "#475569" },
};

export interface ParticleCloudProps {
  count: number;
  pointSize: number;
  speed: number;
  theme: ColorTheme;
}

function buildGeometry(count: number, theme: ColorTheme): THREE.BufferGeometry {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const { a, b } = THEMES[theme];
  const ca = new THREE.Color(a);
  const cb = new THREE.Color(b);

  for (let i = 0; i < count; i++) {
    let x = 0, y = 0, z = 0, d2 = 2;
    while (d2 > 1) {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      d2 = x * x + y * y + z * z;
    }
    positions[i * 3]     = x * 2.2;
    positions[i * 3 + 1] = y * 2.2;
    positions[i * 3 + 2] = z * 2.2;

    const t = Math.sqrt(d2);
    const c = ca.clone().lerp(cb, t);
    colors[i * 3]     = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return geo;
}

export default function ParticleCloud({ count, pointSize, speed, theme }: ParticleCloudProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pointsRef    = useRef<THREE.Points | null>(null);
  const speedRef     = useRef(speed);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.01, 100);
    camera.position.set(0, 0, 5.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const material = new THREE.PointsMaterial({
      size: pointSize,
      vertexColors: true,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });

    const geo    = buildGeometry(count, theme);
    const points = new THREE.Points(geo, material);
    pointsRef.current = points;
    scene.add(points);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan    = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ro = new ResizeObserver(() => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });
    ro.observe(container);

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      if (pointsRef.current) {
        pointsRef.current.rotation.y += 0.001 * speedRef.current;
        pointsRef.current.rotation.x += 0.0004 * speedRef.current;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      geo.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const pts = pointsRef.current;
    if (!pts) return;
    pts.geometry.dispose();
    pts.geometry = buildGeometry(count, theme);
  }, [count, theme]);

  useEffect(() => {
    const pts = pointsRef.current;
    if (!pts) return;
    (pts.material as THREE.PointsMaterial).size = pointSize;
  }, [pointSize]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
