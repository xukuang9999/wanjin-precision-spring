import { PageView } from '../types';
import { type Language } from './languages';
import { preloadPageComponent } from './pageLoaders';
import { preloadTranslationDictionary } from './runtimeTranslations';

export const prefetchNavigationTarget = (page: PageView, nextLanguage: Language) => {
  preloadTranslationDictionary(nextLanguage);
  preloadPageComponent(page);
};

export const getNavigationPrefetchHandlers = (page: PageView, nextLanguage: Language) => ({
  onMouseEnter: () => prefetchNavigationTarget(page, nextLanguage),
  onFocus: () => prefetchNavigationTarget(page, nextLanguage),
  onTouchStart: () => prefetchNavigationTarget(page, nextLanguage),
});
