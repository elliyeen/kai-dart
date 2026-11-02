# DART GitHub Governance and Private Engineering Setup

## Repository separation
- Public: `elliyeen/kai-dart` — approved marketing, synthetic demo, external-facing docs.
- Private (owner must create first): `elliyeen/kai-dart-internal` — engineering harness, roadmaps, financial models, station/sensor integrations and security test evidence.
- [Boundary and controlled publishing](docs/PUBLIC_PRIVATE_REPOSITORY_BOUNDARY.md) is mandatory before introducing real station datasets.

## Non-negotiable guardrails
1. Do not commit internal engineering documents, sensitive data, video recordings, customer-specific connection settings, personal information or credentials into the public repository.
2. Before any future DART deployment, require confirmed station scope, authorized data sharing, secure video privacy policies, security architecture review, performance acceptance tests and written customer signoff.
3. Keep the current synthetic demo clearly labeled. Never represent simulations as real operational DART feeds.
4. Route all changes through reviewed PRs, CI and explicit human approval for production and public releases.

## Agent handoff
On each session: read `CLAUDE.md`, `IMPLEMENTATION_STATUS.md` and `docs/PUBLIC_PRIVATE_REPOSITORY_BOUNDARY.md`; inspect actual CI and open issues; select next verified incomplete criterion; implement and test; record evidence. Do not claim automated protections are enabled without checking GitHub settings.

## Private repository starter checklist
- [ ] Create `elliyeen/kai-dart-internal` as Private with README and default branch `main`.
- [ ] Confirm Claude Code and GitHub integrations can access private repository.
- [ ] Configure branch rules requiring PR and CI; secret scanning/push protection; CODEOWNERS as supported.
- [ ] Add six-month pilot roadmap, milestone acceptance criteria and decision gates.
- [ ] Add risk register: privacy, safety, station availability, network, sensors, video inference, vendor interface, procurement, cybersecurity, changes and schedule.
- [ ] Add horizontal architecture/ontology/data lineage documentation and testable integrations.
- [ ] Add private CI, harness verification, rollback and evidence templates.
- [ ] Audit public repository history for private or sensitive content.
- [ ] Only publish sanitized approved artifacts back to the public repository via separate PR.

## Pilot acceptance sequence
1. Baseline and data/access authorization (month 1).
2. Station assessment, equipment/integration and deployment planning (months 1–2).
3. Instrument and validate first station with synthetic fallbacks (months 2–3).
4. Operational trial, proof-of-fix workflow, security/privacy testing and midpoint review (months 3–4).
5. Expand to approved stations, measure SLAs and refine operations (months 4–5).
6. Independent evaluation, handover, executive report and renewal decision (month 6).

Schedule is **proposed**, contingent on procurement, physical access, video/privacy approvals, sensor availability and DART authorization. Do not promise all stations will be operational within this period before scope and dependencies are confirmed.
