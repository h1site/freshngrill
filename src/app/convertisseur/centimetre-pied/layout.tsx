import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convertir CM en Pieds ⚡ Calculateur + Tableau Tailles (2025)',
  description:
    '✅ Convertissez centimètres en pieds instantanément! 170 cm = 5\'7". Tableau des tailles humaines + formules. Outil 100% gratuit.',
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
