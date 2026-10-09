# Training Terminology — Existing State Audit

**Date:** 2026-10-09  
**Purpose:** Brief baseline before adding Good Dog’s teaching glossary.

## Current state

| Area | Finding |
| --- | --- |
| Exercise schema | No glossary fields; steps are plain strings |
| Exercise copy | Uses everyday language (“mark the moment”, “reward”) but rarely names the technical term |
| Hints | Mentions “lure” once (`ex-sit-comfort`) without defining luring |
| Learn | Exercise library only — no glossary |
| Ask / help | Welfare and practical Q&A; no terminology answers |
| Tooltips | None |
| Progress | Dog skill progress only — no owner vocabulary exposure |
| Tests | No glossary coverage |

## Gaps

1. Beginners who hear “marker”, “threshold”, or “positive reinforcement” elsewhere get no bridge from the app.
2. Occasional technical words (“lure”, “mark”) appear without Layer 2 explanations.
3. No searchable everyday → technical entry points (e.g. “the word I say when…”).
4. Optional AI is not grounded on approved definitions.

## Implementation plan (this branch)

1. Structured original glossary data + search helpers + tests  
2. Exercise schema: `glossaryTermIds` + inline `[[term-id]]` markers in relevant copy  
3. Tap-to-explain panel in guided exercises (mobile + a11y)  
4. Owner-scoped term exposure (introduced / explored) — does not affect dog progression  
5. Glossary browse/search in Learn  
6. Ask grounded on glossary; docs for adding terms  

No AI introduced if unused; existing optional AI will prefer glossary definitions.

## Status (implemented on this branch)

- [x] Structured glossary in `src/lib/content/glossary.ts`
- [x] Inline `[[term-id]]` links + `glossaryTermIds` on exercises
- [x] Tap-to-explain `GlossaryPanel` in `ExerciseRunner`
- [x] Learn glossary browse/search + term detail pages
- [x] Owner-scoped `owner_term_progress` (introduced / explored)
- [x] Ask grounded on glossary (`answerFromGlossary` before help/AI)
- [x] Authoring docs + Vitest coverage for integrity, search, UI, isolation
