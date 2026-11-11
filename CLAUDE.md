# Decoding Credit Cards — working memory

Free, interactive guide to credit cards. Live at https://parth8.github.io/credit/ (GitHub Pages, `main`, repo root).
Author: Parth. Principle: **learning by doing** — every chapter is an interaction, not an article.
Promise on the landing page: no affiliate links, no card recommendations, no tracking, free forever. Keep it true:
name institutions (issuers, networks, regulators, merchants) but **do not recommend card products** — use archetypes
("a 5% marketplace co-brand card").

## Stack and constraints

- Pure static HTML/CSS/JS. No build step, no framework, no dependencies. Google Fonts is the only external request.
- Must keep working when opened from GitHub Pages under `/credit/` — use relative paths only.
- No test suite. Verify by serving the folder (`python3 -m http.server`) and driving it with Playwright
  at phone (390), tablet (820) and laptop (1280+) widths, in each region.

## Layout

```
index.html                landing: hero, why, chapter list, manifesto, footer
css/global.css            design tokens + shared components
js/global.js              shared engine, exposed as window.DCC
chapters/NN-slug.html     22 chapters, each = shared head + own <style> + markup + own <script>
og-image.png / .svg       social card
```

## Design language (keep)

"Warm editorial zine": cream paper `#F7F3ED`, ink `#1A1A18`, ONE accent electric blue `#2563EB`;
danger red / success green / warm orange / gold as semantic colours only.
Fonts: Fraunces (display; italic-light `<em>` in accent colour is the signature move), Instrument Sans (body),
Caveat (hand annotations), Space Mono (data, labels). Symbol `※` is the brand mark.
Every chapter ends in a "checkpoint" card and a prev/next footer.

## Chapter inventory (what the learner does)

| # | File | Interaction | Data lives in |
|---|------|-------------|---------------|
| 1 | 01-the-handshake | tap card → 5-step auth stepper; 5 player cards; auth/clearing/settlement tabs; MDR split slider; surcharge scenario | `PLAYERS`, `STEPS` |
| 2 | 02-getting-a-card | application sliders/toggles → live approve/review/decline + factor list | `updateApp()` |
| 3 | 03-the-anatomy | 3D flip card, 11 hotspots (UI says 10) | `PARTS` |
| 4 | 04-types-of-cards | 6 scenarios → pick card type; reference grid | `TYPES`, `SCENARIOS` |
| 5 | 05-the-billing-cycle | 30-day calendar, 5 key days | `KEY_DAYS` |
| 6 | 06-the-trap | debt payoff calculator (balance / APR / min-fixed-full) | `updateCalc()` |
| 7 | 07-fees | 8 fees, each a stepper + breakdown + lesson | `FEES` |
| 8 | 08-the-score | gauge + 5 factors + 3 personas | `state`, `utilImpact` |
| 9 | 09-rewards | 6 purchases → pick best of 6 cards | `CARDS`, `PURCHASES` |
| 10 | 10-fraud | 6 scam scenarios with mockups, red flags, grade | `SCENARIOS` |
| 11 | 11-fraud-defense | 5 security layers | `LAYERS` |
| 12 | 12-disputes | 4 dispute flows × 5 steps | `FLOWS` |
| 13 | 13-international | trip simulator: destination, card type, DCC, spend | `DESTS` |
| 14 | 14-management | 6-month decision sim, score + savings | `MONTHS` |
| 15 | 15-protections | 6 expandable benefits | `PROTECTIONS` |
| 16 | 16-customer-service | 4 branching phone dialogues with coaching | `SCENARIOS` |
| 17 | 17-alternatives | 5 tabs: card vs other rails | `TABS` |
| 18 | 18-taxes | threshold slider + 6 fact cards | inline |
| 19 | 19-students | 5-step playbook + 5 tap commitments | static |
| 20 | 20-relationship | 6 expandable biases | static |
| 21 | 21-future | 6-item timeline | static |
| 22 | 22-graduation | 10-question exam + diploma | `QS` |

## Audit of the original site (May 2026 state) — why the rebuild

### UI/UX and responsiveness
- One breakpoint (768px). Tablets get cramped desktop grids; phones lose the whole nav (`.nav-links{display:none}`).
- Fixed pixel widths (card 320px, POS 200px), `100vh` hero, 5-across grids that overflow at 360px.
- `html,body{overflow-x:hidden}` breaks `position:sticky` (chapter 5 relies on it).
- Mobile hacks: `a:not(.nav-brand){min-height:44px}` distorts inline links; `[class*="-label"]{font-size:14px!important}`.
- Chapter shell CSS (header, checkpoint, bottom nav, stage) is copy-pasted into all 22 files; heavy inline `style=""`.
- No progress memory: nothing records finished chapters; no resume; no way to jump between chapters from inside one.
- Accessibility: clickable `<div onclick>` (no keyboard), no focus styles, no `prefers-reduced-motion`,
  no `aria-live` on results, sounds play with no mute, custom cursor hides the system cursor.
- Fonts loaded through CSS `@import` (slow chain).

### Content — India-only, and several things wrong or stale
- Ch 18: said international card spend above ₹7L triggers 20% TCS. Wrong: international **credit card** spend is
  outside LRS/TCS (2023 deferral still in force); LRS TCS threshold is ₹10L since April 2025. "AIR for any single
  transaction over ₹2L" is wrong — it is SFT reporting of ₹10L+/year card payments (₹1L+ in cash).
- Ch 7: "even one second late counts". RBI's 2022 card directions: late fee and bureau reporting only after the
  account is **more than 3 days** past due; late fee applies to the unpaid amount only. Over-limit needs explicit consent.
- Ch 6: headline says 11.2 years / ₹87,420, but the calculator used a fixed payment (shows ~2.6 years).
  No chart although the copy promises one. Graduation Q2 says "decades — possibly never". All three disagree.
- Ch 8: FICO bands (580/670/740) and FICO weights presented as CIBIL. CIBIL is 300–900 with different bands;
  it does not publish those weights.
- Ch 5: "30 + 22 = ~52 days" — statement 5th, due 25th is 20 days → ~50.
- Ch 21: "Apple Pay launched in India in 2025" — it launched 30 Sep 2026, Axis credit cards only.
  Agentic commerce was filed under "10+ years"; it is shipping now.
- Ch 7/9/15: named products with wrong details (called two cards "zero-forex" that are not; reward rates since changed)
  — and naming products contradicts the no-recommendations promise.
- Ch 1/3/11: "storing CVV is illegal under PCI DSS" — PCI DSS is a contractual industry standard, not law.
  BINs are now 6–8 digits. "Cards drive 30–40% more spending" vs ch 20 "12–18%" — unsourced and inconsistent.
- Ch 10: DCC example shows ₹25 difference while claiming 5–7%. No current scams (digital arrest, QR/collect, AI voice).
- Ch 13: stale FX rates; dead code in `updateTrip()`.
- Ch 3: UI says "10 parts", there are 11.

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
