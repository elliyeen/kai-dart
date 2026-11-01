import { describe, expect, it } from "vitest";
import { STATIONS, STATION_ADDRESSES, addressOf } from "@/lib/stations";

describe("station addresses", () => {
  it("every station has a street address, ZIP, county and DART source", () => {
    for (const s of STATIONS) {
      const a = addressOf(s);
      expect(a, s.name).toBeTruthy();
      expect(a.street, s.name).toMatch(/\d/);
      expect(a.zip, s.name).toMatch(/^\d{5}$/);
      expect(a.county, s.name).toBeTruthy();
      expect(a.source, s.name).toMatch(/^https:\/\/www\.dart\.org\//);
      expect(a.stopId, s.name).toMatch(/^\d+$/);
    }
    expect(Object.keys(STATION_ADDRESSES)).toHaveLength(STATIONS.length);
  });
  it("uses DART's published address where it differs from the old city", () => {
    const by = (n: string) => STATIONS.find((s) => s.name === n)!;
    expect(by("Spring Valley").city).toBe("Richardson");
    expect(by("Cypress Waters").city).toBe("Dallas");
    expect(by("DFW North").city).toBe("Grapevine");
    expect(by("Dallas College Northlake Campus").city).toBe("Irving");
    expect(addressOf(by("Akard")).street).toBe("1400 Pacific Ave.");
  });
});
