import { Link } from "react-router";
import { HeroScene } from "../components/HeroScene";
import { Icon, type IconName } from "../components/Icon";
import { ProjectCard } from "../components/ProjectCard";
import { ProjectCover } from "../components/ProjectCover";
import { Seal } from "../components/Seal";
import { Reveal, Section, Toggle } from "../components/blocks";
import { categories } from "../data/categories";
import { company } from "../data/company";
import { featuredProjects, projects } from "../data/projects";
import { usePageTitle } from "../lib/hooks";

const heroTags = ["Sob medida", "Empresa familiar", `${company.yearsInMarket} anos de mercado`] as const;

const Hero = () => (
  <section className="relative isolate flex min-h-[100svh] flex-col justify-between overflow-hidden text-white [--btn-ink:#fff]">
    <div className="absolute inset-0 -z-10">
      <HeroScene />
      <div className="absolute inset-0 bg-gradient-to-r from-[#120e0b]/90 via-[#120e0b]/45 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#15120f] to-transparent" />
      <div className="grid-lines-dark absolute inset-0 hidden lg:block" />
    </div>

    <div className="mx-auto w-full max-w-[90rem] px-5 pt-36 sm:px-10 sm:pt-44">
      <p className="eyebrow !text-white/70">{company.segment}</p>
      <h1 className="display-xl mt-7 max-w-[11ch] sm:max-w-[13ch]">Não é sobre fazer projetos. É sobre realizar sonhos.</h1>
      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <Link to="/projetos" className="link-under">
          Explorar projetos <Icon name="arrow" className="size-3.5" />
        </Link>
        <Link to="/orcamento" className="btn">
          Pedir orçamento
        </Link>
      </div>
    </div>

    <div className="mx-auto flex w-full max-w-[90rem] flex-wrap gap-3 px-5 pb-10 sm:px-10">
      {heroTags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-white/35 px-4 py-2 text-[0.6875rem] uppercase tracking-[0.2em] backdrop-blur-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  </section>
);

type Feature = { icon: IconName; title: string; text: string };

const features: Feature[] = [
  { icon: "ruler", title: "Sob medida", text: "Cada medida pensada para o seu espaço e para a sua rotina." },
  { icon: "home", title: "Atendimento de perto", text: "Empresa familiar: você fala direto com quem cuida do projeto." },
  { icon: "sparkle", title: "Seu estilo de vida", text: "Cores, materiais e acabamentos escolhidos junto com você." },
  { icon: "seal", title: "Resultado sem estresse", text: "Do projeto à instalação, com acompanhamento em cada etapa." },
];

const Philosophy = () => {
  const cover = featuredProjects[0];

  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[90rem] md:grid-cols-2">
        <div className="flex flex-col justify-center gap-8 px-5 py-20 sm:px-10 lg:py-32 lg:pr-24">
          <Reveal>
            <p className="eyebrow">Nossa filosofia</p>
            <h2 className="display-lg mt-6">Um móvel bem feito começa em uma boa conversa.</h2>
            <p className="prose-block mt-8 max-w-md">
              Antes de desenhar, ouvimos como você vive, o que precisa guardar e o que faz aquele cantinho ser seu. É assim, em {company.yearsInMarket} anos de empresa familiar, que transformamos espaços em lugares que dão vontade de voltar.
            </p>
            <div className="mt-10 flex items-center gap-8">
              <Link to="/sobre" className="link-under">
                Conhecer a Kunrath
              </Link>
              <Seal className="size-24 shrink-0 text-muted" />
            </div>
          </Reveal>
        </div>
        {cover && (
          <div className="relative min-h-[22rem] border-t border-line md:border-l md:border-t-0">
            <div className="absolute inset-0">
              <ProjectCover project={cover} />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const Features = () => (
  <section className="border-b border-line">
    <div className="mx-auto grid max-w-[90rem] sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <Reveal key={feature.title} delay={index * 90} className="border-line px-5 py-12 sm:px-10 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0">
          <Icon name={feature.icon} className="size-7 text-accent-text" strokeWidth={1.2} />
          <h3 className="mt-6 text-[0.75rem] font-medium uppercase tracking-[0.2em]">{feature.title}</h3>
          <p className="mt-3 max-w-[16rem] text-sm font-light leading-relaxed text-muted">{feature.text}</p>
        </Reveal>
      ))}
    </div>
  </section>
);

const Rooms = () => (
  <ul className="border-t border-line">
    {categories.map((category, index) => {
      const count = projects.filter((project) => project.category === category.id).length;
      return (
        <li key={category.id} className="border-b border-line">
          <Link
            to={`/projetos?c=${category.id}`}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 py-7 transition-colors hover:text-accent-text sm:grid-cols-[4rem_1fr_1.2fr_auto] sm:py-9"
          >
            <span className="text-[0.6875rem] tracking-[0.2em] text-muted">0{index + 1}</span>
            <span className="font-display text-4xl font-light transition-transform duration-500 group-hover:translate-x-3 sm:text-6xl">
              {category.label}
            </span>
            <span className="hidden max-w-sm text-sm font-light text-muted sm:block">{category.blurb}</span>
            <span className="flex items-center gap-4 text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
              <span className="hidden sm:inline">{count} {count === 1 ? "projeto" : "projetos"}</span>
              <Icon name="arrow" className="size-5 transition-transform duration-500 group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      );
    })}
  </ul>
);

export const HomePage = () => {
  usePageTitle(null);

  return (
    <>
      <Hero />
      <Philosophy />
      <Features />

      <div className="mx-auto max-w-[90rem] px-5 pb-28 sm:px-10">
        <Section title="Ambientes" overline="O que fazemos">
          <Rooms />
        </Section>

        <Section
          title="Projetos em destaque"
          overline="Seleção"
          action={
            <Link to="/projetos" className="link-under hidden sm:inline-flex">
              Ver todos
            </Link>
          }
        >
          <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.slice(0, 3).map((project, index) => (
              <Reveal key={project.slug} delay={index * 100}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </Section>

        <section className="mt-24 grid gap-12 sm:mt-32 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-5">Dúvidas</p>
            <h2 className="display-lg">Antes de começar</h2>
          </div>
          <div className="border-t border-line">
            <Toggle title="O que é um móvel sob medida?">
              É um móvel projetado para o seu espaço e para o seu uso: medidas, divisões, cores e acabamentos são definidos com você, em vez de se adaptar a um modelo pronto.
            </Toggle>
            <Toggle title="Quais ambientes vocês atendem?">
              Cozinhas, dormitórios, banheiros, painéis e projetos comerciais. Se o seu projeto é diferente, é só contar no orçamento.
            </Toggle>
            <Toggle title="Como peço um orçamento?">
              Monte o pedido na página de Orçamento e envie direto pelo WhatsApp. Se curtiu projetos do site, eles vão junto na mensagem.
            </Toggle>
          </div>
        </section>

        <Reveal className="mt-24 sm:mt-32">
          <div className="grid-lines border-y border-line py-20 text-center">
            <p className="eyebrow mb-6 justify-center">Vamos conversar</p>
            <h2 className="display-lg mx-auto max-w-2xl">Conte o que você imagina. A gente cuida do resto.</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/orcamento" className="btn btn-primary">
                Pedir orçamento
              </Link>
              <Link to="/contato" className="btn">
                Falar com a Kunrath
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
};
