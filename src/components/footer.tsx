import { portfolio } from "@/lib/portfolio";
import { SocialLinks } from "@/components/social-links";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line px-5 pt-12 pb-32 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-ink">{portfolio.name}</p>
          <p className="mt-2 font-mono text-[11px] tracking-[0.2em] text-ink-faint uppercase">
            Software Engineer · AI · Systems
          </p>
        </div>
        <SocialLinks className="flex flex-wrap gap-5" />
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-line pt-6 text-xs text-ink-faint">
        <p>© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
