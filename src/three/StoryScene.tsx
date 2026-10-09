import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef, useState, type MutableRefObject } from "react";
import * as THREE from "three";
import { HeroScene } from "../components/HeroScene";
import { getBodyMaterial, LED_COLOR, sharedMaterials } from "./materials";
import { Glow, Led, LedLight, type V3 } from "./parts";
import { SceneCanvas } from "./SceneCanvas";
import { Stage } from "./Stage";
import { explodeAt, finishIndexAt, smooth, solidAt, STEP_COUNT, storyFinishes } from "./story";

const W = 1.2;
const H = 1.9;
const D = 0.5;
const T = 0.02;
const BASE = 0.1;

type Tone = "body" | "interior" | "dark";
type PartSpec = { key: string; size: V3; home: V3; explode: V3; tone: Tone };

const bodyH = H - BASE;
const parts: PartSpec[] = [
  { key: "left", size: [T, bodyH, D], home: [-W / 2 + T / 2, BASE + bodyH / 2, 0], explode: [-1.15, 0, 0], tone: "body" },
  { key: "right", size: [T, bodyH, D], home: [W / 2 - T / 2, BASE + bodyH / 2, 0], explode: [1.15, 0, 0], tone: "body" },
  { key: "top", size: [W - 2 * T, T, D], home: [0, H - T / 2, 0], explode: [0, 1.0, 0], tone: "body" },
  { key: "bottom", size: [W - 2 * T, T, D], home: [0, BASE + T / 2, 0], explode: [0, -0.35, 0], tone: "body" },
  { key: "back", size: [W - 2 * T, bodyH - 2 * T, 0.01], home: [0, BASE + bodyH / 2, -D / 2 + 0.005], explode: [0, 0, -1.3], tone: "interior" },
  ...[1, 2, 3].map(
    (level): PartSpec => ({
      key: `shelf-${level}`,
      size: [W - 2 * T - 0.004, T, D - 0.03],
      home: [0, BASE + (bodyH * level) / 4, 0.005],
      explode: [0, (level - 2) * 0.28, 0.6],
      tone: "interior",
    }),
  ),
  { key: "plinth", size: [W - 0.04, BASE, D - 0.08], home: [0, BASE / 2, -0.02], explode: [0, -0.75, 0], tone: "dark" },
];

const edgeColor = LED_COLOR.clone().multiplyScalar(1.8);

/** Materiais transparentes (clones) para as peças surgirem do rascunho. */
const useStoryMaterials = () =>
  useMemo(() => {
    const ghost = (material: THREE.MeshStandardMaterial) => {
      const copy = material.clone();
      copy.transparent = true;
      return copy;
    };
    const body = storyFinishes.map((id) => ghost(getBodyMaterial(id)));
    const interior = ghost(sharedMaterials.interior);
    const dark = ghost(sharedMaterials.dark);
    const metal = ghost(sharedMaterials.metal);
    return {
      body,
      interior,
      dark,
      metal,
      all: [...body, interior, dark, metal],
      pick: (tone: Tone, finishIndex: number): THREE.Material => (tone === "body" ? (body[finishIndex] ?? interior) : tone === "interior" ? interior : dark),
    };
  }, []);

type Mats = ReturnType<typeof useStoryMaterials>;
type TimeRef = MutableRefObject<number>;

const EdgeLines = ({ size, opacity }: { size: V3; opacity: MutableRefObject<number> }) => {
  const geometry = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size]);
  const material = useRef<THREE.LineBasicMaterial>(null);

  useFrame(() => {
    if (material.current) material.current.opacity = opacity.current;
  });

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial ref={material} color={edgeColor} transparent toneMapped={false} />
    </lineSegments>
  );
};

type PartProps = { spec: PartSpec; time: TimeRef; mats: Mats; edgeOpacity: MutableRefObject<number> };

