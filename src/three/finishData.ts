export const finishes = [
  { id: "carvalho", label: "Carvalho", color: "#b88a56", grain: "#7a5430", roughness: 0.55 },
  { id: "nogueira", label: "Nogueira", color: "#6b4a32", grain: "#34210f", roughness: 0.5 },
  { id: "preto", label: "Preto fosco", color: "#1d1d20", grain: null, roughness: 0.85 },
  { id: "branco", label: "Off-white", color: "#e9e4d8", grain: null, roughness: 0.65 },
  { id: "grafite", label: "Grafite", color: "#454a52", grain: null, roughness: 0.7 },
  { id: "salvia", label: "Verde sálvia", color: "#7d9686", grain: null, roughness: 0.7 },
] as const;

export type FinishId = (typeof finishes)[number]["id"];
export type Finish = (typeof finishes)[number];

export const isFinishId = (value: unknown): value is FinishId => finishes.some((finish) => finish.id === value);

export const findFinish = (id: FinishId): Finish => finishes.find((finish) => finish.id === id) ?? finishes[0];
