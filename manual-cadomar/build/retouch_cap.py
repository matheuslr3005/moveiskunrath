"""Retoca a foto do boné: apaga o logo antigo, recolore para grafite com
costura vermelha e borda o Logo B (negativo) na frente.

Uso: python3 retouch_cap.py <bone.webp> <saida.jpg>
Requer numpy, Pillow e opencv-python-headless.
"""
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

LOGO = Path(__file__).resolve().parent.parent / "logo-B" / "cadomar-B-negativo.png"

# caixa do logo antigo na foto 2000x1500 (x0, y0, x1, y1), com folga
OLD = (748, 604, 1196, 700)
SRC_DX = 120  # clona tecido mais à direita, longe da costura do painel


def erase_old_logo(bgr):
    x0, y0, x1, y1 = OLD
    h, w = y1 - y0, x1 - x0
    # tecido limpo logo acima, mesma iluminação, para clonar por cima
    src = bgr[y0 - h - 6:y1 - h - 6, x0 + SRC_DX:x1 + SRC_DX].copy()
    mask = np.full((h, w), 255, np.uint8)
    mask[:6] = mask[-6:] = mask[:, :6] = mask[:, -6:] = 0
    cx, cy = (x0 + x1) // 2, (y0 + y1) // 2
    return cv2.seamlessClone(src, bgr, mask, (cx, cy), cv2.NORMAL_CLONE)


def recolor(bgr):
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV_FULL).astype(np.float32)
    hue, sat, val = hsv[..., 0] * 360 / 256, hsv[..., 1] / 255, hsv[..., 2] / 255

    def soft(x, lo, hi):  # rampa suave 0..1
        return np.clip((x - lo) / (hi - lo), 0, 1)

    blue = soft(hue, 205, 225) * (1 - soft(hue, 265, 285)) * soft(sat, 0.18, 0.4)
    yellow = soft(hue, 30, 42) * (1 - soft(hue, 66, 80)) * soft(sat, 0.35, 0.6)
    blue = cv2.GaussianBlur(blue, (0, 0), 0.8)
    yellow = cv2.GaussianBlur(yellow, (0, 0), 0.6)

    out = bgr.astype(np.float32) / 255
    # tecido: mantém o relevo (valor), troca para grafite #14161A -> #3A3F47
    lum = np.clip(val, 0, 1) ** 1.15
    graphite = np.stack([0.052 + lum * 0.205, 0.050 + lum * 0.20, 0.050 + lum * 0.20], -1)  # BGR
    out = out * (1 - blue[..., None]) + graphite * blue[..., None]
    # costura: amarelo -> vermelho Cadomar #DA251C
    red = np.stack([0.03 + val * 0.08, 0.04 + val * 0.11, 0.40 + val * 0.46], -1)  # BGR
    out = out * (1 - yellow[..., None]) + red * yellow[..., None]
    return (np.clip(out, 0, 1) * 255).astype(np.uint8)


def stamp_logo(bgr):
    x0, y0, x1, y1 = OLD
    logo = Image.open(LOGO).convert("RGBA")
    width = 404
    art = logo.resize((width, round(logo.height * width / logo.width)), Image.LANCZOS)
    art = art.rotate(-1.2, resample=Image.BICUBIC, expand=True)
    a = np.asarray(art).astype(np.float32) / 255
    h, w = a.shape[:2]
    x = (x0 + x1) // 2 - w // 2 + 4
    y = (y0 + y1) // 2 - h // 2 + 2

    base = bgr.astype(np.float32) / 255
    region = base[y:y + h, x:x + w]
    # trama do tecido por cima do bordado (alta frequência da própria foto)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY).astype(np.float32) / 255
    weave = gray - cv2.GaussianBlur(gray, (0, 0), 3)
    weave = weave[y:y + h, x:x + w] * 2.6

    alpha = a[..., 3]
    shadow = cv2.GaussianBlur(np.roll(np.roll(alpha, 3, 0), 2, 1), (0, 0), 2.2) * 0.55
    region[:] = region * (1 - shadow[..., None])
    ink = a[..., [2, 1, 0]] * (0.94 + weave[..., None])
    # brilho de fio: leve realce na borda superior das letras
    edge = np.clip(alpha - np.roll(alpha, 2, 0), 0, 1)[..., None] * 0.10
    ink = np.clip(ink + edge, 0, 1)
    region[:] = region * (1 - alpha[..., None] * 0.97) + ink * alpha[..., None] * 0.97
    return (np.clip(base, 0, 1) * 255).astype(np.uint8)


def main(src, dst):
    bgr = cv2.cvtColor(np.asarray(Image.open(src).convert("RGB")), cv2.COLOR_RGB2BGR)
    bgr = erase_old_logo(bgr)
    bgr = recolor(bgr)
    bgr = stamp_logo(bgr)
    Image.fromarray(cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)).save(dst, quality=90, optimize=True)
    print("ok", dst)


if __name__ == "__main__":
    main(*sys.argv[1:3])
