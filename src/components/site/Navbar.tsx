"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { navLinks, site } from "@/lib/site";
import { useIntro } from "./providers";

export function Navbar() {
  const { ready } = useIntro();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 400 && !open);
    setScrolled(v > 40);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: ready && !hidden ? 0 : -100 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: ready && !scrolled ? 0.6 : 0 }}
      >
        <div
          className={`mx-auto mt-3 flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3 transition-all duration-500 md:px-6 ${
            scrolled ? "mx-3 border border-line/80 bg-ink/70 backdrop-blur-xl md:mx-auto" : "border border-transparent"
          }`}
        >
          <ScrollLink href="#top" aria-label={`${site.name} home`} className="text-paper">
            <Logo />
          </ScrollLink>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {navLinks.map((l) => (
              <ScrollLink
                key={l.href}
                href={l.href}
                className="group relative overflow-hidden rounded-full px-4 py-2 text-sm text-mist transition-colors hover:text-paper"
              >
                <span className="relative block transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:-translate-y-[130%]">
                  {l.label}
                </span>
                <span className="absolute inset-x-4 top-2 block translate-y-[130%] text-paper transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0">
                  {l.label}
                </span>
              </ScrollLink>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Magnetic className="hidden md:inline-block">
              <ScrollLink
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-violet hover:text-paper"
              >
                Start a project
                <span className="h-1.5 w-1.5 rounded-full bg-violet" aria-hidden="true" />
              </ScrollLink>
            </Magnetic>
            <button
              type="button"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-px w-5 bg-paper transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1"}`} />
              <span className={`absolute h-px w-5 bg-paper transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-end bg-ink/95 px-6 pb-12 pt-28 backdrop-blur-xl md:hidden"
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav className="flex flex-col gap-2" aria-label="Mobile">
              {[...navLinks, { label: "Start a project", href: "#contact" }].map((l, i) => (
                <motion.div
                  key={l.href + l.label}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ScrollLink
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl font-light text-paper"
                  >
                    {l.label}
                  </ScrollLink>
                </motion.div>
              ))}
            </nav>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-mist">{site.email}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
