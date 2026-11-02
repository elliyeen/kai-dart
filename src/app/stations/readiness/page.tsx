import { Suspense } from "react";
import ReadinessView from "@/components/stations/ReadinessView";
export default function Page() { return <Suspense fallback={<p className="p-6 text-sm text-black">Loading…</p>}><ReadinessView /></Suspense>; }
