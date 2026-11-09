"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-12%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 0]);

  return (
    <footer ref={ref} className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="mx-auto max-w-7xl px-6 pt-20 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <motion.div style={{ rotate }} className="w-fit">
              <LogoMark className="h-12 w-auto text-violet" title="" />
            </motion.div>
            <p className="mt-6 max-w-xs text-mist">{site.description}</p>
          </div>
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-mist">Explore</p>
            <ul className="flex flex-col gap-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <ScrollLink href={l.href} className="text-paper/90 transition-colors hover:text-violet">
                    {l.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-mist">Follow</p>
            <ul className="flex flex-col gap-2">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="text-paper/90 transition-colors hover:text-violet">
                    {s.label}
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className="text-paper/90 transition-colors hover:text-violet">
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <motion.p
        style={{ x }}
        className="pointer-events-none mt-16 select-none whitespace-nowrap font-display text-[19vw] font-medium uppercase leading-[0.8] tracking-[-0.04em] text-paper/[0.06]"
        aria-hidden="true"
      >
        Renderlane
      </motion.p>

      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-2 border-t border-line px-6 py-6 font-mono text-xs text-mist md:flex-row md:px-10">
        <span>
          © {new Date().getFullYear()} {site.name}. {site.slogan}.
        </span>
        <span>Built with Next.js & Three.js</span>
      </div>
    </footer>
  );
}
