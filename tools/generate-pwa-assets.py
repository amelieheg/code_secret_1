"""Génération locale des images. Outils de développement : Pillow et ReportLab.
Aucune bibliothèque Python n’est utilisée par le jeu publié.
"""
from pathlib import Path
from PIL import Image, ImageDraw
from reportlab.graphics.barcode import qrencoder

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / "assets"
DEST.mkdir(exist_ok=True)
PUBLIC_URL = "https://amelieheg.github.io/code_secret_1/"

# Une icône originale : quatre pions au centre, protégés du recadrage Android.
canvas = Image.new("RGB", (1024, 1024), "#292b25")
draw = ImageDraw.Draw(canvas)
for x, y, color in [(392,392,"#df5b59"), (632,392,"#5988cf"),
                     (392,632,"#639b76"), (632,632,"#e7bf4b")]:
    draw.ellipse((x-84,y-84,x+84,y+84), fill=color)
for name, size in [("icon-192.png",192), ("icon-512.png",512),
                   ("icon-maskable-512.png",512), ("apple-touch-icon.png",180)]:
    canvas.resize((size,size), Image.Resampling.LANCZOS).save(DEST / name)

# QR sans service tiers, sans suivi, avec une marge blanche de quatre modules.
code = qrencoder.QRCode(None, qrencoder.QRErrorCorrectLevel.M)
code.addData(PUBLIC_URL)
code.make()
count = code.getModuleCount()
scale, border = 10, 4
image = Image.new("RGB", ((count+border*2)*scale,)*2, "white")
draw = ImageDraw.Draw(image)
for row in range(count):
    for col in range(count):
        if code.isDark(row, col):
            x, y = (col+border)*scale, (row+border)*scale
            draw.rectangle((x,y,x+scale-1,y+scale-1), fill="black")
image.save(DEST / "qr-code-secret.png")
print(f"Icônes et QR créés : {PUBLIC_URL}")
