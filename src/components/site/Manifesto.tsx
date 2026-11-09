"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { SectionLabel } from "@/components/ui/Reveal";

const text =
  "Most websites look the same. Same templates, same stock photos, same scroll. We build the opposite: sites that move, react and invite people to play — engineered to load fast and built to turn visitors into clients.";

const highlight = new Set(["opposite:", "move,", "react", "play", "fast", "clients."]);

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const accent = highlight.has(word);
  return (
    <span className="relative mr-[0.25em] inline-block">
      <motion.span style={{ opacity }} className={accent ? "text-violet" : "text-paper"}>
        {word}
      </motion.span>
    </span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-32 md:px-10 md:py-48">
      <SectionLabel index="01">Who we are</SectionLabel>
      <div ref={ref}>
        <p className="font-display text-[clamp(1.9rem,4.4vw,4rem)] font-light leading-[1.12] tracking-[-0.01em]">
          {words.map((w, i) => {
            const start = i / words.length;
            const end = start + 1 / words.length;
            return <Word key={`${w}-${i}`} word={w} progress={scrollYProgress} range={[start, end]} />;
          })}
        </p>
      </div>
      <div className="mt-16 grid gap-6 text-sm text-mist md:grid-cols-3">
        <p>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-paper">Two founders</span>
          One of us leads design and clients, the other leads engineering. You always talk to the people doing the work.
        </p>
        <p>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-paper">Modern stack</span>
          React, Next.js, Three.js and motion libraries — the same tools behind award-winning sites.
        </p>
        <p>
          <span className="mb-2 block font-mono text-xs uppercase tracking-[0.2em] text-paper">Local & global</span>
          Based in Egypt, working with clients across the region and worldwide, in Arabic or English.
        </p>
      </div>
    </section>
  );
}
