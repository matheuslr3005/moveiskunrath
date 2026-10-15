"""Converte o manual-fonte (.dc.html, runtime proprietário) em HTML estático.

  python3 build.py [--3d keep|img] [--lucide DIR]

  --3d keep  mantém os <cdm-3d> (usado só para renderizar os PNGs 3D)
  --3d img   troca cada <cdm-3d data-out=...> pelo PNG já renderizado (padrão)
"""
import argparse
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SRC = HERE / "Manual_de_Marca_Cadomar_v2.dc.html"

R, K, W = "#DA251C", "#14161A", "#FFFFFF"


def attrs(tag):
    return dict(re.findall(r'([\w-]+)="([^"]*)"', tag))


# ---------------------------------------------------------------- logo ----
def logo_colors(p, fundo, mono):
    bg = K if fundo == "escuro" else R if fundo == "vermelho" else W
    c1 = c2 = c3 = None
    if p == "a":
        if mono == "preto": c1, c2 = K, W
        elif mono == "branco": c1, c2 = W, (K if bg == W else bg)
        elif fundo == "vermelho": c1, c2 = W, R
        else: c1, c2 = R, W
    elif p == "b":
        if mono: c1 = c2 = K if mono == "preto" else W
        elif fundo == "vermelho": c1 = c2 = W
        elif fundo == "escuro": c1, c2 = R, W
        else: c1 = c2 = R
    else:
        if mono == "preto": c1, c3, c2 = K, W, K
        elif mono == "branco": c1, c3, c2 = W, (K if bg == W else bg), W
        elif fundo == "vermelho": c1, c3, c2 = W, R, W
        elif fundo == "escuro": c1, c3, c2 = R, W, W
        else: c1, c3, c2 = R, W, K
    return c1, c2, c3


CLIP = "clip-path:polygon(0.306em 0, 100% 0, calc(100% - 0.306em) 100%, 0 100%);"


def logo_html(a):
    p = a.get("proposta", "b")
    fundo = a.get("fundo", "claro")
    mono = a.get("mono", "")
    simbolo = "true" in a.get("simbolo", "")
    altura = float(a.get("altura", 48))
    c1, c2, c3 = logo_colors(p, fundo, mono)
    if p == "b":
        # arquivos finais do Logo B (texto convertido em curvas)
        if mono == "preto": name = "preto"
        elif mono == "branco" or fundo == "vermelho": name = "branco"
        elif fundo == "escuro": name = "negativo"
        else: name = "cor"
        if simbolo:
            name = {"preto": "simbolo-preto", "branco": "simbolo-branco"}.get(name, "simbolo-vermelho")
        # no componente original a altura da faixa é 0.62 * altura
        h = round(0.62 * altura, 2)
        return (f'<img src="logo-B/cadomar-B-{name}.svg" alt="Cadomar" '
                f'style="height:{h}px; width:auto; display:inline-block; vertical-align:middle;">')
    base = (f"display:inline-flex; font-size:{altura:g}px; line-height:1; "
            "font-family:'Archivo', sans-serif; vertical-align:middle;")
    if p == "a":
        return (f'<div style="{base}"><div style="display:inline-flex; align-items:center; justify-content:center; '
                f"height:1em; padding:0 0.62em; background:{c1}; {CLIP}\">"
                f'<span style="font-size:0.62em; font-style:italic; font-weight:800; font-variation-settings:\'wdth\' 112; '
                f'letter-spacing:0.01em; color:{c2}; line-height:1; transform:translateY(0.02em); white-space:nowrap;">CADOMAR</span></div></div>')
    return (f'<div style="{base}"><div style="display:inline-flex; align-items:center; gap:0.26em; height:1em;">'
            f'<span style="display:flex; align-items:center; justify-content:center; width:1.2em; height:1em; background:{c1}; {CLIP}">'
            f'<span style="font-size:0.82em; font-style:italic; font-weight:900; font-variation-settings:\'wdth\' 120; '
            f'color:{c3}; line-height:0.74; padding-top:0.03em;">C</span></span>'
            f'<span style="font-size:0.86em; font-weight:800; font-variation-settings:\'wdth\' 125; letter-spacing:0.04em; '
            f'color:{c2}; line-height:0.74; padding-top:0.03em; white-space:nowrap;">CADOMAR</span></div></div>')


