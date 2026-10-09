import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { HandleStyle } from "./config";
import { getGlowTexture, LED_COLOR, sharedMaterials, type GlowKind } from "./materials";
import type { OpenState } from "./openState";

export type V3 = [number, number, number];

const damp = THREE.MathUtils.damp;
const PANEL = 0.018;
const FRONT = 0.019;

export type ModelProps = {
  finishMaterial: THREE.Material;
  handle: HandleStyle;
  led: boolean;
  widthCm: number;
  open: Pick<OpenState, "isOpen" | "toggle">;
};

/* ---------- interação ---------- */

const useHoverCursor = () => {
  const [hovered, setHovered] = useState(false);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  const handlers = {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHovered(true);
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      setHovered(false);
      document.body.style.cursor = "";
    },
  };

  return { hovered, handlers };
};

/* ---------- caixa simples ---------- */

type SlabProps = { size: V3; position: V3; material: THREE.Material; shadow?: boolean };

export const Slab = ({ size, position, material, shadow = true }: SlabProps) => (
  <mesh position={position} material={material} castShadow={shadow} receiveShadow>
    <boxGeometry args={size} />
  </mesh>
);

/* ---------- corpo vazado do armário ---------- */

type CarcassProps = {
  size: V3;
  position: V3;
  modules?: number;
  shelves?: number;
  endMaterial: THREE.Material;
  interior?: THREE.Material;
};

export const Carcass = ({ size, position, modules = 1, shelves = 0, endMaterial, interior = sharedMaterials.interior }: CarcassProps) => {
  const [w, h, d] = size;
  const moduleW = w / modules;

  return (
    <group position={position}>
      <Slab size={[w, h, 0.01]} position={[0, 0, -d / 2 + 0.005]} material={interior} shadow={false} />
      <Slab size={[w, PANEL, d]} position={[0, h / 2 - PANEL / 2, 0]} material={interior} />
      <Slab size={[w, PANEL, d]} position={[0, -h / 2 + PANEL / 2, 0]} material={interior} />
      <Slab size={[PANEL, h, d]} position={[-w / 2 + PANEL / 2, 0, 0]} material={endMaterial} />
      <Slab size={[PANEL, h, d]} position={[w / 2 - PANEL / 2, 0, 0]} material={endMaterial} />
      {Array.from({ length: modules - 1 }, (_, index) => (
        <Slab key={`div-${index}`} size={[PANEL, h - 2 * PANEL, d - 0.01]} position={[-w / 2 + moduleW * (index + 1), 0, 0]} material={interior} />
      ))}
      {Array.from({ length: modules * shelves }, (_, index) => {
        const module = Math.floor(index / shelves);
        const level = (index % shelves) + 1;
        return (
          <Slab
            key={`shelf-${index}`}
            size={[moduleW - PANEL, PANEL, d - 0.03]}
            position={[-w / 2 + moduleW * (module + 0.5), -h / 2 + (h * level) / (shelves + 1), 0.005]}
            material={interior}
          />
        );
      })}
    </group>
  );
};

/* ---------- puxadores ---------- */

type HandleMarkProps = { style: HandleStyle; vertical: boolean; length: number; extent: number; position: V3 };

const HandleMark = ({ style, vertical, length, extent, position }: HandleMarkProps) => {
  if (style === "barra") {
    return (
      <mesh position={position} material={sharedMaterials.metal} castShadow>
        <boxGeometry args={vertical ? [0.011, length, 0.011] : [length, 0.011, 0.011]} />
      </mesh>
    );
  }
  if (style === "embutido") {
    return (
      <mesh position={position} material={sharedMaterials.dark}>
        <boxGeometry args={vertical ? [0.007, extent, 0.002] : [extent, 0.007, 0.002]} />
      </mesh>
    );
  }
  return null;
};

/* ---------- porta com dobradiça ---------- */

type DoorProps = {
  id: string;
  size: [number, number];
  /** Centro da porta fechada. */
  position: V3;
  hinge: "left" | "right";
  material: THREE.Material;
  handle: HandleStyle;
  open: Pick<OpenState, "isOpen" | "toggle">;
  handleY?: number;
  handleLength?: number;
  maxAngle?: number;
};

export const Door = ({ id, size, position, hinge, material, handle, open, handleY = 0, handleLength = 0.3, maxAngle = 1.85 }: DoorProps) => {
  const pivot = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const { hovered, handlers } = useHoverCursor();
  const isOpen = open.isOpen(id);
  const side = hinge === "left" ? -1 : 1;
  const [w, h] = size;

  useFrame((_, delta) => {
    const group = pivot.current;
    if (!group) return;
    angle.current = damp(angle.current, isOpen ? maxAngle : 0, 4.5, delta);
    group.rotation.y = side * angle.current;
    group.position.z = damp(group.position.z, position[2] + (hovered && !isOpen ? 0.01 : 0), 14, delta);
  });

  return (
    <group ref={pivot} position={[position[0] + (side * w) / 2, position[1], position[2]]}>
      <mesh
        position={[(-side * w) / 2, 0, 0]}
        material={material}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          open.toggle(id);
        }}
        {...handlers}
      >
        <boxGeometry args={[w, h, FRONT]} />
      </mesh>
      <HandleMark
        style={handle}
        vertical
        length={handleLength}
        extent={h * 0.985}
        position={[-side * (handle === "barra" ? w - 0.045 : w - 0.006), handle === "barra" ? handleY : 0, FRONT / 2 + (handle === "barra" ? 0.014 : 0.0007)]}
      />
    </group>
  );
};

