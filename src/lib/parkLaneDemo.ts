/**
 * Park Lane 90-second guided demo — deterministic timeline + state machine.
 * Everything here is SYNTHETIC and demo-local. No network, no storage, no live DART data.
 * Elevator and kiosk are HYPOTHETICAL assets: Park Lane's real asset inventory has not been verified.
 * State is a pure function of (time, variant), so replays are identical and pause/seek are trivial.
 */
export const DEMO_STATION_ID = "park-lane"; // canonical record id in records.generated.ts (Red Line)
export const DEMO_DURATION_MS = 90_000;
export const DISCLOSURE = "SIMULATED DEMONSTRATION — NOT LIVE DART DATA";
export const END_NOTE = "Simulated outcomes — actual pilot metrics to be agreed with DART.";

export type IssueKey = "clean" | "elev" | "kiosk";
export type Status = "none" | "new" | "assigned" | "in_progress" | "fix_claimed" | "rejected" | "verified";
export type Role = "KAI" | "Operations Command" | "Contractor" | "Field Inspector" | "Executive";

export interface Actor { id: string; role: Role; label: string }
export const ACTORS = {
  kai: { id: "kai", role: "KAI", label: "KAI (simulated detection)" },
  ops: { id: "ops-1", role: "Operations Command", label: "Operations Command" },
  crewClean: { id: "cln-a-01", role: "Contractor", label: "Cleaning crew CLN-A-01 (sample)" },
  crewElev: { id: "elv-01", role: "Contractor", label: "Elevator services ELV-01 (sample)" },
  crewKiosk: { id: "kio-01", role: "Contractor", label: "Kiosk technician KIO-01 (sample)" },
  insp: { id: "insp-1", role: "Field Inspector", label: "Field Inspector INSP-1 (sample)" },
  exec: { id: "exec-1", role: "Executive", label: "Executive view" },
} satisfies Record<string, Actor>;

export interface DemoEvent {
  at: number;            // ms from start
  issue?: IssueKey;      // which incident this changes (undefined = scene-level)
  status?: Status;       // new status for that incident
  actor: Actor;
  text: string;          // audit line + caption
  claimant?: Actor;      // for verify/reject events: whose work is being checked
  evidence?: string;     // illustrative evidence label
}

export interface DemoStep { id: string; label: string; at: number; caption: string }

export const ISSUES: Record<IssueKey, { id: string; title: string; zone: string; hypothetical: boolean; penalty: number; ref: string }> = {
  clean: { id: "PL-CLEAN-001", title: "Overflowing bin and litter", zone: "Platform", hypothetical: false, penalty: 8, ref: "Cleanliness" },
  elev: { id: "PL-ELEV-001", title: "Elevator out of service", zone: "Accessibility", hypothetical: true, penalty: 14, ref: "Elevator" },
  kiosk: { id: "PL-KIOSK-001", title: "Information / ticketing kiosk fault", zone: "Concourse", hypothetical: true, penalty: 6, ref: "Kiosk" },
};
export const BASELINE_SCORE = 88; // demo-only rule: 88 minus open-issue penalties; restored only by Verified

const s = (n: number) => n * 1000;

export function buildTimeline(rework = false): { events: DemoEvent[]; steps: DemoStep[] } {
  const A = ACTORS;
  const events: DemoEvent[] = [
    { at: 0, actor: A.kai, text: "Park Lane, Red Line: simulated baseline readiness 88 / 100." },
    // cleanliness 10–30s
    { at: s(10), issue: "clean", status: "new", actor: A.kai, text: "Synthetic inspection finds an overflowing bin and litter. Ticket PL-CLEAN-001 created.", evidence: "Illustrative before image" },
    { at: s(14), issue: "clean", status: "assigned", actor: A.ops, text: "Operations assigns the sample cleaning contractor." },
    { at: s(19), issue: "clean", status: "in_progress", actor: A.crewClean, text: "Crew checks in and starts work." },
    { at: s(24), issue: "clean", status: "fix_claimed", actor: A.crewClean, text: "Crew submits proof of completion. Still not Verified.", evidence: "Illustrative after image" },
    { at: s(28), issue: "clean", status: "verified", actor: A.insp, claimant: A.crewClean, text: "A separate Field Inspector verifies the fix. Verified." },
    // elevator 30–50s
    { at: s(31), issue: "elev", status: "new", actor: A.kai, text: "Hypothetical elevator outage PL-ELEV-001. Accessibility alert; asset unavailable.", evidence: "Illustrative fault reading" },
    { at: s(34), issue: "elev", status: "assigned", actor: A.ops, text: "Maintenance assigned." },
    ...(rework
      ? [
          { at: s(37), issue: "elev" as const, status: "fix_claimed" as const, actor: A.crewElev, text: "Contractor claims the elevator is repaired. Readiness stays impacted.", evidence: "Illustrative repair note" },
          { at: s(41), issue: "elev" as const, status: "rejected" as const, actor: A.insp, claimant: A.crewElev, text: "Inspector rejects: fault still present. Reopened for rework." },
          { at: s(44), issue: "elev" as const, status: "fix_claimed" as const, actor: A.crewElev, text: "Contractor resubmits after rework.", evidence: "Illustrative retest note" },
          { at: s(48), issue: "elev" as const, status: "verified" as const, actor: A.insp, claimant: A.crewElev, text: "Inspector confirms restoration. Verified." },
        ]
      : [
          { at: s(40), issue: "elev" as const, status: "fix_claimed" as const, actor: A.crewElev, text: "Contractor claims the elevator is repaired. Readiness stays impacted until an inspector confirms.", evidence: "Illustrative repair note" },
          { at: s(46), issue: "elev" as const, status: "verified" as const, actor: A.insp, claimant: A.crewElev, text: "A separate inspector confirms restoration. Verified." },
        ]),
    // kiosk 50–70s
    { at: s(51), issue: "kiosk", status: "new", actor: A.kai, text: "Hypothetical kiosk fault PL-KIOSK-001: information/ticketing kiosk not responding.", evidence: "Illustrative fault log" },
    { at: s(55), issue: "kiosk", status: "assigned", actor: A.ops, text: "Technician assigned." },
    { at: s(60), issue: "kiosk", status: "fix_claimed", actor: A.crewKiosk, text: "Technician reports a simulated fix.", evidence: "Illustrative test result" },
    { at: s(66), issue: "kiosk", status: "verified", actor: A.insp, claimant: A.crewKiosk, text: "Inspector verifies the kiosk. Verified." },
    // executive 70–85
    { at: s(72), actor: A.exec, text: "Executive view: three incidents, three independent verifications, readiness back to 88." },
    { at: s(85), actor: A.exec, text: "Discuss a six-month, four-station paid pilot." },
  ];
  const steps: DemoStep[] = [
    { id: "overview", label: "Overview", at: 0, caption: "Park Lane station overview, Red Line context, simulated baseline." },
    { id: "clean", label: "Cleanliness", at: s(10), caption: "A synthetic cleanliness issue goes from ticket to independently verified." },
    { id: "elev", label: "Elevator", at: s(30), caption: "A hypothetical elevator outage stays open until an inspector confirms it." },
    { id: "kiosk", label: "Kiosk", at: s(50), caption: "A hypothetical kiosk fault is repaired and independently verified." },
    { id: "exec", label: "Executive view", at: s(70), caption: "Issue log, responsible parties, timestamps; readiness improves only after verified outcomes." },
    { id: "cta", label: "Next step", at: s(85), caption: "Discuss a six-month, four-station paid pilot." },
  ];
  return { events, steps };
}

