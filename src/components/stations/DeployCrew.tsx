"use client";
import Link from "next/link";
import { useState } from "react";
import { Check } from "lucide-react";
import { logAudit } from "@/lib/audit";
import { PROVIDERS, TECHNICIANS } from "@/lib/vendors";
import { PRIORITY_LABEL, setTicketStatus, submitTicket, type Priority, type Ticket } from "@/lib/tickets";
import type { Station } from "@/lib/stations";

const chip = (on: boolean) => `min-h-11 px-4 rounded-md border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${on ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`;
const field = "w-full min-h-11 border border-gray-300 rounded-md px-3 bg-white text-sm focus-visible:outline-2 focus-visible:outline-[#0057A8]";
export const DEPLOY_PREFIX = "Crew deployed: ";

/** Simulated crew deployment: records a ticket and an audit entry in this browser only. No crew, device or DART system is contacted. */
export default function DeployCrew({ station }: { station: Station }) {
  const [providerId, setProviderId] = useState(PROVIDERS[0].id);
  const [priority, setPriority] = useState<Priority>("high");
  const [notes, setNotes] = useState("");
  const [done, setDone] = useState<{ t: Ticket; provider: string; tech: string } | null>(null);
  const provider = PROVIDERS.find((p) => p.id === providerId)!;
  const techs = TECHNICIANS.filter((t) => t.providerId === providerId);
  const tech = techs.find((t) => t.status === "Available") ?? techs[0];

  if (done) return (
    <div data-testid="deploy-done" className="space-y-3">
      <p className="inline-flex items-center gap-2 text-2xl text-black" style={{ fontWeight: 800 }}><Check className="w-6 h-6 text-green-700" aria-hidden="true" />Crew deployed (simulation)</p>
      <p className="text-black"><strong>{done.provider}</strong> · technician {done.tech} → {station.name} · {PRIORITY_LABEL[done.t.priority]} · reference <strong data-testid="deploy-ref">{done.t.ref}</strong></p>
      <p className="text-sm text-black">Saved in this browser only. No crew was contacted and nothing was sent to DART or any dispatch system.</p>
      <Link href={`/stations/ticket?ref=${encodeURIComponent(done.t.ref)}`} className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">Track this deployment</Link>
    </div>
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const t = submitTicket({ stationKey: station.key, stationName: station.name, typeLabel: `${DEPLOY_PREFIX}${provider.name}`, priority, notes: notes.trim() || `Crew deployment requested for ${station.name}.`, reportedBy: "Operations Command" });
    setTicketStatus(t.ref, "in_progress");
    logAudit({ actor: "demo.ops", role: "Operations Command", action: "deploy_crew", entityType: "ticket", entityId: t.ref, input: `${provider.name} · ${tech.id} → ${station.name} · ${priority}`, output: `Crew deployed to ${station.name} (simulation)`, owner: provider.owner });
    setDone({ t: { ...t, status: "in_progress" }, provider: provider.name, tech: tech.id });
  };

  return (
    <form onSubmit={submit} className="space-y-6" data-testid="deploy-form">
      <p className="text-sm text-black">Send a crew to <strong>{station.name}</strong>. Work goes to the contract holder for the scope you choose.</p>
      <label className="block"><span className="block text-sm font-semibold mb-1.5">Crew</span>
        <select className={field} value={providerId} onChange={(e) => setProviderId(e.target.value)} data-testid="deploy-crew">{PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <span className="mt-1.5 block text-xs text-black">{provider.scope} · {provider.kind === "Contractor" ? `Contract ${provider.contractRef} (sample)` : "DART in-house"} · responds in {provider.respondMin[PRIORITY_LABEL[priority] as "Critical" | "High" | "Routine"]} min or less</span></label>
      <fieldset><legend className="text-sm font-semibold mb-1.5">Priority</legend>
        <div className="flex flex-wrap gap-2">{(Object.keys(PRIORITY_LABEL) as Priority[]).map((p) => <button key={p} type="button" aria-pressed={priority === p} data-testid={`deploy-priority-${p}`} className={chip(priority === p)} onClick={() => setPriority(p)}>{PRIORITY_LABEL[p]}</button>)}</div></fieldset>
      <p className="text-sm text-black border border-gray-200 rounded-lg p-3">Technician <strong>{tech.id}</strong> · {tech.label} · currently <em>{tech.status.toLowerCase()}</em> (sample status)</p>
      <label className="block"><span className="block text-sm font-semibold mb-1.5">Instructions</span>
        <textarea rows={3} className={`${field} py-2`} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What should the crew do and where?" /></label>
      <div className="flex justify-end border-t border-gray-200 pt-4"><button type="submit" data-testid="deploy-submit" className="min-h-11 px-6 rounded-md bg-[#0057A8] text-white font-semibold">Deploy crew</button></div>
    </form>
  );
}
