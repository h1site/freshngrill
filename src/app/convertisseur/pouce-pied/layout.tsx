import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pouce en Pied → Tableau COMPLET 1-120 po + Calculateur Instantané',
  description:
    '🔢 Tableau de conversion pouces en pieds de 1 à 120 po. Calculateur instantané + formule + tailles en pieds et pouces (TV, hauteur). Plus complet que Google!',
  alternates: {
    canonical: '/convertisseur/pouce-pied/',
    languages: {
      'fr-CA': '/convertisseur/pouce-pied/',
      'en-CA': '/en/converter/inch-feet/',
      'x-default': '/convertisseur/pouce-pied/',
    },
  },
  keywords: [
    'pouces en pieds',
    'tableau conversion pouces pieds',
    'calculer taille en pieds et pouces',
    '70 pouce en pied',
    '72 pouces en pieds',
    '52 pouces en pieds',
    '42 pouces en pieds',
    '68 pouce en pied',
    'conversion pouce pied',
    'taille ecran tv en pieds',
    'hauteur en pieds pouces',
  ],
  openGraph: {
    title: 'Pouce en Pied → Tableau Complet + Calculateur Gratuit',
    description:
      'Tableau de conversion 1-120 pouces en pieds. Calculateur instantané + formule + tailles TV et hauteurs.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pouce en Pied → Tableau + Calculateur',
    description:
      'Tableau complet 1-120 po en pieds. Calculateur instantané + formule + tailles TV.',
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

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
