"use client";

import { Suspense, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

/* ── Soft-circle texture for particles ───────────────────────────── */
function makeCircleTex() {
  const c   = document.createElement("canvas");
  c.width   = c.height = 64;
  const ctx = c.getContext("2d")!;
  const g   = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0,    "rgba(255,255,255,1)");
  g.addColorStop(0.45, "rgba(255,255,255,0.7)");
  g.addColorStop(1,    "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

const PARTICLE_COUNT = 320;

/* ── Particles ───────────────────────────────────────────────────── */
function Particles({ accentHex }: { accentHex: string }) {
  const ref = useRef<THREE.Points>(null);
  const t   = useRef(0);

  const geo = useMemo(() => {
    const pos  = new Float32Array(PARTICLE_COUNT * 3);
    const sz   = new Float32Array(PARTICLE_COUNT);
    const opa  = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
      sz[i]  = 1 + Math.random() * 3;      // 1–4 px on screen
      opa[i] = 0.3 + Math.random() * 0.5;  // 0.3–0.8
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSize",    new THREE.BufferAttribute(sz,  1));
    g.setAttribute("aOpacity", new THREE.BufferAttribute(opa, 1));
    return g;
  }, []);

  const mat = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uColor: { value: new THREE.Color(accentHex) },
        uMap:   { value: makeCircleTex() },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        void main() {
          vOpacity     = aOpacity;
          gl_PointSize = aSize;
          gl_Position  = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3      uColor;
        uniform sampler2D uMap;
        varying float     vOpacity;
        void main() {
          vec4 tex = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(uColor, tex.a * vOpacity);
        }
      `,
      transparent: true,
      depthWrite:  false,
      blending:    THREE.AdditiveBlending,
    });
  }, [accentHex]);

  useEffect(() => () => { geo.dispose(); mat.dispose(); }, [geo, mat]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    t.current += delta;
    ref.current.rotation.y = t.current * 0.06;
    ref.current.rotation.x = Math.sin(t.current * 0.03) * 0.08;
  });

  return <points ref={ref} geometry={geo} material={mat} />;
}

/* GLBs que necesitan flip de 180° en Y */
const FLIP_MODELS = new Set([
  "/harley_davidson_v-rod_2001-2017.glb",
  "/harley_davidson_iron_883_2018.glb",
]);

/* ── Bike model — materials + scroll rotation ────────────────────── */
function BikeModel({
  glbPath,
  scrollRef,
}: {
  glbPath: string;
  scrollRef: React.MutableRefObject<number>;
}) {
  const { scene }  = useGLTF(glbPath);
  const { camera } = useThree();
  const groupRef   = useRef<THREE.Group>(null);
  const flipY      = FLIP_MODELS.has(glbPath);

  console.log("model loaded", scene);

  useEffect(() => {
    /* ── Apply materials by mesh name ── */
    const bodyMat = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.9,
      roughness: 0.2,
    });
    const chromeMat = new THREE.MeshStandardMaterial({
      color: "#888888",
      metalness: 1.0,
      roughness: 0.05,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: "#111111",
      metalness: 0.0,
      roughness: 0.9,
    });

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const n = child.name.toLowerCase();
      if (/tire|tyre|rubber/.test(n)) {
        child.material = tireMat;
      } else if (/exhaust|pipe|chrome|handle|mirror|grip|bar|muffler|fork/.test(n)) {
        child.material = chromeMat;
      } else {
        child.material = bodyMat;
      }
    });

    /* ── Center + orient + frame ──────────────────────────────────
       Reset rotation BEFORE measuring so the bbox always reflects
       the model's original unrotated dimensions — idempotent on
       every carousel revisit (cached scene already centered+rotated,
       but reset → same numbers → same camera position). */
    scene.rotation.set(0, 0, 0);
    const box    = new THREE.Box3().setFromObject(scene);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());

    scene.position.sub(center);          // center at world origin
    scene.rotation.y = Math.PI / 2 + (flipY ? Math.PI : 0);  // side profile; flip V-Rod & Iron 883

    const depth = Math.max(size.x, size.y, size.z);
    camera.position.set(0, size.y * 0.15, depth * 2.2);
    camera.lookAt(0, 0, 0);

    return () => {
      bodyMat.dispose();
      chromeMat.dispose();
      tireMat.dispose();
    };
  }, [scene, camera, flipY]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = scrollRef.current * Math.PI * 2;
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={scene} />
    </group>
  );
}

/* ── Scene ───────────────────────────────────────────────────────── */
function Scene({
  accentHex,
  glbPath,
  scrollRef,
}: {
  accentHex: string;
  glbPath: string;
  scrollRef: React.MutableRefObject<number>;
}) {
  return (
    <>
      <Particles accentHex={accentHex} />

      {/* Lights */}
      <ambientLight intensity={0.1} />
      <directionalLight position={[5, 5, -3]}  intensity={2}   color="#ffffff" />
      <spotLight       position={[-5, 3, 5]}   intensity={300} color="#FF6B00" angle={0.5} penumbra={0.8} />
      <spotLight       position={[5, 2, -5]}   intensity={150} color="#4444ff" angle={0.5} penumbra={0.8} />

      <Suspense fallback={null}>
        <BikeModel key={glbPath} glbPath={glbPath} scrollRef={scrollRef} />
      </Suspense>
    </>
  );
}

/* ── Main export ─────────────────────────────────────────────────── */
export default function HeroBike3D({
  accentHex,
  glbPath,
  scrollRef,
}: {
  accentHex: string;
  glbPath: string;
  scrollRef: React.MutableRefObject<number>;
}) {
  return (
    <Canvas
      camera={{ position: [5, 1.2, 0], fov: 42 }}
      gl={{
        alpha:               true,
        antialias:           true,
        toneMapping:         THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
      onCreated={({ gl }) => gl.setClearColor(0x080808, 0)}
      style={{
        width: "100%", height: "100%",
        background: "transparent",
        display: "block",
        outline: "none",
        overflow: "hidden",
      }}
    >
      <Scene accentHex={accentHex} glbPath={glbPath} scrollRef={scrollRef} />
    </Canvas>
  );
}

/* Preload all three models at module load — no wait on carousel switch */
useGLTF.preload("/harley_davidson_v-rod_2001-2017.glb");
useGLTF.preload("/harley_davidson_iron_883_2018.glb");
useGLTF.preload("/harley-davidson_seventy-two_hd_fxt_2015.glb");
