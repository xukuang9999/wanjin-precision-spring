import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedPath, PageView } from '../types';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const quickLinks = [
    { label: t('nav_products'), href: getLocalizedPath(PageView.PRODUCTS, language) },
    { label: t('nav_capacity'), href: getLocalizedPath(PageView.CAPACITY, language) },
    { label: t('nav_factory'), href: getLocalizedPath(PageView.FACTORY, language) },
    { label: t('nav_blog'), href: getLocalizedPath(PageView.BLOG, language) },
    { label: t('nav_contact'), href: getLocalizedPath(PageView.CONTACT, language) },
  ];

  return (
    <footer className="bg-[linear-gradient(145deg,#041221_0%,#08213c_50%,#0a3059_100%)] py-14 text-slate-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
          {/* Company Info */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/12 backdrop-blur">
                <span className="text-lg font-bold text-white">W</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{t('company_name')}</h3>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{t('company_name_en')}</p>
              </div>
            </div>
            <p className="mb-5 max-w-md text-sm leading-7 text-slate-300">
              {t('footer_desc')}
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-5 text-xs text-slate-400">
              Code: 91610125MA6UU9L314
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">{t('contact_title')}</h4>
            <ul className="space-y-4 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-slate-400" />
                <span className="leading-6">{t('address_val')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0 text-slate-400" />
                <a href={phoneHref} className="transition hover:text-white">
                  {t('phone_val')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0 text-slate-400" />
                <a href={emailHref} className="transition hover:text-white">
                  sales@wanjinspring.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 flex-shrink-0 text-slate-400" />
                <span>{t('working_hours')}</span>
              </li>
            </ul>
          </div>

          {/* Location */}
          <div>
            <h4 className="mb-5 text-lg font-semibold text-white">{t('location_label')}</h4>
            <div className="relative h-full min-h-48 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(122,177,218,0.28),_transparent_42%)]" />
              <div className="relative flex h-full flex-col justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">{t('location_label')}</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">{t('location_val_short')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} {t('company_name_en')} | {t('rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};
