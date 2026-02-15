import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function generateImage() {
  console.log('Generating Pinterest image for Beer-Can Chicken (1024x1792)...\n');

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: `A stunning, mouth-watering food photography shot of a beer-can chicken on a BBQ grill. The chicken is golden-brown and crispy with a beautiful spice crust, sitting upright on a beer can on a charcoal grill with light smoke rising. Shot from a slightly elevated angle. Rustic wooden table in the background with fresh herbs and a cold beer. Warm, natural lighting. Professional food photography style, high detail, appetizing. No text or watermarks.`,
    n: 1,
    size: '1024x1792', // Pinterest vertical ratio
    quality: 'hd',
  });

  const imageUrl = response.data?.[0]?.url;
  if (!imageUrl) { console.error('No image URL returned'); return; }
  console.log('Image generated! Downloading...');

  // Download the image
  const imageResponse = await fetch(imageUrl);
  const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());

  // Upload to Supabase storage
  const fileName = 'beer-can-chicken-pinterest.webp';
  const filePath = `beer-can-chicken/${fileName}`;

  console.log(`Uploading to Supabase storage (recipe-images/${filePath})...`);

  const { error: uploadError } = await supabase.storage
    .from('recipe-images')
    .upload(filePath, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    return;
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from('recipe-images')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;
  console.log(`Public URL: ${publicUrl}`);

  // Update recipe with images
  const { error: updateError } = await supabase
    .from('recipes')
    .update({
      featured_image: publicUrl,
      pinterest_image: publicUrl,
      pinterest_title: 'Classic Beer-Can Chicken with Spicy Dry Rub | Fresh N\' Grill',
      pinterest_description: 'The ultimate BBQ beer-can chicken recipe! Juicy, crispy, and packed with flavor from a homemade spicy dry rub. Perfect for your next cookout. #BBQ #BeerCanChicken #Grilling',
    })
    .eq('slug', 'beer-can-chicken');

  if (updateError) {
    console.error('Update error:', updateError);
    return;
  }

  console.log('\nRecipe updated with Pinterest image!');
  console.log('Done!');
}

generateImage().catch(console.error);
