import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Cable, Filter, Layers3, Search, Wrench } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { Language } from '../utils/translations';
import { formatBlogDate, getLocalizedPost, getRelevantBlogPosts } from '../utils/blog';
import { getProductSeoProfile } from '../utils/productSeo';
import { getProductBySlug, PRODUCT_DATA, type ProductRecord } from '../data/products';

interface ProductsProps {
  slug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

const buildProductBuyerChecklist = (product: ProductRecord, t: (key: string) => string) => [
  `Application fit: ${product.industryKeys.map((key) => t(key)).join(', ')}.`,
  `Manufacturing route: ${product.processKeys.map((key) => t(key)).join(', ')}.`,
  `Validation scope: ${product.specKeys.map((spec) => `${t(spec.titleKey)} ${t(spec.valueKey)}`).join('; ')}.`,
];

const buildProductCapabilityNarrative = (product: ProductRecord, t: (key: string) => string) => {
  const featureText = product.featureKeys.map((key) => t(key)).join(', ');
  const processText = product.processKeys.map((key) => t(key)).join(', ');
  const industryText = product.industryKeys.map((key) => t(key)).join(', ');

  return [
    `${t(product.nameKey)} programs are usually evaluated against the end-use environment, expected cycle life, installation space, and downstream assembly tolerance. This page is written to help buyers compare manufacturing fit instead of only browsing a short catalog description.`,
    `Typical project conversations combine ${featureText} with process requirements such as ${processText}. In practice, buyers also need to know whether the supplier can keep dimensional consistency and repeatable load behavior across production batches.`,
    `For teams sourcing into ${industryText}, the useful discussion is normally about drawing review, material route, finish, inspection, and delivery readiness. That is the gap this product page is intended to close.`,
  ];
};

const ProductList: React.FC<ProductsProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState('cat_all');
  const [searchTerm, setSearchTerm] = useState('');

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
    const matchesSearch = !searchTerm || haystack.includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const insightTermsByFilter: Record<string, string[]> = {
    cat_all: ['spring selection', 'material selection', 'failure analysis', 'drawing review'],
    cat_precision: ['wave springs', 'contact springs', 'precision assembly', 'drawing review'],
    cat_heavy: ['hot coiling', 'disc springs', 'power equipment', 'fatigue life'],
    cat_general: ['compression springs', 'cold coiling', 'spring materials'],
    cat_custom: ['custom wire forms', 'constant force springs', 'retaining rings', 'motion control'],
  };

