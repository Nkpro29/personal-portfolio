"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/lib/portfolio";

export function ProjectCard({
  project,
  index,
  onOpenSystem,
}: {
  project: ProjectItem;
  index: number;
  onOpenSystem: () => void;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [28, -28]);

  return (
    <motion.article
      ref={ref}
      className="group relative"
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05 }}
    >
      <div className="relative overflow-hidden rounded-2xl border border-line bg-surface">
        <motion.div style={{ y }} className="relative aspect-16/9 overflow-hidden">
          <Image
            src={project.imageUrl}
            alt={`${project.title} product interface`}
            fill
            sizes="(max-width: 1024px) 100vw, 960px"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/20 to-transparent" />
        </motion.div>

        <button
          type="button"
          onClick={onOpenSystem}
          className="absolute top-4 right-4 z-10 rounded-full border border-line bg-bg/80 px-3 py-1.5 font-mono text-[11px] tracking-[0.16em] text-ink-soft uppercase backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent"
        >
          System
        </button>

        <div className="relative space-y-5 p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-ink-faint">
            <span className="font-mono tracking-[0.18em] uppercase">{project.tag}</span>
            <span>·</span>
            <span>
              {project.startDate} – {project.endDate}
            </span>
            <span>·</span>
            <button
              type="button"
              onClick={onOpenSystem}
              className="font-mono tracking-[0.16em] text-accent uppercase hover:text-ink"
            >
              System
            </button>
          </div>
          <h3 className="display text-4xl sm:text-5xl">{project.title}</h3>
          <p className="max-w-2xl text-base leading-7 text-ink-muted">{project.description}</p>
          <ul className="grid gap-2 text-sm text-ink-soft sm:grid-cols-2">
            {project.highlights.map((item) => (
              <li key={item} className="border-l border-line pl-3">
                {item}
              </li>
            ))}
          </ul>

          <Pipeline steps={project.pipeline} />

          {project.projectUrl ? (
            <a
              href={project.projectUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent"
            >
              View project <ArrowUpRight size={14} />
            </a>
          ) : (
            <p className="text-sm text-ink-faint">View project — URL not published yet.</p>
          )}
        </div>
      </div>
    </motion.article>
  );
}

function Pipeline({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2 font-mono text-[11px] tracking-[0.12em] text-ink-faint uppercase">
      {steps.map((step, index) => (
        <span key={step} className="inline-flex items-center gap-2">
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-muted">{step}</span>
          {index < steps.length - 1 && <span className="text-accent/70">→</span>}
        </span>
      ))}
    </div>
  );
}
