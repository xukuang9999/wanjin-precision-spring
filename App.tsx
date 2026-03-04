import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatWidget } from './components/ChatWidget';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Products } from './pages/Products';
import { Capacity } from './pages/Capacity';
import { Contact } from './pages/Contact';
import { PageView } from './types';
import { LanguageProvider } from './contexts/LanguageContext';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageView>(PageView.HOME);

  // Simple hash-based router simulation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && Object.values(PageView).includes(hash as PageView)) {
        setCurrentPage(hash as PageView);
      } else {
        setCurrentPage(PageView.HOME);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Init

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (page: PageView) => {
    window.location.hash = page;
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
      case PageView.CONTACT:
        return <Contact />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-900">
      <Navbar currentPage={currentPage} onNavigate={navigateTo} />
      
      <main className="flex-grow">
        {renderPage()}
      </main>

      <Footer />
      <ChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}