"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: -300, y: -300 });
  const smoothed = useRef({ x: -300, y: -300 });
  const rafRef = useRef<number>(0);
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!visible) setVisible(true);
      target.current = { x: e.clientX, y: e.clientY };

      if (dotRef.current) {
        dotRef.current.style.left = e.clientX + "px";
        dotRef.current.style.top = e.clientY + "px";
      }
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      setHovering(
        t.tagName === "BUTTON" ||
          t.tagName === "A" ||
          !!t.closest("button") ||
          !!t.closest("a")
      );
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    function tick() {
      smoothed.current.x += (target.current.x - smoothed.current.x) * 0.1;
      smoothed.current.y += (target.current.y - smoothed.current.y) * 0.1;

      if (outerRef.current) {
        outerRef.current.style.left = smoothed.current.x + "px";
        outerRef.current.style.top = smoothed.current.y + "px";
      }

      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* Outer ring — smooth lerp */}
      <div
        ref={outerRef}
        style={{
          position: "fixed",
          top: -300,
          left: -300,
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          border: `1.5px solid ${hovering ? "#FF6B00" : "#ffffff"}`,
          borderRadius: "50%",
          background: hovering ? "rgba(255,107,0,0.12)" : "transparent",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999999,
          opacity: visible ? 1 : 0,
          transition:
            "width 0.35s cubic-bezier(0.16,1,0.3,1), height 0.35s cubic-bezier(0.16,1,0.3,1), border-color 0.25s, background 0.25s, opacity 0.3s",
        }}
      />

      {/* Inner dot — instant follow */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: -300,
          left: -300,
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: hovering ? "#FF6B00" : "#ffffff",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 999999,
          opacity: visible ? 1 : 0,
          transition: "background 0.25s, opacity 0.3s",
        }}
      />
    </>
  );
}
