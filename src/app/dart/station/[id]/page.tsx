"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import AgentCard from "@/components/dart/AgentCard";
import LiveFeed from "@/components/dart/LiveFeed";
import StationDigitalTwin from "@/components/dart/StationDigitalTwin";
import { useStationEngine } from "@/lib/dart/useStationEngine";
import type { AgentName } from "@/lib/dart/types";

const AGENT_ORDER: AgentName[] = ["safety", "cleanliness", "equipment", "revenue", "parking", "community"];

function StatBox({
  label, value, sub, color,
}: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="border border-gray-100 px-4 py-4">
      <p className="text-[10px] font-medium tracking-[0.25em] text-gray-400 uppercase">{label}</p>
      <p className="text-xl font-mono mt-1.5 text-gray-900" style={color ? { color } : {}}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.round((value / max) * 100)}%`, background: color }} />
    </div>
  );
}

export default function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getStation, isLive, toggle, tickCount } = useStationEngine(3000);
  const station = getStation(id);

  if (!station) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 font-mono text-sm">Loading station data…</p>
      </div>
    );
  }

  const { agents, events, weather, ridership, cityRoi } = station;
  const sortedAgents = AGENT_ORDER.map(n => agents[n]);
  const criticalCount = sortedAgents.filter(a => a.status === "critical").length;
  const alertCount    = sortedAgents.filter(a => a.status === "alert").length;

  return (
    <div className="min-h-screen bg-white text-black">
      <Nav />

      {/* ── Dark hero header ── */}
      <div className="pt-16 bg-[#111318] text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
          {/* Breadcrumb */}
          <Link href="/dart"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-[0.2em] text-white/30 hover:text-white/60 transition-colors mb-6 uppercase">
            <ArrowLeft className="w-3 h-3" /> DART Network
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[11px] font-mono text-white/30 tracking-wider">{station.line}</span>
                {station.politicalStatus !== "stable" && (
                  <span className="text-[10px] font-medium tracking-wider px-2 py-0.5 text-red-400 bg-red-900/30 border border-red-800/40">
                    ⚠ VOTING MAY 2, 2026
                  </span>
                )}
              </div>
              <h1 className="text-[2.2rem] lg:text-[2.8rem] font-thin tracking-[-0.02em]">
                {station.name}
              </h1>
              <p className="text-sm text-white/40 font-light mt-1">{station.city}</p>
              {station.politicalStatus !== "stable" && (
                <p className="mt-2 text-[12px] text-red-400/70 max-w-lg leading-relaxed">
                  {station.politicalNote}
                </p>
              )}
            </div>

            {/* Score + status */}
            <div className="flex items-center gap-8">
              <ReadinessGauge score={station.readinessScore} level={station.readinessLevel} size="lg" />
              <div className="space-y-2.5">
                {criticalCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                    <span className="text-[12px] font-medium text-red-400">
                      {criticalCount} critical
                    </span>
                  </div>
                )}
                {alertCount > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="text-[12px] font-medium text-amber-400">
                      {alertCount} alerts
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full"
                    style={{ background: isLive ? "#27AE60" : "#6B7280" }} />
                  <span className="text-[11px] font-mono text-white/30">
                    {isLive ? "Live" : "Paused"} · #{tickCount}
                  </span>
                  <button onClick={toggle}
                    className="text-[10px] font-medium text-white/25 hover:text-white/50 border border-white/10 px-1.5 py-0.5 transition-colors">
                    {isLive ? "Pause" : "Resume"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-px mt-8 border border-white/[0.08] overflow-hidden">
            {[
              { label: "Riders Today",  value: ridership.today.toLocaleString(), sub: `Peak ${ridership.peakHour}` },
              {
                label: "Revenue",
                value: `$${agents.revenue.dailyRevenue.toLocaleString()}`,
                sub: `Target $${agents.revenue.dailyTarget.toLocaleString()}`,
                color: agents.revenue.dailyRevenue >= agents.revenue.dailyTarget ? "#27AE60" : "#FF6B35",
              },
              {
                label: "Parking",
                value: `${agents.parking.occupancyRate}%`,
                sub: `${agents.parking.totalOccupied}/${agents.parking.totalCapacity} spaces`,
                color: agents.parking.occupancyRate > 90 ? "#DC2626" : agents.parking.occupancyRate > 75 ? "#D97706" : "#27AE60",
              },
              { label: "Weather", value: `${weather.tempF}°F`, sub: `${weather.condition} · ${weather.windMph}mph` },
              {
                label: "City ROI",
                value: `${cityRoi.roiRatio >= 1 ? "+" : ""}${Math.round((cityRoi.roiRatio - 1) * 100)}%`,
                sub: `$${cityRoi.serviceValueReceived.toLocaleString()} value`,
                color: cityRoi.roiRatio >= 1 ? "#27AE60" : "#DC2626",
              },
            ].map(stat => (
              <div key={stat.label} className="bg-white/[0.03] px-4 py-3.5">
                <p className="text-[10px] font-medium tracking-[0.2em] text-white/30 uppercase">{stat.label}</p>
                <p className="text-lg font-mono mt-1" style={{ color: stat.color || "rgba(255,255,255,0.85)" }}>
                  {stat.value}
                </p>
                {stat.sub && <p className="text-[10px] text-white/25 mt-0.5">{stat.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body — white sections ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* Left: digital twin + agents + detail panels */}
          <div className="xl:col-span-2 space-y-8">

            {/* Digital Twin */}
            <StationDigitalTwin station={station} />

            {/* Agent Council */}
            <div>
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-4">
                Agent Council
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedAgents.map(agent => (
                  <AgentCard key={agent.name} agent={agent} />
                ))}
              </div>
            </div>

            {/* Equipment panel */}
            <div className="border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase">
                  Equipment Status
                </p>
                <span className="text-[11px] font-mono text-gray-400">
                  {agents.equipment.escalatorsUp}/{agents.equipment.escalatorsTotal} escalators up
                </span>
              </div>
              <div className="p-5 space-y-4">
                {agents.equipment.elevators.map(el => (
                  <div key={el.id} className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: el.operational ? "#16A34A" : "#DC2626" }} />
                      <span className="text-[13px] text-gray-700">{el.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-mono">
                      <div>
                        <span className="text-gray-400">VIBRATION  </span>
                        <span className="font-medium"
                          style={{ color: el.vibrationIndex > 70 ? "#DC2626" : el.vibrationIndex > 50 ? "#D97706" : "#16A34A" }}>
                          {Math.round(el.vibrationIndex)}
                        </span>
                      </div>
                      <span className="font-medium"
                        style={{ color: el.operational ? "#16A34A" : "#DC2626" }}>
                        {el.operational ? "OPERATIONAL" : "OFFLINE"}
                      </span>
                    </div>
                  </div>
                ))}

                {agents.equipment.predictedFailures.length > 0 && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase mb-3">
                      Predicted Failures
                    </p>
                    {agents.equipment.predictedFailures.map(f => (
                      <div key={f.equipmentId}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-[13px] text-gray-600">{f.equipmentName}</span>
                        <div className="flex items-center gap-4 text-[11px] font-mono">
                          <span style={{ color: f.probability > 70 ? "#DC2626" : "#D97706" }}>
                            {f.probability}% likely
                          </span>
                          <span className="text-gray-400">
                            {f.estimatedHours === 0 ? "NOW" : `~${f.estimatedHours}hr`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Parking panel */}
            <div className="border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase">Parking</p>
              </div>
              <div className="p-5 space-y-5">
                {agents.parking.zones.map(zone => {
                  const pct = Math.round((zone.occupied / zone.capacity) * 100);
                  const color = pct > 90 ? "#DC2626" : pct > 75 ? "#D97706" : "#16A34A";
                  return (
                    <div key={zone.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] text-gray-700">{zone.name}</span>
                        <div className="flex items-center gap-5 text-[11px] font-mono text-gray-500">
                          <span>{zone.occupied}/{zone.capacity}</span>
                          <span className="font-medium" style={{ color }}>{pct}%</span>
                          <span>${zone.pricePerHour.toFixed(2)}/hr</span>
                        </div>
                      </div>
                      <Bar value={zone.occupied} max={zone.capacity} color={color} />
                      {zone.evChargers > 0 && (
                        <p className="text-[10px] text-gray-400 mt-1.5">
                          ⚡ {zone.evInUse}/{zone.evChargers} EV chargers in use
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cleanliness panel */}
            <div className="border border-gray-100">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase">
                  Bin Sensors
                </p>
                <span className="text-[11px] font-mono text-gray-400">
                  Platform Grade: <strong className="text-gray-700">{agents.cleanliness.platformGrade}</strong>
                </span>
              </div>
              <div className="p-5 space-y-4">
                {agents.cleanliness.bins.map(bin => {
                  const color = bin.fillLevel > 85 ? "#DC2626" : bin.fillLevel > 65 ? "#D97706" : "#16A34A";
                  return (
                    <div key={bin.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] text-gray-600">{bin.location}</span>
                        <span className="text-[12px] font-mono font-medium" style={{ color }}>
                          {Math.round(bin.fillLevel)}%
                        </span>
                      </div>
                      <Bar value={bin.fillLevel} max={100} color={color} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: live feed + community + safety intel */}
          <div className="xl:col-span-1 space-y-5">

            {/* Live feed */}
            <div className="border border-gray-100 shadow-sm overflow-hidden" style={{ height: 640 }}>
              <LiveFeed events={events} maxItems={20} />
            </div>

            {/* Safety Intel */}
            <div className="border border-gray-100 p-5">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-4">
                Safety Intel
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Incidents",     value: `${agents.safety.incidentsToday} today`,
                    color: agents.safety.incidentsToday > 2 ? "#DC2626" : "#374151" },
                  { label: "Response Avg",  value: `${agents.safety.responseTimeMin.toFixed(1)} min`,
                    color: agents.safety.responseTimeMin > 10 ? "#DC2626" : "#16A34A" },
                  { label: "Homeless Flags",value: `${agents.safety.homelessFlags}`,
                    color: agents.safety.homelessFlags > 0 ? "#DC2626" : "#16A34A" },
                  { label: "Cameras Online",value: `${agents.safety.camerasCoverage}%`,
                    color: agents.safety.camerasCoverage > 85 ? "#16A34A" : "#D97706" },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-[15px] font-mono mt-1 font-medium" style={{ color: item.color }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community */}
            <div className="border border-gray-100 p-5">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-4">
                Community
              </p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "App Rating",    value: `${agents.community.appRating.toFixed(1)} ★` },
                  { label: "Photos Today",  value: agents.community.photosShared.toString() },
                  { label: "Sentiment",     value: `${Math.round(agents.community.riderSentiment)}/100`,
                    color: agents.community.riderSentiment > 75 ? "#16A34A" : agents.community.riderSentiment > 55 ? "#D97706" : "#DC2626" },
                  { label: "Posts",         value: `${agents.community.postsToday} today` },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-[15px] font-mono mt-1 font-medium text-gray-800" style={item.color ? { color: item.color } : {}}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Active Photo Spot</p>
                <p className="text-[12px] text-gray-600 leading-relaxed">{agents.community.activePhotoSpot}</p>
              </div>
            </div>

            {/* City ROI */}
            <div className="border border-gray-100 p-5">
              <p className="text-[11px] font-medium tracking-[0.3em] text-gray-400 uppercase mb-4">
                City ROI
              </p>
              {[
                { label: "Tax Contributed / Mo", value: `$${cityRoi.taxContributed.toLocaleString()}` },
                { label: "Service Value / Mo",   value: `$${cityRoi.serviceValueReceived.toLocaleString()}` },
                {
                  label: "ROI Ratio",
                  value: `${cityRoi.roiRatio >= 1 ? "+" : ""}${Math.round((cityRoi.roiRatio - 1) * 100)}%`,
                  color: cityRoi.roiRatio >= 1 ? "#16A34A" : "#DC2626",
                },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
                  <span className="text-[12px] text-gray-500">{item.label}</span>
                  <span className="text-[14px] font-mono font-medium text-gray-800" style={item.color ? { color: item.color } : {}}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
