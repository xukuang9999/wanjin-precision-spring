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
  CONTACT = 'CONTACT',
  BLOG = 'BLOG',
}

export const PAGE_PATHS: Record<PageView, string> = {
  [PageView.HOME]: '/',
  [PageView.ABOUT]: '/about',
  [PageView.PRODUCTS]: '/products',
  [PageView.CAPACITY]: '/capacity',
  [PageView.FACTORY]: '/factory',
  [PageView.CONTACT]: '/contact',
  [PageView.BLOG]: '/blog',
};

export const getPathForPage = (page: PageView): string => PAGE_PATHS[page];
export const DEFAULT_LANGUAGE: Language = 'en';

export const getPageFromPath = (pathname: string): PageView => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(PAGE_PATHS) as Array<[PageView, string]>).find(([, path]) => path === normalized);
  return match ? match[0] : PageView.HOME;
};

export const getLocalizedPath = (page: PageView, language: Language, slug?: string): string => {
  const basePath = getPathForPage(page);
  const suffix = slug && (page === PageView.BLOG || page === PageView.PRODUCTS) ? `/${slug}` : '';
  if (language === DEFAULT_LANGUAGE) {
    return `${basePath}${suffix}` || '/';
  }

  const localizedBase = basePath === '/' ? `/${language}` : `/${language}${basePath}`;
  return `${localizedBase}${suffix}`;
};

export const getLocaleStateFromPath = (pathname: string): { language: Language; page: PageView; slug?: string } => {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  const segments = normalized.split('/').filter(Boolean);
  const maybeLanguage = segments[0] as Language | undefined;
  const isKnownLanguage = maybeLanguage && ['zh', 'en', 'es', 'ar', 'hi', 'pt', 'ru', 'ja', 'de', 'fr'].includes(maybeLanguage);

  if (!isKnownLanguage) {
    if (segments[0] === 'products' && segments[1]) {
      return {
        language: DEFAULT_LANGUAGE,
        page: PageView.PRODUCTS,
        slug: segments.slice(1).join('/'),
      };
    }
    if (segments[0] === 'blog' && segments[1]) {
      return {
        language: DEFAULT_LANGUAGE,
        page: PageView.BLOG,
        slug: segments.slice(1).join('/'),
      };
    }
    return {
      language: DEFAULT_LANGUAGE,
      page: getPageFromPath(normalized),
    };
  }

  const restPath = `/${segments.slice(1).join('/')}`.replace(/\/+$/, '') || '/';
  const restSegments = restPath.split('/').filter(Boolean);
  if (restSegments[0] === 'products' && restSegments[1]) {
    return {
      language: maybeLanguage,
      page: PageView.PRODUCTS,
      slug: restSegments.slice(1).join('/'),
    };
  }
  if (restSegments[0] === 'blog' && restSegments[1]) {
    return {
      language: maybeLanguage,
      page: PageView.BLOG,
      slug: restSegments.slice(1).join('/'),
    };
  }
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
