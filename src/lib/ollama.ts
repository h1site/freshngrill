/**
 * Service Ollama pour améliorer le texte des recettes
 * Utilise llama3.2 en local pour générer/améliorer du contenu
 */

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const MODEL = process.env.OLLAMA_MODEL || 'llama3.2';

interface OllamaResponse {
  model: string;
  created_at: string;
  response: string;
  done: boolean;
}

interface GenerateOptions {
  temperature?: number;
  maxTokens?: number;
}

/**
 * Génère du texte avec Ollama
 */
export async function generate(
  prompt: string,
  options: GenerateOptions = {}
): Promise<string> {
  const { temperature = 0.7, maxTokens = 1000 } = options;

  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        prompt,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama error: ${response.status}`);
    }

    const data: OllamaResponse = await response.json();
    return data.response.trim();
  } catch (error) {
    console.error('Erreur Ollama:', error);
    throw error;
  }
}

/**
 * Améliore la description d'une recette
 */
export async function improveRecipeDescription(
  title: string,
  currentDescription: string
): Promise<string> {
  const prompt = `Tu es un rédacteur culinaire québécois expert. Améliore cette description de recette en la rendant plus appétissante et engageante. Garde un ton chaleureux et québécois. Maximum 2-3 phrases.

Titre de la recette: ${title}
Description actuelle: ${currentDescription}

Nouvelle description améliorée (en français):`;

  return generate(prompt, { temperature: 0.8 });
}

/**
 * Génère une introduction pour une recette
 */
export async function generateRecipeIntro(
  title: string,
  ingredients: string[],
  prepTime: number,
  cookTime: number
): Promise<string> {
  const prompt = `Tu es un rédacteur culinaire québécois. Écris une introduction engageante pour cette recette. Maximum 3-4 phrases, ton chaleureux.

Recette: ${title}
Ingrédients principaux: ${ingredients.slice(0, 5).join(', ')}
Temps de préparation: ${prepTime} minutes
Temps de cuisson: ${cookTime} minutes

Introduction (en français):`;

  return generate(prompt, { temperature: 0.7 });
}

/**
 * Génère une conclusion pour une recette
 */
export async function generateRecipeConclusion(
  title: string,
  category?: string
): Promise<string> {
  const prompt = `Tu es un rédacteur culinaire québécois. Écris une courte conclusion pour cette recette avec des suggestions de service ou d'accompagnement. Maximum 2-3 phrases.

Recette: ${title}
${category ? `Catégorie: ${category}` : ''}

Conclusion (en français):`;

  return generate(prompt, { temperature: 0.7 });
}

/**
 * Génère des FAQ pour une recette
 */
export async function generateRecipeFAQ(
  title: string,
  ingredients: string[]
): Promise<{ question: string; answer: string }[]> {
  const prompt = `Tu es un chef culinaire québécois. Génère 3 questions fréquentes avec leurs réponses pour cette recette. Format JSON.

Recette: ${title}
Ingrédients: ${ingredients.join(', ')}

Retourne UNIQUEMENT un tableau JSON valide avec ce format:
[{"question": "...", "answer": "..."}]`;

  const response = await generate(prompt, { temperature: 0.6 });

  try {
    // Extraire le JSON de la réponse
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Erreur parsing FAQ:', e);
  }

  return [];
}

/**
 * Améliore une étape de recette
 */
export async function improveRecipeStep(
  stepContent: string,
  recipeTitle: string
): Promise<string> {
  const prompt = `Tu es un chef culinaire. Réécris cette étape de recette de manière plus claire et détaillée. Maximum 2-3 phrases.

Recette: ${recipeTitle}
Étape actuelle: ${stepContent}

Étape améliorée (en français):`;

  return generate(prompt, { temperature: 0.6 });
}

/**
 * Vérifie si Ollama est disponible
 */
export async function isOllamaAvailable(): Promise<boolean> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: 'GET',
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Liste les modèles disponibles
 */
export async function listModels(): Promise<string[]> {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`);
    if (!response.ok) return [];

    const data = await response.json();
    return data.models?.map((m: { name: string }) => m.name) || [];
  } catch {
    return [];
  }
}
