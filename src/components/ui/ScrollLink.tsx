"use client";

import { useLenis } from "lenis/react";
import type { AnchorHTMLAttributes } from "react";

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/** Anchor link that scrolls smoothly with Lenis (falls back to native scrolling). */
export function ScrollLink({ href, onClick, children, ...rest }: Props) {
  const lenis = useLenis();

  return (
    <a
      href={href}
      onClick={(e) => {
        onClick?.(e);
        if (!href.startsWith("#")) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (lenis) lenis.scrollTo(target as HTMLElement, { offset: -72, duration: 1.4 });
        else target.scrollIntoView({ behavior: "smooth" });
        history.replaceState(null, "", href);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}
