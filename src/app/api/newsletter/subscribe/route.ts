import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, locale = 'fr' } = body;

    // Validation de l'email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email requis' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email invalide' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Récupérer les headers pour le tracking
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent');

    // Vérifier si l'email existe déjà
    const { data: existing } = await supabase
      .from('newsletter_subscribers' as never)
      .select('id, is_active')
      .eq('email', normalizedEmail)
      .single();

    const existingData = existing as { id: number; is_active: boolean } | null;

    if (existingData) {
      // Si l'email existe mais est désabonné, le réactiver
      if (!existingData.is_active) {
        const { error: updateError } = await supabase
          .from('newsletter_subscribers' as never)
          .update({
            is_active: true,
            unsubscribed_at: null,
            locale,
          } as never)
          .eq('id', existingData.id);

        if (updateError) {
          console.error('Erreur réactivation newsletter:', updateError);
          return NextResponse.json(
            { error: 'Erreur lors de la réactivation' },
            { status: 500 }
          );
        }

        return NextResponse.json({
          success: true,
          message: locale === 'en' ? 'Welcome back! Your subscription has been reactivated.' : 'Bon retour! Votre abonnement a été réactivé.',
          reactivated: true,
        });
      }

      // Déjà abonné
      return NextResponse.json({
        success: true,
        message: locale === 'en' ? 'You are already subscribed!' : 'Vous êtes déjà abonné!',
        alreadySubscribed: true,
      });
    }

    // Nouvel abonné
    const { error: insertError } = await supabase
      .from('newsletter_subscribers' as never)
      .insert({
        email: normalizedEmail,
        locale,
        ip_address: ipAddress,
        user_agent: userAgent,
        source: 'website',
      } as never);

    if (insertError) {
      console.error('Erreur inscription newsletter:', insertError);

      // Gérer l'erreur de doublon (au cas où)
      if (insertError.code === '23505') {
        return NextResponse.json({
          success: true,
          message: locale === 'en' ? 'You are already subscribed!' : 'Vous êtes déjà abonné!',
          alreadySubscribed: true,
        });
      }

      return NextResponse.json(
        { error: 'Erreur lors de l\'inscription' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: locale === 'en' ? 'Thank you for subscribing!' : 'Merci pour votre inscription!',
    });

  } catch (error) {
    console.error('Erreur API newsletter:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
