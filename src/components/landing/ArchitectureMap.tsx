import type { ReactNode } from "react";
import { basePath } from "./assets";
import { ArrowDown, ArrowRight, Check, CircleAlert, Lock, ShieldCheck } from "lucide-react";

const SCENE = (file: string, alt: string, w: number, h: number) => <img src={`${basePath}/images/architecture/${file}`} alt={alt} width={w} height={h} loading="lazy" decoding="async" className="w-full h-full object-contain object-bottom mix-blend-multiply [filter:brightness(1.03)]" />;

type Stage = { id: string; title: string; sub: string; summary: string; art: ReactNode };

const STAGES: Stage[] = [
  { id: "data", title: "Data In", sub: "Stations · Vehicles · Operations", summary: "Proposed pilot sources: stations, vehicles and operations.", art: SCENE("data-in.png", "Light-rail vehicle stopped at a station platform", 350, 250) },
  { id: "kai", title: "DART Platform", sub: "Ingest · Model · Analyze", summary: "Records keep their source and time. Shown in the demo with synthetic data.", art: SCENE("kai.png", "Three layered tiles in white, yellow and navy labelled KAI", 280, 250) },
  { id: "intelligence", title: "Intelligence", sub: "Detect · Predict · Prioritize", summary: "Issues are detected and ranked. Shown in the demo with synthetic data.", art: SCENE("intelligence.png", "Glowing operations panel showing a network line with a location pin", 275, 250) },
  { id: "action", title: "Action", sub: "Dispatch · Maintain · Resolve", summary: "Work is dispatched, done and independently verified. Shown in the demo with synthetic data.", art: SCENE("action.png", "Maintenance van with a technician on a station platform", 280, 250) },
  { id: "outcomes", title: "Outcomes", sub: "Safer · Cleaner · More Reliable", summary: "The proposed goal: safer, cleaner, more reliable stations.", art: SCENE("outcomes.png", "Riders walking through a station shelter", 345, 250) },
];

const BEFORE = ["Trash and debris", "Dim lighting", "Worn bench", "Accessibility barrier"];
const AFTER = ["Area cleaned and sanitized", "Lighting restored", "Bench repaired", "Accessibility verified"];

const SECURITY: { id: string; title: string; sub: string; icon: ReactNode }[] = [
  { id: "tx", title: "Texas (DIR)", sub: "State cybersecurity & IT requirements", icon: <img src={`${basePath}/images/architecture/icon-texas.png`} alt="" width={76} height={72} className="w-10 h-auto shrink-0 mix-blend-multiply [filter:brightness(1.03)]" /> },
  { id: "fta", title: "Federal (FTA)", sub: "U.S. transit security & safety requirements", icon: <img src={`${basePath}/images/architecture/icon-fta.png`} alt="" width={72} height={72} className="w-10 h-auto shrink-0 mix-blend-multiply [filter:brightness(1.03)]" /> },
  { id: "zt", title: "Zero Trust", sub: "Verify · Limit · Monitor", icon: <Lock className="w-7 h-7 shrink-0 text-[#0B1F33]" strokeWidth={1.5} aria-hidden="true" /> },
];

