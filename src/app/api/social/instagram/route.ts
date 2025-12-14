import { NextRequest, NextResponse } from 'next/server';

// Instagram Graph API (via Facebook)
const FB_GRAPH_URL = 'https://graph.facebook.com/v18.0';

export async function POST(request: NextRequest) {
  try {
    const { caption, imageUrl } = await request.json();

    const igAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN; // Même token que Facebook

    if (!igAccountId || !accessToken) {
      return NextResponse.json(
        { error: 'Configuration Instagram manquante. Ajoutez INSTAGRAM_BUSINESS_ACCOUNT_ID dans .env' },
        { status: 500 }
      );
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Une image est requise pour publier sur Instagram' },
        { status: 400 }
      );
    }

    // Étape 1: Créer le media container
    const containerResponse = await fetch(`${FB_GRAPH_URL}/${igAccountId}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        image_url: imageUrl, // Doit être une URL publique accessible
        caption: caption,
      }),
    });

    const containerData = await containerResponse.json();

    if (containerData.error) {
      console.error('Instagram Container Error:', containerData.error);
      return NextResponse.json(
        { error: containerData.error.message || 'Erreur création media Instagram' },
        { status: 400 }
      );
    }

    const containerId = containerData.id;

    // Attendre que le media soit prêt (Instagram traite l'image)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Étape 2: Publier le media
    const publishResponse = await fetch(`${FB_GRAPH_URL}/${igAccountId}/media_publish`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access_token: accessToken,
        creation_id: containerId,
      }),
    });

    const publishData = await publishResponse.json();

    if (publishData.error) {
      console.error('Instagram Publish Error:', publishData.error);
      return NextResponse.json(
        { error: publishData.error.message || 'Erreur publication Instagram' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      postId: publishData.id,
      message: 'Photo publiée sur Instagram avec succès!',
    });
  } catch (error) {
    console.error('Erreur publication Instagram:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la publication' },
      { status: 500 }
    );
  }
}
