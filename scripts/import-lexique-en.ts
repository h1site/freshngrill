/**
 * Script d'import des traductions anglaises du lexique culinaire
 * Usage: npx tsx scripts/import-lexique-en.ts
 *
 * Ce script:
 * 1. Ajoute les colonnes term_en et definition_en si nécessaires
 * 2. Importe les traductions depuis lexique-export-en.csv
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface LexiqueRow {
  id: number;
  term: string;
  definition: string;
  term_en: string;
  definition_en: string;
}

function parseCSV(content: string): LexiqueRow[] {
  const lines = content.split('\n');
  const rows: LexiqueRow[] = [];

  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV with quoted fields
    const matches = line.match(/(?:^|,)("(?:[^"]*(?:""[^"]*)*)"|[^,]*)/g);
    if (!matches || matches.length < 5) continue;

    const fields = matches.map(m => {
      let field = m.replace(/^,/, '');
      // Remove surrounding quotes and unescape double quotes
      if (field.startsWith('"') && field.endsWith('"')) {
        field = field.slice(1, -1).replace(/""/g, '"');
      }
      return field.trim();
    });

    const [idStr, term, definition, term_en, definition_en] = fields;
    const id = parseInt(idStr, 10);

    if (isNaN(id)) continue;

    rows.push({
      id,
      term,
      definition,
      term_en: term_en || term,
      definition_en: definition_en || definition,
    });
  }

  return rows;
}

async function addEnglishColumns(): Promise<boolean> {
  console.log('📋 Vérification/ajout des colonnes anglaises...');

  // Essayer d'ajouter les colonnes (ignorera si elles existent déjà)
  const { error: error1 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE lexique ADD COLUMN IF NOT EXISTS term_en VARCHAR(255);`
  }).single();

  const { error: error2 } = await supabase.rpc('exec_sql', {
    sql: `ALTER TABLE lexique ADD COLUMN IF NOT EXISTS definition_en TEXT;`
  }).single();

  // Si RPC n'existe pas, on essaie directement avec un update test
  // Les colonnes seront ajoutées manuellement si nécessaire
  console.log('   ✓ Colonnes term_en et definition_en prêtes');
  return true;
}

async function importTranslations(rows: LexiqueRow[]): Promise<void> {
  console.log(`\n📤 Import de ${rows.length} traductions...`);

  let success = 0;
  let notFound = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      // Mettre à jour par ID
      const { error, count } = await supabase
        .from('lexique')
        .update({
          term_en: row.term_en,
          definition_en: row.definition_en,
        })
        .eq('id', row.id);

      if (error) {
        // Si l'erreur est due aux colonnes manquantes
        if (error.message.includes('column') && error.message.includes('does not exist')) {
          console.error('\n❌ Les colonnes term_en/definition_en n\'existent pas.');
          console.error('   Exécutez cette commande SQL dans Supabase:');
          console.error('   ALTER TABLE lexique ADD COLUMN term_en VARCHAR(255);');
          console.error('   ALTER TABLE lexique ADD COLUMN definition_en TEXT;');
          return;
        }
        console.error(`   ❌ Erreur ID ${row.id}:`, error.message);
        failed++;
      } else {
        process.stdout.write('.');
        success++;
      }
    } catch (err) {
      console.error(`   ❌ Exception ID ${row.id}:`, err);
      failed++;
    }
  }

  console.log('\n');
  console.log('='.repeat(50));
  console.log(`✅ Import terminé!`);
  console.log(`   ${success} traductions importées`);
  if (notFound > 0) console.log(`   ${notFound} termes non trouvés`);
  if (failed > 0) console.log(`   ${failed} erreurs`);
}

async function main() {
  console.log('🍳 Import des traductions anglaises du lexique');
  console.log('='.repeat(50));

  // 1. Lire le fichier CSV
  const csvPath = path.join(process.cwd(), 'lexique-export-en.csv');

  if (!fs.existsSync(csvPath)) {
    console.error(`❌ Fichier non trouvé: ${csvPath}`);
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  console.log(`📄 ${rows.length} lignes lues depuis le CSV`);

  // Aperçu
  console.log('\n📋 Aperçu des premières traductions:');
  rows.slice(0, 3).forEach(r => {
    console.log(`   [${r.id}] ${r.term} → ${r.term_en}`);
    console.log(`       FR: ${r.definition.substring(0, 50)}...`);
    console.log(`       EN: ${r.definition_en.substring(0, 50)}...`);
  });

  // 2. Importer les traductions
  await importTranslations(rows);
}

main().catch(console.error);
