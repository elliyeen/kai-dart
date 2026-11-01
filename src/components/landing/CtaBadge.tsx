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
