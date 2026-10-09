# Móveis Kunrath

Site de apresentação e cartão de visitas de vendas da Móveis Kunrath (móveis sob medida).
React 19 + TypeScript + Vite + Tailwind v4 + React Router. Visual inspirado no Notion
(sidebar em árvore, capa, propriedades, toggles, galeria/tabela, busca ⌘K) com a paleta do logo.

## Rodar

```bash
pnpm install
pnpm dev        # desenvolvimento
pnpm build      # typecheck + build em dist/
```

Hospedagem estática (Vercel, Netlify, Cloudflare Pages): `vercel.json` e `public/_redirects`
já fazem o fallback de SPA para `/index.html`.

## O que o site faz

- **Início**: capa, propriedades da empresa, ambientes, destaques, dúvidas rápidas.
- **Projetos**: filtro por ambiente, busca, visão Galeria/Tabela. Os filtros ficam na URL
  (`/projetos?c=cozinhas&q=ripado`), então dá para mandar o link já filtrado a um cliente.
- **Projeto**: propriedades, destaques, copiar link, WhatsApp, "pedir orçamento parecido".
- **Orçamento**: monta a mensagem (ambientes, estilo, acabamento, prazo, medidas) com
  prévia e envia pelo WhatsApp. Os projetos marcados com ❤️ vão junto, com link.
  O rascunho fica salvo no navegador.
- **Sobre**, **Como funciona**, **Contato**, tema claro/escuro, ⌘K / Ctrl+K.

## Trocar o conteúdo de exemplo (importante)

Tudo que o cliente precisa revisar está em `src/data/`:

| Arquivo | O que é |
| --- | --- |
| `company.ts` | Nome, slogan, anos de mercado, WhatsApp, Instagram. **Confirmar o número de WhatsApp**: o perfil mostra `51 30778191`; se for fixo, o `wa.me` pode não abrir conversa. |
| `projects.ts` | Projetos de **exemplo**, com ilustrações no lugar de fotos. Para usar foto real: coloque os arquivos em `public/projetos/<slug>/` e liste em `images`. |
| `process.ts` | Etapas do "Como funciona" (genéricas, revisar). |
| `categories.ts` | Ambientes (iguais aos destaques do Instagram). |

Os textos de "Sobre" e "Dúvidas rápidas" também são genéricos: revisar com o cliente.

## Marca

Cores tiradas do logo: grafite `#15171A`, amarelo `#F7CD48`, branco. Tokens em
`src/styles/index.css`. O logo no site (`src/components/Logo.tsx`) é uma recriação em texto;
quando houver o arquivo vetorial (SVG), trocar por ele. O PNG original está em `public/brand/`.
