import React from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useLanguage } from '../contexts/LanguageContext';
import { getLocalizedPath, PageView } from '../types';
import {
  getBlogArchiveContext,
  getBlogCategoryPath,
  getBlogCategoryPagePath,
  getBlogPagePath,
  getBlogPostsByTag,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getBlogTagPagePath,
  getBlogTagPath,
  getDisplayTagName,
  getNormalizedTagSlug,
  getLocalizedCategoryLabel,
  getLocalizedPost,
  formatBlogDate,
  getRelatedBlogPosts,
  paginateBlogPosts,
} from '../utils/blog';
import { BLOG_AUTHOR_PROFILE } from '../utils/blogAuthor';
import { type Language } from '../utils/languages';
import { PRODUCT_DATA } from '../data/products';

interface BlogProps {
  slug?: string;
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

const BLOG_PRODUCT_CANDIDATES = PRODUCT_DATA.filter((product) => product.articleTerms.length > 0);

const getBlogArticleSupportCopy = (t: (key: string) => string) => ({
  takeawaysTitle: t('blog_takeaways_title'),
  takeawaysDesc: t('blog_takeaways_desc'),
  checklistTitle: t('blog_checklist_title'),
  checklistDesc: t('blog_checklist_desc'),
});

const getBlogTrustCopy = (t: (key: string) => string) => ({
  authorLabel: t('blog_author_label'),
  authorRole: t('blog_author_role'),
  authorBio: t('blog_author_bio'),
  authorLinkedIn: t('blog_author_linkedin'),
  reviewLabel: t('blog_review_label'),
  reviewDesc: t('blog_review_desc'),
});

const BlogList: React.FC<BlogProps> = ({ slug, onNavigate }) => {
  const { language, t } = useLanguage();
  const archiveContext = getBlogArchiveContext(slug) ?? { page: 1 };
  const activeCategory = archiveContext.category;
  const activeTag = archiveContext.tag;
  const sourcePosts = activeTag ? getBlogPostsByTag(activeTag) : getBlogPostsByCategory(activeCategory);
  const paginatedPosts = paginateBlogPosts(sourcePosts, archiveContext.page);
  const currentArchivePage = paginatedPosts.page;
  const totalArchivePages = paginatedPosts.totalPages;
  const activeCategoryLabel = activeCategory ? getLocalizedCategoryLabel(activeCategory, language) : null;
  const activeTagLabel = activeTag ? getDisplayTagName(activeTag) : null;
  const pageStatusLabel = currentArchivePage > 1 ? ` | ${t('blog_page_status')} ${currentArchivePage}` : '';
  const heading = activeTagLabel
    ? `${activeTagLabel} ${t('blog_tag_archive_title')}${pageStatusLabel}`
    : activeCategoryLabel
      ? `${activeCategoryLabel} ${t('nav_blog')}${pageStatusLabel}`
      : `${t('blog_title')}${pageStatusLabel}`;
  const description = activeTagLabel
    ? `${t('blog_tag_archive_desc')} ${activeTagLabel}.`
    : activeCategoryLabel
      ? `${t('blog_desc')} ${activeCategoryLabel}.`
      : t('blog_desc');
  const getArchivePageSlug = (page: number) => {
    if (activeTag) {
      return getBlogTagPagePath(activeTag, page);
    }

    if (activeCategory) {
      return getBlogCategoryPagePath(activeCategory, page);
    }

    return getBlogPagePath(page);
  };
  const navigateToArchivePage = (page: number) => {
    onNavigate(PageView.BLOG, language, getArchivePageSlug(page));
  };

  return (
    <div className="page-canvas pt-20 pb-16 md:pt-24 md:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="max-w-4xl">
              <p className="page-kicker">{t('blog_label')}</p>
              <h1 className="mt-4 max-w-4xl text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
                {heading}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
                {description}
              </p>
            </div>
            <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-5 sm:rounded-[32px] sm:p-6">
              <div className="text-3xl font-semibold text-white sm:text-4xl">{sourcePosts.length}</div>
              <div className="mt-2 text-sm font-semibold text-[#ffe39a]">{t('blog_total_posts')}</div>
              {totalArchivePages > 1 ? (
                <div className="mt-3 text-sm text-slate-200">
                  {t('blog_page_status')} {currentArchivePage} / {totalArchivePages}
                </div>
              ) : null}
              {activeTagLabel || activeCategoryLabel || currentArchivePage > 1 ? (
                <a
                  href={getLocalizedPath(PageView.BLOG, language)}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(PageView.BLOG, language);
                  }}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-[#ffe39a]"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {t('blog_back_to_list')}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-10 sm:mt-14 md:mt-16">
        {sourcePosts.length === 0 ? (
          <div className="page-white-card p-10 text-center text-slate-500">
            {t('blog_no_results')}
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {paginatedPosts.items.map((post) => {
              const localized = getLocalizedPost(post, language);
              const postPath = getLocalizedPath(PageView.BLOG, language, post.slug);

              return (
                <article key={post.slug} className="page-soft-card page-accent-line p-6 md:p-8">
                  <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    <span className="rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-3 py-1 text-slate-700">
                      {localized.categoryLabel}
                    </span>
                  </div>
                  <h2 className="mt-4 text-xl font-bold leading-snug text-slate-900 md:text-2xl">
                    {localized.title}
                  </h2>
                  <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="h-3.5 w-3.5 text-slate-400" />
                      {BLOG_AUTHOR_PROFILE.name}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {formatBlogDate(post.publishedAt, language)}
                    </span>
                  </div>
                  <p className="mt-3 max-w-3xl text-base leading-relaxed text-slate-600">
                    {localized.excerpt}
                  </p>
                  <a
                    href={postPath}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(PageView.BLOG, language, post.slug);
                    }}
                    className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
                  >
                    {t('blog_open_article')} <ArrowRight className="w-4 h-4 text-accent-500" />
                  </a>
                </article>
              );
            })}
            {totalArchivePages > 1 ? (
              <nav
                aria-label={`${t('nav_blog')} ${t('blog_page_status')}`}
                className="flex flex-wrap items-center justify-center gap-2 pt-4 sm:pt-6"
              >
                <button
                  type="button"
                  onClick={() => navigateToArchivePage(currentArchivePage - 1)}
                  disabled={currentArchivePage <= 1}
                  aria-label={`${t('blog_page_status')} ${Math.max(1, currentArchivePage - 1)}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-accent-400/30 hover:bg-accent-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: totalArchivePages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => navigateToArchivePage(page)}
                    aria-label={`${t('blog_page_status')} ${page}`}
                    aria-current={page === currentArchivePage ? 'page' : undefined}
                    className={`inline-flex min-w-10 items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition ${
                      page === currentArchivePage
                        ? 'border border-accent-400/30 bg-[linear-gradient(145deg,#071427_0%,#0d2747_58%,#123765_100%)] text-white shadow-[0_10px_24px_rgba(250,204,21,0.12)]'
                        : 'border border-slate-200 bg-white text-slate-700 hover:border-accent-400/30 hover:bg-accent-400/10'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => navigateToArchivePage(currentArchivePage + 1)}
                  disabled={currentArchivePage >= totalArchivePages}
                  aria-label={`${t('blog_page_status')} ${Math.min(totalArchivePages, currentArchivePage + 1)}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-accent-400/30 hover:bg-accent-400/10 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </nav>
            ) : null}
          </div>
        )}
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
  const trustCopy = getBlogTrustCopy(t);
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
          <div className="p-5 sm:p-7 md:p-8">
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
            <div className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
              <button
                type="button"
                onClick={() => onNavigate(PageView.BLOG, language, getBlogCategoryPath(post.category))}
                className="page-chip"
              >
                {localized.categoryLabel}
              </button>
              <span className="page-chip">
                {trustCopy.authorLabel}: {BLOG_AUTHOR_PROFILE.name}
              </span>
              <span className="page-chip">{formatBlogDate(post.publishedAt, language)}</span>
              <span className="page-chip">
                {post.readingMinutes} {t('blog_reading_time')}
              </span>
            </div>
            <h1 className="mt-4 max-w-3xl text-balance font-[var(--font-apple-display)] text-[clamp(2.2rem,4vw,3.5rem)] font-semibold leading-[0.98] tracking-[-0.028em] text-white sm:mt-5">
              {localized.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-300 sm:mt-4 sm:text-base">
              {localized.excerpt}
            </p>
            <div className="mt-5 flex flex-wrap gap-3 md:mt-6">
              <div className="rounded-[18px] border border-white/10 bg-white/10 px-4 py-3 sm:rounded-[20px] sm:px-5 sm:py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">
                  {trustCopy.authorLabel}
                </div>
                <div className="mt-1 text-sm font-semibold text-white sm:text-base">{BLOG_AUTHOR_PROFILE.name}</div>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/10 px-4 py-3 sm:rounded-[20px] sm:px-5 sm:py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">
                  {t('blog_published_on')}
                </div>
                <div className="mt-1 text-sm font-semibold text-white sm:text-base">{formatBlogDate(post.publishedAt, language)}</div>
              </div>
              <div className="rounded-[18px] border border-white/10 bg-white/10 px-4 py-3 sm:rounded-[20px] sm:px-5 sm:py-4">
                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffe39a]">
                  {t('blog_updated_on')}
                </div>
                <div className="mt-1 text-sm font-semibold text-white sm:text-base">{formatBlogDate(post.updatedAt, language)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-10 space-y-10 sm:mt-14 sm:space-y-12 md:space-y-14">
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-6">
          <section className="page-soft-card page-accent-line p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{trustCopy.authorLabel}</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">{BLOG_AUTHOR_PROFILE.name}</h2>
            <p className="mt-2 text-sm font-semibold text-brand-500">
              {trustCopy.authorRole} · {t('company_name_en')}
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {trustCopy.authorBio}
            </p>
            <a
              href={BLOG_AUTHOR_PROFILE.linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
            >
              {trustCopy.authorLinkedIn} <ArrowRight className="w-4 h-4 text-accent-500" />
            </a>
          </section>

          <section className="page-soft-card page-accent-line p-6 sm:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{trustCopy.reviewLabel}</p>
            <div className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {formatBlogDate(post.updatedAt, language)}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600 sm:text-base">
              {trustCopy.reviewDesc}
            </p>
            <div className="mt-5">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{t('blog_tags_title')}</div>
              <div className="-mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="shrink-0 rounded-full border border-accent-400/16 bg-[linear-gradient(180deg,#ffffff_0%,#fff8dc_100%)] px-3 py-1.5 text-sm font-medium text-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </section>
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
                    <div className="flex h-full items-center justify-center">
                      <ResponsiveImage
                        src={product.image}
                        alt={t(product.nameKey)}
                        width="1600"
                        height="900"
                        responsiveWidths={[640, 960]}
                        originalWidth={1200}
                        sizes="(min-width: 768px) 45vw, 92vw"
                        imgClassName="h-[78%] w-auto max-w-full max-h-full object-contain"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
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
            <button
              type="button"
              onClick={() => onNavigate(PageView.CONTACT, language)}
              className="page-secondary-button w-full sm:w-auto"
            >
              {t('blog_cta_primary')} <ArrowRight className="page-button-icon w-4 h-4" />
            </button>
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
                    <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <UserRound className="h-3.5 w-3.5 text-slate-400" />
                        {BLOG_AUTHOR_PROFILE.name}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                        {formatBlogDate(relatedPost.publishedAt, language)}
                      </span>
                    </div>
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
