import { useCallback, useState } from "react";

const PREFIX = "kunrath:";

// localStorage pode falhar (aba anônima, bloqueio). Nada aqui pode quebrar a página.
export const readStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
};

export const writeStorage = (key: string, value: string): void => {
  try {
    localStorage.setItem(PREFIX + key, value);
  } catch {
    // ignorado de propósito: persistência é conveniência, não requisito
  }
};

const readJson = (key: string): unknown => {
  const raw = readStorage(key);
  if (raw === null) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

type PersistentStateOptions<T> = {
  key: string;
  initial: T;
  /** Valida o que veio do disco; devolve null se o formato for inválido. */
  parse: (raw: unknown) => T | null;
};

export const usePersistentState = <T>({ key, initial, parse }: PersistentStateOptions<T>) => {
  const [value, setValue] = useState<T>(() => parse(readJson(key)) ?? initial);

  const update = useCallback(
    (updater: (previous: T) => T) => {
      setValue((previous) => {
        const next = updater(previous);
        writeStorage(key, JSON.stringify(next));
        return next;
      });
    },
    [key],
  );

  return [value, update] as const;
};
