import { Suspense } from "react";
import StationsBrowser from "@/components/stations/StationsBrowser";

export default function StationsPage() {
  return <Suspense fallback={<p className="p-6 text-sm text-black">Loading stations…</p>}><StationsBrowser /></Suspense>;
}
