import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CM en Pied ⚡ Convertisseur GRATUIT | 180 cm = 5\'11"',
  description:
    '✓ Convertir cm en pied instantanément! 180 cm = 5\'11", 170 cm = 5\'7", 160 cm = 5\'3". Tableau cm en pieds et pouces + calculateur gratuit.',
  alternates: {
    canonical: '/convertisseur/centimetre-pied/',
  },
  openGraph: {
    title: 'Convertir CM en Pieds ⚡ Calculateur + Tableau Tailles',
    description: '✅ Conversion cm ↔ pieds instantanée. Tableau tailles humaines + formules. 100% gratuit!',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Convertir CM en Pieds - Calculateur Gratuit',
    description: 'Conversion cm ↔ pieds avec tableau des tailles humaines.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
