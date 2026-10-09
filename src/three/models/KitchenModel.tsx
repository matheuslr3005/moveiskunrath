import * as THREE from "three";
import { Carcass, Door, Drawer, FloorGlow, Glow, Led, LedLight, Slab, type ModelProps } from "../parts";
import { sharedMaterials } from "../materials";

const PANEL_FIX = 0.018;
const BOOK_COLORS = ["#8a6f5a", "#3b4552", "#c9b99a", "#5d6b5a"];

const Stool = ({ x, z }: { x: number; z: number }) => (
  <group position={[x, 0, z]}>
    <mesh position={[0, 0.67, 0]} material={sharedMaterials.dark} castShadow>
      <cylinderGeometry args={[0.17, 0.17, 0.05, 28]} />
    </mesh>
    {[
      [-0.11, -0.11],
      [0.11, -0.11],
      [-0.11, 0.11],
      [0.11, 0.11],
    ].map(([lx, lz]) => (
      <mesh key={`${lx}-${lz}`} position={[lx ?? 0, 0.33, lz ?? 0]} material={sharedMaterials.dark} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.66, 8]} />
      </mesh>
    ))}
    <mesh position={[0, 0.3, 0]} rotation={[Math.PI / 2, 0, 0]} material={sharedMaterials.dark}>
      <torusGeometry args={[0.13, 0.008, 8, 28]} />
    </mesh>
  </group>
);

type KitchenProps = ModelProps & { island?: boolean };

