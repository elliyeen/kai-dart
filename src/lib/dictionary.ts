/** What KAI records, where each record comes from (input), what consumes it (output) and who owns it. Mirrors docs/db/schema.sql. */
export interface DictEntry { entity: string; table: string; input: string; output: string; owner: string }
export const DATA_DICTIONARY: DictEntry[] = [
  { entity: "Station", table: "stations", input: "DART public schedule feed (stop IDs, coordinates) and station pages (addresses)", output: "Directory, maps, readiness roll-ups, pilot rollout", owner: "Platform Admin" },
  { entity: "Asset", table: "assets", input: "Asset inventory import; changes from inspections and work orders", output: "Asset dashboards, readiness score, inventory register", owner: "Facilities Maintenance" },
  { entity: "Ticket", table: "tickets", input: "Report-issue form, inspector findings, camera and sensor alerts", output: "Issues log, work orders, executive view", owner: "Operations Command" },
  { entity: "Work order", table: "work_orders", input: "Ticket assigned by Operations; sync with the work-order system of record", output: "Crew queue, proof submission, verification queue", owner: "Operations Command" },
  { entity: "Contract and provider", table: "providers, contracts", input: "DART contract register: holder, scope, response and resolution targets", output: "Dispatch routing, SLA tracking, contractor accountability", owner: "Operations Command" },
  { entity: "Field personnel", table: "technicians", input: "Provider rosters; each technician's acknowledgment, site check-in and completion taps on their device", output: "Who is on site now, response times", owner: "Contractor / Crew" },
  { entity: "Stage event (timing)", table: "ticket_stage_events", input: "Timestamp for every stage change, including waiting on parts", output: "Time per stage, time to fix by asset type, SLA reports", owner: "Operations Command" },
  { entity: "Proof of work", table: "proofs", input: "Technician confirmation on their device; photo and notes optional", output: "Inspector review, audit trail", owner: "Contractor / Crew" },
  { entity: "Inspection", table: "inspections", input: "48-item checklist, photos, inspector identity", output: "Verified-resolved status, readiness score", owner: "Field Inspector" },
  { entity: "Readiness score", table: "readiness_scores", input: "Open tickets, asset condition, recent inspection results", output: "Command Center, station dashboards, intelligence engine", owner: "Station Manager" },
  { entity: "User and session", table: "users, sessions", input: "Sign-in events and role assignments", output: "Login audit, access decisions", owner: "Platform Admin" },
  { entity: "Audit event", table: "audit_log", input: "Every sign-in and every action, with actor, input, output and owner", output: "Audit log, CSV export, compliance review", owner: "Security / Compliance" },
];

/** Proposed owning team per asset type. Final owners are confirmed with DART during onboarding. */
export const ASSET_OWNER: Record<string, { team: string; input: string; output: string; prefix: string }> = {
  elevators:  { team: "Facilities Maintenance", input: "Inspection results, outage tickets, elevator monitoring when connected", output: "Station readiness, accessibility alerts", prefix: "ELV" },
  cameras:    { team: "Security Systems", input: "Camera health feed when connected, inspection results", output: "Coverage-gap alerts, security approvals", prefix: "CAM" },
  stairwells: { team: "Facilities Maintenance", input: "Inspection checklist, cleaning tickets", output: "Station readiness", prefix: "STW" },
  trash_cans: { team: "Station Cleaning (contractor)", input: "Crew rounds, overflow reports", output: "Cleaning work orders, readiness", prefix: "TRC" },
  bus_covers: { team: "Shelter Maintenance", input: "Inspection results, damage reports", output: "Repair work orders, readiness", prefix: "BUS" },
};
