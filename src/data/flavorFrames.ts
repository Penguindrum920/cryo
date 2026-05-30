import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

import type { CryoFlavor, CryoFlavorId } from "@/data/flavors";
import type { FlavorFrameSequence } from "@/data/flavorFrameTypes";

const FRAME_ROOT_NAMES = [
  "flavour-frames",
  "flavor-frames",
  "fruit-frames",
  "frames",
];

const FRAME_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const FRAME_RATE = 29;

export function getFlavorFrameSequence(
  flavor: CryoFlavor,
): FlavorFrameSequence {
  const publicRoot = path.join(process.cwd(), "public");
  const expectedFolder = `/flavour-frames/${flavor.name} frames/`;
  const folder = findFrameFolder(publicRoot, flavor);
  const framePaths = folder ? getFramePaths(publicRoot, folder) : [];
  const videoPath = getFlavorVideoPath(publicRoot, flavor);

  return {
    flavorId: flavor.id,
    framePaths,
    frameCount: framePaths.length,
    frameRate: FRAME_RATE,
    videoPath,
    expectedFolder,
    discoveredFolder: folder
      ? `/${path.relative(publicRoot, folder).split(path.sep).join("/")}/`
      : undefined,
  };
}

export function getFlavorFrameSequences(
  flavors: readonly CryoFlavor[],
): Record<CryoFlavorId, FlavorFrameSequence> {
  return Object.fromEntries(
    flavors.map((flavor) => [flavor.id, getFlavorFrameSequence(flavor)]),
  ) as Record<CryoFlavorId, FlavorFrameSequence>;
}

function findFrameFolder(publicRoot: string, flavor: CryoFlavor) {
  const aliases = getFolderAliases(flavor).map(normalizeName);
  const roots = [
    ...FRAME_ROOT_NAMES.map((rootName) => path.join(publicRoot, rootName)),
    publicRoot,
  ];

  for (const root of roots) {
    if (!existsSync(root)) continue;

    const direct = findDirectFolder(root, aliases);
    if (direct) return direct;
  }

  return undefined;
}

function findDirectFolder(root: string, aliases: string[]) {
  const entries = readdirSync(root, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const normalized = normalizeName(entry.name);

    if (aliases.includes(normalized)) {
      return path.join(root, entry.name);
    }
  }

  return undefined;
}

function getFolderAliases(flavor: CryoFlavor) {
  return [
    `${flavor.name} frames`,
    `${flavor.name} Frames`,
    `${flavor.name}-frames`,
    `${flavor.slug} frames`,
    `${flavor.slug}-frames`,
    `${flavor.id} frames`,
    `${flavor.id}-frames`,
    flavor.name,
    flavor.slug,
    flavor.id,
  ];
}

function getFramePaths(publicRoot: string, folder: string) {
  return readdirSync(folder, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => FRAME_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort(naturalCompare)
    .map((name) => toPublicPath(publicRoot, path.join(folder, name)));
}

function getFlavorVideoPath(publicRoot: string, flavor: CryoFlavor) {
  const videoPath = path.join(
    publicRoot,
    "flavour-videos",
    `${flavor.slug}.mp4`,
  );

  return existsSync(videoPath)
    ? toPublicPath(publicRoot, videoPath)
    : undefined;
}

function toPublicPath(publicRoot: string, filePath: string) {
  const relativePath = path.relative(publicRoot, filePath);
  const segments = relativePath.split(path.sep).map(encodeURIComponent);

  return `/${segments.join("/")}`;
}

function normalizeName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function naturalCompare(a: string, b: string) {
  return a.localeCompare(b, undefined, {
    numeric: true,
    sensitivity: "base",
  });
}
