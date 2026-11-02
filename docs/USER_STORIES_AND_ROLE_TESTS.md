# KAI Station Intelligence — user stories, roles and permission test scenarios

Status: **demo simulation.** The account menu at the bottom of the sidebar switches between seven synthetic demo accounts. It is not sign-in and not access control. Production must authenticate through the customer's identity provider and enforce every rule below **on the server, deny by default**. Identities, stations and work orders are synthetic.

Source of truth in code: `src/lib/demo/roles.ts` (accounts), `src/lib/demo/permissions.ts` (matrix, scope, separation of duties), `tests/unit/workflow.test.ts`, `tests/e2e/roles.spec.ts`.

## 1. Accounts and permissions

| Account (identity) | Allowed actions | Scope and limits |
|---|---|---|
| Executive (`demo.exec`) | view network, view station, view work order | Read-only. No assign, proof, verify or report. |
| Operations Command (`demo.ops`) | view network/station/work order, report issue, coordinate issue, assign work | Cannot verify or reject work. |
| Station Manager (`demo.manager`) | view network/station/work order, report issue, coordinate issue | Only stations in their scope (Akard, St. Paul, Pearl, West End in the demo). Cannot assign or verify. |
| Field Inspector (`demo.inspector`) | view network/station/work order, report issue, verify work, reject work | Cannot verify work they submitted themselves (separation of duties). Cannot assign. |
| Contractor / Crew (`demo.crew-a`) | view work order, submit proof | Only work assigned to them. No network view. |
| Security / Compliance (`demo.security`) | view audit, view network | Read-only. No work-order actions. |
| Platform Admin (`demo.admin`) | manage access | No operational sign-off: cannot assign, submit, verify or reject. |

Cross-cutting rules: every state change writes an audit entry (who, role, action, record, input, output, owner). Switching account is itself audited (`switch_account`). Verification is independent of the person or crew who did the work.

## 2. User stories

Format: As a *role*, I want *capability*, so that *outcome*. Each story lists acceptance criteria and a test id from section 3.

**Executive**
- E1. As an Executive, I want a network-wide view of station condition and verified outcomes, so that I can prioritise without opening every station. *AC: network and station pages load; no action buttons for assign, proof or verify. Tests R-01, R-02.*
- E2. As an Executive, I want to see when an issue becomes verified resolved, so that I trust the number. *AC: after the inspector verifies, the network view reflects it. Test W-01.*

**Operations Command**
- O1. As Operations, I want to assign a reported issue to a contractor, so that work starts. *AC: Assign is available only while status is reported/assigned; creates an audit event. Tests W-01, R-03.*
- O2. As Operations, I must not verify work, so that nobody signs off their own dispatch. *AC: verify/reject unavailable and denied by the rules. Test R-04.*
- O3. As Operations, I want to deploy a crew or report an issue from a station page. *AC: available to Operations only; disabled with a hint for others. Test R-05.*

**Station Manager**
- M1. As a Station Manager, I want my own stations listed, so that I coordinate what I own. *AC: Inspections page lists the scoped stations. Test R-06.*
- M2. As a Station Manager, I must not act on stations outside my scope. *AC: authorize() denies out-of-scope stations. Test U-03.*

**Field Inspector**
- I1. As an Inspector, I want to verify or reject submitted proof, so that "done" is independently confirmed. *AC: Verify/Reject appear only at awaiting verification; reject returns work to the crew. Tests W-01, W-02.*
- I2. As an Inspector, I must not verify work I submitted. *AC: separation-of-duties denial. Test U-05.*
- I3. As an Inspector, I want to run the 45-item station checklist. *AC: submit enabled at 80% (36 items). Covered by checklist specs.*

**Contractor / Crew**
- C1. As a Contractor, I want to see only work assigned to me, so that I do not see other vendors' work. *AC: empty state before assignment; work order visible after. Tests R-07, W-01.*
- C2. As a Contractor, I want to submit proof of completion, so that the inspector can verify. *AC: status moves to awaiting verification, not verified. Test W-01.*
- C3. As a Contractor, I must not verify my own work. *AC: no verify action offered. Test U-05.*

