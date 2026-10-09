import { OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type ComponentRef } from "react";
import * as THREE from "three";
import { HeroScene } from "../components/HeroScene";
import type { FurnitureConfig, FurnitureKind } from "./config";
import { Furniture, wallZFor } from "./Furniture";
import type { OpenState } from "./openState";
import type { V3 } from "./parts";
import { SceneCanvas } from "./SceneCanvas";
import { Stage } from "./Stage";

type CameraPreset = { position: V3; target: V3 };

const presets: Record<FurnitureKind, CameraPreset> = {
  cozinha: { position: [3.6, 2.0, 6.6], target: [0.1, 1.0, 0.9] },
  "guarda-roupa": { position: [3.0, 1.8, 5.4], target: [0, 1.2, 0] },
  "painel-tv": { position: [2.6, 1.7, 5.2], target: [0, 1.2, 0] },
  banheiro: { position: [1.9, 1.5, 3.9], target: [0.1, 1.15, 0] },
};

/** Ao trocar de móvel a câmera voa até o enquadramento; arrastar assume o controle. */
const CameraRig = ({ kind }: { kind: FurnitureKind }) => {
  const controls = useRef<ComponentRef<typeof OrbitControls>>(null);
  const { camera, gl, size } = useThree();
  const goalPosition = useMemo(() => new THREE.Vector3(), []);
  const goalTarget = useMemo(() => new THREE.Vector3(), []);
  const moving = useRef(true);

  useEffect(() => {
    // em telas largas o painel cobre a esquerda: empurra a cena para a direita
    if (!(camera instanceof THREE.PerspectiveCamera)) return;
    if (size.width >= 1024) camera.setViewOffset(size.width, size.height, -size.width * 0.13, 0, size.width, size.height);
    else camera.clearViewOffset();
    return () => camera.clearViewOffset();
  }, [camera, size.width, size.height]);

  useEffect(() => {
    // o OrbitControls trava o scroll vertical no celular; devolvemos o gesto de rolar a página
    gl.domElement.style.touchAction = "pan-y";
  }, [gl]);

  const aspect = size.width / size.height;
  const fit = aspect < 1.1 ? 1 + (1.1 - aspect) * 0.95 : 1;

  useEffect(() => {
    const preset = presets[kind];
    goalTarget.set(...preset.target);
    goalPosition.set(...preset.position).sub(goalTarget).multiplyScalar(fit).add(goalTarget);
    moving.current = true;
  }, [kind, fit, goalPosition, goalTarget]);

  useFrame((_, delta) => {
    const orbit = controls.current;
    if (!orbit || !moving.current) return;
    const step = 1 - Math.exp(-delta * 3.4);
    camera.position.lerp(goalPosition, step);
    orbit.target.lerp(goalTarget, step);
    orbit.update();
    if (camera.position.distanceTo(goalPosition) < 0.015) moving.current = false;
  });

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping
      dampingFactor={0.07}
      minPolarAngle={0.55}
      maxPolarAngle={Math.PI / 2.02}
      minAzimuthAngle={-1.1}
      maxAzimuthAngle={1.1}
      onStart={() => {
        moving.current = false;
      }}
    />
  );
};

type ConfiguratorSceneProps = {
  config: FurnitureConfig;
  open: Pick<OpenState, "isOpen" | "toggle">;
  className?: string;
};

export const ConfiguratorScene = ({ config, open, className }: ConfiguratorSceneProps) => (
  <SceneCanvas
    className={className}
    camera={{ position: [3.6, 2.0, 6.6], fov: 38 }}
    fallback={<HeroScene />}
    label={`${config.kind} em 3D: arraste para girar e clique nas portas para abrir`}
  >
    <Stage wallZ={wallZFor(config.kind)} />
    <Furniture key={config.kind} config={config} open={open} />
    <CameraRig kind={config.kind} />
  </SceneCanvas>
);
