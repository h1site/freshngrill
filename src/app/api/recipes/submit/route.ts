import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

const translations = {
  fr: {
    nameRequired: 'Nom requis (minimum 2 caractères)',
    emailRequired: 'Email requis',
    emailInvalid: 'Email invalide',
    recipeNameRequired: 'Nom de la recette requis',
    descriptionRequired: 'Description requise (minimum 10 caractères)',
    ingredientsRequired: 'Ingrédients requis',
    instructionsRequired: 'Instructions requises',
    successMessage: 'Votre recette a été soumise avec succès! Notre équipe l\'examinera bientôt.',
    serverError: 'Erreur serveur',
  },
  en: {
    nameRequired: 'Name required (minimum 2 characters)',
    emailRequired: 'Email required',
    emailInvalid: 'Invalid email',
    recipeNameRequired: 'Recipe name required',
    descriptionRequired: 'Description required (minimum 10 characters)',
    ingredientsRequired: 'Ingredients required',
    instructionsRequired: 'Instructions required',
    successMessage: 'Your recipe has been submitted successfully! Our team will review it soon.',
    serverError: 'Server error',
  },
};

export async function POST(request: Request) {
  const supabase = createAdminClient();

  try {
    const body = await request.json();
    const {
      name,
      email,
      profileImage,
      recipeName,
      description,
      ingredients,
      instructions,
      prepTime,
      cookTime,
      servings,
      category,
      recipeImage,
      newsletterOptIn,
      memberOptIn,
      locale = 'fr',
    } = body;

    const t = translations[locale as keyof typeof translations] || translations.fr;

    // Validation des champs requis
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ error: t.nameRequired }, { status: 400 });
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: t.emailRequired }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: t.emailInvalid }, { status: 400 });
    }

    if (!recipeName || typeof recipeName !== 'string' || recipeName.trim().length < 2) {
      return NextResponse.json({ error: t.recipeNameRequired }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json({ error: t.descriptionRequired }, { status: 400 });
    }

    if (!ingredients || typeof ingredients !== 'string' || ingredients.trim().length < 5) {
      return NextResponse.json({ error: t.ingredientsRequired }, { status: 400 });
    }

    if (!instructions || typeof instructions !== 'string' || instructions.trim().length < 10) {
      return NextResponse.json({ error: t.instructionsRequired }, { status: 400 });
    }

    // Récupérer les headers pour le tracking
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent');

    // Insérer la soumission dans la base de données
    const { error: insertError } = await supabase
      .from('recipe_submissions' as never)
      .insert({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        profile_image: profileImage || null,
        recipe_name: recipeName.trim(),
        description: description.trim(),
        ingredients: ingredients.trim(),
        instructions: instructions.trim(),
        prep_time: prepTime ? parseInt(prepTime) : null,
        cook_time: cookTime ? parseInt(cookTime) : null,
        servings: servings?.trim() || null,
        category: category || null,
        recipe_image: recipeImage || null,
        newsletter_opt_in: !!newsletterOptIn,
        member_opt_in: !!memberOptIn,
        locale,
        ip_address: ipAddress,
        user_agent: userAgent,
        status: 'pending',
      } as never);

    if (insertError) {
      console.error('Erreur insertion soumission recette:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: t.serverError },
        { status: 500 }
      );
    }

    // Si l'utilisateur veut s'inscrire à la newsletter
    if (newsletterOptIn) {
      try {
        // Appeler l'API newsletter existante
        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/newsletter/subscribe`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            locale,
          }),
        });
      } catch (newsletterError) {
        // Log but don't fail the submission
        console.error('Erreur inscription newsletter:', newsletterError);
      }
    }

    return NextResponse.json({
      success: true,
      message: t.successMessage,
      redirectToRegister: memberOptIn,
    });

  } catch (error) {
    console.error('Erreur API recipe submit:', error);
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    );
  }
}
