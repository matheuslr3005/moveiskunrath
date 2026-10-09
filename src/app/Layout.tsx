import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Icon } from "../components/Icon";
import { company } from "../data/company";
import { useTheme } from "../lib/hooks";
import { buildWhatsAppUrl, genericGreeting } from "../lib/whatsapp";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const TopBar = ({ onMenu, onSearch }: { onMenu: () => void; onSearch: () => void }) => {
  const { theme, toggle } = useTheme();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg/85 px-3 backdrop-blur sm:px-6">
      <button type="button" onClick={onMenu} aria-label="Abrir menu" className="btn btn-ghost size-10 !p-0 lg:hidden">
        <Icon name="menu" className="size-5" />
      </button>
      <div className="flex-1" />
      <button type="button" onClick={onSearch} aria-label="Buscar" className="btn btn-ghost size-10 !p-0">
        <Icon name="search" className="size-5" />
      </button>
      <button
        type="button"
        onClick={toggle}
        aria-label={theme === "dark" ? "Mudar para tema claro" : "Mudar para tema escuro"}
        className="btn btn-ghost size-10 !p-0"
      >
        <Icon name={theme === "dark" ? "sun" : "moon"} className="size-5" />
      </button>
      <Link to="/orcamento" className="btn btn-primary">
        Pedir orçamento
      </Link>
    </header>
  );
};

const Footer = () => (
  <footer className="border-t border-line px-5 py-10 text-sm text-muted sm:px-10">
    <div className="mx-auto flex max-w-[56rem] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p>
        © {new Date().getFullYear()} {company.name} · {company.segment}
      </p>
      <div className="flex gap-5">
        <a href={company.instagram.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
          <Icon name="instagram" className="size-4" /> {company.instagram.handle}
        </a>
        <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-fg">
          <Icon name="whatsapp" className="size-4" /> {company.whatsapp.display}
        </a>
      </div>
    </div>
  </footer>
);

const WhatsAppFab = () => (
  <a
    href={buildWhatsAppUrl(genericGreeting)}
    target="_blank"
    rel="noreferrer"
    aria-label="Falar no WhatsApp"
    className="fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-white shadow-[var(--shadow)] transition-transform hover:scale-105 active:scale-95"
  >
    <Icon name="whatsapp" className="size-7" />
  </a>
);

export const Layout = () => {
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => setDrawerOpen(false), [location.pathname, location.search]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen((value) => !value);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex min-h-dvh">
      <ScrollToTop />
      <Sidebar
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onSearch={() => {
          setDrawerOpen(false);
          setPaletteOpen(true);
        }}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenu={() => setDrawerOpen(true)} onSearch={() => setPaletteOpen(true)} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
      <WhatsAppFab />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
};
