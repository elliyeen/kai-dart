import { ASSET_COUNTS, type AssetKey } from "./assets.generated";
import { effectiveStatus } from "./effective";
import { ISSUE_LABELS, LINES, STATIONS, STATION_RECORDS } from "./index";
import { PUBLIC_STOPS } from "./publicData.generated";
import type { LineId, StationRecord } from "./types";
import type { DemoState } from "@/lib/demo/workflow";

/** All values below are SYNTHETIC DEMO figures carried over from the original app (except official-feed counts). */
export const ASSET_META: { key: AssetKey; label: string; blurb: string }[] = [
  { key: "elevators", label: "Elevators", blurb: "Uptime · coverage · maintenance" },
  { key: "cameras", label: "Cameras", blurb: "Coverage · blind spots · recording" },
  { key: "stairwells", label: "Stairwells", blurb: "Safety · lighting · cleanliness" },
  { key: "trash_cans", label: "Trash Cans", blurb: "Capacity · overflow · sanitation" },
  { key: "bus_covers", label: "Bus Covers", blurb: "Shelter integrity · lighting · signage" },
];

const stationOfRecord = new Map(STATIONS.flatMap((s) => s.recordIds.map((id) => [id, s] as const)));
export type RecStatus = "good" | "warning" | "critical" | "deploying" | "closed" | "assigned" | "awaiting" | "verified";

/** Display status of one line-station record. Only the demo station (Akard) reacts to the demo work order. */
export function recordStatus(r: StationRecord, demo: DemoState): RecStatus {
  const st = stationOfRecord.get(r.id)!;
  const e = effectiveStatus(st, demo);
  return st.key === demo.wo.stationKey && (e === "assigned" || e === "awaiting" || e === "verified") ? e : r.demo.status;
}

export const scoreTone = (n: number) => (n >= 85 ? "#15803D" : n >= 70 ? "#B45309" : "#B91C1C");

export interface AssetTotals { total: number; ok: number }
export function assetsFor(recordIds: string[]) {
  const t: Record<AssetKey, AssetTotals> = { elevators: { total: 0, ok: 0 }, cameras: { total: 0, ok: 0 }, stairwells: { total: 0, ok: 0 }, trash_cans: { total: 0, ok: 0 }, bus_covers: { total: 0, ok: 0 } };
  let total = 0, ok = 0;
  for (const id of recordIds) {
    const a = ASSET_COUNTS[id]; if (!a) continue;
    for (const m of ASSET_META) { t[m.key].total += a[m.key]; t[m.key].ok += a[`${m.key}_ok`]; total += a[m.key]; ok += a[`${m.key}_ok`]; }
  }
  return { byType: t, total, ok, uptime: total ? Math.round((ok / total) * 100) : null };
}

export function overall(demo: DemoState) {
  const sts = STATION_RECORDS.map((r) => recordStatus(r, demo));
  const uniq = (s: RecStatus) => new Set(STATION_RECORDS.filter((_, i) => sts[i] === s).map((r) => stationOfRecord.get(r.id)!.key)).size;
  const a = assetsFor(STATION_RECORDS.map((r) => r.id));
  return {
    records: STATION_RECORDS.length,
    critical: sts.filter((s) => s === "critical").length, criticalUnique: uniq("critical"),
    attention: sts.filter((s) => s === "warning").length, attentionUnique: uniq("warning"),
    avg: Math.round(STATION_RECORDS.reduce((n, r) => n + r.demo.score, 0) / STATION_RECORDS.length),
    awaiting: demo.wo.status === "awaiting_verification" ? 1 : 0, verified: demo.wo.status === "verified" ? 1 : 0,
    assets: a,
  };
}

export function lineStats(demo: DemoState) {
  const officialCount: Record<string, number> = {};
  for (const l of LINES) officialCount[l.id] = new Set(STATION_RECORDS.filter((r) => r.lineId === l.id).map((r) => PUBLIC_STOPS[r.id]?.stopId)).size;
  return LINES.map((l) => {
    const recs = STATION_RECORDS.filter((r) => r.lineId === l.id);
    const scores = recs.map((r) => r.demo.score);
    const tags: Record<string, number> = {};
    for (const r of recs) for (const i of r.demo.issues) tags[i] = (tags[i] ?? 0) + 1;
    const top = Object.entries(tags).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k, n]) => ({ label: ISSUE_LABELS[k] ?? k, n }));
    const a = assetsFor(recs.map((r) => r.id));
    return {
      line: l, records: recs, count: recs.length, avg: Math.round(scores.reduce((x, y) => x + y, 0) / scores.length),
      min: Math.min(...scores), max: Math.max(...scores), tags: top, assets: a, statuses: recs.map((r) => recordStatus(r, demo)),
    };
  });
}

/** The 10 lowest-scoring line-station records, network-wide (stable on the original record order). */
export function lowest(demo: DemoState, n = 10) {
  return STATION_RECORDS.map((r, i) => ({ r, i, status: recordStatus(r, demo) })).sort((a, b) => a.r.demo.score - b.r.demo.score || a.i - b.i).slice(0, n);
}

export function stationAssetUptime(recordIds: string[]) { return assetsFor(recordIds); }
export type { LineId };
