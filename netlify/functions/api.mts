function send(data: unknown, status = 200) { return new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8' } }); }

function cleanItems(value: unknown) {
  return String(value || '').split(/,|\n/).map(x => x.trim()).filter(Boolean).slice(0, 24);
}

function mealFrom(body: any, variant = 0) {
  const items = cleanItems(body.pantry);
  const avoid=String(body.allergies||'None').toLowerCase();
  const blocked:Record<string,RegExp>={peanuts:/peanut/i,'tree nuts':/almond|walnut|pecan|cashew|pistachio|hazelnut|tree nut/i,shellfish:/shrimp|crab|lobster|clam|mussel|oyster|scallop|shellfish/i,dairy:/milk|cream|cheese|butter|yogurt|dairy/i,eggs:/\begg(s)?\b/i,gluten:/wheat|flour|bread|pasta|noodle|cracker|barley|rye|gluten/i};
  const rule=blocked[avoid];
  const safeItems=rule?items.filter(x=>!rule.test(x)):items;
  const base = safeItems.length ? safeItems : ['rice', 'seasonal vegetables', 'fresh herbs'];
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
    description: `A practical ${String(body.style || 'chef-inspired').toLowerCase()} meal built around what is already in your kitchen.${avoid!=='none'?' Requested avoid preference: '+body.allergies+'.':''}`,
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
  if (url.pathname === '/api/early-access' && req.method === 'POST') {
    let body:any={}; try { body=await req.json(); } catch { return send({error:'Invalid JSON'},400); }
    const email=String(body.email||'').trim().toLowerCase();
    if(!email.includes('@')||!email.split('@')[1]?.includes('.')) return send({error:'Valid email required'},400);
    const base='https://flnplmywkukyejisbnyd.supabase.co';
    const key='sb_publishable_LE5sDW4xAwQSp_ElCSzVFA_wJEUwJbR';
    const r=await fetch(base+'/rest/v1/rpc/join_early_access',{method:'POST',headers:{'content-type':'application/json','apikey':key,'Authorization':'Bearer '+key},body:JSON.stringify({p_email:email,p_source:String(body.source||'website')})});
    if(!r.ok) return send({error:'Could not save signup'},502);
    return send({ok:true,email});
  }
  if (url.pathname === '/api/early-access-stats' && req.method === 'POST') {
    const code=req.headers.get('x-owner-code')||'';
    if(code!=='FANCY2026') return send({error:'Unauthorized'},401);
    const base='https://flnplmywkukyejisbnyd.supabase.co';
    const key='sb_publishable_LE5sDW4xAwQSp_ElCSzVFA_wJEUwJbR';
    const r=await fetch(base+'/rest/v1/early_access?select=id,email,source,status,created_at,launch_invited_at,converted_at&order=created_at.desc',{headers:{'apikey':key,'Authorization':'Bearer '+key}});
    if(!r.ok) return send({error:'Dashboard data unavailable'},502);
    return send({leads:await r.json()});
  }
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
    const image = String(body.image || '');
    if (!image.startsWith('data:image/')) return send({ items: [], available: true, message: 'Please upload a food or kitchen photo.' }, 400);
    const key = process.env.OPENAI_API_KEY;
    const base = (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1').replace(/\/$/, '');
    if (!key) return send({ items: [], available: false, message: 'Photo recognition is not configured on this deployment yet.' }, 503);
    try {
      const vision = await fetch(base + '/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: 'Bearer ' + key },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          temperature: 0,
          max_tokens: 250,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: 'Identify only food, beverages, and cooking ingredients visibly present in the image. Do not invent hidden ingredients. Return strict JSON: {"items":["item 1","item 2"],"note":"short confidence note"}. Use ordinary grocery names, deduplicate, maximum 20 items.' },
            { role: 'user', content: [
              { type: 'text', text: 'List the visible food and ingredient items in this kitchen/meal photo for a pantry assistant.' },
              { type: 'image_url', image_url: { url: image, detail: 'low' } }
            ] }
          ]
        })
      });
      if (!vision.ok) {
        const detail = await vision.text();
        return send({ items: [], available: false, message: 'Photo analysis could not complete. Please try again or enter ingredients manually.', detail: detail.slice(0,300) }, 502);
      }
      const result:any = await vision.json();
      const raw = result?.choices?.[0]?.message?.content || '{}';
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed.items) ? parsed.items.map((x:any)=>String(x).trim()).filter(Boolean).slice(0,20) : [];
      return send({ items, available: true, note: String(parsed.note || ''), message: items.length ? 'Visible ingredients detected. Review and edit them before generating a meal.' : 'No clear food ingredients were detected. Try a closer, brighter photo.' });
    } catch (error:any) {
      return send({ items: [], available: false, message: 'Photo analysis failed. Please retry or enter ingredients manually.', detail: String(error?.message || error).slice(0,300) }, 500);
    }
  }
  return send({ error: 'Not found' }, 404);
};

export const config = { path: '/api/*' };