export type MealCollectionRecipe={title:string;tag:string;collection:string;time:string;note:string;mealType:string;diet:string;budget:string;category:string;servings:string;ingredients:string[];method:string[]};

const breakfastBases=[
 ['Scramble','8 large eggs','1/3 cup milk'],['Omelet','8 large eggs','2 tbsp water'],['Breakfast Bowl','2 cups cooked breakfast potatoes','6 large eggs'],['Oatmeal','2 cups old-fashioned oats','4 cups milk or water'],['Yogurt Parfait','4 cups plain Greek yogurt','2 cups granola'],['French Toast','8 slices brioche','4 large eggs'],['Breakfast Quesadilla','8 flour tortillas','6 large eggs'],['Breakfast Sandwich','4 English muffins','6 large eggs'],['Hash','4 cups diced potatoes','6 large eggs'],['Breakfast Wrap','4 large tortillas','6 large eggs']
] as const;
const breakfastFlavors=[
 ['Spinach & Feta','2 cups baby spinach','3/4 cup crumbled feta'],['Turkey Sausage & Pepper','8 oz cooked turkey sausage','1 diced bell pepper'],['Mushroom & Swiss','2 cups sliced mushrooms','1 cup shredded Swiss'],['Berry Almond','2 cups mixed berries','1/2 cup sliced almonds'],['Apple Cinnamon','2 diced apples','1 tsp ground cinnamon'],['Peach Pecan','2 diced peaches','1/2 cup chopped pecans'],['Tomato Basil','2 diced tomatoes','1/3 cup chopped basil'],['Avocado Salsa','2 avocados, diced','1 cup salsa'],['Ham & Cheddar','8 oz diced ham','1 cup shredded cheddar'],['Banana Walnut','2 sliced bananas','1/2 cup chopped walnuts']
] as const;
const breakfasts:MealCollectionRecipe[]=[];
breakfastBases.forEach((b,bi)=>breakfastFlavors.forEach((f,fi)=>{
 const sweet=/Oatmeal|Parfait|French Toast/.test(b[0]);
 breakfasts.push({title:`${f[0]} ${b[0]}`,tag:'Breakfast',collection:'Breakfast',time:'15–30 min',note:'Complete breakfast recipe with measured ingredients and clear doneness cues.',mealType:'Breakfast',diet:sweet?'Vegetarian':/Turkey|Ham/.test(f[0])?'No restriction':'Vegetarian',budget:'$',category:'Breakfast',servings:'4',ingredients:[b[1],b[2],f[1],f[2],sweet?'2 tbsp maple syrup':'1 tbsp olive oil',sweet?'1/2 tsp vanilla extract':'1/2 tsp kosher salt',sweet?'1/4 tsp fine salt':'1/4 tsp black pepper'],method:sweet?[
  'Measure and prepare all ingredients before heating or assembling.',
  `Prepare the ${b[0].toLowerCase()} base using ${b[1]} and ${b[2]}; cook gently until set or tender as appropriate.`,
  `Fold in or layer ${f[1]} and ${f[2]}, keeping fresh fruit intact where possible.`,
  'Add maple syrup, vanilla and a small pinch of salt; taste before adding more sweetness.',
  'Divide evenly among four servings and finish with reserved fruit or nuts for texture.',
  'Serve immediately if warm, or chill parfait-style breakfasts until ready to eat.'
 ]:[
  'Prepare all vegetables and cooked add-ins first so the egg or potato base does not overcook.',
  `Heat olive oil in a nonstick skillet over medium heat. Cook ${f[1]} as needed until hot and tender.`,
  `Add ${b[1]} and ${b[2]} according to the base; cook eggs until fully set but still moist, or potatoes until browned and tender.`,
  `Add ${f[2]}, season with salt and pepper, and fold or assemble without overworking the eggs.`,
  'Remove from heat as soon as the center is cooked through; residual heat will continue cooking the dish.',
  'Divide into four portions and serve hot.'
 ]});
}));

