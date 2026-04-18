import React, { startTransition, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Cable, Filter, Layers3, Search, Wrench } from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { type Language } from '../utils/languages';
import { getProductSeoProfile } from '../utils/productSeo';
import { getProductBySlug, PRODUCT_DATA, type ProductRecord } from '../data/products';
import { scheduleIdleTask } from '../utils/idle';
import { loadBlogModule, type BlogModule } from '../utils/loadBlogModule';

interface ProductsProps {
  slug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

type ProductsBlogState = {
  blogModule: BlogModule;
  productArticleBySlug: Record<string, ReturnType<BlogModule['getRelevantBlogPosts']>[number] | undefined>;
};

const useProductsBlogState = () => {
  const [blogState, setBlogState] = useState<ProductsBlogState | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cancelIdleTask = scheduleIdleTask(() => {
      void loadBlogModule()
        .then((blogModule) => {
          if (cancelled) {
            return;
          }

          const productArticleBySlug = Object.fromEntries(
            PRODUCT_DATA.map((product) => [product.slug, blogModule.getRelevantBlogPosts(product.articleTerms, 1)[0]]),
          );

          startTransition(() => {
            setBlogState({ blogModule, productArticleBySlug });
          });
        })
        .catch((error) => {
          console.error('Failed to load product page blog content:', error);
        });
    }, 1200);

    return () => {
      cancelled = true;
      cancelIdleTask();
    };
  }, []);

  return blogState;
};

