import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import sharp from 'sharp';

// Augmenter la limite de body pour Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Vérifier l'authentification
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
    }

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Utilisez JPG, PNG, WebP, GIF, AVIF ou HEIC.' },
        { status: 400 }
      );
    }

    // Limiter la taille (4MB after client compression - Vercel limit is 4.5MB)
    const maxSize = 4 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux après compression. Maximum 4MB.' },
        { status: 400 }
      );
    }

    // Convertir le fichier en ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const inputBuffer = Buffer.from(arrayBuffer);

    // Convertir en WebP avec sharp (optimisation automatique)
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

    // Générer un nom unique
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const fileName = `recipes/${timestamp}-${randomStr}.webp`;

    // Upload vers Supabase Storage (bucket recipe-images)
    const { data, error } = await supabase.storage
      .from('recipe-images')
      .upload(fileName, webpBuffer, {
        contentType: 'image/webp',
        cacheControl: '31536000', // 1 an
        upsert: false,
      });

    if (error) {
      console.error('Erreur upload Supabase:', error);
      return NextResponse.json(
        { error: `Erreur upload: ${error.message}` },
        { status: 500 }
      );
    }

    // Obtenir l'URL publique
    const { data: publicUrlData } = supabase.storage
      .from('recipe-images')
      .getPublicUrl(data.path);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    });
  } catch (error) {
    console.error('Erreur API upload:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de l\'upload' },
      { status: 500 }
    );
  }
}
