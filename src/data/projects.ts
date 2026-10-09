import type { CategoryId } from "./categories";

export type Project = {
  slug: string;
  title: string;
  category: CategoryId;
  style: string;
  summary: string;
  description: string;
  materials: string[];
  finish: string;
  highlights: string[];
  /** Cores usadas na ilustração enquanto não há foto real. */
  tone: { base: string; accent: string };
  /** Caminhos em /public (ex.: "/projetos/cozinha-1/01.jpg"). Vazio = mostra ilustração. */
  images: string[];
  featured: boolean;
};

/*
 * CONTEÚDO DE EXEMPLO — substituir pelos projetos reais.
 * Para usar foto: coloque os arquivos em public/projetos/<slug>/ e liste em `images`.
 */
export const projects: Project[] = [
  {
    slug: "cozinha-linear-amadeirada",
    title: "Cozinha linear amadeirada",
    category: "cozinhas",
    style: "Moderno",
    summary: "Armários altos e baixos em tom de madeira com detalhes em amarelo.",
    description:
      "Uma cozinha pensada em linha reta, com armários até o teto, bancada contínua e espaço para tudo ter o seu lugar. O tom amadeirado aquece o ambiente e combina com o fundo neutro.",
    materials: ["MDF amadeirado", "Ferragens com amortecimento", "Bancada em pedra"],
    finish: "Amadeirado fosco",
    highlights: ["Armários até o teto", "Gavetas com amortecimento", "Bancada contínua"],
    tone: { base: "#9a7448", accent: "#f7cd48" },
    images: [],
    featured: true,
  },
  {
    slug: "cozinha-grafite-bancada-clara",
    title: "Cozinha grafite com bancada clara",
    category: "cozinhas",
    style: "Contemporâneo",
    summary: "Contraste entre o grafite dos armários e a bancada clara.",
    description:
      "O grafite dá presença à cozinha sem pesar, e a bancada clara devolve luminosidade. Puxadores discretos mantêm a linha limpa.",
    materials: ["MDF grafite", "Puxadores embutidos", "Bancada clara"],
    finish: "Grafite fosco",
    highlights: ["Puxadores embutidos", "Linha limpa", "Iluminação sob os armários"],
    tone: { base: "#3d434b", accent: "#e8e2d3" },
    images: [],
    featured: false,
  },
  {
    slug: "cozinha-ilha-armarios-ate-o-teto",
    title: "Cozinha com ilha e armários até o teto",
    category: "cozinhas",
    style: "Clássico moderno",
    summary: "Tons claros, muito armazenamento e uma ilha para reunir a família.",
    description:
      "Para quem cozinha e recebe: bancada ampla, ilha como ponto de encontro e armários que escondem o que não precisa ficar à vista.",
    materials: ["MDF claro", "Detalhes em dourado envelhecido", "Ilha com banco"],
    finish: "Off-white acetinado",
    highlights: ["Ilha central", "Armazenamento até o teto", "Despensa integrada"],
    tone: { base: "#d9d5cc", accent: "#b88a44" },
    images: [],
    featured: true,
  },
  {
    slug: "dormitorio-casal-painel-ripado",
    title: "Dormitório de casal com painel ripado",
    category: "dormitorios",
    style: "Aconchegante",
    summary: "Guarda-roupa de portas lisas e cabeceira ripada com luz indireta.",
    description:
      "Guarda-roupa de piso a teto, cabeceira ripada com fita de LED e criados-mudos suspensos. Um quarto para descansar de verdade.",
    materials: ["MDF amadeirado", "Ripado", "Fita de LED"],
    finish: "Amadeirado escuro",
    highlights: ["Cabeceira com LED", "Guarda-roupa até o teto", "Criados-mudos suspensos"],
    tone: { base: "#7a5a3c", accent: "#f7cd48" },
    images: [],
    featured: true,
  },
  {
    slug: "quarto-solteiro-cama-box-nichos",
    title: "Quarto solteiro com nichos",
    category: "dormitorios",
    style: "Jovem",
    summary: "Cor suave, nichos para livros e bancada de estudo integrada.",
    description:
      "Um quarto que cresce junto: bancada de estudo, nichos abertos e armário com espaço de sobra para a rotina de quem mora ali.",
    materials: ["MDF verde-sálvia", "Nichos abertos", "Bancada de estudo"],
    finish: "Verde-sálvia fosco",
    highlights: ["Bancada de estudo", "Nichos abertos", "Armário compacto"],
    tone: { base: "#6f8a7d", accent: "#f2efe6" },
    images: [],
    featured: false,
  },
  {
    slug: "banheiro-gabinete-espelho-redondo",
    title: "Gabinete suspenso com espelho redondo",
    category: "banheiros",
    style: "Minimalista",
    summary: "Gabinete suspenso e coluna lateral que liberam o piso.",
    description:
      "No banheiro pequeno, cada centímetro conta. O gabinete suspenso deixa o piso livre e a coluna lateral guarda toalhas e itens do dia a dia.",
    materials: ["MDF resistente à umidade", "Espelho redondo", "Cuba de apoio"],
    finish: "Areia fosco",
    highlights: ["Gabinete suspenso", "Coluna lateral", "Espelho com moldura"],
    tone: { base: "#d8d3c6", accent: "#f7cd48" },
    images: [],
    featured: false,
  },
  {
    slug: "banheiro-preto-fosco",
    title: "Banheiro preto fosco",
    category: "banheiros",
    style: "Sofisticado",
    summary: "Preto fosco com detalhes em amarelo para um banheiro de impacto.",
    description:
      "Um banheiro com personalidade: marcenaria preta, metais claros e iluminação pontual criam um ambiente de lavabo de hotel.",
    materials: ["MDF preto fosco", "Metais dourados", "Iluminação pontual"],
    finish: "Preto fosco",
    highlights: ["Marcenaria preta", "Iluminação pontual", "Nicho de apoio"],
    tone: { base: "#30353c", accent: "#f7cd48" },
    images: [],
    featured: false,
  },
  {
    slug: "comercial-balcao-recepcao",
    title: "Balcão de recepção e prateleiras",
    category: "comercial",
    style: "Corporativo",
    summary: "Recepção com a identidade da marca e prateleiras de exposição.",
    description:
      "O primeiro contato do cliente com a sua empresa merece cuidado. Balcão com frente em destaque, prateleiras para exposição e iluminação que valoriza os produtos.",
    materials: ["MDF amadeirado claro", "Detalhes na cor da marca", "Iluminação de destaque"],
    finish: "Carvalho claro",
    highlights: ["Frente personalizada", "Prateleiras de exposição", "Iluminação de destaque"],
    tone: { base: "#c9a16a", accent: "#f7cd48" },
    images: [],
    featured: true,
  },
  {
    slug: "painel-tv-led",
    title: "Painel de TV com iluminação de LED",
    category: "paineis",
    style: "Contemporâneo",
    summary: "Painel com recortes de luz e nichos laterais para decoração.",
    description:
      "Painel que organiza a sala: TV na altura certa, fios escondidos, nichos para decoração e linhas de luz que dão destaque ao conjunto.",
    materials: ["MDF grafite", "Fita de LED", "Rack suspenso"],
    finish: "Grafite com detalhes claros",
    highlights: ["Fios embutidos", "Linhas de LED", "Nichos laterais"],
    tone: { base: "#4a4f57", accent: "#f7cd48" },
    images: [],
    featured: true,
  },
  {
    slug: "painel-ripado-rack-suspenso",
    title: "Painel ripado com rack suspenso",
    category: "paineis",
    style: "Natural",
    summary: "Ripado em tom de madeira com rack suspenso e nichos.",
    description:
      "O ripado traz textura e calor para a sala. O rack suspenso mantém o piso livre e facilita a limpeza.",
    materials: ["Ripado amadeirado", "Rack suspenso", "Nichos abertos"],
    finish: "Amadeirado natural",
    highlights: ["Ripado contínuo", "Rack suspenso", "Nichos abertos"],
    tone: { base: "#8a6a47", accent: "#f2efe6" },
    images: [],
    featured: false,
  },
];

export const findProject = (slug: string | undefined): Project | undefined =>
  projects.find((project) => project.slug === slug);

export const featuredProjects: Project[] = projects.filter((project) => project.featured);
