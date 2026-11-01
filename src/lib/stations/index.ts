import { STATION_RECORDS } from "./records.generated";
import { LINES } from "./lines";
import type { LineId, Station, StationRecord } from "./types";

export * from "./types";
export * from "./lines";
export { STATION_RECORDS };

const lineOrder = (l: LineId) => LINES.findIndex((x) => x.id === l);
const STATUS_RANK = { critical: 0, closed: 1, deploying: 2, warning: 3, good: 4 } as const;

/** Group original line-membership records into physical stations (same name = same station). */
export function buildStations(records: StationRecord[]): Station[] {
  const byName = new Map<string, StationRecord[]>();
  for (const r of records) byName.set(r.name, [...(byName.get(r.name) ?? []), r]);
  return [...byName.values()].map((group) => {
    const sorted = [...group].sort((a, b) => lineOrder(a.lineId) - lineOrder(b.lineId));
    const first = sorted[0];
    // Worst synthetic status across memberships; lowest score; union of issues.
    const worst = [...sorted].sort((a, b) => STATUS_RANK[a.demo.status] - STATUS_RANK[b.demo.status])[0];
    return {
      key: first.id,
      name: first.name,
      city: first.city,
      lat: first.lat,
      lng: first.lng,
      closure: sorted.find((r) => r.closure)?.closure,
      lineIds: sorted.map((r) => r.lineId),
      recordIds: sorted.map((r) => r.id),
      demo: {
        score: Math.min(...sorted.map((r) => r.demo.score)),
        status: worst.demo.status,
        issues: [...new Set(sorted.flatMap((r) => r.demo.issues))],
      },
    };
  });
}

export const STATIONS: Station[] = buildStations(STATION_RECORDS);
const byRecordId = new Map<string, Station>();
for (const s of STATIONS) for (const id of s.recordIds) byRecordId.set(id, s);

/** Resolve ANY original station id (any line membership) to its physical station. */
export function getStationByAnyId(id: string): Station | undefined {
  return byRecordId.get(id);
}

export function filterStations(opts: { line?: LineId | null; q?: string }): Station[] {
  const q = (opts.q ?? "").trim().toLowerCase();
  return STATIONS.filter(
    (s) =>
      (!opts.line || s.lineIds.includes(opts.line)) &&
      (!q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)),
  ).sort((a, b) => a.name.localeCompare(b.name));
}

export const ISSUE_LABELS: Record<string, string> = {
  cleaning_overdue: "Cleaning overdue", restroom_closed: "Restroom out of service", elevator_down: "Elevator reported down",
  graffiti: "Graffiti / vandalism", lighting_fault: "Lighting fault", escalator_maint: "Escalator maintenance",
  debris: "Debris on platform", crew_delayed: "Crew deployment delayed", camera_offline: "Camera offline",
  safety: "Safety concern", smell: "Odor / sanitation", litter: "Litter on platform", vandalism: "Vandalism", lighting: "Lighting issue",
};

export const STATUS_LABEL = { good: "Good", warning: "Needs attention", critical: "Critical", deploying: "Crew deploying", closed: "Closed" } as const;
