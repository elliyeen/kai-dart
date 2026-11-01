import { Suspense } from "react";
import AssetsView from "@/components/stations/AssetsView";
export default function Page() { return <Suspense fallback={<p className="p-6 text-sm text-gray-700">Loading…</p>}><AssetsView /></Suspense>; }
