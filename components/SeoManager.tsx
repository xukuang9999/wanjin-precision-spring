import { useEffect } from 'react';
import type { FC } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_LANGUAGE, getLocalizedPath, PageView } from '../types';
import { type Language, LANGUAGES } from '../utils/languages';
import { getFeaturedProducts, getProductBySlug, PRODUCT_DATA } from '../data/products';
import { getProductSeoProfile } from '../utils/productSeo';
import { loadBlogModule } from '../utils/loadBlogModule';

const SITE_URL = 'https://wanjinspring.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/factory/factory_1.jpg`;
const LOCALE_META: Record<Language, { html: string; og: string; dir: 'ltr' | 'rtl' }> = {
  zh: { html: 'zh-CN', og: 'zh_CN', dir: 'ltr' },
  en: { html: 'en', og: 'en_US', dir: 'ltr' },
  ru: { html: 'ru', og: 'ru_RU', dir: 'ltr' },
  es: { html: 'es', og: 'es_ES', dir: 'ltr' },
  ar: { html: 'ar', og: 'ar_SA', dir: 'rtl' },
  hi: { html: 'hi', og: 'hi_IN', dir: 'ltr' },
  pt: { html: 'pt-PT', og: 'pt_PT', dir: 'ltr' },
  ja: { html: 'ja', og: 'ja_JP', dir: 'ltr' },
  de: { html: 'de', og: 'de_DE', dir: 'ltr' },
  fr: { html: 'fr', og: 'fr_FR', dir: 'ltr' },
};

const FAQ_KEYS = [
  ['faq_q1', 'faq_a1'],
  ['faq_q2', 'faq_a2'],
  ['faq_q3', 'faq_a3'],
  ['faq_q4', 'faq_a4'],
] as const;

const KNOWS_ABOUT_TOPICS = [
  'Custom spring manufacturing',
  'Compression springs',
  'Extension springs',
  'Torsion springs',
  'Wave springs',
  'Disc springs',
  'Stacked disc spring assemblies',
  'Hot coil springs',
  'Retaining rings',
  'Wire forms',
  'Power equipment springs',
  'Automotive spring applications',
  'Heavy-duty spring programs',
  'Spring drawing review',
  'Load and displacement testing',
] as const;

const MACHINE_READABLE_RESOURCES = [
  { name: 'LLMs Reference', url: `${SITE_URL}/llms.txt`, encodingFormat: 'text/plain' },
  { name: 'Extended LLMs Reference', url: `${SITE_URL}/llms-full.txt`, encodingFormat: 'text/plain' },
  { name: 'AI Search Profile', url: `${SITE_URL}/ai-search-profile.json`, encodingFormat: 'application/json' },
  { name: 'Company Profile JSON', url: `${SITE_URL}/company-profile.json`, encodingFormat: 'application/json' },
  { name: 'Products Catalog JSON', url: `${SITE_URL}/products.json`, encodingFormat: 'application/json' },
  { name: 'Products Catalog JSON-LD', url: `${SITE_URL}/products-catalog.jsonld`, encodingFormat: 'application/ld+json' },
  { name: 'Blog JSON Feed', url: `${SITE_URL}/blog-feed.json`, encodingFormat: 'application/feed+json' },
] as const;

type SeoManagerProps = {
  currentPage: PageView;
  productSlug?: string;
  blogSlug?: string;
};

const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
  const node = document.head.querySelector(selector);
  if (node) {
    node.setAttribute(attribute, value);
  }
};

const ensureMetaTag = (selector: string, attrs: Record<string, string>) => {
  let node = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }

  Object.entries(attrs).forEach(([key, value]) => node?.setAttribute(key, value));
};

const removeMetaTag = (selector: string) => {
  document.head.querySelector(selector)?.remove();
};

const ensureAltLink = (hreflang: string, href: string) => {
  const selector = `link[rel="alternate"][hreflang="${hreflang}"]`;
  let node = document.head.querySelector(selector) as HTMLLinkElement | null;
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', 'alternate');
    node.setAttribute('hreflang', hreflang);
    document.head.appendChild(node);
  }
  node.setAttribute('href', href);
};

