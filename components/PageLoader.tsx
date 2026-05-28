"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function PageLoader() {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const duration = 2200;
    const startTime = performance.now();

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(eased * 100);
      setCount(value);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        setCount(100);
        setTimeout(() => setDone(true), 300);
      }
    }

    requestAnimationFrame(step);
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[9999] bg-[#080808] flex flex-col items-center justify-center overflow-hidden"
          initial={{ y: "0%" }}
          exit={{
            y: "-100%",
            transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1], delay: 0.15 },
          }}
        >
          {/* Counter */}
          <motion.div
            className="absolute bottom-12 right-12 font-mono text-sm tracking-widest text-white/40"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {String(count).padStart(2, "0")}
          </motion.div>

          {/* Brand name */}
          <motion.p
            className="font-bebas text-[clamp(3rem,8vw,7rem)] tracking-[0.25em] text-white/10 select-none"
            initial={{ opacity: 0, letterSpacing: "0.5em" }}
            animate={{
              opacity: count > 20 ? 1 : 0,
              letterSpacing: count > 20 ? "0.25em" : "0.5em",
            }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            HARLEY
          </motion.p>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 h-[2px] bg-[#FF6B00]/20 w-full">
            <motion.div
              className="h-full bg-[#FF6B00]"
              style={{ width: `${count}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          {/* Top label */}
          <motion.p
            className="absolute top-12 left-12 font-mono text-xs tracking-[0.3em] text-white/25 uppercase"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading Experience
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
