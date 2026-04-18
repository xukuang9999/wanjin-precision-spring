import React, { startTransition, useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Factory,
  Gauge,
  Layers3,
  Mail,
  Phone,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { PRODUCT_DATA } from '../data/products';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { type Language } from '../utils/languages';
import { loadBlogModule, type BlogModule } from '../utils/loadBlogModule';
import { getNavigationPrefetchHandlers } from '../utils/navigationPrefetch';

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
  const [shouldLoadBlogInsights, setShouldLoadBlogInsights] = useState(false);
  const blogInsightsTriggerRef = useRef<HTMLElement | null>(null);
  const coreProducts = PRODUCT_DATA;
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';
  const linkedInHref = 'https://www.linkedin.com/company/wanjin-spring/';

  const [activeProductSlug, setActiveProductSlug] = useState(coreProducts[0]?.slug ?? '');
  const activeProduct = coreProducts.find((product) => product.slug === activeProductSlug) ?? coreProducts[0];
  const activeProductArticleSlug = activeProduct ? blogState?.articleByProductSlug[activeProduct.slug] : undefined;

  useEffect(() => {
    if (shouldLoadBlogInsights) {
      return undefined;
    }

    const target = blogInsightsTriggerRef.current;
    if (!target || typeof IntersectionObserver === 'undefined') {
      setShouldLoadBlogInsights(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) {
          return;
        }

        setShouldLoadBlogInsights(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [shouldLoadBlogInsights]);

  useEffect(() => {
    if (!shouldLoadBlogInsights || blogState) {
      return undefined;
    }

    let cancelled = false;

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

    return () => {
      cancelled = true;
    };
  }, [blogState, shouldLoadBlogInsights]);

  const getPrefetchProps = (page: PageView, nextLanguage = language) =>
    getNavigationPrefetchHandlers(page, nextLanguage);

  const heroStats = [
    { value: t('cap_band_hot_value'), label: t('cap_band_hot_title') },
    { value: t('cap_band_cold_value'), label: t('cap_band_cold_title') },
    { value: t('cap_band_standard_value'), label: t('cap_band_standard_title') },
  ];

  const trustHighlights = [
    { icon: ShieldCheck, label: t('feat_certified_title') },
    { icon: Factory, label: t('feat_professional_title') },
    { icon: Zap, label: t('feat_wide_app_title') },
  ];

  const quickContactLinks = [
    { href: phoneHref, label: t('phone_val'), icon: Phone, external: false },
    { href: emailHref, label: 'sales@wanjinspring.com', icon: Mail, external: false },
    { href: linkedInHref, label: t('linkedin_label'), icon: ArrowUpRight, external: true },
  ];

  const categorySnapshots = ['cat_heavy', 'cat_precision', 'cat_general', 'cat_custom'].map((categoryKey) => ({
    categoryKey,
    count: coreProducts.filter((product) => product.categoryKey === categoryKey).length,
  }));

  if (!activeProduct) {
    return null;
  }

  return (
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <div className="page-shell">
        <section className="site-reveal relative overflow-hidden rounded-[36px] border border-white/50 bg-slate-950 shadow-[0_36px_120px_rgba(2,12,27,0.2)] sm:rounded-[44px]">
          <ResponsiveImage
            src="/factory/factory_1.jpg"
            alt={t('company_name_en')}
            width="1600"
            height="1200"
            pictureClassName="absolute inset-0"
            imgClassName="h-full w-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(112deg,rgba(3,11,22,0.94)_0%,rgba(4,17,33,0.88)_36%,rgba(7,27,49,0.66)_62%,rgba(7,18,34,0.9)_100%)]" />
          <div className="site-grid-pattern absolute inset-y-0 right-0 w-[48%] opacity-50" />
          <div className="site-float-slow absolute -left-12 top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(250,204,21,0.28)_0%,rgba(250,204,21,0.06)_42%,transparent_72%)] blur-2xl" />
          <div className="site-float-fast absolute bottom-10 right-8 h-44 w-44 rounded-full bg-[radial-gradient(circle,_rgba(56,189,248,0.22)_0%,rgba(56,189,248,0.06)_44%,transparent_74%)] blur-3xl" />

          <div className="relative z-10 grid gap-8 px-5 py-6 sm:px-7 sm:py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] lg:gap-10 lg:px-10 lg:py-10 xl:px-12 xl:py-12">
            <div className="flex flex-col justify-between">
              <div>
                <div className="site-kicker text-[#ffe39a]">
                  <span className="site-kicker-dot bg-accent-400 shadow-[0_0_18px_rgba(250,204,21,0.72)]" />
                  {t('trusted_by')}
                </div>
                <h1 className="apple-hero-title mt-5 max-w-4xl text-white">{t('hero_title')}</h1>
                <p className="apple-body mt-5 max-w-2xl text-base text-slate-200 sm:text-[18px]">{t('hero_desc')}</p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.CONTACT)}
                    {...getPrefetchProps(PageView.CONTACT)}
                    className="site-button-primary"
                  >
                    {t('btn_contact')}
                    <ArrowRight className="h-4 w-4 text-accent-400" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.PRODUCTS)}
                    {...getPrefetchProps(PageView.PRODUCTS)}
                    className="site-button-secondary"
                  >
                    {t('btn_explore')}
                    <ArrowUpRight className="h-4 w-4 text-accent-400" />
                  </button>
                </div>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {trustHighlights.map((item) => (
                  <div key={item.label} className="site-glass-panel min-h-[112px] rounded-[24px] px-4 py-4 sm:px-5">
                    <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3 text-accent-400">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="mt-4 text-sm font-semibold text-white sm:text-base">{item.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-2.5">
                {quickContactLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noreferrer' : undefined}
                    className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/12 bg-white/10 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/16"
                  >
                    <link.icon className="h-4 w-4 text-accent-400" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex items-stretch lg:justify-end">
              <div className="site-dark-panel w-full max-w-[540px] rounded-[32px] p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="site-kicker text-[#ffe39a]">
                      <span className="site-kicker-dot bg-accent-400" />
                      {t(activeProduct.categoryKey)}
                    </div>
                    <h2 className="apple-card-title mt-4 text-white">{t(activeProduct.nameKey)}</h2>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{t(activeProduct.descKey)}</p>
                  </div>
                  <span className="hidden rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300 sm:inline-flex">
                    {t('cap_unique')}
                  </span>
                </div>

                <div className="relative mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.04)_48%,rgba(255,255,255,0.02)_100%)] p-4 sm:p-6">
                  <div className="site-float-slow absolute left-1/2 top-4 h-24 w-24 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,_rgba(250,204,21,0.28)_0%,rgba(250,204,21,0.02)_62%,transparent_76%)] blur-2xl" />
                  <ResponsiveImage
                    src={activeProduct.image}
                    alt={t(activeProduct.nameKey)}
                    width="720"
                    height="720"
                    responsiveWidths={[640, 960]}
                    originalWidth={1200}
                    sizes="(min-width: 1024px) 32vw, 92vw"
                    imgClassName="relative z-10 mx-auto h-auto max-h-[340px] w-full max-w-[380px] object-contain drop-shadow-[0_28px_44px_rgba(0,0,0,0.26)] sm:max-h-[380px]"
                    loading="eager"
                    decoding="async"
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {activeProduct.specKeys.map((spec) => (
                    <div key={spec.titleKey} className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                      <div className="text-lg font-semibold tracking-[-0.03em] text-white">{t(spec.valueKey)}</div>
                      <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{t(spec.titleKey)}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {activeProduct.industryKeys.map((industryKey) => (
                    <span
                      key={industryKey}
                      className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-200"
                    >
                      {t(industryKey)}
                    </span>
                  ))}
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.PRODUCTS, language, activeProduct.slug)}
                    {...getPrefetchProps(PageView.PRODUCTS)}
                    className="site-button-primary w-full justify-center sm:w-auto"
                  >
                    {t('btn_explore')}
                    <ArrowRight className="h-4 w-4 text-accent-400" />
                  </button>
                  {activeProductArticleSlug ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, activeProductArticleSlug)}
                      {...getPrefetchProps(PageView.BLOG)}
                      className="site-button-secondary w-full justify-center sm:w-auto"
                    >
                      {t('home_product_article_cta')}
                      <ArrowUpRight className="h-4 w-4 text-accent-400" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="page-deferred-section site-reveal mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <div className="site-soft-panel rounded-[32px] p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="site-kicker text-brand-500">
                  <span className="site-kicker-dot bg-brand-500" />
                  {t('trusted_by')}
                </div>
                <h2 className="apple-section-title mt-4 text-slate-950">{t('trusted_by')}</h2>
              </div>
              <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                {t('response_time_note')}
              </div>
            </div>

            <p className="apple-body mt-5 max-w-3xl text-slate-600">{t('client_section_desc')}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {trustHighlights.map((item) => (
                <div key={item.label} className="rounded-[24px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_16px_34px_rgba(15,23,42,0.05)]">
                  <div className="inline-flex rounded-2xl border border-accent-400/16 bg-accent-50 p-3 text-brand-500">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="mt-4 text-sm font-semibold text-slate-950">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {[
              { value: '≥99%', label: t('cap_metric_pass_label') },
              { value: '≥95%', label: t('cap_metric_delivery_label') },
              { value: '98%', label: t('cap_metric_satisfaction_label') },
            ].map((metric, index) => (
              <div
                key={metric.label}
                className={`rounded-[28px] p-5 shadow-[0_22px_60px_rgba(15,23,42,0.08)] ${
                  index === 0
                    ? 'bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white'
                    : 'site-soft-panel text-slate-950'
                }`}
              >
                <div className={`text-[2rem] font-semibold tracking-[-0.05em] ${index === 0 ? 'text-white' : 'text-slate-950'}`}>
                  {metric.value}
                </div>
                <div className={`mt-2 text-sm font-semibold ${index === 0 ? 'text-slate-200' : 'text-slate-600'}`}>
                  {metric.label}
                </div>
                <div className={`mt-5 h-1.5 w-20 rounded-full ${index === 0 ? 'bg-accent-400' : 'bg-brand-500/20'}`} />
              </div>
            ))}
          </div>
        </section>

        <section ref={blogInsightsTriggerRef} className="page-deferred-section site-reveal mt-16">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="site-kicker text-brand-500">
                <span className="site-kicker-dot bg-accent-400" />
                {t('core_products')}
              </div>
              <h2 className="apple-section-title mt-4 text-slate-950">{t('core_products')}</h2>
              <p className="apple-body mt-3 max-w-3xl text-slate-600">{t('cap_band_desc')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {categorySnapshots.map((snapshot) => (
                <span
                  key={snapshot.categoryKey}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                >
                  {t(snapshot.categoryKey)} · {snapshot.count}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,0.82fr)]">
            <div className="site-dark-panel rounded-[32px] p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="site-kicker text-[#ffe39a]">
                    <span className="site-kicker-dot bg-accent-400" />
                    {t(activeProduct.categoryKey)}
                  </div>
                  <h3 className="apple-section-title mt-4 text-white">{t(activeProduct.nameKey)}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, activeProduct.slug)}
                  {...getPrefetchProps(PageView.PRODUCTS)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/14"
                >
                  {t('view_all')}
                  <ArrowRight className="h-4 w-4 text-accent-400" />
                </button>
              </div>

              <p className="apple-body mt-5 max-w-2xl text-slate-300">{t(activeProduct.descKey)}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {activeProduct.specKeys.map((spec) => (
                  <div key={spec.titleKey} className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                    <div className="text-xl font-semibold tracking-[-0.04em] text-white">{t(spec.valueKey)}</div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">{t(spec.titleKey)}</div>
                    <div className="mt-3 text-sm leading-6 text-slate-300">{t(spec.descKey)}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{t('feat_professional_title')}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeProduct.featureKeys.map((featureKey) => (
                      <span
                        key={featureKey}
                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100"
                      >
                        {t(featureKey)}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{t('process_title')}</div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {activeProduct.processKeys.map((processKey) => (
                      <span
                        key={processKey}
                        className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-100"
                      >
                        {t(processKey)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {activeProduct.industryKeys.map((industryKey) => (
                      <span
                        key={industryKey}
                        className="rounded-full border border-accent-400/20 bg-accent-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-[#ffe39a]"
                      >
                        {t(industryKey)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, activeProduct.slug)}
                  {...getPrefetchProps(PageView.PRODUCTS)}
                  className="site-button-primary w-full justify-center sm:w-auto"
                >
                  {t('btn_explore')}
                  <ArrowRight className="h-4 w-4 text-accent-400" />
                </button>
                {activeProductArticleSlug ? (
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, activeProductArticleSlug)}
                    {...getPrefetchProps(PageView.BLOG)}
                    className="site-button-secondary w-full justify-center sm:w-auto"
                  >
                    {t('home_product_article_cta')}
                    <ArrowUpRight className="h-4 w-4 text-accent-400" />
                  </button>
                ) : null}
              </div>
            </div>

            <div className="site-soft-panel rounded-[32px] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="site-kicker text-brand-500">
                    <span className="site-kicker-dot bg-brand-500" />
                    {t('view_all')}
                  </div>
                  <h3 className="apple-card-title mt-4 text-slate-950">{t('core_products')}</h3>
                </div>
                <div className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {coreProducts.length}
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {coreProducts.map((product) => {
                  const isActive = product.slug === activeProduct.slug;

                  return (
                    <button
                      key={product.slug}
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => setActiveProductSlug(product.slug)}
                      className={`group rounded-[24px] border p-3 text-left transition ${
                        isActive
                          ? 'border-[#123765] bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_22px_56px_rgba(18,55,101,0.22)]'
                          : 'border-slate-200/80 bg-white text-slate-950 shadow-[0_14px_34px_rgba(15,23,42,0.05)] hover:-translate-y-0.5 hover:border-accent-400/35'
                      }`}
                    >
                      <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[18px] border border-slate-200/60 bg-[linear-gradient(180deg,#f9fbfd_0%,#eef4f9_100%)] p-3">
                        <ResponsiveImage
                          src={product.image}
                          alt={t(product.nameKey)}
                          width="240"
                          height="180"
                          responsiveWidths={[640, 960]}
                          originalWidth={1200}
                          sizes="(min-width: 1280px) 14vw, (min-width: 640px) 22vw, 44vw"
                          imgClassName={`h-full w-full object-contain transition duration-500 ${
                            isActive ? 'scale-105' : 'group-hover:scale-105'
                          }`}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="mt-4 text-sm font-semibold leading-6">{t(product.nameKey)}</div>
                      <div className={`mt-2 text-xs font-semibold uppercase tracking-[0.16em] ${isActive ? 'text-slate-200' : 'text-slate-500'}`}>
                        {t(product.categoryKey)}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.featureKeys.slice(0, 2).map((featureKey) => (
                          <span
                            key={featureKey}
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              isActive ? 'bg-white/10 text-slate-100' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {t(featureKey)}
                          </span>
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="page-deferred-section site-reveal mt-16 grid gap-4 lg:grid-cols-12">
          <button
            type="button"
            onClick={() => onNavigate(PageView.ABOUT)}
            {...getPrefetchProps(PageView.ABOUT)}
            className="group relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white text-left shadow-[0_22px_60px_rgba(15,23,42,0.06)] lg:col-span-4"
          >
            <div className="aspect-[16/11] overflow-hidden">
              <ResponsiveImage
                src="/factory/about-company.jpeg"
                alt={t('nav_about')}
                width="1200"
                height="800"
                sizes="(min-width: 1024px) 28vw, 100vw"
                imgClassName="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-6 sm:p-7">
              <div className="site-kicker text-brand-500">
                <span className="site-kicker-dot bg-brand-500" />
                {t('company_intro')}
              </div>
              <h3 className="apple-card-title mt-4 text-slate-950">{t('nav_about')}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-3">{t('about_para1')}</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(PageView.CAPACITY)}
            {...getPrefetchProps(PageView.CAPACITY)}
            className="site-dark-panel rounded-[32px] p-6 text-left lg:col-span-4 sm:p-7"
          >
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3 text-accent-400">
              <Gauge className="h-6 w-6" />
            </div>
            <div className="site-kicker mt-5 text-[#ffe39a]">
              <span className="site-kicker-dot bg-accent-400" />
              {t('cap_unique')}
            </div>
            <h3 className="apple-card-title mt-4 text-white">{t('nav_capacity')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">{t('cap_unique_desc')}</p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-accent-400/16 bg-accent-400/10 p-4">
                <div className="text-lg font-semibold text-white">{t('cap_band_hot_value')}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe39a]">{t('cap_band_hot_title')}</div>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-white/8 p-4">
                <div className="text-lg font-semibold text-white">{t('cap_band_test_value')}</div>
                <div className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">{t('cap_band_test_title')}</div>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate(PageView.FACTORY)}
            {...getPrefetchProps(PageView.FACTORY)}
            className="group relative overflow-hidden rounded-[32px] border border-slate-200/80 bg-white text-left shadow-[0_22px_60px_rgba(15,23,42,0.06)] lg:col-span-4"
          >
            <div className="aspect-[16/11] overflow-hidden">
              <ResponsiveImage
                src="/factory/factory_20.jpg"
                alt={t('nav_factory')}
                width="1200"
                height="800"
                sizes="(min-width: 1024px) 28vw, 100vw"
                imgClassName="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="p-6 sm:p-7">
              <div className="site-kicker text-brand-500">
                <span className="site-kicker-dot bg-accent-400" />
                {t('cap_unique')}
              </div>
              <h3 className="apple-card-title mt-4 text-slate-950">{t('nav_factory')}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-3">{t('feat_professional_desc')}</p>
            </div>
          </button>

          <div className="site-soft-panel rounded-[32px] p-6 lg:col-span-4 sm:p-7">
            <div className="inline-flex rounded-2xl border border-accent-400/16 bg-accent-50 p-3 text-brand-500">
              <Mail className="h-6 w-6" />
            </div>
            <h3 className="apple-card-title mt-5 text-slate-950">{t('email_us_title')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">{t('email_us_desc')}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {quickContactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-accent-400/30 hover:text-slate-950"
                >
                  <link.icon className="h-4 w-4 text-accent-500" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate(PageView.FAQ)}
            {...getPrefetchProps(PageView.FAQ)}
            className="site-soft-panel group rounded-[32px] p-6 text-left transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_rgba(15,23,42,0.08)] lg:col-span-4 sm:p-7"
          >
            <div className="inline-flex rounded-2xl border border-accent-400/16 bg-accent-50 p-3 text-brand-500">
              <Layers3 className="h-6 w-6" />
            </div>
            <div className="site-kicker mt-5 text-brand-500">
              <span className="site-kicker-dot bg-brand-500" />
              {t('faq_title')}
            </div>
            <h3 className="apple-card-title mt-4 text-slate-950">{t('nav_faq')}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600 line-clamp-3">{t('blog_questions_desc')}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 transition group-hover:text-accent-500">
              {t('nav_faq')}
              <ArrowRight className="h-4 w-4 text-accent-500" />
            </span>
          </button>

          <div className="site-dark-panel rounded-[32px] p-6 lg:col-span-4 sm:p-7">
            <div className="inline-flex rounded-2xl border border-white/10 bg-white/8 p-3 text-white">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div className="site-kicker mt-5 text-[#ffe39a]">
              <span className="site-kicker-dot bg-accent-400" />
              {t('nav_blog')}
            </div>
            <h3 className="apple-card-title mt-4 text-white">{t('nav_blog')}</h3>
            <div className="mt-5 space-y-3">
              {blogState
                ? blogState.featuredPosts.map((post) => {
                    const localizedPost = blogState.blogModule.getLocalizedPost(post, language);

                    return (
                      <button
                        key={post.slug}
                        type="button"
                        onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                        {...getPrefetchProps(PageView.BLOG)}
                        className="block w-full rounded-[22px] border border-white/10 bg-white/8 p-4 text-left transition hover:bg-white/14"
                      >
                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-300">
                          {blogState.blogModule.formatBlogDate(post.publishedAt, language)}
                        </div>
                        <div className="mt-2 text-base font-semibold leading-7 text-white line-clamp-2">{localizedPost.title}</div>
                      </button>
                    );
                  })
                : Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-[22px] border border-white/10 bg-white/8 p-4">
                      <div className="h-4 w-24 rounded-full bg-white/10" />
                      <div className="mt-3 h-5 w-full rounded-full bg-white/10" />
                      <div className="mt-2 h-5 w-3/4 rounded-full bg-white/10" />
                    </div>
                  ))}
            </div>

            <button
              type="button"
              onClick={() => onNavigate(PageView.BLOG)}
              {...getPrefetchProps(PageView.BLOG)}
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-white transition hover:text-accent-400"
            >
              {t('blog_view_all')}
              <ArrowRight className="h-4 w-4 text-accent-400" />
            </button>
          </div>
        </section>

        <section className="page-deferred-section site-reveal relative mt-16 overflow-hidden rounded-[36px] bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] shadow-[0_36px_120px_rgba(2,12,27,0.22)]">
          <div className="site-grid-pattern absolute inset-0 opacity-30" />
          <div className="relative z-10 grid gap-8 px-6 py-8 sm:px-8 sm:py-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.86fr)] lg:items-center lg:px-10">
            <div>
              <div className="site-kicker text-[#ffe39a]">
                <span className="site-kicker-dot bg-accent-400" />
                {t('email_us_title')}
              </div>
              <h2 className="apple-section-title mt-4 text-white">{t('btn_send_email')}</h2>
              <p className="apple-body mt-4 max-w-2xl text-slate-200">{t('email_us_desc')}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {heroStats.map((stat) => (
                  <span
                    key={stat.label}
                    className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                  >
                    {stat.value} · {stat.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.CONTACT)}
                  {...getPrefetchProps(PageView.CONTACT)}
                  className="site-button-primary w-full justify-center"
                >
                  {t('btn_contact')}
                  <ArrowRight className="h-4 w-4 text-accent-400" />
                </button>
                <a href={emailHref} className="site-button-secondary w-full justify-center">
                  {t('btn_send_email')}
                  <Mail className="h-4 w-4 text-accent-400" />
                </a>
              </div>

              <div className="mt-5 rounded-[22px] border border-white/10 bg-white/8 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-300">{t('response_time_note')}</div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {coreProducts.slice(0, 4).map((product) => (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                      {...getPrefetchProps(PageView.PRODUCTS)}
                      className="rounded-full border border-white/10 bg-white/8 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-white/14"
                    >
                      {t(product.nameKey)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
