import { Carcass, Door, FloorGlow, Led, LedLight, Slab, type ModelProps } from "../parts";
import { sharedMaterials } from "../materials";

const CLOTHES = ["#3b4552", "#8a6f5a", "#d8d0c0", "#5d6b5a", "#2c2c30", "#a45f4a", "#c9b99a", "#46505f", "#6e5a7a"];

const PANEL = 0.018;
const HEIGHT = 2.5;
const DEPTH = 0.62;

export const WardrobeModel = ({ finishMaterial, handle, led, widthCm, open }: ModelProps) => {
  const width = widthCm / 100;
  const count = Math.max(3, Math.round(width / 0.55));
  const moduleW = width / count;
  const bodyH = HEIGHT - 0.1;
  const xOf = (index: number) => -width / 2 + moduleW * (index + 0.5);

  return (
    <group>
      <Slab size={[width - 0.04, 0.1, DEPTH - 0.1]} position={[0, 0.05, -0.04]} material={sharedMaterials.dark} shadow={false} />
      <Led position={[0, 0.012, DEPTH / 2 - 0.055]} size={[width - 0.1, 0.008, 0.01]} on={led} />
      <FloorGlow x={0} z={DEPTH / 2 + 0.2} width={width + 0.3} on={led} />

      <Carcass size={[width, bodyH, DEPTH]} position={[0, 0.1 + bodyH / 2, 0]} modules={count} endMaterial={finishMaterial} />
      {/* faixa que separa os maleiros das portas principais */}
      <Slab size={[width - 0.04, 0.018, DEPTH - 0.04]} position={[0, 2.0, 0]} material={sharedMaterials.interior} />

      {Array.from({ length: count }, (_, index) => {
        const x = xOf(index);
        const hanging = index % 2 === 0;
        return (
          <group key={`interior-${index}`}>
            {hanging ? (
              <>
                <mesh position={[x, 1.86, 0.02]} rotation={[0, 0, Math.PI / 2]} material={sharedMaterials.metal}>
                  <cylinderGeometry args={[0.012, 0.012, moduleW - 0.05, 12]} />
                </mesh>
                {Array.from({ length: 6 }, (_, cloth) => (
                  <mesh
                    key={cloth}
                    position={[x - moduleW / 2 + 0.07 + cloth * ((moduleW - 0.14) / 5), 1.4, 0.02]}
                    castShadow
                  >
                    <boxGeometry args={[0.03, 0.9 - (cloth % 3) * 0.08, 0.36]} />
                    <meshStandardMaterial color={CLOTHES[(index + cloth) % CLOTHES.length]} roughness={0.9} />
                  </mesh>
                ))}
              </>
            ) : (
              [0.5, 0.95, 1.4].map((shelfY, level) => (
                <group key={shelfY}>
                  <Slab size={[moduleW - PANEL, PANEL, DEPTH - 0.04]} position={[x, shelfY, 0.01]} material={sharedMaterials.interior} />
                  <mesh position={[x - 0.04, shelfY + 0.1, 0.02]} castShadow>
                    <boxGeometry args={[moduleW * 0.55, 0.18, 0.34]} />
                    <meshStandardMaterial color={CLOTHES[(index * 2 + level) % CLOTHES.length]} roughness={0.95} />
                  </mesh>
                </group>
              ))
            )}
            <Led position={[x, 1.975, DEPTH / 2 - 0.05]} size={[moduleW * 0.8, 0.008, 0.012]} on={led} power={0.9} />
          </group>
        );
      })}
      <LedLight position={[0, 2.3, DEPTH / 2 + 0.5]} on={led} intensity={0.9} distance={3} />

      {Array.from({ length: count }, (_, index) => {
        const x = xOf(index);
        const hinge = index % 2 === 0 ? "left" : "right";
        return (
          <group key={`doors-${index}`}>
            <Door
              id={`main-${index}`}
              size={[moduleW - 0.004, 1.9 - 0.004]}
              position={[x, 1.05, DEPTH / 2 + 0.012]}
              hinge={hinge}
              material={finishMaterial}
              handle={handle}
              open={open}
              handleY={0}
              handleLength={0.55}
            />
            <Door
              id={`top-${index}`}
              size={[moduleW - 0.004, 0.5 - 0.004]}
              position={[x, 2.25, DEPTH / 2 + 0.012]}
              hinge={hinge}
              material={finishMaterial}
              handle={handle}
              open={open}
              handleY={-0.08}
              handleLength={0.2}
            />
          </group>
        );
      })}
    </group>
  );
};

