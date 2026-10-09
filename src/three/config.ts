import { findFinish, isFinishId, type FinishId } from "./finishData";
import type { CategoryId } from "../data/categories";

export type FurnitureKind = "cozinha" | "guarda-roupa" | "painel-tv" | "banheiro";
export type HandleStyle = "embutido" | "barra" | "nenhum";

export type KindInfo = {
  id: FurnitureKind;
  label: string;
  hint: string;
  min: number;
  max: number;
  step: number;
  initial: number;
  /** Ambiente correspondente no pedido de orçamento. */
  room: CategoryId;
  article: "a" | "o";
};

export const kinds: KindInfo[] = [
  { id: "cozinha", label: "Cozinha", hint: "Armários, ilha e coluna com nichos", min: 280, max: 440, step: 10, initial: 380, room: "cozinhas", article: "a" },
  { id: "guarda-roupa", label: "Guarda-roupa", hint: "Portas até o teto, LED interno", min: 200, max: 380, step: 10, initial: 280, room: "dormitorios", article: "o" },
  { id: "painel-tv", label: "Painel de TV", hint: "Ripado, nichos e rack suspenso", min: 240, max: 420, step: 10, initial: 320, room: "paineis", article: "o" },
  { id: "banheiro", label: "Banheiro", hint: "Gabinete suspenso e espelho com LED", min: 60, max: 160, step: 10, initial: 100, room: "banheiros", article: "o" },
];

export const handleOptions: { id: HandleStyle; label: string }[] = [
  { id: "embutido", label: "Embutido" },
  { id: "barra", label: "Barra" },
  { id: "nenhum", label: "Sem puxador" },
];

export type FurnitureConfig = {
  kind: FurnitureKind;
  widthCm: number;
  finish: FinishId;
  handle: HandleStyle;
  led: boolean;
};

export const findKind = (id: FurnitureKind): KindInfo => kinds.find((kind) => kind.id === id) ?? kinds[0]!;

const isKind = (value: unknown): value is FurnitureKind => kinds.some((kind) => kind.id === value);
const isHandle = (value: unknown): value is HandleStyle => handleOptions.some((option) => option.id === value);

export const defaultConfig = (kind: FurnitureKind): FurnitureConfig => ({
  kind,
  widthCm: findKind(kind).initial,
  finish: kind === "banheiro" ? "branco" : kind === "guarda-roupa" ? "carvalho" : "nogueira",
  handle: "embutido",
  led: true,
});

/** Lê a configuração de um link compartilhado (?m=cozinha&w=380&f=carvalho&h=barra&led=1). */
export const parseConfig = (params: URLSearchParams): FurnitureConfig | null => {
  const kind = params.get("m");
  if (!isKind(kind)) return null;
  const base = defaultConfig(kind);
  const info = findKind(kind);
  const width = Number(params.get("w"));
  const finish = params.get("f");
  const handle = params.get("h");
  return {
    kind,
    widthCm: Number.isFinite(width) && width >= info.min && width <= info.max ? Math.round(width) : base.widthCm,
    finish: isFinishId(finish) ? finish : base.finish,
    handle: isHandle(handle) ? handle : base.handle,
    led: params.get("led") !== "0",
  };
};

export const configToParams = (config: FurnitureConfig): string =>
  new URLSearchParams({
    m: config.kind,
    w: String(config.widthCm),
    f: config.finish,
    h: config.handle,
    led: config.led ? "1" : "0",
  }).toString();

export const describeConfig = (config: FurnitureConfig): string => {
  const info = findKind(config.kind);
  const handle = handleOptions.find((option) => option.id === config.handle)?.label.toLowerCase() ?? "";
  return `${info.label} de ${config.widthCm} cm, acabamento ${findFinish(config.finish).label.toLowerCase()}, puxador ${handle}${config.led ? ", com LED" : ", sem LED"}`;
};
