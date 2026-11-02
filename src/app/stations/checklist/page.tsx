import { Suspense } from "react";
import Checklist from "@/components/stations/Checklist";
export default function Page() { return <Suspense fallback={null}><Checklist /></Suspense>; }
