import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DEFAULT_LANGUAGE, getLocaleStateFromPath, getLocalizedPath, PageView } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { SeoManager } from './components/SeoManager';
import { type Language } from './utils/languages';
import { scheduleIdleTask } from './utils/idle';
import { type TranslationDictionary } from './utils/runtimeTranslations';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const Products = lazy(() => import('./pages/Products').then((module) => ({ default: module.Products })));
const Capacity = lazy(() => import('./pages/Capacity').then((module) => ({ default: module.Capacity })));
const Factory = lazy(() => import('./pages/Factory').then((module) => ({ default: module.Factory })));
const Contact = lazy(() => import('./pages/Contact').then((module) => ({ default: module.Contact })));
const Blog = lazy(() => import('./pages/Blog').then((module) => ({ default: module.Blog })));
const ChatWidget = lazy(() => import('./components/ChatWidget').then((module) => ({ default: module.ChatWidget })));

const getInitialRouteState = () => {
  if (typeof window === 'undefined') {
    return {
      language: DEFAULT_LANGUAGE as Language,
      page: PageView.HOME,
      slug: undefined as string | undefined,
    };
  }

  return getLocaleStateFromPath(window.location.pathname);
};

type RouteState = ReturnType<typeof getInitialRouteState>;

function AppContent({
  language,
  setLanguage,
  initialPage,
  initialSlug,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
  initialPage: PageView;
  initialSlug?: string;
}) {
  const [currentPage, setCurrentPage] = useState<PageView>(initialPage);
  const [currentSlug, setCurrentSlug] = useState<string | undefined>(initialSlug);
  const [shouldLoadChat, setShouldLoadChat] = useState(false);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const syncPageWithLocation = () => {
      const { pathname, hash, search } = window.location;
      if (hash) {
        const legacyPage = hash.replace('#', '');
        if (Object.values(PageView).includes(legacyPage as PageView)) {
          const targetPage = legacyPage as PageView;
          const targetPath = getLocalizedPath(targetPage, language);
          window.history.replaceState({}, '', targetPath);
          setLanguage(language);
          setCurrentPage(targetPage);
          return;
        }
      }

      const state = getLocaleStateFromPath(pathname);
      setLanguage(state.language);
      setCurrentPage(state.page);
      setCurrentSlug(state.slug);
    };

    window.addEventListener('popstate', syncPageWithLocation);
    syncPageWithLocation();
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener('popstate', syncPageWithLocation);
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);

  useEffect(() => {
    return scheduleIdleTask(() => setShouldLoadChat(true), 2200);
  }, []);

  const navigateTo = (page: PageView, nextLanguage = language, slug?: string, search?: string) => {
    const nextPath = getLocalizedPath(page, nextLanguage, slug);
    const nextUrl = search ? `${nextPath}?${search}` : nextPath;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
    setLanguage(nextLanguage);
    setCurrentPage(page);
    setCurrentSlug(page === PageView.BLOG || page === PageView.PRODUCTS ? slug : undefined);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case PageView.HOME:
        return <Home onNavigate={navigateTo} />;
      case PageView.ABOUT:
        return <About />;
      case PageView.PRODUCTS:
        return <Products slug={currentSlug} onNavigate={navigateTo} />;
      case PageView.CAPACITY:
        return <Capacity />;
      case PageView.FACTORY:
        return <Factory />;
      case PageView.CONTACT:
        return <Contact onNavigate={navigateTo} />;
      case PageView.BLOG:
        return <Blog slug={currentSlug} onNavigate={navigateTo} />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <SeoManager currentPage={currentPage} productSlug={currentPage === PageView.PRODUCTS ? currentSlug : undefined} blogSlug={currentPage === PageView.BLOG ? currentSlug : undefined} />
      <Navbar currentPage={currentPage} currentContentSlug={currentSlug} onNavigate={navigateTo} />
      
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-[40vh]" />}>{renderPage()}</Suspense>
      </main>

      <Footer />
      {shouldLoadChat ? (
        <Suspense fallback={null}>
          <ChatWidget />
        </Suspense>
      ) : null}
    </div>
  );
}

export default function App({
  initialDictionary,
  initialRouteState = getInitialRouteState(),
}: {
  initialDictionary?: TranslationDictionary;
  initialRouteState?: RouteState;
}) {
  const [language, setLanguage] = useState<Language>(initialRouteState.language);

  return (
    <LanguageProvider initialDictionary={initialDictionary} language={language} onLanguageChange={setLanguage}>
      <AppContent
        language={language}
        setLanguage={setLanguage}
        initialPage={initialRouteState.page}
        initialSlug={initialRouteState.slug}
      />
    </LanguageProvider>
  );
}
