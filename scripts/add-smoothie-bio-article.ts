/**
 * Script d'ajout de l'article "Recette rapide de smoothie avec produits biologiques du supermarché"
 * Avec traduction anglaise
 *
 * Usage: npx tsx scripts/add-smoothie-bio-article.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// =============================================
// ARTICLE FRANÇAIS
// =============================================

const ARTICLE_FR = {
  slug: 'recette-rapide-smoothie-produits-biologiques-supermarche',
  title: 'Recette rapide de smoothie avec produits biologiques du supermarché',
  excerpt: 'Préparer un smoothie rapide avec des produits biologiques du supermarché est l\'une des façons les plus simples d\'intégrer de bonnes habitudes alimentaires au quotidien.',
  content: `<p>Préparer un smoothie rapide avec des produits biologiques du supermarché est l'une des façons les plus simples d'intégrer de bonnes habitudes alimentaires au quotidien. Accessible, nourrissant et personnalisable à l'infini, le smoothie bio est parfait pour le déjeuner, une collation post-entraînement ou même un petit repas sur le pouce.</p>

<p>Dans cet article, vous découvrirez une recette simple et rapide, des conseils pour bien choisir vos ingrédients biologiques en supermarché, ainsi que plusieurs variantes selon vos goûts et vos besoins.</p>

<h2>Pourquoi choisir des produits biologiques pour vos smoothies ?</h2>

<p>Les produits biologiques sont cultivés sans pesticides chimiques de synthèse ni OGM. Pour un smoothie, où les fruits et légumes sont consommés crus et entiers, le bio présente plusieurs avantages :</p>

<ul>
<li>Moins de résidus chimiques</li>
<li>Saveur plus authentique</li>
<li>Meilleure qualité nutritionnelle</li>
<li>Impact environnemental réduit</li>
</ul>

<p>Bonne nouvelle : aujourd'hui, la majorité des supermarchés proposent une large gamme de fruits biologiques frais ou surgelés, souvent à prix très raisonnable.</p>

<figure>
<img src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80" alt="Smoothie aux fruits biologiques dans un verre avec des fruits frais autour" />
<figcaption>Un smoothie coloré préparé avec des fruits biologiques frais</figcaption>
</figure>

<h2>Recette rapide de smoothie biologique (prête en 5 minutes)</h2>

<h3>Ingrédients (1 grand verre)</h3>

<ul>
<li>1 banane biologique mûre</li>
<li>1 tasse de fruits biologiques surgelés (fraises, bleuets ou mangue)</li>
<li>1 poignée d'épinards biologiques frais</li>
<li>250 ml de lait végétal biologique (amande, avoine ou soya)</li>
<li>1 cuillère à soupe de graines de chia biologiques</li>
<li>1 cuillère à thé de miel biologique ou de sirop d'érable (optionnel)</li>
</ul>

<h3>Préparation</h3>

<ol>
<li>Déposez tous les ingrédients dans un mélangeur.</li>
<li>Mixez pendant 30 à 60 secondes jusqu'à obtenir une texture lisse.</li>
<li>Ajustez la consistance avec un peu plus de lait végétal si nécessaire.</li>
<li>Servez immédiatement et dégustez bien frais.</li>
</ol>

<p><strong>Astuce express :</strong> utiliser des fruits surgelés évite d'ajouter de la glace et donne une texture plus crémeuse.</p>

<figure>
<img src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80" alt="Préparation d'un smoothie vert avec des épinards et des fruits" />
<figcaption>La préparation d'un smoothie vert riche en nutriments</figcaption>
</figure>

<h2>Comment bien choisir ses produits biologiques au supermarché</h2>

<p>Pas besoin d'aller dans une boutique spécialisée. Voici comment repérer rapidement les bons produits bio :</p>

<ul>
<li><strong>Fruits et légumes :</strong> privilégiez ceux avec le logo biologique certifié</li>
<li><strong>Surgelé :</strong> excellent rapport qualité-prix, disponible toute l'année</li>
<li><strong>Laits végétaux :</strong> choisissez des versions sans sucre ajouté</li>
<li><strong>Graines et superaliments :</strong> souvent en vrac ou dans l'allée naturelle</li>
</ul>

<p>Les bananes, pommes, épinards et fruits rouges sont particulièrement intéressants à acheter en version biologique.</p>

<h2>Variantes de smoothies biologiques faciles</h2>

<figure>
<img src="https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&q=80" alt="Trois variétés de smoothies colorés dans des verres" />
<figcaption>Différentes variantes de smoothies pour tous les goûts</figcaption>
</figure>

<h3>Smoothie vert détox</h3>
<ul>
<li>Banane bio</li>
<li>Pomme verte bio</li>
<li>Kale ou épinards bio</li>
<li>Jus de citron bio</li>
<li>Eau de coco bio</li>
</ul>

<h3>Smoothie protéiné bio</h3>
<ul>
<li>Banane bio</li>
<li>Beurre d'arachide biologique</li>
<li>Lait de soya bio</li>
<li>Flocons d'avoine biologiques</li>
</ul>

<h3>Smoothie aux fruits rouges antioxydants</h3>
<ul>
<li>Fraises, framboises et bleuets bio</li>
<li>Yogourt nature biologique</li>
<li>Graines de lin moulues bio</li>
</ul>

<h2>Valeurs nutritionnelles approximatives (par portion)</h2>

<table>
<tr><td><strong>Calories</strong></td><td>280 kcal</td></tr>
<tr><td><strong>Protéines</strong></td><td>8 g</td></tr>
<tr><td><strong>Fibres</strong></td><td>9 g</td></tr>
<tr><td><strong>Sucres naturels</strong></td><td>22 g</td></tr>
<tr><td><strong>Bons gras</strong></td><td>6 g</td></tr>
</table>

<p>Un excellent équilibre entre énergie, fibres et nutriments essentiels.</p>

<figure>
<img src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80" alt="Ingrédients biologiques pour smoothie : fruits, légumes et graines" />
<figcaption>Des ingrédients biologiques de qualité pour vos smoothies</figcaption>
</figure>

<h2>Conseils pour gagner encore plus de temps</h2>

<ul>
<li>Préparez des sacs de smoothie à l'avance (fruits + légumes déjà portionnés)</li>
<li>Conservez les fruits mûrs au congélateur</li>
<li>Nettoyez votre mélangeur immédiatement après usage</li>
<li>Ajoutez les superaliments directement avant de mixer</li>
</ul>

<h2>Conclusion</h2>

<p>Cette recette rapide de smoothie avec produits biologiques du supermarché prouve qu'il est facile de manger sainement, même avec un horaire chargé. En quelques minutes seulement, vous obtenez une boisson complète, nourrissante et savoureuse, préparée avec des ingrédients simples et accessibles.</p>

<p>Que vous soyez amateur de smoothies verts, fruités ou protéinés, le bio s'intègre parfaitement à votre routine quotidienne — sans complication, ni compromis sur le goût.</p>

<p><strong>Essayez-la dès aujourd'hui et adaptez-la selon vos envies !</strong></p>`,
  featured_image: 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=1200&q=80',
  reading_time: 6,
  seo_title: 'Recette rapide de smoothie bio du supermarché | 5 minutes',
  seo_description: 'Découvrez comment préparer un délicieux smoothie avec des produits biologiques du supermarché en 5 minutes. Recette facile, variantes et conseils pour bien choisir vos ingrédients bio.',
};

// =============================================
// TRADUCTION ANGLAISE
// =============================================

const ARTICLE_EN = {
  slug_en: 'quick-organic-smoothie-recipe-supermarket-products',
  title: 'Quick Organic Smoothie Recipe with Supermarket Products',
  excerpt: 'Making a quick smoothie with organic supermarket products is one of the easiest ways to incorporate healthy eating habits into your daily routine.',
  content: `<p>Making a quick smoothie with organic supermarket products is one of the easiest ways to incorporate healthy eating habits into your daily routine. Accessible, nourishing and infinitely customizable, the organic smoothie is perfect for breakfast, a post-workout snack or even a quick meal on the go.</p>

<p>In this article, you'll discover a simple and quick recipe, tips for choosing your organic ingredients at the supermarket, as well as several variations according to your tastes and needs.</p>

<h2>Why choose organic products for your smoothies?</h2>

<p>Organic products are grown without synthetic chemical pesticides or GMOs. For a smoothie, where fruits and vegetables are consumed raw and whole, organic offers several advantages:</p>

<ul>
<li>Fewer chemical residues</li>
<li>More authentic flavor</li>
<li>Better nutritional quality</li>
<li>Reduced environmental impact</li>
</ul>

<p>Good news: today, most supermarkets offer a wide range of fresh or frozen organic fruits, often at very reasonable prices.</p>

<figure>
<img src="https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=800&q=80" alt="Organic fruit smoothie in a glass with fresh fruits around" />
<figcaption>A colorful smoothie made with fresh organic fruits</figcaption>
</figure>

<h2>Quick organic smoothie recipe (ready in 5 minutes)</h2>

<h3>Ingredients (1 large glass)</h3>

<ul>
<li>1 ripe organic banana</li>
<li>1 cup frozen organic fruits (strawberries, blueberries or mango)</li>
<li>1 handful of fresh organic spinach</li>
<li>250 ml organic plant milk (almond, oat or soy)</li>
<li>1 tablespoon organic chia seeds</li>
<li>1 teaspoon organic honey or maple syrup (optional)</li>
</ul>

<h3>Preparation</h3>

<ol>
<li>Place all ingredients in a blender.</li>
<li>Blend for 30 to 60 seconds until smooth.</li>
<li>Adjust consistency with a little more plant milk if necessary.</li>
<li>Serve immediately and enjoy fresh.</li>
</ol>

<p><strong>Express tip:</strong> using frozen fruits avoids adding ice and gives a creamier texture.</p>

<figure>
<img src="https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&q=80" alt="Preparation of a green smoothie with spinach and fruits" />
<figcaption>Preparing a nutrient-rich green smoothie</figcaption>
</figure>

<h2>How to choose your organic products at the supermarket</h2>

<p>No need to go to a specialty store. Here's how to quickly spot good organic products:</p>

<ul>
<li><strong>Fruits and vegetables:</strong> prioritize those with the certified organic logo</li>
<li><strong>Frozen:</strong> excellent value for money, available year-round</li>
<li><strong>Plant milks:</strong> choose versions without added sugar</li>
<li><strong>Seeds and superfoods:</strong> often in bulk or in the natural aisle</li>
</ul>

<p>Bananas, apples, spinach and berries are particularly worth buying in organic version.</p>

<h2>Easy organic smoothie variations</h2>

<figure>
<img src="https://images.unsplash.com/photo-1638176066666-ffb2f013c7dd?w=800&q=80" alt="Three varieties of colorful smoothies in glasses" />
<figcaption>Different smoothie variations for all tastes</figcaption>
</figure>

<h3>Detox green smoothie</h3>
<ul>
<li>Organic banana</li>
<li>Organic green apple</li>
<li>Organic kale or spinach</li>
<li>Organic lemon juice</li>
<li>Organic coconut water</li>
</ul>

<h3>Organic protein smoothie</h3>
<ul>
<li>Organic banana</li>
<li>Organic peanut butter</li>
<li>Organic soy milk</li>
<li>Organic oat flakes</li>
</ul>

<h3>Antioxidant berry smoothie</h3>
<ul>
<li>Organic strawberries, raspberries and blueberries</li>
<li>Organic plain yogurt</li>
<li>Organic ground flax seeds</li>
</ul>

<h2>Approximate nutritional values (per serving)</h2>

<table>
<tr><td><strong>Calories</strong></td><td>280 kcal</td></tr>
<tr><td><strong>Protein</strong></td><td>8 g</td></tr>
<tr><td><strong>Fiber</strong></td><td>9 g</td></tr>
<tr><td><strong>Natural sugars</strong></td><td>22 g</td></tr>
<tr><td><strong>Healthy fats</strong></td><td>6 g</td></tr>
</table>

<p>An excellent balance of energy, fiber and essential nutrients.</p>

<figure>
<img src="https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=800&q=80" alt="Organic smoothie ingredients: fruits, vegetables and seeds" />
<figcaption>Quality organic ingredients for your smoothies</figcaption>
</figure>

<h2>Tips to save even more time</h2>

<ul>
<li>Prepare smoothie bags in advance (fruits + vegetables already portioned)</li>
<li>Store ripe fruits in the freezer</li>
<li>Clean your blender immediately after use</li>
<li>Add superfoods directly before blending</li>
</ul>

<h2>Conclusion</h2>

<p>This quick smoothie recipe with organic supermarket products proves that it's easy to eat healthy, even with a busy schedule. In just a few minutes, you get a complete, nourishing and delicious drink, made with simple and accessible ingredients.</p>

<p>Whether you're a fan of green, fruity or protein smoothies, organic fits perfectly into your daily routine — without complication or compromise on taste.</p>

<p><strong>Try it today and adapt it to your preferences!</strong></p>`,
  seo_title: 'Quick Organic Smoothie Recipe from the Supermarket | 5 minutes',
  seo_description: 'Discover how to prepare a delicious smoothie with organic supermarket products in 5 minutes. Easy recipe, variations and tips for choosing your organic ingredients.',
};

// =============================================
// CATÉGORIE À ASSOCIER
// =============================================

const CATEGORY_SLUGS = ['sante-et-nutrition'];

async function main() {
  console.log('Ajout de l\'article "Recette rapide de smoothie avec produits biologiques"...\n');

  // 1. Vérifier si l'article existe déjà
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id, slug')
    .eq('slug', ARTICLE_FR.slug)
    .single();

  if (existingPost) {
    console.log(`La recette existe déjà (ID: ${existingPost.id}). Mise à jour...`);
  }

  // 2. Insérer ou mettre à jour l'article français
  console.log('Insertion de l\'article français...');
  const { data: post, error: postError } = await supabase
    .from('posts')
    .upsert({
      slug: ARTICLE_FR.slug,
      title: ARTICLE_FR.title,
      excerpt: ARTICLE_FR.excerpt,
      content: ARTICLE_FR.content,
      featured_image: ARTICLE_FR.featured_image,
      reading_time: ARTICLE_FR.reading_time,
      seo_title: ARTICLE_FR.seo_title,
      seo_description: ARTICLE_FR.seo_description,
      status: 'published',
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'slug' })
    .select()
    .single();

  if (postError) {
    console.error('Erreur insertion article:', postError.message);
    process.exit(1);
  }

  console.log(`Article inséré/mis à jour (ID: ${post.id})`);

  // 3. Associer les catégories
  console.log('\nAssociation des catégories...');

  // Récupérer les IDs des catégories
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id, slug, name')
    .in('slug', CATEGORY_SLUGS);

  if (categories && categories.length > 0) {
    // Supprimer les anciennes associations
    await supabase.from('posts_categories').delete().eq('post_id', post.id);

    // Créer les nouvelles associations
    const categoryLinks = categories.map((cat: { id: number }) => ({
      post_id: post.id,
      category_id: cat.id,
    }));

    const { error: catError } = await supabase
      .from('posts_categories')
      .insert(categoryLinks);

    if (catError) {
      console.warn('Erreur association catégories:', catError.message);
    } else {
      console.log(`Catégories associées: ${categories.map((c: { name: string }) => c.name).join(', ')}`);
    }
  } else {
    console.log('Catégories non trouvées, création de "Santé et nutrition"...');

    // Créer la catégorie si elle n'existe pas
    const { data: newCategory, error: newCatError } = await supabase
      .from('post_categories')
      .upsert({
        slug: 'sante-et-nutrition',
        name: 'Santé et nutrition',
      }, { onConflict: 'slug' })
      .select()
      .single();

    if (newCategory) {
      await supabase.from('posts_categories').delete().eq('post_id', post.id);
      await supabase.from('posts_categories').insert({
        post_id: post.id,
        category_id: newCategory.id,
      });
      console.log('Catégorie "Santé et nutrition" créée et associée');
    }
  }

  // 4. Ajouter la traduction anglaise
  console.log('\nAjout de la traduction anglaise...');

  const { error: translationError } = await supabase
    .from('post_translations')
    .upsert({
      post_id: post.id,
      locale: 'en',
      slug_en: ARTICLE_EN.slug_en,
      title: ARTICLE_EN.title,
      excerpt: ARTICLE_EN.excerpt,
      content: ARTICLE_EN.content,
      seo_title: ARTICLE_EN.seo_title,
      seo_description: ARTICLE_EN.seo_description,
    }, {
      onConflict: 'post_id,locale'
    });

  if (translationError) {
    console.error('Erreur traduction:', translationError.message);
  } else {
    console.log('Traduction anglaise ajoutée');
  }

  // 5. Vérification finale
  console.log('\nVérification finale...');

  const { data: finalPost } = await supabase
    .from('posts_with_details')
    .select('*')
    .eq('id', post.id)
    .single();

  const { data: finalTranslation } = await supabase
    .from('post_translations')
    .select('*')
    .eq('post_id', post.id)
    .eq('locale', 'en')
    .single();

  console.log('\nRésultat:');
  console.log(`   ID: ${post.id}`);
  console.log(`   Slug FR: ${finalPost?.slug || 'N/A'}`);
  console.log(`   Slug EN: ${finalTranslation?.slug_en || 'N/A'}`);
  console.log(`   Titre FR: ${finalPost?.title || 'N/A'}`);
  console.log(`   Titre EN: ${finalTranslation?.title || 'N/A'}`);
  console.log(`   Image: ${finalPost?.featured_image ? 'Oui' : 'Non'}`);
  console.log(`   Temps de lecture: ${finalPost?.reading_time || 0} min`);

  console.log('\nTerminé!');
  console.log(`   FR: https://menucochon.com/article/${ARTICLE_FR.slug}/`);
  console.log(`   EN: https://menucochon.com/en/article/${ARTICLE_EN.slug_en}/`);
}

main().catch(console.error);
