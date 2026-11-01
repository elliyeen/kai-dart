/** Test-case scenarios behind the auto demo. Every step names the actor, the input, the output, the owner and a time. Times are sample minutes from detection. */
export const STAGES = ["Detected", "Ticket opened", "Dispatched", "Accepted", "On site", "Completed", "Verified"] as const;
export type Stage = (typeof STAGES)[number];
/** Project-status palette: red = down, amber = waiting, blue = in progress, purple = blocked on parts, teal = done awaiting check, green = verified. */
export const STAGE_COLOR: Record<Stage, string> = { Detected: "#DC2626", "Ticket opened": "#D97706", Dispatched: "#D97706", Accepted: "#2563EB", "On site": "#2563EB", Completed: "#0D9488", Verified: "#16A34A" };
export const BLOCKED_COLOR = "#7C3AED";
export const STATUS_LEGEND: { label: string; color: string }[] = [
  { label: "Down", color: "#DC2626" }, { label: "Waiting", color: "#D97706" }, { label: "In progress", color: "#2563EB" },
  { label: "Waiting on parts", color: "#7C3AED" }, { label: "Done, awaiting check", color: "#0D9488" }, { label: "Verified", color: "#16A34A" },
];

export interface ScenarioStep { atMin: number; stage: Stage; actor: string; input: string; output: string; owner: string; blocked?: boolean }
export interface Scenario {
  id: string; testId: string; station: string; line: string; title: string; detail: string; priority: "Critical" | "High" | "Routine";
  providerId: string; technician: string; slaResolveMin: number; precondition: string; trigger: string; steps: ScenarioStep[];
  expected: string; passCriteria: string[]; totalMin: number; base: number; low: number; final: number;
}

const common = (provider: string, tech: string, crew: string) => ({
  dispatch: { stage: "Dispatched" as Stage, actor: "Operations Command", input: "Ticket and contract scope", output: `Work order sent to ${provider}; ${tech} notified on their device`, owner: "Operations Command" },
  accept: { stage: "Accepted" as Stage, actor: crew, input: "Work order notification", output: `${tech} acknowledges the ticket on their device`, owner: provider },
  site: { stage: "On site" as Stage, actor: crew, input: "Arrival at the station", output: `${tech} checks in at the station`, owner: provider },
});
const verify = (input: string, output: string): Omit<ScenarioStep, "atMin"> => ({ stage: "Verified", actor: "Field Inspector", input, output, owner: "Field Inspector" });

const PL = common("Station Cleaning Contractor A", "Technician CLN-A-01", "Cleaning crew A");
const SV = common("Station Cleaning Contractor B", "Technician CLN-B-01", "Cleaning crew B");
const AK = common("Camera and Security Systems Contractor", "Technician CAM-01", "Camera systems crew");
const SM = common("Elevator Services Contractor", "Technician ELV-01", "Elevator services crew");

