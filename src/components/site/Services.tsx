"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";
import { services } from "@/lib/site";

function ServiceCard({ s, i }: { s: (typeof services)[number]; i: number }) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
      className="group relative"
    >
      <div
        ref={ref}
        onPointerMove={(e) => {
          const el = ref.current;
          if (!el) return;
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }}
        className="relative h-full overflow-hidden rounded-3xl border border-line bg-ink-2 p-7 transition-colors duration-500 hover:border-violet/50 md:p-8"
      >
        {/* spotlight that follows the pointer */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(124,92,255,0.18), transparent 60%)",
          }}
          aria-hidden="true"
        />
        <div className="relative flex items-start justify-between">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-line bg-ink text-violet transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
            <Icon name={s.icon} className="h-6 w-6" />
          </span>
          <span className="font-mono text-xs text-mist">0{i + 1}</span>
        </div>
        <h3 className="relative mt-10 font-display text-2xl font-normal tracking-tight md:text-[1.7rem]">{s.title}</h3>
        <p className="relative mt-3 text-sm leading-relaxed text-mist">{s.body}</p>
        <div className="relative mt-6 flex flex-wrap gap-2">
          {s.tags.map((t) => (
            <span key={t} className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-mist">
              {t}
            </span>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

export function Services() {
  return (
    <section id="services" className="relative mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
      <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <SectionLabel index="02">Services</SectionLabel>
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-light uppercase leading-[0.95] tracking-tight">
              Everything you need to <span className="text-violet">stand out</span> online
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-sm text-mist">
            From a single launch page to a full 3D experience — designed, built and looked after by the same small team.
          </p>
        </Reveal>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <ServiceCard key={s.title} s={s} i={i} />
        ))}
      </div>
    </section>
  );
}
