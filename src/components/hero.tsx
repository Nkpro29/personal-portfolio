"use client";

import { motion, useReducedMotion } from "framer-motion";
import { portfolio } from "@/lib/portfolio";
import { HeroBackground } from "@/components/hero-background";
import { MagneticButton } from "@/components/magnetic-button";
import { Typewriter } from "@/components/typewriter";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section id="top" className="relative min-h-svh overflow-hidden">
      <HeroBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="flex min-h-svh flex-col pt-[15vh] pb-29 sm:pt-[17vh] sm:pb-36.5">
          <div className="max-w-190">
            <motion.p
              className="font-mono text-[11px] tracking-[0.34em] text-ink-muted/85 uppercase"
              initial={reduce ? false : { opacity: 0.001, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {portfolio.eyebrow}
            </motion.p>

            <motion.h1
              className="display mt-4.5 max-w-[12ch] text-[clamp(3rem,5.6vw,5.2rem)] leading-[0.98] tracking-[-0.03em] text-ink"
              initial={reduce ? false : { opacity: 0.001, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              {portfolio.headline}
            </motion.h1>

            <motion.p
              className="mt-5 min-h-7 text-[18px] font-medium tracking-[0.01em] text-accent sm:min-h-7.5"
              initial={reduce ? false : { opacity: 0.001 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45 }}
            >
              <Typewriter phrases={portfolio.typewriterPhrases} />
            </motion.p>

            <motion.p
              className="mt-4.5 max-w-160 text-[16px] leading-[1.8] text-ink-muted sm:text-[17px]"
              initial={reduce ? false : { opacity: 0.001, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {portfolio.supportingCopy}
            </motion.p>

            <motion.div
              className="mt-7 flex flex-wrap items-center gap-4"
              initial={reduce ? false : { opacity: 0.001, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <MagneticButton
                href="#work"
                className="min-w-43 border border-accent/40 bg-accent/8 px-6 py-3 text-[14px] tracking-wide text-accent shadow-[0_10px_34px_rgba(18,26,29,0.28)] transition-colors hover:border-accent/75 hover:bg-accent/14"
              >
                View my work &rarr;
              </MagneticButton>
              <MagneticButton
                href="#contact"
                className="min-w-52.5 border border-line-strong bg-white/3 px-6 py-3 text-[14px] tracking-wide text-ink-soft backdrop-blur-sm transition-colors hover:border-ink-muted hover:bg-white/5 hover:text-ink"
              >
                Let&apos;s build something
              </MagneticButton>
            </motion.div>
          </div>

          <motion.div
            className="mt-auto pb-0 text-[13px] text-ink-muted sm:text-[14px]"
            initial={reduce ? false : { opacity: 0.001 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45 }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
              <span>{portfolio.currentlyBuilding}</span>
              <span className="text-ink-faint">|</span>
              <span>{portfolio.stackLabel}</span>
              <span className="text-ink-faint">|</span>
              <span className="inline-flex items-center gap-2">
                <span
                  className="relative inline-flex h-1.75 w-1.75 rounded-full bg-accent shadow-[0_0_18px_rgba(125,206,196,0.35)]"
                  aria-hidden="true"
                />
                {portfolio.availability}
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
