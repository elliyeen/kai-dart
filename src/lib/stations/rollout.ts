// Rollout status of each station for KAI system intelligence.
// RULE: "connected" may only be set with evidence (data source, connection date, authorizing party).
// Today NO station is connected to live DART data. Akard is the synthetic demo station.
export type Evidence = { source: string; connectedAt: string; authorizedBy: string };
export type RolloutEntry =
  | { status: "connected"; evidence: Evidence }
  | { status: "pilot-planned"; note?: string }
  | { status: "demo" };
export type RolloutStatus = RolloutEntry["status"] | "not-connected";

/** Keyed by canonical station key (see STATIONS). Anything absent is "not-connected". */
export const ROLLOUT: Record<string, RolloutEntry> = {
  akard: { status: "demo" },
};

export const rolloutOf = (stationKey: string): RolloutStatus => ROLLOUT[stationKey]?.status ?? "not-connected";

export const ROLLOUT_LABEL: Record<RolloutStatus, string> = {
  connected: "Connected to live data",
  "pilot-planned": "Pilot planned",
  demo: "Demo station (synthetic)",
  "not-connected": "Not yet connected",
};
