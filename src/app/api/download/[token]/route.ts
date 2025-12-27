import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const supabase = createAdminClient();

  // Trouver l'item de commande
  const { data: orderItem, error } = await supabase
    .from('order_items' as never)
    .select(
      `
      *,
      product:products(digital_file_url, download_limit),
      order:orders(status, payment_status)
    `
    )
    .eq('download_token', token)
    .single() as { data: Record<string, unknown> | null; error: Error | null };

  if (error || !orderItem) {
    return NextResponse.json({ error: 'Lien invalide' }, { status: 404 });
  }

  // Type assertions for nested data
  const orderData = orderItem.order as { status: string; payment_status: string } | null;
  const productData = orderItem.product as { digital_file_url: string; download_limit: number } | null;

  // Vérifier le paiement
  if (orderData?.payment_status !== 'paid') {
    return NextResponse.json(
      { error: 'Paiement non confirmé' },
      { status: 403 }
    );
  }

  // Vérifier expiration
  const downloadExpiresAt = orderItem.download_expires_at as string | null;
  const downloadCount = (orderItem.download_count as number) || 0;
  const itemId = orderItem.id as number;

  if (downloadExpiresAt && new Date(downloadExpiresAt) < new Date()) {
    return NextResponse.json({ error: 'Lien expiré' }, { status: 410 });
  }

  // Vérifier limite de téléchargements
  const downloadLimit = productData?.download_limit || 3;
  if (downloadCount >= downloadLimit) {
    return NextResponse.json(
      { error: 'Limite de téléchargements atteinte' },
      { status: 403 }
    );
  }

  // Incrémenter le compteur
  await supabase
    .from('order_items' as never)
    .update({ download_count: downloadCount + 1 } as never)
    .eq('id', itemId);

  // Rediriger vers le fichier (Supabase Storage signed URL)
  const fileUrl = productData?.digital_file_url;
  if (!fileUrl) {
    return NextResponse.json({ error: 'Fichier non trouvé' }, { status: 404 });
  }

  // Si c'est une URL Supabase Storage, créer un signed URL
  if (fileUrl.includes('supabase')) {
    const path = fileUrl.split('/storage/v1/object/public/')[1];
    if (path) {
      const { data: signedUrl } = await supabase.storage
        .from('downloads')
        .createSignedUrl(path.replace('downloads/', ''), 60); // 60 secondes

      if (signedUrl?.signedUrl) {
        return NextResponse.redirect(signedUrl.signedUrl);
      }
    }
  }

  return NextResponse.redirect(fileUrl);
}
