import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useReveal } from "../lib/hooks";
import { Icon } from "./Icon";

type CssVars = CSSProperties & { [key: `--${string}`]: string };

type RevealProps = { children: ReactNode; delay?: number; className?: string };

export const Reveal = ({ children, delay = 0, className }: RevealProps) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const style: CssVars = { "--reveal-delay": `${delay}ms` };
  return (
    <div
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={style}
    >
      {children}
    </div>
  );
};

type CalloutProps = { children: ReactNode; className?: string };

/** Citação em serifa com filete amarelo, no lugar do callout com emoji. */
export const Callout = ({ children, className }: CalloutProps) => (
  <blockquote className={cn("border-l border-accent pl-6 font-display text-2xl font-light leading-snug sm:text-3xl", className)}>
    {children}
  </blockquote>
);

type ToggleProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
};

/** Bloco que abre e fecha, como um "toggle" de documento. */
export const Toggle = ({ title, children, defaultOpen = false }: ToggleProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-line">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 py-6 text-left transition-colors hover:text-accent-text"
      >
        <span className="font-display text-2xl font-light sm:text-3xl">{title}</span>
        <Icon name="close" className={cn("size-5 shrink-0 transition-transform duration-300", !open && "rotate-45")} />
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="prose-block max-w-2xl pb-7" inert={!open}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export type Property = { label: string; value: ReactNode };

/** Lista de propriedades em linhas finas. */
export const PropertyTable = ({ items }: { items: Property[] }) => (
  <dl className="divide-y divide-line border-y border-line text-sm">
    {items.map((item) => (
      <div key={item.label} className="grid grid-cols-[8rem_1fr] items-center gap-4 py-4 sm:grid-cols-[11rem_1fr]">
        <dt className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">{item.label}</dt>
        <dd className="min-w-0 font-light">{item.value}</dd>
      </div>
    ))}
  </dl>
);

type SectionProps = { title: string; overline?: string; children: ReactNode; action?: ReactNode };

export const Section = ({ title, overline, children, action }: SectionProps) => (
  <section className="mt-24 sm:mt-32">
    <div className="mb-10 flex items-end justify-between gap-6">
      <div>
        {overline && <p className="eyebrow mb-5">{overline}</p>}
        <h2 className="display-lg">{title}</h2>
      </div>
      {action}
    </div>
    {children}
  </section>
);
