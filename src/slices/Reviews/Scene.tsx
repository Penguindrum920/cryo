"use client";

import { Environment, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

import {
  NimbusKeyboard,
  type NimbusKeyboardRefs,
} from "@/components/NimbusKeyboard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const KEYBOARD_COLUMNS = [
  ["esc", "grave", "tab", "caps", "lshift", "lcontrol"],
  ["f1", "one", "q", "a", "z", "lalt"],
  ["f2", "two", "w", "s", "x", "lwin"],
  ["f3", "three", "e", "d", "c"],
  ["f4", "four", "r", "f", "v"],
  ["f5", "five", "t", "g", "b", "space"],
  ["f6", "six", "y", "h", "n"],
  ["f7", "seven", "u", "j", "m"],
  ["f8", "eight", "i", "k", "comma"],
  ["f9", "nine", "o", "l", "period"],
  ["f10", "zero", "dash", "p", "semicolon", "slash", "ralt"],
  [
    "f11",
    "lsquarebracket",
    "quote",
    "rshift",
    "fn",
    "arrowleft",
    "rsquarebracket",
    "enter",
    "f12",
    "equal",
    "arrowup",
  ],
  [],
  [
    "del",
    "backspace",
    "backslash",
    "pagedown",
    "end",
    "arrowdown",
    "pageup",
    "arrowright",
  ],
  [],
];

function CameraController() {
  const { camera, size } = useThree();
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const reducedMotionRef = useRef(false);
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const currentPositionRef = useRef(new THREE.Vector3(0, 0, 4));
  const baseCameraPosition = useMemo(
    () => ({
      x: 0,
      y: 0,
      z: 4,
    }),
    [],
  );

  useFrame(() => {
    if (reducedMotionRef.current) {
      camera.position.set(
        baseCameraPosition.x,
        baseCameraPosition.y,
        baseCameraPosition.z,
      );
      camera.lookAt(targetRef.current);
      return;
    }

    const mouse = mouseRef.current;
    const tiltX = (mouse.y - 0.5) * 0.3;
    const tiltY = (mouse.x - 0.5) * 0.3;
    const targetPosition = new THREE.Vector3(
      baseCameraPosition.x + tiltY,
      baseCameraPosition.y - tiltX,
      baseCameraPosition.z,
    );

    currentPositionRef.current.lerp(targetPosition, 0.1);
    camera.position.copy(currentPositionRef.current);
    camera.lookAt(targetRef.current);
  });

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    reducedMotionRef.current = prefersReducedMotion.matches;

    const handleMotionPreference = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = event.clientX / size.width;
      mouseRef.current.y = event.clientY / size.height;
    };

    prefersReducedMotion.addEventListener("change", handleMotionPreference);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      prefersReducedMotion.removeEventListener(
        "change",
        handleMotionPreference,
      );
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [size.height, size.width]);

  return null;
}

export function ReviewsKeyboardScene() {
  const keyboardGroupRef = useRef<THREE.Group>(null);
  const keyboardAnimationRef = useRef<NimbusKeyboardRefs>(null);
  const { size } = useThree();
  const scalingFactor = size.width <= 500 ? 0.68 : 0.96;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const keyboard = keyboardGroupRef.current;
        const keyboardRefs = keyboardAnimationRef.current;
        if (!keyboard || !keyboardRefs) return;

        gsap.set(keyboard.position, {
          x: 0.2,
          y: -0.5,
          z: 1.9,
        });
        gsap.set(keyboard.rotation, {
          x: 1.6,
          y: 0.4,
          z: 0,
        });

        const scrollTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: ".reviews-section",
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
          },
        });

        scrollTimeline
          .to(keyboard.position, {
            x: 0,
            y: -0.5,
            z: 2.2,
          })
          .to(
            keyboard.rotation,
            {
              x: Math.PI * -2 + 0.8,
              y: 0,
              z: 0,
            },
            "<",
          );

        addNimbusKeyWave(scrollTimeline, keyboardRefs);

        scrollTimeline.to({}, { duration: 0.72 }, 1.76);
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const keyboard = keyboardGroupRef.current;
        if (!keyboard) return;

        keyboard.position.set(0, -0.5, 1.9);
        keyboard.rotation.set(1.6, 0.4, 0);
      });

      return () => mm.revert();
    },
    { dependencies: [] },
  );

  return (
    <>
      <CameraController />
      <PerspectiveCamera makeDefault position={[0, 0, 4]} fov={50} />

      <group scale={scalingFactor}>
        <group ref={keyboardGroupRef}>
          <NimbusKeyboard scale={9} ref={keyboardAnimationRef} />
        </group>
      </group>

      <Environment
        files={["/nimbus/hdr/blue-studio.hdr"]}
        environmentIntensity={0.3}
      />

      <spotLight
        position={[-2, 1.5, 3]}
        intensity={44}
        castShadow
        penumbra={0}
        shadow-bias={-0.0002}
        shadow-normalBias={0.002}
        shadow-mapSize={1024}
      />
    </>
  );
}

