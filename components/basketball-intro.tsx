"use client";

import { useEffect, useRef } from "react";

const SESSION_KEY = "basketball-intro-played";

const G = 2600;
const VH0 = 1480;
const RESTITUTION = 0.6;
const VX_FRAC = 0.4;
const BASE_RADIUS_FRAC = 0.052;

function drawBasketball(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  spinAngle: number,
) {
  ctx.save();
  ctx.translate(cx, cy);

  const grad = ctx.createRadialGradient(
    -radius * 0.35,
    -radius * 0.4,
    radius * 0.1,
    0,
    0,
    radius * 1.05,
  );
  grad.addColorStop(0, "#ff9d57");
  grad.addColorStop(0.45, "#e8700f");
  grad.addColorStop(0.8, "#c25a0a");
  grad.addColorStop(1, "#8a3f07");
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.rotate(spinAngle);
  ctx.strokeStyle = "rgba(20, 10, 0, 0.78)";
  ctx.lineWidth = Math.max(1, radius * 0.045);

  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.lineTo(0, radius);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-radius, 0);
  ctx.lineTo(radius, 0);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.quadraticCurveTo(-radius * 0.95, 0, 0, radius);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, -radius);
  ctx.quadraticCurveTo(radius * 0.95, 0, 0, radius);
  ctx.stroke();

  ctx.restore();

  const rim = ctx.createRadialGradient(0, 0, radius * 0.75, 0, 0, radius);
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fillStyle = rim;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(-radius * 0.38, -radius * 0.42, radius * 0.22, radius * 0.14, -0.6, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  ctx.restore();
}

function drawShadow(
  ctx: CanvasRenderingContext2D,
  cx: number,
  groundY: number,
  radius: number,
  heightFrac: number,
) {
  const squash = 1 - heightFrac * 0.65;
  const alpha = 0.45 * (1 - heightFrac * 0.75);
  ctx.save();
  ctx.translate(cx, groundY);
  ctx.scale(1, 0.32);
  ctx.beginPath();
  ctx.arc(0, 0, radius * (1.05 - heightFrac * 0.25) * squash, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`;
  ctx.fill();
  ctx.restore();
}

export function BasketballIntro({ onDone }: { onDone: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const curtain = curtainRef.current;
    const container = containerRef.current;
    if (!canvas || !curtain || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = container!.getBoundingClientRect();
      canvas!.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas!.height = Math.max(1, Math.floor(rect.height * dpr));
    }
    resize();
    window.addEventListener("resize", resize);

    function finish() {
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // ignore storage failures (private browsing etc.)
      }
      onDone();
    }

    if (reducedMotion) {
      curtain!.style.clipPath = "inset(0 0 0 100%)";
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      window.setTimeout(finish, 60);
      return () => window.removeEventListener("resize", resize);
    }

    curtain!.style.clipPath = "inset(0 0 0 0%)";

    let cancelled = false;
    const g = G * (canvas!.height / 800);
    const vx = canvas!.width * VX_FRAC;
    const groundY = canvas!.height * 0.74;
    const startX = -canvas!.height * BASE_RADIUS_FRAC * 1.5;
    const endX = canvas!.width + canvas!.height * BASE_RADIUS_FRAC * 1.5;
    const totalDist = endX - startX;
    const estTotalMs = (totalDist / vx) * 1000;

    let h = 0;
    let vh = VH0 * (canvas!.height / 800);
    let curBouncePeakH = (vh * vh) / (2 * g);
    let spinAngle = 0;
    let lastT: number | null = null;
    const start = performance.now();

    function tick(now: number) {
      if (cancelled) return;
      if (lastT === null) lastT = now;
      const dt = Math.min(0.032, (now - lastT) / 1000);
      lastT = now;
      const elapsed = Math.max(0, now - start);

      vh -= g * dt;
      h += vh * dt;
      if (h <= 0) {
        h = 0;
        vh = -vh * RESTITUTION;
        curBouncePeakH = (vh * vh) / (2 * g);
      }

      const x = startX + vx * (elapsed / 1000);
      const approachProgress = Math.min(1, elapsed / estTotalMs);
      const baseRadius =
        canvas!.height * BASE_RADIUS_FRAC * (0.78 + approachProgress * 0.55);

      const localHeightFrac =
        curBouncePeakH > 1 ? Math.min(1, h / curBouncePeakH) : 0;
      const radius = baseRadius * (1 + localHeightFrac * 0.12);

      spinAngle += (vx * dt) / radius;

      const cy = groundY - h;
      const heightFrac = Math.min(1, h / (canvas!.height * 0.42));

      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      drawShadow(ctx!, x, groundY + radius * 0.92, radius, heightFrac);
      drawBasketball(ctx!, x, cy, radius, spinAngle);

      const xPercent = Math.max(
        0,
        Math.min(100, ((x + radius) / canvas!.width) * 100),
      );
      curtain!.style.clipPath = `inset(0 0 0 ${xPercent.toFixed(2)}%)`;

      if (x - radius < canvas!.width) {
        requestAnimationFrame(tick);
      } else {
        ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
        curtain!.style.clipPath = "inset(0 0 0 100%)";
        window.setTimeout(finish, 140);
      }
    }
    requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", resize);
    };
  }, [onDone]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[300]"
      aria-hidden="true"
    >
      <div ref={curtainRef} className="absolute inset-0 bg-background" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
