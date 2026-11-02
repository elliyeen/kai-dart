"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { LINES, STATIONS, STATION_RECORDS, type LineId } from "@/lib/stations";
import LineDirectory, { LinePicker } from "./LineDirectory";
import NetworkOverview from "./NetworkOverview";

/** Command view = the full-width executive overview. The station directory lives behind a "Stations" dropdown (collapsed by default); opening a station goes to its full page. */
export default function StationsBrowser() {
  const sp = useSearchParams();
  const router = useRouter();
  const lineParam = sp.get("line");
  const line = (LINES.some((l) => l.id === lineParam) ? lineParam : null) as LineId | null;
  const q = sp.get("q") ?? "";
  const go = (key: string) => router.push(`/stations/${key}`);
  const [open, setOpen] = useState(() => q.trim() !== "");   // a deep link with a search term restores the open list
  const wrap = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  useEffect(() => { // the top-bar search icon links to #station-search
    const openFromHash = () => { if (window.location.hash === "#station-search") setOpen(true); };
    const id = window.setTimeout(openFromHash, 0);
    window.addEventListener("hashchange", openFromHash);
    return () => { window.clearTimeout(id); window.removeEventListener("hashchange", openFromHash); };
  }, []);
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    const click = (e: MouseEvent) => { if (wrap.current && !wrap.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", key); document.addEventListener("mousedown", click);
    return () => { document.removeEventListener("keydown", key); document.removeEventListener("mousedown", click); };
  }, [open]);

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
    <div className="flex flex-col min-h-0 lg:h-[calc(100dvh-var(--chrome,7.5rem))]">
      <div ref={wrap} className="relative z-30 shrink-0 flex justify-end px-4 lg:px-8 py-2 border-b border-gray-100">
        <div className="relative">
          <button ref={btn} type="button" data-testid="stations-dropdown" aria-expanded={open} aria-controls={panelId} onClick={() => setOpen((o) => !o)}
            className="min-h-11 inline-flex items-center gap-2 px-4 rounded-md border border-gray-300 bg-white text-sm shadow-sm hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]" style={{ fontWeight: 600 }}>
            Stations <span className="text-xs tabular-nums font-normal">{STATIONS.length}</span>
            <ChevronDown aria-hidden="true" className={`w-4 h-4 transition-transform duration-200 motion-reduce:transition-none ${open ? "rotate-180" : ""}`} />
          </button>
          {open && (
            <section id={panelId} aria-label="Station directory" data-testid="station-panel"
              className="fixed inset-x-0 bottom-0 top-16 z-40 bg-white border-t border-gray-200 flex flex-col overflow-hidden sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[420px] sm:max-h-[min(70vh,640px)] sm:rounded-xl sm:border sm:shadow-xl">
              <div className="p-4 space-y-3 border-b border-gray-200 shrink-0">
                <div className="flex items-center justify-between sm:hidden"><h2 className="text-base" style={{ fontWeight: 700 }}>Stations</h2><button type="button" aria-label="Close station directory" onClick={() => setOpen(false)} className="min-h-11 min-w-11 grid place-items-center"><X className="w-5 h-5" aria-hidden="true" /></button></div>
                <h2 className="sr-only">Station directory by line</h2>
                <div className="relative">
                  <label htmlFor="station-search" className="sr-only">Search stations</label>
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-black" aria-hidden="true" />
                  <input id="station-search" type="search" autoFocus value={q} placeholder="Search stations or cities" onChange={(e) => setParams({ q: e.target.value || null })}
                    className="w-full min-h-11 pl-9 pr-3 border border-gray-300 rounded-md text-[15px] focus-visible:outline-2 focus-visible:outline-[#0057A8]" />
                </div>
                <LinePicker value={line} onChange={(l) => setParams({ line: l })} />
                <p className="text-sm text-black" aria-live="polite" data-testid="result-count">{uniq} of {STATIONS.length} stations{line ? ` on the ${line} line` : ""} · {recs.length} line entries</p>
              </div>
              <div className="grow overflow-y-auto min-h-0" onClick={(e) => { if ((e.target as HTMLElement).closest("a")) setOpen(false); }}>
                <LineDirectory key={`${line ?? "all"}|${q.trim() ? "q" : ""}`} records={recs} line={line} startCollapsed={!line && !q.trim()} />
              </div>
            </section>
          )}
        </div>
      </div>
      <section aria-label="Network overview" className="relative grow min-h-0 lg:overflow-y-auto">
        <NetworkOverview line={line} onSelect={go} />
      </section>
    </div>
  );
}
