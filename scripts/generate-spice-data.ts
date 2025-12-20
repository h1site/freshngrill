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

interface SpiceData {
  slug: string;
  name_fr: string;
  name_en: string;
}

interface GeneratedData {
  origine_histoire_fr: string;
  origine_histoire_en: string;
  utilisation_aliments_fr: string[];
  utilisation_aliments_en: string[];
  bienfaits_fr: string[];
  bienfaits_en: string[];
  conservation_fr: string;
  conservation_en: string;
  substitutions: string[];
  faq_fr: Array<{ question: string; reponse: string }>;
  faq_en: Array<{ question: string; reponse: string }>;
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
  "origine_histoire_fr": "1-2 phrases sur l'origine géographique et historique",
  "origine_histoire_en": "1-2 sentences about origin and history",
  "utilisation_aliments_fr": ["viandes", "poissons", "légumes", "sauces"],
  "utilisation_aliments_en": ["meats", "fish", "vegetables", "sauces"],
  "bienfaits_fr": ["avantage culinaire 1", "avantage 2", "avantage 3"],
  "bienfaits_en": ["culinary benefit 1", "benefit 2", "benefit 3"],
  "conservation_fr": "Comment conserver cette épice",
  "conservation_en": "How to store this spice",
  "substitutions": ["alternative 1", "alternative 2"],
  "faq_fr": [
    {"question": "Avec quels aliments utiliser ${spice.name_fr} ?", "reponse": "Réponse pratique"},
    {"question": "Comment doser ${spice.name_fr} ?", "reponse": "Réponse pratique"}
  ],
  "faq_en": [
    {"question": "What foods pair well with ${spice.name_en}?", "reponse": "Practical answer"},
    {"question": "How much ${spice.name_en} should you use?", "reponse": "Practical answer"}
  ]
}`;

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

async function updateSpiceInDatabase(slug: string, data: GeneratedData): Promise<boolean> {
  const { error } = await supabase
    .from('spices')
    .update({
      origine_histoire_fr: data.origine_histoire_fr,
      origine_histoire_en: data.origine_histoire_en,
      utilisation_aliments_fr: data.utilisation_aliments_fr,
      utilisation_aliments_en: data.utilisation_aliments_en,
      bienfaits_fr: data.bienfaits_fr,
      bienfaits_en: data.bienfaits_en,
      conservation_fr: data.conservation_fr,
      conservation_en: data.conservation_en,
      substitutions: data.substitutions,
      faq_fr: data.faq_fr,
      faq_en: data.faq_en,
    })
    .eq('slug', slug);

  if (error) {
    console.error(`❌ Erreur DB pour ${slug}:`, error.message);
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
    .select('slug, name_fr, name_en')
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
      const updated = await updateSpiceInDatabase(spice.slug, data);
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
