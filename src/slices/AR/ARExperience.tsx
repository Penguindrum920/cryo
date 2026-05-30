"use client";

import { Canvas } from "@react-three/fiber";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

import { AR_MODEL_PATHS, LOGO_TEXTURES, type CryoFlavor } from "@/data/flavors";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { DesktopShowcase } from "@/slices/AR/DesktopShowcase";
import {
  ModelViewerAR,
  type ModelViewerARHandle,
} from "@/slices/AR/ModelViewerAR";

type ARExperienceProps = {
  flavor: CryoFlavor;
  autoLaunch?: boolean;
};

const ATMOSPHERE_COPY: Record<CryoFlavor["id"], string> = {
  frostbiteBerry: "Icy frost particles with a cool red product glow.",
  neonMeltdown: "Neon pink sparks cut through lime edge lighting.",
  cosmicCrush: "Purple ambience with tart lime highlights around the can.",
  midnightCitrus: "Deep navy staging with a clean citrus rim glow.",
  velvetFrost: "Soft lilac light and a creamy haze around the surface.",
};

export function ARExperience({ flavor, autoLaunch = false }: ARExperienceProps) {
  const modelViewerRef = useRef<ModelViewerARHandle>(null);
  const isCoarsePointer = useMediaQuery("(pointer: coarse)", false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)", false);
  const [origin, setOrigin] = useState("");
  const [qrVisible, setQrVisible] = useState(false);
  const isMobileAR = isCoarsePointer || isSmallScreen;
  const modelSrc = AR_MODEL_PATHS[flavor.id];
  const qrPath = `/ar/${flavor.slug}`;
  const qrValue = `${origin}${qrPath}`;
  const logoSrc = LOGO_TEXTURES[flavor.id];
  const style = useMemo(
    () =>
      ({
        "--flavor-primary": flavor.colors.primary,
        "--flavor-secondary": flavor.colors.secondary,
      }) as React.CSSProperties,
    [flavor],
  );

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const handlePrimaryAction = () => {
    if (isMobileAR) {
      void modelViewerRef.current?.launchAR();
      return;
    }

    setQrVisible(true);
  };

  return (
    <main
      className="min-h-screen overflow-hidden bg-[#080c11] text-[#f5f7ff]"
      style={style}
    >
      <section className="relative min-h-screen px-4 py-24 md:px-8 md:py-28">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 72% 26%, ${flavor.colors.primary}40, transparent 24rem),
              radial-gradient(circle at 22% 74%, ${flavor.colors.secondary}30, transparent 22rem),
              linear-gradient(180deg, #080c11 0%, #0b0f14 100%)
            `,
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(245,247,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(245,247,255,0.045)_1px,transparent_1px)] bg-[size:46px_46px]" />

        <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr),24rem]">
          <header className="flex items-center justify-between gap-4 lg:col-span-2">
            <Link
              href={`/flavours?flavor=${flavor.id}`}
              className="rounded-md border border-[#f5f7ff]/18 bg-[#f5f7ff]/8 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f5f7ff]/78 transition hover:border-[#f5f7ff]/48 hover:bg-[#f5f7ff]/14"
            >
              Back to flavour
            </Link>
            <Image
              alt={`${flavor.name} logo`}
              className="h-10 w-auto object-contain md:h-12"
              height={64}
              src={logoSrc}
              width={220}
            />
          </header>

          <div className="min-h-[34rem] overflow-hidden rounded-lg border border-[#f5f7ff]/14 bg-[#05080d]/72 shadow-2xl shadow-black/35">
            {isMobileAR ? (
              <ModelViewerAR
                ref={modelViewerRef}
                autoLaunch={autoLaunch}
                className="h-[calc(100vh-12rem)] min-h-[34rem]"
                flavor={flavor}
                modelSrc={modelSrc}
              />
            ) : (
              <div className="relative h-[calc(100vh-12rem)] min-h-[34rem]">
                <Canvas
                  camera={{ position: [0, 1, 4.6], fov: 36 }}
                  dpr={[1, 1.5]}
                  gl={{ antialias: true, alpha: false }}
                  shadows
                >
                  <Suspense fallback={null}>
                    <DesktopShowcase flavor={flavor} />
                  </Suspense>
                </Canvas>
                <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#f5f7ff]/12 bg-[#0b0f14]/62 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f5f7ff]/78 backdrop-blur-xl">
                  Desktop showcase
                </div>
              </div>
            )}
          </div>

          <aside className="flex flex-col gap-4 rounded-lg border border-[#f5f7ff]/14 bg-[#0b0f14]/72 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#f5f7ff]/58">
                CRYO AR
              </p>
              <h1 className="mt-3 text-balance text-4xl font-black uppercase leading-[0.88] md:text-5xl">
                {flavor.name}
              </h1>
              <p className="mt-4 text-pretty text-base font-bold leading-snug text-[#f5f7ff]/72">
                {flavor.flavor}. Open the matching can in AR on a supported
                phone, or inspect the virtual product showcase here.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div
                className="h-16 rounded-md border border-[#f5f7ff]/12"
                style={{ backgroundColor: flavor.colors.primary }}
              />
              <div
                className="h-16 rounded-md border border-[#f5f7ff]/12"
                style={{ backgroundColor: flavor.colors.secondary }}
              />
            </div>

            <div className="rounded-lg border border-[#f5f7ff]/12 bg-[#f5f7ff]/6 p-4">
              <p className="text-sm font-black uppercase text-[#f5f7ff]/86">
                Atmosphere
              </p>
              <p className="mt-2 text-sm font-bold leading-snug text-[#f5f7ff]/62">
                {ATMOSPHERE_COPY[flavor.id]}
              </p>
            </div>

            <button
              className={clsx(
                "mt-auto rounded-md border px-5 py-4 text-sm font-black uppercase tracking-normal shadow-xl transition",
                isMobileAR
                  ? "border-[#f5f7ff] bg-[#f5f7ff] text-[#0b0f14] shadow-black/28 hover:scale-[1.02]"
                  : "border-[#f5f7ff]/18 bg-[#f5f7ff]/10 text-[#f5f7ff] hover:border-[#f5f7ff]/46 hover:bg-[#f5f7ff]/16",
              )}
              onClick={handlePrimaryAction}
              style={isMobileAR ? { color: flavor.colors.text } : undefined}
              type="button"
            >
              {isMobileAR ? "Launch AR" : "View on Phone"}
            </button>

            {!isMobileAR && (
              <div
                className={clsx(
                  "rounded-lg border border-[#f5f7ff]/12 bg-[#f5f7ff] p-4 text-[#0b0f14] transition",
                  qrVisible ? "opacity-100" : "opacity-80",
                )}
              >
                <div className="grid place-items-center rounded-md bg-white p-3">
                  {origin ? (
                    <QRCodeSVG
                      bgColor="#ffffff"
                      fgColor="#0b0f14"
                      includeMargin={false}
                      level="M"
                      size={190}
                      value={qrValue}
                    />
                  ) : null}
                </div>
                <p className="mt-3 text-center text-xs font-black uppercase leading-tight">
                  Scan to open {qrPath}
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
