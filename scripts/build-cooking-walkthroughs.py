"""Build narrated, captioned illustrated guides using local FFmpeg/Flite only.
Input: a JSON list of three image paths in chicken, pasta, salmon order.
No external speech API or video credit is used.
"""
import json
import subprocess
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORK = Path(sys.argv[2]).resolve()
WORK.mkdir(parents=True, exist_ok=True)
BOARDS = json.loads(Path(sys.argv[1]).read_text())
OUT = ROOT / 'public/videos/cooking'
OUT.mkdir(parents=True, exist_ok=True)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
SERIF = '/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf'
GUIDES = [
    ('Weeknight Garlic Butter Chicken', 'garlic-butter-chicken', 'Garlic Butter Chicken', 1, [
        ('Prep your kitchen', 'Heat the oven to 425°F. Halve the baby potatoes, wash the broccoli, and keep raw chicken on a separate tray.'),
        ('Season and coat', 'Season chicken and potatoes with paprika, salt and pepper. Melt the butter with garlic, then coat the chicken and potatoes.'),
        ('Start roasting', 'Place chicken and potatoes on a sheet pan. Roast at 425°F for 15 minutes before adding the broccoli.'),
        ('Add the broccoli', 'Add broccoli to the pan. Roast 10–15 minutes more. Cooking time varies with chicken thickness and potato size.'),
        ('Check doneness', 'Check the thickest part of the chicken with a food thermometer. It must reach 165°F. Continue cooking as needed until potatoes are tender.'),
        ('Rest and serve', 'Rest the chicken for 5 minutes. Serve with roasted potatoes and broccoli, spooning the pan juices over each plate.')
    ], 'For four servings, mix 2 tablespoons extra-virgin olive oil, 1 tablespoon chopped parsley and 1 teaspoon lemon zest. Drizzle lightly over the plated dish.'),
    ('Creamy Family Chicken Pasta', 'creamy-chicken-pasta', 'Creamy Chicken Pasta', 2, [
        ('Cook the pasta', 'Cook 12 ounces of pasta until al dente. Reserve half a cup of pasta water, then drain.'),
        ('Cook the chicken', 'Season the diced chicken. Sauté in olive oil until the center of the pieces reaches 165°F. Transfer to a clean plate.'),
        ('Build the sauce', 'Lower the heat. Cook minced garlic for about 30 seconds, then add chicken broth and heavy cream.'),
        ('Add Parmesan', 'Simmer the sauce gently. Stir in grated Parmesan until smooth; avoid a hard boil.'),
        ('Bring it together', 'Return the cooked chicken, pasta and spinach to the pan. Toss until spinach wilts and everything is hot.'),
        ('Finish and serve', 'Loosen the sauce with reserved pasta water as needed. Taste, adjust salt and pepper, and serve warm.')
    ], 'For four servings, mix 2 tablespoons extra-virgin olive oil, 1 tablespoon chopped parsley and 1 teaspoon lemon zest. Finish each bowl with a light drizzle.'),
    ('Pan-Seared Salmon with Lemon Cream', 'salmon-lemon-cream', 'Salmon with Lemon Cream', 5, [
        ('Prep the salmon', 'Pat the salmon dry on a separate prep tray. Season with salt and pepper. Have the measured sauce ingredients ready.'),
        ('Sear and check', 'Sear salmon in olive oil until golden, then turn carefully. Continue until the thickest part reaches 145°F. Transfer to a warm plate.'),
        ('Soften the shallot', 'Lower the heat. Add butter and minced shallot to the skillet and cook until the shallot softens.'),
        ('Reduce the broth', 'Add the broth and gently scrape up browned bits. Simmer until the liquid reduces by about half.'),
        ('Finish the sauce', 'Stir in heavy cream and lemon juice. Simmer gently until the sauce lightly thickens.'),
        ('Plate and serve', 'Spoon lemon cream sauce onto warm plates. Add the fully cooked salmon and finish with chopped parsley.')
    ], 'For two servings, mix 1 tablespoon extra-virgin olive oil, half a tablespoon chopped parsley and half a teaspoon lemon zest. Drizzle sparingly around the plated salmon.')
]

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE)

def duration(path):
    return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(path)]))

def speech_text(text):
    return text.replace('425°F', 'four hundred twenty five degrees Fahrenheit').replace('165°F', 'one hundred sixty five degrees Fahrenheit').replace('145°F','one hundred forty five degrees Fahrenheit').replace('10–15','ten to fifteen').replace('Sauté','Saute')

def timestamp(seconds):
    millis = round(seconds * 1000)
    return f'{millis // 3600000:02}:{millis // 60000 % 60:02}:{millis // 1000 % 60:02}.{millis % 1000:03}'

