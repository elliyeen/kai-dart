"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ASSET_COUNTS, type AssetKey } from "@/lib/stations/assets.generated";
import { ASSET_META, assetsFor } from "@/lib/stations/readiness";
import { LINES, LINE_BY_ID, STATION_RECORDS } from "@/lib/stations";
import { DemoBadge, LineDot } from "./ui";

export default function AssetsView() {
  const sp = useSearchParams(), router = useRouter();
  const type = (ASSET_META.some((m) => m.key === sp.get("type")) ? sp.get("type") : "elevators") as AssetKey;
  const meta = ASSET_META.find((m) => m.key === type)!;
  const all = assetsFor(STATION_RECORDS.map((r) => r.id)).byType[type];
  const rows = STATION_RECORDS.filter((r) => ASSET_COUNTS[r.id]).map((r) => { const a = ASSET_COUNTS[r.id]; return { r, total: a[type], ok: a[`${type}_ok`], down: a[type] - a[`${type}_ok`] }; }).sort((a, b) => b.down - a.down || a.r.name.localeCompare(b.r.name));
  const pct = (ok: number, t: number) => (t ? Math.round((ok / t) * 100) : 100);
  const btn = "min-h-11 px-3.5 rounded-full border text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]";
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-6xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><p className="text-xs tracking-[0.2em] uppercase text-gray-700">Asset dashboards</p><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>{meta.label}</h1><p className="text-gray-800">{meta.blurb}</p></div>
        <DemoBadge />
      </div>
      <div role="group" aria-label="Asset type" className="flex flex-wrap gap-2">
        {ASSET_META.map((m) => <button key={m.key} type="button" aria-pressed={m.key === type} onClick={() => router.replace(`/stations/assets?type=${m.key}`, { scroll: false })} className={`${btn} ${m.key === type ? "bg-[#0B1F33] text-white border-[#0B1F33]" : "bg-white border-gray-300 hover:bg-gray-50"}`}>{m.label}</button>)}
      </div>
      <p className="text-sm border border-amber-300 bg-amber-50 text-amber-950 rounded-md p-3"><strong>Synthetic demo counts.</strong> These unit counts come from the original demo. No asset inventory has been verified for any station, so none of these are DART facts. Only {STATION_RECORDS.filter((r) => ASSET_COUNTS[r.id]).length} of {STATION_RECORDS.length} line-station entries carry demo counts.</p>
      <div className="grid sm:grid-cols-4 gap-3" data-testid="asset-summary">
        <div className="rounded-2xl border p-4 bg-white"><p className="text-xs uppercase tracking-wider text-gray-700">Units</p><p className="text-3xl" style={{ fontWeight: 300 }}>{all.total}</p></div>
        <div className="rounded-2xl border p-4 bg-white"><p className="text-xs uppercase tracking-wider text-gray-700">Down</p><p className="text-3xl text-red-800" style={{ fontWeight: 300 }} data-testid="asset-down">{all.total - all.ok}</p></div>
        <div className="rounded-2xl border p-4 bg-white"><p className="text-xs uppercase tracking-wider text-gray-700">Uptime</p><p className="text-3xl text-green-800" style={{ fontWeight: 300 }}>{pct(all.ok, all.total)}%</p></div>
        <div className="rounded-2xl border p-4 bg-white"><p className="text-xs uppercase tracking-wider text-gray-700">Up</p><p className="text-3xl" style={{ fontWeight: 300 }}>{all.ok}</p></div>
      </div>
      <div className="grid sm:grid-cols-5 gap-3">
        {LINES.map((l) => { const a = assetsFor(STATION_RECORDS.filter((r) => r.lineId === l.id).map((r) => r.id)).byType[type]; return (
          <div key={l.id} className="rounded-2xl border bg-white p-3"><p className="flex items-center gap-2 text-sm" style={{ fontWeight: 700 }}><LineDot lineId={l.id} />{l.short}</p><p className="text-2xl" style={{ fontWeight: 300 }}>{pct(a.ok, a.total)}%</p><p className="text-xs text-gray-700">{a.ok}/{a.total} up · {a.total - a.ok} down</p></div>); })}
      </div>
      <div>
        <h2 className="text-xs tracking-[0.2em] uppercase text-gray-800 mb-2" style={{ fontWeight: 600 }}>Stations — sorted by units down</h2>
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white" tabIndex={0} role="region" aria-label="Stations by units down, scrollable">
          <table className="w-full text-sm text-left" data-testid="assets-table"><caption className="sr-only">Synthetic demo {meta.label} counts per line-station entry</caption>
            <thead><tr className="text-[11px] uppercase tracking-wider text-gray-700 border-b"><th scope="col" className="p-3">Station</th><th scope="col" className="p-3">Line</th><th scope="col" className="p-3 text-right">Units</th><th scope="col" className="p-3 text-right">Down</th><th scope="col" className="p-3 text-right">Uptime</th></tr></thead>
            <tbody>{rows.map(({ r, total, down, ok }) => (
              <tr key={r.id} className="border-b border-gray-100"><th scope="row" className="p-3 font-medium"><Link href={`/stations/${r.id}`} className="inline-flex items-center min-h-11 hover:underline">{r.name}</Link></th><td className="p-3"><span className="inline-flex items-center gap-2"><LineDot lineId={r.lineId} />{LINE_BY_ID[r.lineId].short}</span></td><td className="p-3 text-right">{total}</td><td className="p-3 text-right" style={{ color: down ? "#B91C1C" : undefined, fontWeight: down ? 700 : 400 }}>{down}</td><td className="p-3 text-right">{pct(ok, total)}%</td></tr>))}</tbody></table>
        </div>
      </div>
    </div>
  );
}
