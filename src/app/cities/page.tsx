"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Nav from "@/components/Nav";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import { useStationEngine } from "@/lib/dart/useStationEngine";

const CITY_CONFIGS = {
  dallas: {
    name: "Dallas",
    fullName: "City of Dallas",
    color: "#FF6B35",
    stationIds: ["mockingbird"],
    description: "Mockingbird Station — Red / Blue Line",
  },
  plano: {
    name: "Plano",
    fullName: "City of Plano",
    color: "#27AE60",
    stationIds: ["downtown-plano"],
    description: "Downtown Plano Station — Red Line",
  },
  addison: {
    name: "Addison",
    fullName: "City of Addison",
    color: "#0057A8",
    stationIds: ["addison"],
    description: "Addison Station — Green Line",
  },
};

export default function CityPortalPage() {
  const { stations } = useStationEngine(3000);

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* Header */}
      <div className="pt-16 bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
          <Link
            href="/platform?tab=demo"
            className="inline-flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-black transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Command Center
          </Link>
          <div>
            <p className="text-[10px] font-medium tracking-[0.35em] text-gray-400 uppercase mb-2">
              KAI · City Accounts
            </p>
            <h1 className="text-3xl font-light tracking-tight text-gray-900">
              City Portal
            </h1>
            <p className="text-sm text-gray-600 mt-1.5">
              Select a city to view your station data, ROI, and agent activity.
            </p>
          </div>
        </div>
      </div>

      {/* City cards */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {(Object.entries(CITY_CONFIGS) as [string, typeof CITY_CONFIGS[keyof typeof CITY_CONFIGS]][]).map(([slug, cfg]) => {
            const cityStations = stations.filter(s => cfg.stationIds.includes(s.id));
            const station = cityStations[0];

            return (
              <Link key={slug} href={`/cities/${slug}`} className="group flex">
                <div className="flex flex-col w-full bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200 overflow-hidden">
                  {/* Color bar */}
                  <div className="h-1 w-full" style={{ background: cfg.color }} />

                  <div className="p-6 flex flex-col flex-1">
                    {/* City name */}
                    <p className="text-[10px] font-medium tracking-[0.3em] text-gray-500 uppercase mb-1">
                      City Account
                    </p>
                    <h2 className="text-xl font-semibold text-gray-900 mb-0.5">{cfg.fullName}</h2>
                    <p className="text-[12px] text-gray-600 mb-5">{cfg.description}</p>

                    {/* Station score */}
                    {station ? (
                      <div className="flex items-center gap-4 mb-5">
                        <ReadinessGauge
                          score={station.readinessScore}
                          level={station.readinessLevel}
                          size="sm"
                          showLabel={false}
                        />
                        <div>
                          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Readiness</p>
                          <p className="text-sm font-medium text-gray-800 capitalize mt-0.5">
                            {station.readinessLevel}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5">
                            {station.ridership.today.toLocaleString()} riders today
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="h-16 flex items-center">
                        <p className="text-[12px] text-gray-300 font-mono">Loading…</p>
                      </div>
                    )}

                    {/* Political status */}
                    {station?.politicalStatus === "voting" && (
                      <div className="flex items-center gap-1.5 mb-4 px-2.5 py-1.5 bg-red-50 border border-red-200 rounded-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                        <p className="text-[11px] text-red-700 font-medium">Voting May 2</p>
                      </div>
                    )}

                    {/* CTA */}
                    <div
                      className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto"
                    >
                      <span className="text-[11px] font-semibold tracking-[0.15em] uppercase"
                        style={{ color: cfg.color }}>
                        Open Dashboard
                      </span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
                        style={{ color: cfg.color }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer context */}
        <p className="text-center text-[12px] text-gray-600 mt-10">
          Each city account shows only your stations, ROI metrics, and agent activity. —{" "}
          <Link href="/dart" className="underline hover:text-gray-700 transition-colors">
            View full DART network
          </Link>
        </p>
      </div>
    </div>
  );
}
