"use client";

import { useState } from "react";
import { portfolio } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import { ProjectArchitecture } from "@/components/project-architecture";
import type { ProjectItem } from "@/lib/portfolio";

export function Projects() {
  const [active, setActive] = useState<ProjectItem | null>(null);

  return (
    <Section id="work">
      <Reveal>
        <Eyebrow>Selected work</Eyebrow>
        <h2 className="display max-w-3xl text-4xl leading-tight sm:text-5xl">
          Products with a system underneath.
        </h2>
      </Reveal>

      <div className="mt-16 space-y-24">
        {portfolio.projects.map((project, index) => (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            onOpenSystem={() => setActive(project)}
          />
        ))}
      </div>

      <ProjectArchitecture project={active} onClose={() => setActive(null)} />
    </Section>
  );
}
