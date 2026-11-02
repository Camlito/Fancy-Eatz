import { useRef, useState } from 'react';

export default function RecipeCardVideo({ index, title, chef }: { index: number; title: string; chef?: string | null }) {
  const [version, setVersion] = useState<'classic' | 'signature'>('classic');
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [step, setStep] = useState(0);
  const bakedBeansSteps = version === 'classic' ? [
    'Gather the beans, bacon, onion, brown sugar, ketchup, mustard, molasses and seasonings. Preheat the oven to 350 degrees Fahrenheit.',
    'Cook chopped bacon in a skillet until crispy. Drain on paper towels and set aside.',
    'In the same skillet, sauté chopped onion until softened, about 3 to 5 minutes.',
    'Whisk brown sugar, ketchup, mustard, molasses, Worcestershire sauce, salt and pepper until smooth.',
    'Fold the beans, softened onion and bacon into the sauce. Transfer to a 9 by 13 inch baking dish.',
    'Cover with foil and bake at 350 degrees Fahrenheit for one hour. Uncover and bake another 20 to 30 minutes until thick and bubbling. Rest before serving.'
  ] : [
    'Preheat the oven to 350 degrees Fahrenheit. Gather navy beans, thick-cut bacon, onion, bell pepper, brown sugar, molasses, ketchup, Dijon mustard and seasonings.',
    'Cook bacon until crisp. Remove and drain, then sauté the onion and bell pepper in the skillet for about 4 to 5 minutes.',
    'Whisk together molasses, brown sugar, ketchup, Dijon mustard, apple cider vinegar, Worcestershire sauce, smoked paprika, garlic powder, onion powder and optional cayenne or liquid smoke.',
    'Combine beans, sautéed vegetables and bacon with the sauce, coating everything evenly.',
    'Transfer to a 9 by 13 inch baking dish. Cover with foil and bake at 350 degrees Fahrenheit for one hour.',
    'Remove the foil and bake 20 to 30 minutes more until caramelized. Rest for 10 minutes, then garnish and serve.'
  ];
  const isBakedBeans = title === 'Baked Beans';
  function narrate() { if (!isBakedBeans || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(bakedBeansSteps[step]); utterance.rate = 0.9; window.speechSynthesis.speak(utterance); }
  const video = useRef<HTMLVideoElement>(null);
  const base = `/videos/recipe-cards/recipe-card-${String(index + 1).padStart(3, '0')}`;
  async function seek(seconds: number) {
    if (!video.current) return;
    video.current.currentTime = seconds;
    try { await video.current.play(); } catch { /* Native controls remain available. */ }
  }
  return <section className="cooking-walkthrough" aria-label={`${title} instruction videos`}>
    <div className="walkthrough-intro"><div><p className="eyebrow">{chef ? `${chef.toUpperCase()}'S COOK-ALONG` : 'FANCY EATZ COOK-ALONG'}</p><h4>Cook {title} step by step</h4><p>Follow Lisa's original card with a guided lesson. Video previews are illustrated references, not live cooking demonstrations.</p></div><button type="button" className="primary" aria-expanded={open} onClick={() => setOpen(value => !value)}>{open ? 'Close Video' : 'Watch Instruction Video'}</button></div>
    {open && <div className="walkthrough-player">
      {isBakedBeans && <div className="recipe-guided-lesson"><p className="eyebrow">GUIDED COOKING LESSON · {version === 'classic' ? 'CLASSIC' : 'SIGNATURE'}</p><h4>Step {step + 1} of {bakedBeansSteps.length}</h4><p className="recipe-guided-instruction">{bakedBeansSteps[step]}</p><div className="walkthrough-transport"><button type="button" onClick={()=>setStep(i=>Math.max(0,i-1))} disabled={step===0}>Previous</button><button type="button" onClick={narrate}>Listen to Step</button><button type="button" onClick={()=>setStep(i=>Math.min(bakedBeansSteps.length-1,i+1))} disabled={step===bakedBeansSteps.length-1}>Next</button></div><p className="walkthrough-disclosure">Instructions adapted from Lisa's original Baked Beans card. Use the original card below for ingredient quantities.</p></div>}
      <div className="walkthrough-transport" role="group" aria-label="Choose recipe video version">{(['classic', 'signature'] as const).map(value => <button type="button" key={value} aria-pressed={version === value} onClick={() => { setVersion(value); setStep(0); setFailed(false); if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }}>{value === 'classic' ? 'Classic' : 'Fancy Eatz Signature'}</button>)}</div>
      <video key={`${index}-${version}`} ref={video} controls playsInline preload="metadata" style={{display:'block',width:'100%',maxWidth:420,maxHeight:'75vh',margin:'16px auto',background:'#350913'}} aria-label={`${title}, ${version}, illustrated instruction video`} onError={() => setFailed(true)}>
        <source src={`${base}-${version}.mp4`} type="video/mp4" />
        Your browser cannot play this video. Follow the original illustrated recipe card below.
      </video>
      <div className="walkthrough-transport" role="group" aria-label="Instruction video chapters"><button type="button" onClick={() => seek(0)}>Ingredients · 0:00</button><button type="button" onClick={() => seek(18)}>Directions · 0:18</button><button type="button" onClick={() => seek(58)}>Serving Tips · 0:58</button></div>
      <p className="walkthrough-disclosure">Illustrated card preview, not filmed cooking instruction. Follow the guided steps and Lisa's written cooking times. Classic and Signature have separate previews.</p>
      {failed && <p role="status">This video could not load. Follow the original illustrated card below or try the other version.</p>}
    </div>}
  </section>;
}
