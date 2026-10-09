import type { FinishId } from "./finishData";

export const STEP_COUNT = 6;

/** Acabamentos que desfilam na etapa de aprovação. */
export const storyFinishes: FinishId[] = ["carvalho", "branco", "grafite", "nogueira"];

export const smooth = (from: number, to: number, value: number): number => {
  const x = Math.min(1, Math.max(0, (value - from) / (to - from)));
  return x * x * (3 - 2 * x);
};

/*
 * `t` vai de 0 a 6 ao longo do scroll, uma unidade por etapa:
 * 0 conversa (rascunho) · 1 medição (cotas) · 2 projeto (peças afastadas)
 * 3 aprovação (acabamentos) · 4 produção (montagem) · 5 instalação (LED + portas)
 */

/** 0 = montado, 1 = peças totalmente afastadas. */
export const explodeAt = (t: number): number => smooth(1.9, 2.7, t) * (1 - smooth(3.7, 4.9, t));

/** 0 = só o rascunho em arame, 1 = peças sólidas. */
export const solidAt = (t: number): number => smooth(2.0, 2.8, t);

export const finishIndexAt = (t: number): number =>
  t < 3.0 ? 0 : Math.min(storyFinishes.length - 1, Math.floor((t - 3.0) / 0.27));
