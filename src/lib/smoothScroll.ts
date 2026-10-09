import Lenis from "lenis";

/**
 * Rolagem com inércia (Lenis). A roda do mouse deixa de andar aos pulos e a animação guiada
 * pelo scroll fica contínua. Em toque o navegador continua com a rolagem nativa.
 */
let instance: Lenis | null = null;
let locks = 0;

export const startSmoothScroll = (): (() => void) => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => undefined;
  instance = new Lenis({ autoRaf: true, lerp: 0.085, wheelMultiplier: 0.95 });
  if (locks > 0) instance.stop();
  return () => {
    instance?.destroy();
    instance = null;
  };
};

/** Trava a rolagem (ex.: durante a entrada). Pode ser chamado várias vezes: conta travas. */
export const lockScroll = (): void => {
  locks += 1;
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
};

export const unlockScroll = (): void => {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  instance?.start();
  document.documentElement.style.overflow = "";
};

export const scrollToY = (top: number): void => {
  if (instance) instance.scrollTo(top, { duration: 1.4 });
  else window.scrollTo({ top, behavior: "smooth" });
};

export const scrollToTopNow = (): void => {
  if (instance) instance.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo({ top: 0, behavior: "instant" });
};
