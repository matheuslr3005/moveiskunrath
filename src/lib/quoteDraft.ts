import { emptyDraft, parseDraft, type QuoteDraft } from "../data/quote";
import { usePersistentState } from "./storage";

/** Rascunho do orçamento: compartilhado entre a página de orçamento e o configurador 3D. */
export const useQuoteDraft = () =>
  usePersistentState<QuoteDraft>({ key: "quote-draft", initial: emptyDraft, parse: parseDraft });