const lunchBases=[
 ['Chicken Grain Bowl','1 lb boneless chicken breast, diced','3 cups cooked brown rice'],['Turkey Wrap','12 oz sliced turkey','4 large whole-wheat tortillas'],['Tuna Pita','2 cans tuna, drained','4 whole-wheat pitas'],['Chickpea Bowl','2 cans chickpeas, rinsed','3 cups cooked quinoa'],['Chicken Pasta Salad','12 oz cooked chicken','12 oz cooked pasta'],['Turkey Sandwich','12 oz sliced turkey','8 slices whole-grain bread'],['Salmon Rice Bowl','1 lb salmon fillet','3 cups cooked jasmine rice'],['Black Bean Burrito Bowl','2 cans black beans, rinsed','3 cups cooked brown rice'],['Mediterranean Pita','2 cans chickpeas, rinsed','4 pitas'],['Chicken Lettuce Wrap','1 lb ground chicken','12 large lettuce leaves']
] as const;
const lunchFlavors=[
 ['Lemon Herb','2 tbsp lemon juice','1/3 cup chopped parsley'],['Southwest','1 cup corn','1 cup salsa'],['Greek','1 cup diced cucumber','3/4 cup crumbled feta'],['Avocado Lime','2 diced avocados','2 tbsp lime juice'],['Roasted Pepper','1 cup sliced roasted peppers','1/2 cup hummus'],['Honey Mustard','2 tbsp Dijon mustard','1 tbsp honey'],['Sesame Ginger','1 tbsp grated ginger','2 tbsp low-sodium soy sauce'],['Tomato Basil','1 1/2 cups cherry tomatoes','1/3 cup basil'],['Crunchy Slaw','2 cups cabbage slaw','2 tbsp rice vinegar'],['Garlic Parmesan','2 garlic cloves, minced','1/2 cup grated Parmesan']
] as const;
const lunches:MealCollectionRecipe[]=[];
lunchBases.forEach((b,bi)=>lunchFlavors.forEach((f,fi)=>lunches.push({title:`${f[0]} ${b[0]}`,tag:'Lunch',collection:'Lunch',time:'20–35 min',note:'Balanced lunch with exact quantities and complete assembly/cooking directions.',mealType:'Lunch',diet:/Tuna|Salmon/.test(b[0])?'Pescatarian':/Chickpea|Black Bean|Mediterranean/.test(b[0])?'Vegetarian':'No restriction',budget:'$$',category:'Lunch',servings:'4',ingredients:[b[1],b[2],f[1],f[2],'2 tbsp olive oil','1/2 tsp kosher salt','1/4 tsp black pepper'],method:[
 'Wash produce, measure ingredients and keep ready-to-eat items separate from raw proteins.',
 `Cook or heat the primary filling, ${b[1]}, until safely cooked through where required; chicken and turkey should reach 165°F and salmon 145°F.`,
 `Prepare ${b[2]} and portion it evenly for four servings.`,
 `Combine ${f[1]} and ${f[2]} with olive oil, salt and pepper to create the flavor component.`,
 'Assemble the bowl, wrap, pita, sandwich or lettuce cups evenly so each serving contains the base, filling and vegetables.',
 'Serve immediately, or cool cooked components before packing and refrigerate promptly for make-ahead lunches.'
]})));

const saladBases=[
 ['Garden Salad','8 cups mixed greens','2 cups cherry tomatoes'],['Kale Salad','8 cups chopped kale','1 diced cucumber'],['Spinach Salad','8 cups baby spinach','2 cups sliced strawberries'],['Roasted Vegetable Salad','3 cups roasted vegetables','6 cups mixed greens'],['Broccoli Salad','6 cups small broccoli florets','1 cup shredded carrots'],['Cucumber Salad','4 sliced cucumbers','2 cups cherry tomatoes'],['Cabbage Slaw','6 cups shredded cabbage','2 cups shredded carrots'],['Quinoa Veggie Salad','3 cups cooked quinoa','3 cups chopped vegetables'],['Green Bean Salad','1 1/2 lb trimmed green beans','2 cups cherry tomatoes'],['Mediterranean Chopped Salad','3 cups diced cucumber','3 cups diced tomatoes']
] as const;
const saladFlavors=[
 ['Lemon Herb','3 tbsp lemon juice','1/3 cup chopped parsley'],['Balsamic','3 tbsp balsamic vinegar','1 tsp Dijon mustard'],['Honey Dijon','2 tbsp Dijon mustard','1 tbsp honey'],['Citrus Ginger','3 tbsp orange juice','1 tbsp grated ginger'],['Garlic Parmesan','2 garlic cloves, minced','1/2 cup grated Parmesan'],['Avocado Lime','1 diced avocado','3 tbsp lime juice'],['Sesame','2 tbsp rice vinegar','1 tsp sesame oil'],['Greek','3/4 cup crumbled feta','1/2 cup sliced olives'],['Apple Walnut','1 diced apple','1/2 cup walnuts'],['Roasted Pepper','1 cup roasted peppers','2 tbsp red wine vinegar']
] as const;
const salads:MealCollectionRecipe[]=[];
saladBases.forEach((b,bi)=>saladFlavors.forEach((f,fi)=>salads.push({title:`${f[0]} ${b[0]}`,tag:'Salads & Veggies',collection:'Salads & Veggies',time:'15–30 min',note:'Vegetable-forward recipe with a measured dressing and precise preparation.',mealType:'Lunch',diet:'Vegetarian',budget:'$',category:'Salads & Veggies',servings:'4',ingredients:[b[1],b[2],f[1],f[2],'3 tbsp extra-virgin olive oil','1/2 tsp kosher salt','1/4 tsp black pepper'],method:[
 'Wash and thoroughly dry all produce; trim and cut ingredients into bite-size pieces of similar size.',
 `Prepare ${b[1]} and ${b[2]}; cool any roasted or blanched vegetables before combining with delicate greens.`,
 `Whisk ${f[1]} and ${f[2]} with olive oil, salt and pepper until the dressing is emulsified.`,
 'Place the salad base in a large bowl and add half the dressing; toss gently from the bottom upward.',
 'Taste one dressed piece, then add only enough remaining dressing to coat without making the vegetables soggy.',
 'Divide among four plates and serve promptly; keep unused dressing refrigerated.'
]})));

