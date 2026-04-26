// ─── KAI DART — Line Metadata ─────────────────────────────────────────────────

export interface DartLine {
  id: string;
  name: string;
  shortName: string;
  color: string;        // primary color hex
  bgColor: string;      // soft background
  borderColor: string;  // border accent
  route: string;        // human-readable terminals
  mileage: number;
  totalStations: number;
  stationIds: string[];
}

export const DART_LINES: DartLine[] = [
  {
    id: "red",
    name: "Red Line",
    shortName: "Red",
    color: "#DC2626",
    bgColor: "#FEF2F2",
    borderColor: "#FECACA",
    route: "Parker Road ↔ Westmoreland",
    mileage: 46,
    totalStations: 36,
    stationIds: ["mockingbird", "downtown-plano"],
  },
  {
    id: "blue",
    name: "Blue Line",
    shortName: "Blue",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    borderColor: "#BFDBFE",
    route: "Dallas Zoo ↔ Rowlett",
    mileage: 28,
    totalStations: 29,
    stationIds: ["mockingbird"],
  },
  {
    id: "silver",
    name: "Silver Line",
    shortName: "Silver",
    color: "#6B7280",
    bgColor: "#F9FAFB",
    borderColor: "#D1D5DB",
    route: "DFW Airport ↔ Plano (new)",
    mileage: 26,
    totalStations: 26,
    stationIds: ["addison"],
  },
];

export function getLine(lineId: string): DartLine | undefined {
  return DART_LINES.find(l => l.id === lineId);
}
