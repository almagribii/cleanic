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

  const contactData = [
    { label: "Whatsapp", value: "Ponorogo, Inodnesia" },
    { label: "Email", value: "halo@cleanic.site" },
    { label: "Tiktok", value: "business@cleanic.site" },
    { label: "Twitter", value: "Warga & Aktivis Lingkungan" },
    { label: "Instagram", value: "hiring@cleanic.site" },
    { label: "Website", value: "www.cleanic.site" },
    { label: "Youtube", value: "@Cleanic.id" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

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
      const influenceArea = 150; // Area sempit agar efek "snap" terasa
      const maxGap = window.innerWidth < 768 ? 4 : 10;
      const minGap = 0.1;

      contactRows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distanceToCenter = Math.abs(rowCenter - viewportCenter);

        if (distanceToCenter < influenceArea) {
          const progress = 1 - distanceToCenter / influenceArea;
          const easedProgress = Math.pow(progress, 4); // Efek terbuka dengan cepat

          const currentGap = minGap + (maxGap - minGap) * easedProgress;

          (row as HTMLElement).style.gap = `${currentGap}rem`;

          // Berganti icon saat baris benar-benar di tengah
          if (distanceToCenter < 12) {
            const originalIdx = index % contactData.length;
            setIconIndex((originalIdx % 7) + 1);
          }
        } else {
          // Tetap Hitam Pekat, hanya gap yang merapat
          (row as HTMLElement).style.gap = `${minGap}rem`;
        }
      });
    };

    lenis.on("scroll", updateGaps);
    updateGaps();

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden bg-white">
      {/* Visual Icon di Tengah */}
      <section className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center md:h-36 md:w-36">
          <Image
            src={`/kontak/icon_${iconIndex}.png`}
            alt="Icon"
            fill
            className="scale-110 object-contain"
            priority
          />
        </div>
      </section>

      {/* Konten dengan Teks Hitam Murni #000000 Tanpa Opacity */}
      {[...Array(10)].map((_, sectionIdx) => (
        <section
          key={sectionIdx}
          className="relative flex h-svh w-full flex-col justify-center gap-6 md:gap-8"
        >
          {contactData.map((item, idx) => (
            <div
              key={idx}
              className="contact-info-row flex items-center justify-center px-4 text-[#000000] opacity-100 will-change-[gap]"
            >
              {/* Label */}
              <p className="flex-1 text-right text-[0.85rem] leading-none font-light tracking-[0.2em] text-[#000000] uppercase md:text-[1.1rem]">
                {item.label}
              </p>

              {/* Spacer Tengah */}
              <div className="w-1 shrink-0 md:w-2" />

              {/* Value */}
              <p className="flex-1 text-left text-[0.85rem] leading-none font-medium tracking-tight text-[#000000] md:text-[1.1rem]">
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
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default ContactSection;
