"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { HeroBackground } from "@/components/hero-background";
import { Typewriter } from "@/components/typewriter";
import { MagneticButton } from "@/components/magnetic-button";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative flex min-h-svh items-center pb-32 pt-24">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12">
        <motion.p
          className="font-mono text-[11px] tracking-[0.28em] text-ink-muted uppercase"
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {portfolio.eyebrow}
        </motion.p>

        <motion.h1
          className="display mt-6 max-w-4xl text-[2.55rem] leading-[1.08] text-ink sm:text-6xl md:text-7xl"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.18 }}
        >
          {portfolio.headline}
        </motion.h1>

        <motion.p
          className="mt-6 font-mono text-sm text-accent sm:text-base"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Typewriter phrases={portfolio.typewriterPhrases} />
        </motion.p>

        <motion.p
          className="mt-6 max-w-xl text-base leading-7 text-ink-muted sm:text-[17px]"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
        >
          {portfolio.supportingCopy}
        </motion.p>

        <motion.div
          className="mt-9 flex flex-wrap items-center gap-3"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.55 }}
        >
          <MagneticButton
            href="#work"
            className="border border-accent/30 bg-accent/10 text-accent hover:bg-accent/16"
          >
            View my work
          </MagneticButton>
          <MagneticButton
            href="#contact"
            className="border border-line-strong bg-transparent text-ink-soft hover:border-ink-muted hover:text-ink"
          >
            Let&apos;s build something
          </MagneticButton>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12px] text-ink-faint"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.75 }}
        >
          <span>{portfolio.currentlyBuilding}</span>
          <span className="hidden h-3 w-px bg-line-strong sm:block" />
          <span>{portfolio.stackLabel}</span>
          <span className="hidden h-3 w-px bg-line-strong sm:block" />
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-40" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            {portfolio.availability}
          </span>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] tracking-[0.22em] text-ink-faint uppercase md:flex"
      >
        <span>Scroll</span>
        <ArrowDown size={14} className="animate-bounce" />
      </a>
    </section>
  );
}
