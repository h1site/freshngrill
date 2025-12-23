import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');
const imagesDir = path.join(publicDir, 'images');

// OG Image dimensions
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// Generate OG images from SVG-like design as PNG
async function generateOGImages() {
  console.log('🖼️  Generating OG images...');

  // Create OG default image
  const ogDefault = await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 26, g: 26, b: 26, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(`
          <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
            <circle cx="600" cy="220" r="80" fill="#F77313"/>
            <text x="600" y="245" text-anchor="middle" fill="white" font-size="52" font-weight="bold" font-family="Arial, sans-serif">MC</text>
            <text x="600" y="380" text-anchor="middle" fill="white" font-size="72" font-weight="bold" font-family="Arial, sans-serif">Menucochon</text>
            <text x="600" y="460" text-anchor="middle" fill="#999999" font-size="36" font-family="Arial, sans-serif">Recettes gourmandes</text>
            <rect x="500" y="510" width="200" height="5" fill="#F77313"/>
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(path.join(imagesDir, 'og-default.png'));

  console.log('  ✅ og-default.png');

  // Create OG home image
  await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 20, g: 20, b: 20, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(`
          <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
            <circle cx="600" cy="200" r="90" fill="#F77313"/>
            <text x="600" y="230" text-anchor="middle" fill="white" font-size="58" font-weight="bold" font-family="Arial, sans-serif">MC</text>
            <text x="600" y="370" text-anchor="middle" fill="white" font-size="80" font-weight="bold" font-family="Arial, sans-serif">Menucochon</text>
            <text x="600" y="450" text-anchor="middle" fill="#aaaaaa" font-size="32" font-family="Arial, sans-serif">Vos recettes préférées, simplifiées</text>
            <rect x="480" y="500" width="240" height="6" fill="#F77313"/>
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(path.join(imagesDir, 'og-home.png'));

  console.log('  ✅ og-home.png');

  // Create OG recettes image
  await sharp({
    create: {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      channels: 4,
      background: { r: 15, g: 15, b: 15, alpha: 1 },
    },
  })
    .composite([
      {
        input: Buffer.from(`
          <svg width="${OG_WIDTH}" height="${OG_HEIGHT}">
            <text x="600" y="280" text-anchor="middle" fill="white" font-size="90" font-weight="bold" font-family="Arial, sans-serif">🍳</text>
            <text x="600" y="400" text-anchor="middle" fill="white" font-size="64" font-weight="bold" font-family="Arial, sans-serif">Nos Recettes</text>
            <text x="600" y="470" text-anchor="middle" fill="#888888" font-size="30" font-family="Arial, sans-serif">Menucochon - Recettes gourmandes</text>
            <rect x="520" y="520" width="160" height="5" fill="#F77313"/>
          </svg>
        `),
        top: 0,
        left: 0,
      },
    ])
    .png()
    .toFile(path.join(imagesDir, 'og-recettes.png'));

  console.log('  ✅ og-recettes.png');
}

// Generate favicons in multiple sizes
async function generateFavicons() {
  console.log('\n🎨 Generating favicons...');

  // Base favicon SVG (orange circle with MC)
  const faviconSvg = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" rx="80" fill="#F77313"/>
      <text x="256" y="320" text-anchor="middle" fill="white" font-size="220" font-weight="bold" font-family="Arial, sans-serif">MC</text>
    </svg>
  `;

  const sizes = [16, 32, 96, 192, 512];

  for (const size of sizes) {
    await sharp(Buffer.from(faviconSvg))
      .resize(size, size)
      .png()
      .toFile(path.join(publicDir, `favicon-${size}x${size}.png`));
    console.log(`  ✅ favicon-${size}x${size}.png`);
  }

  // Apple touch icon (180x180)
  await sharp(Buffer.from(faviconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('  ✅ apple-touch-icon.png');

  // Android chrome icons
  await sharp(Buffer.from(faviconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-192x192.png'));
  console.log('  ✅ android-chrome-192x192.png');

  await sharp(Buffer.from(faviconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'android-chrome-512x512.png'));
  console.log('  ✅ android-chrome-512x512.png');
}

// Generate web manifest
async function generateManifest() {
  console.log('\n📱 Generating web manifest...');

  const manifest = {
    name: 'Menucochon',
    short_name: 'Menucochon',
    description: 'Vos recettes préférées, simplifiées',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#F77313',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };

  fs.writeFileSync(
    path.join(publicDir, 'site.webmanifest'),
    JSON.stringify(manifest, null, 2)
  );
  console.log('  ✅ site.webmanifest');
}

async function main() {
  console.log('🚀 Generating SEO assets...\n');

  try {
    await generateOGImages();
    await generateFavicons();
    await generateManifest();
    console.log('\n✨ All assets generated successfully!');
  } catch (error) {
    console.error('❌ Error generating assets:', error);
    process.exit(1);
  }
}

main();
