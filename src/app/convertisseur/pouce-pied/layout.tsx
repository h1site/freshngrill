import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Conversion Pouce en Pied - Calculateur Gratuit et Tableau',
  description:
    'Convertir pouces en pieds facilement: 12 pouces = 1 pied. Calculateur instantané, tableau de conversion complet et formule simple. Entrez vos valeurs!',
  alternates: {
    canonical: '/convertisseur/pouce-pied/',
  },
  openGraph: {
    title: 'Conversion Pouce en Pied - Calculateur Gratuit',
    description: 'Convertir pouces en pieds: 12 po = 1 pi. Calculateur instantané + tableau complet.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Conversion Pouce en Pied - Calculateur Gratuit',
    description: 'Convertir pouces en pieds: calculateur instantané et tableau de conversion.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
