"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

// Shader code tetap sama, dipindahkan ke konstanta
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec3 uColor;
  uniform float uSpread;
  varying vec2 vUv;

  float Hash(vec2 p) {
    vec3 p2 = vec3(p.xy, 1.0);
    return fract(sin(dot(p2, vec3(37.1, 61.7, 12.4))) * 3758.5453123);
  }

  float noise(in vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f *= f * (3.0 - 2.0 * f);
    return mix(
      mix(Hash(i + vec2(0.0, 0.0)), Hash(i + vec2(1.0, 0.0)), f.x),
      mix(Hash(i + vec2(0.0, 1.0)), Hash(i + vec2(1.0, 1.0)), f.x),
      f.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    v += noise(p * 1.0) * 0.5;
    v += noise(p * 2.0) * 0.25;
    v += noise(p * 4.0) * 0.125;
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / uResolution.y;
    vec2 centeredUv = (uv - 0.5) * vec2(aspect, 1.0);
    float dissolveEdge = uv.y - uProgress * 1.2;
    float noiseValue = fbm(centeredUv * 15.0);
    float d = dissolveEdge + noiseValue * uSpread;
    float pixelSize = 1.0 / uResolution.y;
    float alpha = 1.0 - smoothstep(-pixelSize, pixelSize, d);
    gl_FragColor = vec4(uColor, alpha);
  }
`;

interface MorphoProps {
  heroImage?: string;
  characterImage?: string;
  characterAlt?: string;
  color?: string;
  title?: string;
  subtitle?: string;
  description?: string;
}

const MorphogenesisHero = ({
  heroImage = "/hero-img.jpg",
  characterImage = "/maskot.png",
  characterAlt = "Character illustration",
  color = "#ebf5df",
  title = "Morphogenesis",
  subtitle = "Solid form gives way to liquid movement.",
  description = "Cleanic membantu warga melaporkan dan memilah sampah liar secara digital"
}: MorphoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRequestRef = useRef<number | null>(null);

  // Utility to convert hex to RGB for Three.js
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255,
    } : { r: 0.92, g: 0.96, b: 0.87 };
  };

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    
    // 1. Initialize Lenis
    const lenis = new Lenis();
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // 2. Three.js Setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
    });

    const rgb = hexToRgb(color);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        uColor: { value: new THREE.Vector3(rgb.r, rgb.g, rgb.b) },
        uSpread: { value: 0.5 },
      },
      transparent: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleResize = () => {
      const { offsetWidth, offsetHeight } = containerRef.current!;
      renderer.setSize(offsetWidth, offsetHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      material.uniforms.uResolution.value.set(offsetWidth, offsetHeight);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    // 3. Animation Loop
    const animate = () => {
      renderer.render(scene, camera);
      scrollRequestRef.current = requestAnimationFrame(animate);
    };
    animate();

    // 4. Scroll Sync
    lenis.on("scroll", ({ scroll }: { scroll: number }) => {
      const maxScroll = containerRef.current!.offsetHeight - window.innerHeight;
      material.uniforms.uProgress.value = Math.min((scroll / maxScroll) * 2, 1.1);
    });

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(scrollRequestRef.current!);
      lenis.destroy();
      renderer.dispose();
    };
  }, [color]);

  // Text Animation Logic using Framer Motion
  const words = description.split(" ");
  const { scrollYProgress } = useScroll();
  const imageOpacity = useTransform(scrollYProgress, [0.2, 0.32], [0, 1]);
  const imageY = useTransform(scrollYProgress, [0.2, 0.32], [40, 0]);
  const imageScale = useTransform(scrollYProgress, [0.2, 0.32], [0.96, 1]);

  return (
    <section ref={containerRef} className="relative w-full h-[175svh] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover object-top" />
      </div>

      {/* Hero Header */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center gap-2 h-screen z-10 text-[#032706]">
        <h1 className="text-[clamp(4rem,7.5vw,10rem)] font-serif uppercase leading-[0.9] font-medium">
          {title}
        </h1>
        <p className="font-sans text-lg md:text-xl w-3/4 max-w-2xl">
          {subtitle}
        </p>
      </div>

      {/* WebGL Canvas */}
      <canvas ref={canvasRef} className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-20" />

      {/* Character + Description (2 Columns) */}
      <div className="absolute bottom-0 w-full h-[125svh] z-30 px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          {/* Responsive layout: stacked vertically on small screens, horizontal side-by-side on md+ */}
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
            <motion.div
              style={{ opacity: imageOpacity, y: imageY, scale: imageScale }}
              className="self-center relative flex shrink-0 items-center justify-center overflow-hidden lg:h-120"
            >
              <img
                src={characterImage}
                alt={characterAlt}
                className="h-full w-full object-contain"
              />
            </motion.div>

            <div className="w-full px-4 text-center md:px-8 flex items-center">
              <h2 className="mx-auto w-full max-w-3xl font-serif text-[clamp(1.2rem,2.5vw,2.8rem)] font-medium uppercase leading-[1.6] tracking-normal text-[#0f0f0f]">
                {words.map((word, i) => (
                  <Word key={i} index={i} total={words.length} progress={scrollYProgress}>
                    {word}&nbsp;
                  </Word>
                ))}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Update interface properti Word
const Word = ({ 
  children, 
  index, 
  total,
  progress,
}: { 
  children: React.ReactNode, // Gunakan ReactNode, bukan string
  index: number, 
  total: number,
  progress: MotionValue<number>,
}) => {
  const start = 0.2 + (index / total) * 0.2;
  const end = start + 0.05;
  const opacity = useTransform(progress, [start, end], [0, 1]);

  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
};

export default MorphogenesisHero;