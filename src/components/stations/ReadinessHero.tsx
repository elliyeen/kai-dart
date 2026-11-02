"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Building2, CheckCircle2, Clock, OctagonAlert, TriangleAlert } from "lucide-react";
import { useDemo } from "@/lib/demo/store";
import { overall, recordStatus, scoreTone, type RecStatus } from "@/lib/stations/readiness";
import { ISSUE_LABELS, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";
import { effectiveStatus } from "@/lib/stations/effective";
import { DemoBadge, StatusIndicator } from "./ui";
import MapPanel from "./MapPanel";

function Tile({ id, Icon, label, n, tone }: { id: string; Icon: typeof Clock; label: string; n: number; tone: string }) {
  return <div className="border border-gray-200 rounded-xl p-3 bg-white flex items-center gap-2.5 min-w-0"><Icon className="w-7 h-7 shrink-0" style={{ color: tone }} aria-hidden="true" /><div><p className="text-xs leading-tight">{label}</p><p className="text-3xl leading-none mt-1" style={{ fontWeight: 600 }} data-testid={id}>{n}</p></div></div>;
}

/** Design A — Executive Command. Every number is computed from the app's synthetic demo records and labelled as such. */
export default function ReadinessHero({ line, onOpen }: { line: LineId | null; onOpen: (key: string) => void }) {
  const demo = useDemo();
  const o = overall(demo);
  const [sel, setSel] = useState("akard");
  const buckets = useMemo(() => {
    let ready = 0, attention = 0, critical = 0, pending = 0;
    for (const st of STATIONS) {
      const ss: RecStatus[] = STATION_RECORDS.filter((r) => st.recordIds.includes(r.id)).map((r) => recordStatus(r, demo));
      if (ss.includes("critical")) critical++;
      else if (ss.some((s) => s === "warning" || s === "assigned" || s === "deploying")) attention++;
      else if (ss.includes("awaiting")) pending++;
      else if (ss.every((s) => s === "closed")) continue;
      else ready++;
    }
    return { ready, attention, critical, pending };
  }, [demo]);
  const station = STATIONS.find((s) => s.key === sel) ?? STATIONS[0];
  const recs = STATION_RECORDS.filter((r) => station.recordIds.includes(r.id));
  const score = Math.round(recs.reduce((n, r) => n + r.demo.score, 0) / recs.length);
  const issues = [...new Set(recs.flatMap((r) => r.demo.issues))];
  const eff = effectiveStatus(station, demo);
  return (
    <div data-testid="readiness-hero" className="space-y-4">
      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6">
        <div className="space-y-5 min-w-0">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase" style={{ fontWeight: 600 }}>DART station intelligence</p>
            <h1 id="net-h" className="text-4xl lg:text-5xl mt-2 leading-[1.05]" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Station Readiness Command Center</h1>
            <p className="text-xl mt-2">Clean. Safe. Accessible. Ready.</p>
          </div>
          <div className="grid lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] gap-6 items-start">
            <div>
              <div>
                <p className="text-sm" style={{ fontWeight: 600 }}>Network readiness <DemoBadge /></p>
                <p className="text-6xl mt-1 leading-none" style={{ fontWeight: 800, color: scoreTone(o.avg) }}><span data-testid="stat-avg">{o.avg}</span><span className="text-3xl">/100</span></p>
                <div className="mt-3 h-2 rounded bg-gray-200" role="img" aria-label={`Network readiness ${o.avg} out of 100, synthetic demo`}><div className="h-2 rounded" style={{ width: `${o.avg}%`, background: scoreTone(o.avg) }} /></div>
                <p className="text-xs mt-2">Average of the synthetic demo scores across all {o.records} line-station entries.</p>
              </div>
            </div>
            <div className="min-w-0"><MapPanel line={line} selectedKey={sel} onSelect={setSel} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-3">
            <Tile id="stat-stations" Icon={Building2} label="Stations" n={STATIONS.length} tone="#0B1F33" />
            <Tile id="stat-ready" Icon={CheckCircle2} label="Ready" n={buckets.ready} tone="#15803D" />
            <Tile id="stat-attention" Icon={TriangleAlert} label="Needs attention" n={buckets.attention} tone="#B45309" />
            <Tile id="stat-critical" Icon={OctagonAlert} label="Critical" n={buckets.critical} tone="#B91C1C" />
            <Tile id="stat-awaiting" Icon={Clock} label="Verification pending" n={buckets.pending} tone="#0057A8" />
          </div>
          <p className="text-xs">Station counts are unique stations. Scores, statuses and issues are <strong>synthetic demo values</strong>, not DART data; line and station membership is from the original app. Verified resolved: <strong data-testid="stat-verified">{o.verified}</strong>.</p>
        </div>
        <aside aria-label="Selected station" data-testid="selected-station" className="border border-gray-200 rounded-xl p-5 bg-white self-start">
          <div className="flex items-start justify-between gap-3"><h2 className="text-2xl" style={{ fontWeight: 800, letterSpacing: "-0.01em" }}>{station.name}</h2><StatusIndicator status={eff} size="sm" /></div>
          <p className="text-sm mt-1">Synthetic demo condition · not live</p>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt>Readiness</dt><dd style={{ fontWeight: 700, color: scoreTone(score) }}>{score}/100</dd></div>
            <div className="flex justify-between border-b border-gray-100 pb-2"><dt>Lines served</dt><dd style={{ fontWeight: 600 }}>{recs.length}</dd></div>
            <div className="border-b border-gray-100 pb-2"><dt>Open issues</dt><dd className="mt-1" style={{ fontWeight: 600 }}>{issues.length ? issues.map((i) => ISSUE_LABELS[i] ?? i).join(" · ") : "None recorded"}</dd></div>
          </dl>
          <button type="button" onClick={() => onOpen(station.key)} data-testid="view-station" className="mt-4 w-full min-h-11 rounded-md bg-gray-100 hover:bg-gray-200 text-sm font-semibold inline-flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]">View station details <ArrowRight className="w-4 h-4" aria-hidden="true" /></button>
          <Link href="/stations/overview" className="mt-2 min-h-11 inline-flex items-center text-sm underline">Operations overview</Link>
        </aside>
      </div>
    </div>
  );
}
