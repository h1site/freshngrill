'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import type { ChatMessage } from './types';
import { matchFAQ, getWelcomeSuggestions, getMoreSuggestions } from './faqData';

interface Props {
  locale?: 'fr' | 'en';
  isOpenExternal?: boolean;
  onToggleExternal?: (open: boolean) => void;
}

export default function FloatingChatbot({ locale = 'fr', isOpenExternal, onToggleExternal }: Props) {
  const [isOpenInternal, setIsOpenInternal] = useState(false);
  const isOpen = isOpenExternal !== undefined ? isOpenExternal : isOpenInternal;
  const setIsOpen = onToggleExternal !== undefined ? onToggleExternal : setIsOpenInternal;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [awaitingName, setAwaitingName] = useState(false);
  const [awaitingNewsletter, setAwaitingNewsletter] = useState(false);
  const [awaitingEmail, setAwaitingEmail] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [newsletterOffered, setNewsletterOffered] = useState(false);
  const [currentLocale, setCurrentLocale] = useState<'fr' | 'en'>(locale);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Detect locale from URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const detectedLocale: 'fr' | 'en' = pathname.startsWith('/en') ? 'en' : 'fr';
      setCurrentLocale(detectedLocale);
    }
  }, []);

  const isEN = currentLocale === 'en';

  const botName = isEN ? 'Chef Tom' : 'Chef Tom';

  const t = isEN ? {
    title: 'Need help?',
    placeholder: 'Ask a question...',
    askName: `Hello! I'm ${botName}. What's your first name?`,
    welcomeWithName: (name: string) => `Nice to meet you, ${name}! How can I help you today?`,
    contactPrompt: 'Would you like to contact us directly?',
    contactButton: 'Contact form',
    noMatch: "I didn't quite understand. Would you like to contact us?",
    moreQuestions: 'Any other questions?',
    askNewsletter: 'Would you like to receive news and recipes from our site?',
    newsletterYes: 'Yes',
    newsletterNo: 'No thanks',
    askEmail: 'Great! What email address should I use?',
    newsletterSuccess: 'Perfect! You will receive our best recipes by email. Thanks!',
    newsletterDecline: 'No problem! Feel free to come back if you need anything.',
    invalidEmail: 'Hmm, this email doesn\'t look valid. Can you check it?',
    redirectToFridge: (ingredients: string) => `Perfect! I'll show you recipes with ${ingredients} in our Magic Fridge.`,
  } : {
    title: "Besoin d'aide?",
    placeholder: 'Posez une question...',
    askName: `Bonjour! Je suis ${botName}. Quel est votre prénom?`,
    welcomeWithName: (name: string) => `Ravi de vous rencontrer, ${name}! Comment puis-je vous aider?`,
    contactPrompt: 'Souhaitez-vous nous contacter directement?',
    contactButton: 'Formulaire de contact',
    noMatch: "Je n'ai pas bien compris. Souhaitez-vous nous contacter?",
    moreQuestions: "D'autres questions?",
    askNewsletter: 'Souhaitez-vous recevoir les nouvelles et recettes de notre site?',
    newsletterYes: 'Oui',
    newsletterNo: 'Non merci',
    askEmail: 'Super! Quelle adresse courriel dois-je utiliser?',
    newsletterSuccess: 'Parfait! Vous recevrez nos meilleures recettes par courriel. Merci!',
    newsletterDecline: "Aucun problème! N'hésitez pas à revenir si vous avez besoin!",
    invalidEmail: "Hmm, ce courriel ne semble pas valide. Pouvez-vous vérifier?",
    redirectToFridge: (ingredients: string) => `Parfait! Je vais vous montrer les recettes avec ${ingredients} dans notre Frigo Magique.`,
  };

  useEffect(() => {
    setIsMounted(true);
    // Load user name from localStorage
    const savedName = localStorage.getItem('chatbot-user-name');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  // Save user name to localStorage when it changes
  useEffect(() => {
    if (userName) {
      localStorage.setItem('chatbot-user-name', userName);
    }
  }, [userName]);

  useEffect(() => {
    if (isOpen && messages.length === 0 && !userName) {
      // Ask for user's name first
      const askNameMessage: ChatMessage = {
        id: 'ask-name',
        sender: 'bot',
        content: t.askName,
      };
      setMessages([askNameMessage]);
      setAwaitingName(true);
    } else if (isOpen && messages.length === 0 && userName) {
      // User already has a name, show welcome with suggestions
      const suggestions = getWelcomeSuggestions(currentLocale);
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        sender: 'bot',
        content: t.welcomeWithName(userName),
        action: {
          type: 'quick-replies',
          replies: suggestions.map(s => ({
            id: s.id,
            label: s.question[currentLocale],
          }))
        }
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, currentLocale, messages.length, userName, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (content: string, action?: ChatMessage['action']) => {
    setMessages(prev => [...prev, {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      content,
      action
    }]);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    setMessages(prev => [...prev, {
      id: `user-${Date.now()}`,
      sender: 'user',
      content: messageText,
    }]);
    setInputValue('');

    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setIsTyping(false);

    // If waiting for user's name
    if (awaitingName) {
      setUserName(messageText);
      setAwaitingName(false);

      const suggestions = getWelcomeSuggestions(currentLocale);
      addBotMessage(t.welcomeWithName(messageText), {
        type: 'quick-replies',
        replies: suggestions.map(s => ({
          id: s.id,
          label: s.question[currentLocale],
        }))
      });
      return;
    }

    // If waiting for newsletter response
    if (awaitingNewsletter) {
      const response = messageText.toLowerCase();
      setAwaitingNewsletter(false);

      if (response.includes('oui') || response.includes('yes') || response === t.newsletterYes.toLowerCase()) {
        setAwaitingEmail(true);
        addBotMessage(t.askEmail);
      } else {
        addBotMessage(t.newsletterDecline);
      }
      return;
    }

    // If waiting for email
    if (awaitingEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(messageText)) {
        setAwaitingEmail(false);
        // Here you would normally send the email to your newsletter service
        addBotMessage(t.newsletterSuccess);
      } else {
        addBotMessage(t.invalidEmail);
      }
      return;
    }

    // First, try FAQ matching (prioritize over ingredient search)
    const match = matchFAQ(messageText, currentLocale);

    if (match) {
      const answer = match.answer[currentLocale];
      const action = match.action;

      addBotMessage(answer, action ? {
        type: action.type,
        url: action.type === 'link' ? action.url?.[currentLocale] : undefined,
        label: action.label[currentLocale]
      } : undefined);

      // Increment question count AFTER showing answer
      const newCount = questionCount + 1;
      setQuestionCount(newCount);

      // After 2 questions answered, offer newsletter (only once)
      if (newCount >= 2 && !newsletterOffered) {
        setNewsletterOffered(true);
        setTimeout(() => {
          setAwaitingNewsletter(true);
          addBotMessage(t.askNewsletter, {
            type: 'quick-replies',
            replies: [
              { id: 'newsletter-yes', label: t.newsletterYes },
              { id: 'newsletter-no', label: t.newsletterNo }
            ]
          });
        }, 1000);
      } else if (!newsletterOffered) {
        // Show "more questions?" with other suggestions (excluding the one just asked)
        setTimeout(() => {
          const moreSuggestions = getMoreSuggestions(match.id, currentLocale, 3);
          addBotMessage(t.moreQuestions, {
            type: 'quick-replies',
            replies: moreSuggestions.map(s => ({
              id: s.id,
              label: s.question[currentLocale],
            }))
          });
        }, 1000);

        // Also add contact form option after suggestions
        setTimeout(() => {
          addBotMessage(
            isEN ? 'Need more help?' : 'Besoin de plus d\'aide?',
            {
              type: 'contact-form',
              label: t.contactButton
            }
          );
        }, 1500);
      }
      return;
    }

    // If no FAQ match, check if it's an ingredient search
    const ingredients = detectIngredientSearch(messageText);

    if (ingredients && ingredients.length > 0) {
      // Build Frigo Magique URL with ingredients
      const ingredientsParam = ingredients.join(',');
      const fridgeUrl = currentLocale === 'en'
        ? `/en/frigo?ingredients=${encodeURIComponent(ingredientsParam)}`
        : `/frigo?ingredients=${encodeURIComponent(ingredientsParam)}`;

      // Show redirect message with link to Frigo Magique
      addBotMessage(t.redirectToFridge(ingredients.join(', ')), {
        type: 'link',
        url: fridgeUrl,
        label: currentLocale === 'en' ? 'Open Magic Fridge' : 'Ouvrir le Frigo Magique'
      });

      return;
    }

    // No FAQ match and no ingredients detected - show no match message
    addBotMessage(t.noMatch, {
      type: 'contact-form',
      label: t.contactButton
    });
  };

  const handleQuickReply = (label: string) => {
    handleSend(label);
  };

  // Function to detect if message is an ingredient search
  const detectIngredientSearch = (message: string): string[] | null => {
    const normalized = message.toLowerCase().trim();

    // Patterns that indicate ingredient search
    const searchPatterns = [
      /recette.{0,20}(avec|contenant|à base de|au|aux)\s+(.+)/i,
      /qu[\'e]?(?:est[- ]ce que)?.*(?:faire|cuisiner|préparer).{0,20}avec\s+(.+)/i,
      /(avec|j\'ai|j ai)\s+(?:des?\s+)?(.+)/i,
      /^(.+?)\s*(?:et|,)\s*(.+)$/i, // "pommes et bananes" ou "pommes, bananes"
    ];

    // Try to match patterns
    for (const pattern of searchPatterns) {
      const match = normalized.match(pattern);
      if (match) {
        // Extract ingredients from the matched groups
        const ingredientsText = match[match.length - 1];
        return extractIngredients(ingredientsText);
      }
    }

    // If single word (might be an ingredient)
    const words = normalized.split(/\s+/);
    if (words.length === 1 && words[0].length >= 3) {
      // Check if it's not a common question word
      const questionWords = ['comment', 'quoi', 'pourquoi', 'qui', 'quand', 'où', 'how', 'what', 'why', 'who', 'when', 'where'];
      if (!questionWords.includes(words[0])) {
        return [words[0]];
      }
    }

    // Multiple words without specific pattern - might be a list of ingredients
    if (words.length >= 2 && words.length <= 5) {
      // Remove common words
      const stopWords = ['recette', 'recipe', 'avec', 'with', 'des', 'de', 'les', 'the', 'and', 'et', 'ou', 'or'];
      const filteredWords = words.filter(w => !stopWords.includes(w) && w.length >= 3);

      if (filteredWords.length > 0 && filteredWords.length <= 4) {
        return filteredWords;
      }
    }

    return null;
  };

  // Function to extract ingredients from text
  const extractIngredients = (text: string): string[] => {
    // Split by common separators
    const ingredients = text
      .split(/[,;]|\s+et\s+|\s+and\s+/)
      .map(i => i.trim())
      .filter(i => {
        // Remove empty, too short, or common words
        const stopWords = ['des', 'de', 'les', 'le', 'la', 'un', 'une', 'the', 'a', 'an', 'some'];
        return i.length >= 3 && !stopWords.includes(i);
      });

    return ingredients.slice(0, 5); // Max 5 ingredients
  };

  if (!isMounted) return null;

  return (
    <>
      {/* Mobile: Only show panel when open */}
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            key="mobile-panel"
            className="md:hidden fixed inset-0 z-[999] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-[#F77313] text-white px-4 py-3 flex items-center justify-between rounded-t-2xl flex-shrink-0">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-semibold">{t.title}</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                        msg.sender === 'user'
                          ? 'bg-[#F77313] text-white rounded-br-sm'
                          : 'bg-white text-neutral-800 shadow-sm border border-neutral-100 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>

                      {msg.action && msg.sender === 'bot' && (
                        <div className="mt-2 pt-2 border-t border-neutral-100">
                          {msg.action.type === 'link' && msg.action.url && (
                            <Link
                              href={msg.action.url}
                              className="inline-flex items-center gap-1 text-[#F77313] text-sm font-medium hover:underline"
                            >
                              {msg.action.label}
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                          {msg.action.type === 'contact-form' && (
                            <Link
                              href={currentLocale === 'en' ? '/en/contact' : '/contact'}
                              className="inline-flex items-center gap-1 text-[#F77313] text-sm font-medium hover:underline"
                            >
                              {msg.action.label || t.contactButton}
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          )}
                          {msg.action.type === 'quick-replies' && msg.action.replies && (
                            <div className="flex flex-wrap gap-2 mt-1">
                              {msg.action.replies.map((reply) => (
                                <button
                                  key={reply.id}
                                  onClick={() => handleQuickReply(reply.label)}
                                  className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors text-left"
                                >
                                  {reply.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white shadow-sm border border-neutral-100 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-neutral-200 bg-white flex-shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSend();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.placeholder}
                    className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-[#F77313] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="w-10 h-10 bg-[#F77313] text-white rounded-full flex items-center justify-center hover:bg-[#e56610] disabled:opacity-50 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop: Floating button and panel */}
      <div className="hidden md:block fixed bottom-4 right-4 z-[998] print:hidden">
        <AnimatePresence mode="wait">
          {isOpen ? (
          <motion.div
            key="panel"
            className="w-[340px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="bg-[#F77313] text-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold">{t.title}</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-3 bg-neutral-50">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2 ${
                          msg.sender === 'user'
                            ? 'bg-[#F77313] text-white rounded-br-sm'
                            : 'bg-white text-neutral-800 shadow-sm border border-neutral-100 rounded-bl-sm'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>

                        {msg.action && msg.sender === 'bot' && (
                          <div className="mt-2 pt-2 border-t border-neutral-100">
                            {msg.action.type === 'link' && msg.action.url && (
                              <Link
                                href={msg.action.url}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[#F77313] text-sm font-medium hover:underline"
                              >
                                {msg.action.label}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                            {msg.action.type === 'contact-form' && (
                              <Link
                                href={currentLocale === 'en' ? '/en/contact' : '/contact'}
                                onClick={() => setIsOpen(false)}
                                className="inline-flex items-center gap-1 text-[#F77313] text-sm font-medium hover:underline"
                              >
                                {msg.action.label || t.contactButton}
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            )}
                            {msg.action.type === 'quick-replies' && msg.action.replies && (
                              <div className="flex flex-wrap gap-2 mt-1">
                                {msg.action.replies.map((reply) => (
                                  <button
                                    key={reply.id}
                                    onClick={() => handleQuickReply(reply.label)}
                                    className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-3 py-1.5 rounded-full transition-colors text-left"
                                  >
                                    {reply.label}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white shadow-sm border border-neutral-100 rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 border-t border-neutral-200 bg-white">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSend();
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder={t.placeholder}
                      className="flex-1 px-4 py-2 border border-neutral-200 rounded-full text-sm focus:outline-none focus:border-[#F77313] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!inputValue.trim()}
                      className="w-10 h-10 bg-[#F77313] text-white rounded-full flex items-center justify-center hover:bg-[#e56610] disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
          </motion.div>
        ) : (
          <motion.button
            key="button"
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-[#F77313] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#e56610] transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
