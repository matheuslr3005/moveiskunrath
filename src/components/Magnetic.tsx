import { useRef, type ReactNode } from "react";

/** O conteúdo "puxa" em direção ao cursor, como um ímã. */
export const Magnetic = ({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) => {
  const node = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={node}
      className="inline-block transition-transform duration-200 ease-out"
      onPointerMove={(event) => {
        const target = node.current;
        if (!target || event.pointerType !== "mouse") return;
        const box = target.getBoundingClientRect();
        const x = (event.clientX - (box.left + box.width / 2)) * strength;
        const y = (event.clientY - (box.top + box.height / 2)) * strength;
        target.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onPointerLeave={() => {
        if (node.current) node.current.style.transform = "";
      }}
    >
      {children}
    </div>
  );
};
