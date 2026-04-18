import React, { startTransition, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Linkedin, Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
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
  const linkedInHref = 'https://www.linkedin.com/company/wanjin-spring/';
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
    <div className="page-canvas pt-20 pb-16 sm:pt-24 sm:pb-24">
      <section className="page-shell">
        <div className="page-dark-card p-6 sm:p-8 lg:p-10">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(340px,1.1fr)] lg:gap-8">
            <div className="max-w-2xl">
              <p className="page-kicker-gold">{t('email_us_title')}</p>
              <h1 className="apple-section-title mt-4 text-white">{t('contact_title')}</h1>
              <p className="mt-4 text-base leading-relaxed text-slate-200 sm:text-[17px]">{t('email_us_desc')}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={phoneHref}
                className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/10 p-4 transition hover:bg-white/14 sm:p-5"
              >
                <div className="page-icon-badge">
                  <Phone className="h-4 w-4 text-accent-500" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{t('form_phone')}</div>
                  <div className="mt-1 text-base font-semibold text-white">{t('phone_val')}</div>
                  <div className="mt-1 text-xs text-slate-400">{t('contact_manager')}</div>
                </div>
              </a>

              <a
                href={emailHref}
                className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/10 p-4 transition hover:bg-white/14 sm:p-5"
              >
                <div className="page-icon-badge">
                  <Mail className="h-4 w-4 text-accent-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{t('form_email')}</div>
                  <div className="mt-1 break-all text-base font-semibold text-white">sales@wanjinspring.com</div>
                </div>
              </a>

              <a
                href={linkedInHref}
                target="_blank"
                rel="noreferrer"
                aria-label={t('linkedin_label')}
                className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/10 p-4 transition hover:bg-white/14 sm:p-5"
              >
                <div className="page-icon-badge">
                  <Linkedin className="h-4 w-4 text-accent-500" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{t('linkedin_label')}</div>
                  <div className="mt-1 break-all text-base font-semibold text-white">linkedin.com/company/wanjin-spring</div>
                </div>
              </a>

              <div className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-white/10 p-4 sm:p-5">
                <div className="page-icon-badge">
                  <MapPin className="h-4 w-4 text-accent-500" />
                </div>
                <div>
                  <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">{t('address_label')}</div>
                  <div className="mt-1 text-sm leading-relaxed text-white">{t('address_val')}</div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4 sm:col-span-2 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent-400" />
                  <p className="text-sm font-semibold text-[#ffe39a]">{t('wechat_label')}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 rounded-xl border border-white/10 bg-white p-1.5 sm:w-24">
                    <ResponsiveImage
                      src="/factory/wechat_qr.png"
                      alt={t('wechat_label')}
                      width="256"
                      height="256"
                      imgClassName="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">{t('response_time_note')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-6 sm:mt-8">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[1.05fr_1.4fr]">
          <section className="page-soft-card page-accent-line p-6 sm:p-8">
            <p className="page-kicker">{t('contact_prep_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_prep_title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{t('contact_prep_desc')}</p>
            <div className="mt-6 space-y-3 sm:space-y-4">
              {prepChecklistKeys.map((key) => (
                <div key={key} className="rounded-[20px] border border-slate-200 bg-white p-3.5 sm:rounded-[24px] sm:p-4">
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

          <section className="page-white-card p-6 sm:p-8">
            <p className="page-kicker">{t('contact_articles_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_articles_title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{t('contact_articles_desc')}</p>
            <div className="mt-6 grid gap-4 sm:gap-5 md:grid-cols-3">
              {blogState
                ? blogState.prepArticles.map((post, index) => {
                    const localized = blogState.blogModule.getLocalizedPost(post, language);
                    return (
                      <article key={post.slug} className={`page-soft-card p-4 sm:p-5 ${index === 2 ? 'hidden md:block' : ''}`}>
                        <div className="page-chip-soft">{localized.categoryLabel}</div>
                        <h3 className="mt-4 text-base font-semibold leading-snug text-slate-950 sm:text-lg">{localized.title}</h3>
                        <p className="mt-3 text-sm text-slate-500">{blogState.blogModule.formatBlogDate(post.publishedAt, language)}</p>
                        <p className="line-clamp-3 mt-4 text-sm leading-relaxed text-slate-600">{localized.excerpt}</p>
                        <button
                          type="button"
                          onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500 sm:mt-5"
                        >
                          {t('contact_articles_cta')} <ArrowRight className="h-4 w-4 text-accent-500" />
                        </button>
                      </article>
                    );
                  })
                : Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className={`page-soft-card p-4 sm:p-5 ${index === 2 ? 'hidden md:block' : ''}`}>
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

      <section className="page-shell page-deferred-section mt-6 sm:mt-8">
        <section className="page-soft-card page-accent-line p-6 sm:p-8">
          <p className="page-kicker">{t('contact_delivery_title')}</p>
          <h2 className="apple-card-title mt-4 text-slate-950">{t('contact_delivery_title')}</h2>
          <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-600 sm:text-base">{t('contact_delivery_desc')}</p>
          <div className="mt-6 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-2 xl:grid-cols-4">
            {[
              'contact_delivery_item_1',
              'contact_delivery_item_2',
              'contact_delivery_item_3',
              'contact_delivery_item_4',
            ].map((key) => (
              <div key={key} className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
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
