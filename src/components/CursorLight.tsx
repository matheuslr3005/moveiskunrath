import { useEffect, useRef } from "react";

/**
 * Facho de luz quente que segue o mouse (só com mouse, nunca no toque).
 * É um elemento pequeno movido por transform, que roda na GPU: nada de repintar a tela inteira.
 */
export const CursorLight = () => {
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const light = node.current;
        if (!light) return;
        light.style.transform = `translate3d(${event.clientX - 320}px, ${event.clientY - 320}px, 0)`;
        light.style.opacity = "1";
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div
      ref={node}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-20 size-[640px] opacity-0 transition-opacity duration-700 will-change-transform"
      style={{ background: "radial-gradient(closest-side, rgb(247 205 72 / 0.075), transparent)" }}
    />
  );
};
