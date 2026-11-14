"""Compose actual Playwright captures; requires Pillow. No simulated screenshots."""
from PIL import Image, ImageDraw, ImageFont
from pathlib import Path
root=Path('artifacts')
font=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',14)
def sheet(files,output,columns,width=480):
    height=300
    out=Image.new('RGB',(columns*width,((len(files)+columns-1)//columns)*height),'#f5f3ea')
    draw=ImageDraw.Draw(out)
    for i,f in enumerate(files):
        im=Image.open(f).convert('RGB');im.thumbnail((width-16,height-40))
        x=i%columns*width+(width-im.width)//2;y=i//columns*height
        out.paste(im,(x,y));draw.text((i%columns*width+12,y+height-28),f.stem.replace('-',' ').title(),fill='#31443b',font=font)
    out.save(root/output)
order=['autumn-bridge','rainy-shelter','blossom-path','winter-window','solar-terrace','cloud-platform','night-archive','rain-station','hill-observatory','orbital-cottage','repair-garden','moonlit-dock']
sheet([root/'studies'/f'{id}.png' for id in order],'study-contact-sheet.png',3)
sheet([root/'techniques'/f'{id}.png' for id in ['procedural','atlas','cutout','hybrid']],'technique-strip.png',4,400)
