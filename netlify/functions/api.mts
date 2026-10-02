function send(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } }); }

function cleanItems(value: unknown) {
  return String(value || '').split(/,|\n/).map(x => x.trim()).filter(Boolean).slice(0, 24);
}

function mealFrom(body: any, variant = 0) {
  const items = cleanItems(body.pantry);
  const base = items.length ? items : ['chicken', 'rice', 'seasonal vegetables'];
  const primary = base[variant % base.length] || base[0];
  const second = base[(variant + 1) % base.length] || 'seasonal vegetables';
  const third = base[(variant + 2) % base.length] || 'rice';
  const servings = Math.max(1, Number.parseInt(String(body.servings || '2'), 10) || 2);
  const requestedStyle = String(body.style || '');
  const isGrill = /grill/i.test(requestedStyle);
  const isDessert = /dessert|pastry/i.test(requestedStyle) || /dessert/i.test(String(body.mealType || ''));
  const isFineDining = /fine dining/i.test(requestedStyle);
  const isFamily = /everyday family/i.test(requestedStyle);
  const styles = isGrill ? ['Grilled', 'Flame-Kissed', 'Backyard Bistro'] : isDessert ? ['Elegant', 'Decadent', 'Patisserie-Style'] : isFineDining ? ['Fine-Dining', 'Chef-Composed', 'Restaurant-Style'] : isFamily ? ['Family-Style', 'Weeknight', 'Comfort-Kitchen'] : ['Skillet', 'Roasted', 'Bistro'];
  const titles = [
    isDessert ? `Fancy ${styles[variant % styles.length]} ${primary} Dessert` : `Fancy ${styles[variant % styles.length]} ${primary}`,
    `Elevated ${primary} & ${second} Bowl`,
    `Chef-Style ${primary} with ${second}`
  ];
  const ingredients = base.slice(0, 8).map((item, i) => i === 0 ? `${servings} serving portions ${item}` : `${Math.max(1, Math.ceil(servings / 2))} cup(s) ${item}`);
  ingredients.push('1 tbsp cooking oil', 'salt and black pepper to taste');
  return {
    title: titles[variant % titles.length],
    description: `A practical ${String(body.style || 'chef-inspired').toLowerCase()} meal built around what is already in your kitchen.`,
    ingredients,
    steps: [
      `Prep ${primary}, ${second} and ${third}; cut solid ingredients into even bite-size pieces so they cook evenly.`,
      isGrill ? 'Preheat the grill to medium-high heat, clean and lightly oil the grates, then place the main ingredient over direct heat.' : isDessert ? 'Preheat or chill the required equipment for the dessert method, then combine the measured base ingredients evenly.' : isFineDining ? 'Prepare and season each component separately so the protein, vegetables, sauce and garnish can be plated with precision.' : isFamily ? 'Prep the ingredients first, then use a practical skillet, sheet-pan or casserole method to keep the family meal straightforward.' : 'Heat a large skillet over medium heat for 2 minutes, add the oil, then add the firmest/raw ingredients first.',
      'Cook, stirring or turning as needed, until vegetables are tender and any raw protein reaches a safe doneness for that ingredient.',
      'Add quicker-cooking or already-cooked pantry ingredients during the final 3–5 minutes so they heat through without overcooking.',
      'Taste, season with salt and black pepper, then rest off heat for 2 minutes before serving.',
      'Plate neatly with the main ingredient centered and the remaining components arranged around it.'
    ],
    plating: 'Use a warm plate or shallow bowl, keep the rim clean, and finish with any fresh herb, citrus, or sauce already on hand.',
    missing: [],
    estimatedCost: 'Uses pantry ingredients first; added-grocery cost depends on local prices.'
  };
}

function planFrom(body: any) {
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  const meals = days.map((day, i) => {
    const m = mealFrom(body, i % 3);
    return { day, meal: m.title, description: m.description, estimatedCost: m.estimatedCost, groceries: m.missing };
  });
  return { title: 'Fancy Eatz Week', days: meals, grocery: [], estimatedTotal: 'Designed to use pantry ingredients first; local grocery prices vary.' };
}

export default async (req: Request) => {
  const url = new URL(req.url);
  if (url.pathname === '/api/_healthcheck') return send({ ok: true, service: 'fancy-eatz-netlify' });
  if (req.method !== 'POST') return send({ error: 'Method not allowed' }, 405);
  let body: any = {};
  try { body = await req.json(); } catch { return send({ error: 'Invalid JSON' }, 400); }
  if (url.pathname === '/api/generate-meal') return send({ meal: mealFrom(body, 0) });
  if (url.pathname === '/api/generate-options') return send({ meals: [mealFrom(body, 0), mealFrom(body, 1), mealFrom(body, 2)] });
  if (url.pathname === '/api/generate-plan') return send({ plan: planFrom(body) });
  if (url.pathname === '/api/generate-experience') {
    const m = mealFrom(body, 1);
    return send({ experience: { title: String(body.occasion || 'Fancy Eatz At Home'), appetizer: 'Pantry-first starter', entree: m.title, sides: ['Seasonal pantry side'], dessert: 'Simple fruit or pantry dessert', pairing: 'Sparkling citrus water', timeline: m.steps, plating: m.plating, tableSetting: 'Clean place settings with a simple centerpiece.', groceries: m.missing, ingredients: m.ingredients, steps: m.steps, estimatedCost: m.estimatedCost } });
  }
  if (url.pathname === '/api/analyze-kitchen-photo') {
    return send({ items: [], available: false, message: 'Photo recognition is not connected on this host yet. Manual ingredient entry remains available.' });
  }
  return send({ error: 'Not found' }, 404);
};

export const config = { path: '/api/*' };