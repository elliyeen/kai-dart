"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { LINES, STATIONS, filterStations, type LineId } from "@/lib/stations";
import { effectiveStatus } from "@/lib/stations/effective";
import { useDemo } from "@/lib/demo/store";
import { LineFilter, StationRow } from "./ui";
import NetworkOverview from "./NetworkOverview";
import StationDetail from "./StationDetail";

export default function StationsBrowser() {
  const sp = useSearchParams();
  const router = useRouter();
  const demo = useDemo();
  const lineParam = sp.get("line");
  const line = (LINES.some((l) => l.id === lineParam) ? lineParam : null) as LineId | null;
  const q = sp.get("q") ?? "";
  const selKey = sp.get("station");
  const selected = STATIONS.find((s) => s.key === selKey) ?? null;

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const n = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) { if (v) n.set(k, v); else n.delete(k); }
    const qs = n.toString();
    router.replace(qs ? `/stations?${qs}` : "/stations", { scroll: false });
  }, [sp, router]);

  const list = useMemo(() => filterStations({ line, q }), [line, q]);
  const carry = new URLSearchParams(); if (line) carry.set("line", line); if (q) carry.set("q", q);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(320px,380px)_1fr] lg:h-[calc(100vh-7.5rem)]">
      <section aria-label="Station directory" className="order-2 lg:order-none lg:border-r border-gray-200 flex flex-col min-h-0">
        <div className="p-4 space-y-3 border-b border-gray-200">
          <h2 className="sr-only">Station directory</h2>
          <div className="relative">
            <label htmlFor="station-search" className="sr-only">Search stations</label>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
            <input id="station-search" type="search" value={q} placeholder="Search stations or cities" onChange={(e) => setParams({ q: e.target.value || null })}
              className="w-full min-h-11 pl-9 pr-3 border border-gray-300 rounded-md text-[15px] focus-visible:outline-2 focus-visible:outline-[#0057A8]" />
          </div>
          <LineFilter value={line} onChange={(l) => setParams({ line: l, station: null })} />
          <p className="text-sm text-gray-700" aria-live="polite" data-testid="result-count">{list.length} of {STATIONS.length} stations{line ? ` on the ${line} line` : ""}</p>
        </div>
        <ul className="overflow-y-auto grow" data-testid="station-list">
          {list.map((s) => (
            <li key={s.key}>
              <StationRow station={s} status={effectiveStatus(s, demo)} selected={s.key === selKey} href={`/stations/${s.key}`} onSelect={() => setParams({ station: s.key })} />
            </li>
          ))}
          {list.length === 0 && <li className="p-6 text-sm text-gray-800" data-testid="no-results">No stations match. Clear the search or choose another line.</li>}
        </ul>
      </section>
      <section aria-label="Detail" className="hidden lg:block overflow-y-auto min-h-0">
        {selected ? <div className="p-8 max-w-3xl"><StationDetail station={selected} /></div> : <NetworkOverview line={line} onSelect={(k) => setParams({ station: k })} />}
      </section>
      <section aria-label="Network summary" className="order-1 lg:hidden border-b border-gray-200"><NetworkOverview line={line} onSelect={() => undefined} /></section>
    </div>
  );
}
