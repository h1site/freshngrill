/**
 * Script pour créer l'article de blog sur les crêpes des fêtes
 * et ajouter les liens internes aux recettes de crêpes
 *
 * Usage: npx tsx scripts/create-crepes-article-and-links.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================
// CONTENU DE L'ARTICLE DE BLOG
// ============================================

const blogPost = {
  slug: 'recettes-crepes-noel-jour-de-lan',
  slug_en: 'crepe-recipes-christmas-new-year',
  title: 'Nos 5 meilleures recettes de crêpes pour Noël et le Jour de l\'An',
  title_en: 'Our 5 Best Crepe Recipes for Christmas and New Year\'s',
  excerpt: 'Découvrez nos 5 meilleures recettes de crêpes pour vos brunchs des fêtes : traditionnelles, protéinées, allemandes et plus. Parfaites pour Noël et le Jour de l\'An!',
  excerpt_en: 'Discover our 5 best crepe recipes for your holiday brunches: traditional, protein-packed, German-style and more. Perfect for Christmas and New Year\'s!',
  featured_image: '/images/blog/crepes-fetes.jpg',
  reading_time: 6,
  seo_title: 'Recettes de crêpes pour Noël et Jour de l\'An | Menu Cochon',
  seo_description: 'Découvrez nos 5 meilleures recettes de crêpes pour les fêtes. Traditionnelles, protéinées, allemandes et légères. Parfaites pour vos brunchs de Noël!',
  seo_title_en: 'Crepe Recipes for Christmas and New Year | Menu Cochon',
  seo_description_en: 'Discover our 5 best crepe recipes for the holidays. Traditional, protein-packed, German-style and light. Perfect for your Christmas brunches!',
  content: `
<p>Les fêtes de fin d'année sont le moment parfait pour réunir famille et amis autour d'un brunch gourmand. Et quoi de mieux que des crêpes maison pour commencer la journée en beauté? Que ce soit le matin de Noël ou le lendemain du réveillon du Jour de l'An, nos recettes de crêpes sauront régaler petits et grands.</p>

<p>Voici notre sélection de 5 recettes de crêpes, chacune avec son caractère unique, pour illuminer vos matins festifs.</p>

<h2>1. Crêpe maison traditionnelle</h2>

<p><strong>La classique indémodable</strong></p>

<p>Rien ne vaut une bonne crêpe traditionnelle comme on les fait en famille depuis des générations. Cette recette simple utilise des ingrédients de base — farine, œufs, lait, beurre — pour un résultat parfait à chaque fois. Dorée, souple et légèrement parfumée, elle se prête autant aux garnitures sucrées (sirop d'érable, Nutella, fruits) que salées (jambon-fromage, œufs).</p>

<ul>
<li><strong>Temps de préparation :</strong> 10 min</li>
<li><strong>Cuisson :</strong> 30 min</li>
<li><strong>Portions :</strong> 12</li>
</ul>

<p><a href="/recette/crepe/">Voir la recette complète →</a></p>

<h2>2. Crêpes de base faciles (pâte à crêpes maison)</h2>

<p><strong>Pour les débutants et les pressés</strong></p>

<p>Cette version simplifiée est idéale pour ceux qui veulent des crêpes réussies sans complications. La pâte est fluide, sans grumeaux, et le temps de repos de 30 minutes assure des crêpes moelleuses et souples. Parfaites pour un brunch de Noël rapide mais délicieux!</p>

<ul>
<li><strong>Temps de préparation :</strong> 10 min</li>
<li><strong>Cuisson :</strong> 20 min</li>
<li><strong>Repos :</strong> 30 min</li>
<li><strong>Portions :</strong> 4</li>
</ul>

<p><a href="/recette/crepes-maison-recette-de-base/">Voir la recette complète →</a></p>

<h2>3. Crêpe allemande Pfannkuchen</h2>

<p><strong>L'originalité qui impressionne</strong></p>

<p>Pour surprendre vos invités, optez pour cette crêpe allemande spectaculaire! Mi-crêpe, mi-gâteau, le Pfannkuchen gonfle au four et se déguste garni de fruits frais, crème fouettée ou chocolat. Une présentation festive qui fera sensation sur votre table de Noël.</p>

<ul>
<li><strong>Temps de préparation :</strong> 10 min</li>
<li><strong>Cuisson :</strong> 15 min</li>
<li><strong>Portions :</strong> 6</li>
<li><strong>Calories :</strong> 113 kcal/portion</li>
</ul>

<p><a href="/recette/crepe-allemande-pfannkuchen/">Voir la recette complète →</a></p>

<h2>4. Crêpe protéinée</h2>

<p><strong>Pour les sportifs et les gourmands santé</strong></p>

<p>Après les excès des fêtes, cette crêpe riche en protéines est parfaite pour bien commencer l'année! Elle combine poudre de protéines, œufs et flocons d'avoine pour un petit-déjeuner nourrissant qui soutient vos objectifs fitness sans sacrifier le goût. Idéale pour le brunch du 1er janvier!</p>

<ul>
<li><strong>Temps de préparation :</strong> 5 min</li>
<li><strong>Cuisson :</strong> 10 min</li>
<li><strong>Portions :</strong> 4</li>
</ul>

<p><a href="/recette/crepe-proteinee/">Voir la recette complète →</a></p>

<h2>5. Crêpes minces légères</h2>

<p><strong>La version allégée</strong></p>

<p>Ces crêpes légères utilisent de la farine de blé entier, du lait écrémé et de l'huile de coco pour un résultat savoureux à seulement 118 calories par portion. Parfaites pour ceux qui veulent se faire plaisir tout en gardant un œil sur leur alimentation pendant les fêtes.</p>

<ul>
<li><strong>Calories :</strong> 118 kcal/portion</li>
</ul>

<p><a href="/recette/crepes-minces/">Voir la recette complète →</a></p>

<h2>Nos conseils pour un brunch de crêpes réussi</h2>

<ul>
<li><strong>Préparez la pâte la veille :</strong> Elle se conserve très bien au réfrigérateur et sera encore plus souple le lendemain.</li>
<li><strong>Gardez les crêpes au chaud :</strong> Empilez-les sous un linge propre ou au four à 80°C.</li>
<li><strong>Variez les garnitures :</strong> Proposez un bar à crêpes avec sirop d'érable, fruits frais, Nutella, crème fouettée, confitures et garnitures salées.</li>
<li><strong>Impliquez les enfants :</strong> Les crêpes sont parfaites pour cuisiner en famille!</li>
</ul>

<h2>Joyeuses Fêtes!</h2>

<p>Nous espérons que ces recettes de crêpes rendront vos matins de Noël et du Jour de l'An encore plus savoureux. N'hésitez pas à partager vos créations avec nous!</p>

<p><strong>Bonne cuisine et joyeuses fêtes!</strong></p>
`,
  content_en: `
<p>The holiday season is the perfect time to gather family and friends for a delicious brunch. And what better way to start the day than with homemade crepes? Whether it's Christmas morning or the day after New Year's Eve, our crepe recipes will delight young and old alike.</p>

<p>Here's our selection of 5 crepe recipes, each with its own unique character, to brighten up your festive mornings.</p>

<h2>1. Traditional Homemade Crepe</h2>

<p><strong>The timeless classic</strong></p>

<p>Nothing beats a good traditional crepe like families have been making for generations. This simple recipe uses basic ingredients — flour, eggs, milk, butter — for perfect results every time. Golden, soft and subtly flavored, it works for both sweet toppings (maple syrup, Nutella, fruits) and savory fillings (ham and cheese, eggs).</p>

<ul>
<li><strong>Prep time:</strong> 10 min</li>
<li><strong>Cook time:</strong> 30 min</li>
<li><strong>Servings:</strong> 12</li>
</ul>

<p><a href="/en/recipe/crepe/">See full recipe →</a></p>

<h2>2. Easy Basic Crepes (Homemade Batter)</h2>

<p><strong>For beginners and busy cooks</strong></p>

<p>This simplified version is ideal for those who want successful crepes without complications. The batter is smooth, lump-free, and the 30-minute resting time ensures soft and supple crepes. Perfect for a quick but delicious Christmas brunch!</p>

<ul>
<li><strong>Prep time:</strong> 10 min</li>
<li><strong>Cook time:</strong> 20 min</li>
<li><strong>Rest time:</strong> 30 min</li>
<li><strong>Servings:</strong> 4</li>
</ul>

<p><a href="/en/recipe/crepes-maison-recette-de-base/">See full recipe →</a></p>

<h2>3. German Crepe (Pfannkuchen)</h2>

<p><strong>The impressive original</strong></p>

<p>To surprise your guests, try this spectacular German pancake! Part crepe, part cake, the Pfannkuchen puffs up in the oven and is served with fresh fruits, whipped cream or chocolate. A festive presentation that will make a splash on your Christmas table.</p>

<ul>
<li><strong>Prep time:</strong> 10 min</li>
<li><strong>Cook time:</strong> 15 min</li>
<li><strong>Servings:</strong> 6</li>
<li><strong>Calories:</strong> 113 kcal/serving</li>
</ul>

<p><a href="/en/recipe/crepe-allemande-pfannkuchen/">See full recipe →</a></p>

<h2>4. Protein Crepe</h2>

<p><strong>For athletes and health-conscious foodies</strong></p>

<p>After holiday indulgences, this protein-rich crepe is perfect for starting the new year right! It combines protein powder, eggs and oat flakes for a nourishing breakfast that supports your fitness goals without sacrificing taste. Ideal for January 1st brunch!</p>

<ul>
<li><strong>Prep time:</strong> 5 min</li>
<li><strong>Cook time:</strong> 10 min</li>
<li><strong>Servings:</strong> 4</li>
</ul>

<p><a href="/en/recipe/crepe-proteinee/">See full recipe →</a></p>

<h2>5. Light Thin Crepes</h2>

<p><strong>The lighter version</strong></p>

<p>These light crepes use whole wheat flour, skim milk and coconut oil for a tasty result at only 118 calories per serving. Perfect for those who want to indulge while keeping an eye on their diet during the holidays.</p>

<ul>
<li><strong>Calories:</strong> 118 kcal/serving</li>
</ul>

<p><a href="/en/recipe/crepes-minces/">See full recipe →</a></p>

<h2>Our Tips for a Successful Crepe Brunch</h2>

<ul>
<li><strong>Prepare the batter the night before:</strong> It keeps well in the refrigerator and will be even smoother the next day.</li>
<li><strong>Keep the crepes warm:</strong> Stack them under a clean cloth or in the oven at 175°F.</li>
<li><strong>Vary the toppings:</strong> Set up a crepe bar with maple syrup, fresh fruits, Nutella, whipped cream, jams and savory fillings.</li>
<li><strong>Involve the kids:</strong> Crepes are perfect for family cooking!</li>
</ul>

<h2>Happy Holidays!</h2>

<p>We hope these crepe recipes will make your Christmas and New Year's mornings even more delicious. Don't hesitate to share your creations with us!</p>

<p><strong>Happy cooking and happy holidays!</strong></p>
`,
};

// ============================================
// LIENS INTERNES POUR LES RECETTES DE CRÊPES
// ============================================

const crepeRecipes = [
  {
    slug: 'crepe-allemande-pfannkuchen',
    internalLinks: `\n\nDécouvrez aussi nos autres recettes de crêpes : <a href="/recette/crepes-maison-recette-de-base/">crêpes de base faciles</a>, <a href="/recette/crepe-proteinee/">crêpe protéinée</a>, <a href="/recette/crepe/">crêpe maison traditionnelle</a> et <a href="/recette/crepes-minces/">crêpes minces légères</a>.`,
    internalLinks_en: `\n\nDiscover our other crepe recipes: <a href="/en/recipe/crepes-maison-recette-de-base/">easy basic crepes</a>, <a href="/en/recipe/crepe-proteinee/">protein crepe</a>, <a href="/en/recipe/crepe/">traditional homemade crepe</a> and <a href="/en/recipe/crepes-minces/">light thin crepes</a>.`,
  },
  {
    slug: 'crepes-maison-recette-de-base',
    internalLinks: `\n\nDécouvrez aussi nos autres recettes de crêpes : <a href="/recette/crepe-allemande-pfannkuchen/">crêpe allemande Pfannkuchen</a>, <a href="/recette/crepe-proteinee/">crêpe protéinée</a>, <a href="/recette/crepe/">crêpe maison traditionnelle</a> et <a href="/recette/crepes-minces/">crêpes minces légères</a>.`,
    internalLinks_en: `\n\nDiscover our other crepe recipes: <a href="/en/recipe/crepe-allemande-pfannkuchen/">German crepe Pfannkuchen</a>, <a href="/en/recipe/crepe-proteinee/">protein crepe</a>, <a href="/en/recipe/crepe/">traditional homemade crepe</a> and <a href="/en/recipe/crepes-minces/">light thin crepes</a>.`,
  },
  {
    slug: 'crepe-proteinee',
    internalLinks: `\n\nDécouvrez aussi nos autres recettes de crêpes : <a href="/recette/crepe-allemande-pfannkuchen/">crêpe allemande Pfannkuchen</a>, <a href="/recette/crepes-maison-recette-de-base/">crêpes de base faciles</a>, <a href="/recette/crepe/">crêpe maison traditionnelle</a> et <a href="/recette/crepes-minces/">crêpes minces légères</a>.`,
    internalLinks_en: `\n\nDiscover our other crepe recipes: <a href="/en/recipe/crepe-allemande-pfannkuchen/">German crepe Pfannkuchen</a>, <a href="/en/recipe/crepes-maison-recette-de-base/">easy basic crepes</a>, <a href="/en/recipe/crepe/">traditional homemade crepe</a> and <a href="/en/recipe/crepes-minces/">light thin crepes</a>.`,
  },
  {
    slug: 'crepe',
    internalLinks: `\n\nDécouvrez aussi nos autres recettes de crêpes : <a href="/recette/crepe-allemande-pfannkuchen/">crêpe allemande Pfannkuchen</a>, <a href="/recette/crepes-maison-recette-de-base/">crêpes de base faciles</a>, <a href="/recette/crepe-proteinee/">crêpe protéinée</a> et <a href="/recette/crepes-minces/">crêpes minces légères</a>.`,
    internalLinks_en: `\n\nDiscover our other crepe recipes: <a href="/en/recipe/crepe-allemande-pfannkuchen/">German crepe Pfannkuchen</a>, <a href="/en/recipe/crepes-maison-recette-de-base/">easy basic crepes</a>, <a href="/en/recipe/crepe-proteinee/">protein crepe</a> and <a href="/en/recipe/crepes-minces/">light thin crepes</a>.`,
  },
  {
    slug: 'crepes-minces',
    internalLinks: `\n\nDécouvrez aussi nos autres recettes de crêpes : <a href="/recette/crepe-allemande-pfannkuchen/">crêpe allemande Pfannkuchen</a>, <a href="/recette/crepes-maison-recette-de-base/">crêpes de base faciles</a>, <a href="/recette/crepe-proteinee/">crêpe protéinée</a> et <a href="/recette/crepe/">crêpe maison traditionnelle</a>.`,
    internalLinks_en: `\n\nDiscover our other crepe recipes: <a href="/en/recipe/crepe-allemande-pfannkuchen/">German crepe Pfannkuchen</a>, <a href="/en/recipe/crepes-maison-recette-de-base/">easy basic crepes</a>, <a href="/en/recipe/crepe-proteinee/">protein crepe</a> and <a href="/en/recipe/crepe/">traditional homemade crepe</a>.`,
  },
];

// ============================================
// FONCTIONS
// ============================================

async function createBlogPost() {
  console.log('📝 Création de l\'article de blog sur les crêpes...\n');

  // 1. Vérifier/créer la catégorie
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'recettes');

  let categoryId: number;

  if (!categories || categories.length === 0) {
    console.log('Création de la catégorie "recettes"...');
    const { data: newCat, error: catError } = await supabase
      .from('post_categories')
      .insert({
        name: 'Recettes',
        slug: 'recettes',
      })
      .select('id')
      .single();

    if (catError) {
      console.error('Erreur création catégorie:', catError);
      return null;
    }
    categoryId = newCat.id;
  } else {
    categoryId = categories[0].id;
  }

  // 2. Obtenir l'auteur
  const { data: authors } = await supabase
    .from('authors')
    .select('id')
    .limit(1);

  const authorId = authors?.[0]?.id || 1;

  // 3. Vérifier si le post existe
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', blogPost.slug)
    .single();

  let postId: number;

  if (existingPost) {
    console.log('Article existant trouvé, mise à jour...');
    const { error: updateError } = await supabase
      .from('posts')
      .update({
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        featured_image: blogPost.featured_image,
        reading_time: blogPost.reading_time,
        seo_title: blogPost.seo_title,
        seo_description: blogPost.seo_description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPost.id);

    if (updateError) {
      console.error('Erreur mise à jour:', updateError);
      return null;
    }
    postId = existingPost.id;
  } else {
    // 4. Créer le post
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert({
        slug: blogPost.slug,
        title: blogPost.title,
        excerpt: blogPost.excerpt,
        content: blogPost.content,
        featured_image: blogPost.featured_image,
        author_id: authorId,
        reading_time: blogPost.reading_time,
        seo_title: blogPost.seo_title,
        seo_description: blogPost.seo_description,
        published_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'published',
      })
      .select('id')
      .single();

    if (postError) {
      console.error('Erreur création post:', postError);
      return null;
    }
    postId = newPost.id;

    // Lier à la catégorie
    await supabase
      .from('posts_categories')
      .insert({
        post_id: postId,
        category_id: categoryId,
      });
  }

  // 5. Ajouter/mettre à jour la traduction anglaise
  const { error: transError } = await supabase
    .from('post_translations')
    .upsert({
      post_id: postId,
      locale: 'en',
      slug_en: blogPost.slug_en,
      title: blogPost.title_en,
      excerpt: blogPost.excerpt_en,
      content: blogPost.content_en,
      seo_title: blogPost.seo_title_en,
      seo_description: blogPost.seo_description_en,
    }, { onConflict: 'post_id,locale' });

  if (transError) {
    console.error('Erreur traduction:', transError);
  }

  console.log(`✅ Article créé/mis à jour (ID: ${postId})`);
  console.log(`   FR: /blog/${blogPost.slug}`);
  console.log(`   EN: /en/blog/${blogPost.slug_en}`);

  return postId;
}

async function addInternalLinksToRecipes() {
  console.log('\n🔗 Ajout des liens internes aux recettes de crêpes...\n');

  for (const recipe of crepeRecipes) {
    // 1. Trouver la recette
    const { data: recipeData, error: findError } = await supabase
      .from('recipes')
      .select('id, conclusion')
      .eq('slug', recipe.slug)
      .single();

    if (findError || !recipeData) {
      console.log(`⚠️  Recette "${recipe.slug}" non trouvée dans Supabase`);
      continue;
    }

    // 2. Vérifier si les liens existent déjà
    const currentConclusion = recipeData.conclusion || '';
    if (currentConclusion.includes('Découvrez aussi nos autres recettes')) {
      console.log(`⏭️  "${recipe.slug}" - liens déjà présents`);
      continue;
    }

    // 3. Ajouter les liens à la conclusion française
    const newConclusion = currentConclusion + recipe.internalLinks;

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ conclusion: newConclusion })
      .eq('id', recipeData.id);

    if (updateError) {
      console.error(`❌ Erreur mise à jour "${recipe.slug}":`, updateError);
      continue;
    }

    // 4. Mettre à jour la traduction anglaise
    const { data: translationData } = await supabase
      .from('recipe_translations')
      .select('conclusion')
      .eq('recipe_id', recipeData.id)
      .eq('locale', 'en')
      .single();

    if (translationData) {
      const currentConclusionEn = translationData.conclusion || '';
      if (!currentConclusionEn.includes('Discover our other crepe recipes')) {
        const newConclusionEn = currentConclusionEn + recipe.internalLinks_en;

        await supabase
          .from('recipe_translations')
          .update({ conclusion: newConclusionEn })
          .eq('recipe_id', recipeData.id)
          .eq('locale', 'en');
      }
    }

    console.log(`✅ "${recipe.slug}" - liens internes ajoutés`);
  }
}

async function main() {
  console.log('🥞 Script crêpes des fêtes\n');
  console.log('='.repeat(50));

  // 1. Créer l'article de blog
  await createBlogPost();

  // 2. Ajouter les liens internes aux recettes
  await addInternalLinksToRecipes();

  console.log('\n' + '='.repeat(50));
  console.log('✅ Terminé!');
}

main().catch(console.error);
