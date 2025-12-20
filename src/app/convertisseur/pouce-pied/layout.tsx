import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pouce en Pied ⚡ Convertisseur GRATUIT + Tableau',
  description:
    '✓ Convertir pouce en pied instantanément! 72 po = 6 pi, 60 po = 5 pi, 48 po = 4 pi. Calculateur + tableau complet pouces en pieds. Conversion rapide po → pi.',
  alternates: {
    canonical: '/convertisseur/pouce-pied/',
  },
  keywords: ['pouces en pieds', '70 pouce en pied', '72 pouces en pieds', '52 pouces en pieds', '42 pouces en pieds', '68 pouce en pied', 'conversion pouce pied', 'calculateur pouces pieds'],
  openGraph: {
    title: 'Pouces en Pieds - Convertisseur Gratuit | 70, 72, 52 po → pi',
    description: '70 pouces = 5,83 pieds | 72 pouces = 6 pieds | 52 pouces = 4,33 pieds. Calculateur instantané + tableau complet.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pouces en Pieds - Convertisseur | 70, 72, 52 po → pi',
    description: '70 po = 5,83 pi | 72 po = 6 pi. Calculateur gratuit et tableau de conversion.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
