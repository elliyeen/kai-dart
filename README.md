# KAI — The Operating System for Cities

**[Live Site →](https://elliyeen.github.io/kai-dart/)**

**Author:** [Abdullah@elliyeen.com](mailto:Abdullah@elliyeen.com)

KAI unifies data, operations, and intelligence into a single platform — turning complexity into clarity, at any scale. Built initially for DART (Dallas Area Rapid Transit), KAI is purpose-built to handle the real-world demands of large-scale infrastructure, including the 300%+ ridership surge expected during FIFA World Cup 2026.

---

## Platform

KAI is built on three layers — the **Kai Fabric**:

| Layer | Description |
|---|---|
| **Data Fabric** | Connects every sensor, system, and record across stations into a unified real-time picture |
| **Operations Intelligence** | Predictive AI forecasts maintenance needs up to 4 hours ahead with 94.2% accuracy |
| **Workflow Automation** | AI-driven task routing and rapid-response team deployment in under 5 minutes |

---

## Live Command Center Demo

The platform page includes a fully interactive **Live Command Center** — a real-time station readiness dashboard covering all five DART lines.

### DART Lines

| Line | Terminals | Stations | Status |
|---|---|---|---|
| **Red** | Westmoreland → Parker Rd | 26 | Active |
| **Green** | Buckner → N. Carrollton/Frankford | 28 | Active |
| **Blue** | UNT Dallas → Downtown Rowlett | 23 | Active — 1 Closure |
| **Orange** | Parker Road → DFW Airport | 13 | Active |
| **Silver** | Shiloh Rd → DFW Terminal B | 10 | Active |

### Dashboard Features

- **Command Center** — Network-wide readiness overview with spark charts per line, critical station table, and AI accuracy metrics
- **Stations View** — Per-line station list with live scores, issue flags, staff deployment, and closure notices
- **Asset Dashboards** — Elevator, camera, stairwell, trash can, and bus cover uptime across all stations
- **Inspection** — 48-point crew checklist with photo upload and section scoring
- **Intelligence Engine** — AI anomaly detection, predictive alerts, and confidence-scored decisions

### Notable Station Data

- **Convention Center (Blue Line)** — Closed Jan 5 2026 for KBHCC redevelopment. Est. reopening 2029.
- **Cedars (Blue Line)** — Score: 42, Critical (safety, smell, vandalism, litter, lighting)
- **Forest/Jupiter (Blue Line)** — Score: 42, Critical
- **St. Paul (Blue Line)** — Score: 48, Critical

---

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- CI/CD — GitHub Actions → GitHub Pages

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
| `/platform` | Platform deep-dive + Live Command Center demo |
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
