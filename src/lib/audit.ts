"use client";
import { useSyncExternalStore } from "react";

export interface AuditEntry {
  id: string; at: string; actor: string; role: string; action: string;
  entityType: string; entityId: string; input: string; output: string; owner: string;
}
const KEY = "kai-audit-v1";
const MAX = 500;
let entries: AuditEntry[] = [];
let loaded = false;
let seq = 0;
const subs = new Set<() => void>();
const EMPTY: AuditEntry[] = [];

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try { entries = JSON.parse(window.localStorage.getItem(KEY) ?? "[]"); } catch { /* storage unavailable */ }
}
/** Append one audit entry: who did what, to which record, with what input and output, and which team owns the outcome. */
export function logAudit(e: Omit<AuditEntry, "id" | "at">) {
  load();
  entries = [{ ...e, id: `AUD-${Date.now().toString(36).toUpperCase()}-${++seq}`, at: new Date().toISOString() }, ...entries].slice(0, MAX);
  try { window.localStorage.setItem(KEY, JSON.stringify(entries)); } catch { /* ignore */ }
  subs.forEach((f) => f());
}
export function clearAudit() { load(); entries = []; try { window.localStorage.removeItem(KEY); } catch { /* ignore */ } subs.forEach((f) => f()); }
const subscribe = (f: () => void) => { subs.add(f); return () => { subs.delete(f); }; };
export const useAudit = (): AuditEntry[] => useSyncExternalStore(subscribe, () => { load(); return entries; }, () => EMPTY);

export function auditToCsv(rows: AuditEntry[]): string {
  const q = (v: string) => `"${v.replace(/"/g, '""')}"`;
  return ["id,time,actor,role,action,entity_type,entity_id,input,output,owner", ...rows.map((r) => [r.id, r.at, r.actor, r.role, r.action, r.entityType, r.entityId, r.input, r.output, r.owner].map(q).join(","))].join("\n");
}