/* ---------- gaveta que desliza ---------- */

type DrawerProps = {
  id: string;
  size: [number, number];
  position: V3;
  material: THREE.Material;
  handle: HandleStyle;
  open: Pick<OpenState, "isOpen" | "toggle">;
  travel?: number;
};

export const Drawer = ({ id, size, position, material, handle, open, travel = 0.34 }: DrawerProps) => {
  const group = useRef<THREE.Group>(null);
  const slide = useRef(0);
  const { hovered, handlers } = useHoverCursor();
  const isOpen = open.isOpen(id);
  const [w, h] = size;

  useFrame((_, delta) => {
    const node = group.current;
    if (!node) return;
    slide.current = damp(slide.current, isOpen ? travel : 0, 5, delta);
    node.position.z = position[2] + slide.current + (hovered && !isOpen ? 0.008 : 0);
  });

  return (
    <group ref={group} position={position}>
      <mesh
        material={material}
        castShadow
        receiveShadow
        onClick={(event) => {
          event.stopPropagation();
          open.toggle(id);
        }}
        {...handlers}
      >
        <boxGeometry args={[w, h, FRONT]} />
      </mesh>
      <Slab size={[w - 0.05, 0.012, 0.42]} position={[0, -h / 2 + 0.03, -0.22]} material={sharedMaterials.interior} shadow={false} />
      <Slab size={[0.012, h - 0.06, 0.42]} position={[-w / 2 + 0.03, 0, -0.22]} material={sharedMaterials.interior} shadow={false} />
      <Slab size={[0.012, h - 0.06, 0.42]} position={[w / 2 - 0.03, 0, -0.22]} material={sharedMaterials.interior} shadow={false} />
      <Slab size={[w - 0.05, h - 0.06, 0.012]} position={[0, 0, -0.43]} material={sharedMaterials.interior} shadow={false} />
      <HandleMark
        style={handle}
        vertical={false}
        length={Math.min(0.26, w * 0.5)}
        extent={w * 0.9}
        position={[0, h / 2 - (handle === "barra" ? 0.035 : 0.012), FRONT / 2 + (handle === "barra" ? 0.014 : 0.0007)]}
      />
    </group>
  );
};

/* ---------- luz de LED ---------- */

type LedProps = { position: V3; size: V3; on: boolean; power?: number };

/** Fita de LED: emissiva e acima de 1, então o bloom faz ela brilhar. */
export const Led = ({ position, size, on, power = 1 }: LedProps) => {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const level = useRef(on ? 1 : 0);

  useFrame((_, delta) => {
    level.current = damp(level.current, on ? 1 : 0, 6, delta);
    material.current?.color.copy(LED_COLOR).multiplyScalar(0.1 + level.current * 3.4 * power);
  });

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial ref={material} toneMapped={false} />
    </mesh>
  );
};

type GlowProps = {
  position: V3;
  size: [number, number];
  on: boolean;
  rotation?: V3;
  kind?: GlowKind;
  strength?: number;
};

/** Mancha de luz aditiva: simula o LED iluminando parede e chão. */
export const Glow = ({ position, size, on, rotation = [0, 0, 0], kind = "linear", strength = 1 }: GlowProps) => {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const level = useRef(on ? 1 : 0);
  const map = useMemo(() => getGlowTexture(kind), [kind]);

  useFrame((_, delta) => {
    level.current = damp(level.current, on ? 1 : 0, 5, delta);
    if (material.current) material.current.opacity = level.current * 0.6 * strength;
  });

  return (
    <mesh position={position} rotation={rotation} renderOrder={2}>
      <planeGeometry args={size} />
      <meshBasicMaterial
        ref={material}
        map={map}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </mesh>
  );
};

type LedLightProps = { position: V3; on: boolean; intensity?: number; distance?: number };

export const LedLight = ({ position, on, intensity = 2.4, distance = 2.8 }: LedLightProps) => {
  const light = useRef<THREE.PointLight>(null);
  const level = useRef(on ? 1 : 0);

  useFrame((_, delta) => {
    level.current = damp(level.current, on ? 1 : 0, 5, delta);
    if (light.current) light.current.intensity = level.current * intensity;
  });

  return <pointLight ref={light} position={position} color="#ffb347" distance={distance} decay={2} />;
};

/** Brilho no piso sob um móvel suspenso. */
export const FloorGlow = ({ x, z, width, on }: { x: number; z: number; width: number; on: boolean }) => (
  <Glow position={[x, 0.004, z]} size={[width, 0.5]} on={on} rotation={[-Math.PI / 2, 0, 0]} strength={0.8} />
);
