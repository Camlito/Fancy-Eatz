export type StyleVaultRecipe={title:string;tag:string;style:string;time:string;note:string;mealType:string;diet:string;budget:string;category:string;servings:string;ingredients:string[];method:string[]};

const proteins=[
 ['Chicken Breast','4 boneless chicken breasts','165°F'],['Chicken Thighs','8 boneless chicken thighs','165°F'],['Salmon','4 salmon fillets','145°F'],['Shrimp','1 1/2 lb peeled deveined shrimp','opaque and just firm'],['Steak','4 steaks, 8 oz each','desired doneness'],['Pork Chops','4 pork chops','145°F'],['Turkey Cutlets','4 turkey cutlets','165°F'],['Cod','4 cod fillets','145°F'],['Portobello Mushrooms','8 large portobello caps','tender'],['Cauliflower Steaks','2 large cauliflower heads, cut into 4 steaks','fork-tender']
] as const;
const flavors=[
 ['Garlic Herb','4 garlic cloves, minced','2 tbsp chopped parsley','1 lemon'],['Smoky Paprika','2 tsp smoked paprika','1 tsp garlic powder','1 lime'],['Honey Dijon','2 tbsp Dijon mustard','1 1/2 tbsp honey','1 tbsp apple cider vinegar'],['Lemon Pepper','2 tsp cracked black pepper','1 tbsp lemon zest','2 tbsp lemon juice'],['Rosemary Balsamic','2 tsp chopped rosemary','3 tbsp balsamic vinegar','1 tbsp honey'],['Cajun','2 tsp Cajun seasoning','1 tsp garlic powder','1 lemon'],['Maple Mustard','2 tbsp Dijon mustard','1 1/2 tbsp maple syrup','1 tbsp lemon juice'],['Chimichurri','1/2 cup chopped parsley','2 tbsp red wine vinegar','2 garlic cloves, minced'],['Mediterranean','1 tsp oregano','1 tsp paprika','2 tbsp lemon juice'],['Ginger Soy','2 tbsp low-sodium soy sauce','1 tbsp grated ginger','1 tsp sesame oil']
] as const;
const makeSavory=(style:string,category:string,tag:string,methodKind:'grill'|'family'|'fine'|'chef')=>{
 const out:StyleVaultRecipe[]=[];
 proteins.forEach((p,pi)=>flavors.forEach((f,fi)=>{
  const veg=['broccoli florets','green beans','asparagus','bell peppers','zucchini'][fi%5];
  const starch=['baby potatoes','jasmine rice','orzo','sweet potatoes','couscous'][pi%5];
  const title=`${f[0]} ${p[0]}${methodKind==='grill'?' on the Grill':methodKind==='fine'?' with Chef-Plated Vegetables':methodKind==='chef'?' with Pan Sauce':' Dinner'}`;
  const ingredients=[p[1],f[1],f[2],f[3],`3 cups ${veg}`,`2 cups cooked ${starch}`,'2 tbsp olive oil','1 tsp kosher salt','1/2 tsp black pepper'];
  let method:string[];
  if(methodKind==='grill') method=[
   'Preheat the grill to medium-high (about 400–450°F). Clean and lightly oil the grates.',
   `Whisk ${f[1]}, ${f[2]}, ${f[3]}, 1 tbsp olive oil, salt and pepper. Coat the ${p[0].toLowerCase()} evenly; reserve no marinade that has touched raw meat.`,
   `Toss the ${veg} with the remaining olive oil and a pinch of salt. Place vegetables in a grill basket or on secure skewers.`,
   `Grill the ${p[0].toLowerCase()}, turning as needed for even browning, until the center reaches ${p[2]}. Grill vegetables until browned and tender-crisp.`,
   `Warm the cooked ${starch} while the grilled items rest for 5 minutes.`,
   'Divide the starch among four plates, add vegetables and the grilled main ingredient, then finish with a fresh squeeze of citrus or herbs if available.'
  ]; else if(methodKind==='family') method=[
   'Heat oven to 425°F. Line a large sheet pan for easier cleanup.',
   `Whisk ${f[1]}, ${f[2]}, ${f[3]}, olive oil, salt and pepper; coat the ${p[0].toLowerCase()} evenly.`,
   `Spread the ${p[0].toLowerCase()} and ${veg} in a single layer, leaving space so the food roasts instead of steaming.`,
   `Roast, turning vegetables once, until the main ingredient reaches ${p[2]} and the vegetables are tender.`,
   `Warm the cooked ${starch}; rest the cooked main ingredient for 5 minutes where appropriate.`,
   'Serve family-style with pan juices spooned over the top; taste and adjust salt, pepper and acidity before serving.'
  ]; else if(methodKind==='fine') method=[
   `Heat oven to 400°F. Pat the ${p[0].toLowerCase()} dry and season with salt and pepper.`,
   `Sear in 1 tbsp olive oil in a heavy skillet until a deep golden crust forms; finish gently in the oven until it reaches ${p[2]}, then rest.`,
   `Cook the ${veg} separately until bright and tender-crisp so its color and texture remain distinct.`,
   `Combine ${f[1]}, ${f[2]} and ${f[3]} in the skillet with 1/3 cup water; reduce over medium heat until glossy and lightly coats a spoon.`,
   `Warm the ${starch} and season it separately. Slice the rested main ingredient neatly when appropriate.`,
   'Plate starch slightly off-center, arrange vegetables with height, place the main ingredient beside them and spoon the reduced sauce around—not over—the crispest surfaces.'
  ]; else method=[
   `Organize and measure every ingredient before cooking. Pat the ${p[0].toLowerCase()} dry and season evenly.`,
   `Heat a heavy skillet over medium-high with 1 tbsp olive oil. Sear the ${p[0].toLowerCase()} until well browned and cook to ${p[2]}; remove and rest.`,
   `Add the ${veg} to the same pan and sauté until browned but still structured; remove and keep warm.`,
   `Lower heat. Add ${f[1]}, ${f[2]}, ${f[3]} and 1/2 cup water; scrape the fond and reduce until the sauce coats the back of a spoon.`,
   `Whisk in the remaining olive oil off heat for gloss. Warm and season the ${starch}.`,
   'Taste the sauce for salt, acidity and sweetness, then plate the starch, vegetables and main ingredient and finish with the pan sauce.'
  ];
  out.push({title,tag,style,time:methodKind==='family'?'35–45 min':'40–50 min',note:`${style} recipe with exact measured ingredients and a complete cooking method.`,mealType:'Dinner',diet:/Salmon|Shrimp|Cod/.test(p[0])?'Pescatarian':/Portobello|Cauliflower/.test(p[0])?'Vegetarian':'No restriction',budget:/Steak|Salmon/.test(p[0])?'$$$':'$$',category,servings:'4',ingredients,method});
 }));
 return out;
};

