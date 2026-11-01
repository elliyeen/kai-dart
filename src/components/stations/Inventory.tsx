"use client";
import { useMemo, useState } from "react";
import { STATIONS, STATION_RECORDS, LINE_BY_ID } from "@/lib/stations";
import { ASSET_COUNTS, type AssetKey } from "@/lib/stations/assets.generated";
import { ASSET_META } from "@/lib/stations/readiness";
import { ASSET_OWNER, DATA_DICTIONARY } from "@/lib/dictionary";

interface Unit { id: string; type: AssetKey; label: string; ok: boolean; line: string; record: string }

export default function Inventory() {
  const sorted = useMemo(() => [...STATIONS].sort((a, b) => a.name.localeCompare(b.name)), []);
  const [key, setKey] = useState(sorted.find((s) => s.name === "Akard")?.key ?? sorted[0].key);
  const station = STATIONS.find((s) => s.key === key)!;
  const units = useMemo(() => {
    const out: Unit[] = [];
    for (const rid of station.recordIds) {
      const c = ASSET_COUNTS[rid]; if (!c) continue;
      const line = STATION_RECORDS.find((r) => r.id === rid)!.lineId;
      for (const m of ASSET_META) for (let i = 1; i <= c[m.key]; i++)
        out.push({ id: `${ASSET_OWNER[m.key].prefix}-${station.name.replace(/[^A-Za-z]/g, "").slice(0, 6).toUpperCase()}-${LINE_BY_ID[line].short.slice(0, 1)}${String(i).padStart(2, "0")}`, type: m.key, label: m.label, ok: i <= c[`${m.key}_ok`], line: LINE_BY_ID[line].name, record: rid });
    }
    return out;
  }, [station]);
  const down = units.filter((u) => !u.ok).length;
  const th = "text-left text-xs uppercase tracking-wider text-gray-700 font-semibold px-3 py-2";
  const td = "px-3 py-2 text-sm";
  return (
    <div className="p-4 lg:p-8 space-y-8" data-testid="inventory">
      <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Inventory &amp; asset control</h1>
        <p className="text-sm text-gray-700 max-w-3xl">Every monitored asset has an ID, a station, an owning team, an input source and an output. Counts shown are sample data until DART&rsquo;s asset inventory is imported.</p></div>
      <section aria-labelledby="reg" className="space-y-3">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="reg" className="text-xl font-semibold">Asset register</h2>
          <label className="text-sm flex items-center gap-2">Station
            <select data-testid="inv-station" className="min-h-11 border border-gray-300 rounded-md px-3 bg-white" value={key} onChange={(e) => setKey(e.target.value)}>{sorted.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}</select></label>
        </div>
        <p className="text-sm text-gray-800" data-testid="inv-summary">{units.length} assets · {units.length - down} in service · {down} out of service</p>
        <div tabIndex={0} role="region" aria-label="Asset register table" className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
          <table className="w-full min-w-[760px]" data-testid="inv-table"><caption className="sr-only">Asset register for {station.name}</caption>
            <thead className="bg-gray-50"><tr><th className={th}>Asset ID</th><th className={th}>Type</th><th className={th}>Line</th><th className={th}>Status</th><th className={th}>Owner</th><th className={th}>Input</th><th className={th}>Output</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{units.map((u) => { const o = ASSET_OWNER[u.type]; return (
              <tr key={u.id + u.record} data-testid="inv-row"><td className={`${td} font-mono`}>{u.id}</td><td className={td}>{u.label.replace(/s$/, "")}</td><td className={td}>{u.line}</td>
                <td className={td}><span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs ${u.ok ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-red-200 bg-red-50 text-red-900"}`}>{u.ok ? "In service" : "Out of service"}</span></td>
                <td className={td}>{o.team}</td><td className={`${td} text-gray-700`}>{o.input}</td><td className={`${td} text-gray-700`}>{o.output}</td></tr>); })}</tbody>
          </table>
        </div>
      </section>
      <section aria-labelledby="dict" className="space-y-3">
        <h2 id="dict" className="text-xl font-semibold">What KAI records: input, output and owner</h2>
        <p className="text-sm text-gray-700 max-w-3xl">Everything KAI monitors lives in one database, one table per record type, defined in <code>docs/db/schema.sql</code>.</p>
        <div tabIndex={0} role="region" aria-label="Data dictionary table" className="overflow-x-auto border border-gray-200 rounded-lg focus-visible:outline-2 focus-visible:outline-[#0057A8]">
          <table className="w-full min-w-[820px]" data-testid="dictionary"><caption className="sr-only">Data dictionary</caption>
            <thead className="bg-gray-50"><tr><th className={th}>Record</th><th className={th}>Table</th><th className={th}>Input</th><th className={th}>Output</th><th className={th}>Owner</th></tr></thead>
            <tbody className="divide-y divide-gray-100">{DATA_DICTIONARY.map((d) => <tr key={d.entity}><td className={`${td} font-semibold`}>{d.entity}</td><td className={`${td} font-mono text-xs`}>{d.table}</td><td className={td}>{d.input}</td><td className={td}>{d.output}</td><td className={td}>{d.owner}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
