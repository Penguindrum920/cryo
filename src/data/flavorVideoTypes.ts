import type { CryoFlavorId } from "@/data/flavors";

export type FlavorVideoSequence = {
  flavorId: CryoFlavorId;
  videoPath?: string;
  expectedVideoPath: string;
};
