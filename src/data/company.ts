/**
 * Fonte única dos dados da empresa (vindos do perfil do Instagram).
 * Confirmar com o cliente antes de publicar: telefone/WhatsApp e cidade.
 */
export const company = {
  name: "Móveis Kunrath",
  segment: "Móveis sob medida",
  slogan: "Não é sobre fazer projetos, é sobre realizar sonhos.",
  yearsInMarket: 12,
  whatsapp: {
    display: "(51) 3077-8191",
    // DDI + DDD + número. wa.me exige só dígitos.
    e164: "555130778191",
  },
  instagram: {
    handle: "@moveiskunrath",
    url: "https://www.instagram.com/moveiskunrath/",
  },
} as const;
