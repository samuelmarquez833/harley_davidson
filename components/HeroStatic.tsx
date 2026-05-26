"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function HeroStatic() {
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#080808]" style={{ minHeight: "100dvh" }}>

      {/* ── "V-ROD" giant ghost text behind everything ── */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
        aria-hidden
      >
        <span
          className="font-bebas text-white whitespace-nowrap leading-none"
          style={{ fontSize: "28vw", opacity: 0.05, letterSpacing: "0.04em" }}
        >
          V-ROD
        </span>
      </div>

      {/* ── Motorcycle fullscreen ── */}
      <div className="absolute inset-0 z-[2] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 1.06 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full"
        >
          <Image
            src="/vrod-darker-enblanco.jpg"
            alt="Harley-Davidson V-Rod Night"
            fill
            priority
            className="object-contain"
            style={{
              mixBlendMode: "multiply",
              filter: "brightness(1.8) contrast(1.15)",
            }}
          />
        </motion.div>
      </div>

      {/* ── Top-to-bottom gradient fade (top and bottom edges) ── */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, #080808 0%, transparent 18%, transparent 72%, #080808 100%)",
        }}
      />

      {/* ── Orange radial glow under bike ── */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 35% at 50% 72%, rgba(255,107,0,0.13) 0%, transparent 70%)",
        }}
      />

      {/* ── Navbar ── */}
      <nav className="absolute top-0 left-0 right-0 z-[10] flex items-center justify-between px-8 md:px-16 py-7">
        <span className="font-bebas text-xl tracking-[0.3em] text-white">
          HARLEY<span className="text-[#FF6B00]">.</span>
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
        <button className="font-mono text-xs tracking-[0.2em] border border-white/20 px-5 py-2.5 hover:border-[#FF6B00] hover:text-[#FF6B00] text-white/60 transition-all duration-300 uppercase">
          Locate Dealer
        </button>
      </nav>

      {/* ── Bottom-left: model info ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-12 left-8 md:left-16 z-[10]"
      >
        <p className="font-mono text-[10px] tracking-[0.4em] text-[#FF6B00] uppercase mb-2">
          V-Rod Night · 1250cc Revolution
        </p>
        <h1
          className="font-bebas text-white leading-none"
          style={{ fontSize: "clamp(3.5rem, 9vw, 8.5rem)", letterSpacing: "0.02em" }}
        >
          V-ROD NIGHT
        </h1>
      </motion.div>

      {/* ── Bottom-right: scroll prompt ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="absolute bottom-12 right-8 md:right-16 z-[10] flex flex-col items-end gap-3"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-white/30 uppercase">
          Scroll to explore
        </span>
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#FF6B00]/60 to-transparent mx-auto" />
      </motion.div>

      {/* ── Side counter ── */}
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-[10] pointer-events-none hidden md:flex flex-col items-center gap-2">
        <span className="writing-vertical font-mono text-[9px] tracking-[0.4em] text-white/20 uppercase">
          01 / 03
        </span>
      </div>

      {/* ── Bottom orange progress line ── */}
      <motion.div
        className="absolute bottom-0 left-0 z-[10] h-[2px] bg-[#FF6B00]"
        initial={{ width: "0%" }}
        animate={ready ? { width: "33.33%" } : {}}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </section>
  );
}
