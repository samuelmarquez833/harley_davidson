"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import Image from "next/image";
import { siteConfig } from "@/lib/content";
import { useBike } from "@/lib/BikeContext";

function MagneticButton({ accent }: { accent: string }) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);

  const onMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * 0.3,
      y: (e.clientY - cy) * 0.3,
    });
  };

  const onMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
    setHovered(false);
  };

  return (
    <motion.button
      ref={btnRef}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.4 }}
      onMouseMove={onMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onMouseLeave}
      className="relative overflow-hidden font-mono text-sm tracking-[0.3em] uppercase"
      style={{
        padding: "20px 56px",
        border: `1.5px solid ${accent}`,
        color: hovered ? "#080808" : accent,
        transition: "color 0.4s cubic-bezier(0.16,1,0.3,1), border-color 0.6s ease",
      }}
    >
      <span
        className="absolute inset-0"
        style={{
          background: accent,
          transform: hovered ? "scaleY(1)" : "scaleY(0)",
          transformOrigin: "bottom",
          transition: "transform 0.45s cubic-bezier(0.16,1,0.3,1)",
        }}
      />
      <span className="relative z-10">{siteConfig.ctaText}</span>
    </motion.button>
  );
}

function PulsingDot({ accent }: { accent: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5">
        <span
          className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50"
          style={{ background: accent }}
        />
        <span
          className="relative inline-flex h-2.5 w-2.5 rounded-full"
          style={{ background: accent }}
        />
      </span>
      <span className="font-mono text-xs tracking-[0.25em] text-white/40 uppercase">
        {siteConfig.limitedText}
      </span>
    </span>
  );
}

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });
  const { model } = useBike();
  const accent = model.accentHex;

  return (
    <section
      ref={ref}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[#080808]"
      style={{ minHeight: "100dvh" }}
    >
      {/* Moto silhouette — multiply blend removes white box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div style={{ width: "82vw", height: "52vh", position: "relative" }}>
          <Image
            src="/vrod-darker-enblanco.jpg"
            alt=""
            fill
            aria-hidden
            className="object-contain"
            style={{
              mixBlendMode: "multiply",
              filter: "brightness(1.6) contrast(1.1)",
              opacity: 0.06,
            }}
          />
        </div>
      </div>

      {/* Radial glow — color según moto activa */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${accent}12 0%, transparent 70%)`,
          transition: "background 0.8s ease",
        }}
      />

      {/* Corner brackets — color según moto activa */}
      {[
        "top-12 left-12 border-l-2 border-t-2",
        "top-12 right-12 border-r-2 border-t-2",
        "bottom-12 left-12 border-l-2 border-b-2",
        "bottom-12 right-12 border-r-2 border-b-2",
      ].map((cls, i) => (
        <div
          key={i}
          className={`absolute w-10 h-10 pointer-events-none ${cls}`}
          style={{ borderColor: `${accent}40`, transition: "border-color 0.6s ease" }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 text-center px-8">
        {/* Nombre de la moto activa — cambia con animación */}
        <div className="overflow-hidden mb-8">
          <AnimatePresence mode="wait">
            <motion.p
              key={model.id + "-cta-label"}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="font-mono text-[10px] tracking-[0.5em] uppercase"
              style={{ color: accent, transition: "color 0.6s ease" }}
            >
              {model.name} · {model.card1.value}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* OWN — clip-path reveal */}
        <div className="overflow-hidden mb-1">
          <motion.h2
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="font-bebas text-white leading-none"
            style={{
              fontSize: "clamp(4.5rem, 17vw, 15rem)",
              letterSpacing: "-0.01em",
            }}
          >
            OWN
          </motion.h2>
        </div>

        {/* THE DARK — clip-path reveal, outlined */}
        <div className="overflow-hidden mb-4">
          <motion.h2
            initial={{ clipPath: "inset(0 100% 0 0)" }}
            animate={isInView ? { clipPath: "inset(0 0% 0 0)" } : {}}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.36 }}
            className="font-bebas leading-none"
            style={{
              fontSize: "clamp(4.5rem, 17vw, 15rem)",
              letterSpacing: "-0.01em",
              color: "transparent",
              WebkitTextStroke: `1.5px ${accent}50`,
              transition: "-webkit-text-stroke-color 0.6s ease",
            }}
          >
            THE DARK
          </motion.h2>
        </div>

        {/* Subtítulo de la moto */}
        <div className="overflow-hidden mb-12">
          <AnimatePresence mode="wait">
            <motion.p
              key={model.id + "-cta-sub"}
              initial={{ y: "110%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-110%", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
              className="font-mono text-white/25 uppercase tracking-[0.35em]"
              style={{ fontSize: "9px" }}
            >
              {model.subtitle}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-6"
        >
          <MagneticButton accent={accent} />
          <PulsingDot accent={accent} />
        </motion.div>
      </div>

      {/* Footer strip */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-12 z-10">
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/15 uppercase">
          Harley-Davidson Motor Company
        </span>
        <span className="font-mono text-[10px] tracking-[0.3em] text-white/15 uppercase">
          Est. 1903
        </span>
      </div>
    </section>
  );
}
