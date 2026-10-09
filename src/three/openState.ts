import { useCallback, useState } from "react";

export type OpenState = {
  isOpen: (id: string) => boolean;
  toggle: (id: string) => void;
  openAll: () => void;
  closeAll: () => void;
  anyOpen: boolean;
};

type OpenSnapshot = { all: boolean; toggled: ReadonlySet<string> };

/** `all` inverte o padrão de todas as peças; `toggled` guarda as exceções clicadas. */
export const useOpenState = (): OpenState => {
  const [snapshot, setSnapshot] = useState<OpenSnapshot>({ all: false, toggled: new Set() });

  const isOpen = useCallback((id: string) => snapshot.all !== snapshot.toggled.has(id), [snapshot]);
  const toggle = useCallback(
    (id: string) =>
      setSnapshot((current) => {
        const toggled = new Set(current.toggled);
        if (toggled.has(id)) toggled.delete(id);
        else toggled.add(id);
        return { ...current, toggled };
      }),
    [],
  );
  const openAll = useCallback(() => setSnapshot({ all: true, toggled: new Set() }), []);
  const closeAll = useCallback(() => setSnapshot({ all: false, toggled: new Set() }), []);

  return { isOpen, toggle, openAll, closeAll, anyOpen: snapshot.all || snapshot.toggled.size > 0 };
};

