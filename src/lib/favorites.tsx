import { createContext, useCallback, useContext, useMemo, type ReactNode } from "react";
import { projects } from "../data/projects";
import { usePersistentState } from "./storage";

type FavoritesValue = {
  slugs: string[];
  has: (slug: string) => boolean;
  toggle: (slug: string) => void;
  clear: () => void;
};

const FavoritesContext = createContext<FavoritesValue | null>(null);

const knownSlugs = new Set(projects.map((project) => project.slug));

const parseSlugs = (raw: unknown): string[] | null => {
  if (!Array.isArray(raw)) return null;
  return raw.filter((item): item is string => typeof item === "string" && knownSlugs.has(item));
};

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [slugs, update] = usePersistentState<string[]>({
    key: "favorites",
    initial: [],
    parse: parseSlugs,
  });

  const toggle = useCallback(
    (slug: string) =>
      update((current) =>
        current.includes(slug) ? current.filter((item) => item !== slug) : [...current, slug],
      ),
    [update],
  );
  const clear = useCallback(() => update(() => []), [update]);

  const value = useMemo<FavoritesValue>(
    () => ({ slugs, has: (slug) => slugs.includes(slug), toggle, clear }),
    [slugs, toggle, clear],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = (): FavoritesValue => {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error("useFavorites precisa estar dentro de <FavoritesProvider>");
  return value;
};
