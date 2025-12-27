import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online Timer | Menucochon',
  description:
    'Free online timer for cooking. Time your cooking with precision. Simple interface, automatic sound alert, preset times.',
  keywords: [
    'cooking timer',
    'online timer',
    'kitchen timer',
    'free timer',
    'cooking time',
    'countdown timer',
  ],
  alternates: {
    canonical: '/en/converter/timer/',
    languages: {
      'fr-CA': '/convertisseur/minuterie/',
      'en-CA': '/en/converter/timer/',
    },
  },
  openGraph: {
    title: 'Free Online Timer | Menucochon',
    description:
      'Free online timer for cooking. Automatic sound alert.',
    siteName: 'Menucochon',
    locale: 'en_CA',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Free Online Timer | Menucochon',
    description: 'Free timer to time your cooking.',
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
