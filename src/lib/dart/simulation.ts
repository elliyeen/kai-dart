// ─── KAI DART — Station Simulation Engine ────────────────────────────────────
// Tesla-inspired perception → reasoning → action loop.
// Each agent perceives its slice of station state, reasons about thresholds,
// and emits actions that update the world model.

import type {
  StationWorldModel,
  AgentEvent,
  ReadinessLevel,
  EventSeverity,
} from "./types";
import { INITIAL_STATIONS } from "./data";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9);
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const jitter = (base: number, range: number) => clamp(base + (Math.random() - 0.5) * range * 2);
const chance = (p: number) => Math.random() < p;

function readinessLevel(score: number): ReadinessLevel {
  if (score >= 90) return "excellent";
  if (score >= 75) return "good";
  if (score >= 60) return "fair";
  return "at-risk";
}

function computeReadiness(station: StationWorldModel): number {
  const { safety, cleanliness, equipment, revenue, parking, community } = station.agents;
  const weighted =
    safety.score * safety.weight +
    cleanliness.score * cleanliness.weight +
    equipment.score * equipment.weight +
    revenue.score * revenue.weight +
    parking.score * parking.weight +
    community.score * community.weight;
  return Math.round(clamp(weighted));
}

// ─── Safety Agent Logic ───────────────────────────────────────────────────────
function tickSafety(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const s = { ...station.agents.safety };

  // Drift score
  const target = s.homelessFlags > 0 ? 55 : s.incidentsToday > 2 ? 68 : 90;
  s.score = clamp(s.score + (target - s.score) * 0.08 + (Math.random() - 0.5) * 2);
  s.camerasCoverage = clamp(jitter(s.camerasCoverage, 1));

  // Random incident
  if (chance(0.04)) {
    s.incidentsToday += 1;
    s.homelessFlags = Math.min(s.homelessFlags + 1, 5);
    s.pdAlertsSent += 1;
    s.activeIssues = Math.min(s.activeIssues + 1, 6);
    s.status = "critical";
    s.lastAction = `Alert sent — incident at ${["north entrance", "platform B", "parking zone", "tunnel"][Math.floor(Math.random() * 4)]}`;
    s.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "safety", severity: "critical",
      title: "New incident detected",
      detail: `Incident logged. PD notified. Response time tracking.`,
      timestamp: new Date(), resolved: false,
    });
  }

  // Resolve if PD responded
  if (chance(0.06) && s.activeIssues > 0) {
    s.activeIssues = Math.max(0, s.activeIssues - 1);
    s.homelessFlags = Math.max(0, s.homelessFlags - 1);
    s.status = s.activeIssues > 0 ? "alert" : "nominal";
    s.lastAction = "Issue resolved — PD confirmed clear";
    s.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "safety", severity: "resolved",
      title: "Situation cleared",
      detail: `PD confirmed resolution. Area secure.`,
      timestamp: new Date(), resolved: true, resolvedAt: new Date(),
    });
  }

  // Response time drift
  s.responseTimeMin = clamp(jitter(s.responseTimeMin, 0.5), 1, 30);

  return { ...station, agents: { ...station.agents, safety: s } };
}

// ─── Cleanliness Agent Logic ──────────────────────────────────────────────────
function tickCleanliness(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const c = { ...station.agents.cleanliness };
  const bins = c.bins.map(b => ({ ...b, fillLevel: clamp(b.fillLevel + Math.random() * 1.5) }));

  const overflowBin = bins.find(b => b.fillLevel > 85);
  if (overflowBin && chance(0.4)) {
    c.crewsDispatched += 1;
    c.status = "active";
    c.lastAction = `Crew dispatched — bin at ${overflowBin.location} (${Math.round(overflowBin.fillLevel)}%)`;
    c.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "cleanliness", severity: "warning",
      title: `Bin near capacity — ${overflowBin.location}`,
      detail: `${Math.round(overflowBin.fillLevel)}% full. Crew dispatched.`,
      timestamp: new Date(), resolved: false,
    });
  }

  // Empty bins that were dispatched
  const updatedBins = bins.map(b => {
    if (b.fillLevel > 80 && chance(0.15)) {
      return { ...b, fillLevel: 12, lastEmptied: new Date() };
    }
    return b;
  });

  const avgFill = updatedBins.reduce((s, b) => s + b.fillLevel, 0) / updatedBins.length;
  const target = avgFill < 50 ? 88 : avgFill < 70 ? 75 : 60;
  c.score = clamp(c.score + (target - c.score) * 0.06 + (Math.random() - 0.5) * 1.5);
  c.bins = updatedBins;

  const grade = c.score >= 88 ? "A" : c.score >= 78 ? "B" : c.score >= 65 ? "C" : "D";
  c.platformGrade = grade;
  c.status = avgFill > 80 ? "alert" : avgFill > 60 ? "active" : "nominal";
  c.activeIssues = updatedBins.filter(b => b.fillLevel > 80).length;

  return { ...station, agents: { ...station.agents, cleanliness: c } };
}

