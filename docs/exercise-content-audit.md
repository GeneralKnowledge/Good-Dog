# Exercise Content Audit

**Library source:** [`src/lib/content/exercises.ts`](../src/lib/content/exercises.ts)  
**Seed / versions:** [`scripts/seed.ts`](../scripts/seed.ts), table `exercise_versions`  
**All exercises currently:** `published: true`. Content versions are now mostly `2`–`3` after the terminology teaching layer (inline glossary links). Treat this audit’s per-exercise notes as the welfare baseline; re-check copy when bumping versions.  
**Audit date:** 2026-10-09  

Review statuses are **internal**. They are not certifications, IMDT approvals, or professional sign-off.

| Status | Meaning |
| --- | --- |
| Passes initial review | No obvious conflict with public force-free / welfare principles identified in this audit |
| Needs improvement | Broadly appropriate but unclear, incomplete, or insufficiently individualised |
| Requires substantial revision | Instructions or framing could encourage unsuitable training pressure |
| Remove or disable pending review | Material unresolved welfare concern — none in this pass |
| Requires qualified review | Specialist judgement needed before treating the method detail as settled |

**Coverage:** Originally 20 exercises received a basic review (metadata + steps + safety). Deeper scrutiny was applied to walking, leave-it, greetings, door manners, puppy exposure, recall-under-distraction, and handling. Later additions (`ex-down-comfort`, `ex-toilet-routine`, `ex-puppy-mouthing`) were authored against the content-review checklist with management-first, welfare-bound copy — treat them as **Passes initial review** pending the next full audit pass; mouthing remains **qualified-review** sensitive.

**Remove/disable pending review:** None identified. Do not disable the library wholesale; prioritise revisions listed below.

---

## Inventory summary

