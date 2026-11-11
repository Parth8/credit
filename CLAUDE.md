# Decoding Credit Cards — working memory

Free, interactive guide to credit cards. Live at https://parth8.github.io/credit/ (GitHub Pages, `main`, repo root).
Author: Parth. Principle: **learning by doing** — every chapter is an interaction, not an article.
Promise on the landing page: no affiliate links, no card recommendations, no tracking, free forever. Keep it true:
name institutions (issuers, networks, regulators, merchants) but **do not recommend card products** — use archetypes
("a 5% marketplace co-brand card").

## Stack and constraints

- Pure static HTML/CSS/JS. No build step, no framework, no dependencies. Google Fonts is the only external request.
- Must keep working from GitHub Pages under `/credit/` — relative paths only.
- No test suite. Verify by serving the folder (`python3 -m http.server`) and driving it with Playwright
  at phone (360–390), tablet (820) and laptop (1280+) widths, in each region (`?r=in|us|uk|au`).
  Check: no page errors, `scrollWidth == clientWidth`, no `{token}` or `undefined` left in `main`, `body.ready` set.
- State is `localStorage` only, keys prefixed `dcc.`: `region`, `done` (chapter numbers), `mute`, `switches`,
  `audit`, `pledge`, `name`. Nothing leaves the device.

## Layout

```
index.html              landing: hero + edition picker, why, chapter list (rendered from the registry), manifesto
css/global.css          design system v3: tokens, layout utilities, shared components, chapter shell, motion
js/regions.js           window.DCC_REGIONS — every fact, name and amount that differs by geography
js/global.js            engine, window.DCC — region lens, progress, page chrome, effects, quiz runner
chapters/NN-slug.html   22 chapters: shared <head>, a small <style> for unique visuals, markup, one inline <script>
og-image.png / .svg     social card
```

### How a chapter is put together

```html
<body data-ch="5">
<main class="ch"><div class="wrap">
  <header class="ch-head"><h1>The <em>Billing Cycle</em></h1><p>intro…</p></header>
  <section class="sec">…</section>
  <aside class="checkpoint" data-icon="※"><h3>…</h3><p>…</p></aside>
</div></main>
<script src="../js/regions.js"></script><script src="../js/global.js"></script>
<script>{ const { $, R, money, t, pick } = DCC; … }</script>
```

`global.js` injects everything else from `data-ch`: nav (region chip, sound toggle, chapter drawer), the
"Chapter V · 5 of 22" line, checkpoint icon and next-chapter button, prev/next footer, the phone thumb bar and
the site footer. Never hand-write those. Chapter titles, blurbs and minutes live in the `CH` registry in `global.js`
— adding or renaming a chapter means editing that list (and `<title>`), nothing else.

Chapter scripts are wrapped in `{ }` on purpose: they are classic scripts, and top-level `const top`, `name`, etc.
collide with window globals.

### Region API (the thing to know)

- `DCC.R` — current region object; `DCC.rid` — `'in' | 'us' | 'uk' | 'au'`.
- `{token}` in static HTML is replaced at load: `{issuer}`, `{network}`, `{merchant}`, `{apr}`… any key of `R`;
  `{$key}` formats an amount from `R.a` (`{$debt}`, `{$meal}`, `{$phone}`).
- `DCC.t(str)` does the same for strings built in JS. `DCC.money(n, withDecimals)` formats in the region's locale.
- `DCC.pick({ in, us, uk, au })` returns the current region's value. Missing key: UK/AU fall back to `us`, then `in`.
- `data-r="in"` on an element keeps it only in those regions (space-separated list).
- Region resolution: `?r=` → saved choice → timezone guess (with a one-time "change" toast).
- Do not put `data-region` on anything except the picker buttons — the click handler keys off it.

### Shared components (css/global.css)

Layout `.wrap .sec .split(--l/--r) .grid(--min) .row .stack .sticky` · type `.eyebrow .h2 .h3 .h4 .lede .mono .hand`
· surfaces `.stage .panel .callout(.is-danger/.is-success/.is-warm) .chip` · controls `.btn(--primary/--outline/--ghost/--lg/--sm)
.tile(.on/.done) .seg>button.on .field .val input[type=range] .opt` · data `.stat .kv .dots .meter ul.ticks ul.crosses`
· `details.fold` for expandables · `.cc` card visual (add `data-tilt`) · `.reveal` scroll-in.
Breakpoints are mobile-first: base = phone, `min-width: 700px` tablet, `900px` two-column splits, `1040px` laptop.

