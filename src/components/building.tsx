"use client";

import { motion, useReducedMotion } from "framer-motion";
import { portfolio } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";

export function Building() {
  const reduce = useReducedMotion();

  return (
    <Section>
      <Reveal>
        <Eyebrow>Focus</Eyebrow>
        <h2 className="display text-4xl leading-tight sm:text-5xl">Things I like building.</h2>
      </Reveal>

      <div className="mt-14 grid gap-6 lg:grid-cols-3">
        {portfolio.building.map((concept, index) => (
          <motion.article
            key={concept.id}
            className="relative overflow-hidden rounded-2xl border border-line bg-surface p-7"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.08, duration: 0.55 }}
          >
            <span className="display text-5xl text-ink-faint">{concept.index}</span>
            <h3 className="mt-4 text-2xl text-ink">{concept.title}</h3>
            <ul className="mt-6 space-y-2">
              {concept.items.map((item) => (
                <li key={item} className="border-t border-line pt-2 text-sm text-ink-muted">
                  {item}
                </li>
              ))}
            </ul>
            <motion.div
              className="pointer-events-none absolute -right-8 -bottom-10 h-32 w-32 rounded-full bg-accent/10 blur-3xl"
              animate={reduce ? undefined : { opacity: [0.25, 0.55, 0.25] }}
              transition={{ duration: 5 + index, repeat: Infinity }}
            />
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
