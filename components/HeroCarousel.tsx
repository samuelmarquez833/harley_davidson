"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import ThreeBackground from "./ThreeBackground";
import { bikeModels } from "@/lib/content";

const tintFilters: Record<string, string> = {
  "vrod-night": "none",
  "iron-883": "sepia(0.6) hue-rotate(320deg) saturate(2) brightness(0.85)",
  "fat-boy": "saturate(0) brightness(0.7)",
};

const accentColors: Record<string, string> = {
  orange: "#FF6B00",
  red: "#FF0000",
  silver: "#C0C0C0",
};

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const model = bikeModels[current];
  const accent = accentColors[model.accent];

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + bikeModels.length) % bikeModels.length),
    []
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % bikeModels.length),
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <section
      className="relative w-full h-screen overflow-hidden bg-[#080808]"
      style={{ minHeight: "100dvh" }}
    >
      {/* Three.js particles */}
      <div className="absolute inset-0 z-0">
        {mounted && <ThreeBackground accentHex={accent} />}
      </div>

      {/* Giant faded brand name */}
      <div
        className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden
      >
        <span
          className="font-bebas whitespace-nowrap text-white"
          style={{ fontSize: "20vw", opacity: 0.05, letterSpacing: "0.05em" }}
        >
          HARLEY DAVIDSON
        </span>
      </div>

      {/* Accent background glow — CSS transition, no framer-motion */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse 60% 60% at 50% 80%, ${accent}22 0%, transparent 70%)`,
        }}
      />

      {/* Bike image — CSS crossfade, avoids SSR hydration issue */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center pointer-events-none">
        <div
          className="relative"
          style={{
            width: "clamp(380px, 68vw, 880px)",
            height: "clamp(190px, 42vh, 500px)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={model.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src="/vrod-darker-enblanco.jpg"
                alt={model.name}
                fill
                priority
                className="object-contain"
                style={{
                  mixBlendMode: "multiply",
                  filter: `brightness(1.6) contrast(1.1) ${tintFilters[model.id]}`,
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Model name */}
      <div className="absolute bottom-[22%] left-0 right-0 z-[3] overflow-hidden px-8 md:px-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.h1
            key={model.id + "-name"}
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={{ y: "-110%", opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-bebas leading-none text-white"
            style={{
              fontSize: "clamp(3rem, 11vw, 10rem)",
              letterSpacing: "0.03em",
            }}
          >
            {model.name}
          </motion.h1>
        </AnimatePresence>
      </div>

      {/* Subtitle + description */}
      <div className="absolute bottom-[14%] left-0 right-0 z-[3] px-8 md:px-20 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={model.id + "-desc"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
          >
            <p
              className="font-mono text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: accent }}
            >
              {model.subtitle}
            </p>
            <p className="font-mono text-sm text-white/40 max-w-md leading-relaxed hidden md:block">
              {model.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot navigation */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-4">
        {bikeModels.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setCurrent(i)}
            aria-label={`Select ${m.name}`}
          >
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: i === current ? 28 : 8,
                height: 8,
                background:
                  i === current ? accent : "rgba(255,255,255,0.2)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        aria-label="Previous model"
        className="absolute left-6 top-1/2 -translate-y-1/2 z-[4] w-12 h-12 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors duration-300 group"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M12 4L6 10L12 16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-[#FF6B00] transition-colors duration-300"
          />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Next model"
        className="absolute right-6 top-1/2 -translate-y-1/2 z-[4] w-12 h-12 flex items-center justify-center border border-white/10 hover:border-white/40 transition-colors duration-300 group"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M8 4L14 10L8 16"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="group-hover:stroke-[#FF6B00] transition-colors duration-300"
          />
        </svg>
      </button>

      {/* Nav bar */}
      <nav className="absolute top-0 left-0 right-0 z-[5] flex items-center justify-between px-8 md:px-16 py-7">
        <span className="font-bebas text-xl tracking-[0.3em] text-white">
          HARLEY<span style={{ color: accent }}>.</span>
        </span>
        <div className="hidden md:flex items-center gap-8">
          {["Models", "Performance", "Heritage", "Configure"].map((item) => (
            <a
              key={item}
              href="#"
              className="font-mono text-xs tracking-[0.2em] text-white/40 hover:text-white transition-colors duration-300 uppercase"
            >
              {item}
            </a>
          ))}
        </div>
        <button className="font-mono text-xs tracking-[0.2em] border border-white/20 px-5 py-2.5 hover:border-white/60 hover:text-white text-white/60 transition-all duration-300 uppercase">
          Locate Dealer
        </button>
      </nav>

      {/* Scroll indicator */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-[3] flex flex-col items-center gap-2 pointer-events-none">
        <div className="writing-vertical font-mono text-[10px] tracking-[0.3em] text-white/20 uppercase">
          Scroll
        </div>
        <div className="w-px h-16 bg-gradient-to-b from-white/20 to-transparent" />
      </div>

      {/* Progress line */}
      <div
        className="absolute bottom-0 left-0 z-[3] h-[2px] transition-all duration-700"
        style={{
          width: `${((current + 1) / bikeModels.length) * 100}%`,
          background: accent,
        }}
      />

      {/* Counter */}
      <div className="absolute top-1/2 left-8 -translate-y-1/2 z-[3] pointer-events-none hidden md:block">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/20">
          {String(current + 1).padStart(2, "0")} /{" "}
          {String(bikeModels.length).padStart(2, "0")}
        </span>
      </div>
    </section>
  );
}
