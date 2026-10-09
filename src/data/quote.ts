import { categoryById, isCategoryId, type CategoryId } from "./categories";
import { company } from "./company";
import type { Project } from "./projects";

export const styleOptions = [
  { id: "moderno", label: "Moderno" },
  { id: "classico", label: "Clássico" },
  { id: "minimalista", label: "Minimalista" },
  { id: "rustico", label: "Rústico" },
  { id: "indefinido", label: "Ainda não sei" },
] as const;

export const finishOptions = [
  { id: "amadeirado", label: "Amadeirado", color: "#9a7448" },
  { id: "preto", label: "Preto fosco", color: "#24272b" },
  { id: "branco", label: "Branco / off-white", color: "#ece8dc" },
  { id: "grafite", label: "Cinza / grafite", color: "#4a4f57" },
  { id: "cor", label: "Colorido", color: "#6f8a7d" },
  { id: "sugestao", label: "Quero sugestões", color: "#f7cd48" },
] as const;

export const timelineOptions = [
  { id: "sem-pressa", label: "Sem pressa" },
  { id: "3-meses", label: "Em até 3 meses" },
  { id: "urgente", label: "O quanto antes" },
] as const;

type Option = { id: string; label: string };
type OptionId<T extends readonly Option[]> = T[number]["id"];

export type QuoteDraft = {
  name: string;
  rooms: CategoryId[];
  style: OptionId<typeof styleOptions> | "";
  finish: OptionId<typeof finishOptions> | "";
  timeline: OptionId<typeof timelineOptions> | "";
  notes: string;
};

export const emptyDraft: QuoteDraft = { name: "", rooms: [], style: "", finish: "", timeline: "", notes: "" };

const pickOption = <T extends readonly Option[]>(options: T, value: unknown): OptionId<T> | "" =>
  options.find((option) => option.id === value)?.id ?? "";

const asText = (value: unknown): string => (typeof value === "string" ? value : "");

/** Valida o rascunho vindo do localStorage; qualquer formato estranho vira null. */
export const parseDraft = (raw: unknown): QuoteDraft | null => {
  if (typeof raw !== "object" || raw === null) return null;
  const rooms: unknown = Reflect.get(raw, "rooms");
  return {
    name: asText(Reflect.get(raw, "name")),
    rooms: Array.isArray(rooms) ? rooms.filter(isCategoryId) : [],
    style: pickOption(styleOptions, Reflect.get(raw, "style")),
    finish: pickOption(finishOptions, Reflect.get(raw, "finish")),
    timeline: pickOption(timelineOptions, Reflect.get(raw, "timeline")),
    notes: asText(Reflect.get(raw, "notes")),
  };
};

const labelOf = (options: readonly Option[], id: string): string =>
  options.find((option) => option.id === id)?.label ?? "";

type MessageInput = { draft: QuoteDraft; projects: Project[]; origin: string };

export const buildQuoteMessage = ({ draft, projects, origin }: MessageInput): string => {
  const lines: string[] = [`Olá, ${company.name}! Vim pelo site e gostaria de pedir um orçamento.`, ""];

  if (draft.name.trim()) lines.push(`*Nome:* ${draft.name.trim()}`);
  if (draft.rooms.length > 0) {
    lines.push(`*Ambientes:* ${draft.rooms.map((room) => categoryById[room].label).join(", ")}`);
  }
  if (draft.style) lines.push(`*Estilo:* ${labelOf(styleOptions, draft.style)}`);
  if (draft.finish) lines.push(`*Acabamento:* ${labelOf(finishOptions, draft.finish)}`);
  if (draft.timeline) lines.push(`*Prazo:* ${labelOf(timelineOptions, draft.timeline)}`);
  if (draft.notes.trim()) lines.push(`*Detalhes / medidas:* ${draft.notes.trim()}`);

  if (projects.length > 0) {
    lines.push("", "*Projetos que gostei:*");
    projects.forEach((project) => lines.push(`• ${project.title}: ${origin}/projetos/${project.slug}`));
  }

  return lines.join("\n");
};
