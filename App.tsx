import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DEFAULT_LANGUAGE, getLocaleStateFromPath, getLocalizedPath, getPathForPage, PageView } from './types';
import { LanguageProvider } from './contexts/LanguageContext';
import { SeoManager } from './components/SeoManager';
import { Language } from './utils/translations';

const Home = lazy(() => import('./pages/Home').then((module) => ({ default: module.Home })));
const About = lazy(() => import('./pages/About').then((module) => ({ default: module.About })));
const Products = lazy(() => import('./pages/Products').then((module) => ({ default: module.Products })));
const Capacity = lazy(() => import('./pages/Capacity').then((module) => ({ default: module.Capacity })));
const Factory = lazy(() => import('./pages/Factory').then((module) => ({ default: module.Factory })));
const Contact = lazy(() => import('./pages/Contact').then((module) => ({ default: module.Contact })));
const ChatWidget = lazy(() => import('./components/ChatWidget').then((module) => ({ default: module.ChatWidget })));

function AppContent({
  language,
  setLanguage,
}: {
  language: Language;
  setLanguage: (lang: Language) => void;
}) {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.HOME);

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const syncPageWithLocation = () => {
      const { pathname, hash } = window.location;
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

  const navigateTo = (page: PageView, nextLanguage = language) => {
    const nextPath = getLocalizedPath(page, nextLanguage);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setLanguage(nextLanguage);
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case PageView.HOME:
        return <Home onNavigate={navigateTo} />;
      case PageView.ABOUT:
        return <About />;
      case PageView.PRODUCTS:
        return <Products />;
      case PageView.CAPACITY:
        return <Capacity />;
      case PageView.FACTORY:
        return <Factory />;
      case PageView.CONTACT:
        return <Contact />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900 bg-slate-50">
      <SeoManager currentPage={currentPage} />
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      
      <main className="flex-grow">
        <Suspense fallback={<div className="min-h-[40vh]" />}>
          {renderPage()}
        </Suspense>
      </main>

      <Footer />
      <Suspense fallback={null}>
        <ChatWidget />
      </Suspense>
    </div>
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  return (
    <LanguageProvider language={language} onLanguageChange={setLanguage}>
      <AppContent language={language} setLanguage={setLanguage} />
    </LanguageProvider>
  );
}