const fruitBases=[
 ['Fresh Fruit Cup','2 cups strawberries, hulled and quartered','2 cups seedless grapes'],['Melon Mix','2 cups cantaloupe cubes','2 cups honeydew cubes'],['Berry Bowl','2 cups strawberries','2 cups blueberries'],['Tropical Fruit Bowl','2 cups pineapple chunks','2 cups mango cubes'],['Citrus Fruit Salad','2 oranges, segmented','2 grapefruits, segmented'],['Apple Pear Mix','2 diced apples','2 diced pears'],['Stone Fruit Bowl','3 sliced peaches','3 sliced plums'],['Banana Berry Mix','3 sliced bananas','2 cups mixed berries'],['Pineapple Melon Mix','2 cups pineapple','2 cups watermelon'],['Grape Berry Mix','2 cups seedless grapes','2 cups mixed berries']
] as const;
const fruitFlavors=[
 ['Honey Lime','2 tbsp lime juice','1 tbsp honey'],['Mint Citrus','2 tbsp orange juice','2 tbsp chopped mint'],['Vanilla Yogurt','1 cup Greek yogurt','1 tsp vanilla'],['Coconut Lime','1/2 cup toasted coconut','2 tbsp lime juice'],['Ginger Honey','1 tsp grated ginger','1 tbsp honey'],['Berry Chia','2 tbsp chia seeds','1/2 cup raspberries'],['Orange Cinnamon','3 tbsp orange juice','1/4 tsp cinnamon'],['Lemon Mint','2 tbsp lemon juice','2 tbsp chopped mint'],['Maple Pecan','1 tbsp maple syrup','1/3 cup chopped pecans'],['Creamy Citrus','3/4 cup plain yogurt','2 tbsp orange juice']
] as const;
const fruits:MealCollectionRecipe[]=[];
fruitBases.forEach((b,bi)=>fruitFlavors.forEach((f,fi)=>fruits.push({title:`${f[0]} ${b[0]}`,tag:'Fruit Mixes',collection:'Fruit Mixes',time:'10–20 min',note:'Fresh fruit combination with measured dressing and storage guidance.',mealType:'Snack',diet:'Vegetarian',budget:'$',category:'Fruit Mixes',servings:'4',ingredients:[b[1],b[2],f[1],f[2],'1 tsp finely grated citrus zest (optional)'],method:[
 'Rinse fruit under cool running water and dry thoroughly before cutting; use a clean cutting board and knife.',
 `Prepare ${b[1]} and ${b[2]}, removing pits, peels, stems or seeds as appropriate.`,
 `Whisk or stir ${f[1]} with ${f[2]} until evenly combined.`,
 'Place fruit in a large bowl and gently fold with the dressing so delicate pieces stay intact.',
 'Taste and add the optional citrus zest if a brighter finish is desired; do not add unnecessary sugar before tasting.',
 'Serve immediately for best texture, or cover and refrigerate promptly; for mixtures containing banana, add banana shortly before serving.'
]})));

export const mealCollectionVault:MealCollectionRecipe[]=[...breakfasts,...lunches,...salads,...fruits];
export const mealCollectionCounts=mealCollectionVault.reduce((a,r)=>{a[r.collection]=(a[r.collection]||0)+1;return a},{} as Record<string,number>);
