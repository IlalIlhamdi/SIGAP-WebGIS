import os
import io
import base64
from PIL import Image, ImageDraw

def optimize():
    src_path = 'C:/Users/ASUS/.gemini/antigravity-ide/brain/8549a67b-f51b-4010-a6a7-61f9c169dacf/.tempmediaStorage/media_1791472107014.png'
    im = Image.open(src_path).convert('RGBA')

    # Crop squircle
    crop_box = (76, 76, 1178, 1178)
    cropped = im.crop(crop_box)
    w, h = cropped.size

    # 2x supersampled smooth rounded mask for antialiased corners
    mask_hires = Image.new('L', (w * 2, h * 2), 0)
    draw = ImageDraw.Draw(mask_hires)
    draw.rounded_rectangle([(0, 0), (w * 2, h * 2)], radius=480, fill=255)
    mask = mask_hires.resize((w, h), Image.Resampling.LANCZOS)
    cropped.putalpha(mask)

    # 512x512 standard size
    final_512 = cropped.resize((512, 512), Image.Resampling.LANCZOS)
    
    # Standalone files
    png_path = 'c:/laragon/www/SIGAP/public/logo.png'
    app_icon_png = 'c:/laragon/www/SIGAP/public/app-icon.png'
    webp_path = 'c:/laragon/www/SIGAP/public/logo.webp'
    
    final_512.save(png_path, 'PNG', optimize=True)
    final_512.save(app_icon_png, 'PNG', optimize=True)
    final_512.save(webp_path, 'WEBP', quality=90)

    # Quantize to 256 colors for ultralight PNG embedded in SVG
    q512 = final_512.quantize(colors=256, method=Image.Quantize.FASTOCTREE)
    buf = io.BytesIO()
    q512.save(buf, format='PNG', optimize=True)
    png_data = buf.getvalue()

    b64_png = base64.b64encode(png_data).decode('utf-8')

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <title>SIGAP — Sistem Informasi Geospasial Ancaman Banjir</title>
  <defs>
    <clipPath id="squircle">
      <rect width="512" height="512" rx="112" ry="112" />
    </clipPath>
  </defs>
  <g clip-path="url(#squircle)">
    <image width="512" height="512" href="data:image/png;base64,{b64_png}" />
  </g>
</svg>
'''
    svg_path = 'c:/laragon/www/SIGAP/public/logo.svg'
    app_icon_svg = 'c:/laragon/www/SIGAP/public/app-icon.svg'
    with open(svg_path, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    with open(app_icon_svg, 'w', encoding='utf-8') as f:
        f.write(svg_content)

    print('Generated successfully!')
    print('SVG size:', os.path.getsize(svg_path), 'bytes')
    print('PNG size:', os.path.getsize(png_path), 'bytes')
    print('WebP size:', os.path.getsize(webp_path), 'bytes')

if __name__ == '__main__':
    optimize()
