import { useState } from 'react';

export default function RecipeCardVideo({ index, title, chef }: { index: number; title: string; chef?: string | null }) {
  const [version, setVersion] = useState<'classic' | 'signature'>('classic');
  const [open, setOpen] = useState(true);
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
  function narrate() { if (!('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(steps[lessonStep]); utterance.rate = 0.9; window.speechSynthesis.speak(utterance); }
  const cardSrc = '/recipe-cards/recipe-card-' + String(index + 1).padStart(3, '0') + '.jpg';
  const steps = isBakedBeans ? bakedBeansSteps : ['Gather and measure the ingredients shown in this recipe version.', 'Follow the first illustrated preparation step on Lisa’s original card.', 'Continue with the second illustrated cooking step on the original card.', 'Follow the remaining illustrated preparation and cooking directions in order.', 'Finish with the final illustrated step, then review the serving tips on the card.'];
  const lessonStep = Math.min(step, steps.length - 1);
  return <section className="cooking-walkthrough" aria-label={title + ' guided cooking lesson'}>
    <div className="walkthrough-intro"><div><p className="eyebrow">{chef ? chef.toUpperCase() + "'S COOK-ALONG" : 'FANCY EATZ COOK-ALONG'}</p><h4>Cook {title} step by step</h4><p>Explore the original illustrated instructions in Classic or Signature mode.</p></div><button type="button" className="primary" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Close Cooking Lesson' : 'Start Cooking Lesson'}</button></div>
    {open && <div className="recipe-guided-lesson">
      <div className="walkthrough-transport" role="group" aria-label="Choose cooking version">{(['classic','signature'] as const).map(value=><button type="button" key={value} aria-pressed={version===value} onClick={()=>{setVersion(value);setStep(0);if('speechSynthesis' in window)window.speechSynthesis.cancel();}}>{value==='classic'?'Classic':'Fancy Eatz Signature'}</button>)}</div>
      {!isBakedBeans && <div className="original-card-step-view"><div className="original-card-step-image"><img src={cardSrc} alt={`${title} ${version} original illustrated directions, step ${step+1}`} style={{transform:`scale(2.05)`,transformOrigin:`${version==='classic'?'24%':'76%'} ${52+step*8}%`}} /></div><p>Enlarged view of Lisa’s original {version === 'classic' ? 'Classic' : 'Signature'} illustrated directions. Use the full card below for the exact written steps.</p></div>}
      <p className="eyebrow">GUIDED COOKING LESSON · {version==='classic'?'CLASSIC':'SIGNATURE'}</p><h4>Step {step+1} of {steps.length}</h4><p className="recipe-guided-instruction" aria-live="polite">{steps[lessonStep]}</p>
      <div className="walkthrough-transport"><button type="button" disabled={step===0} onClick={()=>setStep(i=>Math.max(0,i-1))}>Previous</button><button type="button" onClick={narrate}>Listen to Step</button><button type="button" disabled={step===steps.length-1} onClick={()=>setStep(i=>Math.min(steps.length-1,i+1))}>Next</button></div>
      <p className="walkthrough-disclosure">Use Lisa's original illustrated card below for precise ingredient quantities and cooking times. For recipes other than Baked Beans, the step viewer highlights the original artwork; detailed spoken transcription is still being prepared. This is not a filmed video.</p>
    </div>}
  </section>;
}
