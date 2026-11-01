import Link from "next/link";
import FadeUp from "@/components/FadeUp";
import MapPanel from "@/components/stations/MapPanel";
import { STATIONS } from "@/lib/stations";
import { ROLLOUT_LABEL, rolloutOf, type RolloutStatus } from "@/lib/stations/rollout";

const ORDER: RolloutStatus[] = ["connected", "pilot-planned", "demo", "not-connected"];

function Swatch({ status }: { status: RolloutStatus }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      {status === "connected" && <circle cx="9" cy="9" r="6" fill="#0057A8" />}
      {status === "pilot-planned" && <circle cx="9" cy="9" r="6" fill="#fff" stroke="#0057A8" strokeWidth="2" strokeDasharray="3 2" />}
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
          <h2 className="text-4xl sm:text-5xl font-light tracking-[-0.02em] leading-[1.05]">Bringing stations online.</h2>
          <p className="mt-6 text-lg text-gray-800 leading-relaxed font-light">
            KAI is a proposed pilot. <strong className="font-semibold" data-testid="rollout-connected">{count("connected")} stations</strong> are connected to live DART data today. The demo uses Akard as a synthetic example.
          </p>
          <p className="mt-4 text-lg text-gray-800 leading-relaxed font-light">
            As stations are approved and connected, they appear on this map with their data source and last verified time. Nothing is shown as connected without evidence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link href="/stations" className="font-ui inline-flex items-center justify-center min-h-11 px-8 text-[13px] font-bold tracking-[0.05em] text-white hover:opacity-90" style={{ background: "#0057A8" }}>Explore the stations</Link>
            <Link href="/contact" className="font-ui inline-flex items-center justify-center min-h-11 px-8 text-[13px] font-bold tracking-[0.05em] border border-gray-300 text-gray-900 hover:bg-gray-50">Talk about a pilot</Link>
          </div>
        </FadeUp>
        <FadeUp delay={120}>
          <MapPanel mode="rollout" />
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-900" aria-label="Map legend" data-testid="rollout-legend">
            {ORDER.map((s) => (
              <li key={s} className="inline-flex items-center gap-2"><Swatch status={s} />{ROLLOUT_LABEL[s]}{s !== "not-connected" && <span className="text-gray-600"> · {count(s)}</span>}</li>
            ))}
          </ul>
        </FadeUp>
      </div>
    </section>
  );
}
