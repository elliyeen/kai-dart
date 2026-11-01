// Rollout status of each station for KAI system intelligence.
// RULE: "connected" may only be set with evidence (data source, connection date, authorizing party).
// Today NO station is connected to live DART data. Akard is the synthetic demo station.
export type Evidence = { source: string; connectedAt: string; authorizedBy: string };
export type RolloutEntry =
  | { status: "connected"; evidence: Evidence }
  | { status: "pilot-planned"; note?: string }
  | { status: "demo" };
/** "public-data" is derived (never hand-set): the station matches an official stop in DART's public GTFS schedule feed.
 *  It means PUBLIC SCHEDULE data only — not live condition, inspection or asset data. */
export type RolloutStatus = RolloutEntry["status"] | "public-data" | "not-connected";

/** Proposed pilot sites (by station name). Keyed to canonical station keys below. */
export const PILOT_STATION_NAMES = ["Park Lane", "Akard", "Spring Valley"] as const;

import { STATIONS } from "./index";
import { PUBLIC_STOPS } from "./publicData.generated";

/** Official stop for a physical station, merged across its line-membership records (notes and unconfirmed lines are kept). */
/** Keyed by canonical station key. Pilot sites are "pilot-planned" (a proposal, not a live connection). */
export const ROLLOUT: Record<string, RolloutEntry> = Object.fromEntries(
  PILOT_STATION_NAMES.map((n) => [STATIONS.find((s) => s.name === n)!.key, { status: "pilot-planned", note: "Proposed pilot site" } as RolloutEntry]),
);

export const publicStopFor = (stationKey: string) => {
  const st = STATIONS.find((x) => x.key === stationKey);
  const stops = st ? st.recordIds.map((id) => PUBLIC_STOPS[id]).filter(Boolean) : [];
  if (!stops.length) return undefined;
  return { ...stops[0], lineConfirmed: stops.every((x) => x.lineConfirmed), note: stops.map((x) => x.note).find(Boolean) };
};

export const rolloutOf = (stationKey: string): RolloutStatus => ROLLOUT[stationKey]?.status ?? (publicStopFor(stationKey) ? "public-data" : "not-connected");

export const ROLLOUT_LABEL: Record<RolloutStatus, string> = {
  connected: "Connected to live data",
  "public-data": "Public schedule data connected",
  "pilot-planned": "Pilot planned",
  demo: "Demo station (synthetic)",
  "not-connected": "Not yet connected",
};
