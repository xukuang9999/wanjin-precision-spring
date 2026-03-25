import { type Language } from './languages';

export type TranslationDictionary = Record<string, string>;

const translationLoaders: Record<Language, () => Promise<{ default: TranslationDictionary }>> = {
  en: () => import('./runtime-translations/en'),
  zh: () => import('./runtime-translations/zh'),
  ru: () => import('./runtime-translations/ru'),
  ja: () => import('./runtime-translations/ja'),
  de: () => import('./runtime-translations/de'),
  fr: () => import('./runtime-translations/fr'),
  es: () => import('./runtime-translations/es'),
  pt: () => import('./runtime-translations/pt'),
};

const translationCache = new Map<Language, Promise<TranslationDictionary>>();

export const loadTranslationDictionary = (language: Language): Promise<TranslationDictionary> => {
  if (!translationCache.has(language)) {
    translationCache.set(language, translationLoaders[language]().then((module) => module.default));
  }

  return translationCache.get(language)!;
};

export const preloadTranslationDictionary = (language: Language) => {
  void loadTranslationDictionary(language);
};
