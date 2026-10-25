"use client";

import { useEffect, useRef } from "react";

// Generative dusk ink-wash mountains on a canvas.
//  - fBm (fractal noise) CLOUDS — real density fields, contrast-stretched and
//    lit, not circle puffs. Pre-rendered to a seamless tile and drifted.
//  - Coloured dusk sky: deep indigo with a warm horizon glow and stars.
//  - Opaque ink-wash ridges (dark back -> light front), cool-tinted.
//  - Everything heavy is pre-rendered once; the frame loop is just blits.

type Props = { seed?: number; className?: string };

const LAYERS = 5;
const PAINT_MS = 1800;
const LAYER_STAGGER = 190;

const mulberry = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

// 1D fractal noise — used for the mountain ridgelines.
const makeNoise = (seed: number) => {
  const r = mulberry(seed);
  const n = 1024;
  const g = new Float32Array(n);
  for (let i = 0; i < n; i++) g[i] = r() * 2 - 1;
  const sm = (t: number) => t * t * (3 - 2 * t);
  const noise = (x: number) => {
    const xi = Math.floor(x);
    const xf = x - xi;
    const a = g[((xi % n) + n) % n];
    const b = g[(((xi + 1) % n) + n) % n];
    return a + (b - a) * sm(xf);
  };
  return (x: number, oct: number) => {
    let s = 0;
    let amp = 0.5;
    let f = 1;
    for (let o = 0; o < oct; o++) {
      s += amp * noise(x * f);
      f *= 2;
      amp *= 0.5;
    }
    return s;
  };
};

// 2D value noise that tiles horizontally over `PX` cells — used for clouds, so
// the drifting cloud band wraps seamlessly.
const makeTileNoise = (seed: number, PX: number, PY: number) => {
  const r = mulberry(seed);
  const g = new Float32Array(PX * PY);
  for (let i = 0; i < g.length; i++) g[i] = r();
  const sm = (t: number) => t * t * (3 - 2 * t);
  const at = (xi: number, yi: number) => g[(((yi % PY) + PY) % PY) * PX + (((xi % PX) + PX) % PX)];
  const noise = (x: number, y: number) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = sm(xf);
    const v = sm(yf);
    const a = at(xi, yi) + (at(xi + 1, yi) - at(xi, yi)) * u;
    const b = at(xi, yi + 1) + (at(xi + 1, yi + 1) - at(xi, yi + 1)) * u;
    return a + (b - a) * v;
  };
  return (x: number, y: number, oct: number) => {
    let s = 0;
    let amp = 0.5;
    let f = 1;
    let tot = 0;
    for (let o = 0; o < oct; o++) {
      s += amp * noise(x * f, y * f);
      tot += amp;
      f *= 2;
      amp *= 0.5;
    }
    return s / tot;
  };
};

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const smoothstep = (a: number, b: number, t: number) => {
  const x = clamp01((t - a) / (b - a));
  return x * x * (3 - 2 * x);
};

