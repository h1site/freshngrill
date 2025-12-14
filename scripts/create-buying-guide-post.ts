/**
 * Script pour créer un article de guide d'achat
 * Usage: npx tsx scripts/create-buying-guide-post.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Configuration Amazon Affiliate
const AMAZON_TAG = 'h1site0d-20';

// Contenu français
const postFR = {
  slug: 'meilleures-machines-espresso',
  title: 'Les 10 Meilleures Machines à Espresso en 2025',
  excerpt: 'Découvrez notre sélection des meilleures machines à espresso pour préparer un café digne des meilleurs baristas. Guide complet avec comparatifs et avis.',
  content: `
<p>Vous rêvez de préparer un espresso parfait à la maison, avec une crema onctueuse et des arômes intenses? Le choix de la bonne machine à espresso est crucial pour atteindre cet objectif. Dans ce guide complet, nous avons testé et comparé les meilleures machines disponibles sur le marché canadien.</p>

<h2>Comment choisir sa machine à espresso?</h2>

<p>Avant de vous présenter notre sélection, voici les critères essentiels à considérer:</p>

<ul>
<li><strong>Type de machine</strong>: Manuelle, semi-automatique, automatique ou super-automatique</li>
<li><strong>Pression</strong>: Minimum 15 bars pour un vrai espresso</li>
<li><strong>Moulin intégré</strong>: Indispensable pour un café fraîchement moulu</li>
<li><strong>Système de lait</strong>: Buse vapeur ou mousseur automatique</li>
<li><strong>Capacité du réservoir</strong>: Selon votre consommation quotidienne</li>
</ul>

<h2>Notre Top 10 des Machines à Espresso</h2>

<h3>1. Breville Barista Express - Le meilleur rapport qualité-prix</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/71HjGprXRyL._AC_SL1500_.jpg" alt="Machine à espresso Breville Barista Express avec moulin intégré en acier inoxydable" width="800" height="600" loading="lazy" />
<figcaption>La Breville Barista Express - Notre coup de cœur 2025</figcaption>
</figure>

<p>La Breville Barista Express est notre coup de cœur. Elle combine un moulin conique intégré, un contrôle précis de la température et une buse vapeur performante. Parfaite pour les amateurs qui veulent s'initier à l'art du barista.</p>

<p><strong>Points forts:</strong></p>
<ul>
<li>Moulin conique intégré avec 18 réglages</li>
<li>Contrôle numérique de la température</li>
<li>Pression de 15 bars</li>
<li>Buse vapeur pivotante</li>
</ul>

<p><strong>Prix:</strong> Environ 850$</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B00CH9QWOU?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h3>2. De'Longhi Magnifica S - La super-automatique accessible</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61qjHpHpEeL._AC_SL1500_.jpg" alt="Machine à café automatique De'Longhi Magnifica S avec panneau de contrôle" width="800" height="600" loading="lazy" />
<figcaption>De'Longhi Magnifica S - Café parfait en une touche</figcaption>
</figure>

<p>Pour ceux qui préfèrent la simplicité, la De'Longhi Magnifica S offre un café parfait en une touche. Son moulin silencieux et son système de moussage automatique en font une excellente option pour les matins pressés.</p>

<p><strong>Points forts:</strong></p>
<ul>
<li>Entièrement automatique</li>
<li>Moulin silencieux intégré</li>
<li>Panneau de contrôle intuitif</li>
<li>Système de rinçage automatique</li>
</ul>

<p><strong>Prix:</strong> Environ 700$</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07RQ3NL76?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h3>3. Gaggia Classic Pro - Pour les puristes</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61RdmBGGURL._AC_SL1200_.jpg" alt="Machine espresso semi-automatique Gaggia Classic Pro en acier inoxydable brossé" width="800" height="600" loading="lazy" />
<figcaption>Gaggia Classic Pro - La référence des puristes</figcaption>
</figure>

<p>La Gaggia Classic Pro est une machine semi-automatique qui offre un contrôle total sur l'extraction. Avec son groupe café commercial et sa chaudière en laiton, elle produit des espressos de qualité professionnelle.</p>

<p><strong>Points forts:</strong></p>
<ul>
<li>Groupe café commercial 58mm</li>
<li>Chaudière en laiton</li>
<li>Construction robuste en acier inoxydable</li>
<li>Buse vapeur professionnelle</li>
</ul>

<p><strong>Prix:</strong> Environ 600$</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07RQ5KTMZ?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h3>4. Nespresso Vertuo Next - La capsule premium</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61S2GbYXx8L._AC_SL1500_.jpg" alt="Machine Nespresso Vertuo Next noire avec capsule et tasse à café" width="800" height="600" loading="lazy" />
<figcaption>Nespresso Vertuo Next - Simplicité et qualité</figcaption>
</figure>

<p>Si vous recherchez la commodité sans compromis sur la qualité, le système Vertuo de Nespresso utilise la technologie centrifusion pour extraire des cafés aux arômes riches. Idéal pour varier les plaisirs.</p>

<p><strong>Points forts:</strong></p>
<ul>
<li>Technologie Centrifusion brevetée</li>
<li>5 tailles de tasses</li>
<li>Reconnaissance automatique des capsules</li>
<li>Design compact</li>
</ul>

<p><strong>Prix:</strong> Environ 200$</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B084GY5Y5W?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h3>5. Breville Bambino Plus - Compact et performant</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/71Qk4j0h45L._AC_SL1500_.jpg" alt="Machine espresso compacte Breville Bambino Plus en acier inoxydable avec buse vapeur" width="800" height="600" loading="lazy" />
<figcaption>Breville Bambino Plus - Compact mais puissant</figcaption>
</figure>

<p>La Breville Bambino Plus prouve que petit format ne rime pas avec compromis. Avec son système ThermoJet qui chauffe en 3 secondes et sa buse vapeur automatique, elle est parfaite pour les petits espaces.</p>

<p><strong>Points forts:</strong></p>
<ul>
<li>Chauffe en 3 secondes</li>
<li>Buse vapeur automatique</li>
<li>Format ultra-compact</li>
<li>Pression de 15 bars</li>
</ul>

<p><strong>Prix:</strong> Environ 500$</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07XNVMZPP?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
Voir sur Amazon →
</a>
</p>

<h2>Tableau comparatif</h2>

<table>
<thead>
<tr>
<th>Machine</th>
<th>Type</th>
<th>Moulin</th>
<th>Prix</th>
</tr>
</thead>
<tbody>
<tr>
<td>Breville Barista Express</td>
<td>Semi-auto</td>
<td>Oui</td>
<td>~850$</td>
</tr>
<tr>
<td>De'Longhi Magnifica S</td>
<td>Super-auto</td>
<td>Oui</td>
<td>~700$</td>
</tr>
<tr>
<td>Gaggia Classic Pro</td>
<td>Semi-auto</td>
<td>Non</td>
<td>~600$</td>
</tr>
<tr>
<td>Nespresso Vertuo</td>
<td>Capsules</td>
<td>Non</td>
<td>~200$</td>
</tr>
<tr>
<td>Breville Bambino Plus</td>
<td>Semi-auto</td>
<td>Non</td>
<td>~500$</td>
</tr>
</tbody>
</table>

<h2>Accessoires indispensables</h2>

<p>Pour tirer le meilleur de votre machine à espresso, n'oubliez pas ces accessoires essentiels:</p>

<ul>
<li><strong>Moulin à café</strong> - Si votre machine n'en a pas, investissez dans un moulin de qualité</li>
<li><strong>Tamper</strong> - Pour un tassage uniforme et constant</li>
<li><strong>Pichet à lait</strong> - Pour maîtriser l'art du latte art</li>
<li><strong>Balance</strong> - Pour des dosages précis et reproductibles</li>
</ul>

<h2>Conclusion</h2>

<p>Le choix de votre machine à espresso dépend de vos priorités: simplicité d'utilisation, contrôle créatif, ou budget. Notre recommandation? La <strong>Breville Barista Express</strong> offre le meilleur équilibre entre facilité d'utilisation et qualité professionnelle.</p>

<p><em>En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.</em></p>
`,
  content_en: `
<p>Do you dream of making the perfect espresso at home, with smooth crema and intense aromas? Choosing the right espresso machine is crucial to achieving this goal. In this comprehensive guide, we've tested and compared the best machines available on the Canadian market.</p>

<h2>How to Choose Your Espresso Machine?</h2>

<p>Before presenting our selection, here are the essential criteria to consider:</p>

<ul>
<li><strong>Machine type</strong>: Manual, semi-automatic, automatic or super-automatic</li>
<li><strong>Pressure</strong>: Minimum 15 bars for a real espresso</li>
<li><strong>Built-in grinder</strong>: Essential for freshly ground coffee</li>
<li><strong>Milk system</strong>: Steam wand or automatic frother</li>
<li><strong>Tank capacity</strong>: According to your daily consumption</li>
</ul>

<h2>Our Top 10 Espresso Machines</h2>

<h3>1. Breville Barista Express - Best Value</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/71HjGprXRyL._AC_SL1500_.jpg" alt="Breville Barista Express espresso machine with built-in grinder in stainless steel" width="800" height="600" loading="lazy" />
<figcaption>The Breville Barista Express - Our 2025 Top Pick</figcaption>
</figure>

<p>The Breville Barista Express is our favorite. It combines a built-in conical grinder, precise temperature control and a powerful steam wand. Perfect for enthusiasts who want to learn the art of the barista.</p>

<p><strong>Strengths:</strong></p>
<ul>
<li>Built-in conical grinder with 18 settings</li>
<li>Digital temperature control</li>
<li>15 bar pressure</li>
<li>Swivel steam wand</li>
</ul>

<p><strong>Price:</strong> About $850</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B00CH9QWOU?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h3>2. De'Longhi Magnifica S - Accessible Super-Automatic</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61qjHpHpEeL._AC_SL1500_.jpg" alt="De'Longhi Magnifica S automatic coffee machine with control panel" width="800" height="600" loading="lazy" />
<figcaption>De'Longhi Magnifica S - Perfect coffee at the touch of a button</figcaption>
</figure>

<p>For those who prefer simplicity, the De'Longhi Magnifica S offers perfect coffee at the touch of a button. Its quiet grinder and automatic frothing system make it an excellent option for busy mornings.</p>

<p><strong>Strengths:</strong></p>
<ul>
<li>Fully automatic</li>
<li>Built-in quiet grinder</li>
<li>Intuitive control panel</li>
<li>Automatic rinse system</li>
</ul>

<p><strong>Price:</strong> About $700</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07RQ3NL76?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h3>3. Gaggia Classic Pro - For Purists</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61RdmBGGURL._AC_SL1200_.jpg" alt="Gaggia Classic Pro semi-automatic espresso machine in brushed stainless steel" width="800" height="600" loading="lazy" />
<figcaption>Gaggia Classic Pro - The purist's reference</figcaption>
</figure>

<p>The Gaggia Classic Pro is a semi-automatic machine that offers total control over extraction. With its commercial brew group and brass boiler, it produces professional-quality espressos.</p>

<p><strong>Strengths:</strong></p>
<ul>
<li>58mm commercial brew group</li>
<li>Brass boiler</li>
<li>Robust stainless steel construction</li>
<li>Professional steam wand</li>
</ul>

<p><strong>Price:</strong> About $600</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07RQ5KTMZ?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h3>4. Nespresso Vertuo Next - Premium Capsules</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/61S2GbYXx8L._AC_SL1500_.jpg" alt="Black Nespresso Vertuo Next machine with capsule and coffee cup" width="800" height="600" loading="lazy" />
<figcaption>Nespresso Vertuo Next - Simplicity and quality</figcaption>
</figure>

<p>If you're looking for convenience without compromising on quality, the Nespresso Vertuo system uses centrifusion technology to extract rich-flavored coffees. Ideal for variety.</p>

<p><strong>Strengths:</strong></p>
<ul>
<li>Patented Centrifusion technology</li>
<li>5 cup sizes</li>
<li>Automatic capsule recognition</li>
<li>Compact design</li>
</ul>

<p><strong>Price:</strong> About $200</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B084GY5Y5W?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h3>5. Breville Bambino Plus - Compact and Powerful</h3>

<figure>
<img src="https://m.media-amazon.com/images/I/71Qk4j0h45L._AC_SL1500_.jpg" alt="Compact Breville Bambino Plus espresso machine in stainless steel with steam wand" width="800" height="600" loading="lazy" />
<figcaption>Breville Bambino Plus - Compact but powerful</figcaption>
</figure>

<p>The Breville Bambino Plus proves that small format doesn't mean compromise. With its ThermoJet system that heats in 3 seconds and its automatic steam wand, it's perfect for small spaces.</p>

<p><strong>Strengths:</strong></p>
<ul>
<li>Heats in 3 seconds</li>
<li>Automatic steam wand</li>
<li>Ultra-compact format</li>
<li>15 bar pressure</li>
</ul>

<p><strong>Price:</strong> About $500</p>

<p class="affiliate-link">
<a href="https://www.amazon.ca/dp/B07XNVMZPP?tag=${AMAZON_TAG}" target="_blank" rel="noopener noreferrer sponsored" class="button-amazon">
View on Amazon →
</a>
</p>

<h2>Comparison Table</h2>

<table>
<thead>
<tr>
<th>Machine</th>
<th>Type</th>
<th>Grinder</th>
<th>Price</th>
</tr>
</thead>
<tbody>
<tr>
<td>Breville Barista Express</td>
<td>Semi-auto</td>
<td>Yes</td>
<td>~$850</td>
</tr>
<tr>
<td>De'Longhi Magnifica S</td>
<td>Super-auto</td>
<td>Yes</td>
<td>~$700</td>
</tr>
<tr>
<td>Gaggia Classic Pro</td>
<td>Semi-auto</td>
<td>No</td>
<td>~$600</td>
</tr>
<tr>
<td>Nespresso Vertuo</td>
<td>Capsules</td>
<td>No</td>
<td>~$200</td>
</tr>
<tr>
<td>Breville Bambino Plus</td>
<td>Semi-auto</td>
<td>No</td>
<td>~$500</td>
</tr>
</tbody>
</table>

<h2>Essential Accessories</h2>

<p>To get the most out of your espresso machine, don't forget these essential accessories:</p>

<ul>
<li><strong>Coffee grinder</strong> - If your machine doesn't have one, invest in a quality grinder</li>
<li><strong>Tamper</strong> - For uniform and consistent tamping</li>
<li><strong>Milk pitcher</strong> - To master the art of latte art</li>
<li><strong>Scale</strong> - For precise and reproducible dosing</li>
</ul>

<h2>Conclusion</h2>

<p>The choice of your espresso machine depends on your priorities: ease of use, creative control, or budget. Our recommendation? The <strong>Breville Barista Express</strong> offers the best balance between ease of use and professional quality.</p>

<p><em>As an Amazon Associate, we earn from qualifying purchases.</em></p>
`,
  title_en: 'The 10 Best Espresso Machines in 2025',
  excerpt_en: 'Discover our selection of the best espresso machines to prepare coffee worthy of the best baristas. Complete guide with comparisons and reviews.',
  featured_image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1200&h=800&fit=crop',
  reading_time: 8,
  seo_title: 'Meilleures Machines à Espresso 2025 - Guide d\'Achat Complet',
  seo_description: 'Comparatif des meilleures machines à espresso: Breville, De\'Longhi, Gaggia. Trouvez la machine parfaite pour préparer un café digne d\'un barista.',
  seo_title_en: 'Best Espresso Machines 2025 - Complete Buying Guide',
  seo_description_en: 'Comparison of the best espresso machines: Breville, De\'Longhi, Gaggia. Find the perfect machine to prepare barista-quality coffee.',
};

async function updateEnglishTranslation(postId: number, post: typeof postFR) {
  const { error } = await supabase
    .from('post_translations')
    .upsert({
      post_id: postId,
      locale: 'en',
      title: post.title_en,
      excerpt: post.excerpt_en,
      content: post.content_en,
      seo_title: post.seo_title_en,
      seo_description: post.seo_description_en,
    }, { onConflict: 'post_id,locale' });

  if (error) {
    console.error('Error updating translation:', error);
  } else {
    console.log('English translation updated!');
  }
}

async function createPost() {
  console.log('Creating buying guide post...');

  // 1. Vérifier si la catégorie guide-achat existe
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'guide-achat');

  let categoryId: number;

  if (!categories || categories.length === 0) {
    console.log('Creating guide-achat category...');
    const { data: newCat, error: catError } = await supabase
      .from('post_categories')
      .insert({
        name: "Guide d'achat",
        slug: 'guide-achat',
        name_en: 'Buying Guide',
      })
      .select('id')
      .single();

    if (catError) {
      console.error('Error creating category:', catError);
      return;
    }
    categoryId = newCat.id;
  } else {
    categoryId = categories[0].id;
  }

  console.log('Category ID:', categoryId);

  // 2. Obtenir l'auteur par défaut (ou créer un)
  const { data: authors } = await supabase
    .from('authors')
    .select('id')
    .limit(1);

  const authorId = authors?.[0]?.id || 1;

  // 3. Vérifier si le post existe déjà
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', postFR.slug)
    .single();

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

    // Mettre à jour la traduction anglaise
    await updateEnglishTranslation(existingPost.id, postFR);

    console.log('Post updated successfully!');
    return;
  }

  // 4. Créer le post
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

  console.log('Post created with ID:', newPost.id);

  // 5. Lier le post à la catégorie
  const { error: linkError } = await supabase
    .from('posts_categories')
    .insert({
      post_id: newPost.id,
      category_id: categoryId,
    });

  if (linkError) {
    console.error('Error linking category:', linkError);
    return;
  }

  console.log('Category linked successfully!');

  // 6. Ajouter la traduction anglaise
  await updateEnglishTranslation(newPost.id, postFR);

  console.log('\n✅ Buying guide post created successfully!');
  console.log(`\nFR: /blog/${postFR.slug}`);
  console.log(`EN: /en/blog/${postFR.slug}`);
}

createPost().catch(console.error);