function addNimbusKeyWave(
  scrollTimeline: gsap.core.Timeline,
  keyboardRefs: NimbusKeyboardRefs,
) {
  const switchRefs = keyboardRefs.switches;
  const individualKeys = keyboardRefs.keys;
  const allSwitches: THREE.Object3D[] = [];

  [
    switchRefs.functionRow.current,
    switchRefs.numberRow.current,
    switchRefs.topRow.current,
    switchRefs.homeRow.current,
    switchRefs.bottomRow.current,
    switchRefs.modifiers.current,
    switchRefs.arrows.current,
  ].forEach((row) => {
    if (row) {
      allSwitches.push(...Array.from(row.children));
    }
  });

  const keyCapsByColumn: THREE.Mesh[][] = [];
  const switchesByColumn: THREE.Object3D[][] = [];
  const sortedSwitches = allSwitches.sort(
    (a, b) => a.position.x - b.position.x,
  );

  KEYBOARD_COLUMNS.forEach((column, columnIndex) => {
    const columnKeycaps: THREE.Mesh[] = [];
    const columnSwitches: THREE.Object3D[] = [];

    column.forEach((keyName) => {
      const keycap = keyName ? individualKeys[keyName]?.current : null;
      if (keycap) {
        columnKeycaps.push(keycap);
      }
    });

    const switchesPerColumn = Math.ceil(
      sortedSwitches.length / KEYBOARD_COLUMNS.length,
    );
    const startIndex = columnIndex * switchesPerColumn;
    const endIndex = Math.min(
      startIndex + switchesPerColumn,
      sortedSwitches.length,
    );

    for (let i = startIndex; i < endIndex; i += 1) {
      if (sortedSwitches[i]) {
        columnSwitches.push(sortedSwitches[i]);
      }
    }

    keyCapsByColumn.push(columnKeycaps);
    switchesByColumn.push(columnSwitches);
  });

  keyCapsByColumn.forEach((columnKeycaps, columnIndex) => {
    const columnSwitches = switchesByColumn[columnIndex];

    if (columnKeycaps.length === 0 && columnSwitches.length === 0) return;

    const waveProgress = columnIndex / (KEYBOARD_COLUMNS.length - 1);
    const waveStartTime = waveProgress * 1.08 + 0.18;

    if (columnKeycaps.length > 0) {
      const keycapPositions = columnKeycaps.map((keycap) => keycap.position);

      scrollTimeline.to(
        keycapPositions,
        {
          y: "+=0.08",
          duration: 0.29,
          ease: "power2.inOut",
        },
        waveStartTime,
      );

      scrollTimeline.to(
        keycapPositions,
        {
          y: "-=0.08",
          duration: 0.5,
          ease: "power2.inOut",
        },
        waveStartTime + 0.29,
      );
    }

    if (columnSwitches.length > 0) {
      const switchPositions = columnSwitches.map(
        (switchObj) => switchObj.position,
      );

      scrollTimeline.to(
        switchPositions,
        {
          y: "+=0.04",
          duration: 0.2,
          ease: "power2.inOut",
        },
        waveStartTime + 0.12,
      );

      scrollTimeline.to(
        switchPositions,
        {
          y: "-=0.04",
          duration: 0.2,
          ease: "power2.inOut",
        },
        waveStartTime + 0.29,
      );
    }
  });
}
