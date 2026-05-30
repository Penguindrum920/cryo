"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import clsx from "clsx";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { Bounded } from "@/components/Bounded";
import { SodaCan } from "@/components/SodaCan";
import type { FlavorVideoSequence } from "@/data/flavorVideoTypes";
import {
  CRYO_FLAVORS,
  getFlavorById,
  type CryoFlavor,
  type CryoFlavorId,
} from "@/data/flavors";
import { ARLaunchButton } from "@/slices/AR/ARLaunchButton";

gsap.registerPlugin(ScrollTrigger);

const CAN_DROP_START_PROGRESS = 0.78;
const CAN_DROP_END_PROGRESS = 0.94;
const VIDEO_FADE_START_PROGRESS = 0.9;
const VIDEO_FADE_END_PROGRESS = 0.99;
const SCAN_BOX_ENTER_START = 0.04;
const SCAN_BOX_ENTER_END = 0.18;
const SCAN_TURN_START = 0.2;
const SCAN_TURN_END = 0.68;
const SCAN_SETTLE_START = 0.72;
const SCAN_SETTLE_END = 0.9;

type PlaybackState = {
  progress: number;
  duration: number;
  ended: boolean;
  ready: boolean;
};

type FlavorExperienceProps = {
  initialFlavorId: CryoFlavorId;
  videoSequence: FlavorVideoSequence;
};

export function FlavorExperience({
  initialFlavorId,
  videoSequence,
}: FlavorExperienceProps) {
  const flavor = getFlavorById(initialFlavorId);
  const scanSectionRef = useRef<HTMLElement>(null);
  const [handoffCanProgress, setHandoffCanProgress] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);
  const style = useMemo(
    () =>
      ({
        "--flavor-primary": flavor.colors.primary,
        "--flavor-secondary": flavor.colors.secondary,
      }) as React.CSSProperties,
    [flavor],
  );

  useEffect(() => {
    const section = scanSectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setScanProgress(1);
      return;
    }

    let frame = 0;
    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        window.cancelAnimationFrame(frame);
        frame = window.requestAnimationFrame(() =>
          setScanProgress(Number(self.progress.toFixed(4))),
        );
      },
    });

    ScrollTrigger.refresh();

    return () => {
      window.cancelAnimationFrame(frame);
      trigger.kill();
    };
  }, [flavor.id]);

  return (
    <main
      className="min-h-screen bg-[color:var(--flavor-primary)] text-[color:var(--flavor-secondary)]"
      style={style}
    >
      <PersistentHandoffCan
        flavor={flavor}
        reveal={handoffCanProgress}
        scanProgress={scanProgress}
      />

      <section className="flavour-story relative min-h-dvh overflow-hidden">
        <div className="relative h-dvh overflow-hidden">
          <FrameSequenceShowcase
            flavor={flavor}
            onCanProgress={setHandoffCanProgress}
            sequence={videoSequence}
          />

          <Bounded className="pointer-events-none relative z-30 flex min-h-dvh items-start pt-28 md:pt-32">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase tracking-[0.34em] opacity-75 md:text-base">
                {flavor.flavor}
              </p>
              <h1 className="mt-4 text-balance text-5xl font-black uppercase leading-[0.86] tracking-normal md:text-7xl lg:text-[5.8rem]">
                {flavor.name}
              </h1>
              <p className="mt-6 max-w-2xl text-pretty text-lg font-bold leading-snug opacity-85 md:text-2xl">
                {flavor.headline}
              </p>
              <ARLaunchButton flavor={flavor} />
            </div>
          </Bounded>

          <FlavorQuickLinks activeFlavorId={flavor.id} />
        </div>
      </section>

      <FlavorScrollScan
        flavor={flavor}
        progress={scanProgress}
        sectionRef={scanSectionRef}
      />
    </main>
  );
}

type FlavorScrollScanProps = {
  flavor: CryoFlavor;
  progress: number;
  sectionRef: React.RefObject<HTMLElement>;
};

