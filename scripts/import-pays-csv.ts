import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config({ path: '.env.local' });

// Corrections manuelles de pays mal assignés par ChatGPT
const PAYS_CORRECTIONS: Record<number, string> = {
  9: 'Canada',       // Blé d'Inde - pas l'Inde!
  11: 'Ukraine',     // Bortsch Ukrainien
  20: 'Canada',      // Pâté Chinois - plat québécois!
  25: 'Canada',      // Macaroni Chinois - plat québécois!
  99: 'Chine',       // Poulet Général Tao
  131: 'Allemagne',  // Crêpe allemande Pfannkuchen
  140: 'Rwanda',     // Traditionnelle Rwandaise
  155: 'Pérou',      // Ceviche Peruvien
};

// Normaliser les noms de pays pour utiliser le même format
const PAYS_NORMALIZATION: Record<string, string> = {
  'Canada (Québec)': 'Canada',
  'États-Unis': 'États-Unis',
  'Moyen-Orient': 'Moyen-Orient',
};

async function main() {
  // Utiliser la service role key pour bypasser le RLS
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Lire le CSV
  const csvContent = fs.readFileSync('recettes-export-avec-pays (1).csv', 'utf-8');
  const lines = csvContent.split('\n').slice(1); // Skip header

  let updated = 0;
  let errors = 0;

  for (const line of lines) {
    if (!line.trim()) continue;

    // Parse CSV - le format est: id,title,pays
    // Le titre peut contenir des virgules, donc on prend la dernière virgule pour le pays
    const lastCommaIndex = line.lastIndexOf(',');
    if (lastCommaIndex === -1) {
      console.log('Skipping malformed line:', line.substring(0, 50));
      continue;
    }

    const firstPart = line.substring(0, lastCommaIndex);
    let pays = line.substring(lastCommaIndex + 1).trim();

    // Trouver le premier comma pour séparer id et title
    const firstCommaIndex = firstPart.indexOf(',');
    if (firstCommaIndex === -1) {
      console.log('Skipping malformed line:', line.substring(0, 50));
      continue;
    }

    const id = parseInt(firstPart.substring(0, firstCommaIndex));
    const title = firstPart.substring(firstCommaIndex + 1).trim();

    // Appliquer les corrections manuelles
    if (PAYS_CORRECTIONS[id]) {
      console.log(`Correction: ${title} -> ${PAYS_CORRECTIONS[id]} (était: ${pays})`);
      pays = PAYS_CORRECTIONS[id];
    }

    // Normaliser le nom du pays
    if (PAYS_NORMALIZATION[pays]) {
      pays = PAYS_NORMALIZATION[pays];
    }

    // Mettre à jour la recette
    const { error } = await supabase
      .from('recipes')
      .update({ origine: pays })
      .eq('id', id);

    if (error) {
      console.error(`Erreur pour ${id} (${title}):`, error.message);
      errors++;
    } else {
      updated++;
    }
  }

  console.log(`\nTerminé! ${updated} recettes mises à jour, ${errors} erreurs.`);
}

main();
