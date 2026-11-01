export type Role = "executive" | "operations" | "stationManager" | "inspector" | "contractor" | "security" | "admin";

export interface Persona { role: Role; label: string; identity: string; blurb: string; primaryAction: string }

// Identities are SYNTHETIC demo personas. Distinct identities are what make separation of duties testable.
export const PERSONAS: Persona[] = [
  { role: "executive",      label: "Executive",          identity: "demo.exec",       blurb: "Network-wide read-only view of risk and verified outcomes.", primaryAction: "Review priorities" },
  { role: "operations",     label: "Operations Command", identity: "demo.ops",        blurb: "Triage, assign and escalate work. Cannot verify work.",       primaryAction: "Assign Work" },
  { role: "stationManager", label: "Station Manager",    identity: "demo.manager",    blurb: "Reports and coordinates issues for assigned stations.",       primaryAction: "Coordinate Issue" },
  { role: "inspector",      label: "Field Inspector",    identity: "demo.inspector",  blurb: "Independently verifies or rejects submitted proof.",          primaryAction: "Verify / Reject" },
  { role: "contractor",     label: "Contractor / Crew",  identity: "demo.crew-a",     blurb: "Sees only assigned work orders and submits proof.",           primaryAction: "Submit Proof" },
  { role: "security",       label: "Security / Compliance", identity: "demo.security", blurb: "Scoped read of audit and access events.",                    primaryAction: "Review Audit" },
  { role: "admin",          label: "Platform Admin",     identity: "demo.admin",      blurb: "Manages roles and station scopes. No operational sign-off.",  primaryAction: "Manage Access" },
];
export const PERSONA_BY_ROLE = Object.fromEntries(PERSONAS.map((p) => [p.role, p])) as Record<Role, Persona>;
