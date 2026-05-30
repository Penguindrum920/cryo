"use client";

import {
  ContactShadows,
  Environment,
  OrbitControls,
  PerspectiveCamera,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import { SodaCan } from "@/components/SodaCan";
import type { CryoFlavor } from "@/data/flavors";

type DesktopShowcaseProps = {
  flavor: CryoFlavor;
};

export function DesktopShowcase({ flavor }: DesktopShowcaseProps) {
  const canRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!canRef.current) return;
    canRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.18;
  });

  return (
    <>
      <color attach="background" args={["#0b0f14"]} />
      <fog attach="fog" args={["#0b0f14", 6, 13]} />
      <PerspectiveCamera makeDefault position={[0, 1.05, 4.6]} fov={36} />
      <OrbitControls
        enableDamping
        enablePan={false}
        maxDistance={6}
        maxPolarAngle={Math.PI / 2.05}
        minDistance={2.5}
        target={[0, -0.1, 0]}
      />

      <ambientLight intensity={1.3} color={flavor.colors.secondary} />
      <spotLight
        castShadow
        color={flavor.colors.secondary}
        intensity={58}
        penumbra={0.68}
        position={[-3.5, 4, 4.5]}
      />
      <pointLight
        color={flavor.colors.primary}
        intensity={24}
        position={[2.4, 0.65, 2.2]}
      />
      <pointLight
        color={flavor.colors.secondary}
        intensity={12}
        position={[-2.2, -0.35, 1.5]}
      />

      <Atmosphere flavor={flavor} />

      <group>
        <mesh receiveShadow position={[0, -0.84, 0]}>
          <boxGeometry args={[5.6, 0.16, 4.25]} />
          <meshStandardMaterial
            color="#11161b"
            metalness={0.06}
            roughness={0.64}
          />
        </mesh>
        <mesh position={[0, -0.752, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.72, 2.96, 96]} />
          <meshBasicMaterial
            color={flavor.colors.primary}
            opacity={0.1}
            transparent
          />
        </mesh>
        <mesh position={[0, -0.75, -1.16]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.4, 0.012]} />
          <meshBasicMaterial
            color={flavor.colors.secondary}
            opacity={0.18}
            transparent
          />
        </mesh>
        <mesh position={[0, -0.749, 1.12]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[4.1, 0.012]} />
          <meshBasicMaterial
            color={flavor.colors.primary}
            opacity={0.12}
            transparent
          />
        </mesh>
        <FlavorRings flavor={flavor} />
        <CondensationField flavor={flavor} />

        <group ref={canRef} position={[0, -0.18, 0]} rotation={[0.04, 0, -0.04]}>
          <SodaCan flavor={flavor.id} canScale={1.58} />
        </group>

        <ContactShadows
          blur={2.6}
          far={4}
          opacity={0.45}
          position={[0, -0.735, 0]}
          resolution={1024}
          scale={5}
        />
      </group>

      <Environment files="/hdr/lobby.hdr" environmentIntensity={1.2} />
    </>
  );
}

type FlavorRingsProps = {
  flavor: CryoFlavor;
};

function FlavorRings({ flavor }: FlavorRingsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = -clock.elapsedTime * 0.12;
  });

  return (
    <group ref={groupRef} position={[0, -0.21, 0]}>
      <mesh rotation={[Math.PI / 2.35, 0, 0.22]}>
        <torusGeometry args={[0.86, 0.006, 8, 128]} />
        <meshBasicMaterial
          color={flavor.colors.primary}
          opacity={0.34}
          transparent
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.18, 0, -0.32]}>
        <torusGeometry args={[1.04, 0.004, 8, 128]} />
        <meshBasicMaterial
          color={flavor.colors.secondary}
          opacity={0.22}
          transparent
        />
      </mesh>
    </group>
  );
}

type CondensationFieldProps = {
  flavor: CryoFlavor;
};

function CondensationField({ flavor }: CondensationFieldProps) {
  const droplets = useMemo(() => {
    const seed = hashString(`${flavor.id}-droplets`);

    return Array.from({ length: 18 }, (_, index) => {
      const angle = index * 2.399963 + seed * 0.000013;
      const radius = 0.42 + ((index * 23) % 100) / 260;

      return {
        position: [
          Math.cos(angle) * radius,
          -0.746,
          Math.sin(angle) * radius * 0.72,
        ] as [number, number, number],
        scale: 0.012 + ((index * 11) % 10) * 0.002,
      };
    });
  }, [flavor.id]);

  return (
    <group>
      {droplets.map((droplet, index) => (
        <mesh key={index} position={droplet.position} scale={droplet.scale}>
          <sphereGeometry args={[1, 12, 8]} />
          <meshPhysicalMaterial
            color="#dff7ff"
            metalness={0}
            opacity={0.48}
            roughness={0.08}
            transmission={0.35}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

type AtmosphereProps = {
  flavor: CryoFlavor;
};

function Atmosphere({ flavor }: AtmosphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const particleColor = new THREE.Color(flavor.colors.secondary);
  const accentColor = new THREE.Color(flavor.colors.primary);
  const positions = useMemo(() => {
    const values = new Float32Array(90 * 3);
    const seed = hashString(flavor.id);

    for (let index = 0; index < 90; index += 1) {
      const angle = index * 2.399963 + seed * 0.00001;
      const radius = 1.05 + ((index * 37) % 100) / 80;
      values[index * 3] = Math.cos(angle) * radius;
      values[index * 3 + 1] = -0.48 + ((index * 17) % 100) / 74;
      values[index * 3 + 2] = Math.sin(angle) * radius * 0.72;
    }

    return values;
  }, [flavor.id]);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = clock.elapsedTime * 0.045;
    pointsRef.current.position.y = Math.sin(clock.elapsedTime * 0.55) * 0.025;
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={positions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={particleColor}
          depthWrite={false}
          opacity={getParticleOpacity(flavor.id)}
          size={getParticleSize(flavor.id)}
          transparent
        />
      </points>
      <mesh position={[0, -0.72, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[2.2, 96]} />
        <meshBasicMaterial
          color={accentColor}
          opacity={getGlowOpacity(flavor.id)}
          transparent
        />
      </mesh>
    </>
  );
}

function getParticleOpacity(flavorId: CryoFlavor["id"]) {
  if (flavorId === "velvetFrost") return 0.24;
  if (flavorId === "frostbiteBerry") return 0.34;
  return 0.28;
}

function getParticleSize(flavorId: CryoFlavor["id"]) {
  if (flavorId === "neonMeltdown") return 0.028;
  if (flavorId === "cosmicCrush") return 0.024;
  return 0.02;
}

function getGlowOpacity(flavorId: CryoFlavor["id"]) {
  if (flavorId === "midnightCitrus") return 0.13;
  if (flavorId === "velvetFrost") return 0.11;
  return 0.16;
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}
