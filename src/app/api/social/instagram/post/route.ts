import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const ACCESS_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;

interface InstagramPostRequest {
  recipeId?: number;
  recipeSlug?: string;
  imageUrl: string;
  caption: string;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication (admin only)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!INSTAGRAM_ACCOUNT_ID || !ACCESS_TOKEN) {
      return NextResponse.json(
        { error: 'Instagram API not configured. Add INSTAGRAM_BUSINESS_ACCOUNT_ID and INSTAGRAM_ACCESS_TOKEN to .env.local' },
        { status: 500 }
      );
    }

    const body: InstagramPostRequest = await request.json();
    const { imageUrl, caption } = body;

    if (!imageUrl || !caption) {
      return NextResponse.json(
        { error: 'imageUrl and caption are required' },
        { status: 400 }
      );
    }

    // Step 1: Create media container
    const createMediaUrl = `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media`;
    const createResponse = await fetch(createMediaUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption,
        access_token: ACCESS_TOKEN,
      }),
    });

    const createData = await createResponse.json();

    if (createData.error) {
      console.error('Instagram create media error:', createData.error);
      return NextResponse.json(
        { error: createData.error.message },
        { status: 400 }
      );
    }

    const containerId = createData.id;

    // Step 2: Wait for media to be ready (Instagram processes the image)
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Step 3: Publish the media
    const publishUrl = `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media_publish`;
    const publishResponse = await fetch(publishUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        creation_id: containerId,
        access_token: ACCESS_TOKEN,
      }),
    });

    const publishData = await publishResponse.json();

    if (publishData.error) {
      console.error('Instagram publish error:', publishData.error);
      return NextResponse.json(
        { error: publishData.error.message },
        { status: 400 }
      );
    }

    // Log the post
    await supabase.from('social_posts').insert({
      platform: 'instagram',
      post_id: publishData.id,
      recipe_id: body.recipeId || null,
      recipe_slug: body.recipeSlug || null,
      caption: caption,
      image_url: imageUrl,
      posted_at: new Date().toISOString(),
    } as never);

    return NextResponse.json({
      success: true,
      postId: publishData.id,
      message: 'Successfully posted to Instagram',
    });

  } catch (error) {
    console.error('Instagram post error:', error);
    return NextResponse.json(
      { error: 'Failed to post to Instagram' },
      { status: 500 }
    );
  }
}

interface RecipeForInstagram {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  introduction: string | null;
  pinterest_image: string | null;
  featured_image: string | null;
}

// Helper endpoint to generate caption for a recipe
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (!slug) {
    return NextResponse.json({ error: 'slug parameter required' }, { status: 400 });
  }

  const supabase = await createClient();

  const { data } = await supabase
    .from('recipes')
    .select('id, slug, title, excerpt, introduction, pinterest_image, featured_image')
    .eq('slug', slug)
    .single();

  const recipe = data as RecipeForInstagram | null;

  if (!recipe) {
    return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
  }

  // Generate caption
  const caption = generateInstagramCaption(recipe);

  // Use Pinterest image if available, otherwise featured image
  const imageUrl = recipe.pinterest_image || recipe.featured_image;

  return NextResponse.json({
    recipeId: recipe.id,
    recipeSlug: recipe.slug,
    title: recipe.title,
    imageUrl,
    caption,
    previewCaption: caption.substring(0, 200) + '...',
  });
}

function generateInstagramCaption(recipe: {
  title: string;
  excerpt?: string | null;
  introduction?: string | null;
}): string {
  // Clean introduction (remove HTML tags)
  const cleanIntro = (recipe.introduction || recipe.excerpt || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\n\n+/g, '\n\n')
    .trim();

  // Take first 2-3 sentences
  const introSentences = cleanIntro.split(/[.!?]+/).slice(0, 3).join('. ').trim();
  const intro = introSentences.length > 300
    ? introSentences.substring(0, 297) + '...'
    : introSentences + '.';

  // Generate hashtags based on title
  const hashtags = generateHashtags(recipe.title);

  return `🍽️ ${recipe.title}

${intro}

📖 Recette complète sur menucochon.com (lien en bio)

${hashtags}`;
}

function generateHashtags(title: string): string {
  const baseHashtags = [
    '#recette',
    '#cuisine',
    '#québec',
    '#foodie',
    '#homemade',
    '#delicious',
    '#instafood',
    '#foodphotography',
    '#menucochon',
  ];

  // Add specific hashtags based on title keywords
  const titleLower = title.toLowerCase();
  const specificHashtags: string[] = [];

  if (titleLower.includes('poulet') || titleLower.includes('chicken')) {
    specificHashtags.push('#poulet', '#chicken');
  }
  if (titleLower.includes('soupe') || titleLower.includes('soup')) {
    specificHashtags.push('#soupe', '#soup', '#comfortfood');
  }
  if (titleLower.includes('pain') || titleLower.includes('bread')) {
    specificHashtags.push('#pain', '#bread', '#baking', '#homemadebread');
  }
  if (titleLower.includes('jambon') || titleLower.includes('ham')) {
    specificHashtags.push('#jambon', '#ham');
  }
  if (titleLower.includes('bière') || titleLower.includes('beer')) {
    specificHashtags.push('#bière', '#cookingwithbeer');
  }
  if (titleLower.includes('dessert') || titleLower.includes('gâteau') || titleLower.includes('cake')) {
    specificHashtags.push('#dessert', '#patisserie', '#baking');
  }

  const allHashtags = [...specificHashtags, ...baseHashtags].slice(0, 15);
  return allHashtags.join(' ');
}
