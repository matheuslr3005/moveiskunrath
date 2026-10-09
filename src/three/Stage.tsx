import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { sharedMaterials } from "./materials";

type StageProps = {
  /** Profundidade (z) da parede dos fundos. */
  wallZ?: number;
  wall?: boolean;
  shadowSize?: number;
};

/** Piso escuro, parede quente, luzes de estúdio e sombra de contato. */
export const Stage = ({ wallZ = -0.3, wall = true, shadowSize = 14 }: StageProps) => (
  <>
    <color attach="background" args={["#100d0b"]} />
    <fog attach="fog" args={["#100d0b", 9, 24]} />

    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2]} material={sharedMaterials.floor} receiveShadow>
      <circleGeometry args={[11, 64]} />
    </mesh>
    {wall && (
      <mesh position={[0, 3, wallZ - 0.002]} material={sharedMaterials.wall} receiveShadow>
        <planeGeometry args={[18, 6]} />
      </mesh>
    )}
    <ContactShadows position={[0, 0.002, 0.8]} opacity={0.65} scale={shadowSize} blur={2.6} far={3.2} resolution={512} />

    <ambientLight intensity={0.42} color="#ffe9cf" />
    <directionalLight
      position={[3.5, 5.5, 4.5]}
      intensity={1.6}
      color="#fff0dc"
      castShadow
      shadow-mapSize={[1024, 1024]}
      shadow-camera-left={-5}
      shadow-camera-right={5}
      shadow-camera-top={5}
      shadow-camera-bottom={-3}
      shadow-bias={-0.0004}
    />
    <directionalLight position={[-4, 2.5, 3]} intensity={0.25} color="#a9c1ff" />

    <Environment resolution={256} frames={1} environmentIntensity={0.85}>
      <Lightformer form="rect" intensity={3} color="#ffe2b8" position={[0, 5, 2]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 2, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#9fb4ff" position={[-6, 2, 3]} rotation={[0, Math.PI / 2, 0]} scale={[6, 4, 1]} />
      <Lightformer form="rect" intensity={2.2} color="#ffd9a8" position={[0, 2.5, 9]} target={[0, 1.5, 0]} scale={[12, 5, 1]} />
      <Lightformer form="rect" intensity={1.4} color="#ffd9a8" position={[6, 2, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[6, 3, 1]} />
    </Environment>
  </>
);

/** Brilho do LED (bloom), tom de cinema e vinheta. */
export const Effects = () => (
  <EffectComposer multisampling={4}>
    <Bloom intensity={0.95} luminanceThreshold={0.9} luminanceSmoothing={0.25} mipmapBlur />
    <Vignette offset={0.25} darkness={0.75} />
    <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  </EffectComposer>
);
