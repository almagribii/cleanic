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
  // State untuk melacak indeks icon (1-7)
  const [iconIndex, setIconIndex] = useState(1);

  const contactData = [
    { label: "Lokasi Pusat", value: "Ponorogo" },
    { label: "Waktu Lokal", value: "20:03:57 (WIB)" }, 
    { label: "Layanan Warga", value: "halo@cleanic.site" },
    { label: "Kerja Sama UMKM", value: "business@cleanic.site" },
    { label: "Kolaborasi Komunitas", value: "Warga & Aktivis Lingkungan" },
    { label: "Karir & Relawan", value: "hiring@cleanic.site" },
    { label: "Telepon / WhatsApp", value: "+62 8221 0980 898" },
    { label: "Media Sosial", value: "@Cleanic.id" },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const lenis = new Lenis({
      infinite: true,
      syncTouch: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tickerCb = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerCb);
    gsap.ticker.lagSmoothing(0);

    const contactRows =
      containerRef.current.querySelectorAll(".contact-info-row");
    const contactVisual = containerRef.current.querySelector(
      ".contact-visual",
    ) as HTMLElement;
    const contactRowMaxGap = window.innerWidth < 1000 ? 5 : 10;

    const getVisualCenter = () =>
      contactVisual.offsetTop + contactVisual.offsetHeight / 2;

    // Animasi Gap (GSAP)
    contactRows.forEach((row) => {
      const htmlRow = row as HTMLElement;
      ScrollTrigger.create({
        trigger: htmlRow,
        start: () => `top+=${getVisualCenter() - 550} center`,
        end: () => `top+=${getVisualCenter() - 450} center`,
        scrub: true,
        onUpdate: (self) => {
          htmlRow.style.gap = `${1 + (contactRowMaxGap - 1) * self.progress}rem`;
        },
      });

      ScrollTrigger.create({
        trigger: htmlRow,
        start: () => `top+=${getVisualCenter() - 400} center`,
        end: () => `top+=${getVisualCenter() - 300} center`,
        scrub: true,
        onUpdate: (self) => {
          htmlRow.style.gap = `${contactRowMaxGap - (contactRowMaxGap - 1) * self.progress}rem`;
        },
      });
    });

    // LOGIKA PERGANTIAN GAMBAR (Original Logic)
    let lastCenteredRow: Element | null = null;

    const handleScroll = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestRow: Element | null = null;
      let minDistance = Infinity;

      contactRows.forEach((row) => {
        const rect = row.getBoundingClientRect();
        const rowCenter = rect.top + rect.height / 2;
        const distance = Math.abs(rowCenter - viewportCenter);

        // Ambang batas 25px dari tengah (seperti kode aslimu)
        if (distance < minDistance && distance < 25) {
          minDistance = distance;
          closestRow = row;
        }
      });

      // Jika baris yang mendekati tengah berganti, update iconIndex
      if (closestRow && closestRow !== lastCenteredRow) {
        lastCenteredRow = closestRow;
        setIconIndex((prev) => (prev % 7) + 1);
      }
    };

    lenis.on("scroll", handleScroll);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCb);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-linear-to-br from-emerald-50 via-white to-lime-50 text-black"
    >
      {/* Icon yang berganti sesuai state iconIndex */}
      <section className="contact-visual pointer-events-none fixed top-0 left-0 z-40 flex h-svh w-full items-center justify-center overflow-hidden">
        <div className="relative h-20 w-20 md:h-32 md:w-32">
          <Image
            src={`/kontak/icon_${iconIndex}.png`}
            alt="Dynamic Icon"
            fill
            className="object-contain transition-opacity duration-200"
            priority
          />
        </div>
      </section>

      {/* Konten (Diloop untuk efek infinite) */}
      {[...Array(10)].map((_, sectionIdx) => (
        <section
          key={sectionIdx}
          className="contact-info relative flex h-svh w-full flex-col justify-center gap-6"
        >
          {contactData.map((item, idx) => (
            <div
              key={idx}
              className="contact-info-row flex justify-center gap-4 px-4 will-change-[gap]"
            >
              <p className="flex-1 text-right text-[1.2rem] leading-none uppercase md:text-[1.8rem]">
                {item.label}
              </p>
              <p className="flex-1 text-left text-[1.2rem] leading-none text-[#4f4f4f] md:text-[1.8rem]">
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
        }
      `}</style>
    </div>
  );
};

export default ContactSection;
