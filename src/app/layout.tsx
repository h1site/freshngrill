import type { Metadata } from 'next';
import { Inter, Bebas_Neue } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ScrollToTop from '@/components/layout/ScrollToTop';
import MobileRadioBar from '@/components/KracRadio/MobileRadioBar';
import { siteConfig } from '@/lib/config';
import { headers } from 'next/headers';
import { getDictionary } from '@/i18n/getDictionary';
import { LocaleProvider } from '@/i18n/LocaleContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CartProvider } from '@/contexts/CartContext';
import type { Locale } from '@/i18n/config';

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
    default: 'Menucochon | Recettes gourmandes',
    template: '%s | Menucochon',
  },
  description: siteConfig.description,
  keywords: ['recettes', 'cuisine', 'repas', 'plats', 'desserts', 'québec'],
  authors: [{ name: siteConfig.author }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    type: 'website',
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: siteConfig.url,
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Menucochon - Recettes gourmandes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Menucochon | Recettes gourmandes',
    description: siteConfig.description,
    images: ['/images/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
  },
  alternates: {
    canonical: '/',
    types: {
      'application/rss+xml': [
        { url: '/rss/recettes', title: 'Menucochon - Recettes RSS' },
        { url: '/rss/blog', title: 'Menucochon - Blog RSS' },
      ],
    },
  },
  other: {
    'ai-content-declaration': 'human-created',
    'llms-txt': 'https://menucochon.com/llms.txt',
    'p:domain_verify': '98ff89abeccd0f675a4b1b4659901aab',
  },
};

// Force dynamic rendering to ensure headers() returns fresh values on each request
export const dynamic = 'force-dynamic';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Detect locale from header (set by middleware)
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '';

  // Detect locale from pathname
  const locale: Locale = pathname.startsWith('/en') ? 'en' : 'fr';

  // Transparent header for homepage only
  // Check for root or /en with optional trailing slash
  const isHomepage = pathname === '/' || /^\/en\/?$/.test(pathname);

  // Get dictionaries for BOTH locales - we pass FR to server but client components will use the right one
  const dictionary = await getDictionary(locale);

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${bebasNeue.variable} font-sans antialiased`}>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KSP0R9W4MP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-KSP0R9W4MP');
          `}
        </Script>
        {/* Google AdSense */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8781698761921917"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <LocaleProvider locale={locale} dictionary={dictionary}>
          <LanguageProvider>
            <CartProvider>
              <ScrollToTop />
              <Header locale={locale} dictionary={dictionary} transparent={isHomepage} />
              {/* Spacer for fixed header on non-homepage pages */}
              {!isHomepage && <div className="h-14 md:h-16" />}
              {children}
              <Footer locale={locale} dictionary={dictionary} />
              <MobileRadioBar locale={locale} />
            </CartProvider>
          </LanguageProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
