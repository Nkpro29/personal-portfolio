"use client";

import { useEffect, useRef } from "react";

export function AmbientGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    function onMove(event: MouseEvent) {
      if (!el) return;
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      el.style.background = `radial-gradient(420px 280px at ${x}% ${y}%, rgba(125,206,196,0.07), transparent 60%)`;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 hidden mix-blend-screen motion-reduce:hidden [@media(pointer:fine)]:block"
    />
  );
}