export default function ArchitectureMap() {
  return (
    <div>
      <ol className="grid gap-2 lg:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr_auto_1fr] lg:items-start" data-testid="arch-flow" aria-label="Station readiness flow, left to right">
        {STAGES.map((s, i) => (
          <li key={s.id} className="contents">
            <div data-testid="arch-node" className="min-w-0 text-center rounded-xl px-2 pt-2 pb-4">
              <div className="mx-auto max-w-[300px] lg:max-w-none lg:-mx-4 aspect-[7/5]">{s.art}</div>
              <span className="mt-3 block whitespace-nowrap text-lg xl:text-2xl font-semibold text-[#0B1F33] leading-tight">{s.title}</span>
              <span className="mt-1.5 block text-base lg:text-[13px] xl:text-[15px] text-black">{s.sub}</span>
              <span className="sr-only">{s.summary}</span>
            </div>
            {i < STAGES.length - 1 && (
              <span aria-hidden="true" className="flex items-center justify-center text-[#0B1F33] lg:mt-[110px] lg:self-start">
                <svg viewBox="0 0 48 12" className="hidden lg:block w-9 h-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 6h42M38 1l6 5-6 5" /></svg>
                <ArrowDown className="lg:hidden w-5 h-5" strokeWidth={1.6} />
              </span>
            )}
          </li>
        ))}
      </ol>

      <section aria-labelledby="akard-title" className="mt-10" data-testid="arch-akard">
        <div className="rounded-3xl bg-white shadow-[0_2px_24px_rgba(11,31,51,0.08)] ring-1 ring-[#E6EBF2] p-5 lg:p-6">
          <h2 id="akard-title" style={{ fontWeight: 700 }} className="text-2xl text-[#0B1F33]">Akard Station</h2>
          <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
            <div data-testid="arch-before-col">
              <p className="text-lg font-semibold text-[#B42318]">Before</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-center">
                <img src={`${basePath}/images/architecture/akard-before.png`} alt="Before: Akard Station platform with trash and debris, dim lighting, a worn bench and an accessibility barrier (illustrative)" width={412} height={82} loading="lazy" decoding="async" className="w-full h-auto block rounded-2xl" />
                <ul className="space-y-2.5" data-testid="arch-before">
                  {BEFORE.map((t) => <li key={t} className="flex items-center gap-2.5 text-base leading-6 text-black"><CircleAlert className="w-5 h-5 shrink-0 text-[#D92D20]" strokeWidth={1.8} aria-hidden="true" />{t}</li>)}
                </ul>
              </div>
            </div>
            <span aria-hidden="true" className="self-center justify-self-center grid place-items-center w-11 h-11 rounded-full bg-white shadow-[0_2px_10px_rgba(11,31,51,0.15)] text-[#0057A8] rotate-90 lg:rotate-0"><ArrowRight className="w-5 h-5" strokeWidth={2} /></span>
            <div data-testid="arch-after-col">
              <p className="text-lg font-semibold text-[#1E7A32]">After</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:items-center">
                <img src={`${basePath}/images/architecture/akard-after.png`} alt="After: Akard Station platform cleaned, lighting restored, bench repaired and accessibility verified (illustrative)" width={412} height={82} loading="lazy" decoding="async" className="w-full h-auto block rounded-2xl" />
                <ul className="space-y-2.5" data-testid="arch-after">
                  {AFTER.map((t) => <li key={t} className="flex items-center gap-2.5 text-base leading-6 text-black"><Check className="w-5 h-5 shrink-0 text-[#2E9E43]" strokeWidth={2.2} aria-hidden="true" />{t}</li>)}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col lg:flex-row lg:items-stretch rounded-2xl lg:rounded-full overflow-hidden bg-[#F1F4F8]" data-testid="arch-security">
        <div className="flex items-center gap-3 bg-[#0B1F33] text-white px-6 py-3 lg:pr-12 lg:[clip-path:polygon(0_0,100%_0,calc(100%-26px)_100%,0_100%)] min-h-[56px]">
          <ShieldCheck className="w-6 h-6" strokeWidth={1.6} aria-hidden="true" /><span className="text-lg font-semibold">Enterprise Security</span>
        </div>
        <span aria-hidden="true" className="hidden lg:block w-[38px] -ml-[26px] flex-none bg-[#FFD21F] [clip-path:polygon(26px_0,38px_0,12px_100%,0_100%)]" />
        <ul className="flex-1 grid lg:grid-cols-3 lg:-ml-6">
          {SECURITY.map((s) => (
            <li key={s.id} data-testid="arch-sec" className="flex items-center gap-3 px-5 py-3 min-h-[56px] text-[#0B1F33] border-t lg:border-t-0 lg:border-l border-[#D5DCE6] first:border-t-0">
              {s.icon}<span className="min-w-0"><span className="block text-lg font-semibold leading-tight">{s.title}</span><span className="block text-sm font-normal leading-snug text-black">{s.sub}</span></span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
