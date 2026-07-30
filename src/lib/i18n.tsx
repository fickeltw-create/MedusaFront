'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import fr, { Translations } from './translations/fr';
import nl from './translations/nl';
import en from './translations/en';

export type Language = 'fr' | 'nl' | 'en';

const translations: Record<Language, Translations> = { fr, nl: nl as unknown as Translations, en: en as unknown as Translations };

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: 'fr',
  setLang: () => {},
  t: fr,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('fr');

  useEffect(() => {
    const stored = localStorage.getItem('modura-lang') as Language | null;
    if (stored && ['fr', 'nl', 'en'].includes(stored)) {
      setLangState(stored);
    } else {
      const browser = navigator.language.slice(0, 2) as Language;
      if (['fr', 'nl', 'en'].includes(browser)) setLangState(browser);
    }
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    localStorage.setItem('modura-lang', l);
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}