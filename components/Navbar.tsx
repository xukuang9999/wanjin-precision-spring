import React, { useState } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { PageView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, LANGUAGES } from '../utils/translations';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView, language?: Language) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: t('nav_home'), value: PageView.HOME },
    { label: t('nav_about'), value: PageView.ABOUT },
    { label: t('nav_products'), value: PageView.PRODUCTS },
    { label: t('nav_capacity'), value: PageView.CAPACITY },
    { label: t('nav_factory'), value: PageView.FACTORY },
    { label: t('nav_contact'), value: PageView.CONTACT },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <button
            type="button"
            aria-label="Go to home page"
            className="flex-shrink-0 flex items-center cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => onNavigate(PageView.HOME)}
          >
            <img src="/factory/logo.jpeg" alt="Wanjin Logo" className="h-20 w-auto object-contain mr-4 mix-blend-darken filter contrast-125" />
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">{t('company_name')}</h1>
              <p className="text-sm text-slate-600 uppercase tracking-widest">{t('company_name_en')}</p>
            </div>
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors duration-200 ${currentPage === item.value
                    ? 'text-slate-900 border-b-2 border-brand-500'
                    : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {item.label}
              </button>
            ))}

            {/* Language Switcher */}
            <div className="relative flex items-center gap-1">
              <Globe className="w-4 h-4 text-slate-600" />
              <select
                value={language}
                onChange={(e) => {
                  const nextLanguage = e.target.value as Language;
                  setLanguage(nextLanguage);
                  onNavigate(currentPage, nextLanguage);
                }}
                className="bg-transparent text-sm font-medium text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer appearance-none pr-4"
                style={{ backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right center', backgroundSize: '12px' }}
              >
                {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                  <option key={lang} value={lang} className="text-slate-900">
                    {LANGUAGES[lang]}
                  </option>
                ))}
              </select>
            </div>

            <a
              href="tel:+8618729383359"
              className="ml-2 px-4 py-2 bg-accent-500 text-slate-900 rounded-md text-xs font-bold hover:bg-accent-400 transition shadow-lg shadow-black/40 flex items-center gap-2"
            >
              <Phone className="w-3 h-3" />
              {t('phone_val')}
            </a>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden flex items-center gap-4">
            {/* Mobile Lang Switcher (Simplified Dropdown) */}
            <select
              value={language}
              onChange={(e) => {
                const nextLanguage = e.target.value as Language;
                setLanguage(nextLanguage);
                onNavigate(currentPage, nextLanguage);
              }}
              className="bg-transparent text-xs font-bold text-slate-600 focus:outline-none border border-slate-300 rounded px-1 py-1 cursor-pointer appearance-none"
            >
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <option key={lang} value={lang} className="text-slate-900">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-slate-600 hover:text-slate-900 p-2"
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
        <div id="mobile-nav-menu" className="lg:hidden bg-white border-t border-white/10 absolute w-full shadow-2xl shadow-black/50">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${currentPage === item.value
                    ? 'bg-slate-50 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                {item.label}
              </button>
            ))}
            <a
              href="tel:+8618729383359"
              className="flex items-center gap-3 px-3 py-4 text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 rounded-md"
            >
              <Phone className="w-5 h-5" />
              {t('phone_val')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
