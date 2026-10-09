import { Link } from "react-router";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { Reveal } from "../components/blocks";
import { company } from "../data/company";
import { useCopyToClipboard } from "../lib/hooks";
import { buildWhatsAppUrl, genericGreeting } from "../lib/whatsapp";

export const ContactPage = () => {
  const { copied, copy } = useCopyToClipboard();

  return (
    <Page
      title="Contato"
      overline="04 · Contato"
      description="O caminho mais rápido é o WhatsApp. Se preferir, acompanhe os trabalhos no Instagram."
    >
      <div className="mt-16 grid border-y border-line md:grid-cols-2">
        <Reveal className="flex flex-col gap-4 border-line py-12 md:pr-12">
          <Icon name="whatsapp" className="size-7 text-[#25d366]" />
          <p className="eyebrow">WhatsApp</p>
          <p className="font-display text-5xl font-light tabular-nums">{company.whatsapp.display}</p>
          <p className="text-sm font-light text-muted">Orçamentos e dúvidas sobre projetos.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="btn btn-primary">
              Abrir conversa
            </a>
            <button type="button" className="btn" onClick={() => copy(company.whatsapp.display)}>
              <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Copiado" : "Copiar número"}
            </button>
          </div>
        </Reveal>
        <Reveal delay={100} className="flex flex-col gap-4 border-t border-line py-12 md:border-l md:border-t-0 md:pl-12">
          <Icon name="instagram" className="size-7 text-accent-text" />
          <p className="eyebrow">Instagram</p>
          <p className="font-display text-5xl font-light">{company.instagram.handle}</p>
          <p className="text-sm font-light text-muted">Projetos novos, bastidores da produção e instalações.</p>
          <div className="mt-4">
            <a href={company.instagram.url} target="_blank" rel="noreferrer" className="btn">
              Ver perfil <Icon name="external" className="size-4" />
            </a>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16 flex flex-wrap items-center justify-between gap-6">
        <div>
          <h2 className="display-lg !text-4xl">Prefere montar o pedido antes?</h2>
          <p className="prose-block mt-3">Escolha ambientes, acabamento e prazo, e envie tudo de uma vez.</p>
        </div>
        <Link to="/orcamento" className="btn btn-primary">
          Montar orçamento
        </Link>
      </Reveal>
    </Page>
  );
};
