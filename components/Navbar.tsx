import React, { useState } from 'react';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { PageView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Language, LANGUAGES } from '../utils/translations';

interface NavbarProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const navItems = [
    { label: t('nav_home'), value: PageView.HOME },
    { label: t('nav_about'), value: PageView.ABOUT },
    { label: t('nav_products'), value: PageView.PRODUCTS },
    { label: t('nav_capacity'), value: PageView.CAPACITY },
    { label: t('nav_contact'), value: PageView.CONTACT },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => onNavigate(PageView.HOME)}>
            <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
               <span className="text-white font-bold text-xl">W</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">万锦精密弹簧</h1>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Wanjin Precision</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex space-x-6 items-center">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => onNavigate(item.value)}
                className={`text-sm font-medium transition-colors duration-200 ${
                  currentPage === item.value
                    ? 'text-slate-900 border-b-2 border-slate-900'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item.label}
              </button>
            ))}
            
            {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 text-sm font-medium"
              >
                <Globe className="w-4 h-4" />
                {LANGUAGES[language].split(' ')[0]}
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 py-1 grid grid-cols-1 overflow-hidden z-50">
                  {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm text-left hover:bg-slate-50 ${language === lang ? 'text-blue-600 font-bold' : 'text-slate-700'}`}
                    >
                      {LANGUAGES[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a 
              href="tel:+8618729383359"
              className="ml-2 px-4 py-2 bg-slate-900 text-white rounded-full text-xs font-medium hover:bg-slate-800 transition shadow-lg flex items-center gap-2"
            >
              <Phone className="w-3 h-3" />
              {t('phone_val')}
            </a>
          </div>

          {/* Mobile Button */}
          <div className="lg:hidden flex items-center gap-4">
             {/* Mobile Lang Switcher (Simplified) */}
             <button 
                onClick={() => {
                  const langs = Object.keys(LANGUAGES) as Language[];
                  const nextIdx = (langs.indexOf(language) + 1) % langs.length;
                  setLanguage(langs[nextIdx]);
                }}
                className="text-slate-500 hover:text-slate-900"
              >
                <span className="font-bold text-xs border border-slate-300 rounded px-1">{language.toUpperCase()}</span>
              </button>
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="text-slate-500 hover:text-slate-900 p-2"
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 absolute w-full shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.value}
                onClick={() => {
                  onNavigate(item.value);
                  setIsMobileOpen(false);
                }}
                className={`block w-full text-left px-3 py-4 rounded-md text-base font-medium ${
                  currentPage === item.value
                    ? 'bg-slate-50 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
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