"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";

const object = new THREE.Object3D();

type BubblesProps = {
  color: string;
  count?: number;
  speed?: number;
};

export function Bubbles({ color, count = 180, speed = 1.4 }: BubblesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const velocities = useRef(new Float32Array(count));
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        transparent: true,
        opacity: 0.36,
        roughness: 0.2,
        metalness: 0.1,
      }),
    [color],
  );

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      object.position.set(
        gsap.utils.random(-5, 5),
        gsap.utils.random(-3.4, 3.8),
        gsap.utils.random(-2.5, 3.5),
      );
      object.scale.setScalar(gsap.utils.random(0.4, 1.25));
      object.updateMatrix();
      mesh.setMatrixAt(i, object.matrix);
      velocities.current[i] = gsap.utils.random(speed * 0.004, speed * 0.012);
    }

    mesh.instanceMatrix.needsUpdate = true;
  }, [count, speed]);

  useEffect(() => {
    material.color = new THREE.Color(color);
  }, [color, material]);

  useFrame(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    for (let i = 0; i < count; i++) {
      mesh.getMatrixAt(i, object.matrix);
      object.position.setFromMatrixPosition(object.matrix);
      object.position.y += velocities.current[i];

      if (object.position.y > 4) {
        object.position.y = -3.2;
        object.position.x = gsap.utils.random(-5, 5);
      }

      object.updateMatrix();
      mesh.setMatrixAt(i, object.matrix);
    }

    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} material={material}>
      <sphereGeometry args={[0.032, 12, 12]} />
    </instancedMesh>
  );
}
