import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, Search } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedPath, PageView } from '../types';
import {
  BLOG_POSTS_PER_PAGE,
  getAllBlogTagSlugs,
  getBlogArchiveContext,
  BLOG_CATEGORIES,
  getBlogCategoryFromSlug,
  getBlogCategoryPath,
  getBlogCategoryPagePath,
  getBlogPagePath,
  getBlogPostsByTag,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getBlogTagFromSlug,
  getBlogTagPath,
  getBlogTagPagePath,
  getDisplayTagName,
  getNormalizedTagSlug,
  getFeaturedBlogPosts,
  getLocalizedPost,
  paginateBlogPosts,
  formatBlogDate,
  getRelatedBlogPosts,
} from '../utils/blog';
import { Language } from '../utils/translations';
import { PRODUCT_DATA } from '../data/products';

interface BlogProps {
  slug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

const getCategoryLabel = (category: keyof typeof BLOG_CATEGORIES, language: string) =>
  language === 'zh' ? BLOG_CATEGORIES[category].zh : language === 'ru' ? BLOG_CATEGORIES[category].ru : BLOG_CATEGORIES[category].en;

const BLOG_PRODUCT_CANDIDATES = PRODUCT_DATA.filter((product) => product.articleTerms.length > 0);

const BlogList: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const archiveContext = getBlogArchiveContext(slug) ?? { page: 1 };
  const activeCategory = archiveContext.category;
  const activeTag = archiveContext.tag;
  const [searchTerm, setSearchTerm] = React.useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const featuredPosts = getFeaturedBlogPosts().slice(0, 2);
  const sourcePosts = activeTag ? getBlogPostsByTag(activeTag) : getBlogPostsByCategory(activeCategory);
  const allPosts = sourcePosts.filter((post) => {
    if (!searchTerm.trim()) {
      return true;
    }
    const localized = getLocalizedPost(post, language);
    const haystack = `${localized.title} ${localized.excerpt} ${post.tags.join(' ')}`.toLowerCase();
    return haystack.includes(searchTerm.trim().toLowerCase());
  });
  const pagination = paginateBlogPosts(allPosts, archiveContext.page);
  const categoryFilters: Array<'all' | keyof typeof BLOG_CATEGORIES> = ['all', 'guide', 'news', 'insight'];
  const activeCategoryLabel = activeCategory ? getCategoryLabel(activeCategory, language) : null;
  const activeTagLabel = activeTag ? getDisplayTagName(activeTag) : null;
  const tagSlugs = getAllBlogTagSlugs();
  const blogSearch = searchTerm.trim() ? `q=${encodeURIComponent(searchTerm.trim())}` : undefined;
  const navigateBlog = (nextSlug?: string) => onNavigate(PageView.BLOG, language, nextSlug, blogSearch);
  const buildPageSlug = (page: number) => {
    if (activeTag) {
      return getBlogTagPagePath(activeTag, page);
    }
    if (activeCategory) {
      return getBlogCategoryPagePath(activeCategory, page);
    }
    return getBlogPagePath(page);
  };

  React.useEffect(() => {
    const syncSearchFromUrl = () => {
      setSearchTerm(new URLSearchParams(window.location.search).get('q') ?? '');
    };

    syncSearchFromUrl();
    window.addEventListener('popstate', syncSearchFromUrl);
    return () => window.removeEventListener('popstate', syncSearchFromUrl);
  }, []);

