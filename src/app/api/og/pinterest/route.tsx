import { NextRequest, NextResponse } from 'next/server';
import sharp from 'sharp';
import { getRecipeBySlugWithLocale } from '@/lib/recipes';

const PINTEREST_WIDTH = 1000;
const PINTEREST_HEIGHT = 1500;

// Cache for 24 hours
export const revalidate = 86400;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const locale = searchParams.get('locale') || 'fr';

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    // Get recipe data
    const recipe = await getRecipeBySlugWithLocale(slug, locale as 'fr' | 'en');

    if (!recipe || !recipe.featuredImage) {
      return NextResponse.json({ error: 'Recipe not found' }, { status: 404 });
    }

    // Download the original image
    const imageResponse = await fetch(recipe.featuredImage);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
    }
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

    // Split title for display
    const titleParts = splitTitle(recipe.title);
    const subtitle = getSubtitle(recipe, locale as 'fr' | 'en');
    const domain = 'menucochon.com';

    const centerY = PINTEREST_HEIGHT / 2;

    // Create SVG overlay
    const svgOverlay = `
      <svg width="${PINTEREST_WIDTH}" height="${PINTEREST_HEIGHT}">
        <defs>
          <linearGradient id="centerGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style="stop-color:rgba(0,0,0,0.3)" />
            <stop offset="35%" style="stop-color:rgba(0,0,0,0.6)" />
            <stop offset="50%" style="stop-color:rgba(0,0,0,0.7)" />
            <stop offset="65%" style="stop-color:rgba(0,0,0,0.6)" />
            <stop offset="100%" style="stop-color:rgba(0,0,0,0.3)" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="${PINTEREST_WIDTH}" height="${PINTEREST_HEIGHT}" fill="url(#centerGradient)" />

        <!-- Domain at top -->
        <text x="${PINTEREST_WIDTH / 2}" y="80"
              font-family="Georgia, serif"
              font-size="32"
              font-weight="bold"
              fill="white"
              text-anchor="middle"
              letter-spacing="2"
              opacity="0.9">
          ${domain}
        </text>

        <!-- Main title -->
        <text x="${PINTEREST_WIDTH / 2}" y="${centerY - 30}"
              font-family="Georgia, serif"
              font-size="${titleParts.line1.length > 12 ? 90 : 110}"
              font-weight="bold"
              fill="white"
              text-anchor="middle"
              letter-spacing="3">
          ${escapeXml(titleParts.line1)}
        </text>

        <!-- Second line -->
        <text x="${PINTEREST_WIDTH / 2}" y="${centerY + 80}"
              font-family="Georgia, serif"
              font-size="${titleParts.line2.length > 12 ? 80 : 90}"
              font-weight="bold"
              fill="#FF6B35"
              text-anchor="middle"
              letter-spacing="3">
          ${escapeXml(titleParts.line2)}
        </text>

        <!-- Decorative line -->
        <rect x="${PINTEREST_WIDTH / 2 - 100}" y="${centerY + 130}"
              width="200" height="4"
              fill="#FF6B35" rx="2" />

        <!-- Subtitle -->
        <text x="${PINTEREST_WIDTH / 2}" y="${centerY + 180}"
              font-family="Arial, sans-serif"
              font-size="32"
              fill="white"
              text-anchor="middle"
              opacity="0.95">
          ${escapeXml(subtitle)}
        </text>
      </svg>
    `;

    // Process image
    const processedImage = await sharp(imageBuffer)
      .resize(PINTEREST_WIDTH, PINTEREST_HEIGHT, {
        fit: 'cover',
        position: 'center',
      })
      .composite([
        {
          input: Buffer.from(svgOverlay),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 85 })
      .toBuffer();

    return new NextResponse(new Uint8Array(processedImage), {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error generating Pinterest image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
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

// Helper function to get subtitle based on recipe properties
function getSubtitle(recipe: { difficulty?: string; totalTime?: number }, locale: 'fr' | 'en'): string {
  const difficulty = recipe.difficulty || 'facile';
  const time = recipe.totalTime || 30;

  const difficultyText: Record<string, Record<string, string>> = {
    fr: { facile: 'Facile', moyen: 'Moyen', difficile: 'Difficile' },
    en: { facile: 'Easy', moyen: 'Medium', difficile: 'Hard' },
  };

  const timeLabel = locale === 'fr' ? 'min' : 'min';

  return `${difficultyText[locale][difficulty] || difficulty} • ${time} ${timeLabel}`;
}

// Helper function to escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
