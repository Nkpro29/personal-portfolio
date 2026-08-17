"use client";

import { portfolio } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";
import { SystemArchitecture } from "@/components/system-architecture";
import { StatsStrip } from "@/components/stats-strip";

export function About() {
  return (
    <Section id="about">
      <Reveal>
        <Eyebrow>About</Eyebrow>
        <h2 className="display max-w-3xl text-4xl leading-tight text-ink sm:text-5xl">
          {portfolio.aboutHeading}
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal delay={0.08} className="space-y-5 text-[17px] leading-8 text-ink-muted">
          {portfolio.aboutBody.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p>
            He currently works as a Full Stack Developer at Alnex.ai, after a software
            internship at India Accelerator. The through-line is the same: product surfaces,
            durable backends, and the infrastructure that makes them trustworthy.
          </p>
          <StatsStrip />
        </Reveal>
        <Reveal delay={0.14}>
          <SystemArchitecture layers={portfolio.systemLayers} />
        </Reveal>
      </div>
    </Section>
  );
}
