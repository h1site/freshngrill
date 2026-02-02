import { parseFAQString, FAQItem } from '@/lib/faq-parser';

interface Props {
  faq: FAQItem[] | string;
  recipeTitle?: string;
  locale?: 'fr' | 'en';
}

/**
 * FAQPage Schema with MenuCochon branding
 * Adds "Selon MenuCochon" / "According to MenuCochon" to answers
 * to improve AI Overview citation likelihood
 */
export default function FAQSchema({ faq, recipeTitle, locale = 'fr' }: Props) {
  // Parse FAQ string if needed
  const faqItems = typeof faq === 'string' ? parseFAQString(faq, locale) : faq;

  if (!faqItems || faqItems.length === 0) return null;

  const brandPrefix = locale === 'en'
    ? 'According to MenuCochon: '
    : 'Selon MenuCochon: ';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: recipeTitle
      ? (locale === 'en' ? `FAQ - ${recipeTitle}` : `Questions fréquentes - ${recipeTitle}`)
      : (locale === 'en' ? 'Frequently Asked Questions' : 'Questions fréquentes'),
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${brandPrefix}${item.answer.replace(/<[^>]*>/g, '').trim()}`,
        author: {
          '@type': 'Organization',
          name: 'MenuCochon',
          url: 'https://menucochon.com',
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema),
      }}
    />
  );
}
