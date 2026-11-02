import { useRef, useState } from 'react';

export default function RecipeCardVideo({ index, title, chef }: { index: number; title: string; chef?: string | null }) {
  const [version, setVersion] = useState<'classic' | 'signature'>('classic');
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const video = useRef<HTMLVideoElement>(null);
  const base = `/videos/recipe-cards/recipe-card-${String(index + 1).padStart(3, '0')}`;
  async function seek(seconds: number) {
    if (!video.current) return;
    video.current.currentTime = seconds;
    try { await video.current.play(); } catch { /* Native controls remain available. */ }
  }
  return <section className="cooking-walkthrough" aria-label={`${title} instruction videos`}>
    <div className="walkthrough-intro"><div><p className="eyebrow">{chef ? `${chef.toUpperCase()}'S COOK-ALONG` : 'FANCY EATZ COOK-ALONG'}</p><h4>Watch how to make {title}</h4><p>Enlarged ingredients, illustrated directions and serving tips from Lisa's original card. Pause as you cook.</p></div><button type="button" className="primary" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? 'Close Video' : 'Watch Instruction Video'}</button></div>
    {open && <div className="walkthrough-player">
      <div className="walkthrough-transport" role="group" aria-label="Choose recipe video version">{(['classic', 'signature'] as const).map(value => <button type="button" key={value} aria-pressed={version === value} onClick={() => { setVersion(value); setFailed(false); }}>{value === 'classic' ? 'Classic' : 'Fancy Eatz Signature'}</button>)}</div>
      <video key={`${index}-${version}`} ref={video} controls playsInline preload="metadata" style={{display:'block',width:'100%',maxWidth:420,maxHeight:'75vh',margin:'16px auto',background:'#350913'}} aria-label={`${title}, ${version}, illustrated instruction video`} onError={() => setFailed(true)}>
        <source src={`${base}-${version}.mp4`} type="video/mp4" />
        Your browser cannot play this video. Follow the original illustrated recipe card below.
      </video>
      <div className="walkthrough-transport" role="group" aria-label="Instruction video chapters"><button type="button" onClick={() => seek(0)}>Ingredients · 0:00</button><button type="button" onClick={() => seek(18)}>Directions · 0:18</button><button type="button" onClick={() => seek(58)}>Serving Tips · 0:58</button></div>
      <p className="walkthrough-disclosure">Silent illustrated video guide using Lisa's original recipe card. 1:08 of viewing; follow the recipe's cooking times. Each recipe version has its own video.</p>
      {failed && <p role="status">This video could not load. Follow the original illustrated card below or try the other version.</p>}
    </div>}
  </section>;
}
