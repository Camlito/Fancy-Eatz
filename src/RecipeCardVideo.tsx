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
  const detailedSteps: Record<string, {classic:string[];signature:string[]}> = {
    'Baked Banana Pudding': {
      classic: [
        'In a medium saucepan, whisk sugar, flour, and salt. Slowly add milk, stirring constantly. Cook over medium heat until thickened and smooth. Remove from heat.',
        'Gradually whisk a small amount of the hot mixture into the beaten egg yolks, then whisk back into the saucepan. Cook for 2 to 3 minutes until thick. Remove from heat and stir in vanilla and butter.',
        'In a greased 2-quart baking dish, layer vanilla wafers, sliced bananas, and warm custard. Repeat layers, ending with custard on top.',
        'In a bowl, whip heavy cream and powdered sugar until soft peaks form. Spread over the top of the pudding.',
        'Bake at 350°F for 20 to 25 minutes, or until the top is golden brown. Allow to cool slightly. Serve warm or chilled.'
      ],
      signature: [
        'In a skillet, melt butter and brown sugar over medium heat. Add sliced bananas and cinnamon. Cook for 2 to 3 minutes until lightly caramelized. Set aside.',
        'Whisk together sugar, flour, and salt. Slowly add milk and cook until thickened. Temper in egg yolks, return to heat, and cook 2 to 3 minutes. Remove from heat and stir in vanilla and butter.',
        'In a greased 2-quart baking dish, layer vanilla wafers, caramelized bananas, and custard. Repeat layers, ending with custard on top.',
        'Beat cream cheese until smooth. Add powdered sugar and vanilla. In a separate bowl, whip heavy cream until stiff peaks form, then fold into the cream cheese mixture.',
        'Spread the cream cheese topping over the pudding. Sprinkle with crushed wafers. Bake at 350°F for 20 to 25 minutes or until golden. Drizzle with caramel sauce if desired.'
      ]
    },
    'Baked Spaghetti': {
      classic: [
        'In a large skillet, cook ground beef and diced onions over medium heat until browned. Add garlic and cook for 1 minute. Drain excess grease if needed.',
        'Stir in spaghetti sauce, diced tomatoes if using, Italian seasoning, salt, and pepper. Simmer for 10 to 15 minutes.',
        'Cook spaghetti according to package directions until al dente. Drain and toss with butter if desired.',
        'Spread a layer of noodles in a greased 9 by 13 inch baking dish. Add meat sauce, mozzarella, and Parmesan. Repeat layers, ending with cheese.',
        'Cover with foil and bake at 350°F for 25 minutes. Remove foil and bake 10 more minutes until the cheese is melted and golden.'
      ],
      signature: [
        'In a large skillet, heat olive oil over medium heat. Cook ground beef and Italian sausage until browned. Add onions and cook until soft. Add garlic and cook for 1 minute.',
        'Stir in marinara sauce, fire-roasted tomatoes, tomato paste, Italian seasoning, red pepper flakes, salt, and pepper. Simmer for 15 to 20 minutes.',
        'In a bowl, combine ricotta cheese, cream cheese, Parmesan cheese, and mozzarella. Mix well.',
        'In a greased 9 by 13 inch baking dish, layer spaghetti, meat sauce, ricotta mixture, and mozzarella. Repeat layers, ending with sauce and a generous topping of mozzarella and Parmesan.',
        'Cover with foil and bake at 350°F for 25 minutes. Remove foil and bake another 15 to 20 minutes until bubbly and golden brown. Rest for 5 to 10 minutes before serving.'
      ]
    }
  };
  const isBakedBeans = title === 'Baked Beans';
  function narrate() { if (!hasLesson || !('speechSynthesis' in window)) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(steps[lessonStep]); utterance.rate = 0.9; window.speechSynthesis.speak(utterance); }
  const steps = isBakedBeans ? bakedBeansSteps : detailedSteps[title]?.[version] || [];
  const hasLesson = steps.length > 0;
  const lessonStep = Math.min(step, Math.max(0, steps.length - 1));
  if (!hasLesson) return null;
  return <section className="cooking-walkthrough" aria-label={title + ' guided cooking lesson'}>
    <div className="walkthrough-intro"><div><p className="eyebrow">{chef ? chef.toUpperCase() + "'S COOK-ALONG" : 'FANCY EATZ COOK-ALONG'}</p><h4>Cook {title} step by step</h4><p>Choose Classic or Signature and follow Lisa's cooking directions.</p></div><button type="button" className="primary" aria-expanded={open} onClick={() => setOpen(v => !v)}>{open ? 'Close Cooking Lesson' : 'Start Cooking Lesson'}</button></div>
    {open && <div className="recipe-guided-lesson">
      <div className="walkthrough-transport" role="group" aria-label="Choose cooking version">{(['classic','signature'] as const).map(value=><button type="button" key={value} aria-pressed={version===value} onClick={()=>{setVersion(value);setStep(0);if('speechSynthesis' in window)window.speechSynthesis.cancel();}}>{value==='classic'?'Classic':'Fancy Eatz Signature'}</button>)}</div>
      {!hasLesson && <div className="recipe-lesson-pending"><h4>Original {version === 'classic' ? 'Classic' : 'Signature'} cooking directions</h4><p>Follow the numbered preparation instructions on Lisa's illustrated recipe card immediately below. The written cook-along for this meal has not been verified yet, so we are not showing generic steps as if they were Lisa's instructions.</p></div>}
      {hasLesson && <>      <p className="eyebrow">GUIDED COOKING LESSON · {version==='classic'?'CLASSIC':'SIGNATURE'}</p><h4>Step {step+1} of {steps.length}</h4><p className="recipe-guided-instruction" aria-live="polite">{steps[lessonStep]}</p>
      <div className="walkthrough-transport"><button type="button" disabled={step===0} onClick={()=>setStep(i=>Math.max(0,i-1))}>Previous</button><button type="button" onClick={narrate}>Listen to Step</button><button type="button" disabled={step===steps.length-1} onClick={()=>setStep(i=>Math.min(steps.length-1,i+1))}>Next</button></div>
      <p className="walkthrough-disclosure">Use Lisa's original illustrated card below for exact ingredient quantities and cooking times.</p></>}
    </div>}
  </section>;
}
