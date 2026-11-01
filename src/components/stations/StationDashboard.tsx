"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { LINE_BY_ID, addressOf, formatCoords, linePositions, type Station } from "@/lib/stations";
import { effectiveStatus } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { can } from "@/lib/demo/permissions";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import type { TwinAsset } from "@/lib/stations/geometry";
import { DemoBadge, LineChips, StatusIndicator } from "./ui";
import AkardTwin from "./dashboard/AkardTwin";
import { AssetDrawer, DataSources, IssuesDrawer, KpiRow, LowerStrip } from "./dashboard/panels";
import StationFocusMap from "./dashboard/StationFocusMap";

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
              <div className="text-gray-800 space-y-0.5" data-testid="station-meta">
                {(() => { const a = addressOf(station); return a ? (
                  <>
                    <p data-testid="address">{a.street}, {a.city}, {a.state} {a.zip}{a.county ? ` · ${a.county}` : ""}</p>
                    <p className="text-sm text-gray-700">Coordinates <span data-testid="coords">{formatCoords(station.lat, station.lng)}</span> · official stop ID {a.stopId} · <a className="underline text-[#0057A8]" href={a.source} target="_blank" rel="noopener noreferrer">DART station page</a></p>
                    {a.additional?.map((x) => <p key={x.stopId} className="text-sm text-gray-700" data-testid="additional-stop">Also served at {x.name} (stop {x.stopId}): {x.address}</p>)}
                  </>) : <p>{station.city}, TX · <span data-testid="coords">{formatCoords(station.lat, station.lng)}</span></p>; })()}
                {linePositions(station).map((p) => <p key={p.lineId} className="text-sm text-gray-700" data-testid={`pos-${p.lineId}`}>{LINE_BY_ID[p.lineId].name} · Station {p.index} of {p.total}{p.prev ? <> · previous: <Link className="underline text-[#0057A8]" href={`/stations/${p.prev.id}`}>{p.prev.name}</Link></> : " · line terminus"}{p.next ? <> · next: <Link className="underline text-[#0057A8]" href={`/stations/${p.next.id}`}>{p.next.name}</Link></> : " · line terminus"}</p>)}
              </div>
              <div className="flex flex-wrap items-center gap-2"><StatusIndicator status={status} /><span className="text-sm text-gray-800">Infrastructure &amp; cleanliness</span><LineChips lineIds={station.lineIds} /></div>
            </div>
            <div className="text-right text-sm text-gray-800 max-w-xs"><p style={{ fontWeight: 700 }} className="text-gray-900">Station readiness</p><p>Demo condition</p><p className="mt-1"><DemoBadge /></p><p className="mt-1">Last verified update: <strong>Not connected</strong></p></div>
          </header>
          {station.closure && <p className="text-sm border border-amber-300 bg-amber-50 text-amber-950 rounded-md p-3"><strong>Reported closure (unverified):</strong> {station.closure} DART&apos;s published schedule data has not been checked against this note.</p>}

          {!allowed ? (
            <p className="border border-gray-200 rounded-lg p-4 text-sm text-gray-800">The {persona.label} demo persona has no access to station condition detail. Switch role to continue.</p>
          ) : (
            <>
              <KpiRow demo={demo} status={status} isDemoStation={isDemo} issueCount={station.demo.issues.length} station={station} />
              {isDemo ? <AkardTwin demo={demo} selected={asset} onSelect={setAsset} /> : (
                <section aria-labelledby="loc-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <h2 id="loc-h" className="sr-only">Station location map</h2>
                  <StationFocusMap station={station} />
                  <p className="px-4 py-2.5 text-xs text-gray-700 border-t border-gray-100">Real map position from the station&apos;s coordinates. No station layout or asset positions are modeled for this station, so none are drawn.</p>
                </section>
              )}
              <LowerStrip demo={demo} isDemoStation={isDemo} issues={station.demo.issues} station={station} />
              <DataSources stationKey={station.key} />
            </>
          )}
        </div>
        {allowed && <div className="xl:sticky xl:top-20">{isDemo ? <AssetDrawer demo={demo} assetId={asset} /> : <IssuesDrawer station={station} />}</div>}
      </div>
    </article>
  );
}
