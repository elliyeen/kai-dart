import { PROVIDERS, TECHNICIANS } from "@/lib/vendors";
import { SCENARIOS } from "@/lib/scenarios";

const th = "text-left text-xs uppercase tracking-wider text-gray-700 font-semibold px-3 py-2", td = "px-3 py-2 text-sm align-top";
const DOT: Record<string, string> = { "On site": "#2563EB", "Accepted a ticket": "#D97706", Available: "#16A34A", "Off shift": "#9CA3AF" };

export default function Contractors() {
  return (
    <div className="p-4 lg:p-8 space-y-8" data-testid="contractors">
      <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Contractors &amp; personnel</h1>
        <p className="text-sm text-gray-700 max-w-3xl">Who holds each contract, what it covers, how quickly they must respond, and which of their people have accepted a ticket or are on site. Names, contract references and IDs are sample placeholders until DART&rsquo;s contracts are loaded.</p></div>
      <section aria-labelledby="prov" className="space-y-3"><h2 id="prov" className="text-xl font-semibold">Service providers</h2>
        <div tabIndex={0} role="region" aria-label="Service providers table" className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
          <table className="w-full min-w-[900px]" data-testid="providers"><caption className="sr-only">Service providers and contracts</caption>
            <thead className="bg-gray-50"><tr><th className={th}>Provider</th><th className={th}>Type</th><th className={th}>Contract</th><th className={th}>Scope</th><th className={th}>Response target (Critical / High / Routine)</th><th className={th}>Owner at DART</th><th className={th}>Demo stations</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{PROVIDERS.map((p) => <tr key={p.id}><td className={`${td} font-semibold`}>{p.name}</td><td className={td}>{p.kind}</td><td className={`${td} font-mono text-xs`}>{p.contractRef}</td><td className={td}>{p.scope}</td><td className={`${td} tabular-nums`}>{p.respondMin.Critical} / {p.respondMin.High} / {p.respondMin.Routine} min</td><td className={td}>{p.owner}</td><td className={td}>{SCENARIOS.filter((s) => s.providerId === p.id).map((s) => s.station).join(", ") || "—"}</td></tr>)}</tbody>
          </table></div></section>
      <section aria-labelledby="ppl" className="space-y-3"><h2 id="ppl" className="text-xl font-semibold">Field personnel</h2>
        <p className="text-sm text-gray-700">Each technician acknowledges a ticket on their own device, checks in on site, and confirms completion. Their status below comes from those taps.</p>
        <div tabIndex={0} role="region" aria-label="Field personnel table" className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
          <table className="w-full min-w-[640px]" data-testid="personnel"><caption className="sr-only">Field personnel</caption>
            <thead className="bg-gray-50"><tr><th className={th}>ID</th><th className={th}>Technician</th><th className={th}>Provider</th><th className={th}>Status</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{TECHNICIANS.map((t) => <tr key={t.id}><td className={`${td} font-mono text-xs`}>{t.id}</td><td className={td}>{t.label}</td><td className={td}>{PROVIDERS.find((p) => p.id === t.providerId)!.name}</td><td className={td}><span className="inline-flex items-center gap-2"><span aria-hidden="true" className="w-2.5 h-2.5 rounded-sm" style={{ background: DOT[t.status] }} />{t.status}</span></td></tr>)}</tbody>
          </table></div></section>
    </div>
  );
}
