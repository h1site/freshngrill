/**
 * Generate Milano Cortina 2026 Olympic athlete meals article using OpenAI
 * Creates FR + EN versions, text only (no images), with nofollow source links
 *
 * Usage: npx tsx scripts/create-milano-cortina-article.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Sources fiables avec URLs
const SOURCES = [
  { name: 'Detroit News', url: 'https://www.detroitnews.com/story/sports/olympics/2026/02/03/milano-cortina-olympic-village-food/88491397007/' },
  { name: 'TODAY.com', url: 'https://www.today.com/food/trends/milan-olympic-village-food-reviews-rcna257442' },
  { name: 'Cookist', url: 'https://www.cookist.com/milan-cortina-2026-winter-olympics-will-have-24-hour-canteens-and-personalized-menus-for-athletes/' },
  { name: 'Olympics.com', url: 'https://www.olympics.com/en/milano-cortina-2026/news/life-inside-the-milano-olympic-village-42-delegations-and-over-1500-residents/' },
  { name: 'E! Online', url: 'https://www.eonline.com/news/1428265/winter-olympics-2026-italian-food-athletes-eat-in-dining-hall' },
  { name: 'La Presse', url: 'https://www.lapresse.ca/gourmand/2026-02-05/milan-cortina-2026/le-gateau-au-chocolat-fondant-du-village-olympique-fait-saliver-les-athletes.php' },
];

// Key facts gathered from research to feed the AI
const RESEARCH_FACTS = `
FACTS ABOUT FOOD AT MILANO CORTINA 2026 WINTER OLYMPICS:

MEAL CAPACITY:
- Milan Village: up to 4,500 meals per day (breakfast, lunch, dinner)
- Cortina Village: nearly 4,000 meals daily
- Predazzo Village: 2,300 meals daily
- Total: ~10,800 meals per day across all villages
- 24-hour canteens available
- Menus tailored to 93 diverse cultures

LEARNING FROM PARIS 2024:
- Paris had complaints about food quantity and quality
- Paris issues: egg rationing, limited protein options
- Milano Cortina designed menus over one year to avoid these problems
- Focus on "customization" as key word
- Protein-rich menus for endurance athletes
- Lighter dishes for explosive/sprint athletes
- Accommodations for allergies, intolerances, vegan preferences

HEAD OF FOOD: Elisabetta Salvadori (head of food and beverages)
- She explained: "Pasta is just cooked behind the athletes"
- Emphasis on fresh preparation

POPULAR DISHES:
- Pasta (plain, ragu, tomato sauce) - most popular
- Focaccia - extremely popular among athletes
- Lasagna and gnocchi
- Pizza (quattro formaggi, with fresh herbs and cured meats)
- Fresh mozzarella, burrata, Brie cheese
- Beef, veal, and other proteins
- Tortino al cioccolato (molten chocolate cake) - THE viral dessert, available at breakfast
- Alpine and local cuisine: flavors from Valtellina and the Dolomites

ATHLETE QUOTES:
- Dutch speed skater Jenning de Boo: "It's no Michelin-star restaurant, but I find it quite adequate"
- American figure skater Ilia Malinin: "I like it. It's comfortable for me"
- U.S. snowboarder Jess Perlmutter: "I've had the best pasta I've ever had here"
- South African cross-country skier Matt C. Smith rated pizza 8.5/10
- Canadian hockey player Natalie Spooner rated torta della nonna 7/10
- Canadian speedskater Courtney Saurault described the chocolate dessert as potentially "better than the viral chocolate muffin" from Paris

VIRAL MOMENT:
- Reference to Henrik Christiansen (Norwegian swimmer) who was the "Muffin Man" at Paris 2024
- He joked he "took up winter sports because he ran out of muffins"
- When shown the Milano lava cake he said: "Idk man, seems sketchy"

NUTRITIONAL APPROACH:
- "No athlete should feel excluded, whether at the table or during competition"
- Athletes "will be able to eat as if they were at home"
- Focus: health, sustainability, respect for diversity
- IOC standards + Italian tradition of good eating
- 6 food stations in the main dining hall
`;

async function generateArticle(): Promise<{ fr: string; en: string; excerptFr: string; excerptEn: string }> {
  console.log('Generating article with OpenAI...');

  const sourcesHtml = SOURCES.map(s =>
    `<li><a href="${s.url}" rel="nofollow noopener" target="_blank">${s.name}</a></li>`
  ).join('\n');

  const promptFR = `Tu es un rédacteur web pour Menucochon.com, un site de recettes québécoises. Écris un article de blog en français québécois au style décontracté mais informatif.

TITRE: Milano Cortina 2026 : Quels sont les repas des athlètes ?

CONSIGNES:
- Article de 1200-1500 mots
- Pas d'images, texte uniquement
- Utilise des balises HTML (h2, h3, p, ul, li, strong, em, blockquote)
- Inclus des citations d'athlètes (en blockquote)
- Structure: Introduction, les cantines 24h, les plats populaires, le dessert viral (tortino al cioccolato), les leçons de Paris 2024, la personnalisation nutritionnelle, les réactions des athlètes, conclusion
- Style québécois naturel (mais pas exagéré)
- Mentionne des liens avec la cuisine québécoise quand c'est pertinent (ex: poutine vs pizza, etc.)
- À la fin, ajoute une section "Sources" avec cette liste:
<h3>Sources</h3>
<ul>
${sourcesHtml}
</ul>

FAITS À UTILISER:
${RESEARCH_FACTS}

Retourne UNIQUEMENT le HTML de l'article (pas de markdown, pas de code block).`;

  const responseFR = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptFR }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const frContent = responseFR.choices[0].message.content?.trim() || '';
  console.log('FR article generated:', frContent.length, 'chars');

  const promptEN = `You are a web writer for Menucochon.com, a Quebec recipe website. Write a blog article in English based on the French article below. Keep the same structure and all facts, but make it natural English (not a literal translation).

TITLE: Milano Cortina 2026: What Do Olympic Athletes Eat?

INSTRUCTIONS:
- Keep the same structure and content as the French version
- Use HTML tags (h2, h3, p, ul, li, strong, em, blockquote)
- Keep all athlete quotes in English
- At the end, add a "Sources" section with this list:
<h3>Sources</h3>
<ul>
${sourcesHtml}
</ul>

FRENCH ARTICLE TO TRANSLATE/ADAPT:
${frContent}

Return ONLY the HTML of the article (no markdown, no code block).`;

  const responseEN = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptEN }],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const enContent = responseEN.choices[0].message.content?.trim() || '';
  console.log('EN article generated:', enContent.length, 'chars');

  // Generate excerpts
  const excerptFR = 'Découvrez ce que mangent les athlètes aux Jeux olympiques d\'hiver de Milano Cortina 2026 : cantines 24h, pasta fraîche, le dessert viral tortino al cioccolato et les leçons tirées de Paris 2024.';
  const excerptEN = 'Discover what athletes eat at the Milano Cortina 2026 Winter Olympics: 24-hour canteens, fresh pasta, the viral tortino al cioccolato dessert, and lessons learned from Paris 2024.';

  return { fr: frContent, en: enContent, excerptFr: excerptFR, excerptEn: excerptEN };
}

async function insertArticle(article: { fr: string; en: string; excerptFr: string; excerptEn: string }) {
  const slug = 'repas-athletes-jeux-olympiques-milano-cortina-2026';

  // 1. Get or create category
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'actualites');

  let categoryId: number;

  if (!categories || categories.length === 0) {
    console.log('Creating "actualites" category...');
    const { data: newCat, error: catError } = await supabase
      .from('post_categories')
      .insert({ name: 'Actualités', slug: 'actualites' })
      .select('id')
      .single();

    if (catError) { console.error('Error creating category:', catError); return; }
    categoryId = newCat.id;
  } else {
    categoryId = categories[0].id;
  }

  // 2. Get author
  const { data: authors } = await supabase.from('authors').select('id').limit(1);
  const authorId = authors?.[0]?.id || 1;

  // 3. Check if post exists
  const { data: existingPost } = await supabase
    .from('posts')
    .select('id')
    .eq('slug', slug)
    .single();

  if (existingPost) {
    console.log('Post exists, updating...');
    await supabase
      .from('posts')
      .update({
        title: 'Milano Cortina 2026 : Quels sont les repas des athlètes ?',
        excerpt: article.excerptFr,
        content: article.fr,
        reading_time: 7,
        seo_title: 'Milano Cortina 2026 : Quels sont les repas des athlètes olympiques ?',
        seo_description: article.excerptFr,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPost.id);

    await supabase
      .from('post_translations')
      .upsert({
        post_id: existingPost.id,
        locale: 'en',
        title: 'Milano Cortina 2026: What Do Olympic Athletes Eat?',
        excerpt: article.excerptEn,
        content: article.en,
        seo_title: 'Milano Cortina 2026: What Do Olympic Athletes Eat?',
        seo_description: article.excerptEn,
      }, { onConflict: 'post_id,locale' });

    console.log('Post updated!');
    return;
  }

  // 4. Create post
  const { data: newPost, error: postError } = await supabase
    .from('posts')
    .insert({
      slug,
      title: 'Milano Cortina 2026 : Quels sont les repas des athlètes ?',
      excerpt: article.excerptFr,
      content: article.fr,
      author_id: authorId,
      reading_time: 7,
      seo_title: 'Milano Cortina 2026 : Quels sont les repas des athlètes olympiques ?',
      seo_description: article.excerptFr,
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'published',
    })
    .select('id')
    .single();

  if (postError) { console.error('Error creating post:', postError); return; }
  console.log('Post created with ID:', newPost.id);

  // 5. Link category
  await supabase.from('posts_categories').insert({ post_id: newPost.id, category_id: categoryId });

  // 6. English translation
  const { error: transError } = await supabase.from('post_translations').insert({
    post_id: newPost.id,
    locale: 'en',
    title: 'Milano Cortina 2026: What Do Olympic Athletes Eat?',
    excerpt: article.excerptEn,
    content: article.en,
    seo_title: 'Milano Cortina 2026: What Do Olympic Athletes Eat?',
    seo_description: article.excerptEn,
  });

  if (transError) console.error('Error creating translation:', transError);

  console.log('\n✅ Article created!');
  console.log(`FR: /blog/${slug}`);
  console.log(`EN: /en/blog/olympic-athletes-meals-milano-cortina-2026`);
}

async function main() {
  const article = await generateArticle();
  await insertArticle(article);
}

main().catch(console.error);
