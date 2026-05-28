"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeBackgroundProps {
  accentHex: string;
}

/* Build a soft radial gradient sprite so particles render as circles */
function makeCircleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0,   "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.6)");
  grad.addColorStop(1,   "rgba(255,255,255,0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

export default function ThreeBackground({ accentHex }: ThreeBackgroundProps) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const rafRef      = useRef<number>(0);
  const accentRef   = useRef(accentHex);

  useEffect(() => {
    accentRef.current = accentHex;
    if (particlesRef.current) {
      (particlesRef.current.material as THREE.PointsMaterial).color.set(accentHex);
    }
  }, [accentHex]);

  useEffect(() => {
    if (!mountRef.current) return;

    const W = mountRef.current.clientWidth;
    const H = mountRef.current.clientHeight;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const count     = 320;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const sprite = makeCircleTexture();
    const mat    = new THREE.PointsMaterial({
      color:          new THREE.Color(accentRef.current),
      size:           0.30,
      map:            sprite,
      transparent:    true,
      alphaTest:      0.001,
      opacity:        0.50,
      sizeAttenuation: true,
      blending:       THREE.AdditiveBlending,
      depthWrite:     false,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);
    particlesRef.current = particles;

    let t = 0;
    const animate = () => {
      t += 0.004;
      particles.rotation.y = t * 0.06;
      particles.rotation.x = Math.sin(t * 0.03) * 0.08;

      const pos = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += Math.sin(t + i * 0.5) * 0.003;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    const mountNode = mountRef.current;
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      sprite.dispose();
      if (mountNode && renderer.domElement.parentNode === mountNode) {
        mountNode.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
