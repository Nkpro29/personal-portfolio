import { ArrowUpRight } from "lucide-react";
import { portfolio } from "@/lib/portfolio";
import { Eyebrow, Reveal, Section } from "@/components/reveal";

export function Writing() {
  const publication = portfolio.publications[0];
  if (!publication) return null;

  return (
    <Section id="writing">
      <Reveal>
        <Eyebrow>Writing & thinking</Eyebrow>
        <article className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-12 sm:px-12 sm:py-16">
          <p className="font-mono text-[11px] tracking-[0.22em] text-ink-faint uppercase">
            Publication
          </p>
          <h2 className="display mt-5 max-w-3xl text-5xl leading-[1.05] sm:text-6xl md:text-7xl">
            {publication.title}
          </h2>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-muted">
            {publication.description}
          </p>
          {publication.url ? (
            <a
              href={publication.url}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm text-accent"
            >
              Read publication <ArrowUpRight size={14} />
            </a>
          ) : (
            <p className="mt-8 text-sm text-ink-faint">
              A public URL is not configured yet. Add it in the content layer when available.
            </p>
          )}
        </article>
      </Reveal>
    </Section>
  );
}
