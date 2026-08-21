import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { TRANSLATIONS } from '../i18n/translations';
import type { Language, TranslationDictionary } from '../i18n/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrilens_language') as Language;
    if (saved && (saved === 'en' || saved === 'hi' || saved === 'mr')) {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.setAttribute('data-lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('agrilens_language', lang);
    document.documentElement.lang = lang;
    document.documentElement.setAttribute('data-lang', lang);
  };

  const t = TRANSLATIONS[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
