"use client";

import { portfolio } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";
import { ExperienceCard } from "@/components/experience-card";

export function ExperienceTimeline() {
  const education = portfolio.education[0];

  return (
    <Section id="experience">
      <Reveal>
        <Eyebrow>Experience</Eyebrow>
        <h2 className="display max-w-3xl text-4xl leading-tight sm:text-5xl">
          Production work, not slide decks.
        </h2>
      </Reveal>

      <div className="relative mt-14">
        <div className="absolute top-0 bottom-0 left-[11px] w-px bg-line md:left-1/2 md:-translate-x-px" />
        <div className="space-y-10">
          {portfolio.experiences.map((job, index) => (
            <ExperienceCard key={job.id} job={job} index={index} />
          ))}
        </div>
      </div>

      {education && (
        <Reveal className="mt-16 border-t border-line pt-10">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
            Education
          </p>
          <p className="mt-3 text-lg text-ink-soft">{education.institution}</p>
          <p className="mt-1 text-sm text-ink-muted">
            {education.degree}
            {education.detail ? ` · ${education.detail}` : ""} · {education.startDate} –{" "}
            {education.endDate}
          </p>
        </Reveal>
      )}
    </Section>
  );
}
