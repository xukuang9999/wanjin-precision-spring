import React, { Suspense, lazy, startTransition, useEffect, useState } from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DEFAULT_LANGUAGE, getLocaleStateFromPath, getLocalizedPath, PageView } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { type Language } from './utils/languages';
import { scheduleIdleTask } from './utils/idle';
import { pageComponentLoaders } from './utils/pageLoaders';
import { type TranslationDictionary } from './utils/runtimeTranslations';

const Home = lazy(pageComponentLoaders[PageView.HOME]);
const About = lazy(pageComponentLoaders[PageView.ABOUT]);
const Products = lazy(pageComponentLoaders[PageView.PRODUCTS]);
const Capacity = lazy(pageComponentLoaders[PageView.CAPACITY]);
const Factory = lazy(pageComponentLoaders[PageView.FACTORY]);
const Contact = lazy(pageComponentLoaders[PageView.CONTACT]);
const Faq = lazy(pageComponentLoaders[PageView.FAQ]);
const Blog = lazy(pageComponentLoaders[PageView.BLOG]);
const SeoManager = lazy(() => import('./components/SeoManager').then((module) => ({ default: module.SeoManager })));
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
        const legacyPage = hash.replace('#', '').trim().toLowerCase();
        const targetPage = (Object.values(PageView) as PageView[]).find((page) => page.toLowerCase() === legacyPage);
        if (targetPage) {
          const targetPath = getLocalizedPath(targetPage, language);
          window.history.replaceState({}, '', targetPath);
          startTransition(() => {
            setLanguage(language);
            setCurrentPage(targetPage);
          });
          return;
        }
      }

      const state = getLocaleStateFromPath(pathname);
      startTransition(() => {
        setLanguage(state.language);
        setCurrentPage(state.page);
        setCurrentSlug(state.slug);
      });
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
    let cancelled = false;
    let cancelIdleTask = () => {};

    const loadChatWhenIdle = (timeout: number) => {
      cancelIdleTask();
      cancelIdleTask = scheduleIdleTask(() => {
        if (!cancelled) {
          setShouldLoadChat(true);
        }
      }, timeout);
    };

    const handleFirstInteraction = () => {
      detachInteractionListeners();
      loadChatWhenIdle(900);
    };

    const detachInteractionListeners = () => {
      window.removeEventListener('pointerdown', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('scroll', handleFirstInteraction);
    };

    window.addEventListener('pointerdown', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction);
    window.addEventListener('scroll', handleFirstInteraction, { passive: true });
    loadChatWhenIdle(4200);

    return () => {
      cancelled = true;
      detachInteractionListeners();
      cancelIdleTask();
    };
  }, []);

  const navigateTo = (page: PageView, nextLanguage = language, slug?: string, search?: string) => {
    const nextPath = getLocalizedPath(page, nextLanguage, slug);
    const nextUrl = search ? `${nextPath}?${search}` : nextPath;
    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
    startTransition(() => {
      setLanguage(nextLanguage);
      setCurrentPage(page);
      setCurrentSlug(page === PageView.BLOG || page === PageView.PRODUCTS ? slug : undefined);
    });
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
      case PageView.FAQ:
        return <Faq onNavigate={navigateTo} />;
      case PageView.BLOG:
        return <Blog slug={currentSlug} onNavigate={navigateTo} />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_26%,#f8fafc_58%,#ffffff_100%)]">
      <Suspense fallback={null}>
        <SeoManager currentPage={currentPage} productSlug={currentPage === PageView.PRODUCTS ? currentSlug : undefined} blogSlug={currentPage === PageView.BLOG ? currentSlug : undefined} />
      </Suspense>
      <Navbar currentPage={currentPage} currentContentSlug={currentSlug} onNavigate={navigateTo} />
      
      <main className="flex-grow">
        <Suspense
          fallback={
            <div className="page-shell py-28 sm:py-32">
              <div className="site-soft-panel overflow-hidden rounded-[32px] p-6 sm:p-8">
                <div className="h-3 w-24 rounded-full bg-slate-200" />
                <div className="mt-6 h-12 max-w-2xl rounded-[20px] bg-slate-200" />
                <div className="mt-4 h-6 max-w-3xl rounded-full bg-slate-100" />
                <div className="mt-3 h-6 max-w-2xl rounded-full bg-slate-100" />
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="h-40 rounded-[24px] bg-slate-100" />
                  ))}
                </div>
              </div>
            </div>
          }
        >
          {renderPage()}
        </Suspense>
      </main>

      <Footer onNavigate={navigateTo} />
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
    <AppErrorBoundary>
      <LanguageProvider initialDictionary={initialDictionary} language={language} onLanguageChange={setLanguage}>
        <AppContent
          language={language}
          setLanguage={setLanguage}
          initialPage={initialRouteState.page}
          initialSlug={initialRouteState.slug}
        />
      </LanguageProvider>
    </AppErrorBoundary>
  );
}
