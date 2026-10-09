import { Link } from "react-router";
import { Page } from "../components/Page";
import { ProjectCover } from "../components/ProjectCover";
import { Seal } from "../components/Seal";
import { Callout, Reveal, Section, Toggle } from "../components/blocks";
import { company } from "../data/company";
import { featuredProjects } from "../data/projects";
import { useCountUp, useReveal } from "../lib/hooks";

const YearsTile = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const years = useCountUp(company.yearsInMarket, visible);

  return (
    <div ref={ref} className="px-1 py-10 sm:px-10 sm:first:pl-0">
      <p className="font-display text-7xl font-light tabular-nums text-accent-text">{years}</p>
      <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.2em] text-muted">anos de mercado</p>
    </div>
  );
};

const TextTile = ({ title, caption }: { title: string; caption: string }) => (
  <div className="border-line px-1 py-10 sm:border-l sm:px-10">
    <p className="font-display text-5xl font-light leading-none">{title}</p>
    <p className="mt-3 text-[0.6875rem] uppercase tracking-[0.2em] text-muted">{caption}</p>
  </div>
);

export const AboutPage = () => {
  const cover = featuredProjects[1] ?? featuredProjects[0];

  return (
    <Page
      title="Sobre a Kunrath"
      overline="02 · Sobre"
      description="Uma empresa familiar que faz móveis sob medida há 12 anos, com o cuidado de quem sabe que cada projeto é a casa, ou o negócio, de alguém."
    >
      <Reveal className="mt-20">
        <Callout>“{company.slogan}”</Callout>
      </Reveal>

      <Reveal className="mt-16 grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-y-0">
        <YearsTile />
        <TextTile title="100% sob medida" caption="cada projeto é único" />
        <TextTile title="Empresa familiar" caption="atendimento de perto" />
      </Reveal>

      <section className="mt-24 grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div>
          <p className="eyebrow mb-5">Nossa história</p>
          <h2 className="display-lg">Feito por uma família, para a sua.</h2>
          <div className="mt-8 space-y-5">
            <p className="prose-block">
              A {company.name} nasceu como uma empresa de família e, em {company.yearsInMarket} anos, cresceu projetando e produzindo móveis para casas, apartamentos e negócios.
            </p>
            <p className="prose-block">
              Acreditamos que um móvel bem feito começa em uma boa conversa: entender como você vive, o que precisa guardar, onde a luz bate e o que faz aquele cantinho ser seu.
            </p>
          </div>
          <Seal className="mt-10 size-28 text-muted" />
        </div>
        {cover && (
          <div className="aspect-[4/5] overflow-hidden rounded-md border border-line">
            <ProjectCover project={cover} />
          </div>
        )}
      </section>

      <Section title="O que nos guia" overline="Valores">
        <div className="border-t border-line">
          <Toggle title="Ouvir antes de desenhar" defaultOpen>
            Cada projeto começa pela sua rotina e pelo seu espaço, e só depois vira desenho.
          </Toggle>
          <Toggle title="Cuidado com os detalhes">
            Alinhamento de portas, ferragens, acabamento e encaixe fazem a diferença no dia a dia.
          </Toggle>
          <Toggle title="Atendimento de perto">
            Por ser uma empresa familiar, você fala direto com quem está cuidando do seu projeto.
          </Toggle>
        </div>
      </Section>

      <Reveal className="mt-24 flex flex-wrap items-center justify-between gap-6 border-y border-line py-12">
        <p className="display-lg !text-4xl">Quer ver o resultado na prática?</p>
        <div className="flex gap-4">
          <Link to="/projetos" className="btn">
            Ver projetos
          </Link>
          <Link to="/orcamento" className="btn btn-primary">
            Pedir orçamento
          </Link>
        </div>
      </Reveal>
    </Page>
  );
};