export const SeoManager: FC<SeoManagerProps> = ({ currentPage, productSlug, blogSlug }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    let cancelled = false;

    const applySeo = async () => {
      let blogModule: Awaited<ReturnType<typeof loadBlogModule>> | null = null;

      if (currentPage === PageView.BLOG) {
        try {
          blogModule = await loadBlogModule();
        } catch (error) {
          console.error('Failed to load blog SEO data:', error);
        }
      }

      if (cancelled) {
        return;
      }

      const archiveContext = currentPage === PageView.BLOG && blogModule ? blogModule.getBlogArchiveContext(blogSlug) ?? { page: 1 } : { page: 1 };
      const post = currentPage === PageView.BLOG && blogSlug && blogModule ? blogModule.getBlogPostBySlug(blogSlug) : undefined;
      const product = currentPage === PageView.PRODUCTS && productSlug ? getProductBySlug(productSlug) : undefined;
      const blogCategory = archiveContext.category;
      const blogTag = archiveContext.tag;
      const localizedPost = post && blogModule ? blogModule.getLocalizedPost(post, language) : undefined;
      const contentSlug = currentPage === PageView.BLOG ? blogSlug : currentPage === PageView.PRODUCTS ? productSlug : undefined;
      const pagePath = getLocalizedPath(currentPage, language, contentSlug);
      const pageUrl = `${SITE_URL}${pagePath}`;
      const ogImage = post ? `${SITE_URL}${post.coverImage}` : product ? `${SITE_URL}${product.image}` : DEFAULT_OG_IMAGE;
      const productName = product ? t(product.nameKey) : undefined;
      const productSeoProfile = product && productName ? getProductSeoProfile(product.slug, productName, language) : undefined;
      const productDescription = product ? productSeoProfile?.description ?? t(product.descKey) : undefined;
      const blogCategoryLabel = blogCategory && blogModule ? blogModule.getLocalizedCategoryLabel(blogCategory, language) : undefined;
      const blogTagLabel = blogTag && blogModule ? blogModule.getDisplayTagName(blogTag) : undefined;
      const localeMeta = LOCALE_META[language];

      const pageMap: Record<PageView, { title: string; description: string }> = {
        [PageView.HOME]: {
          title: `${t('company_name_en')} | ${t('seo_home_title') || t('hero_title')}`,
          description: t('seo_home_desc') || t('hero_desc'),
        },
        [PageView.ABOUT]: {
          title: `${t('about_title')} | ${t('company_name_en')}`,
          description: t('about_desc'),
        },
        [PageView.PRODUCTS]: {
          title: productSeoProfile ? `${productSeoProfile.title} | ${t('company_name_en')}` : productName ? `${productName} | ${t('company_name_en')}` : `${t('seo_products_title') || t('nav_products')} | ${t('company_name_en')}`,
          description: productSeoProfile?.description ?? productDescription ?? t('seo_products_desc') ?? t('products_spec_desc') ?? t('product_header_desc'),
        },
        [PageView.CAPACITY]: {
          title: `${t('nav_capacity')} | ${t('company_name_en')}`,
          description: t('cap_band_desc') || t('cap_intro_desc'),
        },
        [PageView.FACTORY]: {
          title: `${t('nav_factory')} | ${t('company_name_en')}`,
          description: t('factory_desc'),
        },
        [PageView.CONTACT]: {
          title: `${t('nav_contact')} | ${t('company_name_en')}`,
          description: t('email_us_desc'),
        },
        [PageView.BLOG]: post
          ? {
              title: localizedPost?.seoTitle ?? localizedPost?.title ?? `${t('nav_blog')} | ${t('company_name_en')}`,
              description: localizedPost?.seoDescription ?? localizedPost?.excerpt ?? t('blog_desc'),
            }
          : blogTag
            ? {
                title: `${blogTagLabel ?? t('nav_blog')} ${t('blog_tag_archive_title')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
                description: `${t('blog_tag_archive_desc')} ${blogTagLabel ?? t('nav_blog')}.`,
              }
          : blogCategory
            ? {
                title: `${blogCategoryLabel ?? t('nav_blog')} ${t('nav_blog')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
                description: `${t('blog_desc')} ${blogCategoryLabel ?? t('nav_blog')}.`,
              }
          : {
              title: `${t('blog_title')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
              description: t('blog_desc'),
            },
      };

      const pageSeo = pageMap[currentPage];

      document.title = pageSeo.title;
      document.documentElement.lang = localeMeta.html;
      document.documentElement.dir = localeMeta.dir;

      setMeta('meta[name="description"]', 'content', pageSeo.description);
      setMeta('meta[property="og:title"]', 'content', pageSeo.title);
      setMeta('meta[property="og:description"]', 'content', pageSeo.description);
      setMeta('meta[property="og:url"]', 'content', pageUrl);
      setMeta('meta[property="og:locale"]', 'content', localeMeta.og);
      setMeta('meta[property="og:image"]', 'content', ogImage);
      setMeta('meta[name="twitter:title"]', 'content', pageSeo.title);
      setMeta('meta[name="twitter:description"]', 'content', pageSeo.description);
      setMeta('meta[name="twitter:image"]', 'content', ogImage);
      setMeta('link[rel="canonical"]', 'href', pageUrl);
      setMeta('meta[property="og:type"]', 'content', post ? 'article' : product ? 'product' : 'website');

      if (post) {
        ensureMetaTag('meta[property="article:published_time"]', {
          property: 'article:published_time',
          content: post.publishedAt,
        });
        ensureMetaTag('meta[property="article:modified_time"]', {
          property: 'article:modified_time',
          content: post.updatedAt,
        });
      } else {
        removeMetaTag('meta[property="article:published_time"]');
        removeMetaTag('meta[property="article:modified_time"]');
      }

      (Object.keys(LANGUAGES) as Language[]).forEach((lang) => {
        const href = `${SITE_URL}${getLocalizedPath(currentPage, lang, contentSlug)}`;
        ensureAltLink(lang, href);
      });
      ensureAltLink('x-default', `${SITE_URL}${getLocalizedPath(currentPage, DEFAULT_LANGUAGE, contentSlug)}`);

      const commonOrg = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: t('company_name_full'),
        alternateName: t('company_name_en'),
        url: SITE_URL,
        logo: `${SITE_URL}/factory/logo.jpeg`,
        image: DEFAULT_OG_IMAGE,
        email: 'sales@wanjinspring.com',
        telephone: t('phone_val'),
        foundingDate: '2018-04-24',
        foundingLocation: "Xi'an, Shaanxi, China",
        knowsAbout: KNOWS_ABOUT_TOPICS,
        subjectOf: MACHINE_READABLE_RESOURCES.map((resource) => ({
          '@type': 'DigitalDocument',
          name: resource.name,
          url: resource.url,
          encodingFormat: resource.encodingFormat,
        })),
        address: {
          '@type': 'PostalAddress',
          streetAddress: t('address_val'),
          addressLocality: "Xi'an",
          addressRegion: 'Shaanxi',
          addressCountry: 'CN',
        },
        description: t('hero_desc'),
      };

      const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: t('company_name_en'),
        url: SITE_URL,
        inLanguage: language,
        description: t('hero_desc'),
        potentialAction: [
          {
            '@type': 'SearchAction',
            name: `${t('nav_blog')} Search`,
            target: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language)}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
          {
            '@type': 'SearchAction',
            name: `${t('nav_products')} Search`,
            target: `${SITE_URL}${getLocalizedPath(PageView.PRODUCTS, language)}?q={search_term_string}`,
            'query-input': 'required name=search_term_string',
          },
        ],
        hasPart: MACHINE_READABLE_RESOURCES.map((resource) => ({
          '@type': 'DigitalDocument',
          name: resource.name,
          url: resource.url,
          encodingFormat: resource.encodingFormat,
        })),
      };

      const webPageSchema = {
        '@context': 'https://schema.org',
        '@type': post ? 'Article' : 'WebPage',
        name: pageSeo.title,
        url: pageUrl,
        inLanguage: language,
        description: pageSeo.description,
        isPartOf: {
          '@type': 'WebSite',
          name: t('company_name_en'),
          url: SITE_URL,
        },
        mainEntityOfPage: pageUrl,
        primaryImageOfPage: ogImage,
      };

      const featuredProducts = getFeaturedProducts().slice(0, 4);
      const pageSpecificSchema =
        currentPage === PageView.PRODUCTS
          ? product
            ? {
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: productName,
                image: ogImage,
                description: productSeoProfile?.description ?? productDescription,
                category: t(product.categoryKey),
                brand: {
                  '@type': 'Brand',
                  name: t('company_name_en'),
                },
                manufacturer: {
                  '@type': 'Organization',
                  name: t('company_name_full'),
                },
                keywords: productSeoProfile?.keywords.join(', '),
                additionalProperty: product.specKeys.map((spec) => ({
                  '@type': 'PropertyValue',
                  name: t(spec.titleKey),
                  value: t(spec.valueKey),
                  description: t(spec.descKey),
                })),
              }
            : {
                '@context': 'https://schema.org',
                '@type': 'OfferCatalog',
                name: `${t('company_name_en')} ${t('seo_schema_product_catalog')}`,
                itemListElement: PRODUCT_DATA.map((entry, index) => ({
                  '@type': 'ListItem',
                  position: index + 1,
                  item: {
                    '@type': 'Product',
                    name: t(entry.nameKey),
                    category: t(entry.categoryKey),
                    url: `${SITE_URL}${getLocalizedPath(PageView.PRODUCTS, language, entry.slug)}`,
                  },
                })),
              }
          : currentPage === PageView.CONTACT
            ? {
                '@context': 'https://schema.org',
                '@type': 'ContactPage',
                name: pageSeo.title,
                url: pageUrl,
                description: pageSeo.description,
              }
            : currentPage === PageView.HOME
              ? {
                  '@context': 'https://schema.org',
                  '@type': 'ItemList',
                  name: `${t('company_name_en')} ${t('seo_schema_featured_content')}`,
                  itemListElement: featuredProducts.map((entry, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                      '@type': 'Product',
                      name: t(entry.nameKey),
                      url: `${SITE_URL}${getLocalizedPath(PageView.PRODUCTS, language, entry.slug)}`,
                    },
                  })),
                }
            : currentPage === PageView.BLOG && blogModule && post
              ? {
                  '@context': 'https://schema.org',
                  '@type': 'BlogPosting',
                  headline: localizedPost?.title,
                  description: localizedPost?.seoDescription,
                  image: ogImage,
                  datePublished: post.publishedAt,
                  dateModified: post.updatedAt,
                  author: {
                    '@type': 'Organization',
                    name: t('company_name_en'),
                  },
                  publisher: {
                    '@type': 'Organization',
                    name: t('company_name_en'),
                    logo: {
                      '@type': 'ImageObject',
                      url: `${SITE_URL}/factory/logo.jpeg`,
                    },
                  },
                  mainEntityOfPage: pageUrl,
                  keywords: post.tags.join(', '),
                  articleSection: localizedPost?.categoryLabel,
                  inLanguage: language,
                }
              : currentPage === PageView.BLOG && blogModule && blogTag
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: `${blogTagLabel ?? t('nav_blog')} ${t('blog_tag_archive_title')}`,
                    description: pageSeo.description,
                    url: pageUrl,
                    mainEntity: {
                      '@type': 'ItemList',
                      itemListElement: blogModule.paginateBlogPosts(blogModule.getBlogPostsByTag(blogTag), archiveContext.page).items.map((blogPost, index) => {
                        const blogLocalized = blogModule.getLocalizedPost(blogPost, language);
                        return {
                          '@type': 'ListItem',
                          position: index + 1,
                          url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                          name: blogLocalized.title,
                        };
                      }),
                    },
                  }
              : currentPage === PageView.BLOG && blogModule && blogCategory
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: `${blogCategoryLabel ?? t('nav_blog')} ${t('nav_blog')}`,
                    description: pageSeo.description,
                    url: pageUrl,
                    mainEntity: {
                      '@type': 'ItemList',
                      itemListElement: blogModule.paginateBlogPosts(blogModule.getBlogPostsByCategory(blogCategory), archiveContext.page).items.map((blogPost, index) => {
                        const blogLocalized = blogModule.getLocalizedPost(blogPost, language);
                        return {
                          '@type': 'ListItem',
                          position: index + 1,
                          url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                          name: blogLocalized.title,
                        };
                      }),
                    },
                  }
              : currentPage === PageView.BLOG && blogModule
                ? {
                    '@context': 'https://schema.org',
                    '@type': 'Blog',
                    name: `${t('company_name_en')} ${t('nav_blog')}`,
                    description: t('blog_desc'),
                    url: pageUrl,
                    blogPost: blogModule.paginateBlogPosts(blogModule.getBlogPostsByCategory(), archiveContext.page).items.map((blogPost) => {
                      const blogLocalized = blogModule.getLocalizedPost(blogPost, language);
                      return {
                        '@type': 'BlogPosting',
                        headline: blogLocalized.title,
                        url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                        datePublished: blogPost.publishedAt,
                        dateModified: blogPost.updatedAt,
                      };
                    }),
                  }
                : {
                    '@context': 'https://schema.org',
                    '@type': 'Service',
                    serviceType: t('core_products'),
                    provider: {
                      '@type': 'Organization',
                      name: t('company_name_full'),
                    },
                    areaServed: 'Worldwide',
                    description: t('product_header_desc'),
                  };

      const faqSchema =
        currentPage === PageView.HOME
          ? {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQ_KEYS.map(([questionKey, answerKey]) => ({
                '@type': 'Question',
                name: t(questionKey),
                acceptedAnswer: {
                  '@type': 'Answer',
                  text: t(answerKey),
                },
              })),
            }
          : null;

      const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: t('nav_home'),
            item: `${SITE_URL}${getLocalizedPath(PageView.HOME, language)}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name:
              currentPage === PageView.BLOG && (post || blogCategory || blogTag)
                ? t('nav_blog')
                : currentPage === PageView.PRODUCTS && product
                  ? t('nav_products')
                  : pageSeo.title,
            item:
              currentPage === PageView.BLOG && (post || blogCategory || blogTag)
                ? `${SITE_URL}${getLocalizedPath(PageView.BLOG, language)}`
                : currentPage === PageView.PRODUCTS && product
                  ? `${SITE_URL}${getLocalizedPath(PageView.PRODUCTS, language)}`
                  : pageUrl,
          },
          ...(currentPage === PageView.PRODUCTS && product
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: productName,
                  item: pageUrl,
                },
              ]
            : []),
          ...(currentPage === PageView.BLOG && blogModule && post
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: localizedPost?.title,
                  item: pageUrl,
                },
              ]
            : currentPage === PageView.BLOG && blogModule && blogTag
              ? [
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${blogTagLabel ?? t('nav_blog')} ${t('blog_tag_archive_title')}`,
                    item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, archiveContext.page > 1 ? `${blogModule.getBlogTagPath(blogTag)}/page/${archiveContext.page}` : blogModule.getBlogTagPath(blogTag))}`,
                  },
                ]
            : currentPage === PageView.BLOG && blogModule && blogCategory
              ? [
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${blogCategoryLabel ?? t('nav_blog')} ${t('nav_blog')}`,
                    item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, archiveContext.page > 1 ? `${blogModule.getBlogCategoryPath(blogCategory)}/page/${archiveContext.page}` : blogModule.getBlogCategoryPath(blogCategory))}`,
                  },
                ]
            : currentPage === PageView.BLOG && blogModule && archiveContext.page > 1
              ? [
                  {
                    '@type': 'ListItem',
                    position: 3,
                    name: `${t('blog_page_status')} ${archiveContext.page}`,
                    item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogModule.getBlogPagePath(archiveContext.page))}`,
                  },
                ]
            : []),
        ],
      };

      let schemaTag = document.getElementById('seo-structured-data') as HTMLScriptElement | null;
      if (!schemaTag) {
        schemaTag = document.createElement('script');
        schemaTag.id = 'seo-structured-data';
        schemaTag.type = 'application/ld+json';
        document.head.appendChild(schemaTag);
      }

      schemaTag.textContent = JSON.stringify(
        [commonOrg, websiteSchema, webPageSchema, pageSpecificSchema, faqSchema, breadcrumbSchema].filter(Boolean)
      );
    };

    void applySeo();

    return () => {
      cancelled = true;
    };
  }, [blogSlug, currentPage, language, productSlug, t]);

  return null;
};
