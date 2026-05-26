"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { storySteps } from "@/lib/content";
import { useBike } from "@/lib/BikeContext";

export default function TheStory() {
  const headerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: "0px 0px -60px 0px" });
  const lineInView = useInView(lineRef, { once: true, margin: "0px 0px -40px 0px" });
  const { model } = useBike();
  const accent = model.accentHex;

  return (
    <section className="relative bg-[#080808] py-32 md:py-48 px-8 md:px-20 overflow-hidden">
      {/* Background watermark — nombre de la moto activa */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={model.id + "-watermark"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.025 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="font-bebas text-white whitespace-nowrap block"
            style={{ fontSize: "25vw", letterSpacing: "-0.02em" }}
          >
            {model.name.split(" ")[0]}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Header */}
      <div ref={headerRef} className="mb-16 relative z-10">
        {/* Etiqueta dinámica con nombre de moto */}
        <div className="overflow-hidden mb-5">
          <AnimatePresence mode="wait">
            <motion.p
              key={model.id + "-story-label"}
              initial={{ y: "110%", opacity: 0 }}
              animate={headerInView ? { y: "0%", opacity: 1 } : { y: "110%", opacity: 0 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] tracking-[0.4em] uppercase"
              style={{ color: accent, transition: "color 0.6s ease" }}
            >
              The {model.name} Story
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-bebas text-white"
          style={{ fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.9 }}
        >
          Three Chapters.
          <br />
          <span className="text-white/20">One Machine.</span>
        </motion.h2>
      </div>

      {/* Accent line — color según moto activa */}
      <div ref={lineRef} className="relative z-10 mb-16 overflow-hidden">
        <div className="w-full h-px bg-white/[0.05]">
          <motion.div
            className="h-full origin-left"
            style={{ background: accent, transition: "background 0.6s ease" }}
            initial={{ scaleX: 0 }}
            animate={lineInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      {/* Story steps — each triggers its own InView */}
      <div className="relative z-10 grid md:grid-cols-3 gap-12 md:gap-8">
        {storySteps.map((step, i) => (
          <StoryStep key={step.number} step={step} index={i} accent={accent} />
        ))}
      </div>

      <div className="relative z-10 mt-24">
        <div className="w-full h-px bg-white/[0.04]" />
      </div>
    </section>
  );
}

function StoryStep({
  step,
  index,
  accent,
}: {
  step: { number: string; title: string; body: string };
  index: number;
  accent: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        ease: [0.16, 1, 0.3, 1],
        delay: index * 0.15,
      }}
      className="group relative"
    >
      <div className="flex items-center gap-4 mb-6">
        <span
          className="font-mono text-xs tracking-[0.3em]"
          style={{ color: accent, transition: "color 0.6s ease" }}
        >
          {step.number}
        </span>
        <div
          className="flex-1 h-px transition-colors duration-500"
          style={{
            background: "rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = `${accent}50`)}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
        />
      </div>

      <h3
        className="font-bebas text-white mb-4 leading-tight"
        style={{ fontSize: "clamp(1.8rem, 3.5vw, 3rem)" }}
      >
        {step.title}
      </h3>

      <p className="font-mono text-sm text-white/35 leading-relaxed">
        {step.body}
      </p>

      <div
        className="absolute -left-4 top-0 bottom-0 w-px bg-transparent group-hover:opacity-100 opacity-0 transition-opacity duration-500"
        style={{ background: accent }}
      />
    </motion.div>
  );
}