# --------------------------------------------------------------- icons ----
def icon_html(a, lucide):
    svg = (Path(lucide) / f"{a['name']}.svg").read_text()
    svg = re.sub(r"<!--.*?-->", "", svg, flags=re.S).strip()
    svg = re.sub(r'\s+class="[^"]*"', "", svg, count=1)
    svg = svg.replace('width="24"', 'width="100%"').replace('height="24"', 'height="100%"')
    svg = svg.replace("<svg", '<svg style="display:block"', 1)
    svg = re.sub(r"\s*\n\s*", " ", svg)
    size = a.get("size", "20px")
    return (f'<span role="img" aria-label="{a["name"]}" style="display:inline-flex; flex:none; '
            f'width:{size}; height:{size}; color:{a.get("color", "currentColor")}; line-height:0;">{svg}</span>')


# ------------------------------------------------------------ conteúdo ----
COPY_FIXES = [
    # pendência do README: "duas faixas" -> "três faixas"
    ("Duas faixas cortando a margem direita.", "Três faixas cortando a margem direita."),
    ("e duas faixas de borda na traseira.", "e três faixas de borda na traseira."),
    ("A placa vira duas faixas inclinadas.", "A placa vira três faixas inclinadas."),
    # página 19: fotos novas, com o Logo B
    ("Grafite. Assinatura principal em branco no peito esquerdo com 90 mm. Costas sem aplicação.",
     "Branca. Assinatura principal em cor no peito esquerdo, com 90 mm. Nas costas, a assinatura principal centralizada, com 240 mm."),
    ("Assinatura principal bordada na frente, em branco com símbolo vermelho, 90 mm.",
     "Grafite, com costura vermelha na aba. Assinatura principal bordada na frente, em branco com símbolo vermelho, 90 mm."),
]

SK = 'background:#DA251C; transform:skewX(-17deg);"></div>'
# o logo aprovado tem três faixas: os três desenhos que ainda mostravam duas ganham a terceira
STRIPE_FIXES = [
    # capa: faixa mais estreita à esquerda das duas existentes
    ('<div style="position:absolute; top:-10%; bottom:-10%; right:104px; width:20px; ' + SK,
     '<div style="position:absolute; top:-10%; bottom:-10%; right:136px; width:14px; ' + SK + '\n      '
     '<div style="position:absolute; top:-10%; bottom:-10%; right:104px; width:20px; ' + SK),
    # agenda (página 18)
    ('<div style="position:absolute; top:-10%; bottom:-10%; right:44px; width:10px; ' + SK,
     '<div style="position:absolute; top:-10%; bottom:-10%; right:62px; width:7px; ' + SK + '\n          '
     '<div style="position:absolute; top:-10%; bottom:-10%; right:44px; width:10px; ' + SK),
    # borda (página 13)
    ('<div style="position:absolute; top:-10%; bottom:-10%; right:22%; width:16%; ' + SK,
     '<div style="position:absolute; top:-10%; bottom:-10%; right:42%; width:11%; ' + SK +
     '<div style="position:absolute; top:-10%; bottom:-10%; right:22%; width:16%; ' + SK),
]

COVER_GRID = ('<div style="position:relative; height:100%; background:#14161A; display:grid; '
              'grid-template-columns:minmax(0,1fr) minmax(0,1fr); overflow:hidden;">')
# tira por cima da emenda das duas colunas: a borda fracionária da coluna da foto vazava 1px azul
COVER_SEAM = '<div style="position:absolute; top:0; bottom:0; left:calc(50% - 2px); width:4px; background:#14161A; z-index:5;"></div>'

