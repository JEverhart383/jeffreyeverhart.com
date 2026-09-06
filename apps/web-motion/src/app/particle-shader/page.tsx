"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/components/PageLayout";
import { ControlPanel, ControlRow, SliderControl } from "@/components/ControlPanel";
import { ConceptSection } from "@/components/ConceptSection";

// Vertex shader: converts canvas-pixel coords to clip space, passes displacement factor
const VERT = `
  attribute vec2 a_pos;
  attribute vec2 a_home;
  uniform vec2 u_res;
  uniform float u_size;
  varying float v_disp;
  void main() {
    vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
    clip.y = -clip.y;
    gl_Position = vec4(clip, 0.0, 1.0);
    v_disp = clamp(distance(a_pos, a_home) / 200.0, 0.0, 1.0);
    gl_PointSize = u_size * (1.0 + v_disp * 0.6);
  }
`;

// Fragment shader: antialiased circle, color shifts from white to accent when displaced
const FRAG = `
  precision mediump float;
  varying float v_disp;
  void main() {
    float d = length(gl_PointCoord - vec2(0.5));
    float a = smoothstep(0.5, 0.28, d);
    if (a < 0.01) discard;
    vec3 rest = vec3(0.91, 0.91, 0.95);
    vec3 active = vec3(0.43, 0.42, 1.0);
    gl_FragColor = vec4(mix(rest, active, v_disp), a);
  }
`;

const WORDS = ["MOTION", "SHADER", "CURSOR", "HELLO", "WEB"];
type Mode = "repel" | "attract" | "idle";

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

