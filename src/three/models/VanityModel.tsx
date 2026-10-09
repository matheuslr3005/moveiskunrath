import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Carcass, Door, Drawer, FloorGlow, Glow, Led, LedLight, Slab, type ModelProps } from "../parts";
import { getMirrorMaterial, getTileTexture, LED_COLOR, sharedMaterials } from "../materials";

const WALL_Z = -0.23;

const MirrorHalo = ({ x, y, radius, on }: { x: number; y: number; radius: number; on: boolean }) => {
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const level = useRef(on ? 1 : 0);

  useFrame((_, delta) => {
    level.current = THREE.MathUtils.damp(level.current, on ? 1 : 0, 6, delta);
    material.current?.color.copy(LED_COLOR).multiplyScalar(0.1 + level.current * 3.2);
  });

  return (
    <group position={[x, y, WALL_Z + 0.012]}>
      <mesh material={getMirrorMaterial()}>
        <circleGeometry args={[radius, 64]} />
      </mesh>
      <mesh position={[0, 0, 0.004]}>
        <torusGeometry args={[radius + 0.012, 0.008, 12, 80]} />
        <meshBasicMaterial ref={material} toneMapped={false} />
      </mesh>
      <Glow position={[0, 0, -0.005]} size={[radius * 3.4, radius * 3.4]} on={on} kind="radial" strength={0.55} />
    </group>
  );
};

export const VanityModel = ({ finishMaterial, handle, led, widthCm, open }: ModelProps) => {
  const width = widthCm / 100;
  const columnW = 0.4;
  const double = width > 1.0;
  const cols = double ? 2 : 1;
  const colW = width / cols;
  const shift = -(columnW + 0.05) / 2;
  const tiles = useMemo(() => getTileTexture(), []);
  const mirrorRadius = Math.min(0.4, colW * 0.4);

  return (
    <group position={[shift, 0, 0]}>
      {/* parede de azulejos */}
      <mesh position={[0.2, 1.4, WALL_Z - 0.005]} receiveShadow>
        <planeGeometry args={[9, 2.8]} />
        <meshStandardMaterial map={tiles} roughness={0.4} metalness={0.1} />
      </mesh>

      {/* gabinete suspenso */}
      <Carcass size={[width, 0.44, 0.46]} position={[0, 0.62, 0]} modules={cols} endMaterial={finishMaterial} />
      {Array.from({ length: cols }, (_, col) =>
        [0, 1].map((row) => (
          <Drawer
            key={`${col}-${row}`}
            id={`vanity-${col}-${row}`}
            size={[colW - 0.004, 0.22 - 0.004]}
            position={[-width / 2 + colW * (col + 0.5), 0.73 - row * 0.22, 0.243]}
            material={finishMaterial}
            handle={handle}
            open={open}
            travel={0.28}
          />
        )),
      )}
      <Slab size={[width + 0.04, 0.04, 0.5]} position={[0, 0.86, 0.02]} material={sharedMaterials.stone} />
      <Led position={[0, 0.395, 0.2]} size={[width - 0.08, 0.008, 0.01]} on={led} />
      <Glow position={[0, 0.2, WALL_Z + 0.002]} size={[width + 0.3, 0.4]} on={led} />
      <FloorGlow x={0} z={0.4} width={width + 0.3} on={led} />

      {Array.from({ length: cols }, (_, col) => {
        const x = -width / 2 + colW * (col + 0.5);
        return (
          <group key={`basin-${col}`}>
            <mesh position={[x, 0.975, 0.05]} scale={[1, 0.5, 1]} material={sharedMaterials.ceramic} castShadow>
              <sphereGeometry args={[0.19, 40, 20, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
            </mesh>
            <mesh position={[x, 0.99, -0.12]} material={sharedMaterials.metal} castShadow>
              <cylinderGeometry args={[0.011, 0.011, 0.22, 12]} />
            </mesh>
            <mesh position={[x, 1.1, -0.07]} rotation={[Math.PI / 2, 0, 0]} material={sharedMaterials.metal} castShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.1, 12]} />
            </mesh>
            <MirrorHalo x={x} y={1.62} radius={mirrorRadius} on={led} />
          </group>
        );
      })}
      <LedLight position={[0, 2.1, 0.7]} on={led} intensity={0.9} distance={3} />

      {/* coluna lateral */}
      <group position={[width / 2 + 0.05 + columnW / 2, 0, 0]}>
        <Carcass size={[columnW, 1.7, 0.36]} position={[0, 1.25, WALL_Z + 0.18]} shelves={1} endMaterial={finishMaterial} />
        <Door
          id="column-low"
          size={[columnW - 0.004, 0.86]}
          position={[0, 0.85, WALL_Z + 0.372]}
          hinge="left"
          material={finishMaterial}
          handle={handle}
          open={open}
          handleY={0.3}
          handleLength={0.26}
        />
        <Door
          id="column-high"
          size={[columnW - 0.004, 0.8]}
          position={[0, 1.7, WALL_Z + 0.372]}
          hinge="left"
          material={finishMaterial}
          handle={handle}
          open={open}
          handleY={-0.25}
          handleLength={0.26}
        />
        <Led position={[0, 0.395, WALL_Z + 0.33]} size={[columnW - 0.06, 0.008, 0.01]} on={led} />
        {[0, 1].map((stack) => (
          <mesh key={stack} position={[0, 1.18 + stack * 0.7, WALL_Z + 0.16]} castShadow>
            <boxGeometry args={[columnW * 0.7, 0.14, 0.26]} />
            <meshStandardMaterial color={stack ? "#d8d0c0" : "#8a6f5a"} roughness={0.95} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
