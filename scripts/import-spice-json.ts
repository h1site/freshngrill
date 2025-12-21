/**
 * Script pour importer les données d'épices depuis un fichier JSON
 * Usage: npx tsx scripts/import-spice-json.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface SpiceJsonEntry {
  fr: {
    name: string;
    origine_histoire: string;
    utilisation_aliments: string[];
    bienfaits: string[];
    intensite: number;
    conservation: string;
    substitutions: string[];
    faq: Array<{ question: string; reponse: string }>;
  };
  en: {
    name: string;
    origine_histoire: string;
    utilisation_aliments: string[];
    bienfaits: string[];
    intensite: number;
    conservation: string;
    substitutions: string[];
    faq: Array<{ question: string; reponse: string }>;
  };
}

async function findSpiceByName(nameFr: string): Promise<{ slug: string; name_fr: string } | null> {
  // Chercher par correspondance exacte ou partielle
  const searchName = nameFr.toLowerCase().trim();

  const { data: spices } = await supabase
    .from('spices')
    .select('slug, name_fr')
    .ilike('name_fr', `%${searchName}%`);

  if (spices && spices.length > 0) {
    // Trouver la meilleure correspondance
    const exact = spices.find(s => s.name_fr.toLowerCase() === searchName);
    if (exact) return exact;
    return spices[0];
  }

  return null;
}

async function updateSpice(entry: SpiceJsonEntry): Promise<boolean> {
  const spice = await findSpiceByName(entry.fr.name);

  if (!spice) {
    console.log(`  ⚠️ Épice non trouvée: "${entry.fr.name}"`);
    return false;
  }

  const { error } = await supabase
    .from('spices')
    .update({
      definition_fr: entry.fr.origine_histoire,
      definition_en: entry.en.origine_histoire,
      origine_histoire_fr: entry.fr.origine_histoire,
      origine_histoire_en: entry.en.origine_histoire,
      utilisation_aliments_fr: entry.fr.utilisation_aliments,
      utilisation_aliments_en: entry.en.utilisation_aliments,
      bienfaits_fr: entry.fr.bienfaits,
      bienfaits_en: entry.en.bienfaits,
      conservation_fr: entry.fr.conservation,
      conservation_en: entry.en.conservation,
      substitutions: entry.fr.substitutions,
      faq_fr: entry.fr.faq,
      faq_en: entry.en.faq,
    })
    .eq('slug', spice.slug);

  if (error) {
    console.log(`  ❌ Erreur DB: ${error.message}`);
    return false;
  }

  console.log(`  ✅ ${entry.fr.name} → ${spice.name_fr}`);
  return true;
}

async function main() {
  // Lire le fichier JSON
  const jsonPath = path.join(__dirname, 'spices-data.json');

  if (!fs.existsSync(jsonPath)) {
    console.log('📋 Créer le fichier scripts/spices-data.json avec les données JSON');
    console.log('   Format attendu: tableau d\'objets avec fr et en');
    process.exit(1);
  }

  const jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as SpiceJsonEntry[];

  console.log(`🌿 Import de ${jsonData.length} épices...\n`);

  let success = 0;
  let failed = 0;

  for (const entry of jsonData) {
    const result = await updateSpice(entry);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  console.log(`\n🏁 Terminé!`);
  console.log(`  ✅ Succès: ${success}`);
  console.log(`  ⚠️ Non trouvées: ${failed}`);
}

main().catch(console.error);
