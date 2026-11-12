"use client";

import { useEffect, useRef } from "react";

// Generative dusk ink-wash mountains on a canvas.
//  - fBm (fractal noise) CLOUDS — real density fields, contrast-stretched and
//    lit, not circle puffs. Pre-rendered to a seamless tile and drifted.
//  - Coloured dusk sky: deep indigo with a warm horizon glow and stars.
//  - Backlit ridges: a near-black silhouette in front, stepping back through
//    plum and mauve to a rose haze at the horizon.
//  - Everything heavy is pre-rendered once; the frame loop is just blits.
//  - Publishes the sun's top edge as the CSS variable --sun-top so page
//    content can sit relative to it without duplicating the layout maths.

// `active` pauses drawing (the loop parks itself and restarts) while the scene is
// faded out behind another page, so it costs nothing there.
type Props = { seed?: number; className?: string; active?: boolean };

const LAYERS = 5;
const PAINT_MS = 1800;
const LAYER_STAGGER = 190;
// Intro choreography, in ms of scene time: sky fades up over SKY_FADE_MS,
// clouds ease in between CLOUD_FADE_START and _END, and the ridges start
// sweeping in once the sky is mostly there.
const SKY_FADE_MS = 1600;
const CLOUD_FADE_START = 400;
const CLOUD_FADE_END = 3200;
const MOUNTAIN_DELAY = 500;

// Pointer parallax. Every layer shifts opposite the pointer by an amount that
// grows with nearness, which is what sells depth. Values are fractions of the
// viewport width/height at full pointer deflection: the farthest ridge barely
// moves, the nearest moves the most. Each layer is drawn slightly oversized by
// its own shift so an edge never shows.
const PARALLAX_X_FAR = 0.004;
const PARALLAX_X_NEAR = 0.03;
const PARALLAX_Y_FAR = 0.002;
const PARALLAX_Y_NEAR = 0.012;
const PARALLAX_SKY_X = 0.002;
const PARALLAX_CLOUD_X = [0.006, 0.003, 0.009]; // per cloud layer
// time constant of the easing toward the pointer, in ms (bigger = floatier)
const PARALLAX_EASE_MS = 260;

// Static stand-in for the sky, painted by CSS on first paint (server-rendered,
// no JS needed) so the page is never black while the canvas is built. Colours
// are the SKY_AMBIENT stops placed at the heights the canvas puts them, plus a
// soft glow where the sun is, so the canvas crossfades into something close.
const PLACEHOLDER_SKY = [
  "radial-gradient(ellipse 60% 22% at 50% 54%, rgba(255,214,150,0.85) 0%, rgba(246,150,90,0.35) 45%, rgba(246,150,90,0) 100%)",
  "linear-gradient(to bottom, #10143a 0%, #282868 15%, #5a428e 30%, #a0588c 42%, #d4687a 49.8%, #ee826c 55.8%, #f29868 60%, #f29868 100%)",
].join(", ");

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

type RGB = [number, number, number];
const mix = (a: RGB, b: RGB, k: number): RGB => [
  a[0] + (b[0] - a[0]) * k,
  a[1] + (b[1] - a[1]) * k,
  a[2] + (b[2] - a[2]) * k,
];
const rgba = (c: RGB, a: number) => `rgba(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])},${a})`;

// Sunset palette shared by the sky and the ridges so they stay in agreement.
const GLOW: RGB = [226, 128, 84]; // low-sun rose-gold
const HOT: RGB = [255, 206, 140]; // the sun's own light

// Piecewise colour ramp, eased between stops so there are no visible kinks.
const ramp = (stops: [number, RGB][], t: number): RGB => {
  if (t <= stops[0][0]) return stops[0][1];
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) return mix(stops[i - 1][1], stops[i][1], smoothstep(stops[i - 1][0], stops[i][0], t));
  }
  return stops[stops.length - 1][1];
};

// Ambient twilight by height above the horizon (0 = horizon, 1 = zenith):
// salmon Belt of Venus, rose, magenta-violet, violet-blue, deep indigo.
const SKY_AMBIENT: [number, RGB][] = [
  [0, [242, 152, 104]],
  [0.07, [238, 130, 108]],
  [0.17, [212, 104, 122]],
  [0.3, [160, 88, 140]],
  [0.5, [90, 66, 142]],
  [0.75, [40, 40, 104]],
  [1, [16, 20, 58]],
];

// The sun's aureole by (squashed) distance from the sun: the path-length
// reddening sequence, white-gold core out to red, crimson and violet.
const SKY_AUREOLE: [number, RGB][] = [
  [0, [255, 246, 220]],
  [0.025, [255, 228, 164]],
  [0.07, [255, 198, 104]],
  [0.14, [255, 154, 72]],
  [0.26, [240, 104, 58]],
  [0.42, [200, 64, 74]],
  [0.62, [140, 50, 100]],
  [1, [84, 44, 104]],
];

// Cloud tint by height: lit orange low and close to the sun, pink-coral, then
// lilac and cool lavender high up where the light is weakest.
const CLOUD_TINT: [number, RGB][] = [
  [0, [255, 184, 100]],
  [0.12, [255, 168, 108]],
  [0.3, [255, 146, 152]],
  [0.5, [252, 152, 196]],
  [0.75, [232, 162, 226]],
  [1, [190, 164, 240]],
];

