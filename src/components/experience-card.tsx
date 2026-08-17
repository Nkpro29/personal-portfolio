"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ExperienceItem } from "@/lib/portfolio";

export function ExperienceCard({
  job,
  index,
}: {
  job: ExperienceItem;
  index: number;
}) {
  const reduce = useReducedMotion();
  const right = index % 2 === 1;

  return (
    <motion.article
      className={`relative md:grid md:grid-cols-2 md:gap-16 ${right ? "" : ""}`}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="absolute top-2 left-[7px] z-10 h-2.5 w-2.5 rounded-full border border-accent bg-bg md:left-1/2 md:-translate-x-1/2" />

      <div className={`pl-10 md:pl-0 ${right ? "md:col-start-2" : "md:col-start-1 md:text-right"}`}>
        <p className="font-mono text-[11px] tracking-[0.18em] text-ink-faint uppercase">
          {job.startDate} – {job.endDate}
        </p>
        <h3 className="mt-2 text-2xl text-ink">{job.company}</h3>
        <p className="mt-1 text-sm text-accent">{job.role}</p>
        <ul className={`mt-5 space-y-3 text-sm leading-6 text-ink-muted ${right ? "" : "md:ml-auto"} max-w-xl`}>
          {job.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className={`mt-5 flex flex-wrap gap-2 ${right ? "" : "md:justify-end"}`}>
          {job.technologies.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-ink-faint"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}
