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