### Engine helpers

`DCC.quiz(el, { items, shuffle, onAnswer, onEnd })` drives chapters 4, 9, 10, 15, 17, 18, 22.
`DCC.markDone()` records completion (also fires when the checkpoint scrolls into view).
`DCC.playClick/playSuccess/playError` (sound + haptics, respect mute), `burstConfetti`, `animateNumber`,
`observe()` after injecting `.reveal` nodes, `fillAll()` after injecting range inputs.

## Design language (keep)

"Warm editorial zine": cream paper `#F7F3ED`, ink `#1A1A18`, ONE accent electric blue `#2563EB`;
danger red / success green / warm orange / gold as semantic colours only.
Fonts: Fraunces (display; italic-light `<em>` in accent colour is the signature move), Instrument Sans (body),
Caveat (hand annotations), Space Mono (data, labels). Symbol `※` is the brand mark.
Interaction rule: the learner does something before any explanation appears; every result is visible within
the same screen on a phone (sticky readouts, results ordered above controls where needed).
Honours `prefers-reduced-motion`; all controls are real buttons with focus rings.

## Chapter inventory (what the learner does)

| # | File | Interaction | Regional data |
|---|------|-------------|---------------|
| 1 | 01-the-handshake | tap card → 5-step authorisation; cast of five; auth/clearing/settlement; fee-split slider; surcharge scene | split rates, surcharge law per region |
| 2 | 02-getting-a-card | live application → approve / refer / decline with reasons | score scale, income basis, age rules, "behind the scenes" |
| 3 | 03-the-anatomy | flip card, 12 hotspots, progress pips | contactless limits, networks, helplines |
| 4 | 04-types-of-cards | match 6 people to a card type | starter card differs (FD-secured / deposit / credit-builder / low-limit) |
| 5 | 05-the-billing-cycle | tap a day → interest-free days; pay full / minimum / late | grace days, late rules |
| 6 | 06-the-trap | payoff simulator with chart; real declining minimum | APR, minimum formula, GST, exits |
| 7 | 07-fees | trigger 8 fees, running cost counter | 5 shared fees + 3 region-specific |
| 8 | 08-the-score | gauge + 5 factors + personas + myths | bureau scale, bands, weights (US only), local rules |
| 9 | 09-rewards | pick best of 5 archetype cards; net-value calculator | reward rates, small print |
| 10 | 10-fraud | 6 current scams with mockups | scam #4 fully local; reporting steps |
| 11 | 11-fraud-defense | 5 attacks vs 6 layers; personal switches checklist | 2FA regime |
| 12 | 12-disputes | 4 dispute flows | rights panel, deadlines |
| 13 | 13-international | currency-choice terminal; trip simulator | home currency, fees, tips |
| 14 | 14-management | 6-month decision sim | amounts, liability rules |
| 15 | 15-protections | covered-or-not quiz; benefits; own-card audit | whole list is per region |
| 16 | 16-customer-service | 6 branching calls incl. hardship and complaint | escalation ladder |
| 17 | 17-alternatives | match situation to payment tool; 5-tool comparison | rail names, regulation |
| 18 | 18-taxes | true/false; India-only LRS/TCS calculator | entirely per region |
| 19 | 19-students | route picker; 5 steps; saved commitments | routes in |
| 20 | 20-relationship | statement anchoring experiment; 6 biases | free help lines |
| 21 | 21-future | AI-agent guardrails toy; timeline | 3 local + 4 shared items |
| 22 | 22-graduation | 12-question exam, named printable diploma | questions tokenised |

## History — what the May 2026 original got wrong (do not reintroduce)

- UI: single 768px breakpoint, nav hidden on phones, fixed pixel widths, `overflow-x:hidden` breaking sticky,
  shell CSS duplicated in 22 files, no progress memory, clickable divs, no mute, custom cursor hiding the real one.
- India tax: said international credit card spend above ₹7L triggers 20% TCS. Credit cards are outside LRS/TCS;
  the LRS threshold is ₹10L. Reporting is SFT (₹10L+/year of card payments), not "any transaction over ₹2L".
