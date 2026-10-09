// Framework-free particle text engine: CPU spring physics, WebGL gl.POINTS rendering.
// Knows nothing about React or the DOM it decorates — a Sampler supplies home
// positions and colors, so the same engine drives a hard-coded word or a live <h2>.

export type Shape = "circle" | "square" | "triangle" | "line";
const SHAPE_ID: Record<Shape, number> = { circle: 0, square: 1, triangle: 2, line: 3 };

export interface Tunables {
  radius: number; // css px — pointer influence radius
  strength: number; // pointer force
  spring: number; // pull toward home per step
  damping: number; // velocity retained per step
  size: number; // css px — particle diameter at rest (ignored when the sample supplies a cellSize)
  fill: number; // 0..1 — particle size as a fraction of the sample's cellSize
  shape: Shape;
  gap: number; // css px — sampling grid spacing (changing it resamples)
  mode: "repel" | "attract";
  activeColor: string | null; // displaced particles tint toward this; null keeps their own color
  activeMix: number; // 0..1 — how far a fully displaced particle tints
}

export interface SampleInput {
  width: number; // device px
  height: number; // device px
  dpr: number;
  gap: number; // css px
}

export interface ParticleSample {
  positions: Float32Array; // [x, y, ...] in device px
  colors: Uint8Array; // [r, g, b, a, ...]
  cellSize?: number; // device px — when the sample is grid-based, particles are sized from the grid
}

export type Sampler = (input: SampleInput) => ParticleSample;

export interface ParticleTextOptions extends Partial<Tunables> {
  sample: Sampler;
  pointerTarget?: HTMLElement; // where to listen for the pointer; defaults to the canvas
  intro?: boolean; // first build scatters particles so they assemble on first view
  maxDpr?: number;
  onReady?: () => void; // fires after the first successful build
  beforeBuild?: () => Promise<unknown>; // awaited before the first sample; defaults to document.fonts.ready
}

export interface ParticleText {
  set(partial: Partial<Tunables>): void;
  rebuild(): void;
  destroy(): void;
}

export const DEFAULT_TUNABLES: Tunables = {
  radius: 90,
  strength: 3,
  spring: 0.055,
  damping: 0.87,
  size: 1.3,
  fill: 0.9,
  shape: "circle",
  gap: 1,
  mode: "repel",
  activeColor: null,
  activeMix: 0.8,
};

const STEP_MS = 1000 / 60; // fixed timestep so 120Hz displays don't run the spring twice as fast

const VERT = `
  attribute vec2 a_pos;
  attribute vec2 a_home;
  attribute vec4 a_color;
  uniform vec2 u_res;
  uniform float u_size;
  uniform float u_dispScale;
  varying float v_disp;
  varying vec3 v_color;
  void main() {
    vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
    gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
    v_disp = clamp(distance(a_pos, a_home) / u_dispScale, 0.0, 1.0);
    v_color = a_color.rgb;
    gl_PointSize = u_size * (1.0 + v_disp * 0.5);
  }
`;

// Outputs premultiplied color so it composites cleanly over the page on a transparent canvas.
const FRAG = `
  precision mediump float;
  uniform vec3 u_active;
  uniform float u_activeMix;
  uniform int u_shape; // 0 circle, 1 square, 2 triangle, 3 line — mirrors the Geist Pixel variants
  varying float v_disp;
  varying vec3 v_color;
  void main() {
    vec2 p = gl_PointCoord; // y runs top → bottom
    float a = 1.0;
    if (u_shape == 0) {
      a = smoothstep(0.5, 0.4, length(p - vec2(0.5)));
    } else if (u_shape == 2) {
      a = step(0.0, p.y - abs(p.x - 0.5) * 2.0); // apex up
    } else if (u_shape == 3) {
      a = step(0.5, p.y); // lower-half bar, like Geist Pixel Line
    }
    if (a < 0.01) discard;
    vec3 c = mix(v_color, u_active, v_disp * u_activeMix);
    gl_FragColor = vec4(c * a, a);
  }
`;

export function parseColor(color: string): [number, number, number] {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.fillStyle = "#000";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(s);
    gl.deleteShader(s);
    throw new Error(`particle-text shader compile failed: ${log}`);
  }
  return s;
}

