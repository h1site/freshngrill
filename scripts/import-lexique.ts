/**
 * Script d'import du lexique culinaire depuis WordPress
 * Usage: npx tsx scripts/import-lexique.ts
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';

// Charger les variables d'environnement depuis .env.local
config({ path: resolve(process.cwd(), '.env.local') });

// Configuration
const WORDPRESS_URL = 'https://menucochon.com';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes');
  console.error('   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis dans .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface LexiqueTerm {
  slug: string;
  term: string;
  definition: string;
  letter: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function cleanHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"')
    .replace(/&hellip;/g, '...')
    .replace(/&eacute;/g, 'é')
    .replace(/&egrave;/g, 'è')
    .replace(/&agrave;/g, 'à')
    .replace(/&ugrave;/g, 'ù')
    .replace(/&ocirc;/g, 'ô')
    .replace(/&ecirc;/g, 'ê')
    .replace(/&icirc;/g, 'î')
    .replace(/&ucirc;/g, 'û')
    .replace(/&acirc;/g, 'â')
    .replace(/&ccedil;/g, 'ç')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchLexiquePage(): Promise<string> {
  console.log('📥 Récupération de la page du lexique...');

  const response = await fetch(`${WORDPRESS_URL}/lexique-culinaire/`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.text();
}

function parseLexique(html: string): LexiqueTerm[] {
  const terms: LexiqueTerm[] = [];

  // Pattern pour extraire les lignes du tableau
  // Format: <tr><td>Terme</td><td>Définition</td></tr>
  const rowPattern = /<tr[^>]*>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>\s*<\/tr>/gi;

  let match;
  while ((match = rowPattern.exec(html)) !== null) {
    const termRaw = cleanHtml(match[1]);
    const definitionRaw = cleanHtml(match[2]);

    // Ignorer les en-têtes ou lignes vides
    if (!termRaw || !definitionRaw) continue;
    if (termRaw.toLowerCase() === 'terme' && definitionRaw.toLowerCase() === 'description') continue;
    if (termRaw.length < 2) continue;

    const term = termRaw.charAt(0).toUpperCase() + termRaw.slice(1);
    const slug = slugify(termRaw);
    const letter = term.charAt(0).toUpperCase();

    // Vérifier que la première lettre est une lettre
    if (!/^[A-ZÀ-ÿ]/.test(letter)) continue;

    // Normaliser la lettre (accent -> sans accent pour le groupement)
    const normalizedLetter = letter
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();

    terms.push({
      slug,
      term,
      definition: definitionRaw,
      letter: normalizedLetter,
    });
  }

  console.log(`   ${terms.length} termes trouvés`);
  return terms;
}

async function importTerms(terms: LexiqueTerm[]): Promise<void> {
  console.log('\n📤 Import dans Supabase...');

  let success = 0;
  let updated = 0;
  let failed = 0;

  for (const term of terms) {
    try {
      // Upsert (insert ou update si existe)
      const { error } = await supabase
        .from('lexique')
        .upsert(
          {
            slug: term.slug,
            term: term.term,
            definition: term.definition,
            letter: term.letter,
          },
          { onConflict: 'slug' }
        );

      if (error) {
        console.error(`   ❌ Erreur pour "${term.term}":`, error.message);
        failed++;
      } else {
        process.stdout.write('.');
        success++;
      }
    } catch (err) {
      console.error(`   ❌ Exception pour "${term.term}":`, err);
      failed++;
    }
  }

  console.log('\n');
  console.log('='.repeat(50));
  console.log(`✅ Import terminé!`);
  console.log(`   ${success} termes importés`);
  if (failed > 0) console.log(`   ${failed} erreurs`);
}

async function main() {
  console.log('🍳 Import du lexique culinaire');
  console.log('='.repeat(50));

  try {
    // 1. Récupérer la page
    const html = await fetchLexiquePage();

    // 2. Parser les termes
    const terms = parseLexique(html);

    if (terms.length === 0) {
      console.error('❌ Aucun terme trouvé. Le format de la page a peut-être changé.');
      process.exit(1);
    }

    // Afficher un aperçu
    console.log('\n📋 Aperçu des premiers termes:');
    terms.slice(0, 5).forEach(t => {
      console.log(`   ${t.letter} - ${t.term}: ${t.definition.substring(0, 50)}...`);
    });

    // 3. Importer dans Supabase
    await importTerms(terms);

    // 4. Afficher les stats par lettre
    const byLetter: Record<string, number> = {};
    terms.forEach(t => {
      byLetter[t.letter] = (byLetter[t.letter] || 0) + 1;
    });

    console.log('\n📊 Répartition par lettre:');
    Object.keys(byLetter).sort().forEach(letter => {
      console.log(`   ${letter}: ${byLetter[letter]} termes`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
    process.exit(1);
  }
}

main();
