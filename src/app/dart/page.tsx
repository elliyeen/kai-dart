"use client";

import { useMemo } from "react";
import Link from "next/link";
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
      ? Math.round(stations.reduce((s, st) => s + st.readinessScore, 0) / stations.length)
      : 0;

  const networkLevel =
    networkScore >= 90 ? "excellent" : networkScore >= 75 ? "good" : networkScore >= 60 ? "fair" : "at-risk";

  const totalRidership = stations.reduce((s, st) => s + st.ridership.today, 0);
  const totalRevenue   = stations.reduce((s, st) => s + st.agents.revenue.dailyRevenue, 0);
  const totalIssues    = stations.reduce(
    (s, st) => s + Object.values(st.agents).filter(a => a.status === "critical" || a.status === "alert").length, 0
  );
  const votingStations = stations.filter(s => s.politicalStatus === "voting").length;

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* ── Page header ── */}
      <div className="pt-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-medium tracking-[0.3em] text-gray-400 uppercase">
                  KAI · DART Rail Network
                </span>
              </div>
              <h1 className="text-2xl font-light tracking-tight text-gray-900">
                Station Intelligence
              </h1>
            </div>

            {/* Live indicator + controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ background: isLive ? "#27AE60" : "#9CA3AF" }} />
                <span className="text-[12px] text-gray-500">
                  {isLive ? "Live" : "Paused"} · update {tickCount}
                </span>
              </div>
              <button
                onClick={toggle}
                className="text-[11px] font-medium px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all duration-150 rounded-sm"
              >
                {isLive ? "Pause" : "Resume"}
              </button>
              <Link
                href="/contact"
                className="text-[11px] font-medium px-4 py-1.5 bg-[#FF6B35] text-white hover:bg-[#E85A27] transition-colors duration-150 rounded-sm"
              >
                Request Demo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Political alert ── */}
      {votingStations > 0 && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-2.5 flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
            <p className="text-[12px] text-red-700">
              <span className="font-semibold">May 2, 2026 — </span>
              Addison, Highland Park &amp; University Park proceeding to DART withdrawal vote.
              Station readiness scores below are the live data argument.
            </p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">

        {/* ── Network KPI strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-7">
          {/* Network score card */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 flex items-center gap-4 shadow-xs">
            <ReadinessGauge score={networkScore} level={networkLevel} size="sm" showLabel={false} />
            <div>
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">Network Score</p>
              <p className="text-[13px] font-medium text-gray-700 mt-0.5 capitalize">{networkLevel}</p>
            </div>
          </div>

          {[
            { label: "Riders Today",  value: totalRidership.toLocaleString(), icon: "↑" },
            {
              label: "Revenue Today",
              value: `$${totalRevenue.toLocaleString()}`,
              icon: "$",
            },
            {
              label: "Active Issues",
              value: totalIssues.toString(),
              color: totalIssues > 4 ? "#DC2626" : totalIssues > 2 ? "#D97706" : "#16A34A",
              icon: totalIssues > 2 ? "!" : "✓",
            },
          ].map(stat => (
            <div key={stat.label} className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{stat.label}</p>
              <p className="text-2xl font-light mt-1.5 text-gray-900" style={stat.color ? { color: stat.color } : {}}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: stations + ROI */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-[11px] font-medium tracking-[0.25em] text-gray-400 uppercase">
                Stations — {stations.length} Active
              </p>
              <p className="text-[11px] text-gray-400">
                {stations.filter(s => ["excellent","good"].includes(s.readinessLevel)).length}/{stations.length} nominal
              </p>
            </div>

            {stations.map(station => (
              <StationCard key={station.id} station={station} />
            ))}

            {/* City ROI table */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs mt-2">
              <div className="px-5 py-3.5 border-b border-gray-100">
                <p className="text-[11px] font-medium tracking-[0.25em] text-gray-400 uppercase">
                  City ROI — 1% Sales Tax Value Analysis
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {["City", "Tax / Month", "Value Received", "ROI", "Status"].map(h => (
                        <th key={h} className="px-5 py-3 text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
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
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-3.5 text-[13px] font-medium text-gray-800">{s.city.split(" ")[0]}</td>
                          <td className="px-5 py-3.5 text-[12px] font-mono text-gray-500">${taxContributed.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-[12px] font-mono text-gray-500">${serviceValueReceived.toLocaleString()}</td>
                          <td className="px-5 py-3.5 text-[13px] font-mono font-semibold"
                            style={{ color: positive ? "#16A34A" : "#DC2626" }}>
                            {positive ? "+" : ""}{Math.round((roiRatio - 1) * 100)}%
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="text-[10px] font-semibold tracking-wider px-2 py-1 rounded-full"
                              style={{
                                color: s.politicalStatus === "stable" ? "#16A34A" : "#DC2626",
                                background: s.politicalStatus === "stable" ? "#DCFCE7" : "#FEE2E2",
                              }}>
                              {s.politicalStatus === "stable" ? "Stable" : "Voting"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right: live feed */}
          <div className="lg:col-span-1">
            <p className="text-[11px] font-medium tracking-[0.25em] text-gray-400 uppercase mb-3">
              Agent Activity — Live
            </p>
            <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden" style={{ height: 640 }}>
              <LiveFeed events={allEvents} maxItems={24} />
            </div>
          </div>
        </div>

        {/* ── Context strip ── */}
        <div className="grid sm:grid-cols-3 gap-6 mt-8 pt-7 border-t border-gray-200">
          {[
            {
              title: "Agent Architecture",
              body: "Each station runs 6 autonomous sub-agents — Safety, Cleanliness, Equipment, Revenue, Parking, and Community — each perceiving sensor data, reasoning against thresholds, and dispatching actions every 3 seconds.",
            },
            {
              title: "Data Sources",
              body: "IoT bin sensors, elevator vibration, camera coverage, ridership feeds, real-time parking occupancy, revenue streams, and live Dallas weather — fused into a unified station world model.",
            },
            {
              title: "Political Context",
              body: "Addison, Highland Park and University Park proceed to the May 2, 2026 DART withdrawal vote. KAI gives cities and DART transparent, real-time evidence of station performance and tax ROI.",
            },
          ].map(item => (
            <div key={item.title}>
              <p className="text-[11px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2">{item.title}</p>
              <p className="text-[13px] text-gray-500 font-light leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
