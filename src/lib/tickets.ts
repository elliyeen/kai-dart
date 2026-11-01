"use client";
import { useSyncExternalStore } from "react";
import { ISSUE_LABELS, ISSUE_META, STATIONS } from "@/lib/stations";

export type TicketStatus = "open" | "in_progress" | "done" | "cancelled";
export type Priority = "critical" | "high" | "routine";
export const STATUS_LABEL: Record<TicketStatus, string> = { open: "Open", in_progress: "In progress", done: "Done", cancelled: "Cancelled" };
export const PRIORITY_LABEL: Record<Priority, string> = { critical: "Critical", high: "High", routine: "Routine" };

/** Issue types offered on the report form, with the priority each one sets by default (as in the original app). */
export const REPORT_TYPES: { id: string; label: string; priority: Priority }[] = [
  { id: "safety", label: "Safety", priority: "critical" },
  { id: "security", label: "Security", priority: "critical" },
  { id: "vandalism", label: "Vandalism", priority: "high" },
  { id: "cleaning", label: "Cleaning", priority: "high" },
  { id: "equipment", label: "Equipment", priority: "high" },
  { id: "trash_can", label: "Trash can", priority: "routine" },
  { id: "bench", label: "Bench", priority: "routine" },
];
export const REPORTERS = ["Commuter", "Field engineer", "City staff", "DART operator"] as const;

export interface Ticket {
  ref: string; stationKey: string; stationName: string; typeLabel: string; priority: Priority;
  notes: string; status: TicketStatus; createdAt: string; reportedBy?: string; contact?: string; photoName?: string;
  /** Seeded from the station records (illustrative demo data) rather than submitted in this browser. */
  seeded: boolean;
}

const KEY = "kai-tickets-v1";
const STATUS_KEY = "kai-ticket-status-v1";
/** Fixed timestamp so the seeded log is deterministic and never implies live data. */
const SEED_AT = "2026-10-30T11:57:00.000Z";

const seeded: Ticket[] = STATIONS.flatMap((s) => s.demo.issues.map((id) => {
  const meta = ISSUE_META[id];
  return {
    ref: `DEMO-${s.key}-${id}`.toUpperCase().replace(/[^A-Z0-9-]/g, ""), stationKey: s.key, stationName: s.name, typeLabel: ISSUE_LABELS[id] ?? id,
    priority: meta?.priority ?? "routine", notes: `${ISSUE_LABELS[id] ?? id} recorded in the demo dataset for ${s.name}.`,
    status: (meta?.status === "in_progress" ? "in_progress" : "open") as TicketStatus, createdAt: SEED_AT, seeded: true,
  };
}));

let mine: Ticket[] = [];
let overrides: Record<string, TicketStatus> = {};
let loaded = false;
let cache: Ticket[] = seeded;
const subs = new Set<() => void>();
const rebuild = () => { cache = [...mine, ...seeded].map((t) => ({ ...t, status: overrides[t.ref] ?? t.status })); subs.forEach((f) => f()); };
function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { mine = JSON.parse(window.localStorage.getItem(KEY) ?? "[]"); overrides = JSON.parse(window.localStorage.getItem(STATUS_KEY) ?? "{}"); } catch { /* storage unavailable */ }
  cache = [...mine, ...seeded].map((t) => ({ ...t, status: overrides[t.ref] ?? t.status }));
}
const save = () => { try { window.localStorage.setItem(KEY, JSON.stringify(mine)); window.localStorage.setItem(STATUS_KEY, JSON.stringify(overrides)); } catch { /* ignore */ } };

export function submitTicket(t: Omit<Ticket, "ref" | "createdAt" | "status" | "seeded">): Ticket {
  load();
  const ref = `KAI${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
  const ticket: Ticket = { ...t, ref, createdAt: new Date().toISOString(), status: "open", seeded: false };
  mine = [ticket, ...mine]; save(); rebuild();
  return ticket;
}
export function setTicketStatus(ref: string, status: TicketStatus) { load(); overrides = { ...overrides, [ref]: status }; save(); rebuild(); }
export function resetTickets() { load(); mine = []; overrides = {}; save(); rebuild(); }

const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const useTickets = (): Ticket[] => useSyncExternalStore(subscribe, () => { load(); return cache; }, () => seeded);
