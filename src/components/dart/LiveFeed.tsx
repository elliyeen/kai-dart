"use client";
// ─── Live Feed — real-time agent event stream, brand-compliant ────────────────

import { useEffect, useRef } from "react";
import type { AgentEvent, AgentName } from "@/lib/dart/types";

const SEVERITY_STYLES = {
  info:     { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", icon: "○" },
  warning:  { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", icon: "◇" },
  critical: { color: "#DC2626", bg: "#FEF2F2", border: "#FECACA", icon: "◆" },
  resolved: { color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0", icon: "✓" },
};

const AGENT_LABELS: Record<AgentName, string> = {
  safety:      "SAFETY",
  cleanliness: "CLEAN",
  equipment:   "EQUIP",
  revenue:     "REVENUE",
  parking:     "PARKING",
  community:   "COMMUNITY",
};

function timeAgo(date: Date): string {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m`;
  return `${Math.floor(diffMin / 60)}h`;
}

interface Props {
  events: AgentEvent[];
  maxItems?: number;
}

export default function LiveFeed({ events, maxItems = 12 }: Props) {
  const feedRef = useRef<HTMLDivElement>(null);
  const displayed = events.slice(0, maxItems);

  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = 0;
  }, [events.length]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] animate-pulse" />
          <span className="text-[11px] font-medium tracking-[0.2em] uppercase text-gray-400">
            Agent Activity
          </span>
        </div>
        <span className="text-[10px] font-mono text-gray-400">
          {events.filter(e => !e.resolved).length} active
        </span>
      </div>

      {/* Event list */}
      <div ref={feedRef} className="flex-1 overflow-y-auto">
        {displayed.map((event, i) => {
          const style = SEVERITY_STYLES[event.severity];
          return (
            <div key={event.id}
              className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50/60 transition-colors"
              style={{ opacity: i === 0 ? 1 : Math.max(0.4, 1 - i * 0.05) }}>
              <div className="flex items-start gap-2.5">
                <span className="text-xs mt-0.5 flex-shrink-0 font-mono font-bold" style={{ color: style.color }}>
                  {style.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] text-gray-800 font-medium truncate">{event.title}</span>
                    <span className="text-[10px] font-mono text-gray-400 flex-shrink-0">{timeAgo(event.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-mono font-medium tracking-wider px-1 py-px rounded-sm flex-shrink-0"
                      style={{ color: style.color, background: style.bg, border: `1px solid ${style.border}` }}>
                      {AGENT_LABELS[event.agentName]}
                    </span>
                    <span className="text-[11px] text-gray-400 truncate">{event.detail}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {displayed.length === 0 && (
          <div className="px-4 py-10 text-center text-[11px] text-gray-400 font-mono">No events yet</div>
        )}
      </div>
    </div>
  );
}
