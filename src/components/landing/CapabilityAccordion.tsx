"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { IMAGES, img } from "./assets";

const ITEMS = [
  { id: "data", name: "Data Fabric", body: "Brings inspections, reports and asset records into one model with provenance, timestamps and freshness. Missing data shows as unknown, never as healthy." },
  { id: "ops", name: "Operations Layer", body: "Routes verified issues to owners and tracks the work from assignment to evidence. Write actions need an authenticated role and a human approval." },
  { id: "intel", name: "Intelligence Engine", body: "Suggests classifications, duplicates and priorities with a stated confidence. People review uncertain cases and can correct or switch off automation." },
] as const;

export default function CapabilityAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 order-2 lg:order-1">
        <Image src={img(IMAGES.capabilities.file)} alt={IMAGES.capabilities.alt} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <p className="absolute left-5 bottom-5 right-5 text-white text-lg font-light" aria-live="polite">{ITEMS[open].name}</p>
      </div>
      <div className="order-1 lg:order-2 divide-y divide-gray-200 border-y border-gray-200">
        {ITEMS.map((it, i) => (
          <div key={it.id}>
            <h3>
              <button
                id={`acc-${it.id}`}
                aria-expanded={open === i}
                aria-controls={`acc-panel-${it.id}`}
                onClick={() => setOpen(i)}
                className="w-full min-h-14 flex items-center justify-between text-left py-4 text-xl font-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8]"
              >
                {it.name}
                <ChevronDown className={`w-5 h-5 transition-transform ${open === i ? "rotate-180" : ""}`} aria-hidden="true" />
              </button>
            </h3>
            <div id={`acc-panel-${it.id}`} role="region" aria-labelledby={`acc-${it.id}`} hidden={open !== i} className="pb-6 text-gray-700 leading-relaxed font-light">
              {it.body}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
