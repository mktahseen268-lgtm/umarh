"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number; y: number;
  vx: number; vy: number;
  size: number;
  hue: number;
  alpha: number;
};

/** Cursor-reactive particle field, drawn to a fixed canvas behind UI. */
export function Particles({ count = 280 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: -9999, y: -9999, active: false });
  const raf   = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = canvas.width  = window.innerWidth  * window.devicePixelRatio;
    let h = canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width  = window.innerWidth  + "px";
    canvas.style.height = window.innerHeight + "px";

    const onResize = () => {
      w = canvas.width  = window.innerWidth  * window.devicePixelRatio;
      h = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    window.addEventListener("resize", onResize);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX * window.devicePixelRatio;
      mouse.current.y = e.clientY * window.devicePixelRatio;
      mouse.current.active = true;
    };
    const onLeave = () => { mouse.current.active = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseout", onLeave);

    // Initialize particles
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: 0.6 + Math.random() * 1.6,
      hue: 30 + Math.random() * 50, // amber/gold range
      alpha: 0.2 + Math.random() * 0.5,
    }));

    let scrollY = 0;
    let lastScroll = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const tick = () => {
      ctx.fillStyle = "rgba(8, 4, 14, 0.18)";
      ctx.fillRect(0, 0, w, h);

      const scrollDelta = scrollY - lastScroll;
      lastScroll = scrollY;
      const agitation = Math.min(Math.abs(scrollDelta) * 0.04, 1.4);

      for (const p of particles) {
        // Brownian drift
        p.vx += (Math.random() - 0.5) * 0.04;
        p.vy += (Math.random() - 0.5) * 0.04;

        // Cursor repulsion within radius
        if (mouse.current.active) {
          const dx = p.x - mouse.current.x;
          const dy = p.y - mouse.current.y;
          const d2 = dx * dx + dy * dy;
          const r  = 200 * window.devicePixelRatio;
          if (d2 < r * r) {
            const d = Math.sqrt(d2) || 1;
            const force = (1 - d / r) * 1.4;
            p.vx += (dx / d) * force;
            p.vy += (dy / d) * force;
          }
        }

        // Scroll agitation: nudge in scroll direction
        p.vy -= scrollDelta * 0.002 * window.devicePixelRatio;

        // Damping
        p.vx *= 0.96;
        p.vy *= 0.96;

        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x += w;
        if (p.x > w) p.x -= w;
        if (p.y < 0) p.y += h;
        if (p.y > h) p.y -= h;

        // Draw
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        glow.addColorStop(0, `hsla(${p.hue}, 90%, 70%, ${p.alpha + agitation * 0.2})`);
        glow.addColorStop(1, "hsla(0, 0%, 0%, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
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
      window.removeEventListener("scroll", onScroll);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[1] mix-blend-screen"
      aria-hidden
    />
  );
}
