import { lazy, Suspense } from "react";
import { Link } from "react-router";
import { HeroScene } from "../components/HeroScene";
import { Icon } from "../components/Icon";
import { Magnetic } from "../components/Magnetic";
import { Reveal } from "../components/blocks";
import { categories } from "../data/categories";
import { company } from "../data/company";
import { Configurator } from "../features/Configurator";
import { ProjectRing } from "../features/ProjectRing";
import { StoryScroll } from "../features/StoryScroll";
import { usePageTitle } from "../lib/hooks";
import { buildWhatsAppUrl, genericGreeting } from "../lib/whatsapp";

const Hero3D = lazy(() => import("../three/Hero3D").then((module) => ({ default: module.Hero3D })));

const Hero = () => (
  <section className="relative isolate h-svh min-h-[40rem] overflow-hidden text-white [--btn-ink:#fff]">
    <Suspense
      fallback={
        <div className="absolute inset-0">
          <HeroScene />
        </div>
      }
    >
      <Hero3D />
    </Suspense>
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0d0a08]/85 via-[#0d0a08]/30 to-transparent" />
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />

    <div className="pointer-events-none relative z-10 mx-auto flex h-full max-w-[90rem] flex-col justify-end px-5 pb-20 sm:justify-center sm:px-10 sm:pb-0">
      <p className="eyebrow !text-white/70">Móveis sob medida · estúdio 3D</p>
      <h1 className="display-xl mt-6 max-w-[11ch] sm:max-w-[10ch]">Abra as portas do seu futuro móvel.</h1>
      <p className="mt-6 max-w-md text-base font-light leading-relaxed text-white/75 sm:text-lg">
        Mexa em tudo: portas, gavetas, acabamento, LED. Depois peça o seu, feito sob medida.
      </p>
      <div className="pointer-events-auto mt-9 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Magnetic>
          <Link to="/montar" className="btn btn-primary min-h-14 px-8 !text-xs">
            Monte o seu em 3D <Icon name="arrow" className="size-4" />
          </Link>
        </Magnetic>
        <Link to="/projetos" className="link-under">
          Ver projetos
        </Link>
      </div>
    </div>

    <div className="pointer-events-none absolute bottom-8 right-5 z-10 hidden items-center gap-3 rounded-full border border-white/15 bg-black/40 px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] backdrop-blur sm:flex sm:right-28">
      <span className="hint-dot" /> Clique nos armários
    </div>
  </section>
);

const Marquee = () => {
  const words = [...categories.map((category) => category.label), "Sob medida", "Projeto 3D"];
  const row = (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {words.map((word, index) => (
        <span key={word} className="flex items-center">
          <span className={index % 2 ? "outline-text" : "text-fg"}>{word}</span>
          <span className="mx-8 text-accent sm:mx-12">✦</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee overflow-hidden border-y border-line py-6 font-display text-5xl font-semibold uppercase tracking-tight sm:py-8 sm:text-7xl" role="presentation">
      <div className="marquee-track">
        {row}
        {row}
      </div>
    </div>
  );
};

export const HomePage = () => {
  usePageTitle(null);

  return (
    <>
      <Hero />
      <Marquee />

      <section id="montar" className="scroll-mt-20 pt-24 sm:pt-32">
        <Reveal className="mx-auto max-w-[90rem] px-5 pb-10 sm:px-10">
          <p className="eyebrow">Estúdio 3D</p>
          <h2 className="display-xl mt-6 max-w-4xl">Monte o seu. Gire. Abra. Acenda.</h2>
          <p className="prose-block mt-6 max-w-xl">
            Escolha o móvel, ajuste a largura, troque o acabamento e veja a luz do LED mudar o ambiente. Quando gostar, o pedido segue pronto para o WhatsApp.
          </p>
        </Reveal>
        <Configurator />
      </section>

      <section className="pt-24 sm:pt-32">
        <StoryScroll />
      </section>

      <section className="pt-24 sm:pt-32">
        <Reveal className="mx-auto flex max-w-[90rem] flex-wrap items-end justify-between gap-6 px-5 pb-6 sm:px-10">
          <div>
            <p className="eyebrow">Projetos</p>
            <h2 className="display-xl mt-6">Gire a galeria.</h2>
          </div>
          <Link to="/projetos" className="link-under">
            Ver todos os projetos
          </Link>
        </Reveal>
        <ProjectRing />
      </section>

      <section className="px-5 py-28 sm:px-10 sm:py-40">
        <Reveal className="mx-auto max-w-[90rem] text-center">
          <p className="eyebrow justify-center">Vamos conversar</p>
          <h2 className="display-xl mx-auto mt-6 max-w-5xl">{company.slogan}</h2>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-5">
            <Magnetic>
              <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="btn btn-primary min-h-14 px-8 !text-xs">
                <Icon name="whatsapp" className="size-5" /> Falar no WhatsApp
              </a>
            </Magnetic>
            <Magnetic>
              <Link to="/orcamento" className="btn min-h-14 px-8 !text-xs">
                Pedir orçamento
              </Link>
            </Magnetic>
          </div>
        </Reveal>
      </section>
    </>
  );
};
