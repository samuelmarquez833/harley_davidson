"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

/* ─── Animated counter ────────────────────────────────────────────── */
function Counter({
  to,
  prefix = "",
  suffix = "",
  active,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
}) {
  const [val, setVal] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;
    const duration = 1600;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4); // ease-out quart
      setVal(Math.floor(e * to));
      if (p < 1) raf = requestAnimationFrame(tick);
      else setVal(to);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, to]);

  const display = to <= 9 ? String(val).padStart(2, "0") : val.toLocaleString();
  return <>{prefix}{display}{suffix}</>;
}

/* ─── One floating stat block ─────────────────────────────────────── */
function StatBlock({
  label,
  to,
  prefix,
  suffix,
  active,
  position,
}: {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  position: "left" | "right" | "bottom";
}) {
  const posStyle: React.CSSProperties =
    position === "left"
      ? { left: "6%", top: "50%", transform: "translateY(-50%)", textAlign: "left" }
      : position === "right"
      ? { right: "6%", top: "50%", transform: "translateY(-50%)", textAlign: "right" }
      : { bottom: "12%", left: "50%", transform: "translateX(-50%)", textAlign: "center" };

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        ...posStyle,
        opacity: active ? 1 : 0,
        transform: `${posStyle.transform} translateY(${active ? "0px" : "18px"})`,
        transition: "opacity 0.75s cubic-bezier(0.16,1,0.3,1), transform 0.75s cubic-bezier(0.16,1,0.3,1)",
        zIndex: 10,
      }}
    >
      {/* Label */}
      <p className="font-mono text-[10px] tracking-[0.4em] text-[#FF6B00] uppercase mb-1">
        {label}
      </p>

      {/* Giant number */}
      <p
        className="font-bebas text-white leading-none"
        style={{ fontSize: "clamp(3rem, 6.5vw, 6rem)" }}
      >
        <Counter to={to} prefix={prefix} suffix={suffix} active={active} />
      </p>

      {/* Accent line */}
      <div
        className="mt-3 h-px bg-[#FF6B00] transition-all duration-700"
        style={{ width: active ? (position === "right" ? "100%" : "70%") : "0%", marginLeft: position === "right" ? "auto" : "0" }}
      />
    </div>
  );
}

/* ─── Main component ──────────────────────────────────────────────── */
export default function StickyMoto() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  // RAF loop — reliable with Lenis
  useEffect(() => {
    let raf: number;
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / scrollable));
        setProgress(p);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  const stat1 = progress >= 0.28;
  const stat2 = progress >= 0.58;
  const stat3 = progress >= 0.88;

  return (
    <section ref={containerRef} className="relative" style={{ height: "300vh" }}>
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080808]">

        {/* Section label — top left */}
        <div className="absolute top-8 left-8 md:left-16 z-20 pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.4em] text-white/20 uppercase">
            Performance
          </p>
        </div>

        {/* Progress indicator — top right */}
        <div className="absolute top-8 right-8 md:right-16 z-20 pointer-events-none flex items-center gap-3">
          <div className="w-20 h-px bg-white/10 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#FF6B00] transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className="font-mono text-[9px] tracking-widest text-white/20">
            {Math.round(progress * 100)}%
          </span>
        </div>

        {/* ── Motorcycle — pinned center ── */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
          <div
            className="relative"
            style={{
              width: "clamp(340px, 62vw, 820px)",
              height: "clamp(170px, 42vh, 480px)",
            }}
          >
            <Image
              src="/vrod-darker-enblanco.jpg"
              alt="V-Rod Night"
              fill
              className="object-contain"
              style={{
                mixBlendMode: "multiply",
                filter: "brightness(1.8) contrast(1.15)",
              }}
            />

            {/* Glow under bike */}
            <div
              className="absolute -bottom-12 left-1/2 -translate-x-1/2 pointer-events-none"
              style={{
                width: "80%",
                height: "80px",
                background: "radial-gradient(ellipse, rgba(255,107,0,0.18) 0%, transparent 70%)",
                filter: "blur(12px)",
              }}
            />
          </div>
        </div>

        {/* ── Floating stats ── */}
        <StatBlock
          label="0–100 KPH"
          to={4}
          prefix="0"
          suffix=" SECS+"
          active={stat1}
          position="left"
        />
        <StatBlock
          label="Engine"
          to={1250}
          suffix=" CC"
          active={stat2}
          position="right"
        />
        <StatBlock
          label="Torque"
          to={115}
          suffix=" NM"
          active={stat3}
          position="bottom"
        />

        {/* ── Horizontal divider lines (appear with stats) ── */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 z-[1] h-px bg-gradient-to-r from-[#FF6B00]/30 to-transparent pointer-events-none"
          style={{
            width: stat1 ? "22%" : "0%",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 z-[1] h-px bg-gradient-to-l from-[#FF6B00]/30 to-transparent pointer-events-none"
          style={{
            width: stat2 ? "22%" : "0%",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />

        {/* ── "V-ROD" ghost behind bike ── */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-[1]"
          aria-hidden
        >
          <span
            className="font-bebas text-white whitespace-nowrap"
            style={{ fontSize: "24vw", opacity: 0.03, letterSpacing: "0.03em" }}
          >
            PERFORMANCE
          </span>
        </div>

        {/* ── Bottom gradient ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[3]"
          style={{
            background: "linear-gradient(to top, #080808, transparent)",
          }}
        />
      </div>
    </section>
  );
}
