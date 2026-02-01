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

function loadBebasNeue(): ArrayBuffer {
  if (cachedFont) return cachedFont;

  // Read font from public folder
  const fontPath = join(process.cwd(), 'public', 'fonts', 'BebasNeue-Regular.ttf');
  const fontBuffer = readFileSync(fontPath);
  cachedFont = fontBuffer.buffer.slice(fontBuffer.byteOffset, fontBuffer.byteOffset + fontBuffer.byteLength);
  return cachedFont;
}

// Helper function to split title into two lines
function splitTitle(title: string): { line1: string; line2: string } {
  const upperTitle = title.toUpperCase();

  // Common patterns for splitting
  const patterns = [
    /^(.+?)\s+(À LA|AU|AUX|DE|DU|DES|ET|&)\s+(.+)$/i,
    /^(.+?)\s+(WITH|AND|&)\s+(.+)$/i,
  ];

  for (const pattern of patterns) {
    const match = upperTitle.match(pattern);
    if (match) {
      return {
        line1: match[1].trim(),
        line2: `${match[2]} ${match[3]}`.trim(),
      };
    }
  }

  // If no pattern matches, split roughly in half by words
  const words = upperTitle.split(' ');
  if (words.length >= 2) {
    const mid = Math.ceil(words.length / 2);
    return {
      line1: words.slice(0, mid).join(' '),
      line2: words.slice(mid).join(' '),
    };
  }

  return { line1: upperTitle, line2: '' };
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

  // Load Bebas Neue font (cached after first load)
  const fontData = loadBebasNeue();

  // Split title for display
  const titleParts = splitTitle(recipe.title);
  const domain = 'menucochon.com';

  // Calculate font size based on total title length
  const totalLength = titleParts.line1.length + titleParts.line2.length;
  const titleFontSize = totalLength > 30 ? 56 : totalLength > 20 ? 68 : 80;

  // Generate text overlay using satori with JSX - Modern Pinterest style
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
      {/* Center white transparent banner with title */}
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
        {/* Full-width white transparent banner */}
        <div
          style={{
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '50px 40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* 5 Stars */}
          <div
            style={{
              color: '#FF6B35',
              fontSize: 36,
              letterSpacing: 8,
              marginBottom: 20,
            }}
          >
            ★ ★ ★ ★ ★
          </div>

          {/* Orange accent line */}
          <div
            style={{
              width: 180,
              height: 4,
              backgroundColor: '#FF6B35',
              marginBottom: 24,
            }}
          />

          {/* Title line 1 */}
          <div
            style={{
              color: '#1a1a1a',
              fontSize: titleFontSize,
              fontFamily: 'Bebas Neue',
              textAlign: 'center',
              lineHeight: 1.1,
              letterSpacing: 3,
              textTransform: 'uppercase',
            }}
          >
            {titleParts.line1}
          </div>

          {/* Title line 2 */}
          {titleParts.line2 && (
            <div
              style={{
                color: '#1a1a1a',
                fontSize: titleFontSize,
                fontFamily: 'Bebas Neue',
                textAlign: 'center',
                lineHeight: 1.1,
                letterSpacing: 3,
                textTransform: 'uppercase',
                marginTop: 8,
              }}
            >
              {titleParts.line2}
            </div>
          )}
        </div>
      </div>

      {/* Bottom dark orange banner with domain */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#D4541E',
          padding: '28px 40px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            color: 'white',
            fontSize: 32,
            fontFamily: 'Bebas Neue',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          {domain}
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
          weight: 400,
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

// Recipe type for this API
interface RecipeData {
  id: number;
  slug: string;
  title: string;
  featured_image: string | null;
  pinterest_image: string | null;
  difficulty?: string | null;
  total_time?: number | null;
}

// GET: List all recipes and their Pinterest image status
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    // Get all recipes with their Pinterest status
    const { data, error } = await publicSupabase
      .from('recipes')
      .select('id, slug, title, featured_image, pinterest_image')
      .order('title');

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const recipes = data as RecipeData[] | null;

    const stats = {
      total: recipes?.length || 0,
      withPinterest: recipes?.filter(r => r.pinterest_image).length || 0,
      withoutPinterest: recipes?.filter(r => !r.pinterest_image && r.featured_image).length || 0,
      noFeaturedImage: recipes?.filter(r => !r.featured_image).length || 0,
    };

    return NextResponse.json({
      stats,
      recipes: recipes?.map(r => ({
        id: r.id,
        slug: r.slug,
        title: r.title,
        hasFeaturedImage: !!r.featured_image,
        hasPinterestImage: !!r.pinterest_image,
        pinterestImageUrl: r.pinterest_image || null,
      })),
    });
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST: Generate Pinterest images for recipes
export async function POST(request: NextRequest) {
  console.log('=== Pinterest Batch POST Started ===');
  try {
    const supabase = await createClient();
    const adminClient = createAdminClient();

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser();
    console.log('User authenticated:', user?.email);
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await request.json();
    const { recipeIds, overwrite = false } = body;
    console.log('Request body:', { recipeIds, overwrite });

    // Get recipes to process
    let query = publicSupabase
      .from('recipes')
      .select('id, slug, title, featured_image, pinterest_image, difficulty, total_time');

    if (recipeIds && recipeIds.length > 0) {
      query = query.in('id', recipeIds);
    }

    const { data, error } = await query;
    console.log('Query result:', { count: data?.length, error: error?.message });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const recipes = data as RecipeData[] | null;
    console.log('Recipes found:', recipes?.map(r => ({ id: r.id, slug: r.slug, hasFeatured: !!r.featured_image, hasPinterest: !!r.pinterest_image })));

    if (!recipes || recipes.length === 0) {
      return NextResponse.json({ error: 'Aucune recette trouvée' }, { status: 404 });
    }

    // Filter recipes that need processing
    const recipesToProcess = recipes.filter(r => {
      if (!r.featured_image) return false;
      if (overwrite) return true;
      return !r.pinterest_image;
    });
    console.log('Recipes to process:', recipesToProcess.length, recipesToProcess.map(r => r.slug));

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
        // Generate the Pinterest image
        console.log(`  Generating image for: ${recipe.title}`);
        console.log(`  Featured image URL: ${recipe.featured_image}`);
        const imageBuffer = await generatePinterestImage({
          title: recipe.title,
          featured_image: recipe.featured_image!,
        });
        console.log(`  Image generated, buffer size: ${imageBuffer.length} bytes`);

        // Generate unique filename
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 8);
        const fileName = `pinterest/${recipe.slug}-${timestamp}-${randomStr}.jpg`;
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

        // Update recipe with Pinterest image URL (using admin client)
        const { error: updateError } = await (adminClient
          .from('recipes') as any)
          .update({ pinterest_image: publicUrlData.publicUrl })
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
    console.log('=== Pinterest Batch Results ===', { success: results.success.length, failed: results.failed.length });

    return NextResponse.json({
      processed: recipesToProcess.length,
      success: results.success.length,
      failed: results.failed.length,
      results,
    });
  } catch (error) {
    console.error('Error in batch processing:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