- India late fees: RBI's 2022 directions allow a fee and bureau report only when more than 3 days past due.
- Minimum-payment chapter: headline numbers contradicted its own calculator. Numbers now come from one function.
  Indian minimum due is ~5% of balance **plus** that month's interest, fees and GST.
- Score chapter showed FICO bands and weights as CIBIL.
- Named card products with wrong or stale details. No product names — archetypes only.
- "Storing CVV is illegal under PCI DSS": it is an industry standard, not law. BINs are 6–8 digits.
- Apple Pay India launched 30 Sep 2026 (Axis credit cards first), not 2025. Agentic checkout is live, not "10+ years".

## Regions (dynamic tailoring)

Four lenses; the learner picks one and the whole site re-renders in it:
`in` India · `us` United States · `uk` UK & Europe (EMEA lens, UK primary, EU notes) · `au` Australia & NZ.

Facts that differ by region and must never be shared copy:

| | India | USA | UK / EU | Australia / NZ |
|---|---|---|---|---|
| Regulator | RBI | CFPB, Fed (Reg Z, CARD Act, FCBA) | FCA; PSR; EU PSD2 | ASIC, RBA; ePayments Code |
| Bureaus / score | CIBIL 300–900 (+Experian, Equifax, CRIF) | FICO / VantageScore 300–850 | Experian 0–999, Equifax 0–1000, TransUnion 0–710; no single score | Equifax 0–1200, Experian 0–1000 |
| Typical purchase APR | 36–45% (+18% GST on interest and fees) | ~21–24% | ~25–35% representative | ~20–21% |
| Minimum payment | ~5% of balance | ~1% + interest and fees | ~1% + interest and fees | ~2–3% |
| Late fee | tiered ₹500–1,300, only after 3 days | up to ~$30 first / $41 repeat ($8 cap vacated Apr 2025) | £12 | ~A$20–30 |
| Unauthorised-use rule | RBI 2017: zero liability if reported in 3 working days | FCBA $50 cap, networks zero | PSRs £35 cap; Section 75 for £100–£30k purchases | ePayments Code; AFCA |
| Online 2FA | mandatory (AFA); new risk-based directions from Apr 2026 | not mandated | SCA mandatory | 3DS risk-based |
| Contactless no-PIN | ₹5,000 | no legal cap | £100 by default (banks may set own since 19 Mar 2026); EU €50 | A$100–200 |
| Interchange | ~1–2% credit; UPI zero MDR | ~1.5–2.5%, uncapped credit | capped 0.3% credit | cap cut to 0.3% + surcharging banned from 1 Oct 2026 |
| Instant rail | UPI | Zelle, FedNow, RTP | Faster Payments / open banking; EU SEPA Instant, Wero | NPP / PayID |
| BNPL | shrinking; credit lines on UPI | lightly regulated | FCA-regulated since 15 Jul 2026 | regulated credit since 10 Jun 2025 |
| Ombudsman | RBI Integrated Ombudsman (CMS) after 30 days | CFPB complaint portal | Financial Ombudsman Service after 8 weeks | AFCA after 30 days |
| Card tax hook | LRS/TCS (not credit cards), SFT reporting, 18% GST on fees | rewards = rebate; bonus without spend is income | cashback not taxable | GST 10% in fees; ATO view on points |
| Debt help | RBI ombudsman, bank restructuring | NFCC non-profit counselling | StepChange, MoneyHelper, Breathing Space | National Debt Helpline 1800 007 007 |

Amounts are never FX-converted. Each region has its own realistic figures for the recurring scenarios
(meal, big purchase, limit, debt, income) so a US learner sees a $5,000 limit, not ₹50,000 ÷ 85.

Rules, rates and thresholds change. Anything dated belongs in region data, not buried in prose,
and the site should say "as of" where a figure is time-sensitive.

## Working agreements

- Branch for this work: `claude/gifted-brown-c28xk1`. No PR unless asked.
- Order agreed with Parth: (1) redesign and responsive behaviour, (2) content accuracy + regions, (3) code optimisation last.
- Site copy uses British spelling in shared text (authorisation, utilisation); keep it consistent.
- Time-sensitive facts carry `asOf` in `regions.js` and the footer shows it. Re-verify figures before bumping the date.
