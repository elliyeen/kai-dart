import { describe, expect, it } from "vitest";
import { ALL_ACTIONS, ROLE_MATRIX, authorize } from "@/lib/demo/permissions";
import { PERSONAS, PERSONA_BY_ROLE, type Role } from "@/lib/demo/roles";
import { initialState, reduce, type Cmd, type DemoState } from "@/lib/demo/workflow";

const as = (s: DemoState, role: Role): DemoState => reduce(s, { type: "setRole", role }).state;
const run = (s: DemoState, role: Role, cmd: Cmd) => reduce(as(s, role), cmd);

describe("permission matrix", () => {
  it("denies by default: every role/action pair outside the matrix is denied", () => {
    for (const p of PERSONAS)
      for (const a of ALL_ACTIONS) {
        const ctx = { actorId: p.identity, assignedTo: p.identity, stationKey: "akard" };
        expect(authorize(p.role, a, ctx).allowed).toBe(ROLE_MATRIX[p.role].includes(a));
      }
  });
  it("executive is read-only; admin has no operational sign-off", () => {
    for (const a of ["assign_work", "submit_proof", "verify_work", "reject_work"] as const) {
      expect(authorize("executive", a).allowed).toBe(false);
      expect(authorize("admin", a).allowed).toBe(false);
    }
  });
  it("station manager is limited to scoped stations", () => {
    expect(authorize("stationManager", "coordinate_issue", { stationKey: "akard" }).allowed).toBe(true);
    expect(authorize("stationManager", "coordinate_issue", { stationKey: "westmoreland" }).allowed).toBe(false);
  });
  it("contractor can only act on work assigned to them", () => {
    expect(authorize("contractor", "submit_proof", { actorId: "demo.crew-a", assignedTo: "demo.crew-a" }).allowed).toBe(true);
    expect(authorize("contractor", "submit_proof", { actorId: "demo.crew-a", assignedTo: "demo.crew-b" }).allowed).toBe(false);
    expect(authorize("contractor", "submit_proof", { actorId: "demo.crew-a", assignedTo: null }).allowed).toBe(false);
    expect(authorize("contractor", "verify_work", { actorId: "demo.crew-a", assignedTo: "demo.crew-a" }).allowed).toBe(false);
  });
  it("separation of duties: a verifier may not be the submitter", () => {
    expect(authorize("inspector", "verify_work", { actorId: "x", submittedBy: "x" }).allowed).toBe(false);
    expect(authorize("inspector", "verify_work", { actorId: "demo.inspector", submittedBy: "demo.crew-a" }).allowed).toBe(true);
  });
});

describe("work-order state machine", () => {
  it("runs reported → assigned → awaiting verification → verified with the right roles", () => {
    let s = initialState();
    expect(s.wo.status).toBe("reported");
    let r = run(s, "operations", { type: "assign" }); expect(r.error).toBeUndefined(); s = r.state;
    expect(s.wo.status).toBe("assigned");
    r = run(s, "contractor", { type: "submitProof" }); s = r.state;
    expect(s.wo.status).toBe("awaiting_verification");
    expect(s.wo.verifiedBy).toBeNull(); // self-reported completion is NOT verification
    r = run(s, "inspector", { type: "verify" }); s = r.state;
    expect(s.wo.status).toBe("verified");
    expect(s.wo.verifiedBy).toBe(PERSONA_BY_ROLE.inspector.identity);
    expect(s.wo.verifiedBy).not.toBe(s.wo.submittedBy);
    expect(s.wo.events.map((e) => e.action)).toEqual(["reported", "assigned", "proof_submitted", "verified"]);
  });
  it("blocks illegal transitions and illegal actors", () => {
    let s = initialState();
    expect(run(s, "contractor", { type: "submitProof" }).error).toBeTruthy(); // unassigned
    expect(run(s, "executive", { type: "assign" }).error).toBeTruthy();
    expect(run(s, "inspector", { type: "verify" }).error).toBeTruthy(); // nothing submitted
    s = run(s, "operations", { type: "assign" }).state;
    expect(run(s, "contractor", { type: "verify" }).error).toBeTruthy(); // contractor cannot self-verify
    expect(run(s, "admin", { type: "verify" }).error).toBeTruthy(); // admin cannot sign off
    expect(run(s, "operations", { type: "verify" }).error).toBeTruthy();
  });
  it("rejection returns the work to the crew and is counted", () => {
    let s = initialState();
    s = run(s, "operations", { type: "assign" }).state;
    s = run(s, "contractor", { type: "submitProof" }).state;
    s = run(s, "inspector", { type: "reject" }).state;
    expect(s.wo.status).toBe("assigned");
    expect(s.wo.rejections).toBe(1);
    expect(s.wo.events.at(-1)?.action).toBe("rejected");
  });
  it("reset restores the exact initial state, and the run is deterministic", () => {
    const a = run(initialState(), "operations", { type: "assign" }).state;
    expect(reduce(a, { type: "reset" }).state).toEqual(initialState());
    expect(run(initialState(), "operations", { type: "assign" }).state).toEqual(a);
  });
});
