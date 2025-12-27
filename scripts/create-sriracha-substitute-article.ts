import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ============================================
// ARTICLE CONTENT
// ============================================

const articleFR = {
  slug: 'remplacer-sauce-sriracha',
  title: 'Par quoi remplacer la sauce Sriracha ? (Guide complet des substituts)',
  excerpt: 'Découvrez les meilleurs substituts à la sauce Sriracha : sambal oelek, gochujang, harissa, Tabasco et plus. Guide complet pour remplacer la Sriracha dans vos recettes.',
  seoTitle: 'Par quoi remplacer la sauce Sriracha ? Guide complet des substituts',
  seoDescription: 'Guide complet pour remplacer la sauce Sriracha. Découvrez le goût de la Sriracha et les meilleurs substituts : sambal oelek, gochujang, harissa, sauce piquante maison.',
  readingTime: 7,
  content: `
<p>La sauce <strong>Sriracha</strong> est devenue un incontournable des cuisines du monde entier. Mais que faire quand tu n'en as plus, quand elle est en rupture de stock ou que tu veux simplement essayer autre chose ? Bonne nouvelle : il existe plusieurs alternatives qui peuvent faire le travail, parfois même mieux selon le plat que tu prépares.</p>

<h2>Quel goût a la sauce Sriracha ?</h2>

<p>Avant de la remplacer, il faut comprendre ce qui rend la Sriracha si spéciale. C'est une sauce d'origine thaïlandaise (popularisée par la marque américaine Huy Fong Foods au coq) qui combine :</p>

<ul>
  <li><strong>Piment rouge</strong> : un piquant modéré mais présent (environ 2 200 sur l'échelle de Scoville)</li>
  <li><strong>Ail</strong> : une saveur aillée prononcée qui fait sa signature</li>
  <li><strong>Sucre</strong> : une légère douceur qui équilibre le piquant</li>
  <li><strong>Vinaigre</strong> : une acidité subtile qui relève le tout</li>
  <li><strong>Sel</strong> : pour lier les saveurs</li>
</ul>

<p>La <strong>texture</strong> est épaisse et granuleuse, parfaite pour tartiner ou mélanger. Le résultat ? Un équilibre unique entre <em>piquant, sucré, aillé et légèrement acide</em>.</p>

<h2>Les meilleurs substituts de la Sriracha</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Substitut</th>
      <th>Piquant</th>
      <th>Profil de goût</th>
      <th>Meilleur pour</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Sambal Oelek</strong></td>
      <td>Similaire</td>
      <td>Piment pur, moins sucré</td>
      <td>Marinades, sautés, soupes</td>
    </tr>
    <tr>
      <td><strong>Gochujang</strong></td>
      <td>Modéré</td>
      <td>Fermenté, sucré, umami</td>
      <td>BBQ, riz, bibimbap</td>
    </tr>
    <tr>
      <td><strong>Harissa</strong></td>
      <td>Variable</td>
      <td>Fumé, épicé, nord-africain</td>
      <td>Couscous, grillades, légumes</td>
    </tr>
    <tr>
      <td><strong>Tabasco + miel</strong></td>
      <td>Plus léger</td>
      <td>Vinaigré, fruité</td>
      <td>Dépannage rapide</td>
    </tr>
    <tr>
      <td><strong>Sauce piquante thaï</strong></td>
      <td>Similaire</td>
      <td>Sucré-épicé</td>
      <td>Cuisine asiatique</td>
    </tr>
  </tbody>
</table>
</div>

<h3>1. Sambal Oelek - Le plus proche</h3>

<p>Le <strong>sambal oelek</strong> est probablement le substitut le plus fidèle. C'est une pâte de piments indonésienne faite de piments rouges broyés, de vinaigre et de sel. Pas de sucre ajouté, pas d'ail (contrairement à la Sriracha), donc le goût est plus "brut" et direct.</p>

<p><strong>Comment l'utiliser</strong> : Utilise la même quantité que la Sriracha demandée. Si tu veux te rapprocher encore plus du goût original, ajoute une pincée de sucre et un peu d'ail émincé ou en poudre.</p>

<div class="tip-box">
<p><strong>💡 Astuce</strong> : Sambal oelek + 1/2 c. à thé de sucre + 1/4 c. à thé de poudre d'ail = imitation Sriracha quasi parfaite!</p>
</div>

<h3>2. Gochujang - L'alternative coréenne</h3>

<p>La pâte de piment coréenne <strong>gochujang</strong> est fermentée, ce qui lui donne une profondeur umami que la Sriracha n'a pas. Elle est aussi plus sucrée et moins acide. Texture plus épaisse, presque pâteuse.</p>

<p><strong>Idéal pour</strong> : les plats qui peuvent accueillir un goût plus complexe et sucré - marinades pour BBQ, sauces pour riz, bibimbap, ailes de poulet.</p>

<p><strong>Proportion</strong> : Commence par la moitié de la quantité demandée et ajuste. Le gochujang est plus concentré en saveur.</p>

<h3>3. Harissa - L'option nord-africaine</h3>

<p>L'<strong>harissa</strong> est une pâte de piments tunisienne avec des notes fumées, de cumin et de coriandre. Le profil est très différent (plus "méditerranéen"), mais le niveau de piquant peut être similaire.</p>

<p><strong>Idéal pour</strong> : les plats où un goût fumé et terreux fonctionnerait bien - couscous, merguez, légumes grillés, tajines, vinaigrettes épicées.</p>

<p><strong>Attention</strong> : L'harissa ne remplace pas la Sriracha dans un pho ou un pad thaï - les profils sont trop différents.</p>

<h3>4. Tabasco ou sauce piquante + miel/sucre</h3>

<p>En dépannage, tu peux créer une imitation avec ce que tu as sous la main :</p>

<ul>
  <li>2 c. à soupe de <strong>Tabasco</strong> (ou autre sauce piquante)</li>
  <li>1 c. à thé de <strong>miel</strong> ou sucre</li>
  <li>1/4 c. à thé de <strong>poudre d'ail</strong></li>
  <li>Une pincée de <strong>sel</strong></li>
</ul>

<p>Mélange bien. Ce ne sera pas identique (le Tabasco est plus vinaigré et liquide), mais ça fait le travail en attendant.</p>

<h3>5. Sauce piquante thaïlandaise (Sweet Chili)</h3>

<p>Les sauces "sweet chili" thaïlandaises sont plus sucrées et moins piquantes que la Sriracha, mais partagent ce profil sucré-épicé. Marques comme Mae Ploy ou Thai Kitchen.</p>

<p><strong>Idéal pour</strong> : trempettes, rouleaux de printemps, ailes de poulet, tout ce qui peut accueillir plus de sucre.</p>

<h3>6. Pâte de piment à l'ail (Chili Garlic Sauce)</h3>

<p>Souvent vendue à côté de la Sriracha (même marque Huy Fong), cette sauce est plus grossière, plus aillée et moins lisse. C'est essentiellement de la Sriracha non-mixée.</p>

<p><strong>Proportion</strong> : 1:1, c'est le remplacement le plus direct si tu en trouves.</p>

<h2>Faire sa propre Sriracha maison</h2>

<p>Si tu veux vraiment le goût authentique et que tu as du temps, voici une recette simplifiée :</p>

<ul>
  <li>450g de <strong>piments rouges frais</strong> (jalapeño, fresno ou serrano)</li>
  <li>4 gousses d'<strong>ail</strong></li>
  <li>3 c. à soupe de <strong>cassonade</strong></li>
  <li>1 c. à soupe de <strong>sel</strong></li>
  <li>1/2 tasse de <strong>vinaigre blanc</strong></li>
</ul>

<p>Mixe tout grossièrement, laisse fermenter 3-5 jours à température ambiante (en remuant chaque jour), puis mixe finement et passe au tamis si tu veux une texture lisse. Conservation : plusieurs mois au frigo.</p>

<h2>Quel substitut choisir selon ta recette ?</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Type de plat</th>
      <th>Meilleur substitut</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pho, soupes asiatiques</td>
      <td>Sambal oelek ou chili garlic sauce</td>
    </tr>
    <tr>
      <td>Sushis, poke bowls</td>
      <td>Sambal oelek + mayo = mayo épicée</td>
    </tr>
    <tr>
      <td>Marinades BBQ</td>
      <td>Gochujang</td>
    </tr>
    <tr>
      <td>Pizza, hot-dogs</td>
      <td>Tabasco + miel ou harissa</td>
    </tr>
    <tr>
      <td>Sautés, stir-fry</td>
      <td>Sambal oelek ou chili garlic sauce</td>
    </tr>
    <tr>
      <td>Tacos, cuisine mexicaine</td>
      <td>Tabasco chipotle ou harissa</td>
    </tr>
    <tr>
      <td>Trempettes</td>
      <td>Sweet chili sauce ou gochujang dilué</td>
    </tr>
  </tbody>
</table>
</div>

<h2>FAQ - Questions fréquentes</h2>

<h3>La Sriracha est-elle très piquante ?</h3>
<p>Non, la Sriracha a un piquant modéré (environ 2 200 Scoville). C'est moins fort qu'un jalapeño frais et beaucoup moins qu'un habanero. L'équilibre sucré-aillé adoucit aussi la sensation de chaleur.</p>

<h3>Pourquoi la Sriracha est-elle parfois en rupture de stock ?</h3>
<p>La marque Huy Fong (celle au coq) a connu des pénuries dues à des problèmes d'approvisionnement en piments. D'autres marques comme Tabasco Sriracha, Flying Goose ou Lee Kum Kee font aussi de bonnes versions.</p>

<h3>Peut-on remplacer la Sriracha par du Tabasco ?</h3>
<p>En dépannage oui, mais le goût sera différent. Le Tabasco est plus vinaigré, plus liquide et sans la douceur sucrée ni l'ail de la Sriracha. Ajoute du miel et de l'ail pour te rapprocher.</p>

<h3>Le sambal oelek goûte-t-il la même chose que la Sriracha ?</h3>
<p>Presque. Le sambal oelek est la base de piment brut sans le sucre ni l'ail ajoutés. Le piquant est similaire, mais le goût est plus "simple" et direct.</p>
`,
};

