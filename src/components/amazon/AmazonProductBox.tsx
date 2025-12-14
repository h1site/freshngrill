'use client';

import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

const AMAZON_STORE_ID = 'h1site0d-20';

interface AmazonProduct {
  asin: string; // Amazon Standard Identification Number
  title: string;
  image: string;
  price?: string;
}

interface AmazonProductBoxProps {
  products: AmazonProduct[];
  title?: string;
  locale?: 'fr' | 'en';
}

const translations = {
  fr: {
    title: 'Nos recommandations',
    buyOn: 'Voir sur Amazon',
    affiliate: 'En tant que Partenaire Amazon, nous réalisons un bénéfice sur les achats remplissant les conditions requises.',
  },
  en: {
    title: 'Our recommendations',
    buyOn: 'View on Amazon',
    affiliate: 'As an Amazon Associate, we earn from qualifying purchases.',
  },
};

function getAmazonUrl(asin: string): string {
  return `https://www.amazon.ca/dp/${asin}?tag=${AMAZON_STORE_ID}`;
}

export default function AmazonProductBox({
  products,
  title,
  locale = 'fr',
}: AmazonProductBoxProps) {
  const t = translations[locale];

  if (!products || products.length === 0) return null;

  return (
    <div className="my-8 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.5 2C7.25 2 3 6.25 3 11.5c0 1.86.54 3.59 1.46 5.06L3 21l4.44-1.46C9.41 20.46 10.91 21 12.5 21c5.25 0 9.5-4.25 9.5-9.5S17.75 2 12.5 2z" />
        </svg>
        {title || t.title}
      </h3>

      <div className={`grid gap-4 ${products.length === 1 ? 'grid-cols-1' : 'sm:grid-cols-2'}`}>
        {products.map((product) => (
          <a
            key={product.asin}
            href={getAmazonUrl(product.asin)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-4 bg-white rounded-lg p-4 border border-amber-100 hover:border-[#FF9900] hover:shadow-md transition-all group"
          >
            <div className="relative w-20 h-20 flex-shrink-0 bg-white rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-neutral-800 line-clamp-2 group-hover:text-[#FF9900] transition-colors">
                {product.title}
              </h4>
              {product.price && (
                <p className="text-sm font-semibold text-[#B12704] mt-1">{product.price}</p>
              )}
              <span className="inline-flex items-center gap-1 text-xs text-[#FF9900] mt-2 font-medium">
                {t.buyOn}
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </a>
        ))}
      </div>

      <p className="text-[10px] text-neutral-400 mt-4 text-center">
        {t.affiliate}
      </p>
    </div>
  );
}

// Composant simplifié pour un seul produit
interface SingleProductProps {
  asin: string;
  title: string;
  image: string;
  price?: string;
  locale?: 'fr' | 'en';
}

export function AmazonProduct({ asin, title, image, price, locale = 'fr' }: SingleProductProps) {
  const t = translations[locale];

  return (
    <a
      href={getAmazonUrl(asin)}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3 hover:border-[#FF9900] hover:shadow-md transition-all group my-4"
    >
      <div className="relative w-14 h-14 flex-shrink-0 bg-white rounded-lg overflow-hidden">
        <Image src={image} alt={title} fill className="object-contain p-1" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-neutral-800 line-clamp-1 group-hover:text-[#FF9900] transition-colors">
          {title}
        </h4>
        <span className="inline-flex items-center gap-1 text-xs text-[#FF9900] font-medium">
          {t.buyOn} <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}

// Boîte latérale pour sidebar
interface AmazonSidebarBoxProps {
  products: AmazonProduct[];
  title?: string;
  locale?: 'fr' | 'en';
}

export function AmazonSidebarBox({ products, title, locale = 'fr' }: AmazonSidebarBoxProps) {
  const t = translations[locale];

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-neutral-800 mb-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-[#FF9900]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.5 12c0-1.4-.5-2.7-1.3-3.8l-3.2 2.4c.3.5.5 1 .5 1.4 0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3c.6 0 1.1.2 1.6.5l3.2-2.4C18 5.5 16.1 4.5 14 4.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5z" />
        </svg>
        {title || t.title}
      </h3>

      <div className="space-y-3">
        {products.slice(0, 3).map((product) => (
          <a
            key={product.asin}
            href={getAmazonUrl(product.asin)}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-amber-50 transition-colors group"
          >
            <div className="relative w-12 h-12 flex-shrink-0 bg-neutral-50 rounded overflow-hidden">
              <Image src={product.image} alt={product.title} fill className="object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-neutral-700 line-clamp-2 group-hover:text-[#FF9900] transition-colors">
                {product.title}
              </p>
              {product.price && (
                <p className="text-xs font-semibold text-[#B12704]">{product.price}</p>
              )}
            </div>
          </a>
        ))}
      </div>

      <p className="text-[9px] text-neutral-400 mt-3 text-center">{t.affiliate}</p>
    </div>
  );
}
