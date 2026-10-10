# Shop / Affiliate Plan (UK)

**Updated:** 2026-10-10  
**Status:** Planning only — no shop UI in this branch.  
**Audience:** Good Dog is UK-first; pick partners that ship to (or operate in) the UK.

## Goal

A small **Shop / kit ideas** area that recommends training-relevant items via affiliate links. Keep it honest: optional gear, never required for the plan, and never imply IMDT or professional endorsement of products.

## Recommendation (Phase 1 partners)

| Priority | Partner | Why |
| --- | --- | --- |
| **1 — start here** | **Amazon Associates (amazon.co.uk)** | Fastest signup for UK creators; huge catalog (treat pouches, long lines, harnesses, mats, puzzle toys); deep links + tracking; familiar checkout for owners. |
| **2 — add soon** | **Zooplus (via Awin)** | Pet-specialist EU/UK retailer; strong dog gear/food assortment; Awin is a standard UK affiliate network once approved. |
| Later | Pet Supermarket / other Awin pet merchants | Useful if Awin approval lands and they stock items Amazon/Zooplus miss. |

**Do not prioritise for UK MVP:** Chewy, Petco (US-centric), The Farmer’s Dog / NomNom / Smalls (US fresh-food subscription models — poor fit for UK shipping, regulatory, and “kit for today’s exercise” use cases).

### Why Amazon UK + Zooplus first

- **Easiest setup:** Amazon Associates UK is self-serve after approval; Zooplus sits on Awin (one network login for multiple pet merchants later).
- **Appropriate items:** Training pouches, Y-harnesses, long lines, lick mats, snuffle mats, treat pouches, enrichment toys — all map cleanly to exercises (loose lead, settle, enrichment, puppy surfaces).
- **Profitability (realistic):** Amazon rates for pet accessories are often modest (~1–4% depending on category); Zooplus/Awin pet rates are often similar or slightly better on basket size. Volume and relevance beat chasing the highest % on irrelevant SKUs. Disclose affiliate relationships in-app.

## Suggested catalog shape (when built)

Keep the shop **curated**, not a marketplace dump:

1. **Session kit** — treat pouch, soft treats, clicker (optional; marker word is default in-app).
2. **Walk kit** — well-fitting harness, standard lead, long line (management + recall practice).
3. **Calm / enrichment** — mat, lick mat, puzzle feeder.
4. **Puppy basics** — soft toys for mouthing redirect, simple enrichment (no aversives).

Each card: plain English “why this helps”, link to related exercise/glossary term, outbound affiliate URL, clear “We may earn a commission” note.

## Implementation sketch (later branch)

| Piece | Notes |
| --- | --- |
| Data | Static `src/lib/content/shop-items.ts` (id, title, blurb, category, `relatedExerciseIds`, `relatedTermIds`, `affiliateUrl`, `merchant`, `published`) |
| UI | `/shop` or Learn tab section — list + detail; no carts |
| Compliance | Footer/disclosure on every shop surface; UK ASA-friendly wording |
| Env | `AMAZON_ASSOCIATE_TAG`, optional Awin tracking params — never hardcode secrets |
| Tests | Published items have https URLs; related exercise/term ids resolve |

## Open decisions before coding

1. Amazon Associates approval status for the Good Dog domain.
2. Awin publisher account + Zooplus programme acceptance.
3. Whether guest users see shop links (recommend: yes, with same disclosure).
4. Hard ban list: choke/prong/shock, citronella, any aversive “training aids”.

## Out of scope for terminology Phase 1+2

Shop UI, affiliate account signup, and product photography. This doc is the planning input only.
