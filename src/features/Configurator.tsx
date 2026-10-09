import { lazy, Suspense, useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "../components/Icon";
import { findKind, handleOptions, kinds, configToParams, defaultConfig, describeConfig, type FurnitureConfig, type FurnitureKind } from "../three/config";
import { findFinish, finishes, type FinishId } from "../three/finishData";
import { useOpenState } from "../three/openState";
import type { QuoteDraft } from "../data/quote";
import { company } from "../data/company";
import { cn } from "../lib/cn";
import type { CssVars } from "../lib/css";
import { useCopyToClipboard } from "../lib/hooks";
import { useQuoteDraft } from "../lib/quoteDraft";
import { buildWhatsAppUrl } from "../lib/whatsapp";

const ConfiguratorScene = lazy(() => import("../three/ConfiguratorScene").then((module) => ({ default: module.ConfiguratorScene })));

const quoteFinish: Record<FinishId, QuoteDraft["finish"]> = {
  carvalho: "amadeirado",
  nogueira: "amadeirado",
  preto: "preto",
  branco: "branco",
  grafite: "grafite",
  salvia: "cor",
};

const swatchBackground = (id: FinishId): string => {
  const finish = findFinish(id);
  return finish.grain
    ? `repeating-linear-gradient(95deg, ${finish.color} 0 3px, ${finish.grain} 3px 4px), ${finish.color}`
    : finish.color;
};

const shareUrl = (config: FurnitureConfig): string =>
  `${window.location.origin}${import.meta.env.BASE_URL.replace(/\/$/, "")}/montar?${configToParams(config)}`;

const SceneLoading = () => (
  <div className="flex size-full items-center justify-center text-[0.6875rem] uppercase tracking-[0.3em] text-muted">
    <span className="hint-dot mr-3" /> Preparando o showroom
  </div>
);

type ConfiguratorProps = {
  initial?: FurnitureConfig;
  onChange?: (config: FurnitureConfig) => void;
  /** Na página própria, o painel desce para não ficar embaixo do cabeçalho. */
  pageMode?: boolean;
};

export const Configurator = ({ initial, onChange, pageMode = false }: ConfiguratorProps) => {
  const navigate = useNavigate();
  const open = useOpenState();
  const { copied, copy } = useCopyToClipboard();
  const [, updateDraft] = useQuoteDraft();
  const [config, setConfig] = useState<FurnitureConfig>(initial ?? defaultConfig("cozinha"));
  const [touched, setTouched] = useState(false);

  const info = findKind(config.kind);
  const fill = ((config.widthCm - info.min) / (info.max - info.min)) * 100;
  const summary = describeConfig(config);
  const sliderStyle: CssVars = { "--fill": `${fill}%` };

  const change = (patch: Partial<FurnitureConfig>) => {
    const next = { ...config, ...patch };
    setConfig(next);
    onChange?.(next);
  };

  const switchKind = (kind: FurnitureKind) => {
    open.closeAll();
    change({ kind, widthCm: findKind(kind).initial });
  };

  const message = `Olá, ${company.name}! Montei no site ${info.article === "a" ? "uma" : "um"} ${summary}. Segue o link do modelo: ${shareUrl(config)}\nGostaria de um orçamento.`;

  const saveToQuote = () => {
    updateDraft((draft) => ({
      ...draft,
      rooms: draft.rooms.includes(info.room) ? draft.rooms : [...draft.rooms, info.room],
      finish: quoteFinish[config.finish],
      notes: draft.notes.includes(summary) ? draft.notes : [draft.notes.trim(), `Modelo 3D: ${summary}`].filter(Boolean).join("\n"),
    }));
    navigate("/orcamento");
  };

  return (
    <div className="relative lg:h-[92svh] lg:min-h-[44rem]" onPointerDown={() => setTouched(true)}>
      <div className="relative h-[62svh] min-h-[22rem] lg:absolute lg:inset-0 lg:h-auto">
        <Suspense fallback={<SceneLoading />}>
          <ConfiguratorScene config={config} open={open} className="size-full" />
        </Suspense>
        <div
          className={cn(
            "pointer-events-none absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/15 bg-black/50 px-5 py-2.5 text-[0.6875rem] uppercase tracking-[0.2em] backdrop-blur transition-opacity duration-700",
            touched ? "opacity-0" : "opacity-100",
          )}
        >
          <span className="hint-dot" /> <span className="whitespace-nowrap">Arraste · clique nas portas</span>
        </div>
      </div>

      <div
        className={cn(
          "hud relative z-10 mx-auto mt-4 w-full max-w-[28rem] rounded-2xl p-5 sm:p-6 lg:absolute lg:left-8 lg:mt-0 lg:w-[24rem] lg:overflow-y-auto lg:overscroll-contain",
          pageMode ? "lg:top-6 lg:max-h-[calc(100%-3rem)]" : "lg:top-6 lg:max-h-[calc(100%-3rem)]",
        )}
      >
        <p className="eyebrow">Seu móvel, em tempo real</p>

        <div className="mt-4 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Tipo de móvel">
          {kinds.map((kind) => (
            <button
              key={kind.id}
              type="button"
              role="radio"
              aria-checked={config.kind === kind.id}
              onClick={() => switchKind(kind.id)}
              className="chip !justify-center"
            >
              {kind.label}
            </button>
          ))}
        </div>
        <p className="mt-3 text-sm font-light text-muted">{info.hint}</p>

        <div className="mt-4">
          <div className="flex items-baseline justify-between">
            <label htmlFor="width" className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
              Largura
            </label>
            <span className="font-display text-3xl font-semibold tabular-nums">
              {config.widthCm} <span className="text-base text-muted">cm</span>
            </span>
          </div>
          <input
            id="width"
            type="range"
            className="range"
            min={info.min}
            max={info.max}
            step={info.step}
            value={config.widthCm}
            style={sliderStyle}
            onChange={(event) => change({ widthCm: Number(event.target.value) })}
          />
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">
            Acabamento · <span className="text-fg">{findFinish(config.finish).label}</span>
          </p>
          <div className="mt-3 flex flex-wrap gap-3" role="radiogroup" aria-label="Acabamento">
            {finishes.map((finish) => (
              <button
                key={finish.id}
                type="button"
                role="radio"
                aria-checked={config.finish === finish.id}
                aria-label={finish.label}
                title={finish.label}
                onClick={() => change({ finish: finish.id })}
                className={cn(
                  "size-10 rounded-full border border-white/20 transition-transform duration-200 hover:scale-110 active:scale-95",
                  config.finish === finish.id && "scale-110 ring-2 ring-accent ring-offset-2 ring-offset-[#15120f]",
                )}
                style={{ background: swatchBackground(finish.id) }}
              />
            ))}
          </div>
        </div>

        <div className="mt-5">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">Puxador</p>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Puxador">
            {handleOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={config.handle === option.id}
                onClick={() => change({ handle: option.id })}
                className="chip"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <span className="text-[0.6875rem] uppercase tracking-[0.2em] text-muted">Iluminação de LED</span>
          <button type="button" role="switch" aria-checked={config.led} aria-label="Iluminação de LED" className="switch" onClick={() => change({ led: !config.led })} />
        </div>

        <button type="button" className="btn mt-5 w-full" onClick={open.anyOpen ? open.closeAll : open.openAll}>
          {open.anyOpen ? "Fechar tudo" : "Abrir portas e gavetas"}
        </button>

        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-sm font-light leading-relaxed text-muted">{summary}.</p>
          <a href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer" className="btn btn-primary mt-4 w-full min-h-12">
            <Icon name="whatsapp" className="size-5" /> Pedir orçamento deste móvel
          </a>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button type="button" className="btn" onClick={saveToQuote}>
              Salvar no orçamento
            </button>
            <button type="button" className="btn" onClick={() => copy(shareUrl(config))}>
              <Icon name={copied ? "check" : "link"} className="size-4" /> {copied ? "Copiado" : "Copiar link"}
            </button>
          </div>
          <p className="mt-4 text-center text-xs font-light text-muted">
            Modelo ilustrativo. Medidas e detalhes finais saem no projeto.
          </p>
        </div>
      </div>
    </div>
  );
};
