/**
 * Fix HTML entities in recipe content
 * Scans and fixes: &#8211; &#8217; &#8220; &#8221; &amp; &rsquo; &ndash; etc.
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const DRY_RUN = process.argv.includes('--dry-run');

// HTML entities to fix
const htmlEntities: Record<string, string> = {
  '&#8211;': '–',  // en-dash
  '&#8212;': '—',  // em-dash
  '&#8217;': "'",  // right single quote
  '&#8216;': "'",  // left single quote
  '&#8220;': '"',  // left double quote
  '&#8221;': '"',  // right double quote
  '&#8230;': '…',  // ellipsis
  '&#038;': '&',   // ampersand
  '&#8242;': "'",  // prime
  '&#8243;': '"',  // double prime
  '&#160;': ' ',   // non-breaking space
  '&amp;': '&',
  '&rsquo;': "'",
  '&lsquo;': "'",
  '&rdquo;': '"',
  '&ldquo;': '"',
  '&ndash;': '–',
  '&mdash;': '—',
  '&hellip;': '…',
  '&nbsp;': ' ',
  '&eacute;': 'é',
  '&egrave;': 'è',
  '&agrave;': 'à',
  '&ccedil;': 'ç',
  '&ocirc;': 'ô',
  '&ucirc;': 'û',
  '&icirc;': 'î',
  '&acirc;': 'â',
  '&euml;': 'ë',
  '&iuml;': 'ï',
  '&ouml;': 'ö',
  '&uuml;': 'ü',
};

function fixHtmlEntities(text: string | null): string | null {
  if (!text) return text;

  let fixed = text;
  for (const [entity, replacement] of Object.entries(htmlEntities)) {
    fixed = fixed.replace(new RegExp(entity, 'gi'), replacement);
  }
  return fixed;
}

function hasHtmlEntities(text: string | null): boolean {
  if (!text || typeof text !== 'string') return false;
  return Object.keys(htmlEntities).some(entity =>
    text.toLowerCase().includes(entity.toLowerCase())
  );
}

// Handle JSON fields (like faq which is an array of objects)
function fixJsonField(value: unknown): unknown {
  if (!value) return value;
  if (typeof value === 'string') return fixHtmlEntities(value);
  if (Array.isArray(value)) {
    return value.map(item => fixJsonField(item));
  }
  if (typeof value === 'object') {
    const fixed: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
      fixed[key] = fixJsonField(val);
    }
    return fixed;
  }
  return value;
}

function hasHtmlEntitiesInJson(value: unknown): boolean {
  if (!value) return false;
  if (typeof value === 'string') return hasHtmlEntities(value);
  if (Array.isArray(value)) {
    return value.some(item => hasHtmlEntitiesInJson(item));
  }
  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).some(val => hasHtmlEntitiesInJson(val));
  }
  return false;
}

async function main() {
  console.log('='.repeat(50));
  console.log('Fix HTML Entities in Recipes');
  console.log('='.repeat(50));
  console.log(`Mode: ${DRY_RUN ? 'DRY RUN' : 'LIVE'}\n`);

  // Get all recipes
  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, slug, title, introduction, ingredients, instructions, conclusion, faq, content')
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(`Scanning ${recipes.length} recipes...\n`);

  let fixedCount = 0;
  const fieldsToCheck = ['title', 'introduction', 'ingredients', 'instructions', 'conclusion', 'faq', 'content'];

  for (const recipe of recipes) {
    const updates: Record<string, unknown> = {};
    const fieldsWithIssues: string[] = [];

    for (const field of fieldsToCheck) {
      const value = recipe[field as keyof typeof recipe];
      const hasIssues = typeof value === 'string'
        ? hasHtmlEntities(value)
        : hasHtmlEntitiesInJson(value);

      if (hasIssues) {
        fieldsWithIssues.push(field);
        const fixed = typeof value === 'string'
          ? fixHtmlEntities(value)
          : fixJsonField(value);
        if (JSON.stringify(fixed) !== JSON.stringify(value)) {
          updates[field] = fixed;
        }
      }
    }

    if (Object.keys(updates).length > 0) {
      console.log(`\n[${recipe.id}] ${recipe.title}`);
      console.log(`  Fields with issues: ${fieldsWithIssues.join(', ')}`);
      
      for (const [field, newValue] of Object.entries(updates)) {
        const oldValue = recipe[field as keyof typeof recipe];
        // Show a snippet of the change
        const oldStr = typeof oldValue === 'string' ? oldValue : JSON.stringify(oldValue);
        const newStr = typeof newValue === 'string' ? newValue : JSON.stringify(newValue);
        const oldSnippet = oldStr.substring(0, 80).replace(/\n/g, ' ');
        const newSnippet = newStr.substring(0, 80).replace(/\n/g, ' ');
        console.log(`  ${field}:`);
        console.log(`    OLD: ${oldSnippet}...`);
        console.log(`    NEW: ${newSnippet}...`);
      }

      if (!DRY_RUN) {
        const { error: updateError } = await supabase
          .from('recipes')
          .update(updates)
          .eq('id', recipe.id);

        if (updateError) {
          console.log(`  ERROR: ${updateError.message}`);
        } else {
          console.log(`  ✓ Fixed`);
          fixedCount++;
        }
      } else {
        console.log(`  (would be fixed)`);
        fixedCount++;
      }
    }
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total: ${fixedCount} recipes ${DRY_RUN ? 'would be' : ''} fixed`);
}

main().catch(console.error);
