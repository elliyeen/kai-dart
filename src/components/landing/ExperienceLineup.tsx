"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { IMAGES, img } from "./assets";

const ITEMS = [
  { id: "station", name: "Station", tag: "Pilot", image: IMAGES.lineStation, body: "Akard, Park Lane and Spring Valley first." },
  { id: "car", name: "Cab & Car", tag: "Coming soon", image: IMAGES.lineCar, body: "Cleaner, safer rides on board." },
  { id: "experience", name: "DART Experience", tag: "Coming soon", image: IMAGES.lineExperience, body: "One connected ride, door to door." },
] as const;

/** Image-led lineup: one big photo, three columns with a top bar; the active column is bright, the others dim. */
export default function ExperienceLineup() {
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
      <div role="tablist" aria-label="DART experience" className="mt-6 grid md:grid-cols-3 gap-x-6 gap-y-2">
        {ITEMS.map((it, i) => (
          <button key={it.id} ref={(el) => { refs.current[i] = el; }} role="tab" id={`exp-${it.id}`} aria-selected={active === i} aria-controls={`exp-panel-${it.id}`}
            tabIndex={active === i ? 0 : -1} onClick={() => setActive(i)} onKeyDown={(e) => onKeyDown(e, i)}
            className="w-full text-left min-h-11 pt-4 border-t-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0057A8]"
            style={{ borderTopColor: active === i ? "#0B1F33" : "#D1D5DB" }}>
            <span className={`flex flex-wrap items-center gap-3 text-2xl sm:text-3xl font-medium tracking-[-0.01em] ${active === i ? "text-black" : "text-black"}`}>
              {it.name}
              <span className="text-[11px] font-medium tracking-wide border border-gray-300 text-black bg-gray-50 rounded px-2 py-0.5">{it.tag}</span>
            </span>
          </button>
        ))}
      </div>
      <div className="mt-3 grid md:grid-cols-3 gap-x-6">
        {ITEMS.map((it, i) => active === i
          ? <p key={it.id} id={`exp-panel-${it.id}`} role="tabpanel" aria-labelledby={`exp-${it.id}`} className="text-lg text-black md:col-start-[var(--c)]" style={{ ["--c" as string]: i + 1 }}>{it.body}</p>
          : <p key={it.id} aria-hidden="true" className="hidden md:block text-lg text-black md:col-start-[var(--c)]" style={{ ["--c" as string]: i + 1 }}>{it.body}</p>)}
      </div>
    </div>
  );
}