**Security / Compliance**
- S1. As Security, I want a read-only audit trail of sign-ins, account switches and work-order events. *AC: Inspections page shows the audit timeline; Audit log lists `sign_in` and `switch_account`. Tests R-08, A-01.*
- S2. As Security, I must not change work orders. *AC: no work-order actions. Test U-02.*

**Platform Admin**
- P1. As an Admin, I want to see roles and scopes, so that I can review who can do what. *AC: roles table matches the matrix. Test R-09.*
- P2. As an Admin, I must not sign off work. *AC: no operational actions. Test U-02.*

**Everyone (demo)**
- D1. As a demo presenter, I want to switch account from the account menu at the bottom of the sidebar, so that I can show each role's view. *AC: menu lists 7 accounts with the current one checked, shows "Simulation only", closes on Escape or outside click, and logs `switch_account`. Test A-02.*
- D2. As a presenter, I want to reset the demo, so that I can run it again from a known state. *AC: Reset demo returns to Executive and the initial work order. Test A-03.*

## 3. Test scenarios

Types: **U** unit (`tests/unit/workflow.test.ts`), **R** role view (e2e), **W** workflow (e2e), **A** account menu / audit (e2e). Pass criteria are exact; all data is synthetic.

| ID | Role(s) | Steps | Expected |
|---|---|---|---|
| U-01 | all | Evaluate every role × action pair outside the matrix | Denied (deny by default) |
| U-02 | Executive, Admin, Security | Attempt assign, submit, verify | Denied |
| U-03 | Station Manager | Act on a station outside scope | Denied: "outside this manager's scope" |
| U-04 | Contractor | Act on a work order assigned to someone else | Denied |
| U-05 | Inspector or Contractor | Verify work where actor = submitter | Denied: separation of duties |
| R-01 | Executive | Open /stations | Network loads; no assign/proof/verify controls |
| R-02 | Executive | Open Inspections | Read-only message shown |
| R-03 | Operations | Open Akard | Assign available while status is reported |
| R-04 | Operations | At awaiting verification | No verify or reject action |
| R-05 | Operations vs others | Open a station page | Deploy crew / Report an issue enabled for Operations only |
| R-06 | Station Manager | Open Inspections | Lists the four scoped stations |
| R-07 | Contractor | Open Inspections before assignment | Empty state: "No work orders are assigned to you" |
| R-08 | Security | Open Inspections | Audit timeline shown; no work-order actions |
| R-09 | Admin | Open Inspections | Roles table lists all seven roles and their actions |
| W-01 | Operations → Contractor → Inspector → Executive | Assign, submit proof, verify, view network | reported → assigned → awaiting verification → verified; four audit events with the right actors |
| W-02 | Inspector → Contractor | Reject proof | Returns to assigned; rejection count 1 |
| A-01 | Security | Open Audit log after a sign-in | `sign_in` row present |
| A-02 | any | Open account menu, choose Field Inspector | Seven options, one checked; name changes; `switch_account` row logged |
| A-03 | any | Account menu → Reset demo | Role Executive; work order back to reported |

Automation status: U-01 to U-05 and the workflow transitions behind W-01/W-02 are unit tests. R-02, R-06, R-07, R-08, R-09, A-02 and A-03 are Playwright tests in `tests/e2e/roles.spec.ts` and `tests/e2e/directory.spec.ts`. R-01, R-03, R-04, R-05, A-01 and the full UI path of W-01/W-02 across accounts are not yet written as role-specific e2e tests; treat them as manual until they are.

## 4. Not yet covered (production requirements)

Real authentication and sessions (SSO/OIDC), server-side authorization with deny by default, per-station scopes stored in a database, tamper-evident append-only audit log, session timeout and MFA, access reviews, and automated tests against those. None of this exists in the demo.
