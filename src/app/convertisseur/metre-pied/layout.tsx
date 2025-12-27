import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Mètre en Pieds - Outil Gratuit | Menucochon',
  description:
    'Convertissez facilement les mètres en pieds et vice-versa. 1 mètre = 3.28084 pieds. Formules, tableaux et outil interactif gratuit.',
  keywords: [
    'mètre pied',
    'convertir mètre',
    'conversion mètre pied',
    'pied mètre',
    'calculateur longueur',
    'système impérial',
  ],
  alternates: {
    canonical: '/convertisseur/metre-pied/',
  },
  openGraph: {
    title: 'Conversion Mètre en Pieds - Outil Gratuit | Menucochon',
    description:
      'Convertissez facilement les mètres en pieds. 1 mètre = 3.28084 pieds.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Conversion Mètre en Pieds | Menucochon',
    description: 'Outil gratuit pour convertir les mètres en pieds.',
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
