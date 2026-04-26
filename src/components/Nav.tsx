"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const websiteLinks = [
  { href: "/platform", label: "Platform" },
  { href: "/world-cup-2026", label: "FIFA 2026" },
  { href: "/#about", label: "Why Kai" },
];

// Line colors for the nav pills
const LINE_LINKS = [
  { href: "/dart/line/red",    label: "Red",    color: "#DC2626" },
  { href: "/dart/line/blue",   label: "Blue",   color: "#2563EB" },
  { href: "/dart/line/silver", label: "Silver", color: "#6B7280" },
];

interface NavProps {
  hideLinks?: boolean;
}

export default function Nav({ hideLinks = false }: NavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isDashboard = pathname.startsWith("/dart") || hideLinks;
  const isPlatform  = pathname.startsWith("/platform");

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <Link
              href="/"
              className="text-base font-medium tracking-[0.3em] text-black flex-shrink-0"
              onClick={() => setOpen(false)}
            >
              KAI
            </Link>

            {/* ── Dashboard nav ── */}
            {isDashboard && !isPlatform && (
              <>
                {/* Desktop */}
                <div className="hidden md:flex items-center gap-1">
                  <Link
                    href="/dart"
                    className={`text-[13px] font-semibold px-3 py-1.5 rounded-sm transition-colors ${
                      pathname === "/dart"
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Network
                  </Link>

                  <span className="text-gray-300 mx-1 text-xs">|</span>

                  {LINE_LINKS.map(({ href, label, color }) => {
                    const active = pathname.startsWith(href);
                    return (
                      <Link
                        key={href}
                        href={href}
                        className={`text-[13px] font-semibold px-3 py-1.5 rounded-sm transition-colors flex items-center gap-1.5 ${
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: color }}
                        />
                        {label}
                      </Link>
                    );
                  })}

                  <span className="text-gray-300 mx-1 text-xs">|</span>

                  <Link
                    href="/cities"
                    className={`text-[13px] font-semibold px-3 py-1.5 rounded-sm transition-colors ${
                      pathname.startsWith("/cities")
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    Cities
                  </Link>
                </div>

                {/* Desktop right actions */}
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center text-[12px] font-medium px-4 py-2 min-h-[38px] bg-[#FF6B35] text-white hover:bg-[#E85A27] transition-colors rounded-sm"
                  >
                    Request Demo
                  </Link>
                </div>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden p-2.5 -mr-2.5 text-black/50 hover:text-black transition-colors"
                  onClick={() => setOpen(!open)}
                  aria-label="Toggle menu"
                >
                  {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </>
            )}

            {/* ── Website nav ── */}
            {!isDashboard && !isPlatform && (
              <>
                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                  {websiteLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`text-[13px] transition-colors duration-200 ${
                        pathname === href
                          ? "text-black"
                          : "text-black/60 hover:text-black"
                      }`}
                    >
                      {label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href="/contact"
                    className="hidden md:inline-flex items-center justify-center text-[13px] border border-black/20 text-black px-5 py-2 min-h-[38px] hover:bg-black hover:text-white hover:border-black transition-all duration-300"
                  >
                    Contact
                  </Link>
                  <button
                    className="md:hidden p-2.5 -mr-2.5 text-black/50 hover:text-black transition-colors"
                    onClick={() => setOpen(!open)}
                    aria-label="Toggle menu"
                  >
                    {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Mobile overlay — website ── */}
      {!isDashboard && !isPlatform && open && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col pt-16">
          <div className="flex-1 flex flex-col px-6 pt-8">
            {[...websiteLinks, { href: "/contact", label: "Contact" }].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`text-3xl font-thin py-5 border-b border-white/[0.08] transition-colors ${
                  pathname === href ? "text-white" : "text-white/50 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* ── Mobile overlay — dashboard ── */}
      {isDashboard && !isPlatform && open && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col pt-16 border-t border-gray-100">
          <div className="flex-1 flex flex-col px-6 pt-6 gap-1">
            <Link href="/dart" onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-gray-800 py-3.5 border-b border-gray-100 hover:text-black transition-colors">
              Network Overview
            </Link>
            {LINE_LINKS.map(({ href, label, color }) => (
              <Link key={href} href={href} onClick={() => setOpen(false)}
                className="text-[15px] font-medium text-gray-600 py-3.5 border-b border-gray-100 hover:text-black transition-colors flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {label} Line
              </Link>
            ))}
            <Link href="/cities" onClick={() => setOpen(false)}
              className="text-[15px] font-medium text-gray-600 py-3.5 border-b border-gray-100 hover:text-black transition-colors">
              City Accounts
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)}
              className="mt-4 text-[14px] font-medium px-4 py-3 bg-[#FF6B35] text-white text-center rounded-sm hover:bg-[#E85A27] transition-colors">
              Request Demo
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
