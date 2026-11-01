/** Service providers and their field personnel. Names and contract references are SAMPLE placeholders until DART's contracts are loaded. */
export type ProviderKind = "In-house" | "Contractor";
export interface Provider {
  id: string; name: string; kind: ProviderKind; contractRef: string; scope: string;
  respondMin: Record<"Critical" | "High" | "Routine", number>; owner: string;
}
export interface Technician { id: string; providerId: string; label: string; status: "Available" | "Accepted a ticket" | "On site" | "Off shift" }

export const PROVIDERS: Provider[] = [
  { id: "cln-a", name: "Station Cleaning Contractor A", kind: "Contractor", contractRef: "CT-CLN-001", scope: "Platform cleaning, graffiti removal (Red Line north)", respondMin: { Critical: 15, High: 30, Routine: 120 }, owner: "Operations Command" },
  { id: "cln-b", name: "Station Cleaning Contractor B", kind: "Contractor", contractRef: "CT-CLN-002", scope: "Trash collection and platform cleaning (Red Line)", respondMin: { Critical: 15, High: 30, Routine: 120 }, owner: "Operations Command" },
  { id: "elv", name: "Elevator Services Contractor", kind: "Contractor", contractRef: "CT-ELV-001", scope: "Elevator and escalator repair and preventive maintenance", respondMin: { Critical: 30, High: 60, Routine: 240 }, owner: "Facilities Maintenance" },
  { id: "cam", name: "Camera and Security Systems Contractor", kind: "Contractor", contractRef: "CT-CAM-001", scope: "Camera repair, recording systems and coverage checks", respondMin: { Critical: 30, High: 60, Routine: 240 }, owner: "Security / Compliance" },
  { id: "dart-fac", name: "DART Facilities Maintenance", kind: "In-house", contractRef: "In-house", scope: "Shelters, benches, stairwells, lighting", respondMin: { Critical: 30, High: 120, Routine: 480 }, owner: "Facilities Maintenance" },
];
export const PROVIDER_BY_ID = Object.fromEntries(PROVIDERS.map((p) => [p.id, p])) as Record<string, Provider>;

export const TECHNICIANS: Technician[] = [
  { id: "CLN-A-01", providerId: "cln-a", label: "Cleaning crew A, technician 1", status: "On site" },
  { id: "CLN-A-02", providerId: "cln-a", label: "Cleaning crew A, technician 2", status: "Available" },
  { id: "CLN-B-01", providerId: "cln-b", label: "Cleaning crew B, technician 1", status: "On site" },
  { id: "CLN-B-02", providerId: "cln-b", label: "Cleaning crew B, technician 2", status: "Off shift" },
  { id: "ELV-01", providerId: "elv", label: "Elevator technician 1", status: "On site" },
  { id: "ELV-02", providerId: "elv", label: "Elevator technician 2", status: "Accepted a ticket" },
  { id: "CAM-01", providerId: "cam", label: "Camera technician 1", status: "On site" },
  { id: "CAM-02", providerId: "cam", label: "Camera technician 2", status: "Available" },
  { id: "FAC-01", providerId: "dart-fac", label: "DART facilities technician 1", status: "Available" },
];
