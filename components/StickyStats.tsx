"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "motion/react";
import Image from "next/image";
import { stats } from "@/lib/content";

function AnimatedNumber({
  target,
  prefix,
  suffix,
  active,
}: {
  target: number;
  prefix: string;
  suffix: string;
  active: boolean;
}) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (!active || started.current) return;
    started.current = true;

    let raf: number;
    const duration = 1800;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      } else {
        setValue(target);
      }
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  const display =
    target <= 9 ? String(value).padStart(2, "0") : value.toLocaleString();

  return (
    <span>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}

function StatRow({
  stat,
  index,
  delay,
}: {
  stat: (typeof stats)[0];
  index: number;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" });

  return (
    <div ref={ref}>
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{
          duration: 0.75,
          ease: [0.16, 1, 0.3, 1],
          delay,
        }}
        className="flex items-baseline justify-between py-7 border-b border-white/[0.07]"
      >
        <span className="font-mono text-[10px] tracking-[0.35em] text-[#FF6B00] uppercase w-36 shrink-0">
          {stat.label}
        </span>

        <span
          className="font-bebas tracking-tight text-white"
          style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.5rem)" }}
        >
          <AnimatedNumber
            target={stat.countTarget}
            prefix={stat.prefix}
            suffix={stat.suffix}
            active={isInView}
          />
        </span>

        <span className="font-mono text-[10px] text-white/15 tracking-widest hidden md:block">
          {String(index + 1).padStart(2, "0")}
        </span>
      </motion.div>

      {/* Orange line after first stat */}
      {index === 0 && (
        <motion.div
          className="h-px bg-[#FF6B00] origin-left my-1"
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        />
      )}
    </div>
  );
}

export default function StickyStats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgOffset, setImgOffset] = useState(0);

  // Parallax on the bike image via rAF + getBoundingClientRect
  useEffect(() => {
    let raf: number;
    const update = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const scrolled = -rect.top;
        const p = Math.max(0, Math.min(1, scrolled / total));
        setImgOffset((p - 0.5) * -40);
      }
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: "220vh" }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center bg-[#080808]">
        {/* Bike silhouette — no visible box */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          style={{ zIndex: 0 }}
        >
          <div
            style={{
              width: "clamp(300px, 52vw, 700px)",
              height: "clamp(150px, 32vh, 400px)",
              transform: `translateY(${imgOffset}px)`,
              position: "relative",
            }}
          >
            <Image
              src="/vrod-darker-enblanco.jpg"
              alt="V-Rod"
              fill
              className="object-contain"
              style={{
                mixBlendMode: "multiply",
                filter: "brightness(1.6) contrast(1.1)",
                opacity: 0.12,
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="relative z-10 w-full px-8 md:px-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-mono text-[10px] tracking-[0.4em] text-white/25 uppercase mb-14"
          >
            Performance Figures
          </motion.p>

          <div className="flex flex-col">
            {stats.map((stat, i) => (
              <StatRow
                key={stat.label}
                stat={stat}
                index={i}
                delay={i * 0.08}
              />
            ))}
          </div>

          <p className="font-mono text-[10px] text-white/15 tracking-widest mt-8 uppercase">
            Revolution Engine · DOHC · Liquid Cooled
          </p>
        </div>
      </div>
    </section>
  );
}
