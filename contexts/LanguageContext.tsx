import React, { createContext, useEffect, useRef, useState, useContext, ReactNode } from 'react';
import { type Language } from '../utils/languages';
import {
  loadTranslationDictionary,
  preloadTranslationDictionary,
  type TranslationDictionary,
} from '../utils/runtimeTranslations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{
  children: ReactNode;
  language?: Language;
  onLanguageChange?: (lang: Language) => void;
  initialDictionary?: TranslationDictionary;
}> = ({ children, language: controlledLanguage, onLanguageChange, initialDictionary }) => {
  const [internalLanguage, setInternalLanguage] = useState<Language>('en');
  const language = controlledLanguage ?? internalLanguage;
  const [dictionaries, setDictionaries] = useState<Partial<Record<Language, TranslationDictionary>>>(() =>
    initialDictionary ? { [language]: initialDictionary } : {},
  );
  const fallbackLanguageRef = useRef(language);

  useEffect(() => {
    if (!dictionaries[language]) {
      let cancelled = false;

      void loadTranslationDictionary(language)
        .then((dictionary) => {
          if (cancelled) {
            return;
          }

          fallbackLanguageRef.current = language;
          setDictionaries((previous) => ({
            ...previous,
            [language]: dictionary,
          }));
        })
        .catch((error) => {
          console.error(`Failed to load translations for ${language}:`, error);
        });

      return () => {
        cancelled = true;
      };
    }

    fallbackLanguageRef.current = language;
    return undefined;
  }, [dictionaries, language]);

  const setLanguage = (lang: Language) => {
    preloadTranslationDictionary(lang);
    if (onLanguageChange) {
      onLanguageChange(lang);
      return;
    }
    setInternalLanguage(lang);
  };

  const activeLanguage = dictionaries[language] ? language : fallbackLanguageRef.current;
  const activeDictionary = dictionaries[activeLanguage];

  const t = (key: string): string => {
    return activeDictionary?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
