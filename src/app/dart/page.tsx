"use client";

import { useMemo } from "react";
import Nav from "@/components/Nav";
import StationCard from "@/components/dart/StationCard";
import LiveFeed from "@/components/dart/LiveFeed";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import { useStationEngine } from "@/lib/dart/useStationEngine";

export default function DartPage() {
  const { stations, isLive, toggle, tickCount } = useStationEngine(3000);

  const allEvents = useMemo(
    () =>
      stations
        .flatMap(s => s.events.map(e => ({ ...e, _stationId: s.id })))
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 24),
    [stations]
  );

  const networkScore =
    stations.length > 0
      ? Math.round(stations.reduce((sum, s) => sum + s.readinessScore, 0) / stations.length)
      : 0;

  const networkLevel =
    networkScore >= 90 ? "excellent" : networkScore >= 75 ? "good" : networkScore >= 60 ? "fair" : "at-risk";

  const totalRidership = stations.reduce((s, st) => s + st.ridership.today, 0);
  const totalRevenue   = stations.reduce((s, st) => s + st.agents.revenue.dailyRevenue, 0);
  const totalIssues    = stations.reduce(
    (s, st) => s + Object.values(st.agents).filter(a => a.status === "critical" || a.status === "alert").length,
    0
  );
  const votingStations = stations.filter(s => s.politicalStatus === "voting").length;

  return (
    <div className="min-h-screen bg-white text-black">
      <Nav />

      {/* ── Hero band — dark like the platform page ── */}
      <div className="pt-16 bg-[#111318] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
          <div className="flex items-start justify-between flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: isLive ? "#27AE60" : "#6B7280" }} />
                <span className="text-[11px] font-medium tracking-[0.3em] text-white/40 uppercase">
                  {isLive ? "Network Live" : "Paused"} · Update {tickCount}
                </span>
                <button
                  onClick={toggle}
                  className="text-[11px] font-medium tracking-[0.15em] text-white/40 hover:text-white/70 border border-white/15 hover:border-white/30 px-2 py-0.5 transition-all duration-200"
                >
                  {isLive ? "Pause" : "Resume"}
                </button>
              </div>
              <h1 className="text-[2.4rem] lg:text-[3.2rem] font-thin tracking-[-0.02em] leading-tight">
                DART Rail Intelligence
              </h1>
              <p className="mt-2 text-base text-white/50 font-light max-w-lg leading-relaxed">
                Autonomous station agents. Real-time readiness.<br />
                Every station knows itself.
              </p>
            </div>

            {/* Network score */}
            <div className="flex items-center gap-6">
              <div>
                <p className="text-[10px] font-medium tracking-[0.3em] text-white/30 uppercase mb-3">
                  Network Score
                </p>
                <ReadinessGauge score={networkScore} level={networkLevel} size="lg" />
              </div>
            </div>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-px mt-10 border border-white/[0.08] overflow-hidden">
            {[
              { label: "Stations Active",  value: stations.length.toString(),            color: "" },
              { label: "Riders Today",     value: totalRidership.toLocaleString(),        color: "" },
              { label: "Revenue Today",    value: `$${totalRevenue.toLocaleString()}`,    color: "" },
              {
                label: "Active Issues",
                value: totalIssues.toString(),
                color: totalIssues > 4 ? "#DC2626" : totalIssues > 2 ? "#D97706" : "#27AE60",
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.03] px-5 py-4">
                <p className="text-[10px] font-medium tracking-[0.25em] text-white/30 uppercase">{stat.label}</p>
                <p className="text-2xl font-mono mt-1.5" style={{ color: stat.color || "rgba(255,255,255,0.85)" }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Political alert banner ── */}
      {votingStations > 0 && (
        <div className="bg-red-50 border-b border-red-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3.5 flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse mt-1 flex-shrink-0" />
            <div>
              <span className="text-[11px] font-medium tracking-[0.2em] text-red-700 uppercase">
                Political Alert — May 2, 2026 &nbsp;·&nbsp;
              </span>
              <span className="text-[12px] text-red-600">
                {votingStations} station{votingStations !== 1 ? "s" : ""} in cities proceeding
                to withdrawal vote. Highland Park, University Park, and Addison decide on May 2nd.
                Every readiness score below is the data — the argument for staying or leaving.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── Main content — white like platform page sections ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: station cards + ROI table */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase">
                Station Network
              </p>
              <p className="text-[11px] font-mono text-gray-400">
                {stations.filter(s => s.readinessLevel === "excellent" || s.readinessLevel === "good").length} of {stations.length} nominal
              </p>
            </div>

            {stations.map(station => (
              <StationCard key={station.id} station={station} />
            ))}

            {/* City ROI table */}
            <div className="mt-4 border border-gray-100 overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase">
                  City ROI — 1% Sales Tax Value Analysis
                </p>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    {["City", "Tax / Month", "Value Received", "ROI", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stations.map(s => {
                    const { taxContributed, serviceValueReceived, roiRatio } = s.cityRoi;
                    const positive = roiRatio >= 1;
                    return (
                      <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/60 transition-colors">
                        <td className="px-5 py-4 text-[13px] font-medium text-gray-800">{s.city.split(" ")[0]}</td>
                        <td className="px-5 py-4 text-[12px] font-mono text-gray-500">${taxContributed.toLocaleString()}</td>
                        <td className="px-5 py-4 text-[12px] font-mono text-gray-500">${serviceValueReceived.toLocaleString()}</td>
                        <td className="px-5 py-4 text-[13px] font-mono font-medium"
                          style={{ color: positive ? "#16A34A" : "#DC2626" }}>
                          {positive ? "+" : ""}{Math.round((roiRatio - 1) * 100)}%
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-[10px] font-medium tracking-wider px-1.5 py-0.5"
                            style={{
                              color: s.politicalStatus === "stable" ? "#16A34A" : "#DC2626",
                              background: s.politicalStatus === "stable" ? "#F0FDF4" : "#FEF2F2",
                            }}>
                            {s.politicalStatus === "stable" ? "STABLE" : "VOTING"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: live feed */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 border border-gray-100 overflow-hidden shadow-sm" style={{ height: 680 }}>
              <LiveFeed events={allEvents} maxItems={24} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer context ── */}
      <div className="border-t border-gray-100 py-10 mt-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            <div>
              <p className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-3">Agent Architecture</p>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Each station runs 6 autonomous sub-agents — Safety, Cleanliness, Equipment,
                Revenue, Parking, and Community — updating every 3 seconds via a Tesla-inspired
                perception → reasoning → action loop.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-3">Data Inputs</p>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                IoT bin sensors, elevator vibration indices, camera coverage metrics, ridership
                feeds, real-time parking occupancy, revenue streams, and live Dallas weather —
                all fused into a unified station world model.
              </p>
            </div>
            <div>
              <p className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-3">Political Context</p>
              <p className="text-sm text-gray-500 font-light leading-relaxed">
                Addison, Highland Park, and University Park proceed to May 2, 2026 withdrawal
                vote. KAI provides cities and DART with transparent, real-time evidence of
                station performance and tax value delivered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
