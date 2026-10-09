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

type CalloutProps = { emoji: string; children: ReactNode; className?: string };

export const Callout = ({ emoji, children, className }: CalloutProps) => (
  <div
    className={cn(
      "flex gap-3 rounded-xl border border-line bg-elev p-4 sm:p-5",
      "border-l-4 border-l-accent",
      className,
    )}
  >
    <span className="text-2xl leading-none" aria-hidden="true">
      {emoji}
    </span>
    <div className="prose-block min-w-0 !text-base">{children}</div>
  </div>
);

type ToggleProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  lead?: ReactNode;
};

/** Bloco "toggle" do Notion: título clicável que expande o conteúdo. */
export const Toggle = ({ title, children, defaultOpen = false, lead }: ToggleProps) => {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 rounded-md px-1 py-3.5 text-left transition-colors hover:bg-hover"
      >
        <Icon
          name="chevron"
          className={cn("size-4 shrink-0 text-muted transition-transform", open && "rotate-90")}
        />
        {lead}
        <span className="font-medium">{title}</span>
      </button>
      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="prose-block pb-4 pl-8 pr-2" inert={!open}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export type Property = { label: string; value: ReactNode };

/** Tabela de propriedades de página, como no Notion. */
export const PropertyTable = ({ items }: { items: Property[] }) => (
  <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-elev text-sm">
    {items.map((item) => (
      <div key={item.label} className="grid grid-cols-[7.5rem_1fr] gap-3 px-4 py-2.5 sm:grid-cols-[10rem_1fr]">
        <dt className="text-muted">{item.label}</dt>
        <dd className="min-w-0 font-medium">{item.value}</dd>
      </div>
    ))}
  </dl>
);

type SectionProps = { title: string; emoji?: string; children: ReactNode; action?: ReactNode };

export const Section = ({ title, emoji, children, action }: SectionProps) => (
  <section className="mt-14">
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className="text-2xl font-extrabold tracking-tight">
        {emoji && <span className="mr-2">{emoji}</span>}
        {title}
      </h2>
      {action}
    </div>
    {children}
  </section>
);
