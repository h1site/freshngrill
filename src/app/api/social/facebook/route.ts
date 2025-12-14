import { NextRequest, NextResponse } from 'next/server';

// Facebook Graph API endpoint
const FB_GRAPH_URL = 'https://graph.facebook.com/v18.0';

export async function POST(request: NextRequest) {
  try {
    const { message, imageUrl, link } = await request.json();

    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

    if (!pageId || !accessToken) {
      return NextResponse.json(
        { error: 'Configuration Facebook manquante. Ajoutez FACEBOOK_PAGE_ID et FACEBOOK_PAGE_ACCESS_TOKEN dans .env' },
        { status: 500 }
      );
    }

    let postData: Record<string, string> = {
      access_token: accessToken,
      message: message,
    };

    // Si on a une image, on fait un post avec photo
    if (imageUrl) {
      // Post avec photo
      const response = await fetch(`${FB_GRAPH_URL}/${pageId}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postData,
          url: imageUrl, // URL publique de l'image
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Facebook API Error:', data.error);
        return NextResponse.json(
          { error: data.error.message || 'Erreur Facebook API' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        postId: data.id,
        message: 'Photo publiée sur Facebook avec succès!',
      });
    } else {
      // Post texte simple avec lien
      if (link) {
        postData.link = link;
      }

      const response = await fetch(`${FB_GRAPH_URL}/${pageId}/feed`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Facebook API Error:', data.error);
        return NextResponse.json(
          { error: data.error.message || 'Erreur Facebook API' },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        postId: data.id,
        message: 'Publication Facebook créée avec succès!',
      });
    }
  } catch (error) {
    console.error('Erreur publication Facebook:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la publication' },
      { status: 500 }
    );
  }
}