function FlavorScrollScan({
  flavor,
  progress,
  sectionRef,
}: FlavorScrollScanProps) {
  const scanBoxProgress = smoothstep(
    clamp(
      (progress - SCAN_BOX_ENTER_START) /
        (SCAN_BOX_ENTER_END - SCAN_BOX_ENTER_START),
      0,
      1,
    ),
  );
  const detailProgress = smoothstep(clamp((progress - 0.42) / 0.28, 0, 1));

  return (
    <section
      ref={sectionRef}
      className="flavour-scan relative min-h-[190dvh] bg-[color:var(--flavor-primary)] text-[color:var(--flavor-secondary)]"
      data-scan-progress={progress.toFixed(4)}
      data-scroll-scan="soda-can-to-box"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <Bounded className="relative min-h-dvh pt-24 md:pt-20">
          <div className="relative z-20 min-h-[58dvh] md:min-h-[74dvh]">
            <ScanBox flavor={flavor} progress={scanBoxProgress} />
          </div>

          <FlavorScanDetails flavor={flavor} progress={detailProgress} />
        </Bounded>
      </div>
    </section>
  );
}

type ScanBoxProps = {
  flavor: CryoFlavor;
  progress: number;
};

function ScanBox({ flavor, progress }: ScanBoxProps) {
  const lineProgress = smoothstep(clamp((progress - 0.18) / 0.72, 0, 1));

  return (
    <div
      aria-hidden="true"
      className="fixed right-[-12vw] top-1/2 h-[min(54dvh,32rem)] w-[min(72vw,28rem)] -translate-y-1/2 rounded-lg border-2 md:right-[calc(8vw+3rem)] md:h-[min(56dvh,34rem)] md:w-[30rem]"
      data-scan-box="flavour-profile"
      style={{
        borderColor: flavor.colors.secondary,
        boxShadow: `0 0 ${2.5 + progress * 3.5}rem ${flavor.colors.secondary}30`,
        opacity: progress,
        transform: `translate3d(0, -50%, 0) scale(${progress})`,
      }}
    >
      <div
        className="absolute inset-x-5 top-5 h-px"
        style={{ backgroundColor: `${flavor.colors.secondary}70` }}
      />
      <div
        className="absolute inset-x-5 bottom-5 h-px"
        style={{ backgroundColor: `${flavor.colors.secondary}70` }}
      />
      <div
        className="absolute left-5 top-5 h-12 w-px"
        style={{ backgroundColor: `${flavor.colors.secondary}70` }}
      />
      <div
        className="absolute bottom-5 right-5 h-12 w-px"
        style={{ backgroundColor: `${flavor.colors.secondary}70` }}
      />
      <div
        className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full"
        data-scan-line="active"
        style={{
          backgroundColor: flavor.colors.secondary,
          boxShadow: `0 0 2.25rem ${flavor.colors.secondary}`,
          opacity: progress,
          transform: `translate3d(0, calc(-50% + ${(lineProgress - 0.5) * 18}rem), 0)`,
        }}
      />
      <p className="absolute bottom-8 left-6 text-xs font-black uppercase tracking-[0.32em] opacity-75">
        CRYO profile
      </p>
    </div>
  );
}

type PersistentHandoffCanProps = {
  flavor: CryoFlavor;
  reveal: number;
  scanProgress: number;
};

