import type { Metadata } from "next";
import Nav from "@/components/Nav";
import SiteFooter from "@/components/landing/SiteFooter";
import EnterpriseCheckout from "@/components/landing/EnterpriseCheckout";

export const metadata: Metadata = {
  title: "Checkout — KAI Station Intelligence",
  description: "Configure a non-binding KAI proposal request: scope, term and a summary you can copy. No payment is collected.",
};

export default function CheckoutPage() {
  return (
    <div className="landing-sans min-h-screen bg-white text-black">
      <Nav />
      <main id="main" className="bg-white pt-28 pb-20 print:pt-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8"><EnterpriseCheckout /></div>
      </main>
      <div className="print:hidden"><SiteFooter /></div>
    </div>
  );
}
