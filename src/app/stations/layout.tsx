import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Shell from "@/components/stations/Shell";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
export const metadata: Metadata = {
  title: "KAI Station Intelligence — synthetic demo",
  description: "Elliyeen demonstration of station condition, ownership and independently verified resolution. Synthetic data; not a DART system.",
};

export default function StationsLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${geist.variable} stations-root`} style={{ ["--color-white" as string]: "#ffffff", ["--color-background" as string]: "#ffffff" }}><Shell>{children}</Shell></div>;
}
