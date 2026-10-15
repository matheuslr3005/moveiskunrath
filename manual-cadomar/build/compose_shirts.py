"""Aplica o Logo B (versão em cor) nas fotos de camiseta branca, frente e costas.

Uso: python3 compose_shirts.py <frente.webp> <costas.webp> <saida.png>
A tinta é aplicada em multiply sobre a luminância local do tecido, para a
estampa acompanhar as dobras e sombras da foto.
"""
import sys
from pathlib import Path

from PIL import Image, ImageChops, ImageFilter

HERE = Path(__file__).resolve().parent
LOGO = HERE.parent / "logo-B" / "cadomar-B-cor.png"
BG = (14, 22, 26)  # média das bordas das duas fotos; o painel no manual usa #0E161A
GAP = 0


def luminance(img):
    return img.convert("L")


def stamp(base, logo, cx, cy, width, rotate=0.0):
    """Estampa `logo` centrado em (cx, cy) com `width` px, seguindo o tecido."""
    h = round(logo.height * width / logo.width)
    art = logo.resize((width, h), Image.LANCZOS)
    if rotate:
        art = art.rotate(rotate, resample=Image.BICUBIC, expand=True)
    x, y = round(cx - art.width / 2), round(cy - art.height / 2)

    patch = base.crop((x, y, x + art.width, y + art.height)).convert("RGB")
    lum = luminance(patch).filter(ImageFilter.GaussianBlur(1.2))
    # normaliza: tecido branco ~1.0, sombra < 1.0, com piso para não apagar a cor
    shade = lum.point(lambda v: min(255, round(40 + v * 0.95)))
    ink = Image.merge("RGB", art.split()[:3])
    shaded = ImageChops.multiply(ink, Image.merge("RGB", (shade, shade, shade)))
    shaded = ImageChops.add(shaded, Image.new("RGB", shaded.size, (6, 4, 4)))
    alpha = art.split()[3].point(lambda a: round(a * 0.94))
    patch.paste(shaded, (0, 0), alpha)
    base.paste(patch, (x, y))


def main(front_p, back_p, out_p):
    front = Image.open(front_p).convert("RGB")
    back = Image.open(back_p).convert("RGB")
    logo = Image.open(LOGO).convert("RGBA")
    # frente: peito esquerdo de quem veste (lado direito da foto), ~90 mm
    stamp(front, logo, cx=612, cy=345, width=122)
    # costas: assinatura principal centralizada na área alta
    stamp(back, logo, cx=470, cy=330, width=330)

    w, h = front.size
    canvas = Image.new("RGB", (w * 2 + GAP, h), BG)
    # esmaece as bordas para não aparecer emenda nem retângulo: laterais curtas,
    # topo curto e base longa (as camisetas são cortadas pelo quadro da foto)
    feather = Image.new("L", (w, h), 255)
    px = feather.load()
    side, top, bottom = 48, 40, 130
    for y in range(h):
        for x in range(w):
            f = min(x / side, (w - 1 - x) / side, y / top, (h - 1 - y) / bottom, 1.0)
            px[x, y] = round(255 * max(f, 0))
    canvas.paste(front, (0, 0), feather)
    canvas.paste(back, (w + GAP, 0), feather)
    canvas.save(out_p, optimize=True)
    print("ok", canvas.size)


if __name__ == "__main__":
    main(*sys.argv[1:4])