metadata = {}
for index, (title, slug, short, photo_index, base_steps, signature_text) in enumerate(GUIDES):
    folder = WORK / slug
    folder.mkdir(exist_ok=True)
    rendered = []
    chapters = []
    cursor = 0.0
    all_steps = base_steps + [('Your Signature finish', signature_text)]
    for step_index, (label, caption) in enumerate(all_steps):
        audio = folder / f'{step_index}.wav'
        textfile = folder / f'{step_index}-speech.txt'
        textfile.write_text(f'Step {step_index + 1}. ' + speech_text(caption))
        run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','lavfi','-i',f'flite=textfile={textfile}:voice=slt',str(audio)])
        seconds = round(duration(audio) + 1.2, 3)
        caption_file = folder / f'{step_index}-caption.txt'
        caption_file.write_text(textwrap.fill(caption, width=32))
        heading_file = folder / f'{step_index}-heading.txt'
        heading_file.write_text(label)
        title_file = folder / 'title.txt'
        title_file.write_text(short)
        image = Path(BOARDS[index]) if step_index < 6 else ROOT / f'public/images/tasting/meal-{photo_index:02}.webp'
        crop = f'crop=iw/3:ih/2:{step_index % 3}*iw/3:{step_index // 3}*ih/2' if step_index < 6 else 'crop=iw/2:ih:iw/2:0'
        filters = [crop, 'scale=480:480', 'pad=960:540:20:30:color=0x3b0a16',
          f'drawtext=fontfile={FONT}:text=FANCY EATZ:fontsize=16:fontcolor=0xe5bd77:x=530:y=32',
          f'drawtext=fontfile={SERIF}:textfile={title_file}:fontsize=20:fontcolor=0xfff5e4:x=530:y=65',
          f'drawtext=fontfile={FONT}:text=STEP {step_index + 1}:fontsize=16:fontcolor=0xe5bd77:x=530:y=108',
          f'drawtext=fontfile={FONT}:textfile={heading_file}:fontsize=23:fontcolor=white:x=530:y=137',
          f'drawtext=fontfile={FONT}:textfile={caption_file}:fontsize=20:line_spacing=8:fontcolor=0xfff5e4:x=530:y=190',
          f'drawtext=fontfile={FONT}:text=Illustrated guide - not live footage:fontsize=12:fontcolor=0xe5bd77:x=530:y=490',
          f'drawtext=fontfile={FONT}:text=Playback time is not cooking time:fontsize=12:fontcolor=0xe5bd77:x=530:y=510']
        clip = folder / f'{step_index}.mp4'
        run(['ffmpeg','-y','-hide_banner','-loglevel','error','-loop','1','-framerate','15','-i',str(image),'-i',str(audio),'-vf',','.join(filters),'-af','apad','-t',str(seconds),'-c:v','libx264','-preset','veryfast','-tune','stillimage','-crf','28','-pix_fmt','yuv420p','-c:a','aac','-b:a','48k','-ar','24000','-ac','1','-movflags','+faststart',str(clip)])
        actual = duration(clip)
        rendered.append(clip)
        chapters.append({'label': label, 'start': round(cursor,3), 'end': round(cursor+actual,3), 'caption': caption})
        cursor += actual
        print(f'{slug}: rendered step {step_index+1}', flush=True)
    versions = {}
    for version, count in [('classic',6),('signature',7)]:
        playlist = folder / f'{version}.txt'
        playlist.write_text(''.join(f"file '{path}'\n" for path in rendered[:count]))
        video = OUT / f'{slug}-{version}.mp4'
        run(['ffmpeg','-y','-hide_banner','-loglevel','error','-f','concat','-safe','0','-i',str(playlist),'-c','copy','-movflags','+faststart',str(video)])
        vtt = OUT / f'{slug}-{version}.vtt'
        vtt.write_text('WEBVTT\n\n'+'\n\n'.join(f'{timestamp(chapter["start"])} --> {timestamp(chapter["end"])}\n{chapter["caption"]}' for chapter in chapters[:count])+'\n')
        poster = video.with_suffix('.jpg')
        run(['ffmpeg','-y','-hide_banner','-loglevel','error','-ss','0.8','-i',str(video),'-frames:v','1','-q:v','3',str(poster)])
        versions[version] = {'src': f'/videos/cooking/{video.name}', 'poster': f'/videos/cooking/{poster.name}', 'captions': f'/videos/cooking/{vtt.name}', 'duration': round(duration(video),3), 'steps': chapters[:count]}
    metadata[title] = versions
(ROOT / 'src/cookingWalkthroughs.ts').write_text('export type WalkthroughVideo = { src: string; poster: string; captions: string; duration: number; steps: { label: string; start: number; end: number; caption: string }[] };\n\nexport const cookingWalkthroughs: Record<string, { classic: WalkthroughVideo; signature: WalkthroughVideo }> = '+json.dumps(metadata,indent=2)+';\n')
print('Six narrated walkthroughs and captions ready.', flush=True)
