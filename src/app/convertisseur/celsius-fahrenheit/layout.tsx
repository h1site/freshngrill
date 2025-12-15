import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Celsius en Fahrenheit - Outil Gratuit | Menucochon',
  description:
    'Convertissez facilement les températures entre Celsius et Fahrenheit. Formules, tableaux de conversion et outil interactif gratuit.',
  alternates: {
    canonical: '/convertisseur/celsius-fahrenheit/',
  },
  openGraph: {
    title: 'Conversion Celsius en Fahrenheit',
    description: 'Outil gratuit pour convertir les températures Celsius/Fahrenheit',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
