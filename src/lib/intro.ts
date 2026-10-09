/**
 * Estado compartilhado da entrada (portas de armário).
 * A entrada só toca na home, no primeiro carregamento; `index.html` marca `data-intro` antes do React.
 */

export type IntroTask = "fonts" | "engine" | "scene";

const weights: Record<IntroTask, number> = { fonts: 20, engine: 35, scene: 45 };
const allTasks: IntroTask[] = ["fonts", "engine", "scene"];
const done = new Set<IntroTask>();
const listeners = new Set<() => void>();

export const isIntroActive = (): boolean => document.documentElement.dataset.intro !== undefined;

/** O hero 3D espera `opened` para começar o travelling de câmera junto com as portas. */
export const introGate = { opened: !isIntroActive() };

export const markReady = (task: IntroTask): void => {
  if (done.has(task)) return;
  done.add(task);
  listeners.forEach((listener) => listener());
};

export const forceReady = (): void => {
  allTasks.forEach(markReady);
};

export const readyPercent = (): number => [...done].reduce((sum, task) => sum + weights[task], 0);

export const subscribeReady = (listener: () => void): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};
