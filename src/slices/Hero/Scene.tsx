"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import { SodaCan } from "@/components/SodaCan";
import { Bubbles } from "@/slices/Hero/Bubbles";
import { CRYO_FLAVORS, getFlavorById, type CryoFlavorId } from "@/data/flavors";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STARTING_ROTATIONS = [-0.5, 0.5, -0.1, 0.35, -0.25] as const;
const ENDING_ROTATIONS = [0.3, 0, -0.1, 0.3, -0.25] as const;

function toVectorTuple(
  value: readonly [number, number, number],
): [number, number, number] {
  return [value[0], value[1], value[2]];
}

type SceneProps = {
  activeFlavorId: CryoFlavorId;
  compact: boolean;
  onIntroComplete?: () => void;
};

export function Scene({
  activeFlavorId,
  compact,
  onIntroComplete,
}: SceneProps) {
  const rootRef = useRef<THREE.Group>(null);
  const cansGroupRef = useRef<THREE.Group>(null);
  const canRefs = useRef<Array<THREE.Group | null>>([]);
  const entranceRefs = useRef<Array<THREE.Group | null>>([]);
  const { viewport } = useThree();
  const activeFlavor = getFlavorById(activeFlavorId);

  const entranceIntroStates = useMemo(() => {
    if (compact) {
      return [
        {
          position: [0.85, -4.85, 0] as const,
          rotation: [0, 0, 3] as const,
        },
        {
          position: [0.85, 4.85, 0] as const,
          rotation: [0, 0, 3] as const,
        },
      ] as const;
    }

    return [
      {
        position: [1, -5, 0] as const,
        rotation: [0, 0, 3] as const,
      },
      {
        position: [1, 5, 0] as const,
        rotation: [0, 0, 3] as const,
      },
    ] as const;
  }, [compact]);

  const basePosition = useMemo(
    () => ({
      x: 0,
      y: compact ? 0.12 : -0.02,
    }),
    [compact],
  );

  const startingPositions = useMemo(() => {
    if (compact) {
      return [
        [-1.05, -1.18, 0.16],
        [1.05, -1.04, 0.08],
        [0, 8.7, 2],
        [1.85, 8.2, 2],
        [0, -8.8, 1],
      ] as const;
    }

    return [
      [-3.45, -0.32, 0.16],
      [3.45, -0.16, 0.08],
      [0, 8.2, 2],
      [2.35, 7.7, 2],
      [0, -8.4, 1],
    ] as const;
  }, [compact]);

  const endingPositions = useMemo(() => {
    if (compact) {
      return [
        [-0.18, -0.62, -2],
        [0.72, -0.16, -1],
        [-0.26, 0.42, -1],
        [0.04, -0.25, 0.45],
        [0.28, 0.44, -0.5],
      ] as const;
    }

    return [
      [-0.2, -0.7, -2],
      [1, -0.2, -1],
      [-0.3, 0.5, -1],
      [0, -0.3, 0.5],
      [0.3, 0.5, -0.5],
    ] as const;
  }, [compact]);

  useGSAP(
    () => {
      const cans = canRefs.current.filter(Boolean) as THREE.Group[];
      const entrances = entranceRefs.current.filter(Boolean) as THREE.Group[];
      if (
        !rootRef.current ||
        !cansGroupRef.current ||
        cans.length !== CRYO_FLAVORS.length ||
        entrances.length < 2
      ) {
        return;
      }

      gsap.set(rootRef.current.position, {
        x: basePosition.x,
        y: basePosition.y,
      });
      gsap.set(rootRef.current.rotation, { y: compact ? -0.03 : -0.08 });
      gsap.set(cansGroupRef.current.position, { x: 0, y: 0, z: 0 });
      gsap.set(cansGroupRef.current.rotation, { x: 0, y: 0, z: 0 });
      gsap.set(
        entrances.slice(0, 2).map((entry) => entry.position),
        {
          x: 0,
          y: 0,
          z: 0,
        },
      );
      gsap.set(
        entrances.slice(0, 2).map((entry) => entry.rotation),
        {
          x: 0,
          y: 0,
          z: 0,
        },
      );
      gsap.set(
        entrances.map((entry) => entry.scale),
        { x: 1, y: 1, z: 1 },
      );

      cans.forEach((can, index) => {
        gsap.set(can.position, {
          x: startingPositions[index][0],
          y: startingPositions[index][1],
          z: startingPositions[index][2],
        });
        gsap.set(can.rotation, {
          x: 0,
          y: 0,
          z: STARTING_ROTATIONS[index],
        });
      });

      if (window.scrollY < 20) {
        const intro = gsap.timeline({
          defaults: { duration: compact ? 2.25 : 2.75, ease: "back.out(1.4)" },
          onComplete: onIntroComplete,
        });

        entrances.slice(0, 2).forEach((entry, index) => {
          const introState = entranceIntroStates[index];
          const startAt = index * 0.08;

          intro
            .fromTo(
              entry.position,
              {
                x: introState.position[0],
                y: introState.position[1],
                z: introState.position[2],
              },
              { x: 0, y: 0, z: 0 },
              startAt,
            )
            .fromTo(
              entry.rotation,
              {
                x: introState.rotation[0],
                y: introState.rotation[1],
                z: introState.rotation[2],
              },
              { x: 0, y: 0, z: 0 },
              startAt,
            )
            .fromTo(
              entry.scale,
              { x: 0.62, y: 0.62, z: 0.62 },
              { x: 1, y: 1, z: 1 },
              startAt,
            );
        });
      } else {
        onIntroComplete?.();
      }

      const tl = gsap.timeline({
        defaults: { duration: 1.08, ease: "none" },
        scrollTrigger: {
          trigger: ".cryo-hero-section",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.15,
        },
      });

      tl.to(cansGroupRef.current.rotation, { y: Math.PI * 2 }, 0);

      cans.forEach((can, index) => {
        tl.to(
          can.position,
          {
            x: endingPositions[index][0],
            y: endingPositions[index][1],
            z: endingPositions[index][2],
          },
          0,
        ).to(
          can.rotation,
          {
            x: 0,
            y: 0,
            z: ENDING_ROTATIONS[index],
          },
          0,
        );
      });

      tl.to(
        cansGroupRef.current.position,
        {
          x: compact ? 0.12 : 1.28,
          duration: 0.75,
          ease: "sine.inOut",
        },
        1.18,
      );
    },
    {
      dependencies: [
        basePosition,
        compact,
        endingPositions,
        entranceIntroStates,
        onIntroComplete,
        startingPositions,
      ],
    },
  );

  useEffect(() => {
    entranceRefs.current.forEach((entry, index) => {
      if (!entry) return;
      const flavor = CRYO_FLAVORS[index];
      const isActive = flavor.id === activeFlavorId;

      gsap.to(entry.scale, {
        x: isActive ? 1.14 : 1,
        y: isActive ? 1.14 : 1,
        z: isActive ? 1.14 : 1,
        duration: 0.55,
        ease: "power2.out",
      });
    });
  }, [activeFlavorId]);

  useFrame(({ clock }) => {
    if (!rootRef.current) return;

    rootRef.current.position.x = basePosition.x;
    rootRef.current.position.y =
      basePosition.y + Math.sin(clock.elapsedTime * 0.72) * 0.04;
  });

  const scale = Math.min(
    viewport.width / (compact ? 5.2 : 8.9),
    compact ? 0.78 : 0.88,
  );

  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[0, compact ? 0.4 : 0.12, compact ? 7.4 : 6.8]}
        fov={compact ? 36 : 32}
      />

      <ambientLight intensity={2.2} color={activeFlavor.colors.secondary} />
      <spotLight
        position={[-4, 4, 5]}
        intensity={30}
        color={activeFlavor.colors.secondary}
        penumbra={0.72}
        castShadow
      />
      <pointLight
        position={[3, -1, 3]}
        intensity={16}
        color={activeFlavor.colors.primary}
      />

      <Bubbles color={activeFlavor.colors.primary} count={compact ? 90 : 150} />

      <group ref={rootRef} scale={scale}>
        <group ref={cansGroupRef}>
          {CRYO_FLAVORS.map((flavor, index) => (
            <group
              key={flavor.id}
              ref={(node) => {
                entranceRefs.current[index] = node;
              }}
              position={
                index < 2
                  ? toVectorTuple(entranceIntroStates[index].position)
                  : [0, 0, 0]
              }
              rotation={
                index < 2
                  ? toVectorTuple(entranceIntroStates[index].rotation)
                  : [0, 0, 0]
              }
              scale={index < 2 ? 0.62 : 1}
            >
              <group
                ref={(node) => {
                  canRefs.current[index] = node;
                }}
                position={toVectorTuple(startingPositions[index])}
                rotation={[0, 0, STARTING_ROTATIONS[index]]}
              >
                <SodaCan flavor={flavor.id} canScale={compact ? 2.08 : 2.55} />
              </group>
            </group>
          ))}
        </group>
      </group>

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.25} />
    </>
  );
}
