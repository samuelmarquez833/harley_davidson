"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import ThreeBackground from "./ThreeBackground";
import { bikeModels } from "@/lib/content";

const tintFilters: Record<string, string> = {
  "vrod-night": "brightness(1.8) contrast(1.15)",
  "iron-883": "brightness(1.6) contrast(1.2) sepia(0.5) hue-rotate(320deg) saturate(2)",
  "fat-boy": "brightness(1.4) contrast(1.1) saturate(0.2)",
};

const accentMap: Record<string, string> = {
  orange: "#FF6B00",
  red:    "#FF0000",
  silver: "#C0C0C0",
};

export default function ModelCarousel() {
  const [active, setActive] = useState(0);
  const model = bikeModels[active];
  const accent = accentMap[model.accent];

  return (
    <section className="relative bg-[#080808] overflow-hidden" style={{ minHeight: "100vh" }}>

      {/* ── Three.js particles behind ── */}
      <div className="absolute inset-0 z-0 opacity-60">
        <ThreeBackground accentHex={accent} />
      </div>

      {/* ── Top fade from previous section ── */}
      <div
        className="absolute top-0 left-0 right-0 h-32 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to bottom, #080808, transparent)" }}
      />

      <div className="relative z-[2] flex flex-col items-center justify-center min-h-screen px-6 md:px-16 py-24">

        {/* ── Section label ── */}
        <motion.p
          key={active + "-label"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-mono text-[10px] tracking-[0.5em] text-white/30 uppercase mb-6"
        >
          Select your model
        </motion.p>

        {/* ── Active model name ── */}
        <div className="overflow-hidden mb-3">
          <AnimatePresence mode="wait">
            <motion.h2
              key={model.id + "-heading"}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="font-bebas text-white leading-none text-center"
              style={{
                fontSize: "clamp(3.5rem, 10vw, 9rem)",
                color: accent,
                letterSpacing: "0.02em",
              }}
            >
              {model.name}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* ── Tagline ── */}
        <AnimatePresence mode="wait">
          <motion.p
            key={model.id + "-tag"}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
            className="font-mono text-sm text-white/40 tracking-[0.15em] mb-14 text-center"
          >
            {model.subtitle}
          </motion.p>
        </AnimatePresence>

        {/* ── 3 Cards ── */}
        <div className="w-full max-w-5xl grid grid-cols-3 gap-4 md:gap-6">
          {bikeModels.map((m, i) => {
            const isActive = i === active;
            const cardAccent = accentMap[m.accent];
            return (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className="relative group text-left transition-all duration-500 focus:outline-none"
                style={{
                  border: isActive ? `1.5px solid ${cardAccent}` : "1.5px solid rgba(255,255,255,0.07)",
                  background: isActive ? `${cardAccent}0a` : "transparent",
                  padding: "clamp(16px, 2.5vw, 28px)",
                }}
              >
                {/* Card number */}
                <p
                  className="font-mono text-[9px] tracking-[0.4em] uppercase mb-3"
                  style={{ color: isActive ? cardAccent : "rgba(255,255,255,0.2)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </p>

                {/* Bike thumbnail */}
                <div
                  className="relative mx-auto mb-4"
                  style={{ height: "clamp(70px, 10vw, 130px)" }}
                >
                  <Image
                    src="/vrod-darker-enblanco.jpg"
                    alt={m.name}
                    fill
                    className="object-contain"
                    style={{
                      mixBlendMode: "multiply",
                      filter: tintFilters[m.id],
                      opacity: isActive ? 1 : 0.45,
                      transition: "opacity 0.4s ease, filter 0.4s ease",
                    }}
                  />
                </div>

                {/* Model name */}
                <p
                  className="font-bebas leading-none mb-1 transition-colors duration-400"
                  style={{
                    fontSize: "clamp(1rem, 2.2vw, 1.75rem)",
                    color: isActive ? cardAccent : "rgba(255,255,255,0.5)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {m.name}
                </p>

                {/* Tagline */}
                <p
                  className="font-mono uppercase leading-snug transition-colors duration-400"
                  style={{
                    fontSize: "clamp(8px, 0.9vw, 10px)",
                    letterSpacing: "0.2em",
                    color: isActive ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.18)",
                  }}
                >
                  {m.subtitle}
                </p>

                {/* Active accent bottom line */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] transition-all duration-500"
                  style={{
                    width: isActive ? "100%" : "0%",
                    background: cardAccent,
                  }}
                />

                {/* Corner dot indicator */}
                <div
                  className="absolute top-3 right-3 rounded-full transition-all duration-400"
                  style={{
                    width: 6,
                    height: 6,
                    background: isActive ? cardAccent : "rgba(255,255,255,0.1)",
                  }}
                />
              </button>
            );
          })}
        </div>

        {/* ── Active model full description ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={model.id + "-desc"}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 max-w-lg text-center"
          >
            <p className="font-mono text-sm text-white/30 leading-relaxed">
              {model.description}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* ── Arrow indicators ── */}
        <div className="mt-10 flex items-center gap-3">
          {bikeModels.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Model ${i + 1}`}
              className="transition-all duration-400"
              style={{
                width: i === active ? 32 : 8,
                height: 2,
                background: i === active ? accent : "rgba(255,255,255,0.15)",
              }}
            />
          ))}
        </div>

      </div>

      {/* ── Bottom fade into story ── */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 z-[1] pointer-events-none"
        style={{ background: "linear-gradient(to top, #080808, transparent)" }}
      />
    </section>
  );
}
