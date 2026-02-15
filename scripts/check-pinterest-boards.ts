import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { PINTEREST_BOARDS } from '../src/lib/pinterestBoards';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function main() {
  // Get all recipes with categories and pinterest images
  const { data: recipes } = await supabase
    .from('recipes_with_categories')
    .select('slug, title, pinterest_image, pinterest_image_en, categories')
    .order('published_at', { ascending: false });

  if (!recipes) { console.log('No recipes'); return; }

  const baseUrl = 'https://menucochon.com';

  console.log('=== PINTEREST BOARDS - RSS FEEDS ===\n');
  console.log('15 boards x 2 langues = 30 RSS feeds\n');
  console.log('─'.repeat(100));

  for (const board of PINTEREST_BOARDS) {
    const matching = recipes.filter((r: any) => {
      const hasPinImg = r.pinterest_image || r.pinterest_image_en;
      if (!hasPinImg) return false;
      const cats = (r.categories || []) as any[];
      return cats.some((c: any) => board.categorySlugs.includes(c.slug));
    });

    console.log(`\n📌 ${board.boardNameFr}`);
    console.log(`   EN: ${board.boardNameEn}`);
    console.log(`   Recettes avec image Pinterest: ${matching.length}`);
    console.log(`   FR: ${baseUrl}/rss/pinterest/${board.slug}`);
    console.log(`   EN: ${baseUrl}/en/rss/pinterest/${board.slug}`);
  }

  // Also show the main feeds
  console.log('\n' + '─'.repeat(100));
  console.log('\n📌 FEEDS PRINCIPAUX (toutes catégories)');
  const allWithPin = recipes.filter((r: any) => r.pinterest_image);
  const allWithPinEn = recipes.filter((r: any) => r.pinterest_image_en || r.pinterest_image);
  console.log(`   Recettes FR avec image: ${allWithPin.length}`);
  console.log(`   Recettes EN avec image: ${allWithPinEn.length}`);
  console.log(`   FR: ${baseUrl}/rss/pinterest`);
  console.log(`   EN: ${baseUrl}/en/rss/pinterest`);
}

main().catch(console.error);
