"""Render exact original recipe-card content into silent, captioned MP4 guides.
No OCR, rewritten recipes, third-party footage, or external API is used.
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import subprocess, tempfile, shutil
from PIL import Image, ImageDraw, ImageFont, ImageOps
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/videos/recipe-cards'; OUT.mkdir(parents=True,exist_ok=True)
FONT='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def render(job):
    card,version=job
    target=OUT/f'{card.stem}-{version}.mp4'
    if target.exists() and subprocess.run(['ffprobe','-v','error',str(target)],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode == 0: return
    im=Image.open(card).convert('RGB'); w,h=im.size
    left,right=(.015,.492) if version=='classic' else (.508,.985)
    sections=[('Ingredients & preparation',.20,.56,18),('Follow the illustrated directions',.43,.89,40),('Finishing tips & serving',.85,.965,10)]
    with tempfile.TemporaryDirectory() as td:
        td=Path(td); playlist=[]
        for i,(label,top,bottom,seconds) in enumerate(sections):
            canvas=Image.new('RGB',(640,1136),'#350913'); d=ImageDraw.Draw(canvas)
            d.text((28,24),'FANCY EATZ',font=ImageFont.truetype(FONT,24),fill='#e6c589')
            d.text((28,70),'CLASSIC' if version=='classic' else 'FANCY EATZ SIGNATURE',font=ImageFont.truetype(FONT,24),fill='white')
            d.text((28,116),label,font=ImageFont.truetype(FONT,22),fill='#e6c589')
            crop=im.crop((int(w*left),int(h*top),int(w*right),int(h*bottom)))
            crop=ImageOps.contain(crop,(612,866),Image.Resampling.LANCZOS)
            canvas.paste(crop,((640-crop.width)//2,170+(866-crop.height)//2))
            d.text((24,1060),'Pause to cook · Replay any section',font=ImageFont.truetype(FONT,22),fill='white')
            d.text((24,1100),'Illustrated card guide · Viewing time ≠ cooking time',font=ImageFont.truetype(FONT,18),fill='#e6c589')
            frame=td/f'{i}.png'; canvas.save(frame)
            playlist.extend([f"file '{frame}'",f'duration {seconds}'])
        playlist.append(f"file '{td/'2.png'}'")
        listing=td/'frames.txt'; listing.write_text('\n'.join(playlist))
        encoded=td/'finished.mp4'
        subprocess.run(['ffmpeg','-nostdin','-y','-v','error','-threads','1','-f','concat','-safe','0','-i',str(listing),'-vf','fps=2,format=yuv420p','-t','68','-c:v','libx264','-threads','1','-preset','veryfast','-tune','stillimage','-crf','24','-movflags','+faststart',str(encoded)],check=True)
        subprocess.run(['ffprobe','-v','error',str(encoded)],check=True,stdout=subprocess.DEVNULL)
        pending=target.with_suffix('.tmp')
        shutil.copyfile(encoded,pending)
        pending.replace(target)
    return target.name
cards=sorted((ROOT/'public/recipe-cards').glob('recipe-card-*.jpg'))
assert len(cards)==95
with ThreadPoolExecutor(max_workers=5) as pool:
    for i,name in enumerate(pool.map(render,[(p,v) for p in cards for v in ['classic','signature']])):
        if i%20==0: print(f'Rendered {i+1}/190: {name}',flush=True)
print('Complete: 190 original-card video guides',flush=True)
