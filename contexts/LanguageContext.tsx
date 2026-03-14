import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Language, TRANSLATIONS } from '../utils/translations';

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
}> = ({ children, language: controlledLanguage, onLanguageChange }) => {
  const [internalLanguage, setInternalLanguage] = useState<Language>('en');
  const language = controlledLanguage ?? internalLanguage;
  const setLanguage = (lang: Language) => {
    if (onLanguageChange) {
      onLanguageChange(lang);
      return;
    }
    setInternalLanguage(lang);
  };

  const t = (key: string): string => {
    return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || TRANSLATIONS['zh'][key] || key;
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
