import { Canvas } from "@react-three/fiber";
import { Component, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useInView } from "../lib/hooks";
import { Effects } from "./Stage";
import type { V3 } from "./parts";

const supportsWebGL = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
};

type BoundaryProps = { fallback: ReactNode; children: ReactNode };

/** Se o WebGL falhar em tempo de execução, mostra a ilustração em vez de uma tela quebrada. */
class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

type SceneCanvasProps = {
  children: ReactNode;
  camera: { position: V3; fov: number };
  fallback: ReactNode;
  label: string;
  className?: string;
  /** Mantém renderizando mesmo fora da tela (ex.: scroll com seção "sticky"). */
  alwaysOn?: boolean;
};

export const SceneCanvas = ({ children, camera, fallback, label, className, alwaysOn = false }: SceneCanvasProps) => {
  const host = useRef<HTMLDivElement>(null);
  const inView = useInView(host, "150px");
  const webgl = useMemo(supportsWebGL, []);
  const coarse = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);

  return (
    <div ref={host} className={className} role="img" aria-label={label}>
      {webgl ? (
        <SceneBoundary fallback={fallback}>
          <Canvas
            shadows
            dpr={[1, coarse ? 1.4 : 1.8]}
            frameloop={alwaysOn || inView ? "always" : "never"}
            camera={{ position: camera.position, fov: camera.fov, near: 0.1, far: 60 }}
            gl={{ antialias: true, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}
          >
            {children}
            <Effects />
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
};
