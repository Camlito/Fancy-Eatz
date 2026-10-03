import { useEffect, useMemo, useState } from 'react';
import { drinks } from './drinks';
import { styleRecipeVault, styleRecipeCounts } from './styleRecipeVault';
const api = { post: async (url: string, body: unknown) => { const response = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); let data:any={}; try { data=await response.json(); } catch { data={message:'The server returned an unreadable response.'}; } if (!response.ok) { const err:any=new Error(data?.message || 'Request failed'); err.data=data; throw err; } return { data }; } };
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
  Crown,
  LockKeyhole,
  ShieldCheck,
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

type MealChoice = Meal & { category: string; selected?: boolean };
type MixComponent = { name:string; kind:'Entrée'|'Sauce'|'Vegetable'|'Starch'|'Side'|'Finish'; source:string };

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
  ingredients: string[];
  steps: string[];
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
  category?: string;
  ingredients?: string[];
  method?: string[];
  servings?: string;
  image?: string;
  style?: string;
};

const featuredBase: Recipe[] = [
  { title:'Crab Benedict', tag:'Crab Brunch', time:'25 min', note:'Poached eggs and crab over toasted English muffins with Hollandaise.', mealType:'Breakfast', diet:'Pescatarian', budget:'$$$', category:'Brunch', servings:'2', image:'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?auto=format&fit=crop&w=1200&q=85', ingredients:['4 eggs','4 oz fresh or canned crabmeat','Hollandaise sauce','2 English muffins, split'], method:['Prepare Hollandaise sauce and set aside.','Drain excess liquid from crabmeat and toast the English muffins.','Poach the eggs.','Place two muffin halves on each plate and top each half with 1 oz crabmeat.','Place a poached egg over each portion of crab, cover with Hollandaise and serve immediately.'] },
  { title:'Crab Bisque', tag:'Crab', time:'35 min', note:'Rich crab bisque simmered with cream, parsley and a touch of cayenne.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Soups', servings:'5 cups', image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=85', ingredients:['2 tbsp butter','1 tsp onion, finely chopped','1 tbsp parsley, finely chopped','1 1/2 cups crabmeat, chopped','2 tbsp flour','2 cups chicken broth','2 cups light cream','1 pinch cayenne pepper','salt to taste'], method:['Melt butter in a saucepan and slowly cook onion until golden.','Add crabmeat and parsley; cook over low heat, stirring constantly, about 4 minutes.','Add flour, blend well and cook 3 minutes more.','Stir in chicken broth, partially cover and gently simmer for 20 minutes.','Add cream and cayenne, heat through and season with salt to taste.'] },
  { title:'Crab Broccoli Casserole', tag:'Crab', time:'35 min', note:'Crab and tender broccoli baked with sour cream, lemon, chili sauce and cheddar.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Casseroles', servings:'4', image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85', ingredients:['1 bunch broccoli','2 tbsp butter','1/2 lb crab meat','1 cup sour cream','1 tbsp grated lemon peel','2 tbsp lemon juice','1/4 cup chili sauce or chili salsa','1 cup grated cheddar cheese','1 small onion, diced','dash sea salt','dash cayenne'], method:['Sauté broccoli in butter until tender, then cut into small pieces.','Mix broccoli with crab meat.','Add sour cream, lemon peel, lemon juice, chili sauce, cheddar, onion, salt and cayenne; stir together.','Transfer to a small oiled baking dish.','Bake uncovered at 350°F for 20 minutes, or until cheese is melted and the top is browned.'] },
  { title:'Crab Burgers', tag:'Crab', time:'20 min', note:'Open-faced hot crab and cheddar burgers with a tangy seasoned dressing.', mealType:'Lunch', diet:'Pescatarian', budget:'$$', category:'Sandwiches', image:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1200&q=85', ingredients:['2 large hard-cooked eggs','1 cup crab meat','1 cup medium cheddar, grated','1 medium green onion, diced','1/2 cup mayonnaise','catsup or BBQ sauce, to taste','dash celery salt','dash onion salt','dash garlic powder','2 tbsp sweet pickle juice','hamburger bun halves'], method:['Mix hard-cooked eggs, crab meat, cheddar and green onion together.','In a small bowl combine mayonnaise, catsup or BBQ sauce, celery salt, onion salt, garlic powder and sweet pickle juice.','Add dressing to the crab mixture and combine.','Spread mixture over hamburger bun halves.','Broil until bubbly or lightly browned and serve hot.'] },
  { title:'Crab Artichoke Heart & Pasta Casserole', tag:'Crab Pasta', time:'60 min', note:'Creamy shell pasta baked with crab, artichoke hearts, Gruyère and Parmesan.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Casseroles', image:'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85', ingredients:['1 lb tiny shell noodles','1 shallot, minced','4 green onions, chopped including green tops','2 tbsp butter','1 cup chicken stock','1/2 cup dry white wine','1/4 cup Marsala or Madeira','3/4 cup cream','1/2 cup grated Gruyère or Swiss cheese','1/2 lb crab meat','2 jars marinated artichoke hearts, halved','1/2 cup chopped flat-leaf parsley','salt and pepper to taste','1/4 cup grated Parmesan','2 tbsp bread crumbs'], method:['Cook shell noodles in boiling water until tender; drain.','Melt butter and sauté shallot and green onions until soft.','Add chicken stock and white wine and reduce by half. Stir in Madeira, bring to a boil, then add cream and cook until just thickened.','Add Gruyère to the sauce. Combine with pasta, crab, artichoke hearts and parsley; season to taste.','Transfer to a buttered casserole, top with Parmesan and bread crumbs, and bake at 350°F for 30–40 minutes until bubbling.'] },

  { title:'Crab & Corn Cakes', tag:'Crab + Corn', time:'25 min', note:'Skillet crab-and-corn cakes with Dijon, garlic and green onion.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Appetizers', image:'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85', ingredients:['1 cup corn','2 garlic cloves, chopped','1 tsp Dijon mustard','1 egg','1 tsp Worcestershire sauce','1/2 cup crab','1/2 cup flour','2 green onions, chopped'], method:['Blend 1/2 cup corn with garlic, Worcestershire sauce, mustard and egg until smooth.','Add remaining corn, crab and green onions.','Mix in enough flour to make a thick mixture.','Form portions and fry in a skillet until cooked and golden.','For the source cookbook’s lower-fat, higher-fiber variation, use 2 egg whites instead of the whole egg and oat flakes instead of flour.'] },
  { title:'Crab & Corn Chowder', tag:'Crab', time:'45 min', note:'Creamy crab, corn and potato chowder finished with bacon.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Soups', image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=85', ingredients:['1 small onion, chopped','4 tbsp margarine','1/3 cup flour','3 cups milk','2 medium potatoes','1 small green pepper','1 slice celery','1 cup half-and-half cream','4 slices bacon, crisp and crumbled','2 cans crabmeat','1 can kernel corn'], method:['Sauté onion in margarine until soft.','Add flour and cook gently for 1 minute, then remove from heat.','Gradually add milk. Return to heat and cook until thick.','Add diced potatoes, celery, green pepper and cream; simmer 30 minutes.','Add crabmeat and corn and heat through. Finish with crumbled bacon.'] },
  { title:'Crab & Corn Soup', tag:'Crab + Corn', time:'20 min', note:'Quick gingered corn and crab soup with green onion and rice vinegar.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Soups', image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=85', ingredients:['16 oz frozen whole corn','1 tbsp cornstarch','1/4 cup water','3 cans chicken broth, 10 1/4 oz each','1 tsp ginger root','1/2 lb fresh crabmeat','1/3 cup minced green onions','1/2 tsp salt','1/8 tsp white pepper','1 tsp rice vinegar'], method:['Process half the corn until finely chopped, then stir in the remaining corn.','Combine cornstarch and water in a small bowl.','Bring chicken broth and ginger root to a boil in a large saucepan.','Add corn, cornstarch mixture, crabmeat, green onions, salt, pepper and rice vinegar.','Return to a boil, reduce heat and simmer uncovered for 3 minutes.'] },
  { title:"Crab & Cream Cheese Hors D'oeuvres", tag:'Crab', time:'25 min', note:'Warm baked crab and cream cheese spread topped with slivered almonds.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Appetizers', servings:'2 cups', image:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', ingredients:['8 oz cream cheese, softened','8 oz backfin crabmeat','1 tbsp milk','2 tbsp chopped onion','1/2 tsp horseradish','2 oz slivered almonds','salt to taste','pepper to taste'], method:['Blend cream cheese, crabmeat, milk, onion and horseradish; season with salt and pepper.','Transfer to a shallow baking dish.','Sprinkle slivered almonds over the top.','Bake at 350°F until slightly browned on top.','Serve hot with crackers.'] },
  { title:'Crab & Cucumber Rolls', tag:'Crab', time:'15 min + chill', note:'Chilled cucumber rounds filled with a lightly spiced crab mixture.', mealType:'Lunch', diet:'Pescatarian', budget:'$$', category:'Appetizers', image:'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1200&q=85', ingredients:['1 large cucumber','6 1/2 oz canned crab meat','4 tbsp mayonnaise','1 1/2 tsp finely grated onion','1 large pinch salt','1/2 tsp sugar','5 drops Tabasco'], method:['Trim cucumber ends and cut cucumber into 3 pieces.','Remove seeds with a corer or sharp knife to create a large cavity.','Mix crab, mayonnaise, onion, salt, sugar and Tabasco.','Stuff the crab mixture into the cucumber cavities.','Wrap in plastic and chill, then slice into 1/2-inch-thick rounds.'] },
  { title:'Crab & Green Onion Pie', tag:'Crab', time:'75 min', note:'Savory crab pie with green onions, lemon, mustard and a cheesy custard.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Entrées', image:'https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&w=1200&q=85', ingredients:['1 pie crust','1 1/2 cups shredded cheese, divided','2 tbsp butter','6 green onions','1/2 lb crabmeat','4 eggs','1 cup half-and-half','2 tbsp lemon juice','1/2 tsp grated lemon peel','1/4 tsp salt','1/4 tsp dry mustard'], method:['Preheat oven to 350°F and bake pie crust for 10 minutes.','Sprinkle 3/4 cup cheese over the bottom of the crust.','Chop green onions; cook in melted butter until soft, then gently mix with crab and spoon over cheese.','Beat eggs with half-and-half, lemon juice, lemon peel, salt and mustard; pour over crab mixture.','Top with remaining cheese and bake 55–60 minutes until center is set.','Cool 15 minutes and serve warm or at room temperature.'] },

  { title:'Chilean Sea Bass with Garlic', tag:'Sea Bass', time:'40 min', note:'Tender sea bass baked with basil-garlic lemon butter, potatoes, carrots and asparagus.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Entrées', servings:'4', image:'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=85', ingredients:['4 tbsp unsalted butter, room temperature','4 tsp fresh basil, finely chopped','2 garlic cloves, pressed','2 tbsp fresh lemon juice','4 red-skinned potatoes','8 baby carrots','1 1/2 lb fresh boneless Chilean sea bass fillets','8 slender asparagus spears'], method:['Preheat oven to 425°F.','Beat butter, basil, garlic and lemon juice together; set aside.','Parboil potatoes and baby carrots for 5 minutes, then drain.','Divide sea bass into four equal portions and place in a buttered baking dish.','Arrange vegetables over the fish and top each portion with one-fourth of the garlic-butter mixture.','Cover tightly with foil and bake 20–30 minutes, until fish flakes easily with a fork. Serve immediately.'] },
  { title:'Citrus Scallops', tag:'Scallops', time:'15 min', note:'Quick citrus-marinated scallops sautéed with garlic, orange rind and parsley.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Entrées', servings:'4', image:'https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&w=1200&q=85', ingredients:['1 1/2 lb sea scallops','2 tbsp lemon juice','1 tbsp chopped fresh parsley','1 tsp grated orange rind','1/2 tsp salt','1/8 tsp pepper','2 garlic cloves, minced','1 tbsp olive oil','1 tbsp chopped fresh parsley for topping'], method:['Combine scallops, lemon juice, parsley, orange rind, salt, pepper and garlic in a large bowl; toss well.','Chill for 5 minutes.','Heat olive oil in a large nonstick skillet over medium-high heat.','Add scallop mixture and sauté about 4 minutes, or until scallops are done.','Top with remaining parsley and serve. The source notes these can be served over soba noodles.'] },
  { title:'Citrus Shrimp & Scallops', tag:'Shrimp + Scallops', time:'45 min', note:'Orange-ginger seafood kabobs with shrimp, scallops and pea pods.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Entrées', servings:'4 skewers', image:'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=85', ingredients:['1/2 lb scallops','1 tsp finely shredded orange peel','1/2 cup orange juice','2 tbsp soy sauce','1 tsp grated gingerroot','1 garlic clove, minced','1/4 tsp ground red pepper','12 pea pods','1 orange, cut into 8 wedges','12 large shrimp, peeled and deveined'], method:['Halve any large scallops.','Combine orange peel, orange juice, soy sauce, gingerroot, garlic and red pepper for the marinade.','Marinate scallops and shrimp in the refrigerator for 30 minutes, then drain and reserve marinade.','If using fresh pea pods, boil about 2 minutes and drain. Wrap one pea pod around each shrimp.','Thread shrimp, pea pods, scallops and orange wedges onto four skewers.','Grill over medium-hot coals 5 minutes; turn, brush with marinade and grill 5–7 minutes more until shrimp are pink and scallops opaque.'] },
  { title:'Corn & Crab Chowder', tag:'Crab', time:'40 min', note:'Creamy corn and lump-crab chowder with poblano and chipotle.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Soups', servings:'4 cups', image:'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=85', ingredients:['4 tbsp unsalted butter','1 medium onion, chopped','1 garlic clove, chopped','3 cups fresh corn kernels','1/4 cup water','1 1/2 tbsp cornstarch','2 cups whole milk','3/4 cup lump crabmeat, about 4 oz','1 cup whipping cream','2 poblano chilies, roasted and diced','1 canned chipotle chili, diced','salt to taste','fresh thyme or cilantro, chopped'], method:['Melt 2 tablespoons butter in a large saucepan. Cook onion and garlic over medium heat until soft, 7–8 minutes.','Transfer to a blender; add corn, water and cornstarch and blend until smooth.','Melt remaining butter in the same pan. Add purée and cook, stirring constantly, 3–4 minutes until thickened.','Add milk, bring to a simmer, partially cover and simmer 15 minutes, stirring often.','Strain, pressing solids to extract liquid, then return liquid to pan.','Add crab, cream, poblano, chipotle and salt; heat to a simmer. Serve hot with thyme or cilantro.'] },

  { title:'Blue Crab Cakes with Cayenne Mayonnaise', tag:'Crab', time:'45 min', note:'Golden blue-crab cakes served with a bold cayenne mayonnaise.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Appetizers', servings:'Family style', image:'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85', ingredients:['1 stalk celery, finely chopped','1 bunch green onions, finely chopped','1 bunch parsley, finely chopped','1 egg','1 tbsp Dijon mustard','3/4 cup mayonnaise','juice of 2 lemons','1/2 tsp salt','1/2 tsp pepper','4 1/2 oz water biscuits, ground','1 lb blue crab meat','4 tbsp butter, or as needed','1 roasted red bell pepper, peeled and seeded','2 egg yolks','1 tbsp white wine vinegar','1 1/2 tsp capers','6 garlic cloves','8 anchovy fillets','1 1/2 tsp cayenne pepper','1 cup salad oil'], method:['Mix celery, green onions, parsley, egg, mustard, mayonnaise and lemon juice.','Add salt, pepper and ground biscuits; combine gently, then carefully fold in crab meat.','Refrigerate mixture for 30 minutes, then form into patties.','Melt butter in a large skillet over medium heat and sauté cakes 3–4 minutes per side until golden brown.','For cayenne mayonnaise, blend roasted pepper, egg yolks, vinegar, lemon juice, capers, garlic, anchovies and cayenne until smooth.','With blender running, slowly add salad oil until mayonnaise forms; season to taste.','Serve crab cakes with cayenne mayonnaise and lemon wedges.'] },
  { title:'Broiled Salmon with Lime & Cilantro', tag:'Salmon', time:'25 min', note:'Bright lime, cilantro and garlic over quickly broiled salmon steaks.', mealType:'Dinner', diet:'Pescatarian', budget:'$$', category:'Entrées', servings:'4', image:'https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=1200&q=85', ingredients:['1/2 cup cilantro leaves, finely chopped','1 large garlic clove, finely chopped','2 tbsp lime juice','1 tbsp olive oil','1/2 tsp salt','4 salmon steaks, 3/4-inch thick'], method:['Combine cilantro, garlic, lime juice, olive oil and salt.','Reserve 2 tablespoons; pour the remainder over salmon and let stand covered for 10 minutes.','Place salmon on a prepared broiler rack and brush with 1 tablespoon reserved marinade.','Broil 6 inches from heat for 3–4 minutes.','Turn, brush with remaining marinade and broil about 3 minutes more or until cooked through.'] },
  { title:'Citrus Grilled Jumbo Scallops', tag:'Scallops', time:'30 min', note:'Jumbo scallops grilled with butter and finished in a warm Chardonnay citrus sauce.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Entrées', servings:'4', image:'https://images.unsplash.com/photo-1599021419847-d8a7a6aba5b4?auto=format&fit=crop&w=1200&q=85', ingredients:['melted butter, as needed','fresh parsley, chopped','12 jumbo scallops, halved widthwise','1 cup water','juice of 1/4 lemon','1 cup Chardonnay','1 tbsp butter','2 tsp honey','pinch of salt','1/2 garlic clove, diced','cornstarch dissolved in water, as needed'], method:['Combine water, wine, lemon juice, butter, honey, peppers and garlic in a small saucepan.','Reduce over medium heat to almost half, stirring frequently.','Add cornstarch solution as needed to thicken; remove from heat and keep warm.','Grill scallops over hot coals, brushing frequently with melted butter, until cooked to taste.','Arrange scallop halves on plates, spoon citrus sauce over them and garnish with parsley.'] },
  { title:'Crab & Avocado Fritters', tag:'Crab', time:'30 min + chill', note:'Crisp crab-and-avocado fritters with green onion and hot chili salsa.', mealType:'Dinner', diet:'Pescatarian', budget:'$$$', category:'Appetizers', servings:'4 dozen', image:'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1200&q=85', ingredients:['2 lb crabmeat','salt','1 cup diced green onions','1/4 cup dry breadcrumbs','1 medium avocado, cut into 1/4-inch pieces','corn oil for deep-frying','all-purpose flour','thinly slivered green onion, optional','2 eggs','1/2 cup hot chili salsa'], method:['Combine crab, 1 cup green onions and avocado in a large bowl.','Mix eggs, salsa and salt; add to crab mixture, then mix in breadcrumbs.','Form into 1 1/2-inch balls, place on a parchment-lined sheet, cover and refrigerate for 3 hours.','Heat oil in a large skillet to 350°F and dust fritters with flour.','Fry in batches without crowding until golden brown, about 2 minutes per side when refrigerated.','Drain on paper towels, keep warm in a low oven, garnish with green onion slivers and serve immediately.'] },

  { title: 'Grilled Salmon with Honey Mustard Glaze', tag: 'Salmon', time: '30 min', note: 'Sweet-savory glaze with an elegant grilled finish.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$', category:'Entrées', servings:'1 per fillet', image:'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=85', ingredients:['6 oz salmon fillet, lightly brushed with oil','2 tbsp honey','2 pinches dry Coleman’s mustard','2 tbsp warm water','2 tsp soy sauce','salt, to taste','black pepper, to taste'], method:['Combine honey, mustard, warm water and soy sauce; season with salt and pepper.','Brush salmon lightly with oil and season with salt and pepper.','Grill 2–3 minutes per side, turning carefully only once.','Brush the flesh side with honey-mustard glaze just before removing from the grill.','Serve immediately.'] },
  { title: 'Crab Cakes with Basil Mayonnaise', tag: 'Crab', time: '35 min', note: 'Crisp crab cakes paired with a bright basil mayonnaise.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$$$', category: 'Appetizers', servings: '12 cakes', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=1200&q=85', ingredients: ['40 basil leaves','1 1/2 cups mayonnaise','2 tsp Dijon mustard','2 tsp lemon juice','cayenne pepper','2 tbsp olive oil','2 celery stalks, finely chopped','2/3 cup onion, finely chopped','1 lb lump crabmeat, picked clean','2 2/3 cups dry breadcrumbs','1/4 cup chopped chives','2 tbsp chopped parsley','6 tbsp flour','3 large eggs','2 tbsp vegetable oil'], method: ['Blanch basil leaves for 30 seconds, cool in ice water, pat dry and finely chop.','Mix mayonnaise, mustard, lemon juice and cayenne. Reserve 1/2 cup for the crab cakes; mix basil into the remainder and refrigerate.','Sauté celery and onion in olive oil until tender, about 5 minutes. Transfer to a bowl.','Stir in crabmeat, 2/3 cup breadcrumbs, chives and reserved mayonnaise; season to taste. Form twelve cakes.','Bread each cake in flour, egg and remaining breadcrumbs.','Pan-cook in vegetable oil over medium heat until golden, working in batches. Serve with basil mayonnaise.'] },
  { title: 'Fish Piccata', tag: 'Fish', time: '25 min', note: 'A bright fish dinner with lemon-forward piccata character.', mealType: 'Dinner', diet: 'Pescatarian', budget: '$', category: 'Entrées', servings: '2', ingredients: ['9–12 oz snapper, skinless catfish or other fish fillets','salt and pepper','1 tbsp flour','1 tbsp butter or margarine','2 tbsp lemon juice','2 tbsp minced parsley','4 thin lemon slices, for garnish'], method: ['Cut fish into serving-size pieces, season lightly and dredge in flour, shaking off excess.','Heat butter in a nonstick skillet over moderate heat until bubbling. Cook fish for 3 minutes.','Turn and continue cooking until the fish begins to flake when tested with a fork.','Transfer to warm plates. Add lemon juice and parsley to the pan and cook for 30 seconds while loosening the pan contents.','Pour the sauce over the fish and garnish with lemon slices.'] },
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

const valueRecipes: Recipe[] = [
 {title:'Weeknight Garlic Butter Chicken',tag:'Everyday Mom',time:'30 min',note:'One-pan chicken with garlic butter, broccoli and potatoes.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Family Meals',servings:'4',ingredients:['4 boneless chicken breasts','1 lb baby potatoes, halved','3 cups broccoli florets','3 tbsp butter','4 garlic cloves, minced','1 tsp paprika','salt and black pepper'],method:['Heat oven to 425°F.','Season chicken and potatoes with paprika, salt and pepper.','Melt butter with garlic and coat the chicken and potatoes.','Roast chicken and potatoes for 15 minutes.','Add broccoli and roast 10–15 minutes more, until chicken reaches 165°F and potatoes are tender.','Rest chicken 5 minutes and spoon the pan juices over each serving.']},
 {title:'Creamy Family Chicken Pasta',tag:'Everyday Mom',time:'30 min',note:'Creamy Parmesan chicken pasta designed for an easy family dinner.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Family Meals',servings:'4',ingredients:['12 oz pasta','1 lb chicken breast, diced','2 tbsp olive oil','3 garlic cloves, minced','1 cup chicken broth','1 cup heavy cream','3/4 cup grated Parmesan','2 cups spinach','salt and black pepper'],method:['Cook pasta until al dente and reserve 1/2 cup pasta water.','Season chicken and sauté in oil until cooked through; remove.','Cook garlic for 30 seconds, then add broth and cream.','Simmer gently and whisk in Parmesan.','Return chicken, pasta and spinach to the pan.','Toss until spinach wilts, thinning with reserved pasta water as needed.']},
 {title:'Grill Master Steak & Garlic Herb Butter',tag:'Grill Master',time:'35 min',note:'Charred steak finished with garlic-herb butter and a proper rest.',mealType:'Dinner',diet:'No restriction',budget:'$$$',category:'Grill',servings:'2',ingredients:['2 steaks, 10–12 oz each','1 tbsp neutral oil','1 tsp kosher salt','1/2 tsp black pepper','3 tbsp softened butter','1 garlic clove, minced','1 tbsp chopped parsley'],method:['Preheat grill for high direct heat and clean the grates.','Pat steaks dry, oil lightly and season with salt and pepper.','Grill, turning as needed, until desired doneness; verify with an instant-read thermometer.','Mix butter, garlic and parsley.','Rest steaks 5–10 minutes.','Top with herb butter and slice across the grain.']},
 {title:'Grilled Honey-Lime Chicken',tag:'Grill Master',time:'35 min',note:'Juicy grilled chicken with a bright honey-lime glaze.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Grill',servings:'4',ingredients:['2 lb boneless chicken thighs','2 tbsp olive oil','2 tbsp lime juice','1 tbsp honey','2 garlic cloves, minced','1 tsp smoked paprika','salt and black pepper'],method:['Whisk oil, lime, honey, garlic and paprika.','Coat chicken and refrigerate 20 minutes.','Preheat grill to medium-high and oil the grates.','Grill chicken, turning once or twice, until browned and 165°F internally.','Rest 5 minutes.','Brush with reserved separately prepared glaze and serve.']},
 {title:'Pan-Seared Salmon with Lemon Cream',tag:'Fancy Dining',time:'30 min',note:'Crisp salmon with a silky lemon cream sauce and restaurant-style finish.',mealType:'Dinner',diet:'Pescatarian',budget:'$$',category:'Fine Dining',servings:'2',ingredients:['2 salmon fillets','1 tbsp olive oil','1 tbsp butter','1 shallot, minced','1/2 cup broth','1/3 cup heavy cream','1 tbsp lemon juice','1 tbsp chopped parsley','salt and black pepper'],method:['Pat salmon dry and season.','Sear salmon in oil until deeply golden; turn and cook to preferred safe doneness, then rest.','Lower heat, add butter and shallot, and cook until soft.','Add broth and reduce by about half.','Stir in cream and lemon juice and simmer until lightly thickened.','Spoon sauce onto warm plates, add salmon and finish with parsley.']},
 {title:'Chef-Style Mushroom Risotto',tag:"Chef's Kitchen",time:'45 min',note:'Creamy risotto built gradually with stock, mushrooms and Parmesan.',mealType:'Dinner',diet:'Vegetarian',budget:'$$',category:'Chef Techniques',servings:'4',ingredients:['1 1/2 cups Arborio rice','8 oz mushrooms, sliced','5 cups warm vegetable stock','1 shallot, minced','2 tbsp butter','1 tbsp olive oil','1/2 cup grated Parmesan','salt and black pepper'],method:['Keep stock warm in a saucepan.','Brown mushrooms in oil and set aside.','Cook shallot in 1 tbsp butter, add rice and toast for 2 minutes.','Add warm stock a ladle at a time, stirring and allowing each addition to absorb.','When rice is creamy and al dente, fold in mushrooms, remaining butter and Parmesan.','Season and serve immediately on warm plates.']},
 {title:'Classic Butter Croissants — Home Method',tag:'Pastry Chef',time:'Overnight',note:'Laminated butter pastry with a crisp exterior and layered center.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Pastry',servings:'8',ingredients:['3 cups all-purpose flour','1/4 cup sugar','2 1/4 tsp instant yeast','1 1/4 tsp salt','3/4 cup cold milk','2 tbsp softened butter','1 cup cold unsalted butter for lamination','1 egg plus 1 tbsp water for egg wash'],method:['Mix flour, sugar, yeast, salt, milk and softened butter into a smooth dough; chill at least 1 hour.','Shape cold lamination butter into a flat square.','Enclose butter in dough, roll into a rectangle and complete a letter fold; chill 30 minutes.','Repeat rolling, folding and chilling two more times.','Roll dough, cut triangles, shape croissants and proof until visibly puffy.','Brush with egg wash and bake at 400°F until deeply golden, about 18–22 minutes.']},
 {title:'Chocolate Ganache Tart',tag:'Pastry Chef',time:'2 hr',note:'Dark chocolate ganache in a crisp cookie crust for an elegant dessert.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Desserts',servings:'8',ingredients:['2 cups chocolate cookie crumbs','6 tbsp melted butter','10 oz dark chocolate, chopped','1 cup heavy cream','2 tbsp butter','pinch of salt','berries for garnish'],method:['Heat oven to 350°F.','Mix crumbs with melted butter, press into a tart pan and bake 10 minutes; cool.','Place chopped chocolate in a heatproof bowl.','Heat cream until steaming, pour over chocolate and stand 2 minutes.','Stir smooth with butter and salt, pour into crust and chill until set.','Garnish with berries and slice with a warm dry knife.']},
 {title:'Southern-Style Smothered Chicken',tag:'Everyday Mom',time:'50 min',note:'Comfort-food chicken with onions and savory pan gravy.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Southern',servings:'4',ingredients:['4 chicken thighs','1 tsp paprika','salt and black pepper','2 tbsp flour plus 2 tbsp for gravy','2 tbsp oil','1 onion, sliced','2 cups chicken broth','1/2 cup milk'],method:['Season chicken and dust lightly with flour.','Brown chicken in oil on both sides and remove.','Cook onion until softened.','Stir in 2 tbsp flour and cook for 1 minute.','Whisk in broth and milk, return chicken, cover and simmer until chicken reaches 165°F.','Adjust seasoning and serve with the onion gravy.']},
 {title:'Berry Mascarpone Parfaits',tag:'Fancy Dining Dessert',time:'15 min',note:'A fast plated dessert with berries, mascarpone cream and crisp crumbs.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Desserts',servings:'4',ingredients:['2 cups mixed berries','8 oz mascarpone','1/2 cup heavy cream','3 tbsp powdered sugar','1 tsp vanilla','1 cup crushed butter cookies'],method:['Whip cream with powdered sugar and vanilla to soft peaks.','Fold mascarpone into whipped cream until smooth.','Spoon cookie crumbs into glasses.','Layer mascarpone cream and berries over crumbs.','Repeat layers and chill briefly.','Finish with fresh berries just before serving.']},
  {title:'Sheet-Pan Sausage, Peppers & Potatoes',tag:'Everyday Mom',time:'40 min',note:'Low-cleanup family dinner with roasted sausage, peppers and potatoes.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Family Meals',servings:'4',ingredients:['1 lb smoked sausage, sliced','1 1/2 lb potatoes, cubed','2 bell peppers, sliced','1 onion, sliced','2 tbsp olive oil','1 tsp Italian seasoning','salt and black pepper'],method:['Heat oven to 425°F.','Toss potatoes with half the oil and seasoning and roast 15 minutes.','Add sausage, peppers and onion with remaining oil.','Spread everything in one layer.','Roast 18–22 minutes more until vegetables are tender and sausage is browned.','Taste, adjust seasoning and serve hot.']},
 {title:'Weeknight Beef Taco Bowls',tag:'Everyday Mom',time:'25 min',note:'Fast customizable bowls with seasoned beef, rice and fresh toppings.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Family Meals',servings:'4',ingredients:['1 lb ground beef','2 cups cooked rice','1 tbsp chili powder','1 tsp cumin','1/2 tsp garlic powder','1 cup salsa','1 cup shredded lettuce','1 cup shredded cheese','1 tomato, diced'],method:['Brown beef in a skillet and drain excess fat.','Add chili powder, cumin, garlic powder and 1/3 cup water; simmer 3–4 minutes.','Warm the rice.','Divide rice among four bowls and add seasoned beef.','Top with salsa, lettuce, cheese and tomato.','Serve remaining toppings at the table for easy customization.']},
 {title:'Grill Master BBQ Burgers',tag:'Grill Master',time:'30 min',note:'Juicy grilled burgers with barbecue glaze and melted cheddar.',mealType:'Dinner',diet:'No restriction',budget:'$',category:'Grill',servings:'4',ingredients:['1 1/2 lb ground beef','1 tsp kosher salt','1/2 tsp black pepper','1/2 cup barbecue sauce','4 slices cheddar','4 burger buns','lettuce and tomato'],method:['Preheat grill to medium-high.','Form beef into four patties slightly wider than the buns and season both sides.','Grill until browned, flipping once, and cook ground beef to 160°F.','Brush with barbecue sauce during the final minutes and add cheese.','Toast buns briefly on the grill.','Assemble with lettuce, tomato and additional sauce.']},
 {title:'Grilled Lemon-Garlic Shrimp Skewers',tag:'Grill Master',time:'25 min',note:'Fast smoky shrimp skewers with lemon, garlic and parsley.',mealType:'Dinner',diet:'Pescatarian',budget:'$$',category:'Grill',servings:'4',ingredients:['1 1/2 lb large shrimp, peeled and deveined','2 tbsp olive oil','3 garlic cloves, minced','1 lemon, zest and juice','1 tsp paprika','2 tbsp chopped parsley','salt and black pepper'],method:['Preheat grill to medium-high.','Toss shrimp with oil, garlic, lemon zest, paprika, salt and pepper.','Thread shrimp onto skewers.','Grill about 2–3 minutes per side until opaque and just cooked through.','Remove from heat and add lemon juice.','Finish with parsley and serve immediately.']},
 {title:'Filet Mignon with Shallot Pan Sauce',tag:'Fancy Dining',time:'35 min',note:'Steakhouse-style filet with a glossy shallot reduction.',mealType:'Dinner',diet:'No restriction',budget:'$$$',category:'Fine Dining',servings:'2',ingredients:['2 filet mignon steaks','1 tbsp neutral oil','1 tbsp butter','1 shallot, minced','1/2 cup beef broth','1 tsp Dijon mustard','salt and black pepper'],method:['Pat steaks dry and season generously.','Sear in a hot heavy skillet with oil, turning to brown evenly; finish to desired doneness and rest.','Lower heat and add butter and shallot to the same pan.','Add broth and scrape up browned bits; reduce until lightly syrupy.','Whisk in Dijon and taste for seasoning.','Slice or serve steaks whole with sauce spooned around the plate.']},
 {title:'Seared Scallops with Cauliflower Purée',tag:'Fancy Dining',time:'35 min',note:'Golden scallops over silky cauliflower purée with lemon-butter finish.',mealType:'Dinner',diet:'Pescatarian',budget:'$$$',category:'Fine Dining',servings:'2',ingredients:['10 large sea scallops','1 small cauliflower, cut into florets','1 cup milk','2 tbsp butter','1 tbsp neutral oil','1 tsp lemon juice','salt and black pepper'],method:['Simmer cauliflower in milk with a pinch of salt until very tender.','Drain, reserving some milk, and blend cauliflower with 1 tbsp butter until silky.','Pat scallops very dry and season.','Heat oil in a skillet until shimmering and sear scallops without moving until deeply golden; turn and finish briefly.','Stir lemon juice and remaining butter into the warm purée.','Spoon purée onto plates and arrange scallops on top.']},
 {title:'Chef-Style Chicken Piccata',tag:"Chef's Kitchen",time:'35 min',note:'Pan-seared chicken with lemon, capers and a glossy butter sauce.',mealType:'Dinner',diet:'No restriction',budget:'$$',category:'Chef Techniques',servings:'4',ingredients:['4 thin chicken cutlets','1/3 cup flour','2 tbsp olive oil','1 cup chicken broth','1/4 cup lemon juice','2 tbsp capers','3 tbsp cold butter','salt and black pepper'],method:['Season chicken and dust lightly with flour.','Sear chicken in olive oil until golden and cooked to 165°F; remove.','Add broth and lemon juice to the pan and scrape up browned bits.','Simmer until reduced by roughly one-third.','Stir in capers, then whisk in cold butter off heat.','Return chicken briefly to coat, then plate with sauce.']},
 {title:'Chef-Style Roasted Vegetable Orzo',tag:"Chef's Kitchen",time:'40 min',note:'Roasted vegetables folded through lemony orzo with herbs and Parmesan.',mealType:'Dinner',diet:'Vegetarian',budget:'$',category:'Chef Techniques',servings:'4',ingredients:['12 oz orzo','1 zucchini, diced','1 bell pepper, diced','1 pint cherry tomatoes','3 tbsp olive oil','1 lemon','1/2 cup grated Parmesan','1/4 cup chopped basil','salt and black pepper'],method:['Heat oven to 425°F.','Toss vegetables with 2 tbsp oil, salt and pepper and roast until browned.','Cook orzo until al dente; reserve 1/2 cup cooking water and drain.','Toss orzo with roasted vegetables, remaining oil, lemon zest and juice.','Fold in Parmesan and basil, loosening with reserved water as needed.','Season and serve warm.']},
 {title:'Vanilla Bean Crème Brûlée',tag:'Pastry Chef',time:'4 hr',note:'Silky baked custard under a thin crackling caramelized sugar crust.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Desserts',servings:'4',ingredients:['2 cups heavy cream','1 tsp vanilla bean paste','5 egg yolks','1/3 cup sugar plus 4 tsp for topping','pinch of salt'],method:['Heat oven to 325°F and place four ramekins in a roasting pan.','Warm cream and vanilla until steaming but not boiling.','Whisk yolks, 1/3 cup sugar and salt; slowly whisk in warm cream.','Strain custard into ramekins and add hot water halfway up their sides.','Bake until edges are set but centers still wobble, about 30–40 minutes; chill at least 3 hours.','Sprinkle each with 1 tsp sugar and caramelize with a kitchen torch just before serving.']},
 {title:'Classic Apple Galette',tag:'Pastry Chef',time:'1 hr 20 min',note:'Rustic flaky pastry folded around cinnamon apples.',mealType:'Dessert',diet:'Vegetarian',budget:'$',category:'Pastry',servings:'8',ingredients:['1 pie dough round','3 apples, thinly sliced','1/4 cup sugar','1 tbsp flour','1 tsp cinnamon','1 tbsp lemon juice','1 egg beaten with 1 tsp water','1 tbsp coarse sugar'],method:['Heat oven to 400°F and line a sheet pan with parchment.','Toss apples with sugar, flour, cinnamon and lemon.','Roll dough into a rough 12-inch circle and arrange apples in the center, leaving a 2-inch border.','Fold border over the fruit, pleating as needed.','Brush pastry with egg wash, sprinkle with coarse sugar and bake 35–45 minutes until deeply golden.','Cool at least 15 minutes before slicing.']},
 {title:'Chocolate Lava Cakes',tag:'Pastry Chef',time:'25 min',note:'Individual chocolate cakes with warm molten centers.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Desserts',servings:'4',ingredients:['6 oz bittersweet chocolate','1/2 cup unsalted butter','2 eggs','2 egg yolks','1/4 cup sugar','2 tbsp flour','pinch of salt','butter and cocoa for ramekins'],method:['Heat oven to 425°F; butter four ramekins and dust with cocoa.','Melt chocolate and butter together until smooth.','Whisk eggs, yolks, sugar and salt until slightly thickened.','Fold chocolate mixture into eggs, then fold in flour.','Divide among ramekins and bake 10–12 minutes until edges are set but centers remain soft.','Rest 1 minute, invert carefully and serve immediately.']},
 {title:'Sunday Baked Mac & Cheese',tag:'Everyday Mom',time:'55 min',note:'Creamy baked macaroni with a golden cheddar top for family dinners.',mealType:'Dinner',diet:'Vegetarian',budget:'$',category:'Southern',servings:'6',ingredients:['1 lb elbow macaroni','4 tbsp butter','4 tbsp flour','3 cups milk','3 cups shredded cheddar','1 tsp mustard','1/2 tsp paprika','salt and black pepper'],method:['Heat oven to 375°F and cook macaroni just shy of al dente.','Melt butter, whisk in flour and cook 1 minute.','Gradually whisk in milk and simmer until thickened.','Stir in 2 1/2 cups cheese, mustard, paprika, salt and pepper.','Combine sauce with macaroni, transfer to a baking dish and top with remaining cheese.','Bake 20–25 minutes until bubbling and golden.']},

];

const featured: Recipe[] = [...featuredBase, ...valueRecipes, ...styleRecipeVault];


const basicGroceryCategories: Record<string,string[]> = {
  'Fresh Produce': ['apples','bananas','oranges','lemons','limes','berries','grapes','avocados','tomatoes','lettuce or greens','spinach','broccoli','carrots','celery','bell peppers','onions','garlic','potatoes','sweet potatoes','mushrooms','cucumbers','fresh herbs'],
  'Meat & Poultry': ['chicken breasts','chicken thighs','ground beef','steak','pork chops','bacon','sausage','ground turkey'],
  'Seafood': ['salmon','white fish','shrimp','tuna','crab','scallops'],
  'Dairy & Eggs': ['milk','eggs','butter','cheddar cheese','parmesan','mozzarella','cream cheese','yogurt','heavy cream','sour cream'],
  'Bread & Bakery': ['sandwich bread','buns or rolls','tortillas','bagels','English muffins'],
  'Rice, Pasta & Grains': ['white rice','brown rice','pasta','oatmeal','quinoa','grits','breadcrumbs'],
  'Canned & Jarred': ['canned beans','canned tomatoes','tomato sauce','tuna cans','broth or stock','peanut butter','pasta sauce','salsa'],
  'Frozen Foods': ['frozen vegetables','frozen fruit','frozen fries or potatoes','frozen pizza','ice cream'],
  'Breakfast': ['cereal','pancake or waffle mix','syrup','breakfast bars','coffee','tea'],
  'Baking': ['all-purpose flour','sugar','brown sugar','powdered sugar','baking powder','baking soda','vanilla extract','chocolate chips','cocoa powder'],
  'Oils, Sauces & Condiments': ['olive oil','cooking oil','vinegar','ketchup','mustard','mayonnaise','hot sauce','soy sauce','barbecue sauce','salad dressing'],
  'Spices & Seasonings': ['salt','black pepper','garlic powder','onion powder','paprika','chili powder','Italian seasoning','cinnamon','seasoning salt'],
  'Snacks': ['chips','crackers','popcorn','nuts','granola bars','cookies'],
  'Drinks': ['bottled water','juice','sparkling water','soda'],
  'Household Kitchen Needs': ['paper towels','aluminum foil','plastic wrap','storage bags','dish soap','dishwasher detergent','trash bags']
};
const basicGroceryNeeds = Object.values(basicGroceryCategories).flat();

const starterLists = {
  'Date Night': ['salmon fillets', 'jumbo scallops', 'lemons', 'fresh herbs', 'baby potatoes', 'asparagus', 'butter'],
  'Seafood Night': ['white fish', 'lump crabmeat', 'shrimp', 'garlic', 'lemons', 'parsley', 'rice'],
  'Family Dinner': ['chicken breasts', 'pasta', 'broccoli', 'parmesan', 'cream', 'garlic', 'salad greens'],
};

const cookingStyles = [
  {name:'Fancy Dining', desc:'Restaurant-style plating, elevated sauces and special-occasion presentation.', style:'Fine Dining', occasion:'Elegant Dinner'},
  {name:'Grill Master', desc:'Fire-kissed meats, seafood, vegetables, burgers and backyard favorites.', style:'Grill Master', occasion:'Grill Night'},
  {name:'Everyday Mom Cooking', desc:'Comforting, practical family meals with familiar ingredients and simpler cleanup.', style:'Everyday Family', occasion:'Family Dinner'},
  {name:"Chef's Kitchen", desc:'Technique-driven dishes with composed sides, sauces and polished presentation.', style:"Chef's choice", occasion:'Chef Night'},
  {name:"Pastry Chef", desc:'Cakes, pies, tarts, cookies, pastries and elegant plated desserts.', style:'Elegant Dessert', occasion:'Dessert Night'}
];

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

// Build marker: repaired-source-20260923-0045
export default function FancyEatz() {
  const [tab, setTab] = useState('home');
  const [showMembership, setShowMembership] = useState(false);
  const [membershipNotice, setMembershipNotice] = useState('');
  const [earlyEmail, setEarlyEmail] = useState('');
  const [earlyJoined, setEarlyJoined] = useState(false);
  const [earlySubmitting, setEarlySubmitting] = useState(false);
  const [earlyError, setEarlyError] = useState('');
  const [mobileMenu, setMobileMenu] = useState('');
  const [dashboardLeads, setDashboardLeads] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [ownerUnlocked, setOwnerUnlocked] = useState(()=>sessionStorage.getItem('fancy-eatz-owner')==='yes');
  const [ownerCode, setOwnerCode] = useState('');
  const premiumTabs = new Set(['pantry','photo','leftovers','ideas','styles','experience','planner','grocery','basics','grill','desserts','drinks','recipes','favorites']);
  const paymentsLive = false; // QA/open-access mode until billing is intentionally launched.
  const openMembership = (message='Start your 7-day Fancy Eatz Premium trial to unlock this feature.') => { setMembershipNotice(message); setShowMembership(true); };

  const [tabHistory, setTabHistory] = useState<string[]>([]);
  const [drinkSearch, setDrinkSearch] = useState('');
  const [drinkCategory, setDrinkCategory] = useState('All');
  const [selectedDrink, setSelectedDrink] = useState<(typeof drinks)[number] | null>(null);
  const [drinkPantryOnly, setDrinkPantryOnly] = useState(false);
  const [experienceDrinkMode, setExperienceDrinkMode] = useState('Both');

  async function loadDashboard() {
    setDashboardLoading(true);
    try {
      const response=await fetch('/api/early-access-stats',{method:'POST',headers:{'content-type':'application/json','x-owner-code':'FANCY2026'},body:'{}'});
      if(!response.ok) throw new Error('dashboard');
      const data=await response.json(); setDashboardLeads(Array.isArray(data.leads)?data.leads:[]);
    } catch { setDashboardLeads([]); }
    finally { setDashboardLoading(false); }
  }

  async function joinEarlyAccess() {
    const email=earlyEmail.trim().toLowerCase();
    if(!email||!email.includes('@')||!email.split('@')[1]?.includes('.')){setMembershipNotice('Enter a valid email to join early access.');setEarlyError('Please enter a valid email address first.');return;}
    setEarlySubmitting(true);setEarlyError('');setMembershipNotice('Saving your spot…');
    try{
      const response=await fetch('/api/early-access',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email,source:'website'})});
      if(!response.ok) throw new Error('signup');
      setEarlyJoined(true);setMembershipNotice('');setShowMembership(false);window.location.hash='early-access-confirmed';setTimeout(()=>window.scrollTo({top:0,behavior:'smooth'}),50);
    }catch{setMembershipNotice('Signup did not save. Please try again.');setEarlyError('We could not save your signup. Please try again.');}
    finally{setEarlySubmitting(false);}
  }

  function navigate(nextTab: string) {
    if (nextTab === 'dashboard') { setTabHistory(history => [...history, tab]); setTab('dashboard'); setMobileMenu(''); setTimeout(loadDashboard, 0); window.scrollTo({top:0,behavior:'smooth'}); return; }
    if (paymentsLive && premiumTabs.has(nextTab) && localStorage.getItem('fancy-eatz-member') !== 'active') {
      openMembership();
      return;
    }
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
  const [household, setHousehold] = useState(()=>localStorage.getItem('fancy-household')||'2');
  const [skill, setSkill] = useState(()=>localStorage.getItem('fancy-skill')||'Comfortable');
  const [appliance, setAppliance] = useState(()=>localStorage.getItem('fancy-appliance')||'Any');
  const [profileDiet, setProfileDiet] = useState(()=>localStorage.getItem('fancy-diet')||'No restriction');
  const [allergies, setAllergies] = useState(()=>localStorage.getItem('fancy-allergies')||'None');
  const [dayMeal, setDayMeal] = useState(()=>localStorage.getItem('fancy-day-meal')||'Dinner');
  const [onboarded, setOnboarded] = useState(()=>localStorage.getItem('fancy-onboarded')==='yes');
  const [foodMood, setFoodMood] = useState(()=>localStorage.getItem('fancy-food-mood')||'A little of everything');
  const [weeklyGoal, setWeeklyGoal] = useState(()=>localStorage.getItem('fancy-weekly-goal')||'Make dinner easier');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [meal, setMeal] = useState<Meal | null>(null);
  const [mealChoices, setMealChoices] = useState<MealChoice[]>([]);
  const [mixSelections, setMixSelections] = useState<Record<string,string>>({});
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [experienceLoading, setExperienceLoading] = useState(false);
  const [experienceOccasion, setExperienceOccasion] = useState('Date Night at Home');
  const [experienceGuests, setExperienceGuests] = useState('2');
  const [experienceBudget, setExperienceBudget] = useState('$75');
  const [experienceMinutes, setExperienceMinutes] = useState('90');
  const [photoPreview, setPhotoPreview] = useState('');
  const [photoBusy, setPhotoBusy] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const [photoItems, setPhotoItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [mealError, setMealError] = useState('');
  const [planError, setPlanError] = useState('');
  const [listName, setListName] = useState('Date Night');
  const [grocery, setGrocery] = useState<string[]>(starterLists['Date Night']);
  const [checked, setChecked] = useState<string[]>([]);
  const [newItem, setNewItem] = useState('');
  const [grocerySearch, setGrocerySearch] = useState('');
  const [groceryMode, setGroceryMode] = useState<'list'|'basics'>('basics');
  const [search, setSearch] = useState('');
  const [recipeType, setRecipeType] = useState('All');
  const [cookStyleFilter, setCookStyleFilter] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showSourceLibrary, setShowSourceLibrary] = useState(false);
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>(()=>{try{return JSON.parse(localStorage.getItem('fancy-recent-recipes')||'[]') as Recipe[]}catch{return []}});
  type CookedMeal = { title:string; description:string; ingredients:string[]; steps:string[]; plating?:string; cookedAt:string; source:'Pantry Chef'|'Recipe Vault'; image?:string; time?:string; budget?:string };
  const [cookedHistory, setCookedHistory] = useState<CookedMeal[]>(()=>{try{return JSON.parse(localStorage.getItem('fancy-cooked-history')||'[]') as CookedMeal[]}catch{return []}});
  const [recipeLetter, setRecipeLetter] = useState('All');
  const [favorites, setFavorites] = useState<Meal[]>(() => {
    try { return JSON.parse(localStorage.getItem('fancy-eatz-favorites') || '[]') as Meal[]; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('fancy-eatz-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('fancy-household',household); localStorage.setItem('fancy-skill',skill); localStorage.setItem('fancy-appliance',appliance); localStorage.setItem('fancy-diet',profileDiet); localStorage.setItem('fancy-allergies',allergies); localStorage.setItem('fancy-day-meal',dayMeal); localStorage.setItem('fancy-food-mood',foodMood); localStorage.setItem('fancy-weekly-goal',weeklyGoal);
  }, [household,skill,appliance,profileDiet,allergies,dayMeal,foodMood,weeklyGoal]);


  const tasteSignals = useMemo(() => {
    const words=[...cookedHistory.slice(0,12).map(x=>x.title+' '+x.description),...favorites.slice(0,12).map(x=>x.title+' '+x.description)].join(' ').toLowerCase();
    const signals=[['Chicken',/chicken/],['Seafood',/salmon|shrimp|crab|fish|tuna|scallop/],['Pasta',/pasta|spaghetti|linguine|noodle|macaroni/],['Comfort',/casserole|creamy|comfort|potato|cheese/],['Fresh',/salad|vegetable|greens|fresh|citrus/],['Grill',/grill|steak|burger|barbecue|bbq/]] as const;
    return signals.filter(([,re])=>re.test(words)).map(([name])=>name).slice(0,3);
  },[cookedHistory,favorites]);

  const recommendedRecipes = useMemo(() => {
    if(!cookedHistory.length&&!favorites.length) return [] as Recipe[];
    const corpus=[...cookedHistory,...favorites].map(x=>(x.title+' '+x.description+' '+x.ingredients.join(' ')).toLowerCase()).join(' ');
    const tokens=Array.from(new Set(corpus.match(/[a-z]{4,}/g)||[])).filter(x=>!['with','this','that','from','your','serve','fancy','eatz'].includes(x));
    return featured.filter(r=>r.ingredients?.length).map(r=>({r,score:tokens.reduce((n,t)=>n+((r.title+' '+r.note+' '+r.ingredients.join(' ')).toLowerCase().includes(t)?1:0),0)})).filter(x=>x.score>0).sort((a,b)=>b.score-a.score).slice(0,5).map(x=>x.r);
  },[cookedHistory,favorites]);

  const filteredRecipes = useMemo(() => featured.filter(r => {
    const q = search.toLowerCase();
    const styleText=(r.title+' '+r.tag+' '+r.note+' '+r.category+' '+r.mealType).toLowerCase();
    const styleMatch = cookStyleFilter === 'All' || r.style === cookStyleFilter ||
      (!r.style && cookStyleFilter === 'Fancy Dining' && /crab|scallop|salmon|risotto|bisque|benedict|artichoke/.test(styleText)) ||
      (!r.style && cookStyleFilter === 'Grill Master' && /grill|burger|steak|salmon|fish|shrimp|tuna/.test(styleText)) ||
      (!r.style && cookStyleFilter === 'Everyday Mom' && /casserole|pasta|soup|chowder|sandwich|burger|family|chicken/.test(styleText)) ||
      (!r.style && cookStyleFilter === "Chef's Kitchen" && /crab|seafood|sauce|risotto|bisque|appetizer|brunch/.test(styleText)) ||
      (!r.style && cookStyleFilter === 'Pastry Chef' && /dessert|cake|pie|tart|cookie|chocolate|sweet|pastry/.test(styleText));
    return styleMatch && (recipeType === 'All' || r.mealType === recipeType || r.category === recipeType) &&
      (recipeLetter === 'All' || r.title.toUpperCase().startsWith(recipeLetter)) &&
      (!q || (r.title + ' ' + r.tag + ' ' + r.note).toLowerCase().includes(q));
  }).sort((a, b) => a.title.localeCompare(b.title)), [search, recipeType, recipeLetter, cookStyleFilter]);

  const openRecipe=(r:Recipe)=>{ setSelectedRecipe(r); setRecentRecipes(prev=>{const next=[r,...prev.filter(x=>x.title!==r.title)].slice(0,8);localStorage.setItem('fancy-recent-recipes',JSON.stringify(next));return next}); navigate('recipes'); setTimeout(()=>document.getElementById('full-recipe')?.scrollIntoView({behavior:'smooth',block:'start'}),80); };

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

  const mixLibrary = useMemo<MixComponent[]>(() => {
    const out: MixComponent[] = [];
    const seen = new Set<string>();
    const add = (name:string, kind:MixComponent['kind'], source:string) => {
      const clean=name.trim(); const key=kind+'|'+clean.toLowerCase();
      if(clean && !seen.has(key)){ seen.add(key); out.push({name:clean,kind,source}); }
    };
    featured.filter(r=>r.ingredients?.length && r.method?.length).forEach(r=>{
      add(r.title,'Entrée',r.title);
      const text=[...(r.ingredients||[]),r.note,r.title].join(' ').toLowerCase();
      if(/lemon|lime|citrus/.test(text)) add('Bright Citrus Finish','Sauce',r.title);
      if(/honey|mustard/.test(text)) add('Honey Mustard Glaze','Sauce',r.title);
      if(/pesto|basil/.test(text)) add('Basil Pesto Finish','Sauce',r.title);
      if(/garlic/.test(text)) add('Roasted Garlic Finish','Sauce',r.title);
      if(/potato/.test(text)) add('Herbed Potatoes','Starch',r.title);
      if(/rice|risotto/.test(text)) add('Seasoned Rice / Risotto','Starch',r.title);
      if(/cabbage|kale|watercress|salad/.test(text)) add('Fresh Greens','Vegetable',r.title);
      if(/corn|sweetcorn/.test(text)) add('Sweet Corn','Vegetable',r.title);
      if(/tomato/.test(text)) add('Tomato Herb Side','Side',r.title);
    });
    ['Chef Plating','Fresh Herb Garnish','Lemon Wedge + Microgreens','Fancy Eatz Restaurant Finish'].forEach(x=>add(x,'Finish','Fancy Eatz'));
    return out;
  }, []);

  const mixKinds: MixComponent['kind'][] = ['Entrée','Sauce','Vegetable','Starch','Side','Finish'];

  function applyMix() {
    if(!meal) return;
    const chosen=Object.entries(mixSelections).filter(([,v])=>v);
    if(!chosen.length) return;
    const description=chosen.map(([k,v])=>`${k}: ${v}`).join(' · ');
    setMeal({...meal,title:`My Fancy Eatz: ${mixSelections['Entrée'] || meal.title}`,description:`${meal.description} Customized with ${description}.`,plating:mixSelections['Finish'] || meal.plating});
  }

  const requestSettings = { occasion, servings, time, style, mealType, diet, budget, allergies, household, skill, appliance };

  function openSpecialGenerator(kind: 'grill' | 'dessert') {
    if (kind === 'grill') {
      setMealType('Dinner');
      setStyle('Grill Master');
      setOccasion('Backyard Grill Night');
    } else {
      setMealType('Dessert');
      setStyle('Elegant Dessert');
      setOccasion('Fancy Sweet Finish');
    }
    setPantry('');
    navigate('pantry');
  }

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
      const primary = r.data.meal as Meal;
      setMeal(primary);
      const avoidPattern:Record<string,RegExp>={Peanuts:/peanut/i,'Tree nuts':/almond|walnut|pecan|cashew|pistachio|hazelnut|tree nut/i,Shellfish:/shrimp|crab|lobster|clam|mussel|oyster|scallop|shellfish/i,Dairy:/milk|cream|cheese|butter|yogurt|dairy/i,Eggs:/\begg(s)?\b/i,Gluten:/wheat|flour|bread|pasta|noodle|cracker|barley|rye|gluten/i};
      const avoidRule=avoidPattern[allergies];
      const sourceMatches = featured.filter(x => x.ingredients?.length && x.method?.length && (!avoidRule || !avoidRule.test([x.title,...(x.ingredients||[])].join(' ')))).slice(0, 34).map(x => ({
        title:x.title, description:x.note, ingredients:x.ingredients || [], steps:x.method || [], plating:'Finish with a polished Fancy Eatz presentation.', missing:[], estimatedCost:x.budget, category:x.category || x.mealType
      }));
      setMealChoices([{...primary, category:'Chef Pick'}, ...sourceMatches].slice(0,35));
      navigate('pantry');
    } catch {
      const pantryItems = (pantryForRequest || '').split(',').map(x=>x.trim()).filter(Boolean);
      const sourceRecipe = featured.find(r => r.ingredients?.length && r.method?.length && pantryItems.some(item => {
        const key=item.toLowerCase().replace(/[^a-z ]/g,'').trim();
        return key.length > 2 && ([r.title,r.tag,r.note,...(r.ingredients||[])].join(' ').toLowerCase().includes(key));
      }));
      if (sourceRecipe) {
        const verifiedMeal: Meal = {
          title: sourceRecipe.title,
          description: sourceRecipe.note,
          ingredients: sourceRecipe.ingredients || [],
          steps: sourceRecipe.method || [],
          plating: 'Serve neatly using the finished dish as the centerpiece; garnish only with ingredients appropriate to the recipe.',
          missing: [],
          estimatedCost: sourceRecipe.budget
        };
        setMeal(verifiedMeal);
        setMealChoices(featured.filter(x=>x.ingredients?.length && x.method?.length).slice(0,35).map(x=>({title:x.title,description:x.note,ingredients:x.ingredients||[],steps:x.method||[],plating:'Serve neatly and finish according to the recipe.',missing:[],estimatedCost:x.budget,category:x.category||x.mealType})));
        setMealError('AI generation was unavailable, so Fancy Eatz loaded a complete cookbook recipe instead of showing incomplete directions.');
      } else {
        setMeal(null);
        setMealChoices([]);
        setMealError('I could not create a complete recipe with measured ingredients and real cooking directions. Please try Generate Upscale Meal again or choose a complete recipe from the Cookbook.');
      }
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
    setPhotoError('');
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
      else setPhotoError(r.data.message || 'No clear food ingredients were detected. Try a closer, brighter photo or enter ingredients manually.');
    } catch (error:any) {
      setPhotoItems([]);
      setPhotoError(error?.data?.message || error?.message || 'Photo recognition is temporarily unavailable. You can still type or paste ingredients below.');
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
        ingredients: safe.items.map((x, i) => i === 0 ? `1 main portion ${x}` : `1 portion ${x}`),
        steps: [
          `Prep all ingredients for the ${experienceOccasion.toLowerCase()} menu before cooking; wash produce, measure ingredients, and preheat the oven or pan as needed.`,
          `Prepare the appetizer first and hold it for serving.`,
          `Cook the longest-cooking side until tender, then keep warm.`,
          `Season and cook the ${safe.primary} until properly cooked through, then rest briefly before plating.`,
          `Finish the remaining side dishes and taste for seasoning.`,
          `Assemble the dessert and chill or hold until the main course is finished.`,
          `Plate the entrée with the sides, add the final garnish, and serve the appetizer, main course, and dessert in sequence.`
        ],
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

  function markCooked(item:CookedMeal) {
    setCookedHistory(prev=>{
      const next=[{...item,cookedAt:new Date().toISOString()},...prev.filter(x=>x.title!==item.title)].slice(0,20);
      localStorage.setItem('fancy-cooked-history',JSON.stringify(next));
      return next;
    });
  }

  function cookAgain(item:CookedMeal) {
    const saved:Meal={title:item.title,description:item.description,ingredients:item.ingredients,steps:item.steps,plating:item.plating||'Serve with a Fancy Eatz finish.',missing:[]};
    setMeal(saved); setMealChoices([saved]); navigate('pantry');
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
          <div className="nav-dropdown"><button className={mobileMenu==='cook'?'nav-trigger active':'nav-trigger'} onClick={()=>setMobileMenu(v=>v==='cook'?'':'cook')}>Cook ▾</button>{mobileMenu==='cook'&&<div className="nav-menu"><button onClick={()=>{setMobileMenu('');navigate('pantry')}}>Pantry Chef</button><button onClick={()=>{setMobileMenu('');navigate('photo')}}>Photo My Fridge</button><button onClick={()=>{setMobileMenu('');navigate('leftovers')}}>Leftovers → Luxury</button><button onClick={()=>{setMobileMenu('');navigate('ideas')}}>Meal Ideas</button><button onClick={()=>{setMobileMenu('');navigate('styles')}}>Cooking Styles</button></div>}</div>
          <div className="nav-dropdown"><button className={mobileMenu==='explore'?'nav-trigger active':'nav-trigger'} onClick={()=>setMobileMenu(v=>v==='explore'?'':'explore')}>Explore ▾</button>{mobileMenu==='explore'&&<div className="nav-menu"><button onClick={()=>{setMobileMenu('');navigate('experience')}}>Dining Experience</button><button onClick={()=>{setMobileMenu('');navigate('planner')}}>Weekly Planner</button><button onClick={()=>{setMobileMenu('');navigate('grocery')}}>Grocery Lists</button><button onClick={()=>{setMobileMenu('');navigate('grill')}}>Grill Master</button><button onClick={()=>{setMobileMenu('');navigate('desserts')}}>Desserts</button><button onClick={()=>{setMobileMenu('');navigate('drinks')}}>Drinks</button></div>}</div>
          <div className="nav-dropdown"><button className={mobileMenu==='cookbook'?'nav-trigger active':'nav-trigger'} onClick={()=>setMobileMenu(v=>v==='cookbook'?'':'cookbook')}>Cookbook ▾</button>{mobileMenu==='cookbook'&&<div className="nav-menu"><button onClick={()=>{setMobileMenu('');navigate('recipes')}}>A–Z Recipe Vault</button><button onClick={()=>{setMobileMenu('');navigate('favorites')}}>My Fancy Cookbook</button></div>}</div>
        </nav>
        <button className="membership-nav" onClick={()=>openMembership('Choose your Fancy Eatz Premium plan and start your 7-day trial.')}><Crown size={16}/> Get Early Access</button>
      </header>

      {tab !== 'home' && <div className="backbar">
        <button className="back-button" onClick={goBack} aria-label="Go back"><ArrowLeft size={18} /> Back</button>
      </div>}

      {earlyJoined && tab === 'home' && <section className="early-access-confirmation"><ShieldCheck size={30}/><div><p className="eyebrow">FOUNDING EARLY ACCESS</p><h2>You're on the Fancy Eatz list.</h2><p>Your spot is saved. You'll receive your 7-day Premium trial invitation when Fancy Eatz launches.</p></div></section>}

      {tab === 'home' && (
        <section className="home-showcase">
          
          <div className="home-hero">
            <div className="hero-copy">
              <p className="eyebrow">SMARTER HOME COOKING · MADE FOR EVERY KITCHEN</p>
              <h1>Make something good.<br/><em>With what you have.</em></h1>
              <p className="lede">From weeknight dinners to weekend hosting, Fancy Eatz turns the ingredients you already have into meals, plans and grocery lists built around you.</p>
              <div className="national-trust"><span><ShieldCheck size={15}/> Built for real households</span><span><Sparkles size={15}/> Personalized to your kitchen</span><span><CalendarDays size={15}/> Dinner through weekly planning</span></div>
              <div className="hero-early-access">
            <div className="hero-early-copy"><b>Be First to Cook with Fancy Eatz</b><span>Join early access for launch updates and your 7-day Premium trial invitation.</span></div>
            <div className="hero-early-form"><input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" autoComplete="email" value={earlyEmail} onChange={e=>{setEarlyEmail(e.target.value);setMembershipNotice('')}} onKeyDown={e=>{if(e.key==='Enter')joinEarlyAccess()}} placeholder="Enter your email address"/><button type="button" className="primary" disabled={earlySubmitting} onClick={joinEarlyAccess}>{earlySubmitting?'Joining…':'Join Early Access'}</button></div>
          </div>
          <div className="hero-actions"><button className="ghost" onClick={()=>document.getElementById('premium-preview')?.scrollIntoView({behavior:'smooth'})}>Explore Fancy Eatz ↓</button></div>
            </div>
            <div className="hero-food-photo" aria-label="Fancy Eatz plated salmon"><div><b>Good Food.<br/>Better Living.</b><span>Simple ingredients. Extraordinary meals.</span></div></div>
          </div>
          {!onboarded&&!showOnboarding&&<section className="onboarding-invite"><div><p className="eyebrow">PERSONALIZE FANCY EATZ</p><h2>Want better picks from the start?</h2><p>Answer a few quick kitchen questions and tailor the experience to your household.</p></div><button className="primary" onClick={()=>setShowOnboarding(true)}>Personalize My Kitchen →</button></section>}
          <section className="discover-strip"><div className="discover-head"><p className="eyebrow">DISCOVER YOUR NEXT MEAL</p><h2>What sounds good today?</h2></div><div className="discover-chips">
            <button onClick={()=>{setTime('30 minutes');navigate('ideas')}}>Under 30 Minutes</button>
            <button onClick={()=>{setOccasion('Family Dinner');navigate('ideas')}}>Family Favorites</button>
            <button onClick={()=>{setDiet('Vegetarian');navigate('ideas')}}>More Veggies</button>
            <button onClick={()=>{setBudget('$25');navigate('ideas')}}>Budget Friendly</button>
            <button onClick={()=>{setOccasion('Date Night at Home');navigate('ideas')}}>Date Night</button>
            <button onClick={()=>navigate('leftovers')}>Use My Leftovers</button>
          </div></section>
          <section className="premium-preview" id="premium-preview"><p className="eyebrow">ONE KITCHEN COMPANION</p><h2>From “what can I make?” to dinner on the table.</h2><p>Fancy Eatz brings meal inspiration, ingredient-first cooking, planning, grocery organization, drinks, desserts and entertaining tools into one polished experience.</p><div className="premium-preview-grid"><article><ChefHat/><b>Pantry Chef</b><span>Tell us what you have. Get complete meal possibilities.</span></article><article><Sparkles/><b>Photo My Fridge</b><span>Upload your kitchen photo and turn visible ingredients into ideas.</span></article><article><BookOpen/><b>Recipe Vault</b><span>Explore complete recipes, drinks, desserts and cooking styles.</span></article><article><CalendarDays/><b>Plan the Week</b><span>Build weekly meals and one organized grocery list.</span></article></div></section><div className="home-search-row">
            <label className="search-box"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search recipes (salmon, chicken, pasta, healthy...)" /><button onClick={()=>navigate('recipes')}>Search</button></label>
            <button className="ai-generator-callout" onClick={()=>navigate('pantry')}><ChefHat size={30}/><span><b>AI Meal Generator</b><small>Enter what you have and get 22–35 meal ideas</small></span><strong>Generate Meals →</strong></button>
          </div>
          {!onboarded&&showOnboarding&&<section className="onboarding-card"><div className="onboarding-copy"><p className="eyebrow">WELCOME TO FANCY EATZ</p><h2>Make your kitchen feel easier in under a minute.</h2><p>Tell us how you cook. We’ll use these choices to shape your starting experience on this device.</p></div><div className="onboarding-grid">
            <label>How many are you feeding?<select value={household} onChange={e=>{setHousehold(e.target.value);setServings(e.target.value==='6+'?'6':e.target.value)}}>{['1','2','3','4','5','6+'].map(x=><option key={x}>{x}</option>)}</select></label>
            <label>What sounds most like you?<select value={foodMood} onChange={e=>setFoodMood(e.target.value)}><option>A little of everything</option><option>Comfort food</option><option>Fresh & lighter</option><option>High-protein meals</option><option>Family favorites</option><option>Restaurant-style at home</option></select></label>
            <label>Eating style<select value={profileDiet} onChange={e=>{setProfileDiet(e.target.value);setDiet(e.target.value)}}><option>No restriction</option><option>Vegetarian</option><option>Vegan</option><option>Pescatarian</option></select></label>
            <label>Foods to avoid<select value={allergies} onChange={e=>setAllergies(e.target.value)}><option>None</option><option>Peanuts</option><option>Tree nuts</option><option>Shellfish</option><option>Dairy</option><option>Eggs</option><option>Gluten</option></select></label>
            <label>Cooking confidence<select value={skill} onChange={e=>setSkill(e.target.value)}><option>Keep it simple</option><option>Comfortable</option><option>Confident cook</option></select></label>
            <label>My main goal<select value={weeklyGoal} onChange={e=>setWeeklyGoal(e.target.value)}><option>Make dinner easier</option><option>Spend less on food</option><option>Use what I already have</option><option>Plan my whole week</option><option>Cook more at home</option><option>Make meals feel special</option></select></label>
          </div><div className="onboarding-actions"><button className="primary" onClick={()=>{localStorage.setItem('fancy-onboarded','yes');setOnboarded(true);setShowOnboarding(false);setMealType(dayMeal);setDiet(profileDiet)}}>Personalize My Kitchen →</button><button className="ghost" onClick={()=>{localStorage.setItem('fancy-onboarded','yes');setOnboarded(true);setShowOnboarding(false)}}>Skip for now</button></div><small className="onboarding-note">Food-avoid settings guide suggestions but are not a guarantee against allergens or cross-contact.</small></section>}
          <section className="tonight-card"><div className="tonight-copy"><p className="eyebrow">FOR YOU TODAY</p><h2>What are we making?</h2><p>Choose the moment and Fancy Eatz will start with the preferences you already saved.</p><div className="meal-switch">{['Breakfast','Lunch','Dinner'].map(x=><button key={x} className={dayMeal===x?'active':''} onClick={()=>{setDayMeal(x);setMealType(x)}}>{x}</button>)}</div></div><div className="tonight-action"><span>{profileDiet==='No restriction'?'Flexible':profileDiet} · {household} serving{household==='1'?'':'s'} · {foodMood}</span><h3>{dayMeal === 'Breakfast' ? 'Start the day with something worth making.' : dayMeal === 'Lunch' ? 'Make lunch feel less like an afterthought.' : 'Turn tonight into something good.'}</h3><button className="primary" onClick={()=>{setMealType(dayMeal);setDiet(profileDiet);setServings(household==='6+'?'6':household);navigate('pantry')}}>Find My {dayMeal} →</button></div></section>
          <section className="return-home"><div className="home-section-title"><div><p className="eyebrow">MADE FOR YOU</p><h2>Pick up where you left off.</h2></div></div><div className="return-grid">
            <button onClick={()=>navigate('favorites')}><span>♥</span><div><b>Saved Meals</b><small>{favorites.length ? favorites.length+' saved creation'+(favorites.length===1?'':'s') : 'Save meals you want to make again'}</small></div></button>
            <button onClick={()=>navigate('planner')}><span>7</span><div><b>This Week</b><small>{weeklyPlan ? 'Your weekly plan is ready to revisit' : 'Build a simple plan for the week ahead'}</small></div></button>
            <button onClick={()=>cookedHistory.length?cookAgain(cookedHistory[0]):navigate('pantry')}><span>↻</span><div><b>Cook Again</b><small>{cookedHistory.length ? cookedHistory[0].title : 'Start with your saved kitchen preferences'}</small></div></button>
          </div>{cookedHistory.length>0&&<div className="recent-wrap"><div className="home-section-title"><h3>Cooked Recently</h3><span>{cookedHistory.length} meal{cookedHistory.length===1?'':'s'}</span></div><div className="home-recipe-strip">{cookedHistory.slice(0,5).map((r,i)=><button className="home-recipe-card cooked-card" key={'cooked-'+r.title+i} onClick={()=>cookAgain(r)}><div style={r.image?{backgroundImage:`url("${r.image}")`}:undefined}/><b>{r.title}</b><small>{new Date(r.cookedAt).toLocaleDateString(undefined,{month:'short',day:'numeric'})} · Cook Again</small></button>)}</div></div>}{recentRecipes.length>0&&<div className="recent-wrap"><div className="home-section-title"><h3>Recently Viewed</h3><button onClick={()=>navigate('recipes')}>Browse All →</button></div><div className="home-recipe-strip">{recentRecipes.slice(0,5).map(r=><button className="home-recipe-card" key={'recent-'+r.title} onClick={()=>openRecipe(r)}><div style={r.image?{backgroundImage:`url("${r.image}")`}:undefined}/><b>{r.title}</b><small>{r.time} · {r.budget}</small></button>)}</div></div>}</section>
          {recommendedRecipes.length>0&&<section className="taste-profile-card"><div className="home-section-title"><div><p className="eyebrow">BASED ON WHAT YOU COOK</p><h2>Your Taste Profile</h2><p>{tasteSignals.length ? 'We’re noticing '+tasteSignals.join(' · ')+' in your kitchen.' : 'Fancy Eatz is learning from meals you make and save.'}</p></div></div><div className="home-recipe-strip">{recommendedRecipes.map(r=><button className="home-recipe-card" key={'taste-'+r.title} onClick={()=>openRecipe(r)}><div style={r.image?{backgroundImage:`url("${r.image}")`}:undefined}/><b>{r.title}</b><small>Picked from your cooking history</small></button>)}</div></section>}
          <div className="home-recipe-section"><div className="home-section-title"><h2>Featured Recipes</h2><button onClick={()=>navigate('recipes')}>View All Recipes →</button></div>
            <div className="home-recipe-strip">{featured.filter(r=>r.image).slice(0,6).map(r=><button className="home-recipe-card" key={r.title} onClick={()=>openRecipe(r)}><div style={{backgroundImage:`url("${r.image}")`}}/><b>{r.title}</b><small>{r.time} · {r.budget}</small></button>)}</div>
          </div>
          <section className="premium-conversion"><div><p className="eyebrow">MAKE EVERY WEEK EASIER</p><h2>Your kitchen, organized around you.</h2><p>Save favorites, plan meals and keep one smart grocery list with Fancy Eatz.</p></div><div className="conversion-actions"><button className="ghost" onClick={()=>navigate('planner')}>Plan My Week</button><button className="primary" onClick={()=>openMembership('Join early access now and get your 7-day Premium trial when Fancy Eatz launches.')}>Join Early Access →</button></div></section>
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
                <label>Drink pairing<select value={experienceDrinkMode} onChange={e=>setExperienceDrinkMode(e.target.value)}><option>Both</option><option>Cocktail</option><option>Non-Alcoholic</option><option>No drink</option></select></label>
              </div>
              <button className="primary full" onClick={generateExperience} disabled={experienceLoading}><Sparkles size={18}/>{experienceLoading ? 'Designing your evening…' : 'Create My Experience'}</button>
            </div>
            <div className="result panel">
              {!experience ? <div className="empty"><Sparkles size={44}/><h3>Your complete evening appears here</h3><p>Menu, pairing, timeline, plating, table setting and shopping plan.</p></div> : <div>
                <p className="eyebrow">FANCY EATZ SIGNATURE EXPERIENCE</p><h2>{experience.title}</h2>
                <h3>Appetizer</h3><p>{experience.appetizer}</p><h3>Entrée</h3><p>{experience.entree}</p>
                <h3>Sides</h3><ul>{experience.sides.map(x => <li key={x}>{x}</li>)}</ul>
                <h3>Dessert</h3><p>{experience.dessert}</p><h3>Pairing</h3><p>{experience.pairing}</p>
                {experienceDrinkMode !== 'No drink' && (() => { const pool = experienceDrinkMode === 'Non-Alcoholic' ? drinks.filter(d=>d.category==='Mocktails & Punches') : experienceDrinkMode === 'Cocktail' ? drinks.filter(d=>d.category!=='Mocktails & Punches') : drinks; const pick = pool[Math.abs((experience.entree||experience.title).length) % Math.max(pool.length,1)]; return pick ? <div className="plating"><b>Fancy Eatz Drink Pairing</b><h3>{pick.title}</h3><p>{pick.ingredients.join(' · ')}</p><button className="ghost" onClick={()=>{setSelectedDrink(pick);navigate('drinks')}}>View drink recipe →</button></div> : null; })()}
                <h3>Ingredients</h3><ul>{experience.ingredients.map(x => <li key={x}>{x}</li>)}</ul><h3>Method / Directions</h3><ol>{experience.steps.map(x => <li key={x}>{x}</li>)}</ol><h3>Preparation Timeline</h3><ol>{experience.timeline.map(x => <li key={x}>{x}</li>)}</ol>
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
                <label>Meal type<select value={mealType} onChange={e => setMealType(e.target.value)}><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Dessert</option><option>Family Meals</option><option>Grill</option><option>Fine Dining</option><option>Chef Techniques</option><option>Pastry</option><option>Southern</option><option>Seafood</option></select></label>
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
                  {mealChoices.length > 1 && <div className="choice-studio">
                    <div className="choice-heading"><div><small>MIX & MATCH STUDIO</small><h3>{mealChoices.length} meal choices</h3></div><span>Tap any choice to make it your active recipe</span></div>
                    <div className="choice-scroll">{mealChoices.map((choice,i)=><button key={choice.title+i} className={choice.title===meal.title?'meal-choice active':'meal-choice'} onClick={()=>setMeal(choice)}><small>{choice.category}</small><b>{choice.title}</b><span>{choice.description}</span></button>)}</div>
                    <p className="mix-note">Mix & match your favorite entrée, sides, flavor direction and plating idea, then save the version you want to your cookbook.</p>
                    <div className="component-builder">
                      <h3>Build Your Own Plate</h3><p>Choose components from the cookbook-powered library. Only components found in completed recipe entries are used for food selections.</p>
                      <div className="component-grid">{mixKinds.map(kind=><label key={kind}><span>{kind}</span><select value={mixSelections[kind]||''} onChange={e=>setMixSelections(v=>({...v,[kind]:e.target.value}))}><option value="">Chef's choice</option>{mixLibrary.filter(x=>x.kind===kind).slice(0,35).map(x=><option key={kind+x.name} value={x.name}>{x.name}</option>)}</select></label>)}</div>
                      <button className="primary full" onClick={applyMix}><Sparkles size={18}/>Create My Mix & Match Plate</button>
                    </div>
                  </div>}
                  <h3>Ingredients</h3><ul>{meal.ingredients.map(x => <li key={x}>{x}</li>)}</ul>
                  <h3>Method</h3><ol>{meal.steps.map(x => <li key={x}>{x}</li>)}</ol>
                  <div className="plating"><b>Fancy Finish</b><p>{meal.plating}</p></div>
                  <div className="result-actions">
                    <button className="ghost" onClick={saveFavorite}><Heart size={18} />{favorites.some(f => f.title === meal.title) ? 'Saved' : 'Save Favorite'}</button>
                    <button className="primary" onClick={()=>markCooked({title:meal.title,description:meal.description,ingredients:meal.ingredients,steps:meal.steps,plating:meal.plating,cookedAt:new Date().toISOString(),source:'Pantry Chef',time,budget})}><ChefHat size={18}/>I Made This</button>
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


      {tab === 'grill' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">FIRE · SMOKE · FLAVOR</p><h2>Fancy Eatz Grill Master</h2><p>Source-backed grilling inspiration plus Pantry Chef generation for steak, chicken, seafood, vegetables and more.</p></div>
          <div className="home-feature-grid">
            <button className="visual-feature pantry-feature" onClick={()=>openSpecialGenerator('grill')}><span><b>Grill What You Have</b><small>Enter meat, seafood, vegetables or sides and build a complete grill meal.</small><strong>Open Grill Generator →</strong></span></button>
            <button className="visual-feature mix-feature" onClick={()=>{setSearch('grill');navigate('recipes')}}><span><b>Grill Recipe Vault</b><small>Browse grilled and barbecue recipes already in the source collection.</small><strong>Browse Grill Recipes →</strong></span></button>
          </div>
        </section>
      )}

      {tab === 'desserts' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">THE SWEET FINISH</p><h2>Fancy Desserts</h2><p>Elegant desserts, celebration sweets and pantry-first dessert ideas.</p></div>
          <div className="home-feature-grid">
            <button className="visual-feature book-feature" onClick={()=>openSpecialGenerator('dessert')}><span><b>Create a Dessert From What You Have</b><small>Use chocolate, fruit, cream, cookies, cake ingredients and more.</small><strong>Generate Dessert →</strong></span></button>
            <button className="visual-feature pantry-feature" onClick={()=>{setSearch('dessert');navigate('recipes')}}><span><b>Fancy Dessert Vault</b><small>Browse complete desserts with ingredients and directions.</small><strong>Browse Desserts →</strong></span></button>
          </div>
        </section>
      )}

      {tab === 'drinks' && (
        <section className="page">
          <div className="section-head">
            <p className="eyebrow">FANCY EATZ BAR & DRINKS</p>
            <h2>Make the drink. Know the method.</h2>
            <p>Search the bartender collection by drink name or by an ingredient you already have. Recipes below are converted from the Fancy Eatz source bartender book.</p>
          </div>
          <div className="panel">
            <div className="recipe-tools">
              <label className="search-box"><Search size={18}/><input value={drinkSearch} onChange={e=>setDrinkSearch(e.target.value)} placeholder="Search vodka, lime, martini, rum..." /></label>
              <label>Category<select value={drinkCategory} onChange={e=>setDrinkCategory(e.target.value)}><option>All</option><option>Cocktails</option><option>Martinis</option><option>Mocktails & Punches</option></select></label>
              <label>What do you have?<input value={pantry} onChange={e=>setPantry(e.target.value)} placeholder="vodka, lime, cranberry juice..." /></label>
              <button className={drinkPantryOnly ? 'primary' : 'ghost'} onClick={()=>setDrinkPantryOnly(v=>!v)}>{drinkPantryOnly ? 'Showing what I can make' : 'Show what I can make'}</button>
            </div>
            <div className="plating"><b>21+ RESPONSIBLE SERVICE</b><p>Alcoholic recipes are for adults of legal drinking age. Serve responsibly and never drink and drive.</p></div>
          </div>
          <div className="cards">
            {drinks.filter(d => {
              const q=drinkSearch.trim().toLowerCase();
              const matchesCategory=drinkCategory==='All'||d.category===drinkCategory;
              const matchesSearch=!q||d.title.toLowerCase().includes(q)||d.ingredients.some(i=>i.toLowerCase().includes(q));
              const have=pantry.toLowerCase().split(/[,\n]/).map(x=>x.trim()).filter(Boolean);
              const matchesPantry=!drinkPantryOnly||have.length===0||d.ingredients.some(i=>have.some(h=>i.toLowerCase().includes(h)));
              return matchesCategory&&matchesSearch&&matchesPantry;
            }).map(d => <article className="recipe-card" key={d.title}>
              <div className="card-body"><small>{d.category} · {d.glassware}</small><h3>{d.title}</h3><p>{d.ingredients.slice(0,3).join(' · ')}</p><button className="ghost" onClick={()=>{setSelectedDrink(d);setTimeout(()=>document.getElementById('full-drink-recipe')?.scrollIntoView({behavior:'smooth',block:'start'}),50)}}><BookOpen size={16}/>Open Full Recipe</button></div>
            </article>)}
          </div>
          {selectedDrink && <div id="full-drink-recipe" className="panel recipe-detail" style={{marginTop:24}}>
            <div className="section-head"><p className="eyebrow">{selectedDrink.category}</p><h2>{selectedDrink.title}</h2><p>Glassware: {selectedDrink.glassware}{selectedDrink.garnish ? ' · Garnish: '+selectedDrink.garnish : ''}</p></div>
            <div className="generator-grid">
              <div><h3>Ingredients / Measurements</h3><ul>{selectedDrink.ingredients.map(x=><li key={x}>{x}</li>)}</ul></div>
              <div><h3>How to Make It</h3><ol>{selectedDrink.method.map(x=><li key={x}>{x}</li>)}</ol></div>
            </div>
            <div className="plating"><b>COMPLETE METHOD</b><p>Follow the measured ingredients and preparation steps above in order. Glassware and garnish are shown exactly with the recipe where available.</p></div><div className="result-actions"><button className="ghost" onClick={()=>setSelectedDrink(null)}>Close Drink Recipe</button></div>
          </div>}
          <div className="source-note"><BookOpen size={20}/><div><b>Bartending For Beginners</b><p>This section is being expanded from the source bartender collection with cocktails, martinis, mocktails, punches and additional drink categories.</p></div></div>
        </section>
      )}

      {tab === 'recipes' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">THE RECIPE VAULT</p><h2>Find your next Fancy Eatz moment.</h2><p>One growing Fancy Eatz cookbook for every kind of meal — family favorites, grilling, fine dining, chef techniques, desserts, pastries, seafood and more.</p><div className="vault-stats"><span><b>{featured.length}</b><small>complete interactive recipes</small></span><span><b>All Styles</b><small>one unified cookbook</small></span><span><b>A–Z</b><small>recipe browsing</small></span></div></div>
          
          <div className="cook-style-filter">
            {['All','Fancy Dining','Grill Master','Everyday Mom',"Chef's Kitchen",'Pastry Chef'].map(x=><button key={x} className={cookStyleFilter===x?'active':''} onClick={()=>setCookStyleFilter(x)}>{x}{x!=='All' && styleRecipeCounts[x] ? ` (${styleRecipeCounts[x]})` : ''}</button>)}
          </div>
          <div className="recipe-tools">
            <label className="search-box"><Search size={18} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search chicken, steak, pasta, seafood, dessert..." /></label>
            <label>Category<select value={recipeType} onChange={e => setRecipeType(e.target.value)}><option>All</option><option>Appetizers</option><option>Entrées</option><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Dessert</option></select></label>
          <div className="plating"><b>BROWSE A–Z</b><div className="filter-row">{['All',...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].map(x => <button className={recipeLetter === x ? 'active' : ''} key={x} onClick={() => setRecipeLetter(x)}>{x}</button>)}</div></div>
          </div>
          
          <div className="cards">
            {filteredRecipes.map((r, i) => <article className="recipe-card" key={r.title}><div className={'food-art art-' + (i % 6)} style={r.image ? {backgroundImage:`linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.35)),url("${r.image}")`,backgroundSize:'cover',backgroundPosition:'center'} : undefined}><span>{r.tag}</span></div><div className="card-body"><small>{r.mealType} · {r.time} · {r.budget}</small><h3>{r.title}</h3><p>{r.note}</p>{r.ingredients?.length ? <button className="ghost" onClick={()=>openRecipe(r)}><BookOpen size={16}/>Open Full Recipe</button> : <small>Full recipe details being added from the source collection.</small>}<button onClick={() => { const recipePrompt = r.title + ' ingredients'; setPantry(recipePrompt); setMealType(r.mealType); setMeal(null); navigate('pantry'); void generateMeal(true, recipePrompt, r.mealType); }}>Make My Version →</button></div></article>)}
          </div>
          {filteredRecipes.length === 0 && <div className="empty panel"><Search size={36} /><h3>No exact match yet</h3><p>Try another search, or use Pantry Chef to generate the meal you have in mind.</p></div>}
          {selectedRecipe && <div id="full-recipe" className="panel recipe-detail" style={{marginTop:24}}>
            {selectedRecipe.image && <div className="recipe-hero-photo" style={{backgroundImage:`linear-gradient(180deg,rgba(0,0,0,.04),rgba(0,0,0,.48)),url("${selectedRecipe.image}")`}}><span>FANCY EATZ SIGNATURE RECIPE</span></div>}
            <div className="section-head"><p className="eyebrow">{selectedRecipe.category || selectedRecipe.mealType}</p><h2>{selectedRecipe.title}</h2><p>{selectedRecipe.note}</p></div>
            <div className="meta"><span><Clock3 size={16}/>{selectedRecipe.time}</span>{selectedRecipe.servings && <span><Users size={16}/>{selectedRecipe.servings}</span>}</div>
            <div className="generator-grid">
              <div><h3>Ingredients</h3>{selectedRecipe.ingredients?.length ? <ul>{selectedRecipe.ingredients.map(x => <li key={x}>{x}</li>)}</ul> : <p>Ingredients have not yet been converted from the source cookbook.</p>}</div>
              <div><h3>Method / Directions</h3>{selectedRecipe.method?.length ? <ol>{selectedRecipe.method.map(x => <li key={x}>{x}</li>)}</ol> : <p>Directions have not yet been converted from the source cookbook.</p>}</div>
            </div>
            <div className="result-actions">
              {selectedRecipe.ingredients && <button className="ghost" onClick={() => addItems(selectedRecipe.ingredients || [], selectedRecipe.title)}><ShoppingBasket size={18}/>Add Ingredients to Grocery List</button>}
              <button className="ghost" onClick={() => { const p=selectedRecipe.title+' ingredients'; setPantry(p); setMealType(selectedRecipe.mealType); navigate('pantry'); void generateMeal(true,p,selectedRecipe.mealType); }}><Sparkles size={18}/>Make My Version</button>
              <button className="ghost" onClick={() => { if (!selectedRecipe) return; const saved: Meal = { title:selectedRecipe.title, description:selectedRecipe.note, ingredients:selectedRecipe.ingredients || [], steps:selectedRecipe.method || [], plating:'Serve with an elevated Fancy Eatz presentation.', missing:[] }; setFavorites(prev => prev.some(x=>x.title===saved.title) ? prev : [...prev,saved]); }}><Heart size={18}/>Save to My Cookbook</button>
              <button className="primary" onClick={()=>markCooked({title:selectedRecipe.title,description:selectedRecipe.note,ingredients:selectedRecipe.ingredients||[],steps:selectedRecipe.method||[],plating:'Serve with an elevated Fancy Eatz presentation.',cookedAt:new Date().toISOString(),source:'Recipe Vault',image:selectedRecipe.image,time:selectedRecipe.time,budget:selectedRecipe.budget})}><ChefHat size={18}/>I Made This</button>
              <button className="ghost" onClick={() => window.print()}>Print Recipe</button>
              <button className="ghost" onClick={async () => { if (navigator.share && selectedRecipe) await navigator.share({title:selectedRecipe.title,text:selectedRecipe.note,url:window.location.href}); }}>Share Recipe</button>
              <button className="ghost" onClick={() => setSelectedRecipe(null)}>Close Recipe</button>
            </div>
          </div>}
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

      {tab === 'styles' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">COOK YOUR WAY</p><h2>Choose Your Cooking Style</h2><p>Pick the kind of cook you want Fancy Eatz to become, then use what you already have to build the meal.</p></div>
          <div className="style-grid">
            {cookingStyles.map(x=><button className="style-card" key={x.name} onClick={()=>{setStyle(x.style);setOccasion(x.occasion);setMealType(x.name==='Pastry Chef'?'Dessert':'Dinner');setPantry('');navigate('pantry')}}>
              <small>{x.name==='Pastry Chef'?'BAKE & CREATE':x.name==='Grill Master'?'FIRE & SMOKE':x.name==='Everyday Mom Cooking'?'FAMILY FAVORITES':'ELEVATED COOKING'}</small>
              <h3>{x.name}</h3><p>{x.desc}</p><strong>Cook this style →</strong>
            </button>)}
          </div>
        </section>
      )}

      {tab === 'favorites' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">MY FANCY COOKBOOK</p><h2>Your Personal Recipe Collection</h2><p>Save the meals worth making again and build your own evolving Fancy Eatz cookbook. Saved recipes stay on this device.</p></div>
          {favorites.length === 0 ? <div className="empty panel"><Heart size={40} /><h3>Your cookbook is ready</h3><p>Generate a meal in Pantry Chef and tap Save Favorite to add your first recipe.</p></div> : <div className="cards">{alphabetizedFavorites.map(f => <article className="recipe-card saved-card" key={f.title}><div className="card-body"><small>SAVED MEAL</small><h3>{f.title}</h3><p>{f.description}</p><button onClick={() => { setMeal(f); navigate('pantry'); }}>Open recipe →</button><button className="remove-favorite" onClick={() => setFavorites(p => p.filter(x => x.title !== f.title))}>Remove</button></div></article>)}</div>}
        </section>
      )}

      {tab === 'basics' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">PANTRY & HOME BASICS</p><h2>Grocery Basics Checklist</h2><p>A reusable checklist of everyday grocery staples. Tap what you already have, then add anything you need to your active shopping list.</p></div>
          <div className="basics-actions">
            <button className="primary" onClick={()=>addItems(basicGroceryNeeds.filter(x=>!checked.includes('basic:'+x)), 'Grocery Basics')}>Add Unchecked Basics to Grocery List</button>
            <button className="ghost" onClick={()=>setChecked(p=>[...p.filter(x=>!x.startsWith('basic:')),...basicGroceryNeeds.map(x=>'basic:'+x)])}>I Have All</button>
            <button className="ghost" onClick={()=>setChecked(p=>p.filter(x=>!x.startsWith('basic:')))}>Reset Checklist</button>
          </div>
          <div className="basics-categories">
            {Object.entries(basicGroceryCategories).map(([category,items])=><section className="basics-category panel" key={category}>
              <div className="basics-category-head"><h3>{category}</h3><small>{items.filter(item=>checked.includes('basic:'+item)).length}/{items.length} stocked</small></div>
              <div className="basics-grid">
                {items.map(item => {
                  const key='basic:'+item; const have=checked.includes(key);
                  return <button key={item} className={'basic-check '+(have?'done':'')} onClick={()=>setChecked(p=>have?p.filter(x=>x!==key):[...p,key])}>
                    <span className="check">{have&&<Check size={15}/>}</span><span>{item}</span>
                  </button>
                })}
              </div>
            </section>)}
          </div>
        </section>
      )}

      {tab === 'grocery' && (
        <section className="page">
          <div className="section-head"><p className="eyebrow">SMART SHOPPING</p><h2>My Grocery Command Center</h2><p>Build one clean shopping list from recipes, weekly plans, or your own items. Check things off as you shop and keep the list organized by aisle.</p></div>
          <div className="grocery-mode-tabs">
            <button className={groceryMode==='basics'?'active':''} onClick={()=>setGroceryMode('basics')}>Basic Grocery Checklist</button>
            <button className={groceryMode==='list'?'active':''} onClick={()=>setGroceryMode('list')}>My Shopping List</button>
          </div>
          {groceryMode==='basics' && <div className="basics-categories grocery-basics-inline">
            {Object.entries(basicGroceryCategories).map(([category,items])=><section className="basics-category panel" key={category}>
              <div className="basics-category-head"><h3>{category}</h3><small>{items.filter(item=>checked.includes('basic:'+item)).length}/{items.length} have</small></div>
              <div className="basics-grid">{items.map(item=>{const key='basic:'+item;const have=checked.includes(key);return <button key={item} className={'basic-check '+(have?'done':'')} onClick={()=>setChecked(p=>have?p.filter(x=>x!==key):[...p,key])}><span className="check">{have&&<Check size={15}/>}</span><span>{item}</span></button>})}</div>
            </section>)}
            <button className="primary full" onClick={()=>{setGrocery(p=>Array.from(new Set([...p,...basicGroceryNeeds.filter(x=>!checked.includes('basic:'+x))])));setListName('Grocery Basics');setGroceryMode('list')}}>Add Everything I Need to My Shopping List</button>
          </div>}
          {groceryMode==='list' && <>
          <div className="grocery-quickbar">
            <button className="primary" onClick={()=>{setListName('My Grocery List');setGrocery([]);setChecked([])}}>+ Start Fresh List</button>
            <button className="ghost" onClick={()=>setChecked(grocery)}>Check All</button>
            <button className="ghost" onClick={()=>{setGrocery(p=>p.filter(x=>!checked.includes(x)));setChecked([])}}>Clear Checked</button>
          </div>
          <div className="list-tabs"><span className="list-label">Quick starts</span>{(Object.keys(starterLists) as (keyof typeof starterLists)[]).map(n => <button className={listName === n ? 'active' : ''} key={n} onClick={() => loadList(n)}>{n}</button>)}</div>
          <div className="grocery panel">
            <div className="grocery-title"><div><small>ACTIVE SHOPPING LIST</small><h2>{listName}</h2><p>{checked.length} in cart · {grocery.length - checked.length} left</p></div><strong>{grocery.length ? Math.round((checked.length/grocery.length)*100) : 0}%</strong></div>
            <div className="grocery-progress"><span style={{width:`${grocery.length ? (checked.length/grocery.length)*100 : 0}%`}} /></div>
            <div className="add-row"><input value={newItem} onChange={e => setNewItem(e.target.value)} placeholder="Add milk, salmon, lemons…" onKeyDown={e => { if (e.key === 'Enter' && newItem.trim()) { setGrocery(p=>Array.from(new Set([...p, newItem.trim()]))); setNewItem(''); } }} /><button aria-label="Add grocery item" onClick={() => { if (newItem.trim()) { setGrocery(p=>Array.from(new Set([...p, newItem.trim()]))); setNewItem(''); } }}><Plus size={18} /></button></div>
            <label className="grocery-filter"><Search size={17}/><input value={grocerySearch} onChange={e=>setGrocerySearch(e.target.value)} placeholder="Find an item in this list…" /></label>
            {Object.entries(grouped).map(([cat, items]) => {
              const visible=items.filter(item=>!grocerySearch.trim()||item.toLowerCase().includes(grocerySearch.toLowerCase()));
              return visible.length > 0 && <div className="category" key={cat}><h3>{cat}<small>{visible.filter(x=>!checked.includes(x)).length} left</small></h3>{visible.map(item => <div className={'grocery-item ' + (checked.includes(item) ? 'done' : '')} key={item}><button className="check" aria-label={'Check '+item} onClick={() => setChecked(p => p.includes(item) ? p.filter(x => x !== item) : [...p, item])}>{checked.includes(item) && <Check size={15} />}</button><span>{item}</span><button className="trash" aria-label={'Remove '+item} onClick={() => {setGrocery(p => p.filter(x => x !== item));setChecked(p=>p.filter(x=>x!==item))}}><Trash2 size={16} /></button></div>)}</div>
            })}
            {grocery.length===0 && <div className="empty grocery-empty"><ShoppingBasket size={34}/><h3>Your list is empty</h3><p>Add items above, choose a Quick Start, or send missing ingredients here from any Fancy Eatz recipe.</p></div>}
          </div>
          </>}
        </section>
      )}

      {showMembership && <div className="membership-overlay" role="dialog" aria-modal="true" aria-label="Fancy Eatz Premium membership">
        <div className="membership-modal">
          <button className="membership-close" aria-label="Close membership window" onClick={()=>setShowMembership(false)}>×</button>
          <div className="membership-mark"><Crown size={30}/></div>
          <p className="eyebrow">FANCY EATZ PREMIUM</p>
          <h2>Your kitchen just got smarter.</h2>
          <p className="membership-lede">{membershipNotice || 'Try the complete Fancy Eatz experience for 7 days.'}</p>
          <div className="membership-benefits">
            <span><ShieldCheck size={17}/> Photo My Fridge ingredient recognition</span>
            <span><ShieldCheck size={17}/> Pantry Chef & personalized meal ideas</span>
            <span><ShieldCheck size={17}/> Full recipe, drink & dessert vaults</span>
            <span><ShieldCheck size={17}/> Weekly planning & smart grocery tools</span>
            <span><ShieldCheck size={17}/> Grill Master & complete dining experiences</span>
          </div>
          <div className="membership-plans">
            <button className="membership-plan selected" onClick={()=>setMembershipNotice('Monthly plan selected. Secure checkout will activate here once billing is connected.')}><small>PLANNED MONTHLY</small><strong>$9.99</strong><span>/ month</span><em>7-day trial at launch</em></button>
            <button className="membership-plan" onClick={()=>setMembershipNotice('Annual plan selected. Secure checkout will activate here once billing is connected.')}><small>PLANNED ANNUAL · SAVE</small><strong>$79</strong><span>/ year</span><em>7-day trial at launch</em></button>
          </div>
          <div className="early-access-form"><input type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" autoComplete="email" value={earlyEmail} onChange={e=>{setEarlyEmail(e.target.value);setMembershipNotice('')}} onKeyDown={e=>{if(e.key==='Enter')joinEarlyAccess()}} placeholder="Enter your email" aria-label="Email for early access"/><button type="button" className="primary membership-cta" disabled={earlySubmitting} onClick={joinEarlyAccess}><LockKeyhole size={18}/>{earlySubmitting?'Joining…':'Join Early Access'}</button></div>
          {earlyError && <p className="early-inline-error" role="alert">{earlyError}</p>}
          {earlyJoined ? <div className="early-success"><ShieldCheck size={20}/><span><b>You're on the list.</b><small>You'll get your 7-day Premium trial invitation when Fancy Eatz launches.</small></span></div> : <p className="membership-fine">Join the founding early-access list. No payment is collected today.</p>}
        </div>
      </div>}

      {tab === 'dashboard' && !ownerUnlocked && <section className="page owner-login"><div className="owner-login-card"><div className="membership-mark"><Crown/></div><p className="eyebrow">OWNER ACCESS</p><h2>Fancy Eatz Command Center</h2><p>Enter your owner access code to open the private dashboard.</p><input type="password" value={ownerCode} onChange={e=>setOwnerCode(e.target.value)} placeholder="Owner access code"/><button className="primary full" onClick={()=>{if(ownerCode==='FANCY2026'){sessionStorage.setItem('fancy-eatz-owner','yes');setOwnerUnlocked(true);setTimeout(loadDashboard,0)}else setMembershipNotice('Incorrect owner access code.')}}>Open Dashboard</button>{membershipNotice&&<p className="early-inline-error">{membershipNotice}</p>}</div></section>}
      
      {tab === 'dashboard' && ownerUnlocked && <section className="page owner-dashboard">
        <div className="section-head"><p className="eyebrow">FANCY EATZ OWNER</p><h2>Early Access Dashboard</h2><p>Track the audience building before paid launch.</p></div>
        <div className="dashboard-actions"><button className="primary" onClick={loadDashboard}>{dashboardLoading?'Refreshing…':'Refresh Signups'}</button><button className="ghost" onClick={()=>navigate('home')}>Back to Site</button></div>
        <div className="dashboard-stats"><article><small>TOTAL SIGNUPS</small><strong>{dashboardLeads.length}</strong></article><article><small>WAITING</small><strong>{dashboardLeads.filter(x=>x.status==='waiting').length}</strong></article><article><small>INVITED</small><strong>{dashboardLeads.filter(x=>x.launch_invited_at).length}</strong></article><article><small>CONVERTED</small><strong>{dashboardLeads.filter(x=>x.converted_at).length}</strong></article></div>
        <div className="panel dashboard-table-wrap">{dashboardLoading?<p>Loading signups…</p>:dashboardLeads.length?<table className="dashboard-table"><thead><tr><th>Email</th><th>Status</th><th>Source</th><th>Joined</th></tr></thead><tbody>{dashboardLeads.map(x=><tr key={x.id}><td>{x.email}</td><td><span className="status-pill">{x.converted_at?'Converted':x.launch_invited_at?'Invited':x.status}</span></td><td>{x.source}</td><td>{new Date(x.created_at).toLocaleDateString()}</td></tr>)}</tbody></table>:<div className="dashboard-empty"><h3>No signups loaded yet</h3><p>Tap Refresh Signups to load the current Early Access list.</p></div>}</div>
      </section>}

      {tab === 'home' && <button className="owner-access-link" onClick={()=>navigate('dashboard')}>Owner Dashboard</button>}

      <footer><div className="brand footer-brand"><span>F</span><div><b>FANCY EATZ</b><small>Smarter cooking for every kitchen.</small></div></div><p>Use what you have. Make something worth sharing.</p><small className="footer-note">Fancy Eatz is being prepared for broader U.S. availability.</small></footer>
    </main>
  );
}
