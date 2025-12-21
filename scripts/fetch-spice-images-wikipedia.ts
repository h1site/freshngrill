/**
 * Script pour récupérer des images d'épices depuis Wikipedia
 * Gratuit et images libres de droits (Creative Commons)
 *
 * Usage: npx tsx scripts/fetch-spice-images-wikipedia.ts
 *
 * Options:
 *   --limit=10     Limiter le nombre d'images
 *   --dry-run      Afficher les épices sans télécharger
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface Spice {
  slug: string;
  name_fr: string;
  name_en: string | null;
  featured_image: string | null;
}

// Parse command line arguments
const args = process.argv.slice(2);
const limitArg = args.find(a => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1]) : undefined;
const dryRun = args.includes('--dry-run');

// Map French spice names to Wikipedia search terms for better results
const SPICE_SEARCH_OVERRIDES: Record<string, string> = {
  'Achiote (roucou)': 'Annatto',
  'Achiote moulu': 'Annatto',
  'Ail': 'Garlic',
  'Ail des ours séché': 'Allium ursinum',
  'Ail en poudre': 'Garlic powder',
  'Ail noir': 'Black garlic',
  'Anis étoilé': 'Star anise',
  'Anis vert': 'Anise',
  'Asafoetida': 'Asafoetida',
  'Badiane moulue': 'Star anise',
  'Baie de genièvre': 'Juniper berry',
  'Baie rose': 'Pink peppercorn',
  'Basilic séché': 'Basil',
  'Cannelle': 'Cinnamon',
  'Cannelle de Ceylan': 'Ceylon cinnamon',
  'Cardamome verte': 'Cardamom',
  'Cardamome noire': 'Black cardamom',
  'Carvi': 'Caraway',
  'Céleri (graines)': 'Celery seed',
  'Ciboulette séchée': 'Chives',
  'Citronnelle': 'Lemongrass',
  'Clou de girofle': 'Clove',
  'Coriandre (graines)': 'Coriander seed',
  'Cumin': 'Cumin',
  'Cumin noir': 'Nigella sativa',
  'Curcuma': 'Turmeric',
  'Estragon séché': 'Tarragon',
  'Fenouil (graines)': 'Fennel seed',
  'Fenugrec': 'Fenugreek',
  'Galanga': 'Galangal',
  'Garam masala': 'Garam masala',
  'Gingembre': 'Ginger',
  'Graines de moutarde': 'Mustard seed',
  'Graines de pavot': 'Poppy seed',
  'Graines de sésame': 'Sesame',
  'Herbes de Provence': 'Herbes de Provence',
  'Laurier': 'Bay leaf',
  'Lavande culinaire': 'Lavender',
  'Macis': 'Mace spice',
  'Marjolaine': 'Marjoram',
  'Menthe séchée': 'Mentha',
  'Muscade': 'Nutmeg',
  'Origan': 'Oregano',
  'Paprika': 'Paprika',
  'Paprika fumé': 'Smoked paprika',
  'Persil séché': 'Parsley',
  'Piment de Cayenne': 'Cayenne pepper',
  'Piment d\'Espelette': 'Espelette pepper',
  'Poivre blanc': 'White pepper',
  'Poivre de Sichuan': 'Sichuan pepper',
  'Poivre long': 'Long pepper',
  'Poivre noir': 'Black pepper',
  'Poivre vert': 'Green peppercorn',
  'Ras el hanout': 'Ras el hanout',
  'Romarin': 'Rosemary',
  'Safran': 'Saffron',
  'Sarriette': 'Savory spice',
  'Sauge séchée': 'Salvia officinalis',
  'Sumac': 'Sumac',
  'Tamarin': 'Tamarind',
  'Thym': 'Thyme',
  'Vanille': 'Vanilla',
  'Za\'atar': 'Za\'atar',
};

async function searchWikipedia(query: string): Promise<string | null> {
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=1`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.query?.search?.length > 0) {
      return data.query.search[0].title;
    }
    return null;
  } catch (error) {
    console.error(`  ❌ Search error for "${query}":`, error);
    return null;
  }
}

async function getWikipediaImage(pageTitle: string): Promise<string | null> {
  // Get the main image from the Wikipedia page
  const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&pithumbsize=800`;

  try {
    const response = await fetch(imageUrl);
    const data = await response.json();

    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const page = pages[pageId];
      if (page.thumbnail?.source) {
        // Get higher resolution by modifying the URL
        let imageSource = page.thumbnail.source;
        // Try to get a larger version
        imageSource = imageSource.replace(/\/\d+px-/, '/800px-');
        return imageSource;
      }
    }
    return null;
  } catch (error) {
    console.error(`  ❌ Image fetch error for "${pageTitle}":`, error);
    return null;
  }
}

async function downloadImage(url: string): Promise<Buffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error(`  ❌ Download error:`, error);
    return null;
  }
}

async function uploadToSupabase(spice: Spice, imageBuffer: Buffer, contentType: string): Promise<string | null> {
  // Determine file extension from content type
  const ext = contentType.includes('png') ? 'png' : contentType.includes('gif') ? 'gif' : 'jpg';
  const fileName = `spices/${spice.slug}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(fileName, imageBuffer, {
      contentType: contentType,
      upsert: true,
    });

  if (uploadError) {
    console.error(`  ❌ Upload error for ${spice.slug}:`, uploadError.message);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(fileName);

  return publicUrl;
}

async function updateSpiceImage(spice: Spice, imageUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('spices')
    .update({
      featured_image: imageUrl,
      image_alt_fr: `${spice.name_fr} - image Wikipedia`,
      image_alt_en: `${spice.name_en || spice.name_fr} - Wikipedia image`,
    })
    .eq('slug', spice.slug);

  if (error) {
    console.error(`  ❌ DB update error for ${spice.slug}:`, error.message);
    return false;
  }
  return true;
}

async function processSpice(spice: Spice): Promise<boolean> {
  // Determine search term
  const searchTerm = SPICE_SEARCH_OVERRIDES[spice.name_fr] || spice.name_en || spice.name_fr;

  // Search Wikipedia
  const pageTitle = await searchWikipedia(searchTerm + ' spice');
  if (!pageTitle) {
    // Try without "spice" suffix
    const pageTitle2 = await searchWikipedia(searchTerm);
    if (!pageTitle2) {
      console.log(`  ⚠️  No Wikipedia page found for "${searchTerm}"`);
      return false;
    }
  }

  const finalTitle = pageTitle || await searchWikipedia(searchTerm);
  if (!finalTitle) return false;

  // Get image URL
  const imageUrl = await getWikipediaImage(finalTitle);
  if (!imageUrl) {
    console.log(`  ⚠️  No image found on Wikipedia page "${finalTitle}"`);
    return false;
  }

  if (dryRun) {
    console.log(`  ✅ Found: ${finalTitle} → ${imageUrl.substring(0, 60)}...`);
    return true;
  }

  // Download image
  const imageBuffer = await downloadImage(imageUrl);
  if (!imageBuffer) {
    return false;
  }

  // Determine content type from URL
  const contentType = imageUrl.includes('.png') ? 'image/png' :
                      imageUrl.includes('.gif') ? 'image/gif' : 'image/jpeg';

  // Upload to Supabase
  const publicUrl = await uploadToSupabase(spice, imageBuffer, contentType);
  if (!publicUrl) {
    return false;
  }

  // Update database
  const updated = await updateSpiceImage(spice, publicUrl);
  if (updated) {
    console.log(`  ✅ ${spice.name_fr} → ${finalTitle}`);
  }
  return updated;
}

async function main() {
  console.log('🖼️  Récupération d\'images d\'épices depuis Wikipedia\n');

  if (dryRun) {
    console.log('🔍 Mode dry-run - aucune image ne sera téléchargée\n');
  }

  // Fetch spices without images
  let query = supabase
    .from('spices')
    .select('slug, name_fr, name_en, featured_image')
    .eq('is_published', true)
    .is('featured_image', null)
    .order('name_fr');

  if (limit) {
    query = query.limit(limit);
  }

  const { data: spices, error } = await query;

  if (error) {
    console.error('❌ Supabase error:', error.message);
    process.exit(1);
  }

  if (!spices || spices.length === 0) {
    console.log('✅ Toutes les épices ont déjà des images!');
    return;
  }

  console.log(`📋 ${spices.length} épices sans image${limit ? ` (limite: ${limit})` : ''}\n`);

  let success = 0;
  let failed = 0;
  const startTime = Date.now();

  for (let i = 0; i < spices.length; i++) {
    const spice = spices[i];
    console.log(`[${i + 1}/${spices.length}] ${spice.name_fr}...`);

    const result = await processSpice(spice);
    if (result) {
      success++;
    } else {
      failed++;
    }

    // Small delay to be nice to Wikipedia API
    if (i < spices.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  const duration = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log(`\n🏁 Terminé en ${duration} minutes!`);
  console.log(`  ✅ Succès: ${success}`);
  console.log(`  ❌ Non trouvées: ${failed}`);
  console.log(`  💰 Coût: GRATUIT (Wikipedia)`);
}

main().catch(console.error);
