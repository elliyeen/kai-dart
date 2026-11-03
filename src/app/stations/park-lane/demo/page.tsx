import type { Metadata } from "next";
import ParkLaneDemo from "@/components/stations/ParkLaneDemo";

export const metadata: Metadata = { title: "Park Lane guided demo — simulated", description: "A 90-second simulated walkthrough of three station incidents and independent verification. Not live DART data." };
export default function Page() { return <ParkLaneDemo />; }