  const recommendedPosts = getRelevantBlogPosts([...(insightTermsByFilter[filter] ?? insightTermsByFilter.cat_all), searchTerm], 3);

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('nav_products')}</h1>
          <p className="text-slate-500 max-w-2xl">{t('product_header_desc')}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">{t('products_spec_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('products_spec_desc')}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {[
              ['products_spec_cold_value', 'products_spec_cold_title', 'products_spec_cold_desc'],
              ['products_spec_hot_value', 'products_spec_hot_title', 'products_spec_hot_desc'],
              ['products_spec_test_value', 'products_spec_test_title', 'products_spec_test_desc'],
              ['products_spec_application_value', 'products_spec_application_title', 'products_spec_application_desc'],
            ].map(([valueKey, titleKey, descKey]) => (
              <div key={titleKey} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="text-2xl font-bold text-slate-900">{t(valueKey)}</div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{t(titleKey)}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t(descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">{t('products_keyword_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('products_keyword_desc')}</p>
          </div>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[
              'home_keyword_1_title',
              'home_keyword_2_title',
              'home_keyword_3_title',
              'home_keyword_4_title',
              'home_keyword_5_title',
              'home_keyword_6_title',
            ].map((key) => (
              <div key={key} className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-800">
                {t(key)}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === cat ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {t(cat)}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">{t('no_products_found')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const productArticle = getRelevantBlogPosts(product.articleTerms, 1)[0];

              return (
                <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                  >
                    <div className="aspect-[4/3] bg-gradient-to-br from-white via-slate-50 to-slate-100 relative p-4">
                      <img
                        src={product.image}
                        alt={t(product.nameKey)}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                        {t(product.categoryKey)}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{t(product.nameKey)}</h3>
                      <p className="text-sm text-slate-500 mb-4 line-clamp-2">{t(product.descKey)}</p>
                    </div>
                  </button>
                  <div className="px-5 pb-5">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {product.featureKeys.slice(0, 3).map((key) => (
                        <span key={key} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                          {t(key)}
                        </span>
                      ))}
                    </div>
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_card_application')}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.industryKeys.map((key) => (
                            <span key={key} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-800">
                              {t(key)}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_card_process')}</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {product.processKeys.map((key) => (
                            <span key={key} className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                              {t(key)}
                            </span>
                          ))}
                        </div>
                      </div>
                      {productArticle ? (
                        <button
                          type="button"
                          onClick={() => onNavigate(PageView.BLOG, language, productArticle.slug)}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-blue-200 hover:bg-blue-50"
                        >
                          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_card_article')}</div>
                          <div className="mt-2 text-sm font-semibold leading-snug text-slate-900">
                            {getLocalizedPost(productArticle, language).title}
                          </div>
                          <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-blue-700">
                            {t('products_card_article_cta')} <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </button>
                      ) : null}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                        className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-900 hover:text-white"
                      >
                        {t('product_details')}
                      </button>
                      <a
                        href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`Product Inquiry - ${t(product.nameKey)}`)}`}
                        className="block w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 text-center hover:bg-slate-900 hover:text-white transition-colors"
                      >
                        {t('btn_send_email')}
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
          <div className="mb-10 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8">
            <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">{t('products_blog_title')}</h2>
                <p className="mt-3 text-slate-600 leading-relaxed">{t('products_blog_desc')}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              >
                {t('blog_view_all')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-5">
              {recommendedPosts.map((post) => {
                const localized = getLocalizedPost(post, language);
                return (
                  <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{localized.categoryLabel}</div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">{localized.title}</h3>
                    <p className="mt-3 text-sm text-slate-500">{formatBlogDate(post.publishedAt, language)}</p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">{localized.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {t('products_blog_cta')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('seo_scope_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('seo_scope_desc')}</p>
          </div>

          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('product_more_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('product_more_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Cable className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('product_power_eq_name')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t('product_power_eq_desc')}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Layers3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('product_high_pressure_name')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t('product_high_pressure_desc')}</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('assembly_service_title')}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{t('assembly_service_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductDetail: React.FC<{ product: ProductRecord; onNavigate: ProductsProps['onNavigate'] }> = ({ product, onNavigate }) => {
  const { language, t } = useLanguage();
  const productName = t(product.nameKey);
  const seoProfile = getProductSeoProfile(product.slug, productName);
  const relatedPosts = useMemo(() => getRelevantBlogPosts(product.articleTerms, 3), [product.articleTerms]);
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
  const buyerChecklist = buildProductBuyerChecklist(product, t);
  const capabilityNarrative = language === 'en' ? buildProductCapabilityNarrative(product, t) : [];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <button
            type="button"
            onClick={() => onNavigate(PageView.PRODUCTS, language)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('products_detail_back')}
          </button>
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1.1fr,0.9fr] gap-10 items-center">
            <div>
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-200">
                {t(product.categoryKey)}
              </div>
              <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">{productName}</h1>
              <p className="mt-5 max-w-3xl text-lg text-slate-300 leading-relaxed">{t(product.descKey)}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {product.featureKeys.map((key) => (
                  <span key={key} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200">
                    {t(key)}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.CONTACT, language)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
                >
                  {t('products_detail_primary')} <ArrowRight className="w-4 h-4" />
                </button>
                <a
                  href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`Drawing Review - ${t(product.nameKey)}`)}`}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
                >
                  {t('products_detail_secondary')} <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
              <div className="aspect-[4/3] rounded-[28px] bg-white p-6">
                <img src={product.image} alt={t(product.nameKey)} className="h-full w-full object-contain" loading="eager" fetchPriority="high" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_overview')}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t(product.descKey)}</p>
            <p className="mt-4 text-slate-600 leading-relaxed">{seoProfile.overview}</p>
            {language === 'en' ? (
              <p className="mt-4 text-slate-600 leading-relaxed">{seoProfile.description}</p>
            ) : null}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_card_application')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.industryKeys.map((key) => (
                    <span key={key} className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-800">
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_card_process')}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.processKeys.map((key) => (
                    <span key={key} className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
                      {t(key)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-slate-50 p-8 shadow-sm">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">{t('products_detail_specs')}</div>
            <div className="mt-4 space-y-4">
              {product.specKeys.map((spec) => (
                <div key={spec.titleKey} className="rounded-2xl border border-white bg-white/90 p-5">
                  <div className="text-2xl font-bold text-slate-900">{t(spec.valueKey)}</div>
                  <div className="mt-2 text-sm font-semibold text-slate-900">{t(spec.titleKey)}</div>
                  <p className="mt-2 text-sm text-slate-600 leading-relaxed">{t(spec.descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {language === 'en' ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="max-w-4xl">
              <h2 className="text-2xl font-bold text-slate-900">OEM sourcing and engineering fit</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">
                Buyers searching for terms like {seoProfile.keywords.slice(0, 2).join(' and ')} are usually not looking for generic catalog copy.
                They need to know whether the supplier can translate drawings, load targets, material constraints, and inspection requirements into a stable production route.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {capabilityNarrative.map((paragraph, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">
                    {index === 0 ? 'Project evaluation' : index === 1 ? 'Manufacturing control' : 'Batch delivery readiness'}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{paragraph}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_solution_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('products_detail_solution_desc')}</p>
            <div className="mt-6 space-y-4">
              {solutionKeys.map((key) => (
                <div key={key} className="rounded-2xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                  {t(key)}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_risk_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('products_detail_risk_desc')}</p>
            <div className="mt-6 space-y-4">
              {riskKeys.map((key) => (
                <div key={key} className="rounded-2xl bg-orange-50 p-4 text-sm leading-relaxed text-slate-700">
                  {t(key)}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_keyword_title')}</h2>
          <p className="mt-3 max-w-3xl text-slate-600 leading-relaxed">{t('products_detail_keyword_desc')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {seoProfile.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-900">
                {keyword}
              </span>
            ))}
          </div>
          {language === 'en' ? (
            <p className="mt-6 max-w-4xl text-slate-600 leading-relaxed">
              These phrases are included intentionally because industrial buyers often search by manufacturer, supplier, or custom-production intent before they ever know a factory name.
              Matching that language improves topical relevance for pages such as {productName.toLowerCase()} and helps connect commercial search demand to technical review content.
            </p>
          ) : null}
        </section>

        {language === 'en' ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">What buyers usually confirm before sampling</h2>
            <p className="mt-3 max-w-4xl text-slate-600 leading-relaxed">
              The fastest path to quotation is a clear drawing or sample plus the operating load, travel, life target, finish requirement, and batch expectation.
              For custom programs, supplier fit is normally decided by how early those variables are clarified.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {buyerChecklist.map((item) => (
                <div key={item} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <h3 className="text-lg font-bold text-slate-900">Review checkpoint</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_specs')}</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-5">
            {product.specKeys.map((spec) => (
              <div key={spec.titleKey} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-lg font-bold text-slate-900">{t(spec.titleKey)}</h3>
                <div className="mt-3 text-2xl font-bold text-slate-900">{t(spec.valueKey)}</div>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{t(spec.descKey)}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_cta_title')}</h2>
              <p className="mt-3 text-slate-600 leading-relaxed">{t('products_detail_cta_desc')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
              >
                {t('products_detail_primary')} <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`Technical Review - ${t(product.nameKey)}`)}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {t('products_detail_secondary')} <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-6 flex-col lg:flex-row">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-slate-900">{t('products_detail_related')}</h2>
                <p className="mt-3 text-slate-600 leading-relaxed">{t('products_blog_desc')}</p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language)}
                className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-900"
              >
                {t('blog_view_all')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedPosts.map((post) => {
                const localized = getLocalizedPost(post, language);
                return (
                  <article key={post.slug} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{localized.categoryLabel}</div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 leading-snug">{localized.title}</h3>
                    <p className="mt-3 text-sm text-slate-500">{formatBlogDate(post.publishedAt, language)}</p>
                    <p className="mt-4 text-sm text-slate-600 leading-relaxed">{localized.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, post.slug)}
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                    >
                      {t('products_blog_cta')} <ArrowRight className="w-4 h-4" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        {relatedProducts.length > 0 ? (
          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{t('blog_products_title')}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{t('blog_products_desc')}</p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((entry) => (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, entry.slug)}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] bg-white p-6">
                    <img src={entry.image} alt={t(entry.nameKey)} className="h-full w-full object-contain" loading="lazy" decoding="async" />
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t(entry.categoryKey)}</div>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{t(entry.nameKey)}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{t(entry.descKey)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      {t('blog_products_cta')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export const Products: React.FC<ProductsProps> = ({ slug, onNavigate }) => {
  const product = getProductBySlug(slug);

  if (slug && product) {
    return <ProductDetail product={product} onNavigate={onNavigate} />;
  }

  return <ProductList onNavigate={onNavigate} />;
};

export default Products;
