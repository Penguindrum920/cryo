"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { AR_MODEL_PATHS, type CryoFlavor } from "@/data/flavors";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type ModelViewerElement = HTMLElement & {
  activateAR?: () => Promise<void>;
};

type ARLaunchButtonProps = {
  flavor: CryoFlavor;
};

export function ARLaunchButton({ flavor }: ARLaunchButtonProps) {
  const router = useRouter();
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const isCoarsePointer = useMediaQuery("(pointer: coarse)", false);
  const isSmallScreen = useMediaQuery("(max-width: 767px)", false);
  const [status, setStatus] = useState("");
  const isMobileARCandidate = isCoarsePointer || isSmallScreen;
  const arHref = `/ar/${flavor.slug}?launch=1`;
  const modelSrc = AR_MODEL_PATHS[flavor.id];

  useEffect(() => {
    if (!isMobileARCandidate) return;

    void import("@google/model-viewer");
  }, [isMobileARCandidate]);

  const handleLaunch = async () => {
    if (!isMobileARCandidate) {
      router.push(arHref);
      return;
    }

    const modelViewer = modelViewerRef.current;

    if (!modelViewer?.activateAR) {
      router.push(arHref);
      return;
    }

    try {
      await modelViewer.activateAR();
      setStatus("");
    } catch {
      setStatus("Opening the AR viewer page instead.");
      router.push(arHref);
    }
  };

  return (
    <>
      <button
        className="pointer-events-auto mt-7 inline-flex rounded-md border px-5 py-3 text-sm font-black uppercase tracking-normal shadow-2xl shadow-black/30 transition hover:scale-[1.02]"
        onClick={handleLaunch}
        style={{
          backgroundColor: `${flavor.colors.secondary}20`,
          borderColor: flavor.colors.secondary,
          color: flavor.colors.secondary,
        }}
        type="button"
      >
        Experience in AR
      </button>
      {status ? (
        <span className="sr-only" role="status">
          {status}
        </span>
      ) : null}
      {isMobileARCandidate ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed bottom-0 left-0 size-px overflow-hidden opacity-0"
        >
          <model-viewer
            ref={modelViewerRef}
            alt={`${flavor.name} CRYO can`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-placement="floor"
            ar-scale="fixed"
            camera-orbit="-22deg 72deg 0.42m"
            environment-image="/hdr/lobby.hdr"
            exposure="1.05"
            field-of-view="28deg"
            quick-look-browsers="safari chrome"
            shadow-intensity="0.9"
            shadow-softness="0.72"
            src={modelSrc}
            xr-environment
          />
        </div>
      ) : null}
    </>
  );
}
