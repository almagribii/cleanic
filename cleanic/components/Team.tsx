"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image"; // Import Next Image

const MOBILE_BREAKPOINT = 1000;

const TEAMS = [
  { name: "Brucad", image: "/brucad.jpeg" },
  { name: "Wafira", image: "/brucad.jpeg" },
  { name: "Faza", image: "/brucad.jpeg" },
  { name: "Firman", image: "/brucad.jpeg" },
  { name: "Chinta", image: "/brucad.jpeg" }, 
];

interface SplitCharsProps {
  text: string;
  headingRef?: React.Ref<HTMLHeadingElement>;
  isDefault?: boolean;
}

const SplitChars = ({ text, headingRef, isDefault }: SplitCharsProps) => (
  <h1
    ref={headingRef}
    className="text-center text-[clamp(4rem,11vw,18rem)] leading-[0.9] whitespace-nowrap text-black font-semibold max-[999px]:text-[3rem]"
  >
    {text.split("").map((char, index) => (
      <span
        className={`letter bill-change-transform inline-block ${isDefault ? "translate-y-0" : "translate-y-[110%]"}`}
        key={index}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ))}
  </h1>
);

const Teams = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const avatarContainerRef = useRef<HTMLDivElement>(null);
  const avatarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const teamNameRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const defaultHeadingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const avatarContainer = avatarContainerRef.current;
      const avatars = avatarRefs.current.filter(Boolean);
      const teamNames = teamNameRefs.current.filter(Boolean);
      const defaultHeading = defaultHeadingRef.current;

      if (!defaultHeading || !avatars.length) return;

      const defaultLetters = defaultHeading.querySelectorAll(".letter");
      // Perbaikan Error 2345: Pastikan target tidak undefined sebelum masuk GSAP
      if (defaultLetters.length > 0) {
        gsap.set(defaultLetters, { y: "0%" });
      }

      let avatarHandlers: {
        element: HTMLElement;
        onEnter: () => void;
        onLeave: () => void;
      }[] = [];
      let handleContainerEnter: (() => void) | null = null;
      let handleContainerLeave: (() => void) | null = null;

      const enableHoverInteractions = () => {
        avatars.forEach((avatar, index) => {
          const nameElement = teamNames[index];
          if (!nameElement || !avatar) return;

          const nameLetters = nameElement.querySelectorAll(".letter");

          const handleAvatarEnter = () => {
            gsap.to(avatar, {
              width: 120,
              height: 120,
              duration: 0.5,
              ease: "power4.out",
            });
            if (defaultLetters.length) {
              gsap.to(defaultLetters, {
                y: "-110%",
                duration: 0.75,
                ease: "power4.out",
                stagger: { each: 0.025, from: "center" },
              });
            }
            if (nameLetters.length) {
              gsap.to(nameLetters, {
                y: "0%",
                duration: 0.75,
                ease: "power4.out",
                stagger: { each: 0.025, from: "center" },
              });
            }
          };

          const handleAvatarLeave = () => {
            gsap.to(avatar, {
              width: 70,
              height: 70,
              duration: 0.5,
              ease: "power4.out",
            });
            if (nameLetters.length) {
              gsap.to(nameLetters, {
                y: "110%",
                duration: 0.75,
                ease: "power4.out",
                stagger: { each: 0.025, from: "center" },
              });
            }
          };

          avatar.addEventListener("mouseenter", handleAvatarEnter);
          avatar.addEventListener("mouseleave", handleAvatarLeave);
          avatarHandlers.push({
            element: avatar,
            onEnter: handleAvatarEnter,
            onLeave: handleAvatarLeave,
          });
        });

        handleContainerEnter = () => {
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "-110%",
              duration: 0.75,
              ease: "power4.out",
              stagger: { each: 0.025, from: "center" },
            });
          }
        };

        handleContainerLeave = () => {
          teamNames.forEach((name) => {
            const letters = name?.querySelectorAll(".letter");
            if (letters && letters.length) {
              gsap.to(letters, {
                y: "110%",
                duration: 0.75,
                ease: "power4.out",
                stagger: { each: 0.025, from: "center" },
              });
            }
          });
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "0%",
              duration: 0.75,
              ease: "power4.out",
              stagger: { each: 0.025, from: "center" },
            });
          }
        };

        avatarContainer?.addEventListener("mouseenter", handleContainerEnter);
        avatarContainer?.addEventListener("mouseleave", handleContainerLeave);
      };

      const disableHoverInteractions = () => {
        avatarHandlers.forEach(({ element, onEnter, onLeave }) => {
          element.removeEventListener("mouseenter", onEnter);
          element.removeEventListener("mouseleave", onLeave);
        });
        avatarHandlers = [];

        if (handleContainerEnter)
          avatarContainer?.removeEventListener(
            "mouseenter",
            handleContainerEnter,
          );
        if (handleContainerLeave)
          avatarContainer?.removeEventListener(
            "mouseleave",
            handleContainerLeave,
          );

        if (defaultLetters.length) gsap.set(defaultLetters, { y: "0%" });

        teamNames.forEach((name) => {
          const letters = name?.querySelectorAll(".letter");
          if (letters && letters.length) gsap.set(letters, { y: "110%" });
        });
        avatars.forEach((avatar) =>
          gsap.set(avatar, { clearProps: "width,height" }),
        );
      };

      let wasDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
      const handleResize = () => {
        const isDesktop = window.innerWidth >= MOBILE_BREAKPOINT;
        if (isDesktop !== wasDesktop) {
          wasDesktop = isDesktop;
          isDesktop ? enableHoverInteractions() : disableHoverInteractions();
        }
      };

      if (wasDesktop) enableHoverInteractions();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        disableHoverInteractions();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative flex h-svh w-full flex-col items-center justify-center gap-12 overflow-hidden bg-white max-[999px]:flex-col-reverse max-[999px]:gap-8"
    >
      <div
        ref={avatarContainerRef}
        className="flex h-25 w-max items-center justify-center max-[999px]:h-auto max-[999px]:max-w-[90%] max-[999px]:flex-wrap"
      >
        {TEAMS.map((team, index) => (
          <div
            key={index}
            ref={(el) => {
              avatarRefs.current[index] = el;
            }}
            className="relative h-17.5 w-17.5 cursor-pointer p-1.25 will-change-[width,height] max-[999px]:h-15 max-[999px]:w-15 max-[999px]:cursor-default max-[999px]:p-[2.5px]"
          >
            <Image
              src={team.image}
              alt={team.name}
              fill
              className="rounded-xl object-cover p-1.25"
              sizes="120px"
            />
          </div>
        ))}
      </div>

      <div className="relative h-[clamp(4rem,11vw,18rem)] w-full overflow-hidden max-[999px]:h-16">
        <div
          ref={defaultHeadingRef}
          className="absolute top-0 left-0 flex h-full w-full items-start justify-center overflow-hidden"
        >
          <SplitChars text="Our Team" isDefault={true} />
        </div>

        {TEAMS.map((team, index) => (
          <div
            key={index}
            ref={(el) => {
              teamNameRefs.current[index] = el as unknown as HTMLHeadingElement;
            }}
            className="absolute top-0 left-0 hidden h-full w-full items-start justify-center overflow-hidden min-[1000px]:flex"
          >
            <SplitChars text={team.name} />
          </div>
        ))}
      </div>

      <div className="flex gap-8 max-[999px]:gap-4">
        <p className="text-sm text-zinc-500">Cleanic Team</p>
        <p className="text-sm text-zinc-500">Capstone Project</p>
      </div>
    </section>
  );
};

export default Teams;
