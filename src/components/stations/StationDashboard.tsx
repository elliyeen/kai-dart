"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, PanelRightClose, PanelRightOpen } from "lucide-react";
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
import StationActions from "./StationActions";
import LoopDemo from "./LoopDemo";
import { scenarioForStation } from "@/lib/stationScenario";

export default function StationDashboard({ station }: { station: Station }) {
  const demo = useDemo();
  const [asset, setAsset] = useState<TwinAsset["id"]>("platform-b");
  const [drawerOpen, setDrawerOpen] = useState(true);
  const status = effectiveStatus(station, demo);
  const isDemo = station.key === demo.wo.stationKey;
  const persona = PERSONA_BY_ROLE[demo.role];
  const allowed = can(demo.role, "view_station", { stationKey: station.key }) || can(demo.role, "view_work_order", { stationKey: station.key, actorId: persona.identity, assignedTo: demo.wo.assignedTo });

  return (
    <article aria-labelledby="st-h" data-testid="station-detail" data-station={station.key} className="p-4 lg:p-6 space-y-4">
      <div className={`grid items-start gap-4 transition-[grid-template-columns,gap] duration-300 ease-out motion-reduce:transition-none ${drawerOpen ? "xl:grid-cols-[minmax(0,1fr)_360px]" : "xl:grid-cols-[minmax(0,1fr)_0px] xl:gap-0"}`} data-testid="dash-grid" data-drawer={drawerOpen ? "open" : "closed"}>
        <div className="space-y-4 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <Link href="/stations" className="inline-flex items-center gap-1.5 min-h-11 text-sm text-gray-800 hover:text-black"><ArrowLeft className="w-4 h-4" aria-hidden="true" />All stations</Link>
            {allowed && <button type="button" data-testid="drawer-toggle" aria-expanded={drawerOpen} aria-controls="side-drawer" onClick={() => setDrawerOpen((o) => !o)}
              className="inline-flex items-center gap-2 min-h-11 px-4 rounded-full border border-gray-300 bg-white text-sm font-semibold hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]">
              {drawerOpen ? <PanelRightClose className="w-4 h-4" aria-hidden="true" /> : <PanelRightOpen className="w-4 h-4" aria-hidden="true" />}{drawerOpen ? "Hide details" : "Show details"}</button>}
          </div>
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
              <StationActions station={station} canDeploy={can(demo.role, "assign_work", { stationKey: station.key })} roleLabel={persona.label} />
              <KpiRow demo={demo} status={status} isDemoStation={isDemo} issueCount={station.demo.issues.length} station={station} />
              {isDemo ? <AkardTwin demo={demo} selected={asset} onSelect={(id) => { setAsset(id); setDrawerOpen(true); }} /> : (
                <section aria-labelledby="loc-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                  <h2 id="loc-h" className="sr-only">Station location map</h2>
                  <StationFocusMap station={station} />
                  <p className="px-4 py-2.5 text-xs text-gray-700 border-t border-gray-100">Real map position from the station&apos;s coordinates. No station layout or asset positions are modeled for this station, so none are drawn.</p>
                </section>
              )}
              <LowerStrip demo={demo} isDemoStation={isDemo} issues={station.demo.issues} station={station} />
              <section id="station-demo" aria-labelledby="demo-h" className="scroll-mt-28 rounded-2xl border border-gray-200 bg-white shadow-sm p-5 space-y-3">
                <div className="flex flex-wrap items-baseline justify-between gap-2"><h2 id="demo-h" className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>Autonomous demo · {station.name}</h2><DemoBadge /></div>
                <LoopDemo scene={scenarioForStation(station)} />
              </section>
              <DataSources stationKey={station.key} />
            </>
          )}
        </div>
        {allowed && (
          <div id="side-drawer" data-testid="side-drawer" aria-hidden={!drawerOpen} inert={!drawerOpen}
            className={`xl:sticky xl:top-20 overflow-hidden xl:overflow-visible transition-all duration-300 ease-out motion-reduce:transition-none ${drawerOpen ? "opacity-100 translate-x-0 max-h-[4000px] visible" : "opacity-0 xl:translate-x-full max-h-0 invisible"}`}>
            {isDemo ? <AssetDrawer demo={demo} assetId={asset} /> : <IssuesDrawer station={station} />}
          </div>
        )}
      </div>
    </article>
  );
}
