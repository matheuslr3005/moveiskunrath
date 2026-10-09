import { company } from "../data/company";

export const buildWhatsAppUrl = (message: string): string =>
  `https://wa.me/${company.whatsapp.e164}?text=${encodeURIComponent(message)}`;

export const genericGreeting = `Olá, ${company.name}! Vim pelo site e gostaria de conversar sobre um projeto.`;
