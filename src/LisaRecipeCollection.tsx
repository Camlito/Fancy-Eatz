import { useMemo, useState } from 'react';
const titles = ["Apple Pie","Apple Turnovers","Bacon, Sausage & Ham Omelet","Baked Banana Pudding","Baked Beans","Baked Macaroni & Cheese","Baked Pork Chops","Baked Spaghetti","Baked White Rice, Early Peas & Cheese","Baked Ziti","Baked Zucchini","Banana Pudding","Barbecue Ribs","Beef Steak","Beef Stew","Beef Tacos","Black-Eyed Peas","Blueberry Muffins","Blueberry Pancakes","Breakfast Quiche","Brussels Sprouts","Butter Beans","Cauliflower","Chicken Alfredo","Chicken Noodle Soup","Chicken Pot Pie","Chicken Salad","Chili","Chocolate Cake","Chocolate Covered Strawberries","Cinnamon Rolls","Cod Fish","Coleslaw","Collard Greens with Ham Hocks","Cookie Brownie","Corn Stuffed Cornbread","Corn with Butter Sauce","Cornbread Dressing","Cornish Hen","Crab Legs","Crab Salad","Deviled Eggs","Enchiladas","French Toast","Fried Catfish","Fried Chicken","Fruit Salad","Gourmet Butter","Gourmet Popcorn","Ground Beef Vegetable Soup","Halibut","Hamburger","Homemade Biscuits","Homemade Ice Cream","Honey Baked Ham","Hush Puppies","Jumbo Stuffed Shells","Lamb Chops","Lasagna","Lemon Meringue Cheesecake","Lemon Pepper Wings","Liver and Onions","Lobster Tails","Manicotti","Meat Lovers Pizza","Meatballs","Oxtail","Pasta Salad","Peach Cobbler","Potato Soufflé","Pound Cake","Pulled Pork","Quesadillas","Rib Tips","Rice & Peas Casserole","Rigatoni","Roasted Turkey","Scalloped Potatoes","Scones","Seafood Boil","Shrimp Fried Rice","Southern Cabbage","Southern Green Beans","Southern Style Dressing","Spaghetti","Spinach Salad","Squash","Squash Casserole","Strawberry Pancakes","Street Corn","Stuffed Peppers","Sweet Potato Casserole","Sweet Potato Pie","Sweet Potato Soufflé","Tuna Salad"];
const pdf = 'https://drive.google.com/file/d/1FdEh8jvzhyfwXVgxwOUzZ69UTmlGCdp5/preview';
export default function LisaRecipeCollection() {
 const [query,setQuery]=useState('');
 const [selected,setSelected]=useState<number|null>(null);
 const matches=useMemo(()=>titles.map((title,index)=>({title,index})).filter(x=>x.title.toLowerCase().includes(query.trim().toLowerCase())),[query]);
 return <section className="panel" style={{margin:'24px 0',padding:24,borderRadius:20}}>
  <p className="eyebrow">LISA'S ORIGINAL RECIPE COLLECTION</p>
  <h2>Classic & Signature Recipe Cards</h2>
  <p>Explore all 95 illustrated recipe-card pages from Lisa's original Fancy Eatz cookbook. Most cards feature two ways to cook a dish: Classic and Fancy Eatz Signature. Open a card to read its original ingredients, directions and food photography.</p>
  <label style={{display:'block',margin:'18px 0'}}><span style={{display:'block',marginBottom:6}}>Search Lisa's recipe cards</span><input style={{width:'100%',padding:12,borderRadius:10}} value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search apple pie, chicken, seafood, desserts..." /></label>
  <p>{matches.length} of 95 recipe-card pages</p>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(190px,1fr))',gap:10,maxHeight:440,overflowY:'auto',padding:'4px 0'}}>
   {matches.map(({title,index})=><button key={index} type="button" onClick={()=>setSelected(index)} style={{textAlign:'left',padding:14,borderRadius:12,border:'1px solid #c9b8a1',background:selected===index?'#fff0d9':'transparent',color:'inherit',cursor:'pointer'}}><strong>{title}</strong><span style={{display:'block',fontSize:12,opacity:.75,marginTop:5}}>Card {index+1} · Classic + Signature</span></button>)}
  </div>
  {selected!==null&&<div style={{marginTop:24}}>
   <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',gap:12,flexWrap:'wrap'}}><h3 style={{margin:0}}>{titles[selected]}</h3><button type="button" onClick={()=>setSelected(null)}>Close recipe</button></div>
   <p>Original illustrated card {selected+1} of 95. Scroll within the document to view ingredients, steps, and photos.</p>
   <iframe title={titles[selected]+' original recipe card'} src={pdf+'#page='+(selected+1)} style={{width:'100%',height:'min(75vh,740px)',border:'1px solid #d9cbb7',borderRadius:12}} loading="lazy" />
   <p><a href={'https://drive.google.com/file/d/1FdEh8jvzhyfwXVgxwOUzZ69UTmlGCdp5/view'} target="_blank" rel="noreferrer">Open complete original cookbook in Google Drive</a></p>
  </div>}
 </section>;
}
