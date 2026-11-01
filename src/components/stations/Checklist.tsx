"use client";
import { useState } from "react";
import { STATIONS } from "@/lib/stations";

const SECTIONS: { title: string; items: string[] }[] = [
  { title: "Platform", items: ["Surface free of litter and debris", "No standing water or spills", "Tactile warning strip intact", "Platform edge markings visible", "Lighting working at all fixtures", "No graffiti or vandalism", "Signage legible and undamaged", "Benches clean and intact"] },
  { title: "Shelters & seating", items: ["Glass panels intact", "Roof and drainage clear", "Seating secure", "Shelter lighting working", "Posters and notices current", "Floor clean", "No odor present", "Emergency information visible"] },
  { title: "Trash & sanitation", items: ["Trash cans emptied", "Liners replaced", "No overflow around cans", "Recycling bins clear", "Cans undamaged", "Surrounding area clean", "Pest signs absent", "Cleaning log signed"] },
  { title: "Accessibility", items: ["Elevator in service (where present)", "Ramps clear and unobstructed", "Handrails secure", "Accessible boarding area clear", "Braille/tactile signage readable", "Door operation smooth", "Accessible route lit", "Help point reachable"] },
  { title: "Safety & security", items: ["Cameras present and unobstructed", "Emergency phones working", "Fire equipment present", "Exits unobstructed", "Lighting at entrances adequate", "No loitering hazards observed", "Fare equipment undamaged", "Incident log reviewed"] },
  { title: "Customer information", items: ["Maps current", "Schedules displayed", "Wayfinding clear", "Digital displays working", "Public address audible", "Contact details visible", "Fare information correct", "Service alerts posted"] },
];

export default function Checklist() {
  const sorted = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));
  const [station, setStation] = useState(sorted[0].key);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [photo, setPhoto] = useState("");
  const [sent, setSent] = useState(false);
  const total = SECTIONS.reduce((n, s) => n + s.items.length, 0);
  const n = Object.values(checked).filter(Boolean).length;
  return (
    <div className="p-4 lg:p-8 max-w-3xl space-y-6" data-testid="checklist">
      <div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Inspection checklist</h1><p className="text-sm text-gray-700">{total}-item crew checklist with photo upload.</p></div>
      <label className="block"><span className="block text-sm font-semibold mb-1.5">Station</span>
        <select className="w-full min-h-11 border border-gray-300 rounded-md px-3 bg-white text-sm" value={station} onChange={(e) => { setStation(e.target.value); setChecked({}); setSent(false); }}>{sorted.map((s) => <option key={s.key} value={s.key}>{s.name}</option>)}</select></label>
      <div role="progressbar" aria-label="Checklist progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={n}><div className="h-2 bg-gray-200 rounded"><div className="h-2 bg-[#0057A8] rounded" style={{ width: `${(n / total) * 100}%` }} /></div><p className="mt-1 text-sm" data-testid="checklist-count">{n} of {total} checked</p></div>
      {SECTIONS.map((s) => (
        <fieldset key={s.title} className="border border-gray-200 rounded-lg p-3">
          <legend className="px-1 text-sm font-semibold">{s.title}</legend>
          {s.items.map((it) => { const id = `${s.title}-${it}`; return (
            <label key={id} className="flex items-center gap-3 min-h-11 px-1 text-sm"><input type="checkbox" className="w-5 h-5" checked={!!checked[id]} onChange={(e) => { setChecked({ ...checked, [id]: e.target.checked }); setSent(false); }} />{it}</label>); })}
        </fieldset>
      ))}
      <div><span className="block text-sm font-semibold mb-1.5">Photo evidence</span><input type="file" accept="image/*" aria-label="Add inspection photo" onChange={(e) => setPhoto(e.target.files?.[0]?.name ?? "")} className="text-sm" /><p className="mt-1 text-xs text-gray-700">{photo ? `${photo} (kept on this device, not uploaded)` : "Photos are not uploaded in this demo."}</p></div>
      <div className="flex items-center gap-3"><button type="button" data-testid="checklist-submit" disabled={n === 0} onClick={() => setSent(true)} className="min-h-11 px-6 rounded-md bg-[#0057A8] text-white font-semibold disabled:bg-gray-200 disabled:text-gray-700">Complete inspection</button>
        {sent && <p role="status" className="text-sm" data-testid="checklist-done">Recorded for this session only: {n}/{total} items at {STATIONS.find((s) => s.key === station)!.name}. Not sent to DART.</p>}</div>
    </div>
  );
}
