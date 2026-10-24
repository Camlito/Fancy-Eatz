import { useEffect, useState } from 'react';

export type VersionRecipe = {
  title: string;
  note: string;
  mealType: string;
  diet: string;
  time: string;
  budget: string;
  category?: string;
  servings?: string;
  ingredients?: string[];
  method?: string[];
  image?: string;
};

export function signatureRecipe(recipe: VersionRecipe): VersionRecipe & { finish: string } {
  const portions = Math.max(1, Number.parseInt(recipe.servings || '4', 10) || 4);
  const scale = portions / 4;
  const dessert = /dessert/i.test(recipe.mealType + ' ' + recipe.category);
  const additions = dessert
    ? [`${scale} cup mixed berries for the Signature sauce`, `${scale} tbsp sugar for the Signature sauce`, `${scale} tsp lemon juice for the Signature sauce`]
    : [`${2 * scale} tbsp extra-virgin olive oil for the Signature finish`, `${scale} tbsp finely chopped fresh parsley for the Signature finish`, `${scale} tsp finely grated lemon zest for the Signature finish`];
  const finishingStep = dessert
    ? 'While the dessert sets or cools, simmer the additional berries, sugar and lemon juice in a small saucepan over medium-low heat for 5–7 minutes, stirring, until the berries soften. Mash, cool completely, then spoon the berry sauce beside each portion just before serving.'
    : 'While the main dish rests, mix the additional olive oil, parsley and lemon zest in a small bowl. Divide the dish among warm plates or shallow bowls, then drizzle the fresh herb oil lightly over each portion just before serving; keep the finish out of the cooking pan to preserve its color.';
  const finish = dessert
    ? 'Use chilled dessert plates. Spoon a small pool of berry sauce beside the dessert, leave the rim clean, and serve immediately after plating.'
    : 'Use warm shallow bowls or plates. Arrange the main component neatly, add the fresh herb finish sparingly, and wipe the rim before bringing it to the table.';
  return {
    ...recipe,
    title: `Fancy Eatz Signature ${recipe.title}`,
    note: dessert ? `${recipe.note} Elevated with a fresh berry sauce and a composed dessert presentation.` : `${recipe.note} Elevated with a fragrant lemon-herb oil and a restaurant-inspired presentation.`,
    ingredients: [...(recipe.ingredients || []), ...additions],
    method: [...(recipe.method || []), finishingStep],
    time: `${recipe.time} + 7 min finishing`,
    finish,
  };
}

export function RecipeVersionSelector({ value, onChange }: {
  value: 'classic' | 'signature';
  onChange: (value: 'classic' | 'signature') => void;
}) {
  return (
    <div className='version-selector' role='group' aria-label='Recipe version'>
      <button type='button' aria-pressed={value === 'classic'} onClick={() => onChange('classic')}>Classic</button>
      <button type='button' aria-pressed={value === 'signature'} onClick={() => onChange('signature')}>Fancy Eatz Signature</button>
    </div>
  );
}

type TastingState = { startedAt: number; picks: string[] };
const storageKey = 'fancy-eatz-tasting-v1';
const trialDuration = 7 * 24 * 60 * 60 * 1000;

export default function RecipeTasting({ recipes, onOpen, onJoin }: {
  recipes: VersionRecipe[];
  onOpen: (recipe: VersionRecipe) => void;
  onJoin: () => void;
}) {
  const collection = recipes.filter(recipe => recipe.ingredients?.length && recipe.method?.length).slice(0, 30);
  const [trial, setTrial] = useState<TastingState | null>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return saved && Number.isFinite(saved.startedAt) && Array.isArray(saved.picks) ? saved : null;
    } catch { return null; }
  });
  const [notice, setNotice] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const expired = !!trial && now >= trial.startedAt + trialDuration;
  const remaining = trial ? Math.max(0, Math.ceil((trial.startedAt + trialDuration - now) / 86400000)) : 7;
  function choose(recipe: VersionRecipe) {
    if (expired) { setNotice('Your tasting has ended. Join the membership launch list to hear when full membership opens.'); return; }
    if (trial?.picks.includes(recipe.title)) { onOpen(recipe); return; }
    if ((trial?.picks.length || 0) >= 3) { setNotice('Your three recipe cards are selected. Open any selected card to enjoy both versions.'); return; }
    const next = { startedAt: trial?.startedAt || Date.now(), picks: [...(trial?.picks || []), recipe.title] };
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setNotice('Your browser could not save the tasting. Enable website storage and try again.'); return; }
    setTrial(next);
    setNotice('Recipe selected. You can switch between Classic and Fancy Eatz Signature.');
    onOpen(recipe);
  }
  return (
    <section id='recipe-tasting' className='recipe-tasting'>
      <div className='tasting-heading'>
        <div><p className='eyebrow'>TWO DELICIOUS WAYS TO ENJOY</p><h2>Your everyday favorite.<br/><em>Its Signature moment.</em></h2><p>Choose 3 recipe cards from {collection.length}. Enjoy the Classic and Fancy Eatz Signature versions of each for 7 days.</p></div>
        <div className='tasting-summary'><strong>{trial?.picks.length || 0} / 3</strong><span>recipe cards selected</span><b>{expired ? 'Tasting ended' : trial ? `${remaining} day${remaining === 1 ? '' : 's'} remaining` : 'Free · No card required'}</b><small>Your tasting starts with your first pick and is saved in this browser. Membership billing is not active.</small></div>
      </div>
      <p className='tasting-status' role='status'>{notice || 'Choose thoughtfully: each selected card includes two complete versions.'}</p>
      <div className='tasting-grid'>{(showAll ? collection : collection.slice(0, 6)).map(recipe => {
        const selected = trial?.picks.includes(recipe.title);
        return <article className={`tasting-card${selected ? ' picked' : ''}`} key={recipe.title}>
          {recipe.image && <img loading='lazy' src={recipe.image} alt={`${recipe.title} serving inspiration`} />}
          <div><small>{recipe.mealType} · {recipe.time}</small><h3>{recipe.title}</h3><p>{recipe.note}</p><span className='two-versions'>Classic + Signature included</span><button className={selected ? 'ghost' : 'primary'} disabled={expired || (!selected && (trial?.picks.length || 0) >= 3)} onClick={() => choose(recipe)}>{selected ? 'Open My Recipe' : 'Choose This Recipe'}</button></div>
        </article>;
      })}</div>
      <button className='tasting-expand' onClick={() => setShowAll(value => !value)}>{showAll ? 'Show Fewer Recipes' : 'Explore All 30 Recipes →'}</button>
      <div className='tasting-next'><div><h3>Make this your everyday kitchen companion.</h3><p>Love the tasting? Join the list for the membership launch. Planned pricing: $9.99/month or $79/year. No payment collected today.</p></div><button className='primary' onClick={onJoin}>Keep Me in the Kitchen →</button></div>
    </section>
  );
}
