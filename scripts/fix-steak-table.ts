/**
 * Fix steak temperature table styling - make it readable
 * Usage: npx tsx scripts/fix-steak-table.ts
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NEW_TABLE_FR = `<table style="width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.95rem">
<thead>
<tr style="background:#1a1a1a;color:#fff">
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Cuisson</th>
<th style="padding:12px 16px;text-align:center;border:1px solid #333">°C</th>
<th style="padding:12px 16px;text-align:center;border:1px solid #333">°F</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Centre</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Note</th>
</tr>
</thead>
<tbody>
<tr style="background:#fef2f2;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🔴 Bleu</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">45-49°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">115-120°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Rouge vif, froid</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Pour les puristes</td>
</tr>
<tr style="background:#fff7ed;color:#1a1a1a;border-left:4px solid #ea580c">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:700">🔴 Saignant ⭐</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center;font-weight:700">50-54°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center;font-weight:700">125-130°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Rouge, tiède</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600;color:#ea580c">Le choix du chef!</td>
</tr>
<tr style="background:#fef2f2;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟠 Mi-saignant</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">55-59°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">130-139°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Rose chaud</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Très juteux</td>
</tr>
<tr style="background:#fefce8;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟡 À point</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">60-65°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">140-149°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Rose pâle</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Équilibré</td>
</tr>
<tr style="background:#f5f5f4;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟤 Mi-bien cuit</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">66-70°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">150-159°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Légèrement rosé</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Peu de jus</td>
</tr>
<tr style="background:#e7e5e4;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #d6d3d1;font-weight:600">⚫ Bien cuit</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1;text-align:center">71°C+</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1;text-align:center">160°F+</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1">Brun uniforme</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1">Ferme et sec</td>
</tr>
</tbody>
</table>`;

const NEW_TABLE_EN = `<table style="width:100%;border-collapse:collapse;margin:1.5rem 0;font-size:0.95rem">
<thead>
<tr style="background:#1a1a1a;color:#fff">
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Doneness</th>
<th style="padding:12px 16px;text-align:center;border:1px solid #333">°F</th>
<th style="padding:12px 16px;text-align:center;border:1px solid #333">°C</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Center</th>
<th style="padding:12px 16px;text-align:left;border:1px solid #333">Note</th>
</tr>
</thead>
<tbody>
<tr style="background:#fef2f2;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🔴 Blue Rare</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">115-120°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">45-49°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Bright red, cool</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">For purists</td>
</tr>
<tr style="background:#fff7ed;color:#1a1a1a;border-left:4px solid #ea580c">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:700">🔴 Rare ⭐</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center;font-weight:700">125-130°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center;font-weight:700">50-54°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Red, warm</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600;color:#ea580c">Chef's choice!</td>
</tr>
<tr style="background:#fef2f2;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟠 Medium Rare</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">130-139°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">55-59°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Warm pink</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Very juicy</td>
</tr>
<tr style="background:#fefce8;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟡 Medium</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">140-149°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">60-65°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Light pink</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Balanced</td>
</tr>
<tr style="background:#f5f5f4;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #e5e5e5;font-weight:600">🟤 Medium Well</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">150-159°F</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5;text-align:center">66-70°C</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Slightly pink</td>
<td style="padding:10px 16px;border:1px solid #e5e5e5">Less juicy</td>
</tr>
<tr style="background:#e7e5e4;color:#1a1a1a">
<td style="padding:10px 16px;border:1px solid #d6d3d1;font-weight:600">⚫ Well Done</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1;text-align:center">160°F+</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1;text-align:center">71°C+</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1">Brown throughout</td>
<td style="padding:10px 16px;border:1px solid #d6d3d1">Firm and dry</td>
</tr>
</tbody>
</table>`;

async function main() {
  // Get post
  const { data: post } = await supabase
    .from('posts')
    .select('id, content')
    .eq('slug', 'guide-cuisson-steak')
    .single();

  if (!post) { console.error('Post not found!'); return; }

  // Replace FR table
  const oldTableFr = post.content.match(/<table[\s\S]*?<\/table>/);
  if (oldTableFr) {
    const updatedFr = post.content.replace(oldTableFr[0], NEW_TABLE_FR);
    await supabase.from('posts').update({ content: updatedFr }).eq('id', post.id);
    console.log('✅ FR table updated');
  } else {
    console.log('❌ No FR table found');
  }

  // Replace EN table
  const { data: trans } = await supabase
    .from('post_translations')
    .select('id, content')
    .eq('post_id', post.id)
    .eq('locale', 'en')
    .single();

  if (trans) {
    const oldTableEn = trans.content.match(/<table[\s\S]*?<\/table>/);
    if (oldTableEn) {
      const updatedEn = trans.content.replace(oldTableEn[0], NEW_TABLE_EN);
      await supabase.from('post_translations').update({ content: updatedEn }).eq('id', trans.id);
      console.log('✅ EN table updated');
    } else {
      console.log('❌ No EN table found');
    }
  }

  console.log('\nDone! Tables now have light backgrounds with dark text.');
}

main().catch(console.error);