export const SCENARIOS: Scenario[] = [
  { id: "park-lane", testId: "TC-PL-01", station: "Park Lane", line: "Red Line", title: "Graffiti on the north platform wall", detail: "Camera analytics flag new marking on the north platform wall.", priority: "High",
    providerId: "cln-a", technician: "CLN-A-01", slaResolveMin: 240, totalMin: 38, base: 88, low: 61, final: 90,
    precondition: "Park Lane readiness is in the high 80s and no open cleanliness ticket exists.", trigger: "Camera analytics flag new marking on the north platform wall.",
    steps: [
      { atMin: 0, stage: "Detected", actor: "KAI", input: "Camera frame flagged as graffiti", output: "Graffiti detected at Park Lane, north platform wall", owner: "Station Manager" },
      { atMin: 2, stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority High", output: "Ticket opened, priority High, with owner and due time", owner: "Operations Command" },
      { atMin: 5, ...PL.dispatch }, { atMin: 9, ...PL.accept }, { atMin: 22, ...PL.site },
      { atMin: 34, stage: "Completed", actor: "Cleaning crew A", input: "Finished work", output: "Technician confirms completion on their device (photo optional)", owner: "Station Cleaning Contractor A" },
      { atMin: 38, ...verify("Monitoring signal and on-site spot check", "Independently verified: surface clean") },
    ],
    expected: "Graffiti removed by the contracted crew, confirmed by the technician and signed off by an inspector who is not that technician.",
    passCriteria: ["Work goes to the contract holder named for this scope", "The technician acknowledges the ticket on their device before work starts", "The technician checks in on site and confirms completion on their device", "Verifier differs from the technician", "Every stage is timed and the total is within the contract SLA", "Every step appears in the audit log"] },
  { id: "spring-valley", testId: "TC-SV-01", station: "Spring Valley", line: "Red Line", title: "Trash bin at capacity", detail: "Fill-level check shows the platform bin is full.", priority: "Routine",
    providerId: "cln-b", technician: "CLN-B-01", slaResolveMin: 480, totalMin: 29, base: 86, low: 64, final: 91,
    precondition: "Spring Valley platform bin is in service and within its normal fill level.", trigger: "Fill-level check shows the platform bin is full.",
    steps: [
      { atMin: 0, stage: "Detected", actor: "KAI", input: "Fill-level reading at capacity", output: "Bin at capacity, Spring Valley platform", owner: "Station Cleaning Contractor B" },
      { atMin: 1, stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority Routine", output: "Ticket opened, priority Routine", owner: "Operations Command" },
      { atMin: 3, ...SV.dispatch }, { atMin: 6, ...SV.accept }, { atMin: 14, ...SV.site },
      { atMin: 24, stage: "Completed", actor: "Cleaning crew B", input: "Finished work", output: "Technician confirms bin emptied and liner replaced on their device", owner: "Station Cleaning Contractor B" },
      { atMin: 29, ...verify("Fill-level reading and spot check", "Independently verified: bin clear") },
    ],
    expected: "Bin emptied by the contracted crew within the routine window and verified clear.",
    passCriteria: ["Work goes to the contract holder for trash collection", "The technician acknowledges, checks in and confirms completion on their device", "Fill-level reading returns to normal", "Ticket closes only after inspector approval", "Every stage is timed and the total is within the contract SLA", "Every step appears in the audit log"] },
  { id: "akard", testId: "TC-AK-01", station: "Akard", line: "Red Line", title: "Platform B camera offline after dark", detail: "Platform B camera stopped reporting, leaving a coverage gap.", priority: "Critical",
    providerId: "cam", technician: "CAM-01", slaResolveMin: 120, totalMin: 47, base: 90, low: 68, final: 92,
    precondition: "Akard Platform B camera is in service; a security officer is available nearby.", trigger: "Platform B camera stops reporting after dark, leaving a coverage gap.",
    steps: [
      { atMin: 0, stage: "Detected", actor: "KAI", input: "Camera heartbeat lost on Platform B", output: "Platform B camera offline, coverage gap flagged", owner: "Security Systems" },
      { atMin: 2, stage: "Ticket opened", actor: "Operations Command", input: "Alert, priority Critical", output: "Ticket opened, priority Critical; security approval requested", owner: "Operations Command" },
      { atMin: 4, stage: "Ticket opened", actor: "Security Supervisor", input: "Coverage-gap alert", output: "Approves moving an officer to Platform B", owner: "Security / Compliance" },
      { atMin: 6, ...AK.dispatch }, { atMin: 10, ...AK.accept }, { atMin: 22, ...AK.site },
      { atMin: 40, stage: "Completed", actor: "Camera systems crew", input: "Finished work", output: "Technician confirms camera restored on their device", owner: "Camera and Security Systems Contractor" },
      { atMin: 42, stage: "Completed", actor: "Security Supervisor", input: "Live feed confirmed", output: "Officer released from Platform B", owner: "Security / Compliance" },
      { atMin: 47, ...verify("Live feed check and monitoring signal", "Independently verified: coverage restored") },
    ],
    expected: "Coverage is never left unattended: the officer covers until the camera is back, then is released.",
    passCriteria: ["Officer move is approved by the security supervisor before it happens", "Work goes to the camera contract holder and is acknowledged on the technician's device", "Officer is released only after the feed is confirmed", "Verifier differs from the technician", "Camera asset status returns to in service", "Every step, including the approval, appears in the audit log"] },
  { id: "smu-mockingbird", testId: "TC-SM-01", station: "SMU/Mockingbird", line: "Red Line", title: "Elevator out of service", detail: "Elevator reports a fault. Accessible route notice posted.", priority: "Critical",
    providerId: "elv", technician: "ELV-01", slaResolveMin: 1440, totalMin: 66, base: 87, low: 58, final: 89,
    precondition: "Station elevator is in service; accessible route signage is available.", trigger: "Elevator reports a fault and goes out of service.",
    steps: [
      { atMin: 0, stage: "Detected", actor: "KAI", input: "Elevator fault reported", output: "Elevator fault at SMU/Mockingbird; asset marked out of service", owner: "Facilities Maintenance" },
      { atMin: 3, stage: "Ticket opened", actor: "Operations Command", input: "Incident, priority Critical", output: "Ticket opened, priority Critical", owner: "Operations Command" },
      { atMin: 5, stage: "Ticket opened", actor: "Station Manager", input: "Out-of-service elevator", output: "Accessible route notice posted", owner: "Station Manager" },
      { atMin: 7, ...SM.dispatch }, { atMin: 12, ...SM.accept }, { atMin: 25, ...SM.site },
      { atMin: 32, stage: "On site", actor: "Elevator services crew", input: "Diagnosis", output: "Technician reports waiting on parts; delivery time logged", owner: "Elevator Services Contractor", blocked: true },
      { atMin: 52, stage: "On site", actor: "Elevator services crew", input: "Parts delivered", output: "Parts received, repair resumes", owner: "Elevator Services Contractor" },
      { atMin: 60, stage: "Completed", actor: "Elevator services crew", input: "Finished work", output: "Technician confirms repair and test ride on their device", owner: "Elevator Services Contractor" },
      { atMin: 66, ...verify("Test ride and monitoring signal", "Independently verified: elevator in service") },
    ],
    expected: "Riders with accessibility needs are told the alternate route immediately. The time spent waiting on parts is recorded, and the elevator returns to service only after independent verification.",
    passCriteria: ["Accessible route notice is posted before repair starts", "Work goes to the elevator contract holder and is acknowledged on the technician's device", "Waiting-on-parts time is recorded as its own period", "Elevator asset shows out of service until verified", "Verifier differs from the technician", "Every step appears in the audit log"] },
];

/** Start minute of each stage (first step in that stage). */
export function stageStarts(s: Scenario): Record<Stage, number> {
  const out = {} as Record<Stage, number>;
  for (const st of STAGES) out[st] = Math.min(...s.steps.filter((x) => x.stage === st).map((x) => x.atMin));
  return out;
}
export function blockedWindow(s: Scenario): [number, number] | null {
  const i = s.steps.findIndex((x) => x.blocked);
  return i < 0 ? null : [s.steps[i].atMin, s.steps[i + 1].atMin];
}
