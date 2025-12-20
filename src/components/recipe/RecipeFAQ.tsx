'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Locale } from '@/i18n/config';

interface FAQItem {
  question: string;
  answer: string;
}

interface JSONFaqItem {
  question_fr: string;
  answer_fr: string;
  question_en: string;
  answer_en: string;
}

interface JSONFaqData {
  id: number;
  title_fr: string;
  title_en: string;
  faq: JSONFaqItem[];
}

interface Props {
  faq: string;
  locale?: Locale;
}

function parseFAQ(faqString: string, locale: Locale): FAQItem[] {
  const items: FAQItem[] = [];
  const isEN = locale === 'en';

  // Essayer de parser comme JSON d'abord (nouveau format)
  try {
    const parsed = JSON.parse(faqString);

    // Format 1: Tableau direct [{question, answer}, ...]
    if (Array.isArray(parsed)) {
      parsed.forEach((item: { question?: string; answer?: string; question_fr?: string; answer_fr?: string; question_en?: string; answer_en?: string }) => {
        // Support format simple {question, answer}
        if (item.question && item.answer) {
          items.push({ question: item.question, answer: `<p>${item.answer}</p>` });
        }
        // Support format bilingue {question_fr, answer_fr, question_en, answer_en}
        else if (item.question_fr || item.question_en) {
          const question = isEN ? item.question_en : item.question_fr;
          const answer = isEN ? item.answer_en : item.answer_fr;
          if (question && answer) {
            items.push({ question, answer: `<p>${answer}</p>` });
          }
        }
      });
      return items;
    }

    // Format 2: Objet avec propriété faq {faq: [...]}
    const jsonData = parsed as JSONFaqData;
    if (jsonData.faq && Array.isArray(jsonData.faq)) {
      jsonData.faq.forEach((item) => {
        const question = isEN ? item.question_en : item.question_fr;
        const answer = isEN ? item.answer_en : item.answer_fr;
        if (question && answer) {
          items.push({ question, answer: `<p>${answer}</p>` });
        }
      });
      return items;
    }
  } catch {
    // Pas du JSON, continuer avec le parsing HTML
  }

  // Fallback: parser l'ancien format HTML
  const html = faqString;

  // Pattern pour h2 ou h3 comme questions
  const headerPattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  const matches = [...html.matchAll(headerPattern)];

  if (matches.length > 0) {
    matches.forEach((match, index) => {
      const question = match[1].replace(/<[^>]*>/g, '').trim();
      if (!question) return;

      // Trouver le contenu entre ce header et le prochain
      const startIndex = match.index! + match[0].length;
      const nextMatch = matches[index + 1];
      const endIndex = nextMatch ? nextMatch.index! : html.length;
      const answer = html.substring(startIndex, endIndex).trim();

      if (answer) {
        items.push({ question, answer });
      }
    });
  }

  // Fallback: chercher les strong dans les li comme questions
  if (items.length === 0) {
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const liMatches = [...html.matchAll(liPattern)];

    liMatches.forEach((liMatch) => {
      const liContent = liMatch[1];
      const strongMatch = liContent.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
      if (strongMatch) {
        const question = strongMatch[1].replace(/<[^>]*>/g, '').trim().replace(/:$/, '');
        const answer = liContent.replace(strongMatch[0], '').trim();
        if (question && answer) {
          items.push({ question, answer: `<p>${answer}</p>` });
        }
      }
    });
  }

  return items;
}

function FAQItemComponent({ item, index, isOpen, onToggle }: {
  item: FAQItem;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-neutral-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full py-6 flex items-start gap-4 text-left group"
      >
        <span className="flex-shrink-0 w-8 h-8 bg-[#F77313]/10 flex items-center justify-center text-[#F77313] font-display text-sm">
          {index + 1}
        </span>
        <span className="flex-1 font-display text-lg text-black group-hover:text-[#F77313] transition-colors pr-4">
          {item.question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 w-8 h-8 border border-neutral-200 flex items-center justify-center group-hover:border-[#F77313] transition-colors"
        >
          <ChevronDown className="w-4 h-4 text-neutral-400 group-hover:text-[#F77313]" />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className="pb-6 pl-12 pr-8 text-neutral-600 leading-relaxed prose prose-sm max-w-none prose-strong:text-black prose-li:marker:text-[#F77313]"
              dangerouslySetInnerHTML={{ __html: item.answer }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function RecipeFAQ({ faq, locale = 'fr' }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const isEN = locale === 'en';

  const t = isEN ? {
    title: 'Frequently Asked Questions',
    questionsCount: (n: number) => `${n} question${n > 1 ? 's' : ''} about this recipe`,
  } : {
    title: 'Questions fréquentes',
    questionsCount: (n: number) => `${n} question${n > 1 ? 's' : ''} sur cette recette`,
  };

  // Parser immédiatement (fonctionne côté serveur avec regex)
  const items = parseFAQ(faq, locale);

  // Fallback si pas d'items parsés - afficher le HTML brut
  if (items.length === 0) {
    return (
      <div className="border border-neutral-200 overflow-hidden">
        {/* Header */}
        <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-[#F77313]" />
            <h2 className="font-display text-2xl text-black">
              {t.title}
            </h2>
          </div>
        </div>

        <div
          className="p-8 text-neutral-600 leading-relaxed prose max-w-none prose-headings:font-display prose-headings:text-black prose-strong:text-black"
          dangerouslySetInnerHTML={{ __html: faq }}
        />
      </div>
    );
  }

  return (
    <div className="border border-neutral-200 overflow-hidden">
      {/* Header */}
      <div className="bg-neutral-50 px-8 py-6 border-b border-neutral-200">
        <div className="flex items-center gap-3">
          <HelpCircle className="w-5 h-5 text-[#F77313]" />
          <h2 className="font-display text-2xl text-black">
            {t.title}
          </h2>
        </div>
        <p className="text-sm text-neutral-500 mt-2 pl-8">
          {t.questionsCount(items.length)}
        </p>
      </div>

      {/* FAQ Items */}
      <div className="px-8">
        {items.map((item, index) => (
          <FAQItemComponent
            key={index}
            item={item}
            index={index}
            isOpen={openIndex === index}
            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
          />
        ))}
      </div>
    </div>
  );
}
