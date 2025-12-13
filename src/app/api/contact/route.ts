import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase';

export async function POST(request: Request) {
  const supabase = createAdminClient();
  try {
    const body = await request.json();
    const { name, company, email, phone, subject, message } = body;

    // Validation des champs requis
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nom requis (minimum 2 caractères)' },
        { status: 400 }
      );
    }

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

    if (!subject || typeof subject !== 'string') {
      return NextResponse.json(
        { error: 'Sujet requis' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message requis (minimum 10 caractères)' },
        { status: 400 }
      );
    }

    // Récupérer les headers pour le tracking
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ipAddress = forwardedFor ? forwardedFor.split(',')[0].trim() : null;
    const userAgent = request.headers.get('user-agent');

    // Insérer le message dans la base de données
    const { error: insertError } = await supabase
      .from('contact_messages' as never)
      .insert({
        name: name.trim(),
        company: company?.trim() || null,
        email: email.toLowerCase().trim(),
        phone: phone?.trim() || null,
        subject: subject.trim(),
        message: message.trim(),
        ip_address: ipAddress,
        user_agent: userAgent,
      } as never);

    if (insertError) {
      console.error('Erreur insertion message contact:', JSON.stringify(insertError, null, 2));
      return NextResponse.json(
        { error: `Erreur: ${insertError.message || 'Erreur lors de l\'envoi du message'}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
    });

  } catch (error) {
    console.error('Erreur API contact:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
