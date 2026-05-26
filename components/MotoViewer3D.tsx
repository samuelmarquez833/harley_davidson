"use client";

import { useRef, useEffect, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import * as THREE from "three";

/* ─── Camera checkpoints ─────────────────────────────────────────── */
type CP = { p: number; cam: [number, number, number]; label: string; sub: string };

const CPS: CP[] = [
  { p: 0,    cam: [5,  1,   0],  label: "V-ROD",             sub: "SIDE PROFILE"           },
  { p: 0.25, cam: [0,  1,   5],  label: "REVOLUTION ENGINE", sub: "1250CC"                 },
  { p: 0.5,  cam: [-3, 2,  -3],  label: "REAR STANCE",       sub: "PURE MUSCLE"            },
  { p: 0.75, cam: [1,  0.5, 1],  label: "DOHC",              sub: "4 VALVES PER CYLINDER"  },
  { p: 1,    cam: [0,  6,   0],  label: "TOP VIEW",          sub: "FULL SILHOUETTE"        },
];

/* ─── Camera rig — lerps toward interpolated checkpoint pos ─────── */
function CameraRig({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const { camera } = useThree();
  const dest = useRef(new THREE.Vector3(...CPS[0].cam));

  useFrame(() => {
    const p = scrollRef.current;

    // find which segment we are in
    let a = CPS[0], b = CPS[1];
    for (let i = 0; i < CPS.length - 1; i++) {
      if (p >= CPS[i].p && p <= CPS[i + 1].p) { a = CPS[i]; b = CPS[i + 1]; break; }
    }

    const len = b.p - a.p;
    const raw = len > 0 ? (p - a.p) / len : 0;
    // ease-in-out cubic
    const t = raw < 0.5 ? 4 * raw ** 3 : 1 - (-2 * raw + 2) ** 3 / 2;

    dest.current.set(
      a.cam[0] + (b.cam[0] - a.cam[0]) * t,
      a.cam[1] + (b.cam[1] - a.cam[1]) * t,
      a.cam[2] + (b.cam[2] - a.cam[2]) * t,
    );

    camera.position.lerp(dest.current, 0.055);
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

/* ─── GLB model — auto-scales and centers ───────────────────────── */
function BikeModel() {
  const { scene } = useGLTF("/harley_davidson_v-rod_2001-2017.glb");

  const { s, pos } = useMemo(() => {
    const box    = new THREE.Box3().setFromObject(scene);
    const size   = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale  = 3.5 / maxDim;
    return {
      s: scale,
      pos: [
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      ] as [number, number, number],
    };
  }, [scene]);

  return <primitive object={scene} scale={s} position={pos} />;
}

/* ─── Scene: lights + model + camera ─────────────────────────────── */
function Scene({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  return (
    <>
      {/* Low-key fill */}
      <ambientLight intensity={0.8} />

      {/* Dramatic warm side key (orange) */}
      <spotLight
        position={[6, 5, 3]}
        intensity={300}
        color="#FF6B00"
        angle={0.4}
        penumbra={0.8}
        castShadow={false}
      />

      {/* Cool rim from opposite side */}
      <spotLight
        position={[-6, 4, -4]}
        intensity={200}
        color="#8899dd"
        angle={0.45}
        penumbra={0.9}
      />

      {/* Subtle floor bounce */}
      <pointLight position={[0, -1, 0]} intensity={30} color="#220a00" />

      <Suspense fallback={null}>
        <BikeModel />
      </Suspense>

      <CameraRig scrollRef={scrollRef} />
    </>
  );
}

/* ─── Main export ────────────────────────────────────────────────── */
export default function MotoViewer3D() {
  const sectionRef  = useRef<HTMLDivElement>(null);
  const scrollRef   = useRef(0);
  const lastIdxRef  = useRef(0);
  const lastVisRef  = useRef(true);

  const [activeIdx,   setActiveIdx]   = useState(0);
  const [textVisible, setTextVisible] = useState(true);

  useEffect(() => {
    let raf: number;

    const tick = () => {
      if (sectionRef.current) {
        const rect       = sectionRef.current.getBoundingClientRect();
        const scrollable = rect.height - window.innerHeight;
        const scrolled   = -rect.top;
        scrollRef.current = Math.max(0, Math.min(1, scrolled / scrollable));

        const p = scrollRef.current;

        // nearest checkpoint
        let nearestIdx = 0, nearestDist = Infinity;
        CPS.forEach((cp, i) => {
          const d = Math.abs(cp.p - p);
          if (d < nearestDist) { nearestDist = d; nearestIdx = i; }
        });

        const vis = nearestDist < 0.13;

        if (nearestIdx !== lastIdxRef.current) {
          lastIdxRef.current = nearestIdx;
          setActiveIdx(nearestIdx);
        }
        if (vis !== lastVisRef.current) {
          lastVisRef.current = vis;
          setTextVisible(vis);
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: "500vh" }}>

      {/* ── Sticky viewport ─────────────────────────────────── */}
      <div
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ background: "#080808" }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] z-[2] pointer-events-none
                        bg-gradient-to-r from-transparent via-[#FF6B00]/50 to-transparent" />

        {/* Three.js canvas */}
        <Canvas
          camera={{ position: [5, 1, 0], fov: 45, near: 0.1, far: 200 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.4 }}
          style={{ width: "100%", height: "100%" }}
        >
          <color attach="background" args={["#080808"]} />
          <Scene scrollRef={scrollRef} />
        </Canvas>

        {/* Section label */}
        <p className="absolute top-8 left-8 md:left-16 z-[5] pointer-events-none
                      font-mono text-[10px] tracking-[0.45em] text-white/20 uppercase">
          3D Explorer
        </p>

        {/* ── Text overlay — bottom-left ───────────────────── */}
        <div className="absolute bottom-14 left-8 md:left-16 z-[5] pointer-events-none">
          <AnimatePresence mode="wait">
            {textVisible && (
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-1"
              >
                <span className="font-mono text-[10px] tracking-[0.5em] text-[#FF6B00] uppercase">
                  {CPS[activeIdx].label}
                </span>
                <span
                  className="font-bebas text-white leading-none"
                  style={{
                    fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
                    letterSpacing: "0.02em",
                  }}
                >
                  {CPS[activeIdx].sub}
                </span>
                {/* Accent rule */}
                <div className="mt-2 h-[1.5px] bg-[#FF6B00]" style={{ width: 60 }} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Progress indicator — right side ─────────────── */}
        <div className="absolute right-8 md:right-14 top-1/2 -translate-y-1/2 z-[5]
                        flex flex-col items-center gap-3 pointer-events-none">
          {CPS.map((_, i) => (
            <div
              key={i}
              style={{
                width: 2,
                height: i === activeIdx && textVisible ? 24 : 6,
                borderRadius: 1,
                background:
                  i === activeIdx && textVisible
                    ? "#FF6B00"
                    : "rgba(255,255,255,0.15)",
                transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          ))}
        </div>

        {/* ── Scroll hint ─────────────────────────────────── */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[5]
                     flex flex-col items-center gap-1 pointer-events-none"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-mono text-[8px] tracking-[0.5em] text-white/20 uppercase">
            Explore
          </span>
          <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
            <path
              d="M5 1L5 12M1.5 8.5L5 12L8.5 8.5"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* ── Cinematic frame — desktop only ──────────────── */}
        <div
          className="absolute inset-0 z-[5] pointer-events-none hidden md:block"
          style={{
            border: "14px solid #FF6B00",
            borderRadius: "22px",
            boxShadow: "inset 0 0 40px #FF6B0022",
          }}
        />
      </div>
    </section>
  );
}

/* Preload the model as soon as the module is loaded */
useGLTF.preload("/harley_davidson_v-rod_2001-2017.glb");
