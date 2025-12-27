import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dans mon frigo | Menucochon',
  description:
    'Sélectionnez les ingrédients que vous avez sous la main et découvrez les recettes que vous pouvez préparer avec.',
  keywords: [
    'recettes frigo',
    'cuisiner avec ingrédients',
    'recettes disponibles',
    'que cuisiner',
    'ingrédients maison',
    'recherche par ingrédient',
  ],
  alternates: {
    canonical: '/frigo/',
  },
  openGraph: {
    title: 'Dans mon frigo | Menucochon',
    description:
      'Sélectionnez les ingrédients que vous avez et découvrez les recettes possibles.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Dans mon frigo | Menucochon',
    description:
      'Trouvez des recettes avec les ingrédients que vous avez.',
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

export default function FrigoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
