import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { categories } from "../data/categories";
import { company } from "../data/company";
import { buildWhatsAppUrl, genericGreeting } from "../lib/whatsapp";
import { CommandPalette } from "./CommandPalette";
import { SiteHeader } from "./SiteHeader";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
};

const FooterColumn = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <p className="eyebrow mb-5">{title}</p>
    <ul className="space-y-3 text-sm font-light">{children}</ul>
  </div>
);

const Footer = () => (
  <footer className="border-t border-line">
    <div className="grid-lines mx-auto max-w-[90rem] px-5 py-16 sm:px-10">
      <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-5">
          <Logo className="text-xl" />
          <p className="max-w-xs font-display text-2xl font-light leading-tight">{company.slogan}</p>
        </div>
        <FooterColumn title="Ambientes">
          {categories.map((category) => (
            <li key={category.id}>
              <Link to={`/projetos?c=${category.id}`} className="text-muted transition-colors hover:text-fg">
                {category.label}
              </Link>
            </li>
          ))}
        </FooterColumn>
        <FooterColumn title="Site">
          <li><Link to="/projetos" className="text-muted transition-colors hover:text-fg">Projetos</Link></li>
          <li><Link to="/sobre" className="text-muted transition-colors hover:text-fg">Sobre</Link></li>
          <li><Link to="/como-funciona" className="text-muted transition-colors hover:text-fg">Como funciona</Link></li>
          <li><Link to="/orcamento" className="text-muted transition-colors hover:text-fg">Orçamento</Link></li>
        </FooterColumn>
        <FooterColumn title="Contato">
          <li>
            <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
              <Icon name="whatsapp" className="size-4" /> {company.whatsapp.display}
            </a>
          </li>
          <li>
            <a href={company.instagram.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-muted transition-colors hover:text-fg">
              <Icon name="instagram" className="size-4" /> {company.instagram.handle}
            </a>
          </li>
        </FooterColumn>
      </div>
    </div>
    <div className="border-t border-line px-5 py-5 text-center text-[0.6875rem] uppercase tracking-[0.2em] text-muted sm:px-10">
      © {new Date().getFullYear()} {company.name} · {company.segment}
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
  const [paletteOpen, setPaletteOpen] = useState(false);

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
    <div className="flex min-h-dvh flex-col">
      <ScrollToTop />
      <SiteHeader onSearch={() => setPaletteOpen(true)} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFab />
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
};
