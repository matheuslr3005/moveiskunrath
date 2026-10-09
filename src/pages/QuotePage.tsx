import { useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { ProjectCover } from "../components/ProjectCover";
import { Section } from "../components/blocks";
import { categories, type CategoryId } from "../data/categories";
import { findProject, projects, type Project } from "../data/projects";
import {
  buildQuoteMessage,
  emptyDraft,
  finishOptions,
  parseDraft,
  styleOptions,
  timelineOptions,
  type QuoteDraft,
} from "../data/quote";
import { cn } from "../lib/cn";
import { useFavorites } from "../lib/favorites";
import { useCopyToClipboard } from "../lib/hooks";
import { usePersistentState } from "../lib/storage";
import { buildWhatsAppUrl } from "../lib/whatsapp";

type ChipGroupProps<T extends string> = {
  label: string;
  options: readonly { id: T; label: string }[];
  value: T | "";
  onChange: (value: T | "") => void;
};

const ChipGroup = <T extends string>({ label, options, value, onChange }: ChipGroupProps<T>) => (
  <fieldset>
    <legend className="mb-2 text-sm font-semibold">{label}</legend>
    <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          role="radio"
          aria-checked={value === option.id}
          className="chip"
          onClick={() => onChange(value === option.id ? "" : option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  </fieldset>
);

/** Mostra *trechos* como negrito, igual ao WhatsApp, só na prévia. */
const WhatsAppText = ({ text }: { text: string }) => (
  <>
    {text.split(/(\*[^*\n]+\*)/).map((part, index) =>
      part.length > 2 && part.startsWith("*") && part.endsWith("*") ? (
        <strong key={index}>{part.slice(1, -1)}</strong>
      ) : (
        part
      ),
    )}
  </>
);

const FavoriteRow = ({ project }: { project: Project }) => {
  const favorites = useFavorites();
  return (
    <li className="flex items-center gap-3 rounded-lg border border-line bg-bg p-2 pr-3">
      <Link to={`/projetos/${project.slug}`} className="flex min-w-0 flex-1 items-center gap-3">
        <span className="block h-11 w-16 shrink-0 overflow-hidden rounded-md border border-line">
          <ProjectCover project={project} />
        </span>
        <span className="truncate text-sm font-semibold">{project.title}</span>
      </Link>
      {favorites.has(project.slug) ? (
        <button
          type="button"
          onClick={() => favorites.toggle(project.slug)}
          aria-label={`Remover ${project.title}`}
          className="btn btn-ghost size-9 shrink-0 !p-0"
        >
          <Icon name="close" className="size-4" />
        </button>
      ) : (
        <span className="tag shrink-0">Referência</span>
      )}
    </li>
  );
};

export const QuotePage = () => {
  const [params] = useSearchParams();
  const favorites = useFavorites();
  const { copied, copy } = useCopyToClipboard();
  const [draft, update] = usePersistentState<QuoteDraft>({ key: "quote-draft", initial: emptyDraft, parse: parseDraft });

  const reference = findProject(params.get("ref") ?? undefined);
  const referenceCategory = reference?.category;

  // Vindo de um projeto: já marca o ambiente correspondente.
  useEffect(() => {
    if (!referenceCategory) return;
    update((current) =>
      current.rooms.includes(referenceCategory) ? current : { ...current, rooms: [...current.rooms, referenceCategory] },
    );
  }, [referenceCategory, update]);

  const liked = useMemo(
    () => projects.filter((project) => favorites.slugs.includes(project.slug)),
    [favorites.slugs],
  );
  const attached = useMemo(
    () => (reference && !liked.some((project) => project.slug === reference.slug) ? [reference, ...liked] : liked),
    [reference, liked],
  );

  const message = buildQuoteMessage({ draft, projects: attached, origin: window.location.origin });

  const setField = <K extends keyof QuoteDraft>(key: K, value: QuoteDraft[K]) =>
    update((current) => ({ ...current, [key]: value }));

  const toggleRoom = (room: CategoryId) =>
    update((current) => ({
      ...current,
      rooms: current.rooms.includes(room) ? current.rooms.filter((item) => item !== room) : [...current.rooms, room],
    }));

  return (
    <Page
      title="Orçamento"
      emoji="📝"
      description="Conte o que você precisa. Montamos a mensagem para você enviar direto no WhatsApp, sem formulário longo e sem cadastro."
    >
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_21rem]">
        <form className="space-y-7" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label htmlFor="quote-name" className="mb-2 block text-sm font-semibold">
              Seu nome
            </label>
            <input
              id="quote-name"
              className="field"
              autoComplete="name"
              placeholder="Como podemos te chamar?"
              value={draft.name}
              onChange={(event) => setField("name", event.target.value)}
            />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Quais ambientes?</legend>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className="chip"
                  aria-pressed={draft.rooms.includes(category.id)}
                  onClick={() => toggleRoom(category.id)}
                >
                  <span aria-hidden="true">{category.emoji}</span> {category.label}
                </button>
              ))}
            </div>
          </fieldset>

          <ChipGroup label="Estilo" options={styleOptions} value={draft.style} onChange={(value) => setField("style", value)} />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Acabamento</legend>
            <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Acabamento">
              {finishOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={draft.finish === option.id}
                  className="chip"
                  onClick={() => setField("finish", draft.finish === option.id ? "" : option.id)}
                >
                  <span className="size-3.5 rounded-full border border-black/20" style={{ background: option.color }} />
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>

          <ChipGroup
            label="Para quando?"
            options={timelineOptions}
            value={draft.timeline}
            onChange={(value) => setField("timeline", value)}
          />

          <div>
            <label htmlFor="quote-notes" className="mb-2 block text-sm font-semibold">
              Medidas e detalhes <span className="font-normal text-muted">(opcional)</span>
            </label>
            <textarea
              id="quote-notes"
              rows={4}
              className="field"
              placeholder="Ex.: cozinha de 3 x 2,5 m, quero espaço para forno de embutir…"
              value={draft.notes}
              onChange={(event) => setField("notes", event.target.value)}
            />
          </div>

          <button
            type="button"
            className="text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => update(() => emptyDraft)}
          >
            Limpar formulário
          </button>
        </form>

        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="card space-y-4 p-4">
            <h2 className="font-bold">Pré-visualização da mensagem</h2>
            <pre
              className={cn(
                "max-h-[22rem] overflow-y-auto whitespace-pre-wrap break-words rounded-xl rounded-tl-sm p-3",
                "bg-[#d9fdd3] font-sans text-[0.8125rem] leading-relaxed text-[#111b21]",
              )}
            >
              <WhatsAppText text={message} />
            </pre>
            <a
              href={buildWhatsAppUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary min-h-12 w-full"
            >
              <Icon name="whatsapp" className="size-5" /> Enviar pelo WhatsApp
            </a>
            <button type="button" className="btn w-full" onClick={() => copy(message)}>
              <Icon name={copied ? "check" : "copy"} className="size-4" /> {copied ? "Mensagem copiada" : "Copiar mensagem"}
            </button>
          </div>
        </aside>
      </div>

      <Section title="Projetos que você curtiu" emoji="❤️">
        {attached.length === 0 ? (
          <div className="card p-6 text-center">
            <p className="text-muted">
              Toque no coração dos projetos para guardá-los aqui. Eles vão junto na mensagem, e a gente já entende o seu gosto.
            </p>
            <Link to="/projetos" className="btn mt-4">
              Explorar projetos
            </Link>
          </div>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {attached.map((project) => (
              <FavoriteRow key={project.slug} project={project} />
            ))}
          </ul>
        )}
      </Section>
    </Page>
  );
};