const Part = ({ spec, time, mats, edgeOpacity }: PartProps) => {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const e = explodeAt(time.current);
    group.current?.position.set(
      spec.home[0] + spec.explode[0] * e,
      spec.home[1] + spec.explode[1] * e,
      spec.home[2] + spec.explode[2] * e,
    );
    if (mesh.current) {
      mesh.current.material = mats.pick(spec.tone, finishIndexAt(time.current));
      mesh.current.visible = solidAt(time.current) > 0.01;
    }
  });

  return (
    <group ref={group} position={spec.home}>
      <mesh ref={mesh} castShadow receiveShadow>
        <boxGeometry args={spec.size} />
      </mesh>
      <EdgeLines size={spec.size} opacity={edgeOpacity} />
    </group>
  );
};

type StoryDoorProps = { side: -1 | 1; time: TimeRef; mats: Mats; edgeOpacity: MutableRefObject<number> };

const DOOR_W = (W - 2 * T) / 2 - 0.003;
const DOOR_H = bodyH - 0.004;
const DOOR_SIZE: V3 = [DOOR_W, DOOR_H, T];
const HANDLE_SIZE: V3 = [0.012, 0.36, 0.012];

const StoryDoor = ({ side, time, mats, edgeOpacity }: StoryDoorProps) => {
  const pivot = useRef<THREE.Group>(null);
  const door = useRef<THREE.Mesh>(null);
  const handle = useRef<THREE.Mesh>(null);
  const home: V3 = [side * (W / 2 - T), BASE + bodyH / 2, D / 2 + 0.011];

  useFrame(() => {
    const t = time.current;
    const e = explodeAt(t);
    const group = pivot.current;
    if (group) {
      group.position.set(home[0] + side * 0.6 * e, home[1], home[2] + 1.55 * e);
      group.rotation.y = side * smooth(5.3, 5.8, t) * 1.45;
    }
    const visible = solidAt(t) > 0.01;
    if (door.current) {
      door.current.material = mats.pick("body", finishIndexAt(t));
      door.current.visible = visible;
    }
    if (handle.current) {
      handle.current.material = mats.metal;
      handle.current.visible = visible;
      handle.current.position.z = T / 2 + 0.014 + 0.42 * e;
    }
  });

  return (
    <group ref={pivot} position={home}>
      <group position={[-side * DOOR_W * 0.5, 0, 0]}>
        <mesh ref={door} castShadow receiveShadow>
          <boxGeometry args={DOOR_SIZE} />
        </mesh>
        <EdgeLines size={DOOR_SIZE} opacity={edgeOpacity} />
      </group>
      <mesh ref={handle} position={[-side * (DOOR_W - 0.045), 0, T / 2 + 0.014]} castShadow>
        <boxGeometry args={HANDLE_SIZE} />
      </mesh>
    </group>
  );
};

const ROD = 0.008;

/** Linha de cota feita de barras 3D (eixo alinhado), com rótulo em pílula. */
const Dimension = ({ from, to, label }: { from: V3; to: V3; label: string }) => {
  const center: V3 = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2, (from[2] + to[2]) / 2];
  const size: V3 = [Math.abs(to[0] - from[0]) + ROD, Math.abs(to[1] - from[1]) + ROD, Math.abs(to[2] - from[2]) + ROD];
  const alongX = size[0] > size[1] && size[0] > size[2];
  const tick: V3 = alongX ? [ROD, 0.08, ROD] : [0.08, ROD, ROD];

  return (
    <group>
      <mesh position={center}>
        <boxGeometry args={size} />
        <meshBasicMaterial color={edgeColor} toneMapped={false} />
      </mesh>
      {[from, to].map((end) => (
        <mesh key={end.join()} position={end}>
          <boxGeometry args={tick} />
          <meshBasicMaterial color={edgeColor} toneMapped={false} />
        </mesh>
      ))}
      <Html position={center} center style={{ pointerEvents: "none" }}>
        <span className="pop-in whitespace-nowrap rounded-full bg-accent px-3 py-1 text-xs font-bold tabular-nums text-accent-ink">{label}</span>
      </Html>
    </group>
  );
};

type Flags = { measuring: boolean; installed: boolean; lit: boolean };

