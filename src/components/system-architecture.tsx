"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SystemArchitecture({ layers }: { layers: string[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <p className="mb-5 font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
        Product → Infrastructure
      </p>
      <div className="flex flex-col">
        {layers.map((layer, index) => (
          <div key={layer} className="flex flex-col items-stretch">
            <motion.div
              className="flex items-center justify-between rounded-lg border border-line bg-surface-2 px-4 py-3"
              initial={reduce ? false : { opacity: 0, x: 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: index * 0.06, duration: 0.45 }}
            >
              <span className="font-mono text-[12px] tracking-[0.14em] text-ink-soft">
                {layer}
              </span>
              <span className="font-mono text-[10px] text-ink-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
            </motion.div>
            {index < layers.length - 1 && (
              <div className="relative mx-auto h-7 w-px bg-line-strong">
                <motion.span
                  className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-accent"
                  animate={reduce ? undefined : { y: [0, 22, 0], opacity: [0.2, 1, 0.2] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: index * 0.18 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
