"use client";

import { useGLTF, useTexture } from "@react-three/drei";
import { useMemo } from "react";
import type { ComponentProps } from "react";
import * as THREE from "three";

import { LABEL_TEXTURES, type CryoFlavorId } from "@/data/flavors";

const DRACO_PATH = "/draco/";

useGLTF.preload("/Soda-can.gltf", DRACO_PATH);

const metalMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.26,
  metalness: 1,
  color: "#cfd8de",
});

export type SodaCanProps = ComponentProps<"group"> & {
  flavor: CryoFlavorId;
  canScale?: number;
};

export function SodaCan({ flavor, canScale = 2, ...props }: SodaCanProps) {
  const { nodes, scene } = useGLTF("/Soda-can.gltf", DRACO_PATH);
  const label = usePreparedLabel(flavor);
  const { body, sleeve, tab } = useMemo(
    () => getCanMeshes(nodes, scene),
    [nodes, scene],
  );

  if (!body || !sleeve || !tab) return null;

  return (
    <group
      {...props}
      dispose={null}
      scale={canScale}
      rotation={[0, -Math.PI, 0]}
    >
      <mesh
        castShadow
        receiveShadow
        geometry={body.geometry}
        material={metalMaterial}
      />
      <mesh castShadow receiveShadow geometry={sleeve.geometry}>
        <meshStandardMaterial
          roughness={0.16}
          metalness={0.68}
          map={label}
          toneMapped={false}
        />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={tab.geometry}
        material={metalMaterial}
      />
    </group>
  );
}

function usePreparedLabel(flavor: CryoFlavorId) {
  const label = useTexture(LABEL_TEXTURES[flavor]);

  label.flipY = false;
  label.colorSpace = THREE.SRGBColorSpace;
  label.anisotropy = 8;
  label.wrapS = THREE.RepeatWrapping;
  label.wrapT = THREE.ClampToEdgeWrapping;

  return label;
}

function getCanMeshes(
  nodes: Record<string, THREE.Object3D>,
  scene: THREE.Group,
) {
  const directBody = nodes.cylinder as THREE.Mesh | undefined;
  const directSleeve = nodes.cylinder_1 as THREE.Mesh | undefined;
  const directTab = nodes.Tab as THREE.Mesh | undefined;

  if (directBody?.isMesh && directSleeve?.isMesh && directTab?.isMesh) {
    return {
      body: directBody,
      sleeve: directSleeve,
      tab: directTab,
    };
  }

  const meshes: THREE.Mesh[] = [];
  scene.traverse((object) => {
    if ((object as THREE.Mesh).isMesh) {
      meshes.push(object as THREE.Mesh);
    }
  });

  const tab =
    directTab ??
    meshes.find((mesh) => /tab/i.test(`${mesh.name} ${mesh.parent?.name}`));
  const canMeshes = meshes.filter((mesh) => mesh !== tab);

  return {
    body:
      directBody ??
      canMeshes.find((mesh) => mesh.name === "cylinder") ??
      canMeshes[0],
    sleeve:
      directSleeve ??
      canMeshes.find((mesh) => mesh.name === "cylinder_1") ??
      canMeshes[1],
    tab,
  };
}