const articleEN = {
  slug: 'sriracha-sauce-substitute',
  title: 'What Can Replace Sriracha Sauce? (Complete Substitute Guide)',
  excerpt: 'Discover the best Sriracha substitutes: sambal oelek, gochujang, harissa, Tabasco and more. Complete guide to replacing Sriracha in your recipes.',
  seoTitle: 'What Can Replace Sriracha Sauce? Complete Substitute Guide',
  seoDescription: 'Complete guide to replacing Sriracha sauce. Discover what Sriracha tastes like and the best substitutes: sambal oelek, gochujang, harissa, homemade hot sauce.',
  readingTime: 7,
  content: `
<p><strong>Sriracha</strong> sauce has become a staple in kitchens worldwide. But what do you do when you run out, when it's out of stock, or you simply want to try something different? Good news: there are several alternatives that can do the job, sometimes even better depending on the dish you're making.</p>

<h2>What Does Sriracha Taste Like?</h2>

<p>Before replacing it, you need to understand what makes Sriracha so special. It's a Thai-origin sauce (popularized by the American brand Huy Fong Foods with the rooster logo) that combines:</p>

<ul>
  <li><strong>Red chili peppers</strong>: moderate but present heat (about 2,200 on the Scoville scale)</li>
  <li><strong>Garlic</strong>: a pronounced garlic flavor that's its signature</li>
  <li><strong>Sugar</strong>: a slight sweetness that balances the heat</li>
  <li><strong>Vinegar</strong>: a subtle acidity that lifts everything</li>
  <li><strong>Salt</strong>: to bind the flavors</li>
</ul>

<p>The <strong>texture</strong> is thick and slightly grainy, perfect for spreading or mixing. The result? A unique balance of <em>spicy, sweet, garlicky, and slightly tangy</em>.</p>

<h2>Best Sriracha Substitutes</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Substitute</th>
      <th>Heat Level</th>
      <th>Flavor Profile</th>
      <th>Best For</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Sambal Oelek</strong></td>
      <td>Similar</td>
      <td>Pure chili, less sweet</td>
      <td>Marinades, stir-fries, soups</td>
    </tr>
    <tr>
      <td><strong>Gochujang</strong></td>
      <td>Moderate</td>
      <td>Fermented, sweet, umami</td>
      <td>BBQ, rice, bibimbap</td>
    </tr>
    <tr>
      <td><strong>Harissa</strong></td>
      <td>Variable</td>
      <td>Smoky, spicy, North African</td>
      <td>Couscous, grilled meats, vegetables</td>
    </tr>
    <tr>
      <td><strong>Tabasco + honey</strong></td>
      <td>Lighter</td>
      <td>Vinegary, fruity</td>
      <td>Quick substitute</td>
    </tr>
    <tr>
      <td><strong>Thai hot sauce</strong></td>
      <td>Similar</td>
      <td>Sweet-spicy</td>
      <td>Asian cuisine</td>
    </tr>
  </tbody>
</table>
</div>

<h3>1. Sambal Oelek - The Closest Match</h3>

<p><strong>Sambal oelek</strong> is probably the most faithful substitute. It's an Indonesian chili paste made from crushed red peppers, vinegar, and salt. No added sugar, no garlic (unlike Sriracha), so the taste is more "raw" and direct.</p>

<p><strong>How to use it</strong>: Use the same amount as the Sriracha called for. If you want to get even closer to the original taste, add a pinch of sugar and some minced garlic or garlic powder.</p>

<div class="tip-box">
<p><strong>💡 Tip</strong>: Sambal oelek + 1/2 tsp sugar + 1/4 tsp garlic powder = almost perfect Sriracha imitation!</p>
</div>

<h3>2. Gochujang - The Korean Alternative</h3>

<p>Korean chili paste <strong>gochujang</strong> is fermented, which gives it an umami depth that Sriracha doesn't have. It's also sweeter and less acidic. Thicker, almost pasty texture.</p>

<p><strong>Ideal for</strong>: dishes that can handle a more complex, sweeter taste - BBQ marinades, rice sauces, bibimbap, chicken wings.</p>

<p><strong>Ratio</strong>: Start with half the amount called for and adjust. Gochujang is more concentrated in flavor.</p>

<h3>3. Harissa - The North African Option</h3>

<p><strong>Harissa</strong> is a Tunisian chili paste with smoky notes, cumin, and coriander. The profile is very different (more "Mediterranean"), but the heat level can be similar.</p>

<p><strong>Ideal for</strong>: dishes where a smoky, earthy taste would work well - couscous, merguez, grilled vegetables, tagines, spicy vinaigrettes.</p>

<p><strong>Note</strong>: Harissa doesn't replace Sriracha in pho or pad Thai - the profiles are too different.</p>

<h3>4. Tabasco or Hot Sauce + Honey/Sugar</h3>

<p>In a pinch, you can create an imitation with what you have on hand:</p>

<ul>
  <li>2 tbsp <strong>Tabasco</strong> (or other hot sauce)</li>
  <li>1 tsp <strong>honey</strong> or sugar</li>
  <li>1/4 tsp <strong>garlic powder</strong></li>
  <li>A pinch of <strong>salt</strong></li>
</ul>

<p>Mix well. It won't be identical (Tabasco is more vinegary and liquid), but it does the job in the meantime.</p>

<h3>5. Thai Sweet Chili Sauce</h3>

<p>Thai "sweet chili" sauces are sweeter and less spicy than Sriracha, but share that sweet-spicy profile. Brands like Mae Ploy or Thai Kitchen.</p>

<p><strong>Ideal for</strong>: dipping sauces, spring rolls, chicken wings, anything that can handle more sweetness.</p>

<h3>6. Chili Garlic Sauce</h3>

<p>Often sold next to Sriracha (same Huy Fong brand), this sauce is coarser, more garlicky, and less smooth. It's essentially un-blended Sriracha.</p>

<p><strong>Ratio</strong>: 1:1, this is the most direct replacement if you can find it.</p>

<h2>Make Your Own Homemade Sriracha</h2>

<p>If you really want the authentic taste and have some time, here's a simplified recipe:</p>

<ul>
  <li>1 lb <strong>fresh red chilies</strong> (jalapeño, fresno, or serrano)</li>
  <li>4 cloves of <strong>garlic</strong></li>
  <li>3 tbsp <strong>brown sugar</strong></li>
  <li>1 tbsp <strong>salt</strong></li>
  <li>1/2 cup <strong>white vinegar</strong></li>
</ul>

<p>Blend everything roughly, let it ferment for 3-5 days at room temperature (stirring each day), then blend finely and strain if you want a smooth texture. Storage: several months in the fridge.</p>

<h2>Which Substitute to Choose for Your Recipe?</h2>

<div class="substitutes-table">
<table>
  <thead>
    <tr>
      <th>Type of Dish</th>
      <th>Best Substitute</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Pho, Asian soups</td>
      <td>Sambal oelek or chili garlic sauce</td>
    </tr>
    <tr>
      <td>Sushi, poke bowls</td>
      <td>Sambal oelek + mayo = spicy mayo</td>
    </tr>
    <tr>
      <td>BBQ marinades</td>
      <td>Gochujang</td>
    </tr>
    <tr>
      <td>Pizza, hot dogs</td>
      <td>Tabasco + honey or harissa</td>
    </tr>
    <tr>
      <td>Stir-fries</td>
      <td>Sambal oelek or chili garlic sauce</td>
    </tr>
    <tr>
      <td>Tacos, Mexican cuisine</td>
      <td>Chipotle Tabasco or harissa</td>
    </tr>
    <tr>
      <td>Dipping sauces</td>
      <td>Sweet chili sauce or diluted gochujang</td>
    </tr>
  </tbody>
</table>
</div>

<h2>FAQ - Frequently Asked Questions</h2>

<h3>Is Sriracha very spicy?</h3>
<p>No, Sriracha has moderate heat (about 2,200 Scoville). It's less hot than a fresh jalapeño and much less than a habanero. The sweet-garlicky balance also softens the heat sensation.</p>

<h3>Why is Sriracha sometimes out of stock?</h3>
<p>The Huy Fong brand (the one with the rooster) has experienced shortages due to chili supply issues. Other brands like Tabasco Sriracha, Flying Goose, or Lee Kum Kee also make good versions.</p>

<h3>Can you replace Sriracha with Tabasco?</h3>
<p>In a pinch, yes, but the taste will be different. Tabasco is more vinegary, more liquid, and lacks the sweetness and garlic of Sriracha. Add honey and garlic to get closer.</p>

<h3>Does sambal oelek taste the same as Sriracha?</h3>
<p>Almost. Sambal oelek is the raw chili base without the added sugar or garlic. The heat is similar, but the taste is more "simple" and direct.</p>
`,
};

