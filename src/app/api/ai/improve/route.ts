import { NextRequest, NextResponse } from 'next/server';
import {
  improveRecipeDescription,
  generateRecipeIntro,
  generateRecipeConclusion,
  generateRecipeFAQ,
  improveRecipeStep,
  isOllamaAvailable,
} from '@/lib/ollama';

export async function POST(request: NextRequest) {
  try {
    // Vérifier si Ollama est disponible
    const available = await isOllamaAvailable();
    if (!available) {
      return NextResponse.json(
        { error: 'Ollama non disponible. Assurez-vous qu\'il est démarré.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const { type, ...params } = body;

    let result: unknown;

    switch (type) {
      case 'description':
        result = await improveRecipeDescription(params.title, params.description);
        break;

      case 'intro':
        result = await generateRecipeIntro(
          params.title,
          params.ingredients,
          params.prepTime,
          params.cookTime
        );
        break;

      case 'conclusion':
        result = await generateRecipeConclusion(params.title, params.category);
        break;

      case 'faq':
        result = await generateRecipeFAQ(params.title, params.ingredients);
        break;

      case 'step':
        result = await improveRecipeStep(params.content, params.title);
        break;

      default:
        return NextResponse.json(
          { error: 'Type non supporté' },
          { status: 400 }
        );
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error('Erreur API AI:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la génération' },
      { status: 500 }
    );
  }
}
