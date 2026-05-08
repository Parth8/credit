# Decoding Credit Cards

A free, interactive 22-chapter guide to credit cards — built for the mobile-native generation.

Every chapter is an interaction. No reading-and-scrolling. Tap, drag, simulate, decide.

## What's inside

22 chapters covering the full lifecycle of credit cards in the Indian context:

| # | Chapter | Interaction |
|---|---------|-------------|
| I | The Handshake | 5-step transaction lifecycle with money packets |
| II | Getting a Card | Live application form with real-time approval |
| III | The Anatomy | 3D-flippable card with 9 clickable hotspots |
| IV | Types of Cards | Drag-and-drop sorting game |
| V | The Billing Cycle | Interactive 30-day calendar |
| VI | The Trap | Live debt simulator (the crown jewel) |
| VII | Every Fee | 8 animated fee scenarios |
| VIII | Your Score | Live CIBIL gauge with 5 sliders |
| IX | Rewards Game | 6-round card-matching game |
| X | Spot the Fraud | 6 phishing/fraud scenarios with grading |
| XI | Defense System | 5-layer security explorer |
| XII | Disputes | Step-by-step chargeback walkthrough |
| XIII | International | Trip simulator with forex/DCC math |
| XIV | Managing Like a Pro | 6-month decision simulator |
| XV | Hidden Protections | 6 expandable benefit cards |
| XVI | Talking to Bank | Simulated agent dialogues |
| XVII | UPI, Wallets & The Rest | 5-tab payment comparison |
| XVIII | Taxes & TCS | Live ₹7L threshold slider |
| XIX | Your First Card | 5-step student playbook |
| XX | Relationship with Money | 6 psychological biases |
| XXI | What's Coming Next | Future-of-payments timeline |
| XXII | Graduation | 10-question final test + diploma |

## Stack

- **Pure HTML/CSS/JS** — no build step, no frameworks
- **Hosted on GitHub Pages** — completely free
- **Mobile-first** — designed for 18-24 year olds on phones
- **No dependencies** — Google Fonts is the only external resource

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
decoding-cc/
├── index.html              # Landing page with all 22 chapters
├── README.md               # This file
├── css/
│   └── global.css          # Design system (colors, fonts, components)
├── js/
│   └── global.js           # Shared utilities (sound, confetti, etc.)
└── chapters/
    ├── 01-the-handshake.html
    ├── 02-getting-a-card.html
    ├── ... (22 total)
    └── 22-graduation.html
```

Each chapter is fully self-contained — just HTML/CSS/JS with shared global styles. Edit any chapter independently without affecting others.

## Design system

- **Background:** Cream (`#F7F3ED`) with subtle paper texture
- **Accent:** Electric blue (`#2563EB`)
- **Supporting:** Warm orange, gold, danger red, success green
- **Typography:** Fraunces (display, italic for emphasis), Instrument Sans (body), Caveat (handwritten), Space Mono (data)

The aesthetic is "warm editorial indie" — think zine meets indie game studio. Every chapter feels like a level with a completion moment.

## Customization

- **Update Indian banks/amounts:** Search-and-replace in chapter files (HDFC, ICICI, Axis, etc.)
- **Change accent color:** Edit `--electric` in `css/global.css`
- **Adjust mobile breakpoints:** All chapters break at `768px`
- **Add more chapters:** Copy any existing chapter HTML, update content, add link in `index.html`

## Credits

Built by [Parth](https://parth8.github.io/portfolio/) for anyone who wants to actually understand how their card works — not just have one.

Made with care, coffee, and Claude. Free to use, fork, and remix.
