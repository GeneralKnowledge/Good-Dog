# Welfare Principles Audit

**Product:** Good Dog (independent daily dog-training coach for UK owners)  
**Audit date:** 2026-10-09  
**Repository branch audited:** `cursor/good-dog-mvp-e953` (and successors)  
**Nature of this document:** Evidence-based gap analysis against *publicly documented* principles. **Not** a certificate of IMDT compliance, endorsement, accreditation, or professional review.

## Important product distinction

Good Dog is an independent product. This audit seeks consistency with publicly stated IMDT ethics and UK welfare guidance. It does **not** claim that Good Dog is:

- IMDT approved or endorsed
- An IMDT qualification or training course
- Professionally accredited
- Professionally reviewed (unless and until a documented review occurs)

No proprietary IMDT course materials were used. Where interpretation goes beyond the public Code of Ethics or DEFRA text, findings are labelled **Unverified** or **open question for qualified review**.

## Sources consulted

| Source | URL | Status | What was used |
| --- | --- | --- | --- |
| IMDT UK Code of Ethics | https://www.imdt.uk.com/code-of-ethics.html | Retrieved 2026-10-09 | Force-free commitment; reject methods/equipment causing physical or mental discomfort; avoid positive punishment and negative reinforcement as training tools; science-based practice; work within limits and refer |
| IMDT UK homepage / education | https://www.imdt.uk.com/ | Retrieved 2026-10-09 | Context that IMDT is a professional education body; not a public full curriculum |
| IMDT Reinforcement Strategies (public course page) | https://www.imdt.uk.com/england/practical-skills-reinforcement-strategies/ | Retrieved 2026-10-09 | Outline topics only: event markers/timing, reinforcer types, reinforcement delivery, reinforcement and arousal. Full lecture content **not** available |
| DEFRA Code of Practice for the Welfare of Dogs | https://www.gov.uk/government/publications/code-of-practice-for-the-welfare-of-dogs and published PDF | Retrieved 2026-10-09 | Five welfare needs; prefer reward-based training; avoid harsh/painful/frightening methods; seek professional advice for behaviour problems; incorrect regimes harm welfare |

### Source limitations

1. No access to IMDT proprietary course text, member-only resources, or assessment criteria.
2. The Reinforcement Strategies page is a commercial course outline, not the course body.
3. DEFRA guidance summarises owner duties under the Animal Welfare Act 2006; it is not a dog-training curriculum.
4. ABTC and other sector codes were noted in search but are **not** treated as IMDT requirements unless separately adopted; they are out of scope for “IMDT-informed” claims here.

---

## How to read the matrix

**Assessment values**

| Value | Meaning |
| --- | --- |
| Meets | Current code/content is consistent with the practical interpretation for an owner-facing MVP |
| Partially meets | Directionally aligned, but material gaps remain |
| Fails | Behaviour or content conflicts with the practical interpretation in a way that risks welfare or trust |
| Unverified | Cannot be confirmed from public sources and/or cannot be fully judged without qualified professional review |

---

## A. Training philosophy

### A1. Reward-based, force-free methods

| Field | Content |
| --- | --- |
| Principle | Promote force-free training; reject methods or equipment that may cause physical or mental discomfort |
| Source | IMDT Code of Ethics; DEFRA Code (reward-based training widely regarded as preferred; avoid harsh/painful/frightening methods) |
| Practical interpretation | Owner instructions must rely on rewarding desirable behaviour; never prescribe pain, fear, intimidation, or aversive equipment |
| Current implementation | Exercise library uses markers, food/toys/praise, and “stop if worried” notes in many places. Help article `help-force` rejects punishment and aversive equipment. Lead/harness safety notes ban pain-causing kit |
| Assessment | **Partially meets** |
| Evidence | `src/lib/content/exercises.ts`; `src/lib/content/help.ts` (`help-force`); `ex-lead-intro` / `ex-lead-loose` safetyNotes |
| Risk | Owners may still improvise aversives if stuck; uneven abort guidance |
| Recommended change | Add abort criteria to exercises lacking them; keep anti-aversive messaging in exercise views, not only Ask |
| Validation | Content checklist; search corpus for punish/shock/prong/dominate; exercise audit statuses |

### A2. Avoid positive punishment and negative reinforcement as training tools

