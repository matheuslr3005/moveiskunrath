import type { CSSProperties } from "react";

/** `style` aceitando variáveis CSS (--nome) sem precisar de cast. */
export type CssVars = CSSProperties & { [key: `--${string}`]: string };
