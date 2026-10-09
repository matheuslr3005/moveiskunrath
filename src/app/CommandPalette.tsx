import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { categories, categoryById } from "../data/categories";
import { projects } from "../data/projects";
import { cn } from "../lib/cn";
import { normalize } from "../lib/text";

type Entry = { id: string; label: string; hint: string; to: string };

const pageEntries: Entry[] = [
  { id: "home", label: "Início", hint: "Página", to: "/" },
  { id: "projects", label: "Todos os projetos", hint: "Página", to: "/projetos" },
  { id: "about", label: "Sobre a Kunrath", hint: "Página", to: "/sobre" },
  { id: "process", label: "Como funciona", hint: "Página", to: "/como-funciona" },
  { id: "quote", label: "Pedir orçamento", hint: "Página", to: "/orcamento" },
  { id: "contact", label: "Contato", hint: "Página", to: "/contato" },
];

const categoryEntries: Entry[] = categories.map((category) => ({
  id: `cat-${category.id}`,
  label: category.label,
  hint: "Ambiente",
  to: `/projetos?c=${category.id}`,
}));

const projectEntries: Entry[] = projects.map((project) => ({
  id: `project-${project.slug}`,
  label: project.title,
  hint: categoryById[project.category].singular,
  to: `/projetos/${project.slug}`,
}));

const allEntries = [...pageEntries, ...categoryEntries, ...projectEntries];

type CommandPaletteProps = { open: boolean; onClose: () => void };

export const CommandPalette = ({ open, onClose }: CommandPaletteProps) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);

  const results = useMemo(() => {
    const needle = normalize(query.trim());
    if (!needle) return allEntries.slice(0, 9);
    return allEntries.filter((entry) => normalize(`${entry.label} ${entry.hint}`).includes(needle)).slice(0, 12);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    setQuery("");
    setCursor(0);
    inputRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const go = (entry: Entry | undefined) => {
    if (!entry) return;
    navigate(entry.to);
    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") onClose();
    else if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor((value) => Math.min(value + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor((value) => Math.max(value - 1, 0));
    } else if (event.key === "Enter") go(results[cursor]);
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar no site"
        onMouseDown={(event) => event.stopPropagation()}
        onKeyDown={onKeyDown}
        className="pop-in w-full max-w-xl overflow-hidden rounded-lg border border-line bg-elev shadow-[var(--shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Icon name="search" className="size-5 text-muted" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setCursor(0);
            }}
            placeholder="Buscar projetos, ambientes e páginas…"
            aria-label="Buscar"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <kbd className="rounded border border-line px-1.5 text-xs text-muted">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">Nada encontrado.</li>}
          {results.map((entry, index) => (
            <li key={entry.id}>
              <button
                type="button"
                onMouseEnter={() => setCursor(index)}
                onClick={() => go(entry)}
                className={cn(
                  "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm",
                  index === cursor && "bg-hover",
                )}
              >
                <span className="flex-1 truncate font-medium">{entry.label}</span>
                <span className="text-xs text-muted">{entry.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
