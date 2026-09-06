"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export type GeomType = "box" | "sphere" | "torus" | "icosahedron" | "torusKnot";

export interface ThreeCanvasProps {
  geom: GeomType;
  wireframe: boolean;
  color: string;
  autoRotate: boolean;
  rotateSpeed: number;
  ambientIntensity: number;
  pointIntensity: number;
}

function buildGeometry(geom: GeomType): THREE.BufferGeometry {
  switch (geom) {
    case "box":         return new THREE.BoxGeometry(1.5, 1.5, 1.5);
    case "sphere":      return new THREE.SphereGeometry(1, 32, 32);
    case "torus":       return new THREE.TorusGeometry(1, 0.4, 16, 64);
    case "icosahedron": return new THREE.IcosahedronGeometry(1.2, 1);
    case "torusKnot":   return new THREE.TorusKnotGeometry(0.8, 0.25, 128, 16);
  }
}

export default function ThreeCanvas({
  geom,
  wireframe,
  color,
  autoRotate,
  rotateSpeed,
  ambientIntensity,
  pointIntensity,
}: ThreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Live-update refs so the animation loop reads current values without re-mounting
  const meshRef       = useRef<THREE.Mesh | null>(null);
  const materialRef   = useRef<THREE.MeshStandardMaterial | null>(null);
  const ambientRef    = useRef<THREE.AmbientLight | null>(null);
  const pointRef      = useRef<THREE.PointLight | null>(null);
  const fillRef       = useRef<THREE.PointLight | null>(null);
  const autoRotRef    = useRef(autoRotate);
  const rotSpeedRef   = useRef(rotateSpeed);

  // Create the scene once on mount
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, ambientIntensity);
    scene.add(ambient);
    ambientRef.current = ambient;

    const point = new THREE.PointLight(0xffffff, pointIntensity);
    point.position.set(5, 5, 5);
    scene.add(point);
    pointRef.current = point;

    const fill = new THREE.PointLight(0x6d6aff, pointIntensity * 0.4);
    fill.position.set(-5, -3, -5);
    scene.add(fill);
    fillRef.current = fill;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(color),
      wireframe,
      roughness: 0.3,
      metalness: 0.6,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(buildGeometry(geom), material);
    meshRef.current = mesh;
    scene.add(mesh);

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
      if (autoRotRef.current && meshRef.current) {
        meshRef.current.rotation.y += 0.01 * rotSpeedRef.current;
        meshRef.current.rotation.x += 0.005 * rotSpeedRef.current;
      }
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap geometry on change
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    mesh.geometry.dispose();
    mesh.geometry = buildGeometry(geom);
  }, [geom]);

  // Update material on change
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    mat.color.set(color);
    mat.wireframe   = wireframe;
    mat.needsUpdate = true;
  }, [color, wireframe]);

  // Update light intensities
  useEffect(() => { if (ambientRef.current) ambientRef.current.intensity = ambientIntensity; }, [ambientIntensity]);
  useEffect(() => {
    if (pointRef.current) pointRef.current.intensity = pointIntensity;
    if (fillRef.current)  fillRef.current.intensity  = pointIntensity * 0.4;
  }, [pointIntensity]);

  // Sync animation params via refs — no re-render needed
  useEffect(() => { autoRotRef.current  = autoRotate;   }, [autoRotate]);
  useEffect(() => { rotSpeedRef.current = rotateSpeed;  }, [rotateSpeed]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
