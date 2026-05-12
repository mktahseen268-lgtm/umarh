"use client";

import { useEffect, useRef } from "react";

type Grain = {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  hue: number;
  alpha: number;
};

/**
 * Sand particle system that responds to a flowMode prop.
 * Modes correspond to chapters of the journey.
 */
export type FlowMode =
  | "frozen"
  | "rising"
  | "falling"
  | "orbit"
  | "rushing"
  | "spiral"
  | "drifting"
  | "embers";

const flowMode = { current: "frozen" as FlowMode };

export function setFlowMode(mode: FlowMode) {
  flowMode.current = mode;
}

export function SandField({ count = 600 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const raf   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio, 2);
    let w = canvas.width  = window.innerWidth  * dpr;
    let h = canvas.height = window.innerHeight * dpr;
    canvas.style.width  = window.innerWidth  + "px";
    canvas.style.height = window.innerHeight + "px";

    const onResize = () => {
      w = canvas.width  = window.innerWidth  * dpr;
      h = canvas.height = window.innerHeight * dpr;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX * dpr;
      mouse.current.y = e.clientY * dpr;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    const grains: Grain[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      size: 0.5 + Math.random() * 1.4,
      hue: 35 + Math.random() * 25, // sand tones
      alpha: 0.3 + Math.random() * 0.5,
    }));

    const tick = () => {
      // Subtle trail fade
      ctx.fillStyle = "rgba(14, 22, 34, 0.20)";
      ctx.fillRect(0, 0, w, h);

      const mode = flowMode.current;
      const cx = w / 2, cy = h / 2;

      for (const g of grains) {
        // Apply mode-specific forces
        switch (mode) {
          case "frozen":
            g.vx *= 0.7; g.vy *= 0.7;
            // tiny tremor
            g.vx += (Math.random() - 0.5) * 0.02;
            g.vy += (Math.random() - 0.5) * 0.02;
            break;
          case "rising":
            g.vy -= 0.04;
            g.vx += (Math.random() - 0.5) * 0.05;
            break;
          case "falling":
            g.vy += 0.06;
            g.vx += (Math.random() - 0.5) * 0.03;
            break;
          case "orbit": {
            const dx = g.x - cx, dy = g.y - cy;
            const d  = Math.sqrt(dx * dx + dy * dy) || 1;
            const tangX = -dy / d, tangY = dx / d;
            g.vx += tangX * 0.15 - (dx / d) * 0.02;
            g.vy += tangY * 0.15 - (dy / d) * 0.02;
            break;
          }
          case "rushing":
            g.vx += 0.18;
            g.vy += (Math.random() - 0.5) * 0.05;
            break;
          case "spiral": {
            const dx = g.x - cx, dy = g.y - cy;
            const d  = Math.sqrt(dx * dx + dy * dy) || 1;
            const tangX = -dy / d, tangY = dx / d;
            g.vx += tangX * 0.22 - (dx / d) * 0.06;
            g.vy += tangY * 0.22 - (dy / d) * 0.06;
            break;
          }
          case "drifting":
            g.vy += 0.02;
            g.vx += (Math.random() - 0.5) * 0.04;
            break;
          case "embers":
            g.vy -= 0.05;
            g.vx += Math.sin(g.y * 0.01) * 0.04;
            break;
        }

        // Cursor push
        if (mouse.current.active) {
          const dx = g.x - mouse.current.x;
          const dy = g.y - mouse.current.y;
          const d2 = dx * dx + dy * dy;
          const r  = 160 * dpr;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / r) * 1.6;
            g.vx += (dx / d) * force;
            g.vy += (dy / d) * force;
          }
        }

        // Damping
        g.vx *= 0.95;
        g.vy *= 0.95;

        g.x += g.vx;
        g.y += g.vy;

        // Wrap
        if (g.x < 0) g.x += w;
        if (g.x > w) g.x -= w;
        if (g.y < 0) g.y += h;
        if (g.y > h) g.y -= h;

        // Render — small disk with soft glow
        ctx.fillStyle = `hsla(${g.hue}, 70%, 65%, ${g.alpha})`;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size * dpr, 0, Math.PI * 2);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[2] mix-blend-screen"
      aria-hidden
    />
  );
}
