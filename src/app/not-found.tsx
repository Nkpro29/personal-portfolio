import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-[11px] tracking-[0.24em] text-ink-faint uppercase">404</p>
      <h1 className="display mt-4 text-5xl">This path is not in the system.</h1>
      <Link href="/" className="mt-8 text-sm text-accent">
        Return home
      </Link>
    </div>
  );
}