| Field | Content |
| --- | --- |
| Principle | Avoid positive punishment and negative reinforcement as tools for training dogs |
| Source | IMDT Code of Ethics (explicit) |
| Practical interpretation | Do not instruct owners to add aversive stimuli, or to withhold/remove valued access in a way that pressures the dog into compliance as the primary teaching method. Prefer reinforcing the desired alternative |
| Current implementation | No shock/prong/verbal intimidation instructions. However `ex-lead-loose` step 3: “If the lead tightens, stop politely and wait for slack, then move on” — motion (reinforcer) withheld until tension ends. `ex-greeting-calm` uses helper stepping back when the dog jumps. `ex-door-manners` hint frames the door as a “privilege” |
| Assessment | **Partially meets** (with a material content concern on lead walking) |
| Evidence | `ex-lead-loose` steps/hint; `ex-greeting-calm` purpose/steps; `ex-door-manners` hint — all in `src/lib/content/exercises.ts` |
| Risk | Owners may escalate stop-and-wait into a battle of wills; method sits in tension with IMDT’s public −R avoidance |
| Recommended change | Rewrite lead-loose toward reinforcing soft-lead moments / changing direction / resetting with engagement; soften privilege language; flag greetings/leave-it for qualified review |
| Validation | Exercise content audit; qualified review of revised lead text; no stop-wait as sole contingency |

### A3. Appropriate rewards and enjoyable, achievable sessions

| Field | Content |
| --- | --- |
| Principle | Training should use reinforcers the dog values; sessions should be short and achievable |
| Source | IMDT Reinforcement Strategies outline (reinforcer types, delivery, arousal); DEFRA (reward with things dogs like; short regular training) |
| Practical interpretation | Capture preferred rewards from the profile; teach clear marking/timing; keep daily plans short |
| Current implementation | Plans respect `availableTime` and offer short plans. Exercises generally 2–5 minutes. Profile stores `preferredRewards` but **exercise preparation text does not use it**. Marker exercise exists (`ex-reward-marker`) |
| Assessment | **Partially meets** |
| Evidence | `DEFAULT_PROGRESSION_CONFIG` in `src/lib/types.ts`; `generateDailyPlan` minute budgets; `dogs.preferredRewards` in schema; prep strings in `exercises.ts` |
| Risk | Owners use weak rewards and conclude the dog “won’t listen” |
| Recommended change | Inject preferred rewards into preparation copy; teach “end while successful” more consistently |
| Validation | Plan length tests; UI shows dog’s preferred rewards on exercise start |

---

## B. Canine welfare and body language

### B1. Stop or simplify when the dog is uncomfortable

| Field | Content |
| --- | --- |
| Principle | Dogs must be able to avoid things that frighten them; do not force continuation |
| Source | DEFRA Code (avoid frightening things; place to hide); IMDT force-free / mental discomfort rejection |
| Practical interpretation | Feedback must capture discomfort; planner must prefer calmer alternatives; instructions must say when to stop |
| Current implementation | UI checkbox for worry/overwhelm (`ExerciseRunner`). Outcome path sets `needs_easier`. Help `help-worried` tells owners to stop. **Planner does not re-read `welfareConcern`**. `summariseRecentOutcomes` is unused. One later `easy` clears `needs_easier` to `practising` |
| Assessment | **Fails** (relative to claimed behaviour) / **Partially meets** (UI capture exists) |
| Evidence | `src/components/ExerciseRunner.tsx`; `applyOutcomeToProgress` in `progression.ts`; `generateDailyPlan` ignores `RecentSessionSummary.welfareConcern`; `help-worried` overclaim |
| Risk | Owner reports discomfort; next plan still presses the same skill at the same difficulty |
| Recommended change | Durable welfare cooldown in plan generation; never score-boost `needs_easier` without an easier/calm alternative; align help copy with code |
| Validation | Progression scenario tests 5 and 4; see `docs/progression-audit.md` |

### B2. No stubborn / dominant / disobedient framing

| Field | Content |
| --- | --- |
| Principle | Do not attribute failure to dominance or wilful disobedience |
| Source | Consistent with force-free, science-based framing (IMDT ethics); DEFRA warns incorrect regimes harm welfare |
| Practical interpretation | Copy should blame setup, difficulty, or environment—not the dog’s character |
| Current implementation | No “stubborn/dominant/alpha” language in exercise library. `help-force` keywords include alpha/dominate. Door hint “privilege” is the closest soft framing issue |
| Assessment | **Meets** (with minor wording tidy for door hint) |
| Evidence | Grep of content; `help-force`; `ex-door-manners` hint |
| Risk | Low |
| Recommended change | Rephrase door hint away from privilege/earned framing |
| Validation | Content grep in CI/checklist |

