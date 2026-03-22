"use client";
// ─── Station Card — network overview tile, brand-compliant ───────────────────

import Link from "next/link";
import ReadinessGauge from "./ReadinessGauge";
import type { StationWorldModel } from "@/lib/dart/types";

const POLITICAL_STYLES = {
  stable:    { color: "#16A34A", label: "Stable",      bg: "#F0FDF4", border: "#BBF7D0" },
  "at-risk": { color: "#D97706", label: "At Risk",     bg: "#FFFBEB", border: "#FDE68A" },
  voting:    { color: "#DC2626", label: "Voting May 2", bg: "#FEF2F2", border: "#FECACA" },
};

const LEVEL_ACCENT: Record<string, string> = {
  excellent: "#27AE60",
  good:      "#4CAF50",
  fair:      "#FF6B35",
  "at-risk": "#DC2626",
};

interface Props { station: StationWorldModel }

export default function StationCard({ station }: Props) {
  const pol = POLITICAL_STYLES[station.politicalStatus];
  const accent = LEVEL_ACCENT[station.readinessLevel];
  const criticalAgents = Object.values(station.agents).filter(a => a.status === "critical").length;
  const alertAgents = Object.values(station.agents).filter(a => a.status === "alert").length;

  return (
    <Link href={`/dart/station/${station.id}`}>
      <div className="group relative bg-white border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all duration-200 cursor-pointer overflow-hidden">
        {/* Top accent bar */}
        <div className="h-0.5 w-full" style={{ background: accent }} />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-[15px] font-medium text-gray-900 group-hover:text-black leading-tight">
                {station.name}
              </h3>
              <p className="text-[11px] font-mono text-gray-400 mt-0.5 tracking-wider">{station.line}</p>
            </div>
            <div className="flex-shrink-0 px-2 py-1 rounded-sm text-[10px] font-medium tracking-wider flex items-center gap-1"
              style={{ color: pol.color, background: pol.bg, border: `1px solid ${pol.border}` }}>
              {station.politicalStatus === "voting" && (
                <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: pol.color }} />
              )}
              {pol.label}
            </div>
          </div>

          {/* Score + agent mini bars */}
          <div className="flex items-center gap-5 mt-4">
            <ReadinessGauge score={station.readinessScore} level={station.readinessLevel} size="sm" showLabel={false} />
            <div className="flex-1 space-y-1.5">
              {Object.values(station.agents).map(agent => (
                <div key={agent.name} className="flex items-center gap-2">
                  <span className="text-[9px] font-mono text-gray-400 w-14 flex-shrink-0 truncate uppercase">
                    {agent.label.slice(0, 8)}
                  </span>
                  <div className="flex-1 h-0.5 bg-gray-100 rounded-full">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${agent.score}%`,
                        background: agent.score >= 80 ? "#27AE60" : agent.score >= 65 ? "#FF6B35" : "#DC2626",
                      }} />
                  </div>
                  <span className="text-[9px] font-mono text-gray-400 w-6 text-right">{Math.round(agent.score)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mt-4 pt-3 border-t border-gray-50">
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Riders</p>
              <p className="text-[13px] font-mono text-gray-700 mt-0.5">{station.ridership.today.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Revenue</p>
              <p className="text-[13px] font-mono text-gray-700 mt-0.5">${station.agents.revenue.dailyRevenue.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Issues</p>
              <p className="text-[13px] font-mono mt-0.5">
                {criticalAgents > 0
                  ? <span className="text-red-600">{criticalAgents} critical</span>
                  : alertAgents > 0
                  ? <span className="text-amber-600">{alertAgents} alerts</span>
                  : <span className="text-green-600">None</span>}
              </p>
            </div>
          </div>

          {/* Political note */}
          {station.politicalStatus !== "stable" && (
            <p className="mt-3 text-[11px] text-gray-400 leading-relaxed line-clamp-2">{station.politicalNote}</p>
          )}

          {/* ROI */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">City ROI</span>
            <span className="text-[12px] font-mono font-medium"
              style={{ color: station.cityRoi.roiRatio >= 1 ? "#16A34A" : "#DC2626" }}>
              {station.cityRoi.roiRatio >= 1 ? "+" : ""}{Math.round((station.cityRoi.roiRatio - 1) * 100)}%
            </span>
          </div>
        </div>

        {/* Hover arrow */}
        <div className="absolute right-4 bottom-4 text-[10px] font-medium tracking-[0.2em] text-gray-300 group-hover:text-gray-600 transition-colors uppercase">
          View →
        </div>
      </div>
    </Link>
  );
}
