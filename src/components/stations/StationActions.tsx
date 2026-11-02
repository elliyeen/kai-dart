"use client";
import { useState } from "react";
import { AlertTriangle, PlayCircle, Truck } from "lucide-react";
import type { Station } from "@/lib/stations";
import { useTickets } from "@/lib/tickets";
import Sheet from "./Sheet";
import ReportForm from "./ReportForm";
import DeployCrew, { DEPLOY_PREFIX } from "./DeployCrew";

/** Per-station actions: report an issue, deploy a crew (both simulated and stored in this browser), and jump to the station's autonomous demo. */
export default function StationActions({ station, canDeploy, roleLabel }: { station: Station; canDeploy: boolean; roleLabel: string }) {
  const [open, setOpen] = useState<"report" | "deploy" | null>(null);
  const deployed = useTickets().filter((t) => !t.seeded && t.stationKey === station.key && t.typeLabel.startsWith(DEPLOY_PREFIX));
  const btn = "min-h-11 px-5 rounded-md inline-flex items-center gap-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] transition-colors duration-200 motion-reduce:transition-none";
  return (
    <section aria-label="Station actions" data-testid="station-actions" className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" data-testid="act-report" onClick={() => setOpen("report")} className={`${btn} bg-[#0B1F33] text-white hover:bg-black`}><AlertTriangle className="w-4 h-4" aria-hidden="true" />Report an issue</button>
        <button type="button" data-testid="act-deploy" disabled={!canDeploy} aria-describedby={canDeploy ? undefined : "deploy-hint"} onClick={() => setOpen("deploy")} className={`${btn} bg-[#0057A8] text-white hover:bg-[#004a8f] disabled:bg-gray-200 disabled:text-black disabled:cursor-not-allowed`}><Truck className="w-4 h-4" aria-hidden="true" />Deploy crew</button>
        <a href="#station-demo" data-testid="act-demo" className={`${btn} border border-gray-300 bg-white text-black hover:bg-gray-50`}><PlayCircle className="w-4 h-4" aria-hidden="true" />Autonomous demo</a>
      </div>
      {!canDeploy && <p id="deploy-hint" data-testid="deploy-hint" className="text-xs text-black">Viewing as {roleLabel}. Only Operations can deploy a crew (role switching is a simulation); switch role to enable it.</p>}
      {deployed.length > 0 && (
        <ul className="text-sm text-black space-y-1" data-testid="deployed-list" aria-label="Crews deployed from this browser">
          {deployed.map((t) => <li key={t.ref}><strong>{t.typeLabel.slice(DEPLOY_PREFIX.length)}</strong> deployed (simulation) · {t.ref}</li>)}
        </ul>
      )}
      <Sheet open={open === "report"} onClose={() => setOpen(null)} title={`Report an issue · ${station.name}`} testId="sheet-report"><ReportForm stationKey={station.key} embedded /></Sheet>
      <Sheet open={open === "deploy"} onClose={() => setOpen(null)} title={`Deploy crew · ${station.name}`} testId="sheet-deploy"><DeployCrew station={station} /></Sheet>
    </section>
  );
}
