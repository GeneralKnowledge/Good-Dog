# Glossary authoring guide

How to add and review training terms for Good Dog.

## Purpose

Good Dog teaches proper training language gradually:

1. **Tell me what to do** (plain English instruction)
2. **Teach me the term** (name it in context)
3. **Help me understand more deeply** (optional panel / Learn page)

Owners should not need a theory course. Terms appear when they are useful in an exercise.

## Data source

All published terms live in [`src/lib/content/glossary.ts`](../src/lib/content/glossary.ts).

Each term needs:

| Field | Notes |
| --- | --- |
| `id` | Stable kebab-case id (never rename lightly) |
| `preferredTerm` | Owner-facing label |
| `alternativeTerms` | Only when meaning is genuinely equivalent |
| `searchPhrases` | Everyday descriptions owners might type |
| `category` | `reward_based` \| `behaviour_welfare` \| `everyday_skills` |
| `shortDefinition` | One clear beginner sentence |
| `deeperExplanation` | Slightly more depth; still plain English |
| `example` | Concrete dog + owner scenario |
| `commonMisunderstanding` | Optional; use for frequent mix-ups |
| `relatedTermIds` | Must reference existing ids |
| `relevantExerciseIds` | Must reference existing exercise ids |
| `editorialNotes` | Internal only — provenance, nuance |
| `needsQualifiedReview` | Set true for welfare-sensitive topics |
| `contentVersion` | Integer; bump when the definition changes materially |
| `published` | Only `true` terms appear in UI/search |

## Linking terms in exercises

In exercise copy (`purpose`, `steps`, etc.), use:

```text
Say “Yes!” — your [[marker-word]] — then give a reward.
Use gentle [[luring|luring]] to guide the sit.
```

Also list relevant ids on `glossaryTermIds` and bump `contentVersion`.

Do not link every technical word. Link terms the owner needs for *this* task.

## Accuracy rules

- Do not invent authoritative definitions or claim IMDT approval.
- Prefer publicly described reward-based / welfare principles for checks.
- Distinguish reward vs reinforcer, marker vs reward, luring vs shaping, desensitisation vs counterconditioning, cue vs behaviour, generalisation vs fluency, management vs training, arousal vs aggression.
- “Positive” / “negative” mean add / remove in behavioural science — say so when those words appear.
- Do not teach owners to diagnose emotion from one body-language signal.
- Flag material welfare nuance with `needsQualifiedReview: true`.

Useful public starting points (principles, not copy-paste sources):

- [IMDT UK](https://www.imdt.uk.com/)
- [IMDT reinforcement strategies (public page)](https://www.imdt.uk.com/england/practical-skills-reinforcement-strategies/)
- [UK Code of Practice for the Welfare of Dogs](https://www.gov.uk/government/publications/code-of-practice-for-the-welfare-of-dogs)

Good Dog glossary text must remain original.

## Exposure tracking

`owner_term_progress` stores `introduced` / `explored` per authenticated owner.

- Introduced: term appears in exercise guide copy the owner actually saw (not metadata alone)
- Explored: owner opened the panel or Learn term page
- ExerciseRunner shows a quiet “(new training word)” cue on the first new term in a guide

This never affects dog skill progression or plan generation.

## Learn/Ask-only allowlist

Some published terms are literacy-only and need not appear in exercise copy. They live in
`LEARN_ASK_ONLY_TERM_IDS` / `LEARN_ASK_ONLY_REASONS` in `glossary.ts`.

Currently:

| Term id | Reason |
| --- | --- |
| `negative-reinforcement` | Add/remove literacy for Ask/Learn; early plans should not centre −R teaching |

Every other published term must be linked in at least one exercise (`[[term-id]]` in copy).

## Terms awaiting qualified review

These are published for careful beginner literacy with in-product boundary copy. They are **not**
claimed as professionally signed-off:

- `threshold`
- `desensitisation`
- `counterconditioning`
- `negative-reinforcement`
- `leave-it`
- `drop-swap`
- `mouthing`

Do not add how-to treatment plans for fear or aggression against these entries.

## Review checklist

- [ ] Definition accurate and beginner-friendly
- [ ] Example is practical and UK-English
- [ ] Related terms and exercise ids resolve
- [ ] Search phrases cover everyday wording
- [ ] Misconceptions addressed without a lecture
- [ ] Welfare-sensitive terms flagged
- [ ] No endorsement / accreditation claims
- [ ] `npm run test` glossary suite passes

## Tests

```bash
npm run test -- tests/glossary.test.ts tests/glossary-progress.test.ts tests/glossary-ui.test.tsx
```
