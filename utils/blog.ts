import { BLOG_POSTS, type BlogCategory, type BlogPostRecord } from '../data/blog';

type LocalizedValue<T> = Record<string, T>;
type BlogArchiveContext = {
  category?: BlogCategory;
  tag?: string;
  page: number;
};

export type BlogPost = BlogPostRecord;
export const BLOG_POSTS_PER_PAGE = 6;

const localize = <T>(value: LocalizedValue<T> | undefined, language: string, fallback: string = 'en'): T | undefined => {
  if (!value) {
    return undefined;
  }

  return value[language] ?? value[fallback] ?? Object.values(value)[0];
};

export const BLOG_CATEGORIES: Record<BlogCategory, { en: string; zh: string; ru: string }> = {
  guide: {
    en: 'Guide',
    zh: '指南',
    ru: 'Гайд',
  },
  news: {
    en: 'News',
    zh: '新闻',
    ru: 'Новости',
  },
  insight: {
    en: 'Insight',
    zh: '洞察',
    ru: 'Аналитика',
  },
};

export const getBlogPosts = (): BlogPost[] =>
  [...BLOG_POSTS].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

export const getFeaturedBlogPosts = (): BlogPost[] => getBlogPosts().filter((post) => post.featured);

export const getBlogPostBySlug = (slug?: string): BlogPost | undefined =>
  getBlogPosts().find((post) => post.slug === slug);

export const getBlogArchiveContext = (slug?: string): BlogArchiveContext | undefined => {
  if (!slug) {
    return { page: 1 };
  }

  const pageMatch = slug.match(/^page\/(\d+)$/);
  if (pageMatch) {
    return { page: Number(pageMatch[1]) };
  }

  const categoryMatch = slug.match(/^category\/(guide|news|insight)(?:\/page\/(\d+))?$/);
  if (categoryMatch) {
    return {
      category: categoryMatch[1] as BlogCategory,
      page: categoryMatch[2] ? Number(categoryMatch[2]) : 1,
    };
  }

  const tagMatch = slug.match(/^tag\/(.+?)(?:\/page\/(\d+))?$/);
  if (tagMatch) {
    return {
      tag: tagMatch[1],
      page: tagMatch[2] ? Number(tagMatch[2]) : 1,
    };
  }

  return undefined;
};

export const getBlogCategoryFromSlug = (slug?: string): BlogCategory | undefined => getBlogArchiveContext(slug)?.category;

export const getBlogCategoryPath = (category: BlogCategory): string => `category/${category}`;

export const getBlogPostsByCategory = (category?: BlogCategory): BlogPost[] =>
  category ? getBlogPosts().filter((post) => post.category === category) : getBlogPosts();

export const getBlogTagFromSlug = (slug?: string): string | undefined => getBlogArchiveContext(slug)?.tag;

export const getBlogTagPath = (tag: string): string => `tag/${tag}`;

export const getNormalizedTagSlug = (tag: string): string => tag.trim().toLowerCase().replace(/\s+/g, '-');

export const getDisplayTagName = (tagSlug: string): string =>
  tagSlug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

export const getAllBlogTagSlugs = (): string[] =>
  Array.from(new Set(getBlogPosts().flatMap((post) => post.tags.map((tag) => getNormalizedTagSlug(tag))))).sort();

export const getBlogPostsByTag = (tagSlug?: string): BlogPost[] =>
  tagSlug
    ? getBlogPosts().filter((post) => post.tags.some((tag) => getNormalizedTagSlug(tag) === tagSlug))
    : getBlogPosts();

export const getBlogPagePath = (page: number): string | undefined => (page > 1 ? `page/${page}` : undefined);

export const getBlogCategoryPagePath = (category: BlogCategory, page: number): string =>
  page > 1 ? `category/${category}/page/${page}` : getBlogCategoryPath(category);

export const getBlogTagPagePath = (tag: string, page: number): string =>
  page > 1 ? `tag/${tag}/page/${page}` : getBlogTagPath(tag);

export const paginateBlogPosts = (posts: BlogPost[], page: number) => {
  const totalPages = Math.max(1, Math.ceil(posts.length / BLOG_POSTS_PER_PAGE));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * BLOG_POSTS_PER_PAGE;
  return {
    page: safePage,
    totalPages,
    items: posts.slice(start, start + BLOG_POSTS_PER_PAGE),
  };
};

export const getRelatedBlogPosts = (post: BlogPost, limit: number = 2): BlogPost[] =>
  getBlogPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .sort((a, b) => {
      const aScore = Number(a.category === post.category) + a.tags.filter((tag) => post.tags.includes(tag)).length;
      const bScore = Number(b.category === post.category) + b.tags.filter((tag) => post.tags.includes(tag)).length;
      return bScore - aScore;
    })
    .slice(0, limit);

export const getRelevantBlogPosts = (terms: string[], limit: number = 3): BlogPost[] => {
  const normalizedTerms = terms.map((term) => term.trim().toLowerCase()).filter(Boolean);

  if (normalizedTerms.length === 0) {
    return getBlogPosts().slice(0, limit);
  }

  return getBlogPosts()
    .map((post) => {
      const haystacks = [
        post.slug,
        post.category,
        ...post.tags,
        ...Object.values(post.title),
        ...Object.values(post.excerpt),
      ].map((value) => value.toLowerCase());

      const score = normalizedTerms.reduce((total, term) => {
        return total + haystacks.reduce((matches, haystack) => matches + Number(haystack.includes(term)), 0);
      }, 0);

      return { post, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.post);
};

export const getLocalizedPost = (post: BlogPost, language: string) => ({
  ...post,
  title: localize(post.title, language) ?? '',
  excerpt: localize(post.excerpt, language) ?? '',
  seoTitle: localize(post.seoTitle, language) ?? localize(post.title, language) ?? '',
  seoDescription: localize(post.seoDescription, language) ?? localize(post.excerpt, language) ?? '',
  content: localize(post.content, language) ?? [],
  categoryLabel: localize(BLOG_CATEGORIES[post.category], language) ?? post.category,
});

export const formatBlogDate = (value: string, language: string): string => {
  const locale = language === 'zh' ? 'zh-CN' : language === 'ru' ? 'ru-RU' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value));
};
