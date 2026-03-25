import React, { startTransition, useEffect, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Factory,
  Gauge,
  Layers3,
  Mail,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { PRODUCT_DATA } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { type Language } from '../utils/languages';
import { scheduleIdleTask } from '../utils/idle';
import { loadBlogModule, type BlogModule } from '../utils/loadBlogModule';

interface HomeProps {
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

type HomeBlogState = {
  articleByProductSlug: Record<string, string | undefined>;
  blogModule: BlogModule;
  featuredPosts: ReturnType<BlogModule['getFeaturedBlogPosts']>;
};

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();
  const [blogState, setBlogState] = useState<HomeBlogState | null>(null);
  const coreProducts = PRODUCT_DATA;

  const [activeProductSlug, setActiveProductSlug] = useState(coreProducts[0]?.slug ?? '');
  const activeProduct = coreProducts.find((product) => product.slug === activeProductSlug) ?? coreProducts[0];
  const activeProductArticleSlug = activeProduct ? blogState?.articleByProductSlug[activeProduct.slug] : undefined;

  useEffect(() => {
    let cancelled = false;

    const cancelIdleTask = scheduleIdleTask(() => {
      void loadBlogModule()
        .then((blogModule) => {
          if (cancelled) {
            return;
          }

          const articleByProductSlug = Object.fromEntries(
            PRODUCT_DATA.map((product) => [product.slug, blogModule.getRelevantBlogPosts(product.articleTerms, 1)[0]?.slug]),
          );

          startTransition(() => {
            setBlogState({
              articleByProductSlug,
              blogModule,
              featuredPosts: blogModule.getFeaturedBlogPosts().slice(0, 2),
            });
          });
        })
        .catch((error) => {
          console.error('Failed to load homepage blog insights:', error);
        });
    }, 900);

    return () => {
      cancelled = true;
      cancelIdleTask();
    };
  }, []);

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f7fbff_0%,#eef4fb_26%,#f8fafc_58%,#ffffff_100%)] pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(circle_at_top,_rgba(0,55,100,0.16),_transparent_56%)]" />
      <div className="pointer-events-none absolute left-[-120px] top-20 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,_rgba(250,204,21,0.22)_0%,rgba(250,204,21,0.09)_34%,transparent_72%)] blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)] lg:gap-8">
          <div className="flex flex-col justify-center">
            <h1 className="apple-hero-title max-w-4xl text-slate-950">{t('hero_title')}</h1>
            <p className="apple-body mt-4 max-w-2xl text-base text-slate-600 sm:mt-6 sm:text-[17px]">{t('hero_desc')}</p>

            <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.PRODUCTS)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent-400/35 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] px-7 py-4 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(250,204,21,0.12)] transition hover:brightness-110 sm:w-auto"
              >
                {t('btn_explore')}
                <ArrowRight className="h-4 w-4 text-accent-400" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent-400/30 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-900 transition hover:border-accent-400/55 hover:bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] sm:w-auto"
              >
                {t('btn_contact')}
                <ArrowUpRight className="h-4 w-4 text-accent-500" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.ABOUT)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent-400/30 bg-white/80 px-7 py-4 text-sm font-semibold text-slate-900 transition hover:border-accent-400/55 hover:bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] sm:w-auto"
              >
                {t('nav_about')}
                <ArrowUpRight className="h-4 w-4 text-accent-500" />
              </button>
            </div>

            <div className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 xl:grid-cols-4 xl:gap-4">
              <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-4 ring-1 ring-accent-400/12 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
                <div className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.95),transparent)]" />
                <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">≥99%</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">{t('cap_metric_pass_label')}</div>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-4 ring-1 ring-accent-400/12 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
                <div className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.95),transparent)]" />
                <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{t('cap_band_hot_value')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">{t('cap_band_hot_title')}</div>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-4 ring-1 ring-accent-400/12 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
                <div className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.95),transparent)]" />
                <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{t('cap_band_cold_value')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">{t('cap_band_cold_title')}</div>
              </div>
              <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/80 p-4 ring-1 ring-accent-400/12 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[28px] sm:p-5">
                <div className="absolute inset-x-5 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.95),transparent)]" />
                <div className="text-2xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-3xl">{t('cap_band_standard_value')}</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">{t('cap_band_standard_title')}</div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[28px] border border-white/70 bg-white/60 shadow-[0_40px_120px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:rounded-[40px]">
            <img
              src="/factory/factory_1.jpg"
              alt="Wanjin Manufacturing"
              width="1600"
              height="1200"
              className="h-full min-h-[360px] w-full object-cover sm:min-h-[460px] lg:min-h-[540px]"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,35,0.08)_0%,rgba(5,20,35,0.28)_46%,rgba(5,20,35,0.88)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8">
              <div className="inline-flex rounded-full border border-accent-400/35 bg-accent-400/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#ffe39a]">
                {t('cap_unique')}
              </div>
              <h2 className="apple-card-title mt-4 text-white sm:mt-5">{t('nav_factory')}</h2>
              <p className="apple-body mt-3 max-w-xl text-sm text-slate-200 line-clamp-3 sm:mt-4 sm:text-[17px]">{t('factory_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative mx-auto mt-16 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[28px] bg-[linear-gradient(145deg,#051423_0%,#0a3059_55%,#113f73_100%)] px-6 py-8 text-white shadow-[0_40px_120px_rgba(2,12,27,0.22)] sm:rounded-[40px] sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#ffe39a]">
                <span className="h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_16px_rgba(250,204,21,0.65)]" />
                {t('trusted_by')}
              </p>
              <h2 className="apple-section-title mt-4">{t('trusted_by')}</h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/90">
                  <ShieldCheck className="h-4 w-4 text-accent-400" />
                  {t('feat_certified_title')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/90">
                  <Factory className="h-4 w-4 text-accent-400" />
                  {t('feat_professional_title')}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm text-white/90">
                  <Zap className="h-4 w-4 text-accent-400" />
                  {t('feat_wide_app_title')}
                </span>
              </div>
            </div>

            <div className="flex">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CAPACITY)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(250,204,21,0.14)] transition hover:bg-slate-100 sm:w-auto"
              >
                {t('nav_capacity')}
                <ArrowRight className="h-4 w-4 text-accent-500" />
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:mt-8 sm:grid-cols-3 sm:gap-4">
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:rounded-[28px] sm:p-5">
              <div className="text-2xl font-semibold text-white sm:text-3xl">≥99%</div>
              <div className="mt-2 text-sm font-semibold text-white">{t('cap_metric_pass_label')}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:rounded-[28px] sm:p-5">
              <div className="text-2xl font-semibold text-white sm:text-3xl">≥95%</div>
              <div className="mt-2 text-sm font-semibold text-white">{t('cap_metric_delivery_label')}</div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:rounded-[28px] sm:p-5">
              <div className="text-2xl font-semibold text-white sm:text-3xl">98%</div>
              <div className="mt-2 text-sm font-semibold text-white">{t('cap_metric_satisfaction_label')}</div>
            </div>
          </div>
        </div>
      </section>

      {activeProduct ? (
        <section className="relative mx-auto mt-16 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-brand-500">
                <span className="h-2 w-2 rounded-full bg-accent-400 shadow-[0_0_16px_rgba(250,204,21,0.65)]" />
                {t('core_products')}
              </p>
              <h2 className="apple-section-title mt-3 text-slate-950">{t('core_products')}</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(PageView.PRODUCTS)}
              className="hidden items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-accent-500 sm:inline-flex"
            >
              {t('view_all')}
              <ArrowRight className="h-4 w-4 text-accent-500" />
            </button>
          </div>

          <div className="-mx-4 mt-6 overflow-x-auto px-4 pb-4 scrollbar-hide sm:mt-8">
            <div className="inline-flex gap-3 rounded-[28px] border border-[#d9e4ef] bg-[linear-gradient(180deg,rgba(232,240,248,0.86)_0%,rgba(244,248,252,0.96)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_24px_60px_rgba(15,23,42,0.08)] sm:gap-4 sm:rounded-[36px] sm:p-4">
              {coreProducts.map((product) => {
                const isActive = product.slug === activeProduct.slug;

                return (
                  <button
                    key={product.slug}
                    type="button"
                    onClick={() => setActiveProductSlug(product.slug)}
                    className={`group relative flex w-[104px] shrink-0 flex-col items-center overflow-hidden rounded-[22px] px-3 py-4 text-center transition sm:w-[118px] sm:rounded-[28px] ${
                      isActive
                        ? 'border border-accent-400/35 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_24px_54px_rgba(3,15,33,0.26)]'
                        : 'border border-[#d6e1ec] bg-white text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.06)] hover:-translate-y-0.5 hover:border-accent-400/30 hover:bg-white'
                    }`}
                  >
                    {isActive ? <span className="absolute inset-x-4 top-0 h-[2px] rounded-full bg-[linear-gradient(90deg,transparent,rgba(250,204,21,0.95),transparent)]" /> : null}
                    <div className={`flex h-16 w-16 items-center justify-center rounded-[20px] p-2.5 sm:h-20 sm:w-20 sm:rounded-[24px] sm:p-3 ${isActive ? 'border border-accent-400/15 bg-[linear-gradient(145deg,rgba(250,204,21,0.16)_0%,rgba(255,255,255,0.16)_100%)]' : 'border border-[#e7eef5] bg-[linear-gradient(145deg,#ffffff_0%,#eef4fb_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]'}`}>
                      <img
                        src={product.image}
                        alt={t(product.nameKey)}
                        width="160"
                        height="160"
                        className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <span className={`apple-nav-label mt-3 ${isActive ? 'text-white' : 'text-slate-950'}`}>{t(product.nameKey)}</span>
                    <span className={`apple-nav-badge mt-1 ${isActive ? 'text-white/70' : 'text-slate-500'}`}>{t(product.categoryKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-5 overflow-hidden rounded-[28px] bg-[linear-gradient(140deg,#071427_0%,#0d2747_56%,#123765_100%)] text-white shadow-[0_30px_90px_rgba(3,15,33,0.22)] sm:mt-6 sm:rounded-[40px]">
            <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(280px,0.7fr)] lg:gap-8 lg:p-10">
              <div className="flex flex-col justify-between">
                <div>
                  <div className="apple-nav-badge inline-flex rounded-full border border-accent-400/35 bg-accent-400/10 px-4 py-1 text-[#ffe39a] backdrop-blur">
                    {t(activeProduct.categoryKey)}
                  </div>
                  <h3 className="apple-section-title mt-5 text-white">
                    {t(activeProduct.nameKey)}
                  </h3>
                  <p className="apple-body mt-4 max-w-xl text-slate-200">
                    {t(activeProduct.descKey)}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {activeProduct.featureKeys.slice(0, 3).map((featureKey) => (
                      <span
                        key={featureKey}
                        className="apple-nav-badge rounded-full border border-accent-400/25 bg-accent-400/10 px-3 py-1 text-[#ffe7a9] backdrop-blur"
                      >
                        {t(featureKey)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.PRODUCTS, language, activeProduct.slug)}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_14px_34px_rgba(250,204,21,0.14)] transition hover:bg-slate-100 sm:w-auto"
                  >
                    {t('btn_explore')}
                    <ArrowRight className="h-4 w-4 text-accent-500" />
                  </button>
                  {activeProductArticleSlug ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, activeProductArticleSlug)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-accent-400/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-accent-400/10 sm:w-auto"
                    >
                      {t('home_product_article_cta')}
                      <ArrowUpRight className="h-4 w-4 text-accent-400" />
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="rounded-[24px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(242,246,251,0.96)_100%)] p-4 shadow-[0_26px_60px_rgba(2,12,27,0.12)] sm:rounded-[32px] sm:p-5">
                <div className="aspect-square overflow-hidden rounded-[20px] border border-slate-200/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,1)_0%,rgba(246,249,252,1)_100%)] p-3 sm:rounded-[24px] sm:p-4">
                  <img
                    src={activeProduct.image}
                    alt={t(activeProduct.nameKey)}
                    width="720"
                    height="720"
                    className="h-full w-full object-contain drop-shadow-[0_18px_36px_rgba(15,23,42,0.16)]"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

        <section className="relative mx-auto mt-16 max-w-7xl px-4 sm:mt-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-12">
          <button
            type="button"
            onClick={() => onNavigate(PageView.ABOUT)}
            className="group overflow-hidden rounded-[36px] border border-slate-200 bg-white text-left shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:col-span-4"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/factory/about-company.jpeg"
                alt={t('nav_about')}
                width="1200"
                height="800"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-6 sm:p-7">
              <h3 className="apple-card-title text-slate-950">{t('nav_about')}</h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(PageView.CAPACITY)}
            className="rounded-[28px] bg-[linear-gradient(145deg,#061322_0%,#0c2e57_100%)] p-6 text-left text-white shadow-[0_30px_80px_rgba(2,12,27,0.18)] sm:rounded-[36px] sm:p-8 lg:col-span-4"
          >
            <div className="inline-flex rounded-2xl border border-accent-400/20 bg-accent-400/10 p-3">
              <Gauge className="h-6 w-6 text-accent-400" />
            </div>
            <h3 className="apple-card-title mt-5 text-white">{t('nav_capacity')}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-accent-400/24 bg-[linear-gradient(180deg,rgba(250,204,21,0.14)_0%,rgba(255,255,255,0.1)_100%)] p-4 shadow-[0_16px_34px_rgba(250,204,21,0.1)]">
                <div className="text-lg font-semibold text-white">{t('cap_band_hot_value')}</div>
                <div className="apple-nav-badge mt-1 text-[#ffe39a]">{t('cap_band_hot_title')}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                <div className="text-lg font-semibold text-white">{t('cap_band_cold_value')}</div>
                <div className="apple-nav-badge mt-1 text-slate-300">{t('cap_band_cold_title')}</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(PageView.FACTORY)}
            className="group overflow-hidden rounded-[36px] border border-slate-200 bg-white text-left shadow-[0_24px_70px_rgba(15,23,42,0.06)] lg:col-span-4"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img
                src="/factory/factory_20.jpg"
                alt={t('nav_factory')}
                width="1200"
                height="800"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-6 sm:p-7">
              <div className="apple-nav-badge text-slate-500">{t('cap_unique')}</div>
              <h3 className="apple-card-title mt-3 text-slate-950">{t('nav_factory')}</h3>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(PageView.CONTACT)}
            className="rounded-[28px] border border-slate-200 bg-white p-6 text-left shadow-[0_24px_70px_rgba(15,23,42,0.06)] sm:rounded-[36px] sm:p-8 lg:col-span-6"
          >
            <div className="inline-flex rounded-2xl bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] p-3 text-accent-400 shadow-[0_16px_34px_rgba(250,204,21,0.12)]">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="apple-card-title mt-5 text-slate-950">{t('nav_contact')}</h3>
            <p className="apple-body mt-3 text-slate-600 line-clamp-2">{t('email_us_desc')}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="apple-nav-badge rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">{t('phone_val')}</span>
              <span className="apple-nav-badge rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-slate-700">sales@wanjinspring.com</span>
            </div>
          </button>

          <div className="rounded-[28px] bg-[linear-gradient(145deg,#041221_0%,#0a3059_100%)] p-6 text-white shadow-[0_30px_80px_rgba(2,12,27,0.2)] sm:rounded-[36px] sm:p-8 lg:col-span-6">
            <div className="inline-flex rounded-2xl bg-white/10 p-3">
              <CalendarDays className="h-6 w-6" />
            </div>
            <h3 className="apple-card-title mt-5 text-white">{t('nav_blog')}</h3>
            <div className="mt-4 space-y-3 sm:mt-5 sm:space-y-4">
              {blogState
                ? blogState.featuredPosts.map((post) => {
                    const localized = blogState.blogModule.getLocalizedPost(post, language);

                    return (
                      <button
                        key={post.slug}
                        type="button"
                        onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                        className="block w-full rounded-[24px] border border-white/10 bg-white/10 p-4 text-left transition hover:bg-white/15"
                      >
                        <div className="apple-nav-badge text-slate-300">{blogState.blogModule.formatBlogDate(post.publishedAt, language)}</div>
                        <div className="mt-2 text-base font-semibold leading-6 text-white line-clamp-2">{localized.title}</div>
                      </button>
                    );
                  })
                : Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-[24px] border border-white/10 bg-white/10 p-4">
                      <div className="h-4 w-24 rounded-full bg-white/10" />
                      <div className="mt-3 h-5 w-full rounded-full bg-white/10" />
                      <div className="mt-2 h-5 w-3/4 rounded-full bg-white/10" />
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
