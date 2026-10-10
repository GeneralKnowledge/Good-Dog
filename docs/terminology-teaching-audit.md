# Training Terminology — State Audit

**Updated:** 2026-10-10  
**Purpose:** Living record of the teaching glossary (not a pre-build baseline).

## Current state (verified in source)

| Area | Finding |
| --- | --- |
| Glossary | Static typed terms in `src/lib/content/glossary.ts` (~44 published) |
| Exercise schema | `glossaryTermIds`, optional `whyThisWorks`, inline `[[term-id]]` markup |
| In-exercise UI | `TermRichText` + `GlossaryPanel` modal; progressive “(new training word)” cue |
| Learn | Searchable glossary browser + term detail pages |
| Ask | Glossary → help → optional AI; `preferApprovedGlossaryOverAi` |
| Progress | `owner_term_progress` (introduced / explored); does not affect dog plans |
| Tests | `tests/glossary*.ts(x)` + Playwright term dialog in main journey |

## Status checklist

- [x] Structured glossary + integrity validation
- [x] Inline `[[term-id]]` links + `glossaryTermIds`
- [x] Tap-to-explain panel (a11y: focus trap / restore / Escape)
- [x] Learn browse/search + detail pages
- [x] Owner-scoped term exposure
- [x] Ask grounded on glossary
- [x] Progressive “(new training word)” cue for first unseen term
- [x] Orphan terms allowlisted via `LEARN_ASK_ONLY_TERM_IDS` (e.g. negative reinforcement)
- [x] Quiet **Why this works** teaching moments on key exercises
- [x] Invalid capitalised markup fixed (`[[reward|Reward]]`)

## Remaining backlog

- Expand `whyThisWorks` to more exercises only when copy benefits
- Content review passes for `needsQualifiedReview` terms
- Optional dedicated `/learn/glossary` index route (browse already on Learn)
- Shop / affiliate area — see [`shop-affiliate-plan.md`](./shop-affiliate-plan.md) (Amazon UK + Zooplus first; not built yet)
