import React from 'react';
import { ArrowRight, Clock, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { ResponsiveImage } from './ResponsiveImage';
import { PRODUCT_DATA } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedPath, PageView } from '../types';
import { type Language } from '../utils/languages';
import { getNavigationPrefetchHandlers } from '../utils/navigationPrefetch';

interface FooterProps {
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const linkedinHref = 'https://www.linkedin.com/company/wanjin-spring/';

  const sitemapPages = [
    { label: t('nav_home'), value: PageView.HOME },
    { label: t('nav_about'), value: PageView.ABOUT },
    { label: t('nav_products'), value: PageView.PRODUCTS },
    { label: t('nav_capacity'), value: PageView.CAPACITY },
    { label: t('nav_factory'), value: PageView.FACTORY },
    { label: t('nav_blog'), value: PageView.BLOG },
    { label: t('nav_faq'), value: PageView.FAQ },
    { label: t('nav_contact'), value: PageView.CONTACT },
  ];

  const sitemapProducts = PRODUCT_DATA.map((product) => ({
    label: t(product.nameKey),
    href: getLocalizedPath(PageView.PRODUCTS, language, product.slug),
    slug: product.slug,
  }));

  const getPrefetchProps = (page: PageView, nextLanguage = language) =>
    getNavigationPrefetchHandlers(page, nextLanguage);

  return (
    <footer className="relative overflow-hidden bg-[linear-gradient(180deg,#06192f_0%,#07203a_48%,#0a2846_100%)] py-12 text-slate-100 sm:py-16">
      <div className="site-grid-pattern absolute inset-0 opacity-20" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 overflow-hidden rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_32px_100px_rgba(2,12,27,0.18)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
            <div>
              <div className="site-kicker text-[#ffe39a]">
                <span className="site-kicker-dot bg-accent-400" />
                {t('email_us_title')}
              </div>
              <h2 className="apple-section-title mt-4 text-white">{t('btn_send_email')}</h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-[18px]">{t('email_us_desc')}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a href={emailHref} className="site-button-primary w-full justify-center">
                {t('btn_send_email')}
                <Mail className="h-4 w-4 text-accent-400" />
              </a>
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                {...getPrefetchProps(PageView.CONTACT)}
                className="site-button-secondary w-full justify-center"
              >
                {t('btn_contact')}
                <ArrowRight className="h-4 w-4 text-accent-400" />
              </button>
            </div>
          </div>

          <div className="site-divider mt-8" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.92fr)_minmax(320px,0.88fr)] lg:gap-10">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 sm:p-7">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-[22px] border border-white/10 bg-white/8 p-2 backdrop-blur">
                  <ResponsiveImage
                    src="/factory/logo.jpeg"
                    alt={t('company_name_en')}
                    width="886"
                    height="886"
                    sizes="56px"
                    imgClassName="h-full w-full object-contain"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white sm:text-[2rem]">{t('company_name')}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-400 sm:text-sm">{t('company_name_en')}</p>
                </div>
              </div>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-[18px]">{t('footer_desc')}</p>

              <div className="mt-6 flex flex-wrap gap-2.5">
                <a
                  href={phoneHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/12"
                >
                  <Phone className="h-4 w-4 text-accent-400" />
                  {t('phone_val')}
                </a>
                <a
                  href={emailHref}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-slate-100 transition hover:bg-white/12"
                >
                  <Mail className="h-4 w-4 text-accent-400" />
                  sales@wanjinspring.com
                </a>
              </div>

              <div className="mt-6 text-sm text-slate-400">
                {t('footer_company_code')}: 91610125MA6UU9L314
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 sm:p-7">
              <div className="site-kicker text-[#ffe39a]">
                <span className="site-kicker-dot bg-accent-400" />
                {t('footer_sitemap_kicker')}
              </div>
              <h4 className="mt-4 text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[2rem]">{t('footer_sitemap_title')}</h4>

              <div className="mt-6 grid gap-8 sm:grid-cols-2">
                <nav aria-label={t('footer_sitemap_pages')}>
                  <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{t('footer_sitemap_pages')}</h5>
                  <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:text-base">
                    {sitemapPages.map((link) => (
                      <li key={link.label}>
                        <a
                          href={getLocalizedPath(link.value, language)}
                          onClick={(event) => {
                            event.preventDefault();
                            onNavigate(link.value, language);
                          }}
                          {...getPrefetchProps(link.value)}
                          className="transition hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label={t('footer_sitemap_products')}>
                  <h5 className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">{t('footer_sitemap_products')}</h5>
                  <ul className="mt-4 grid gap-3 text-sm text-slate-300 sm:text-base">
                    {sitemapProducts.slice(0, 10).map((link) => (
                      <li key={link.slug}>
                        <a
                          href={link.href}
                          onClick={(event) => {
                            event.preventDefault();
                            onNavigate(PageView.PRODUCTS, language, link.slug);
                          }}
                          {...getPrefetchProps(PageView.PRODUCTS)}
                          className="transition hover:text-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/6 p-6 sm:p-7">
              <h4 className="text-2xl font-semibold tracking-[-0.02em] text-white sm:text-[2rem]">{t('contact_title')}</h4>
              <ul className="mt-6 space-y-5 text-base text-slate-300 sm:text-[18px]">
                <li className="flex items-start gap-3">
                  <MapPin className="mt-1 h-6 w-6 flex-shrink-0 text-slate-400" />
                  <span className="leading-8">{t('address_val')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-6 w-6 flex-shrink-0 text-slate-400" />
                  <a href={phoneHref} className="transition hover:text-white">
                    {t('phone_val')}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-6 w-6 flex-shrink-0 text-slate-400" />
                  <a href={emailHref} className="transition hover:text-white">
                    sales@wanjinspring.com
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Linkedin className="h-6 w-6 flex-shrink-0 text-slate-400" />
                  <a href={linkedinHref} target="_blank" rel="noreferrer" className="transition hover:text-white">
                    {t('linkedin_label')}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="h-6 w-6 flex-shrink-0 text-slate-400" />
                  <span>{t('working_hours')}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
            <p>
              &copy; {new Date().getFullYear()} {t('company_name_en')} | {t('rights_reserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
