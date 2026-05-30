"use client";

import { Canvas } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Suspense, useCallback, useMemo, useState } from "react";
import clsx from "clsx";

import { Bounded } from "@/components/Bounded";
import {
  CRYO_FLAVORS,
  DEFAULT_FLAVOR_ID,
  getFlavorById,
  type CryoFlavorId,
} from "@/data/flavors";
import { CryoLogo } from "@/components/CryoLogo";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Scene } from "@/slices/Hero/Scene";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero() {
  const [activeFlavorId, setActiveFlavorId] =
    useState<CryoFlavorId>(DEFAULT_FLAVOR_ID);
  const [introReady, setIntroReady] = useState(false);
  const compact = useMediaQuery("(max-width: 767px)", false);
  const activeFlavor = getFlavorById(activeFlavorId);
  const handleSceneIntroComplete = useCallback(() => {
    setIntroReady(true);
  }, []);

  const style = useMemo(
    () =>
      ({
        "--flavor-primary": activeFlavor.colors.primary,
        "--flavor-secondary": activeFlavor.colors.secondary,
        "--flavor-text": activeFlavor.colors.text,
      }) as React.CSSProperties,
    [activeFlavor],
  );

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.set(".cryo-second-panel", { opacity: 0, y: 48 });
      gsap.set(".cryo-second-word", {
        opacity: 0,
        y: 34,
        rotate: -12,
        scale: 1.18,
      });
      gsap.set(".cryo-second-copy", { opacity: 0, y: 22 });
      gsap.set(".cryo-flavor-picker", { autoAlpha: 0, y: 40 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cryo-hero-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
        },
      });

      tl.to(".cryo-intro-panel", { opacity: 0, y: -56, duration: 0.32 }, 0.22)
        .to(
          ".cryo-second-panel",
          { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" },
          1.16,
        )
        .to(
          ".cryo-second-word",
          {
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.45,
            ease: "back.out(2.4)",
            stagger: 0.08,
          },
          1.25,
        )
        .to(
          ".cryo-second-copy",
          { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" },
          1.56,
        )
        .to(
          ".cryo-flavor-picker",
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.32,
            ease: "power2.out",
          },
          1.82,
        );
    });

    mm.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        ".cryo-intro-panel, .cryo-second-panel, .cryo-second-word, .cryo-second-copy, .cryo-flavor-picker",
        {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
        },
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      className="cryo-hero-section cryo-hero-bg relative min-h-[275dvh] overflow-clip text-[#f5f7ff] transition-colors duration-700"
      style={style}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="cryo-frost pointer-events-none absolute inset-0 opacity-35" />

        <div className="absolute inset-0 z-0">
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            className="h-full w-full"
          >
            <Suspense fallback={null}>
              <Scene
                activeFlavorId={activeFlavorId}
                compact={compact}
                onIntroComplete={handleSceneIntroComplete}
              />
            </Suspense>
          </Canvas>
        </div>

        <Bounded className="relative z-10 flex min-h-dvh items-center justify-center pb-36 pt-10 md:pb-32 md:pt-14">
          <div className="relative grid w-full place-items-center text-center">
            <div className="cryo-intro-panel mx-auto grid w-full max-w-4xl place-items-center">
              <div
                className={clsx(
                  "cryo-intro-content grid w-full place-items-center transition duration-700 ease-out",
                  introReady
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-6 opacity-0",
                )}
              >
                <h1 className="grid w-[min(74vw,30rem)] place-items-center">
                  <CryoLogo className="h-auto w-full text-[#f5f7ff] drop-shadow-[0_18px_44px_rgba(245,247,255,0.16)]" />
                </h1>

                <p className="mt-9 text-balance text-5xl font-black uppercase leading-[0.86] tracking-normal text-[#f5f7ff] md:text-7xl lg:text-8xl">
                  Sip the Chillwave
                </p>
                <p className="mt-6 max-w-2xl text-pretty text-lg font-bold leading-snug text-[#f5f7ff] md:text-2xl">
                  Cryo is crafted to deliver an explosive fusion of freshness,
                  bold flavors and a mixture of fruits.
                </p>
              </div>
            </div>

            <div className="cryo-second-panel pointer-events-none absolute inset-x-0 top-[7dvh] mx-auto max-w-[23rem] px-4 text-center opacity-0 md:inset-x-auto md:left-0 md:top-[10dvh] md:max-w-[36rem] md:px-0 md:text-left lg:max-w-[41rem]">
              <p className="mb-3 text-sm font-black uppercase tracking-[0.28em] text-[#f5f7ff] md:text-base">
                Try out flavours
              </p>
              <h2 className="text-balance text-4xl font-black uppercase leading-[0.86] tracking-normal text-[#f5f7ff] md:text-6xl lg:text-7xl">
                {["Fruit", "flavour", "with", "ice-cold", "fizz."].map(
                  (word) => (
                    <span
                      key={word}
                      className="cryo-second-word mr-[0.22em] inline-block"
                    >
                      {word}
                    </span>
                  ),
                )}
              </h2>
              <p className="cryo-second-copy mt-6 max-w-xl text-pretty text-base font-bold leading-snug text-[#f5f7ff] md:text-xl">
                Berry, melon, grape, citrus, and velvet peach snap into one cold
                lineup. Pick a flavor below and open its freeze-burst story.
              </p>
            </div>
          </div>
        </Bounded>
      </div>

      <FlavorPicker
        activeFlavorId={activeFlavorId}
        onSelect={setActiveFlavorId}
        ready={introReady}
      />
    </section>
  );
}

