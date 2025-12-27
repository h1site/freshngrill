import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';
import OpenAI from 'openai';

// OpenAI client is initialized lazily inside functions to avoid build-time errors
let openaiClient: OpenAI | null = null;

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

interface RecipeSubmission {
  id: number;
  name: string;
  email: string;
  profile_image: string | null;
  recipe_name: string;
  description: string;
  ingredients: string;
  instructions: string;
  prep_time: number | null;
  cook_time: number | null;
  servings: string | null;
  category: string | null;
  recipe_image: string | null;
  locale: string;
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

// Helper to parse ingredients text into JSONB array
function parseIngredients(text: string): Array<{ group?: string; items: string[] }> {
  const lines = text.split('\n').filter(line => line.trim());
  const result: Array<{ group?: string; items: string[] }> = [];
  let currentGroup: { group?: string; items: string[] } = { items: [] };

  for (const line of lines) {
    const trimmed = line.trim();
    // Check if it's a group header (e.g., "Pour la sauce:" or "## Sauce")
    if (trimmed.endsWith(':') || trimmed.startsWith('##') || trimmed.startsWith('**')) {
      if (currentGroup.items.length > 0) {
        result.push(currentGroup);
      }
      const groupName = trimmed.replace(/^[#*]+\s*/, '').replace(/:$/, '').replace(/\*+$/, '');
      currentGroup = { group: groupName, items: [] };
    } else if (trimmed) {
      // Remove leading bullet points, dashes, or numbers
      const cleanItem = trimmed.replace(/^[-•*]\s*/, '').replace(/^\d+[.)]\s*/, '');
      if (cleanItem) {
        currentGroup.items.push(cleanItem);
      }
    }
  }

  if (currentGroup.items.length > 0) {
    result.push(currentGroup);
  }

  // If no groups were created, return single group
  if (result.length === 0 && currentGroup.items.length === 0) {
    return [{ items: lines.filter(l => l.trim()) }];
  }

  return result;
}

// Helper to parse instructions text into JSONB array
function parseInstructions(text: string): Array<{ step: number; text: string }> {
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map((line, index) => {
    // Remove leading numbers, bullets, etc.
    const cleanText = line.trim()
      .replace(/^[-•*]\s*/, '')
      .replace(/^\d+[.)]\s*/, '')
      .replace(/^Étape\s*\d+[.:]\s*/i, '');
    return {
      step: index + 1,
      text: cleanText,
    };
  });
}

// Translate text using OpenAI
async function translateText(text: string, fromLang: string, toLang: string): Promise<string> {
  const fromName = fromLang === 'fr' ? 'French' : 'English';
  const toName = toLang === 'fr' ? 'French' : 'English';

  const response = await getOpenAIClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional culinary translator. Translate the following ${fromName} recipe text to ${toName}. Keep the same format and structure. Only output the translation, nothing else.`,
      },
      {
        role: 'user',
        content: text,
      },
    ],
    temperature: 0.3,
  });

  return response.choices[0]?.message?.content || text;
}

// Translate ingredients array
async function translateIngredients(
  ingredients: Array<{ group?: string; items: string[] }>,
  fromLang: string,
  toLang: string
): Promise<Array<{ group?: string; items: string[] }>> {
  const translated = [];

  for (const group of ingredients) {
    const translatedGroup: { group?: string; items: string[] } = {
      items: [],
    };

    if (group.group) {
      translatedGroup.group = await translateText(group.group, fromLang, toLang);
    }

    // Translate all items in batch
    const itemsText = group.items.join('\n');
    const translatedItemsText = await translateText(itemsText, fromLang, toLang);
    translatedGroup.items = translatedItemsText.split('\n').filter(i => i.trim());

    translated.push(translatedGroup);
  }

  return translated;
}

// Translate instructions array
async function translateInstructions(
  instructions: Array<{ step: number; text: string }>,
  fromLang: string,
  toLang: string
): Promise<Array<{ step: number; text: string }>> {
  // Translate all steps in batch
  const stepsText = instructions.map(i => i.text).join('\n---\n');
  const translatedText = await translateText(stepsText, fromLang, toLang);
  const translatedSteps = translatedText.split('\n---\n');

  return instructions.map((instruction, index) => ({
    step: instruction.step,
    text: translatedSteps[index]?.trim() || instruction.text,
  }));
}

export async function POST(request: Request) {
  const supabase = createAdminClient();

  try {
    const body = await request.json();
    const { submissionId } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'submissionId requis' },
        { status: 400 }
      );
    }

    // Get the submission
    const { data: submission, error: fetchError } = await supabase
      .from('recipe_submissions')
      .select('*')
      .eq('id', submissionId)
      .single();

    if (fetchError || !submission) {
      return NextResponse.json(
        { error: 'Soumission non trouvée' },
        { status: 404 }
      );
    }

    const sub = submission as RecipeSubmission;
    const sourceLang = sub.locale || 'fr';
    const targetLang = sourceLang === 'fr' ? 'en' : 'fr';

    // Parse ingredients and instructions
    const ingredientsFr = parseIngredients(sub.ingredients);
    const instructionsFr = parseInstructions(sub.instructions);

    // Translate to the other language
    const [
      titleEn,
      descriptionEn,
      ingredientsEn,
      instructionsEn,
    ] = await Promise.all([
      sourceLang === 'fr'
        ? translateText(sub.recipe_name, 'fr', 'en')
        : sub.recipe_name,
      sourceLang === 'fr'
        ? translateText(sub.description, 'fr', 'en')
        : sub.description,
      sourceLang === 'fr'
        ? translateIngredients(ingredientsFr, 'fr', 'en')
        : ingredientsFr,
      sourceLang === 'fr'
        ? translateInstructions(instructionsFr, 'fr', 'en')
        : instructionsFr,
    ]);

    // If source is English, translate to French
    let titleFr = sub.recipe_name;
    let descriptionFr = sub.description;
    let ingredientsFrFinal = ingredientsFr;
    let instructionsFrFinal = instructionsFr;

    if (sourceLang === 'en') {
      [titleFr, descriptionFr, ingredientsFrFinal, instructionsFrFinal] = await Promise.all([
        translateText(sub.recipe_name, 'en', 'fr'),
        translateText(sub.description, 'en', 'fr'),
        translateIngredients(ingredientsFr, 'en', 'fr'),
        translateInstructions(instructionsFr, 'en', 'fr'),
      ]);
    }

    // Generate slugs
    const slugFr = generateSlug(titleFr);
    const slugEn = generateSlug(titleEn);

    // Calculate total time
    const prepTime = sub.prep_time || 0;
    const cookTime = sub.cook_time || 0;
    const totalTime = prepTime + cookTime;

    // Parse servings
    const servings = sub.servings ? parseInt(sub.servings, 10) || 4 : 4;

    // Create the recipe in the main table (French)
    const { data: newRecipe, error: insertError } = await supabase
      .from('recipes' as never)
      .insert({
        slug: slugFr,
        title: titleFr,
        excerpt: descriptionFr,
        content: `Recette soumise par ${sub.name}`, // Tips/notes
        featured_image: sub.recipe_image,
        prep_time: prepTime,
        cook_time: cookTime,
        total_time: totalTime,
        servings,
        servings_unit: 'portions',
        difficulty: 'moyen',
        ingredients: ingredientsFrFinal,
        instructions: instructionsFrFinal,
        cuisine: sub.category || 'autre',
        author: sub.name, // Community author
        is_community_recipe: true,
        community_author_name: sub.name,
        community_author_email: sub.email,
        community_author_image: sub.profile_image,
        submission_id: sub.id,
        seo_title: `${titleFr} | Recette de la communauté`,
        seo_description: descriptionFr.substring(0, 160),
        published_at: new Date().toISOString(),
      } as never)
      .select('id')
      .single() as { data: { id: number } | null; error: Error | null };

    if (insertError || !newRecipe) {
      console.error('Error creating recipe:', insertError);
      return NextResponse.json(
        { error: `Erreur création recette: ${insertError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Create the English translation
    const { error: translationError } = await supabase
      .from('recipe_translations' as never)
      .insert({
        recipe_id: newRecipe.id,
        locale: 'en',
        slug_en: slugEn,
        title: titleEn,
        excerpt: descriptionEn,
        content: `Recipe submitted by ${sub.name}`, // Tips in English
        ingredients: ingredientsEn,
        instructions: instructionsEn,
        seo_title: `${titleEn} | Community Recipe`,
        seo_description: descriptionEn.substring(0, 160),
      } as never);

    if (translationError) {
      console.error('Error creating translation:', translationError);
      // Don't fail the whole operation, just log it
    }

    // Update the submission status to published
    const { error: updateError } = await supabase
      .from('recipe_submissions' as never)
      .update({
        status: 'published',
        reviewed_at: new Date().toISOString(),
      } as never)
      .eq('id', submissionId);

    if (updateError) {
      console.error('Error updating submission:', updateError);
    }

    return NextResponse.json({
      success: true,
      recipeId: newRecipe.id,
      slugFr,
      slugEn,
      message: 'Recette publiée avec succès en français et anglais',
    });

  } catch (error) {
    console.error('Error publishing recipe:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la publication' },
      { status: 500 }
    );
  }
}
