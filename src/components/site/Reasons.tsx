"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal, SectionLabel } from "@/components/ui/Reveal";
import { faqs, reasons } from "@/lib/site";

const stack = ["React", "Next.js", "TypeScript", "Three.js", "R3F", "GSAP", "Framer Motion", "Tailwind", "Supabase", "Vercel", "Blender", "Figma"];

export function Reasons() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="relative border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-10 md:py-32">
        <SectionLabel index="05">Why Renderlane</SectionLabel>
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <h2 className="font-display text-[clamp(2.4rem,5.5vw,4.6rem)] font-light uppercase leading-[0.95] tracking-tight">
                Small studio. <br />
                <span className="text-violet">Big</span> attention.
              </h2>
            </Reveal>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-line bg-line sm:grid-cols-2">
              {reasons.map((r, i) => (
                <Reveal key={r.title} delay={i * 0.06} className="bg-ink p-6">
                  <Icon name="check" className="h-5 w-5 text-violet" />
                  <h3 className="mt-4 font-display text-xl">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mist">{r.body}</p>
                </Reveal>
              ))}
            </div>
            <div className="mt-10">
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-mist">Our toolkit</p>
              <div className="flex flex-wrap gap-2">
                {stack.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 20 }}
                    whileHover={{ y: -3 }}
                    className="rounded-full border border-line bg-ink-2 px-4 py-2 text-sm text-paper/90 hover:border-violet"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-6 font-display text-2xl font-light uppercase tracking-tight">Questions clients ask</h3>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f, i) => {
                const isOpen = open === i;
                return (
                  <div key={f.q}>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-6 py-6 text-left"
                      aria-expanded={isOpen}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span className="font-display text-lg md:text-xl">{f.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${isOpen ? "border-violet bg-violet" : "border-line"}`}
                      >
                        <Icon name="plus" className="h-4 w-4" />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-lg pb-6 leading-relaxed text-mist">{f.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
