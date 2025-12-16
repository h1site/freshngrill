import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convertir Pouce en Pied ⚡ Calculateur Instantané (2025)',
  description:
    '✅ Convertissez pouces en pieds en 1 clic! 12 pouces = 1 pied. Tableau de conversion + formules + exemples pratiques. Outil 100% gratuit.',
  alternates: {
    canonical: '/convertisseur/pouce-pied/',
  },
  openGraph: {
    title: 'Convertir Pouce en Pied ⚡ Calculateur Instantané',
    description: '✅ Conversion instantanée pouces ↔ pieds. Tableau + formules + exemples. 100% gratuit!',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Convertir Pouce en Pied - Calculateur Gratuit',
    description: 'Conversion instantanée pouces ↔ pieds avec tableau et formules.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
