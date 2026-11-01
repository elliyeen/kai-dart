import Link from "next/link";
import { SCENARIOS } from "@/lib/scenarios";

const PRI: Record<string, string> = { Critical: "border-red-200 bg-red-50 text-red-900", High: "border-amber-200 bg-amber-50 text-amber-900", Routine: "border-slate-200 bg-slate-50 text-slate-800" };
const th = "text-left text-xs uppercase tracking-wider text-gray-700 font-semibold px-3 py-2", td = "px-3 py-2 text-sm align-top";

export default function Scenarios() {
  return (
    <div className="p-4 lg:p-8 space-y-8 max-w-6xl" data-testid="scenarios">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Test case scenarios</h1>
          <p className="text-sm text-gray-700 max-w-3xl">The four stations in the auto demo, each with its trigger, every step&rsquo;s actor, input, output and owner, and the criteria that make it pass.</p></div>
        <Link href="/stations/loop" className="min-h-11 px-4 inline-flex items-center rounded-md bg-[#0057A8] text-white font-semibold">Watch the auto demo</Link>
      </div>
      <nav aria-label="Scenarios" className="flex flex-wrap gap-2">{SCENARIOS.map((s) => <a key={s.id} href={`#${s.id}`} className="min-h-11 px-4 inline-flex items-center rounded-full border border-gray-300 text-sm hover:bg-gray-50">{s.station}</a>)}</nav>
      {SCENARIOS.map((s) => (
        <section key={s.id} id={s.id} data-testid={`scenario-${s.id}`} aria-labelledby={`h-${s.id}`} className="border border-gray-200 rounded-xl overflow-hidden scroll-mt-40">
          <header className="p-5 bg-slate-50 border-b border-gray-200 flex flex-wrap items-start justify-between gap-3">
            <div><p className="text-xs uppercase tracking-wider text-gray-700">{s.testId} · {s.line} · {s.station}</p><h2 id={`h-${s.id}`} className="text-2xl text-gray-900" style={{ fontWeight: 700 }}>{s.title}</h2></div>
            <span className={`border rounded-full px-3 py-1 text-sm ${PRI[s.priority]}`}>{s.priority} priority · about {s.sampleMinutes} min sample</span>
          </header>
          <div className="p-5 space-y-5">
            <dl className="grid sm:grid-cols-3 gap-4 text-sm">
              <div><dt className="text-xs uppercase tracking-wider text-gray-700">Starting point</dt><dd className="mt-1">{s.precondition}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-gray-700">Trigger</dt><dd className="mt-1">{s.trigger}</dd></div>
              <div><dt className="text-xs uppercase tracking-wider text-gray-700">Expected result</dt><dd className="mt-1">{s.expected}</dd></div>
            </dl>
            <div tabIndex={0} role="region" aria-label={`${s.station} steps`} className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
              <table className="w-full min-w-[820px]"><caption className="sr-only">{s.testId} steps</caption>
                <thead className="bg-gray-50"><tr><th className={th}>#</th><th className={th}>Stage</th><th className={th}>Actor</th><th className={th}>Input</th><th className={th}>Output</th><th className={th}>Owner</th></tr></thead>
                <tbody className="divide-y divide-gray-100">{s.steps.map((st, i) => <tr key={i} data-testid="scenario-step"><td className={td}>{i + 1}</td><td className={`${td} font-semibold`}>{st.stage}</td><td className={td}>{st.actor}</td><td className={td}>{st.input}</td><td className={td}>{st.output}</td><td className={td}>{st.owner}</td></tr>)}</tbody>
              </table>
            </div>
            <div><h3 className="text-sm font-semibold mb-2">Pass criteria</h3><ul className="grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm list-disc pl-5">{s.passCriteria.map((c) => <li key={c}>{c}</li>)}</ul></div>
          </div>
        </section>
      ))}
    </div>
  );
}
