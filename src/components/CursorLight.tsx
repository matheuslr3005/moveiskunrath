import { useEffect, useRef } from "react";

/** Um facho de luz quente segue o mouse por todo o site (só com mouse, nunca no toque). */
export const CursorLight = () => {
  const node = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        node.current?.style.setProperty("--x", `${event.clientX}px`);
        node.current?.style.setProperty("--y", `${event.clientY}px`);
        node.current?.style.setProperty("opacity", "1");
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
      className="pointer-events-none fixed inset-0 z-20 opacity-0 transition-opacity duration-700"
      style={{
        background: "radial-gradient(520px circle at var(--x, 50%) var(--y, 50%), rgb(247 205 72 / 0.075), transparent 62%)",
        mixBlendMode: "screen",
      }}
    />
  );
};
