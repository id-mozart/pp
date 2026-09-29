#!/usr/bin/env python3
"""Фірмові QR-коди Pan&Partners → public/brand/qr (SVG + PNG 2000 px + архів).

Стиль: заокруглені модулі кольору Ink, три кутові «ока» та вирівнювальний квадрат — у градієнті Ember,
по центру — фірмовий амперсанд із логотипа. Рівень корекції H (30 %), тож центральна плашка не заважає зчитуванню.
Запуск: python3 scripts/brand_qr.py  (потрібні qrcode, Pillow, opencv-python, Google Chrome для PNG і перевірки)
"""
import os, re, subprocess, sys, tempfile, zipfile
import qrcode

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public/brand/qr")
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
ITEMS = [
    ("qr-site", "https://pan-partners.agency/"),
    ("qr-site-uz", "https://pan-partners.agency/uz"),
    ("qr-instagram-tetiana_pan.sales", "https://www.instagram.com/tetiana_pan.sales/"),
    ("qr-instagram-tatiana.pan.sales", "https://www.instagram.com/tatiana.pan.sales/"),
]
INK, WHITE = "#17100B", "#FFFFFF"
Z = 4  # біле поле, модулів
EYE_R = float(os.environ.get("EYE_R", "0.6"))  # радіус кутових квадратів, у модулях

logo = open(os.path.join(ROOT, "public/brand/logo/pan-partners-dark.svg")).read()
AMP = re.search(r' d="([^"]+)"', re.search(r'<path[^>]*fill="url\(#amber\)"[^>]*>', logo, re.S).group(0)).group(1)
AMP_BOX = (1747.0, -722.0, 847.6, 736.0)  # bbox амперсанда в координатах логотипа


def svg_for(url: str) -> str:
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=0, box_size=1)
    q.add_data(url); q.make(fit=True)
    m = q.get_matrix(); n = len(m); ver = (n - 17) // 4
    eyes = [(0, 0), (n - 7, 0), (0, n - 7)]
    in_eye = lambda x, y: any(ex <= x < ex + 7 and ey <= y < ey + 7 for ex, ey in eyes)
    # вирівнювальні квадрати 5×5 (є з версії 2): фарбуємо в акцент
    al = []
    if ver >= 2:
        step = {2: [18], 3: [22], 4: [26], 5: [30], 6: [34], 7: [22, 38], 8: [24, 42], 9: [26, 46], 10: [28, 50]}[ver]
        cs = [6] + step
        al = [(cx, cy) for cx in cs for cy in cs if not in_eye(cx, cy) and not in_eye(cx - 2, cy - 2) and not in_eye(cx + 2, cy + 2)]
    in_al = lambda x, y: any(abs(x - cx) <= 2 and abs(y - cy) <= 2 for cx, cy in al)
    # центральна плашка: непарна кількість модулів, ≈ 24 % сторони
    c = max(7, int(round(n * 0.24)) | 1); c0 = (n - c) // 2
    in_logo = lambda x, y: c0 <= x < c0 + c and c0 <= y < c0 + c

    T = n + 2 * Z
    o = [f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {T} {T}">',
         '<defs><linearGradient id="e" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EE8C2C"/><stop offset=".55" stop-color="#D2701C"/><stop offset="1" stop-color="#B9520F"/></linearGradient>',
         '<linearGradient id="a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7B658"/><stop offset=".52" stop-color="#EE8C2C"/><stop offset="1" stop-color="#DC6716"/></linearGradient></defs>',
         f'<rect width="{T}" height="{T}" fill="{WHITE}"/>']
    # модулі: заокруглені квадрати; сусідні по горизонталі зливаються в «пігулки»
    d = []
    for y in range(n):
        x = 0
        while x < n:
            if m[y][x] and not in_eye(x, y) and not in_al(x, y) and not in_logo(x, y):
                x1 = x
                while x1 + 1 < n and m[y][x1 + 1] and not in_eye(x1 + 1, y) and not in_al(x1 + 1, y) and not in_logo(x1 + 1, y): x1 += 1
                w = x1 - x + 1
                d.append(f'<rect x="{x + Z + .06:.2f}" y="{y + Z + .06:.2f}" width="{w - .12:.2f}" height=".88" rx=".34"/>')
                x = x1 + 1
            else:
                x += 1
    o.append(f'<g fill="{INK}">' + "".join(d) + "</g>")
    for ex, ey in eyes:
        X, Y = ex + Z, ey + Z
        # заокруглення мале: уже з rx ≈ 0.9 суворі сканери (OpenCV) перестають знаходити код — перевірено на 120–2000 px
        o.append(f'<rect x="{X}" y="{Y}" width="7" height="7" rx="{EYE_R}" fill="url(#e)"/>'
                 f'<rect x="{X + 1}" y="{Y + 1}" width="5" height="5" rx="{EYE_R * .55:.2f}" fill="{WHITE}"/>'
                 f'<rect x="{X + 2}" y="{Y + 2}" width="3" height="3" rx="{EYE_R * .45:.2f}" fill="{INK}"/>')
    for cx, cy in al:
        X, Y = cx - 2 + Z, cy - 2 + Z
        o.append(f'<rect x="{X}" y="{Y}" width="5" height="5" rx="{EYE_R * .7:.2f}" fill="url(#e)"/>'
                 f'<rect x="{X + 1}" y="{Y + 1}" width="3" height="3" rx="{EYE_R * .4:.2f}" fill="{WHITE}"/>'
                 f'<rect x="{X + 2 + .04}" y="{Y + 2 + .04}" width=".92" height=".92" rx=".34" fill="{INK}"/>')
    # амперсанд по центру — без плашки й рамки, просто на білому полі
    L = c0 + Z
    bx, by, bw, bh = AMP_BOX
    k = (c * .8) / max(bw, bh)
    tx, ty = L + c / 2 - (bx + bw / 2) * k, L + c / 2 - (by + bh / 2) * k
    o.append(f'<path transform="translate({tx:.3f} {ty:.3f}) scale({k:.6f})" fill="url(#a)" d="{AMP}"/>')
    o.append("</svg>")
    return "\n".join(o) + "\n"


