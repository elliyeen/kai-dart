"use client";
import { useSyncExternalStore } from "react";
import { estimateYtdTrips, completedDaysThisYear } from "@/lib/ytd-trips";

const subscribe = () => () => {};
const dayKey = () => new Date().toDateString();

/** Estimated trips so far this year. Computed in the browser so it is current on the visitor's date, not the build date. */
export default function YtdTrips() {
  const key = useSyncExternalStore(subscribe, dayKey, () => "");
  if (!key) return <div className="mt-6 min-h-[4.5rem]" aria-hidden="true" />;
  const now = new Date(key);
  const days = completedDaysThisYear(now);
  if (days < 1) return null;
  const through = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  return (
    <div className="mt-6" data-testid="ytd-trips">
      <p className="text-3xl sm:text-4xl font-light tracking-[-0.02em] leading-none text-gray-900">≈ {estimateYtdTrips(now).toLocaleString("en-US")}</p>
      <p className="mt-2 text-base text-gray-800">Estimated trips so far in {now.getFullYear()}</p>
      <p className="mt-1 text-xs text-gray-600">171,000 × {days} days through {through.toLocaleDateString("en-US", { month: "short", day: "numeric" })}. Estimated from DART&rsquo;s published daily figure.</p>
    </div>
  );
}
