import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Complete list of slug corrections - Direct FR to EN translations
const fixes: Array<{ fr: string; en: string }> = [
  // Cookies & Biscuits
  { fr: 'biscuits-beurre-arachides', en: 'peanut-butter-cookies' },
  { fr: 'biscuits-chocolat-moelleux', en: 'soft-chocolate-cookies' },
  { fr: 'galette-a-la-melasse', en: 'molasses-cookies' },
  { fr: 'recette-biscuit-pepite-chocolat', en: 'chocolate-chip-cookies' },

  // Breads & Pastries
  { fr: 'pain-dore', en: 'french-toast' },
  { fr: 'pain-de-viande', en: 'meatloaf' },
  { fr: 'pain-de-viande-mijoteuse', en: 'slow-cooker-meatloaf' },
  { fr: 'pain-de-viande-vegetarien', en: 'vegetarian-meatloaf' },
  { fr: 'miche-de-pain', en: 'bread-loaf' },
  { fr: 'pain-gumbo', en: 'gumbo-bread' },
  { fr: 'pain-naan-au-boeuf', en: 'beef-naan-bread' },
  { fr: 'pain-naan-tartine-de-caramel-sale', en: 'salted-caramel-naan-toast' },

  // Bubble Tea & Drinks
  { fr: 'bubble-tea-maison', en: 'homemade-bubble-tea' },
  { fr: 'caramel-frappuccino-starbucks-maison', en: 'homemade-starbucks-caramel-frappuccino' },
  { fr: 'chocolat-chaud', en: 'hot-chocolate' },
  { fr: 'orange-julep', en: 'orange-julep' },

  // Burgers
  { fr: 'burger-vegetarien-au-steak-de-haricots', en: 'vegetarian-bean-burger' },

  // Pasta & Cannelloni
  { fr: 'cannellonis-au-veau-gratines', en: 'veal-cannelloni-gratin' },
  { fr: 'lasagnes-aux-legumes-et-ricotta', en: 'vegetable-ricotta-lasagna' },
  { fr: 'macaroni-chinois', en: 'chinese-macaroni' },
  { fr: 'pates-a-la-creme-avocat', en: 'avocado-cream-pasta' },

  // Soups
  { fr: 'bouillon-soupe-won-ton', en: 'wonton-soup-broth' },
  { fr: 'creme-de-champignons', en: 'cream-of-mushroom-soup' },
  { fr: 'creme-de-champignons-2', en: 'cream-of-mushroom-soup-2' },
  { fr: 'potage-aux-asperges', en: 'asparagus-soup' },
  { fr: 'potage-aux-poireaux', en: 'leek-soup' },
  { fr: 'potage-carotte-patate-douce', en: 'carrot-sweet-potato-soup' },
  { fr: 'potage-de-courge-butternut', en: 'butternut-squash-soup' },
  { fr: 'soupe-de-lentilles-corail-epicee', en: 'spicy-red-lentil-soup' },
  { fr: 'soupe-won-ton', en: 'wonton-soup' },

  // Cakes & Desserts
  { fr: 'croustade-aux-pommes', en: 'apple-crisp' },
  { fr: 'croustade-aux-pommes-2', en: 'apple-crisp-2' },
  { fr: 'gateau-aux-pommes-moelleux', en: 'soft-apple-cake' },
  { fr: 'gateau-a-lorange', en: 'orange-cake' },
  { fr: 'gateau-roule', en: 'swiss-roll' },
  { fr: 'gateau-roule-moelleux', en: 'soft-swiss-roll' },
  { fr: 'tartelettes-aux-pommes', en: 'apple-tarts' },
  { fr: 'tarte-aux-legumes-du-soleil', en: 'summer-vegetable-tart' },
  { fr: 'tarte-de-noel', en: 'christmas-pie' },
  { fr: 'queue-de-castor-maison', en: 'homemade-beaver-tail' },
  { fr: 'sucre-d-orge', en: 'candy-cane' },

  // Curry & International
  { fr: 'curry-de-pois-chiches-et-lait-de-coco', en: 'chickpea-coconut-curry' },
  { fr: 'poulet-au-curry', en: 'curry-chicken' },

  // Beans & Legumes
  { fr: 'feves-au-lard', en: 'baked-beans' },

  // Pork
  { fr: 'filet-de-porc', en: 'pork-tenderloin' },
  { fr: 'cotelette-de-porc-bbq', en: 'bbq-pork-chops' },

  // Fish & Seafood
  { fr: 'morue-au-four', en: 'baked-cod' },
  { fr: 'coquilles-saint-jacques', en: 'scallops' },
  { fr: 'pate-au-saumon', en: 'salmon-pie' },
  { fr: 'saumon-a-la-creme', en: 'creamy-salmon' },

  // Mexican
  { fr: 'nachos-maison', en: 'homemade-nachos' },
  { fr: 'recette-de-fajitas', en: 'fajitas' },

  // Condiments & Sauces
  { fr: 'relish-maison', en: 'homemade-relish' },
  { fr: 'sauce-pizza-maison', en: 'homemade-pizza-sauce' },
  { fr: 'sauce-bbq-maison', en: 'homemade-bbq-sauce' },
  { fr: 'sauce-cremeuse-a-la-lime', en: 'creamy-lime-sauce' },
  { fr: 'sauce-piquante-habanero', en: 'habanero-hot-sauce' },
  { fr: 'ketchup-maison', en: 'homemade-ketchup' },
  { fr: 'mayonnaise-maison', en: 'homemade-mayonnaise' },
  { fr: 'trempette-au-ketchup', en: 'ketchup-dip' },
  { fr: 'trempette-aux-epinards', en: 'spinach-dip' },
  { fr: 'trempette-fromage-a-la-creme', en: 'cream-cheese-dip' },

  // Quebec Traditional
  { fr: 'tourtiere-quebecoise', en: 'quebec-meat-pie' },
  { fr: 'pate-chinois-traditionnel', en: 'shepherds-pie' },
  { fr: 'soupe-aux-pois', en: 'pea-soup' },
  { fr: 'soupe-aux-pois-mijoteuse', en: 'slow-cooker-pea-soup' },
  { fr: 'bouchees-a-lerable', en: 'maple-bites' },
  { fr: 'saucisses-dans-le-sirop', en: 'sausages-in-maple-syrup' },
  { fr: 'poutine-mexicaine', en: 'mexican-poutine' },

  // Chicken
  { fr: 'doigts-de-poulet-croustillants', en: 'crispy-chicken-fingers' },
  { fr: 'dumplings-au-poulet', en: 'chicken-dumplings' },
  { fr: 'pate-au-poulet', en: 'chicken-pot-pie' },
  { fr: 'poitrine-de-poulet-a-lair-fryer', en: 'air-fryer-chicken-breast' },
  { fr: 'poitrine-de-poulet-au-four', en: 'baked-chicken-breast' },
  { fr: 'poitrine-poulet-mijoteuse', en: 'slow-cooker-chicken-breast' },
  { fr: 'poulet-au-lait-de-coco', en: 'coconut-chicken' },
  { fr: 'poulet-aux-canneberges', en: 'cranberry-chicken' },
  { fr: 'poulet-chorizo-cremeux', en: 'creamy-chorizo-chicken' },
  { fr: 'poulet-mole', en: 'chicken-mole' },
  { fr: 'poutrine-de-poulet-pommes', en: 'apple-chicken-breast' },
  { fr: 'quesadillas-au-poulet', en: 'chicken-quesadillas' },
  { fr: 'ramen-au-poulet', en: 'chicken-ramen' },
  { fr: 'salade-cesar-poulet-bbq', en: 'bbq-chicken-caesar-salad' },
  { fr: 'sandwitch-de-poulet-pesto', en: 'pesto-chicken-sandwich' },

  // Beef
  { fr: 'cube-de-boeuf-a-la-mijoteuse', en: 'slow-cooker-beef-cubes' },
  { fr: 'roti-de-palette', en: 'blade-roast' },
  { fr: 'rwandaise-brochettes-de-viandes-grillees', en: 'rwandan-grilled-meat-skewers' },

  // Ham
  { fr: 'jambon-a-la-biere-a-la-mijoteuse', en: 'slow-cooker-beer-ham' },
  { fr: 'jambon-a-la-mijoteuse', en: 'slow-cooker-ham' },

  // Vegetables & Sides
  { fr: 'ble-d-inde', en: 'corn-on-the-cob' },
  { fr: 'petites-patates-aux-champignons-et-beurre-a-lail', en: 'garlic-butter-mushroom-potatoes' },
  { fr: 'patates-au-four-slopppy-joe', en: 'sloppy-joe-baked-potatoes' },
  { fr: 'poivrons-farcis-bacon', en: 'bacon-stuffed-peppers' },
  { fr: 'gratin-de-chou-fleur', en: 'cauliflower-gratin' },
  { fr: 'deluxe-potatoes-mcdo', en: 'mcdonalds-deluxe-potatoes' },

  // Salads
  { fr: 'salade-de-chou-rouge', en: 'red-cabbage-slaw' },
  { fr: 'salade-de-cocombre', en: 'cucumber-salad' },
  { fr: 'salade-de-kale-aux-raisins', en: 'kale-grape-salad' },
  { fr: 'salade-de-macaroni-jambon', en: 'ham-macaroni-salad' },
  { fr: 'salade-de-macaroni-maman', en: 'moms-macaroni-salad' },
  { fr: 'salade-grecque-delicieuse', en: 'greek-salad' },

  // Crepes & Pancakes
  { fr: 'crepe-proteinee', en: 'protein-pancake' },
  { fr: 'crepe-allemande-pfannkuchen', en: 'german-pancake' },
  { fr: 'crepes-minces', en: 'thin-crepes' },
  { fr: 'gaufres-maison', en: 'homemade-waffles' },

  // Breakfast
  { fr: 'casserole-a-dejeuner', en: 'breakfast-casserole' },
  { fr: 'omelette-au-four', en: 'baked-omelette' },

  // Frosting & Toppings
  { fr: 'cremage-pour-les-gateaux-de-fete', en: 'birthday-cake-frosting' },

  // Dough & Crusts
  { fr: 'pate-a-pizza', en: 'pizza-dough' },
  { fr: 'pate-a-tarte', en: 'pie-crust' },

  // Misc
  { fr: 'blanc-manger-traditionnel', en: 'traditional-blancmange' },
  { fr: 'riz-basmati-epice-et-parfume', en: 'spiced-basmati-rice' },
  { fr: 'risotto-aux-champignons-cremeux', en: 'creamy-mushroom-risotto' },
  { fr: 'soupe-a-loignon-francaise', en: 'french-onion-soup' },
  { fr: 'soupe-au-chou', en: 'cabbage-soup' },
  { fr: 'soupe-aux-legumes', en: 'vegetable-soup' },
  { fr: 'soupe-de-tomates-roties', en: 'roasted-tomato-soup' },
  { fr: 'soupe-poulet-et-nouilles', en: 'chicken-noodle-soup' },
  { fr: 'pouding-aux-bleuets', en: 'blueberry-pudding' },
  { fr: 'pithiviers-feuillete', en: 'pithivier-pastry' },
  { fr: 'nigiri-au-saumon', en: 'salmon-nigiri' },
  { fr: 'falafels-au-four', en: 'baked-falafels' },
  { fr: 'ceviche-peruvien', en: 'peruvian-ceviche' },
  { fr: 'croissants-aux-amandes', en: 'almond-croissants' },
  { fr: 'cupcakes-au-chocolat', en: 'chocolate-cupcakes' },
  { fr: 'muffins-chocolat-banane', en: 'chocolate-banana-muffins' },
  { fr: 'carres-aux-framboises', en: 'raspberry-squares' },
  { fr: 'gateau-dans-une-tasse', en: 'mug-cake' },
  { fr: 'gateau-blanc-facile', en: 'easy-white-cake' },
  { fr: 'gateau-aux-pommes-traditionnel', en: 'traditional-apple-cake' },
  { fr: 'pizza-aux-legumes', en: 'vegetable-pizza' },
  { fr: 'gaufre-belge', en: 'belgian-waffle' },
  { fr: 'couscous-vegetarien', en: 'vegetarian-couscous' },
  { fr: 'pain-aux-bananes', en: 'banana-bread' },
  { fr: 'salade-de-brocoli', en: 'broccoli-salad' },
  { fr: 'salade-de-quinoa', en: 'quinoa-salad' },
  { fr: 'sauce-bechamel', en: 'bechamel-sauce' },
  { fr: 'soupe-minestrone', en: 'minestrone-soup' },
];

async function fix() {
  console.log('='.repeat(50));
  console.log('Fixing English Slugs');
  console.log('='.repeat(50));
  console.log(`Total fixes: ${fixes.length}\n`);

  let successCount = 0;
  let errorCount = 0;
  let notFoundCount = 0;

  for (const { fr, en } of fixes) {
    const { data: recipe } = await supabase
      .from('recipes')
      .select('id')
      .eq('slug', fr)
      .single();

    if (recipe) {
      const { error } = await supabase
        .from('recipe_translations')
        .update({ slug_en: en })
        .eq('recipe_id', recipe.id)
        .eq('locale', 'en');

      if (error) {
        console.log(`ERROR ${fr}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`OK: ${fr} -> ${en}`);
        successCount++;
      }
    } else {
      console.log(`NOT FOUND: ${fr}`);
      notFoundCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`Done: ${successCount} success, ${errorCount} errors, ${notFoundCount} not found`);
}

fix().catch(console.error);
