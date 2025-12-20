import sharp from 'sharp';
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Images à convertir avec leurs recettes et alt texts
const imageData = [
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/banana-bread-and-bananas-on-a-dark-background-top-2025-03-25-17-19-04-utc.jpg',
    recipeSlug: 'pain-aux-bananes-moelleux',
    altFr: 'Pain aux bananes moelleux tranché avec des bananes fraîches sur fond sombre',
    altEn: 'Moist sliced banana bread with fresh bananas on a dark background',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chicken-tikka-masala-2025-03-06-04-51-00-utc.jpg',
    recipeSlug: 'poulet-au-beurre-indien',
    altFr: 'Poulet au beurre indien (butter chicken) dans une sauce crémeuse aux tomates',
    altEn: 'Indian butter chicken in a creamy tomato sauce',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/chickpea-sauce-with-fresh-lemon-juice-sesame-seed-2025-02-18-12-45-53-utc.jpg',
    recipeSlug: 'soupe-aux-pois-traditionnelle',
    altFr: 'Soupe aux pois traditionnelle québécoise crémeuse et réconfortante',
    altEn: 'Traditional Quebec split pea soup, creamy and comforting',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/french-onion-soup-with-cheesy-bread-2024-09-13-22-12-03-utc.jpg',
    recipeSlug: 'soupe-a-loignon-gratinee',
    altFr: 'Soupe à l\'oignon gratinée française avec croûton de pain et fromage fondu',
    altEn: 'French onion soup gratinée with bread crouton and melted cheese',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/fresh-beef-tartar-with-tasty-vegetables-2024-12-05-18-48-04-utc.jpg',
    recipeSlug: 'tartare-de-boeuf-classique',
    altFr: 'Tartare de boeuf classique frais avec légumes et assaisonnements',
    altEn: 'Classic fresh beef tartare with vegetables and seasonings',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/pork-baked-with-vegetables-on-a-tray-2024-10-11-06-09-24-utc.JPG',
    recipeSlug: 'filets-de-porc-glaces-erable',
    altFr: 'Filets de porc glacés à l\'érable du Québec avec légumes rôtis',
    altEn: 'Quebec maple glazed pork tenderloin with roasted vegetables',
  },
  {
    originalUrl: 'https://cjbdgfcxewvxcojxbuab.supabase.co/storage/v1/object/public/recipe-images/spiced-carrot-cake-with-walnuts-and-cinnamon-2025-03-24-07-37-24-utc.jpg',
    recipeSlug: 'gateau-aux-carottes-meilleur',
    altFr: 'Gâteau aux carottes épicé avec noix et cannelle, glaçage au fromage à la crème',
    altEn: 'Spiced carrot cake with walnuts and cinnamon, cream cheese frosting',
  },
];

async function convertAndUpload() {
  console.log('🚀 Démarrage de la conversion des images en WebP...\n');

  for (const img of imageData) {
    try {
      console.log(`📥 Téléchargement: ${img.recipeSlug}`);

      // Télécharger l'image originale
      const response = await fetch(img.originalUrl);
      if (!response.ok) {
        throw new Error(`Erreur téléchargement: ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const inputBuffer = Buffer.from(arrayBuffer);

      console.log(`🔄 Conversion en WebP...`);

      // Convertir en WebP avec sharp
      const webpBuffer = await sharp(inputBuffer)
        .rotate() // Auto-rotate based on EXIF
        .webp({
          quality: 85,
          effort: 4,
        })
        .resize({
          width: 1200,
          height: 800,
          fit: 'cover',
          position: 'center',
          withoutEnlargement: true,
        })
        .toBuffer();

      // Nom du fichier WebP
      const timestamp = Date.now();
      const fileName = `recipes/${img.recipeSlug}-${timestamp}.webp`;

      console.log(`📤 Upload vers Supabase: ${fileName}`);

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('recipe-images')
        .upload(fileName, webpBuffer, {
          contentType: 'image/webp',
          cacheControl: '31536000',
          upsert: false,
        });

      if (uploadError) {
        throw new Error(`Erreur upload: ${uploadError.message}`);
      }

      // Obtenir l'URL publique
      const { data: publicUrlData } = supabase.storage
        .from('recipe-images')
        .getPublicUrl(uploadData.path);

      const newImageUrl = publicUrlData.publicUrl;
      console.log(`✅ Nouvelle URL: ${newImageUrl}`);

      // Mettre à jour la recette avec la nouvelle image et alt text FR
      const { error: updateError } = await supabase
        .from('recipes')
        .update({
          image_url: newImageUrl,
          image_alt: img.altFr,
        })
        .eq('slug', img.recipeSlug);

      if (updateError) {
        throw new Error(`Erreur update recipe: ${updateError.message}`);
      }

      console.log(`✅ Recette mise à jour: ${img.recipeSlug}`);

      // Mettre à jour la traduction anglaise avec alt text EN
      const { error: translationError } = await supabase
        .from('recipe_translations')
        .update({
          image_alt: img.altEn,
        })
        .eq('locale', 'en')
        .eq('recipe_id', (
          await supabase
            .from('recipes')
            .select('id')
            .eq('slug', img.recipeSlug)
            .single()
        ).data?.id);

      if (translationError) {
        console.log(`⚠️ Note: Pas de colonne image_alt dans recipe_translations ou erreur: ${translationError.message}`);
      }

      console.log(`\n`);

    } catch (error) {
      console.error(`❌ Erreur pour ${img.recipeSlug}:`, error);
    }
  }

  console.log('🎉 Conversion terminée!');
}

convertAndUpload();