// ============================================
// MAIN FUNCTION
// ============================================

async function createSrirachaArticle() {
  console.log('Creating Sriracha substitute article...\n');

  // 1. Get or create 'Astuces' category
  let categoryId: number;

  const { data: existingCategory } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'astuces')
    .single();

  if (existingCategory) {
    categoryId = existingCategory.id;
    console.log('Found existing "astuces" category:', categoryId);
  } else {
    const { data: newCategory, error: catError } = await supabase
      .from('post_categories')
      .insert({ name: 'Astuces', slug: 'astuces' })
      .select('id')
      .single();

    if (catError) {
      console.error('Error creating category:', catError);
      return;
    }
    categoryId = newCategory.id;
    console.log('Created "astuces" category:', categoryId);
  }

  // 2. Check if post already exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', articleFR.slug)
    .single();

  if (existingPost) {
    console.log('Post already exists with slug:', articleFR.slug);
    console.log('Updating existing post...');

    // Update existing post
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: articleFR.title,
        excerpt: articleFR.excerpt,
        content: articleFR.content,
        seo_title: articleFR.seoTitle,
        seo_description: articleFR.seoDescription,
        reading_time: articleFR.readingTime,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPost.id);

    if (updateError) {
      console.error('Error updating post:', updateError);
      return;
    }

    // Update English translation
    const { error: transUpdateError } = await supabase
      .from('post_translations')
      .upsert({
        post_id: existingPost.id,
        locale: 'en',
        title: articleEN.title,
        excerpt: articleEN.excerpt,
        content: articleEN.content,
        seo_title: articleEN.seoTitle,
        seo_description: articleEN.seoDescription,
      }, { onConflict: 'post_id,locale' });

    if (transUpdateError) {
      console.error('Error updating translation:', transUpdateError);
    }

    console.log('Post updated successfully!');
    return;
  }

  // 3. Create new post
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      slug: articleFR.slug,
      title: articleFR.title,
      excerpt: articleFR.excerpt,
      content: articleFR.content,
      featured_image: '/images/blog/sriracha-substitutes.jpg',
      seo_title: articleFR.seoTitle,
      seo_description: articleFR.seoDescription,
      reading_time: articleFR.readingTime,
      status: 'published',
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (postError) {
    console.error('Error creating post:', postError);
    return;
  }

  console.log('Created post with ID:', newPost.id);

  // 4. Link to category
  const { error: linkError } = await supabase
    .from('post_category_links')
    .insert({
      post_id: newPost.id,
      category_id: categoryId,
    });

  if (linkError) {
    console.error('Error linking category:', linkError);
  }

  // 5. Create English translation
  const { error: translationError } = await supabase
    .from('post_translations')
    .insert({
      post_id: newPost.id,
      locale: 'en',
      title: articleEN.title,
      excerpt: articleEN.excerpt,
      content: articleEN.content,
      seo_title: articleEN.seoTitle,
      seo_description: articleEN.seoDescription,
    });

  if (translationError) {
    console.error('Error creating translation:', translationError);
  }

  console.log('\n✅ Article created successfully!');
  console.log(`   FR: /astuces/${articleFR.slug}`);
  console.log(`   EN: /en/tips/${articleEN.slug}`);
}

// Run
createSrirachaArticle().catch(console.error);
