# Coaching App Template: Research and Design Guide

Status: proposal, for discussion. No application code is changed by this document.

This guide answers two questions:

1. Does a template for this kind of app already exist, so that we would be reinventing the wheel?
2. If not, what should a comprehensive template look like, and how do we get there from Good Dog?

## 1. Short answer

**Half of it exists, and we should not build that half. The other half, the part that makes Good Dog interesting, does not exist as a template.**

| Layer | What it is | Does a template exist? | Our move |
| --- | --- | --- | --- |
| **Shell** | Auth, accounts, billing, teams, email, admin, marketing site, i18n | Yes, many (paid and free) | Adopt one. Do not hand-roll more of it. |
| **Coaching core** | Daily plan generator, outcome-driven progression, welfare overrides, "why today", versioned content | No complete one. Only fragments (spaced-repetition engines, habit trackers) | This is our asset. Extract and generalise it. |
| **Domain pack** | Dog training content, vocabulary, safety rules | Not applicable (it is the content) | Good Dog becomes pack number one. |

The accurate framing is: Good Dog has already built a good, small coaching core and a minimal shell. If we want "all the bells and whistles", the cheapest route is to put our core on a mature shell, not to grow our hand-rolled shell until it matches one.

### What the market search found

Search was done on 2026-10-10. I read vendor and README summaries. **I have not audited licences, code quality, maintenance status or security for any of these.** Treat this as a shortlist, not a verdict.

**Shell candidates (SaaS starter kits):**

