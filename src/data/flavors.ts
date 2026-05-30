export const CRYO_FLAVORS = [
  {
    id: "frostbiteBerry",
    slug: "frostbite-berry",
    name: "Frostbite Berry",
    flavor: "Berry and lychee",
    headline: "Sharp berry frost with a lychee snap.",
    description:
      "Frostbite Berry opens with cold red fruit, then lands on a clean lychee finish. The profile is built for a bright first hit and a crisp finish that does not turn syrupy.",
    colors: {
      primary: "#c21121",
      secondary: "#b3e6fb",
      text: "#21080d",
      contrast: "#ffffff",
    },
    juiceColors: ["#d6132a", "#eef8ff", "#7dd3fc"],
    label: "/assets/labels/frostbite-berry.png",
    details: [
      "Red fruit top note with a clean lychee finish.",
      "Best served over ice with citrus peel.",
      "Bright, sharp, and low on aftertaste.",
    ],
  },
  {
    id: "neonMeltdown",
    slug: "neon-meltdown",
    name: "Neon Meltdown",
    flavor: "Watermelon and mint",
    headline: "Watermelon voltage cut with cold mint.",
    description:
      "Neon Meltdown is juicy up front and cold at the edge. Watermelon brings the body, while mint keeps the finish clean and electric.",
    colors: {
      primary: "#c1fe1a",
      secondary: "#fe00ae",
      text: "#170022",
      contrast: "#101604",
    },
    juiceColors: ["#fe267f", "#b8ff23", "#79ffd9"],
    label: "/assets/labels/neon-meltdown.png",
    details: [
      "Watermelon body with a cold mint finish.",
      "The sweetest Cryo profile, balanced by herbal chill.",
      "Pairs well with spicy food and late-night heat.",
    ],
  },
  {
    id: "cosmicCrush",
    slug: "cosmic-crush",
    name: "Cosmic Crush",
    flavor: "Grape and kiwi",
    headline: "Dark grape pressure with a kiwi flash.",
    description:
      "Cosmic Crush is darker and rounder than the rest of the lineup. Grape brings depth while kiwi cuts through with a bright green edge.",
    colors: {
      primary: "#433455",
      secondary: "#ddea78",
      text: "#130c1d",
      contrast: "#ffffff",
    },
    juiceColors: ["#56316d", "#c7ef59", "#f0ff96"],
    label: "/assets/labels/cosmic-crush.png",
    details: [
      "Deep grape base with a tart kiwi lift.",
      "The richest profile in the lineup.",
      "Finishes bright instead of heavy.",
    ],
  },
  {
    id: "midnightCitrus",
    slug: "midnight-citrus",
    name: "Midnight Citrus",
    flavor: "Blueberry and lemon",
    headline: "Blueberry dusk split by lemon light.",
    description:
      "Midnight Citrus keeps blueberry smooth and lemon sharp. It starts dark, then opens into a clean citrus flash.",
    colors: {
      primary: "#0d3b66",
      secondary: "#faf0ca",
      text: "#061526",
      contrast: "#ffffff",
    },
    juiceColors: ["#1d4f8f", "#fff071", "#8bd3ff"],
    label: "/assets/labels/midnight-citrus.png",
    details: [
      "Blueberry depth with lemon brightness.",
      "The cleanest citrus finish in the range.",
      "Built for a cold, sharp sip.",
    ],
  },
  {
    id: "velvetFrost",
    slug: "velvet-frost",
    name: "Velvet Frost",
    flavor: "Peach and vanilla",
    headline: "Peach cloud softened with vanilla frost.",
    description:
      "Velvet Frost is smooth, creamy, and still cold. Peach brings the lift while vanilla rounds the edges into a soft finish.",
    colors: {
      primary: "#c8a2c9",
      secondary: "#fefbce",
      text: "#2f1736",
      contrast: "#25112b",
    },
    juiceColors: ["#ffb179", "#fef5c7", "#d8a5df"],
    label: "/assets/labels/velvet-frost.png",
    details: [
      "Peach top note with a creamy vanilla finish.",
      "Softest mouthfeel in the Cryo set.",
      "Best when poured very cold.",
    ],
  },
] as const;

export type CryoFlavor = (typeof CRYO_FLAVORS)[number];
export type CryoFlavorId = CryoFlavor["id"];
export type CryoFlavorSlug = CryoFlavor["slug"];

export const DEFAULT_FLAVOR_ID = CRYO_FLAVORS[0].id;

export const LABEL_TEXTURES: Record<CryoFlavorId, string> = {
  frostbiteBerry: "/assets/labels/frostbite-berry.png",
  neonMeltdown: "/assets/labels/neon-meltdown.png",
  cosmicCrush: "/assets/labels/cosmic-crush.png",
  midnightCitrus: "/assets/labels/midnight-citrus.png",
  velvetFrost: "/assets/labels/velvet-frost.png",
};

export const LOGO_TEXTURES: Record<CryoFlavorId, string> = {
  frostbiteBerry: "/assets/logos/cryo-frostbite-berry.png",
  neonMeltdown: "/assets/logos/cryo-neon-meltdown.png",
  cosmicCrush: "/assets/logos/cryo-cosmic-crush.png",
  midnightCitrus: "/assets/logos/cryo-midnight-citrus.png",
  velvetFrost: "/assets/logos/cryo-velvet-frost.png",
};

export const AR_MODEL_PATHS: Record<CryoFlavorId, string> = {
  frostbiteBerry: "/ar/frostbite-berry/can.gltf",
  neonMeltdown: "/ar/neon-meltdown/can.gltf",
  cosmicCrush: "/ar/cosmic-crush/can.gltf",
  midnightCitrus: "/ar/midnight-citrus/can.gltf",
  velvetFrost: "/ar/velvet-frost/can.gltf",
};

export function getFlavorById(id: CryoFlavorId) {
  return CRYO_FLAVORS.find((flavor) => flavor.id === id) ?? CRYO_FLAVORS[0];
}

export function getFlavorBySlug(slug: string) {
  return CRYO_FLAVORS.find((flavor) => flavor.slug === slug) ?? CRYO_FLAVORS[0];
}

export function getFlavorByRouteValue(value: string | undefined) {
  if (!value) return CRYO_FLAVORS[0];

  return (
    CRYO_FLAVORS.find(
      (flavor) => flavor.id === value || flavor.slug === value,
    ) ?? CRYO_FLAVORS[0]
  );
}
