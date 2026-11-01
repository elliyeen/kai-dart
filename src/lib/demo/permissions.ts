import type { Role } from "./roles";

export type Action =
  | "view_network" | "view_station" | "report_issue" | "coordinate_issue" | "assign_work"
  | "view_work_order" | "submit_proof" | "verify_work" | "reject_work" | "view_audit" | "manage_access";

export interface Ctx {
  stationKey?: string;
  /** Identity of the user attempting the action. */
  actorId?: string;
  /** Identity the work order is assigned to (for contractor scope). */
  assignedTo?: string | null;
  /** Identity that submitted completion proof (for separation of duties). */
  submittedBy?: string | null;
}

// DEMO ONLY: a static simulation. Real authorization MUST be enforced server-side, deny-by-default.
const MATRIX: Record<Role, Action[]> = {
  executive:      ["view_network", "view_station", "view_work_order"],
  operations:     ["view_network", "view_station", "view_work_order", "assign_work", "coordinate_issue", "report_issue"],
  stationManager: ["view_network", "view_station", "view_work_order", "report_issue", "coordinate_issue"],
  inspector:      ["view_network", "view_station", "view_work_order", "verify_work", "reject_work", "report_issue"],
  contractor:     ["view_work_order", "submit_proof"],
  security:       ["view_audit", "view_network"],
  admin:          ["manage_access"],
};

// Synthetic station scope for the Station Manager persona.
export const MANAGER_SCOPE = ["akard", "st-paul", "pearl", "west-end-r"];

export interface Decision { allowed: boolean; reason: string }
const deny = (reason: string): Decision => ({ allowed: false, reason });

export function authorize(role: Role, action: Action, ctx: Ctx = {}): Decision {
  if (!MATRIX[role].includes(action)) return deny(`${role} is not permitted to ${action}`);

  if (role === "stationManager" && ctx.stationKey && !MANAGER_SCOPE.includes(ctx.stationKey))
    return deny("station is outside this manager's scope");

  if (role === "contractor") {
    if (!ctx.assignedTo || ctx.assignedTo !== ctx.actorId) return deny("work order is not assigned to this contractor");
  }

  if ((action === "verify_work" || action === "reject_work") && ctx.submittedBy && ctx.submittedBy === ctx.actorId)
    return deny("separation of duties: the verifier cannot be the person who submitted the work");

  return { allowed: true, reason: "allowed" };
}

export const can = (role: Role, action: Action, ctx?: Ctx) => authorize(role, action, ctx).allowed;
export const ALL_ACTIONS = Object.values(MATRIX).flat().filter((a, i, arr) => arr.indexOf(a) === i) as Action[];
export const ROLE_MATRIX = MATRIX;
