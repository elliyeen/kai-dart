# KAI Station Intelligence — Implementation Status

Last updated: 2026-11-01 · Version 0.2.0 · Branch `docs/status-readme-changelog` · Evidence below was produced by the commands shown. Nothing here is a claim about DART operations.

## Update — Park Lane 90-second guided demo (branch `feat/park-lane-auto-demo`, 2026-11-03)
Route `/stations/park-lane/demo` (GitHub Pages: `https://elliyeen.github.io/kai-dart/stations/park-lane/demo` **after merge + Pages deploy; NOT live yet**). Canonical station id `park-lane` (Red Line). Engine `src/lib/parkLaneDemo.ts` (pure, deterministic), UI `src/components/stations/ParkLaneDemo.tsx`, CTAs on `/stations` and the Park Lane station page. Elevator and kiosk are labelled hypothetical; Park Lane's real asset inventory is unverified.

Evidence (local, this branch): `npx tsc --noEmit` pass; `npm run lint` 0 errors (22 warnings, none in the new files); `npm run test:unit` 46 passed (8 new); `GITHUB_PAGES=true npm run build` ok; `npx playwright test tests/e2e/park-lane-demo.spec.ts` on desktop-1440, ipad-1024, ipad-768, mobile-430, mobile-390 = 50 passed; `station-actions`, `directory`, `pages`, `a11y-responsive`, `demo` specs on desktop-1440 + mobile-390 = 185 passed, 3 skipped. Screenshots: `docs/screenshots/park-lane/`.

| DOD | Status |
|---|---|
| 01 shareable URL, incognito, HTTP 200 | BLOCKED — not deployed until merge; local `/kai-dart/` static server only |
| 02 one-click ~90 s, 3 incidents, independent verification | PASS locally (fake-clock E2E PL-T01) |
| 03 pause/resume/next/back/restart | PASS locally |
| 04 contractor never verifies alone; reject/rework path | PASS (unit + E2E; rework is an optional toggle) |
| 05 deterministic readiness, labelled synthetic | PASS (unit) |
| 06 links work, no dead buttons | PASS locally (Get started, Capabilities, station page) |
| 07 390/768/1440, keyboard, reduced motion, axe | PASS locally (axe WCAG 2.2 AA at 5 viewports; reduced motion handled in code, not separately tested) |
| 08 unit + E2E, lint, typecheck | PASS locally; CI not yet run |
| 09 no secrets / real DART data | PASS by construction + no-external-request test; no separate built-file secret scan yet |
| 10 URL, SHA, evidence recorded | PARTIAL — SHA/URL pending push and deploy |
| 11 human sign-off | PENDING (presenter) |

Known limits: not verified in a real incognito session on the deployed URL; `/dart/stations/red/park-lane` alias and Cloudflare preview not built (out of scope per the contract, no credentials used); no real-device test.

## Update — PRs #12–#30 (read this first; older sections below are the PR #4 baseline)
**On `main` (merged 2026-11-01):** PRs #12–#30 and #32–#33 (#29 sidebar single list; #30 station actions, per-station demo, 45-item checklist + KAI loop, pilot heading; #32 architecture Enterprise Security band + per-line intelligence; #33 Platform and How It Works links removed). Docs PR #31 had merged into a stacked branch, so it lands via a rollup PR. GitHub Pages deploy status for these merges is checked separately; see the PR for the result.

