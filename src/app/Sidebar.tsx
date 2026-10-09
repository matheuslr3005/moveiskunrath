import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { categories } from "../data/categories";
import { projects } from "../data/projects";
import { cn } from "../lib/cn";
import { useFavorites } from "../lib/favorites";

type NavItem = { to: string; label: string; emoji: string; end?: boolean };

const topItems: NavItem[] = [{ to: "/", label: "Início", emoji: "🏠", end: true }];
const bottomItems: NavItem[] = [
  { to: "/sobre", label: "Sobre a Kunrath", emoji: "🪵" },
  { to: "/como-funciona", label: "Como funciona", emoji: "🧭" },
  { to: "/orcamento", label: "Orçamento", emoji: "📝" },
  { to: "/contato", label: "Contato", emoji: "💬" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex min-h-9 items-center gap-2.5 rounded-md px-2.5 text-sm transition-colors",
    isActive ? "bg-hover font-semibold text-fg" : "text-muted hover:bg-hover hover:text-fg",
  );

const ItemLink = ({ item, badge }: { item: NavItem; badge?: number }) => (
  <NavLink to={item.to} end={item.end} className={linkClass}>
    <span className="w-5 text-center" aria-hidden="true">
      {item.emoji}
    </span>
    <span className="flex-1 truncate">{item.label}</span>
    {badge ? (
      <span className="rounded-full bg-accent px-1.5 text-xs font-bold tabular-nums text-accent-ink">{badge}</span>
    ) : null}
  </NavLink>
);

type SidebarProps = { open: boolean; onClose: () => void; onSearch: () => void };

export const Sidebar = ({ open, onClose, onSearch }: SidebarProps) => {
  const location = useLocation();
  const favorites = useFavorites();
  const [projectsOpen, setProjectsOpen] = useState(true);
  const activeCategory = new URLSearchParams(location.search).get("c");
  const onProjects = location.pathname.startsWith("/projetos");

  return (
    <>
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-black/60 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-line bg-bg transition-transform duration-300 ease-out",
          "lg:sticky lg:top-0 lg:z-auto lg:h-dvh lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Navegação principal"
      >
        <div className="flex items-center justify-between px-4 pb-3 pt-5">
          <Link to="/" aria-label="Móveis Kunrath, início" className="text-lg">
            <Logo />
          </Link>
          <button type="button" onClick={onClose} aria-label="Fechar menu" className="btn btn-ghost size-9 !p-0 lg:hidden">
            <Icon name="close" className="size-5" />
          </button>
        </div>

        <div className="px-3 pb-2">
          <button
            type="button"
            onClick={onSearch}
            className="flex min-h-9 w-full items-center gap-2.5 rounded-md border border-line px-2.5 text-sm text-muted transition-colors hover:bg-hover hover:text-fg"
          >
            <Icon name="search" className="size-4" />
            <span className="flex-1 text-left">Buscar</span>
            <kbd className="rounded border border-line px-1.5 text-[0.7rem]">Ctrl K</kbd>
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 pb-6 pt-2">
          {topItems.map((item) => (
            <ItemLink key={item.to} item={item} />
          ))}

          <div>
            <div className="flex items-center">
              <div className="flex-1">
                <ItemLink item={{ to: "/projetos", label: "Projetos", emoji: "🖼️", end: true }} />
              </div>
              <button
                type="button"
                aria-label={projectsOpen ? "Recolher ambientes" : "Mostrar ambientes"}
                aria-expanded={projectsOpen}
                onClick={() => setProjectsOpen((value) => !value)}
                className="flex size-8 items-center justify-center rounded-md text-muted hover:bg-hover hover:text-fg"
              >
                <Icon name="chevron" className={cn("size-4 transition-transform", projectsOpen && "rotate-90")} />
              </button>
            </div>
            {projectsOpen && (
              <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-line pl-2">
                {categories.map((category) => {
                  const count = projects.filter((project) => project.category === category.id).length;
                  const active = onProjects && activeCategory === category.id;
                  return (
                    <li key={category.id}>
                      <Link
                        to={`/projetos?c=${category.id}`}
                        className={cn(
                          "flex min-h-8 items-center gap-2 rounded-md px-2 text-[0.8125rem] transition-colors",
                          active ? "bg-hover font-semibold text-fg" : "text-muted hover:bg-hover hover:text-fg",
                        )}
                      >
                        <span aria-hidden="true">{category.emoji}</span>
                        <span className="flex-1 truncate">{category.label}</span>
                        <span className="text-xs tabular-nums opacity-70">{count}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {bottomItems.map((item) => (
            <ItemLink key={item.to} item={item} badge={item.to === "/orcamento" ? favorites.slugs.length : undefined} />
          ))}
        </nav>

        <div className="border-t border-line p-4 text-xs leading-relaxed text-muted">
          Empresa familiar · 12 anos de mercado
        </div>
      </aside>
    </>
  );
};