export function InkMountains({ seed = 7, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = 0;
    let H = 0;
    let dpr = 1;

    const layerNoise = Array.from({ length: LAYERS }, (_, i) => makeNoise(seed * 131 + i * 977));

    // Two cloud layers for depth (period = cells across; smaller = bigger blobs).
    const cloudDefs = [
      { noise: makeTileNoise(seed * 83 + 5, 9, 32), thresh: 0.52, maxA: 0.6, yTop: 0.04, yBot: 0.6, speed: 0.000018, warm: 1 },
      { noise: makeTileNoise(seed * 211 + 9, 16, 32), thresh: 0.55, maxA: 0.32, yTop: 0.02, yBot: 0.42, speed: 0.000009, warm: 0.6 },
    ];
    const cloudState = cloudDefs.map(() => ({ ox: 0 }));

    type Flock = { t: number; y: number; dir: number; n: number; speed: number; seed: number };
    let flocks: Flock[] = [];
    const fr = mulberry(seed * 17 + 3);
    let nextFlock = 3500;

    const ridgeMeta = (i: number) => {
      const t = i / (LAYERS - 1);
      const horizon = H * 0.6;
      return { t, baseY: horizon + t * t * (H * 0.28), amp: H * (0.05 + t * 0.1), freq: 2.6 + t * 3.0, phase: i * 13.7 };
    };

    const ridgeHeight = (x: number, m: ReturnType<typeof ridgeMeta>, nz: (x: number, o: number) => number) => {
      const u = (x / W) * m.freq + m.phase;
      const peak = Math.pow(1 - Math.abs(nz(u * 1.3 + 20, 4)), 1.7);
      const sub = 0.45 * Math.pow(1 - Math.abs(nz(u * 2.7 + 40, 3)), 2);
      const base = 0.25 * nz(u * 0.6, 3);
      return peak * 1.5 + sub + base;
    };

    // Cool-tinted grey so the ink mountains read against the warm sky.
    const cool = (v: number) =>
      `rgb(${Math.round(v * 0.94)},${Math.round(v * 0.98)},${Math.min(255, Math.round(v * 1.07))})`;

    const drawLayerTo = (g: CanvasRenderingContext2D, i: number) => {
      const m = ridgeMeta(i);
      const nz = layerNoise[i];
      const grey = 26 + m.t * 158;
      const pts: [number, number][] = [];
      let minY = H;
      for (let x = 0; x <= W; x += 2) {
        const wob = 1.3 * nz(x * 0.09 + 50, 2);
        const y = m.baseY - m.amp * ridgeHeight(x, m, nz) + wob;
        pts.push([x, y]);
        if (y < minY) minY = y;
      }
      const path = () => {
        g.beginPath();
        g.moveTo(-20, H + 20);
        for (const [x, y] of pts) g.lineTo(x, y);
        g.lineTo(W + 20, H + 20);
        g.closePath();
      };
      g.save();
      g.filter = "blur(1.4px)";
      path();
      const grad = g.createLinearGradient(0, minY - 4, 0, m.baseY + m.amp * 0.6);
      grad.addColorStop(0, cool(grey + 44));
      grad.addColorStop(0.1, cool(grey + 16));
      grad.addColorStop(0.5, cool(grey));
      grad.addColorStop(1, cool(Math.max(12, grey - 26)));
      g.fillStyle = grad;
      g.fill();
      g.filter = "none";
      g.restore();
      g.save();
      g.filter = "blur(1px)";
      g.beginPath();
      pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));
      const rim = Math.min(240, grey + 66);
      g.strokeStyle = cool(rim).replace("rgb", "rgba").replace(")", ",0.45)");
      g.lineWidth = 1.5;
      g.lineJoin = "round";
      g.stroke();
      g.filter = "none";
      g.restore();
      g.save();
      path();
      g.clip();
      const gr = mulberry(seed * 7 + i * 53);
      const specks = Math.floor((W * (H - minY)) / 9000);
      for (let k = 0; k < specks; k++) {
        const x = gr() * W;
        const y = minY + gr() * (H - minY);
        const s = gr() * 1.4 + 0.4;
        g.fillStyle = gr() > 0.5 ? `rgba(255,255,255,${0.015 + gr() * 0.02})` : `rgba(0,0,0,${0.02 + gr() * 0.03})`;
        g.fillRect(x, y, s, s);
      }
      g.restore();
    };

    let layerCanvases: HTMLCanvasElement[] = [];
    let cloudSprites: HTMLCanvasElement[] = [];
    let skySprite: HTMLCanvasElement | null = null;
    let scratch: HTMLCanvasElement | null = null;
    let sctx: CanvasRenderingContext2D | null = null;

    const buildSky = () => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, W * dpr);
      c.height = Math.max(1, H * dpr);
      const g = c.getContext("2d")!;
      g.scale(dpr, dpr);
      // sunset: deep indigo zenith -> plum -> warm rust -> gold at the horizon
      const grad = g.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, "#15162a");
      grad.addColorStop(0.4, "#241d37");
      grad.addColorStop(0.62, "#432a3b");
      grad.addColorStop(0.82, "#7c4735");
      grad.addColorStop(1, "#9c5636");
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
      // warm sun glow low on the horizon
      const glow = g.createRadialGradient(W * 0.5, H * 0.72, 0, W * 0.5, H * 0.72, W * 0.6);
      glow.addColorStop(0, "rgba(246,176,96,0.4)");
      glow.addColorStop(0.35, "rgba(226,120,80,0.18)");
      glow.addColorStop(1, "rgba(226,120,80,0)");
      g.fillStyle = glow;
      g.fillRect(0, 0, W, H);
      // a few faint stars, high in the darker zenith only
      const sr = mulberry(seed * 991 + 2);
      const stars = Math.floor((W * H) / 42000);
      for (let k = 0; k < stars; k++) {
        const y = sr() * H * 0.34;
        const x = sr() * W;
        const s = sr() * 1.1 + 0.3;
        const a = 0.14 + sr() * 0.28;
        g.fillStyle = sr() > 0.5 ? `rgba(220,224,255,${a})` : `rgba(255,255,255,${a})`;
        g.beginPath();
        g.arc(x, y, s, 0, Math.PI * 2);
        g.fill();
      }
      return c;
    };

    const buildCloud = (def: (typeof cloudDefs)[number]) => {
      const cw = 512;
      const ch = Math.max(2, Math.round(H * 0.6));
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const g = c.getContext("2d")!;
      const img = g.createImageData(cw, ch);
      const d = img.data;
      const PX = def.noise === cloudDefs[0].noise ? 9 : 16;
      for (let py = 0; py < ch; py++) {
        const yy = py / ch;
        const win = smoothstep(def.yTop, def.yTop + 0.22, yy) * (1 - smoothstep(def.yBot - 0.2, def.yBot, yy));
        const lit = 150 + (1 - yy) * 74;
        for (let px = 0; px < cw; px++) {
          const nx = (px / cw) * PX;
          const ny = yy * 6 + 1.5;
          const raw = def.noise(nx, ny, 5);
          let dns = (raw - def.thresh) / (1 - def.thresh);
          dns = clamp01(dns) * win;
          dns = Math.pow(dns, 1.15);
          const a = dns * def.maxA;
          const o = (py * cw + px) * 4;
          // warm, peachy sunset-lit cloud (lower clouds a touch warmer)
          const w = def.warm * (0.7 + yy * 0.5);
          d[o] = Math.min(255, lit + 42 * w);
          d[o + 1] = lit - 2 * w;
          d[o + 2] = Math.max(0, lit - 36 * w);
          d[o + 3] = a * 255;
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    };

    const build = () => {
      layerCanvases = Array.from({ length: LAYERS }, (_, i) => {
        const lc = document.createElement("canvas");
        lc.width = Math.max(1, W * dpr);
        lc.height = Math.max(1, H * dpr);
        const g = lc.getContext("2d")!;
        g.scale(dpr, dpr);
        drawLayerTo(g, i);
        return lc;
      });
      cloudSprites = cloudDefs.map((def) => buildCloud(def));
      skySprite = buildSky();
      scratch = document.createElement("canvas");
      scratch.width = Math.max(1, W * dpr);
      scratch.height = Math.max(1, H * dpr);
      sctx = scratch.getContext("2d");
      if (sctx) sctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      W = parent?.clientWidth ?? window.innerWidth;
      H = parent?.clientHeight ?? window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };
    resize();
    window.addEventListener("resize", resize);

    const drawBird = (x: number, y: number, size: number, flap: number) => {
      const lift = Math.sin(flap);
      const wy = -size * 0.5 - lift * size * 0.38;
      ctx.beginPath();
      ctx.moveTo(x - size, y);
      ctx.quadraticCurveTo(x - size * 0.45, y + wy, x, y - size * 0.06);
      ctx.quadraticCurveTo(x + size * 0.45, y + wy, x + size, y);
      ctx.stroke();
    };

    const drawFlocks = (now: number, dt: number) => {
      ctx.strokeStyle = "rgba(226,222,232,0.5)";
      ctx.lineCap = "round";
      for (const f of flocks) {
        if (!reduced) f.t += (dt / 13000) * f.speed;
        const headX = f.dir > 0 ? -W * 0.12 + f.t * (W * 1.24) : W * 1.12 - f.t * (W * 1.24);
        const baseY = f.y * H + Math.sin(now * 0.0013 + f.seed) * H * 0.012;
        for (let b = 0; b < f.n; b++) {
          const rank = Math.ceil(b / 2);
          const side = b === 0 ? 0 : b % 2 ? -1 : 1;
          const size = 12 - rank * 0.6;
          const bx = headX - f.dir * rank * size * 1.9;
          const by = baseY + side * rank * size * 1.2 + Math.sin(now * 0.002 + b) * 2;
          ctx.lineWidth = Math.max(1, size * 0.13);
          drawBird(bx, by, size, now * 0.013 + b * 0.5);
        }
      }
      flocks = flocks.filter((f) => f.t < 1.18);
    };

    let raf = 0;
    let start = 0;
    let last = 0;
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const frame = (now: number) => {
      if (!start) start = now;
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      const scrollP = clamp01(scrollY / Math.max(1, H * 0.9));

      // whole scene fades up on load so nothing pops/flashes
      const introA = reduced ? 1 : clamp01((now - start) / 600);
      canvas.style.opacity = introA >= 1 ? "1" : String(introA);

      if (skySprite) ctx.drawImage(skySprite, 0, 0, W, H);

      // drifting fBm cloud bands (seamless tile, two copies for the wrap)
      const bandH = H * 0.6;
      cloudDefs.forEach((def, idx) => {
        const st = cloudState[idx];
        if (!reduced) st.ox -= def.speed * W * dt;
        let ox = st.ox % W;
        if (ox > 0) ox -= W;
        const sp = cloudSprites[idx];
        if (sp) {
          ctx.drawImage(sp, ox, 0, W, bandH);
          ctx.drawImage(sp, ox + W, 0, W, bandH);
        }
      });

      if (!reduced) {
        nextFlock -= dt;
        if (nextFlock <= 0) {
          flocks.push({
            t: 0,
            y: 0.12 + fr() * 0.2,
            dir: fr() > 0.5 ? 1 : -1,
            n: 4 + Math.floor(fr() * 4),
            speed: 0.8 + fr() * 0.5,
            seed: fr() * 10,
          });
          nextFlock = 12000 + fr() * 9000;
        }
      }
      drawFlocks(now, dt);

      for (let i = 0; i < LAYERS; i++) {
        const m = ridgeMeta(i);
        const paint = reduced
          ? 1
          : easeOut(clamp01((now - start - i * LAYER_STAGGER) / (PAINT_MS - (LAYERS - 1) * LAYER_STAGGER)));
        if (paint <= 0) continue;
        const shift = scrollP * (30 + m.t * 150);
        if (paint >= 1 || !sctx || !scratch) {
          ctx.drawImage(layerCanvases[i], 0, shift, W, H);
          continue;
        }
        // soft-edged left -> right reveal (feathered, not a hard wipe)
        const revealX = paint * W;
        const feather = Math.min(160, W * 0.14);
        sctx.clearRect(0, 0, W, H);
        sctx.globalCompositeOperation = "source-over";
        sctx.drawImage(layerCanvases[i], 0, shift, W, H);
        sctx.globalCompositeOperation = "destination-in";
        const mg = sctx.createLinearGradient(0, 0, W, 0);
        const edge = clamp01(revealX / W);
        const soft = clamp01((revealX - feather) / W);
        mg.addColorStop(0, "rgba(0,0,0,1)");
        mg.addColorStop(soft, "rgba(0,0,0,1)");
        mg.addColorStop(edge, "rgba(0,0,0,0)");
        mg.addColorStop(1, "rgba(0,0,0,0)");
        sctx.fillStyle = mg;
        sctx.fillRect(0, 0, W, H);
        sctx.globalCompositeOperation = "source-over";
        ctx.drawImage(scratch, 0, 0, W, H);
      }

      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [seed]);

  // No grain overlay here — the site's global body::after grain already
  // covers this element, so adding a second one would double up the texture.
  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
