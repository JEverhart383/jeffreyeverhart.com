import type { ParticleSample, Sampler } from "./engine";

export interface PixelGrid {
  pitchEm: number; // grid cell size as a fraction of the font size
  subdivide?: number; // particles per cell edge — 2 means 2×2 particles per font pixel
}

export interface ElementSamplerOptions {
  alphaThreshold?: number; // 0..255 — lower keeps more of thin, antialiased strokes
  jitter?: number; // 0..1 of the grid step — breaks up the visible sampling grid (dense mode only)
  grid?: PixelGrid | null; // pixel fonts: one particle per font pixel instead of dense sampling
}

// Geist Pixel draws every glyph on a 38-unit grid at 1000 units/em, anchored to the
// pen origin and the baseline (measured from the font files: cap height 722 = 19 cells).
export const GEIST_PIXEL_GRID_EM = 0.038;

interface GlyphBox {
  x: number; // pen origin, css px relative to the canvas
  y: number; // baseline
  advance: number;
  ascent: number;
  descent: number;
  pitch: number; // css px
}

// Samples particles from an element's *rendered* text. Each character is redrawn
// offscreen at the exact box the browser laid it out in, with that character's
// computed font and color — so wrapping, nested <span> colors, letter-spacing and
// webfonts all carry over without the engine knowing about any of them.
export function elementSampler(
  el: HTMLElement,
  canvas: HTMLCanvasElement,
  options: ElementSamplerOptions | (() => ElementSamplerOptions) = {},
): Sampler {
  return ({ width, height, dpr, gap }): ParticleSample => {
    const { alphaThreshold = 110, jitter = 0.3, grid = null } =
      typeof options === "function" ? options() : options;

    const off = document.createElement("canvas");
    off.width = width;
    off.height = height;
    const ctx = off.getContext("2d", { willReadFrequently: true })!;
    ctx.scale(dpr, dpr);
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";

    const origin = canvas.getBoundingClientRect();
    const range = document.createRange();
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const glyphs: GlyphBox[] = [];

    for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
      const cs = getComputedStyle(node.parentElement!);
      // font-stretch is left out: its computed value ("100%") isn't valid in the canvas shorthand,
      // and an invalid ctx.font is silently ignored.
      const style = cs.fontStyle.startsWith("oblique") ? "oblique" : cs.fontStyle;
      ctx.font = `${style} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      ctx.fillStyle = cs.color;
      const fontSize = parseFloat(cs.fontSize);
      const upper = cs.textTransform === "uppercase";
      const lower = cs.textTransform === "lowercase";

      let i = 0;
      for (const raw of node.data) {
        const len = raw.length; // surrogate pairs are 2 UTF-16 units
        if (raw.trim()) {
          range.setStart(node, i);
          range.setEnd(node, i + len);
          const r = range.getBoundingClientRect();
          if (r.width && r.height) {
            const ch = upper ? raw.toUpperCase() : lower ? raw.toLowerCase() : raw;
            const m = ctx.measureText(ch);
            const asc = m.fontBoundingBoxAscent;
            const desc = m.fontBoundingBoxDescent;
            // The range box is the font's content area; center the glyph's font box in it.
            const x = r.left - origin.left;
            const y = r.top - origin.top + (r.height - (asc + desc)) / 2 + asc;
            ctx.fillText(ch, x, y);
            if (grid) {
              glyphs.push({ x, y, advance: m.width, ascent: asc, descent: desc, pitch: fontSize * grid.pitchEm });
            }
          }
        }
        i += len;
      }
    }
    range.detach();

    // Only read back the element's region, not the whole canvas.
    const box = el.getBoundingClientRect();
    const pad = 8;
    const x0 = Math.max(0, Math.floor((box.left - origin.left - pad) * dpr));
    const y0 = Math.max(0, Math.floor((box.top - origin.top - pad) * dpr));
    const x1 = Math.min(width, Math.ceil((box.right - origin.left + pad) * dpr));
    const y1 = Math.min(height, Math.ceil((box.bottom - origin.top + pad) * dpr));
    const rw = x1 - x0;
    const rh = y1 - y0;
    if (rw <= 0 || rh <= 0) return { positions: new Float32Array(0), colors: new Uint8Array(0) };
    const data = ctx.getImageData(x0, y0, rw, rh).data;

    if (grid) return sampleCells(glyphs, grid, data, { x0, y0, rw, rh, dpr, alphaThreshold });

    const step = Math.max(1, Math.round(gap * dpr)); // in device px, so count is stable across DPRs
    const pts: number[] = [];
    const cols: number[] = [];

    for (let y = 0; y < rh; y += step) {
      for (let x = 0; x < rw; x += step) {
        const k = (y * rw + x) * 4;
        if (data[k + 3] > alphaThreshold) {
          pts.push(
            x0 + x + (Math.random() - 0.5) * step * jitter,
            y0 + y + (Math.random() - 0.5) * step * jitter,
          );
          // getImageData is un-premultiplied, so rgb is the true text color
          cols.push(data[k], data[k + 1], data[k + 2], 255);
        }
      }
    }

    return { positions: new Float32Array(pts), colors: new Uint8Array(cols) };
  };
}

// Probe points inside each cell. A single center probe misses variants whose pixel
// doesn't cover the center (Geist Pixel Line draws only the lower half of a cell).
const PROBES = [0.2, 0.5, 0.8];

function sampleCells(
  glyphs: GlyphBox[],
  grid: PixelGrid,
  data: Uint8ClampedArray,
  { x0, y0, rw, rh, dpr, alphaThreshold }: { x0: number; y0: number; rw: number; rh: number; dpr: number; alphaThreshold: number },
): ParticleSample {
  const sub = Math.max(1, Math.round(grid.subdivide ?? 1));
  const pts: number[] = [];
  const cols: number[] = [];
  let pitch = 0;

  const indexAt = (cx: number, cy: number) => {
    const dx = Math.round(cx * dpr) - x0;
    const dy = Math.round(cy * dpr) - y0;
    return dx < 0 || dy < 0 || dx >= rw || dy >= rh ? -1 : (dy * rw + dx) * 4;
  };

  for (const g of glyphs) {
    const p = g.pitch;
    pitch = Math.max(pitch, p);
    // Cells are anchored at the pen origin and baseline; only walk this glyph's own
    // advance so a neighbour's ink isn't re-sampled on this glyph's (offset) grid.
    const colsN = Math.round(g.advance / p);
    const rowTop = -Math.ceil(g.ascent / p);
    const rowBottom = Math.ceil(g.descent / p);

    for (let row = rowTop; row < rowBottom; row++) {
      for (let col = 0; col < colsN; col++) {
        const cx = g.x + col * p;
        const cy = g.y + row * p;
        let best = -1;
        let bestAlpha = alphaThreshold;
        for (const oy of PROBES) {
          for (const ox of PROBES) {
            const k = indexAt(cx + ox * p, cy + oy * p);
            if (k >= 0 && data[k + 3] > bestAlpha) {
              bestAlpha = data[k + 3];
              best = k;
            }
          }
        }
        if (best < 0) continue;

        for (let sy = 0; sy < sub; sy++) {
          for (let sx = 0; sx < sub; sx++) {
            pts.push((cx + ((sx + 0.5) * p) / sub) * dpr, (cy + ((sy + 0.5) * p) / sub) * dpr);
            cols.push(data[best], data[best + 1], data[best + 2], 255);
          }
        }
      }
    }
  }

  return {
    positions: new Float32Array(pts),
    colors: new Uint8Array(cols),
    cellSize: (pitch / sub) * dpr,
  };
}
