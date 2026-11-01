"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGES, img } from "./assets";

// Rider-facing promises. Each describes what KAI is designed to do in a pilot; none is a measured result.
const TABS = [
  { id: "clean", label: "Clean", image: IMAGES.observe, body: "Cleanliness issues are reported with evidence, matched to the right platform and given a named owner, so nothing stops at \u201creported.\u201d" },
  { id: "safe", label: "Safe", image: IMAGES.understand, body: "Safety and security concerns are routed to the people authorized to act. KAI surfaces the issue and people decide what to do about it." },
  { id: "intelligent", label: "Intelligent", image: IMAGES.coordinate, body: "Duplicate reports are merged and the most urgent problems rise to the top, each with a stated source, time and confidence." },
  { id: "verified", label: "Verified", image: IMAGES.verify, body: "A fix only counts when an independent inspector accepts the evidence. A contractor\u2019s own completion claim is never the final word." },
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
      <div className="relative aspect-[4/3] sm:aspect-[16/9] overflow-hidden rounded-2xl bg-gray-100">
        {TABS.map((t, i) => (
          <Image key={t.id} src={img(t.image.file)} alt={i === active ? t.image.alt : ""} aria-hidden={i !== active} fill sizes="(min-width:1280px) 1200px, 100vw"
            className={`object-cover transition-opacity duration-500 motion-reduce:transition-none ${i === active ? "opacity-100" : "opacity-0"}`} />
        ))}
        <span className="absolute left-3 bottom-3 bg-white/90 text-[11px] tracking-wide text-gray-800 px-2.5 py-1 rounded">Station photography · illustrative</span>
      </div>

      {TABS.map((t, i) => (
        <div key={t.id} role="tabpanel" id={`panel-${t.id}`} aria-labelledby={`tab-${t.id}`} hidden={active !== i}
          className="mt-8 mx-auto max-w-2xl text-center text-lg sm:text-xl font-light leading-relaxed text-gray-800">
          {t.body}
        </div>
      ))}

      <div role="tablist" aria-label="Rider experience" className="mt-8 mx-auto max-w-3xl grid grid-cols-4 gap-1 rounded-xl bg-gray-100 p-1">
        {TABS.map((t, i) => (
          <button key={t.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`tab-${t.id}`} aria-selected={active === i} aria-controls={`panel-${t.id}`}
            tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onKeyDown(e, i)}
            className={`min-h-11 rounded-lg px-2 text-sm sm:text-[15px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057A8] ${active === i ? "bg-white text-black font-semibold shadow-sm" : "text-gray-700 hover:text-black"}`}>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