export function createParticleText(
  canvas: HTMLCanvasElement,
  options: ParticleTextOptions,
): ParticleText | null {
  // premultipliedAlpha is the default; stated because the fragment shader depends on it
  const glCtx = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!glCtx) return null;
  const gl: WebGLRenderingContext = glCtx;

  const t: Tunables = { ...DEFAULT_TUNABLES };
  for (const k of Object.keys(DEFAULT_TUNABLES) as (keyof Tunables)[]) {
    if (options[k] !== undefined) (t as unknown as Record<string, unknown>)[k] = options[k];
  }
  const maxDpr = options.maxDpr ?? 2;
  const pointerTarget = options.pointerTarget ?? canvas;

  let active: [number, number, number] = t.activeColor ? parseColor(t.activeColor) : [0, 0, 0];

  // --- GL resources (recreated after context loss) ---
  let prog: WebGLProgram | null = null;
  let posBuf: WebGLBuffer | null = null;
  let homeBuf: WebGLBuffer | null = null;
  let colorBuf: WebGLBuffer | null = null;
  let uRes: WebGLUniformLocation | null = null;
  let uSize: WebGLUniformLocation | null = null;
  let uDispScale: WebGLUniformLocation | null = null;
  let uActive: WebGLUniformLocation | null = null;
  let uActiveMix: WebGLUniformLocation | null = null;
  let uShape: WebGLUniformLocation | null = null;

  // --- simulation state (survives context loss) ---
  let n = 0;
  let pos: Float32Array = new Float32Array(0);
  let vel: Float32Array = new Float32Array(0);
  let home: Float32Array = new Float32Array(0);
  let colors: Uint8Array = new Uint8Array(0);
  let cellSize: number | undefined;
  let dpr = 1;

  let pointerActive = false;
  let px = 0;
  let py = 0;

  let raf = 0;
  let last = -1;
  let acc = 0;
  let ready = false;
  let firstBuild = true;
  let inView = false;
  let lost = false;
  let destroyed = false;
  let resizeTimer = 0;

  function initGL() {
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      throw new Error(`particle-text program link failed: ${gl.getProgramInfoLog(prog)}`);
    }
    gl.useProgram(prog);

    uRes = gl.getUniformLocation(prog, "u_res");
    uSize = gl.getUniformLocation(prog, "u_size");
    uDispScale = gl.getUniformLocation(prog, "u_dispScale");
    uActive = gl.getUniformLocation(prog, "u_active");
    uActiveMix = gl.getUniformLocation(prog, "u_activeMix");
    uShape = gl.getUniformLocation(prog, "u_shape");

    posBuf = gl.createBuffer();
    homeBuf = gl.createBuffer();
    colorBuf = gl.createBuffer();
    attrib("a_pos", posBuf!, 2, gl.FLOAT, false);
    attrib("a_home", homeBuf!, 2, gl.FLOAT, false);
    attrib("a_color", colorBuf!, 4, gl.UNSIGNED_BYTE, true);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    uploadStatic();
  }

  function attrib(name: string, buf: WebGLBuffer, size: number, type: number, normalized: boolean) {
    const loc = gl.getAttribLocation(prog!, name);
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, size, type, normalized, 0, 0);
  }

  function uploadStatic() {
    gl.bindBuffer(gl.ARRAY_BUFFER, homeBuf);
    gl.bufferData(gl.ARRAY_BUFFER, home, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
  }

  function build() {
    const scatter = firstBuild && !!options.intro;
    firstBuild = false;
    const s = options.sample({ width: canvas.width, height: canvas.height, dpr, gap: t.gap });
    n = s.positions.length / 2;
    home = s.positions;
    colors = s.colors;
    cellSize = s.cellSize;
    pos = scatter ? new Float32Array(n * 2) : Float32Array.from(home);
    vel = new Float32Array(n * 2);
    if (scatter) {
      for (let i = 0; i < n; i++) {
        pos[i * 2] = Math.random() * canvas.width;
        pos[i * 2 + 1] = Math.random() * canvas.height;
      }
    }
    if (!lost) uploadStatic();
  }

  function resize(force: boolean) {
    const nextDpr = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.round(canvas.clientWidth * nextDpr);
    const h = Math.round(canvas.clientHeight * nextDpr);
    if (!force && w === canvas.width && h === canvas.height && nextDpr === dpr) return;
    dpr = nextDpr;
    canvas.width = w;
    canvas.height = h;
    gl.viewport(0, 0, w, h);
    build();
    if (!raf) draw(); // resizing clears the canvas; repaint even if the loop is asleep
    wake();
  }

  function step() {
    const r = t.radius * dpr;
    const r2 = r * r;
    const force = t.strength * dpr;
    const sign = t.mode === "repel" ? 1 : -1;
    let speed = 0;
    let offset = 0;

    for (let i = 0; i < n; i++) {
      const ix = i * 2;
      const iy = ix + 1;
      let vx = vel[ix] + (home[ix] - pos[ix]) * t.spring;
      let vy = vel[iy] + (home[iy] - pos[iy]) * t.spring;

      if (pointerActive) {
        const dx = pos[ix] - px;
        const dy = pos[iy] - py;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2) {
          const d = Math.sqrt(d2) + 0.001;
          const f = (1 - d / r) * force * sign;
          vx += (dx / d) * f;
          vy += (dy / d) * f;
        }
      }

      vx *= t.damping;
      vy *= t.damping;
      pos[ix] += vx;
      pos[iy] += vy;
      vel[ix] = vx;
      vel[iy] = vy;
      speed += Math.abs(vx) + Math.abs(vy);
      offset += Math.abs(home[ix] - pos[ix]) + Math.abs(home[iy] - pos[iy]);
    }
    return { speed: speed / Math.max(n, 1), offset: offset / Math.max(n, 1) };
  }

  function draw() {
    if (lost) return;
    gl.clear(gl.COLOR_BUFFER_BIT);
    if (!n) return;
    gl.uniform2f(uRes, canvas.width, canvas.height);
    gl.uniform1f(uSize, cellSize ? cellSize * t.fill : t.size * dpr);
    gl.uniform1i(uShape, SHAPE_ID[t.shape]);
    gl.uniform1f(uDispScale, Math.max(t.radius * 0.8, 1) * dpr);
    gl.uniform3f(uActive, active[0], active[1], active[2]);
    gl.uniform1f(uActiveMix, t.activeColor ? t.activeMix : 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, pos, gl.DYNAMIC_DRAW);
    gl.drawArrays(gl.POINTS, 0, n);
  }

  function tick(now: number) {
    raf = 0;
    acc += last < 0 ? STEP_MS : Math.min(now - last, 100);
    last = now;

    let stats = { speed: Infinity, offset: Infinity };
    while (acc >= STEP_MS) {
      stats = step();
      acc -= STEP_MS;
    }

    // Sleep once settled: a footer nobody is touching shouldn't cost a frame.
    const settled = stats.speed < 0.01 && (pointerActive || stats.offset < 0.05);
    if (settled) {
      if (!pointerActive) {
        pos.set(home);
        vel.fill(0);
      }
      draw();
      last = -1;
      acc = 0;
      return;
    }
    draw();
    schedule();
  }

  function schedule() {
    if (raf || !ready || !inView || lost || destroyed || document.hidden) return;
    raf = requestAnimationFrame(tick);
  }

  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    last = -1;
    acc = 0;
  }

  function wake() {
    schedule();
  }

  // --- pointer ---
  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect();
    px = (e.clientX - rect.left) * dpr;
    py = (e.clientY - rect.top) * dpr;
    pointerActive = true;
    wake();
  }
  function onPointerLeave() {
    pointerActive = false;
    wake();
  }
  function onPointerUp(e: PointerEvent) {
    if (e.pointerType !== "mouse") onPointerLeave();
  }

  // --- lifecycle ---
  function onContextLost(e: Event) {
    e.preventDefault();
    lost = true;
    stop();
  }
  function onContextRestored() {
    lost = false;
    initGL();
    draw();
    wake();
  }
  function onVisibility() {
    if (document.hidden) stop();
    else wake();
  }

  const io = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) wake();
    else stop();
  });
  const ro = new ResizeObserver(() => {
    if (!ready) return;
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => resize(false), 120);
  });

  initGL();
  pointerTarget.addEventListener("pointermove", onPointerMove);
  pointerTarget.addEventListener("pointerdown", onPointerMove);
  pointerTarget.addEventListener("pointerleave", onPointerLeave);
  pointerTarget.addEventListener("pointercancel", onPointerLeave);
  pointerTarget.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);
  document.addEventListener("visibilitychange", onVisibility);
  io.observe(canvas);
  ro.observe(canvas);

  // Canvas text silently falls back if a webfont isn't loaded yet — never sample before this.
  (options.beforeBuild?.() ?? document.fonts.ready).then(() => {
    if (destroyed) return;
    resize(true);
    ready = true;
    options.onReady?.();
    schedule();
  });

  return {
    set(partial) {
      const gapChanged = partial.gap !== undefined && partial.gap !== t.gap;
      Object.assign(t, partial);
      if (partial.activeColor !== undefined && t.activeColor) active = parseColor(t.activeColor);
      if (gapChanged && ready) build();
      if (!raf) draw();
      wake();
    },
    rebuild() {
      if (!ready) return;
      build();
      if (!raf) draw();
      wake();
    },
    destroy() {
      destroyed = true;
      stop();
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      pointerTarget.removeEventListener("pointermove", onPointerMove);
      pointerTarget.removeEventListener("pointerdown", onPointerMove);
      pointerTarget.removeEventListener("pointerleave", onPointerLeave);
      pointerTarget.removeEventListener("pointercancel", onPointerLeave);
      pointerTarget.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      document.removeEventListener("visibilitychange", onVisibility);
      // Don't force-lose the context: getContext returns this same context on remount
      // (React StrictMode mounts twice), and a lost one would stay lost.
      gl.deleteBuffer(posBuf);
      gl.deleteBuffer(homeBuf);
      gl.deleteBuffer(colorBuf);
      gl.deleteProgram(prog);
    },
  };
}
