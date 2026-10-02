import type { DrinkRecipe } from './drinks';

type ExpandedDrink = DrinkRecipe & { section: 'Teas'|'Coffees'|'Punches'|'Wine Drinks' };

const fruits=['Peach','Strawberry','Raspberry','Blueberry','Blackberry','Mango','Pineapple','Cherry','Apple','Pear'];
const accents=['Lemon','Vanilla','Mint','Ginger','Honey','Cinnamon','Orange','Coconut','Lavender','Caramel'];

const teas:ExpandedDrink[]=[];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
  const green=(i+j)%2===0;
  teas.push({title:`${fruit} ${accent} ${green?'Green':'Black'} Tea`,section:'Teas',category:'Lemonades & Teas',
    ingredients:[`2 tea bags ${green?'green':'black'} tea`,'2 cups filtered water',`1/2 cup ${fruit.toLowerCase()} pieces or 2 oz purée`,`1 tsp ${accent.toLowerCase()} flavor component`,'1–2 tsp honey or sugar, optional','1 cup ice'],
    method:['Bring the water just to a boil, then remove from heat.','Steep the tea bags 3–5 minutes, then remove them without squeezing.','Stir in the fruit and accent flavor while the tea is warm.','Sweeten to taste, then chill completely.','Fill a tall glass with ice, pour in the tea and garnish before serving.'],
    glassware:'Tall iced-tea glass',garnish:`${fruit} slice`});
}));

const coffees:ExpandedDrink[]=[];
const coffeeBases=['espresso','cold brew concentrate','strong brewed coffee','decaf espresso','dark roast coffee'];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
  const iced=(i+j)%2===0;
  coffees.push({title:`${fruit} ${accent} ${iced?'Iced ':''}Coffee`,section:'Coffees',category:'Coffee & Café',
    ingredients:[`2 oz ${coffeeBases[(i+j)%coffeeBases.length]}`,'6 oz milk or unsweetened plant milk',`1 tbsp ${accent.toLowerCase()} syrup`,`1 tbsp ${fruit.toLowerCase()} purée or syrup`,iced?'1 cup ice':'1/4 cup hot milk foam'],
    method:['Prepare the coffee or espresso and measure it into a heat-safe cup.','Stir in the accent syrup and fruit flavor until fully combined.','Add the milk and stir gently.','Serve over ice if iced, or top with warm milk foam for the hot version.','Taste for balance and garnish lightly before serving.'],
    glassware:iced?'Tall café glass':'Coffee mug',garnish:`${accent} finish`});
}));

const punches:ExpandedDrink[]=[];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
  punches.push({title:`${fruit} ${accent} Celebration Punch`,section:'Punches',category:'Mocktails & Punches',
    ingredients:[`2 cups ${fruit.toLowerCase()} juice or nectar`,'2 cups chilled sparkling water','1 cup white grape juice',`1/4 cup fresh ${accent==='Mint'?'lime':accent==='Ginger'?'lemon':accent.toLowerCase()} component`,'2 cups ice','1 cup sliced fresh fruit'],
    method:['Chill all liquid ingredients before assembling the punch.','Combine the fruit juice, white grape juice and accent component in a large pitcher.','Add sliced fruit and ice just before serving.','Slowly pour in sparkling water and stir once or twice to preserve bubbles.','Taste, adjust sweetness if needed and serve immediately.'],
    glassware:'Punch glass',garnish:`${fruit} and citrus slices`});
}));

const wineBases=['dry red wine','dry white wine','rosé wine','sparkling wine','non-alcoholic wine'];
const wine:ExpandedDrink[]=[];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
  const base=wineBases[(i+j)%wineBases.length];
  wine.push({title:`${fruit} ${accent} Wine Spritz`,section:'Wine Drinks',category:'Cocktails',
    ingredients:[`4 oz ${base}`,`1 oz ${fruit.toLowerCase()} juice or purée`,'1 oz chilled sparkling water',`1/4 oz ${accent.toLowerCase()} syrup or infusion`,'ice, optional'],
    method:['Chill the wine, fruit component and sparkling water thoroughly.','Add the fruit component and accent syrup to a wine glass and stir gently.','Pour in the wine and mix with one slow turn of a bar spoon.','Top with sparkling water; add ice only if desired.','Garnish and serve immediately.'],
    glassware:'Wine glass',garnish:`${fruit} slice`});
}));

export const expandedDrinkVault:ExpandedDrink[]=[...teas,...coffees,...punches,...wine];
export const expandedDrinkCounts={Teas:teas.length,Coffees:coffees.length,Punches:punches.length,'Wine Drinks':wine.length,Total:teas.length+coffees.length+punches.length+wine.length};
