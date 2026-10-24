import { useEffect, useMemo, useState } from 'react';
import { tastingPhotoPairs } from './tastingPhotography';

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

export function MealPhoto({ title, version = 'classic', className = '' }: {
  title: string;
  version?: 'classic' | 'signature';
  className?: string;
}) {
  const originalTitle = title.replace(/^Fancy Eatz Signature /, '');
  const src = tastingPhotoPairs[originalTitle];
  if (!src) return null;
  return <div className={`meal-version-photo ${className}`} role='img'
    aria-label={`${originalTitle}, ${version === 'classic' ? 'Classic' : 'Fancy Eatz Signature'} serving illustration`}
    style={{ backgroundImage: `url("${src}")`, backgroundPosition: version === 'classic' ? 'left center' : 'right center' }} />;
}

type TastingState = { startedAt: number; picks: string[] };
const storageKey = 'fancy-eatz-tasting-v1';
const trialDuration = 7 * 24 * 60 * 60 * 1000;
const pickLimit = 7;
const pageSize = 6;

export default function RecipeTasting({ recipes, onJoin, onAddGroceries }: {
  recipes: VersionRecipe[];
  onJoin: () => void;
  onAddGroceries: (ingredients: string[], title: string) => void;
}) {
  const collection = useMemo(() => recipes.filter(recipe => recipe.ingredients?.length && recipe.method?.length).slice(0, 30), [recipes]);
  const [trial, setTrial] = useState<TastingState | null>(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      return saved && Number.isFinite(saved.startedAt) && Array.isArray(saved.picks)
        ? { startedAt: saved.startedAt, picks: saved.picks.filter((title: unknown) => typeof title === 'string').slice(0, pickLimit) } : null;
    } catch { return null; }
  });
  const [notice, setNotice] = useState('');
  const [now, setNow] = useState(Date.now());
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<VersionRecipe | null>(null);
  const [version, setVersion] = useState<'classic' | 'signature'>('classic');
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);
  const expired = !!trial && now >= trial.startedAt + trialDuration;
  const remaining = trial ? Math.max(0, Math.ceil((trial.startedAt + trialDuration - now) / 86400000)) : 7;
  const filtered = collection.filter(recipe =>
    (filter === 'All' || (filter === 'My 7' ? trial?.picks.includes(recipe.title) : recipe.mealType === filter)) &&
    (recipe.title + ' ' + recipe.note).toLowerCase().includes(query.trim().toLowerCase()));
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount - 1);
  const activeRecipe = preview && version === 'signature' ? signatureRecipe(preview) : preview;
  const picks = trial?.picks || [];
  function savePicks(next: TastingState) {
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { setNotice('Your browser could not save your choices. Enable website storage and try again.'); return; }
    setTrial(next);
    return true;
  }
  function choose(recipe: VersionRecipe) {
    if (expired) { setNotice('Your tasting has ended. Join the membership launch list for updates.'); return; }
    if (picks.includes(recipe.title)) return;
    if (picks.length >= pickLimit) { setNotice('Your seven cards are selected. Remove a selection to choose a different dish.'); return; }
    if (savePicks({ startedAt: trial?.startedAt || Date.now(), picks: [...picks, recipe.title] })) {
      setNotice(`${recipe.title} added. ${pickLimit - picks.length - 1} choices left.`);
    }
  }
  function remove(recipe: VersionRecipe) {
    if (expired || !trial) return;
    if (savePicks({ ...trial, picks: picks.filter(title => title !== recipe.title) })) setNotice(`${recipe.title} removed. Choose another favorite.`);
  }
  function openPreview(recipe: VersionRecipe) {
    setPreview(recipe);
    setVersion('classic');
    document.getElementById('recipe-tasting')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  return (
    <section id='recipe-tasting' className='recipe-tasting' aria-label='Choose seven from thirty recipes'>
      <div className='tasting-heading'>
        <div><p className='eyebrow'>YOUR SEVEN DELICIOUS PICKS</p><h2>30 dishes to discover.<br/><em>7 favorites to make yours.</em></h2><p>Choose seven recipe cards for your seven-day tasting. Every card includes Classic and Fancy Eatz Signature.</p></div>
        <div className='tasting-summary'><strong>{picks.length} / {pickLimit}</strong><span>recipe cards selected</span><b>{expired ? 'Tasting ended' : trial ? `${remaining} days remaining` : 'Free · No card required'}</b><small>Selections are saved in this browser. Your seven days begin with your first selection.</small></div>
      </div>
      <p className='tasting-status' role='status'>{notice || 'Browse six dishes at a time. Preview a recipe, then add the ones you love.'}</p>
      {activeRecipe && preview ? <article className='tasting-detail' aria-label='Tasting recipe detail'>
        <button className='tasting-back' onClick={() => setPreview(null)}>← Back to the 30 tasting recipes</button>
        <div className='tasting-detail-layout'>
          <div><MealPhoto title={preview.title} version={version} /><small className='photo-caption'>AI-created serving illustration</small></div>
          <div><RecipeVersionSelector value={version} onChange={setVersion} /><p className='eyebrow'>{activeRecipe.mealType} · {activeRecipe.time}</p><h3>{activeRecipe.title}</h3><p>{activeRecipe.note}</p><p>Servings: {activeRecipe.servings || 'See ingredients'}</p>
            <button className='primary' disabled={expired || (!picks.includes(preview.title) && picks.length >= pickLimit)} onClick={() => picks.includes(preview.title) ? remove(preview) : choose(preview)}>{picks.includes(preview.title) ? 'Remove from My 7' : 'Add to My 7'}</button>
          </div>
        </div>
        <div className='tasting-directions'><div><h4>Ingredients</h4><ul>{activeRecipe.ingredients?.map(item => <li key={item}>{item}</li>)}</ul></div><div><h4>Step-by-step directions</h4><ol>{activeRecipe.method?.map(step => <li key={step}>{step}</li>)}</ol>{version === 'signature' && <div className='tasting-finish'><b>Your Signature finish</b><p>{signatureRecipe(preview).finish}</p></div>}</div></div>
        <button className='primary' onClick={() => onAddGroceries(activeRecipe.ingredients || [], activeRecipe.title)}>Add Ingredients to Grocery List</button>
      </article> : <>
        <div className='tasting-controls'><label><span>Search these 30 dishes</span><input value={query} placeholder='Chicken, pasta, dessert…' onChange={event => { setQuery(event.target.value); setPage(0); }} /></label><div className='tasting-filters' role='group' aria-label='Tasting recipe filter'>{['All', 'Dinner', 'Dessert', 'Breakfast', 'Lunch', 'My 7'].map(name => <button key={name} aria-pressed={filter === name} onClick={() => { setFilter(name); setPage(0); }}>{name}</button>)}</div></div>
        <div className='tasting-grid'>{filtered.slice(currentPage * pageSize, (currentPage + 1) * pageSize).map(recipe => {
          const selected = picks.includes(recipe.title);
          return <article className={`tasting-card${selected ? ' picked' : ''}`} key={recipe.title}>
            <button className='tasting-image-button' aria-label={`Preview ${recipe.title}`} onClick={() => openPreview(recipe)}><MealPhoto title={recipe.title} />{selected && <span className='picked-label'>✓ In My 7</span>}</button>
            <div><small>{recipe.mealType} · {recipe.time}</small><h3>{recipe.title}</h3><p>{recipe.note}</p><span className='two-versions'>Classic + Signature included</span><button className='tasting-preview-button' onClick={() => openPreview(recipe)}>Preview Both Versions</button><button className={selected ? 'ghost' : 'primary'} disabled={expired || (!selected && picks.length >= pickLimit)} onClick={() => selected ? remove(recipe) : choose(recipe)}>{selected ? 'Remove from My 7' : 'Add to My 7'}</button></div>
          </article>;
        })}</div>
        {filtered.length === 0 && <p className='tasting-empty'>{filter === 'My 7' ? 'Your selected recipes will appear here.' : 'No match in this tasting collection. Try another search.'}</p>}
        <nav className='tasting-pagination' aria-label='Tasting recipe pages'><button disabled={currentPage === 0} onClick={() => setPage(currentPage - 1)}>← Previous</button><span>{filtered.length ? currentPage * pageSize + 1 : 0}–{Math.min((currentPage + 1) * pageSize, filtered.length)} of {filtered.length} dishes</span><button disabled={currentPage >= pageCount - 1} onClick={() => setPage(currentPage + 1)}>Next →</button></nav>
      </>}
      <div className='tasting-next'><div><h3>{picks.length === pickLimit ? 'Your seven favorites are ready.' : 'Make this your everyday kitchen companion.'}</h3><p>Membership launch updates: planned pricing is $9.99/month or $79/year. No payment collected today.</p></div><button className='primary' onClick={onJoin}>Keep Me in the Kitchen →</button></div>
    </section>
  );
}
