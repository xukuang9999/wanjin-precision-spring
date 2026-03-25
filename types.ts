import { type Language, LANGUAGE_CODES } from './utils/languages';

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
const SUPPORTED_LANGUAGE_PREFIXES = LANGUAGE_CODES;

const parseLocalizedSegments = (segments: string[], language: Language): { language: Language; page: PageView; slug?: string } => {
  const restPath = `/${segments.join('/')}`.replace(/\/+$/, '') || '/';
  const restSegments = restPath.split('/').filter(Boolean);
  if (restSegments[0] === 'products' && restSegments[1]) {
    return {
      language,
      page: PageView.PRODUCTS,
      slug: restSegments.slice(1).join('/'),
    };
  }
  if (restSegments[0] === 'blog' && restSegments[1]) {
    return {
      language,
      page: PageView.BLOG,
      slug: restSegments.slice(1).join('/'),
    };
  }
  return {
    language,
    page: getPageFromPath(restPath),
  };
};

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
  const maybeLanguage = segments[0];

  if (maybeLanguage && SUPPORTED_LANGUAGE_PREFIXES.includes(maybeLanguage as Language)) {
    return parseLocalizedSegments(segments.slice(1), maybeLanguage as Language);
  }

  return parseLocalizedSegments(segments, DEFAULT_LANGUAGE);
};

export interface CompanyInfo {
  name: string;
  founded: string;
  location: string;
  phone: string;
  email: string;
  employees: number;
}