# página 3: foto achatada numa única imagem (sem máscara nem blend, que quebram em vários leitores de PDF)
# e confinada à metade esquerda, esmaecendo para o branco antes da coluna de texto.
P3_BLOCK = re.compile(r'<div style="position:absolute; left:0; top:0; bottom:0; width:60%; background:linear-gradient\(180deg,#182F42 0%,#3C6C93 55%,#7FA2BE 100%\); '
                      r'-webkit-mask-image[^"]*">\s*<img src="assets/frota-patio.jpeg"[^>]*>\s*<div [^>]*></div>\s*</div>')
P3_LIVE = ('<div data-bake="p3" style="position:absolute; left:0; top:0; bottom:0; width:50%; overflow:hidden; '
           'background:linear-gradient(180deg,#182F42 0%,#3C6C93 55%,#7FA2BE 100%);">'
           '<img src="assets/frota-patio.jpeg" alt="" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; '
           'object-position:30% 50%; mix-blend-mode:luminosity; opacity:.9; display:block;">'
           '<div style="position:absolute; inset:0; background:linear-gradient(180deg,rgba(24,47,66,0) 45%,rgba(24,47,66,.85) 100%);"></div>'
           '<div style="position:absolute; inset:0; background:linear-gradient(90deg,rgba(255,255,255,0) 0%,rgba(255,255,255,0) 42%,rgba(255,255,255,.55) 72%,#FFFFFF 100%);"></div>'
           '</div>')
P3_FLAT = ('<img src="assets/bake-p3.jpg" alt="Frota Cadomar no pátio de Canoas" '
           'style="position:absolute; left:0; top:0; bottom:0; width:50%; height:100%; object-fit:cover; display:block;">')

IMG_CAMISETA = re.compile(r'<div style="min-height:0; position:relative; background:#FFFFFF; border-radius:4px; overflow:hidden;">'
                          r'<img src="assets/camiseta-com-logo.png"[^>]*></div>')
IMG_BONE = re.compile(r'<div style="min-height:0; position:relative; background:#D9D8D6; border-radius:4px; overflow:hidden;">'
                      r'<img src="assets/bone-com-logo.png"[^>]*></div>')
NEW_CAMISETA = ('<div style="min-height:0; position:relative; background:#0E161A; border-radius:4px; overflow:hidden;">'
                '<img src="assets/camiseta-logo-b.png" alt="Camiseta branca com o logo Cadomar B, frente e costas" '
                'style="position:absolute; inset:0; width:100%; height:100%; object-fit:contain; display:block;"></div>')
NEW_BONE = ('<div style="min-height:0; position:relative; background:#D9D8D6; border-radius:4px; overflow:hidden;">'
            '<img src="assets/bone-logo-b.jpg" alt="Boné grafite com o logo Cadomar B bordado na frente" '
            'style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; object-position:50% 55%; display:block;"></div>')

