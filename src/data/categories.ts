export type CategoryId = "cozinhas" | "dormitorios" | "banheiros" | "comercial" | "paineis";

export type Category = {
  id: CategoryId;
  label: string;
  singular: string;
  emoji: string;
  blurb: string;
};

// Mesmos ambientes dos destaques do Instagram da empresa.
export const categoryById: Record<CategoryId, Category> = {
  cozinhas: {
    id: "cozinhas",
    label: "Cozinhas",
    singular: "Cozinha",
    emoji: "🍳",
    blurb: "Armários que aproveitam cada centímetro e aguentam a rotina.",
  },
  dormitorios: {
    id: "dormitorios",
    label: "Dormitórios",
    singular: "Dormitório",
    emoji: "🛏️",
    blurb: "Guarda-roupas, camas e painéis para um quarto com a sua cara.",
  },
  banheiros: {
    id: "banheiros",
    label: "Banheiros",
    singular: "Banheiro",
    emoji: "🚿",
    blurb: "Gabinetes e nichos sob medida, mesmo nos espaços mais apertados.",
  },
  comercial: {
    id: "comercial",
    label: "Comercial",
    singular: "Comercial",
    emoji: "🏪",
    blurb: "Balcões, prateleiras e recepções que reforçam a sua marca.",
  },
  paineis: {
    id: "paineis",
    label: "Painéis",
    singular: "Painel",
    emoji: "📺",
    blurb: "Painéis de TV, ripados e iluminação embutida para a sala.",
  },
};

export const categories: Category[] = Object.values(categoryById);

export const isCategoryId = (value: unknown): value is CategoryId =>
  typeof value === "string" && Object.hasOwn(categoryById, value);