| ID | Title | Objective | Diff | Prereqs | Easier / Harder | safetyNote | Life stages | Review status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ex-name-response` | Practise responding to their name | name-response | 1 | — | — / `ex-name-mild-distract` | No | all | Needs improvement |
| `ex-reward-marker` | Introduce a friendly ‘yes’ word | reward-marker | 1 | — | — / — | No | all | Needs improvement |
| `ex-engagement-easy` | Invite a moment of attention | engagement | 1 | — | — / — | No | all | Passes initial review |
| `ex-sit-comfort` | Teach a comfortable sit | sit | 1 | engagement-easy | — / down-comfort | Yes (pain/vet) | all | Passes initial review |
| `ex-down-comfort` | Teach a comfortable down | down | 2 | sit-comfort | sit-comfort / mat-settle | Yes (no force; pain/vet) | all | Passes initial review (post-audit add) |
| `ex-toilet-routine` | Build a simple toilet routine | housetraining | 1 | — | — / — | Yes (vet if medical; no punishment) | puppy–adult | Passes initial review (post-audit add) |
| `ex-puppy-mouthing` | Redirect puppy mouthing | puppy-mouthing | 1 | — | — / — | Yes (escalate hard bites/guarding; no punishment) | young/older puppy | Passes initial review + qualified review recommended (post-audit add) |
| `ex-wait-brief` | Practise a brief wait | wait | 2 | sit-comfort | sit-comfort / — | No | older puppy–senior | Needs improvement |
| `ex-mat-settle` | Settle on a mat | mat-settle | 1 | — | — / calm-home | No | all | Needs improvement |
| `ex-calm-home` | Practise calm settling at home | calm-home | 2 | mat-settle | mat-settle / — | No | older puppy–senior | Needs improvement |
| `ex-handling-touch` | Build comfortable handling | handling | 1 | — | — / — | Yes (stop; no force) | all | Passes initial review + qualified review recommended |
| `ex-name-mild-distract` | Name response with a mild distraction | name-response | 2 | name-response | name-response / **recall-foundation** | No | older puppy–senior | Needs improvement |
| `ex-recall-foundation` | Build a recall foundation | recall | 2 | name-response | name-response / recall-mild-distract | Yes (hazards) | all | Passes initial review |
| `ex-recall-mild-distract` | Recall with a mild distraction | recall | 3 | recall-foundation | recall-foundation / — | Yes | older puppy–senior | Requires qualified review |
| `ex-lead-intro` | Make the lead feel friendly | lead-walking | 1 | — | — / lead-loose | Yes (no pain kit) | all | Passes initial review |
| `ex-lead-loose` | Loose-lead walking foundations | lead-walking | 2 | lead-intro | lead-intro / check-in-walk | Yes | older puppy–senior | **Requires substantial revision** + qualified review |
| `ex-check-in-walk` | Practise check-ins on walks | check-in | 2 | name-response, lead-intro | name-response / — | No | older puppy–senior | Needs improvement |
| `ex-leave-it-easy` | Easy ‘leave it’ game | leave-it | 2 | engagement-easy | — / — | Yes (not for dangers) | older puppy–senior | Requires substantial revision + qualified review |
| `ex-door-manners` | Calm moments at the door | door-manners | 2 | wait-brief | wait-brief / — | No | older puppy–senior | Needs improvement |
| `ex-greeting-calm` | Practise calmer greetings | greetings | 2 | sit-comfort | — / — | Yes (pro help) | older puppy–senior | Requires qualified review |
| `ex-rest-spot` | Build a quiet rest spot | rest-spot | 1 | — | — / — | Yes (no shut-in) | all | Passes initial review |
| `ex-puppy-sounds` | Get used to everyday sounds | puppy-confidence | 1 | — | — / — | Yes (never force) | puppies | Requires qualified review |
| `ex-puppy-surfaces` | Explore different surfaces | puppy-confidence | 1 | — | — / — | Yes | puppies | Passes initial review |

---

## Detailed findings by exercise

### Passes initial review (with notes)

#### `ex-engagement-easy`
- **Owner does:** Invite attention with soft sound/show reward; mark and reward looks.
- **Why pass:** Pure positive invitation; ifDifficult reduces criteria.
- **Minor:** Add optional safetyNote for stop-if-worried for consistency.

#### `ex-sit-comfort`
- **Owner does:** Food lure up/back; mark as bottom lowers.
- **Why pass:** No pushing into position; pain/vet safetyNote present.
- **Keep:** Explicit “do not push the dog into a sit” is already implied; could state outright.

#### `ex-recall-foundation`
- **Owner does:** Cheerful recall once; jackpot; release back to sniff.
- **Why pass:** Coming back remains valuable; off-lead hazard note.
- **Minor:** Mention long line for outdoor beginners.

#### `ex-lead-intro`
- **Owner does:** Pair harness/collar with rewards; short on/off; few calm steps.
- **Why pass:** Explicitly bans pain equipment; short sessions.

#### `ex-rest-spot`
- **Owner does:** Optional rest place; free exit; never force confinement.
- **Why pass:** Strong choice-based framing.

#### `ex-puppy-surfaces`
- **Owner does:** Invite exploration; never push/drag.
- **Why pass:** Choice and stop conditions clear.

#### `ex-handling-touch` — Passes initial review **and** requires qualified review
- **Owner does:** Brief touches (shoulder → collar → paws); mark and reward; stop while relaxed.
- **Strengths:** “Do not force”; stop if flinch/freeze/growl; “Never pin or restrain” in hint.
- **Qualified review:** Order/intensity of collar and paw handling for puppies vs adults; when to refer for husbandry fear.

---

### Needs improvement

#### `ex-name-response`
- **Issue:** No safetyNote or body-language abort (e.g. turn away, whale eye, freeze). Relies on general Ask content.
- **Correction:** Add safetyNote: stop if the dog looks worried; do not repeat the name louder; move quieter.
- **Also:** Surface preferred rewards from profile in preparation.

#### `ex-reward-marker`
- **Issue:** Good starter on timing, but no note about arousal/overexcitement (Reinforcement Strategies outline topic — public outline only).
- **Correction:** Add “keep sessions short; if your dog gets frantic, pause and use calmer rewards.”
- **Open question:** How much marker-mechanics detail belongs in an owner MVP — qualified review.

#### `ex-wait-brief`
- **Issue:** Flat-hand wait can become “make them stay.” No safetyNote; duration creep risk.
- **Correction:** Cap early waits explicitly (half second → one second); abort if stiff/worried; add safetyNote.

#### `ex-mat-settle` / `ex-calm-home`
- **Issue:** No safetyNote; calm-home may be practised near household chaos too soon.
- **Correction:** Add stop-if-fidgety/worried; remind that settling is invited, not enforced.

#### `ex-name-mild-distract`
- **Issue:** Missing safetyNote; **`harderVariationId` points to `ex-recall-foundation`** (different learning objective). Variation resolution can jump skills.
- **Correction:** Point harder variation to a same-objective step, or remove cross-objective link; add abort guidance.

#### `ex-check-in-walk`
- **Issue:** No safetyNote for lead tension, traffic, or overwhelmed dogs on real walks.
- **Correction:** Add environment management + seek quiet routes; stop if worried.

#### `ex-door-manners`
- **Location:** hint in `exercises.ts`
- **Issue:** Hint: door opening is a “privilege earned by calm” — soft dominance-adjacent framing.
- **Correction:** Rephrase to “We only open when feet are settled — we’re teaching a calm pattern, not asserting rank.”
- **Also:** Add safetyNote for door-darting risk / management first.

---

### Requires substantial revision

#### `ex-lead-loose` — **primary method concern**
- **Location:** `steps[2]`, `hint` in `src/lib/content/exercises.ts`
- **Existing instruction (summary):** Mark soft lead and reward; **if the lead tightens, stop and wait for slack, then move on.**
- **Concern:** Withholding forward motion until the dog yields tension is a negative-reinforcement-adjacent contingency. IMDT Code of Ethics publicly requires avoiding negative reinforcement as a training tool. Safety note correctly bans jerking/aversive kit but does not address this contingency.
- **Proposed correction (engineering-ready draft; still needs qualified review):**
  1. Keep marking and rewarding soft-lead moments generously.
  2. If the lead goes tight, cheerfully change direction or reset to a known engagement game; do not stand in a stalemate.
  3. Short segments; end early while successful.
  4. Retain bans on jerking and aversive equipment.
- **Status:** Requires substantial revision **and** qualified review before treating the replacement method as final.

#### `ex-leave-it-easy`
- **Location:** preparation (“item under your foot or hand”) and steps
- **Concern:** Controlled access / trapping pattern. Fine for dull items if brief, but owners may escalate value or create conflict. No abort for fixation, stiffening, or growling at the covered item. No easier variation ID for planner fallback.
- **Proposed correction:** Emphasise dull item only; abort if tension; teach “look away earns better food from the other hand”; add `easierVariationId` to engagement or name game; qualified review of leave-it pedagogy for an app context.
- **Status:** Requires substantial revision + qualified review.

---

### Requires qualified review (method detail)

#### `ex-greeting-calm`
- **Summary:** Paws-down greetings; helper steps back if jumping.
- **Concern:** Attention/access withdrawal as consequence; risk with fearful or frustrated dogs; safetyNote correctly escalates snap/lunge but not subtler worry.
- **Ask of reviewer:** Is step-back reset acceptable in this app’s force-free framing, or should the exercise be management + reinforce four paws only (no social penalty framing)?

#### `ex-recall-mild-distract`
- **Concern:** Competing motivation can create failure chains if distraction is under-set.
- **Ask of reviewer:** Success criteria, long-line requirements, and when to refuse this exercise in the planner after welfare flags.

#### `ex-puppy-sounds`
- **Summary:** Quiet sound + scatter treats; stop if worried.
- **Strengths:** Explicit never-force safetyNote.
- **Ask of reviewer:** Volume/distance progression guidance; when sound exposure should be left to in-person professionals.

---

## Cross-cutting content gaps

1. **9/20 exercises lack `safetyNote`:** name-response, reward-marker, engagement-easy, wait-brief, mat-settle, calm-home, name-mild-distract, check-in-walk, door-manners.
2. **Preferred rewards** from the dog profile are never injected into preparation text.
3. **Easier variations missing** on several mid/high risk skills (`ex-leave-it-easy`, `ex-greeting-calm`, `ex-puppy-sounds`, `ex-reward-marker`, `ex-engagement-easy`) — harms planner fallback when `needs_easier`.
4. **Body language education** is thin inside exercises (mostly in Ask). Owners practising one-handed need glanceable “stop if…” cues in-exercise.
5. **No exercise claims IMDT endorsement** (good). Keep it that way.
6. **Versioning:** Seed upserts content and creates `exerciseId-v{version}` snapshots. Future edits must bump `contentVersion` so history stays stable (see checklist).

---

## Proposed correction backlog (content only)

| Priority | Exercise | Change type | Qualified review? |
| --- | --- | --- | --- |
| P1 | `ex-lead-loose` | Rewrite stop-wait contingency | Yes |
| P1 | `ex-leave-it-easy` | Abort criteria + easier variant + dull-item emphasis | Yes |
| P1 | Missing safetyNotes (9 exercises) | Add stop/simplify notes | No (engineering + editorial) |
| P1 | `ex-name-mild-distract` | Fix harderVariationId | No |
| P1 | `ex-door-manners` | Remove privilege framing | No |
| P1 | `ex-greeting-calm` | Clarify management vs social penalty | Yes |
| P2 | All | Inject preferred rewards into prep | No |
| P2 | `ex-puppy-sounds` / recall-mild-distract | Pacing detail | Yes |
| P2 | Skills without easierVariationId | Add calm alternatives | Partial |

---

## Related documents

- [`welfare-principles-audit.md`](./welfare-principles-audit.md)
- [`progression-audit.md`](./progression-audit.md)
- [`content-review-checklist.md`](./content-review-checklist.md)
- [`improvement-roadmap.md`](./improvement-roadmap.md)
