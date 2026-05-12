"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const ContactSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [iconIndex, setIconIndex] = useState(1);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const contactData = [
    { label: "Email", value: "cleanic.site" },
    { label: "Tiktok", value: "@cleanic-sph.id" },
    { label: "Twitter", value: "@cleanic-sampah_id" },
    { label: "Whatsapp", value: "+62 822 1098 00898" },
    { label: "Instagram", value: "@cleanic-sampah.id" },
    { label: "Youtube", value: "Cleanic Official" },
    { label: "Website", value: "cleanic.site" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    // Animasi Mouse Move untuk Background Dynamic
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) * 100;
      const y = (clientY / window.innerHeight) * 100;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const lenis = new Lenis({
      infinite: true,
      syncTouch: true,
      lerp: 0.08,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);

    const contactRows =
      containerRef.current.querySelectorAll(".contact-info-row");

    const updateGaps = () => {
      const viewportCenter = window.innerHeight / 2;
      const influenceArea = 150;
      const maxGap = window.innerWidth < 768 ? 4 : 10;
      const minGap = 0.1;

      contactRows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(rowCenter - viewportCenter);

        if (distanceToCenter < influenceArea) {
          const progress = 1 - distanceToCenter / influenceArea;
          const easedProgress = Math.pow(progress, 4);
          const currentGap = minGap + (maxGap - minGap) * easedProgress;
          (row as HTMLElement).style.gap = `${currentGap}rem`;

          if (distanceToCenter < 12) {
            const originalIdx = index % contactData.length;
            setIconIndex((originalIdx % 7) + 1);
          }
        } else {
          (row as HTMLElement).style.gap = `${minGap}rem`;
        }
      });
    };

    lenis.on("scroll", updateGaps);
    updateGaps();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden transition-colors duration-500"
      style={{
        background: `radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, #f0fdf4 0%, #dcfce7 40%, #15803d 120%)`,
      }}
    >
      <div
        className="pointer-events-none fixed inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      ></div>

      {/* Visual Icon di Tengah */}
      <section className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
        <div className="relative flex h-32 w-32 items-center justify-center md:h-48 md:w-48">
          {/* Glow Effect di belakang Icon */}
          <div className="absolute inset-0 scale-150 rounded-full bg-green-500/20 blur-3xl" />
          <Image
            src={`/kontak/iconss_${iconIndex}.png`}
            alt="Icon"
            width={80}
            height={80}
            className="relative z-10 scale-110 object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </section>

      {/* Konten Text */}
      {[...Array(10)].map((_, sectionIdx) => (
        <section
          key={sectionIdx}
          className="relative flex h-svh w-full flex-col justify-center gap-6 md:gap-8"
        >
          {contactData.map((item, idx) => (
            <div
              key={idx}
              className="contact-info-row flex items-center justify-center px-4 will-change-[gap]"
            >
              <p className="flex-1 text-right text-[1rem] leading-none font-bold tracking-[0.2em] text-[#000000] uppercase md:text-[1.2rem]">
                {item.label}
              </p>

              <div className="w-1 shrink-0 md:w-2" />

              <p className="flex-1 text-left text-[1rem] leading-none font-medium tracking-tight text-[#000000] md:text-[1.2rem]">
                {item.value}
              </p>
            </div>
          ))}
        </section>
      ))}

      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none;
        }
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
          overflow-x: hidden;
          background-color: #15803d; /* Fallback green-700 */
        }
      `}</style>
    </div>
  );
};

export default ContactSection;
