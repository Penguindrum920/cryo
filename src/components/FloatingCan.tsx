"use client";

import { Float } from "@react-three/drei";
import { forwardRef, type ReactNode } from "react";
import { Group } from "three";

import { SodaCan } from "@/components/SodaCan";
import type { CryoFlavorId } from "@/data/flavors";

type FloatingCanProps = React.ComponentProps<"group"> & {
  flavor: CryoFlavorId;
  canScale?: number;
  floatSpeed?: number;
  rotationIntensity?: number;
  floatIntensity?: number;
  floatingRange?: [number, number];
  children?: ReactNode;
};

const FloatingCan = forwardRef<Group, FloatingCanProps>(
  (
    {
      flavor,
      canScale = 2,
      floatSpeed = 1.45,
      rotationIntensity = 0.65,
      floatIntensity = 0.55,
      floatingRange = [-0.08, 0.08],
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <group ref={ref} {...props}>
        <Float
          speed={floatSpeed}
          rotationIntensity={rotationIntensity}
          floatIntensity={floatIntensity}
          floatingRange={floatingRange}
        >
          {children}
          <SodaCan flavor={flavor} canScale={canScale} />
        </Float>
      </group>
    );
  },
);

FloatingCan.displayName = "FloatingCan";

export default FloatingCan;
