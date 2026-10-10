# Good Dog — Design direction

**Status:** Locked for the site redesign implementation on `cursor/site-redesign-e953`.  
**Not:** One-off mockup vibes. This is the rulebook.

## Product feeling

Calm UK garden coach — quiet confidence, never a gamified dashboard. Soft light, forest green, warm amber. Short sessions. Honest language.

## Tokens

| Token | Value | Use |
| --- | --- | --- |
| Brand | `#2F6F5E` | Primary actions, active nav |
| Brand deep | `#1F4F43` | Headlines, brand wordmark |
| Brand soft | `#E4F0EB` | Washes, Why this works, selected rows |
| Accent | `#C47A2C` | Sparse warmth (safety, emphasis) |
| Accent soft | `#F8EFE4` | Safety / caution bands |
| Ink | `#1F2A24` | Body |
| Muted | `#5A6B62` | Supporting copy |
| Line | `#D7E0D9` | Hairlines, separators |
| Bg | `#F3F6F2` | Base |

**Type:** Fraunces (display) + Nunito Sans (body). Never Inter/Roboto/system as the designed face.

## Layout rules

1. **One composition per first viewport** — landing is brand + one line + one CTA group + atmosphere. No stats, schedules, or promo chips.
2. **Brand first** — “Good Dog” is a hero signal on marketing surfaces; on app screens it stays a clear wordmark above the page title.
3. **Atmosphere** — page background is layered sage/amber wash + soft grain; landing uses a full-bleed photographic plane.
4. **Fewer cards** — default content is open on the page (`.section` / hairlines). Use `.card` / `.panel` only when the block is a distinct interactive unit (plan item, form, answer).
5. **One job per section** — one heading, one short support line, then content.
6. **Glossary** — dashed underline in brand; no chips or floating labels on media.
7. **Motion** — intentional only: fade-up on enter, soft progress fill, button press. No bounce spam.

## Screen jobs

| Screen | Job |
| --- | --- |
| Landing | Desire to start — brand, promise, CTAs |
| Onboarding | Capture dog basics without ceremony |
| Today | Pick today’s practice — progress + startable list |
| Exercise | Follow steps; optional Why this works; feedback |
| Learn | Find a word or browse a topic |
| Ask | Get a short grounded answer |
| My dog | See who we’re coaching + history |
| Shop | Curated session kit (own-brand treats) + honest affiliate walk kit |

## Navigation

Five destinations: **Today · Learn · Shop · My dog · Ask**. Active = soft brand wash + deep ink (not a solid filled “blob” for Today). Simple line icons, not emoji.

On viewports **below 1024px**, primary nav is the sticky **bottom bar**. From **1024px (lg)** upward, the same links move to a **left sidebar** inside the app shell; the bottom bar is hidden.

## Responsive layout

Mobile-first breakpoints follow Tailwind defaults: **md** 768px, **lg** 1024px, **xl** 1280px.

| Tier | Viewport | Shell & chrome |
| --- | --- | --- |
| Phone | &lt; 768px | Full-width column up to **28rem**; bottom nav |
| Tablet | md–lg | Centered **framed** shell (rounded, shadow, sage stage on outer body); landing uses **two columns** (copy + photo) |
| Small laptop | lg+ | Shell widens to **42rem**; **sidebar nav**; slightly wider sheet padding |
| Large laptop | xl+ | Scannable lists use **`.grid-cards-2`** (Learn exercise topics, Shop own-brand, Ask articles); long copy uses **`.prose-width`** (~65ch) |

CSS variables: `--shell-max`, `--shell-max-lg`, `--sidebar-width` in `src/app/globals.css`. Do not stretch exercise steps or Today’s plan into multi-column layouts.

## Shop notes

Match the dropship mockup where practical: brand-led Shop header, own-brand session kit rows (thumb · title · pack · blurb · accent price · Add), drop-ship disclosure, affiliate section below. Checkout stays illustrative until trade fulfilment is live.

## Out of scope this pass

Live Stripe/checkout, Expo/native shell, final Pero die-line photography.
