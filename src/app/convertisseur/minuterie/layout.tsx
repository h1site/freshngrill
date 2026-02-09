import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Minuterie en Ligne Gratuite | Menucochon',
  description:
    'Minuterie en ligne gratuite pour la cuisine. Chronométrez vos cuissons avec précision. Interface simple, alerte sonore automatique, temps prédéfinis.',
  keywords: [
    'minuterie cuisine',
    'timer en ligne',
    'chronométrer cuisson',
    'minuterie gratuite',
    'temps cuisson',
    'compte à rebours',
  ],
  alternates: {
    canonical: '/convertisseur/minuterie/',
    languages: {
      'fr-CA': '/convertisseur/minuterie/',
      'en-CA': '/en/converter/timer/',
      'x-default': '/convertisseur/minuterie/',
    },
  },
  openGraph: {
    title: 'Minuterie en Ligne Gratuite | Menucochon',
    description:
      'Minuterie en ligne gratuite pour la cuisine. Alerte sonore automatique.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Minuterie en Ligne Gratuite | Menucochon',
    description: 'Minuterie gratuite pour chronométrer vos cuissons.',
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
