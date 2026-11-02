import { Suspense } from "react";
import AssetsView from "@/components/stations/AssetsView";
export default function Page() { return <Suspense fallback={<p className="p-6 text-sm text-black">Loading…</p>}><AssetsView /></Suspense>; }