type FlavorPickerProps = {
  activeFlavorId: CryoFlavorId;
  onSelect: (flavorId: CryoFlavorId) => void;
  ready: boolean;
};

function FlavorPicker({ activeFlavorId, onSelect, ready }: FlavorPickerProps) {
  return (
    <div
      className={clsx(
        "cryo-flavor-picker invisible fixed inset-x-0 bottom-4 z-40 px-4 opacity-0 md:bottom-6",
        ready ? "" : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <div className="bg-[#0b0f14]/72 mx-auto max-w-6xl overflow-x-auto rounded-lg border border-[#f5f7ff]/25 p-2 shadow-2xl shadow-black/35 backdrop-blur-xl">
        <ul className="grid min-w-[48rem] grid-cols-5 gap-2 md:min-w-0">
          {CRYO_FLAVORS.map((flavor) => {
            const isActive = flavor.id === activeFlavorId;

            return (
              <li key={flavor.id}>
                <Link
                  href={`/flavours?flavor=${flavor.id}`}
                  onMouseEnter={() => onSelect(flavor.id)}
                  onFocus={() => onSelect(flavor.id)}
                  aria-label={`Open ${flavor.name} flavor page`}
                  className={clsx(
                    "grid h-full w-full grid-cols-[auto,1fr] items-center gap-3 rounded-lg border p-3 text-left transition duration-200",
                    isActive
                      ? "border-[#f5f7ff] bg-[#f5f7ff] text-[#0b0f14] shadow-lg"
                      : "bg-[#f5f7ff]/8 hover:bg-[#f5f7ff]/14 border-[#f5f7ff]/25 text-[#f5f7ff] hover:border-[#f5f7ff]/55",
                  )}
                >
                  <span className="grid size-11 grid-cols-2 overflow-hidden rounded-md border border-black/10">
                    <span style={{ backgroundColor: flavor.colors.primary }} />
                    <span
                      style={{ backgroundColor: flavor.colors.secondary }}
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-black uppercase md:text-base">
                      {flavor.name}
                    </span>
                    <span
                      className={clsx(
                        "block truncate text-xs font-semibold",
                        isActive ? "text-[#0b0f14]/70" : "text-[#f5f7ff]/72",
                      )}
                    >
                      {flavor.flavor}
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
