"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { ISSUE_LABELS, type Station } from "@/lib/stations";
import { effectiveStatus } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { can } from "@/lib/demo/permissions";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import type { TwinAsset } from "@/lib/stations/geometry";
import { DemoBadge, LineChips, StatusIndicator } from "./ui";
import MapPanel from "./MapPanel";
import AkardTwin from "./dashboard/AkardTwin";
import { AssetDrawer, DataSources, KpiRow, LowerStrip } from "./dashboard/panels";

export default function StationDashboard({ station }: { station: Station }) {
  const demo = useDemo();
  const [asset, setAsset] = useState<TwinAsset["id"]>("platform-b");
  const status = effectiveStatus(station, demo);
  const isDemo = station.key === demo.wo.stationKey;
  const persona = PERSONA_BY_ROLE[demo.role];
  const allowed = can(demo.role, "view_station", { stationKey: station.key }) || can(demo.role, "view_work_order", { stationKey: station.key, actorId: persona.identity, assignedTo: demo.wo.assignedTo });

  return (
    <article aria-labelledby="st-h" data-testid="station-detail" data-station={station.key} className="p-4 lg:p-6 space-y-4">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_360px] gap-4 items-start">
        <div className="space-y-4 min-w-0">
          <Link href="/stations" className="inline-flex items-center gap-1.5 min-h-11 text-sm text-gray-800 hover:text-black"><ArrowLeft className="w-4 h-4" aria-hidden="true" />All stations</Link>
          <header className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs tracking-[0.2em] text-gray-700 uppercase">Infrastructure digital twin</p>
              <h1 id="st-h" className="text-4xl sm:text-5xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{station.name}{station.name === "Akard" ? " Station" : ""}</h1>
              <p className="text-gray-800">{station.city}, TX · KAI × DART proposed pilot</p>
              <div className="flex flex-wrap items-center gap-2"><StatusIndicator status={status} /><span className="text-sm text-gray-800">Infrastructure &amp; cleanliness</span><LineChips lineIds={station.lineIds} /></div>
            </div>
            <div className="text-right text-sm text-gray-800 max-w-xs"><p style={{ fontWeight: 700 }} className="text-gray-900">Station readiness</p><p>Demo condition</p><p className="mt-1"><DemoBadge /></p><p className="mt-1">Last verified update: <strong>Not connected</strong></p></div>
          </header>
          {station.closure && <p className="text-sm border border-amber-300 bg-amber-50 text-amber-950 rounded-md p-3"><strong>Reported closure (unverified):</strong> {station.closure} DART&apos;s published schedule data has not been checked against this note.</p>}

          {!allowed ? (
            <p className="border border-gray-200 rounded-lg p-4 text-sm text-gray-800">The {persona.label} demo persona has no access to station condition detail. Switch role to continue.</p>
          ) : (
            <>
              <KpiRow demo={demo} status={status} isDemoStation={isDemo} issueCount={station.demo.issues.length} />
              {isDemo ? <AkardTwin demo={demo} selected={asset} onSelect={setAsset} /> : (
                <section aria-labelledby="loc-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 space-y-3">
                  <h2 id="loc-h" className="text-lg text-gray-900" style={{ fontWeight: 700 }}>Location</h2>
                  <p className="text-sm text-gray-800">A station digital twin has not been built for this station. Layout and assets are not verified, so none are shown.</p>
                  <MapPanel selectedKey={station.key} />
                </section>
              )}
              <LowerStrip demo={demo} isDemoStation={isDemo} issues={station.demo.issues} />
              <DataSources stationKey={station.key} />
              {!isDemo && station.demo.issues.length > 0 && (
                <section aria-labelledby="iss-h" className="rounded-2xl border border-gray-200 bg-white p-4"><h2 id="iss-h" className="text-lg mb-2" style={{ fontWeight: 700 }}>Open issues <span className="text-sm font-normal text-gray-700">(synthetic)</span></h2>
                  <ul className="divide-y divide-gray-100">{station.demo.issues.map((i) => <li key={i} className="py-2.5 text-sm flex justify-between gap-3"><span>{ISSUE_LABELS[i] ?? i}</span><span className="text-gray-700">Owner: unassigned</span></li>)}</ul>
                  <p className="text-sm text-gray-700 mt-3">The verification workflow is demonstrated at <Link className="underline text-[#0057A8]" href="/stations/akard">Akard</Link>.</p></section>
              )}
            </>
          )}
        </div>
        {allowed && isDemo && <div className="xl:sticky xl:top-20"><AssetDrawer demo={demo} assetId={asset} /></div>}
      </div>
    </article>
  );
}
