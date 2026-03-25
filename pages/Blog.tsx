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
  getLocalizedCategoryLabel,
  getLocalizedPost,
  paginateBlogPosts,
  formatBlogDate,
  getRelatedBlogPosts,
} from '../utils/blog';
import { type Language } from '../utils/languages';
import { PRODUCT_DATA } from '../data/products';

interface BlogProps {
  slug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

const BLOG_PRODUCT_CANDIDATES = PRODUCT_DATA.filter((product) => product.articleTerms.length > 0);
const getBlogProgramCards = (t: (key: string) => string) => [
  {
    title: t('blog_program_card_procurement_title'),
    desc: t('blog_program_card_procurement_desc'),
    slug: getBlogTagPath(getNormalizedTagSlug('custom spring manufacturer')),
  },
  {
    title: t('blog_program_card_technical_title'),
    desc: t('blog_program_card_technical_desc'),
    slug: getBlogCategoryPath('insight'),
  },
  {
    title: t('blog_program_card_application_title'),
    desc: t('blog_program_card_application_desc'),
    slug: getBlogTagPath(getNormalizedTagSlug('disc springs')),
  },
];

const getBlogQuestionSectionCopy = (t: (key: string) => string) => ({
  title: t('blog_questions_title'),
  desc: t('blog_questions_desc'),
});

const getBlogArticleSupportCopy = (t: (key: string) => string) => ({
  takeawaysTitle: t('blog_takeaways_title'),
  takeawaysDesc: t('blog_takeaways_desc'),
  checklistTitle: t('blog_checklist_title'),
  checklistDesc: t('blog_checklist_desc'),
});

const isProductCoverImage = (src: string) => src.startsWith('/products/');

interface BlogCoverProps {
  src: string;
  alt: string;
  variant?: 'card' | 'hero';
  loading?: 'lazy' | 'eager';
  fetchPriority?: 'high' | 'low' | 'auto';
}

const BlogCover: React.FC<BlogCoverProps> = ({
  src,
  alt,
  variant = 'card',
  loading = 'lazy',
  fetchPriority,
}) => {
  const isProductCover = isProductCoverImage(src);
  const frameClassName = variant === 'hero'
    ? isProductCover
      ? 'aspect-[16/9] sm:aspect-[16/8] bg-[linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-4 sm:p-5 md:p-8'
      : 'aspect-[16/9] sm:aspect-[16/8] bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]'
    : isProductCover
      ? 'aspect-[16/9] sm:aspect-[16/10] bg-[linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-4 sm:p-5'
      : 'aspect-[16/9] sm:aspect-[16/10] bg-[linear-gradient(180deg,#f8fafc_0%,#e2e8f0_100%)]';
  const imageClassName = isProductCover
    ? 'h-full w-full object-contain'
    : 'h-full w-full object-cover';
  const priorityProps = fetchPriority ? { fetchPriority } : {};

  return (
    <div className={`overflow-hidden ${variant === 'hero' ? 'rounded-[22px] sm:rounded-[28px]' : ''} ${frameClassName}`}>
      <img
        src={src}
        alt={alt}
        width="1600"
        height={variant === 'hero' ? '800' : '900'}
        className={imageClassName}
        loading={loading}
        decoding="async"
        {...priorityProps}
      />
    </div>
  );
};

const BlogList: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const archiveContext = getBlogArchiveContext(slug) ?? { page: 1 };
  const activeCategory = archiveContext.category;
  const activeTag = archiveContext.tag;
  const [searchTerm, setSearchTerm] = React.useState(() => new URLSearchParams(window.location.search).get('q') ?? '');
  const featuredPosts = getFeaturedBlogPosts().slice(0, 3);
  const programCards = getBlogProgramCards(t);
  const questionSectionCopy = getBlogQuestionSectionCopy(t);
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
  const activeCategoryLabel = activeCategory ? getLocalizedCategoryLabel(activeCategory, language) : null;
  const activeTagLabel = activeTag ? getDisplayTagName(activeTag) : null;
  const allTagSlugs = getAllBlogTagSlugs();
  const tagCounts = sourcePosts.reduce((counts, post) => {
    post.tags.forEach((tag) => {
      const tagSlug = getNormalizedTagSlug(tag);
      counts.set(tagSlug, (counts.get(tagSlug) ?? 0) + 1);
    });
    return counts;
  }, new Map<string, number>());
  const tagSlugs = allTagSlugs
    .filter((tagSlug) => (tagCounts.get(tagSlug) ?? 0) > 0)
    .sort((a, b) => {
      const countDiff = (tagCounts.get(b) ?? 0) - (tagCounts.get(a) ?? 0);
      if (countDiff !== 0) {
        return countDiff;
      }
      return getDisplayTagName(a).localeCompare(getDisplayTagName(b));
    });
  const questionPosts = sourcePosts
    .filter((post) => {
      const title = getLocalizedPost(post, language).title;
      return title.includes('?') || title.includes('？');
    })
    .slice(0, 6);
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
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-start">
            <div>
              <h1 className="max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {activeTagLabel ? `${activeTagLabel} ${t('blog_tag_archive_title')}` : activeCategoryLabel ? `${activeCategoryLabel} ${t('nav_blog')}` : t('blog_title')}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:mt-5 sm:text-lg">
                {activeTagLabel
                  ? `${t('blog_tag_archive_desc')} ${activeTagLabel}.`
                  : activeCategoryLabel
                    ? `${t('blog_desc')} ${activeCategoryLabel}.`
                    : t('blog_desc')}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-5 sm:rounded-[36px] sm:p-7">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{sourcePosts.length}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('blog_stat_articles')}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{Object.keys(BLOG_CATEGORIES).length}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('blog_stat_categories')}</div>
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/10 p-4 sm:col-span-1 sm:p-5 col-span-2">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">{allTagSlugs.length}</div>
                  <div className="mt-1.5 text-xs font-semibold text-[#ffe39a] sm:mt-2 sm:text-sm">{t('blog_stat_tags')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-12 space-y-10 sm:mt-16 sm:space-y-12 xl:mt-24 xl:space-y-16">
        {!activeTag && !activeCategory && !searchTerm.trim() ? (
          <section className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-5">
            {programCards.map((card) => (
              <button
                key={card.title}
                type="button"
                onClick={() => navigateBlog(card.slug)}
                className="page-soft-card page-accent-line p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-7"
              >
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('blog_label')}</div>
                <h2 className="mt-3 text-xl font-bold text-slate-900 sm:mt-4 sm:text-2xl">{card.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">{card.desc}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 sm:mt-5">
                  {t('blog_read_more')} <ArrowRight className="w-4 h-4 text-accent-500" />
                </span>
              </button>
            ))}
          </section>
        ) : null}

        {!activeTag && !activeCategory && !searchTerm.trim() && questionPosts.length > 0 ? (
          <section className="space-y-4 sm:space-y-6">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('blog_label')}</div>
              <h2 className="mt-2 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl">{questionSectionCopy.title}</h2>
              <p className="mt-2 max-w-3xl text-slate-600">{questionSectionCopy.desc}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3 xl:gap-5">
              {questionPosts.map((post, index) => {
                const localized = getLocalizedPost(post, language);
                return (
                  <article
                    key={post.slug}
                    className={`page-soft-card p-5 sm:p-6 ${index === 3 ? 'hidden lg:block' : ''} ${index > 3 ? 'hidden xl:block' : ''}`}
                  >
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{localized.categoryLabel}</div>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900 sm:mt-4 sm:text-xl">{localized.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-3">{localized.excerpt}</p>
                    <button
                      type="button"
                      onClick={() => onNavigate(PageView.BLOG, language, post.slug, blogSearch)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500 sm:mt-5"
                    >
                      {t('blog_open_article')} <ArrowRight className="w-4 h-4 text-accent-500" />
                    </button>
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="space-y-5 sm:space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4 sm:gap-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('blog_featured_title')}</h2>
              <p className="mt-2 text-slate-600">{t('blog_featured_desc')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">
            {featuredPosts.map((post, index) => {
              const localized = getLocalizedPost(post, language);
              return (
                <article
                  key={post.slug}
                  className={`page-soft-card overflow-hidden transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] ${index === 2 ? 'hidden xl:block' : ''}`}
                >
                  <button
                    type="button"
                    className="block w-full text-left"
                    onClick={() => onNavigate(PageView.BLOG, language, post.slug, blogSearch)}
                  >
                    <BlogCover src={post.coverImage} alt={localized.title} />
                    <div className="p-5 sm:p-7">
                      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 sm:gap-3">
                        <span className="rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-3 py-1 text-slate-700">{localized.categoryLabel}</span>
                        <span className="inline-flex items-center gap-1">
                          <CalendarDays className="w-3.5 h-3.5" />
                          {formatBlogDate(post.publishedAt, language)}
                        </span>
                      </div>
                      <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-slate-900 sm:mt-4 sm:text-2xl">{localized.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">{localized.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 sm:mt-6">
                        {t('blog_read_more')} <ArrowRight className="w-4 h-4 text-accent-500" />
                      </span>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        </section>

        <section className="page-dark-card p-6 md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold md:text-3xl">{t('blog_list_cta_title')}</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">{t('blog_list_cta_desc')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="page-secondary-button w-full sm:w-auto"
              >
                {t('blog_list_cta_primary')} <ArrowRight className="page-button-icon w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.PRODUCTS, language)}
                className="page-dark-button w-full sm:w-auto"
              >
                {t('blog_list_cta_secondary')} <ArrowRight className="w-4 h-4 text-accent-400" />
              </button>
            </div>
          </div>
        </section>

        <section className="space-y-5 sm:space-y-8">
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('blog_latest_title')}</h2>
            <p className="mt-2 text-slate-600">{t('blog_latest_desc')}</p>
          </div>

          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-accent-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t('blog_search_placeholder')}
              className="w-full rounded-full border border-accent-400/20 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-accent-400"
            />
          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
            {categoryFilters.map((category) => {
              const label = category === 'all' ? t('blog_filter_all') : getLocalizedCategoryLabel(category, language);
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
                  className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white'
                      : 'border border-slate-200 bg-white text-slate-600 hover:bg-accent-400/10'
                  }`}
                  disabled={disabled}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
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
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {tagSlugs.map((tagSlug) => {
                const active = activeTag === tagSlug;
                return (
                  <button
                    key={tagSlug}
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, getBlogTagPath(tagSlug), blogSearch)}
                    className={`inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium transition ${
                      active
                        ? 'bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white'
                        : 'border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] text-slate-800'
                    }`}
                  >
                    <span>#{getDisplayTagName(tagSlug)}</span>
                    <span className={`ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold ${active ? 'bg-white/20 text-white' : 'bg-white text-brand-500'}`}>
                      {tagCounts.get(tagSlug) ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {pagination.items.length === 0 ? (
            <div className="page-white-card p-10 text-center text-slate-500">
              {t('blog_no_results')}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3 xl:gap-6">
              {pagination.items.map((post) => {
              const localized = getLocalizedPost(post, language);
              return (
                <article key={post.slug} className="page-soft-card p-5 sm:p-6">
                  <div className="flex flex-col items-start gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <span>{localized.categoryLabel}</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="w-3.5 h-3.5" />
                      {post.readingMinutes} {t('blog_reading_time')}
                    </span>
                  </div>
                  <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-snug text-slate-900 sm:mt-4 sm:text-xl">{localized.title}</h3>
                  <p className="mt-2 text-sm text-slate-500 sm:mt-3">{formatBlogDate(post.publishedAt, language)}</p>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-4 sm:text-base">{localized.excerpt}</p>
                  <button
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, post.slug, blogSearch)}
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500 sm:mt-6"
                  >
                    {t('blog_open_article')} <ArrowRight className="w-4 h-4 text-accent-500" />
                  </button>
                </article>
              );
            })}
            </div>
          )}

          {pagination.totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                disabled={pagination.page === 1}
                onClick={() => navigateBlog(buildPageSlug(pagination.page - 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 sm:px-4"
              >
                {t('blog_prev_page')}
              </button>
              {Array.from({ length: pagination.totalPages }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => navigateBlog(buildPageSlug(pageNumber))}
                  className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold ${
                    pageNumber === pagination.page
                      ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white'
                      : 'border border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={pagination.page === pagination.totalPages}
                onClick={() => navigateBlog(buildPageSlug(pagination.page + 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40 sm:px-4"
              >
                {t('blog_next_page')}
              </button>
            </div>
          ) : null}

          <p className="text-center text-sm text-slate-500">
            {t('blog_page_status')} {pagination.page} / {pagination.totalPages} · {allPosts.length} {t('blog_total_posts')} · {BLOG_POSTS_PER_PAGE} / {t('blog_per_page')}
          </p>
        </section>
      </section>
    </div>
  );
};

const BlogArticle: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return (
      <div className="page-canvas min-h-screen pt-24 pb-24">
        <section className="page-shell">
          <div className="page-soft-card p-10 text-center md:p-16">
            <p className="page-kicker mx-auto">{t('blog_label')}</p>
            <h1 className="mt-6 text-4xl font-bold text-slate-900">{t('blog_not_found_title')}</h1>
            <p className="mt-4 text-slate-600">{t('blog_not_found_desc')}</p>
            <button
              type="button"
              onClick={() => onNavigate(PageView.BLOG, language)}
              className="page-primary-button mt-8"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('blog_back_to_list')}
            </button>
          </div>
        </section>
      </div>
    );
  }

  const localized = getLocalizedPost(post, language);
  const articleSupportCopy = getBlogArticleSupportCopy(t);
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
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="p-6 md:p-10">
            <a
              href={getLocalizedPath(PageView.BLOG, language)}
              onClick={(event) => {
                event.preventDefault();
                onNavigate(PageView.BLOG, language);
              }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#ffe39a] hover:text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              {t('blog_back_to_list')}
            </a>
            <div className="mt-5 flex flex-wrap items-center gap-2 sm:mt-6 sm:gap-3">
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language, getBlogCategoryPath(post.category))}
                className="page-chip"
              >
                {localized.categoryLabel}
              </button>
              <span className="page-chip">{formatBlogDate(post.publishedAt, language)}</span>
              <span className="page-chip">
                {post.readingMinutes} {t('blog_reading_time')}
              </span>
            </div>
            <h1 className="apple-hero-title mt-5 max-w-4xl sm:mt-6">{localized.title}</h1>
            <p className="apple-body mt-4 max-w-3xl text-base text-slate-300 sm:mt-6 sm:text-[17px]">{localized.excerpt}</p>
            <div className="mt-6 grid gap-3 md:mt-8 md:max-w-3xl md:grid-cols-2 md:gap-4">
              <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">
                  {t('blog_published_on')}
                </div>
                <div className="mt-1.5 text-base font-semibold text-white sm:mt-2 sm:text-lg">{formatBlogDate(post.publishedAt, language)}</div>
              </div>
              <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">
                  {t('blog_updated_on')}
                </div>
                <div className="mt-1.5 text-base font-semibold text-white sm:mt-2 sm:text-lg">{formatBlogDate(post.updatedAt, language)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-10 space-y-10 sm:mt-14 sm:space-y-12 md:space-y-14">
        <section className="page-white-card overflow-hidden p-3 sm:p-4 md:p-6">
          <BlogCover
            src={post.coverImage}
            alt={localized.title}
            variant="hero"
            loading="eager"
            fetchPriority="high"
          />
        </section>

        {localized.takeaways.length > 0 || localized.checklist.length > 0 ? (
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            {localized.takeaways.length > 0 ? (
              <section className="page-soft-card page-accent-line p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{articleSupportCopy.takeawaysTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">{articleSupportCopy.takeawaysDesc}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700 sm:mt-6 sm:space-y-4">
                  {localized.takeaways.map((item: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-1.5 h-2.5 w-2.5 rounded-full bg-accent-500" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {localized.checklist.length > 0 ? (
              <section className="page-soft-card page-accent-line p-6 sm:p-8">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">{articleSupportCopy.checklistTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:mt-3">{articleSupportCopy.checklistDesc}</p>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-700 sm:mt-6 sm:space-y-4">
                  {localized.checklist.map((item: string, index: number) => (
                    <li key={index} className="flex gap-3">
                      <span className="mt-0.5 text-accent-500">□</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}
          </section>
        ) : null}

        <article className="page-soft-card page-accent-line p-6 md:p-10">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{t('blog_label')}</p>
            <div className="mt-5 space-y-5 text-base leading-7 text-slate-700 sm:mt-6 sm:space-y-6 sm:text-lg sm:leading-8">
              {localized.content.map((paragraph: string, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <div className="-mx-1 mt-8 flex gap-2 overflow-x-auto px-1 pb-2 sm:mx-0 sm:mt-10 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0 sm:pb-0">
              {post.tags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onNavigate(PageView.BLOG, language, getBlogTagPath(getNormalizedTagSlug(tag)))}
                  className="shrink-0 rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-4 py-2 text-sm font-medium text-slate-800 transition hover:border-accent-400/30"
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </article>

        {relatedProducts.length > 0 ? (
          <section className="page-soft-card page-accent-line p-6 md:p-10">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('blog_products_title')}</h2>
              <p className="mt-2 text-slate-600 leading-relaxed sm:mt-3">{t('blog_products_desc')}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
              {relatedProducts.map((product) => (
                <button
                  key={product.slug}
                  type="button"
                  onClick={() => onNavigate(PageView.PRODUCTS, language, product.slug)}
                  className="page-soft-card overflow-hidden text-left transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)]"
                >
                  <div className="aspect-[16/9] bg-[linear-gradient(180deg,#ffffff_0%,#eef4fb_100%)] p-4 sm:p-6">
                    <img
                      src={product.image}
                      alt={t(product.nameKey)}
                      width="1600"
                      height="900"
                      className="h-full w-full object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="p-5 sm:p-6">
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{t('nav_products')}</div>
                    <h3 className="mt-3 text-lg font-bold text-slate-900 sm:text-xl">{t(product.nameKey)}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">{t(product.descKey)}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 sm:mt-5">
                      {t('blog_products_cta')} <ArrowRight className="w-4 h-4 text-accent-500" />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        <section className="page-dark-card p-6 md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold md:text-3xl">{t('blog_cta_title')}</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">{t('blog_cta_desc')}</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => onNavigate(PageView.CONTACT, language)}
                className="page-secondary-button w-full sm:w-auto"
              >
                {t('blog_cta_primary')} <ArrowRight className="page-button-icon w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(PageView.PRODUCTS, language)}
                className="page-dark-button w-full sm:w-auto"
              >
                {t('blog_cta_secondary')} <ArrowRight className="w-4 h-4 text-accent-400" />
              </button>
            </div>
          </div>
        </section>

        {relatedPosts.length > 0 ? (
          <section className="page-soft-card page-accent-line p-6 md:p-10">
            <div className="max-w-3xl">
              <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">{t('blog_related_title')}</h2>
              <p className="mt-2 text-slate-600 leading-relaxed sm:mt-3">{t('blog_related_desc')}</p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-2 md:gap-6">
              {relatedPosts.map((relatedPost) => {
                const relatedLocalized = getLocalizedPost(relatedPost, language);
                return (
                  <button
                    key={relatedPost.slug}
                    type="button"
                    onClick={() => onNavigate(PageView.BLOG, language, relatedPost.slug)}
                    className="page-soft-card p-5 text-left transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6"
                  >
                    <p className="text-sm text-slate-500">{formatBlogDate(relatedPost.publishedAt, language)}</p>
                    <h3 className="mt-3 line-clamp-2 text-lg font-bold text-slate-900 sm:text-xl">{relatedLocalized.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600 sm:mt-3 sm:text-base">{relatedLocalized.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 sm:mt-5">
                      {t('blog_read_more')} <ArrowRight className="w-4 h-4 text-accent-500" />
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>
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
