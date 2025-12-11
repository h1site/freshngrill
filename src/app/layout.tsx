import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import { siteConfig } from '@/lib/config';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Menu Cochon | Recettes gourmandes',
    template: '%s | Menu Cochon',
  },
  description: siteConfig.description,
  keywords: ['recettes', 'cuisine', 'repas', 'plats', 'desserts', 'québec'],
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: '/images/logos/favicon.ico',
    shortcut: '/images/logos/favicon.ico',
  },
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8781698761921917"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <ScrollToTop />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
