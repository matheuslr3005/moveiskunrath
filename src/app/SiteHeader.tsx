import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { categories } from "../data/categories";
import { cn } from "../lib/cn";
import { useFavorites } from "../lib/favorites";

const navItems = [
  { to: "/montar", label: "Monte em 3D" },
  { to: "/projetos", label: "Projetos" },
  { to: "/como-funciona", label: "Como funciona" },
  { to: "/contato", label: "Contato" },
] as const;

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "relative py-2 text-[0.6875rem] font-medium uppercase tracking-[0.22em] transition-colors",
    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300",
    "hover:after:scale-x-100",
    isActive && "after:scale-x-100",
  );

const useScrolled = (threshold: number): boolean => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
};

type SiteHeaderProps = { onSearch: () => void };

export const SiteHeader = ({ onSearch }: SiteHeaderProps) => {
  const { pathname } = useLocation();
  const favorites = useFavorites();
  const scrolled = useScrolled(24);
  const [menuOpen, setMenuOpen] = useState(false);

  const overHero = pathname === "/" && !scrolled && !menuOpen;

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setMenuOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500",
          overHero
            ? "border-b border-transparent text-white [--btn-ink:#fff]"
            : "border-b border-line bg-bg/80 text-fg backdrop-blur-md",
        )}
      >
        <div className="mx-auto flex h-[4.5rem] max-w-[90rem] items-center gap-6 px-5 sm:px-10">
          <Link to="/" aria-label="Móveis Kunrath, início" className="text-base">
            <Logo onDark={overHero} />
          </Link>

          <nav aria-label="Principal" className="ml-auto hidden items-center gap-9 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            <button type="button" onClick={onSearch} aria-label="Buscar" className="btn btn-ghost size-10 !min-h-0 !p-0">
              <Icon name="search" className="size-[1.125rem]" />
            </button>
            <Link to="/orcamento" className="btn ml-2 hidden !min-h-10 sm:inline-flex">
              Orçamento
              {favorites.slugs.length > 0 && (
                <span className="rounded-full bg-accent px-1.5 py-px text-[0.625rem] tabular-nums tracking-normal text-accent-ink">
                  {favorites.slugs.length}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="btn btn-ghost size-10 !min-h-0 !p-0 lg:hidden"
            >
              <Icon name="menu" className="size-5" />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="pop-in fixed inset-0 z-50 flex flex-col overflow-y-auto bg-bg px-6 pb-10 pt-5 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo className="text-base" />
            <button type="button" onClick={() => setMenuOpen(false)} aria-label="Fechar menu" className="btn btn-ghost size-10 !min-h-0 !p-0">
              <Icon name="close" className="size-5" />
            </button>
          </div>

          <nav aria-label="Menu" className="mt-12 flex flex-col">
            {[{ to: "/", label: "Início" }, ...navItems, { to: "/orcamento", label: "Orçamento" }].map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex items-baseline gap-4 border-b border-line py-4 font-display text-4xl font-light",
                    isActive && "text-accent-text",
                  )
                }
              >
                <span className="font-sans text-[0.6875rem] tracking-[0.2em] text-muted">0{index + 1}</span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <p className="eyebrow mt-10">Ambientes</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link key={category.id} to={`/projetos?c=${category.id}`} className="chip">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
};
