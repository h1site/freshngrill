/**
 * Generate a steak cooking guide article using OpenAI
 * Uploads steak.png chart, creates FR + EN versions
 *
 * Usage: npx tsx scripts/create-steak-cooking-article.ts
 */

import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function uploadSteakImage(): Promise<string> {
  console.log('Uploading steak.png to Supabase Storage...');

  const imagePath = path.join(process.cwd(), 'steak.png');
  const buffer = fs.readFileSync(imagePath);
  console.log(`  Image size: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

  const filename = 'posts/guide-cuisson-steak.png';

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(filename, buffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Upload error: ${uploadError.message}`);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(filename);

  console.log(`  Uploaded: ${publicUrl}`);
  return publicUrl;
}

async function generateArticle(steakImageUrl: string): Promise<{ fr: string; en: string; excerptFr: string; excerptEn: string }> {
  console.log('\nGenerating FR article with OpenAI...');

  const steakImageHtml = `<img src="${steakImageUrl}" alt="Tableau de cuisson du steak - températures et degrés de cuisson" style="width:100%;max-width:800px;border-radius:12px;margin:1.5rem auto;display:block" />`;
  const steakImageHtmlEn = `<img src="${steakImageUrl}" alt="Steak cooking chart - temperatures and doneness levels" style="width:100%;max-width:800px;border-radius:12px;margin:1.5rem auto;display:block" />`;

  const promptFR = `Tu es un rédacteur web pour Menucochon.com, un site de recettes québécoises. Écris un article de blog complet en français québécois (style décontracté mais informatif) sur LA CUISSON DU STEAK.

TITRE: Guide Ultime de la Cuisson du Steak : Températures, Techniques et Secrets

L'article DOIT inclure ces sections avec du contenu riche :

1. **Introduction** - Pourquoi maîtriser la cuisson du steak est essentiel. Accrocheur et motivant.

2. **Tableau des températures de cuisson** - Un beau tableau HTML avec :
   - Bleu (Blue Rare) : 45-49°C / 115-120°F
   - Saignant (Rare) : 50-54°C / 125-130°F
   - Mi-saignant (Medium Rare) : 55-59°C / 130-139°F - LE CHOIX DU CHEF
   - À point (Medium) : 60-65°C / 140-149°F
   - Mi-bien cuit (Medium Well) : 66-70°C / 150-159°F
   - Bien cuit (Well Done) : 71°C+ / 160°F+
   Le tableau doit avoir les colonnes : Cuisson, Température °C, Température °F, Description du centre, Recommandation
   Style le tableau avec des couleurs (du rouge au gris-brun) pour chaque niveau.

3. **L'image du tableau de cuisson** - INSÈRE EXACTEMENT ce HTML là où c'est pertinent (juste après le tableau des températures) :
${steakImageHtml}
Ajoute une légende sous l'image : <p style="text-align:center;font-style:italic;color:#666;margin-top:-0.5rem">Tableau visuel des degrés de cuisson du steak</p>

4. **Le test du toucher (test de la main)** - Explique en détail comment tester la cuisson avec la paume de sa main :
   - Pouce + index = Saignant (mou comme la base du pouce)
   - Pouce + majeur = Mi-saignant
   - Pouce + annulaire = À point
   - Pouce + auriculaire = Bien cuit
   Explique bien le geste et la sensation.

5. **Techniques de cuisson par méthode** :
   a) **BBQ au charbon** - chaleur directe vs indirecte, temps par épaisseur, quand fermer le couvercle
   b) **BBQ au gaz** - préchauffage, zones de chaleur, technique de saisie
   c) **Poêle en fonte** - la meilleure pour le sear, technique avec beurre et thym
   d) **Four** - méthode reverse sear (cuire au four d'abord puis saisir), températures
   e) **Sous-vide** - pour les perfectionnistes, temps et températures

6. **Comment bien préparer son steak** :
   - Sortir le steak 30-45 min avant (température ambiante)
   - Sécher la surface avec du papier essuie-tout
   - Sel : quand et comment saler (au moins 40 min avant OU juste avant)
   - Poivre : toujours après la cuisson (sinon ça brûle)
   - Huile à haut point de fumée (canola, avocat, arachide)

7. **Les coupes de steak populaires** - Bref aperçu :
   - Filet mignon (tendre, peu de gras)
   - Ribeye / Côte de boeuf (persillé, savoureux)
   - T-Bone / Porterhouse (2 en 1)
   - Strip / New York (classique)
   - Bavette / Flank (économique, marinade)

8. **Le repos du steak** - CRUCIAL. 5-10 min sous papier alu. Expliquer pourquoi les jus redistribuent.

9. **Conclusion** avec un appel à l'action vers les recettes de boeuf du site.

CONSIGNES DE FORMAT :
- HTML uniquement (h2, h3, p, ul, li, strong, em, table, thead, tbody, tr, th, td)
- Le tableau de températures DOIT être stylé inline (background-color pour chaque rangée selon la cuisson)
- Style québécois naturel et fun (ex: "c'est pas sorcier", "on va se le dire", etc.)
- 2000-2500 mots minimum
- Retourne UNIQUEMENT le HTML (pas de markdown, pas de code block, pas de \`\`\`)`;

  const responseFR = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptFR }],
    temperature: 0.7,
    max_tokens: 8000,
  });

  let frContent = responseFR.choices[0].message.content?.trim() || '';
  // Clean any markdown wrapping
  frContent = frContent.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  console.log('FR article generated:', frContent.length, 'chars');

  console.log('\nGenerating EN article with OpenAI...');

  const promptEN = `You are a web writer for Menucochon.com, a Quebec recipe website. Write the ENGLISH version of this steak cooking guide article. NOT a literal translation — adapt it naturally for English readers while keeping all the same information and structure.

TITLE: Ultimate Steak Cooking Guide: Temperatures, Techniques & Secrets

IMPORTANT:
- Keep the same sections and all factual content
- Use HTML tags (h2, h3, p, ul, li, strong, em, table, thead, tbody, tr, th, td)
- The temperature table must have the same inline styling with colors
- For the steak image, INSERT EXACTLY this HTML in the same position (after the temperature table):
${steakImageHtmlEn}
With caption: <p style="text-align:center;font-style:italic;color:#666;margin-top:-0.5rem">Visual guide to steak doneness levels</p>
- Keep it fun and engaging but in natural English
- Use °F as the primary unit (with °C in parentheses)
- 2000-2500 words minimum
- Return ONLY HTML (no markdown, no code block, no backticks)

FRENCH ARTICLE TO ADAPT:
${frContent}`;

  const responseEN = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: promptEN }],
    temperature: 0.7,
    max_tokens: 8000,
  });

  let enContent = responseEN.choices[0].message.content?.trim() || '';
  enContent = enContent.replace(/^```html?\n?/i, '').replace(/\n?```$/i, '');
  console.log('EN article generated:', enContent.length, 'chars');

  const excerptFr = 'Guide complet pour maîtriser la cuisson du steak : tableau des températures, test du toucher avec la main, techniques BBQ, poêle en fonte, four et sous-vide. Tous les secrets pour un steak parfait!';
  const excerptEn = 'Complete guide to mastering steak cooking: temperature chart, hand touch test, BBQ techniques, cast iron, oven and sous-vide methods. All the secrets for a perfect steak!';

  return { fr: frContent, en: enContent, excerptFr: excerptFr, excerptEn: excerptEn };
}

