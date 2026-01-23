'use client';

import { useState } from 'react';
import MobileRadioBar from '@/components/KracRadio/MobileRadioBar';
import FloatingChatbot from '@/components/chatbot/FloatingChatbot';
import type { Locale } from '@/i18n/config';

interface Props {
  locale?: Locale;
}

export default function MobileBottomControls({ locale = 'fr' }: Props) {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  return (
    <>
      <MobileRadioBar
        locale={locale}
        onOpenChatbot={() => setIsChatbotOpen(true)}
      />
      <FloatingChatbot
        locale={locale}
        isOpenExternal={isChatbotOpen}
        onToggleExternal={setIsChatbotOpen}
      />
    </>
  );
}
