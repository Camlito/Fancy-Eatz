import { useEffect, useMemo, useState } from 'react';
const api = { post: async (url: string, body: unknown) => { const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); if (!response.ok) throw new Error('Request failed'); return { data: await response.json() }; } };
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Check,
  ChefHat,
  Clock3,
  Heart,
  Plus,
  Search,
  ShoppingBasket,
  Sparkles,
  Trash2,
  Users,
  UtensilsCrossed,
  WalletCards,
} from 'lucide-react';

type Meal = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  plating: string;
  missing: string[];
  estimatedCost?: string;
};

type PlanDay = {
  day: string;
  meal: string;
  description: string;
  estimatedCost: string;
  groceries: string[];
};

type WeeklyPlan = {
  title: string;
  days: PlanDay[];
  grocery: string[];
  estimatedTotal: string;
};

type Experience = {
  title: string;
  appetizer: string;
  entree: string;
  sides: string[];
  dessert: string;
  pairing: string;
  timeline: string[];
  plating: string;
  tableSetting: string;
  groceries: string[];
  estimatedCost: string;
};

type Recipe = {
  title: string;
  tag: string;
  time: string;
  note: string;
  mealType: string;
  diet: string;
  budget: string;
};

const featured: Recipe[] = [
  { title: 'Grilled Salmon with Honey Mustard Glaze', tag: 'Salmon', time: '30 min', note: 'Sweet-savory glaze with an elegant grilled finish.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Crab Cakes with Basil Mayonnaise', tag: 'Crab', time: '35 min', note: 'Crisp crab cakes paired with a bright basil mayonnaise.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Fish Piccata', tag: 'Fish', time: '25 min', note: 'A bright fish dinner with lemon-forward piccata character.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Pesto Salmon & Sea Scallops with Lemon/Garlic', tag: 'Chef Pick', time: '40 min', note: 'Salmon and scallops with pesto, lemon and garlic.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Creamy Tomato Bisque with Lump Crabmeat', tag: 'Comfort', time: '45 min', note: 'Creamy tomato bisque finished with lump crabmeat.', mealType: 'Lunch', diet: 'Pescatarian', budget: '$$' },
  { title: 'Grilled Fish Tacos with Green Salsa', tag: 'Fresh', time: '30 min', note: 'Grilled fish tacos paired with a bright green salsa.', mealType: 'Lunch', diet: 'Pescatarian', budget: '$' },
  { title: 'Luxe Shrimp & Grits Brunch Bowl', tag: 'Southern Luxe', time: '35 min', note: 'A Fancy Eatz brunch idea built around shrimp and creamy grits.', mealType: 'Breakfast', diet: 'Pescatarian', budget: '$$' },
  { title: 'Lemon Berry Mascarpone Parfait', tag: 'Dessert', time: '15 min', note: 'A Fancy Eatz layered dessert with lemon, berries and mascarpone.', mealType: 'Dessert', diet: 'Vegetarian', budget: '$' },
  { title: 'Fresh Corn Seafood Chowder', tag: 'Chowder', time: '40 min', note: 'Fresh corn, crab, shrimp and crawfish come together in a rich seafood chowder.', mealType: 'Dinner', diet: 'No restriction', budget: '$$$' },
  { title: 'Fresh Salmon With Tricolored Peppercorn Sauce', tag: 'Salmon', time: '30 min', note: 'Salmon finished with Dijon, lemon, crushed peppercorns and fresh dill.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Grilled Salmon With Lemon & Thyme', tag: 'Salmon', time: '30 min', note: 'A grilled salmon option centered on lemon and thyme.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Grilled Salmon With Potato & Watercress Salad', tag: 'Salmon', time: '40 min', note: 'Grilled salmon paired with potato and watercress salad.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Grilled Scallops & Kale With A Fresh Beet Salad', tag: 'Scallops', time: '35 min', note: 'Grilled scallops and kale with a fresh beet salad.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Grilled Seafood Kabobs', tag: 'Seafood', time: '35 min', note: 'A mixed-seafood grill option designed for kabob-style serving.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Grilled Swordfish With Citrus Salsa', tag: 'Swordfish', time: '35 min', note: 'Grilled swordfish brightened with citrus salsa.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Grilled Tuna Salad With Wasabi Dressing', tag: 'Tuna', time: '30 min', note: 'Grilled tuna served as a salad with wasabi dressing.', mealType: 'Lunch', diet: 'Pescatarian', budget: '$$' },
  { title: 'Grilled Wasabi-Crusted Tuna', tag: 'Tuna', time: '30 min', note: 'Tuna with a bold wasabi crust and grilled finish.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Haddock & Sweetcorn Chowder', tag: 'Chowder', time: '40 min', note: 'A comforting haddock and sweetcorn chowder.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Holiday Seafood Bisque', tag: 'Bisque', time: '45 min', note: 'A seafood bisque option suited to a celebratory table.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Honey Broiled Sea Scallops', tag: 'Scallops', time: '25 min', note: 'Sea scallops with a honey-forward broiled finish.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
  { title: 'Hot & Sour Seafood Soup', tag: 'Soup', time: '40 min', note: 'A seafood soup with hot-and-sour flavor direction.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Italian Fish Soup', tag: 'Italian', time: '45 min', note: 'A seafood-forward Italian-style fish soup.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$' },
  { title: 'Italian Tuna Salad With Olives & Sun-Dried Tomatoes', tag: 'Tuna', time: '20 min', note: 'Tuna salad with olives and sun-dried tomato flavor.', mealType: 'Lunch', diet: 'Pescatarian', budget: '$' },
  { title: 'Risotto With Crabmeat & Basil', tag: 'Crab', time: '45 min', note: 'Creamy risotto paired with crabmeat and basil.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$' },
];

const starterLists = {
  'Date Night': ['salmon fillets', 'jumbo scallops', 'lemons', 'fresh herbs', 'baby potatoes', 'asparagus', 'butter'],
  'Seafood Night': ['white fish', 'lump crabmeat', 'shrimp', 'garlic', 'lemons', 'parsley', 'rice'],
  'Family Dinner': ['chicken breasts', 'pasta', 'broccoli', 'parmesan', 'cream', 'garlic', 'salad greens'],
};

const moods = ['Date Night at Home', 'Southern Luxe', 'Under $25', '20-Minute Fancy', 'Seafood Night', 'Sunday Family Table', 'Healthy but Fancy', 'Girls Night In'];

function fallbackProtein(pantryText: string, diet: string) {
  const items = pantryText.split(',').map(x => x.trim()).filter(Boolean);
  const forbidden = diet === 'Vegan' ? /chicken|beef|pork|turkey|fish|salmon|shrimp|crab|scallop|tuna|cheese|butter|cream|milk|egg/i
    : diet === 'Vegetarian' ? /chicken|beef|pork|turkey|fish|salmon|shrimp|crab|scallop|tuna/i
    : diet === 'Pescatarian' ? /chicken|beef|pork|turkey/i : /$^/;
  const safe = items.filter(x => !forbidden.test(x));
  if (safe.length) return { primary: safe[0], items: safe };
  if (diet === 'Vegan') return { primary: 'chickpeas', items: ['chickpeas', 'rice', 'seasonal vegetables'] };
  if (diet === 'Vegetarian') return { primary: 'mushrooms', items: ['mushrooms', 'pasta', 'seasonal vegetables'] };
  if (diet === 'Pescatarian') return { primary: 'salmon', items: ['salmon', 'rice', 'seasonal vegetables'] };
  return { primary: items[0] || 'chicken', items: items.length ? items : ['chicken', 'rice', 'seasonal vegetables'] };
}

export default function FancyEatz() {
  const [tab, setTab] = useState('home');
  const [tabHistory, setTabHistory] = useState<string[]>([]);

  function navigate(nextTab: string) {
    if (nextTab === tab) return;
    setTabHistory(history => [...history, tab]);
    setTab(nextTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goBack() {
    setTabHistory(history => {
      if (history.length === 0) {
        setTab('home');
        return [];
      }
      const previous = history[history.length - 1];
      setTab(previous);
      return history.slice(0, -1);
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  const [pantry, setPantry] = useState('');
  const [occasion, setOccasion] = useState('Elevated Weeknight');
  const [servings, setServings] = useState('2');
  const [time, setTime] = useState('45 minutes');
  const [style, setStyle] = useState("Chef's choice");
  const [mealType, setMealType] = useState('Dinner');
  const [diet, setDiet] = useState('No restriction');
  const [budget, setBudget] = useState('$25');
  const [meal, setMeal] = useState<Meal | null>(null);
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceOccasion, setExperienceOccasion] = useState('Date Night at Home');
  const [experienceGuests, setExperienceGuests] = useState('2');
  const [experienceBudget, setExperienceBudget] = useState('$75');
  const [experienceMinutes, setExperienceMinutes] = useState('90');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoItems, setPhotoItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [mealError, setMealError] = useState('');
  const [planError, setPlanError] = useState('');
  const [listName, setListName] = useState('Date Night');
  const [grocery, setGrocery] = useState<string[]>(starterLists['Date Night']);
  const [checked, setChecked] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [recipeType, setRecipeType] = useState('All');
  const [favorites, setFavorites] = useState<Meal[]>(() => {
    try { return JSON.parse(localStorage.getItem('fancy-eatz-favorites') || '[]') as Meal[]; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('fancy-eatz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const filteredRecipes = useMemo(() => featured.filter(r => {
    const q = search.toLowerCase();
    return (recipeType === 'All' || r.mealType === recipeType) &&
      (!q || (r.title + ' ' + r.tag + ' ' + r.note).toLowerCase().includes(q));
  }).sort((a, b) => a.title.localeCompare(b.title)), [search, recipeType]);

  const alphabetizedFavorites = useMemo(
    () => [...favorites].sort((a, b) => a.title.localeCompare(b.title)),
    [favorites]
  );

  const grouped = useMemo(() => {
    const c: Record<string, string[]> = { 'Produce & Herbs': [], 'Proteins & Seafood': [], 'Dairy & Chilled': [], 'Pantry & Spices': [] };
    grocery.forEach(item => {
      const s = item.toLowerCase();
      if (/salmon|fish|crab|shrimp|scallop|chicken|beef|pork|turkey/.test(s)) c['Proteins & Seafood'].push(item);
      else if (/butter|cream|cheese|parmesan|milk|yogurt/.test(s)) c['Dairy & Chilled'].push(item);
      else if (/lemon|lime|herb|parsley|asparagus|broccoli|potato|greens|garlic|onion|pepper|avocado|berry/.test(s)) c['Produce & Herbs'].push(item);
      else c['Pantry & Spices'].push(item);
    });
    return c;
  }, [grocery]);

  const requestSettings = { occasion, servings, time, style, mealType, diet, budget };

  async function generateMeal(useFallback = false, pantryOverride?: string, mealTypeOverride?: string) {
    const pantryForRequest = pantryOverride ?? pantry;
    if (!pantryForRequest.trim() && !useFallback) {
      setMealError('Add at least a few ingredients you have at home.');
      return;
    }
    setLoading(true);
    setMealError('');
    try {
      const r = await api.post('/api/generate-meal', { pantry: pantryForRequest || 'common home pantry staples', ...requestSettings, mealType: mealTypeOverride ?? mealType });
      setMeal(r.data.meal as Meal);
      navigate('pantry');
    } catch {
      const safeFallback = fallbackProtein(pantryForRequest || '', diet);
      const base = safeFallback.items;
      const protein = safeFallback.primary;
      const accents = base.filter(x => x.toLowerCase() !== protein.toLowerCase()).slice(0, 4);
      const fallbackMeal: Meal = {
        title: `Southern Upscale ${protein.replace(/\b\w/g, m => m.toUpperCase())} Plate`,
        description: `A polished ${mealTypeOverride ?? mealType} built around ${protein}, designed for ${occasion.toLowerCase()} and adapted to the ingredients you have on hand.`,
        ingredients: Array.from(new Set([...base, 'olive oil', 'salt', 'black pepper'])),
        steps: [
          `Season the ${protein} with salt and black pepper. Heat a skillet over medium-high heat with a small amount of olive oil.`,
          `Cook the ${protein} until properly done and food-safe; adjust the exact cook time for the ingredient and its thickness.`,
          accents.length ? `Add or prepare ${accents.join(', ')} alongside the main ingredient, seasoning to taste.` : 'Add a simple vegetable or starch from your pantry and season to taste.',
          'Finish with a small amount of butter or olive oil, taste for seasoning, and serve immediately.'
        ],
        plating: 'Plate the main ingredient slightly off-center, arrange the sides neatly, and finish with a light drizzle of pan juices or olive oil for an upscale presentation.',
        missing: [],
        estimatedCost: 'Uses primarily on-hand ingredients; any added groceries are optional.'
      };
      setMeal(fallbackMeal);
      setMealError('');
      if (tab !== 'pantry') navigate('pantry');
    } finally {
      setLoading(false);
    }
  }

  async function generatePlan() {
    setPlanLoading(true);
    setPlanError('');
    try {
      const r = await api.post('/api/generate-plan', { pantry: pantry || 'common home pantry staples', ...requestSettings });
      setWeeklyPlan(r.data.plan as WeeklyPlan);
    } catch {
      const base = pantry.trim() || 'chicken, rice, pasta, seasonal vegetables, garlic';
      const names = ['Southern Skillet Supper','Herb-Finished Bowl','Upscale Pasta Night','Pan-Seared Dinner Plate','Fresh Market Supper','Comfort Food Elevated','Sunday Family Table'];
      const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map((day, i) => ({
        day,
        meal: names[i],
        description: `A practical ${style.toLowerCase()} meal using ${base} as the starting point.`,
        estimatedCost: `Target ${budget} or less in added groceries`,
        groceries: []
      }));
      setWeeklyPlan({ title: 'Fancy Eatz Week', days, grocery: [], estimatedTotal: 'Built around pantry ingredients and your selected budget targets.' });
      setPlanError('');
    } finally {
      setPlanLoading(false);
    }
  }

  async function analyzeKitchenPhoto(file: File) {
    setPhotoBusy(true);
    setPhotoItems([]);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      setPhotoPreview(dataUrl);
      const r = await api.post('/api/analyze-kitchen-photo', { image: dataUrl });
      const items = Array.isArray(r.data.items) ? r.data.items : [];
      setPhotoItems(items);
      if (items.length) setPantry(items.join(', '));
    } catch {
      setPhotoItems([]);
    } finally {
      setPhotoBusy(false);
    }
  }

  async function generateExperience() {
    setExperienceLoading(true);
    const safe = fallbackProtein(pantry || '', diet);
    try {
      const r = await api.post('/api/generate-experience', {
        pantry: pantry || 'common home pantry staples',
        occasion: experienceOccasion,
        guests: experienceGuests,
        budget: experienceBudget,
        minutes: experienceMinutes,
        diet,
        style
      });
      setExperience(r.data.experience as Experience);
    } catch {
      setExperience({
        title: experienceOccasion + ' · Fancy Eatz Experience',
        appetizer: 'Chef-inspired starter using seasonal pantry ingredients',
        entree: `Elevated ${safe.primary.replace(/\b\w/g, m => m.toUpperCase())} Dinner`,
        sides: ['Seasonal vegetable accompaniment', 'Herb-finished rice or potatoes'],
        dessert: diet === 'Vegan' ? 'Fresh berry citrus parfait' : 'Lemon berry parfait',
        pairing: 'Sparkling citrus and herb refresher',
        timeline: ['Prep ingredients and set the table.', 'Start the longest-cooking side.', 'Prepare the appetizer.', 'Cook and rest the entrée.', 'Plate the main course and finish dessert.'],
        plating: 'Use warm plates, negative space, a neat sauce finish, and one fresh garnish.',
        tableSetting: 'Low lighting, uncluttered place settings, cloth napkins, and a simple centerpiece.',
        groceries: [],
        estimatedCost: `Designed around a ${experienceBudget} target using on-hand ingredients first.`
      });
    } finally {
      setExperienceLoading(false);
    }
  }

  function loadList(name: keyof typeof starterLists) {
    setListName(name);
    setGrocery(starterLists[name]);
    setChecked([]);
  }

  function addItems(items: string[], name: string) {
    setGrocery(p => Array.from(new Set([...p, ...items])));
    setListName(name);
    navigate('grocery');
  }

  function saveFavorite() {
    if (!meal || favorites.some(f => f.title === meal.title)) return;
    setFavorites(p => [...p, meal]);
  }

  function applyMood(m: string) {
    setOccasion(m);
    if (m === 'Under $25') setBudget('$25');
    if (m === '20-Minute Fancy') setTime('20 minutes');
    if (m === 'Healthy but Fancy') setStyle('Fresh & light');
    if (m === 'Seafood Night') setStyle('Seafood-forward');
    navigate('pantry');
  }

  return (
    <main>
      <header className="topbar">
        <button className="brand" onClick={() => navigate('home')}>
          <span>F</span><div><b>FANCY EATZ</b><small>Elevate what you already have.</small></div>
        </button>
        <nav className="main-nav">
          <button onClick={() => navigate('home')}>Home</button>
          <details className="nav-dropdown">
            <summary>Cook ▾</summary>
            <div className="nav-menu">
              <button onClick={() => navigate('pantry')}>Pantry Chef</button>
              <button onClick={() => navigate('photo')}>Photo My Fridge</button>
              <button onClick={() => navigate('leftovers')}>Leftovers → Luxury</button>
              <button onClick={() => navigate('ideas')}>Meal Ideas</button>
            </div>
          </details>
          <details className="nav-dropdown">
            <summary>Plan ▾</summary>
            <div className="nav-menu">
              <button onClick={() => navigate('experience')}>Full Dining Experience</button>
              <button onClick={() => navigate('planner')}>Weekly Planner</button>
              <button onClick={() => navigate('grocery')}>Grocery Lists</button>
            </div>
          </details>
          <details className="nav-dropdown">
            <summary>Cookbook ▾</summary>
            <div className="nav-menu">
              <button onClick={() => navigate('recipes')}>A–Z Recipe Vault</button>
              <button onClick={() => navigate('favorites')}>My Fancy Cookbook</button>
            </div>
          </details>
        </nav>
      </header>

      <div className="backbar">
        <button className="back-button" onClick={() => {
          if (tab !== 'home') goBack();
          else if (window.history.length > 1) window.history.back();
        }} aria-label="Go back">
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      {tab === 'home' && (
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow">YOUR AI KITCHEN CONCIERGE</p>
            <h1>Turn what you have into something <em>fancy.</em></h1>
            <p className="lede">Build an upscale meal from your kitchen, budget, dietary needs and schedule—or let Fancy Eatz plan the whole week and combine the shopping list.</p>
            <div className="hero-actions">
              <button className="primary" onClick={() => navigate('pantry')}><Sparkles size={18} /> What Can I Make Right Now?</button>
              <button className="ghost" onClick={() => navigate('planner')}><CalendarDays size={18} /> Plan My Week</button>
              <button className="ghost" onClick={() => navigate('experience')}><Sparkles size={18} /> Plan My Entire Experience</button>
            </div>
            <div className="quick-chips">
              {['Under $25', 'Date Night', 'Family Dinner', 'Healthy but Fancy', 'Seafood Night', '20-Minute Fancy'].map(x => <button key={x} onClick={() => applyMood(x)}>{x}</button>)}
            </div>
          </div>
          <div className="chef-card">
            <ChefHat size={38} /><p>TONIGHT'S PROMPT</p><h3>What's already in your kitchen?</h3>
            <textarea value={pantry} onChange={e => setPantry(e.target.value)} placeholder="Example: salmon, rice, lemon, spinach, garlic, butter..." />
            <button className="primary full" onClick={() => generateMeal()} disabled={loading}>{loading ? 'Chef is creating…' : 'Make It Fancy'}</button>
            <button className="ghost full secondary-action" onClick={() => generateMeal(true)} disabled={loading}>Surprise Me</button>
            {mealError && <p className="error">{mealError}</p>}
          </div>
        </section>
      )}

      {tab === 'photo' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">SEE IT. SCAN IT. COOK IT.</p><h2>Photo My Fridge / Pantry</h2><p>Take or upload a photo of your food. Fancy Eatz identifies visible ingredients, then sends them directly into Pantry Chef.</p></div>
          <div className="generator-grid">
            <div className="panel">
              <label className="primary full" style={{cursor:'pointer', textAlign:'center'}}>
                <span>{photoBusy ? 'Analyzing your kitchen…' : '📸 Take or Choose Photo'}</span>
                <input type="file" accept="image/*" capture="environment" style={{display:'none'}} onChange={e => { const f=e.target.files?.[0]; if(f) void analyzeKitchenPhoto(f); }} />
              </label>
              {photoPreview && <img src={photoPreview} alt="Kitchen ingredients preview" style={{width:'100%',maxHeight:360,objectFit:'cover',borderRadius:18,marginTop:18}} />}
              {photoItems.length > 0 && <div className="plating"><b>Ingredients I can see</b><p>{photoItems.join(' · ')}</p></div>}
              {!photoBusy && photoPreview && photoItems.length === 0 && <p className="error">I couldn't confidently identify ingredients in that photo. Try a brighter, closer photo or enter them manually.</p>}
            </div>
            <div className="panel">
              <p className="eyebrow">FROM CAMERA TO DINNER</p><h3>Turn the scan into a meal</h3>
              <label>Detected / editable ingredients</label>
              <textarea value={pantry} onChange={e => setPantry(e.target.value)} placeholder="Detected ingredients will appear here…" />
              <button className="primary full" onClick={() => { setMeal(null); navigate('pantry'); void generateMeal(true, pantry, mealType); }} disabled={!pantry.trim()}><Sparkles size={18}/>Make Something Fancy</button>
              <p className="fine-print">Always confirm detected ingredients yourself, especially for allergies or dietary restrictions.</p>
            </div>
          </div>
        </section>
      )}

      {tab === 'leftovers' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">SECOND NIGHT, FIRST-CLASS PLATE</p><h2>Leftovers → Luxury</h2><p>Tell Fancy Eatz what is already cooked. We’ll turn it into a different elevated meal instead of simply reheating dinner.</p></div>
          <div className="generator-grid">
            <div className="panel">
              <label>What leftovers do you have?</label>
              <textarea value={pantry} onChange={e => setPantry(e.target.value)} placeholder="Leftover chicken, rice, broccoli, roasted potatoes..." />
              <div className="form-grid">
                <label>New meal type<select value={mealType} onChange={e => setMealType(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option></select></label>
                <label>Style<select value={style} onChange={e => setStyle(e.target.value)}><option>Chef's choice</option><option>Southern upscale</option><option>Italian inspired</option><option>Fresh & light</option><option>Comfort food</option></select></label>
                <label>Dietary preference<select value={diet} onChange={e => setDiet(e.target.value)}><option>No restriction</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Gluten-conscious</option><option>Dairy-free</option><option>Lower-carb</option></select></label>
                <label>Time<select value={time} onChange={e => setTime(e.target.value)}><option>20 minutes</option><option>30 minutes</option><option>45 minutes</option></select></label>
              </div>
              <button className="primary full" onClick={() => generateMeal(false, 'LEFTOVERS TO LUXURY: Transform these already-cooked leftovers into a distinctly different meal: ' + pantry, mealType)} disabled={loading}><Sparkles size={18}/>{loading ? 'Transforming…' : 'Transform My Leftovers'}</button>
              {mealError && <p className="error">{mealError}</p>}
            </div>
            <div className="panel">
              <p className="eyebrow">SMART REINVENTION</p><h3>Waste less. Eat better.</h3><p>Fancy Eatz treats your cooked food as the starting point, then changes the format, flavor direction and presentation for a new dining experience.</p>
              <div className="plating"><b>Examples</b><p>Roast chicken → luxe pasta · Rice → crispy rice bowl · Steak → elevated brunch hash · Vegetables → chef-style soup or flatbread.</p></div>
            </div>
          </div>
        </section>
      )}

      {tab === 'experience' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">YOUR PRIVATE DINING CONCIERGE</p><h2>Plan My Entire Experience</h2><p>Build the menu, timing, presentation and shopping plan for an elevated night at home.</p></div>
          <div className="generator-grid">
            <div className="panel">
              <label>What do you already have?</label>
              <textarea value={pantry} onChange={e => setPantry(e.target.value)} placeholder="Steak, shrimp, potatoes, asparagus, berries..." />
              <div className="form-grid">
                <label>Occasion<select value={experienceOccasion} onChange={e => setExperienceOccasion(e.target.value)}><option>Date Night at Home</option><option>Anniversary</option><option>Birthday Dinner</option><option>Girls Night In</option><option>Sunday Family Table</option><option>Celebration</option></select></label>
                <label>Guests<select value={experienceGuests} onChange={e => setExperienceGuests(e.target.value)}><option>2</option><option>4</option><option>6</option><option>8</option><option>10</option><option>12</option></select></label>
                <label>Total budget<select value={experienceBudget} onChange={e => setExperienceBudget(e.target.value)}><option>$50</option><option>$75</option><option>$100</option><option>$150</option><option>$200</option><option>$300</option></select></label>
                <label>Time available<select value={experienceMinutes} onChange={e => setExperienceMinutes(e.target.value)}><option value="60">60 minutes</option><option value="90">90 minutes</option><option value="120">2 hours</option><option value="180">3 hours</option></select></label>
                <label>Dietary preference<select value={diet} onChange={e => setDiet(e.target.value)}><option>No restriction</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Gluten-conscious</option><option>Dairy-free</option><option>Lower-carb</option></select></label>
                <label>Style<select value={style} onChange={e => setStyle(e.target.value)}><option>Chef's choice</option><option>Southern upscale</option><option>Italian inspired</option><option>Fresh & light</option><option>Comfort food</option><option>Seafood-forward</option></select></label>
              </div>
              <button className="primary full" onClick={generateExperience} disabled={experienceLoading}><Sparkles size={18}/>{experienceLoading ? 'Designing your evening…' : 'Create My Experience'}</button>
            </div>
            <div className="result panel">
              {!experience ? <div className="empty"><Sparkles size={44}/><h3>Your complete evening appears here</h3><p>Menu, pairing, timeline, plating, table setting and shopping plan.</p></div> : <div>
                <p className="eyebrow">FANCY EATZ SIGNATURE EXPERIENCE</p><h2>{experience.title}</h2>
                <h3>Appetizer</h3><p>{experience.appetizer}</p><h3>Entrée</h3><p>{experience.entree}</p>
                <h3>Sides</h3><ul>{experience.sides.map(x => <li key={x}>{x}</li>)}</ul>
                <h3>Dessert</h3><p>{experience.dessert}</p><h3>Pairing</h3><p>{experience.pairing}</p>
                <h3>Preparation Timeline</h3><ol>{experience.timeline.map(x => <li key={x}>{x}</li>)}</ol>
                <div className="plating"><b>Plating</b><p>{experience.plating}</p><b>Table Setting</b><p>{experience.tableSetting}</p></div>
                <p><b>Budget:</b> {experience.estimatedCost}</p>
                {experience.groceries.length > 0 && <button className="ghost" onClick={() => addItems(experience.groceries, experience.title)}><ShoppingBasket size={18}/>Add Groceries</button>}
              </div>}
            </div>
          </div>
        </section>
      )}

      {tab === 'pantry' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">PANTRY → PLATE</p><h2>Fancy Eatz Pantry Chef</h2><p>Set the rules. Fancy Eatz handles the menu.</p></div>
          <div className="generator-grid">
            <div className="panel">
              <label>What ingredients do you have?</label>
              <textarea value={pantry} onChange={e => setPantry(e.target.value)} placeholder="Chicken, pasta, tomatoes, cream, garlic, spinach..." />
              <div className="form-grid">
                <label>Meal type<select value={mealType} onChange={e => setMealType(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Dessert</option></select></label>
                <label>Occasion<select value={occasion} onChange={e => setOccasion(e.target.value)}><option>Elevated Weeknight</option><option>Date Night</option><option>Family Dinner</option><option>Brunch</option><option>Celebration</option></select></label>
                <label>Family / servings<select value={servings} onChange={e => setServings(e.target.value)}><option>1</option><option>2</option><option>4</option><option>6</option><option>8</option></select></label>
                <label>Max budget<select value={budget} onChange={e => setBudget(e.target.value)}><option>$15</option><option>$25</option><option>$40</option><option>$60</option><option>$100</option></select></label>
                <label>Dietary preference<select value={diet} onChange={e => setDiet(e.target.value)}><option>No restriction</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option><option>Gluten-conscious</option><option>Dairy-free</option><option>Lower-carb</option></select></label>
                <label>Time<select value={time} onChange={e => setTime(e.target.value)}><option>20 minutes</option><option>30 minutes</option><option>45 minutes</option><option>60 minutes</option></select></label>
                <label>Style<select value={style} onChange={e => setStyle(e.target.value)}><option>Chef's choice</option><option>Southern upscale</option><option>Italian inspired</option><option>Fresh & light</option><option>Comfort food</option><option>Seafood-forward</option></select></label>
              </div>
              <button className="primary full" onClick={() => generateMeal()} disabled={loading}><Sparkles size={18} />{loading ? 'Creating your menu…' : 'Generate Upscale Meal'}</button>
              {mealError && <p className="error">{mealError}</p>}
            </div>
            <div className="result panel">
              {!meal ? <div className="empty"><UtensilsCrossed size={44} /><h3>Your custom meal appears here</h3><p>Recipe, budget-aware ingredients, plating notes and only the groceries you still need.</p></div> : (
                <div>
                  <p className="eyebrow">CHEF-CREATED FOR YOU</p><h2>{meal.title}</h2><p>{meal.description}</p>
                  <div className="meta"><span><Users size={16} />{servings} servings</span><span><Clock3 size={16} />{time}</span>{meal.estimatedCost && <span><WalletCards size={16} />{meal.estimatedCost}</span>}</div>
                  <h3>Ingredients</h3><ul>{meal.ingredients.map(x => <li key={x}>{x}</li>)}</ul>
                  <h3>Method</h3><ol>{meal.steps.map(x => <li key={x}>{x}</li>)}</ol>
                  <div className="plating"><b>Fancy Finish</b><p>{meal.plating}</p></div>
                  <div className="result-actions">
                    <button className="ghost" onClick={saveFavorite}><Heart size={18} />{favorites.some(f => f.title === meal.title) ? 'Saved' : 'Save Favorite'}</button>
                    {meal.missing.length > 0 && <button className="ghost" onClick={() => addItems(meal.missing, meal.title)}><ShoppingBasket size={18} />Add Missing Items</button>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {tab === 'planner' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">7 DAYS, ONE SMART SHOP</p><h2>Weekly Meal Planner</h2><p>Use your Pantry Chef settings to create seven upscale-but-practical meals and one combined grocery list.</p></div>
          <div className="planner-controls panel">
            <div><b>{servings} servings</b><span>{diet} · {budget} target per meal · {style}</span></div>
            <button className="primary" onClick={generatePlan} disabled={planLoading}><CalendarDays size={18} />{planLoading ? 'Planning your week…' : 'Generate My Week'}</button>
          </div>
          {planError && <p className="error">{planError}</p>}
          {weeklyPlan && (
            <>
              <div className="plan-summary"><div><small>WEEKLY PLAN</small><h2>{weeklyPlan.title}</h2></div><strong>Estimated total {weeklyPlan.estimatedTotal}</strong></div>
              <div className="week-grid">{weeklyPlan.days.map(d => <article className="day-card" key={d.day}><small>{d.day}</small><h3>{d.meal}</h3><p>{d.description}</p><b>{d.estimatedCost}</b></article>)}</div>
              <button className="primary combined" onClick={() => addItems(weeklyPlan.grocery, 'Weekly Combined List')}><ShoppingBasket size={18} />Build One Combined Grocery List</button>
            </>
          )}
        </section>
      )}

      {tab === 'recipes' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">THE RECIPE VAULT</p><h2>Find your next Fancy Eatz moment.</h2><p>Browse the recipe vault A–Z, search by ingredient or title, filter by meal type, or send any idea to Pantry Chef for a personalized version.</p></div>
          <div className="recipe-tools">
            <label className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search salmon, crab, brunch..." /></label>
            <div className="filter-row">{['All', 'Breakfast', 'Lunch', 'Dinner', 'Dessert'].map(x => <button className={recipeType === x ? 'active' : ''} key={x} onClick={() => setRecipeType(x)}>{x}</button>)}</div>
          </div>
          <div className="cards">
            {filteredRecipes.map((r, i) => <article className="recipe-card" key={r.title}><div className={'food-art art-' + (i % 6)}><span>{r.tag}</span></div><div className="card-body"><small>{r.mealType} · {r.time} · {r.budget}</small><h3>{r.title}</h3><p>{r.note}</p><button onClick={() => { const recipePrompt = r.title + ' ingredients'; setPantry(recipePrompt); setMealType(r.mealType); setMeal(null); navigate('pantry'); void generateMeal(true, recipePrompt, r.mealType); }}>Make My Version →</button></div></article>)}
          </div>
          {filteredRecipes.length === 0 && <div className="empty panel"><Search size={36} /><h3>No exact match yet</h3><p>Try another search, or use Pantry Chef to generate the meal you have in mind.</p></div>}
          <div className="source-note"><BookOpen size={20} /><div><b>Ultimate Collection of Seafood Recipes</b><p>The seafood collection is available as a source library alongside Fancy Eatz generated ideas.</p><a href="./resources/seafood-recipes.pdf" target="_blank" rel="noreferrer">Open source collection</a></div></div>
        </section>
      )}

      {tab === 'ideas' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">NO IDEA WHAT TO COOK?</p><h2>Choose a vibe. Fancy Eatz does the rest.</h2><p>Each experience carries its settings into Pantry Chef so you can personalize before generating.</p></div>
          <div className="mood-grid">{moods.map(m => <button key={m} className="mood" onClick={() => applyMood(m)}><Sparkles size={22} /><b>{m}</b><span>Build a menu →</span></button>)}</div>
          <button className="primary surprise" onClick={() => generateMeal(true)} disabled={loading}>{loading ? 'Creating…' : 'Surprise Me With Dinner'}</button>
        </section>
      )}

      {tab === 'favorites' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">MY FANCY COOKBOOK</p><h2>Your Personal Recipe Collection</h2><p>Save the meals worth making again and build your own evolving Fancy Eatz cookbook. Saved recipes stay on this device.</p></div>
          {favorites.length === 0 ? <div className="empty panel"><Heart size={40} /><h3>Your cookbook is ready</h3><p>Generate a meal in Pantry Chef and tap Save Favorite to add your first recipe.</p></div> : <div className="cards">{alphabetizedFavorites.map(f => <article className="recipe-card saved-card" key={f.title}><div className="card-body"><small>SAVED MEAL</small><h3>{f.title}</h3><p>{f.description}</p><button onClick={() => { setMeal(f); navigate('pantry'); }}>Open recipe →</button><button className="remove-favorite" onClick={() => setFavorites(p => p.filter(x => x.title !== f.title))}>Remove</button></div></article>)}</div>}
        </section>
      )}

      {tab === 'grocery' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">SHOP SMARTER</p><h2>Specialized Grocery Lists</h2><p>Start curated, add meal gaps, or combine an entire week into one list.</p></div>
          <div className="list-tabs">{(Object.keys(starterLists) as (keyof typeof starterLists)[]).map(n => <button className={listName === n ? 'active' : ''} key={n} onClick={() => loadList(n)}>{n}</button>)}</div>
          <div className="grocery panel">
            <div className="grocery-title"><div><small>ACTIVE LIST</small><h2>{listName}</h2></div><span>{grocery.length - checked.length} left</span></div>
            <div className="add-row"><input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add an item…" onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { setGrocery([...grocery, newItem.trim()]); setNewItem(''); } }} /><button onClick={() => { if (newItem.trim()) { setGrocery([...grocery, newItem.trim()]); setNewItem(''); } }}><Plus size={18} /></button></div>
            {Object.entries(grouped).map(([cat, items]) => items.length > 0 && <div className="category" key={cat}><h3>{cat}</h3>{items.map(item => <div className={'grocery-item ' + (checked.includes(item) ? 'done' : '')} key={item}><button className="check" onClick={() => setChecked(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item])}>{checked.includes(item) && <Check size={15} />}</button><span>{item}</span><button className="trash" onClick={() => setGrocery(p => p.filter(x => x !== item))}><Trash2 size={16} /></button></div>)}</div>)}
          </div>
        </section>
      )}

      <footer><div className="brand footer-brand"><span>F</span><div><b>FANCY EATZ</b><small>Everyday ingredients. Elevated experiences.</small></div></div><p>Cook beautifully. Shop intentionally. Eat fancy.</p></footer>
    </main>
  );
}
