import { Link } from "react-router";
import { Page } from "../components/Page";
import { Callout, Reveal, Section, Toggle } from "../components/blocks";
import { company } from "../data/company";
import { useCountUp, useReveal } from "../lib/hooks";

const YearsTile = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const years = useCountUp(company.yearsInMarket, visible);

  return (
    <div ref={ref} className="card p-5">
      <p className="font-display text-5xl font-black tabular-nums text-accent-text">{years}</p>
      <p className="mt-1 text-sm text-muted">anos de mercado</p>
    </div>
  );
};

const TextTile = ({ title, caption }: { title: string; caption: string }) => (
  <div className="card p-5">
    <p className="font-display text-3xl font-black leading-[1.15] sm:text-4xl">{title}</p>
    <p className="mt-1 text-sm text-muted">{caption}</p>
  </div>
);

export const AboutPage = () => (
  <Page
    title="Sobre a Kunrath"
    emoji="🪵"
    description="Uma empresa familiar que faz móveis sob medida há 12 anos, com o cuidado de quem sabe que cada projeto é a casa, ou o negócio, de alguém."
  >
    <Reveal className="mt-8">
      <Callout emoji="❤️">
        <p className="text-lg font-semibold leading-snug text-fg">“{company.slogan}”</p>
      </Callout>
    </Reveal>

    <Reveal className="mt-8 grid gap-3 sm:grid-cols-3">
      <YearsTile />
      <TextTile title="100% sob medida" caption="cada projeto é único" />
      <TextTile title="Empresa familiar" caption="atendimento de perto" />
    </Reveal>

    <Section title="Nossa história" emoji="📖">
      <div className="space-y-4">
        <p className="prose-block">
          A {company.name} nasceu como uma empresa de família e, em {company.yearsInMarket} anos, cresceu projetando e
          produzindo móveis para casas, apartamentos e negócios.
        </p>
        <p className="prose-block">
          Acreditamos que um móvel bem feito começa em uma boa conversa: entender como você vive, o que precisa
          guardar, onde a luz bate e o que faz aquele cantinho ser seu.
        </p>
      </div>
    </Section>

    <Section title="O que nos guia" emoji="🧭">
      <div className="rounded-xl border border-line bg-elev px-3">
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

    <Reveal className="mt-14">
      <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-lg font-bold">Quer ver o resultado na prática?</p>
        <div className="flex gap-3">
          <Link to="/projetos" className="btn min-h-11 px-5">
            Ver projetos
          </Link>
          <Link to="/orcamento" className="btn btn-primary min-h-11 px-5">
            Pedir orçamento
          </Link>
        </div>
      </div>
    </Reveal>
  </Page>
);