// ─── Equipment Agent Logic ────────────────────────────────────────────────────
function tickEquipment(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const e = { ...station.agents.equipment };
  const elevators = e.elevators.map(el => ({
    ...el,
    vibrationIndex: clamp(el.vibrationIndex + (Math.random() - 0.48) * 2),
  }));

  const riskElevator = elevators.find(el => el.vibrationIndex > 72 && el.operational);
  if (riskElevator && chance(0.05)) {
    e.ticketsOpen += 1;
    e.status = "alert";
    e.lastAction = `PM ordered — ${riskElevator.name} vibration ${Math.round(riskElevator.vibrationIndex)}`;
    e.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "equipment", severity: "warning",
      title: `Equipment anomaly — ${riskElevator.name}`,
      detail: `Vibration index ${Math.round(riskElevator.vibrationIndex)}. Maintenance ticket created.`,
      timestamp: new Date(), resolved: false,
    });
  }

  // Resolve ticket occasionally
  if (chance(0.04) && e.ticketsOpen > 0) {
    e.ticketsOpen = Math.max(0, e.ticketsOpen - 1);
    e.status = e.ticketsOpen === 0 ? "nominal" : "alert";
    e.lastAction = "Maintenance complete — ticket closed";
    e.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "equipment", severity: "resolved",
      title: "Maintenance resolved",
      detail: `Equipment cleared. System nominal.`,
      timestamp: new Date(), resolved: true, resolvedAt: new Date(),
    });
  }

  const upElevs = elevators.filter(el => el.operational).length;
  const target = upElevs === elevators.length && e.ticketsOpen === 0 ? 92 : upElevs < elevators.length ? 55 : 72;
  e.score = clamp(e.score + (target - e.score) * 0.06 + (Math.random() - 0.5));
  e.elevators = elevators;
  e.activeIssues = e.ticketsOpen;

  return { ...station, agents: { ...station.agents, equipment: e } };
}

// ─── Revenue Agent Logic ──────────────────────────────────────────────────────
function tickRevenue(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const r = { ...station.agents.revenue };

  // Revenue ticks up during the day
  const hour = new Date().getHours();
  const factor = hour >= 7 && hour <= 9 ? 4 : hour >= 17 && hour <= 19 ? 3.5 : 1;
  r.dailyRevenue = Math.round(r.dailyRevenue + (Math.random() * 12 * factor));
  r.parkingRevenue = Math.round(r.parkingRevenue + Math.random() * 5 * factor);

  // Dynamic pricing
  if (r.dailyRevenue < r.dailyTarget * 0.5 && chance(0.08)) {
    r.pricingAdjustments += 1;
    r.lastAction = "Dynamic pricing adjusted — below target, rate optimized";
    r.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "revenue", severity: "warning",
      title: "Revenue behind target",
      detail: `$${r.dailyRevenue.toLocaleString()} vs $${r.dailyTarget.toLocaleString()} target. Pricing adjusted.`,
      timestamp: new Date(), resolved: false,
    });
  }

  const pct = r.dailyRevenue / r.dailyTarget;
  const target = pct > 1 ? 92 : pct > 0.8 ? 82 : pct > 0.6 ? 70 : 55;
  r.score = clamp(r.score + (target - r.score) * 0.05 + (Math.random() - 0.5));
  r.status = pct > 0.9 ? "nominal" : pct > 0.7 ? "active" : "alert";
  r.activeIssues = pct < 0.7 ? 1 : 0;

  return { ...station, agents: { ...station.agents, revenue: r } };
}

