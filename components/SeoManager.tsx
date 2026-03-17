import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_LANGUAGE, getLocalizedPath, PageView } from '../types';
import { Language, LANGUAGES } from '../utils/translations';
import { getFeaturedProducts, getProductBySlug, PRODUCT_DATA } from '../data/products';
import { getProductSeoProfile } from '../utils/productSeo';
import {
  BLOG_POSTS_PER_PAGE,
  BLOG_CATEGORIES,
  getBlogArchiveContext,
  getBlogCategoryFromSlug,
  getBlogCategoryPath,
  getBlogPostBySlug,
  getBlogPostsByCategory,
  getBlogPostsByTag,
  getBlogTagFromSlug,
  getBlogTagPath,
  getBlogPagePath,
  paginateBlogPosts,
  getDisplayTagName,
  getFeaturedBlogPosts,
  getLocalizedPost,
} from '../utils/blog';

const SITE_URL = 'https://wanjinspring.com';
const DEFAULT_OG_IMAGE = `${SITE_URL}/factory/factory_1.jpg`;

const PAGE_PRODUCT_KEYS = [
  'product_hot_name',
  'product_disc_stack_name',
  'product_die_name',
  'product_comp_name',
  'product_ext_name',
  'product_tor_name',
  'product_wave_name',
  'product_contact_name',
  'product_retaining_name',
  'product_custom_name',
  'product_constant_force_name',
  'product_garter_name',
  'product_flat_name',
  'product_power_name',
  'product_variable_force_name',
  'product_spiral_name',
  'product_contact_clips_name',
  'product_multi_wave_name',
  'product_disc_name',
] as const;

