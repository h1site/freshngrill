import type { Metadata } from 'next';
import Script from 'next/script';
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
    default: "Fresh N' Grill | BBQ Recipes & Grilling Tips",
    template: "%s | Fresh N' Grill",
  },
  description: siteConfig.description,
  keywords: ['bbq recipes', 'grilling', 'barbecue', 'outdoor cooking', 'grill tips', 'smoking meat'],
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: '/icon.svg',
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
    'max-image-preview': 'large',
  },
  alternates: {
    types: {
      'application/rss+xml': '/rss/recipes',
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-PLMYVL094V" strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PLMYVL094V');`}
      </Script>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        <ScrollToTop />
        <Header />
        {/* Spacer for fixed header */}
        <div className="h-20 md:h-24" />
        {children}
        <Footer />
      </body>
    </html>
  );
}
