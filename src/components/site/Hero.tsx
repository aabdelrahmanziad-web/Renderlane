"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { Magnetic } from "@/components/ui/Magnetic";
import { ScrollLink } from "@/components/ui/ScrollLink";
import { SplitWords } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { useIntro } from "./providers";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), { ssr: false });

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const { ready } = useIntro();
  const ref = useRef<HTMLElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const videoScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <section ref={ref} id="top" className="relative h-[100svh] min-h-[680px] overflow-hidden">
      {/* Video intro background */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: videoScale }}
        initial={{ opacity: 0, filter: "blur(20px)" }}
        animate={ready ? { opacity: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 1.8, ease }}
      >
        {videoOk ? (
          <video
            className="h-full w-full object-cover opacity-90"
            src="/video/hero.mp4"
            poster="/video/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            onError={() => setVideoOk(false)}
          />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_50%_100%,#3b2a99_0%,#0a0a0b_60%)]" />
        )}
      </motion.div>

      {/* overlays: grid, vignette, bottom fade */}
      <div className="grid-bg absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" aria-hidden="true" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#0a0a0b_95%)]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" aria-hidden="true" />

      {/* 3D gem */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.4, delay: 0.3 }}
      >
        <HeroScene ready={ready} />
      </motion.div>

      {/* Copy */}
      <motion.div
        className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-28 md:justify-center md:px-10 md:pb-0"
        style={{ y: textY, opacity: fade }}
      >
        <motion.p
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-line bg-ink/50 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-mist backdrop-blur"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-violet" />
          </span>
          Web studio · Now booking projects
        </motion.p>

        <h1 className="max-w-4xl font-display text-[clamp(3.2rem,9vw,8.5rem)] font-light uppercase leading-[0.92] tracking-[-0.02em]">
          <SplitWords text="Your lane" play={ready} delay={0.3} className="block" />
          <span className="block">
            <SplitWords text="to the" play={ready} delay={0.45} />{" "}
            <SplitWords text="web." play={ready} delay={0.6} className="font-medium text-violet" />
          </span>
        </h1>

        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-mist md:text-lg"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 0.9 }}
        >
          We design and build immersive websites with 3D, motion and Next.js, for brands that refuse to look basic.
        </motion.p>

        <motion.div
          className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: 1.05 }}
        >
          <Magnetic>
            <ScrollLink
              href="#contact"
              className="group inline-flex items-center gap-3 rounded-full bg-violet px-7 py-4 text-sm font-medium text-paper shadow-[0_0_40px_-8px_#7c5cff] transition-colors hover:bg-paper hover:text-ink"
            >
              Start your project
              <Icon name="arrow" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </ScrollLink>
          </Magnetic>
          <Magnetic>
            <ScrollLink
              href="#work"
              className="inline-flex items-center gap-2 rounded-full border border-line bg-ink/40 px-7 py-4 text-sm text-paper backdrop-blur transition-colors hover:border-paper/40"
            >
              See our work
            </ScrollLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* bottom bar: rotating badge + hint */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-6 z-10 mx-auto flex max-w-7xl items-end justify-between px-6 md:px-10"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 1.3 }}
      >
        <p className="hidden font-mono text-[11px] uppercase tracking-[0.2em] text-mist md:block">
          Move your mouse · click the gem
        </p>
        <div className="relative ml-auto h-24 w-24 md:h-28 md:w-28" aria-hidden="true">
          <svg viewBox="0 0 100 100" className="h-full w-full animate-[spin_14s_linear_infinite]">
            <defs>
              <path id="badge-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
            </defs>
            <text className="fill-mist font-mono text-[9.5px] uppercase tracking-[0.32em]">
              <textPath href="#badge-circle">Scroll to explore · Renderlane · </textPath>
            </text>
          </svg>
          <span className="absolute inset-0 m-auto flex h-9 w-9 items-center justify-center rounded-full border border-line">
            <Icon name="arrow" className="h-4 w-4 rotate-90 text-paper" />
          </span>
        </div>
      </motion.div>
    </section>
  );
}