function sampleText(word: string, w: number, h: number): Float32Array {
  const oc = document.createElement("canvas");
  oc.width = w;
  oc.height = h;
  const ctx = oc.getContext("2d")!;
  const fontSize = Math.min((w / word.length) * 1.3, h * 0.5);
  ctx.font = `bold ${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#fff";
  ctx.fillText(word, w / 2, h / 2);
  const data = ctx.getImageData(0, 0, w, h).data;
  const pts: number[] = [];
  const step = 5;
  for (let y = 0; y < h; y += step) {
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 128) {
        pts.push(x, y);
      }
    }
  }
  return new Float32Array(pts);
}

export default function ParticleShaderPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stateRef = useRef({
    word: "MOTION",
    mouseX: -9999,
    mouseY: -9999,
    radius: 110,
    strength: 3,
    spring: 0.055,
    damping: 0.87,
    ptSize: 3.5,
    mode: "repel" as Mode,
    rebuild: false,
  });

  const [word, setWord] = useState("MOTION");
  const [radius, setRadius] = useState(110);
  const [strength, setStrength] = useState(3);
  const [spring, setSpring] = useState(0.055);
  const [ptSize, setPtSize] = useState(3.5);
  const [mode, setMode] = useState<Mode>("repel");

  useEffect(() => { stateRef.current.radius = radius; }, [radius]);
  useEffect(() => { stateRef.current.strength = strength; }, [strength]);
  useEffect(() => { stateRef.current.spring = spring; }, [spring]);
  useEffect(() => { stateRef.current.ptSize = ptSize; }, [ptSize]);
  useEffect(() => { stateRef.current.mode = mode; }, [mode]);
  useEffect(() => {
    stateRef.current.word = word;
    stateRef.current.rebuild = true;
  }, [word]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compileShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const aPos = gl.getAttribLocation(prog, "a_pos");
    const aHome = gl.getAttribLocation(prog, "a_home");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uSize = gl.getUniformLocation(prog, "u_size");

    const posBuf = gl.createBuffer()!;
    const homeBuf = gl.createBuffer()!;

    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, homeBuf);
    gl.enableVertexAttribArray(aHome);
    gl.vertexAttribPointer(aHome, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    type P = { x: number; y: number; vx: number; vy: number; homeX: number; homeY: number };
    let particles: P[] = [];
    let pos = new Float32Array(0);

    function build(w: number, h: number) {
      const homeData = sampleText(stateRef.current.word, w, h);
      const count = homeData.length / 2;
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: 0,
          vy: 0,
          homeX: homeData[i * 2],
          homeY: homeData[i * 2 + 1],
        });
      }
      pos = new Float32Array(count * 2);
      gl.bindBuffer(gl.ARRAY_BUFFER, homeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, homeData, gl.STATIC_DRAW);
    }

    function resize() {
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      build(canvas.width, canvas.height);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let raf = 0;

    function tick() {
      const s = stateRef.current;
      const w = canvas!.width;
      const h = canvas!.height;

      if (s.rebuild) {
        s.rebuild = false;
        build(w, h);
      }

      const dpr = window.devicePixelRatio || 1;
      const mx = s.mouseX * dpr;
      const my = s.mouseY * dpr;
      const r2 = (s.radius * dpr) ** 2;
      const scaledRadius = s.radius * dpr;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.vx += (p.homeX - p.x) * s.spring;
        p.vy += (p.homeY - p.y) * s.spring;

        const dx = p.x - mx;
        const dy = p.y - my;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && s.mode !== "idle") {
          const d = Math.sqrt(d2) + 0.001;
          const f = (1 - d / scaledRadius) * s.strength * dpr;
          const sign = s.mode === "repel" ? 1 : -1;
          p.vx += sign * (dx / d) * f;
          p.vy += sign * (dy / d) * f;
        }

        p.vx *= s.damping;
        p.vy *= s.damping;
        p.x += p.vx;
        p.y += p.vy;
        pos[i * 2] = p.x;
        pos[i * 2 + 1] = p.y;
      }

      gl.clearColor(0.039, 0.039, 0.059, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uSize, s.ptSize * dpr);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, pos.subarray(0, particles.length * 2), gl.DYNAMIC_DRAW);
      gl.drawArrays(gl.POINTS, 0, particles.length);

      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(homeBuf);
      gl.deleteProgram(prog);
    };
  }, []);

  const btnStyle = (active: boolean) => ({
    background: active ? "#e879f920" : "transparent",
    color: active ? "#e879f9" : "var(--text-muted)",
    border: `1px solid ${active ? "#e879f9" : "var(--border)"}`,
  });

  return (
    <PageLayout
      title="Particle Text Shader"
      description="Particles form text using WebGL gl.POINTS and a GLSL circle shader. A radial force field driven by mouse position displaces them — they spring back to formation via per-particle spring physics. Inspired by basement.studio's Vercel Ship effect."
      library="WebGL"
      libraryColor="#e879f9"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--border)", minHeight: 420 }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full block cursor-crosshair"
            style={{ minHeight: 420 }}
            onMouseMove={(e) => {
              const r = canvasRef.current!.getBoundingClientRect();
              stateRef.current.mouseX = e.clientX - r.left;
              stateRef.current.mouseY = e.clientY - r.top;
            }}
            onMouseLeave={() => {
              stateRef.current.mouseX = -9999;
              stateRef.current.mouseY = -9999;
            }}
          />
        </div>

        <ControlPanel>
          <ControlRow label="word">
            <div className="flex flex-wrap gap-1.5">
              {WORDS.map((w) => (
                <button
                  key={w}
                  onClick={() => setWord(w)}
                  className="text-xs font-mono px-2 py-1 rounded transition-colors"
                  style={btnStyle(word === w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </ControlRow>

          <ControlRow label="mouse mode">
            <div className="flex gap-1.5">
              {(["repel", "attract", "idle"] as Mode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="text-xs font-mono px-2 py-1 rounded transition-colors"
                  style={btnStyle(mode === m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </ControlRow>

          <SliderControl label="radius" value={radius} min={40} max={260} step={10} unit="px" onChange={setRadius} />
          <SliderControl label="strength" value={strength} min={0.5} max={8} step={0.5} onChange={setStrength} />
          <SliderControl label="spring" value={spring} min={0.01} max={0.15} step={0.005} onChange={setSpring} />
          <SliderControl label="particle px" value={ptSize} min={1} max={8} step={0.5} unit="px" onChange={setPtSize} />
        </ControlPanel>
      </div>
      <ConceptSection
        concepts={[
          {
            label: "WebGL pipeline",
            text: "Two GPU programs run per frame: the vertex shader (where each point lands in clip space) and the fragment shader (what color each pixel within that point gets).",
          },
          {
            label: "gl.POINTS",
            text: "Draws one square sprite per vertex. gl_PointSize controls the size; gl_PointCoord in the fragment shader gives the position within that square (0,0) to (1,1).",
          },
          {
            label: "circle masking",
            text: "length(gl_PointCoord - vec2(0.5)) computes distance from the sprite center. Pixels where this exceeds 0.5 are discarded, turning the default square into a circle.",
          },
          {
            label: "spring physics (JS side)",
            text: "Each frame: vx += (homeX - x) * spring. Mouse applies a radial push/pull force. All physics run on the CPU — the GPU only handles rendering.",
          },
        ]}
        code={`// Vertex shader: position each particle
gl_Position  = vec4(pixelToClip(a_pos), 0.0, 1.0);
gl_PointSize = u_size * (1.0 + v_disp * 0.6);

// Fragment shader: clip square → circle
float d = length(gl_PointCoord - vec2(0.5));
if (d > 0.5) discard;  // outside circle → transparent
gl_FragColor = vec4(mix(restColor, accentColor, v_disp), 1.0);

// JS spring physics (per frame, per particle)
p.vx += (p.homeX - p.x) * spring;
p.vx *= damping;
p.x  += p.vx;`}
      />
    </PageLayout>
  );
}
