"use client";
import { useSyncExternalStore } from "react";
import { logAudit } from "@/lib/audit";
import { PERSONA_BY_ROLE } from "./roles";
import { initialState, reduce, type Cmd, type DemoState } from "./workflow";

const OWNER: Record<string, string> = { sign_in: "Platform Admin", assign_work: "Operations Command", submit_proof: "Contractor / Crew", verify_resolved: "Field Inspector", reject_proof: "Field Inspector", reset_demo: "Platform Admin" };
const KEY = "kai-demo-state-v1";
const SERVER = initialState();
let state: DemoState = SERVER;
let hydrated = false;
let lastError: string | null = null;
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    const raw = window.sessionStorage.getItem(KEY);
    if (raw) state = JSON.parse(raw) as DemoState;
  } catch { /* storage unavailable: run in memory */ }
}

export function dispatch(cmd: Cmd): string | null {
  hydrate();
  const r = reduce(state, cmd);
  lastError = r.error ?? null;
  if (!r.error) {
    const actor = PERSONA_BY_ROLE[(cmd.type === "setRole" ? cmd.role : state.role)];
    const AUD: Partial<Record<Cmd["type"], [string, string, string, string]>> = {
      setRole: ["sign_in", "session", `role=${actor.label}`, "Session started (simulated sign-in)"],
      assign: ["assign_work", "work_order", "Operations assigns the Akard cleanliness work order", "Assigned to demo.crew-a"],
      submitProof: ["submit_proof", "work_order", "Crew proof photo and notes", "Awaiting independent verification"],
      verify: ["verify_resolved", "work_order", "Independent inspection of submitted proof", "Verified resolved"],
      reject: ["reject_proof", "work_order", "Independent inspection of submitted proof", "Returned to crew"],
      reset: ["reset_demo", "session", "Reset requested", "Sample data restored"],
    };
    const a = AUD[cmd.type];
    if (a && typeof window !== "undefined") logAudit({ actor: actor.identity, role: actor.label, action: a[0], entityType: a[1], entityId: cmd.type === "setRole" ? actor.identity : state.wo.stationKey, input: a[2], output: a[3], owner: OWNER[a[0]] });
    state = r.state;
    try { window.sessionStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }
  emit();
  return lastError;
}

const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
const getSnapshot = () => { hydrate(); return state; };
export const useDemo = (): DemoState => useSyncExternalStore(subscribe, getSnapshot, () => SERVER);
export const useLastError = (): string | null => useSyncExternalStore(subscribe, () => lastError, () => null);
export const clearError = () => { lastError = null; emit(); };