const ProductList: React.FC<ProductsProps & { blogState: ProductsBlogState | null }> = ({ onNavigate, blogState }) => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState('cat_all');
  const [searchTerm, setSearchTerm] = useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const trimmedSearchTerm = searchTerm.trim();
  const compactSpecCards = [
    ['products_spec_cold_value', 'products_spec_cold_title'],
    ['products_spec_hot_value', 'products_spec_hot_title'],
    ['products_spec_test_value', 'products_spec_test_title'],
    ['products_spec_application_value', 'products_spec_application_title'],
  ] as const;
  const supportCards = [
    { titleKey: 'product_power_eq_name', descKey: 'product_power_eq_desc', icon: <Cable className="w-6 h-6 text-accent-500" /> },
    { titleKey: 'product_high_pressure_name', descKey: 'product_high_pressure_desc', icon: <Layers3 className="w-6 h-6 text-accent-500" /> },
    { titleKey: 'assembly_service_title', descKey: 'assembly_service_desc', icon: <Wrench className="w-6 h-6 text-accent-500" /> },
  ] as const;

  const categories = ['cat_all', 'cat_precision', 'cat_heavy', 'cat_general', 'cat_custom'];
  const filteredProducts = PRODUCT_DATA.filter((product) => {
    const matchesCategory = filter === 'cat_all' || product.categoryKey === filter;
    const haystack = [
      t(product.nameKey),
      t(product.descKey),
      ...product.featureKeys.map((key) => t(key)),
      ...product.industryKeys.map((key) => t(key)),
      ...product.processKeys.map((key) => t(key)),
    ]
      .join(' ')
      .toLowerCase();
    const matchesSearch = !trimmedSearchTerm || haystack.includes(trimmedSearchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const insightTermsByFilter: Record<string, string[]> = {
    cat_all: ['spring selection', 'material selection', 'failure analysis', 'drawing review'],
    cat_precision: ['wave springs', 'contact springs', 'precision assembly', 'drawing review'],
    cat_heavy: ['hot coiling', 'disc springs', 'power equipment', 'fatigue life'],
    cat_general: ['compression springs', 'cold coiling', 'spring materials'],
    cat_custom: ['custom wire forms', 'constant force springs', 'retaining rings', 'motion control'],
  };

  const recommendedPosts = useMemo(() => {
    if (!blogState) {
      return [];
    }

    return blogState.blogModule.getRelevantBlogPosts(
      [...(insightTermsByFilter[filter] ?? insightTermsByFilter.cat_all), trimmedSearchTerm],
      3,
    );
  }, [blogState, filter, trimmedSearchTerm]);

  useEffect(() => {
    const syncSearchFromUrl = () => {
      setSearchTerm(new URLSearchParams(window.location.search).get('q') ?? '');
    };

    syncSearchFromUrl();
    window.addEventListener('popstate', syncSearchFromUrl);
    return () => window.removeEventListener('popstate', syncSearchFromUrl);
  }, []);

  useEffect(() => {
    const search = trimmedSearchTerm ? `q=${encodeURIComponent(trimmedSearchTerm)}` : '';
    const nextUrl = `${window.location.pathname}${search ? `?${search}` : ''}`;

    if (`${window.location.pathname}${window.location.search}` !== nextUrl) {
      window.history.replaceState({}, '', nextUrl);
    }
  }, [trimmedSearchTerm]);

  return (
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('nav_products')}</h1>
              <p className="apple-body mt-4 max-w-3xl text-base text-slate-200 sm:mt-6 sm:text-[17px]">{t('product_header_desc')}</p>
            </div>
            <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-5 sm:rounded-[36px] sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:gap-6">
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{PRODUCT_DATA.length}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('core_products')}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{categories.length - 1}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('blog_stat_categories')}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{t('products_spec_hot_value')}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('products_spec_hot_title')}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{t('products_spec_cold_value')}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('products_spec_cold_title')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-12 space-y-8 sm:mt-16 sm:space-y-10 xl:mt-24 xl:space-y-12">
        <div className="page-soft-card page-accent-line p-6 md:p-10">
          <div className="max-w-2xl">
            <p className="page-kicker">{t('products_spec_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('products_spec_title')}</h2>
          </div>

          <div className="mt-6 grid gap-4 md:mt-8 md:grid-cols-2 md:gap-5 xl:grid-cols-4 xl:gap-5">
            {compactSpecCards.map(([valueKey, titleKey]) => (
              <div key={titleKey} className="flex min-h-[136px] flex-col justify-between rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.05)] sm:min-h-[168px] sm:rounded-[28px] sm:p-6">
                <div className="text-[clamp(1.5rem,7vw,2.25rem)] font-bold leading-[1.05] text-slate-900">{t(valueKey)}</div>
                <h3 className="mt-4 text-sm font-semibold leading-snug text-slate-700 sm:mt-5 sm:text-base">{t(titleKey)}</h3>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-[24px] border border-slate-200 bg-white/90 p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)] sm:mt-8 sm:rounded-[28px] sm:p-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-4">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <Filter className="h-5 w-5 flex-shrink-0 text-accent-500" />
                <span>{t('core_products')}</span>
                <span className="rounded-full border border-accent-400/18 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-3 py-1 text-xs font-semibold text-slate-800">
                  {filteredProducts.length} / {PRODUCT_DATA.length}
                </span>
              </div>

              <div className="relative w-full lg:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-accent-500" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t('search_placeholder')}
                  className="w-full rounded-full border border-accent-400/20 bg-white py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-accent-400/35"
                />
              </div>
            </div>

            <div className="mobile-scroll-fade -mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-2 pr-8 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0 sm:pr-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === cat
                      ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_10px_24px_rgba(250,204,21,0.12)]'
                      : 'bg-white text-slate-600 hover:bg-accent-400/10'
                  }`}
                >
                  {t(cat)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
            <div className="page-white-card py-16 text-center text-slate-400 sm:py-20">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">{t('no_products_found')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
            {filteredProducts.map((product) => {
              const productArticle = blogState?.productArticleBySlug[product.slug];

              return (
                <div key={product.id} className="page-soft-card flex h-full flex-col overflow-hidden transition-all duration-300 group hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]">
                  <button
                    type="button"
                    className="flex flex-1 flex-col text-left"
                    onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                  >
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <ResponsiveImage
                        src={product.image}
                        alt={t(product.nameKey)}
                        width="1200"
                        height="900"
                        responsiveWidths={[640, 960]}
                        originalWidth={1200}
                        sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 30vw, (min-width: 768px) 45vw, 92vw"
                        imgClassName="block h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute right-2.5 top-2.5 rounded-full border border-accent-400/20 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-slate-800 shadow-sm sm:right-3 sm:top-3 sm:px-3">
                        {t(product.categoryKey)}
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-4 sm:p-5">
                      <div className="mb-2 flex flex-wrap gap-2 sm:mb-3">
                        {product.featureKeys.slice(0, 2).map((key) => (
                          <span key={key} className="rounded-md border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-2 py-1 text-[10px] uppercase tracking-wider text-slate-600">
                            {t(key)}
                          </span>
                        ))}
                      </div>
                      <h3 className="min-h-[2.75rem] line-clamp-2 text-lg font-bold text-slate-900 transition-colors group-hover:text-brand-500 sm:min-h-[3.5rem]">{t(product.nameKey)}</h3>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-500 sm:mt-3">{t(product.descKey)}</p>
                      <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">
                        {product.industryKeys.slice(0, 2).map((key) => (
                          <span key={key} className="rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-2.5 py-1 text-[11px] font-medium text-slate-800">
                            {t(key)}
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                  <div className="mt-auto px-4 pb-4 sm:px-5 sm:pb-5">
                    <div className="min-h-[20px]">
                      {productArticle ? (
                        <button
                          type="button"
                          onClick={() => onNavigate(PageView.BLOG, language, productArticle.slug)}
                          className="inline-flex items-center gap-2 text-xs font-semibold text-brand-500 hover:text-accent-500"
                        >
                          {t('products_card_article_cta')} <ArrowRight className="h-3.5 w-3.5 text-accent-500" />
                        </button>
                      ) : null}
                    </div>
                    <a
                      href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`${t('product_email_subject_inquiry')} - ${t(product.nameKey)}`)}`}
                      className="mt-3 flex min-h-[56px] w-full items-center justify-center rounded-lg border border-accent-400/20 px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] hover:text-white sm:mt-4 sm:min-h-[72px]"
                    >
                      {t('btn_send_email')}
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-12 grid gap-4 xl:grid-cols-[1.05fr_0.95fr] xl:gap-6">
          <div className="page-dark-card p-6 md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-2xl">
                <p className="page-kicker-gold">{t('products_blog_title')}</p>
                <h2 className="apple-card-title mt-4">{t('products_blog_title')}</h2>
                <p className="mt-4 line-clamp-2 text-slate-300">{t('products_blog_desc')}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language)}
                className="page-secondary-button"
              >
                {t('blog_view_all')} <ArrowRight className="page-button-icon w-4 h-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
              {blogState
                ? recommendedPosts.slice(0, 2).map((post) => {
                    const localized = blogState.blogModule.getLocalizedPost(post, language);
                    return (
                      <article key={post.slug} className="rounded-[22px] border border-white/10 bg-white/10 p-5 sm:rounded-[28px] sm:p-6">
                        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">{localized.categoryLabel}</div>
                        <h3 className="mt-3 text-lg font-bold text-white leading-snug">{localized.title}</h3>
                        <p className="mt-3 text-sm text-slate-300">{blogState.blogModule.formatBlogDate(post.publishedAt, language)}</p>
                        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-300">{localized.excerpt}</p>
                        <button
                          type="button"
                          onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#ffe39a] hover:text-white"
                        >
                          {t('products_blog_cta')} <ArrowRight className="w-4 h-4" />
                        </button>
                      </article>
                    );
                  })
                : Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="rounded-[22px] border border-white/10 bg-white/10 p-5 sm:rounded-[28px] sm:p-6">
                      <div className="h-4 w-24 rounded-full bg-white/10" />
                      <div className="mt-3 h-6 w-full rounded-full bg-white/10" />
                      <div className="mt-2 h-6 w-2/3 rounded-full bg-white/10" />
                      <div className="mt-4 h-4 w-24 rounded-full bg-white/10" />
                      <div className="mt-4 h-4 w-full rounded-full bg-white/10" />
                      <div className="mt-2 h-4 w-5/6 rounded-full bg-white/10" />
                    </div>
                  ))}
            </div>
          </div>

          <div className="page-soft-card page-accent-line p-6 md:p-10">
            <p className="page-kicker">{t('product_more_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('product_more_title')}</h2>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4">
              {supportCards.map((card) => (
                <div key={card.titleKey} className="rounded-[22px] border border-slate-200 bg-white p-5 sm:rounded-[28px] sm:p-6">
                  <div className="inline-flex rounded-xl bg-white p-3 shadow-sm">{card.icon}</div>
                  <h3 className="mt-4 text-lg font-bold text-slate-900">{t(card.titleKey)}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t(card.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductDetail: React.FC<{
  blogState: ProductsBlogState | null;
  product: ProductRecord;
  onNavigate: ProductsProps['onNavigate'];
}> = ({ blogState, product, onNavigate }) => {
  const { language, t } = useLanguage();
  const productName = t(product.nameKey);
  const seoProfile = getProductSeoProfile(product.slug, productName, language);
  const relatedPosts = useMemo(
    () => (blogState ? blogState.blogModule.getRelevantBlogPosts(product.articleTerms, 3) : []),
    [blogState, product.articleTerms],
  );
  const relatedProducts = useMemo(
    () => PRODUCT_DATA.filter((entry) => entry.slug !== product.slug && entry.categoryKey === product.categoryKey).slice(0, 3),
    [product]
  );
  const solutionKeysByCategory: Record<string, string[]> = {
    cat_heavy: ['products_detail_solution_heavy_1', 'products_detail_solution_heavy_2', 'products_detail_solution_heavy_3'],
    cat_precision: ['products_detail_solution_precision_1', 'products_detail_solution_precision_2', 'products_detail_solution_precision_3'],
    cat_general: ['products_detail_solution_general_1', 'products_detail_solution_general_2', 'products_detail_solution_general_3'],
    cat_custom: ['products_detail_solution_custom_1', 'products_detail_solution_custom_2', 'products_detail_solution_custom_3'],
  };
  const riskKeysByCategory: Record<string, string[]> = {
    cat_heavy: ['products_detail_risk_heavy_1', 'products_detail_risk_heavy_2', 'products_detail_risk_heavy_3'],
    cat_precision: ['products_detail_risk_precision_1', 'products_detail_risk_precision_2', 'products_detail_risk_precision_3'],
    cat_general: ['products_detail_risk_general_1', 'products_detail_risk_general_2', 'products_detail_risk_general_3'],
    cat_custom: ['products_detail_risk_custom_1', 'products_detail_risk_custom_2', 'products_detail_risk_custom_3'],
  };
  const solutionKeys = solutionKeysByCategory[product.categoryKey] ?? solutionKeysByCategory.cat_general;
  const riskKeys = riskKeysByCategory[product.categoryKey] ?? riskKeysByCategory.cat_general;

  return (
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="p-6 md:p-10">
          <button
            type="button"
            onClick={() => onNavigate(PageView.PRODUCTS, language)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffe39a] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('products_detail_back')}
          </button>
          <div className="mt-5 grid grid-cols-1 items-center gap-6 lg:mt-6 lg:grid-cols-[1.1fr,0.9fr] lg:gap-10">
            <div>
              <div className="page-chip">
                {t(product.categoryKey)}
              </div>
              <h1 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:mt-5 md:text-5xl">{productName}</h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg md:mt-5">{t(product.descKey)}</p>
              <div className="-mx-1 mt-6 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:mt-8 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
                {product.featureKeys.map((key) => (
                  <span key={key} className="page-chip shrink-0">
                    {t(key)}
                  </span>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.CONTACT, language)}
                  className="page-secondary-button w-full sm:w-auto"
                >
                  {t('products_detail_primary')} <ArrowRight className="page-button-icon w-4 h-4" />
                </button>
                <a
                  href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`${t('product_email_subject_drawing_review')} - ${t(product.nameKey)}`)}`}
                  className="page-dark-button w-full sm:w-auto"
                >
                  {t('products_detail_secondary')} <ArrowRight className="w-4 h-4 text-accent-400" />
                </a>
              </div>
            </div>
            <div className="flex aspect-[4/3] items-center justify-center overflow-hidden">
              <ResponsiveImage
                src={product.image}
                alt={t(product.nameKey)}
                width="1200"
                height="900"
                responsiveWidths={[640, 960]}
                originalWidth={1200}
                sizes="(min-width: 1024px) 42vw, 100vw"
                imgClassName="block h-full w-full object-contain"
                loading="eager"
                fetchPriority="high"
                decoding="async"
              />
            </div>
          </div>
        </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-10 space-y-10 sm:mt-14 sm:space-y-12 md:space-y-14">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
          <div className="md:col-span-2 page-soft-card page-accent-line p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('products_detail_overview')}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">{t(product.descKey)}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">{seoProfile.overview}</p>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:mt-8 md:grid-cols-2 md:gap-6">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('products_card_application')}</h3>
                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  {product.industryKeys.map((key) => (
                    <span key={key} className="shrink-0 rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-3 py-1.5 text-sm font-medium text-slate-800">
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('products_card_process')}</h3>
                <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
                  {product.processKeys.map((key) => (
                    <span key={key} className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="page-soft-card page-accent-line p-6 sm:p-8">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('products_detail_specs')}</div>
            <div className="mt-4 space-y-3 sm:space-y-4">
              {product.specKeys.map((spec) => (
                <div key={spec.titleKey} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
                  <div className="text-xl font-bold text-slate-900 sm:text-2xl">{t(spec.valueKey)}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{t(spec.titleKey)}</div>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">{t(spec.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <div className="page-soft-card page-accent-line p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('products_detail_solution_title')}</h2>
            <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              {solutionKeys.map((key) => (
                <div key={key} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-700">
                  {t(key)}
                </div>
              ))}
            </div>
          </div>

          <div className="page-soft-card page-accent-line p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('products_detail_risk_title')}</h2>
            <div className="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
              {riskKeys.map((key) => (
                <div key={key} className="rounded-2xl border border-accent-400/18 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] p-4 text-sm leading-relaxed text-slate-700">
                  {t(key)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="page-soft-card page-accent-line p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('products_detail_keyword_title')}</h2>
          <div className="mobile-scroll-fade -mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-2 pr-8 sm:mx-0 sm:mt-6 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0 sm:pr-0">
            {seoProfile.keywords.map((keyword) => (
              <span key={keyword} className="shrink-0 rounded-full border border-accent-400/18 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-4 py-2 text-sm font-semibold text-slate-900">
                {keyword}
              </span>
            ))}
          </div>
        </section>

        <section className="page-dark-card p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-white sm:text-2xl">{t('products_detail_cta_title')}</h2>
              <p className="mt-3 text-slate-200 leading-relaxed">{t('products_detail_cta_desc')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="page-secondary-button w-full sm:w-auto"
              >
                {t('products_detail_primary')} <ArrowRight className="page-button-icon w-4 h-4" />
              </button>
              <a
                href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`${t('product_email_subject_technical_review')} - ${t(product.nameKey)}`)}`}
                className="page-dark-button w-full sm:w-auto"
              >
                {t('products_detail_secondary')} <ArrowRight className="w-4 h-4 text-accent-400" />
              </a>
            </div>
          </div>
        </section>

        {blogState && relatedPosts.length > 0 ? (
          <section className="page-soft-card page-accent-line p-6 sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
              <div className="max-w-3xl">
                <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('products_detail_related')}</h2>
                <p className="mt-3 text-slate-600 leading-relaxed">{t('products_blog_desc')}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language)}
                className="page-secondary-button w-full sm:w-auto"
              >
                {t('blog_view_all')} <ArrowRight className="page-button-icon w-4 h-4" />
              </button>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-3 md:gap-5">
              {relatedPosts.map((post, index) => {
                const localized = blogState.blogModule.getLocalizedPost(post, language);
                return (
                  <article key={post.slug} className={`page-soft-card p-5 sm:p-6 ${index === 2 ? 'hidden md:block' : ''}`}>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{localized.categoryLabel}</div>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900">{localized.title}</h3>
                    <p className="mt-3 text-sm text-slate-500">{blogState.blogModule.formatBlogDate(post.publishedAt, language)}</p>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-4">{localized.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
                    >
                      {t('products_blog_cta')} <ArrowRight className="w-4 h-4 text-accent-500" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {relatedProducts.length > 0 ? (
          <section className="page-soft-card page-accent-line p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('blog_products_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('blog_products_desc')}</p>
            <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-3 md:gap-6">
              {relatedProducts.map((entry, index) => (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, entry.slug)}
                  className={`page-soft-card overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${index === 2 ? 'hidden md:block' : ''}`}
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <ResponsiveImage
                      src={entry.image}
                      alt={t(entry.nameKey)}
                      width="1600"
                      height="1000"
                      responsiveWidths={[640, 960]}
                      originalWidth={1200}
                      sizes="(min-width: 768px) 33vw, 92vw"
                      imgClassName="block h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t(entry.categoryKey)}</div>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900 sm:text-xl">{t(entry.nameKey)}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">{t(entry.descKey)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500">
                      {t('blog_products_cta')} <ArrowRight className="w-4 h-4 text-accent-500" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </section>
    </div>
  );
};

export const Products: React.FC<ProductsProps> = ({ slug, onNavigate }) => {
  const blogState = useProductsBlogState();
  const product = getProductBySlug(slug);

  if (slug && product) {
    return <ProductDetail blogState={blogState} product={product} onNavigate={onNavigate} />;
  }

  return <ProductList blogState={blogState} onNavigate={onNavigate} />;
};

export default Products;
