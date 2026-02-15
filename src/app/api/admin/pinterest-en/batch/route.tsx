import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import satori from 'satori';
import { createClient } from '@/lib/supabase-server';
import { supabase as publicSupabase, createAdminClient } from '@/lib/supabase';
import { readFileSync } from 'fs';
import { join } from 'path';

const PINTEREST_WIDTH = 1000;
const PINTEREST_HEIGHT = 1500;

// Load fonts for satori (needs TTF/OTF format - WOFF/WOFF2 not supported)
// Font is bundled in public/fonts for reliability
let cachedFont: ArrayBuffer | null = null;

function loadBebasNeueBold(): ArrayBuffer {
  if (cachedFont) return cachedFont;

  // Read Bold font from public folder
  const fontPath = join(process.cwd(), 'public', 'fonts', 'BebasNeue-Bold.otf');
  const fontBuffer = readFileSync(fontPath);
  cachedFont = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
  return cachedFont;
}

// Format title - keep original case
function formatTitle(title: string): string {
  return title;
}


// Generate Pinterest image for a recipe using satori
async function generatePinterestImage(recipe: {
  title: string;
  featured_image: string;
}): Promise<Buffer> {
  // Download the original image
  const imageResponse = await fetch(recipe.featured_image);
  if (!imageResponse.ok) {
    throw new Error(`Failed to fetch image: ${recipe.featured_image}`);
  }
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  // Load Bebas Neue Bold font (cached after first load)
  const fontData = loadBebasNeueBold();

  // Format title for display (single line, uppercase)
  const title = formatTitle(recipe.title);
  const domain = 'freshngrill.com';

  // Calculate font size based on title length (must fit on single line ~80 chars max)
  const titleFontSize =
    title.length > 70 ? 28 :
    title.length > 60 ? 32 :
    title.length > 50 ? 36 :
    title.length > 40 ? 42 :
    title.length > 30 ? 48 :
    title.length > 20 ? 56 :
    64;

  // Generate text overlay using satori with JSX - Exact Pinterest design
  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Center: Dark banner with title + green button below */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          right: 0,
          transform: 'translateY(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Dark blue banner with recipe title */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            padding: '35px 50px 45px 50px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: titleFontSize,
              fontFamily: 'Bebas Neue',
              textAlign: 'center',
              lineHeight: 1.15,
              letterSpacing: 1,
              maxWidth: '95%',
            }}
          >
            {title}
          </div>
        </div>

        {/* Green pill button with domain - overlapping bottom of banner */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#00bf63',
            padding: '12px 40px',
            borderRadius: 4,
            marginTop: -24,
          }}
        >
          <div
            style={{
              display: 'flex',
              color: 'white',
              fontSize: 26,
              fontFamily: 'Bebas Neue',
              letterSpacing: 1,
            }}
          >
            {domain}
          </div>
        </div>
      </div>
    </div>,
    {
      width: PINTEREST_WIDTH,
      height: PINTEREST_HEIGHT,
      fonts: [
        {
          name: 'Bebas Neue',
          data: fontData,
          weight: 700,
          style: 'normal',
        },
      ],
    }
  );

  // Convert SVG to PNG buffer using sharp
  const overlayBuffer = await sharp(Buffer.from(svg))
    .png()
    .toBuffer();

  // Process image: resize background and composite with text overlay
  const processedImage = await sharp(imageBuffer)
    .resize(PINTEREST_WIDTH, PINTEREST_HEIGHT, {
      fit: 'cover',
      position: 'center',
    })
    .composite([
      {
        input: overlayBuffer,
        top: 0,
        left: 0,
      },
    ])
    .jpeg({ quality: 85 })
    .toBuffer();

  return processedImage;
}

// Recipe type for this API with English translation
interface RecipeWithTranslation {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  pinterest_image_en: string | null;
  // English translation fields
  title_en: string | null;
  slug_en: string | null;
}