HEAD = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Manual de Marca Cadomar</title>
<link rel="icon" href="logo-B/cadomar-B-simbolo-vermelho.svg">
<style>
  @font-face{font-family:'Archivo';font-style:normal;font-weight:400;font-display:block;src:url(fonts/archivo-400-normal.woff2) format('woff2')}
  @font-face{font-family:'Archivo';font-style:normal;font-weight:700;font-display:block;src:url(fonts/archivo-700-normal.woff2) format('woff2')}
  @font-face{font-family:'Archivo';font-style:normal;font-weight:800;font-display:block;src:url(fonts/archivo-800-normal.woff2) format('woff2')}
  @font-face{font-family:'Archivo';font-style:normal;font-weight:900;font-display:block;src:url(fonts/archivo-900-normal.woff2) format('woff2')}
  @font-face{font-family:'Archivo';font-style:italic;font-weight:800;font-display:block;src:url(fonts/archivo-800-italic.woff2) format('woff2')}
  @font-face{font-family:'Archivo';font-style:italic;font-weight:900;font-display:block;src:url(fonts/archivo-900-italic.woff2) format('woff2')}
  @font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:400;font-display:block;src:url(fonts/ibm-plex-mono-latin-400-normal.woff2) format('woff2')}
  @font-face{font-family:'IBM Plex Mono';font-style:normal;font-weight:600;font-display:block;src:url(fonts/ibm-plex-mono-latin-600-normal.woff2) format('woff2')}
  doc-page:not(:defined){visibility:hidden}
  doc-page{font-family:'Archivo',sans-serif}
  body{margin:0;font-family:'Archivo',sans-serif;color:#2A2E35;-webkit-font-smoothing:antialiased}
  a{color:#BE1E15}
  a:hover{color:#9C1710}
</style>
</head>
<body>
<doc-page size="a4" orientation="landscape">
"""

TAIL = """
</doc-page>
<script src="doc-page.js"></script>
%s
</body>
</html>
"""


def build(mode, lucide, out, bake_prep=False):
    src = SRC.read_text()
    body = src[src.index('<doc-page'):src.index("</doc-page>")]
    body = body[body.index(">") + 1:]

    body = re.sub(r"<dc-import [^>]*>\s*</dc-import>", lambda m: logo_html(attrs(m.group(0))), body)
    body = re.sub(r"<x-import [^>]*>\s*</x-import>", lambda m: icon_html(attrs(m.group(0)), lucide), body)

    # nota "dados demonstrativos" (propriedade marcarDemonstrativos = true no original)
    body = re.sub(r"<sc-if [^>]*>", "", body).replace("</sc-if>", "")

    for old, new in COPY_FIXES:
        assert old in body, f"trecho não encontrado: {old[:50]}"
        body = body.replace(old, new)
    assert len(P3_BLOCK.findall(body)) == 1, "bloco da foto da página 3 não encontrado"
    body = P3_BLOCK.sub(P3_LIVE if bake_prep else P3_FLAT, body)
    assert body.count(COVER_GRID) == 1
    body = body.replace(COVER_GRID, COVER_GRID + COVER_SEAM)
    for old, new in STRIPE_FIXES:
        assert body.count(old) == 1, f"faixa não encontrada: {old[:70]}"
        body = body.replace(old, new)
    assert IMG_CAMISETA.search(body) and IMG_BONE.search(body)
    body = IMG_CAMISETA.sub(NEW_CAMISETA, body)
    body = IMG_BONE.sub(NEW_BONE, body)

    body = re.sub(r'(<cdm-3d kind="(truck|facade)"[^>]*?)>',
                  lambda m: f'{m.group(1)} data-out="3d-{m.group(2)}.png">', body)

    if mode == "img":
        def to_img(m):
            a = attrs(m.group(0))
            return (f'<img src="assets/{a["data-out"]}" alt="" style="position:absolute; inset:0; width:100%; '
                    f'height:100%; object-fit:contain; display:block;">')
        body = re.sub(r"<cdm-3d [^>]*>\s*</cdm-3d>", to_img, body)
        extra = ""
    else:
        extra = '<script src="mockups3d.js"></script>'

    leftover = re.findall(r"<(?:dc-import|x-import|sc-if|sc-for)\b|\{\{", body)
    assert not leftover, leftover
    Path(out).write_text(HEAD + body + TAIL % extra)
    print("escrito", out, f"({len(body)//1024} KB de corpo)")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--3d", dest="mode", default="img", choices=["keep", "img"])
    ap.add_argument("--lucide", required=True)
    ap.add_argument("--out", default=str(ROOT / "index.html"))
    ap.add_argument("--bake-prep", action="store_true", help="mantém a foto da pág. 3 em HTML para gerar assets/bake-p3.jpg")
    a = ap.parse_args()
    build(a.mode, a.lucide, a.out, a.bake_prep)
