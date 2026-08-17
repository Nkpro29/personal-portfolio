"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { portfolio } from "@/lib/portfolio";

const FRAGMENTS = [
  "retrieve(query, k=12)",
  "SELECT * FROM events",
  "rbac.enforce(role)",
  "index.upsert(vectors)",
  "nginx → container app",
  "memory.persist(turn)",
];

export function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoUrl = portfolio.heroVideoUrl;

  useEffect(() => {
    if (videoUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;
    let width = 0;
    let height = 0;

    type Node = { x: number; y: number; r: number; s: number; p: number };
    type Particle = { t: number; speed: number; from: number; to: number };
    let nodes: Node[] = [];
    let particles: Particle[] = [];

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = width < 720 ? 18 : 28;
      nodes = Array.from({ length: count }, () => ({
        x: (0.08 + Math.random() * 0.84) * width,
        y: (0.1 + Math.random() * 0.78) * height,
        r: 1.2 + Math.random() * 1.8,
        s: 0.15 + Math.random() * 0.35,
        p: Math.random() * Math.PI * 2,
      }));
      particles = Array.from({ length: Math.floor(count * 0.7) }, () => ({
        t: Math.random(),
        speed: 0.0012 + Math.random() * 0.0018,
        from: Math.floor(Math.random() * count),
        to: Math.floor(Math.random() * count),
      }));
    }

    function draw(staticFrame = false) {
      ctx!.clearRect(0, 0, width, height);
      const t = staticFrame ? 0 : frame;

      ctx!.strokeStyle = "rgba(238,241,246,0.035)";
      ctx!.lineWidth = 1;
      const gap = 72;
      for (let x = 0; x < width; x += gap) {
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, height);
        ctx!.stroke();
      }
      for (let y = 0; y < height; y += gap) {
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(width, y);
        ctx!.stroke();
      }

      const positions = nodes.map((node) => ({
        x: node.x + Math.sin(t * 0.004 * node.s + node.p) * 10,
        y: node.y + Math.cos(t * 0.0035 * node.s + node.p) * 8,
        r: node.r,
      }));

      for (let i = 0; i < positions.length; i++) {
        for (let j = i + 1; j < positions.length; j++) {
          const dx = positions[i].x - positions[j].x;
          const dy = positions[i].y - positions[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > 180) continue;
          const alpha = (1 - dist / 180) * 0.16;
          ctx!.strokeStyle = `rgba(125, 206, 196, ${alpha})`;
          ctx!.beginPath();
          ctx!.moveTo(positions[i].x, positions[i].y);
          ctx!.lineTo(positions[j].x, positions[j].y);
          ctx!.stroke();
        }
      }

      for (const particle of particles) {
        const from = positions[particle.from];
        const to = positions[particle.to];
        if (!from || !to) continue;
        const x = from.x + (to.x - from.x) * particle.t;
        const y = from.y + (to.y - from.y) * particle.t;
        ctx!.fillStyle = "rgba(125, 206, 196, 0.55)";
        ctx!.beginPath();
        ctx!.arc(x, y, 1.15, 0, Math.PI * 2);
        ctx!.fill();
        if (!staticFrame) {
          particle.t += particle.speed;
          if (particle.t > 1) {
            particle.t = 0;
            particle.from = particle.to;
            particle.to = Math.floor(Math.random() * positions.length);
          }
        }
      }

      for (const node of positions) {
        ctx!.fillStyle = "rgba(238, 241, 246, 0.55)";
        ctx!.beginPath();
        ctx!.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.font = "11px ui-monospace, SFMono-Regular, Menlo, monospace";
      ctx!.fillStyle = "rgba(139, 147, 159, 0.28)";
      FRAGMENTS.forEach((text, i) => {
        const x = (width * (0.08 + (i % 3) * 0.3)) | 0;
        const y = height * (0.22 + (i % 4) * 0.18) + Math.sin(t * 0.01 + i) * 6;
        ctx!.fillText(text, x, y);
      });
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduce) {
      draw(true);
      return () => window.removeEventListener("resize", resize);
    }

    function loop() {
      frame += 1;
      draw();
      raf = window.requestAnimationFrame(loop);
    }
    raf = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [videoUrl]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <Image
        src={portfolio.heroPoster}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-45"
      />
      {videoUrl ? (
        <video
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          poster={portfolio.heroPoster}
          preload="none"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      )}
      <div className="absolute inset-0 bg-linear-to-b from-bg/70 via-bg/55 to-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(5,5,6,0.55)_70%)]" />
    </div>
  );
}
