export type Language = 'en' | 'zh' | 'ru' | 'ja' | 'de' | 'fr' | 'es' | 'pt';

export const LANGUAGES: { [key in Language]: string } = {
  en: 'English',
  zh: '简体中文',
  ru: 'Русский',
  ja: '日本語',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português',
};

export const FULLY_LOCALIZED_LANGUAGES = [
  'zh',
  'en',
  'es',
  'pt',
  'ru',
  'ja',
  'de',
  'fr',
] as const;

export const LANGUAGE_CODES = Object.keys(LANGUAGES) as Language[];
