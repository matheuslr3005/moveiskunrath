# Manual de Marca Cadomar v2

25 páginas A4 paisagem. Abra `index.html` no navegador (uma página por cartão) ou use o PDF pronto.

- `index.html`: o manual, HTML estático, sem runtime proprietário.
- `Manual_de_Marca_Cadomar_v2.pdf`: exportado do `index.html` (texto vetorial, fontes embutidas).
- `logo-B/`: arquivos finais do Logo B (SVG e PNG).
- `assets/`: fotos e renders usados nas páginas.
- `fonts/`: Archivo e IBM Plex Mono, locais (o manual abre offline).
- `build/`: fonte e scripts para regenerar tudo.

## O que mudou em relação ao `.dc.html` de origem

- Logos, ícones, tokens e fontes ficaram embutidos; os `<dc-import>` e `<x-import>` viraram HTML/SVG.
- Logo B em todo o manual usa os SVGs finais (texto em curvas). As propostas A e C da página 24 seguem em CSS.
- As 3 menções a "duas faixas" viraram "três faixas" (páginas 13, 17 e 24).
- Capa, agenda (18) e "Borda" (13) desenhavam duas faixas. Ganharam a terceira, na progressão estreita → larga do Logo B.
- Página 17 e 20: os mockups 3D foram pré-renderizados em PNG (`assets/3d-*.png`), então o manual não depende de WebGL nem de CDN.
- Página 19 (uniformes), fotos novas com o Logo B:
  - camiseta branca, frente e costas, a partir das fotos enviadas;
  - boné retocado a partir da foto enviada (azul → grafite, costura amarela → vermelha, logo antigo trocado pelo Logo B negativo).
- A Archivo carrega só com eixo de peso. O logo aprovado tem a palavra em largura normal; o `'wdth' 110/118` do original não tinha efeito.

## Pontos em aberto (do README original, mais o que surgiu)

- Números da empresa, pilares e assinatura verbal continuam fictícios (nota visível na página 03).
- CMYK e Pantone são valores de partida; confirmar com prova de gráfica.
- Página 19: os 90 mm do peito e os 240 mm das costas são estimativas. A camiseta passou de grafite para branca porque as fotos enviadas são brancas; vale confirmar a cor do uniforme.
- Página 23: a lista de arquivos (01 a 09) ainda usa os nomes antigos e cita avatar, adesivagem e assinatura de e-mail que não vieram no pacote. Os arquivos reais estão em `logo-B/`.
- `assets/logo-cadomar-original.png` (logo antigo) não aparece em nenhuma página; a fonte original também não o usava.

## Regenerar

```
python3 build/build.py --lucide <pasta com lucide-static@0.436.0/icons>   # gera index.html
python3 build/compose_shirts.py frente.webp costas.webp assets/camiseta-logo-b.png
python3 build/retouch_cap.py bone.webp assets/bone-logo-b.jpg              # numpy + opencv-python-headless
node build/render3d.mjs <url do index em modo --3d keep> assets/            # three@0.165 local, playwright-core
node build/export.mjs index.html Manual_de_Marca_Cadomar_v2.pdf [pasta-de-capturas]
```
