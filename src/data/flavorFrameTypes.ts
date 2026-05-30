import type { CryoFlavorId } from "@/data/flavors";

export type FlavorFrameSequence = {
  flavorId: CryoFlavorId;
  framePaths: string[];
  frameCount: number;
  frameRate: number;
  videoPath?: string;
  expectedFolder: string;
  discoveredFolder?: string;
};
