# Naman Kulshresth — Portfolio

A production personal site for Naman Kulshresth: full-stack software engineer focused on AI products, backend systems, and infrastructure.

The site is designed as an interactive product, not a resume pasted onto a webpage. Content is driven from `src/lib/portfolio.ts` and can be mirrored into Postgres via Prisma.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Framer Motion
- Prisma + PostgreSQL (Supabase)
- Gemini API (server-side only)
- Zod validation

## Setup

```bash
npm install
cp .env.example .env
```

Fill in:

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Supabase pooled Postgres URL |
| `DIRECT_URL` | Direct Postgres URL for migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `GEMINI_API_KEY` | Gemini key — never sent to the browser |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |
| `NEXT_PUBLIC_LINKEDIN_URL` | Optional LinkedIn URL |
| `NEXT_PUBLIC_GITHUB_URL` | Optional GitHub URL |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Optional email |
| `NEXT_PUBLIC_HERO_VIDEO_URL` | Optional looping hero mp4 |

The public pages render from the local content layer even without a database. Contact persistence and chat history require `DATABASE_URL`. The Ask Naman assistant uses Gemini when `GEMINI_API_KEY` is set, and falls back to retrieved portfolio knowledge otherwise.

## Database

```bash
npx prisma db push
npm run db:seed
```

Seed data is the resume-backed source of truth: Alnex.ai, India Accelerator, Augustun, NewspoD, The DevCraft, and SLIET. Missing links are stored as empty placeholders — the UI stays ready without inventing URLs.

## Develop

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy on Vercel

1. Connect the repository.
2. Set the environment variables from `.env.example`.
3. Build command is `npm run build` (`prisma generate` runs first).
4. After the first deploy, run `prisma db push` and `npm run db:seed` against the production database, or apply the schema from your machine with production `DATABASE_URL` / `DIRECT_URL`.

## Updating content

Edit `src/lib/portfolio.ts` for name, headline, experience, projects, skills, socials, and hero media. Then re-seed the database if you use it for the assistant knowledge base.

Do not add employers, projects, metrics, or links that are not verified.
