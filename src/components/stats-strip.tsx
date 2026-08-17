"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const STATS = [
  { value: 97, suffix: "%", label: "Voice-agent recall accuracy" },
  { value: 40, suffix: "%", label: "Security compliance lift" },
  { value: 3000, suffix: "+", label: "Monthly active users" },
];

export function StatsStrip() {
  return (
    <div className="mt-14 grid gap-6 border-t border-line pt-10 sm:grid-cols-3">
      {STATS.map((stat) => (
        <div key={stat.label}>
          <p className="display text-4xl text-ink">
            <Counter value={stat.value} />
            {stat.suffix}
          </p>
          <p className="mt-2 text-sm text-ink-muted">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function Counter({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState(reduce ? value : 0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        const start = performance.now();
        const duration = 1100;

        function tick(now: number) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCurrent(Math.round(value * eased));
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduce, value]);

  return <span ref={ref}>{current.toLocaleString("en-US")}</span>;
}
