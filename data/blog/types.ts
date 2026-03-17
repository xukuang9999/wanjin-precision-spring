export type BlogCategory = 'guide' | 'news' | 'insight';

export interface BlogPostRecord {
  slug: string;
  category: BlogCategory;
  publishedAt: string;
  updatedAt: string;
  featured: boolean;
  coverImage: string;
  readingMinutes: number;
  title: Record<string, string>;
  excerpt: Record<string, string>;
  seoTitle: Record<string, string>;
  seoDescription: Record<string, string>;
  tags: string[];
  content: Record<string, string[]>;
}
