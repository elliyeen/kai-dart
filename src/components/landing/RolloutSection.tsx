import Link from "next/link";
import FadeUp from "@/components/FadeUp";
import MapPanel from "@/components/stations/MapPanel";
import { STATIONS } from "@/lib/stations";
import { ROLLOUT_LABEL, rolloutOf, type RolloutStatus } from "@/lib/stations/rollout";

const ORDER: RolloutStatus[] = ["pilot-planned", "connected", "public-data"];

function Swatch({ status }: { status: RolloutStatus }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {status === "connected" && <circle cx="9" cy="9" r="6" fill="#0057A8" />}
      {status === "public-data" && <circle cx="9" cy="9" r="5.5" fill="#9CA3AF" stroke="#fff" strokeWidth="1.5" />}
      {status === "pilot-planned" && <circle cx="9" cy="9" r="7" fill="#0057A8" stroke="#fff" strokeWidth="2" />}
      {status === "demo" && <circle cx="9" cy="9" r="7" fill="#F59E0B" stroke="#0B1F33" strokeWidth="2" />}
      {status === "not-connected" && <circle cx="9" cy="9" r="4" fill="#fff" stroke="#6B7280" strokeWidth="1.5" />}
    </svg>
  );
}

export default function RolloutSection() {
  const count = (s: RolloutStatus) => STATIONS.filter((st) => rolloutOf(st.key) === s).length;
  return (
    <section id="rollout" className="bg-white py-16 sm:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-10 lg:gap-16 items-center">
        <FadeUp>
          <h2 style={{ fontWeight: 600 }} className="text-[2.5rem] sm:text-6xl xl:text-[4.25rem] tracking-[-0.03em] leading-[1.04] text-black [text-wrap:balance]" data-testid="pilot-title"><span className="text-black">Pilot for </span><span className="whitespace-nowrap">Akard,</span> <span className="whitespace-nowrap">Park Lane</span> and <span className="whitespace-nowrap">Spring Valley</span> Stations</h2>
          <p className="mt-6 text-xl sm:text-2xl text-black leading-snug tracking-[-0.01em] font-normal [text-wrap:balance]">The Standard in clean transportation in North Texas</p>
          <p className="sr-only" data-testid="rollout-connected">{count("connected")} stations connected to live DART data</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/stations" className="font-ui inline-flex items-center justify-center min-h-11 px-8 text-[13px] font-bold tracking-[0.05em] text-white hover:opacity-90" style={{ background: "#0057A8" }}>Explore the stations</Link>
          </div>
        </FadeUp>
        <FadeUp delay={120}>
          <MapPanel mode="rollout" />
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-black" aria-label="Map legend" data-testid="rollout-legend">
            {ORDER.filter((s) => count(s) > 0).map((s) => (
              <li key={s} className="inline-flex items-center gap-2"><Swatch status={s} />{s === "pilot-planned" ? "Test station" : s === "public-data" ? "Other stations" : ROLLOUT_LABEL[s]}<span className="text-black"> · {count(s)}</span></li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
