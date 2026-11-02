import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 py-12 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row justify-between items-center gap-6 text-center lg:text-left">
        <div className="text-[13px] text-black">
          © {new Date().getFullYear()} KAI, an Elliyeen product. Demonstration and proposed pilot; not affiliated with or endorsed by DART.
        </div>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[13px] text-black">
          <Link href="/architecture" className="hover:text-black">Architecture</Link>
          <Link href="/faq" className="hover:text-black">FAQ</Link>
          <Link href="/architecture" className="hover:text-black">Get started</Link>
          <Link href="/checkout" className="hover:text-black">Checkout</Link>
          <Link href="/#about" className="hover:text-black">About</Link>
          <Link href="/contact" className="hover:text-black">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