async function insertArticle(article: { fr: string; en: string; excerptFr: string; excerptEn: string }, steakImageUrl: string) {
  const slug = 'guide-cuisson-steak';
  const slugEn = 'steak-cooking-guide';

  // 1. Get category
  const { data: categories } = await supabase
    .from('post_categories')
    .select('id')
    .eq('slug', 'recettes');

  let categoryId: number;
  if (!categories || categories.length === 0) {
    const { data: actualites } = await supabase
      .from('post_categories')
      .select('id')
      .eq('slug', 'actualites');
    categoryId = actualites?.[0]?.id || 1;
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

  const titleFr = 'Guide Ultime de la Cuisson du Steak : Températures, Techniques et Secrets';
  const titleEn = 'Ultimate Steak Cooking Guide: Temperatures, Techniques & Secrets';

  if (existingPost) {
    console.log('\nPost exists, updating...');
    await supabase
      .from('posts')
      .update({
        title: titleFr,
        excerpt: article.excerptFr,
        content: article.fr,
        featured_image: steakImageUrl,
        reading_time: 10,
        seo_title: 'Guide Cuisson Steak : Températures, BBQ, Poêle, Four | Menucochon',
        seo_description: article.excerptFr,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existingPost.id);

    await supabase
      .from('post_translations')
      .upsert({
        post_id: existingPost.id,
        locale: 'en',
        title: titleEn,
        excerpt: article.excerptEn,
        content: article.en,
        seo_title: 'Steak Cooking Guide: Temperatures, BBQ, Pan, Oven | Menucochon',
        seo_description: article.excerptEn,
      }, { onConflict: 'post_id,locale' });

    console.log('Post updated!');
  } else {
    // 4. Create post
    const { data: newPost, error: postError } = await supabase
      .from('posts')
      .insert({
        slug,
        title: titleFr,
        excerpt: article.excerptFr,
        content: article.fr,
        featured_image: steakImageUrl,
        author_id: authorId,
        reading_time: 10,
        seo_title: 'Guide Cuisson Steak : Températures, BBQ, Poêle, Four | Menucochon',
        seo_description: article.excerptFr,
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
    console.log('\nPost created with ID:', newPost.id);

    // 5. Link category
    await supabase.from('posts_categories').insert({ post_id: newPost.id, category_id: categoryId });

    // 6. English translation
    const { error: transError } = await supabase.from('post_translations').insert({
      post_id: newPost.id,
      locale: 'en',
      title: titleEn,
      excerpt: article.excerptEn,
      content: article.en,
      seo_title: 'Steak Cooking Guide: Temperatures, BBQ, Pan, Oven | Menucochon',
      seo_description: article.excerptEn,
    });

    if (transError) console.error('Error creating translation:', transError);
  }

  console.log('\n✅ Article created!');
  console.log(`FR: /blog/${slug}`);
  console.log(`EN: /en/blog/${slugEn}`);
}

async function main() {
  const steakImageUrl = await uploadSteakImage();
  const article = await generateArticle(steakImageUrl);
  await insertArticle(article, steakImageUrl);
}

main().catch(console.error);
