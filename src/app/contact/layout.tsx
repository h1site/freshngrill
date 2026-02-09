import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact | Menucochon',
  description:
    'Contactez-nous pour toute question, suggestion ou partenariat. Nous sommes là pour vous aider.',
  keywords: [
    'contact menucochon',
    'nous contacter',
    'question recette',
    'suggestion recette',
    'partenariat culinaire',
    'collaboration',
  ],
  alternates: {
    canonical: '/contact/',
    languages: {
      'fr-CA': '/contact/',
      'en-CA': '/en/contact/',
      'x-default': '/contact/',
    },
  },
  openGraph: {
    title: 'Contact | Menucochon',
    description:
      'Contactez-nous pour toute question, suggestion ou partenariat. Nous sommes là pour vous aider.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact | Menucochon',
    description:
      'Contactez-nous pour toute question, suggestion ou partenariat.',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