### B3. Limits on inferring emotional state

| Field | Content |
| --- | --- |
| Principle | An app cannot reliably diagnose affective state from a few taps |
| Source | Practical product ethics; IMDT “work within limits” |
| Practical interpretation | Treat owner-reported concern conservatively; never claim the app “knows” the dog’s feelings |
| Current implementation | Why-today copy is modest. No emotion scores. Progress uses plain English. Risk: help text implies automatic simplification that code does not fully deliver |
| Assessment | **Partially meets** |
| Evidence | `why-today.ts`; My dog progress labels; `help-worried` |
| Risk | Over-trust in app adaptation |
| Recommended change | Honest UX: “We’ll keep things easier based on what you told us” only when planner actually does so |
| Validation | Copy review after P0 planner fix |

---

## C. Learning and progression

### C1. Appropriate starting difficulty and prerequisites

| Field | Content |
| --- | --- |
| Principle | Start easy; build gradually; respect prerequisites |
| Source | Science-based progression (IMDT ethics); DEFRA (start with simple tasks such as name response) |
| Practical interpretation | New dogs get foundations; dependent skills wait for prior introduction |
| Current implementation | Starter pool for new dogs; `prerequisitesMet` gates eligibility; life-stage filters |
| Assessment | **Meets** |
| Evidence | `starterPool`, `prerequisitesMet` in `plan-generator.ts`; tests in `plan-generator.test.ts` |
| Risk | Low for cold start |
| Recommended change | Preserve; add tests that `needs_easier` on a prerequisite blocks dependents (already a side effect) |
| Validation | Existing + extended Vitest cases |

### C2. Sufficient success before increasing difficulty

| Field | Content |
| --- | --- |
| Principle | Do not treat one success as mastery; increase difficulty gradually |
| Source | Practical learning principles; Reinforcement Strategies outline (fluency before harder contexts) — detail Unverified without course body |
| Practical interpretation | Configurable multi-session easy streak before `ready_to_increase` |
| Current implementation | `easyResultsForIncrease: 3`; guards against single-easy mastery; tested |
| Assessment | **Meets** (thresholds are hypotheses, not certified science) |
| Evidence | `DEFAULT_PROGRESSION_CONFIG`; `progression.test.ts` |
| Risk | Threshold may be too fast/slow for some dogs — open question |
| Recommended change | Keep configurable; document as hypothesis needing evaluation |
| Validation | Config-driven tests; qualified review of defaults |

### C3. Struggle and context

| Field | Content |
| --- | --- |
| Principle | If something is not working, make it easier; success in one context ≠ another |
| Source | Force-free / mental comfort (IMDT); DEFRA (incorrect regime harms welfare) |
| Practical interpretation | Difficult/welfare outcomes should simplify or change context; avoid repeating failed setups |
| Current implementation | `too_difficult` → `needs_easier` + optional easier variation. **No environment field.** Long breaks ignored (`lastPractisedAt` unused). Score +2 for `needs_easier` can reselect the same skill |
| Assessment | **Fails** on struggle/welfare durability; **Fails** on environment modelling (absent) |
| Evidence | `scoreExercise` +2; `resolveVariation`; schema lacks environment; `lastPractisedAt` write-only |
| Risk | Failure chains; outdoor struggle after indoor success unnoticed |
| Recommended change | See progression audit proposed model |
| Validation | Scenario suite in `docs/progression-audit.md` |

---

## D. Individualisation

| Field | Content |
| --- | --- |
| Principle | Adapt to life stage, experience, time, objectives, and individual preferences; do not use breed stereotypes |
| Source | DEFRA (needs vary with age/health); IMDT science-based individual practice |
| Practical interpretation | Profile fields should change eligibility and presentation; breed optional and non-stereotyping |
| Current implementation | Life stage, available time, training experience, primary reason affect plans. Breed is optional free text and **not** used in scoring (good). `knownTriggers`, `alreadyEasy`, `preferredRewards`, `householdContext` largely unused by the planner |
| Assessment | **Partially meets** |
| Evidence | `DogPlanInput` vs full `dogs` schema; `scoreExercise` reason keywords only |
| Risk | Missed adaptations; unused fields create false expectation |
| Recommended change | Use preferred rewards and known triggers in prep/why-today; keep breed out of heuristics |
| Validation | Plan generation tests with those fields |

