import type { DrinkRecipe } from './drinks';

const fruits=['Strawberry','Mango','Peach','Blueberry','Raspberry','Pineapple','Cherry','Blackberry','Watermelon','Passion Fruit'];
const accents=['Lime','Lemon','Mint','Ginger','Vanilla','Coconut','Honey','Basil','Orange','Cinnamon'];

const smoothieBases=['banana','Greek yogurt','rolled oats','chia seeds','avocado','pineapple','mango','peach','mixed berries','spinach'];
const smoothie:DrinkRecipe[]=[];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
 const green=(i+j)%5===0;
 smoothie.push({title:`${fruit} ${accent} ${green?'Green ':''}Smoothie`,category:'Smoothies',ingredients:[`1 1/2 cups ${fruit.toLowerCase()} pieces, fresh or frozen`,`1 ${smoothieBases[(i+j)%smoothieBases.length]}`,`1 cup milk or unsweetened plant milk`,`1/2 cup plain Greek yogurt`,`1 tbsp ${accent.toLowerCase()} flavor component`, '1 cup ice'],method:['Add milk and yogurt to the blender first so the blades move freely.','Add fruit, the secondary ingredient and accent flavor; top with ice.','Blend on low for 15 seconds, then high for 30–45 seconds until completely smooth.','Stop and scrape the sides if needed; add milk 1 tablespoon at a time only if the mixture is too thick.','Pour immediately into a chilled glass and serve.'],glassware:'Tall glass',garnish:`${fruit} slice or ${accent.toLowerCase()}`});
}));

const mockBases=['Sparkling Water','Ginger Ale','Lemon-Lime Soda','Coconut Water','Iced Green Tea','Club Soda','Tonic Water','Black Tea','White Grape Juice','Pineapple Juice'];
const mocktails:DrinkRecipe[]=[];
fruits.forEach((fruit,i)=>accents.forEach((accent,j)=>{
 mocktails.push({title:`${fruit} ${accent} Sparkler`,category:'Mocktails & Punches',ingredients:[`2 oz ${fruit.toLowerCase()} juice or purée`,`3/4 oz fresh ${accent==='Mint'||accent==='Basil'||accent==='Vanilla'||accent==='Cinnamon'?'lemon':accent.toLowerCase()} juice`,`4 oz chilled ${mockBases[(i+j)%mockBases.length].toLowerCase()}`,'1/2 oz simple syrup, optional','1 cup ice'],method:['Fill a tall glass with fresh ice.','Add fruit juice or purée and fresh citrus; stir with optional simple syrup.','Slowly add the chilled sparkling or tea base to preserve carbonation where applicable.','Stir gently from the bottom upward two or three times.','Taste for balance and garnish before serving.'],glassware:'Highball glass',garnish:`${fruit} and ${accent.toLowerCase()}`});
}));

const cafeBases=['Latte','Iced Latte','Cold Brew','Iced Coffee','Cappuccino','Café Au Lait','Black Tea Latte','Green Tea Latte','Hot Chocolate','Iced Tea'];
const cafe:DrinkRecipe[]=[];
accents.forEach((accent,i)=>fruits.forEach((fruit,j)=>{
 const base=cafeBases[(i+j)%cafeBases.length]; const coffee=/Latte|Cold Brew|Coffee|Cappuccino|Café/.test(base)&&!/(Tea)/.test(base);
 cafe.push({title:`${accent} ${fruit} ${base}`,category:/Tea/.test(base)?'Lemonades & Teas':'Coffee & Café',ingredients:[coffee?'2 shots espresso or 6 oz strong coffee':/Chocolate/.test(base)?'1 1/2 tbsp cocoa powder':'2 tea bags',coffee?'1 cup milk':/Chocolate/.test(base)?'1 cup milk':'1 1/2 cups water',`1 tbsp ${accent.toLowerCase()} syrup`,`1 tbsp ${fruit.toLowerCase()} purée or syrup`,/Iced|Cold/.test(base)?'1 cup ice':'1 tsp honey, optional'],method:[coffee?'Brew the espresso or strong coffee fresh.':/Chocolate/.test(base)?'Whisk cocoa with 2 tablespoons warm milk until smooth.':'Steep tea according to package strength, then remove the tea bags.','Stir in the accent syrup and fruit component until evenly combined.',/Iced|Cold/.test(base)?'Fill the serving glass with ice and add the prepared drink.':'Warm or steam the milk without boiling and combine with the prepared base.','Taste before adding optional sweetener; adjust with a small amount only if needed.','Serve immediately in the listed glassware.'],glassware:/Iced|Cold/.test(base)?'Tall glass':'Mug',garnish:`${accent} finish`});
}));

const spirits=['Vodka','Gin','White Rum','Tequila','Bourbon','Brandy','Dark Rum','Rye Whiskey','Cognac','Blended Whiskey'];
const cocktail:DrinkRecipe[]=[];
spirits.forEach((spirit,i)=>fruits.forEach((fruit,j)=>{
 const citrus=accents[(i+j)%accents.length]; const juice=/Mint|Basil|Vanilla|Cinnamon/.test(citrus)?'lemon':citrus.toLowerCase();
 cocktail.push({title:`${fruit} ${citrus} ${spirit} Cocktail`,category:(i+j)%4===0?'Martinis':'Cocktails',ingredients:[`1 1/2 oz ${spirit.toLowerCase()}`,`1 oz ${fruit.toLowerCase()} juice or purée`,`3/4 oz fresh ${juice} juice`,'1/2 oz simple syrup','1 cup ice'],method:['Chill the serving glass or fill it with fresh ice as appropriate.','Add spirit, fruit, citrus and simple syrup to a shaker filled with ice.','Shake firmly for 10–15 seconds until the shaker is cold.','Double-strain into the serving glass for puréed fruit, or strain normally for clear juice.','Garnish and serve as a standard single drink; consume responsibly.'],glassware:(i+j)%4===0?'Martini glass':'Rocks glass',garnish:`${fruit} and ${citrus.toLowerCase()}`});
}));

export const drinkVault:DrinkRecipe[]=[...cocktail,...mocktails,...smoothie,...cafe];
export const drinkVaultCounts=drinkVault.reduce((a,d)=>{a[d.category]=(a[d.category]||0)+1;return a},{} as Record<string,number>);
