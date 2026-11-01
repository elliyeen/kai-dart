"use client";
import Link from "next/link";
import { AKARD_ASSETS, AKARD_LAYOUT_NOTE, assetStatus } from "@/lib/stations/geometry";
import { useDemo } from "@/lib/demo/store";
import { DemoBadge, StatusIndicator } from "./ui";

export default function AssetsView() {
  const demo = useDemo();
  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-4xl text-gray-900" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Assets</h1><p className="text-gray-800">No asset inventory is connected. Only what is known is listed.</p></div><DemoBadge /></div>
      <section aria-labelledby="ak-h" className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
        <h2 id="ak-h" className="text-lg mb-1" style={{ fontWeight: 700 }}>Akard Station — modeled layout</h2>
        <p className="text-sm text-gray-700 mb-3">{AKARD_LAYOUT_NOTE}</p>
        <div className="overflow-x-auto" tabIndex={0} role="region" aria-label="Assets table, scrollable"><table className="w-full text-sm text-left" data-testid="assets-table"><caption className="sr-only">Modeled Akard assets</caption>
          <thead><tr className="border-b border-gray-200"><th scope="col" className="py-2 pr-3">Asset</th><th scope="col" className="py-2 pr-3">Type</th><th scope="col" className="py-2 pr-3">Demo status</th><th scope="col" className="py-2">Source</th></tr></thead>
          <tbody>{AKARD_ASSETS.map((a) => <tr key={a.id} className="border-b border-gray-100"><th scope="row" className="py-3 pr-3 font-medium">{a.name}</th><td className="py-3 pr-3">{a.kind}</td><td className="py-3 pr-3"><StatusIndicator status={assetStatus(a.id, demo)} size="sm" /></td><td className="py-3 text-gray-700">Project notes (unconfirmed)</td></tr>)}</tbody></table></div>
        <p className="text-sm text-gray-800 mt-3">Elevators, escalators, lighting and other equipment: <strong>not verified</strong>, so not listed. <Link href="/stations/akard" className="underline text-[#0057A8]">Open the Akard dashboard</Link></p>
      </section>
      <p className="text-sm text-gray-700">The other 75 stations have no modeled assets. An authorized DART asset export would be needed to populate this list.</p>
    </div>
  );
}
