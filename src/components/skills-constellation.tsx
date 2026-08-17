"use client";

import { useMemo, useState } from "react";
import { portfolio, skillCategories } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";
import { cn } from "@/lib/utils";

const POSITIONS: Record<string, { x: number; y: number }> = {
  "C/C++": { x: 90, y: 120 },
  JavaScript: { x: 170, y: 210 },
  TypeScript: { x: 110, y: 300 },
  Python: { x: 190, y: 390 },
  SQL: { x: 80, y: 470 },
  HTML: { x: 320, y: 90 },
  CSS: { x: 410, y: 70 },
  "React.js": { x: 500, y: 100 },
  "Next.js": { x: 590, y: 80 },
  "Tailwind CSS": { x: 390, y: 160 },
  "Three.js": { x: 510, y: 175 },
  Redux: { x: 450, y: 230 },
  EJS: { x: 310, y: 190 },
  "Node.js": { x: 640, y: 250 },
  "Express.js": { x: 730, y: 200 },
  FastAPI: { x: 820, y: 250 },
  "REST APIs": { x: 670, y: 330 },
  "Socket.IO": { x: 770, y: 310 },
  Git: { x: 860, y: 180 },
  GitHub: { x: 910, y: 240 },
  SQLAlchemy: { x: 800, y: 370 },
  Pydantic: { x: 720, y: 400 },
  Prisma: { x: 620, y: 410 },
  MongoDB: { x: 280, y: 500 },
  PostgreSQL: { x: 420, y: 520 },
  Supabase: { x: 540, y: 540 },
  Azure: { x: 660, y: 510 },
  Notion: { x: 300, y: 580 },
  Docker: { x: 500, y: 590 },
  RAG: { x: 900, y: 410 },
  LLM: { x: 940, y: 330 },
  LangChain: { x: 910, y: 490 },
};

export function SkillsConstellation() {
  const [active, setActive] = useState<string | null>(null);
  const skills = portfolio.skills;
  const byName = useMemo(
    () => new Map(skills.map((skill) => [skill.name, skill])),
    [skills],
  );

  const related = useMemo(() => {
    if (!active) return new Set<string>();
    const skill = byName.get(active);
    return new Set([active, ...(skill?.related ?? [])]);
  }, [active, byName]);

  const edges = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<[string, string]> = [];
    for (const skill of skills) {
      for (const name of skill.related) {
        if (!byName.has(name)) continue;
        const key = [skill.name, name].sort().join("::");
        if (seen.has(key)) continue;
        seen.add(key);
        list.push([skill.name, name]);
      }
    }
    return list;
  }, [byName, skills]);

  return (
    <Section id="skills">
      <Reveal>
        <Eyebrow>Technical map</Eyebrow>
        <h2 className="display max-w-3xl text-4xl leading-tight sm:text-5xl">
          A constellation, not a checklist.
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Hover a technology to see how it connects in Naman&apos;s work. Only skills from the
          resume are shown.
        </p>
      </Reveal>

      <div className="mt-10 hidden overflow-hidden rounded-2xl border border-line bg-surface lg:block">
        <svg
          viewBox="0 0 1000 650"
          className="h-auto w-full"
          role="img"
          aria-label="Interactive skill constellation"
        >
          {edges.map(([from, to]) => {
            const a = POSITIONS[from];
            const b = POSITIONS[to];
            if (!a || !b) return null;
            const lit = !active || (related.has(from) && related.has(to));
            return (
              <line
                key={`${from}-${to}`}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={lit ? "rgba(125,206,196,0.45)" : "rgba(238,241,246,0.06)"}
                strokeWidth={lit && active ? 1.4 : 1}
              />
            );
          })}
          {skills.map((skill) => {
            const pos = POSITIONS[skill.name];
            if (!pos) return null;
            const lit = !active || related.has(skill.name);
            const isActive = active === skill.name;
            return (
              <g
                key={skill.id}
                className="cursor-pointer"
                onMouseEnter={() => setActive(skill.name)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(skill.name)}
                onBlur={() => setActive(null)}
                tabIndex={0}
              >
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isActive ? 5 : 3.2}
                  fill={lit ? "#7dcec4" : "rgba(238,241,246,0.28)"}
                />
                <text
                  x={pos.x + 10}
                  y={pos.y + 4}
                  fontSize="11"
                  fill={lit ? "#eef1f6" : "#5e6672"}
                  fontFamily="ui-sans-serif, system-ui"
                >
                  {skill.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="mt-10 grid gap-6 lg:hidden">
        {skillCategories.map((category) => (
          <div key={category} className="rounded-2xl border border-line bg-surface p-5">
            <p className="font-mono text-[11px] tracking-[0.2em] text-ink-faint uppercase">
              {category}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {skills
                .filter((skill) => skill.category === category)
                .map((skill) => {
                  const lit = !active || related.has(skill.name);
                  return (
                    <button
                      key={skill.id}
                      type="button"
                      onClick={() => setActive((value) => (value === skill.name ? null : skill.name))}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        lit && active
                          ? "border-accent/40 bg-accent/10 text-accent"
                          : "border-line text-ink-muted",
                      )}
                    >
                      {skill.name}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
