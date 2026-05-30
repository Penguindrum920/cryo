import { existsSync } from "node:fs";
import path from "node:path";

import type { CryoFlavor } from "@/data/flavors";
import type { FlavorVideoSequence } from "@/data/flavorVideoTypes";

export function getFlavorVideoSequence(
  flavor: CryoFlavor,
): FlavorVideoSequence {
  const publicRoot = path.join(process.cwd(), "public");
  const expectedVideoPath = `/flavour-videos/${flavor.slug}.mp4`;
  const diskPath = path.join(
    publicRoot,
    "flavour-videos",
    `${flavor.slug}.mp4`,
  );

  return {
    flavorId: flavor.id,
    videoPath: existsSync(diskPath) ? expectedVideoPath : undefined,
    expectedVideoPath,
  };
}
