import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Carcass, Drawer, FloorGlow, Glow, Led, LedLight, Slab, type ModelProps, type V3 } from "../parts";
import { getScreenTexture, sharedMaterials } from "../materials";
import { useHoverCursorEvents } from "../useHover";

const HEIGHT = 2.45;

const Television = ({ position, width, on, onToggle }: { position: V3; width: number; on: boolean; onToggle: () => void }) => {
  const height = width * 0.5625;
  const screen = useRef<THREE.MeshStandardMaterial>(null);
  const level = useRef(on ? 1 : 0);
  const hover = useHoverCursorEvents();
  const map = useMemo(() => getScreenTexture(), []);

  useFrame((_, delta) => {
    level.current = THREE.MathUtils.damp(level.current, on ? 1 : 0, 6, delta);
    if (screen.current) screen.current.emissiveIntensity = level.current * 1.5;
  });

  return (
    <group position={position}>
      <mesh
        material={sharedMaterials.glass}
        castShadow
        onClick={(event) => {
          event.stopPropagation();
          onToggle();
        }}
        {...hover}
      >
        <boxGeometry args={[width, height, 0.03]} />
      </mesh>
      <mesh position={[0, 0, 0.0155]}>
        <planeGeometry args={[width - 0.025, height - 0.025]} />
        <meshStandardMaterial
          ref={screen}
          color="#07070a"
          roughness={0.1}
          metalness={0.3}
          emissive="#ffffff"
          emissiveMap={map}
          emissiveIntensity={0}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
};

export const TvPanelModel = ({ finishMaterial, handle, led, widthCm, open }: ModelProps) => {
  const width = widthCm / 100;
  const zone = THREE.MathUtils.clamp(width - 1.3, 1.4, 2.2);
  const side = (width - zone) / 2;
  const tvWidth = Math.min(zone - 0.25, 1.45);
  const tvHeight = tvWidth * 0.5625;
  const tvY = 1.6;
  const slats = Math.floor(zone / 0.06);
  const drawers = Math.max(3, Math.round(width / 0.75));
  const drawerW = width / drawers;
  const shelfYs = [0.975, 1.425, 1.875];

  return (
    <group>
      {/* Fundo escuro e ripado central */}
      <Slab size={[width, HEIGHT, 0.04]} position={[0, HEIGHT / 2, -0.02]} material={sharedMaterials.dark} shadow={false} />
      {Array.from({ length: slats }, (_, index) => (
        <Slab
          key={index}
          size={[0.032, HEIGHT - 0.7, 0.04]}
          position={[-zone / 2 + 0.03 + index * (zone / slats), 0.7 + (HEIGHT - 0.7) / 2, 0.02]}
          material={finishMaterial}
        />
      ))}

      {/* TV com moldura de luz */}
      <Television position={[0, tvY, 0.075]} width={tvWidth} on={open.isOpen("tv")} onToggle={() => open.toggle("tv")} />
      <Led position={[0, tvY + tvHeight / 2 + 0.05, 0.05]} size={[tvWidth + 0.14, 0.01, 0.012]} on={led} />
      <Led position={[0, tvY - tvHeight / 2 - 0.05, 0.05]} size={[tvWidth + 0.14, 0.01, 0.012]} on={led} />
      <Led position={[-tvWidth / 2 - 0.07, tvY, 0.05]} size={[0.01, tvHeight + 0.1, 0.012]} on={led} />
      <Led position={[tvWidth / 2 + 0.07, tvY, 0.05]} size={[0.01, tvHeight + 0.1, 0.012]} on={led} />
      <Glow position={[0, tvY, 0.044]} size={[tvWidth + 1, tvHeight + 0.9]} on={led} kind="radial" strength={0.5} />
      <LedLight position={[0, tvY + 1.0, 0.6]} on={led} intensity={0.8} distance={3} />

      {/* Colunas laterais com nichos */}
      {[-1, 1].map((sign) => {
        const x = sign * (zone / 2 + side / 2);
        return (
          <group key={sign}>
            <Carcass size={[side, 1.75, 0.32]} position={[x, 1.575, 0.16]} shelves={3} endMaterial={finishMaterial} interior={sharedMaterials.dark} />
            {shelfYs.map((shelfY, index) => (
              <group key={shelfY}>
                <Led position={[x, shelfY - 0.016, 0.27]} size={[side - 0.07, 0.006, 0.008]} on={led} power={0.85} />
                <Slab
                  size={[Math.min(0.2, side * 0.45), 0.05 + ((index + (sign > 0 ? 1 : 0)) % 3) * 0.03, 0.2]}
                  position={[x - side * 0.12, shelfY + 0.03 + ((index + (sign > 0 ? 1 : 0)) % 3) * 0.015, 0.14]}
                  material={sharedMaterials.stone}
                  shadow={false}
                />
                <mesh position={[x + side * 0.15, shelfY + 0.1, 0.14]} material={sharedMaterials.stoneDark} castShadow>
                  <cylinderGeometry args={[0.035, 0.045, 0.18 + index * 0.03, 20]} />
                </mesh>
              </group>
            ))}
          </group>
        );
      })}

      {/* Rack suspenso */}
      <Carcass size={[width, 0.36, 0.42]} position={[0, 0.5, 0.21]} modules={drawers} endMaterial={finishMaterial} />
      {Array.from({ length: drawers }, (_, index) => (
        <Drawer
          key={index}
          id={`rack-${index}`}
          size={[drawerW - 0.004, 0.34]}
          position={[-width / 2 + drawerW * (index + 0.5), 0.5, 0.432]}
          material={finishMaterial}
          handle={handle}
          open={open}
          travel={0.3}
        />
      ))}
      <Led position={[0, 0.315, 0.38]} size={[width - 0.1, 0.008, 0.01]} on={led} />
      <FloorGlow x={0} z={0.4} width={width + 0.2} on={led} />
      <group position={[-width * 0.3, 0.68, 0.2]}>
        <mesh position={[0, 0.16, 0]} material={sharedMaterials.stoneDark} castShadow>
          <cylinderGeometry args={[0.05, 0.07, 0.32, 24]} />
        </mesh>
        {[0, 1, 2].map((branch) => (
          <mesh key={branch} position={[(branch - 1) * 0.06, 0.55, 0]} rotation={[0, 0, (branch - 1) * -0.22]} material={sharedMaterials.splash}>
            <cylinderGeometry args={[0.004, 0.004, 0.5, 6]} />
          </mesh>
        ))}
      </group>
    </group>
  );
};
