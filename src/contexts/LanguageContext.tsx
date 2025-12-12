'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  slugFr?: string;
  slugEn?: string;
  setAlternateSlugs: (slugFr?: string, slugEn?: string) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  setAlternateSlugs: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [slugFr, setSlugFr] = useState<string>();
  const [slugEn, setSlugEn] = useState<string>();

  const setAlternateSlugs = (fr?: string, en?: string) => {
    setSlugFr(fr);
    setSlugEn(en);
  };

  return (
    <LanguageContext.Provider value={{ slugFr, slugEn, setAlternateSlugs }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  return useContext(LanguageContext);
}
