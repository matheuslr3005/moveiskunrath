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
BG = (7, 14, 17)
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
    # esmaece as bordas para não aparecer emenda entre as duas fotos
    feather = Image.new("L", (w, h), 255)
    px = feather.load()
    for x in range(48):
        v = round(255 * x / 48)
        for y in range(h):
            px[x, y] = min(px[x, y], v)
            px[w - 1 - x, y] = min(px[w - 1 - x, y], v)
    canvas.paste(front, (0, 0), feather)
    canvas.paste(back, (w + GAP, 0), feather)
    canvas.save(out_p, optimize=True)
    print("ok", canvas.size)


if __name__ == "__main__":
    main(*sys.argv[1:4])
