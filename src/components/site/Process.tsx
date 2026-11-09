"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";
import { processSteps } from "@/lib/site";

export function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.6"] });
  const line = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section id="process" className="relative border-t border-line">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:px-10 md:py-32">
        <div className="md:sticky md:top-28 md:h-fit">
          <SectionLabel index="03">Process</SectionLabel>
          <Reveal>
            <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-light uppercase leading-[0.95] tracking-tight">
              A clear lane <br />
              <span className="text-outline">from idea</span> <br />
              to launch
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-sm text-mist">
              Four steps, weekly previews and no surprises. You always know what is happening and what comes next.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 hidden md:block">
            <motion.div
              className="w-fit text-violet"
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              style={{ transformPerspective: 600 }}
            >
              <LogoMark className="h-16 w-auto" title="" />
            </motion.div>
          </Reveal>
        </div>

        <div ref={ref} className="relative pl-10 md:pl-14">
          <div className="absolute left-3 top-2 h-full w-px bg-line md:left-4" aria-hidden="true" />
          <motion.div
            className="absolute left-3 top-2 h-full w-px origin-top bg-violet shadow-[0_0_12px_#7c5cff] md:left-4"
            style={{ scaleY: line }}
            aria-hidden="true"
          />
          <ol className="flex flex-col gap-20 md:gap-28">
            {processSteps.map((step) => (
              <motion.li
                key={step.no}
                className="relative"
                initial={{ opacity: 0.25 }}
                whileInView={{ opacity: 1 }}
                viewport={{ margin: "-45% 0px -45% 0px" }}
                transition={{ duration: 0.5 }}
              >
                <span
                  className="absolute -left-10 top-2 flex h-6 w-6 items-center justify-center rounded-full border border-violet bg-ink md:-left-[3.05rem]"
                  aria-hidden="true"
                >
                  <span className="h-2 w-2 rounded-full bg-violet" />
                </span>
                <span className="font-mono text-sm text-violet">{step.no}</span>
                <h3 className="mt-2 font-display text-4xl font-light uppercase tracking-tight md:text-5xl">{step.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-mist">{step.body}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
