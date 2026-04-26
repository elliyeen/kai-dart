"use client";
// ─── Agent Card — individual sub-agent status, brand-compliant ───────────────

import type { AgentState, ActiveAction } from "@/lib/dart/types";

const STATUS_STYLES = {
  nominal:  { dot: "#27AE60", border: "#D1FAE5", bg: "#F0FDF4", label: "Nominal" },
  active:   { dot: "#FF6B35", border: "#FED7AA", bg: "#FFF7ED", label: "Active" },
  alert:    { dot: "#D97706", border: "#FDE68A", bg: "#FFFBEB", label: "Alert" },
  critical: { dot: "#DC2626", border: "#FECACA", bg: "#FEF2F2", label: "Critical" },
};

interface Props {
  agent: AgentState;
  compact?: boolean;
}

function timeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  return `${Math.floor(diffMin / 60)}h ago`;
}

function formatETA(action: ActiveAction): string {
  const elapsedMs = Date.now() - new Date(action.startedAt).getTime();
  const elapsedMin = elapsedMs / 60000;
  const remaining = action.etaMinutes - elapsedMin;

  if (remaining <= 0) return "Overdue";
  if (remaining < 1) return "< 1 min";
  if (remaining < 60) return `~${Math.round(remaining)} min`;
  const hrs = Math.floor(remaining / 60);
  const mins = Math.round(remaining % 60);
  if (mins === 0) return `~${hrs}h`;
  return `~${hrs}h ${mins}m`;
}

export default function AgentCard({ agent, compact = false }: Props) {
  const s = STATUS_STYLES[agent.status];
  const hasActiveAction = !!agent.activeAction;

  return (
    <div className="rounded-sm border p-4 transition-all duration-500" style={{ borderColor: s.border, background: s.bg }}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Status dot */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
            {(agent.status === "alert" || agent.status === "critical") && (
              <div className="absolute inset-0 rounded-full animate-ping" style={{ background: s.dot, opacity: 0.4 }} />
            )}
          </div>
          <span className="text-[11px] font-medium tracking-[0.2em] text-gray-500 uppercase">
            {agent.label}
          </span>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-medium tracking-wider px-1.5 py-0.5 rounded-sm"
            style={{ color: s.dot, background: s.border }}>
            {s.label}
          </span>
          <span className="text-sm font-mono font-bold" style={{ color: s.dot }}>
            {Math.round(agent.score)}
          </span>
        </div>
      </div>

      {/* Score bar */}
      <div className="mt-3 h-1 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700"
          style={{ width: `${agent.score}%`, background: s.dot }} />
      </div>

      {!compact && (
        <>
          <p className="mt-2.5 text-[12px] text-gray-500 leading-relaxed line-clamp-2">
            {agent.lastAction}
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <span className="text-[10px] font-mono text-gray-400">{timeAgo(agent.lastActionTime)}</span>
            {agent.activeIssues > 0 && (
              <span className="text-[10px] font-mono font-medium" style={{ color: s.dot }}>
                {agent.activeIssues} active
              </span>
            )}
          </div>

          {/* Active action + ETA */}
          {hasActiveAction && agent.activeAction && (
            <div className="mt-3 pt-3 border-t flex items-start justify-between gap-2"
              style={{ borderColor: s.border }}>
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse" style={{ background: s.dot }} />
                <span className="text-[11px] text-gray-600 leading-tight truncate">
                  {agent.activeAction.description}
                </span>
              </div>
              <span className="text-[10px] font-mono font-semibold flex-shrink-0 px-1.5 py-0.5 rounded-sm"
                style={{
                  color: formatETA(agent.activeAction) === "Overdue" ? "#DC2626" : s.dot,
                  background: s.border,
                }}>
                {formatETA(agent.activeAction)}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
