# Good Dog

A friendly, mobile-first web app that helps ordinary UK dog owners train their dogs through short, practical, reward-based activities.

**Open the app. Find out what to practise today. Follow simple instructions. Tell the app how it went. Get a better plan tomorrow.**

Good Dog provides general training guidance. It is not veterinary care, medical advice, or an individual behaviour assessment. It is an independent product and is not affiliated with or endorsed by IMDT or any other training organisation.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS
- SQLite via Drizzle ORM (simple local setup; schema is portable)
- Zod validation
- Vitest + Playwright

## Quick start

```bash
npm install
cp .env.example .env.local
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite file path (default `./data/good-dog.db`) |
| `AUTH_SECRET` | Session signing secret (required, ≥16 chars) |
| `DEFAULT_TIMEZONE` | Plan day boundary (default `Europe/London`) |
| `OPENAI_API_KEY` | Optional Ask-screen AI helper |
| `OPENAI_BASE_URL` / `OPENAI_MODEL` | Optional AI provider config |

The core product works without any AI key.

## Scripts

```bash
npm run dev          # local app
npm run db:seed      # create tables + seed ~20 exercises
npm run db:reset     # wipe local db and reseed
npm run test         # unit/integration (Vitest)
npm run test:e2e     # Playwright main journey
npm run lint
npm run typecheck
npm run build
```

## Product map

- **Today** — persisted daily plan (2–3 short activities)
- **Learn** — curated exercise library by topic
- **My dog** — profile, plain-English progress, history
- **Ask** — searchable approved help answers (+ optional AI)

Progression is deterministic (no LLM required): prerequisites, welfare overrides, consolidation vs modest difficulty increases, and same-day plan stability.

## Architecture notes

- UI in `src/app` and `src/components`
- Server actions in `src/lib/actions`, persistence in `src/lib/services`
- `src/lib/coaching`: domain-neutral planning and progression engine
- `src/lib/domains/dog-training`: dog-specific content, vocabulary and rules
- Historical exercise versions stored as JSON snapshots

See [docs/architecture.md](docs/architecture.md) for the module map, the import
rules that keep the engine reusable, and where each kind of change belongs.

## Testing

```bash
npm run db:seed
npm run test
npx playwright install chromium
npm run test:e2e
```

## Privacy

Account email, dog profile fields, plans, and session outcomes are private to the signed-in owner. Delete account from **My dog** to remove associated data. See `/privacy`.
