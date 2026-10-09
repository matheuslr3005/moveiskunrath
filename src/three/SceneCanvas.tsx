import { PerformanceMonitor } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Component, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as THREE from "three";
import { markReady } from "../lib/intro";
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

type BoundaryProps = { fallback: ReactNode; children: ReactNode; onFail: () => void };

/** Se o WebGL falhar em tempo de execução, mostra a ilustração em vez de uma tela quebrada. */
class SceneBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail();
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/** Degraus de qualidade: o PerformanceMonitor desce um degrau quando o FPS cai. */
const tiers = [
  { dprMax: 1, bloom: false },
  { dprMax: 1.25, bloom: true },
  { dprMax: 1.5, bloom: true },
] as const;

type SceneCanvasProps = {
  children: ReactNode;
  camera: { position: V3; fov: number };
  fallback: ReactNode;
  label: string;
  className?: string;
  /** Mantém renderizando mesmo fora da tela. */
  alwaysOn?: boolean;
  /** Avisa a intro quando o primeiro quadro já foi desenhado. */
  signalReady?: boolean;
};

export const SceneCanvas = ({ children, camera, fallback, label, className, alwaysOn = false, signalReady = false }: SceneCanvasProps) => {
  const host = useRef<HTMLDivElement>(null);
  const near = useInView(host, "1500px");
  const visible = useInView(host, "120px");
  const webgl = useMemo(supportsWebGL, []);
  const coarse = useMemo(() => window.matchMedia("(pointer: coarse)").matches, []);
  const [mounted, setMounted] = useState(false);
  const [tier, setTier] = useState(coarse ? 1 : 2);
  const [failed, setFailed] = useState(false);

  // Monta o 3D um pouco antes de aparecer: os shaders compilam fora da tela, sem travar a rolagem.
  useEffect(() => {
    if (near) setMounted(true);
  }, [near]);

  useEffect(() => {
    if (signalReady && (!webgl || failed)) markReady("scene");
  }, [signalReady, webgl, failed]);

  const quality = tiers[tier] ?? tiers[0];

  return (
    <div ref={host} className={className} role="img" aria-label={label}>
      {webgl && mounted && !failed ? (
        <SceneBoundary fallback={fallback} onFail={() => setFailed(true)}>
          <Canvas
            shadows
            dpr={[1, quality.dprMax]}
            frameloop={alwaysOn || visible ? "always" : "demand"}
            camera={{ position: camera.position, fov: camera.fov, near: 0.1, far: 60 }}
            gl={{ antialias: false, powerPreference: "high-performance", toneMapping: THREE.NoToneMapping }}
          >
            <PerformanceMonitor
              flipflops={2}
              onDecline={() => setTier((current) => Math.max(0, current - 1))}
              onIncline={() => setTier((current) => Math.min(coarse ? 1 : 2, current + 1))}
              onFallback={() => setTier(0)}
            />
            {children}
            <Effects bloom={quality.bloom} />
          </Canvas>
        </SceneBoundary>
      ) : (
        fallback
      )}
    </div>
  );
};
