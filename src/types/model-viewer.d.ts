import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        alt?: string;
        ar?: boolean | string;
        "ar-modes"?: string;
        "ar-placement"?: string;
        "ar-scale"?: string;
        "auto-rotate"?: boolean | string;
        "camera-controls"?: boolean | string;
        "camera-orbit"?: string;
        exposure?: string;
        "environment-image"?: string;
        "field-of-view"?: string;
        "interaction-prompt"?: string;
        "max-camera-orbit"?: string;
        "min-camera-orbit"?: string;
        "quick-look-browsers"?: string;
        "shadow-intensity"?: string;
        "shadow-softness"?: string;
        scale?: string;
        src?: string;
        "touch-action"?: string;
        "xr-environment"?: boolean | string;
      };
    }
  }
}
