# Public / Private Repository Boundary

**Status:** This public repository remains the customer-facing demonstration. Internal repository `elliyeen/kai-dart-internal` is **not yet confirmed created**. Do not treat it as operational until GitHub visibility and access are verified.

## Public repository: `elliyeen/kai-dart`

Allowed: approved landing pages, synthetic station examples, public documentation, non-sensitive conceptual architecture diagrams, accessible design system, and test fixtures with demonstrably synthetic data.

Not allowed: real DART footage, identifiable rider/employee information, raw station security details, internal vendor assessments, credentials, tokens, production connection strings, internal cost/procurement strategy, undisclosed system weaknesses, and sensitive sensor configurations.

All public documentation must disclose that the current demo uses synthetic data and does not imply a DART integration, endorsement or live operational coverage.

## Internal repository: `elliyeen/kai-dart-internal`

Create as **Private** under owner `elliyeen`, initialize `main` with README, then explicitly grant GitHub App/Claude Code access to that repository only as necessary.

Planned content:
- `docs/roadmap/` — six-month paid pilot plan, with expansion options beyond pilot; gated milestones and owner signoffs
- `docs/risks/` — risk register, mitigations, contingency, decision log, change control
- `docs/architecture/` — horizontal 2D architecture maps with labeled trust boundaries, interfaces, data lineage and feedback loops
- `integrations/` — approved sensor, CMMS and station data adapters and contract tests
- `video/` — model/evaluation code and privacy-aware validation rules; **never raw footage**
- `security/` — threat models, privacy requirements, RBAC, retention and incident response
- `harness/` — autonomous agent specification, task verification, audit evidence, controls
- `tests/` — automated unit/integration/e2e/security/acceptance tests
- `ops/` — deployment runbooks, rollback, monitoring and acceptance evidence

Neither repository is an appropriate storage location for credentials, raw identifiable video, confidential DART documents supplied under an agreement, or regulated data. Use approved encrypted storage with RBAC and retention controls.

## Publishing protocol

1. Author and test internal implementation in the private repository.
2. Create a specific, sanitized public-export change; never mirror the entire internal directory or full git history.
3. Review for secret leakage, personally identifying information, nonpublic station/system details, intellectual-property restrictions, and DART branding or contractual approvals.
4. Validate synthetic data labels, tests, accessibility, screenshots against approved mockups, and build.
5. Require human signoff for release; publish through a reviewed PR in the public repository.
6. Record approver, source revision, files released, test evidence, and deployment URL.
7. Roll back on any disclosure or regression and follow incident response procedures.

**Do not set up an automatic private-to-public push** without an enforced allowlist and human approval.

## Required controls before production

- Require PR reviews, passing checks, no force pushes or deletions on `main`, and CODEOWNERS review where supported.
- Enable secret scanning and push protection where supported; verify licensing/plan.
- Use least-privilege short-lived credentials (OIDC where available); separate staging from production.
- Fail closed on missing approval, unverified evidence, or non-synthetic data in the public export.
- Keep sensor/video processing and models on approved private infrastructure, not GitHub Pages.
- Maintain a documented baseline, threat model, privacy impact assessment, audit logs, and data retention/deletion plan.

These are **requirements to configure and verify**, not claims that settings are currently enabled.

## Handoff and immediate next actions

1. Repository owner creates private `elliyeen/kai-dart-internal` using https://github.com/new.
2. Verify private visibility and authorized access, including Claude Code runner.
3. Populate private README, roadmap, risk register, architecture and engineering gate documents.
4. Audit public repository for accidental disclosure before adding new integrations or actual station data.
5. Run existing CI without bypassing approved design and deployment gates.

**Source of truth:** Notion for requirements and decision history; private GitHub for engineering source/tests/security evidence; public GitHub for approved demonstrations. All official DART datasets and contracts require validation and authorization.