export interface IssueState { status: Status; owner: string; evidence: string[]; events: DemoEvent[] }
export interface DemoState {
  t: number;
  step: DemoStep;
  stepIndex: number;
  issues: Record<IssueKey, IssueState>;
  readiness: number;
  log: DemoEvent[];
  last: DemoEvent | null;
  focus: IssueKey | null;
  verifiedCount: number;
  done: boolean;
}

/** Guard used by the engine and tests: only an Inspector who is not the claimant may verify. */
export function canVerify(verifier: Actor, claimant: Actor): boolean {
  return verifier.role === "Field Inspector" && verifier.id !== claimant.id && claimant.role === "Contractor";
}

export function stateAt(tMs: number, rework = false): DemoState {
  const { events, steps } = buildTimeline(rework);
  const t = Math.max(0, Math.min(DEMO_DURATION_MS, tMs));
  const issues: Record<IssueKey, IssueState> = {
    clean: { status: "none", owner: "—", evidence: [], events: [] },
    elev: { status: "none", owner: "—", evidence: [], events: [] },
    kiosk: { status: "none", owner: "—", evidence: [], events: [] },
  };
  const log: DemoEvent[] = [];
  for (const e of events) {
    if (e.at > t) break;
    log.push(e);
    if (!e.issue || !e.status) continue;
    const st = issues[e.issue];
    if (e.status === "verified" && !(e.claimant && canVerify(e.actor, e.claimant))) continue; // separation of duties: ignored, never Verified
    st.status = e.status;
    st.owner = e.actor.label;
    st.events.push(e);
    if (e.evidence) st.evidence.push(e.evidence);
  }
  let stepIndex = 0;
  steps.forEach((x, i) => { if (t >= x.at) stepIndex = i; });
  const open = (Object.keys(issues) as IssueKey[]).filter((k) => issues[k].status !== "none" && issues[k].status !== "verified");
  const readiness = BASELINE_SCORE - open.reduce((n, k) => n + ISSUES[k].penalty, 0);
  const focus = (["clean", "elev", "kiosk"] as IssueKey[])[Math.max(0, stepIndex - 1)] ?? null;
  const verifiedCount = (Object.keys(issues) as IssueKey[]).filter((k) => issues[k].status === "verified").length;
  return {
    t, step: steps[stepIndex], stepIndex, issues, readiness, log, last: log[log.length - 1] ?? null,
    focus: stepIndex >= 1 && stepIndex <= 3 ? focus : null, verifiedCount, done: t >= DEMO_DURATION_MS,
  };
}

/** Seek targets for Next / Back. Back within 1.5 s of a step start goes to the previous step. */
export function nextStepTime(t: number, rework = false): number {
  const { steps } = buildTimeline(rework);
  return steps.find((x) => x.at > t)?.at ?? DEMO_DURATION_MS;
}
export function prevStepTime(t: number, rework = false): number {
  const { steps } = buildTimeline(rework);
  const cur = [...steps].reverse().find((x) => x.at <= t) ?? steps[0];
  if (t - cur.at > 1500) return cur.at;
  return [...steps].reverse().find((x) => x.at < cur.at)?.at ?? 0;
}

/** Advance a playhead by dt, clamped; returns the new time and whether the end was reached. */
export function advance(t: number, dt: number): { t: number; ended: boolean } {
  const n = Math.min(DEMO_DURATION_MS, t + Math.max(0, dt));
  return { t: n, ended: n >= DEMO_DURATION_MS };
}