function PersistentHandoffCan({
  flavor,
  reveal,
  scanProgress,
}: PersistentHandoffCanProps) {
  const turnProgress = smoothstep(
    clamp(
      (scanProgress - SCAN_TURN_START) / (SCAN_TURN_END - SCAN_TURN_START),
      0,
      1,
    ),
  );
  const settleProgress = smoothstep(
    clamp(
      (scanProgress - SCAN_SETTLE_START) /
        (SCAN_SETTLE_END - SCAN_SETTLE_START),
      0,
      1,
    ),
  );
  const opacity = scanProgress > 0.001 ? 1 : reveal;
  const dropLift = scanProgress > 0.001 ? 0 : (1 - reveal) * 46;
  const dropRotation = scanProgress > 0.001 ? 0 : (1 - reveal) * -8;
  const scale =
    scanProgress > 0.001 ? 1 - settleProgress * 0.34 : 0.72 + reveal * 0.28;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-[-12vw] top-1/2 z-40 h-[66dvh] w-[min(28rem,66vw)] min-w-48 origin-center will-change-transform md:right-[8vw] md:h-[78dvh] md:w-[min(36rem,44vw)]"
      data-can-drop="same-soda-can"
      data-persistent-can="video-to-scan-box"
      data-scan-settle-progress={settleProgress.toFixed(4)}
      data-scan-turn-progress={turnProgress.toFixed(4)}
      data-scroll-can="same-soda-can"
      style={{
        opacity,
        filter: `drop-shadow(0 ${1.5 + opacity * 1.4}rem ${1.4 + opacity * 1.8}rem rgba(0, 0, 0, ${0.22 + scanProgress * 0.18}))`,
        transform: `translate3d(0, calc(-50% - ${dropLift}dvh), 0) rotate(${dropRotation}deg) scale(${scale})`,
      }}
    >
      <Canvas
        camera={{ position: [0, 0.15, 5.3], fov: 27 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        shadows
      >
        <Suspense fallback={null}>
          <PersistentHandoffCanScene
            flavor={flavor}
            reveal={reveal}
            scanProgress={scanProgress}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

type PersistentHandoffCanSceneProps = {
  flavor: CryoFlavor;
  reveal: number;
  scanProgress: number;
};

function PersistentHandoffCanScene({
  flavor,
  reveal,
  scanProgress,
}: PersistentHandoffCanSceneProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    if (scanProgress <= 0.001) {
      groupRef.current.rotation.x = 0;
      groupRef.current.rotation.y =
        -0.5 + reveal * 0.42 + Math.sin(clock.elapsedTime * 0.55) * 0.045;
      groupRef.current.rotation.z = -0.08 + (1 - reveal) * 0.16;
      groupRef.current.position.y =
        -0.12 + reveal * 0.1 + Math.sin(clock.elapsedTime * 0.7) * 0.025;
      return;
    }

    const turnProgress = smoothstep(
      clamp(
        (scanProgress - SCAN_TURN_START) / (SCAN_TURN_END - SCAN_TURN_START),
        0,
        1,
      ),
    );
    const settleProgress = smoothstep(
      clamp(
        (scanProgress - SCAN_SETTLE_START) /
          (SCAN_SETTLE_END - SCAN_SETTLE_START),
        0,
        1,
      ),
    );
    const floating =
      Math.sin(clock.elapsedTime * 1.45) *
      0.045 *
      (1 - turnProgress) *
      (1 - settleProgress);

    groupRef.current.rotation.x = turnProgress * Math.PI * 2;
    groupRef.current.rotation.y =
      -0.58 + clock.elapsedTime * 0.1 * (1 - settleProgress);
    groupRef.current.rotation.z = -0.08 + settleProgress * 0.08;
    groupRef.current.position.y = floating - settleProgress * 0.08;
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0.15, 5.3]} fov={27} />
      <ambientLight intensity={2.35} color={flavor.colors.secondary} />
      <spotLight
        castShadow
        color="#ffffff"
        intensity={34}
        penumbra={0.72}
        position={[-2.8, 4.1, 4.2]}
      />
      <pointLight
        color={flavor.colors.primary}
        intensity={42}
        position={[2.6, 0.4, 2.4]}
      />
      <pointLight
        color={flavor.colors.secondary}
        intensity={26}
        position={[-1.8, -0.7, 2.4]}
      />

      <group
        ref={groupRef}
        position={[0, -0.08, 0]}
        rotation={[0, -0.5, -0.08]}
      >
        <SodaCan flavor={flavor.id} canScale={2.72} />
      </group>

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.18} />
    </>
  );
}

type FlavorScanDetailsProps = {
  flavor: CryoFlavor;
  progress: number;
};

