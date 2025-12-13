/**
 * Script pour créer et peupler la table lexique_en avec des termes culinaires anglais
 * Source: Land O'Lakes Kitchen Glossary
 * Usage: npx tsx scripts/create-lexique-en.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LexiqueEnTerm {
  slug: string;
  term: string;
  definition: string;
  letter: string;
}

// Termes culinaires anglais de Land O'Lakes
const culinaryTerms: { term: string; definition: string }[] = [
  { term: "Al Dente", definition: "To cook pasta until a slight firmness remains when bitten." },
  { term: "Assemble", definition: "To gather necessary ingredients for a recipe together." },
  { term: "Bake", definition: "To cook food in an oven." },
  { term: "Baste", definition: "To brush or spoon a melted fat (such as butter), a liquid (such as a stock) or a marinade over food as it cooks." },
  { term: "Batter", definition: "A mixture that is thin enough to pour or spoon; often made of flour, eggs and milk." },
  { term: "Beat", definition: "To stir rapidly by hand or with a mixer to combine ingredients or incorporate air into mixture." },
  { term: "Bind", definition: "To add a thickening ingredient such as an egg, flour or cornstarch, to hold ingredients together." },
  { term: "Bite-Sized", definition: "To cut or tear food into small enough pieces to eat in one bite." },
  { term: "Blacken", definition: "To cook meat or fish in a very hot skillet to give a dark, crispy crust." },
  { term: "Blanch", definition: "To immerse food into boiling water for a short time, then transfer to ice water to stop cooking." },
  { term: "Blend", definition: "To stir together two or more ingredients until just combined." },
  { term: "Boil", definition: "To heat a liquid mixture until bubbles break the surface." },
  { term: "Bone", definition: "To remove the bones from poultry, meat or fish." },
  { term: "Braise", definition: "To brown meat or vegetables in fat over high heat, then cook slowly in liquid." },
  { term: "Bread", definition: "To coat food in a dry ingredient such as flour, bread crumbs, cornmeal or cracker crumbs." },
  { term: "Brine", definition: "A strong mixture of water, salt and vinegar used on meats to add flavor, tenderness and moistness." },
  { term: "Broil", definition: "To cook directly above or below a heat source in the oven or on the grill." },
  { term: "Broth", definition: "A flavorful liquid made by cooking meat, vegetables or fish in water with seasonings." },
  { term: "Brown", definition: "To cook food quickly over high heat to give the surface color and seal in juices." },
  { term: "Brush", definition: "To coat a food lightly with a marinade or liquid using a pastry brush." },
  { term: "Butterfly", definition: "To cut a food, such as shrimp, down the center, almost but not completely through." },
  { term: "Can", definition: "To preserve food by placing it into a glass jar following safe canning procedures." },
  { term: "Caramelize", definition: "To heat sugar until it dissolves and turns into golden syrup, or to cook food until soft and brown." },
  { term: "Carve", definition: "To cut food into slices (usually meat) using a sharp knife." },
  { term: "Chafe", definition: "To keep food warm using a container such as a chafing dish with a heat source underneath." },
  { term: "Chill", definition: "To cool food in the refrigerator until completely cooled throughout." },
  { term: "Chop", definition: "To cut food into slightly irregular cubes or pieces." },
  { term: "Chunk", definition: "To cut food into large pieces, larger than a cube." },
  { term: "Clarify", definition: "To remove solids from a liquid to yield a clear liquid, most often used with butter." },
  { term: "Coats a Spoon", definition: "To test for doneness; a cooked egg-based mixture leaves a thin layer on a metal spoon." },
  { term: "Coddle", definition: "To cook eggs in simmering water, and remove from heat when eggs are cooked as desired." },
  { term: "Combine", definition: "To stir two or more ingredients with a spoon, or beat on Low speed with a mixer." },
  { term: "Core", definition: "To remove the center of a fruit or vegetable, which contains seeds, with a knife or apple corer." },
  { term: "Cream", definition: "To beat together two or more ingredients, such as butter and sugar, until smooth and creamy." },
  { term: "Crimp", definition: "To press together two pastry layers on edge of pie crust, creating a decorative edge." },
  { term: "Crumble", definition: "To break up into small pieces." },
  { term: "Crush", definition: "To reduce to crumbs, powder, or small pieces." },
  { term: "Cube", definition: "To cut meat or vegetables into 1/2-inch equal-sided squares." },
  { term: "Curdle", definition: "To overcook a mixture, causing it to separate and appear lumpy." },
  { term: "Cut In", definition: "To mix a cold fat (such as butter) with flour or dry ingredients until the mixture resembles coarse crumbs." },
  { term: "Dash", definition: "To add a tiny amount of an ingredient." },
  { term: "Deep Fry", definition: "To cook food by submerging in hot oil." },
  { term: "Degrease", definition: "To spoon or drain fat or grease from a soup, stock, sauce or gravy." },
  { term: "Defrost", definition: "To thaw food." },
  { term: "Deglaze", definition: "To pour water, wine or stock over browned pan drippings, stirring to loosen them." },
  { term: "Devil", definition: "To add a spicy ingredient, such as hot pepper sauce or mustard, to food." },
  { term: "Dice", definition: "To cut into 1/8 to 1/4-inch thick cubes." },
  { term: "Dilute", definition: "To reduce the strength of a mixture by adding liquid." },
  { term: "Dip", definition: "To slowly, but briefly, lower food into a melted mixture such as chocolate." },
  { term: "Dot", definition: "To place or sprinkle small pieces of an ingredient, such as butter, over food." },
  { term: "Drain", definition: "To pour liquid or fat from food through a strainer or colander." },
  { term: "Dredge", definition: "To coat food with a dry ingredient, such as flour, bread crumbs or cornmeal before frying." },
  { term: "Dress", definition: "To apply a salad dressing to a salad before serving; can also mean to clean poultry or fish." },
  { term: "Drizzle", definition: "To slowly pour a thin liquid mixture over food, such as a cookie or salad." },
  { term: "Drop", definition: "To place cookies by spoonfuls onto a cookie sheet, or a small amount of liquid." },
  { term: "Dry Heat", definition: "To cook by roasting, broiling or grilling." },
  { term: "Dust", definition: "To coat lightly with an ingredient, such as flour or powdered sugar." },
  { term: "Emulsify", definition: "To force ingredients, such as oil and a liquid, that normally wouldn't mix into a creamy mixture." },
  { term: "Fillet", definition: "To cut bones from fish, meat or poultry." },
  { term: "Firmly Packed", definition: "To press an ingredient, such as brown sugar, tightly into a measuring cup." },
  { term: "Flake", definition: "To pull food, such as cooked fish, with a fork, producing small pieces as a test for doneness." },
  { term: "Flambé", definition: "To pour liquor over a warm food, usually on the stove-top, and ignite." },
  { term: "Flip", definition: "To turn over, such as turning pancakes, to finish cooking on the other side." },
  { term: "Floret", definition: "To break or cut fresh broccoli or cauliflower into small clusters." },
  { term: "Flour", definition: "To coat food with a dry ingredient or mixture of dry ingredients." },
  { term: "Fluff", definition: "To beat a mixture until light and soft." },
  { term: "Fold", definition: "To gently combine a light, airy mixture with a heavier mixture using a rubber spatula." },
  { term: "Frost", definition: "To cover a cake or cookie with icing or frosting." },
  { term: "Froth", definition: "To beat a light mixture or beverage until bubbles or foam form on the surface." },
  { term: "Fry", definition: "To cook food in hot oil over medium to high heat until brown and crisp." },
  { term: "Garnish", definition: "To decorate a finished food, often with an herb, fruit or vegetable." },
  { term: "Glaze", definition: "To coat food with a very thin mixture that will be smooth and glossy." },
  { term: "Golden Brown", definition: "To visually test for doneness of a light to medium brown color on foods." },
  { term: "Grate", definition: "To cut food into shreds, using a grater." },
  { term: "Grease", definition: "To coat the surface of the baking pan with shortening to prevent sticking." },
  { term: "Grease and Flour", definition: "Coat baking pan with shortening before lightly dusting with flour to prevent sticking." },
  { term: "Grill", definition: "To cook food on a grate over a heat source, such as hot coals or a gas grill." },
  { term: "Grind", definition: "To reduce food to small particles using a mortar and pestle, food processor or blender." },
  { term: "Hard Ball Stage", definition: "To cook sugar mixture until a drop forms a rigid, somewhat pliable ball in candy making." },
  { term: "Hull", definition: "To remove green stem and leaves from a strawberry or outer husk of some nuts." },
  { term: "Husk", definition: "To remove the outer leaves of a vegetable, such as fresh corn, or husk of nuts." },
  { term: "Ice", definition: "To cover a cake or cookie with mixture, such as frosting." },
  { term: "Inject", definition: "To force fluid into a food, most often meat, for flavor and moistness." },
  { term: "Julienne", definition: "To cut food, such as carrots, into 1/8-inch equal-sided strips." },
  { term: "Knead", definition: "To work dough by hand or with a dough hook of an electric mixer into a smooth ball." },
  { term: "Marinate", definition: "To soak or brush food with a seasoned liquid for tenderness, moisture and flavor." },
  { term: "Matchstick", definition: "To cut food, such as carrots, into thin strips about 1x1/8x1/8-inch." },
  { term: "Melt", definition: "To apply heat to change a food from a solid to a liquid, such as butter or chocolate." },
  { term: "Mince", definition: "To cut into very small pieces, such as garlic." },
  { term: "Mix", definition: "To stir two or more ingredients until mixture is thoroughly combined and uniform in texture." },
  { term: "Moist Heat", definition: "To cook using methods such as braising, stewing, or pot roasting." },
  { term: "Muddle", definition: "To crush or mash with a spoon or tool called a muddler." },
  { term: "Pan Broil", definition: "To cook food quickly in a preheated pan with little or no butter or oil." },
  { term: "Pan Sear", definition: "To cook tender cuts of meat in butter or oil in a heavy skillet over high heat." },
  { term: "Parboil", definition: "To cook food partially in boiling water, then continue cooking using another method." },
  { term: "Pare", definition: "To cut off a thin layer of skin on a food with a paring knife or vegetable peeler." },
  { term: "Partially Set", definition: "To test for doneness in which the mixture is set but still fluid enough for additions." },
  { term: "Pat", definition: "To lightly touch a surface to flatten." },
  { term: "Pea-Sized Crumbs", definition: "To describe the size of the pieces in a mixture of flour, butter and other ingredients." },
  { term: "Peel", definition: "To remove the skin or rind from a fruit or vegetable." },
  { term: "Pinch", definition: "To add a tiny amount (about 1/16th teaspoon) of a dry ingredient such as salt." },
  { term: "Pipe", definition: "To decorate food with a mixture, such as frosting or whipped cream, using a pastry bag." },
  { term: "Pit", definition: "To remove the stone or seed of a fruit, such as cherries, apricots and peaches." },
  { term: "Plump", definition: "To soak dried fruits or vegetables in liquid until they swell." },
  { term: "Poach", definition: "To cook food in a liquid to just below the boiling point." },
  { term: "Pound", definition: "To flatten or tenderize a piece of meat." },
  { term: "Process", definition: "To cook following safe canning procedures, sealing filled jars; also to beat ingredients in food processor." },
  { term: "Pulse", definition: "To use an on and off speed motion when combining a mixture in a food processor or blender." },
  { term: "Pulverize", definition: "To reduce to a powder or dust." },
  { term: "Purée", definition: "To mash or grind food until a thick, smooth consistency is achieved." },
  { term: "Quarter", definition: "To cut or divide into four equal parts." },
  { term: "Reconstitute", definition: "To soak dried foods in a liquid to rehydrate." },
  { term: "Reduce", definition: "To boil a sauce or liquid rapidly until boiled down and thickened." },
  { term: "Reheat", definition: "To re-warm food." },
  { term: "Render", definition: "To heat a solid animal fat over low heat until melted; remove solids." },
  { term: "Rice", definition: "To push a soft food, such as potatoes, through a potato ricer or strainer." },
  { term: "Rind", definition: "The outer skin of citrus fruits." },
  { term: "Roast", definition: "To cook meat or vegetables in a shallow, uncovered pan in the oven." },
  { term: "Roll Up Jelly-Roll Fashion", definition: "To roll dough and filling together, beginning with narrow side, ending with log shape." },
  { term: "Rolling Boil", definition: "A mixture that cooks or boils so hard it cannot be stirred down." },
  { term: "Rub", definition: "To apply a seasoned mixture, dry or paste, onto the surface of meat for flavor." },
  { term: "Sauté", definition: "To cook food quickly in a small amount of oil or fat in a skillet until light brown." },
  { term: "Scald", definition: "To heat liquid to just below the boiling point until tiny bubbles form around edge." },
  { term: "Score", definition: "To cut shallow slashes along the surface of meat to tenderize." },
  { term: "Scramble", definition: "To stir gently with a fork or spoon while cooking; often used with eggs." },
  { term: "Sear", definition: "To brown meat quickly in a skillet over high heat to seal in meat juices." },
  { term: "Season", definition: "To apply a flavor ingredient, such as salt and pepper; also to season cast iron pans." },
  { term: "Seed", definition: "To remove the seeds from a fruit or vegetable." },
  { term: "Separate", definition: "To divide in half or into parts; sometimes refers to separating egg yolk from white." },
  { term: "Set", definition: "To test for doneness when the surface of the food is firm to the touch." },
  { term: "Shave", definition: "To slice a very thin layer, such as chocolate, for a garnish." },
  { term: "Shell", definition: "To remove the outer covering of foods, such as eggs, nuts, or fresh peas." },
  { term: "Shred", definition: "To cut into narrow strips with a shredder or food processor using shredding disk." },
  { term: "Sieve", definition: "To strain dry or wet ingredients through the holes of a strainer or sieve." },
  { term: "Sift", definition: "To pass an ingredient, such as powdered sugar, through a sieve to make smooth and lump-free." },
  { term: "Simmer", definition: "To cook foods gently in a liquid at a low temperature just below boiling point." },
  { term: "Skewer", definition: "To thread meat, vegetables or fruit onto metal rods or bamboo sticks for grilling." },
  { term: "Skim", definition: "To spoon off top layer of fat, such as for gravy or soup." },
  { term: "Skin", definition: "To remove the outer layer on meat, fish, or poultry." },
  { term: "Slice", definition: "To cut into thin, flat pieces, or to cut through with a knife." },
  { term: "Sliver", definition: "To cut food into long, thin strips." },
  { term: "Snip", definition: "To cut with scissors into small pieces, often used with fresh herbs." },
  { term: "Soft Ball Stage", definition: "To cook a sugar mixture until a drop forms a soft ball that flattens when removed." },
  { term: "Soft Crack Stage", definition: "To cook a sugar mixture until a drop separates into hard threads in cold water." },
  { term: "Soft Peaks", definition: "To beat whipping cream or egg whites until peaks curl over when beaters are lifted." },
  { term: "Spread", definition: "To cover evenly." },
  { term: "Sprinkle", definition: "To scatter lightly." },
  { term: "Steam", definition: "To cook on a rack above boiling liquid in a tightly covered pan." },
  { term: "Steep", definition: "To soak dry ingredients, such as tea, coffee or spices, in a hot liquid." },
  { term: "Stew", definition: "To cook food in enough liquid to barely cover ingredients in a tightly covered pan." },
  { term: "Stiff Peaks", definition: "To beat whipping cream or egg whites until peaks stand up straight when beaters lifted." },
  { term: "Stir", definition: "To mix ingredients in a circular motion with a spoon." },
  { term: "Stir Constantly", definition: "To stir during the entire time the mixture is cooking." },
  { term: "Stir-Fry", definition: "To cook small pieces of food quickly in a large pan over high heat, stirring constantly." },
  { term: "Stock", definition: "A well-flavored broth made by simmering meat, poultry, fish or vegetables with herbs." },
  { term: "Strain", definition: "To remove any solids from a liquid by pouring through a sieve or colander." },
  { term: "Stuff", definition: "To fill a cavity in poultry or a vegetable with a well-seasoned mixture before cooking." },
  { term: "Sweat", definition: "To cook vegetables in a small amount of fat over low heat in a covered pan." },
  { term: "Thaw", definition: "To defrost frozen food." },
  { term: "Thin", definition: "To add more liquid to a mixture to dilute." },
  { term: "Thread", definition: "To place chunks of vegetables, meat or fruit on a skewer." },
  { term: "Toast", definition: "To brown food by heating in a toaster, under broiler, or in oven." },
  { term: "Toss", definition: "To turn food over lightly with a large spoon and fork to coat ingredients." },
  { term: "Trim", definition: "To cut off unwanted fat on meat, or to remove stems or leaves on fruits or vegetables." },
  { term: "Wedge", definition: "A triangular shape; such as a wedge of lemon, or a wedge of pie." },
  { term: "Whip", definition: "To combine two or more ingredients using a wire whisk, incorporating air as the mixture is beat." },
  { term: "Whisk", definition: "To combine two or more ingredients using a kitchen tool with looped wires, incorporating air." },
  { term: "Wilt", definition: "To heat food until limp, such as to add a hot dressing to leafy vegetables." },
  { term: "Zest", definition: "To remove the outer layer of a citrus fruit, using a zester or paring knife." },
];

function generateSlug(term: string): string {
  return term
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getLetter(term: string): string {
  const normalized = term.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return normalized.charAt(0).toUpperCase();
}

async function createTable(): Promise<boolean> {
  console.log('📋 Création de la table lexique_en...');

  // La table doit être créée manuellement dans Supabase avec ce SQL:
  const createTableSQL = `
CREATE TABLE IF NOT EXISTS lexique_en (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE NOT NULL,
  term VARCHAR(255) NOT NULL,
  definition TEXT NOT NULL,
  letter CHAR(1) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lexique_en_letter ON lexique_en(letter);
CREATE INDEX IF NOT EXISTS idx_lexique_en_slug ON lexique_en(slug);
CREATE INDEX IF NOT EXISTS idx_lexique_en_search ON lexique_en USING gin(to_tsvector('english', term || ' ' || definition));
`;

  console.log('\n📝 SQL pour créer la table (à exécuter dans Supabase si nécessaire):');
  console.log(createTableSQL);

  return true;
}

async function importTerms(): Promise<void> {
  console.log(`\n📤 Import de ${culinaryTerms.length} termes culinaires anglais...`);

  const terms: LexiqueEnTerm[] = culinaryTerms.map(t => ({
    slug: generateSlug(t.term),
    term: t.term,
    definition: t.definition,
    letter: getLetter(t.term),
  }));

  // Afficher aperçu
  console.log('\n📋 Aperçu des premiers termes:');
  terms.slice(0, 5).forEach(t => {
    console.log(`   [${t.letter}] ${t.term} (${t.slug})`);
    console.log(`       ${t.definition.substring(0, 60)}...`);
  });

  let success = 0;
  let failed = 0;

  for (const term of terms) {
    try {
      const { error } = await supabase
        .from('lexique_en')
        .upsert({
          slug: term.slug,
          term: term.term,
          definition: term.definition,
          letter: term.letter,
        }, { onConflict: 'slug' });

      if (error) {
        if (error.message.includes('relation') && error.message.includes('does not exist')) {
          console.error('\n❌ La table lexique_en n\'existe pas.');
          console.error('   Créez-la d\'abord dans Supabase avec le SQL ci-dessus.');
          return;
        }
        console.error(`   ❌ Erreur ${term.term}:`, error.message);
        failed++;
      } else {
        process.stdout.write('.');
        success++;
      }
    } catch (err) {
      console.error(`   ❌ Exception ${term.term}:`, err);
      failed++;
    }
  }

  console.log('\n');
  console.log('='.repeat(50));
  console.log(`✅ Import terminé!`);
  console.log(`   ${success} termes importés`);
  if (failed > 0) console.log(`   ${failed} erreurs`);

  // Stats par lettre
  const byLetter: Record<string, number> = {};
  terms.forEach(t => {
    byLetter[t.letter] = (byLetter[t.letter] || 0) + 1;
  });

  console.log('\n📊 Répartition par lettre:');
  Object.keys(byLetter).sort().forEach(letter => {
    console.log(`   ${letter}: ${byLetter[letter]} termes`);
  });
}

async function main() {
  console.log('🍳 Création du lexique culinaire anglais');
  console.log('   Source: Land O\'Lakes Kitchen Glossary');
  console.log('='.repeat(50));

  await createTable();
  await importTerms();
}

main().catch(console.error);
