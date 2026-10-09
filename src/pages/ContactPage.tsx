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
      emoji="💬"
      description="O caminho mais rápido é o WhatsApp. Se preferir, acompanhe os trabalhos no Instagram."
    >
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Reveal>
          <div className="card flex h-full flex-col gap-3 p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-[#25d366] text-white">
              <Icon name="whatsapp" className="size-7" />
            </span>
            <h2 className="text-xl font-extrabold">WhatsApp</h2>
            <p className="text-2xl font-black tabular-nums">{company.whatsapp.display}</p>
            <p className="text-sm text-muted">Orçamentos e dúvidas sobre projetos.</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <a href={buildWhatsAppUrl(genericGreeting)} target="_blank" rel="noreferrer" className="btn btn-primary">
                Abrir conversa
              </a>
              <button type="button" className="btn" onClick={() => copy(company.whatsapp.display)}>
                <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Copiado" : "Copiar número"}
              </button>
            </div>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="card flex h-full flex-col gap-3 p-6">
            <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white">
              <Icon name="instagram" className="size-7" />
            </span>
            <h2 className="text-xl font-extrabold">Instagram</h2>
            <p className="text-2xl font-black">{company.instagram.handle}</p>
            <p className="text-sm text-muted">Projetos novos, bastidores da produção e instalações.</p>
            <div className="mt-auto pt-2">
              <a href={company.instagram.url} target="_blank" rel="noreferrer" className="btn">
                Ver perfil <Icon name="external" className="size-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-8">
        <div className="card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-extrabold">Prefere montar o pedido antes?</h2>
            <p className="text-muted">Escolha ambientes, acabamento e prazo, e envie tudo de uma vez.</p>
          </div>
          <Link to="/orcamento" className="btn btn-primary min-h-11 shrink-0 px-5">
            Montar orçamento
          </Link>
        </div>
      </Reveal>
    </Page>
  );
};
