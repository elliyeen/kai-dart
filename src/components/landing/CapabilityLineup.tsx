"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGES, img } from "./assets";

const ITEMS = [
  { id: "data", name: "Data Fabric", tag: "Demo", image: IMAGES.lineupData, body: "Brings inspections, reports and public station records into one model with sources, timestamps and freshness. Missing data shows as unknown, never as healthy." },
  { id: "ops", name: "Operations Layer", tag: "Demo", image: IMAGES.lineupOps, body: "Routes verified issues to owners and tracks work from assignment to evidence. Every write action needs an authenticated role and a human approval." },
  { id: "intel", name: "Intelligence Engine", tag: "Proposed", image: IMAGES.lineupIntel, body: "Suggests classifications, duplicates and priorities with a stated confidence. People review uncertain cases and can correct, or switch automation off." },
] as const;

export default function CapabilityLineup() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % ITEMS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + ITEMS.length) % ITEMS.length;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
        {ITEMS.map((it, i) => (
          <Image key={it.id} src={img(it.image.file)} alt={i === active ? it.image.alt : ""} aria-hidden={i !== active} fill sizes="(min-width:1280px) 1200px, 100vw"
            className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`} />
        ))}
      </div>
      <div role="tablist" aria-label="Platform capabilities" className="mt-6 grid md:grid-cols-3 gap-x-6 gap-y-2">
        {ITEMS.map((it, i) => (
          <button key={it.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`cap-${it.id}`} aria-selected={active === i} aria-controls={`cap-panel-${it.id}`}
            tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onKeyDown(e, i)}
            className="w-full text-left min-h-11 pt-4 border-t-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0057A8]"
            style={{ borderTopColor: active === i ? "#0B1F33" : "#D1D5DB" }}>
            <span className={`flex flex-wrap items-center gap-3 text-2xl sm:text-3xl font-medium tracking-[-0.01em] ${active === i ? "text-gray-900" : "text-gray-600"}`}>
              {it.name}
              <span className="text-[11px] font-medium tracking-wide border border-gray-300 text-gray-700 bg-gray-50 rounded px-2 py-0.5">{it.tag}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 grid md:grid-cols-3 gap-x-6">
        {ITEMS.map((it, i) => active === i
          ? <p key={it.id} id={`cap-panel-${it.id}`} role="tabpanel" aria-labelledby={`cap-${it.id}`} className="leading-relaxed text-gray-900 md:col-start-[var(--c)]" style={{ ["--c" as string]: i + 1 }}>{it.body}</p>
          : <p key={it.id} aria-hidden="true" className="hidden md:block leading-relaxed text-gray-600 md:col-start-[var(--c)]" style={{ ["--c" as string]: i + 1 }}>{it.body}</p>)}
      </div>
    </div>
  );
}
