"use client";

import { useEffect, useRef, useState } from "react";

/* ── Counter animation ─────────────────────────────────────────────── */
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
  const done = useRef(false);

  useEffect(() => {
    if (!active || done.current) return;
    done.current = true;

    const duration = 1700;
    const t0 = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const e = 1 - Math.pow(1 - p, 4);
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

/* ── One stat block ────────────────────────────────────────────────── */
type Side = "left" | "right" | "bottom";

function Stat({
  label,
  to,
  prefix = "",
  suffix = "",
  active,
  side,
}: {
  label: string;
  to: number;
  prefix?: string;
  suffix?: string;
  active: boolean;
  side: Side;
}) {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
    pointerEvents: "none",
    opacity: active ? 1 : 0,
    transition: "opacity 0.8s cubic-bezier(0.16,1,0.3,1), transform 0.8s cubic-bezier(0.16,1,0.3,1)",
  };

  const pos: React.CSSProperties =
    side === "left"
      ? {
          left: "7%",
          top: "50%",
          transform: active ? "translateY(-50%)" : "translateY(calc(-50% + 20px)",
          textAlign: "left",
        }
      : side === "right"
      ? {
          right: "7%",
          top: "50%",
          transform: active ? "translateY(-50%)" : "translateY(calc(-50% + 20px))",
          textAlign: "right",
        }
      : {
          bottom: "14%",
          left: "50%",
          transform: active ? "translateX(-50%)" : "translateX(-50%) translateY(20px)",
          textAlign: "center",
        };

  return (
    <div style={{ ...base, ...pos }}>
      {/* Label */}
      <p className="font-mono text-[10px] tracking-[0.45em] text-[#FF6B00] uppercase mb-1">
        {label}
      </p>

      {/* Number */}
      <p
        className="font-bebas text-white leading-none"
        style={{ fontSize: "clamp(3.2rem, 7vw, 6.5rem)" }}
      >
        <Counter to={to} prefix={prefix} suffix={suffix} active={active} />
      </p>

      {/* Accent underline */}
      <div
        className="mt-3 h-[2px] bg-[#FF6B00] transition-all duration-700"
        style={{
          width: active ? "60%" : "0%",
          marginLeft: side === "right" ? "auto" : side === "bottom" ? "auto" : "0",
          marginRight: side === "right" ? "0" : side === "bottom" ? "auto" : "auto",
        }}
      />
    </div>
  );
}

/* ── Main section ──────────────────────────────────────────────────── */
export default function StatsOverlay() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [p, setP] = useState(0); // scroll progress 0 → 1

  // RAF loop — reliable with Lenis
  useEffect(() => {
    let raf: number;
    const read = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        setP(Math.max(0, Math.min(1, scrolled / scrollable)));
      }
      raf = requestAnimationFrame(read);
    };
    raf = requestAnimationFrame(read);
    return () => cancelAnimationFrame(raf);
  }, []);

  const s1 = p >= 0.14; // left
  const s2 = p >= 0.46; // right
  const s3 = p >= 0.78; // bottom

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "220vh" }}
    >
      {/* ── Sticky viewport ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#080808]">

        {/* Top orange accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00]/60 to-transparent z-[20]" />

        {/* Section label */}
        <div className="absolute top-8 left-8 md:left-16 z-[10] pointer-events-none">
          <p className="font-mono text-[10px] tracking-[0.45em] text-white/20 uppercase">
            Performance
          </p>
        </div>

        {/* Scroll progress bar */}
        <div className="absolute top-8 right-8 md:right-16 z-[10] flex items-center gap-3 pointer-events-none">
          <div className="relative w-16 h-px bg-white/10 overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-[#FF6B00]"
              style={{ width: `${p * 100}%`, transition: "width 0.1s linear" }}
            />
          </div>
          <span className="font-mono text-[9px] tracking-widest text-white/20">
            {Math.round(p * 100)}%
          </span>
        </div>

        {/* ── Ghost watermark ── */}
        <div
          className="absolute inset-0 flex items-center justify-center
                     pointer-events-none select-none z-[1]"
          aria-hidden
        >
          <span
            className="font-bebas text-white whitespace-nowrap"
            style={{ fontSize: "22vw", opacity: 0.025, letterSpacing: "0.03em" }}
          >
            PERFORMANCE
          </span>
        </div>

        {/* ── Horizontal connector lines ── */}
        {/* Left */}
        <div
          className="absolute top-1/2 left-0 h-px z-[2] pointer-events-none
                     bg-gradient-to-r from-transparent to-[#FF6B00]/20"
          style={{
            width: s1 ? "20%" : "0%",
            marginTop: "-0.5px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}
        />
        {/* Right */}
        <div
          className="absolute top-1/2 right-0 h-px z-[2] pointer-events-none
                     bg-gradient-to-l from-transparent to-[#FF6B00]/20"
          style={{
            width: s2 ? "20%" : "0%",
            marginTop: "-0.5px",
            transition: "width 1s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}
        />

        {/* ── Stats ── */}
        <Stat label="0–100 KPH" to={4} prefix="0" suffix=" SECS+" active={s1} side="left" />
        <Stat label="Engine"    to={1250}             suffix=" CC"    active={s2} side="right" />
        <Stat label="Torque"    to={115}              suffix=" NM"    active={s3} side="bottom" />

        {/* Bottom gradient to blend into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-28 z-[5] pointer-events-none"
          style={{ background: "linear-gradient(to top, #080808, transparent)" }}
        />
      </div>
    </section>
  );
}