def shot(svg_path: str, png_path: str, px: int):
    with tempfile.TemporaryDirectory() as t:
        h = os.path.join(t, "q.html")
        open(h, "w").write(f'<body style="margin:0;background:#fff"><img src="file://{svg_path}" style="display:block;width:{px}px;height:{px}px">')
        subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars", f"--window-size={px},{px}", f"--screenshot={png_path}", "file://" + h], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main():
    import cv2
    os.makedirs(OUT, exist_ok=True); ok = True
    for name, url in ITEMS:
        s = os.path.join(OUT, name + ".svg"); p = os.path.join(OUT, name + ".png")
        open(s, "w").write(svg_for(url)); shot(s, p, 2000)
        from PIL import Image
        Image.open(p).convert("RGB").save(p, optimize=True)
        res = []
        with tempfile.TemporaryDirectory() as t:
            for px in (2000, 400, 180):  # великий, екранний і дрібний (як у друці 2 см)
                f = os.path.join(t, "v.png"); shot(s, f, px)
                res.append(cv2.QRCodeDetector().detectAndDecode(cv2.imread(f))[0] == url)
        ok &= all(res)
        print(name, "| зчитується: 2000px", res[0], "· 400px", res[1], "· 180px", res[2], "|", os.path.getsize(p) // 1024, "КБ")
    with zipfile.ZipFile(os.path.join(OUT, "pan-partners-qr.zip"), "w", zipfile.ZIP_DEFLATED) as z:
        for name, _ in ITEMS:
            for e in ("svg", "png"): z.write(os.path.join(OUT, f"{name}.{e}"), f"pan-partners-qr/{name}.{e}")
        z.writestr("pan-partners-qr/README.txt", "QR-коди Pan&Partners\n\n" + "\n".join(f"{n}  ->  {u}" for n, u in ITEMS)
                   + "\n\nSVG — для друку й макетів, PNG 2000 px — для презентацій і соцмереж.\nНавколо коду вже є біле поле (4 модулі) — не обрізайте його. Не перефарбовуйте й не кладіть на темний фон без білої підкладки.\nМінімальний розмір у друці — 2,5 × 2,5 см.\n")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
