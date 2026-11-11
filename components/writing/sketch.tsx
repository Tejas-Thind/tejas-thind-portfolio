import { RoughGenerator } from "roughjs/bin/generator";
import type { Drawable } from "roughjs/bin/core";

// Hand-drawn primitives for the article diagrams. roughjs supplies the slightly
// imperfect pen strokes; everything is generated on the server from fixed
// seeds, so the drawings are identical on every render and ship as plain SVG
// with no client JavaScript.
//
// The look is a confident pen sketch rather than a scribble: one stroke per
// edge (no doubled-up lines), gentle bowing, boxes that sit a fraction of a
// degree off square, arrows with a slight bow, and a loose colour wash that
// sits under each outline like highlighter.

const gen = new RoughGenerator();

// Graphite follows the page's text colour (so it works in light and dark);
// the accents are mid-tones that read on both backgrounds.
export const INK = "currentColor";
export const TONES = {
  red: "#d0605a",
  orange: "#e28b4a",
  amber: "#dba73d",
  green: "#58ad6c",
  teal: "#3fb5a6",
  blue: "#5b8def",
  violet: "#9482e6",
  rose: "#db6a86",
} as const;

const PEN = {
  roughness: 0.55,
  bowing: 0.7,
  strokeWidth: 1.8,
  stroke: INK,
  disableMultiStroke: true,
  maxRandomnessOffset: 1.6,
} as const;

function roundedRect(x: number, y: number, w: number, h: number, r: number) {
  return [
    `M${x + r} ${y}`,
    `L${x + w - r} ${y}`,
    `Q${x + w} ${y} ${x + w} ${y + r}`,
    `L${x + w} ${y + h - r}`,
    `Q${x + w} ${y + h} ${x + w - r} ${y + h}`,
    `L${x + r} ${y + h}`,
    `Q${x} ${y + h} ${x} ${y + h - r}`,
    `L${x} ${y + r}`,
    `Q${x} ${y} ${x + r} ${y}`,
    "Z",
  ].join(" ");
}

// small deterministic pseudo-random in [-1, 1] from a seed
const wobble = (seed: number) => Math.sin(seed * 12.9898) * 0.5 + Math.sin(seed * 78.233) * 0.5;

function Strokes({
  drawable,
  dash,
  opacity = 1,
}: {
  drawable: Drawable;
  dash?: string;
  opacity?: number;
}) {
  return (
    <>
      {gen.toPaths(drawable).map((p, i) => (
        <path
          key={i}
          d={p.d}
          fill={p.fill ?? "none"}
          stroke={p.stroke}
          strokeWidth={p.strokeWidth}
          strokeDasharray={dash}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={opacity}
        />
      ))}
    </>
  );
}

export function Label({
  x,
  y,
  lines,
  size = 24,
  anchor = "middle",
  color = INK,
  opacity = 1,
}: {
  x: number;
  y: number; // vertical centre of the whole block
  lines: string[];
  size?: number;
  anchor?: "start" | "middle" | "end";
  color?: string;
  opacity?: number;
}) {
  const lh = size * 1.15;
  const first = y - ((lines.length - 1) * lh) / 2 + size * 0.32;
  return (
    <text
      x={x}
      y={first}
      textAnchor={anchor}
      fontSize={size}
      fill={color}
      opacity={opacity}
      style={{ fontFamily: "var(--font-hand), cursive" }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={x} dy={i === 0 ? 0 : lh}>
          {line}
        </tspan>
      ))}
    </text>
  );
}

export function Box({
  x,
  y,
  w,
  h,
  seed,
  lines,
  sub,
  color = INK,
  dashed = false,
  wash = true,
  hatch: hatchOn = true,
  size = 24,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  seed: number;
  lines: string[];
  sub?: string;
  color?: string;
  dashed?: boolean;
  wash?: boolean; // colour fill under the outline, like highlighter
  hatch?: boolean; // pencil strokes over the fill; off for small swatches
  size?: number;
}) {
  const outline = gen.path(roundedRect(x, y, w, h, 11), { ...PEN, stroke: color, seed });
  // a few strokes of the highlighter, laid roughly across the box
  const hatch = wash && hatchOn
    ? gen.path(roundedRect(x + 5, y + 5, w - 10, h - 10, 8), {
        stroke: "none",
        fill: color,
        fillStyle: "hachure",
        hachureAngle: -28,
        hachureGap: 9,
        fillWeight: 3,
        roughness: 0.6,
        disableMultiStroke: true,
        seed: seed + 100,
      })
    : null;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const tilt = wobble(seed) * 0.55; // degrees: nobody draws a perfectly level box
  return (
    <g transform={`rotate(${tilt.toFixed(2)} ${cx} ${cy})`}>
      {wash && (
        <path
          d={roundedRect(x + 2, y + 2, w - 4, h - 4, 9)}
          fill={color}
          opacity={0.13}
          stroke="none"
        />
      )}
      {hatch && <Strokes drawable={hatch} opacity={0.2} />}
      <Strokes drawable={outline} dash={dashed ? (h < 40 ? "6 5" : "9 7") : undefined} />
      <Label x={cx} y={sub ? cy - size * 0.32 : cy} lines={lines} size={size} color={INK} />
      {sub && <Label x={cx} y={cy + size * 0.78} lines={[sub]} size={size * 0.78} opacity={0.68} />}
    </g>
  );
}

// A pen arrow. Always slightly bowed, the way a hand-drawn line never is
// perfectly straight; pass `bend` to choose the curve explicitly.
export function Arrow({
  from,
  to,
  seed,
  bend,
  color = INK,
}: {
  from: [number, number];
  to: [number, number];
  seed: number;
  bend?: [number, number];
  color?: string;
}) {
  const opts = { ...PEN, stroke: color, seed };
  let through = bend;
  if (!through) {
    const mx = (from[0] + to[0]) / 2;
    const my = (from[1] + to[1]) / 2;
    const dx = to[0] - from[0];
    const dy = to[1] - from[1];
    const len = Math.hypot(dx, dy) || 1;
    const push = wobble(seed + 3) * Math.min(4, len * 0.06);
    through = [mx - (dy / len) * push, my + (dx / len) * push];
  }
  const shaft = gen.curve([from, through, to], { ...opts, curveFitting: 0.97 });
  const [px, py] = through;
  const ang = Math.atan2(to[1] - py, to[0] - px);
  const head = 13;
  const spread = 0.5;
  const wing = (s: number) =>
    gen.line(
      to[0],
      to[1],
      to[0] - head * Math.cos(ang + s * spread),
      to[1] - head * Math.sin(ang + s * spread),
      { ...opts, seed: seed + 7 + (s > 0 ? 0 : 1) },
    );
  return (
    <g>
      <Strokes drawable={shaft} />
      <Strokes drawable={wing(1)} />
      <Strokes drawable={wing(-1)} />
    </g>
  );
}

// A loose hand-drawn rule, used as an underline or divider.
export function Scribble({
  x1,
  x2,
  y,
  seed,
  color = INK,
  opacity = 0.55,
}: {
  x1: number;
  x2: number;
  y: number;
  seed: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Strokes
      drawable={gen.line(x1, y, x2, y, { ...PEN, stroke: color, roughness: 1.1, strokeWidth: 1.4, seed })}
      opacity={opacity}
    />
  );
}
