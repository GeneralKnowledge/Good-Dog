# Content Review Checklist

Use this checklist for **every new or materially revised** exercise before publication (`published: true`) or content version bump.

This checklist supports internal quality and welfare hygiene. Completing it does **not** mean the exercise is IMDT approved, accredited, professionally reviewed, or clinically validated.

Reviewer name / date: _______________________  
Exercise ID / version: _______________________  

---

## 1. Training method

- [ ] Instructions rely on rewarding desirable behaviour (food, toys, play, praise, or access the dog values).
- [ ] No positive punishment (adding something aversive: yelling, physical corrections, intimidation, startling devices).
- [ ] No negative reinforcement tool as the primary teaching contingency (e.g. standing still until the dog yields lead tension as the main lesson). Prefer reinforce-the-alternative / reset / change setup.
- [ ] No equipment that may cause pain, fear, or discomfort (shock, prong, choke/check chains, citronella spray designed to punish, etc.).
- [ ] No dominance, alpha, “show them who’s boss”, stubborn, or deliberately disobedient framing.
- [ ] No instruction to force, pin, drag, flood, or persist until the dog “gives in”.

## 2. Rewards

- [ ] Preparation names suitable reward types and allows individual preference.
- [ ] Marking / timing guidance is clear where a marker is used (marker → reward gap kept short).
- [ ] Guidance exists for what to do if the dog is uninterested in the planned reward (change reward or end session).
- [ ] Session ends while the dog can still succeed (avoid drilling past enjoyment).

## 3. Preparation

- [ ] Where to practise is stated (e.g. quiet room, familiar garden).
- [ ] Equipment needs are minimal and explicit.
- [ ] Management advice given when the environment is harder than the exercise allows.

## 4. Difficulty and duration

- [ ] Estimated duration is about 2–5 minutes unless justified.
- [ ] Difficulty number matches real cognitive/environmental demand.
- [ ] Early criteria are small enough for beginners.
- [ ] “If difficult” guidance makes the task easier (distance, duration, distraction), not harder or longer.

## 5. Prerequisites and variations

- [ ] `prerequisiteIds` list only exercises that truly should come first.
- [ ] `easierVariationId` / `harderVariationId` point to the **same learning objective** (or are omitted).
- [ ] Harder variation is a modest step, not a new skill family.
- [ ] If the skill can enter `needs_easier` with no easier variation, a calm alternative exercise is identified for the planner.

## 6. Owner instructions

- [ ] British English (`practise`, `behaviour`, `lead`, etc.).
- [ ] Steps are numbered, few, and usable one-handed with a dog.
- [ ] Purpose is plain language (no operant jargon in owner copy).
- [ ] Success indicators (“look for”) are observable.
- [ ] No guaranteed outcomes (“will fix”, “cures”, “guaranteed recall”).

## 7. Body language, welfare, and stopping

- [ ] `safetyNote` present **or** an explicit documented reason it is unnecessary.
- [ ] Clear stop/pause conditions (worry, freeze, fretting, growling, trying to leave, escalating arousal).
- [ ] Guidance to increase distance / reduce distraction / switch to a calmer activity.
- [ ] Does not pressure the owner to continue for the sake of completing the app step.

## 8. Escalation and scope

- [ ] Out-of-scope situations point to a vet and/or suitably qualified reward-based professional where relevant (pain, sudden change, biting, severe fear, etc.).
- [ ] Exercise is not presented as a treatment plan for aggression, separation-related distress, or compulsive behaviour.
- [ ] Immediate safety management is prioritised over training when risk is present.

## 9. Accessibility and UX fit

- [ ] Readable at a glance on a narrow phone screen.
- [ ] Touch targets / controls remain outside this checklist but steps must not require complex UI.
- [ ] Suitable life stages listed accurately; unsuitable stages excluded.
- [ ] Works for busy owners with short sessions.

## 10. Metadata, versioning, and integrity

- [ ] Stable `id` / `slug` unchanged for the same logical exercise (bump `contentVersion` on material edits).
- [ ] Seed writes a new `exercise_versions` snapshot when version increments.
- [ ] Historical sessions still resolve via version snapshot.
- [ ] No IMDT / organisation endorsement, accreditation, or “professionally reviewed” claim unless a real documented review exists.
- [ ] Original wording (no proprietary course text).

## 11. Planner interaction (author check)

- [ ] Exercise behaves safely if selected after `too_difficult` or `welfareConcern`.
- [ ] Life-stage gate tested mentally against young puppy / senior where relevant.
- [ ] Topic group placement does not oversell a “course path”.

---

## Decision

| Outcome | Tick |
| --- | --- |
| Approve for publication | [ ] |
| Approve with follow-ups (list below) | [ ] |
| Hold — needs qualified review | [ ] |
| Reject / disable | [ ] |

Follow-ups / reviewer notes:

_________________________________________________________________

_________________________________________________________________

## Related documents

- [`exercise-content-audit.md`](./exercise-content-audit.md)
- [`welfare-principles-audit.md`](./welfare-principles-audit.md)
- [`improvement-roadmap.md`](./improvement-roadmap.md)
