"use client";

import { useEffect, useRef } from "react";

/* ─── All stats / facts that float through the moto ───────────────────
   sp = screen-position factor:
     0.4  → item centered when scrollY = 0.4 × window.innerHeight
   side = where text is anchored on screen
──────────────────────────────────────────────────────────────────── */
const ITEMS = [
  /* Performance */
  { sp: 0.40, label: "0–100 KPH",         value: "04 SECS+",       side: "left"   },
  { sp: 0.82, label: "Displacement",       value: "1250 CC",        side: "right"  },
  { sp: 1.24, label: "Max Torque",         value: "115 NM",         side: "left"   },
  { sp: 1.66, label: "Peak Power",         value: "122 HP",         side: "right"  },
  { sp: 2.08, label: "Top Speed",          value: "220 KPH",        side: "left"   },
  /* Engine */
  { sp: 2.50, label: "Architecture",       value: "V-TWIN",         side: "right"  },
  { sp: 2.92, label: "Cam Profile",        value: "DOHC",           side: "left"   },
  { sp: 3.34, label: "Cooling",            value: "LIQUID",         side: "right"  },
  { sp: 3.76, label: "Valves / Cylinder",  value: "4",              side: "left"   },
  { sp: 4.18, label: "Bore × Stroke",      value: "100×79.4",       side: "right"  },
  /* Dimensions */
  { sp: 4.60, label: "Dry Weight",         value: "295 KG",         side: "left"   },
  { sp: 5.02, label: "Wheelbase",          value: "1625 MM",        side: "right"  },
  { sp: 5.44, label: "Seat Height",        value: "665 MM",         side: "left"   },
  { sp: 5.86, label: "Fuel Capacity",      value: "18.9 L",         side: "right"  },
  /* Heritage */
  { sp: 6.28, label: "Founded",            value: "EST. 1903",      side: "left"   },
  { sp: 6.70, label: "V-Rod Launch",       value: "2001",           side: "right"  },
  { sp: 7.12, label: "Designed with",      value: "PORSCHE",        side: "left"   },
  { sp: 7.54, label: "Colorway",           value: "FLAT BLACK",     side: "right"  },
  { sp: 7.96, label: "Warranty",           value: "2 YEARS",        side: "left"   },
  { sp: 8.38, label: "Made in",            value: "USA",            side: "right"  },
] as const;

export default function ScrollNarrative() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      const scrollY = window.scrollY;
      const vh      = window.innerHeight;
      /* visible window: ±40% of screen height from the item's center */
      const fade    = vh * 0.40;

      ITEMS.forEach((item, i) => {
        const el = refs.current[i];
        if (!el) return;

        const center  = item.sp * vh;          // scroll position where item is at center
        const delta   = scrollY - center;      // negative = below screen, positive = above
        const dist    = Math.abs(delta);
        const opacity = Math.max(0, 1 - dist / fade);

        /* Move element: when delta=0 → translateY(0) = screen center (via flex)
           Below center (delta<0) → translateY pushes it down
           Above center (delta>0) → translateY pulls it up             */
        el.style.transform = `translateY(${-delta}px)`;
        el.style.opacity   = String(opacity);
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {ITEMS.map((item, i) => {
        const justify   = item.side === "left" ? "items-start" : "items-end";
        const textAlign = item.side === "left" ? "text-left"  : "text-right";

        return (
          <div
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            /* Full viewport, flex-centred vertically, translated by RAF */
            className={`fixed inset-0 flex flex-col justify-center pointer-events-none ${justify}`}
            style={{ zIndex: 6, opacity: 0, willChange: "transform, opacity" }}
          >
            <div className={`px-8 md:px-20 ${textAlign}`}>
              {/* Label */}
              <p className="font-mono text-[10px] tracking-[0.5em] text-[#FF6B00] uppercase mb-1">
                {item.label}
              </p>

              {/* Giant value */}
              <p
                className="font-bebas text-white leading-none"
                style={{ fontSize: "clamp(3.5rem, 8.5vw, 8rem)", letterSpacing: "0.02em" }}
              >
                {item.value}
              </p>

              {/* Accent underline — animated via CSS on parent opacity */}
              <div
                className="mt-3 h-[2px] bg-[#FF6B00]"
                style={{
                  width: "100px",
                  marginLeft:  item.side === "right" ? "auto" : "0",
                  marginRight: "0",
                }}
              />
            </div>
          </div>
        );
      })}
    </>
  );
}
