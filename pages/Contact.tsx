import React from 'react';
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { Language } from '../utils/translations';
import { formatBlogDate, getLocalizedPost, getRelevantBlogPosts } from '../utils/blog';

interface ContactProps {
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const prepArticles = getRelevantBlogPosts(['drawing review', 'load testing', 'material selection', 'export packaging'], 3);
  const prepChecklistKeys = ['contact_prep_item_1', 'contact_prep_item_2', 'contact_prep_item_3'];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 h-64 w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/factory/factory_20.jpg"
            alt="Industrial Facility"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <h1 className="text-4xl font-bold text-white relative z-10">{t('contact_title')}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Replacement for Contact Form */}
          <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-blue-50 rounded-full mb-6">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('email_us_title')}</h2>
            <p className="text-slate-600 mb-8 max-w-md">
              {t('email_us_desc')}
            </p>
            <a 
              href={emailHref}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Mail className="w-5 h-5" />
              {t('btn_send_email')}
            </a>
            <p className="mt-6 text-sm text-slate-400">
              {t('response_time_note')}
            </p>
          </div>

          {/* Info Side */}
          <div className="bg-slate-50 p-8 md:p-12 md:w-2/5 border-l border-slate-100 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-900 mb-8">{t('contact_info')}</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('form_phone')}</div>
                  <a href={phoneHref} className="text-lg font-bold text-slate-900 font-mono hover:text-blue-600 transition">
                    {t('phone_val')}
                  </a>
                  <div className="text-xs text-slate-400">{t('contact_manager')}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('form_email')}</div>
                  <a href={emailHref} className="text-lg font-bold text-slate-900 break-all hover:text-blue-600 transition">
                    sales@wanjinspring.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('address_label')}</div>
                  <div className="text-base text-slate-900">{t('address_val')}</div>
                </div>
              </div>
            </div>

            {/* WeChat Section */}
            <div className="mt-10 p-5 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-slate-700">{t('wechat_label')}</p>
              </div>
              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-slate-200 p-2 bg-white">
                <img 
                  src="/factory/wechat_qr.png" 
                  alt="WeChat QR Code" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1.05fr_1.4fr] gap-8">
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('contact_prep_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('contact_prep_desc')}</p>
            <div className="mt-6 space-y-4">
              {prepChecklistKeys.map((key) => (
                <div key={key} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <CheckCircle2 className="mt-0.5 w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-700">{t(key)}</p>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate(PageView.BLOG, language)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 hover:text-blue-700"
            >
              {t('contact_prep_view_blog')} <ArrowRight className="w-4 h-4" />
            </button>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('contact_articles_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('contact_articles_desc')}</p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              {prepArticles.map((post) => {
                const localized = getLocalizedPost(post, language);
                return (
                  <article key={post.slug} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {localized.categoryLabel}
                    </div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">{localized.title}</h3>
                    <p className="mt-3 text-sm text-slate-500">{formatBlogDate(post.publishedAt, language)}</p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">{localized.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {t('contact_articles_cta')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">{t('contact_delivery_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('contact_delivery_desc')}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              'contact_delivery_item_1',
              'contact_delivery_item_2',
              'contact_delivery_item_3',
              'contact_delivery_item_4',
            ].map((key) => (
              <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 w-5 h-5 text-blue-600 flex-shrink-0" />
                  <p className="text-sm leading-relaxed text-slate-700">{t(key)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
