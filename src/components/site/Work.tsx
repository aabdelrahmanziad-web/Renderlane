"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Icon } from "@/components/ui/Icon";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { projects } from "@/lib/site";
import { ProjectArt } from "./ProjectArt";

function TiltCard({ p, i }: { p: (typeof projects)[number]; i: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 180, damping: 18 });
  const glare = useTransform(
    [mx, my],
    (v: number[]) => `radial-gradient(600px circle at ${v[0] * 100}% ${v[1] * 100}%, rgba(255,255,255,0.12), transparent 45%)`,
  );

  return (
    <motion.article
      className={`${i % 2 === 1 ? "md:mt-24" : ""}`}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        data-cursor="View"
        className="group relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-ink-2"
        style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
      >
        <div className="absolute inset-0 transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]">
          <ProjectArt kind={p.art} />
        </div>
        <motion.div className="pointer-events-none absolute inset-0" style={{ background: glare }} aria-hidden="true" />
        <span className="absolute left-5 top-5 rounded-full border border-paper/15 bg-ink/60 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.15em] text-mist backdrop-blur">
          Concept
        </span>
      </motion.div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="font-display text-3xl font-light uppercase tracking-tight">{p.name}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-[0.15em] text-violet">{p.kind}</p>
        </div>
        <p className="max-w-[16rem] text-right text-sm text-mist">{p.blurb}</p>
      </div>
    </motion.article>
  );
}

export function Work() {
  return (
    <section id="work" className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="04">Selected work</SectionLabel>
            <Reveal>
              <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-light uppercase leading-[0.95] tracking-tight">
                Ideas we&apos;re <span className="text-violet">building</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-mist">
              Concept projects that show the kind of experiences we create. Real case studies are on the way — yours could be next.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-x-8 gap-y-16 md:grid-cols-2">
          {projects.map((p, i) => (
            <TiltCard key={p.name} p={p} i={i} />
          ))}
        </div>

        <Reveal className="mt-20 flex justify-center">
          <ScrollLink
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full border border-line px-7 py-4 text-sm transition-colors hover:border-violet hover:bg-violet"
          >
            Make yours the first case study
            <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </ScrollLink>
        </Reveal>
      </div>
    </section>
  );
}
