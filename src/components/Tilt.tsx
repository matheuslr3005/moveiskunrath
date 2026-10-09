import { useRef, type ReactNode } from "react";
import { cn } from "../lib/cn";

/** Inclina em 3D seguindo o mouse (só com mouse; no toque fica parado). */
export const Tilt = ({ children, className, max = 7 }: { children: ReactNode; className?: string; max?: number }) => {
  const node = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={node}
      className={cn("transition-transform duration-200 ease-out will-change-transform", className)}
      style={{ transformStyle: "preserve-3d" }}
      onPointerMove={(event) => {
        const target = node.current;
        if (!target || event.pointerType !== "mouse") return;
        const box = target.getBoundingClientRect();
        const px = (event.clientX - box.left) / box.width - 0.5;
        const py = (event.clientY - box.top) / box.height - 0.5;
        target.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg) scale(1.025)`;
      }}
      onPointerLeave={() => {
        if (node.current) node.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
};
