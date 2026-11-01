import { describe, expect, it } from "vitest";
import baseline from "../../docs/baseline/stations-baseline.json";
import { STATION_RECORDS, STATIONS, filterStations, getStationByAnyId, LINES } from "@/lib/stations";

const B = baseline.records as Array<{ id: string; name: string; lineId: string; lat: number; lng: number; closure: string | null }>;

describe("station parity with the original app baseline", () => {
  it("keeps every original station id (115) with identical line membership", () => {
    expect(B.length).toBe(115);
    const cur = new Map(STATION_RECORDS.map((r) => [r.id, r]));
    for (const b of B) {
      const c = cur.get(b.id);
      expect(c, `missing id ${b.id}`).toBeTruthy();
      expect(c!.lineId).toBe(b.lineId);
      expect(c!.name).toBe(b.name);
      expect(c!.lat).toBeCloseTo(b.lat, 6);
      expect(c!.lng).toBeCloseTo(b.lng, 6);
    }
    expect(STATION_RECORDS.length).toBe(B.length);
  });
  it("distinguishes unique stations from station-line memberships", () => {
    expect(new Set(B.map((b) => b.name)).size).toBe(STATIONS.length);
    expect(STATIONS.reduce((n, s) => n + s.lineIds.length, 0)).toBe(115);
  });
  it("resolves every original id to a station", () => {
    for (const b of B) expect(getStationByAnyId(b.id)?.name).toBe(b.name);
  });
  it("each of the five line filters returns exactly that line's original stations", () => {
    expect(LINES.map((l) => l.id).sort()).toEqual(["blue", "green", "orange", "red", "silver"]);
    for (const l of LINES) {
      const expected = new Set(B.filter((b) => b.lineId === l.id).map((b) => b.name));
      const got = new Set(filterStations({ line: l.id }).map((s) => s.name));
      expect(got).toEqual(expected);
      expect(expected.size).toBeGreaterThan(0);
    }
  });
  it("search matches by name and city, case-insensitive", () => {
    expect(filterStations({ q: "akard" }).map((s) => s.name)).toContain("Akard");
    expect(filterStations({ q: "AKARD", line: "silver" })).toHaveLength(0);
    expect(filterStations({ q: "zzzz-none" })).toHaveLength(0);
  });
  it("keeps the closed Convention Center record visible and flagged", () => {
    const s = getStationByAnyId("convention-blue")!;
    expect(s.closure).toMatch(/Closed/);
  });
});
