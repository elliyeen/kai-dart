# KAI Station Intelligence — Implementation Status

Last updated: 2026-11-01 · Branch `feat/platform-redesign` · Evidence below was produced by the commands shown. Nothing here is a claim about DART operations.

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
