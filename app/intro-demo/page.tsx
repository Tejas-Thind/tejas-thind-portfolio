"use client";
import { useEffect, useRef, useState } from "react";

// Throwaway prototype to validate the ASCII-intro technique before any real
// footage exists. Not linked from nav, not part of the real site flow -
// swap SCENE_DURATION_MS worth of procedural drawing for real video-frame
// sampling once there's an actual clip to convert.

const CHAR_RAMP = " .:-=+*#%@";
const COLS = 72;
const ROWS = 30;
const SCENE_W = 480;
const SCENE_H = 240;
const SCENE_DURATION_MS = 1500;
const DISSOLVE_DURATION_MS = 900;

// Reuses the site's own accent palette instead of raw "video" color, so the
// intro and the real site read as one system. Canvas fillStyle parsing
// doesn't reliably support oklch() the way CSS does, so these are the hex
// equivalents of --scramble-coral / --scramble-amber (dark theme values).
const ACCENT = "#ff8a5c"; // --scramble-coral
const ACCENT_2 = "#e8b84f"; // --scramble-amber
const CANVAS_FONT_STACK = "ui-monospace, Menlo, Consolas, monospace";

type Phase = "playing" | "dissolving" | "done";

export default function IntroDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLCanvasElement | null>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("playing");
  const ballScreenPos = useRef({ x: 0.5, y: 0.35 });
  const startTime = useRef<number | null>(null);
  const dissolveStart = useRef<number | null>(null);
  const cellDelays = useRef<Float32Array | null>(null);

  useEffect(() => {
    sceneRef.current = document.createElement("canvas");
    sceneRef.current.width = SCENE_W;
    sceneRef.current.height = SCENE_H;
  }, []);

  function drawScene(sctx: CanvasRenderingContext2D, t: number) {
    sctx.fillStyle = "#000";
    sctx.fillRect(0, 0, SCENE_W, SCENE_H);

    // Hoop: backboard + rim, fixed near top-center.
    const hoopX = SCENE_W * 0.62;
    const hoopY = SCENE_H * 0.28;
    sctx.fillStyle = "#ddd";
    sctx.fillRect(hoopX - 2, hoopY - 40, 60, 44);
    sctx.strokeStyle = "#ff6a2b";
    sctx.lineWidth = 4;
    sctx.beginPath();
    sctx.ellipse(hoopX + 10, hoopY + 6, 22, 6, 0, 0, Math.PI * 2);
    sctx.stroke();

    // Ball: parabolic arc from bottom-left to the rim, with a slam/flash
    // at the end to stand in for "dunk impact."
    const p = Math.min(t / SCENE_DURATION_MS, 1);
    const startX = SCENE_W * 0.08;
    const startY = SCENE_H * 0.85;
    const endX = hoopX + 10;
    const endY = hoopY + 6;
    const x = startX + (endX - startX) * p;
    const arcHeight = 90;
    const y = startY + (endY - startY) * p - arcHeight * Math.sin(Math.PI * p);

    ballScreenPos.current = { x: x / SCENE_W, y: y / SCENE_H };

    if (p > 0.92) {
      const flashP = (p - 0.92) / 0.08;
      const grad = sctx.createRadialGradient(endX, endY, 0, endX, endY, 60 * flashP);
      grad.addColorStop(0, "rgba(255,255,255,0.9)");
      grad.addColorStop(1, "rgba(255,255,255,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, SCENE_W, SCENE_H);
    }

    sctx.fillStyle = "#ff6a2b";
    sctx.beginPath();
    sctx.arc(x, y, 13, 0, Math.PI * 2);
    sctx.fill();
    sctx.strokeStyle = "#111";
    sctx.lineWidth = 1.5;
    sctx.beginPath();
    sctx.moveTo(x - 13, y);
    sctx.lineTo(x + 13, y);
    sctx.moveTo(x, y - 13);
    sctx.lineTo(x, y + 13);
    sctx.stroke();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener("resize", resize);

    let raf: number;

    const loop = (now: number) => {
      if (startTime.current === null) startTime.current = now;
      const elapsed = now - startTime.current;

      const sceneCanvas = sceneRef.current;
      const sctx = sceneCanvas?.getContext("2d", { willReadFrequently: true });
      if (sceneCanvas && sctx) {
        drawScene(sctx, phase === "playing" ? elapsed : SCENE_DURATION_MS);

        const cellW = SCENE_W / COLS;
        const cellH = SCENE_H / ROWS;
        const img = sctx.getImageData(0, 0, SCENE_W, SCENE_H).data;

        ctx.fillStyle = "#0a0a0a";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const fontSize = (window.innerWidth / COLS) * dpr * 1.6;
        ctx.font = `${fontSize}px ${CANVAS_FONT_STACK}`;
        ctx.textBaseline = "middle";

        if (!cellDelays.current || cellDelays.current.length !== COLS * ROWS) {
          const arr = new Float32Array(COLS * ROWS);
          const bx = ballScreenPos.current.x * COLS;
          const by = ballScreenPos.current.y * ROWS;
          for (let row = 0; row < ROWS; row++) {
            for (let col = 0; col < COLS; col++) {
              const d = Math.hypot(col - bx, row - by);
              arr[row * COLS + col] = d * 40 + Math.random() * 80;
            }
          }
          cellDelays.current = arr;
        }

        const dissolveElapsed =
          phase === "dissolving" && dissolveStart.current !== null
            ? now - dissolveStart.current
            : 0;

        // Drive the radial reveal every frame here (not via React state +
        // a CSS transition) - React only re-renders a couple of times
        // across the whole dissolve, which isn't enough frames to animate
        // smoothly, and setting the transition to "none" on the same
        // render that also sets the final value made it snap instead of
        // ease.
        if (revealRef.current && phase !== "playing") {
          const raw = Math.min(1, dissolveElapsed / DISSOLVE_DURATION_MS);
          const eased = 1 - Math.pow(1 - raw, 3);
          revealRef.current.style.clipPath = `circle(${eased * 150}% at ${ballScreenPos.current.x * 100}% ${ballScreenPos.current.y * 100}%)`;
        }

        for (let row = 0; phase !== "done" && row < ROWS; row++) {
          for (let col = 0; col < COLS; col++) {
            const px = Math.floor((col + 0.5) * cellW);
            const py = Math.floor((row + 0.5) * cellH);
            const idx = (py * SCENE_W + px) * 4;
            const r = img[idx];
            const g = img[idx + 1];
            const b = img[idx + 2];
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            if (luminance < 0.04) continue;

            let cellOpacity = 1;
            if (phase === "dissolving") {
              const delay = cellDelays.current[row * COLS + col];
              const local = (dissolveElapsed - delay) / 260;
              cellOpacity = 1 - Math.max(0, Math.min(1, local));
              if (cellOpacity <= 0) continue;
            }

            const rampIdx = Math.min(
              CHAR_RAMP.length - 1,
              Math.floor(luminance * CHAR_RAMP.length),
            );
            const char = CHAR_RAMP[rampIdx];
            if (char === " ") continue;

            const isHot = r > 180 && g < 160;
            ctx.globalAlpha = cellOpacity;
            ctx.fillStyle = isHot ? ACCENT : luminance > 0.7 ? "#fff" : ACCENT_2;
            ctx.fillText(
              char,
              col * (canvas.width / COLS),
              row * (canvas.height / ROWS) + canvas.height / ROWS / 2,
            );
          }
        }
        ctx.globalAlpha = 1;
      }

      if (phase === "playing" && elapsed >= SCENE_DURATION_MS) {
        setPhase("dissolving");
        dissolveStart.current = now;
        cellDelays.current = null; // recompute against the ball's final position, not frame 1's
      } else if (phase === "dissolving" && dissolveStart.current !== null) {
        if (now - dissolveStart.current > DISSOLVE_DURATION_MS + 400) {
          setPhase("done");
        }
      }

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [phase]);

  const skip = () => {
    if (phase === "playing") {
      setPhase("dissolving");
      dissolveStart.current = performance.now();
      cellDelays.current = null;
    }
  };

  return (
    <div
      className="relative h-[100dvh] w-full overflow-hidden bg-[#0a0a0a]"
      onClick={skip}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Radial reveal of the "real site" growing out of the ball's final
          position - clip-path is updated every frame in the rAF loop above. */}
      <div
        ref={revealRef}
        className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <h1 className="px-6 text-center font-serif text-4xl italic text-white sm:text-6xl">
          Hey, I&apos;m Tejas
        </h1>
      </div>

      {phase === "playing" && (
        <div className="absolute bottom-6 right-6 text-xs tracking-widest text-white/40">
          CLICK TO SKIP
        </div>
      )}
    </div>
  );
}
