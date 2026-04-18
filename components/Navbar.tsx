import React, { useEffect, useState } from 'react';
import { ArrowRight, Clock, Globe, Mail, Menu, Phone, X } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';
import { PageView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { type Language, LANGUAGES } from '../utils/languages';
import { getNavigationPrefetchHandlers } from '../utils/navigationPrefetch';

interface NavbarProps {
  currentPage: PageView;
  currentContentSlug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, currentContentSlug, onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const linkedInHref = 'https://www.linkedin.com/company/wanjin-spring/';

  const navItems = [
    { label: t('nav_about'), value: PageView.ABOUT },
    { label: t('nav_products'), value: PageView.PRODUCTS },
    { label: t('nav_capacity'), value: PageView.CAPACITY },
    { label: t('nav_factory'), value: PageView.FACTORY },
    { label: t('nav_blog'), value: PageView.BLOG },
    { label: t('nav_faq'), value: PageView.FAQ },
    { label: t('nav_contact'), value: PageView.CONTACT },
  ];

  const getPrefetchProps = (page: PageView, nextLanguage = language) =>
    getNavigationPrefetchHandlers(page, nextLanguage);

  const navigatePreservingContent = (page: PageView, nextLanguage = language) => {
    onNavigate(
      page,
      nextLanguage,
      page === PageView.BLOG || page === PageView.PRODUCTS ? currentContentSlug : undefined,
    );
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    setLanguage(nextLanguage);
    navigatePreservingContent(currentPage, nextLanguage);
  };

  useEffect(() => {
    setIsMobileOpen(false);
  }, [currentContentSlug, currentPage, language]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 18);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isMobileOpen) {
      return undefined;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileOpen]);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-slate-200/80 bg-white/88 shadow-[0_16px_60px_rgba(15,23,42,0.08)] backdrop-blur-2xl'
          : 'border-b border-white/60 bg-white/72 shadow-[0_12px_48px_rgba(15,23,42,0.06)] backdrop-blur-xl'
      }`}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-3 transition-all duration-300 ${isScrolled ? 'h-16 sm:h-[4.5rem]' : 'h-16 sm:h-20'}`}>
          <button
            type="button"
            aria-label={t('nav_home')}
            className="flex max-w-[calc(100vw-8.5rem)] items-center gap-2.5 bg-transparent p-0 text-left sm:max-w-none sm:gap-3"
            onClick={() => onNavigate(PageView.HOME)}
            {...getPrefetchProps(PageView.HOME)}
          >
            <div className={`flex items-center justify-center rounded-[20px] border border-slate-200/70 bg-white/90 p-1.5 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-300 ${isScrolled ? 'h-10 w-10' : 'h-11 w-11 sm:h-12 sm:w-12'}`}>
              <ResponsiveImage
                src="/factory/logo.jpeg"
                alt={t('company_name_en')}
                width="886"
                height="886"
                sizes="48px"
                imgClassName="h-full w-full object-contain mix-blend-darken contrast-125"
                loading="eager"
                decoding="async"
              />
            </div>

            <div className="min-w-0">
              <div
                className="truncate font-semibold leading-[1.04] tracking-tight text-slate-950"
                style={{ fontSize: 'clamp(0.94rem, 4vw, 1.08rem)' }}
              >
                {t('company_name')}
              </div>
              <div className="mt-1 hidden items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500 min-[360px]:flex sm:text-xs">
                <span className="truncate">{t('company_name_en')}</span>
                <span className="h-[2px] w-8 rounded-full bg-[linear-gradient(90deg,#facc15_0%,#eab308_100%)]" />
              </div>
            </div>
          </button>

          <div className="hidden flex-1 items-center justify-end gap-2 lg:flex">
            <div className="mr-2 flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  aria-current={currentPage === item.value ? 'page' : undefined}
                  onClick={() => onNavigate(item.value)}
                  {...getPrefetchProps(item.value)}
                  className={`rounded-full px-3.5 py-2 text-[12px] font-semibold leading-4 tracking-[-0.01em] transition ${
                    currentPage === item.value
                      ? 'bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_12px_28px_rgba(18,55,101,0.18)]'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="hidden items-center gap-2 xl:flex">
              <a
                href={phoneHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-accent-400/30 hover:text-slate-950"
              >
                <Phone className="h-4 w-4 text-accent-500" />
                {t('phone_val')}
              </a>
              <div className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <Clock className="h-4 w-4 text-accent-500" />
                {t('working_hours')}
              </div>
            </div>

            <div className="relative flex items-center gap-1 rounded-full border border-slate-200 bg-white/90 px-3 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
              <Globe className="h-4 w-4 text-accent-500" />
              <label htmlFor="desktop-language-select" className="sr-only">
                {t('language_select')}
              </label>
              <select
                id="desktop-language-select"
                value={language}
                onChange={(event) => handleLanguageChange(event.target.value as Language)}
                className="cursor-pointer appearance-none bg-transparent pr-4 text-sm font-semibold text-slate-700 focus:outline-none"
                style={{
                  backgroundImage:
                    "linear-gradient(45deg, transparent 50%, #64748b 50%), linear-gradient(135deg, #64748b 50%, transparent 50%)",
                  backgroundPosition: 'right 0.35rem top 0.65rem, right 0.1rem top 0.65rem',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '6px 6px, 6px 6px',
                }}
              >
                {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                  <option key={lang} value={lang} className="text-slate-900">
                    {LANGUAGES[lang]}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => onNavigate(PageView.CONTACT, language)}
              {...getPrefetchProps(PageView.CONTACT)}
              className="site-button-primary"
            >
              {t('btn_contact')}
              <ArrowRight className="h-4 w-4 text-accent-400" />
            </button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <label htmlFor="mobile-language-select" className="sr-only">
              {t('language_select')}
            </label>
            <select
              id="mobile-language-select"
              value={language}
              onChange={(event) => handleLanguageChange(event.target.value as Language)}
              className="min-h-11 cursor-pointer appearance-none rounded-full border border-slate-200 bg-white/90 px-3 pr-7 text-xs font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] focus:outline-none focus:ring-2 focus:ring-accent-400/20 sm:text-sm"
            >
              {(Object.keys(LANGUAGES) as Language[]).map((lang) => (
                <option key={lang} value={lang} className="text-slate-900">
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => setIsMobileOpen((open) => !open)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/90 text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-accent-400/30 hover:text-slate-950"
              aria-label={isMobileOpen ? t('menu_close') : t('menu_open')}
              aria-expanded={isMobileOpen}
              aria-controls="mobile-nav-menu"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {isMobileOpen && (
        <>
          <button
            type="button"
            aria-label={t('menu_close')}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-slate-950/18 backdrop-blur-[2px] sm:top-20 lg:hidden"
          />

          <div
            id="mobile-nav-menu"
            className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-slate-200/80 bg-white/96 px-3 pb-6 pt-3 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/[0.92] sm:top-20 sm:px-4 sm:pt-4 lg:hidden"
          >
            <div className="site-dark-panel rounded-[28px] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold uppercase tracking-[0.22em] text-[#ffe39a]">{t('company_name_en')}</div>
                  <div className="mt-2 text-lg font-semibold text-white">{t('company_name')}</div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-200">
                  {language.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white"
                >
                  <Phone className="h-4 w-4 text-accent-400" />
                  {t('phone_val')}
                </a>
                <div className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white">
                  <Clock className="h-4 w-4 text-accent-400" />
                  {t('working_hours')}
                </div>
                <a
                  href={emailHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-sm font-medium text-white sm:col-span-2"
                >
                  <Mail className="h-4 w-4 text-accent-400" />
                  sales@wanjinspring.com
                </a>
              </div>
            </div>

            <div className="mt-4 grid gap-2">
              {navItems.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => {
                    onNavigate(item.value);
                    setIsMobileOpen(false);
                  }}
                  {...getPrefetchProps(item.value)}
                  className={`w-full rounded-[24px] border px-4 py-4 text-left text-base font-semibold transition ${
                    currentPage === item.value
                      ? 'border-[#123765] bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_18px_44px_rgba(18,55,101,0.16)]'
                      : 'border-slate-200 bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] hover:border-accent-400/30 hover:text-slate-950'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate(PageView.CONTACT, language);
                  setIsMobileOpen(false);
                }}
                {...getPrefetchProps(PageView.CONTACT)}
                className="site-button-primary w-full justify-center"
              >
                {t('btn_contact')}
                <ArrowRight className="h-4 w-4 text-accent-400" />
              </button>
              <a
                href={linkedInHref}
                target="_blank"
                rel="noreferrer"
                className="site-button-secondary w-full justify-center"
              >
                {t('linkedin_label')}
                <ArrowRight className="h-4 w-4 text-accent-400" />
              </a>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};
