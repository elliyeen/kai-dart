import Link from "next/link";
import type { ReactNode } from "react";

/** Store-badge style button: black pill, thin light border, icon on the left, small caption over a bold label. */
export default function CtaBadge({ href, caption, label, icon }: { href: string; caption: string; label: string; icon: ReactNode }) {
  return (
    <Link href={href} className="cta-badge font-ui">
      <span className="cta-badge-icon" aria-hidden="true">{icon}</span>
      <span className="cta-badge-text">
        <span className="cta-badge-caption">{caption}</span>{" "}
        <span className="cta-badge-label">{label}</span>
      </span>
    </Link>
  );
}

/** Primary call to action: blue pill, label only, with a hover arrow, light sweep, lift and press feedback (all disabled for reduced motion). */
export function GetStartedButton({ href = "/architecture", label = "Get Started", wide = false }: { href?: string; label?: string; wide?: boolean }) {
  return (
    <Link href={href} className={`cta-primary font-ui${wide ? " cta-primary-wide" : ""}`}>
      <span className="cta-primary-label">{label}</span>
      <svg className="cta-primary-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h9M8.5 4l4 4-4 4" /></svg>
    </Link>
  );
}
