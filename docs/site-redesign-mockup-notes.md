# Site redesign mockups

**Status:** Visual exploration only — not implemented in the app yet.  
**Companion:** [`shop-dropship-mockup-notes.md`](./shop-dropship-mockup-notes.md), [`shop-affiliate-plan.md`](./shop-affiliate-plan.md)

## Direction

Keep Good Dog’s existing tokens and type (Fraunces + Nunito Sans; forest green / amber / sage), but push the UI toward the calmer, brand-led look of the shop mockups:

| Principle | Intent |
| --- | --- |
| Brand first | “Good Dog” reads as a hero signal on landing; dog name is the hero on My dog |
| Atmosphere | Soft sage gradients / full-bleed photo plane on landing — not flat white |
| Fewer cards | Prefer tinted bands, separators, and prose over stacked white cards |
| One job per section | Especially on exercise guides (Purpose → Why this works → Steps) |
| Nav | Today · Learn · **Shop** · My dog · Ask (Shop added for the planned kit area) |

Avoid: purple gradients, neon glow, emoji icon rows, promo chips on heroes, dense stat dashboards.

## Screens mocked

| Screen | File (artifacts) | Notes |
| --- | --- | --- |
| System board | `redesign-system-overview.jpg` | Tokens + principles |
| Landing | `redesign-landing.jpg` | Full-bleed atmosphere; brand > headline; CTA group |
| Onboarding | `redesign-onboarding.jpg` | Brand-led form; soft step dots |
| Today | `redesign-today.jpg` | Progress bar; list rows instead of heavy cards |
| Exercise | `redesign-exercise.jpg` | Quiet Why this works band; numbered steps |
| Learn | `redesign-learn.jpg` | Glossary list + topic rows |
| Ask | `redesign-ask.jpg` | Question field + glossary-grounded answer |
| My dog | `redesign-mydog.jpg` | Name hero; priorities; reminders; shop link |
| Shop (prior) | `good-dog-shop-dropship-ui-mockup.jpg` | Own-brand dropship list |

## Suggested implementation order (later)

1. Global atmosphere + reduce `.card` default use on Today / Learn  
2. Landing full-bleed photo treatment (real UK training context imagery)  
3. Exercise section rhythm (already partly there with Why this works)  
4. Bottom nav: add Shop when shop ships  
5. My dog name-as-hero + quieter priorities list  

No production CSS/layout changes in this docs pass.