// ─── Parking Agent Logic ──────────────────────────────────────────────────────
function tickParking(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const p = { ...station.agents.parking };
  const zones = p.zones.map(z => ({
    ...z,
    occupied: clamp(z.occupied + Math.floor((Math.random() - 0.45) * 3), 0, z.capacity),
  }));

  const total = zones.reduce((s, z) => s + z.capacity, 0);
  const occ = zones.reduce((s, z) => s + z.occupied, 0);
  const rate = Math.round((occ / total) * 100);

  if (rate > 92 && chance(0.1)) {
    p.lastAction = "Lot near capacity — advisory sent to riders";
    p.lastActionTime = new Date();
    events.push({
      id: uid(), agentName: "parking", severity: "info",
      title: "Parking near capacity",
      detail: `${rate}% occupied. Rider advisory sent.`,
      timestamp: new Date(), resolved: false,
    });
  }

  const target = rate > 80 ? 88 : rate > 60 ? 78 : 60;
  p.score = clamp(p.score + (target - p.score) * 0.05 + (Math.random() - 0.5));
  p.totalOccupied = occ;
  p.occupancyRate = rate;
  p.zones = zones;
  p.status = rate > 90 ? "active" : "nominal";
  p.activeIssues = rate > 90 ? 1 : 0;

  return { ...station, agents: { ...station.agents, parking: p } };
}

// ─── Community Agent Logic ────────────────────────────────────────────────────
function tickCommunity(station: StationWorldModel, events: AgentEvent[]): StationWorldModel {
  const c = { ...station.agents.community };

  if (chance(0.05)) {
    c.photosShared += Math.floor(Math.random() * 4) + 1;
    c.postsToday += 1;
    c.lastAction = `Photo shared — ${c.activePhotoSpot}`;
    c.lastActionTime = new Date();
  }

  // Rating drifts based on safety
  const safetyScore = station.agents.safety.score;
  const targetRating = safetyScore > 85 ? 4.5 : safetyScore > 70 ? 3.8 : 3.1;
  c.appRating = clamp(c.appRating + (targetRating - c.appRating) * 0.02 + (Math.random() - 0.5) * 0.05, 1, 5);
  c.riderSentiment = clamp(c.riderSentiment + (safetyScore - c.riderSentiment) * 0.04 + (Math.random() - 0.5) * 2);

  const target = c.riderSentiment > 80 ? 88 : c.riderSentiment > 65 ? 75 : 62;
  c.score = clamp(c.score + (target - c.score) * 0.04 + (Math.random() - 0.5));
  c.status = "nominal";
  c.activeIssues = 0;

  return { ...station, agents: { ...station.agents, community: c } };
}

// ─── Master Tick ──────────────────────────────────────────────────────────────
export function tickStation(station: StationWorldModel): StationWorldModel {
  const newEvents: AgentEvent[] = [];

  let s = tickSafety(station, newEvents);
  s = tickCleanliness(s, newEvents);
  s = tickEquipment(s, newEvents);
  s = tickRevenue(s, newEvents);
  s = tickParking(s, newEvents);
  s = tickCommunity(s, newEvents);

  // Recompute master readiness score
  const readiness = computeReadiness(s);

  // Keep last 20 events, newest first
  const allEvents = [...newEvents, ...s.events].slice(0, 20);

  // Resolve old events
  const updatedEvents = allEvents.map(e => {
    if (!e.resolved && chance(0.03)) {
      return { ...e, resolved: true, resolvedAt: new Date() };
    }
    return e;
  });

  // Weather drift (minor)
  const weather = {
    ...s.weather,
    tempF: clamp(jitter(s.weather.tempF, 0.3), 40, 100),
    windMph: clamp(jitter(s.weather.windMph, 0.5), 0, 40),
  };

  return {
    ...s,
    readinessScore: readiness,
    readinessLevel: readinessLevel(readiness),
    lastUpdated: new Date(),
    weather,
    events: updatedEvents,
  };
}

// ─── Network Tick (all stations) ─────────────────────────────────────────────
export function tickNetwork(stations: StationWorldModel[]): StationWorldModel[] {
  return stations.map(tickStation);
}

// ─── Initialize ───────────────────────────────────────────────────────────────
export function initStations(): StationWorldModel[] {
  return INITIAL_STATIONS;
}
