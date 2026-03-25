import React, { useState } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { PageView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { type Language, LANGUAGES } from '../utils/languages';

interface NavbarProps {
  currentPage: PageView;
  currentContentSlug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, currentContentSlug, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: t('nav_about'), value: PageView.ABOUT },
    { label: t('nav_products'), value: PageView.PRODUCTS },
    { label: t('nav_capacity'), value: PageView.CAPACITY },
    { label: t('nav_factory'), value: PageView.FACTORY },
    { label: t('nav_blog'), value: PageView.BLOG },
    { label: t('nav_contact'), value: PageView.CONTACT },
  ];

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/60 bg-white/72 shadow-[0_12px_48px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            aria-label="Go to home page"
            className="flex-shrink-0 flex items-center cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => onNavigate(PageView.HOME)}
          >
            <img
              src="/factory/logo.jpeg"
              alt=""
              width="886"
              height="886"
              className="mr-3 h-12 w-12 flex-shrink-0 object-contain mix-blend-darken contrast-125 sm:h-14 sm:w-14"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="flex flex-col justify-center">
              <div className="text-lg font-semibold leading-tight tracking-tight text-slate-950 sm:text-xl">{t('company_name')}</div>
              <p className="text-[11px] uppercase tracking-[0.28em] text-slate-500 sm:text-xs">{t('company_name_en')}</p>
              <span className="mt-1 h-[2px] w-12 rounded-full bg-[linear-gradient(90deg,#facc15_0%,#eab308_100%)]" />
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`rounded-full px-4 py-2 text-[12px] font-normal leading-4 tracking-[-0.01em] transition-colors duration-200 ${currentPage === item.value
                    ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_10px_24px_rgba(250,204,21,0.12)]'
                    : 'text-slate-600 hover:bg-accent-400/10 hover:text-slate-950'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="relative ml-2 flex items-center gap-1 rounded-full border border-accent-400/20 bg-white/80 px-3 py-2">
              <Globe className="w-4 h-4 text-accent-500" />
              <label htmlFor="desktop-language-select" className="sr-only">Select language</label>
              <select
                id="desktop-language-select"
                value={language}
                onChange={(e) => {
                  const nextLanguage = e.target.value as Language;
                  setLanguage(nextLanguage);
                  onNavigate(
                    currentPage,
                    nextLanguage,
                    currentPage === PageView.BLOG || currentPage === PageView.PRODUCTS ? currentContentSlug : undefined
                  );
                }}
                className="cursor-pointer appearance-none bg-transparent pr-4 text-[12px] font-normal leading-4 tracking-[-0.01em] text-slate-600 hover:text-slate-900 focus:outline-none"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
              >
                {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                  <option key={lang} value={lang} className="text-slate-900">
                    {LANGUAGES[lang]}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Mobile Button */}
          <div className="flex items-center gap-3 lg:hidden">
            {/* Mobile Lang Switcher (Simplified Dropdown) */}
            <label htmlFor="mobile-language-select" className="sr-only">Select language</label>
            <select
              id="mobile-language-select"
              value={language}
              onChange={(e) => {
                const nextLanguage = e.target.value as Language;
                setLanguage(nextLanguage);
                onNavigate(
                  currentPage,
                  nextLanguage,
                    currentPage === PageView.BLOG || currentPage === PageView.PRODUCTS ? currentContentSlug : undefined
                  );
                }}
              className="cursor-pointer appearance-none rounded-full border border-accent-400/20 bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 focus:outline-none"
            >
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <option key={lang} value={lang} className="text-slate-900">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="rounded-full border border-accent-400/20 bg-white/80 p-2 text-slate-600 transition hover:bg-accent-400/10 hover:text-slate-900"
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div id="mobile-nav-menu" className="absolute w-full border-t border-white/60 bg-white/88 shadow-[0_24px_80px_rgba(15,23,42,0.14)] backdrop-blur-xl lg:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMobileOpen(false);
                }}
                className={`block w-full rounded-2xl px-3 py-4 text-left text-base font-medium ${currentPage === item.value
                    ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white'
                    : 'text-slate-600 hover:bg-accent-400/10 hover:text-slate-900'
                  }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