const StoryWorld = ({ progress }: { progress: MutableRefObject<number> }) => {
  const time = useRef(0);
  const edgeOpacity = useRef(1);
  const mats = useStoryMaterials();
  const wall = useRef<THREE.MeshStandardMaterial>(null);
  const [flags, setFlags] = useState<Flags>({ measuring: false, installed: false, lit: false });

  useFrame((state, delta) => {
    time.current = THREE.MathUtils.damp(time.current, progress.current * STEP_COUNT, 5, delta);
    const t = time.current;
    const solid = solidAt(t);
    const e = explodeAt(t);

    for (const material of mats.all) {
      material.opacity = solid;
      material.depthWrite = solid > 0.98;
    }
    edgeOpacity.current = THREE.MathUtils.lerp(0.95, 0.28, solid);
    if (wall.current) wall.current.opacity = smooth(4.6, 5.2, t);

    const angle = THREE.MathUtils.lerp(-0.8, 0.32, THREE.MathUtils.clamp(t / STEP_COUNT, 0, 1)) + Math.sin(state.clock.elapsedTime * 0.35) * 0.035;
    const radius = 4.7 + 3.6 * e;
    state.camera.position.set(Math.sin(angle) * radius, 1.3 + 0.8 * e, Math.cos(angle) * radius);
    state.camera.lookAt(0, 1.05 + 0.2 * e, 0);

    const next: Flags = { measuring: t > 0.55 && t < 1.9, installed: t > 4.8, lit: t > 5.2 };
    if (next.measuring !== flags.measuring || next.installed !== flags.installed || next.lit !== flags.lit) setFlags(next);
  });

  return (
    <>
      <Stage wall={false} wallZ={-D / 2 - 0.012} />
      <mesh position={[0, 3, -D / 2 - 0.014]} receiveShadow>
        <planeGeometry args={[18, 6]} />
        <meshStandardMaterial ref={wall} color="#4a3e34" roughness={0.95} transparent opacity={0} />
      </mesh>

      {parts.map((spec) => (
        <Part key={spec.key} spec={spec} time={time} mats={mats} edgeOpacity={edgeOpacity} />
      ))}
      <StoryDoor side={-1} time={time} mats={mats} edgeOpacity={edgeOpacity} />
      <StoryDoor side={1} time={time} mats={mats} edgeOpacity={edgeOpacity} />

      {flags.measuring && (
        <group>
          <Dimension from={[-W / 2, H + 0.2, D / 2]} to={[W / 2, H + 0.2, D / 2]} label="120 cm" />
          <Dimension from={[W / 2 + 0.3, 0, D / 2]} to={[W / 2 + 0.3, H, D / 2]} label="190 cm" />
          <Dimension from={[-W / 2 - 0.28, 0.01, -D / 2]} to={[-W / 2 - 0.28, 0.01, D / 2]} label="50 cm" />
        </group>
      )}

      {flags.installed && (
        <group>
          <Led position={[0, H - T - 0.02, D / 2 - 0.06]} size={[W - 0.1, 0.008, 0.012]} on={flags.lit} />
          <Glow position={[0, H + 0.12, -D / 2 - 0.01]} size={[W + 0.6, 0.8]} on={flags.lit} kind="radial" strength={0.5} />
          <Glow position={[0, 0.004, D / 2 + 0.25]} size={[W + 0.4, 0.5]} rotation={[-Math.PI / 2, 0, 0]} on={flags.lit} strength={0.7} />
          <LedLight position={[0, H - 0.2, D / 2 + 0.2]} on={flags.lit} intensity={1.8} distance={3} />
          {[0.35, 0.8].map((y, index) => (
            <mesh key={y} position={[index ? 0.2 : -0.2, BASE + y + 0.08, 0.05]} castShadow>
              <boxGeometry args={[0.32, 0.15, 0.3]} />
              <meshStandardMaterial color={index ? "#8a6f5a" : "#d8d0c0"} roughness={0.9} />
            </mesh>
          ))}
        </group>
      )}
    </>
  );
};

export const StoryScene = ({ progress, className }: { progress: MutableRefObject<number>; className?: string }) => (
  <SceneCanvas
    className={className}
    camera={{ position: [-3, 1.4, 4], fov: 36 }}
    fallback={<HeroScene />}
    label="Animação 3D: o móvel sai do rascunho, é medido, projetado, montado e instalado."
  >
    <StoryWorld progress={progress} />
  </SceneCanvas>
);
