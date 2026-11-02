import Link from "next/link";
import { SCENARIOS, STAGES, STAGE_COLOR, stageStarts } from "@/lib/scenarios";
import { PROVIDER_BY_ID } from "@/lib/vendors";

const PRI: Record<string, string> = { Critical: "border-red-200 bg-red-50 text-red-900", High: "border-amber-200 bg-amber-50 text-amber-900", Routine: "border-slate-200 bg-slate-50 text-slate-800" };
const th = "text-left text-xs uppercase tracking-wider text-black font-semibold px-3 py-2", td = "px-3 py-2 text-sm align-top";

export default function Scenarios() {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl" data-testid="scenarios">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-4xl text-black" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Test case scenarios</h1>
          <p className="text-sm text-black max-w-3xl">The four stations in the auto demo, each with its trigger, every step&rsquo;s actor, input, output and owner, and the criteria that make it pass.</p></div>
        <Link href="/stations/loop" className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">Watch the auto demo</Link>
      </div>
      <nav aria-label="Scenarios" className="flex flex-wrap gap-2">{SCENARIOS.map((s) => <a key={s.id} href={`#${s.id}`} className="min-h-11 px-4 inline-flex items-center rounded-md border border-gray-300 text-sm hover:bg-gray-50">{s.station}</a>)}</nav>
      {SCENARIOS.map((s) => (
        <section key={s.id} id={s.id} data-testid={`scenario-${s.id}`} aria-labelledby={`h-${s.id}`} className="border border-gray-200 rounded-xl overflow-hidden scroll-mt-40">
          <header className="p-5 bg-slate-50 border-b border-gray-200 flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs uppercase tracking-wider text-black">{s.testId} · {s.line} · {s.station}</p><h2 id={`h-${s.id}`} className="text-2xl text-black" style={{ fontWeight: 700 }}>{s.title}</h2></div>
            <span className={`border rounded px-3 py-1 text-sm ${PRI[s.priority]}`}>{s.priority} priority · {s.totalMin} min sample</span>
          </header>
          <div className="p-5 space-y-5">
            <dl className="grid sm:grid-cols-3 gap-4 text-sm">
              <div><dt className="text-xs uppercase tracking-wider text-black">Starting point</dt><dd className="mt-1">{s.precondition}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-black">Trigger</dt><dd className="mt-1">{s.trigger}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-black">Expected result</dt><dd className="mt-1">{s.expected}</dd></div>
            </dl>
            <dl className="grid sm:grid-cols-4 gap-4 text-sm border border-gray-200 rounded-lg p-4 bg-gray-50">
              <div><dt className="text-xs uppercase tracking-wider text-black">Responsible party</dt><dd className="mt-1 font-semibold">{PROVIDER_BY_ID[s.providerId].name}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-black">Contract</dt><dd className="mt-1">{PROVIDER_BY_ID[s.providerId].kind === "Contractor" ? PROVIDER_BY_ID[s.providerId].contractRef : "DART in-house"}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-black">Technician</dt><dd className="mt-1">{s.technician}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-black">Response target</dt><dd className="mt-1">{PROVIDER_BY_ID[s.providerId].respondMin[s.priority]} min to accept · resolve in {s.slaResolveMin} min</dd></div>
            </dl>
            <div><h3 className="text-sm font-semibold mb-2">Time in each stage (sample)</h3>
              <ol className="flex flex-wrap gap-2 text-xs">{STAGES.map((g, gi) => { const st = stageStarts(s); const next = gi < STAGES.length - 1 ? st[STAGES[gi + 1]] : s.totalMin; return <li key={g} className="border border-gray-200 rounded-md px-2.5 py-1.5"><span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-sm mr-1.5" style={{ background: STAGE_COLOR[g] }} />{g}: <strong>{gi === STAGES.length - 1 ? `closed at ${s.totalMin} min` : `${next - st[g]} min`}</strong></li>; })}</ol></div>
            <div tabIndex={0} role="region" aria-label={`${s.station} steps`} className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
              <table className="w-full min-w-[820px]"><caption className="sr-only">{s.testId} steps</caption>
                <thead className="bg-gray-50"><tr><th className={th}>#</th><th className={th}>Time</th><th className={th}>Stage</th><th className={th}>Actor</th><th className={th}>Input</th><th className={th}>Output</th><th className={th}>Owner</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{s.steps.map((st, i) => <tr key={i} data-testid="scenario-step"><td className={td}>{i + 1}</td><td className={`${td} tabular-nums whitespace-nowrap`}>{st.atMin} min</td><td className={`${td} font-semibold whitespace-nowrap`}><span aria-hidden="true" className="inline-block w-2.5 h-2.5 rounded-sm mr-2" style={{ background: st.blocked ? "#7C3AED" : STAGE_COLOR[st.stage] }} />{st.blocked ? "Waiting on parts" : st.stage}</td><td className={td}>{st.actor}</td><td className={td}>{st.input}</td><td className={td}>{st.output}</td><td className={td}>{st.owner}</td></tr>)}</tbody>
              </table>
            </div>
            <div><h3 className="text-sm font-semibold mb-2">Pass criteria</h3><ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-disc pl-5">{s.passCriteria.map((c) => <li key={c}>{c}</li>)}</ul></div>
          </div>
        </section>
      ))}
    </div>
  );
}
