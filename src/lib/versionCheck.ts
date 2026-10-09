const RELOAD_KEY = "kunrath:reloaded-for";

const readId = (data: unknown): string | null => {
  if (typeof data !== "object" || data === null) return null;
  const id: unknown = Reflect.get(data, "id");
  return typeof id === "string" ? id : null;
};

const check = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}version.json?t=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) return;
    const id = readId(await response.json());
    if (!id || id === __BUILD_ID__) return;
    // recarrega no máximo uma vez por versão nova (evita laço se o CDN ainda servir o arquivo velho)
    if (sessionStorage.getItem(RELOAD_KEY) === id) return;
    sessionStorage.setItem(RELOAD_KEY, id);
    window.location.reload();
  } catch {
    // sem rede ou sem version.json (modo dev): ignorar
  }
};

/**
 * O GitHub Pages guarda o index.html em cache por alguns minutos, então dá para abrir uma versão velha.
 * Aqui o site confere se existe uma versão mais nova e, se existir, se recarrega sozinho.
 */
export const watchForNewVersion = (): void => {
  if (import.meta.env.DEV) return;
  void check();
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") void check();
  });
};
