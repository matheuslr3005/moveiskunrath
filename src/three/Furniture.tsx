import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import type { FurnitureConfig, FurnitureKind } from "./config";
import { getBodyMaterial } from "./materials";
import { KitchenModel } from "./models/KitchenModel";
import { TvPanelModel } from "./models/TvPanelModel";
import { VanityModel } from "./models/VanityModel";
import { WardrobeModel } from "./models/WardrobeModel";
import type { OpenState } from "./openState";
import type { ModelProps } from "./parts";

/** Posição (z) da parede dos fundos de cada móvel, para o Stage. */
export const wallZFor = (kind: FurnitureKind): number => {
  switch (kind) {
    case "cozinha":
      return -0.3;
    case "guarda-roupa":
      return -0.32;
    case "painel-tv":
      return -0.04;
    case "banheiro":
      return -0.24;
  }
};

type FurnitureProps = {
  config: FurnitureConfig;
  open: Pick<OpenState, "isOpen" | "toggle">;
  island?: boolean;
};

/** Entra "crescendo" e dá um pulinho quando o acabamento muda. */
export const Furniture = ({ config, open, island = true }: FurnitureProps) => {
  const group = useRef<THREE.Group>(null);
  const scale = useRef(0.9);

  useEffect(() => {
    scale.current = 1.022;
  }, [config.finish, config.handle]);

  useFrame((_, delta) => {
    scale.current = THREE.MathUtils.damp(scale.current, 1, 7, delta);
    group.current?.scale.setScalar(scale.current);
  });

  const common: ModelProps = {
    finishMaterial: getBodyMaterial(config.finish),
    handle: config.handle,
    led: config.led,
    widthCm: config.widthCm,
    open,
  };

  return (
    <group ref={group}>
      {config.kind === "cozinha" && <KitchenModel {...common} island={island} />}
      {config.kind === "guarda-roupa" && <WardrobeModel {...common} />}
      {config.kind === "painel-tv" && <TvPanelModel {...common} />}
      {config.kind === "banheiro" && <VanityModel {...common} />}
    </group>
  );
};