// GET: List all recipes and their English Pinterest image status
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all recipes with their English translations
    const { data, error } = await publicSupabase
      .from('recipes')
      .select(`
        id,
        slug,
        title,
        featured_image,
        pinterest_image_en,
        recipe_translations!left(title, slug_en, locale)
      `)
      .order('title');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform data to include English title
    const recipes = (data || []).map((r: any) => {
      // Find English translation
      const enTranslation = r.recipe_translations?.find((t: any) => t.locale === 'en');
      return {
        id: r.id,
        slug: r.slug,
        slugEn: enTranslation?.slug_en || null,
        title: r.title,
        titleEn: enTranslation?.title || null,
        hasFeaturedImage: !!r.featured_image,
        hasPinterestImageEn: !!r.pinterest_image_en,
        pinterestImageEnUrl: r.pinterest_image_en || null,
      };
    });

    const stats = {
      total: recipes.length,
      withPinterestEn: recipes.filter((r: any) => r.hasPinterestImageEn).length,
      withoutPinterestEn: recipes.filter((r: any) => !r.hasPinterestImageEn && r.hasFeaturedImage && r.titleEn).length,
      noFeaturedImage: recipes.filter((r: any) => !r.hasFeaturedImage).length,
      noEnglishTranslation: recipes.filter((r: any) => !r.titleEn).length,
    };

    return NextResponse.json({
      stats,
      recipes,
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST: Generate English Pinterest images for recipes
export async function POST(request: NextRequest) {
  console.log('=== Pinterest EN Batch POST Started ===');
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User authenticated:', user?.email);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { recipeIds, overwrite = false } = body;
    console.log('Request body:', { recipeIds, overwrite });

    // Get recipes with English translations to process
    let query = publicSupabase
      .from('recipes')
      .select(`
        id,
        slug,
        title,
        featured_image,
        pinterest_image_en,
        recipe_translations!left(title, slug_en, locale)
      `);

    if (recipeIds && recipeIds.length > 0) {
      query = query.in('id', recipeIds);
    }

    const { data, error } = await query;
    console.log('Query result:', { count: data?.length, error: error?.message });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'No recipes found' }, { status: 404 });
    }

    // Transform and filter recipes that need processing
    const recipesToProcess = data
      .map((r: any) => {
        const enTranslation = r.recipe_translations?.find((t: any) => t.locale === 'en');
        return {
          id: r.id,
          slug: r.slug,
          slug_en: enTranslation?.slug_en || null,
          title: r.title,
          title_en: enTranslation?.title || null,
          featured_image: r.featured_image,
          pinterest_image_en: r.pinterest_image_en,
        };
      })
      .filter((r: any) => {
        // Must have featured image and English title
        if (!r.featured_image || !r.title_en) return false;
        if (overwrite) return true;
        return !r.pinterest_image_en;
      });

    console.log('Recipes to process:', recipesToProcess.length, recipesToProcess.map((r: any) => r.slug));

    const results: {
      success: { id: number; slug: string; url: string }[];
      failed: { id: number; slug: string; error: string }[];
    } = {
      success: [],
      failed: [],
    };

    // Process each recipe
    for (const recipe of recipesToProcess) {
      console.log(`Processing recipe: ${recipe.slug} (ID: ${recipe.id})`);
      try {
        // Generate the Pinterest image with English title
        console.log(`  Generating image for: ${recipe.title_en}`);
        console.log(`  Featured image URL: ${recipe.featured_image}`);
        const imageBuffer = await generatePinterestImage({
          title: recipe.title_en!,
          featured_image: recipe.featured_image!,
        });
        console.log(`  Image generated, buffer size: ${imageBuffer.length} bytes`);

        // Generate unique filename with -en suffix
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `pinterest/${recipe.slug}-en-${timestamp}-${randomStr}.jpg`;
        console.log(`  Uploading to: ${fileName}`);

        // Upload to Supabase Storage (using admin client for proper permissions)
        const { data: uploadData, error: uploadError } = await adminClient.storage
          .from('recipe-images')
          .upload(fileName, imageBuffer, {
            contentType: 'image/jpeg',
            cacheControl: '31536000',
            upsert: true,
          });

        if (uploadError) {
          console.error(`  Upload error:`, uploadError);
          throw new Error(`Upload failed: ${uploadError.message}`);
        }
        console.log(`  Upload success:`, uploadData);

        // Get public URL
        const { data: publicUrlData } = adminClient.storage
          .from('recipe-images')
          .getPublicUrl(uploadData.path);
        console.log(`  Public URL:`, publicUrlData.publicUrl);

        // Update recipe with English Pinterest image URL (using admin client)
        const { error: updateError } = await (adminClient
          .from('recipes') as any)
          .update({ pinterest_image_en: publicUrlData.publicUrl })
          .eq('id', recipe.id);

        if (updateError) {
          console.error(`  Update error:`, updateError);
          throw new Error(`Database update failed: ${updateError.message}`);
        }
        console.log(`  Recipe updated successfully`);

        results.success.push({
          id: recipe.id,
          slug: recipe.slug,
          url: publicUrlData.publicUrl,
        });
      } catch (err) {
        console.error(`  Error processing ${recipe.slug}:`, err);
        results.failed.push({
          id: recipe.id,
          slug: recipe.slug,
          error: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }
    console.log('=== Pinterest EN Batch Results ===', { success: results.success.length, failed: results.failed.length });

    return NextResponse.json({
      processed: recipesToProcess.length,
      success: results.success.length,
      failed: results.failed.length,
      results,
    });
  } catch (error) {
    console.error('Error in batch processing:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
