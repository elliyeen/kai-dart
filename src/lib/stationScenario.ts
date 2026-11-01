import { LINE_BY_ID, ISSUE_LABELS, ISSUE_META, type Station } from "@/lib/stations";
import { SCENARIOS, type Scenario, type ScenarioStep, type Stage } from "@/lib/scenarios";
import { PROVIDER_BY_ID } from "@/lib/vendors";

type Crew = { providerId: string; tech: string; crew: string };
const CREW: Record<string, Crew> = {
  clean: { providerId: "cln-a", tech: "CLN-A-01", crew: "Cleaning crew A" },
  elevator: { providerId: "elv", tech: "ELV-01", crew: "Elevator services crew" },
  camera: { providerId: "cam", tech: "CAM-01", crew: "Camera systems crew" },
  facilities: { providerId: "dart-fac", tech: "FAC-01", crew: "DART facilities crew" },
};
const CREW_FOR: Record<string, keyof typeof CREW> = {
  cleaning_overdue: "clean", debris: "clean", litter: "clean", smell: "clean", graffiti: "clean", vandalism: "clean",
  elevator_down: "elevator", escalator_maint: "elevator", camera_offline: "camera", safety: "camera",
  lighting_fault: "facilities", lighting: "facilities", restroom_closed: "facilities", crew_delayed: "facilities",
};
const TIMING = { Critical: { total: 45, sla: 120 }, High: { total: 35, sla: 240 }, Routine: { total: 28, sla: 480 } } as const;
const cap = (p: string) => (p.charAt(0).toUpperCase() + p.slice(1)) as "Critical" | "High" | "Routine";

/** The auto-demo scenario for any station. The four hand-written Red Line scenarios are used as-is; every other station gets one built from its first recorded demo issue. All times, scores and IDs are sample values. */
export function scenarioForStation(st: Station): Scenario {
  const written = SCENARIOS.find((s) => s.station === st.name);
  if (written) return written;
  const issue = st.demo.issues[0];
  const label = issue ? (ISSUE_LABELS[issue] ?? issue) : "Scheduled cleanliness check";
  const priority = cap(issue ? (ISSUE_META[issue]?.priority ?? "routine") : "routine");
  const c = CREW[(issue && CREW_FOR[issue]) || "clean"];
  const provider = PROVIDER_BY_ID[c.providerId];
  const { total, sla } = TIMING[priority];
  const at = (f: number) => Math.max(1, Math.round(total * f));
  const line = LINE_BY_ID[st.lineIds[0]].name;
  const step = (atMin: number, stage: Stage, actor: string, input: string, output: string, owner: string): ScenarioStep => ({ atMin, stage, actor, input, output, owner });
  const base = Math.min(94, Math.max(72, st.demo.score + 6));
  return {
    id: st.key, testId: `TC-${st.key.toUpperCase()}`, station: st.name, line, title: label, detail: `${label} at ${st.name}, from the station's demo record.`, priority,
    providerId: c.providerId, technician: c.tech, slaResolveMin: sla, totalMin: total, base, low: base - 24, final: Math.min(96, base + 2),
    precondition: `${st.name} has no other open ticket for this issue.`, trigger: `${label} is recorded for ${st.name}.`,
    steps: [
      step(0, "Detected", "KAI", `Signal: ${label}`, `${label} detected at ${st.name}`, provider.owner),
      step(Math.max(1, at(0.05)), "Ticket opened", "Operations Command", `Incident, priority ${priority}`, `Ticket opened, priority ${priority}, with owner and due time`, "Operations Command"),
      step(at(0.14), "Dispatched", "Operations Command", "Ticket and contract scope", `Work order sent to ${provider.name}; technician ${c.tech} notified on their device`, "Operations Command"),
      step(at(0.24), "Accepted", c.crew, "Work order notification", `Technician ${c.tech} acknowledges the ticket on their device`, provider.name),
      step(at(0.5), "On site", c.crew, "Arrival at the station", `Technician ${c.tech} checks in at the station`, provider.name),
      step(at(0.88), "Completed", c.crew, "Finished work", "Technician confirms completion on their device", provider.name),
      step(total, "Verified", "Field Inspector", "Monitoring signal and on-site spot check", "Independently verified: issue resolved", "Field Inspector"),
    ],
    expected: "The issue is fixed by the contract holder, confirmed by the technician and signed off by an inspector who is not that technician.",
    passCriteria: ["Work goes to the contract holder for this scope", "Verifier differs from the technician", "Every stage is timed and within the contract SLA", "Every step appears in the audit log"],
  };
}