const FAQ_KEYS = [
  ['faq_q1', 'faq_a1'],
  ['faq_q2', 'faq_a2'],
  ['faq_q3', 'faq_a3'],
  ['faq_q4', 'faq_a4'],
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

export const SeoManager: React.FC<SeoManagerProps> = ({ currentPage, productSlug, blogSlug }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const archiveContext = currentPage === PageView.BLOG ? getBlogArchiveContext(blogSlug) ?? { page: 1 } : { page: 1 };
    const post = currentPage === PageView.BLOG && blogSlug ? getBlogPostBySlug(blogSlug) : undefined;
    const product = currentPage === PageView.PRODUCTS && productSlug ? getProductBySlug(productSlug) : undefined;
    const blogCategory = archiveContext.category;
    const blogTag = archiveContext.tag;
    const localizedPost = post ? getLocalizedPost(post, language) : undefined;
    const contentSlug = currentPage === PageView.BLOG ? blogSlug : currentPage === PageView.PRODUCTS ? productSlug : undefined;
    const pagePath = getLocalizedPath(currentPage, language, contentSlug);
    const pageUrl = `${SITE_URL}${pagePath}`;
    const ogImage = post ? `${SITE_URL}${post.coverImage}` : product ? `${SITE_URL}${product.image}` : DEFAULT_OG_IMAGE;
    const productName = product ? t(product.nameKey) : undefined;
    const productSeoProfile = product && productName ? getProductSeoProfile(product.slug, productName) : undefined;
    const productDescription = product ? productSeoProfile?.description ?? t(product.descKey) : undefined;
    const blogCategoryLabel =
      blogCategory
        ? language === 'zh'
          ? BLOG_CATEGORIES[blogCategory].zh
          : language === 'ru'
            ? BLOG_CATEGORIES[blogCategory].ru
            : BLOG_CATEGORIES[blogCategory].en
        : undefined;
    const blogTagLabel = blogTag ? getDisplayTagName(blogTag) : undefined;
    const locale =
      language === 'zh'
        ? 'zh_CN'
        : language === 'ja'
          ? 'ja_JP'
          : language === 'de'
            ? 'de_DE'
            : language === 'fr'
              ? 'fr_FR'
              : language === 'es'
                ? 'es_ES'
                : language === 'pt'
                  ? 'pt_BR'
                  : language === 'ru'
                    ? 'ru_RU'
                    : language === 'ar'
                      ? 'ar_AR'
                      : language === 'hi'
                        ? 'hi_IN'
                        : 'en_US';

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
              title: `${blogTagLabel} ${t('blog_tag_archive_title')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
              description: `${t('blog_tag_archive_desc')} ${blogTagLabel}.`,
            }
        : blogCategory
          ? {
              title: `${blogCategoryLabel} ${t('nav_blog')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
              description: `${t('blog_desc')} ${blogCategoryLabel}.`,
            }
        : {
            title: `${t('nav_blog')}${archiveContext.page > 1 ? ` | ${t('blog_page_status')} ${archiveContext.page}` : ''} | ${t('company_name_en')}`,
            description: t('blog_desc'),
          },
    };

    const pageSeo = pageMap[currentPage];

    document.title = pageSeo.title;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    setMeta('meta[name="description"]', 'content', pageSeo.description);
    setMeta('meta[property="og:title"]', 'content', pageSeo.title);
    setMeta('meta[property="og:description"]', 'content', pageSeo.description);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:locale"]', 'content', locale);
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
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language)}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
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
      primaryImageOfPage: ogImage,
    };

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
              name: `${t('company_name_en')} Product Catalog`,
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
                name: `${t('company_name_en')} Featured Content`,
                itemListElement: [
                  ...PAGE_PRODUCT_KEYS.slice(0, 4).map((key, index) => ({
                    '@type': 'ListItem',
                    position: index + 1,
                    item: {
                      '@type': 'Product',
                      name: t(getFeaturedProducts()[index].nameKey),
                      url: `${SITE_URL}${getLocalizedPath(PageView.PRODUCTS, language, getFeaturedProducts()[index].slug)}`,
                    },
                  })),
                  ...getFeaturedBlogPosts().slice(0, 2).map((blogPost, index) => {
                    const blogLocalized = getLocalizedPost(blogPost, language);
                    return {
                      '@type': 'ListItem',
                      position: PAGE_PRODUCT_KEYS.slice(0, 4).length + index + 1,
                      item: {
                        '@type': 'Article',
                        headline: blogLocalized.title,
                        url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                      },
                    };
                  }),
                ],
              }
          : currentPage === PageView.BLOG && post
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
            : currentPage === PageView.BLOG && blogTag
              ? {
                  '@context': 'https://schema.org',
                  '@type': 'CollectionPage',
                  name: `${blogTagLabel} ${t('blog_tag_archive_title')}`,
                  description: pageSeo.description,
                  url: pageUrl,
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: paginateBlogPosts(getBlogPostsByTag(blogTag), archiveContext.page).items.map((blogPost, index) => {
                      const blogLocalized = getLocalizedPost(blogPost, language);
                      return {
                        '@type': 'ListItem',
                        position: index + 1,
                        url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                        name: blogLocalized.title,
                      };
                    }),
                  },
                }
            : currentPage === PageView.BLOG && blogCategory
              ? {
                  '@context': 'https://schema.org',
                  '@type': 'CollectionPage',
                  name: `${blogCategoryLabel} ${t('nav_blog')}`,
                  description: pageSeo.description,
                  url: pageUrl,
                  mainEntity: {
                    '@type': 'ItemList',
                    itemListElement: paginateBlogPosts(getBlogPostsByCategory(blogCategory), archiveContext.page).items.map((blogPost, index) => {
                      const blogLocalized = getLocalizedPost(blogPost, language);
                      return {
                        '@type': 'ListItem',
                        position: index + 1,
                        url: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, blogPost.slug)}`,
                        name: blogLocalized.title,
                      };
                    }),
                  },
                }
            : currentPage === PageView.BLOG
              ? {
                  '@context': 'https://schema.org',
                  '@type': 'Blog',
                  name: `${t('company_name_en')} Blog`,
                  description: t('blog_desc'),
                  url: pageUrl,
                  blogPost: paginateBlogPosts(getBlogPostsByCategory(), archiveContext.page).items.map((blogPost) => {
                    const blogLocalized = getLocalizedPost(blogPost, language);
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
        ...(currentPage === PageView.BLOG && post
          ? [
              {
                '@type': 'ListItem',
                position: 3,
                name: localizedPost?.title,
                item: pageUrl,
              },
            ]
          : currentPage === PageView.BLOG && blogTag
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${blogTagLabel} ${t('blog_tag_archive_title')}`,
                  item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, archiveContext.page > 1 ? `${getBlogTagPath(blogTag)}/page/${archiveContext.page}` : getBlogTagPath(blogTag))}`,
                },
              ]
          : currentPage === PageView.BLOG && blogCategory
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${blogCategoryLabel} ${t('nav_blog')}`,
                  item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, archiveContext.page > 1 ? `${getBlogCategoryPath(blogCategory)}/page/${archiveContext.page}` : getBlogCategoryPath(blogCategory))}`,
                },
              ]
          : currentPage === PageView.BLOG && archiveContext.page > 1
            ? [
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: `${t('blog_page_status')} ${archiveContext.page}`,
                  item: `${SITE_URL}${getLocalizedPath(PageView.BLOG, language, getBlogPagePath(archiveContext.page))}`,
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
  }, [blogSlug, currentPage, language, productSlug, t]);

  return null;
};