| Kit | Stack highlights | Fit for us |
| --- | --- | --- |
| [MakerKit](https://makerkit.dev/) | Next.js 16, Supabase/Drizzle/Prisma, Better Auth, Stripe, teams/RBAC, super admin, AGENTS.md and MCP for coding agents. OSS lite, paid Pro. | Strong on breadth. Built for multi-tenant B2B, which is more than a B2C dog app needs. |
| [supastarter](https://supastarter.dev/) | Next.js (also Nuxt, TanStack, SvelteKit), Better Auth (passkeys, 2FA), many payment providers, organisations, i18n, AGENTS.md and Agent Skills. Paid, one-off. | Strong on breadth and agent-friendliness. Same B2B bias. |
| ShipFast | Lean single-tenant launch kit. | Closest to B2C simplicity. Lacks teams, RBAC. |
| [Open SaaS](https://github.com/wasp-lang/open-saas) | Free, MIT, auth, Stripe/Polar, jobs, uploads. Wasp framework, not Next.js. | Would mean leaving Next.js. |
| `nextjs/saas-starter` | Free, MIT, Next.js, Postgres, Drizzle, Stripe. Shallow teams. | Good learning base, thin. |
| `ixartz/SaaS-Boilerplate` | Free, actively maintained per [a 2026 comparison](https://makerkit.dev/blog/saas/best-nextjs-saas-boilerplate). | Candidate for a free route. |

Caveat on sources: the comparison article is published by MakerKit, which is one of the products compared. Cross-check pricing and claims against each vendor's own docs before deciding.

**Coaching-core fragments:**

| Project | What it has | What it lacks for us |
| --- | --- | --- |
| [Loopi](https://github.com/nicholaspsmith/Loopi) | AI-generated skill trees, FSRS spaced repetition, streaks, dashboards | Flashcard and knowledge model. No "do a physical activity, report how it went" loop, no welfare logic. |
| [adaptcard](https://github.com/fkx816/adaptcard) | Domain-agnostic, API-first spaced-repetition engine | Review scheduling only. No day plans, no progression states. |
| [habit-coach](https://github.com/rasfies/habit-coach) | Check-ins, streaks, grace days, AI coaching, Expo mobile, Turborepo | Habit tracking, not curriculum-driven planning. |
| [adaptive-learning-agent](https://github.com/jas212-on/adaptive-learning-agent) | Bayesian knowledge tracing, concept graphs | Heavy, Python, built around screen capture and quizzes. |

None of these combine: a curriculum with prerequisites, a deterministic daily plan within a time budget, easier/harder variations chosen from outcome history, a hard welfare override, and a plain-English explanation for each choice. That combination is what Good Dog does today (see `src/lib/domain/`).

One adjacent building block is worth knowing about: **FSRS** (a modern spaced-repetition algorithm) is available as a library. It suits "when should this skill be revisited?" and could become an optional scheduling module in the core. It is not a replacement for the plan generator.

### Verdict

- We have **not** reinvented the wheel in the coaching core.
- We **would** be reinventing the wheel if we kept extending the shell (billing, teams, notifications, admin, i18n) by hand.
- A template is justified only if it is a **core plus domain-pack contract on top of an adopted shell**. A generic "coaching starter" that also reimplements auth and billing would compete with mature products and lose.

## 2. What the pattern is

Good Dog's loop, stated generically:

> Open the app. See what to practise today (small, time-boxed). Do it. Report how it went in one tap. Get a better plan tomorrow.

Call this a **coaching app**: a *subject* (the thing being coached) progresses through a *curriculum* of *activities*, guided by *outcomes* the user reports.

Domains where the same loop plausibly fits (each is a hypothesis to validate, see section 9):

- Pet training (dogs, cats, horses)
- Physio and rehab home exercises (strong safety and escalation needs)
- Instrument practice
- Language micro-practice for kids or adults
- Parent-led early-years activities (speech, motor skills)
- Fitness progression for beginners
- Habit and skill programmes where a person is the subject, not an animal

Note the difference between *who uses the app* (the user) and *who is coached* (the subject). For dogs these differ. For language learning they are the same person. The template must support both.

## 3. Where Good Dog stands today

### 3.1 What is already generic

| Concern | Location | Notes |
| --- | --- | --- |
| Progression state machine | `src/lib/domain/progression.ts` | Pure functions, config-driven thresholds, unit tested. Domain-neutral apart from enum wording. |
| Plan generator | `src/lib/domain/plan-generator.ts` | Pure function: eligibility, prerequisites, scoring, time budget, variety, minimum one item. Mostly generic. |
| Explanation text | `src/lib/domain/why-today.ts` | Template strings. Generic structure, domain-specific wording. |
| Versioned content | `exercise_versions` table | Sessions point at the exact content version the user saw. Valuable and rare in starters. |
| Idempotent feedback | `client_mutation_id` on sessions | Safe retries. Good offline-first groundwork. |
| Plan stability | unique `(dog_id, plan_date)` | Same-day plans do not reshuffle. |
| Layering | `actions` -> `services` -> `domain` | Domain logic has no framework imports. This is what makes extraction feasible. |

### 3.2 What is coupled to dogs or the UK

These are the extraction work items. Each is a concrete file and line of reasoning, not a guess.

| Coupling | Where | Generalisation |
| --- | --- | --- |
| Entity named `dog`, fields `lifeStage`, `breedOrMix`, `knownTriggers`, `preferredRewards` | `src/lib/db/schema.ts`, `validation.ts`, `DogPlanInput` | `subject` with a pack-defined profile schema (core fields plus a typed JSON profile). |
| `LifeStage` enum hardcoded in core types and in the exercise filter | `src/lib/types.ts`, `plan-generator.ts` | Pack-defined *eligibility facets* (life stage is one facet), matched generically. |
| Free-text `primaryReason` matched with `includes("recall")`, `includes("walk")`, and similar | `scoreExercise` in `plan-generator.ts` | Pack-defined *goals* as an enum or tag set. String matching on free text is fragile and cannot be i18n'd. |
| Hardcoded starter exercise ids (`ex-engagement-easy`, and others) | `starterPool` in `plan-generator.ts` | Pack declares `starterActivityIds` or a `starter: true` flag on content. |
| Hardcoded categories in scoring | `scoreExercise` | Pack supplies a `goalToCategoryWeights` map. |
| Outcomes `easy / getting_there / too_difficult` and `welfareConcern` | `types.ts`, `feedbackSchema` | Core keeps a fixed three-point outcome scale and a *safety flag* concept. Pack renames labels and defines what the flag escalates to. |
| `TopicGroup` enum | `types.ts` | Pack-defined groups. |
| Timezone default `Europe/London`, UK English, UK vet/pro advice | `schema.ts`, `dates.ts`, `ask.ts` system prompt | Per-user timezone (already stored, but defaulted), locale files, pack-level safety copy. |
| Content lives in TypeScript arrays, `sessions.ts` reads `EXERCISE_LIBRARY` directly | `src/lib/content/*`, `services/sessions.ts` | Content loaded through a pack interface (file, DB or CMS), not imported by name. |
| Copy and branding (`good_dog_session` cookie, "Good Dog" in prompts) | `session.ts`, `ask.ts`, README | App config. |

### 3.3 Gaps against "bells and whistles"

Verified by searching the repository: there is no billing, notification or reminder code, no web manifest or service worker, no i18n, no product analytics, no admin or content tooling, no email sending, and no password reset. The README states auth is email plus password with a signed JWT cookie.

### 3.4 Technical debt to settle before templating

These would be copied into every app built from the template, so they matter more in a template than in one app.

1. **Schema is defined twice.** `src/lib/db/schema.ts` (Drizzle) and `src/lib/db/ensure-schema.ts` (hand-written SQL, about 110 lines) describe the same tables. They will drift. Use Drizzle migrations as the single source (the repo already has `drizzle.config.ts` and `drizzle-kit`).
2. **SQLite file database.** Excellent for local development and single-node hosting. Not suitable for serverless or multi-instance deployment. A template should default to Postgres and keep SQLite as a documented local option, or commit to one.
3. **Stateless JWT sessions with no revocation.** A 30-day signed cookie cannot be invalidated server-side (for example after a password change or a lost device). A shell with session storage solves this.
4. **`progression.ts` `getting_there` branch** is a nested ternary that reduces to "introduced if not yet introduced, otherwise practising". It is correct but hard to read. Rewrite as a transition table before it becomes the template's public contract, keeping the existing tests as the safety net.
5. **Plan generator is one 330-line module** mixing eligibility, scoring and selection. Split into pipeline stages (section 5.3) so packs can override one stage.
6. **Content in code means content changes need a deploy.** Fine for an MVP, a blocker for a content team.

## 4. Target architecture

Three layers with one-way dependencies:

```
┌──────────────────────────────────────────────┐
│ Domain pack  (dog-training, physio, ...)     │  content, vocabulary, safety copy, profile schema
├──────────────────────────────────────────────┤
│ Coaching core  (pure TypeScript package)     │  plans, progression, safety, explanations
├──────────────────────────────────────────────┤
│ Shell  (adopted starter kit)                 │  auth, billing, orgs, email, admin, marketing, i18n
└──────────────────────────────────────────────┘
```

Rules:

- The **core** has no dependency on Next.js, the database, or any shell. It takes plain data in and returns plain data out. (This is already true of `src/lib/domain/`.)
- A **pack** depends on the core's types only. It never imports shell code.
- The **shell** depends on the core through thin adapters (server actions and services), which are the only place that touches the database.

Suggested repository layout (monorepo, npm workspaces or Turborepo):

```
packages/
  coaching-core/        # domain/, types, pack contract, conformance tests
  pack-dog-training/    # Good Dog content + config (first reference pack)
  pack-example-minimal/ # tiny second pack used to prove the contract
apps/
  web/                  # the shell + adapters + UI
docs/
```

Do not split into a monorepo until the contract exists. Do the extraction inside the current repo first (section 8, phase 1), then move.

### 4.1 Shell: three realistic options

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| **A. Adopt a paid kit** (MakerKit or supastarter) | Port the core and pack onto it | Fastest route to the full feature list. Agent-friendly docs. | Licence cost and terms. Upstream updates may conflict with our changes. B2B-leaning data model. |
| **B. Adopt a free kit** (for example `ixartz/SaaS-Boilerplate`, `nextjs/saas-starter`) | Same, with an OSS base | No licence cost, can fork freely | Thinner feature set. We build more ourselves. |
| **C. Stay hand-rolled, add libraries** | Better Auth, Resend, Stripe SDK, and so on, wired by us | Full control, no kit lock-in | We own every integration and every security fix. This is the wheel-reinventing path. |

**Recommendation:** decide between A and B after a time-boxed spike (section 8, phase 0) that ports one vertical slice (sign in, onboarding, today's plan) onto each candidate. Do not choose from marketing pages. Whichever is chosen, require: Postgres, a maintained auth library with session storage, Stripe-compatible billing, and an `AGENTS.md`-style convention doc.

If the template is intended to be sold or shared as a product itself, check each kit's licence for redistribution rights before building on it. Many paid kits forbid redistributing the source.

## 5. Coaching core specification

### 5.1 Generalised entities

| Core term | Good Dog term | Notes |
| --- | --- | --- |
| Account | `user` | The person who signs in |
| Subject | `dog` | Who is coached. May equal the account owner. Many subjects per account. |
| Skill | `learning objective` | What progress is tracked against |
| Activity | `exercise` | A concrete, versioned thing to do |
| Activity version | `exercise_version` | Immutable snapshot |
| Plan | `daily_plan` | Items for one subject on one local date |
| Session | `training_session` | One reported attempt |
| Progress | `dog_skill_progress` | State per (subject, skill) |

### 5.2 Pack contract (TypeScript sketch)

A sketch to drive discussion, not final signatures.

```ts
interface CoachingPack<Profile, Goal extends string, Facet extends string> {
  id: string;                       // "dog-training"
  version: string;                  // semver, recorded on plans for reproducibility
  locale: string;                   // default locale

  vocabulary: { subject: string; skill: string; activity: string; session: string };

  profile: {
    schema: ZodType<Profile>;       // onboarding + edit validation
    facets(profile: Profile): Record<Facet, string>;  // e.g. { lifeStage: "adult" }
    goals(profile: Profile): Goal[];
    timeBudgetMinutes(profile: Profile): number;
  };

  curriculum: {
    skills: Skill[];
    activities: Activity<Facet>[];  // prerequisites, variations, difficulty, eligibility facets
    starterActivityIds: string[];
    goalWeights: Record<Goal, Record<string /*category*/, number>>;
  };

  outcomes: {
    labels: Record<"easy" | "getting_there" | "too_difficult", string>;
    safetyFlag: { label: string; escalation: EscalationRule };
  };

  safety: {
    escalationTopics: EscalationTopic[]; // e.g. biting, severe fear -> "see a vet or qualified professional"
    disclaimer: string;
    aiSystemPrompt(context: { subjectName: string }): string;
  };

  help: HelpArticle[];

  config?: Partial<ProgressionConfig>;
}
```

Design constraints:

- The pack is **data plus small pure functions**. It must be loadable and validatable at build time (Zod), so a bad pack fails CI, not production.
- Facets generalise `lifeStage`. A physio pack might use `recoveryStage` and `affectedArea`. A matching rule stays generic: an activity is eligible when each declared facet value includes the subject's value.
- Goals are a **closed set**, not free text, so scoring and analytics are stable and translatable. Free text can remain as a note.

### 5.3 Plan generator as a pipeline

Split the current function into stages, each independently testable and overridable by a pack:

1. **Eligible**: facet match, published, prerequisites met.
2. **Resolve variation**: swap to easier or harder variant from progress state.
3. **Score**: base difficulty, goal weights, progress-state weights, recency penalty, variety penalty.
4. **Select**: time budget, item count, variety across categories, minimum one item.
5. **Explain**: build a `whyToday` string per item from structured reasons.

Make stage 5 consume a structured reason (`{ kind: "easier_variation" | "step_up" | "starter" | ... }`) instead of the generator inferring text. This lets locales and packs own wording, and lets analytics count reasons.

### 5.4 Progression and safety invariants

These already exist in code and tests. Promote them to a **conformance test suite** shipped with the core that every pack and every app must pass:

- One easy result never jumps a skill straight to "ready to increase".
- `too_difficult` or the safety flag always moves a skill to "needs easier" and resets the streak.
- A safety flag overrides every other signal.
- Missing a day never reduces progress or shows a penalty. (Already stated in the help content: "Good Dog will never punish you for resting.")
- Same-day plan is stable across reloads.
- Feedback submission is idempotent per `clientMutationId`.
- A plan always has at least one item when any eligible activity exists.
- Sessions reference the exact content version the user saw.

### 5.5 Optional core modules (off by default)

| Module | Purpose | Notes |
| --- | --- | --- |
| Review scheduler (FSRS) | Revisit consolidated skills at growing intervals | Optional library. Adds a "review" role to plan items. |
| Multi-subject plans | One home screen for several subjects | Needed for households with two dogs. |
| Coach and learner roles | A professional assigns or edits plans | Opens B2B2C (trainers, therapists). Big data-model impact, so decide early even if built late. |
| Adaptive difficulty tuning | Per-pack tuning of thresholds from aggregate data | Only with enough users and consent. |

## 6. "Bells and whistles" checklist

Priority: **P0** = every app from the template needs it. **P1** = expected for a polished product. **P2** = differentiators. "Source" says where it should come from.

### Accounts and identity

| Item | Pri | Source | Status in Good Dog |
| --- | --- | --- | --- |
| Email + password sign-up and sign-in | P0 | Shell | Done (hand-rolled) |
| Email verification, password reset | P0 | Shell | Missing |
| OAuth (Google, Apple), magic link | P1 | Shell | Missing |
| Passkeys, 2FA | P2 | Shell | Missing |
| Server-side sessions with revocation, "sign out everywhere" | P0 | Shell | Missing (stateless JWT) |
| Household sharing (invite another carer to a subject) | P1 | Core + shell | Missing |
| Account deletion and data export | P0 | Shell + core | Deletion done. Export missing. |
| Rate limiting on auth endpoints | P0 | Shell | Missing |

### Engagement and retention

| Item | Pri | Source | Status |
| --- | --- | --- | --- |
| Reminder notifications (email, web push, later native) with user-chosen time and quiet hours | P0 | Shell + core | Missing |
| Installable PWA (manifest, icons, offline shell) | P1 | Shell | Missing |
| Offline-tolerant feedback queue (uses existing `clientMutationId`) | P1 | Core + shell | Groundwork only |
| Weekly summary email in plain English | P1 | Core + shell | Missing |
| Progress views (milestones, history) without punitive streaks | P0 | Core | Basic |
| Gamification, only if it passes the "never punish rest" rule | P2 | Core | Missing |
| Native apps (Expo) sharing the core package | P2 | Separate app | Missing |

### Content and coaching

| Item | Pri | Source | Status |
| --- | --- | --- | --- |
| Versioned activities | P0 | Core | Done |
| Content admin and review workflow (draft, review, publish) | P1 | Shell admin + pack | Missing. Content is in code. |
| Media: images, video, audio per activity step | P1 | Shell storage | Missing |
| Search and approved-answer help | P0 | Core | Done (keyword search) |
| Optional AI helper constrained to approved content, with escalation rules | P1 | Core | Done (single provider, prompt in action) |
| AI guardrails: output checks, logging, kill switch, cost cap | P1 | Core + shell | Missing |
| Escalation to a human or professional directory | P1 | Pack | Text advice only |
| Content provenance and expert review metadata (who reviewed, when) | P1 | Pack | Missing |

### Money and growth

| Item | Pri | Source | Status |
| --- | --- | --- | --- |
| Subscriptions, trials, coupons, customer portal | P1 | Shell | Missing |
| Entitlements (what each plan unlocks) as one code path | P1 | Shell | Missing |
| Marketing site, pricing page, SEO, OpenGraph, sitemap | P1 | Shell | Missing |
| Referral or share loops | P2 | Shell | Missing |
| Transactional email with templates | P0 | Shell | Missing |

### Quality, safety, compliance

| Item | Pri | Source | Status |
| --- | --- | --- | --- |
| Accessibility to WCAG 2.2 AA (focus, contrast, reduced motion, screen reader) | P0 | Shell + UI | Not audited |
| Internationalisation (message catalogues, locale-aware dates, plural rules) | P1 | Shell + pack | Missing, UK English hardcoded |
| Privacy policy, cookie consent where required, GDPR rights, data retention | P0 | Shell | Privacy page exists |
| Security headers, CSRF posture for server actions, dependency audit, secrets handling | P0 | Shell | Not audited |
| Audit log for admin and safety-flag events | P1 | Shell | Missing |
| Disclaimers and medical/veterinary boundary copy per pack | P0 | Pack | Done for dogs |
| Child-data considerations if a pack targets minors (age gating, parental consent) | P0 for such packs | Pack + shell | Not applicable yet |

### Engineering and operations

| Item | Pri | Source | Status |
| --- | --- | --- | --- |
| Unit, integration, and end-to-end tests | P0 | All | Present (Vitest, Playwright) |
| Core conformance suite (section 5.4) | P0 | Core | Partial, to formalise |
| CI: lint, typecheck, test, build, e2e on every PR | P0 | Repo | Not present in the repo |
| Preview deployments per PR | P1 | Hosting | Missing |
| Migrations with rollback notes | P0 | Shell | Drift-prone, see 3.4 |
| Error tracking and logging | P1 | Shell | Missing |
| Product analytics with consent (events defined in the pack) | P1 | Shell | Missing |
| Feature flags | P1 | Shell | Missing |
| Backups and restore drill | P0 | Hosting | Not defined |
| Seed and demo data command | P0 | Repo | Done (`db:seed`) |
| Scaffolder (`create-coaching-app`) that prompts for pack and shell options | P2 | Template | Missing |

## 7. Decisions to make early

These are hard to reverse. Settle them before phase 2.

1. **Who is the subject?** One of: the user, a dependent (child, pet), or either. Affects consent, copy, and data model.
2. **B2C only, or B2B2C?** If trainers or clinicians will manage clients, we need roles and organisations in the data model now.
3. **Content authorship.** Code-reviewed files, a CMS, or both? Who is allowed to publish, and what is the review step for safety-sensitive content?
4. **Regulated domains.** A physio or health pack changes liability, data protection class (health data is special-category under UK GDPR), and AI-use policy. Treat these as a separate product decision, not just another pack.
5. **Licence of the template.** Internal, open source, or commercial. This constrains which shell kits we may build on.
6. **AI posture.** Core works with no AI (a strength today). Decide whether AI stays an optional enhancement behind approved content, and whether we support multiple providers.
7. **Database.** Postgres as the template default (recommended), with SQLite only for local quick-start if we can keep both honest.

## 8. Phased roadmap

Phases have exit criteria rather than dates. Each phase should land as its own PR or short series.

### Phase 0: Decide

- Run the shell spike: port sign-in, onboarding and today's plan onto 2 to 3 candidates.
- Record the A/B/C decision and the answers to section 7 in an ADR (`docs/adr/`).
- **Exit:** ADR merged, shell chosen, licence question answered.

### Phase 1: Extract the core inside this repo

- Remove the double schema definition. Move to Drizzle migrations.
- Introduce `subject` naming in the core types only (database rename can follow).
- Define `CoachingPack` and load the dog content through it. `sessions.ts` and `plans.ts` stop importing `EXERCISE_LIBRARY` directly.
- Replace free-text `primaryReason` matching with a closed goal set.
- Split the plan generator into pipeline stages. Refactor the progression transitions into a table.
- Add the conformance suite.
- **Exit:** the Good Dog app behaves identically (existing tests and e2e pass unchanged), but nothing in `domain/` mentions dogs.

### Phase 2: Prove it with a second pack

- Write `pack-example-minimal` in a very different domain (for example, a beginner ukulele programme with a person as the subject). Keep it to about 10 activities.
- Run the same conformance suite against it. Fix every place the core leaks dog assumptions.
- **Exit:** a second pack runs end to end with no change to core code. If it needs core changes, the contract is not done.

### Phase 3: Move onto the shell

- Create the monorepo layout, port auth, billing and email from the chosen shell.
- Keep adapters thin: the only code that touches the DB and calls the core.
- **Exit:** Good Dog runs on the shell with parity, plus verified email, password reset and server-side sessions.

### Phase 4: Engagement features

- Reminders (email first, then web push), PWA, offline feedback queue, weekly summary.
- **Exit:** a user can install the app and get a reminder at their chosen time. The feedback flow works offline and syncs without duplicates.

### Phase 5: Content operations

- Admin UI for draft, review, publish. Provenance metadata. Media upload.
- **Exit:** a non-developer can publish a new activity version and see it in a plan without a deploy.

### Phase 6: Monetisation, growth and polish

- Plans and entitlements, marketing site, i18n, analytics, feature flags, error tracking.
- **Exit:** a new locale and a paid tier can each be added without touching core code.

### Phase 7: Productise the template

- Scaffolder, documentation site, pack authoring guide, example packs.
- **Exit:** a person who did not write the code can create a working app from a new pack by following the docs.

## 9. How we will know the template is real

A template is only proven by being used. Acceptance tests for the whole effort:

1. **Second-pack test.** A different-domain pack passes the conformance suite with zero core changes (Phase 2).
2. **No-dogs grep.** `rg -i "dog|puppy|breed" packages/coaching-core` returns nothing.
3. **Cold-start test.** A new developer, or a fresh agent, creates a working app from the docs alone, in one sitting.
4. **Upgrade test.** A change to the core (for example, a new progression rule) can be pulled into both apps without conflicts in pack or shell code.
5. **Safety test.** In every pack, a safety-flagged session produces the easier variation and shows the escalation copy, verified in e2e.

## 10. Risks

| Risk | Why it matters | Mitigation |
| --- | --- | --- |
| Over-generalising from one domain | Abstractions designed from a single example usually fit it too well | Phase 2 second pack, chosen to differ (person as subject, no welfare angle) |
| Building a "framework" nobody needs | Template effort may exceed the value if there is only one app | Phases 0 to 3 pay off for Good Dog alone (real shell, real security). Do not start Phases 5 to 7 until a second app is real. |
| Shell lock-in or licence limits | Kits evolve and may restrict redistribution | ADR, adapter boundary, licence check |
| Regulated domains | Health data and advice carry legal exposure | Treat as separate product decision (section 7.4) |
| AI producing unsafe advice | Reputational and welfare harm | Approved-content-only prompting, escalation rules, output checks, kill switch |
| Content quality is the real moat | Code is the easy part | Invest in provenance, expert review, and versioning from the start |

## 11. Open questions for you

1. Is the goal a **reusable internal base** for your own apps, a **product you sell or open-source**, or mainly a way to make Good Dog more complete? The answer changes licence, docs and scaffolder priority.
2. Which second domain do you actually have in mind? A real one beats the hypothetical ukulele pack.
3. Will professionals (trainers, clinicians) ever manage clients in the app?
4. Is paid, one-off kit pricing acceptable, or should the shell be free and open source?
5. Is Next.js a fixed requirement? (It affects several kit choices, for example Open SaaS uses Wasp.)

## 12. Suggested next step

Approve Phase 0 and Phase 1. Phase 1 is low risk and valuable regardless of the shell decision: it removes the schema duplication, replaces fragile free-text matching, and leaves the app behaving identically under the existing tests.
