import type { Station } from "./types";
import type { DemoState } from "@/lib/demo/workflow";

export type Eff = "critical" | "closed" | "deploying" | "warning" | "good" | "assigned" | "awaiting" | "verified" | "unknown";

/** Station status for display. Only the demo station (Akard) reacts to the demo work order. All values are SYNTHETIC DEMO. */
export function effectiveStatus(s: Station, demo: DemoState): Eff {
  if (s.key === demo.wo.stationKey) {
    switch (demo.wo.status) {
      case "assigned": return "assigned";
      case "awaiting_verification": return "awaiting";
      case "verified": return "verified";
    }
  }
  return s.demo.status;
}

export const EFF_LABEL: Record<Eff, string> = {
  critical: "Critical", closed: "Closed", deploying: "Crew deploying", warning: "Needs attention", good: "No open issue",
  assigned: "Assigned", awaiting: "Awaiting verification", verified: "Verified resolved", unknown: "Not inspected",
};
export const EFF_RANK: Record<Eff, number> = { critical: 0, closed: 1, awaiting: 2, deploying: 3, assigned: 4, warning: 5, good: 6, verified: 7, unknown: 8 };
