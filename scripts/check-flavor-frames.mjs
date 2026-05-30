import { existsSync, readdirSync } from "node:fs";
import path from "node:path";

const publicRoot = path.join(process.cwd(), "public");
const frameRoot = path.join(publicRoot, "flavour-frames");
const videoRoot = path.join(publicRoot, "flavour-videos");
const expectedFolders = [
  ["Frostbite Berry frames", "frostbite-berry.mp4"],
  ["Neon Meltdown frames", "neon-meltdown.mp4"],
  ["Cosmic Crush frames", "cosmic-crush.mp4"],
  ["Midnight Citrus frames", "midnight-citrus.mp4"],
  ["Velvet Frost frames", "velvet-frost.mp4"],
];
const extensions = new Set([".jpg", ".jpeg", ".png", ".webp"]);

let failed = false;

for (const [folder, video] of expectedFolders) {
  const folderPath = path.join(frameRoot, folder);
  const videoPath = path.join(videoRoot, video);
  const frames = existsSync(folderPath)
    ? readdirSync(folderPath)
        .filter((name) => extensions.has(path.extname(name).toLowerCase()))
        .sort((a, b) =>
          a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
          }),
        )
    : [];

  const hasVideo = existsSync(videoPath);
  const status = frames.length && hasVideo ? "ok" : "missing";
  console.log(
    `${status.padEnd(7)} ${folder}: ${frames.length} frames, video=${hasVideo ? video : "missing"}`,
  );

  if (frames.length) {
    console.log(`        first=${frames[0]} last=${frames.at(-1)}`);
  }

  if (!frames.length || !hasVideo) {
    failed = true;
  }
}

if (failed) {
  console.error(
    "\nAdd each exported JPG sequence under public/flavour-frames/<Flavor Name> frames/ and matching MP4 under public/flavour-videos/<flavor-slug>.mp4",
  );
  process.exit(1);
}
