import { portfolio } from "@/lib/portfolio";

function Icon({ platform }: { platform: string }) {
  if (platform === "github") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M12 .5A11.5 11.5 0 0 0 .5 12.7c0 5.4 3.4 10 8.2 11.6.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.6-4-1.6-.5-1.3-1.3-1.7-1.3-1.7-1.1-.8.1-.8.1-.8 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.3 0 0 1-.3 3.4 1.2a11.4 11.4 0 0 1 6.2 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 3 .1 3.3.8.9 1.2 2 1.2 3.3 0 4.7-2.8 5.8-5.5 6.1.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6 4.8-1.6 8.2-6.2 8.2-11.6A11.5 11.5 0 0 0 12 .5Z" />
      </svg>
    );
  }
  if (platform === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
        <path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3.5 9.5h3v11h-3v-11Zm6 0h2.9v1.5h.1c.4-.8 1.4-1.7 2.9-1.7 3.1 0 3.7 2 3.7 4.7v6.5h-3v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1v5.9h-3v-11Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={className}>
      {portfolio.social.map((item) => (
        <li key={item.id}>
          {item.url ? (
            <a
              href={item.url}
              target={item.platform === "email" ? undefined : "_blank"}
              rel={item.platform === "email" ? undefined : "noreferrer"}
              className="inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <Icon platform={item.platform} />
              {item.label}
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 text-sm text-ink-faint">
              <Icon platform={item.platform} />
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
