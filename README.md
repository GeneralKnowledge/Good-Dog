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
| `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | Optional Web Push reminders |
| `CRON_SECRET` | Auth for `/api/cron/reminders` (≥16 chars) |

The core product works without any AI key. You can create an account, sign in, or **continue as a guest**. Guests get a full session on this device; add an email later from **My dog** to keep progress.

### Optional training reminders (Web Push)

1. Generate keys: `npx web-push generate-vapid-keys`
2. Set in `.env.local`: `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (e.g. `mailto:you@example.com`), and `CRON_SECRET` (≥16 chars)
3. Restart the app, then enable reminders under **My dog**
4. Call the cron endpoint on a schedule (every 5–15 minutes):

```bash
curl -X POST -H "Authorization: Bearer $CRON_SECRET" \
  https://your-domain/api/cron/reminders
```

Reminders send only if practice is still outstanding that day. iPhone delivery requires the app installed to the Home Screen. Use **Send test notification** on My dog to verify delivery.

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
npm run icons:generate  # re-render app icons from scripts/assets/app-icon.svg
```

## Install on your phone

Good Dog can be added to the Home Screen and opens full-screen like an app. A small service worker (`public/sw.js`) handles Web Push when reminders are configured; there is still no offline mode or page caching. You need a connection to use the app.

- **iPhone (Safari):** Share, then Add to Home Screen.
- **Android (Chrome):** menu, then Install app (or Add to Home screen).

Notes:

- The site must be served over **HTTPS** (localhost is fine for development). Plain HTTP will give a normal bookmark instead of an app.
- To pick up a changed icon or name, remove the shortcut and add it again. Phones cache these when the shortcut is created.
- On iPhone the Home Screen app keeps its own cookies, separate from Safari, so you sign in again the first time you open it. Sessions last 30 days from sign-in.
- Branding (name, colours) lives in `src/lib/app-meta.ts`; the manifest is `src/app/manifest.ts`.
- Each main page has a `loading.tsx` skeleton so taps respond instantly while the page loads. Prefetching only runs in production builds.

## Product map

- **Today** — persisted daily plan (2–3 short activities)
- **Learn** — curated exercise library by topic, plus a searchable training glossary
- **Shop** — optional kit ideas linked from training
- **My dog** — profile, guest claim, reminder settings, plain-English progress, history
- **Ask** — searchable approved help answers, glossary-grounded terminology (+ optional AI)

Progression is deterministic (no LLM required): prerequisites, welfare overrides, consolidation vs modest difficulty increases, and same-day plan stability.

Good Dog teaches proper training language gradually inside exercises (plain English first, technical term alongside, tap for a short definition). See [`docs/glossary-authoring.md`](./docs/glossary-authoring.md).

## Architecture notes

- UI in `src/app` and `src/components`
- Server actions in `src/lib/actions`, persistence in `src/lib/services`
- `src/lib/coaching`: domain-neutral planning and progression engine
- `src/lib/domains/dog-training`: dog-specific content, vocabulary and rules
- Historical exercise versions stored as JSON snapshots

See [docs/architecture.md](docs/architecture.md) for the module map, the import
rules that keep the engine reusable, and where each kind of change belongs.

### Knowledge base sync (DogResearch)

Safety rules and export metadata are vendored from [DogResearch](https://github.com/GeneralKnowledge/DogResearch) under `src/lib/domains/dog-training/content/kb-import/`. Ask uses the safety bundle for post-filters; daily plans respect recall promotion gates. Exercise copy in `exercises.ts` is **not** auto-synced — `held[]` in the domain export blocks blind overwrite of `ex-lead-loose`.

Refresh JSON after a KB release:

```bash
DOG_RESEARCH_PATH=/path/to/DogResearch ./scripts/sync-kb-import.sh
```

Or copy `dist/good-dog-*.json` from the DogResearch CI artifact `good-dog-kb-dist`.

## Testing

```bash
npm run db:seed
npm run test
npx playwright install chromium
npm run test:e2e
```

## Privacy

Account email, dog profile fields, plans, and session outcomes are private to the signed-in owner. Delete account from **My dog** to remove associated data. See `/privacy`.