export const KitchenModel = ({ finishMaterial, handle, led, widthCm, open, island = true }: KitchenProps) => {
  const width = widthCm / 100;
  const tallW = 0.6;
  const runL = width - tallW;
  const runCx = -tallW / 2;
  const count = Math.max(2, Math.round(runL / 0.5));
  const moduleW = runL / count;
  const xs = Array.from({ length: count }, (_, index) => runCx - runL / 2 + moduleW * (index + 0.5));

  const lowerH = 0.76;
  const lowerY = 0.1 + lowerH / 2;
  const upperH = 0.9;
  const upperY = 1.45 + upperH / 2;
  const doorIndexes = xs.map((_, index) => index).filter((index) => index % 2 === 0);
  const sinkIndex = doorIndexes[doorIndexes.length - 1] ?? 0;
  const cookIndex = doorIndexes.reduce((best, index) => (Math.abs(index - count / 2) < Math.abs(best - count / 2) ? index : best), 0);
  const tallX = width / 2 - tallW / 2;

  const islandW = THREE.MathUtils.clamp(width - 1.0, 1.4, 2.4);
  const islandX = -0.1;
  const islandZ = 1.6;

  return (
    <group>
      {/* Rodapé recuado e brilho no piso */}
      <Slab size={[runL, 0.1, 0.5]} position={[runCx, 0.05, -0.05]} material={sharedMaterials.dark} shadow={false} />
      <Led position={[runCx, 0.012, 0.21]} size={[runL - 0.1, 0.008, 0.01]} on={led} />
      <FloorGlow x={runCx} z={0.46} width={runL + 0.3} on={led} />

      {/* Armários baixos */}
      <Carcass size={[runL, lowerH, 0.6]} position={[runCx, lowerY, 0]} modules={count} endMaterial={finishMaterial} />
      {xs.map((x, index) =>
        index % 2 === 1 ? (
          [0, 1, 2].map((row) => (
            <Drawer
              key={`drawer-${index}-${row}`}
              id={`lower-drawer-${index}-${row}`}
              size={[moduleW - 0.004, lowerH / 3 - 0.004]}
              position={[x, 0.1 + lowerH / 6 + (lowerH / 3) * (2 - row), 0.312]}
              material={finishMaterial}
              handle={handle}
              open={open}
            />
          ))
        ) : (
          <Door
            key={`lower-door-${index}`}
            id={`lower-door-${index}`}
            size={[moduleW - 0.004, lowerH - 0.004]}
            position={[x, lowerY, 0.312]}
            hinge={(index / 2) % 2 === 0 ? "left" : "right"}
            material={finishMaterial}
            handle={handle}
            open={open}
            handleY={lowerH / 2 - 0.17}
            handleLength={0.3}
          />
        ),
      )}

      {/* Bancada, backsplash, cooktop e cuba */}
      <Slab size={[runL + 0.03, 0.04, 0.64]} position={[runCx, 0.88, 0.02]} material={sharedMaterials.stone} />
      <Slab size={[runL, 0.55, 0.01]} position={[runCx, 1.175, -0.295]} material={sharedMaterials.splash} shadow={false} />
      <Slab size={[0.58, 0.006, 0.5]} position={[xs[cookIndex] ?? 0, 0.903, 0.02]} material={sharedMaterials.glass} shadow={false} />
      {[
        [-0.14, -0.1],
        [0.14, -0.1],
        [-0.14, 0.12],
        [0.14, 0.12],
      ].map(([ox, oz]) => (
        <mesh key={`${ox}-${oz}`} position={[(xs[cookIndex] ?? 0) + (ox ?? 0), 0.907, 0.02 + (oz ?? 0)]} material={sharedMaterials.stoneDark}>
          <cylinderGeometry args={[0.085, 0.085, 0.002, 24]} />
        </mesh>
      ))}
      <Slab size={[0.5, 0.004, 0.38]} position={[xs[sinkIndex] ?? 0, 0.902, 0.04]} material={sharedMaterials.stoneDark} shadow={false} />
      <mesh position={[xs[sinkIndex] ?? 0, 1.03, -0.18]} material={sharedMaterials.metal} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.26, 12]} />
      </mesh>
      <mesh position={[xs[sinkIndex] ?? 0, 1.16, -0.11]} rotation={[Math.PI / 2, 0, 0]} material={sharedMaterials.metal} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.15, 12]} />
      </mesh>

      {/* Armários altos */}
      <Carcass size={[runL, upperH, 0.35]} position={[runCx, upperY, -0.125]} modules={count} shelves={1} endMaterial={finishMaterial} />
      {xs.map((x, index) => (
        <Door
          key={`upper-door-${index}`}
          id={`upper-door-${index}`}
          size={[moduleW - 0.004, upperH - 0.004]}
          position={[x, upperY, 0.062]}
          hinge={index % 2 === 0 ? "left" : "right"}
          material={finishMaterial}
          handle={handle}
          open={open}
          handleY={-upperH / 2 + 0.17}
          handleLength={0.28}
        />
      ))}

      {/* LED sob os armários altos */}
      <Led position={[runCx, 1.444, 0.035]} size={[runL - 0.08, 0.008, 0.012]} on={led} />
      <Glow position={[runCx, 1.18, -0.288]} size={[runL, 0.52]} on={led} />
      <LedLight position={[runCx, 1.3, 0.18]} on={led} />

      {/* Coluna alta com nichos iluminados */}
      <group position={[tallX, 0, 0]}>
        <Carcass size={[tallW, 2.35, 0.6]} position={[0, 1.175, 0]} endMaterial={finishMaterial} interior={sharedMaterials.dark} />
        <Slab size={[tallW - 0.03, PANEL_FIX, 0.56]} position={[0, 1.05, 0.01]} material={finishMaterial} />
        <Door
          id="tall-door"
          size={[tallW - 0.004, 0.93]}
          position={[0, 0.575, 0.312]}
          hinge="right"
          material={finishMaterial}
          handle={handle}
          open={open}
          handleY={0.3}
          handleLength={0.3}
        />
        {[1.38, 1.72, 2.06].map((shelfY, index) => (
          <group key={shelfY}>
            <Slab size={[tallW - 0.03, 0.02, 0.5]} position={[0, shelfY, 0.04]} material={finishMaterial} />
            <Led position={[0, shelfY - 0.016, 0.27]} size={[tallW - 0.07, 0.006, 0.008]} on={led} power={0.8} />
            <Slab
              size={[0.22, 0.045 + index * 0.012, 0.17]}
              position={[-0.1, shelfY + 0.0325 + index * 0.006, 0.1]}
              material={sharedMaterials.stone}
              shadow={false}
            />
            <mesh position={[0.1, shelfY + 0.09, 0.08]} material={sharedMaterials.stoneDark} castShadow>
              <cylinderGeometry args={[0.03 + index * 0.006, 0.04, 0.16 + index * 0.02, 20]} />
            </mesh>
          </group>
        ))}
        <Glow position={[0, 1.7, 0.29]} size={[tallW, 1.2]} on={led} strength={0.35} kind="radial" />
      </group>

      {/* Ilha com banquetas e pendente */}
      {island && (
        <group>
          <Slab size={[islandW, 0.76, 0.72]} position={[islandX, 0.48, islandZ]} material={finishMaterial} />
          <Slab size={[islandW - 0.1, 0.1, 0.6]} position={[islandX, 0.05, islandZ - 0.02]} material={sharedMaterials.dark} shadow={false} />
          <Slab size={[islandW + 0.1, 0.04, 0.98]} position={[islandX, 0.88, islandZ + 0.1]} material={sharedMaterials.stone} />
          <Led position={[islandX, 0.855, islandZ + 0.52]} size={[islandW - 0.1, 0.008, 0.01]} on={led} />
          <FloorGlow x={islandX} z={islandZ + 0.5} width={islandW + 0.4} on={led} />
          {[-0.6, 0, 0.6].map((offset) => (
            <Stool key={offset} x={islandX + offset} z={islandZ + 0.72} />
          ))}
          <Led position={[islandX, 2.1, islandZ]} size={[islandW * 0.8, 0.035, 0.035]} on power={1.1} />
          {[-1, 1].map((side) => (
            <mesh key={side} position={[islandX + side * islandW * 0.36, 2.9, islandZ]} material={sharedMaterials.dark}>
              <cylinderGeometry args={[0.003, 0.003, 1.6, 6]} />
            </mesh>
          ))}
          <LedLight position={[islandX, 1.9, islandZ + 0.1]} on intensity={1.6} distance={3} />
          {BOOK_COLORS.slice(0, 2).map((color, index) => (
            <mesh key={color} position={[islandX - 0.35 + index * 0.05, 0.915 + index * 0.025, islandZ + 0.1]} castShadow>
              <boxGeometry args={[0.26 - index * 0.04, 0.03, 0.18]} />
              <meshStandardMaterial color={color} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )}
    </group>
  );
};
