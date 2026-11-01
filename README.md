# KAI × DART — Station Intelligence

**[Live site →](https://elliyeen.github.io/kai-dart/)** · Repo `elliyeen/kai-dart` · Author: [Abdullah@elliyeen.com](mailto:Abdullah@elliyeen.com)

KAI (Elliyeen) is a proposed Infrastructure Service Intelligence layer for DART stations: station and shelter quality, contractor accountability and independently verified outcomes. It is meant to complement DART's existing systems (including Maximo), not replace them.

> **This site is a static demonstration with synthetic data.** No station is connected to live DART data, there is no DART endorsement or integration, and role switching is a simulation, not access control. Terms shown for a pilot are Elliyeen proposals, not DART-approved. See [`IMPLEMENTATION_STATUS.md`](IMPLEMENTATION_STATUS.md) for what is and is not done.

## What is in the app

| Area | Routes | What it does |
|---|---|---|
| Marketing | `/`, `/faq`, `/get-started`, `/checkout`, `/architecture`, `/contact` | Landing page, 14-answer FAQ, getting started, non-binding proposal checkout (nothing is submitted or sent), the "DART Super Intelligence" architecture page |
| Station platform | `/stations`, `/stations/[id]` | All 115 original station-line records (76 physical stations) with search and the five line filters (Red 26, Green 24, Blue 23, Orange 32, Silver 10). Each station page has **Report an issue**, **Deploy crew** (simulated, Operations role only) and its own **Autonomous demo** |
| Tools | `/stations/report`, `issues`, `ticket`, `checklist`, `intelligence`, `inventory`, `audit`, `loop`, `scenarios`, `contractors`, `assets`, `inspections`, `readiness` | Report form and ticket tracking, issues log, 45-item inspection checklist, rules-based intelligence view, inventory, audit log, auto demo, test scenarios, contractors |
| Legacy | `/platform`, `/dart/*`, `/cities/*` | Earlier dashboard demo, kept unchanged |

### Guided demo (seven steps)
Network → open Akard → **Inspector runs the checklist and the KAI loop opens work orders** → Operations assigns → contractor submits proof → a different inspector verifies → executive view updates → Reset.

### KAI loop
After an inspection is submitted: **Observe** (score the answers) → **Decide** (group failures into work orders by section) → **Act** (assign the contract holder) → **Verify** (independent re-inspection by a different inspector) → **Learn** (shorter re-inspection interval). It is plain rules, not a machine-learning model, and everything stays in the browser (localStorage).

## Develop

```bash
npm install
npm run dev -- --port 3001        # http://localhost:3001
npm run lint && npm run typecheck && npm run test:unit
GITHUB_PAGES=true npm run build   # static export under /kai-dart
node scripts/serve-out.mjs        # serve out/ at http://localhost:4173/kai-dart/
npx playwright install chromium firefox webkit
npm run test:e2e                  # 540 tests: 5 Chromium viewports + Firefox, WebKit, iPhone, iPad, Pixel
```

Stack: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind CSS v4, Playwright + axe, Vitest.

## Process and versions
- Work happens on a feature branch per task and lands through a pull request; CI (`.github/workflows/ci.yml`) runs lint, typecheck, unit, build, E2E on all browsers and `npm audit`. Pushes to `main` deploy to GitHub Pages (`pages.yml`).
- Version history is in [`CHANGELOG.md`](CHANGELOG.md); release, preview and rollback steps are in [`docs/RELEASE.md`](docs/RELEASE.md); design fidelity rules are in [`docs/DESIGN_TO_PRODUCTION_FIDELITY.md`](docs/DESIGN_TO_PRODUCTION_FIDELITY.md).
- Project rules for contributors and agents are in [`CLAUDE.md`](CLAUDE.md): never fabricate data, endorsements, live status, metrics or certifications; production deploys, credentials and security changes need explicit approval.

## Infrastructure
GitHub Actions → GitHub Pages at `/kai-dart`. A Cloudflare Pages build target exists (`EXPORT_TARGET=cloudflare`) but has **not** been deployed; it needs credentials and approval.

© 2026 Elliyeen. KAI.
