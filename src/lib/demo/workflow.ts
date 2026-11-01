import { authorize } from "./permissions";
import { PERSONA_BY_ROLE, type Role } from "./roles";

export type WoStatus = "reported" | "assigned" | "awaiting_verification" | "verified";

export interface AuditEvent { seq: number; at: string; actor: string; role: Role | "system"; action: string; note: string }
export interface WorkOrder {
  id: string;
  stationKey: string;
  title: string;
  status: WoStatus;
  assignedTo: string | null;
  submittedBy: string | null;
  verifiedBy: string | null;
  rejections: number;
  events: AuditEvent[];
}
export interface DemoState { role: Role; wo: WorkOrder; guideStep: number }

// Deterministic synthetic clock: every event advances 7 minutes from a fixed base. No real time is used.
const BASE = Date.UTC(2026, 10, 2, 9, 0, 0);
const at = (seq: number) => new Date(BASE + seq * 7 * 60_000).toISOString().replace(".000Z", "Z");

export const DEMO_STATION = "akard";
export const CONTRACTOR_ID = PERSONA_BY_ROLE.contractor.identity;

export function initialState(): DemoState {
  return {
    role: "executive",
    guideStep: 0,
    wo: {
      id: "WO-DEMO-001",
      stationKey: DEMO_STATION,
      title: "Platform cleanliness overdue (SYNTHETIC)",
      status: "reported",
      assignedTo: null,
      submittedBy: null,
      verifiedBy: null,
      rejections: 0,
      events: [{ seq: 1, at: at(1), actor: "system", role: "system", action: "reported", note: "Synthetic observation: platform cleaning overdue. Evidence photo is a placeholder." }],
    },
  };
}

export type Cmd =
  | { type: "setRole"; role: Role }
  | { type: "assign" }
  | { type: "submitProof" }
  | { type: "verify" }
  | { type: "reject" }
  | { type: "reset" }
  | { type: "guide"; step: number };

export interface Result { state: DemoState; error?: string }

const push = (s: DemoState, role: Role, action: string, note: string): AuditEvent[] => {
  const seq = s.wo.events.length + 1;
  return [...s.wo.events, { seq, at: at(seq), actor: PERSONA_BY_ROLE[role].identity, role, action, note }];
};

export function reduce(s: DemoState, cmd: Cmd): Result {
  const role = s.role;
  const actorId = PERSONA_BY_ROLE[role].identity;
  const ctx = { stationKey: s.wo.stationKey, actorId, assignedTo: s.wo.assignedTo, submittedBy: s.wo.submittedBy };
  const fail = (error: string): Result => ({ state: s, error });

  switch (cmd.type) {
    case "setRole": return { state: { ...s, role: cmd.role } };
    case "reset": return { state: initialState() };
    case "guide": return { state: { ...s, guideStep: cmd.step } };
    case "assign": {
      const d = authorize(role, "assign_work", ctx);
      if (!d.allowed) return fail(d.reason);
      if (s.wo.status !== "reported" && !(s.wo.status === "assigned")) return fail(`cannot assign from ${s.wo.status}`);
      return { state: { ...s, wo: { ...s.wo, status: "assigned", assignedTo: CONTRACTOR_ID, events: push(s, role, "assigned", `Assigned to ${CONTRACTOR_ID} (synthetic crew). No real dispatch occurred.`) } } };
    }
    case "submitProof": {
      const d = authorize(role, "submit_proof", ctx);
      if (!d.allowed) return fail(d.reason);
      if (s.wo.status !== "assigned") return fail(`cannot submit proof from ${s.wo.status}`);
      return { state: { ...s, wo: { ...s.wo, status: "awaiting_verification", submittedBy: actorId, events: push(s, role, "proof_submitted", "Completion proof (synthetic photo) submitted. Awaiting independent verification — not yet verified.") } } };
    }
    case "verify": {
      const d = authorize(role, "verify_work", ctx);
      if (!d.allowed) return fail(d.reason);
      if (s.wo.status !== "awaiting_verification") return fail(`cannot verify from ${s.wo.status}`);
      return { state: { ...s, wo: { ...s.wo, status: "verified", verifiedBy: actorId, events: push(s, role, "verified", "Independent inspector accepted the evidence. Verified resolved (synthetic).") } } };
    }
    case "reject": {
      const d = authorize(role, "reject_work", ctx);
      if (!d.allowed) return fail(d.reason);
      if (s.wo.status !== "awaiting_verification") return fail(`cannot reject from ${s.wo.status}`);
      return { state: { ...s, wo: { ...s.wo, status: "assigned", submittedBy: null, rejections: s.wo.rejections + 1, events: push(s, role, "rejected", "Inspector rejected the proof; returned to the crew.") } } };
    }
  }
}

export const STATUS_COPY: Record<WoStatus, string> = {
  reported: "Reported — unassigned",
  assigned: "Assigned — work in progress",
  awaiting_verification: "Awaiting independent verification",
  verified: "Verified resolved",
};
