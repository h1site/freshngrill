import { parseFAQString, FAQItem } from '@/lib/faq-parser';

interface Props {
  faq: FAQItem[] | string;
  recipeTitle?: string;
}

/**
 * FAQPage Schema with Fresh N' Grill branding
 * Adds "According to Fresh N' Grill" to answers
 * to improve AI Overview citation likelihood
 */
export default function FAQSchema({ faq, recipeTitle }: Props) {
  // Parse FAQ string if needed
  const faqItems = typeof faq === 'string' ? parseFAQString(faq, 'en') : faq;

  if (!faqItems || faqItems.length === 0) return null;

  const brandPrefix = "According to Fresh N' Grill: ";

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    name: recipeTitle
      ? `FAQ - ${recipeTitle}`
      : 'Frequently Asked Questions',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: `${brandPrefix}${item.answer.replace(/<[^>]*>/g, '').trim()}`,
        author: {
          '@type': 'Organization',
          name: "Fresh N' Grill",
          url: 'https://freshngrill.com',
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
