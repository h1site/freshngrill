/**
 * Script pour générer les données des épices avec Ollama (gratuit, local)
 * et les insérer dans Supabase
 *
 * Usage: npx tsx scripts/generate-spice-data.ts
 *
 * Prérequis: Ollama doit être installé et en cours d'exécution
 * Modèle recommandé: mistral (meilleur pour JSON) ou llama3.2
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cjbdgfcxewvxcojxbuab.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqYmRnZmN4ZXd2eGNvanhidWFiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTI4OTczNCwiZXhwIjoyMDgwODY1NzM0fQ.wq_hwCrw8CfmKnf7Hla8S_jtQjHE5cOMIfvi5Ww7jYA';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral';
const OLLAMA_URL = 'http://localhost:11434/api/generate';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

interface TasteProfile {
  intensity?: number;
  spicy?: number;
  bitterness?: number;
  sweetness?: number;
  notes_fr?: string[];
  notes_en?: string[];
}

interface SpiceData {
  slug: string;
  name_fr: string;
  name_en: string;
  taste_profile: TasteProfile | null;
}

interface GeneratedData {
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

async function callOllama(prompt: string): Promise<string> {
  const response = await fetch(OLLAMA_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: 0.7,
        num_predict: 2000,
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Ollama API error: ${error}`);
  }

  const data = await response.json();
  return data.response;
}

async function generateSpiceData(spice: SpiceData): Promise<GeneratedData | null> {
  const prompt = `Tu es un expert culinaire spécialisé dans les épices. Génère les données pour l'épice "${spice.name_fr}" (${spice.name_en}).

IMPORTANT: Réponds UNIQUEMENT avec ce JSON valide, sans texte avant ou après, sans markdown:
{
  "fr": {
    "name": "${spice.name_fr}",
    "origine_histoire": "1-2 phrases sur l'origine géographique et historique",
    "utilisation_aliments": ["viandes", "poissons", "légumes", "sauces"], 
    "bienfaits": ["avantage culinaire 1", "avantage 2", "avantage 3"],
    "intensite": 3,
    "conservation": "Comment conserver cette épice",
    "substitutions": ["alternative 1", "alternative 2"],
    "faq": [
      {"question": "Avec quels aliments utiliser ${spice.name_fr} ?", "reponse": "Réponse pratique"},
      {"question": "Comment doser ${spice.name_fr} ?", "reponse": "Réponse pratique"}
    ]
  },
  "en": {
    "name": "${spice.name_en}",
    "origine_histoire": "1-2 sentences about origin and history",
    "utilisation_aliments": ["meats", "fish", "vegetables", "sauces"],
    "bienfaits": ["culinary benefit 1", "benefit 2", "benefit 3"],
    "intensite": 3,
    "conservation": "How to store this spice",
    "substitutions": ["alternative 1", "alternative 2"],
    "faq": [
      {"question": "What foods pair well with ${spice.name_en}?", "reponse": "Practical answer"},
      {"question": "How much ${spice.name_en} should you use?", "reponse": "Practical answer"}
    ]
  }
}

Contraintes:
- intensite est un entier de 1 (doux) à 5 (très puissant). Choisis une valeur réaliste pour cette épice.
- utilises des formulations concises et pratiques.`;

  try {
    const response = await callOllama(prompt);
    // Nettoyer la réponse (enlever les backticks markdown si présents)
    let cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Extraire le JSON s'il y a du texte autour
    const jsonMatch = cleanResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanResponse = jsonMatch[0];
    }

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error(`❌ Erreur pour ${spice.name_fr}:`, error);
    return null;
  }
}

function mergeIntensity(existing: TasteProfile | null, newIntensity: number): TasteProfile {
  return {
    ...(existing || {}),
    intensity: newIntensity,
  };
}

async function updateSpiceInDatabase(spice: SpiceData, data: GeneratedData): Promise<boolean> {
  const updatedTasteProfile = mergeIntensity(spice.taste_profile, data.fr.intensite);

  const { error } = await supabase
    .from('spices')
    .update({
      origine_histoire_fr: data.fr.origine_histoire,
      origine_histoire_en: data.en.origine_histoire,
      utilisation_aliments_fr: data.fr.utilisation_aliments,
      utilisation_aliments_en: data.en.utilisation_aliments,
      bienfaits_fr: data.fr.bienfaits,
      bienfaits_en: data.en.bienfaits,
      conservation_fr: data.fr.conservation,
      conservation_en: data.en.conservation,
      substitutions: data.fr.substitutions,
      faq_fr: data.fr.faq,
      faq_en: data.en.faq,
      taste_profile: updatedTasteProfile,
    })
    .eq('slug', spice.slug);

  if (error) {
    console.error(`❌ Erreur DB pour ${spice.slug}:`, error.message);
    return false;
  }
  return true;
}

async function main() {
  console.log(`🌿 Génération des données d'épices avec Ollama (${OLLAMA_MODEL})...\n`);

  // Vérifier que Ollama est accessible
  try {
    const testResponse = await fetch('http://localhost:11434/api/tags');
    if (!testResponse.ok) {
      throw new Error('Ollama non accessible');
    }
    console.log('✅ Ollama est accessible\n');
  } catch {
    console.error('❌ Ollama n\'est pas accessible. Lance "ollama serve" dans un terminal.');
    process.exit(1);
  }

  // Récupérer les épices sans données complètes
  const { data: spices, error } = await supabase
    .from('spices')
    .select('slug, name_fr, name_en, taste_profile')
    .is('origine_histoire_fr', null)
    .eq('is_published', true)
    .order('slug');

  if (error) {
    console.error('❌ Erreur Supabase:', error.message);
    process.exit(1);
  }

  if (!spices || spices.length === 0) {
    console.log('✅ Toutes les épices ont déjà des données!');
    return;
  }

  console.log(`📋 ${spices.length} épices à traiter\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < spices.length; i++) {
    const spice = spices[i];
    console.log(`[${i + 1}/${spices.length}] ${spice.name_fr}...`);

    const data = await generateSpiceData(spice);

    if (data) {
      const updated = await updateSpiceInDatabase(spice, data);
      if (updated) {
        console.log(`  ✅ ${spice.name_fr} mis à jour`);
        success++;
      } else {
        failed++;
      }
    } else {
      failed++;
    }

    // Petite pause pour ne pas surcharger Ollama
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n🏁 Terminé!`);
  console.log(`  ✅ Succès: ${success}`);
  console.log(`  ❌ Échecs: ${failed}`);
}

main().catch(console.error);
