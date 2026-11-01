"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGES, img } from "./assets";

const TABS = [
  { id: "observe", label: "Observe", image: IMAGES.observe, title: "See station condition as it is.", body: "Inspections, rider reports and asset records land in one view, each with a source, an observation time and a status of verified, unknown or demo." },
  { id: "understand", label: "Understand", image: IMAGES.understand, title: "Know what matters first.", body: "Issues are de-duplicated, matched to the right platform or asset, and ranked, so supervisors see the highest-priority problem instead of a wall of alerts." },
  { id: "coordinate", label: "Coordinate", image: IMAGES.coordinate, title: "Put every issue in someone's hands.", body: "Each issue is tied to an owner and, where terms exist, the contractor obligation behind it. Assignments need an authorized human approval." },
  { id: "verify", label: "Verify", image: IMAGES.verify, title: "Close the loop with evidence.", body: "A completion claim is not the finish line. An inspector accepts the evidence before anything is marked resolved, and the full history is kept." },
] as const;

export default function ExperienceTabs() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    let next = i;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    else if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TABS.length - 1;
    else return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Platform experience" className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {TABS.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={active === i}
            aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-11 px-5 sm:px-8 text-sm tracking-wide whitespace-nowrap border-b-2 -mb-px transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${
              active === i ? "border-[#0057A8] text-black font-medium" : "border-transparent text-gray-600 hover:text-black"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t, i) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={active !== i}
          className="mt-8 grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-14 items-center"
        >
          <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden bg-gray-100">
            <Image src={img(t.image.file)} alt={t.image.alt} fill sizes="(min-width:1024px) 60vw, 100vw" className="object-cover tab-fade" />
            <span className="absolute left-3 bottom-3 bg-white/90 text-[11px] tracking-wide text-gray-800 px-2.5 py-1">
              Station photography · illustrative of the workflow stage
            </span>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-light tracking-[-0.01em] mb-4">{t.title}</h3>
            <p className="text-gray-700 leading-relaxed font-light">{t.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
