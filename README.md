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
- **Learn** — curated exercise library by topic, plus a searchable training glossary
- **My dog** — profile, plain-English progress, history
- **Ask** — searchable approved help answers, glossary-grounded terminology answers (+ optional AI)

Progression is deterministic (no LLM required): prerequisites, welfare overrides, consolidation vs modest difficulty increases, and same-day plan stability.

### Training terminology

Good Dog teaches proper training language gradually inside exercises (plain English first, technical term alongside, tap for a short definition). Owners can browse or search the glossary in Learn. Optional AI, when configured, must use the approved glossary rather than inventing conflicting definitions.

See [`docs/glossary-authoring.md`](./docs/glossary-authoring.md) and [`docs/terminology-teaching-audit.md`](./docs/terminology-teaching-audit.md).

## Architecture notes

- UI in `src/app` and `src/components`
- Server actions in `src/lib/actions`
- Domain services in `src/lib/domain` and `src/lib/services`
- Seeded exercise content in `src/lib/content`
- Historical exercise versions stored as JSON snapshots

## Testing

```bash
npm run db:seed
npm run test
npx playwright install chromium
npm run test:e2e
```

## Privacy

Account email, dog profile fields, plans, and session outcomes are private to the signed-in owner. Delete account from **My dog** to remove associated data. See `/privacy`.

## Welfare and curriculum audit

An internal, evidence-based audit against *publicly documented* IMDT ethics and UK dog welfare guidance lives in [`docs/`](./docs/). It identifies gaps and a prioritised improvement roadmap. Completing or reading that audit does **not** mean Good Dog is IMDT approved, endorsed, accredited, or professionally reviewed.

| Document | Purpose |
| --- | --- |
| [docs/welfare-principles-audit.md](./docs/welfare-principles-audit.md) | Principles matrix, evidence, risks |
| [docs/exercise-content-audit.md](./docs/exercise-content-audit.md) | Inventory and review status of all exercises |
| [docs/progression-audit.md](./docs/progression-audit.md) | Scenario traces through the real planner |
| [docs/improvement-roadmap.md](./docs/improvement-roadmap.md) | P0–P3 implementation plan |
| [docs/content-review-checklist.md](./docs/content-review-checklist.md) | Pre-publication checklist for new/revised exercises |
<<<<<<< HEAD
| [docs/terminology-teaching-audit.md](./docs/terminology-teaching-audit.md) | Baseline audit before the glossary teaching layer |
| [docs/glossary-authoring.md](./docs/glossary-authoring.md) | How to add/review glossary terms |

## Content provenance

Glossary definitions are original Good Dog educational content. Public IMDT and UK welfare materials were used only as general accuracy checks for principles — not as copy sources, and not as evidence of endorsement. Good Dog is independent and does not claim IMDT approval, accreditation, or professional review.
=======
>>>>>>> origin/cursor/good-dog-mvp-e953