const pastryBases=[
 ['Vanilla Layer Cake','2 1/2 cups all-purpose flour','2 tsp baking powder','350°F','28–32 minutes'],
 ['Butter Cupcakes','2 cups all-purpose flour','1 1/2 tsp baking powder','350°F','18–22 minutes'],
 ['Shortbread Cookies','2 1/4 cups all-purpose flour','1 cup unsalted butter','325°F','16–20 minutes'],
 ['Fruit Tart','1 1/2 cups all-purpose flour','1/2 cup cold unsalted butter','375°F','22–28 minutes'],
 ['Cheesecake','2 cups graham cracker crumbs','24 oz cream cheese','325°F','50–60 minutes'],
 ['Bread Pudding','6 cups cubed brioche','2 cups whole milk','350°F','40–45 minutes'],
 ['Pound Cake','2 cups all-purpose flour','1 cup unsalted butter','325°F','60–70 minutes'],
 ['Scones','2 cups all-purpose flour','1/2 cup cold unsalted butter','400°F','16–20 minutes'],
 ['Hand Pies','2 refrigerated pie crusts','2 tbsp melted butter','400°F','20–25 minutes'],
 ['Crumb Bars','2 cups all-purpose flour','3/4 cup unsalted butter','350°F','32–38 minutes']
] as const;
const pastryFlavors=[
 ['Lemon Berry','1 tbsp lemon zest','1 cup mixed berries'],['Chocolate','1/2 cup cocoa powder','3/4 cup chocolate chips'],['Salted Caramel','1/2 cup caramel sauce','1/2 tsp flaky salt'],['Apple Cinnamon','1 1/2 cups diced apples','1 tsp cinnamon'],['Peach Vanilla','1 1/2 cups diced peaches','2 tsp vanilla'],['Raspberry','1 cup raspberries','1/3 cup raspberry preserves'],['Espresso','2 tbsp instant espresso powder','1/2 cup chocolate chips'],['Coconut','1 cup shredded coconut','1 tsp coconut extract'],['Maple Pecan','1/2 cup chopped pecans','1/3 cup maple syrup'],['Orange Cranberry','1 tbsp orange zest','1 cup cranberries']
] as const;
const pastry:StyleVaultRecipe[]=[];
pastryBases.forEach((b,bi)=>pastryFlavors.forEach((f,fi)=>{
 const wet=bi===4?'3/4 cup sugar, 3 eggs and 1 tsp vanilla':bi===5?'3 eggs, 3/4 cup sugar and 1 tsp vanilla':bi===2?'2/3 cup sugar and 1 tsp vanilla':'1 cup sugar, 2 eggs, 3/4 cup milk and 1 tsp vanilla';
 pastry.push({title:`${f[0]} ${b[0]}`,tag:'Pastry Chef',style:'Pastry Chef',time:'45–90 min',note:'Pastry Chef collection recipe with measured ingredients, temperature and doneness cues.',mealType:'Dessert',diet:'Vegetarian',budget:'$$',category:'Pastry',servings:'8',ingredients:[b[1],b[2],wet,f[1],f[2],'1/2 tsp fine salt'],method:[
  `Heat oven to ${b[3]}. Prepare the appropriate pan with butter and parchment where practical.`,
  `Measure ${b[1]}, ${b[2]} and salt accurately. Keep butter cold for pastry-style doughs and softened for creamed batters.`,
  `Build the base using ${wet}; mix only until the texture is even, then incorporate ${f[1]} and ${f[2]} without overmixing.`,
  'Transfer to the prepared pan or shape evenly so portions bake at the same rate.',
  `Bake at ${b[3]} for ${b[4]}, checking the stated visual cue: golden edges and a set center; cakes should spring back lightly and cheesecakes may retain a slight center wobble.`,
  'Cool on a rack before slicing or decorating. Chill custard/cheesecake-style desserts fully before serving and finish with a complementary garnish if desired.'
 ]});
}));

export const styleRecipeVault:StyleVaultRecipe[]=[
 ...makeSavory('Fancy Dining','Fine Dining','Fancy Dining','fine'),
 ...makeSavory('Grill Master','Grill','Grill Master','grill'),
 ...makeSavory('Everyday Mom','Family Meals','Everyday Mom','family'),
 ...makeSavory("Chef's Kitchen",'Chef Techniques',"Chef's Kitchen",'chef'),
 ...pastry
];
export const styleRecipeCounts=styleRecipeVault.reduce((a,r)=>{a[r.style]=(a[r.style]||0)+1;return a},{} as Record<string,number>);
