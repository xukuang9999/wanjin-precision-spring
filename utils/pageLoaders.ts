import { PageView } from '../types';

export const pageComponentLoaders = {
  [PageView.HOME]: () => import('../pages/Home').then((module) => ({ default: module.Home })),
  [PageView.ABOUT]: () => import('../pages/About').then((module) => ({ default: module.About })),
  [PageView.PRODUCTS]: () => import('../pages/Products').then((module) => ({ default: module.Products })),
  [PageView.CAPACITY]: () => import('../pages/Capacity').then((module) => ({ default: module.Capacity })),
  [PageView.FACTORY]: () => import('../pages/Factory').then((module) => ({ default: module.Factory })),
  [PageView.CONTACT]: () => import('../pages/Contact').then((module) => ({ default: module.Contact })),
  [PageView.FAQ]: () => import('../pages/Faq').then((module) => ({ default: module.Faq })),
  [PageView.BLOG]: () => import('../pages/Blog').then((module) => ({ default: module.Blog })),
} as const;

export const preloadPageComponent = (page: PageView) => {
  void pageComponentLoaders[page]();
};
