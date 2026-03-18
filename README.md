# KAI — The Operating System for Cities

**[Live Site →](https://elliyeen.github.io/kai-dart/)**

**Author:** [Abdullah@elliyeen.com](mailto:Abdullah@elliyeen.com)

KAI unifies data, operations, and intelligence into a single platform — turning complexity into clarity, at any scale. Built initially for DART (Dallas Area Rapid Transit), KAI is purpose-built to handle the real-world demands of large-scale infrastructure, including the 300%+ ridership surge expected during FIFA World Cup 2026.

---

## Platform

KAI is built on three layers — the **Kai Fabric**:

| Layer | Description |
|---|---|
| **Data Fabric** | Connects every data source across stations, vehicles, and systems into a unified real-time picture |
| **Operations Intelligence** | Predictive AI forecasts maintenance needs 4 hours ahead with 94.2% accuracy |
| **Workflow Automation** | AI-driven task routing and rapid-response team deployment in under 5 minutes |

---

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- CI/CD (GitHub Actions → GitHub Pages)

---

## Getting Started

```bash
npm install
npm run dev -- --port 3001
```

Open [http://localhost:3001](http://localhost:3001) to view the site.

> Port 3001 is used because port 3000 is reserved for another local project.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, platform overview |
| `/platform` | The Kai Fabric — three-layer architecture deep-dive + live command center demo |
| `/world-cup-2026` | FIFA 2026 countdown, Dallas match schedule, readiness tracker |
| `/contact` | Contact / demo request form |

---

## Key Stats

| Metric | Value |
|---|---|
| DART Stations | 65 |
| Inspection Points / Station | 247 |
| Total Inspection Points | 16,055 |
| Match Day Ridership Surge | +286% |
| AI Forecast Accuracy | 94.2% |
| Incident Response Time | < 30 seconds |
| Dallas FIFA 2026 Matches | 9 (Group → Semi-Final) |

---

## Infrastructure

- **CI/CD**: GitHub Actions — lint/build on PR, deploy to GitHub Pages on push to `main`
- **Live URL**: https://elliyeen.github.io/kai-dart/
- **Repo**: `elliyeen/kai-dart`
- **Base path**: `/kai-dart` (configured in `next.config.ts`)

---

© 2026 KAI. The Operating System for Cities.
