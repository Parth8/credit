# Decoding Credit Cards

A free, interactive 31-chapter guide to credit cards — built for the mobile-native generation, in four regional editions.

Every chapter is an interaction. No reading-and-scrolling. Tap, drag, simulate, decide.

## What's inside

31 interactive chapters in two parts — how to use a card, and how the industry behind it works — in four regional editions.
Pick **India, USA, UK & Europe, or Australia & NZ** and every amount, example, law, regulator
and scam on the site switches to that market.

| # | Chapter | What you do |
|---|---------|-------------|
| I | The Handshake | Tap a card, step through authorisation, split the merchant fee |
| II | Getting a Card | Fill in an application and watch the decision change |
| III | The Anatomy | Flip a card and find all 12 parts |
| IV | Types of Cards | Match six people to the right kind of card |
| V | The Billing Cycle | Move a purchase around the calendar |
| VI | The Minimum Payment Trap | Live debt simulator with a payoff chart |
| VII | Every Fee | Trigger eight fees and watch the cost climb |
| VIII | Your Credit Score | Change habits, watch the gauge |
| IX | The Rewards Game | Pick the best card, then price rewards against interest |
| X | Spot the Fraud | Six scams that are running now |
| XI | Your Defense System | Launch five attacks against six security layers |
| XII | Disputes & Chargebacks | Walk four dispute flows |
| XIII | Going International | Press the terminal button; plan a trip |
| XIV | Managing Like a Pro | Six months of decisions |
| XV | Hidden Protections | Covered or not? Audit your own card |
| XVI | Talking to Your Bank | Six branching phone calls |
| XVII | Cards vs Everything Else | Choose the right payment tool |
| XVIII | Taxes & Your Card | Myths versus rules |
| XIX | Your First Card | A route in, five steps, five commitments |
| XX | Your Relationship With Money | An anchoring experiment on yourself |
| XXI | What's Coming Next | Set guardrails for an AI shopping agent |
| XXII | Graduation | Twelve questions and a printable diploma |

**Part II · Inside the machine** — how the payments industry works

| # | Chapter | What you do |
|---|---------|-------------|
| XXIII | Anatomy of an Authorisation | Open an ISO 8583 message; answer six requests as the issuer |
| XXIV | The Life of a Transaction | Holds, captures, reversals and refunds across three ledgers |
| XXV | Clearing & Settlement | Net a day of payments between four banks |
| XXVI | Interchange & the Price of a Payment | Change the card, channel and merchant and watch the fee |
| XXVII | The Acquiring Stack | Choose a payments setup for three businesses; see PCI scope |
| XXVIII | Tokens, Wallets & 3-D Secure | Step through provisioning, a phone tap and an online check |
| XXIX | Build a Fraud Engine | Set thresholds and rules on a live stream of payments |
| XXX | The Chargeback Machine | Play the merchant through every stage of a dispute |
| XXXI | Inside the Issuer | Run one account's P&L; watch collections escalate |

## Stack

- **Pure HTML/CSS/JS** — no build step, no frameworks, no dependencies
- **Hosted on GitHub Pages**
- **Mobile-first** — designed for phones, adapts to tablets and laptops
- **Private** — progress and region are stored in your browser only; nothing is sent anywhere

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g., `decoding-credit-cards`)
2. Upload everything in this folder to the repo root (or push via Git):
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/decoding-credit-cards.git
   git push -u origin main
   ```
3. In repo Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` / folder: `/ (root)`
   - Save
4. Wait ~1 minute. Site goes live at `https://YOUR-USERNAME.github.io/decoding-credit-cards/`

For a custom domain, add a `CNAME` file containing your domain at the repo root.

## File structure

```
├── index.html          # Landing page; chapter list is rendered from the registry in js/global.js
├── css/global.css      # Design system and shared components
├── js/regions.js       # Everything that differs by region: names, rates, rules, amounts
├── js/global.js        # Engine: region lens, progress, navigation, shared interactions
└── chapters/           # 31 chapters, each a small HTML file with its own inline script
```

`CLAUDE.md` documents the architecture, the region API and the content rules in detail.

## Updating content

- **A rate, fee, threshold or institution name** — edit `js/regions.js`. Bump `asOf` after re-checking.
- **A chapter title or description** — edit the `CH` list in `js/global.js`.
- **Copy that differs by region** — use `DCC.pick({ in, us, uk, au })` in the chapter script, or `{tokens}` in the HTML.
- **Accent colour** — `--electric` in `css/global.css`.
- Link straight to an edition with `?r=in`, `?r=us`, `?r=uk` or `?r=au`.

## Design system

Warm editorial zine: cream paper, one electric-blue accent, Fraunces / Instrument Sans / Caveat / Space Mono.

## Credits

Built by [Parth](https://parth8.github.io/portfolio/) for anyone who wants to actually understand how their card works — not just have one.

General education, not financial advice. Made with care, coffee, and Claude. Free to use, fork, and remix.
