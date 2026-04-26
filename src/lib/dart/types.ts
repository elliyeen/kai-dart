// ─── KAI DART Station Agent System ──────────────────────────────────────────
// Types for the Station-as-Agent (SaA) architecture

export type AgentStatus = "nominal" | "active" | "alert" | "critical";
export type ReadinessLevel = "excellent" | "good" | "fair" | "at-risk";
export type EventSeverity = "info" | "warning" | "critical" | "resolved";
export type AgentName = "safety" | "cleanliness" | "equipment" | "revenue" | "parking" | "community";

// ─── Sensor Data ─────────────────────────────────────────────────────────────
export interface BinSensor {
  id: string;
  location: string;
  fillLevel: number; // 0–100
  lastEmptied: Date;
}

export interface ElevatorStatus {
  id: string;
  name: string;
  operational: boolean;
  vibrationIndex: number; // 0–100 (>70 = concern)
  lastMaintained: Date;
}

export interface ParkingZone {
  id: string;
  name: string;
  capacity: number;
  occupied: number;
  evChargers: number;
  evInUse: number;
  pricePerHour: number;
}

export interface WeatherData {
  tempF: number;
  condition: string;
  windMph: number;
  humidity: number;
}

// ─── Agent States ─────────────────────────────────────────────────────────────
export interface ActiveAction {
  description: string;  // what the agent is doing right now
  etaMinutes: number;   // estimated time to resolution from startedAt
  startedAt: Date;
}

export interface AgentState {
  name: AgentName;
  label: string;
  status: AgentStatus;
  score: number; // 0–100, this agent's contribution
  weight: number; // weight in overall readiness score
  lastAction: string;
  lastActionTime: Date;
  activeIssues: number;
  activeAction?: ActiveAction; // in-progress action with ETA
}

export interface SafetyAgentState extends AgentState {
  name: "safety";
  incidentsToday: number;
  homelessFlags: number;
  responseTimeMin: number; // avg response time
  pdAlertsSent: number;
  camerasCoverage: number; // 0–100%
}

export interface CleanlinessAgentState extends AgentState {
  name: "cleanliness";
  bins: BinSensor[];
  crewsDispatched: number;
  platformGrade: "A" | "B" | "C" | "D" | "F";
  cleaningsToday: number;
}

export interface EquipmentAgentState extends AgentState {
  name: "equipment";
  elevators: ElevatorStatus[];
  escalatorsUp: number;
  escalatorsTotal: number;
  ticketsOpen: number;
  predictedFailures: PredictedFailure[];
}

export interface PredictedFailure {
  equipmentId: string;
  equipmentName: string;
  probability: number; // 0–100
  estimatedHours: number;
  severity: "low" | "medium" | "high";
}

export interface RevenueAgentState extends AgentState {
  name: "revenue";
  dailyRevenue: number;
  dailyTarget: number;
  parkingRevenue: number;
  adRevenue: number;
  retailRevenue: number;
  pricingAdjustments: number;
}

export interface ParkingAgentState extends AgentState {
  name: "parking";
  zones: ParkingZone[];
  totalCapacity: number;
  totalOccupied: number;
  occupancyRate: number; // 0–100
  violationsIssued: number;
  parkAndRide: boolean;
}

export interface CommunityAgentState extends AgentState {
  name: "community";
  photosShared: number;
  appRating: number; // 0–5
  postsToday: number;
  activePhotoSpot: string;
  riderSentiment: number; // 0–100
}

// ─── Agent Event (Live Feed) ──────────────────────────────────────────────────
export interface AgentEvent {
  id: string;
  agentName: AgentName;
  severity: EventSeverity;
  title: string;
  detail: string;
  timestamp: Date;
  resolved: boolean;
  resolvedAt?: Date;
  etaMinutes?: number; // expected resolution time from timestamp
}

// ─── Station World Model ──────────────────────────────────────────────────────
export interface StationWorldModel {
  id: string;
  name: string;
  shortName: string;
  line: string;      // display string e.g. "Red / Blue Line"
  lineIds: string[]; // normalized ids e.g. ["red", "blue"]
  city: string;
  politicalStatus: "stable" | "at-risk" | "voting"; // DART political context
  politicalNote: string;
  coordinates: { lat: number; lng: number };
  readinessScore: number;
  readinessLevel: ReadinessLevel;
  lastUpdated: Date;
  weather: WeatherData;
  ridership: {
    today: number;
    peak: number;
    trend: "up" | "down" | "flat";
    peakHour: string;
  };
  agents: {
    safety: SafetyAgentState;
    cleanliness: CleanlinessAgentState;
    equipment: EquipmentAgentState;
    revenue: RevenueAgentState;
    parking: ParkingAgentState;
    community: CommunityAgentState;
  };
  events: AgentEvent[];
  cityRoi: {
    taxContributed: number; // monthly
    serviceValueReceived: number; // monthly
    roiRatio: number; // serviceValue / taxContributed
  };
}
