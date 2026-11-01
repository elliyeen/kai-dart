"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { Search } from "lucide-react";
import { LINES, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";
import LineDirectory, { LinePicker } from "./LineDirectory";
import NetworkOverview from "./NetworkOverview";

export default function StationsBrowser() {
  const sp = useSearchParams();
  const router = useRouter();
  const lineParam = sp.get("line");
  const line = (LINES.some((l) => l.id === lineParam) ? lineParam : null) as LineId | null;
  const q = sp.get("q") ?? "";
  const go = (key: string) => router.push(`/stations/${key}`);

  const setParams = useCallback((patch: Record<string, string | null>) => {
    const n = new URLSearchParams(sp.toString());
    for (const [k, v] of Object.entries(patch)) { if (v) n.set(k, v); else n.delete(k); }
    const qs = n.toString();
    router.replace(qs ? `/stations?${qs}` : "/stations", { scroll: false });
  }, [sp, router]);

  const recs = useMemo(() => {
    const t = q.trim().toLowerCase();
    return STATION_RECORDS.filter((r) => (!line || r.lineId === line) && (!t || r.name.toLowerCase().includes(t) || r.city.toLowerCase().includes(t)));
  }, [line, q]);
  const uniq = useMemo(() => new Set(recs.map((r) => r.name)).size, [recs]);

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-[minmax(340px,400px)_1fr] lg:grid-rows-1 lg:h-[calc(100dvh-var(--chrome,7.5rem))]">
      <section aria-label="Station directory" className="relative order-2 lg:order-none lg:col-start-1 lg:row-start-1 lg:border-r border-gray-200 flex flex-col min-h-0 lg:overflow-y-auto">
        <div className="p-4 space-y-3 border-b border-gray-200">
          <h2 className="sr-only">Station directory by line</h2>
          <div className="relative">
            <label htmlFor="station-search" className="sr-only">Search stations</label>
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" aria-hidden="true" />
            <input id="station-search" type="search" value={q} placeholder="Search stations or cities" onChange={(e) => setParams({ q: e.target.value || null })}
              className="w-full min-h-11 pl-9 pr-3 border border-gray-300 rounded-md text-[15px] focus-visible:outline-2 focus-visible:outline-[#0057A8]" />
          </div>
          <LinePicker value={line} onChange={(l) => setParams({ line: l })} />
          <p className="text-sm text-gray-700" aria-live="polite" data-testid="result-count">{uniq} of {STATIONS.length} stations{line ? ` on the ${line} line` : ""} · {recs.length} line entries</p>
        </div>
        <div className="grow"><LineDirectory records={recs} line={line} /></div>
      </section>
      <section aria-label="Network overview" className="relative order-1 lg:order-none lg:col-start-2 lg:row-start-1 lg:overflow-y-auto min-h-0 border-b border-gray-200 lg:border-b-0">
        <NetworkOverview line={line} onSelect={go} />
      </section>
    </div>
  );
}
