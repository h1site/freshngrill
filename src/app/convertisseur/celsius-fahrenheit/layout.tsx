import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Celsius en Fahrenheit - Outil Gratuit | Menucochon',
  description:
    'Convertissez facilement les températures entre Celsius et Fahrenheit. Formules, tableaux de conversion et outil interactif gratuit.',
  keywords: [
    'celsius fahrenheit',
    'convertir température',
    'conversion celsius',
    'fahrenheit celsius',
    'température four',
    'calculateur température',
  ],
  alternates: {
    canonical: '/convertisseur/celsius-fahrenheit/',
  },
  openGraph: {
    title: 'Conversion Celsius en Fahrenheit - Outil Gratuit | Menucochon',
    description:
      'Convertissez facilement les températures entre Celsius et Fahrenheit.',
    siteName: 'Menucochon',
    locale: 'fr_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Conversion Celsius en Fahrenheit | Menucochon',
    description: 'Outil gratuit pour convertir les températures.',
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