  React.useEffect(() => {
    const nextPath = `${window.location.pathname}${blogSearch ? `?${blogSearch}` : ''}`;
    if (`${window.location.pathname}${window.location.search}` !== nextPath) {
      window.history.replaceState({}, '', nextPath);
    }
  }, [blogSearch]);

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <span className="inline-flex items-center rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-blue-200">
            {activeTagLabel ?? activeCategoryLabel ?? t('blog_label')}
          </span>
          <h1 className="mt-6 text-4xl md:text-5xl font-bold max-w-4xl leading-tight">
            {activeTagLabel ? `${activeTagLabel} ${t('blog_tag_archive_title')}` : activeCategoryLabel ? `${activeCategoryLabel} ${t('nav_blog')}` : t('blog_title')}
          </h1>
          <p className="mt-5 max-w-3xl text-slate-300 text-lg leading-relaxed">
            {activeTagLabel
              ? `${t('blog_tag_archive_desc')} ${activeTagLabel}.`
              : activeCategoryLabel
                ? `${t('blog_desc')} ${activeCategoryLabel}.`
                : t('blog_desc')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">{t('blog_stat_articles')}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{sourcePosts.length}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">{t('blog_stat_categories')}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{Object.keys(BLOG_CATEGORIES).length}</div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <div className="text-sm text-slate-500">{t('blog_stat_tags')}</div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{tagSlugs.length}</div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{t('blog_featured_title')}</h2>
              <p className="mt-2 text-slate-600">{t('blog_featured_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => {
              const localized = getLocalizedPost(post, language);
              return (
                <article
                  key={post.slug}
                  className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => onNavigate(PageView.BLOG, language, post.slug, blogSearch)}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-slate-200">
                      <img
                        src={post.coverImage}
                        alt={localized.title}
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <div className="p-7">
                      <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">{localized.categoryLabel}</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatBlogDate(post.publishedAt, language)}
                        </span>
                      </div>
                      <h3 className="mt-4 text-2xl font-bold text-slate-900 leading-snug">{localized.title}</h3>
                      <p className="mt-4 text-slate-600 leading-relaxed">{localized.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                        {t('blog_read_more')} <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="rounded-[28px] bg-slate-900 p-8 md:p-10 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold">{t('blog_list_cta_title')}</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">{t('blog_list_cta_desc')}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {t('blog_list_cta_primary')} <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.PRODUCTS, language)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                {t('blog_list_cta_secondary')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{t('blog_latest_title')}</h2>
            <p className="mt-2 text-slate-600">{t('blog_latest_desc')}</p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('blog_search_placeholder')}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-slate-400"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {categoryFilters.map((category) => {
              const label = category === 'all' ? t('blog_filter_all') : getCategoryLabel(category, language);
              const active = category === 'all' ? !activeCategory : activeCategory === category;
              const disabled = Boolean(activeTag);

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    onNavigate(
                      PageView.BLOG,
                      language,
                      category === 'all' ? undefined : getBlogCategoryPath(category),
                      blogSearch
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                  disabled={disabled}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{t('blog_tags_title')}</h3>
              {activeTag ? (
                <button
                  type="button"
                  onClick={() => onNavigate(PageView.BLOG, language, undefined, blogSearch)}
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900"
                >
                  {t('blog_clear_tag')}
                </button>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-3">
              {tagSlugs.map((tagSlug) => {
                const active = activeTag === tagSlug;
                return (
                  <button
                    key={tagSlug}
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, getBlogTagPath(tagSlug), blogSearch)}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      active ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-800 border border-blue-100'
                    }`}
                  >
                    #{getDisplayTagName(tagSlug)}
                  </button>
                );
              })}
            </div>
          </div>

          {pagination.items.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-slate-500">
              {t('blog_no_results')}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {pagination.items.map((post) => {
              const localized = getLocalizedPost(post, language);
              return (
                <article key={post.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                    <span>{localized.categoryLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3.5 h-3.5" />
                      {post.readingMinutes} {t('blog_reading_time')}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-slate-900 leading-snug">{localized.title}</h3>
                  <p className="mt-3 text-sm text-slate-500">{formatBlogDate(post.publishedAt, language)}</p>
                  <p className="mt-4 text-slate-600 leading-relaxed">{localized.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, post.slug, blogSearch)}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                  >
                    {t('blog_open_article')} <ArrowRight className="w-4 h-4" />
                  </button>
                </article>
              );
            })}
            </div>
          )}

          {pagination.totalPages > 1 ? (
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => navigateBlog(buildPageSlug(pagination.page - 1))}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                {t('blog_prev_page')}
              </button>
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => navigateBlog(buildPageSlug(pageNumber))}
                  className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold ${
                    pageNumber === pagination.page ? 'bg-slate-900 text-white' : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => navigateBlog(buildPageSlug(pagination.page + 1))}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
              >
                {t('blog_next_page')}
              </button>
            </div>
          ) : null}

          <p className="text-center text-sm text-slate-500">
            {t('blog_page_status')} {pagination.page} / {pagination.totalPages} · {allPosts.length} {t('blog_total_posts')} · {BLOG_POSTS_PER_PAGE} / {t('blog_per_page')}
          </p>
        </section>
      </div>
    </div>
  );
};

const BlogArticle: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <h1 className="text-4xl font-bold text-slate-900">{t('blog_not_found_title')}</h1>
          <p className="mt-4 text-slate-600">{t('blog_not_found_desc')}</p>
          <button
            type="button"
            onClick={() => onNavigate(PageView.BLOG, language)}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog_back_to_list')}
          </button>
        </div>
      </div>
    );
  }

  const localized = getLocalizedPost(post, language);
  const relatedPosts = getRelatedBlogPosts(post, 2);
  const relatedProducts = BLOG_PRODUCT_CANDIDATES
    .map((product) => {
      const haystack = [post.slug, post.category, ...post.tags, localized.title, localized.excerpt].join(' ').toLowerCase();
      const score = product.articleTerms.reduce((total, term) => total + Number(haystack.includes(term.toLowerCase())), 0);
      return { ...product, score };
    })
    .filter((product) => product.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

  return (
    <div className="pt-20 min-h-screen bg-white">
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <a
            href={getLocalizedPath(PageView.BLOG, language)}
            onClick={(event) => {
              event.preventDefault();
              onNavigate(PageView.BLOG, language);
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('blog_back_to_list')}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">
            <button
              type="button"
              onClick={() => onNavigate(PageView.BLOG, language, getBlogCategoryPath(post.category))}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 hover:bg-white/10"
            >
              {localized.categoryLabel}
            </button>
            <span>{formatBlogDate(post.publishedAt, language)}</span>
            <span>{post.readingMinutes} {t('blog_reading_time')}</span>
          </div>
          <h1 className="mt-5 text-4xl md:text-5xl font-bold leading-tight">{localized.title}</h1>
          <p className="mt-5 text-lg text-slate-300 max-w-3xl leading-relaxed">{localized.excerpt}</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-slate-50 shadow-sm">
          <img
            src={post.coverImage}
            alt={localized.title}
            className="w-full aspect-[16/8] object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>

        <article className="mx-auto max-w-3xl py-12">
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
            <span>{t('blog_published_on')}: {formatBlogDate(post.publishedAt, language)}</span>
            <span>{t('blog_updated_on')}: {formatBlogDate(post.updatedAt, language)}</span>
          </div>

          <div className="mt-8 space-y-6 text-lg leading-8 text-slate-700">
            {localized.content.map((paragraph: string, index: number) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language, getBlogTagPath(getNormalizedTagSlug(tag)))}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 hover:bg-slate-200"
              >
                #{tag}
              </button>
            ))}
          </div>
        </article>

        {relatedProducts.length > 0 ? (
          <section className="mx-auto max-w-5xl border-t border-slate-200 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">{t('blog_products_title')}</h2>
              <p className="mt-2 text-slate-600">{t('blog_products_desc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProducts.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 text-left transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="aspect-[16/9] bg-white p-6">
                    <img
                      src={product.image}
                      alt={t(product.nameKey)}
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {t('nav_products')}
                    </div>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{t(product.nameKey)}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{t(product.descKey)}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      {t('blog_products_cta')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-5xl border-t border-slate-200 py-12">
          <div className="rounded-[28px] bg-slate-900 p-8 md:p-10 text-white">
            <div className="max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold">{t('blog_cta_title')}</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">{t('blog_cta_desc')}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
              >
                {t('blog_cta_primary')} <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.PRODUCTS, language)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white"
              >
                {t('blog_cta_secondary')} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="mx-auto max-w-5xl border-t border-slate-200 py-12">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">{t('blog_related_title')}</h2>
              <p className="mt-2 text-slate-600">{t('blog_related_desc')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedLocalized = getLocalizedPost(relatedPost, language);
                return (
                  <button
                    key={relatedPost.slug}
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, relatedPost.slug)}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <p className="text-sm text-slate-500">{formatBlogDate(relatedPost.publishedAt, language)}</p>
                    <h3 className="mt-3 text-xl font-bold text-slate-900">{relatedLocalized.title}</h3>
                    <p className="mt-3 text-slate-600 leading-relaxed">{relatedLocalized.excerpt}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
                      {t('blog_read_more')} <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export const Blog: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const archiveContext = getBlogArchiveContext(slug);

  if (slug && !archiveContext) {
    return <BlogArticle slug={slug} onNavigate={onNavigate} />;
  }

  return <BlogList slug={slug} onNavigate={onNavigate} />;
};

export default Blog;
