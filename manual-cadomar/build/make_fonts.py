"""Gera instâncias estáticas da Archivo (um arquivo por peso) a partir da variável.

O Chromium embute fontes variáveis no PDF como Type 3 (glifos desenhados, sem
hinting, que alguns leitores renderizam mal). Com instâncias estáticas o PDF
leva fontes TrueType normais.

Uso: python3 make_fonts.py <archivo-latin-wght-normal.woff2> <archivo-latin-wght-italic.woff2> <pasta-de-saida>
Requer fonttools e brotli.
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

NORMAL_WEIGHTS = (400, 700, 800, 900)
ITALIC_WEIGHTS = (800, 900)


def make(src, weight, out):
    font = TTFont(src)
    static = instancer.instantiateVariableFont(font, {"wght": weight}, updateFontNames=False)
    static.flavor = "woff2"
    static.save(out)
    print("ok", out.name, out.stat().st_size // 1024, "KB")


def main(normal, italic, out_dir):
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)
    for w in NORMAL_WEIGHTS:
        make(normal, w, out_dir / f"archivo-{w}-normal.woff2")
    for w in ITALIC_WEIGHTS:
        make(italic, w, out_dir / f"archivo-{w}-italic.woff2")


if __name__ == "__main__":
    main(*sys.argv[1:4])
