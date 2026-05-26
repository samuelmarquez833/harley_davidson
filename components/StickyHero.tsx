"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import dynamic from "next/dynamic";
import { bikeModels } from "@/lib/content";
import { useBike } from "@/lib/BikeContext";
import HDLogo from "@/components/HDLogo";

const HeroBike3D = dynamic(() => import("./HeroBike3D"), { ssr: false });

/* ── Menu lateral de motos ─────────────────────────────────────── */
function BikeDrawer({
  open,
  active,
  onSelect,
  onClose,
}: {
  open: boolean;
  active: number;
  onSelect: (i: number) => void;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={onClose}
            className="fixed inset-0"
            style={{ zIndex: 200, background: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)" }}
          />

          {/* Drawer */}
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 h-full flex flex-col"
            style={{
              zIndex: 210,
              width: "clamp(260px, 35vw, 420px)",
              background: "rgba(8,8,8,0.97)",
              borderRight: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-7 py-6"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="font-mono uppercase tracking-[0.3em] text-white/40"
                style={{ fontSize: "10px" }}
              >
                Modelos
              </span>
              <button
                onClick={onClose}
                aria-label="Cerrar menú"
                className="text-white/30 hover:text-white transition-colors duration-200"
                style={{ fontSize: "22px", lineHeight: 1, padding: "4px" }}
              >
                ×
              </button>
            </div>

            {/* Lista de motos */}
            <nav className="flex flex-col gap-0 flex-1 overflow-y-auto py-4">
              {bikeModels.map((bike, i) => {
                const isActive = i === active;
                return (
                  <motion.button
                    key={bike.id}
                    onClick={() => { onSelect(i); onClose(); }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="group relative flex flex-col text-left px-7 py-5 transition-all duration-300"
                    style={{
                      background: isActive ? `${bike.accentHex}10` : "transparent",
                      borderLeft: isActive
                        ? `3px solid ${bike.accentHex}`
                        : "3px solid transparent",
                    }}
                  >
                    {/* Index */}
                    <span
                      className="font-mono text-white/20 mb-1"
                      style={{ fontSize: "9px", letterSpacing: "0.4em" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    {/* Nombre */}
                    <span
                      className="font-bebas leading-none mb-1 transition-colors duration-300 group-hover:opacity-100"
                      style={{
                        fontSize: "clamp(1.6rem, 3.5vw, 2.2rem)",
                        color: isActive ? bike.accentHex : "rgba(255,255,255,0.75)",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {bike.name}
                    </span>

                    {/* Subtítulo */}
                    <span
                      className="font-mono text-white/30 uppercase"
                      style={{ fontSize: "9px", letterSpacing: "0.25em" }}
                    >
                      {bike.subtitle}
                    </span>

                    {/* Specs breves */}
                    <div className="flex gap-4 mt-2">
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "8px", letterSpacing: "0.2em", color: isActive ? bike.accentHex : "rgba(255,255,255,0.2)" }}
                      >
                        {bike.card1.value}
                      </span>
                      <span className="font-mono text-white/15" style={{ fontSize: "8px" }}>·</span>
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "8px", letterSpacing: "0.2em", color: "rgba(255,255,255,0.2)" }}
                      >
                        {bike.card1.label}
                      </span>
                    </div>

                    {/* Hover accent line */}
                    <div
                      className="absolute bottom-0 left-7 right-7 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{ background: `${bike.accentHex}30` }}
                    />
                  </motion.button>
                );
              })}
            </nav>

            {/* Footer */}
            <div
              className="px-7 py-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="font-mono text-white/15 uppercase"
                style={{ fontSize: "8px", letterSpacing: "0.35em" }}
              >
                Harley-Davidson Motor Co.
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}


/* Spec card */
function SpecCard({ label, value, detail, accent }: {
  label: string; value: string; detail: string; accent: string;
}) {
  return (
    <div
      className="flex flex-col gap-1 px-3 py-2.5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.10)",
        minWidth: 100,
      }}
    >
      <span className="font-mono text-[8px] tracking-[0.45em] text-white/30 uppercase">{label}</span>
      <span
        className="font-bebas leading-none"
        style={{ fontSize: "1.45rem", color: accent, letterSpacing: "0.03em" }}
      >
        {value}
      </span>
      <span className="font-mono text-[7px] tracking-[0.3em] text-white/20 uppercase">{detail}</span>
    </div>
  );
}

export default function StickyHero() {
  const { active, setActive }     = useBike();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [uiOpacity, setUiOpacity] = useState(1);
  const [navVisible, setNavVisible] = useState(true);
  const scrollRef                 = useRef(0);
  const lastScrollY               = useRef(0);

  const model      = bikeModels[active];
  const accent     = model.accentHex;
  const atStart    = active === 0;
  const atEnd      = active === bikeModels.length - 1;
  const prev       = () => { if (!atStart) setActive(active - 1); };
  const next       = () => { if (!atEnd)   setActive(active + 1); };

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const sy = window.scrollY;
      const vh = window.innerHeight;
      setUiOpacity(Math.max(0, 1 - sy / (vh * 0.18)));
      scrollRef.current = sy / (vh * 4);

      /* Navbar hide on scroll down, show on scroll up */
      const delta = sy - lastScrollY.current;
      if (sy < 50)        setNavVisible(true);
      else if (delta > 2) setNavVisible(false);
      else if (delta < -2) setNavVisible(true);
      lastScrollY.current = sy;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* ══════════════════════════════════════════════
          BIKE DRAWER MENU
      ══════════════════════════════════════════════ */}
      <BikeDrawer
        open={menuOpen}
        active={active}
        onSelect={setActive}
        onClose={() => setMenuOpen(false)}
      />

      {/* ══════════════════════════════════════════════
          FIXED BACKGROUND  z:1
          particles + warm gradient + title + moto
      ══════════════════════════════════════════════ */}
      <div
        className="fixed inset-0"
        style={{
          zIndex: 1,
          background: "radial-gradient(ellipse 150% 150% at 50% 55%, #1a0500 0%, #0d0200 50%, #080808 100%)",
        }}
      >

        {/* Single WebGL canvas — particles + bike (one context, no conflict) */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <HeroBike3D accentHex={accent} glbPath={model.glbPath} scrollRef={scrollRef} />
        </div>

        {/* ── TITLE — starts at 72px to clear the navbar ────────── */}
        <div
          className="absolute top-0 left-0 right-0 z-[2]
                     flex flex-col px-6 md:px-10"
          style={{ paddingTop: "72px" }}
        >
          <p
            className="font-mono uppercase mb-1"
            style={{ fontSize: "11px", color: "#FF6B00", letterSpacing: "0.2em" }}
          >
            Harley-Davidson Motor Co.
          </p>

          {/* No overflow-hidden — animation uses opacity:0 at extremes so clipping isn't needed.
              No noise overlay — mix-blend-mode inside an isolated stacking context was
              causing the browser to render this area as an opaque block. */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.span
                key={model.id + "-title"}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: "0%",   opacity: 1 }}
                exit={{   y: "-110%", opacity: 0 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="block font-bebas leading-none whitespace-nowrap"
                style={{
                  fontSize: "clamp(4rem, 12vw, 14rem)",
                  color: accent,
                  letterSpacing: "-0.01em",
                  transition: "color 0.6s ease",
                }}
              >
                {model.name}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Per-model accent glow */}
        <div
          className="absolute inset-0 z-[3] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 30% at 50% 60%, ${accent}${model.glowOpacity} 0%, transparent 70%)`,
            transition: "background 1.2s ease",
          }}
        />

      </div>

      {/* ══════════════════════════════════════════════
          TOP BAR  z:25
          hamburger · HD mark · buy now
      ══════════════════════════════════════════════ */}
      <div
        className="fixed top-0 left-0 right-0 flex items-center justify-between px-7 md:px-12 py-6"
        style={{
          zIndex: 100,
          transform: navVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        {/* Hamburger */}
        <button
          aria-label="Menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex flex-col gap-[5px] group relative"
        >
          <motion.span
            animate={menuOpen
              ? { rotate: 45, y: 6, width: 22, backgroundColor: "#ffffff" }
              : { rotate: 0,  y: 0, width: 22, backgroundColor: "rgba(255,255,255,0.5)" }
            }
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block h-px origin-center"
            style={{ display: "block", height: "1px" }}
          />
          <motion.span
            animate={menuOpen
              ? { opacity: 0, scaleX: 0 }
              : { opacity: 1, scaleX: 1, width: 16, backgroundColor: "rgba(255,255,255,0.5)" }
            }
            transition={{ duration: 0.2 }}
            className="block h-px"
            style={{ display: "block", height: "1px", width: 16 }}
          />
          <motion.span
            animate={menuOpen
              ? { rotate: -45, y: -6, width: 22, backgroundColor: "#ffffff" }
              : { rotate: 0,   y: 0,  width: 22, backgroundColor: "rgba(255,255,255,0.5)" }
            }
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="block h-px origin-center"
            style={{ display: "block", height: "1px" }}
          />
        </button>

        {/* Wordmark — centrado absolutamente para que no dependa del ancho de los extremos */}
        <div className="absolute left-1/2 -translate-x-1/2 pointer-events-none">
          {/* Logo en mobile */}
          <span className="md:hidden flex items-center">
            <HDLogo color="#ffffff" height={36} />
          </span>
          {/* Texto en desktop */}
          <span
            className="hidden md:block font-bebas text-white"
            style={{ fontSize: "13px", letterSpacing: "0.3em" }}
          >
            HARLEY-DAVIDSON
          </span>
        </div>

        {/* Buy now */}
        <button
          className="font-mono text-[10px] tracking-[0.25em] uppercase text-[#080808]
                     bg-white hover:bg-white/80 transition-colors duration-300
                     px-4 py-2 rounded-full"
        >
          Buy now
        </button>
      </div>

      {/* ══════════════════════════════════════════════
          BOTTOM UI  z:25 — fades on scroll
          spec cards · scroll · controls + buy
      ══════════════════════════════════════════════ */}
      <div
        className="fixed bottom-0 left-0 right-0 flex items-end justify-between
                   px-7 md:px-12 pb-8 md:pb-10"
        style={{
          zIndex: 90,
          opacity: uiOpacity,
          pointerEvents: uiOpacity < 0.05 ? "none" : "auto",
          transition: "opacity 0.3s ease",
        }}
      >
        {/* LEFT — spec cards (solo desktop) */}
        <div className="hidden md:flex items-end gap-2">
          <SpecCard {...model.card1} accent={accent} />
          <SpecCard {...model.card2} accent={accent} />
        </div>

        {/* CENTER — scroll indicator */}
        <div className="hidden md:flex flex-col items-center gap-2 pb-1">
          <span className="font-mono text-[8px] tracking-[0.5em] text-white/25 uppercase">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path
                d="M5 1 L5 12 M1.5 8.5 L5 12 L8.5 8.5"
                stroke="rgba(255,255,255,0.25)"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </div>

        {/* RIGHT — carousel controls + buy now */}
        <div className="flex flex-col items-end gap-3">
          {/* Arrows + counter */}
          <div className="flex items-center gap-5">
            <button
              onClick={prev}
              disabled={atStart}
              aria-label="Previous"
              className="font-light leading-none transition-all duration-300"
              style={{
                fontSize: "2.2rem",
                color: "white",
                opacity: atStart ? 0.3 : 1,
                cursor: atStart ? "not-allowed" : "pointer",
              }}
            >
              ‹
            </button>
            <span className="font-mono tracking-[0.3em] text-white/50" style={{ fontSize: "1rem" }}>
              {String(active + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(bikeModels.length).padStart(2, "0")}
            </span>
            <button
              onClick={next}
              disabled={atEnd}
              aria-label="Next"
              className="font-light leading-none transition-all duration-300"
              style={{
                fontSize: "2.2rem",
                color: atEnd ? "white" : accent,
                opacity: atEnd ? 0.3 : 1,
                cursor: atEnd ? "not-allowed" : "pointer",
              }}
            >
              ›
            </button>
          </div>

          {/* Dot strip */}
          <div className="flex items-center gap-2">
            {bikeModels.map((m, i) => (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                aria-label={`Select ${m.name}`}
                style={{
                  width: i === active ? 22 : 5,
                  height: 2,
                  borderRadius: 2,
                  background: i === active ? m.accentHex : "rgba(255,255,255,0.18)",
                  transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          CINEMATIC FRAME — desktop only  z:30
      ══════════════════════════════════════════════ */}
      <div
        className="fixed pointer-events-none hidden md:block"
        style={{
          inset: "0",
          border: `14px solid ${accent}`,
          borderRadius: "22px",
          zIndex: 30,
          transition: "border-color 0.8s ease",
          boxShadow: `inset 0 0 40px ${accent}22`,
        }}
      />
    </>
  );
}
