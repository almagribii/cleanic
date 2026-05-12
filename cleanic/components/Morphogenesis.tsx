"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import {
  ChevronRight,
  BookOpenText,
  BrainCircuit,
  Sparkles,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import TextType from "./TextType";

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
  description?: string;
}

const MorphogenesisHero = ({
  heroImage = "/hero-img.jpg",
  characterImage = "/maskot.png",
  characterAlt = "Character illustration",
  color = "#ebf5df",
  description = "Cleanic membantu warga melaporkan dan memilah sampah liar secara digital",
}: MorphoProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scrollRequestRef = useRef<number | null>(null);

  // Utility to convert hex to RGB for Three.js
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : { r: 0.92, g: 0.96, b: 0.87 };
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
        uResolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
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
      material.uniforms.uProgress.value = Math.min(
        (scroll / maxScroll) * 2,
        1.1,
      );
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
    <section
      ref={containerRef}
      className="bg-background relative h-[175svh] w-full overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0 h-full w-full">
        <div className="relative h-full w-full">
          <Image
            src={heroImage}
            alt="Hero"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>

      {/* Hero Header (lively, with CTAs and floating icons) */}
      <div className="text-foreground absolute inset-0 z-5 flex h-screen flex-col items-center justify-center gap-3 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-700/10 px-3 py-2 text-sm font-medium text-green-700 shadow-sm">
          ✨ Ubah sampah jadi poin dalam sekejap{" "}
        </div>

        <TextType
          as="h1"
          className="mx-auto mt-1 max-w-4xl text-4xl leading-none font-extrabold tracking-tight text-black md:text-6xl"
          text={[
            "Lingkungan Bersih",
            "Deteksi Sampah",
            "Laporan Warga",
            "Edukasi Lingkungan",
          ]}
          typingSpeed={30}
          pauseDuration={1000}
          loop={true}
          showCursor={true}
        />

        <span className="mx-auto mt-1 max-w-4xl text-4xl leading-none font-extrabold text-green-700 md:text-6xl">
          Scanner AI untuk pilah sampah.
        </span>

        <p className="mx-auto mt-3 max-w-3xl text-base leading-relaxed text-slate-700 md:text-lg">
          {description}
        </p>

        <div className="mt-5 flex gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-full bg-green-700 px-5 py-3 font-semibold text-white shadow-md transition-colors hover:bg-green-600"
          >
            Coba Demo
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>

          <Link
            href="/tentang"
            className="text-foreground inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/80 px-5 py-3 transition-colors hover:bg-slate-50"
          >
            Lihat Cara Kerja
          </Link>
        </div>

        {/* Floating icons: two left + two right (desktop only), nudged toward center */}
        <div className="pointer-events-none hidden md:block">
          <motion.div
            className="absolute top-28 left-20 text-green-700"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpenText size={22} />
          </motion.div>

          <motion.div
            className="absolute bottom-32 left-24 text-green-700"
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.8,
            }}
          >
            <BrainCircuit size={20} />
          </motion.div>

          <motion.div
            className="absolute top-28 right-24 text-green-700"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.4,
            }}
          >
            <MessageSquareText size={18} />
          </motion.div>

          <motion.div
            className="absolute right-20 bottom-28 text-green-700"
            animate={{ y: [0, 14, 0], scale: [1, 1.08, 1] }}
            transition={{
              duration: 5.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <Sparkles size={16} />
          </motion.div>
        </div>
      </div>

      {/* WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute bottom-0 left-0 z-5 h-full w-full"
      />

      {/* Character + Description (2 Columns) */}
      <div className="pointer-events-none absolute bottom-0 z-30 h-[125svh] w-full px-6 md:px-10 lg:px-16">
        <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
          {/* Responsive layout: stacked vertically on small screens, horizontal side-by-side on md+ */}
          <div className="flex w-full flex-col items-center gap-8 md:flex-row md:items-center md:justify-center">
            <motion.div
              style={{ opacity: imageOpacity, y: imageY, scale: imageScale }}
              className="relative flex shrink-0 items-center justify-center self-center overflow-hidden lg:h-120"
            >
              <div className="relative h-80 w-80 lg:h-120 lg:w-120">
                <Image
                  src={characterImage}
                  alt={characterAlt}
                  fill
                  className="object-contain"
                />
              </div>
            </motion.div>

            <div className="flex w-full items-center px-4 text-center  md:px-8">
              <h2 className="mx-auto w-full max-w-3xl font-semibold text-[clamp(1.2rem,2.5vw,2.8rem)] leading-[1.6] tracking-normal text-white uppercase">
                {words.map((word, i) => (
                  <Word
                    key={i}
                    index={i}
                    total={words.length}
                    progress={scrollYProgress}
                  >
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
  children: React.ReactNode; // Gunakan ReactNode, bukan string
  index: number;
  total: number;
  progress: MotionValue<number>;
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
