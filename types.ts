import type { Language } from './utils/translations';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  features: string[];
  image: string; // Product photo URL
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isError?: boolean;
}

export enum PageView {
  HOME = 'HOME',
  ABOUT = 'ABOUT',
  PRODUCTS = 'PRODUCTS',
  CAPACITY = 'CAPACITY',
  FACTORY = 'FACTORY',
  CONTACT = 'CONTACT'
}

export const PAGE_PATHS: Record<PageView, string> = {
  [PageView.HOME]: '/',
  [PageView.ABOUT]: '/about',
  [PageView.PRODUCTS]: '/products',
  [PageView.CAPACITY]: '/capacity',
  [PageView.FACTORY]: '/factory',
  [PageView.CONTACT]: '/contact',
};

export const getPathForPage = (page: PageView): string => PAGE_PATHS[page];
export const DEFAULT_LANGUAGE: Language = 'en';

export const getPageFromPath = (pathname: string): PageView => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(PAGE_PATHS) as Array<[PageView, string]>).find(([, path]) => path === normalized);
  return match ? match[0] : PageView.HOME;
};

export const getLocalizedPath = (page: PageView, language: Language): string => {
  const basePath = getPathForPage(page);
  if (language === DEFAULT_LANGUAGE) {
    return basePath;
  }

  return basePath === '/' ? `/${language}` : `/${language}${basePath}`;
};

export const getLocaleStateFromPath = (pathname: string): { language: Language; page: PageView } => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const segments = normalized.split('/').filter(Boolean);
  const maybeLanguage = segments[0] as Language | undefined;
  const isKnownLanguage = maybeLanguage && ['zh', 'en', 'es', 'ar', 'hi', 'pt', 'ru', 'ja', 'de', 'fr'].includes(maybeLanguage);

  if (!isKnownLanguage) {
    return {
      language: DEFAULT_LANGUAGE,
      page: getPageFromPath(normalized),
    };
  }

  const restPath = `/${segments.slice(1).join('/')}`.replace(/\/+$/, '') || '/';
  return {
    language: maybeLanguage,
    page: getPageFromPath(restPath),
  };
};

export interface CompanyInfo {
  name: string;
  founded: string;
  location: string;
  phone: string;
  email: string;
  employees: number;
}
