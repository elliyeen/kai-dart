# KAI Station Intelligence — Claude Code Project Instructions

## Mission
Finish the existing Elliyeen KAI × DART Station Intelligence product end to end. Deliver a working, premium landing page, desktop, iPad, and mobile platform, with the complete station directory and an independently verified issue-resolution demo. **Execute implementation, not merely planning.** Never claim completion without evidence.

## Authoritative context
- Product/implementation: https://app.notion.com/p/40abfb540ff3819cb69bf519dded60fb
- Landing-page specification: https://app.notion.com/p/40bbfb540ff3819497d3d950289dfc96
- GitHub code and CI: https://github.com/elliyeen/kai-dart
- Existing landing PR #2 was merged; inspect latest main and verify actual CI/deployment before assuming completion.
- Notion = product requirements and status; GitHub = source code, tests, pull requests, deployment evidence.
- Read both Notion pages via available integration at start and when requirements change. If unavailable, report the precise blocker and proceed only with unambiguous repo-grounded work.

## Operating rules
1. Inspect the repository, existing routes/data/components, current branch, uncommitted changes, tests, and CI before modifying anything. Never overwrite or discard user work.
2. Create/maintain `IMPLEMENTATION_STATUS.md` with phase, next actionable task, blockers, actual commands/results, commits/PRs, screenshots and preview URLs. Resume from the latest verified checkpoint after interruption.
3. Work in small, testable changes; commit progress on a feature branch, use PRs and required reviews. Do not directly force-push, bypass branch protection, or merge without required approval.
4. Run lint, typecheck, build and relevant tests after each meaningful change. Diagnose failures and repair; retry within reasonable bounds. If blocked, record exact failure and continue other independent tasks.
5. Delegate parallel independent tasks to supported subagents/workflows when useful. Never assume a VS Code session continues running after shutdown. A persistent cloud runner must be separately configured and verified.
6. Never fabricate data, DART endorsement/integrations, live status, performance metrics, security certifications, screenshots, tests, or deployment success.
7. Keep synthetic demo data visibly labeled; use approved DART images, a premium light design, accessible components and no World Cup/FIFA/AT&T Stadium campaign copy.
8. Production deployment, external credential changes, significant spend and sensitive security changes require explicit approval. Prefer authorized Cloudflare preview deployment when architecture supports it.

## Work queue — execute in dependency order
- P0: Audit latest main, merged PR #2, station dataset and route parity, mobile nav, lint, build, security advisories, CI and deployed preview. Establish accurate baseline.
- P1: Fix build/lint/navigation/dependency defects and create reusable design foundations.
- P2: Complete functional responsive landing page and link to platform/demo.
- P3: Deliver premium desktop network overview, full searchable station directory, Red/Blue/Green/Orange/Silver filters, station details, maps, issues, assets, evidence and verification.
- P4: Deliver full-featured iPad and mobile UI at 1024/768/430/390, sharing the same canonical station records. Preserve every original station ID and station-line association; verify with official DART data and parity tests.
- P5: Implement deterministic two-minute synthetic demo: network → Akard → cleanliness issue → Operations assigns → contractor submits proof → independent inspector approves/rejects → executive view updates → Reset Demo.
- P6: Implement role-aware experiences for Executive, Operations, Station Manager, Inspector, Contractor/Crew, Security/Compliance and Admin. Static role switcher is only a simulation; real authorization must be server-side deny-by-default with scopes and separation of duties.
- P7: Run passing lint, typecheck, production build, Playwright E2E, accessibility, station parity, all five line filters, mobile, role and demo reset tests; audit dependencies and document any approved risk.
- P8: Produce actual desktop/iPad/mobile screenshots, verified preview URLs, green GitHub Actions, rollback instructions, and release acceptance evidence. Update Notion with real status.

## Definition of done
Do not mark complete until landing, desktop, iPad and mobile all work; original stations are preserved; all five filters work; demo completes end to end and resets; tests and CI pass; working preview is accessible; status and evidence are recorded in GitHub and Notion. Report blockers explicitly rather than presenting a plan as a finished product.

## Commercial direction
Target Infrastructure Service Intelligence: station/shelter quality, contractor accountability and independently verified outcomes. Complement existing DART systems (including Maximo), rather than claiming they lack work-order or inspection capabilities.

## First action each session
Read `CLAUDE.md` and `IMPLEMENTATION_STATUS.md` if present, inspect GitHub/Notion current state, choose the next unfinished acceptance criterion, **implement and test it**, update checkpoint, and continue.

## Mandatory approved-design fidelity gate
Before any UI work, read [docs/DESIGN_TO_PRODUCTION_FIDELITY.md](docs/DESIGN_TO_PRODUCTION_FIDELITY.md) and the current KAI Notion spec. The approved mockup is a visual contract, not inspiration. Implement with the existing Next.js/React/TypeScript/Tailwind/SVG stack; run screenshot comparison and iterate. Never claim visual completion without the actual approved image, rendered comparison evidence and explicit user sign-off. This gate applies to /architecture, /get-started and /checkout. Do not mark production complete without authorized deployment and live verification.
