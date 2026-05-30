"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import type { CryoFlavor } from "@/data/flavors";

type ModelViewerElement = HTMLElement & {
  activateAR?: () => Promise<void>;
  canActivateAR?: boolean;
};

export type ModelViewerARHandle = {
  launchAR: () => Promise<void>;
};

type ModelViewerARProps = {
  flavor: CryoFlavor;
  modelSrc: string;
  className?: string;
  autoLaunch?: boolean;
};

export const ModelViewerAR = forwardRef<
  ModelViewerARHandle,
  ModelViewerARProps
>(function ModelViewerAR({ flavor, modelSrc, className, autoLaunch }, ref) {
  const modelViewerRef = useRef<ModelViewerElement | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [arStatus, setArStatus] = useState("Ready for AR placement");

  const launchAR = useCallback(async () => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer?.activateAR) {
      setArStatus("AR is not available on this browser. Use the 3D viewer.");
      return;
    }

    try {
      await modelViewer.activateAR();
    } catch {
      setArStatus("AR could not start. Use the 3D viewer or scan from a phone.");
    }
  }, []);

  useImperativeHandle(ref, () => ({
    launchAR,
  }), [launchAR]);

  useEffect(() => {
    void import("@google/model-viewer");
  }, []);

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    if (!modelViewer) return;

    const handleLoad = () => {
      setIsReady(true);
      setArStatus(
        modelViewer.canActivateAR === false
          ? "3D viewer ready. AR is unavailable on this device."
          : "Ready for AR placement",
      );
    };
    const handleError = () => {
      setArStatus("The AR model failed to load. The desktop showcase is still available.");
    };
    const handleARStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ status?: string }>).detail;
      if (detail?.status === "session-started") {
        setArStatus("Move your phone to find a desk, table, or floor.");
      } else if (detail?.status === "object-placed") {
        setArStatus("Placed. Walk around the can to inspect it.");
      } else if (detail?.status === "failed") {
        setArStatus("AR failed to start. Try opening this page on a supported phone.");
      } else {
        setArStatus("Ready for AR placement");
      }
    };

    modelViewer.addEventListener("load", handleLoad);
    modelViewer.addEventListener("error", handleError);
    modelViewer.addEventListener("ar-status", handleARStatus);

    return () => {
      modelViewer.removeEventListener("load", handleLoad);
      modelViewer.removeEventListener("error", handleError);
      modelViewer.removeEventListener("ar-status", handleARStatus);
    };
  }, [modelSrc]);

  useEffect(() => {
    if (!autoLaunch || !isReady) return;

    const timer = window.setTimeout(() => {
      void launchAR();
    }, 350);

    return () => window.clearTimeout(timer);
  }, [autoLaunch, isReady, launchAR]);

  return (
    <div
      className={clsx(
        "relative h-full min-h-[30rem] overflow-hidden rounded-lg border border-[#f5f7ff]/14 bg-[#05080d]",
        className,
      )}
    >
      <model-viewer
        ref={modelViewerRef}
        alt={`${flavor.name} CRYO can in AR`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-placement="floor"
        ar-scale="fixed"
        auto-rotate
        camera-controls
        camera-orbit="-22deg 72deg 0.42m"
        className="absolute inset-0 h-full w-full"
        environment-image="/hdr/lobby.hdr"
        exposure="1.05"
        field-of-view="28deg"
        interaction-prompt="auto"
        max-camera-orbit="Infinity 88deg 0.9m"
        min-camera-orbit="-Infinity 34deg 0.24m"
        quick-look-browsers="safari chrome"
        shadow-intensity="0.9"
        shadow-softness="0.72"
        src={modelSrc}
        touch-action="pan-y"
        xr-environment
      >
        <button
          slot="ar-button"
          aria-hidden="true"
          className="hidden"
          tabIndex={-1}
          type="button"
        />
      </model-viewer>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background: `linear-gradient(180deg, ${flavor.colors.primary}33, transparent)`,
        }}
      />
      <div className="pointer-events-none absolute left-4 top-4 rounded-md border border-[#f5f7ff]/12 bg-[#0b0f14]/62 px-3 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f5f7ff]/78 backdrop-blur-xl">
        {arStatus}
      </div>
      <button
        className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-md border border-[#f5f7ff]/20 bg-[#f5f7ff] px-5 py-3 text-sm font-black uppercase tracking-normal text-[#0b0f14] shadow-2xl shadow-black/30 transition hover:scale-[1.02]"
        onClick={() => {
          void launchAR();
        }}
        style={{ color: flavor.colors.text }}
        type="button"
      >
        Place Can in AR
      </button>
    </div>
  );
});
