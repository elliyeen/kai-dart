"use client";
import Link from "next/link";
import { STATIONS, type LineId } from "@/lib/stations";
import { EFF_RANK, effectiveStatus } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { PERSONA_BY_ROLE } from "@/lib/demo/roles";
import { DemoBadge, StatusIndicator } from "./ui";
import MapPanel from "./MapPanel";

function Stat({ n, label, id }: { n: number; label: string; id: string }) {
  return <div className="border border-gray-200 rounded-xl p-4"><p className="text-3xl font-light" data-testid={id}>{n}</p><p className="text-sm text-gray-800">{label}</p></div>;
}

export default function NetworkOverview({ line, onSelect }: { line: LineId | null; onSelect: (key: string) => void }) {
  const demo = useDemo();
  const persona = PERSONA_BY_ROLE[demo.role];
  const rows = STATIONS.map((s) => ({ s, e: effectiveStatus(s, demo) }));
  const count = (e: string) => rows.filter((r) => r.e === e).length;
  const queue = rows.filter((r) => r.e !== "good" && r.e !== "verified").sort((a, b) => EFF_RANK[a.e] - EFF_RANK[b.e] || a.s.demo.score - b.s.demo.score).slice(0, 5);
  const awaiting = demo.wo.status === "awaiting_verification" ? 1 : 0;
  const verified = demo.wo.status === "verified" ? 1 : 0;

  return (
    <section aria-labelledby="net-h" className="space-y-6 p-4 lg:p-8" data-testid="network-overview">
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div><h1 id="net-h" className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Network overview</h1>
          <p className="text-sm text-gray-700">Viewing as {persona.label} — {persona.blurb}</p></div>
        <DemoBadge />
      </div>
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <Stat n={count("critical")} label="Critical stations (synthetic)" id="stat-critical" />
        <Stat n={count("warning") + count("deploying")} label="Need attention (synthetic)" id="stat-attention" />
        <Stat n={awaiting} label="Awaiting independent verification" id="stat-awaiting" />
        <Stat n={verified} label="Verified resolved" id="stat-verified" />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Priority queue</h2>
        <ol className="border border-gray-200 rounded-xl divide-y divide-gray-100" data-testid="priority-queue">
          {queue.map(({ s, e }) => (
            <li key={s.key} className="flex items-center justify-between gap-3 px-4 min-h-14 py-2">
              <Link href={`/stations/${s.key}`} className="text-[15px] underline-offset-2 hover:underline min-h-11 inline-flex items-center">{s.name}</Link>
              <StatusIndicator status={e} size="sm" />
            </li>
          ))}
        </ol>
        {verified > 0 && <p className="mt-2 text-sm text-emerald-900" data-testid="verified-note">Akard: issue independently verified resolved (synthetic demo).</p>}
      </div>
      <details open className="border border-gray-200 rounded-xl"><summary className="cursor-pointer min-h-11 px-4 py-3 text-sm font-semibold">Network map</summary>
        <div className="p-4 pt-0"><MapPanel line={line} onSelect={onSelect} /></div></details>
    </section>
  );
}
