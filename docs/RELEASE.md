# Release, preview and rollback

## Build targets
| Target | Command | Output | Notes |
|---|---|---|---|
| GitHub Pages (current prod) | `GITHUB_PAGES=true npm run build` | `out/` under `/kai-dart` | Deployed by `.github/workflows/pages.yml` on push to `main` |
| Cloudflare Pages preview | `EXPORT_TARGET=cloudflare npm run build` | `out/` at site root | **Not deployed — requires Cloudflare credentials and approval** |
| Docker | `npm run build` | `.next/standalone` | Existing `Dockerfile` |

## Cloudflare preview (needs authorization — not yet performed)
1. Owner supplies/approves a Cloudflare account + API token (Pages:Edit) as a GitHub/Cloudflare secret. No tokens are stored in the repo.
2. `EXPORT_TARGET=cloudflare npm run build && npx wrangler pages deploy out --project-name kai-dart --branch preview`
3. Verify the preview URL with `npm run test:e2e` pointed at it (set `baseURL`), then request production approval.

## Rollback
- GitHub Pages: `git revert -m 1 <merge-commit>` on `main` and push (via PR); the Pages workflow redeploys the previous content. Or re-run the Pages workflow on the last known-good commit (`workflow_dispatch` after checking it out as a branch).
- Cloudflare Pages: promote the previous deployment in the dashboard, or `wrangler pages deployment list` / redeploy the prior commit.
- The legacy dashboard remains at `/platform` and is untouched by the new `/stations` surface.

## Security boundary (important)
The public site is a **static, synthetic demonstration**. Role switching is a simulation; hiding buttons is not access control.
Real use requires server-side authentication (OIDC/SSO + MFA), deny-by-default RBAC with station/work-order scope, separation of duties
(`verifier ≠ submitter`, enforced server-side), and an append-only audit log. The permission matrix and rules are specified and unit-tested in
`src/lib/demo/permissions.ts` / `tests/unit/workflow.test.ts` so they can be reused as the server-side policy.

## Versioning and tags
- Semantic version in `package.json` (and `package-lock.json`); history in `CHANGELOG.md`. Bump the minor version when a set of PRs reaches `main`.
- Tag the merge commit after the Pages deploy is green and the live routes are checked: `git tag -a v0.2.0 -m "KAI x DART 0.2.0" <merge-commit> && git push origin v0.2.0`.
- Stacked PRs: merging a PR into its parent branch does **not** put it on `main`. Confirm with `git log origin/main` or open a rollup PR into `main` (as #28 did).

## CI
`.github/workflows/ci.yml` installs Chromium, Firefox and WebKit (`npx playwright install --with-deps chromium firefox webkit`); the cross-browser project in `playwright.config.ts` fails without them. A full run takes about 14 minutes.
