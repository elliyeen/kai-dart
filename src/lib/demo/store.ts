"use client";
import { useSyncExternalStore } from "react";
import { initialState, reduce, type Cmd, type DemoState } from "./workflow";

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
