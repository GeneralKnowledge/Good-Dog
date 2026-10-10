# Architecture

Good Dog is split into small modules with one-way dependencies. The aim is that
each part can be understood, changed and tested on its own, and that the
reusable parts could later serve another app without being rewritten.

## Module map

```
src/app, src/components      UI (Next.js routes and React components)
        │
src/lib/actions              Server actions: validate input, call services
        │
src/lib/services             Persistence + orchestration (the only code that reads/writes the database)
        │                    ├── src/lib/db        Drizzle schema, schema bootstrap
        │                    └── src/lib/auth      Sessions and passwords
        ▼
src/lib/domains/dog-training   Specialised: content, vocabulary, rules for dogs
        │  implements CoachingPolicy
        ▼
src/lib/coaching               Common: domain-neutral planning and progression engine
```

| Module | Kind | Contains | May import |
| --- | --- | --- | --- |
| `src/lib/coaching` | Common | Progression state machine, plan generator, `CoachingPolicy` interface, shared types | Nothing from the rest of the app |
| `src/lib/domains/dog-training` | Specialised | Exercises, learning objectives, help articles, life stages, scoring rules, "why today" wording | `coaching` only |
| `src/lib/services`, `actions`, `db`, `auth` | Common (app layer) | Database access, auth, server actions | `coaching` and domains |
| `src/app`, `src/components` | UI | Pages and components | Everything above |

### Rules, and how they are enforced

1. **The engine never imports a domain, the database, auth, or the framework.**
   Enforced by ESLint (`no-restricted-imports`, see `eslint.config.mjs`).
2. **The engine never uses dog vocabulary** (dog, puppy, breed, and so on).
   Enforced by `tests/module-boundaries.test.ts`.
3. **A domain never imports the database, auth, services, or the framework.**
   It is content plus small pure functions. Enforced by ESLint.
4. **The table definitions have one source of truth.** `src/lib/db/schema.ts` is
   the Drizzle definition and `src/lib/db/ensure-schema.ts` creates the tables.
   The seed script and the tests call `ensureSchema` too, and
   `tests/schema-drift.test.ts` fails if the two ever disagree.

## The engine and the policy

The engine decides *how* a plan is built. A domain decides *what* is suitable.
The engine asks the domain through `CoachingPolicy` (`src/lib/coaching/policy.ts`):

| Method | Question the engine asks |
| --- | --- |
| `isEligible(exercise, subject)` | Could this exercise ever suit this subject? (For dogs: life stage.) |
| `dailyBudget(subject)` | How many minutes and items for a normal day? |
| `starterExercises(eligible, subject)` | Which gentle exercises should a brand-new subject start with? |
| `affinityScore(exercise, subject)` | How well does this exercise match their goals and experience? |
| `explain(input)` | What plain-English reason do we show for choosing it today? |

Everything else is generic and lives in the engine: prerequisites, easier and
harder variations, recent-repeat avoidance, variety, time budget, the
"at least one item" guarantee, and the skill-progress state machine.

Domain types extend two small engine types: `CoachingExercise` and
`CoachingSubject`. For dogs these are `ExerciseContent` and `DogSubject` in
`src/lib/domains/dog-training/types.ts`.

## Tests, and what each protects

| Test | Protects |
| --- | --- |
| `src/lib/coaching/*.test.ts` | Engine behaviour, using a tiny made-up domain so it cannot rely on dog rules |
| `src/lib/domains/dog-training/plan-generator.test.ts` | Dog plans satisfy sensible properties (starters, prerequisites, time) |
| `src/lib/domains/dog-training/golden-plans.test.ts` | Exact plan output for 100 recorded scenarios. Catches accidental behaviour change. |
| `tests/schema-drift.test.ts` | Schema bootstrap matches the Drizzle schema |
| `tests/module-boundaries.test.ts` | Engine stays domain-neutral |
| `tests/auth-isolation.test.ts` | Owners only see their own data; idempotent feedback |
| `e2e/main-journey.spec.ts` | The whole user journey in a browser |

If you change plan behaviour on purpose, regenerate the golden fixture and
review the diff:

```bash
UPDATE_GOLDEN=1 npx vitest run golden-plans
```

## Where things go

- **A new exercise or help article:** `src/lib/domains/dog-training/content/`.
  Bump `contentVersion` when changing an existing exercise, then run `npm run db:seed`.
- **A change to how plans are chosen for every domain:** `src/lib/coaching/`.
  Add a test using the neutral fixture in `plan-generator.test.ts`.
- **A change to how dogs specifically are matched:** `src/lib/domains/dog-training/policy.ts`.
- **A new page or form:** `src/app`, `src/components`, `src/lib/actions`.
- **Anything that touches the database:** `src/lib/services`.

## What is deliberately not modular yet

These would be the next steps only if a second app makes them worthwhile.

- **Database tables are still named for dogs** (`dogs`, `dog_skill_progress`). Only the
  engine's types were generalised. Renaming tables is a data migration with no benefit
  until a second domain needs the same tables.
- **The services layer is dog-specific.** `plans.ts` and `sessions.ts` import the dog
  domain directly. Making them take a domain as a parameter is straightforward once a
  second domain exists to design against.
- **Goal matching uses free text.** `dog-training/policy.ts` matches keywords in the
  "what would you like help with" answer. A fixed set of goals would be sturdier.
- **`describeSkillState` wording lives in the engine.** It is generic English today.
  Move it behind the policy if a domain needs different wording.
- **No monorepo or packages.** Folders and enforced import rules give the same
  separation without the tooling cost. Packaging can follow if it is ever needed.