// Ridge body colour by depth (0 = nearest, 1 = farthest): a backlit
// near-black indigo silhouette stepping back through plum and mauve to a
// dusty rose that has taken on the colour of the horizon haze.
// Forested now: deep pine green up close, stepping back through fern and moss
// to a sage that has taken on the golden haze. Still backlit, so the near
// ranges stay dark, but dark green rather than black.
const FOREST: RGB = [8, 26, 20];
const RIDGE_TONE: [number, RGB][] = [
  [0, [14, 44, 32]],
  [0.25, [28, 72, 44]],
  [0.5, [56, 98, 64]],
  [0.75, [92, 124, 112]],
  [1, [148, 140, 176]],
];

export function InkMountains({ seed = 7, className, active = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  // restarts the draw loop after it parked itself while inactive
  const wakeRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    activeRef.current = active;
    if (active) wakeRef.current?.();
  }, [active]);

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

    // Three cloud layers for depth. px = noise cells across the tile (smaller =
    // bigger blobs), ys = noise cells down it (smaller = more stretched), and
    // yTop/yBot are fractions of the sprite, which spans sky top to horizon.
    // The third is a low, stretched bank: the streaky clouds hugging the
    // horizon are the ones the setting sun lights up orange.
    const cloudDefs = [
      { noise: makeTileNoise(seed * 83 + 5, 9, 32), px: 9, ys: 6, thresh: 0.5, maxA: 0.85, yTop: 0.04, yBot: 0.6, speed: 0.000018 },
      { noise: makeTileNoise(seed * 211 + 9, 16, 32), px: 16, ys: 6, thresh: 0.53, maxA: 0.55, yTop: 0.02, yBot: 0.42, speed: 0.000009 },
      { noise: makeTileNoise(seed * 307 + 3, 7, 32), px: 7, ys: 11, thresh: 0.48, maxA: 0.8, yTop: 0.5, yBot: 1.0, speed: 0.000012 },
    ];
    const cloudState = cloudDefs.map(() => ({ ox: 0 }));

    type Flock = { t: number; y: number; dir: number; n: number; speed: number; seed: number };
    let flocks: Flock[] = [];
    const fr = mulberry(seed * 17 + 3);
    let nextFlock = 3500;

    // Shooting stars: rare, quick, and only in the dark upper sky where the
    // static stars are. Like a real shower they all radiate from one point, so
    // their directions agree to within a spread instead of being random. Most
    // are faint, a few are bright. Each flares fast, burns out, and leaves a
    // faint train that lingers a moment after the head is gone.
    type Meteor = {
      x: number; y: number; dx: number; dy: number; travel: number;
      dur: number; age: number; w: number; b: number; ph: number;
    };
    let meteors: Meteor[] = [];
    const mr = mulberry(seed * 41 + 7);
    const showerDir = mr() > 0.5 ? 1 : -1;
    const showerAng = (22 + mr() * 14) * (Math.PI / 180); // below horizontal
    const TRAIN_MS = 500;
    let nextMeteor = 7000 + mr() * 5000;

    const ridgeMeta = (i: number) => {
      const t = i / (LAYERS - 1);
      const horizon = H * 0.6;
      // Far ranges are the tall, sharp ones (big mountains seen from a distance);
      // the near ranges are lower forested foothills.
      return { t, baseY: horizon + t * t * (H * 0.28), amp: H * (0.15 - t * 0.04), phase: i * 13.7 };
    };

    // Each layer is a few distinct massifs (bell-shaped peaks with their own
    // width, height, left/right skew and flank concavity) joined by smooth
    // saddles, the way a real range reads: a handful of recognisable summits,
    // not an even comb of teeth. Same idea as the single-bell mountains in
    // the Shan Shui generator, but several per layer so layers overlap.
    type Massif = { c: number; wl: number; wr: number; h: number; sharp: number };
    const layerMassifs: Massif[][] = Array.from({ length: LAYERS }, (_, i) => {
      const r = mulberry(seed * 389 + i * 7919);
      const count = 3 + Math.floor(r() * 2);
      const lead = Math.floor(r() * count);
      return Array.from({ length: count }, (_, k) => ({
        c: ((k + 0.5 + (r() - 0.5) * 0.7) / count) * 1.2 - 0.1,
        wl: 0.16 + r() * 0.16,
        wr: 0.16 + r() * 0.16,
        h: k === lead ? 1 : 0.45 + r() * 0.4,
        sharp: 1.25 + r() * 0.7 + (1 - i / (LAYERS - 1)) * 0.7,
      }));
    });

    // The nearest range must not stack its summits on the ridge behind it (the
    // two tips merge into one lumpy peak), so shift any that line up to the right.
    {
      const front = layerMassifs[LAYERS - 1];
      const behind = layerMassifs[LAYERS - 2];
      for (const p of front) {
        if (behind.some((q) => Math.abs(q.c - p.c) < 0.06)) p.c += 0.13;
      }
    }

    const ridgeHeight = (
      x: number,
      m: ReturnType<typeof ridgeMeta>,
      nz: (x: number, o: number) => number,
      ms: Massif[],
    ) => {
      const nx = x / W;
      let v = 0;
      for (const p of ms) {
        const a = Math.abs((nx - p.c) / (nx < p.c ? p.wl : p.wr));
        if (a >= 1) continue;
        const s = p.h * Math.pow(1 - a, p.sharp);
        // smooth max, so saddles between summits are rounded, not V-notched
        const k = 0.14;
        const hh = Math.max(k - Math.abs(v - s), 0) / k;
        v = Math.max(v, s) + hh * hh * k * 0.25;
      }
      const u = nx * 9 + m.phase;
      // crags and spurs scale with height: crests get rough, low ground stays soft
      const crag = nz(u * 2.2 + 17, 4) * 0.28 * (0.25 + v);
      const spur = 0.07 * Math.pow(1 - Math.abs(nz(u * 3.1 + 41, 3) * 2), 2) * v;
      return Math.max(0, v + crag * 0.4 + spur) * 1.5;
    };

    // The sun sits low and dead centre, BEHIND the farthest range: its disc is
    // dropped to just over half-clear of that range's silhouette at its x, so
    // it reads as setting behind the peaks and the sky/ridge lighting below can
    // both key off the same point.
    const sunPos = () => {
      const m0 = ridgeMeta(0);
      const x = W * 0.5;
      const r = Math.max(10, H * 0.032);
      const ridge = m0.baseY - m0.amp * ridgeHeight(x, m0, layerNoise[0], layerMassifs[0]);
      return { x, y: ridge - r * 0.1, r };
    };

    const drawLayerTo = (g: CanvasRenderingContext2D, i: number) => {
      const m = ridgeMeta(i);
      const nz = layerNoise[i];
      const sun = sunPos();
      const yFloor = m.baseY + m.amp * 0.6;
      const pts: [number, number][] = [];
      let minY = H;
      for (let x = 0; x <= W; x += 2) {
        const wob = 1.1 * nz(x * 0.09 + 50, 2);
        const y = m.baseY - m.amp * ridgeHeight(x, m, nz, layerMassifs[i]) + wob;
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

      // Atmospheric haze: distant peak tips (low t) fade softly into the sky
      // instead of holding a hard opaque edge, the way real far ridgelines
      // dissolve into mist. Near layers stay fully opaque — only the top
      // sliver of each silhouette loses alpha, so this never reads as
      // see-through the way a fully translucent wash did.
      const hazeTip = 1 - m.t; // 0 for the frontmost layer, 1 for the farthest

      // Backlit tone. The sun is behind every range, so the faces we see are
      // all in shadow: the nearest range is a near-black silhouette, and each
      // step back scatters more of the sky's rose-gold and lifts toward
      // mauve, the way real far ridges dissolve into the sunset haze.
      const base = ramp(RIDGE_TONE, hazeTip);
      const crest = mix(base, GLOW, 0.22 * hazeTip + 0.06);
      g.save();
      g.filter = "blur(1.4px)";
      path();
      const grad = g.createLinearGradient(0, minY - 4, 0, yFloor);
      grad.addColorStop(0, rgba(crest, 1 - hazeTip * 0.58));
      grad.addColorStop(0.12, rgba(mix(base, crest, 0.5), 1 - hazeTip * 0.22));
      grad.addColorStop(0.3, rgba(base, 1));
      grad.addColorStop(0.6, rgba(base, 1));
      grad.addColorStop(1, rgba(mix(base, FOREST, 0.4), 1));
      g.fillStyle = grad;
      g.fill();
      g.filter = "none";
      g.restore();

      // Lighting. Slopes tilted toward the sun catch a little warm sky light;
      // the far flank falls into shadow. +1 lit, -1 shade, 0 flat; measured
      // over a wide window so crag noise doesn't flicker it.
      const sunX = sun.x;
      const fc = pts.map(([x], k) => {
        const dy = pts[Math.min(pts.length - 1, k + 6)][1] - pts[Math.max(0, k - 6)][1];
        if (Math.abs(dy) < 1.2) return 0;
        return dy * (x < sunX ? 1 : -1) > 0 ? 1 : -1;
      });
      const runs = (want: number, cb: (k: number, e: number) => void) => {
        let k = 0;
        while (k < pts.length) {
          if (fc[k] !== want) {
            k++;
            continue;
          }
          let e = k;
          while (e + 1 < pts.length && fc[e + 1] === want) e++;
          if (e - k >= 6) cb(k, e);
          k = e + 1;
        }
      };
      const strip = (want: number, depth: number, c0: string, c1: string) => {
        runs(want, (k, e) => {
          let top = H;
          for (let q = k; q <= e; q++) top = Math.min(top, pts[q][1]);
          g.beginPath();
          for (let q = k; q <= e; q++) { if (q === k) g.moveTo(pts[q][0], pts[q][1]); else g.lineTo(pts[q][0], pts[q][1]); }
          // taper to nothing at both ends so a strip never leaves a hard
          // vertical crease where a lit run meets a shaded one at a summit
          for (let q = e; q >= k; q--) {
            const tp = smoothstep(0, 14, Math.min(q - k, e - q));
            g.lineTo(pts[q][0], pts[q][1] + tp * depth * Math.max(0, yFloor - pts[q][1]));
          }
          g.closePath();
          const sg = g.createLinearGradient(0, top, 0, top + depth * Math.max(1, yFloor - top));
          sg.addColorStop(0, c0);
          sg.addColorStop(1, c1);
          g.fillStyle = sg;
          g.fill();
        });
      };

      // Mist colour: warm gold-rose for the far range, dusky mauve up close.
      const hz = mix([70, 104, 90], [196, 150, 164], Math.pow(hazeTip, 1.1)).map(Math.round);
      // Backlit, so near ranges get almost no fill light; far ones get more.
      const lightA = 0.26 * (0.3 + hazeTip * 0.7);

      g.save();
      path();
      g.clip();

      // Soft form shading (blurred so the strips have no hard lower edge).
      g.save();
      g.filter = "blur(5px)";
      strip(1, 0.45, `rgba(255,170,110,${lightA})`, "rgba(255,170,110,0)");
      strip(-1, 0.55, "rgba(4,18,12,0.3)", "rgba(4,18,12,0)");
      g.filter = "none";
      g.restore();

      // Forward-scattered sunlight: air between us and the sun glows, so
      // ridges near it wash out toward warm gold, strongest on the far ranges
      // (more air) and fading toward the edges of the scene. Squashed
      // vertically because the glow hugs the horizon.
      g.save();
      g.translate(sun.x, sun.y);
      g.scale(1, 0.55);
      const veil = g.createRadialGradient(0, 0, 0, 0, 0, W * 0.55);
      const veilA = 0.08 + hazeTip * 0.24;
      veil.addColorStop(0, rgba(HOT, veilA));
      veil.addColorStop(0.3, rgba(GLOW, veilA * 0.55));
      veil.addColorStop(1, rgba(GLOW, 0));
      g.fillStyle = veil;
      g.fillRect(-W, -H * 2, W * 2, H * 4);
      g.restore();

      // Contour-following texture strokes (cun fa): short runs that trace the
      // silhouette's own shape, offset down the slope, confined to one flank
      // each so their light matches the shading. Concentrated on flanks, kept
      // off flats, faint — texture, not outlines.
      const sr = mulberry(seed * 13 + i * 131);
      const nStroke = Math.floor((W / 20) * (0.35 + m.t * 1.1));
      g.lineCap = "round";
      for (let s = 0; s < nStroke; s++) {
        const k0 = Math.floor(sr() * pts.length);
        const dir = fc[k0];
        const keep = sr();
        const len = 10 + Math.floor(sr() * 38);
        const f = Math.pow(sr(), 1.5) * 0.7;
        const ph = sr() * 6.28;
        const a = (0.05 + sr() * 0.13) * (0.45 + m.t * 0.8);
        const lw = (0.5 + sr() * 1.1) * (0.7 + m.t * 0.8);
        if (dir === 0 && keep < 0.7) continue;
        g.strokeStyle = dir > 0 ? `rgba(255,200,130,${a * 0.5})` : `rgba(4,18,12,${a * 1.3})`;
        g.lineWidth = lw;
        g.beginPath();
        for (let k = k0; k <= Math.min(pts.length - 1, k0 + len) && (dir === 0 || fc[k] === dir); k++) {
          const [x, yr] = pts[k];
          const y = yr + f * Math.max(0, yFloor - yr) * 0.6 + Math.sin(x * 0.07 + ph) * 1.1;
          if (k === k0) g.moveTo(x, y);
          else g.lineTo(x, y);
        }
        g.stroke();
      }

      // Mist pools in the valleys: low ground (where the ridge dips toward
      // baseY) gets hazy, summits stay crisp.
      const mg = g.createLinearGradient(0, m.baseY - m.amp * 0.85, 0, m.baseY + m.amp * 0.15);
      mg.addColorStop(0, `rgba(${hz},0)`);
      mg.addColorStop(1, `rgba(${hz},${0.62 * (1 - m.t * 0.85)})`);
      g.fillStyle = mg;
      g.fillRect(0, 0, W, H);
      g.restore();

      // Forest, the way flat layered landscape illustrations do it. The far
      // and middle ranges get only a very fine, even tree-edge along the crest
      // (a texture, not individual trees); the two nearest ranges get real
      // pines, grown in groves on the lower slopes rather than scattered, in
      // one dark tone with no highlights. Summits and steep faces stay bare.
      {
        const tr = mulberry(seed * 17 + i * 211);
        const near = m.t >= 0.7;
        const treeTone = mix(base, FOREST, near ? 0.55 : 0.28 + 0.3 * m.t);
        const fade = 1 - hazeTip * 0.25;
        const treeline = minY + (yFloor - minY) * (near ? 0.14 : 0.08);
        // smooth 0..1 field: where a grove stands
        const grove = (x: number) => smoothstep(-0.12, 0.22, nz(x * 0.011 + 90, 2));
        // a narrow three-tier pine
        const pine = (x: number, by: number, h: number, w: number) => {
          g.beginPath();
          g.moveTo(x, by - h);
          g.lineTo(x + w * 0.42, by - h * 0.64);
          g.lineTo(x + w * 0.2, by - h * 0.64);
          g.lineTo(x + w * 0.68, by - h * 0.3);
          g.lineTo(x + w * 0.28, by - h * 0.3);
          g.lineTo(x + w, by);
          g.lineTo(x - w, by);
          g.lineTo(x - w * 0.28, by - h * 0.3);
          g.lineTo(x - w * 0.68, by - h * 0.3);
          g.lineTo(x - w * 0.2, by - h * 0.64);
          g.lineTo(x - w * 0.42, by - h * 0.64);
          g.closePath();
          g.fill();
        };
        g.fillStyle = rgba(treeTone, fade);
        if (!near) {
          // fine tree-edge along the crest
          for (let k = 4; k < pts.length - 4; k += 2) {
            const [x, y] = pts[k];
            if (y < treeline || grove(x) < 0.25) continue;
            if (Math.abs(pts[k + 4][1] - pts[k - 4][1]) > 12) continue;
            const h = (2.5 + tr() * 3.5) * (0.7 + m.t * 1.2) * (0.6 + grove(x) * 0.6);
            pine(x, y + 1.5, h, h * 0.36);
          }
        } else {
          type Tree = { x: number; y: number; h: number };
          const trees: Tree[] = [];
          const rows = m.t >= 1 ? 4 : 2;
          const depth = m.amp * (m.t >= 1 ? 0.7 : 0.4);
          for (let k = 4; k < pts.length - 4; k += 3) {
            const [x, yr] = pts[k];
            if (yr < treeline) continue;
            const gv = grove(x);
            if (gv < 0.35) continue;
            for (let r = 0; r < rows; r++) {
              const f = (r + tr() * 0.8) / rows;
              if (tr() > gv * (0.85 - f * 0.25)) continue;
              const y = yr + 3 + f * depth;
              trees.push({
                x: x + (tr() - 0.5) * 8,
                y,
                h: (13 + tr() * 17) * (0.8 + f * 0.5),
              });
            }
          }
          trees.sort((a, b) => a.y - b.y);
          for (const t of trees) pine(t.x, t.y, t.h, t.h * 0.2);
        }
      }

      // Rim light. With the sun behind the ridge, the crest itself is what
      // catches it, on both slopes: a thin gold edge that burns brightest next
      // to the sun and fades to almost nothing toward the sides of the scene.
      const sxn = sun.x / W;
      const rimG = g.createLinearGradient(0, 0, W, 0);
      const rimA = (k: number) => rgba(HOT, (0.02 + 0.5 * k * k) * (0.55 + hazeTip * 0.45));
      rimG.addColorStop(0, rimA(0));
      rimG.addColorStop(Math.max(0, sxn - 0.3), rimA(0.2));
      rimG.addColorStop(sxn, rimA(1));
      rimG.addColorStop(Math.min(1, sxn + 0.3), rimA(0.2));
      rimG.addColorStop(1, rimA(0));
      g.save();
      g.filter = "blur(0.8px)";
      g.beginPath();
      pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y)));
      g.strokeStyle = rimG;
      g.lineWidth = 1.5;
      g.lineJoin = "round";
      g.stroke();
      g.filter = "none";
      g.restore();

      // Drifting mist banks between this range and the next, painted into the
      // layer so they sit over this ridge and under the nearer one.
      if (m.t < 1) {
        const mr = mulberry(seed * 29 + i * 61);
        for (let s = 0; s < 3; s++) {
          const cx = mr() * W;
          const cy = m.baseY - m.amp * (0.05 + mr() * 0.3);
          const rx = W * (0.14 + mr() * 0.2);
          const ry = Math.max(6, H * (0.012 + mr() * 0.014));
          g.save();
          g.translate(cx, cy);
          g.scale(1, ry / rx);
          const rg = g.createRadialGradient(0, 0, 0, 0, 0, rx);
          rg.addColorStop(0, `rgba(${hz},${0.2 * (1 - m.t * 0.6)})`);
          rg.addColorStop(1, `rgba(${hz},0)`);
          g.fillStyle = rg;
          g.beginPath();
          g.arc(0, 0, rx, 0, Math.PI * 2);
          g.fill();
          g.restore();
        }
      }

      // Subtle pigment granulation within the wash.
      g.save();
      path();
      g.clip();
      const gr = mulberry(seed * 7 + i * 53);
      const specks = Math.floor((W * (H - minY)) / 11000);
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
    // cloud compositing runs at half resolution: clouds are soft anyway
    const cloudScale = 0.5;
    let cloudMask: HTMLCanvasElement | null = null;
    let cloudLayer: HTMLCanvasElement | null = null;
    let cloudTint: HTMLCanvasElement | null = null;
    let cmx: CanvasRenderingContext2D | null = null;
    let clx: CanvasRenderingContext2D | null = null;
    let skySprite: HTMLCanvasElement | null = null;
    let scratch: HTMLCanvasElement | null = null;
    let sctx: CanvasRenderingContext2D | null = null;

    const buildSky = () => {
      const c = document.createElement("canvas");
      c.width = Math.max(1, W * dpr);
      c.height = Math.max(1, H * dpr);
      const g = c.getContext("2d")!;
      g.scale(dpr, dpr);
      // Per-pixel sunset sky, built from the two things that actually make
      // one. (1) An ambient twilight gradient: deep blue overhead, through
      // violet and magenta to a salmon-pink band at the horizon (the Belt of
      // Venus). (2) The sun's own aureole, whose colour runs gold, orange,
      // red, crimson, violet with distance from the sun, because the light
      // reaching us has crossed so much air that blue is gone and only the
      // red end survives. The aureole is squashed so it hugs the horizon.
      // Computed at half resolution (it is all smooth) and scaled up.
      const horizonY = H * 0.6;
      const sun = sunPos();
      const LUT = 256;
      const lutA = new Float32Array(LUT * 3);
      const lutG = new Float32Array(LUT * 3);
      for (let k = 0; k < LUT; k++) {
        const ca = ramp(SKY_AMBIENT, k / (LUT - 1));
        const cg = ramp(SKY_AUREOLE, k / (LUT - 1));
        for (let q = 0; q < 3; q++) {
          lutA[k * 3 + q] = ca[q];
          lutG[k * 3 + q] = cg[q];
        }
      }
      const SS = 0.5;
      const sw = Math.max(1, Math.ceil(W * SS));
      const sh = Math.max(1, Math.ceil(H * SS));
      const sky = document.createElement("canvas");
      sky.width = sw;
      sky.height = sh;
      const sg = sky.getContext("2d")!;
      const simg = sg.createImageData(sw, sh);
      const sd = simg.data;
      const dr = mulberry(seed * 5 + 1);
      for (let py = 0; py < sh; py++) {
        const y = (py + 0.5) / SS;
        const hh = clamp01((horizonY - y) / horizonY);
        const ai = Math.min(LUT - 1, Math.floor(Math.pow(hh, 0.85) * (LUT - 1))) * 3;
        for (let px = 0; px < sw; px++) {
          const x = (px + 0.5) / SS;
          const dist = Math.hypot((x - sun.x) / W, ((y - sun.y) / H) * 2.3);
          const w = 0.96 * Math.exp(-Math.pow(dist / 0.46, 1.25));
          const gi = Math.min(LUT - 1, Math.floor(dist * (LUT - 1))) * 3;
          const o = (py * sw + px) * 4;
          const n = (dr() - 0.5) * 2; // dither, so the long gradients don't band
          sd[o] = lutA[ai] + (lutG[gi] - lutA[ai]) * w + n;
          sd[o + 1] = lutA[ai + 1] + (lutG[gi + 1] - lutA[ai + 1]) * w + n;
          sd[o + 2] = lutA[ai + 2] + (lutG[gi + 2] - lutA[ai + 2]) * w + n;
          sd[o + 3] = 255;
        }
      }
      sg.putImageData(simg, 0, 0);
      g.imageSmoothingEnabled = true;
      g.drawImage(sky, 0, 0, W, H);

      // Crepuscular rays: shafts of light fanning up from behind the ridge.
      g.save();
      g.globalCompositeOperation = "screen";
      g.filter = "blur(9px)";
      const rr = mulberry(seed * 53 + 11);
      const RAYS = 12;
      for (let k = 0; k < RAYS; k++) {
        const ang = -Math.PI * (0.05 + (0.9 * (k + rr() * 0.7)) / RAYS);
        const half = 0.02 + rr() * 0.05;
        const len = W * (0.4 + rr() * 0.4);
        const a = 0.012 + rr() * 0.03;
        const x1 = sun.x + Math.cos(ang - half) * len;
        const y1 = sun.y + Math.sin(ang - half) * len;
        const x2 = sun.x + Math.cos(ang + half) * len;
        const y2 = sun.y + Math.sin(ang + half) * len;
        const rg = g.createLinearGradient(sun.x, sun.y, sun.x + Math.cos(ang) * len, sun.y + Math.sin(ang) * len);
        rg.addColorStop(0, rgba(HOT, a));
        rg.addColorStop(1, rgba(HOT, 0));
        g.fillStyle = rg;
        g.beginPath();
        g.moveTo(sun.x, sun.y);
        g.lineTo(x1, y1);
        g.lineTo(x2, y2);
        g.closePath();
        g.fill();
      }
      g.restore();

      // The sun itself.
      const disc = g.createRadialGradient(sun.x, sun.y, 0, sun.x, sun.y, sun.r);
      disc.addColorStop(0, "rgba(255,250,232,1)");
      disc.addColorStop(0.8, "rgba(255,232,176,1)");
      disc.addColorStop(1, "rgba(255,210,140,0.85)");
      g.fillStyle = disc;
      g.beginPath();
      g.arc(sun.x, sun.y, sun.r, 0, Math.PI * 2);
      g.fill();
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

    // Cloud sprites carry shape + self-shading as grey luminance (colour is
    // applied later from the sunset tint). Lit from a low sun: undersides and
    // thin edges glow, tops and dense cores fall into shadow.
    const buildCloud = (def: (typeof cloudDefs)[number]) => {
      const cw = 512;
      const ch = Math.max(2, Math.round(H * 0.6));
      const c = document.createElement("canvas");
      c.width = cw;
      c.height = ch;
      const g = c.getContext("2d")!;
      const img = g.createImageData(cw, ch);
      const d = img.data;
      const dens = new Float32Array(cw * ch);
      for (let py = 0; py < ch; py++) {
        const yy = py / ch;
        const win = smoothstep(def.yTop, def.yTop + 0.22, yy) * (1 - smoothstep(def.yBot - 0.2, def.yBot, yy));
        for (let px = 0; px < cw; px++) {
          const raw = def.noise((px / cw) * def.px, yy * def.ys + 1.5, 5);
          dens[py * cw + px] = Math.pow(clamp01((raw - def.thresh) / (1 - def.thresh)) * win, 1.15);
        }
      }
      const below = 5;
      for (let py = 0; py < ch; py++) {
        for (let px = 0; px < cw; px++) {
          const dn = dens[py * cw + px];
          const o = (py * cw + px) * 4;
          if (dn <= 0) {
            d[o + 3] = 0;
            continue;
          }
          // density just below: higher means we are on a top edge (shadowed),
          // lower means a bottom edge (catching the low sun)
          const gdy = dens[Math.min(ch - 1, py + below) * cw + px] - dn;
          const silver = 1 - smoothstep(0, 0.35, dn);
          const L = Math.max(110, Math.min(255, 255 - 330 * gdy - 45 * dn + 20 * silver));
          d[o] = L;
          d[o + 1] = L;
          d[o + 2] = L * 0.98;
          d[o + 3] = dn * def.maxA * 255;
        }
      }
      g.putImageData(img, 0, 0);
      return c;
    };

    const buildCloudTint = (c: HTMLCanvasElement) => {
      const g = c.getContext("2d")!;
      const img = g.createImageData(c.width, c.height);
      const d = img.data;
      const horizonY = H * 0.6;
      const sun = sunPos();
      for (let py = 0; py < c.height; py++) {
        const y = (py + 0.5) / cloudScale;
        const e = clamp01((horizonY - y) / horizonY);
        const base = ramp(CLOUD_TINT, e);
        const dim = 1 - 0.12 * e; // higher clouds are further from the light
        for (let px = 0; px < c.width; px++) {
          const x = (px + 0.5) / cloudScale;
          const dist = Math.hypot((x - sun.x) / W, ((y - sun.y) / H) * 1.6);
          const col = mix(base, HOT, 0.6 * Math.exp(-Math.pow(dist / 0.32, 1.4)));
          const o = (py * c.width + px) * 4;
          d[o] = col[0] * dim;
          d[o + 1] = col[1] * dim;
          d[o + 2] = col[2] * dim;
          d[o + 3] = 255;
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
      const mk = () => {
        const c = document.createElement("canvas");
        c.width = Math.max(1, Math.ceil(W * cloudScale));
        c.height = Math.max(1, Math.ceil(H * 0.6 * cloudScale));
        return c;
      };
      cloudMask = mk();
      cloudLayer = mk();
      cloudTint = buildCloudTint(mk());
      cmx = cloudMask.getContext("2d");
      clx = cloudLayer.getContext("2d");
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
      const sun = sunPos();
      document.documentElement.style.setProperty("--sun-top", `${sun.y - sun.r}px`);
    };
    resize();

    // A rebuild regenerates every ridge, the sky and the cloud sprites, so it
    // is debounced, and skipped when only the height changed slightly (mobile
    // browser toolbars showing and hiding) since the scene would barely move.
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        const parent = canvas.parentElement;
        const nextW = parent?.clientWidth ?? window.innerWidth;
        const nextH = parent?.clientHeight ?? window.innerHeight;
        if (nextW === W && Math.abs(nextH - H) <= H * 0.2) return;
        resize();
      }, 150);
    };
    window.addEventListener("resize", onResize);

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

    const drawMeteors = (dt: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "butt";
      const SEG = 16;
      for (const m of meteors) {
        m.age += dt;
        const p = clamp01(m.age / m.dur);
        const burned = m.age >= m.dur;
        // sharp flare, then a slower decay; a little flicker from tumbling
        const flare = p < 0.14 ? p / 0.14 : Math.exp(-(p - 0.14) * 2.6);
        const flick = 1 + 0.18 * Math.sin(m.age * 0.11 + m.ph);
        const env = burned ? 0 : flare * flick * Math.min(1, (1 - p) * 6);
        const train = burned ? Math.exp(-(m.age - m.dur) / (TRAIN_MS * 0.4)) : 1;
        const hx = m.x + m.dx * m.travel * p;
        const hy = m.y + m.dy * m.travel * p;
        // tail trails the head by up to half the path; fades with it
        const tailLen = Math.min(m.travel * p, m.travel * 0.5);
        const tx = hx - m.dx * tailLen;
        const ty = hy - m.dy * tailLen;
        // darker sky (higher up) shows them better
        const sky = clamp01(1 - m.y / (H * 0.42));
        const A = m.b * (0.35 + 0.65 * sky);
        for (let i = 0; i < SEG; i++) {
          const t0 = i / SEG;
          const t1 = (i + 1) / SEG;
          const x0 = tx + (hx - tx) * t0;
          const y0 = ty + (hy - ty) * t0;
          const x1 = tx + (hx - tx) * t1;
          const y1 = ty + (hy - ty) * t1;
          const tm = (t0 + t1) / 2;
          const a = burned ? A * 0.3 * train * Math.pow(tm, 1.4) : A * env * Math.pow(tm, 2.2);
          if (a < 0.004) continue;
          const r = 150 + 105 * tm;
          const g = 175 + 70 * tm;
          const bl = 255 - 30 * tm;
          ctx.strokeStyle = `rgba(${r | 0},${g | 0},${bl | 0},${a})`;
          ctx.lineWidth = m.w * (burned ? 0.5 : 0.25 + 0.75 * tm);
          ctx.beginPath();
          ctx.moveTo(x0, y0);
          ctx.lineTo(x1 + m.dx * 0.6, y1 + m.dy * 0.6);
          ctx.stroke();
        }
        if (!burned && env > 0.02) {
          const rad = m.w * (2.2 + 2 * env);
          const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, rad);
          hg.addColorStop(0, `rgba(255,250,235,${Math.min(1, A * env * 1.1)})`);
          hg.addColorStop(1, "rgba(255,230,200,0)");
          ctx.fillStyle = hg;
          ctx.beginPath();
          ctx.arc(hx, hy, rad, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.restore();
      meteors = meteors.filter((m) => m.age < m.dur + TRAIN_MS);
    };

    let raf = 0;
    // Scene clock: sums the clamped per-frame dt instead of reading wall time,
    // so a long frame (the first one follows a ~0.5s synchronous build) can't
    // make the intro fade skip ahead and read as a snap.
    let elapsed = 0;
    let last = 0;
    let scrollY = 0;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pointer position as -1..1 from the viewport centre, eased into (px, py).
    // Mouse and pen only: touch has no hover, and reduced-motion users get a
    // still scene.
    let tx = 0;
    let ty = 0;
    let px = 0;
    let py = 0;
    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    // pointer left the window: ease back to centre instead of freezing off-axis
    const onPointerLeave = (e: MouseEvent) => {
      if (e.relatedTarget === null) {
        tx = 0;
        ty = 0;
      }
    };
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("mouseout", onPointerLeave);
    }

    const frame = (now: number) => {
      const dt = last ? Math.min(50, now - last) : 16;
      last = now;
      if (!activeRef.current) {
        // park: no per-frame work while the scene is hidden; wakeRef restarts it
        raf = 0;
        return;
      }
      elapsed += dt;
      const scrollP = clamp01(scrollY / Math.max(1, H * 0.9));

      const ease = 1 - Math.exp(-dt / PARALLAX_EASE_MS);
      px += (tx - px) * ease;
      py += (ty - py) * ease;

      // The scene eases up out of the static placeholder gradient behind it
      // (which already matches the sky), so there is never a black frame and
      // nothing pops: sky first, then clouds a beat later, then the ridges.
      const introA = reduced ? 1 : smoothstep(0, SKY_FADE_MS, elapsed);
      canvas.style.opacity = introA >= 1 ? "1" : String(introA);

      if (skySprite) {
        const sm = W * PARALLAX_SKY_X;
        ctx.drawImage(skySprite, -sm - px * sm, 0, W + 2 * sm, H);
      }

      // Drifting fBm cloud bands (seamless tile, two copies for the wrap).
      // The sprites hold cloud shape and self-shading only. The sunset colour
      // comes from a fixed screen-space tint (hot orange low and near the sun,
      // then pink, then lavender higher up) multiplied in here, so a cloud
      // changes colour as it drifts toward or away from the sun instead of
      // carrying a colour baked into the tile. Half resolution; clouds are soft.
      const bandH = H * 0.6;
      if (cloudMask && cloudLayer && cloudTint && cmx && clx) {
        const cs = cloudScale;
        const cm = cmx;
        cm.clearRect(0, 0, cloudMask.width, cloudMask.height);
        cloudDefs.forEach((def, idx) => {
          const st = cloudState[idx];
          if (!reduced) st.ox -= def.speed * W * dt;
          let ox = (st.ox - px * W * PARALLAX_CLOUD_X[idx]) % W;
          if (ox > 0) ox -= W;
          const sp = cloudSprites[idx];
          if (sp) {
            cm.drawImage(sp, ox * cs, 0, W * cs, bandH * cs);
            cm.drawImage(sp, (ox + W) * cs, 0, W * cs, bandH * cs);
          }
        });
        clx.globalCompositeOperation = "source-over";
        clx.clearRect(0, 0, cloudLayer.width, cloudLayer.height);
        clx.drawImage(cloudMask, 0, 0);
        clx.globalCompositeOperation = "multiply";
        clx.drawImage(cloudTint, 0, 0);
        clx.globalCompositeOperation = "destination-in";
        clx.drawImage(cloudMask, 0, 0);
        clx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = reduced ? 1 : smoothstep(CLOUD_FADE_START, CLOUD_FADE_END, elapsed);
        ctx.drawImage(cloudLayer, 0, 0, W, bandH);
        ctx.globalAlpha = 1;
      }

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

      if (!reduced && elapsed > SKY_FADE_MS) {
        nextMeteor -= dt;
        if (nextMeteor <= 0) {
          const ang = showerAng + (mr() - 0.5) * 0.35;
          const mag = Math.pow(mr(), 2.2); // most are faint
          meteors.push({
            x: W * (0.06 + mr() * 0.88),
            y: H * (0.04 + mr() * 0.26),
            dx: Math.cos(ang) * showerDir,
            dy: Math.sin(ang),
            travel: W * (0.07 + mr() * 0.12),
            dur: 320 + mr() * 380,
            age: 0,
            w: 0.9 + mag * 1.1,
            b: 0.4 + mag * 0.6,
            ph: mr() * 6.28,
          });
          nextMeteor = 9000 + mr() * 13000;
        }
        drawMeteors(dt);
      }

      for (let i = 0; i < LAYERS; i++) {
        const m = ridgeMeta(i);
        const paint = reduced
          ? 1
          : easeOut(clamp01((elapsed - MOUNTAIN_DELAY - i * LAYER_STAGGER) / (PAINT_MS - (LAYERS - 1) * LAYER_STAGGER)));
        if (paint <= 0) continue;
        const shift = scrollP * (30 + m.t * 150);
        // stretched by its own parallax margin so the shift never exposes an edge
        const mx = W * (PARALLAX_X_FAR + (PARALLAX_X_NEAR - PARALLAX_X_FAR) * m.t);
        const my = H * (PARALLAX_Y_FAR + (PARALLAX_Y_NEAR - PARALLAX_Y_FAR) * m.t);
        const lx = -mx - px * mx;
        const ly = shift - my - py * my;
        const lw = W + 2 * mx;
        const lh = H + 2 * my;
        if (paint >= 1 || !sctx || !scratch) {
          ctx.drawImage(layerCanvases[i], lx, ly, lw, lh);
          continue;
        }
        // soft-edged left -> right reveal (feathered, not a hard wipe)
        const revealX = paint * W;
        const feather = Math.min(160, W * 0.14);
        sctx.clearRect(0, 0, W, H);
        sctx.globalCompositeOperation = "source-over";
        sctx.drawImage(layerCanvases[i], lx, ly, lw, lh);
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
    wakeRef.current = () => {
      if (raf) return;
      last = 0;
      raf = requestAnimationFrame(frame);
    };

    return () => {
      wakeRef.current = null;
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("mouseout", onPointerLeave);
    };
  }, [seed]);

  return (
    <div className={className} style={{ background: PLACEHOLDER_SKY }} aria-hidden="true">
      <canvas ref={canvasRef} className="block h-full w-full" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-screen"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px 160px",
        }}
      />
    </div>
  );
}
