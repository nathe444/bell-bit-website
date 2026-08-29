"""
One-off exploratory script: extracts every embedded raster image from
BellBit Company Profile.pdf into scripts/_pdf-extract/ for manual review.
Not part of the build pipeline -- just used to check whether the PDF
contains usable logo marks or portfolio screenshots.
"""
import os
import fitz  # PyMuPDF

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_PATH = os.path.join(ROOT, "BellBit Company Profile.pdf")
OUT_DIR = os.path.join(ROOT, "scripts", "_pdf-extract")

os.makedirs(OUT_DIR, exist_ok=True)

doc = fitz.open(PDF_PATH)
count = 0
for page_index in range(len(doc)):
    page = doc[page_index]
    images = page.get_images(full=True)
    for img_index, img in enumerate(images):
        xref = img[0]
        base_image = doc.extract_image(xref)
        ext = base_image["ext"]
        width = base_image.get("width")
        height = base_image.get("height")
        filename = f"page{page_index + 1:02d}-img{img_index + 1:02d}-{width}x{height}.{ext}"
        with open(os.path.join(OUT_DIR, filename), "wb") as f:
            f.write(base_image["image"])
        count += 1

print(f"Extracted {count} images to {OUT_DIR}")
