import { Sparkles } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { HeroScene } from "../components/HeroScene";
import { usePrefersReducedMotion } from "../lib/hooks";
import type { FurnitureConfig } from "./config";
import { Furniture } from "./Furniture";
import { useOpenState } from "./openState";
import { SceneCanvas } from "./SceneCanvas";
import { Stage } from "./Stage";

const HERO_CONFIG: FurnitureConfig = { kind: "cozinha", widthCm: 420, finish: "nogueira", handle: "embutido", led: true };

/** A câmera segue o mouse, faz um "dolly" de entrada e se afasta conforme a página rola. */
const HeroRig = ({ reducedMotion }: { reducedMotion: boolean }) => {
  const intro = useRef(reducedMotion ? 1 : 0);
  const goal = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const { size } = useThree();

  useFrame((state, delta) => {
    intro.current = THREE.MathUtils.damp(intro.current, 1, 1.1, delta);
    const aspect = size.width / size.height;
    const fit = aspect < 1.1 ? 1 + (1.1 - aspect) * 1.15 : 1;
    const scroll = Math.min(window.scrollY / window.innerHeight, 1);
    const swing = reducedMotion ? 0 : 1;
    const away = 1 - intro.current;

    goal.set(
      (3.1 + state.pointer.x * 1.1 * swing + away * 2.8) * fit,
      1.75 + state.pointer.y * 0.35 * swing + scroll * 0.4 + away * 0.6,
      (6.7 + scroll * 1.6 + away * 3) * fit,
    );
    state.camera.position.lerp(goal, 1 - Math.exp(-delta * 3.2));
    look.set(0.15, 1.15 + scroll * 0.15, 0.7);
    state.camera.lookAt(look);
  });

  return null;
};

export const Hero3D = () => {
  const open = useOpenState();
  const reducedMotion = usePrefersReducedMotion();

  return (
    <SceneCanvas
      className="absolute inset-0"
      camera={{ position: [6, 2.3, 10], fov: 36 }}
      fallback={<HeroScene />}
      label="Cozinha sob medida em 3D. Clique nas portas e gavetas para abrir."
    >
      <Stage />
      <Furniture config={HERO_CONFIG} open={open} />
      {!reducedMotion && (
        <Sparkles count={70} scale={[9, 4, 7]} position={[0, 2, 1.5]} size={2.2} speed={0.25} opacity={0.55} color="#ffd98a" />
      )}
      <HeroRig reducedMotion={reducedMotion} />
    </SceneCanvas>
  );
};
