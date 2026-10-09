import { useEffect } from "react";
import type { ThreeEvent } from "@react-three/fiber";

/** Cursor de mãozinha ao passar o mouse em objetos clicáveis do 3D. */
export const useHoverCursorEvents = () => {
  useEffect(
    () => () => {
      document.body.style.cursor = "";
    },
    [],
  );

  return {
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "";
    },
  };
};
