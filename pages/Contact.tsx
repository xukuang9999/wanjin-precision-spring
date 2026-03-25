import React, { startTransition, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { type Language } from '../utils/languages';
import { scheduleIdleTask } from '../utils/idle';
import { loadBlogModule, type BlogModule } from '../utils/loadBlogModule';

interface ContactProps {
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

type ContactBlogState = {
  blogModule: BlogModule;
  prepArticles: ReturnType<BlogModule['getRelevantBlogPosts']>;
};

export const Contact: React.FC<ContactProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [blogState, setBlogState] = useState<ContactBlogState | null>(null);
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const prepChecklistKeys = ['contact_prep_item_1', 'contact_prep_item_2', 'contact_prep_item_3'];

  useEffect(() => {
    let cancelled = false;

    const cancelIdleTask = scheduleIdleTask(() => {
      void loadBlogModule()
        .then((blogModule) => {
          if (cancelled) {
            return;
          }

          startTransition(() => {
            setBlogState({
              blogModule,
              prepArticles: blogModule.getRelevantBlogPosts(
                ['drawing review', 'load testing', 'material selection', 'export packaging'],
                3,
              ),
            });
          });
        })
        .catch((error) => {
          console.error('Failed to load contact page articles:', error);
        });
    }, 1100);

    return () => {
      cancelled = true;
      cancelIdleTask();
    };
  }, []);

  return (
    <div className="page-canvas pt-24 pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('contact_title')}</h1>
              <p className="apple-body mt-6 max-w-2xl text-slate-200">{t('email_us_desc')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={emailHref} className="page-primary-button">
                  <Mail className="h-4 w-4 text-accent-400" />
                  {t('btn_send_email')}
                </a>
                <a href={phoneHref} className="page-dark-button">
                  <Phone className="h-4 w-4 text-accent-400" />
                  {t('phone_val')}
                </a>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="overflow-hidden rounded-[28px]">
                <img
                  src="/factory/factory_20.jpg"
                  alt="Industrial Facility"
                  width="1600"
                  height="900"
                  className="h-full min-h-[420px] w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="page-soft-card page-accent-line p-8 md:p-10">
            <div className="page-icon-badge">
              <Mail className="h-8 w-8 text-accent-500" />
            </div>
            <h2 className="apple-section-title mt-6 text-slate-950">{t('email_us_title')}</h2>
            <p className="mt-4 max-w-xl text-slate-600">{t('email_us_desc')}</p>
            <a href={emailHref} className="page-primary-button mt-8">
              <Mail className="h-4 w-4 text-accent-400" />
              {t('btn_send_email')}
            </a>
            <p className="mt-5 text-sm text-slate-400">{t('response_time_note')}</p>
          </div>

          <div className="page-dark-card p-8 md:p-10">
            <p className="page-kicker-gold">{t('contact_info')}</p>
            <h2 className="apple-card-title mt-4 text-white">{t('contact_info')}</h2>
            <div className="mt-8 space-y-6">
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="page-icon-badge">
                    <Phone className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300">{t('form_phone')}</div>
                    <a href={phoneHref} className="mt-1 block text-lg font-semibold text-white hover:text-[#ffe39a]">
                      {t('phone_val')}
                    </a>
                    <div className="mt-1 text-xs text-slate-400">{t('contact_manager')}</div>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="page-icon-badge">
                    <Mail className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300">{t('form_email')}</div>
                    <a href={emailHref} className="mt-1 block break-all text-lg font-semibold text-white hover:text-[#ffe39a]">
                      sales@wanjinspring.com
                    </a>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                <div className="flex items-start gap-4">
                  <div className="page-icon-badge">
                    <MapPin className="h-5 w-5 text-accent-500" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-300">{t('address_label')}</div>
                    <div className="mt-1 text-base text-white">{t('address_val')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-white/10 bg-white/10 p-5">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-accent-400" />
                <p className="text-sm font-semibold text-[#ffe39a]">{t('wechat_label')}</p>
              </div>
              <div className="w-32 rounded-2xl border border-white/10 bg-white p-2">
                <img
                  src="/factory/wechat_qr.png"
                  alt="WeChat QR Code"
                  width="256"
                  height="256"
                  className="h-full w-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <section className="page-soft-card page-accent-line p-8">
            <p className="page-kicker">{t('contact_prep_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_prep_title')}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t('contact_prep_desc')}</p>
            <div className="mt-6 space-y-4">
              {prepChecklistKeys.map((key) => (
                <div key={key} className="rounded-[24px] border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
                    <p className="text-sm leading-relaxed text-slate-700">{t(key)}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => onNavigate(PageView.BLOG, language)}
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
            >
              {t('contact_prep_view_blog')} <ArrowRight className="h-4 w-4 text-accent-500" />
            </button>
          </section>

          <section className="page-white-card p-8">
            <p className="page-kicker">{t('contact_articles_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_articles_title')}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t('contact_articles_desc')}</p>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {blogState
                ? blogState.prepArticles.map((post) => {
                    const localized = blogState.blogModule.getLocalizedPost(post, language);
                    return (
                      <article key={post.slug} className="page-soft-card p-5">
                        <div className="page-chip-soft">{localized.categoryLabel}</div>
                        <h3 className="mt-4 text-lg font-semibold leading-snug text-slate-950">{localized.title}</h3>
                        <p className="mt-3 text-sm text-slate-500">{blogState.blogModule.formatBlogDate(post.publishedAt, language)}</p>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600">{localized.excerpt}</p>
                        <button
                          type="button"
                          onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
                        >
                          {t('contact_articles_cta')} <ArrowRight className="h-4 w-4 text-accent-500" />
                        </button>
                      </article>
                    );
                  })
                : Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="page-soft-card p-5">
                      <div className="h-6 w-20 rounded-full bg-slate-100" />
                      <div className="mt-4 h-6 w-full rounded-full bg-slate-100" />
                      <div className="mt-3 h-4 w-24 rounded-full bg-slate-100" />
                      <div className="mt-4 h-4 w-full rounded-full bg-slate-100" />
                      <div className="mt-2 h-4 w-5/6 rounded-full bg-slate-100" />
                    </div>
                  ))}
            </div>
          </section>
        </div>
      </section>

      <section className="page-shell mt-8">
        <section className="page-soft-card page-accent-line p-8">
          <p className="page-kicker">{t('contact_delivery_title')}</p>
          <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_delivery_title')}</h2>
          <p className="mt-4 max-w-4xl text-slate-600 leading-relaxed">{t('contact_delivery_desc')}</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              'contact_delivery_item_1',
              'contact_delivery_item_2',
              'contact_delivery_item_3',
              'contact_delivery_item_4',
            ].map((key) => (
              <div key={key} className="rounded-[24px] border border-slate-200 bg-white p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-accent-500" />
                  <p className="text-sm leading-relaxed text-slate-700">{t(key)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};
