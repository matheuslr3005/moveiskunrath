import { cn } from "../lib/cn";

type LogoProps = { className?: string; /** Fundo sempre escuro (ex.: capa): mantém o branco do logotipo nos dois temas. */ onDark?: boolean };

/** Recriação em texto do logotipo: "M" amarelo + ÓVEIS, KUNRATH em branco. */
export const Logo = ({ className, onDark = false }: LogoProps) => (
  <span
    className={cn("inline-flex items-end font-display leading-none select-none", className)}
    role="img"
    aria-label="Móveis Kunrath"
  >
    <span className="text-[2.1em] font-black text-accent">M</span>
    <span className="-ml-[0.34em] flex flex-col">
      <span className="ml-[0.9em] text-[0.62em] font-extrabold tracking-wide text-accent">ÓVEIS</span>
      <span className={cn("text-[1.15em] font-black tracking-wide", onDark ? "text-white" : "text-fg")}>KUNRATH</span>
    </span>
  </span>
);
