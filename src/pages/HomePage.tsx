import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Logo } from "../components/Logo";
import { Page } from "../components/Page";
import { ProjectCard } from "../components/ProjectCard";
import { Callout, PropertyTable, Reveal, Section, Toggle } from "../components/blocks";
import { categories } from "../data/categories";
import { company } from "../data/company";
import { featuredProjects, projects } from "../data/projects";
import { buildWhatsAppUrl, genericGreeting } from "../lib/whatsapp";

const HomeCover = () => (
  <div className="page-cover flex size-full items-center px-8 sm:px-14">
    <Logo onDark className="text-3xl sm:text-5xl" />
  </div>
);

export const HomePage = () => (
  <Page
    title={company.name}
    emoji="🪑"
    documentTitle={null}
    cover={<HomeCover />}
    description="Móveis sob medida pensados para o seu jeito de viver e trabalhar: cozinhas, dormitórios, banheiros, painéis e projetos comerciais."
  >
    <div className="mt-6 flex flex-wrap gap-3">
      <Link to="/projetos" className="btn btn-primary min-h-11 px-5">
        Ver projetos <Icon name="arrow" className="size-4" />
      </Link>
      <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="btn min-h-11 px-5">
        <Icon name="whatsapp" className="size-4" /> Chamar no WhatsApp
      </a>
    </div>

    <Reveal className="mt-10">
      <PropertyTable
        items={[
          { label: "Segmento", value: company.segment },
          { label: "Tipo", value: "Empresa familiar" },
          { label: "Tempo de mercado", value: `${company.yearsInMarket} anos` },
          {
            label: "Ambientes",
            value: (
              <span className="flex flex-wrap gap-1.5">
                {categories.map((category) => (
                  <span key={category.id} className="tag">
                    {category.label}
                  </span>
                ))}
              </span>
            ),
          },
          {
            label: "Instagram",
            value: (
              <a href={company.instagram.url} target="_blank" rel="noreferrer" className="text-accent-text underline-offset-4 hover:underline">
                {company.instagram.handle}
              </a>
            ),
          },
        ]}
      />
    </Reveal>

    <Reveal className="mt-8">
      <Callout emoji="❤️">
        <p className="text-lg font-semibold leading-snug text-fg">“{company.slogan}”</p>
      </Callout>
    </Reveal>

    <Section title="Ambientes" emoji="🧩">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {categories.map((category, index) => {
          const count = projects.filter((project) => project.category === category.id).length;
          return (
            <Reveal key={category.id} delay={index * 60}>
              <Link to={`/projetos?c=${category.id}`} className="card flex h-full flex-col gap-2 p-4">
                <span className="text-3xl" aria-hidden="true">
                  {category.emoji}
                </span>
                <span className="font-bold">{category.label}</span>
                <span className="text-sm text-muted">{category.blurb}</span>
                <span className="mt-auto pt-1 text-xs text-muted">
                  {count} {count === 1 ? "projeto" : "projetos"}
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </Section>

    <Section
      title="Projetos em destaque"
      emoji="⭐"
      action={
        <Link to="/projetos" className="text-sm font-semibold text-accent-text hover:underline">
          Ver todos
        </Link>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {featuredProjects.slice(0, 4).map((project, index) => (
          <Reveal key={project.slug} delay={(index % 2) * 80}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>

    <Section title="Dúvidas rápidas" emoji="💡">
      <div className="rounded-xl border border-line bg-elev px-3">
        <Toggle title="O que é um móvel sob medida?">
          É um móvel projetado para o seu espaço e para o seu uso: medidas, divisões, cores e acabamentos são definidos com você, em vez de se adaptar a um modelo pronto.
        </Toggle>
        <Toggle title="Quais ambientes vocês atendem?">
          Cozinhas, dormitórios, banheiros, painéis e projetos comerciais. Se o seu projeto é diferente, é só contar no orçamento.
        </Toggle>
        <Toggle title="Como peço um orçamento?">
          Monte o pedido na página de{" "}
          <Link to="/orcamento" className="font-semibold text-accent-text hover:underline">
            Orçamento
          </Link>{" "}
          e envie direto pelo WhatsApp. Se curtiu projetos do site, eles vão junto na mensagem.
        </Toggle>
      </div>
    </Section>

    <Reveal className="mt-14">
      <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">Vamos tirar o seu projeto do papel?</h2>
          <p className="mt-1 text-muted">Conte o que você imagina. A gente cuida do resto.</p>
        </div>
        <Link to="/orcamento" className="btn btn-primary min-h-11 shrink-0 px-5">
          Pedir orçamento
        </Link>
      </div>
    </Reveal>
  </Page>
);
