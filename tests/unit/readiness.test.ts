import { describe, expect, it } from "vitest";
import { ASSET_META, assetsFor, lineStats, lowest, overall } from "@/lib/stations/readiness";
import { STATION_RECORDS } from "@/lib/stations";
import { initialState, reduce } from "@/lib/demo/workflow";

const demo = initialState();

describe("restored Command Center data reproduces the original demo", () => {
  it("network stats: 12 critical, 22 needs attention, average readiness 82", () => {
    const o = overall(demo);
    expect(o.records).toBe(115);
    expect(o.critical).toBe(12);
    expect(o.attention).toBe(22);
    expect(o.avg).toBe(82);
  });
  it("line averages 69/92/71/91/95 with original ranges", () => {
    const m = Object.fromEntries(lineStats(demo).map((l) => [l.line.id, l]));
    expect([m.red.avg, m.green.avg, m.blue.avg, m.orange.avg, m.silver.avg]).toEqual([69, 92, 71, 91, 95]);
    expect([m.red.min, m.red.max]).toEqual([0, 92]);
    expect([m.green.min, m.green.max]).toEqual([72, 99]);
    expect([m.blue.min, m.blue.max]).toEqual([0, 92]);
    expect([m.orange.min, m.orange.max]).toEqual([71, 99]);
    expect([m.silver.min, m.silver.max]).toEqual([91, 99]);
    expect(m.red.count + m.green.count + m.blue.count + m.orange.count + m.silver.count).toBe(115);
  });
  it("top issue tags per line match the original", () => {
    const m = Object.fromEntries(lineStats(demo).map((l) => [l.line.id, l.tags.map((t) => `${t.label} · ${t.n}`)]));
    expect(m.red).toEqual(["Cleaning overdue · 12", "Debris on platform · 9", "Lighting fault · 6"]);
    expect(m.blue).toEqual(["Litter on platform · 8", "Odor / sanitation · 7", "Lighting issue · 5"]);
    expect(m.silver).toEqual([]);
  });
  it("assets: 1771 of 1872 up; down 13 elevators, 30 cameras, 6 stairwells, 46 trash cans, 6 bus covers", () => {
    const a = overall(demo).assets;
    expect([a.ok, a.total]).toEqual([1771, 1872]);
    expect(ASSET_META.map((m) => a.byType[m.key].total - a.byType[m.key].ok)).toEqual([13, 30, 6, 46, 6]);
    const m = Object.fromEntries(lineStats(demo).map((l) => [l.line.id, `${l.assets.ok}/${l.assets.total}`]));
    expect(m).toEqual({ red: "218/235", green: "523/540", blue: "476/534", orange: "265/274", silver: "289/289" });
    expect(assetsFor(["nonexistent"]).total).toBe(0);
  });
  it("10 lowest readiness matches the original table", () => {
    const rows = lowest(demo).map((x) => `${x.r.name}|${x.r.lineId}|${x.r.demo.score}|${x.status}`);
    expect(rows).toEqual([
      "Convention Center|red|0|closed", "Convention Center|blue|0|closed", "Spring Valley|red|34|critical", "Cedars|red|38|critical",
      "Park Lane|red|41|critical", "Cedars|blue|42|critical", "Forest/Jupiter|blue|42|critical", "St. Paul|red|44|critical",
      "St. Paul|blue|48|critical", "SMU/Mockingbird|red|55|deploying",
    ]);
  });
  it("the demo work order updates Akard's rows in the network totals", () => {
    let s = demo;
    const run = (role: Parameters<typeof reduce>[1] extends infer C ? never : never) => role;
    void run;
    s = reduce(reduce(s, { type: "setRole", role: "operations" }).state, { type: "assign" }).state;
    s = reduce(reduce(s, { type: "setRole", role: "contractor" }).state, { type: "submitProof" }).state;
    s = reduce(reduce(s, { type: "setRole", role: "inspector" }).state, { type: "verify" }).state;
    const o = overall(s);
    expect(o.verified).toBe(1);
    expect(o.attention).toBe(22 - STATION_RECORDS.filter((r) => r.id.startsWith("akard") && r.demo.status === "warning").length);
  });
});