---

## E. Responsible scope and referral

| Concern | Current handling | Assessment |
| --- | --- | --- |
| Biting / attempted biting | `help-aggression` escalate article; greeting safetyNote | Partially meets — Ask-dependent |
| Aggression / escalating threat | Same | Partially meets |
| Severe / persistent fear | `help-worried` | Partially meets |
| Separation-related distress | **Absent** | Fails (gap) |
| Suspected pain / illness | `help-pain`; sit safetyNote | Partially meets |
| Sudden behavioural change | `help-pain` | Partially meets |
| Compulsive / self-injurious behaviour | **Absent** | Fails (gap) |
| Immediate risk to people/animals | **Absent** as dedicated guidance | Fails (gap) |

| Field | Content |
| --- | --- |
| Principle | Work within limits; refer beyond them; apps must not invent treatment plans for serious problems |
| Source | IMDT Code of Ethics (refer); DEFRA (seek professional advice for behaviour problems) |
| Practical interpretation | Detect out-of-scope topics in Ask/onboarding; stop ordinary progression; point to vet / reward-based professional base |
| Current implementation | Static help articles; landing/Ask/privacy disclaimers; AI prompt mentions referral topics. No onboarding screen. Planner never triggers referral |
| Assessment | **Partially meets** |
| Evidence | `help.ts`; `ask.ts` system prompt; `page.tsx` / `ask/page.tsx` / `privacy/page.tsx` disclaimers |
| Risk | Owner uses everyday exercises for aggression or separation distress |
| Recommended change | Expand help library; soft “is this out of scope?” screen; AI must fail closed to escalate articles |
| Validation | Ask search tests; onboarding copy review; no exercise marketed for aggression treatment |

---

## F. Owner communication

| Field | Content |
| --- | --- |
| Principle | Clear, kind, non-judgemental; no guaranteed outcomes; no false credentials |
| Source | IMDT honesty/integrity; product brief |
| Practical interpretation | British English; no shame for missed days; honest progress; no IMDT endorsement claims |
| Current implementation | Strong non-shame tone (`help-missed-day`). Progress plain English. Disclaimers present. Why-today generally modest. Overclaim: welfare simplification in help |
| Assessment | **Partially meets** |
| Evidence | Help articles; My dog empty states; README/privacy non-affiliation |
| Risk | Trust erosion if adaptation claims exceed behaviour |
| Recommended change | Align claims with P0 planner; keep endorsement prohibition in checklist |
| Validation | Copy audit; checklist item |

---

## G. Privacy and product integrity

| Field | Content |
| --- | --- |
| Principle | Confidentiality; minimise data; safe AI; accurate limitation statements |
| Source | IMDT ethics (privacy/confidentiality for members — analogous duty for apps); UK data expectations |
| Practical interpretation | Server-side owner scoping; deletion; disclose AI; no fabricated review claims |
| Current implementation | Session auth; dog scoped by `ownerId`; `deleteAccountAction` removes dogs/plans/sessions/progress; privacy page discloses optional AI; core works without API key. AI sends question + dog name + help corpus when configured. No output validation |
| Assessment | **Partially meets** |
| Evidence | `auth.ts` delete; `privacy/page.tsx`; `ask.ts`; `getOwnedDog` patterns |
| Risk | Prompt injection via dog name; AI oversharing; over-trust in AI answers |
| Recommended change | Minimise AI payload; validate outputs; rate-limit Ask |
| Validation | Isolation tests; AI disabled path; deletion e2e |

---

## Cross-cutting strengths

1. Daily-plan-first UX matches an owner coach, not a course catalogue.
2. Deterministic progression is testable without an LLM.
3. Historical exercise versions are snapshotted (`exercise_versions`).
4. Explicit independence / non-endorsement language already exists in README and privacy.
5. One easy result does not declare readiness to increase difficulty (tested).

## Immediate safety conclusion

**No production hotfix was applied in this audit pass.** No exercise instructs aversive equipment, physical punishment, or forced confinement. The highest software risk is **welfare flags not durably steering plans**, which is prioritised as P0 in [`improvement-roadmap.md`](./improvement-roadmap.md).

## Related documents

- [`exercise-content-audit.md`](./exercise-content-audit.md)
- [`progression-audit.md`](./progression-audit.md)
- [`improvement-roadmap.md`](./improvement-roadmap.md)
- [`content-review-checklist.md`](./content-review-checklist.md)
