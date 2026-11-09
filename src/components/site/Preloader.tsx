"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { site } from "@/lib/site";
import { useIntro } from "./providers";

const ease = [0.76, 0, 0.24, 1] as const;

/** Intro: counter 0→100 with the logo drawing in, then a curtain lifts. Plays once per visit. */
export function Preloader() {
  const { markReady } = useIntro();
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("rl-intro") === "1";
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduced) {
      setVisible(false);
      markReady();
      return;
    }

    const duration = 2200;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        try {
          sessionStorage.setItem("rl-intro", "1");
        } catch {}
        setTimeout(() => setVisible(false), 350);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [markReady]);

  return (
    <AnimatePresence onExitComplete={markReady}>
      {visible && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-ink px-6 py-8 md:px-12 md:py-10"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          initial={{ clipPath: "inset(0 0 0% 0)" }}
          transition={{ duration: 1.1, ease }}
        >
          <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-mist">
            <span>{site.name}</span>
            <span>{site.slogan}</span>
          </div>

          <div className="flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -8 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute inset-0 -z-10 rounded-full bg-violet/30 blur-3xl" aria-hidden="true" />
              <LogoMark className="h-20 w-auto text-paper md:h-28" />
            </motion.div>
            <div className="h-px w-56 overflow-hidden bg-line">
              <motion.div className="h-full bg-violet" style={{ width: `${count}%` }} />
            </div>
          </div>

          <div className="flex items-end justify-between">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-mist">Loading experience</span>
            <span className="font-display text-7xl font-light tabular-nums leading-none md:text-9xl" aria-live="polite">
              {count}
              <span className="text-violet">%</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
