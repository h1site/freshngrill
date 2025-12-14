/**
 * Script pour créer un article de guide d'achat - Outils de cuisine pour les fêtes
 * Usage: npx tsx scripts/create-fetes-guide-post.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// URLs des images uploadées
const images = {
  sensarte: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/guide-fetes/1765729228557-sensarte-poele-crepes.jpg',
  crockpot: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/guide-fetes/1765729228999-crockpot-slowcooker.jpg',
  bols: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/guide-fetes/1765729229301-bols-inoxydable.jpg',
  breville: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/guide-fetes/1765729229607-breville-barista.jpg',
  kitchenaid: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/post-images/guide-fetes/1765729229918-kitchenaid-mixer.jpg',
};

// Liens affiliés Amazon
const amazonLinks = {
  sensarte: 'https://amzn.to/3KvPmS7',
  crockpot: 'https://amzn.to/3L0YyxR',
  bols: 'https://amzn.to/3MXt502',
  breville: 'https://amzn.to/4q2Pjfu',
  kitchenaid: 'https://amzn.to/4pCAK2p',
};

// Contenu français
const postFR = {
  slug: 'outils-cuisine-indispensables-temps-des-fetes',
  title: '5 Outils de Cuisine Indispensables pour le Temps des Fêtes',
  excerpt: 'Découvrez notre sélection des meilleurs équipements pour réussir vos repas de fêtes. Des essentiels qui feront de vous le chef de la famille!',
  content: `
<p>Le temps des fêtes approche et avec lui, les grandes tablées familiales et les repas mémorables. Pour réussir vos festins sans stress, avoir les bons outils fait toute la différence. Voici notre sélection de 5 équipements indispensables qui transformeront votre cuisine en véritable atelier de chef.</p>

<h2>1. Poêle à Crêpes SENSARTE - L'indispensable du brunch</h2>

<figure>
<img src="${images.sensarte}" alt="Poêle à crêpes SENSARTE avec revêtement antiadhésif granit" width="679" height="679" loading="lazy" />
<figcaption>Poêle SENSARTE - Parfaite pour les crêpes et les blinis</figcaption>
</figure>

<p>Les brunchs des fêtes sont un incontournable et cette poêle SENSARTE est votre alliée parfaite. Son <strong>revêtement antiadhésif en granit</strong> permet de cuisiner sans gras tout en assurant un démoulage impeccable des crêpes les plus fines.</p>

<h3>Pourquoi on l'adore:</h3>
<ul>
<li><strong>Surface antiadhésive premium</strong> - Revêtement granit ultra-durable sans PFOA</li>
<li><strong>Distribution uniforme de la chaleur</strong> - Fini les crêpes brûlées d'un côté!</li>
<li><strong>Manche ergonomique</strong> - Reste frais même à haute température</li>
<li><strong>Facile à nettoyer</strong> - Un simple coup d'éponge suffit</li>
</ul>

<p><strong>Prix:</strong> Environ 35-45$</p>

<p class="affiliate-link">
<a href="${amazonLinks.sensarte}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>2. Mijoteuse Crock-Pot avec Technologie MyTime - Le secret des repas sans stress</h2>

<figure>
<img src="${images.crockpot}" alt="Mijoteuse Crock-Pot programmable 6 pintes en acier inoxydable" width="679" height="679" loading="lazy" />
<figcaption>Crock-Pot MyTime - Votre repas prêt exactement quand vous voulez</figcaption>
</figure>

<p>La révolution dans le monde des mijoteuses! Cette Crock-Pot de <strong>6 pintes (5.7L)</strong> est équipée de la technologie <strong>MyTime</strong> - la première au monde à s'ajuster automatiquement pour que votre repas soit prêt exactement à l'heure souhaitée.</p>

<h3>Pourquoi c'est un must:</h3>
<ul>
<li><strong>Technologie MyTime exclusive</strong> - Choisissez l'heure exacte du repas, pas la durée de cuisson</li>
<li><strong>Capacité généreuse de 6 pintes</strong> - Parfait pour 7 personnes et plus</li>
<li><strong>3 réglages de cuisson</strong> - Viande, volaille ou soupes/légumes</li>
<li><strong>Mode manuel</strong> - Pour garder le contrôle total quand vous le souhaitez</li>
<li><strong>Finition acier inoxydable</strong> - Élégante et durable</li>
</ul>

<p><strong>Idéal pour:</strong> Ragoûts de boeuf, porc effiloché, soupes réconfortantes et tous vos plats mijotés des fêtes.</p>

<p><strong>Prix:</strong> Environ 75-90$</p>

<p class="affiliate-link">
<a href="${amazonLinks.crockpot}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>3. Ensemble de Bols en Acier Inoxydable avec Couvercles - L'organisation parfaite</h2>

<figure>
<img src="${images.bols}" alt="Ensemble de bols en acier inoxydable avec couvercles hermétiques" width="679" height="679" loading="lazy" />
<figcaption>Bols polyvalents - Du mélange au stockage</figcaption>
</figure>

<p>Quand on cuisine pour une grande tablée, l'organisation est la clé. Cet ensemble de <strong>bols en acier inoxydable avec couvercles hermétiques</strong> est un investissement que vous ne regretterez jamais.</p>

<h3>Les avantages:</h3>
<ul>
<li><strong>Plusieurs capacités incluses</strong> - Du petit au très grand, tout y est</li>
<li><strong>Couvercles hermétiques</strong> - Parfait pour préparer à l'avance et conserver</li>
<li><strong>Base antidérapante</strong> - Stable même lors du fouettage intensif</li>
<li><strong>Acier inoxydable de qualité</strong> - Ne retient pas les odeurs ni les taches</li>
<li><strong>Empilables</strong> - Gain de place assuré dans vos armoires</li>
</ul>

<p><strong>Utilisation:</strong> Préparation des salades, marinades, mélanges à pâtisserie, conservation des restes.</p>

<p><strong>Prix:</strong> Environ 40-55$</p>

<p class="affiliate-link">
<a href="${amazonLinks.bols}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>4. Machine à Espresso Breville Barista Express - Pour les cafés dignes d'un barista</h2>

<figure>
<img src="${images.breville}" alt="Machine à espresso Breville Barista Express BES870XL en acier inoxydable" width="679" height="679" loading="lazy" />
<figcaption>Breville Barista Express - Le café parfait après le repas</figcaption>
</figure>

<p>Après un festin des fêtes, rien de mieux qu'un espresso parfait ou un cappuccino onctueux. La <strong>Breville Barista Express</strong> est LA machine qui transforme chaque fin de repas en moment de pur bonheur.</p>

<h3>Ce qui la rend exceptionnelle:</h3>
<ul>
<li><strong>Moulin conique intégré</strong> - Café fraîchement moulu à chaque tasse</li>
<li><strong>Contrôle précis de la mouture</strong> - Du plus fin au plus grossier</li>
<li><strong>Pression de 15 bars</strong> - Extraction optimale pour une crema parfaite</li>
<li><strong>Buse vapeur professionnelle</strong> - Latte art digne des meilleurs cafés</li>
<li><strong>Réservoir d'eau de 2L</strong> - Nombreux cafés sans recharger</li>
</ul>

<p><strong>Parfait pour:</strong> Espressos, cappuccinos, lattes, et tous vos cafés de fin de repas.</p>

<p><strong>Prix:</strong> Environ 800-900$</p>

<p class="affiliate-link">
<a href="${amazonLinks.breville}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>5. Batteur sur Socle KitchenAid Artisan - Le roi de la pâtisserie</h2>

<figure>
<img src="${images.kitchenaid}" alt="Batteur sur socle KitchenAid Artisan 5 pintes orange" width="679" height="679" loading="lazy" />
<figcaption>KitchenAid Artisan - L'outil légendaire des pâtissiers</figcaption>
</figure>

<p>Tourtières, bûches de Noël, biscuits par centaines... Les fêtes riment avec pâtisserie! Le <strong>KitchenAid Artisan de 5 pintes</strong> est l'outil légendaire qui simplifiera toutes vos préparations.</p>

<h3>Pourquoi c'est un investissement pour la vie:</h3>
<ul>
<li><strong>Moteur puissant</strong> - Même les pâtes les plus denses ne lui résistent pas</li>
<li><strong>Bol de 5 pintes (4.7L)</strong> - Capacité pour 9 douzaines de biscuits!</li>
<li><strong>10 vitesses de mélange</strong> - Du pétrissage délicat au fouettage intensif</li>
<li><strong>Construction métallique robuste</strong> - Conçu pour durer des décennies</li>
<li><strong>Tête inclinable</strong> - Accès facile au bol et aux accessoires</li>
<li><strong>Plus de 10 accessoires optionnels</strong> - Hachoir, machine à pâtes, etc.</li>
</ul>

<p><strong>Idéal pour:</strong> Pâtes à tarte, crèmes fouettées, meringues, pains et brioches, et bien plus!</p>

<p><strong>Prix:</strong> Environ 450-550$</p>

<p class="affiliate-link">
<a href="${amazonLinks.kitchenaid}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>Tableau Récapitulatif</h2>

<table>
<thead>
<tr>
<th>Produit</th>
<th>Usage Principal</th>
<th>Prix Approximatif</th>
</tr>
</thead>
<tbody>
<tr>
<td>Poêle SENSARTE</td>
<td>Crêpes, blinis, oeufs</td>
<td>~40$</td>
</tr>
<tr>
<td>Crock-Pot MyTime</td>
<td>Mijotés, ragoûts</td>
<td>~80$</td>
</tr>
<tr>
<td>Bols Inoxydable</td>
<td>Préparation, conservation</td>
<td>~50$</td>
</tr>
<tr>
<td>Breville Barista</td>
<td>Espressos, cappuccinos</td>
<td>~850$</td>
</tr>
<tr>
<td>KitchenAid Artisan</td>
<td>Pâtisserie, pétrissage</td>
<td>~500$</td>
</tr>
</tbody>
</table>

<h2>Conclusion</h2>

<p>Ces 5 outils sont de véritables investissements qui vous accompagneront pendant des années. Que vous soyez un cuisinier du dimanche ou un passionné de gastronomie, ils feront de chaque repas des fêtes un moment de plaisir plutôt qu'une source de stress.</p>

<p>Notre conseil? Si vous devez choisir un seul article, optez pour la <strong>mijoteuse Crock-Pot MyTime</strong> - son rapport qualité-prix est imbattable et elle vous libérera du stress de la cuisson pendant que vous profitez de vos invités!</p>

<p><em>En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.</em></p>
`,
  featured_image: images.kitchenaid,
  reading_time: 7,
  seo_title: 'Outils de Cuisine pour les Fêtes 2025 - Guide d\'Achat',
  seo_description: 'Découvrez les 5 outils de cuisine indispensables pour réussir vos repas des fêtes: mijoteuse, batteur KitchenAid, machine espresso et plus.',
};

// Contenu anglais
const postEN = {
  title: '5 Essential Kitchen Tools for the Holiday Season',
  excerpt: 'Discover our selection of the best equipment to succeed with your holiday meals. The essentials that will make you the family chef!',
  content: `
<p>The holiday season is approaching and with it, large family gatherings and memorable meals. To succeed with your feasts without stress, having the right tools makes all the difference. Here's our selection of 5 essential pieces of equipment that will transform your kitchen into a real chef's workshop.</p>

<h2>1. SENSARTE Crepe Pan - The Brunch Essential</h2>

<figure>
<img src="${images.sensarte}" alt="SENSARTE crepe pan with granite non-stick coating" width="679" height="679" loading="lazy" />
<figcaption>SENSARTE Pan - Perfect for crepes and blinis</figcaption>
</figure>

<p>Holiday brunches are a must-have and this SENSARTE pan is your perfect ally. Its <strong>granite non-stick coating</strong> allows you to cook without fat while ensuring flawless release of the thinnest crepes.</p>

<h3>Why we love it:</h3>
<ul>
<li><strong>Premium non-stick surface</strong> - Ultra-durable PFOA-free granite coating</li>
<li><strong>Even heat distribution</strong> - No more crepes burned on one side!</li>
<li><strong>Ergonomic handle</strong> - Stays cool even at high temperatures</li>
<li><strong>Easy to clean</strong> - A simple wipe with a sponge is enough</li>
</ul>

<p><strong>Price:</strong> About $35-45</p>

<p class="affiliate-link">
<a href="${amazonLinks.sensarte}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>2. Crock-Pot Slow Cooker with MyTime Technology - The Secret to Stress-Free Meals</h2>

<figure>
<img src="${images.crockpot}" alt="Programmable Crock-Pot slow cooker 6-quart in stainless steel" width="679" height="679" loading="lazy" />
<figcaption>Crock-Pot MyTime - Your meal ready exactly when you want it</figcaption>
</figure>

<p>A revolution in the world of slow cookers! This <strong>6-quart (5.7L)</strong> Crock-Pot is equipped with <strong>MyTime technology</strong> - the world's first to automatically adjust so your meal is ready at exactly the time you want.</p>

<h3>Why it's a must:</h3>
<ul>
<li><strong>Exclusive MyTime technology</strong> - Choose the exact meal time, not the cooking duration</li>
<li><strong>Generous 6-quart capacity</strong> - Perfect for 7 people or more</li>
<li><strong>3 cooking settings</strong> - Meat, poultry or soups/vegetables</li>
<li><strong>Manual mode</strong> - For total control when you want it</li>
<li><strong>Stainless steel finish</strong> - Elegant and durable</li>
</ul>

<p><strong>Ideal for:</strong> Beef stews, pulled pork, comforting soups and all your holiday slow-cooked dishes.</p>

<p><strong>Price:</strong> About $75-90</p>

<p class="affiliate-link">
<a href="${amazonLinks.crockpot}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>3. Stainless Steel Mixing Bowl Set with Lids - Perfect Organization</h2>

<figure>
<img src="${images.bols}" alt="Stainless steel mixing bowl set with airtight lids" width="679" height="679" loading="lazy" />
<figcaption>Versatile bowls - From mixing to storage</figcaption>
</figure>

<p>When cooking for a large group, organization is key. This set of <strong>stainless steel bowls with airtight lids</strong> is an investment you'll never regret.</p>

<h3>The benefits:</h3>
<ul>
<li><strong>Multiple capacities included</strong> - From small to extra large, everything is there</li>
<li><strong>Airtight lids</strong> - Perfect for preparing ahead and storing</li>
<li><strong>Non-slip base</strong> - Stable even during intensive whisking</li>
<li><strong>Quality stainless steel</strong> - Doesn't retain odors or stains</li>
<li><strong>Stackable</strong> - Guaranteed space saving in your cabinets</li>
</ul>

<p><strong>Use:</strong> Salad preparation, marinades, baking mixes, storing leftovers.</p>

<p><strong>Price:</strong> About $40-55</p>

<p class="affiliate-link">
<a href="${amazonLinks.bols}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>4. Breville Barista Express Espresso Machine - For Barista-Worthy Coffees</h2>

<figure>
<img src="${images.breville}" alt="Breville Barista Express BES870XL espresso machine in stainless steel" width="679" height="679" loading="lazy" />
<figcaption>Breville Barista Express - The perfect coffee after the meal</figcaption>
</figure>

<p>After a holiday feast, nothing beats a perfect espresso or creamy cappuccino. The <strong>Breville Barista Express</strong> is THE machine that transforms every end of meal into a moment of pure happiness.</p>

<h3>What makes it exceptional:</h3>
<ul>
<li><strong>Built-in conical grinder</strong> - Freshly ground coffee for every cup</li>
<li><strong>Precise grind control</strong> - From finest to coarsest</li>
<li><strong>15 bar pressure</strong> - Optimal extraction for perfect crema</li>
<li><strong>Professional steam wand</strong> - Latte art worthy of the best cafés</li>
<li><strong>2L water reservoir</strong> - Many coffees without refilling</li>
</ul>

<p><strong>Perfect for:</strong> Espressos, cappuccinos, lattes, and all your after-dinner coffees.</p>

<p><strong>Price:</strong> About $800-900</p>

<p class="affiliate-link">
<a href="${amazonLinks.breville}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>5. KitchenAid Artisan Stand Mixer - The King of Baking</h2>

<figure>
<img src="${images.kitchenaid}" alt="KitchenAid Artisan 5-quart stand mixer in orange" width="679" height="679" loading="lazy" />
<figcaption>KitchenAid Artisan - The legendary bakers' tool</figcaption>
</figure>

<p>Meat pies, Yule logs, cookies by the hundreds... The holidays rhyme with baking! The <strong>5-quart KitchenAid Artisan</strong> is the legendary tool that will simplify all your preparations.</p>

<h3>Why it's a lifetime investment:</h3>
<ul>
<li><strong>Powerful motor</strong> - Even the densest doughs can't resist it</li>
<li><strong>5-quart (4.7L) bowl</strong> - Capacity for 9 dozen cookies!</li>
<li><strong>10 mixing speeds</strong> - From gentle kneading to intensive whipping</li>
<li><strong>Robust metal construction</strong> - Built to last for decades</li>
<li><strong>Tilt-head design</strong> - Easy access to bowl and attachments</li>
<li><strong>Over 10 optional attachments</strong> - Grinder, pasta maker, etc.</li>
</ul>

<p><strong>Ideal for:</strong> Pie crusts, whipped creams, meringues, breads and brioches, and much more!</p>

<p><strong>Price:</strong> About $450-550</p>

<p class="affiliate-link">
<a href="${amazonLinks.kitchenaid}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>Summary Table</h2>

<table>
<thead>
<tr>
<th>Product</th>
<th>Main Use</th>
<th>Approximate Price</th>
</tr>
</thead>
<tbody>
<tr>
<td>SENSARTE Pan</td>
<td>Crepes, blinis, eggs</td>
<td>~$40</td>
</tr>
<tr>
<td>Crock-Pot MyTime</td>
<td>Slow-cooked dishes, stews</td>
<td>~$80</td>
</tr>
<tr>
<td>Stainless Steel Bowls</td>
<td>Preparation, storage</td>
<td>~$50</td>
</tr>
<tr>
<td>Breville Barista</td>
<td>Espressos, cappuccinos</td>
<td>~$850</td>
</tr>
<tr>
<td>KitchenAid Artisan</td>
<td>Baking, kneading</td>
<td>~$500</td>
</tr>
</tbody>
</table>

<h2>Conclusion</h2>

<p>These 5 tools are true investments that will accompany you for years. Whether you're a weekend cook or a food enthusiast, they will make every holiday meal a moment of pleasure rather than a source of stress.</p>

<p>Our advice? If you must choose just one item, go for the <strong>Crock-Pot MyTime slow cooker</strong> - its value for money is unbeatable and it will free you from cooking stress while you enjoy your guests!</p>

<p><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`,
  seo_title: 'Holiday Kitchen Tools 2025 - Buying Guide',
  seo_description: 'Discover the 5 essential kitchen tools for successful holiday meals: slow cooker, KitchenAid mixer, espresso machine and more.',
};

async function createPost() {
  console.log('Creating holiday kitchen tools buying guide...');

  // 1. Get the guide-achat category
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'guide-achat');

  if (!categories || categories.length === 0) {
    console.error('Category guide-achat not found!');
    return;
  }

  const categoryId = categories[0].id;
  console.log('Category ID:', categoryId);

  // 2. Get default author
  const { data: authors } = await supabase
    .from('authors')
    .select('id')
    .limit(1);

  const authorId = authors?.[0]?.id || 1;

  // 3. Check if post already exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', postFR.slug)
    .single();

  let postId: number;

  if (existingPost) {
    console.log('Post already exists, updating...');
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: postFR.title,
        excerpt: postFR.excerpt,
        content: postFR.content,
        featured_image: postFR.featured_image,
        reading_time: postFR.reading_time,
        seo_title: postFR.seo_title,
        seo_description: postFR.seo_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPost.id);

    if (updateError) {
      console.error('Error updating post:', updateError);
      return;
    }
    postId = existingPost.id;
  } else {
    // 4. Create post
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert({
        slug: postFR.slug,
        title: postFR.title,
        excerpt: postFR.excerpt,
        content: postFR.content,
        featured_image: postFR.featured_image,
        author_id: authorId,
        reading_time: postFR.reading_time,
        seo_title: postFR.seo_title,
        seo_description: postFR.seo_description,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
      })
      .select('id')
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return;
    }

    postId = newPost.id;
    console.log('Post created with ID:', postId);

    // 5. Link post to category
    const { error: linkError } = await supabase
      .from('posts_categories')
      .insert({
        post_id: postId,
        category_id: categoryId,
      });

    if (linkError) {
      console.error('Error linking category:', linkError);
    } else {
      console.log('Category linked successfully!');
    }
  }

  // 6. Add/Update English translation with English slug
  const slugEn = 'essential-kitchen-tools-holiday-season';
  const { error: transError } = await supabase
    .from('post_translations')
    .upsert({
      post_id: postId,
      locale: 'en',
      slug_en: slugEn,
      title: postEN.title,
      excerpt: postEN.excerpt,
      content: postEN.content,
      seo_title: postEN.seo_title,
      seo_description: postEN.seo_description,
    }, { onConflict: 'post_id,locale' });

  if (transError) {
    console.error('Error with English translation:', transError);
  } else {
    console.log('English translation added/updated!');
  }

  console.log('\n✅ Buying guide post created successfully!');
  console.log(`\nFR: /guide-achat/${postFR.slug}`);
  console.log(`EN: /en/buying-guide/${slugEn}`);
}

createPost().catch(console.error);
