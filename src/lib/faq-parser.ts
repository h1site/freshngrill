/**
 * Parse FAQ string from recipes into structured data
 * Supports JSON format and legacy HTML format
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export function parseFAQString(faqString: string, locale: 'fr' | 'en' = 'fr'): FAQItem[] {
  const items: FAQItem[] = [];
  const isEN = locale === 'en';

  // Try parsing as JSON first (new format)
  try {
    const parsed = JSON.parse(faqString);

    // Format 1: Direct array [{question, answer}, ...]
    if (Array.isArray(parsed)) {
      parsed.forEach((item: {
        question?: string;
        answer?: string;
        question_fr?: string;
        answer_fr?: string;
        question_en?: string;
        answer_en?: string;
      }) => {
        // Simple format {question, answer}
        if (item.question && item.answer) {
          items.push({
            question: item.question,
            answer: item.answer.replace(/<[^>]*>/g, '').trim(),
          });
        }
        // Bilingual format {question_fr, answer_fr, question_en, answer_en}
        else if (item.question_fr || item.question_en) {
          const question = isEN ? item.question_en : item.question_fr;
          const answer = isEN ? item.answer_en : item.answer_fr;
          if (question && answer) {
            items.push({
              question,
              answer: answer.replace(/<[^>]*>/g, '').trim(),
            });
          }
        }
      });
      return items;
    }

    // Format 2: Object with faq property {faq: [...]}
    if (parsed.faq && Array.isArray(parsed.faq)) {
      parsed.faq.forEach((item: {
        question_fr?: string;
        answer_fr?: string;
        question_en?: string;
        answer_en?: string;
      }) => {
        const question = isEN ? item.question_en : item.question_fr;
        const answer = isEN ? item.answer_en : item.answer_fr;
        if (question && answer) {
          items.push({
            question,
            answer: answer.replace(/<[^>]*>/g, '').trim(),
          });
        }
      });
      return items;
    }
  } catch {
    // Not JSON, continue with HTML parsing
  }

  // Fallback: parse legacy HTML format
  const html = faqString;

  // Pattern for h2 or h3 as questions
  const headerPattern = /<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi;
  const matches = [...html.matchAll(headerPattern)];

  if (matches.length > 0) {
    matches.forEach((match, index) => {
      const question = match[1].replace(/<[^>]*>/g, '').trim();
      if (!question) return;

      // Find content between this header and the next
      const startIndex = match.index! + match[0].length;
      const nextMatch = matches[index + 1];
      const endIndex = nextMatch ? nextMatch.index! : html.length;
      const answer = html.substring(startIndex, endIndex).replace(/<[^>]*>/g, '').trim();

      if (answer) {
        items.push({ question, answer });
      }
    });
  }

  // Fallback: look for strong in li as questions
  if (items.length === 0) {
    const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    const liMatches = [...html.matchAll(liPattern)];

    liMatches.forEach((liMatch) => {
      const liContent = liMatch[1];
      const strongMatch = liContent.match(/<strong[^>]*>([\s\S]*?)<\/strong>/i);
      if (strongMatch) {
        const question = strongMatch[1].replace(/<[^>]*>/g, '').trim().replace(/:$/, '');
        const answer = liContent.replace(strongMatch[0], '').replace(/<[^>]*>/g, '').trim();
        if (question && answer) {
          items.push({ question, answer });
        }
      }
    });
  }

  return items;
}
