import type { Metadata } from "next";
import ParkLaneDemo from "@/components/stations/ParkLaneDemo";

// Friendly customer entry point (/dart/demo on www.elliyeen.com). Renders the same guided demo as /stations/park-lane/demo.
export const metadata: Metadata = { title: "Station Readiness demo — simulated", description: "A 90-second simulated walkthrough of three station incidents and independent verification. Independent Elliyeen demonstration; not affiliated with or endorsed by DART; not live DART data." };
export default function Page() { return <ParkLaneDemo />; }
