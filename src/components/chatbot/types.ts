export type MessageSender = 'bot' | 'user';
export type ChatView = 'chat' | 'contact-form';

export interface QuickReply {
  id: string;
  label: string;
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  content: string;
  action?: {
    type: 'link' | 'contact-form' | 'quick-replies';
    url?: string;
    label?: string;
    replies?: QuickReply[];
  };
}

export interface FAQItem {
  id: string;
  keywords: string[];
  question: { fr: string; en: string };
  answer: { fr: string; en: string };
  action?: {
    type: 'link' | 'contact-form';
    url?: { fr: string; en: string };
    label: { fr: string; en: string };
  };
}
