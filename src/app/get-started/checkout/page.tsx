import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";
import PilotCheckout from "@/components/landing/PilotCheckout";

export const metadata: Metadata = {
  title: "Checkout — KAI Station Intelligence",
  description: "Choose stations, name your sign-off contact and create a pilot summary.",
};

export default function CheckoutPage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20 print:pt-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8"><PilotCheckout /></div>
      </main>
      <div className="print:hidden"><SiteFooter /></div>
    </div>
  );
}
