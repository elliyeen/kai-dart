import type { Eff } from "./effective";
import type { DemoState } from "@/lib/demo/workflow";

/** Akard "digital twin" model. Only what is known is modeled; everything else is shown as unknown (never invented). */
export interface TwinAsset { id: "platform-a" | "platform-b" | "access"; name: string; kind: string; location: string }
export const AKARD_LAYOUT_NOTE = "At-grade station with two side platforms, per project notes. Not yet confirmed against DART station drawings; asset positions are illustrative.";
export const AKARD_ASSETS: TwinAsset[] = [
  { id: "platform-a", name: "Platform A", kind: "Platform", location: "Side platform, one side of the tracks" },
  { id: "platform-b", name: "Platform B", kind: "Platform", location: "Side platform, opposite side of the tracks" },
  { id: "access", name: "Street-level access", kind: "Access", location: "At-grade crossing between the platforms" },
];

/** Demo status of an asset, driven by the synthetic work order (the demo issue lives on Platform B). */
export function assetStatus(id: TwinAsset["id"], demo: DemoState): Eff {
  if (id === "platform-b") {
    switch (demo.wo.status) {
      case "reported": return "warning";
      case "assigned": return "assigned";
      case "awaiting_verification": return "awaiting";
      case "verified": return "verified";
    }
  }
  if (id === "platform-a") return "good";
  return "unknown";
}

export const CLEANLINESS_STEP: Record<DemoState["wo"]["status"], number> = { reported: 1, assigned: 2, awaiting_verification: 3, verified: 4 };
