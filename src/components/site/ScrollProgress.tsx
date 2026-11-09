"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin violet bar at the top that fills as you scroll the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[70] h-[2px] origin-left bg-violet shadow-[0_0_10px_#7c5cff]"
      style={{ scaleX }}
    />
  );
}