function FlavorScanDetails({ flavor, progress }: FlavorScanDetailsProps) {
  const ingredients = getFlavorIngredients(flavor);

  return (
    <div
      className="absolute inset-x-5 bottom-6 z-30 grid gap-5 rounded-lg border p-5 backdrop-blur-md md:bottom-10 md:left-8 md:right-auto md:w-[min(42rem,48vw)] md:p-6"
      data-flavour-details="scan-result"
      style={{
        backgroundColor: `${flavor.colors.primary}e8`,
        borderColor: `${flavor.colors.secondary}52`,
        boxShadow: `0 2rem 5rem rgba(0, 0, 0, ${0.18 + progress * 0.14})`,
        opacity: progress,
        transform: `translate3d(0, ${(1 - progress) * 2.6}rem, 0)`,
      }}
    >
      <div>
        <p className="text-xs font-black uppercase tracking-[0.32em] opacity-65">
          Scan complete
        </p>
        <h3 className="mt-3 text-balance text-3xl font-black uppercase leading-[0.9] md:text-5xl">
          {flavor.name}
        </h3>
      </div>

      <p className="text-pretty text-base font-bold leading-snug opacity-[0.82] md:text-xl">
        {flavor.description}
      </p>

      <div className="grid gap-4 md:grid-cols-[0.78fr,1.22fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] opacity-60">
            Ingredients
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {ingredients.map((ingredient) => (
              <li
                key={ingredient}
                className="rounded-md border px-3 py-2 text-sm font-black uppercase"
                style={{
                  backgroundColor: `${flavor.colors.secondary}16`,
                  borderColor: `${flavor.colors.secondary}42`,
                }}
              >
                {ingredient}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] opacity-60">
            Notes
          </p>
          <ul className="mt-3 grid gap-2">
            {flavor.details.map((detail) => (
              <li
                key={detail}
                className="text-sm font-bold leading-tight opacity-[0.86]"
              >
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

type FrameSequenceShowcaseProps = {
  flavor: CryoFlavor;
  onCanProgress: React.Dispatch<React.SetStateAction<number>>;
  sequence: FlavorVideoSequence;
};

function FrameSequenceShowcase({
  flavor,
  onCanProgress,
  sequence,
}: FrameSequenceShowcaseProps) {
  const [playback, setPlayback] = useState<PlaybackState>({
    progress: 0,
    duration: 0,
    ended: false,
    ready: false,
  });
  const canDropProgress = smoothstep(
    clamp(
      (playback.progress - CAN_DROP_START_PROGRESS) /
        (CAN_DROP_END_PROGRESS - CAN_DROP_START_PROGRESS),
      0,
      1,
    ),
  );
  const playbackComplete = playback.ended || playback.progress >= 0.995;
  const videoOpacity = playbackComplete
    ? 0
    : 1 -
      smoothstep(
        clamp(
          (playback.progress - VIDEO_FADE_START_PROGRESS) /
            (VIDEO_FADE_END_PROGRESS - VIDEO_FADE_START_PROGRESS),
          0,
          1,
        ),
      );
  const visibleCanProgress = playbackComplete ? 1 : canDropProgress;

  useEffect(() => {
    setPlayback({
      progress: 0,
      duration: 0,
      ended: false,
      ready: false,
    });
  }, [sequence.videoPath]);

  useEffect(() => {
    const refreshFrame = window.requestAnimationFrame(() =>
      ScrollTrigger.refresh(),
    );

    return () => window.cancelAnimationFrame(refreshFrame);
  }, [sequence.videoPath]);

  useEffect(() => {
    onCanProgress(visibleCanProgress);
  }, [onCanProgress, visibleCanProgress]);

  useEffect(() => {
    return () => onCanProgress(0);
  }, [onCanProgress]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-10 overflow-hidden"
      data-frame-sequence={flavor.slug}
      data-playback-source="video-autoplay"
      data-video-ended={playbackComplete ? "true" : "false"}
      data-video-progress={playback.progress.toFixed(4)}
      data-can-drop-progress={visibleCanProgress.toFixed(4)}
    >
      {sequence.videoPath ? (
        <FrameSequenceVideo
          flavor={flavor}
          onPlayback={setPlayback}
          opacity={videoOpacity}
          sequence={sequence}
        />
      ) : (
        <MissingFrameSequence sequence={sequence} />
      )}
    </div>
  );
}

type FrameSequenceVideoProps = {
  flavor: CryoFlavor;
  sequence: FlavorVideoSequence;
  opacity: number;
  onPlayback: React.Dispatch<React.SetStateAction<PlaybackState>>;
};

function FrameSequenceVideo({
  flavor,
  sequence,
  opacity,
  onPlayback,
}: FrameSequenceVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let animationFrame = 0;
    let cancelled = false;

    const publishPlayback = () => {
      if (cancelled) return;

      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      const progress = duration ? clamp(video.currentTime / duration, 0, 1) : 0;

      onPlayback({
        progress: video.ended ? 1 : progress,
        duration,
        ended: video.ended,
        ready: video.readyState >= 2,
      });

      if (!video.ended) {
        animationFrame = window.requestAnimationFrame(publishPlayback);
      }
    };

    const startPlayback = () => {
      setReady(true);
      onPlayback((current) => ({
        ...current,
        ready: true,
        duration: Number.isFinite(video.duration) ? video.duration : 0,
      }));
      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(publishPlayback);
      void video.play().catch(() => undefined);
    };

    const markEnded = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : 0;
      window.cancelAnimationFrame(animationFrame);
      onPlayback({
        progress: 1,
        duration,
        ended: true,
        ready: true,
      });
    };

    setReady(false);
    onPlayback({
      progress: 0,
      duration: 0,
      ended: false,
      ready: false,
    });

    video.addEventListener("loadedmetadata", startPlayback);
    video.addEventListener("canplay", startPlayback);
    video.addEventListener("play", startPlayback);
    video.addEventListener("ended", markEnded);

    if (video.readyState >= 1) {
      startPlayback();
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(animationFrame);
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("canplay", startPlayback);
      video.removeEventListener("play", startPlayback);
      video.removeEventListener("ended", markEnded);
    };
  }, [onPlayback, sequence.videoPath]);

  return (
    <video
      ref={videoRef}
      aria-label={`${flavor.name} explosion video`}
      autoPlay
      className="absolute inset-0 h-full w-full scale-[1.08] object-cover opacity-0 transition-opacity duration-150"
      data-video-autoplay="true"
      data-video-visible-opacity={opacity.toFixed(3)}
      muted
      playsInline
      preload="auto"
      src={sequence.videoPath}
      style={{ opacity: ready ? opacity * 0.96 : 0 }}
    />
  );
}

type MissingFrameSequenceProps = {
  sequence: FlavorVideoSequence;
};

function MissingFrameSequence({ sequence }: MissingFrameSequenceProps) {
  return (
    <div className="absolute inset-0 grid place-items-center px-6 text-center">
      <div className="max-w-xl rounded-lg border border-[color:var(--flavor-secondary)] bg-[color:var(--flavor-primary)] p-6 text-[color:var(--flavor-secondary)] shadow-2xl shadow-black/35 backdrop-blur-xl">
        <p className="text-xs font-black uppercase tracking-[0.28em] opacity-60">
          Video missing
        </p>
        <p className="mt-3 text-pretty text-lg font-black uppercase leading-tight">
          Add {sequence.expectedVideoPath}
        </p>
      </div>
    </div>
  );
}

type FlavorQuickLinksProps = {
  activeFlavorId: CryoFlavorId;
};

function FlavorQuickLinks({ activeFlavorId }: FlavorQuickLinksProps) {
  const activeFlavor = getFlavorById(activeFlavorId);

  return (
    <div className="absolute inset-x-0 bottom-4 z-30 px-4 md:bottom-6">
      <div
        className="mx-auto max-w-6xl overflow-x-auto rounded-lg border p-2 shadow-2xl shadow-black/35 backdrop-blur-xl"
        style={{
          backgroundColor: `${activeFlavor.colors.primary}d9`,
          borderColor: `${activeFlavor.colors.secondary}3d`,
        }}
      >
        <ul className="grid min-w-[48rem] grid-cols-5 gap-2 md:min-w-0">
          {CRYO_FLAVORS.map((item) => {
            const active = item.id === activeFlavorId;

            return (
              <li key={item.id}>
                <Link
                  href={`/flavours?flavor=${item.id}`}
                  className={clsx(
                    "grid h-full rounded-lg border p-3 text-left transition",
                    active ? "shadow-lg shadow-black/15" : "hover:opacity-85",
                  )}
                  style={{
                    backgroundColor: active
                      ? `${activeFlavor.colors.secondary}24`
                      : `${activeFlavor.colors.secondary}10`,
                    borderColor: active
                      ? activeFlavor.colors.secondary
                      : `${activeFlavor.colors.secondary}3d`,
                    color: activeFlavor.colors.secondary,
                  }}
                >
                  <span className="text-sm font-black uppercase">
                    {item.name}
                  </span>
                  <span className="mt-1 truncate text-xs font-bold opacity-70">
                    {item.flavor}
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function smoothstep(value: number) {
  return value * value * (3 - 2 * value);
}

function getFlavorIngredients(flavor: CryoFlavor) {
  return flavor.flavor
    .split(/\s+and\s+/i)
    .map((ingredient) =>
      ingredient.trim().replace(/\b\w/g, (letter) => letter.toUpperCase()),
    )
    .filter(Boolean);
}
