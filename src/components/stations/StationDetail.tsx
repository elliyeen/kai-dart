"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getStationByAnyId, ISSUE_LABELS, LINE_BY_ID, STATION_RECORDS, type Station } from "@/lib/stations";
import { effectiveStatus } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { can } from "@/lib/demo/permissions";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import { AssignmentCard, EvidencePanel, VerificationTimeline } from "./workflow-ui";
import { DemoBadge, LineChips, ProvenanceNote, StatusIndicator } from "./ui";
import MapPanel from "./MapPanel";

export default function StationDetail({ station, backHref }: { station: Station; backHref?: string }) {
  const demo = useDemo();
  const status = effectiveStatus(station, demo);
  const isDemoStation = station.key === demo.wo.stationKey;
  const persona = PERSONA_BY_ROLE[demo.role];
  const allowed = can(demo.role, "view_station", { stationKey: station.key }) || can(demo.role, "view_work_order", { stationKey: station.key, actorId: persona.identity, assignedTo: demo.wo.assignedTo });

  return (
    <article aria-labelledby="st-h" className="space-y-6" data-testid="station-detail" data-station={station.key}>
      {backHref && <Link href={backHref} className="inline-flex items-center gap-1.5 min-h-11 text-sm text-gray-800 hover:text-black"><ArrowLeft className="w-4 h-4" aria-hidden="true" />All stations</Link>}
      <header className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 id="st-h" className="text-3xl font-light tracking-[-0.01em] text-gray-900">{station.name}</h1>
            <p className="text-sm text-gray-700">{station.city}</p>
          </div>
          <StatusIndicator status={status} />
        </div>
        <LineChips lineIds={station.lineIds} />
        <ProvenanceNote>
          <DemoBadge /> <span className="ml-1">Condition values are synthetic demo data. Last verified update: <strong>Not connected</strong> — no live DART feed or inspection source is used.</span>
        </ProvenanceNote>
        {station.closure && (
          <p className="text-sm border border-amber-300 bg-amber-50 text-amber-950 rounded-md p-3">
            <strong>Reported closure (unverified):</strong> {station.closure} DART&apos;s published schedule data has not been checked against this note.
          </p>
        )}
      </header>

      {!allowed ? (
        <p className="border border-gray-200 rounded-lg p-4 text-sm text-gray-800">The {persona.label} demo persona has no access to station condition detail. Switch role to continue.</p>
      ) : isDemoStation ? (
        <section aria-labelledby="iss-h" className="space-y-4">
          <h2 id="iss-h" className="text-lg font-semibold text-gray-900">Issue and verification</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <EvidencePanel kind="reported" caption="Reported condition — synthetic placeholder evidence" />
            {demo.wo.status === "awaiting_verification" || demo.wo.status === "verified"
              ? <EvidencePanel kind="proof" caption="Completion proof from crew — synthetic placeholder" />
              : <div className="rounded-lg border border-dashed border-gray-300 grid place-items-center text-sm text-gray-700 p-6 text-center">No completion proof yet.</div>}
          </div>
          <AssignmentCard demo={demo} />
          <VerificationTimeline events={demo.wo.events} />
        </section>
      ) : (
        <section aria-labelledby="iss-h" className="space-y-3">
          <h2 id="iss-h" className="text-lg font-semibold text-gray-900">Open issues <span className="font-normal text-sm text-gray-700">(synthetic)</span></h2>
          {station.demo.issues.length === 0 ? <p className="text-sm text-gray-800">No synthetic issue recorded for this station.</p> : (
            <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg">
              {station.demo.issues.map((i) => <li key={i} className="px-4 py-3 text-sm text-gray-900 flex justify-between gap-3"><span>{ISSUE_LABELS[i] ?? i}</span><span className="text-gray-600">Owner: unassigned</span></li>)}
            </ul>
          )}
          <p className="text-sm text-gray-700">The end-to-end verification workflow is demonstrated at <Link className="underline text-[#0057A8]" href="/stations/akard">Akard</Link>.</p>
        </section>
      )}

      <details open className="group border border-gray-200 rounded-lg">
        <summary className="cursor-pointer min-h-11 px-4 py-3 text-sm font-semibold text-gray-900">Station map</summary>
        <div className="p-4 pt-0"><MapPanel selectedKey={station.key} /></div>
      </details>

      <details className="border border-gray-200 rounded-lg">
        <summary className="cursor-pointer min-h-11 px-4 py-3 text-sm font-semibold text-gray-900">Assets and records</summary>
        <div className="p-4 pt-0 space-y-3 text-sm text-gray-800">
          <p><strong>Asset inventory:</strong> not verified for this station. No assets are shown as fact.</p>
          <p><strong>Original station records:</strong></p>
          <ul className="list-disc pl-5" data-testid="records">
            {station.recordIds.map((id) => { const r = STATION_RECORDS.find((x) => x.id === id)!; return <li key={id}><code className="text-xs">{id}</code> — {LINE_BY_ID[r.lineId].name}</li>; })}
          </ul>
        </div>
      </details>
    </article>
  );
}

export function stationOr404(id: string) { return getStationByAnyId(id); }