| Area | Status | Evidence |
|---|---|---|
| Landing, FAQ, Get started, Checkout, Architecture | Live | Routes return 200 live; E2E + axe at 5 viewports. Checkout is non-binding; nothing is submitted or sent. Architecture scenes are cropped from the approved mock and contain DART marks: **logo permission not confirmed** |
| Station platform + per-station Report / Deploy crew / Autonomous demo | On main (#30) | `tests/e2e/station-actions.spec.ts`; deploy is simulated, Operations role only |
| 45-item inspection checklist + KAI loop + guided-demo step 3 | On main (#30) | Checklist E2E and guided-demo E2E pass. Loop is rules-based, simulated, browser-only. Four items not visible in the reference screenshots were added and are marked `(added)` in `src/lib/checklist.ts` |
| Cross-browser / device | Live | 90 cross-browser tests (11 routes × 12 widths, 320–2560 px) in Chromium, Firefox, WebKit, iPhone 14, iPad Pro 11, Pixel 7. **Not tested on real devices** |
| CI | Green on #28 | Installs Chromium, Firefox, WebKit (`.github/workflows/ci.yml`) |

Latest local totals: lint 0 errors / 19 warnings; typecheck pass; 38 unit tests; 540 Playwright tests (535 passed on the run before the final heading tweak, landing + pages re-run green after it; full re-run on the final head pending).

**Not done:** Cloudflare preview/production deploy (needs credentials + approval; GitHub Pages must not be substituted); server-side auth/RBAC, database, email sending (needs approval); Formspree contact form unverified (`NEXT_PUBLIC_FORMSPREE_ID`); Notion write-back for PRs #19–#30; legacy `/platform` dashboard still present; offline/PWA; real-device testing; Apple/robotaxi visual pass beyond the stations sidebar and pilot heading. Sample values (asset counts, loop timings, contract refs, technician IDs, scores) are labelled synthetic. No station is connected to live DART data.

**Versioning:** `package.json` is 0.2.0 (see `CHANGELOG.md`). Tag `v0.2.0` after this rollup merges and the deploy is verified; rollback steps are in `docs/RELEASE.md`.

## CI evidence
PR #4 (https://github.com/elliyeen/kai-dart/pull/4), head `8dc24f7`: GitHub Actions "Lint, Typecheck, Unit, Build, E2E, Audit" **passed** (run 41260247003, 2m57s) — includes the 163 Playwright tests on 5 viewports.

## Phase status
| Phase | Status | Evidence |
|---|---|---|
| P0 Audit/baseline | VERIFIED | `docs/baseline/stations-baseline.json` (115 original station-line records, 115 unique ids, 76 unique station names; red 26, blue 23, green 24, orange 32, silver 10). Official reconciliation in `docs/data/official-reconciliation.{md,json}` (DART GTFS V755-218-220-20261029). |
| P1 Build/lint/deps/CI | VERIFIED locally; CI pending on the PR | `npm run lint` 0 errors (14 pre-existing warnings); `tsc --noEmit` pass; `npm audit --omit=dev` → 0 vulnerabilities (next 16.4.3, nodemailer 10.3.1, audit fix); CI workflow now runs lint, typecheck, unit, audit, build, Playwright. |
| P2 Landing | VERIFIED locally; live site shows previous landing build until merge | Eight sections, CTAs → `/stations`; E2E + axe pass. |
| P3 Desktop | VERIFIED locally | `/stations` network overview + directory (76 stations, search, 5 line filters), `/stations/[id]` detail, schematic map, issue/evidence/verification. |
| P4 iPad/mobile | VERIFIED locally | Same canonical data at 1024/768/430/390; no horizontal overflow; ≥44px targets; bottom nav. |
| P5 Two-minute demo | VERIFIED locally | Guided + manual E2E: network → Akard → Operations assigns → contractor proof → inspector verifies → executive count updates → reset. Deterministic synthetic clock. |
| P6 Roles | VERIFIED (simulation) | Seven personas; permission matrix + separation of duties unit-tested. **Static simulation only — not security.** |
| P7 Test suite | VERIFIED locally | 15 unit tests, 163 Playwright tests (5 viewports × specs incl. axe WCAG 2.x A/AA + 2.2 AA). |
| P8 Release evidence | PARTIAL | Real screenshots in `docs/screenshots/release/` (18). **No preview URL / Cloudflare deploy / Notion update yet** — see Blockers. |

## Station parity (baseline vs current)
- Baseline original records: **115** (unique ids 115). Current canonical records: **115**, identical ids, names, lines, coordinates (`tests/unit/parity.test.ts`).
- Physical stations: **76** grouped by name in the app (DFW A and DFW B are separate names with identical coordinates → 75 by coordinate, matching the official 75 unique rail stations incl. Silver). Station-line memberships: 115 (official feed: 123 incl. Silver; 9 extra memberships at Deep Ellum/Baylor/Fair Park/etc. are limited-trip and not added).
- Routes: every one of the 115 original ids resolves at `/stations/<id>` (E2E). Legacy routes `/dart/*`, `/app/*`, `/platform`, `/cities` unchanged.
- **The earlier public claim "65 stations" is NOT supported** by official data (75 incl. Silver, 66 without). It was removed from public pages.
- Exceptions: Convention Center closure (Jan 5 2026) is **not confirmed** by the GTFS feed; shown as "Reported closure (unverified)". `dfw-b` Orange membership unconfirmed. Baseline coordinates equal feed coordinates exactly, so distance matching is not an independent check.

## Commands run (local, this branch)
```
npm run lint            # 0 errors, 14 warnings (pre-existing unused vars)
npm run typecheck       # pass
npm run test:unit       # 15 passed
npm audit --omit=dev    # found 0 vulnerabilities
GITHUB_PAGES=true npm run build   # pass (static export)
EXPORT_TARGET=cloudflare npm run build  # pass (root-path export; not deployed)
npm run test:e2e        # 163 passed (desktop-1440, ipad-1024, ipad-768, mobile-430, mobile-390)
npm run screenshots     # 18 real browser screenshots
```

## Blockers / needs authorization
1. **Cloudflare preview/production deploy** — needs Cloudflare account/token + approval (see `docs/RELEASE.md`). Not performed. GitHub Pages is the only live target and must not be substituted without approval.
2. **Merging the PR** — requires owner review/approval; merge triggers a public GitHub Pages deploy.
3. **Notion status update** — `notion-update-page` is blocked by this session's permission classifier; status lives here and in the PR until allowed.
4. **Real authorization** — not implemented (static site). Needs server-side OIDC/SSO+MFA, deny-by-default RBAC, scoped work orders, server-enforced separation of duties, append-only audit.
5. Unverified external facts: Convention Center closure/reopening, Silver Line operating status, DART service alerts, official fact-sheet station count.

## Residual defects / not done
- Legacy `DashboardDemo` (`/platform?tab=demo`) still contains older synthetic figures (e.g. 94.2%) bannered as demo; new `/stations` surface is the primary demo.
- `/icon` 404 under the GitHub Pages base path (pre-existing).
- Assets are not modeled: the platform shows "Asset inventory: not verified" — no fictional assets (no Akard elevator).
- Evidence images are labeled placeholders, not photographs.
- Human acceptance: not yet given.

## Next actions
1. Open/refresh PR, confirm GitHub Actions green on the PR head.
2. Owner review → merge → verify GitHub Pages deploy → re-run E2E against the live URL.
3. On approval: Cloudflare preview per `docs/RELEASE.md`; update Notion checklist with these results.

## Rollout map (feat/dfw-rollout-map)
- Landing section "Bringing stations online." + Dallas–Fort Worth base map (US Census county outlines, public domain; generated by `scripts/gen-dfw-geo.py`). Same base map now backs the `/stations` network map.
- Rollout state lives in `src/lib/stations/rollout.ts`. **0 stations connected**; Akard is the single synthetic demo station. A station can only be marked `connected` with evidence (source, connection date, authorizing party) — enforced by a unit test.
- Tests: 19 unit, 168 Playwright (incl. rollout legend/count/dot assertions and axe on all viewports).
