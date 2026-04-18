import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import vm from 'vm';
import BLOG_CONTENT_OVERRIDES from './data/blog/contentOverrides.js';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const translationsPath = path.resolve('utils/translations.ts');
const blogPostsPath = path.resolve('data/blog/content.ts');
const productsPath = path.resolve('data/products.ts');
const productSeoPath = path.resolve('utils/productSeo.ts');
const siteUrl = 'https://wanjinspring.com';
const ogImage = `${siteUrl}/factory/factory_1.jpg`;
const defaultLanguage = 'en';
const blogPostsPerPage = 6;
const blogCategoryLabels = {
  guide: { en: 'Guide', zh: '指南', ru: 'Гайд', es: 'Guia', ar: 'دليل', hi: 'गाइड', pt: 'Guia', ja: 'ガイド', de: 'Leitfaden', fr: 'Guide' },
  news: { en: 'News', zh: '新闻', ru: 'Новости', es: 'Noticias', ar: 'أخبار', hi: 'समाचार', pt: 'Noticias', ja: 'ニュース', de: 'Nachrichten', fr: 'Actualites' },
  insight: { en: 'Insight', zh: '洞察', ru: 'Аналитика', es: 'Perspectiva', ar: 'رؤى', hi: 'अंतर्दृष्टि', pt: 'Insight', ja: 'インサイト', de: 'Einblicke', fr: 'Analyse' },
};
const FAQ_KEYS = [
  ['faq_q1', 'faq_a1'],
  ['faq_q2', 'faq_a2'],
  ['faq_q3', 'faq_a3'],
  ['faq_q4', 'faq_a4'],
  ['faq_q5', 'faq_a5'],
  ['faq_q6', 'faq_a6'],
  ['faq_q7', 'faq_a7'],
  ['faq_q8', 'faq_a8'],
  ['faq_q9', 'faq_a9'],
  ['faq_q10', 'faq_a10'],
  ['faq_q11', 'faq_a11'],
  ['faq_q12', 'faq_a12'],
];

const routeMap = {
  HOME: '/',
  ABOUT: '/about',
  PRODUCTS: '/products',
  CAPACITY: '/capacity',
  FACTORY: '/factory',
  CONTACT: '/contact',
  FAQ: '/faq',
  BLOG: '/blog',
};

const pageConfigs = [
  {
    page: 'HOME',
    title: (t) => `${t.company_name_en} | ${t.hero_title}`,
    description: (t) => t.hero_desc,
    heading: (t) => t.hero_title,
    body: (t) => [t.hero_desc, t.seo_scope_desc ?? t.product_header_desc],
  },
  {
    page: 'ABOUT',
    title: (t) => `${t.about_title} | ${t.company_name_en}`,
    description: (t) => t.about_desc,
    heading: (t) => t.company_intro,
    body: (t) => [t.about_para1, t.about_para2, t.about_para3],
  },
  {
    page: 'PRODUCTS',
    title: (t) => `${t.nav_products} | ${t.company_name_en}`,
    description: (t) => t.products_spec_desc ?? t.product_header_desc,
    heading: (t) => t.nav_products,
    body: (t) => [
      t.product_header_desc,
      t.products_spec_desc ?? t.seo_scope_desc ?? t.product_more_desc,
      `${t.products_spec_cold_title ?? 'Cold-Coiling Window'}: ${t.products_spec_cold_value ?? '0.1-10 mm'}`,
      `${t.products_spec_test_title ?? 'Heavy-Load Validation'}: ${t.products_spec_test_value ?? '5-50 tonf'}`,
    ],
  },
  {
    page: 'CAPACITY',
    title: (t) => `${t.nav_capacity} | ${t.company_name_en}`,
    description: (t) => t.cap_band_desc ?? t.cap_intro_desc,
    heading: (t) => t.nav_capacity,
    body: (t) => [
      t.cap_intro_desc,
      t.cap_band_desc ?? t.cap_mfg_desc,
      `${t.cap_band_cold_title ?? 'Cold-Coiling Window'}: ${t.cap_band_cold_value ?? '0.1-10 mm'}`,
      `${t.cap_band_test_title ?? 'Heavy-Load Test Range'}: ${t.cap_band_test_value ?? '5-50 tonf'}`,
      t.cap_qc_desc,
    ],
  },
  {
    page: 'FACTORY',
    title: (t) => `${t.nav_factory} | ${t.company_name_en}`,
    description: (t) => t.factory_desc,
    heading: (t) => t.nav_factory,
    body: (t) => [t.factory_desc, t.factory_process_cold_desc, t.factory_process_hot_desc],
  },
  {
    page: 'CONTACT',
    title: (t) => `${t.nav_contact} | ${t.company_name_en}`,
    description: (t) => t.email_us_desc,
    heading: (t) => t.contact_title,
    body: (t) => [t.email_us_desc, `${t.address_label}: ${t.address_val}`, `${t.form_phone}: ${t.phone_val}`],
  },
  {
    page: 'FAQ',
    title: (t) => `${t.nav_faq} | ${t.company_name_en}`,
    description: (t) => t.blog_questions_desc,
    heading: (t) => t.nav_faq,
    body: (t) => FAQ_KEYS.flatMap(([questionKey, answerKey]) => [t[questionKey], t[answerKey]]),
  },
  {
    page: 'BLOG',
    title: (t) => `${t.blog_title} | ${t.company_name_en}`,
    description: (t) => t.blog_desc,
    heading: (t) => t.blog_title,
    body: (t) => [t.blog_desc, t.blog_featured_desc, t.blog_latest_desc],
  },
];

const localeMap = {
  en: { html: 'en', og: 'en_US' },
  zh: { html: 'zh-CN', og: 'zh_CN' },
  ru: { html: 'ru', og: 'ru_RU' },
  ja: { html: 'ja', og: 'ja_JP' },
  de: { html: 'de', og: 'de_DE' },
  fr: { html: 'fr', og: 'fr_FR' },
  es: { html: 'es', og: 'es_ES' },
  pt: { html: 'pt-PT', og: 'pt_PT' },
};

const seoStructuredDataPattern =
  /<script\b(?=[^>]*id="seo-structured-data")(?=[^>]*type="application\/ld\+json")[^>]*>[\s\S]*?<\/script>/;

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const serializeJsonLd = (value) =>
  JSON.stringify(value, null, 0)
    .replace(/</g, '\\u003c')
    .replace(/-->/g, '--\\>')
    .replace(/<\/script/gi, '<\\/script');

const replaceStructuredData = (html, jsonLd) => {
  if (!jsonLd) {
    throw new Error('Refusing to prerender empty seo-structured-data payload.');
  }

  if (!seoStructuredDataPattern.test(html)) {
    throw new Error('Could not find seo-structured-data script tag in base HTML.');
  }

  return html.replace(
    seoStructuredDataPattern,
    () => `<script id="seo-structured-data" type="application/ld+json">${jsonLd}</script>`
  );
};

const hashFile = (filePath) => crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex');

const knowsAboutTopics = [
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
];

const machineReadableResources = [
  { name: 'LLMs Reference', url: `${siteUrl}/llms.txt`, encodingFormat: 'text/plain' },
  { name: 'Extended LLMs Reference', url: `${siteUrl}/llms-full.txt`, encodingFormat: 'text/plain' },
  { name: 'AI Search Profile', url: `${siteUrl}/ai-search-profile.json`, encodingFormat: 'application/json' },
  { name: 'Company Profile JSON', url: `${siteUrl}/company-profile.json`, encodingFormat: 'application/json' },
  { name: 'Products Catalog JSON', url: `${siteUrl}/products.json`, encodingFormat: 'application/json' },
  { name: 'Products Catalog JSON-LD', url: `${siteUrl}/products-catalog.jsonld`, encodingFormat: 'application/ld+json' },
  { name: 'Blog JSON Feed', url: `${siteUrl}/blog-feed.json`, encodingFormat: 'application/feed+json' },
];

const blogAuthorProfile = {
  name: 'Jenny Xu',
  url: 'https://www.linkedin.com/in/jenny-xu-412a303b9/',
  knowsAbout: [
    'Custom spring sourcing',
    'Industrial spring manufacturing',
    'Spring drawing review',
    'Export spring projects',
    'Supplier qualification',
    'Load testing and inspection reporting',
  ],
};

const baseSeoKeywords = [
  '万锦精密弹簧',
  '工业弹簧',
  'Wanjin Precision Spring',
  "Xi'an Wanjin Precision Spring",
  'precision springs',
  'industrial springs',
  'heavy duty springs',
  'compression springs',
  'hot coil springs',
  'disc springs',
  'die springs',
  'custom springs',
  'wave springs',
  'retaining rings',
];

const localizedSeoKeywords = {
  zh: [
    '重载弹簧',
    '压缩弹簧',
    '定制弹簧',
    '精密弹簧',
  ],
  ru: [
    'промышленные пружины',
    'тяжелонагруженные пружины',
    'пружины сжатия',
    'пружины на заказ',
  ],
  ja: [
    '工業用ばね',
    '圧縮ばね',
    '特注ばね',
  ],
  de: [
    'Industriefedern',
    'Schwerlastfedern',
    'Druckfedern',
    'Sonderfedern',
    'Federn nach Maß',
  ],
  fr: [
    'ressorts industriels',
    'ressorts de compression',
    'ressorts sur mesure',
  ],
  es: [
    'muelles industriales',
    'muelles de compresión',
    'muelles a medida',
    'muelles de carga pesada',
  ],
  pt: [
    'molas industriais',
    'molas de compressão',
    'molas sob medida',
    'molas de alta carga',
  ],
};

const buildKeywordContent = (...keywordGroups) => {
  const seen = new Set();
  const keywords = [];

  keywordGroups.forEach((group) => {
    group?.forEach((keyword) => {
      const normalized = keyword?.trim();
      if (!normalized) {
        return;
      }

      const dedupeKey = normalized.toLowerCase();
      if (seen.has(dedupeKey)) {
        return;
      }

      seen.add(dedupeKey);
      keywords.push(normalized);
    });
  });

  return keywords.join(', ');
};

const getBaseSeoKeywords = (language) => [...baseSeoKeywords, ...(localizedSeoKeywords[language] ?? [])];

const auditDuplicateProductAssets = (productRecords) => {
  const usageByAssetPath = new Map();

  for (const product of productRecords) {
    const assetPath = product.image;
    const usage = usageByAssetPath.get(assetPath) ?? [];
    usage.push(product.slug);
    usageByAssetPath.set(assetPath, usage);
  }

  const pathsByHash = new Map();
  for (const assetPath of usageByAssetPath.keys()) {
    const filePath = path.resolve('public', assetPath.replace(/^\//, ''));
    if (!fs.existsSync(filePath)) {
      console.warn(`[prerender] Missing product asset referenced by data: ${assetPath}`);
      continue;
    }

    const hash = hashFile(filePath);
    const group = pathsByHash.get(hash) ?? [];
    group.push(assetPath);
    pathsByHash.set(hash, group);
  }

  const duplicates = [...pathsByHash.values()].filter((group) => group.length > 1);
  if (!duplicates.length) {
    return;
  }

  console.warn('[prerender] Duplicate product assets detected. These files have identical bytes and should be consolidated in source data/assets:');
  for (const group of duplicates) {
    const usage = group
      .map((assetPath) => `${assetPath} -> ${usageByAssetPath.get(assetPath).join(', ')}`)
      .join(' | ');
    console.warn(`  - ${usage}`);
  }
};

const getLocalizedPath = (page, language, slug) => {
  const basePath = routeMap[page];
  const suffix = slug && (page === 'BLOG' || page === 'PRODUCTS') ? `/${slug}` : '';
  if (language === defaultLanguage) {
    return `${basePath}${suffix}`;
  }
  const localizedBase = basePath === '/' ? `/${language}` : `/${language}${basePath}`;
  return `${localizedBase}${suffix}`;
};

const loadTranslations = () => {
  const source = fs.readFileSync(translationsPath, 'utf8');
  const executable = source
    .replace(/export type[\s\S]*?;\n\n/, '')
    .replace(/export const FULLY_LOCALIZED_LANGUAGES\s*=\s*[\s\S]*?as const;\n\n/, '')
    .replace(/export const LANGUAGES\s*:\s*[^=]+=/, 'const LANGUAGES =')
    .replace(/export const TRANSLATIONS\s*:\s*[^=]+=/, 'const TRANSLATIONS =')
    .concat('\nthis.LANGUAGES = LANGUAGES; this.TRANSLATIONS = TRANSLATIONS;');

  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(executable, sandbox);
  return {
    languages: sandbox.LANGUAGES,
    translations: sandbox.TRANSLATIONS,
  };
};

const loadBlogPosts = () => {
  const source = fs.readFileSync(blogPostsPath, 'utf8');
  const executable = source
    .replace(/^import[^\n]+\n/gm, '')
    .replace(/^export type[^\n]+\n/gm, '')
    .replace(/export const BLOG_POSTS\s*=/, 'const BLOG_POSTS =')
    .concat('\nthis.BLOG_POSTS = BLOG_POSTS;');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(executable, sandbox);
  return sandbox.BLOG_POSTS;
};

const loadProducts = () => {
  const source = fs.readFileSync(productsPath, 'utf8');
  const executable = source
    .replace(/^export interface[\s\S]*?}\n\n/gm, '')
    .replace(/^export const FEATURED_PRODUCT_SLUGS[\s\S]*?;\n\n/gm, '')
    .replace(/^export const getProductBySlug[\s\S]*?;\n\n/gm, '')
    .replace(/^export const getFeaturedProducts[\s\S]*?;\n/gm, '')
    .replace(/export const PRODUCT_DATA\s*:\s*ProductRecord\[\]\s*=/, 'const PRODUCT_DATA =')
    .concat('\nthis.PRODUCT_DATA = PRODUCT_DATA;');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(executable, sandbox);
  return sandbox.PRODUCT_DATA;
};

const loadProductSeo = () => {
  const source = fs.readFileSync(productSeoPath, 'utf8');
  const executable = source
    .replace(/^export interface[\s\S]*?}\n\n/gm, '')
    .replace(/const PRODUCT_SEO_PROFILES\s*:\s*Record<string,\s*ProductSeoProfile>\s*=/, 'const PRODUCT_SEO_PROFILES =')
    .replace(/export const getProductSeoProfile\s*=\s*\(([\s\S]*?)\)\s*:\s*ProductSeoProfile\s*=>\s*{/, 'const getProductSeoProfile = ($1) => {')
    .replace(/: string/g, '')
    .replace(/: ProductSeoProfile/g, '')
    .concat('\nthis.getProductSeoProfile = getProductSeoProfile;');
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(executable, sandbox);
  return sandbox.getProductSeoProfile;
};

const getLocalizedValue = (value, language) => value?.[language] ?? value?.en ?? Object.values(value ?? {})[0] ?? '';
const getCategoryLabel = (category, language) =>
  blogCategoryLabels[category][language] ?? blogCategoryLabels[category].en ?? Object.values(blogCategoryLabels[category])[0];
const applyBlogOverride = (post) => {
  const override = BLOG_CONTENT_OVERRIDES[post.slug];
  if (!override) {
    return post;
  }

  return {
    ...post,
    updatedAt: override.updatedAt ?? post.updatedAt,
    title: override.title ? { ...post.title, ...override.title } : post.title,
    seoTitle: override.seoTitle ? { ...post.seoTitle, ...override.seoTitle } : post.seoTitle,
    seoDescription: override.seoDescription ? { ...post.seoDescription, ...override.seoDescription } : post.seoDescription,
    excerpt: override.excerpt ? { ...post.excerpt, ...override.excerpt } : post.excerpt,
    content: override.content ? { ...post.content, ...override.content } : post.content,
  };
};
const normalizeTagSlug = (tag) => tag.trim().toLowerCase().replace(/\s+/g, '-');
const getDisplayTagName = (tagSlug) =>
  tagSlug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
const paginatePosts = (posts, page) => {
  const totalPages = Math.max(1, Math.ceil(posts.length / blogPostsPerPage));
  const safePage = Math.min(Math.max(page, 1), totalPages);
  const start = (safePage - 1) * blogPostsPerPage;
  return { page: safePage, totalPages, items: posts.slice(start, start + blogPostsPerPage) };
};

const buildProductSpecifications = (product, en, zh) =>
  product.specKeys.map((spec, index) => ({
    order: index + 1,
    title_en: en[spec.titleKey],
    title_zh: zh[spec.titleKey],
    value_en: en[spec.valueKey],
    value_zh: zh[spec.valueKey],
    description_en: en[spec.descKey],
    description_zh: zh[spec.descKey],
  }));

const buildProductCatalogRecord = (product, en, zh, index) => ({
  id: product.id,
  slug: product.slug,
  sort_order: index + 1,
  category_en: en[product.categoryKey],
  category_zh: zh[product.categoryKey],
  name_en: en[product.nameKey],
  name_zh: zh[product.nameKey],
  description_en: en[product.descKey],
  description_zh: zh[product.descKey],
  features_en: product.featureKeys.map((key) => en[key]),
  features_zh: product.featureKeys.map((key) => zh[key]),
  image_url: `${siteUrl}${product.image}`,
  page_url: `${siteUrl}/products/${product.slug}`,
  page_url_zh: `${siteUrl}/zh/products/${product.slug}`,
  application_areas_en: product.industryKeys.map((key) => en[key]),
  application_areas_zh: product.industryKeys.map((key) => zh[key]),
  related_industries_en: product.industryKeys.map((key) => en[key]),
  related_industries_zh: product.industryKeys.map((key) => zh[key]),
  manufacturing_process_en: product.processKeys.map((key) => en[key]),
  manufacturing_process_zh: product.processKeys.map((key) => zh[key]),
  search_terms: product.articleTerms,
  specifications: buildProductSpecifications(product, en, zh),
  specification_count: product.specKeys.length,
});

const buildProductCatalogJson = (products, en, zh) => {
  const baseCatalog = JSON.parse(fs.readFileSync(path.resolve('public/products.json'), 'utf8'));
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  return {
    ...baseCatalog,
    catalog_version: new Date().toISOString().slice(0, 10),
    products: baseCatalog.products.map((entry) => {
      const product = productBySlug.get(entry.slug);
      if (!product) {
        return entry;
      }

      return {
        ...entry,
        search_terms: product.articleTerms,
        specifications: buildProductSpecifications(product, en, zh),
        specification_count: product.specKeys.length,
      };
    }),
  };
};

const buildProductCatalogJsonLd = (products, en, zh) => {
  const baseCatalog = JSON.parse(fs.readFileSync(path.resolve('public/products-catalog.jsonld'), 'utf8'));
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  return {
    ...baseCatalog,
    itemListElement: baseCatalog.itemListElement.map((listItem) => {
      const slug = listItem.item?.['@id']?.split('#')[1];
      const product = slug ? productBySlug.get(slug) : undefined;
      if (!product) {
        return listItem;
      }

      const specifications = buildProductSpecifications(product, en, zh);
      return {
        ...listItem,
        item: {
          ...listItem.item,
          specifications,
          specification_count: product.specKeys.length,
          search_terms: product.articleTerms,
          additionalProperty: [
            ...(listItem.item.additionalProperty ?? []),
            ...specifications.flatMap((spec) => [
              { '@type': 'PropertyValue', name: `spec_${spec.order}_title_en`, value: spec.title_en },
              { '@type': 'PropertyValue', name: `spec_${spec.order}_title_zh`, value: spec.title_zh },
              { '@type': 'PropertyValue', name: `spec_${spec.order}_value_en`, value: spec.value_en },
              { '@type': 'PropertyValue', name: `spec_${spec.order}_value_zh`, value: spec.value_zh },
              { '@type': 'PropertyValue', name: `spec_${spec.order}_description_en`, value: spec.description_en },
              { '@type': 'PropertyValue', name: `spec_${spec.order}_description_zh`, value: spec.description_zh },
            ]),
          ],
        },
      };
    }),
  };
};

const buildStaticContent = (heading, bodyLines) => {
  const paragraphs = bodyLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  return `
<noscript>
  <section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
    <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(heading)}</h1>
    <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
      ${paragraphs}
    </div>
  </section>
</noscript>`;
};

const buildStaticArticleContent = (heading, metaLines, bodyLines) => {
  const meta = metaLines.map((line) => `<p style="margin:0;color:#64748b;font-size:0.95rem;line-height:1.7;">${escapeHtml(line)}</p>`).join('');
  const paragraphs = bodyLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');

  return `
<noscript>
  <article id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
    <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 14px;">${escapeHtml(heading)}</h1>
    <div style="display:grid;gap:6px;margin-bottom:22px;">${meta}</div>
    <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
      ${paragraphs}
    </div>
  </article>
</noscript>`;
};

const buildStaticArticleList = (heading, intro, articles) => {
  const items = articles
    .map(
      (article) => `<article style="padding:24px 0;border-top:1px solid #e2e8f0;">
  <h2 style="font-size:1.375rem;line-height:1.35;font-weight:700;margin:0;">
    <a href="${escapeHtml(article.href)}" style="color:#0f172a;text-decoration:none;">${escapeHtml(article.title)}</a>
  </h2>
  <p style="margin:12px 0 0;color:#475569;font-size:1rem;line-height:1.8;">${escapeHtml(article.excerpt)}</p>
</article>`
    )
    .join('');

  return `
<noscript>
  <section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
    <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(heading)}</h1>
    <p style="margin:0 0 28px;color:#475569;font-size:1rem;line-height:1.8;">${escapeHtml(intro)}</p>
    <section style="border-top:1px solid #e2e8f0;">
      ${items}
    </section>
  </section>
</noscript>`;
};

const buildStructuredStaticContent = (heading, intro, sections) => {
  const sectionsHtml = sections
    .map((section) => {
      const paragraphs = (section.paragraphs ?? []).map((line) => `<p>${escapeHtml(line)}</p>`).join('');
      const items = (section.items ?? []).map((item) => `<li style="margin:0 0 10px;">${escapeHtml(item)}</li>`).join('');

      return `<section style="margin-top:32px;">
  <h2 style="font-size:1.5rem;line-height:1.3;font-weight:700;margin:0 0 14px;">${escapeHtml(section.title)}</h2>
  <div style="display:grid;gap:14px;color:#475569;font-size:1rem;line-height:1.8;">
    ${paragraphs}
    ${items ? `<ul style="margin:0;padding-left:20px;">${items}</ul>` : ''}
  </div>
</section>`;
    })
    .join('');

  return `
<noscript>
  <section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
    <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(heading)}</h1>
    <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
      <p>${escapeHtml(intro)}</p>
    </div>
    ${sectionsHtml}
  </section>
</noscript>`;
};

const buildAlternateLinks = (page, slug) =>
  Object.keys(localeMap)
    .map((language) => {
      const href = `${siteUrl}${getLocalizedPath(page, language, slug)}`;
      return `<link rel="alternate" hreflang="${language}" href="${href}" />`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${getLocalizedPath(page, defaultLanguage, slug)}" />`)
    .join('\n    ');

const buildSharedJsonLd = ({
  title,
  canonical,
  description,
  image = ogImage,
  type = 'WebPage',
  publishedAt,
  updatedAt,
  language,
  t,
  keywords,
}) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: t.company_name_full ?? t.company_name_en,
    alternateName: t.company_name_en,
    url: siteUrl,
    logo: `${siteUrl}/factory/logo.jpeg`,
    image: ogImage,
    email: 'sales@wanjinspring.com',
    telephone: '+86 187 2938 3359',
    foundingDate: '2018-04-24',
    foundingLocation: "Xi'an, Shaanxi, China",
    knowsAbout: knowsAboutTopics,
    subjectOf: machineReadableResources.map((resource) => ({
      '@type': 'DigitalDocument',
      name: resource.name,
      url: resource.url,
      encodingFormat: resource.encodingFormat,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: t.company_name_en,
    url: siteUrl,
    inLanguage: language,
    description: t.hero_desc,
    potentialAction: [
      {
        '@type': 'SearchAction',
        name: `${t.nav_products} Search`,
        target: `${siteUrl}${getLocalizedPath('PRODUCTS', language)}?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    ],
    hasPart: machineReadableResources.map((resource) => ({
      '@type': 'DigitalDocument',
      name: resource.name,
      url: resource.url,
      encodingFormat: resource.encodingFormat,
    })),
  },
  {
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    headline: title,
    url: canonical,
    description,
    image,
    inLanguage: language,
    ...(keywords ? { keywords } : {}),
    mainEntityOfPage: canonical,
    isPartOf: {
      '@type': 'WebSite',
      name: t.company_name_en,
      url: siteUrl,
    },
    ...(type === 'BlogPosting'
      ? {
          author: {
            '@type': 'Person',
            name: blogAuthorProfile.name,
            url: blogAuthorProfile.url,
            knowsAbout: blogAuthorProfile.knowsAbout,
          },
          publisher: {
            '@type': 'Organization',
            name: t.company_name_full ?? t.company_name_en,
            alternateName: t.company_name_en,
            url: siteUrl,
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/factory/logo.jpeg`,
            },
          },
        }
      : {}),
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
  },
];

const buildJsonLd = ({ type = 'WebPage', title, canonical, description, image = ogImage, publishedAt, updatedAt, language, t, keywords }) =>
  serializeJsonLd(buildSharedJsonLd({ type, title, canonical, description, image, publishedAt, updatedAt, language, t, keywords }));

const buildFaqJsonLd = ({ title, canonical, description, language, t, keywords }) =>
  serializeJsonLd([
    ...buildSharedJsonLd({ title, canonical, description, language, t, keywords }),
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ_KEYS.map(([questionKey, answerKey]) => ({
        '@type': 'Question',
        name: t[questionKey],
        acceptedAnswer: {
          '@type': 'Answer',
          text: t[answerKey],
        },
      })),
    },
  ]);

const buildProductJsonLd = ({ productName, title, canonical, description, image, product, t, seoProfile, language, keywords }) =>
  serializeJsonLd([
    ...buildSharedJsonLd({ title, canonical, description, image, language, t, keywords }),
    {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: productName,
      alternateName: title,
      url: canonical,
      description,
      image,
      category: t[product.categoryKey],
      keywords: keywords ?? seoProfile.keywords.join(', '),
      brand: {
        '@type': 'Brand',
        name: t.company_name_en,
      },
      manufacturer: {
        '@type': 'Organization',
        name: t.company_name_full ?? t.company_name_en,
        url: siteUrl,
      },
      additionalProperty: product.specKeys.map((spec) => ({
        '@type': 'PropertyValue',
        name: t[spec.titleKey],
        value: t[spec.valueKey],
        description: t[spec.descKey],
      })),
    },
  ]);

const writeSitemap = (entries) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, priority, changefreq, lastmod }) => `  <url>
    <loc>${loc}</loc>
    ${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
};

const writeRssFeed = (posts) => {
  const items = posts
    .map((post) => {
      const title = escapeHtml(getLocalizedValue(post.title, 'en'));
      const description = escapeHtml(getLocalizedValue(post.excerpt, 'en'));
      const link = `${siteUrl}/blog/${post.slug}`;
      return `  <item>
    <title>${title}</title>
    <link>${link}</link>
    <guid>${link}</guid>
    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
    <description>${description}</description>
  </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Wanjin Precision Spring Blog</title>
  <link>${siteUrl}/blog</link>
  <description>Technical articles and company news from Wanjin Precision Spring.</description>
  ${items}
</channel>
</rss>
`;

  fs.writeFileSync(path.join(distDir, 'blog-feed.xml'), xml);
};

const writeJsonFeed = (posts) => {
  const feed = {
    version: 'https://jsonfeed.org/version/1.1',
    title: 'Wanjin Precision Spring Blog',
    home_page_url: `${siteUrl}/blog`,
    feed_url: `${siteUrl}/blog-feed.json`,
    description: 'Technical articles and company news from Wanjin Precision Spring.',
    items: posts.map((post) => ({
      id: `${siteUrl}/blog/${post.slug}`,
      url: `${siteUrl}/blog/${post.slug}`,
      title: getLocalizedValue(post.title, 'en'),
      content_text: getLocalizedValue(post.content, 'en').join('\n\n'),
      summary: getLocalizedValue(post.excerpt, 'en'),
      image: `${siteUrl}${post.coverImage}`,
      date_published: post.publishedAt,
      date_modified: post.updatedAt,
      tags: post.tags,
    })),
  };

  fs.writeFileSync(path.join(distDir, 'blog-feed.json'), JSON.stringify(feed, null, 2));
};

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const { languages, translations } = loadTranslations();
const blogPosts = loadBlogPosts().map(applyBlogOverride);
const products = loadProducts();
const getProductSeoProfile = loadProductSeo();
const sitemapEntries = [];
const englishCatalog = translations.en;
const chineseCatalog = translations.zh ?? translations.en;

auditDuplicateProductAssets(products);

fs.writeFileSync(path.join(distDir, 'products.json'), JSON.stringify(buildProductCatalogJson(products, englishCatalog, chineseCatalog), null, 2));
fs.writeFileSync(path.join(distDir, 'products-catalog.jsonld'), JSON.stringify(buildProductCatalogJsonLd(products, englishCatalog, chineseCatalog), null, 2));

for (const language of Object.keys(languages)) {
  const locale = localeMap[language];
  const t = translations[language];

  for (const config of pageConfigs) {
    if (config.page === 'FAQ') {
      const localizedPath = getLocalizedPath(config.page, language);
      const canonical = `${siteUrl}${localizedPath}`;
      const title = config.title(t);
      const description = config.description(t);
      const keywords = buildKeywordContent(getBaseSeoKeywords(language), [t.nav_faq, t.faq_title, t.blog_questions_title]);
      const heading = config.heading(t);
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
      const sections = FAQ_KEYS.map(([questionKey, answerKey]) => ({
        title: t[questionKey],
        paragraphs: [t[answerKey]],
      }));

      let html = baseHtml
        .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
        .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
        .replace('</head>', `    ${buildAlternateLinks(config.page)}\n  </head>`)
        .replace('<div id="root"></div>', `${buildStructuredStaticContent(heading, description, sections)}\n    <div id="root"></div>`);
      html = replaceStructuredData(html, buildFaqJsonLd({ title, canonical, description, language, t, keywords }));

      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, html);
      sitemapEntries.push({
        loc: canonical,
        priority: '0.7',
        changefreq: 'monthly',
      });
      continue;
    }

    if (config.page === 'BLOG') {
      const paginated = paginatePosts(blogPosts, 1);
      for (let page = 1; page <= paginated.totalPages; page += 1) {
        const paginatedPage = paginatePosts(blogPosts, page);
        const pageSlug = page > 1 ? `page/${page}` : undefined;
        const localizedPath = getLocalizedPath(config.page, language, pageSlug);
        const canonical = `${siteUrl}${localizedPath}`;
        const title = `${config.title(t)}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''}`;
        const description = config.description(t);
        const keywords = buildKeywordContent(getBaseSeoKeywords(language));
        const heading = `${config.heading(t)}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`;
        const articles = paginatedPage.items.map((post) => ({
          title: getLocalizedValue(post.title, language),
          excerpt: getLocalizedValue(post.excerpt, language),
          href: getLocalizedPath('BLOG', language, post.slug),
        }));
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');

        let html = baseHtml
          .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
          .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
          .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
          .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
          .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
          .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
          .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
          .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
          .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
          .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
          .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
          .replace('</head>', `    ${buildAlternateLinks(config.page, pageSlug)}\n  </head>`)
          .replace('<div id="root"></div>', `${buildStaticArticleList(heading, description, articles)}\n    <div id="root"></div>`);
        html = replaceStructuredData(html, buildJsonLd({ title, canonical, description, language, t, keywords }));

        fs.mkdirSync(path.dirname(outputFile), { recursive: true });
        fs.writeFileSync(outputFile, html);
        sitemapEntries.push({
          loc: canonical,
          priority: '0.9',
          changefreq: 'weekly',
        });
      }
      continue;
    }

    const localizedPath = getLocalizedPath(config.page, language);
    const canonical = `${siteUrl}${localizedPath}`;
    const title = config.title(t);
    const description = config.description(t);
    const keywords = buildKeywordContent(getBaseSeoKeywords(language));
    const heading = config.heading(t);
    const body = config.body(t);
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const outputFile =
      localizedPath === '/'
        ? path.join(distDir, 'index.html')
        : path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
      .replace('</head>', `    ${buildAlternateLinks(config.page)}\n  </head>`)
      .replace('<div id="root"></div>', `${buildStaticContent(heading, body)}\n    <div id="root"></div>`);
    html = replaceStructuredData(html, buildJsonLd({ title, canonical, description, language, t, keywords }));

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);
    sitemapEntries.push({
      loc: canonical,
      priority: config.page === 'HOME' ? '1.0' : config.page === 'PRODUCTS' ? '0.9' : '0.8',
      changefreq: config.page === 'PRODUCTS' ? 'weekly' : 'monthly',
    });
  }

  for (const product of products) {
    const localizedPath = getLocalizedPath('PRODUCTS', language, product.slug);
    const canonical = `${siteUrl}${localizedPath}`;
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
    const seoProfile = getProductSeoProfile(product.slug, t[product.nameKey], language);
    const title = `${seoProfile.title} | ${t.company_name_en}`;
    const description = seoProfile.description;
    const productName = t[product.nameKey];
    const keywords = buildKeywordContent(getBaseSeoKeywords(language), seoProfile.keywords, [productName]);
    const heading = productName;
    const body = [
      seoProfile.overview,
      seoProfile.description,
      t[product.descKey],
      ...product.featureKeys.map((key) => t[key]),
      ...product.industryKeys.map((key) => `${t.products_card_application}: ${t[key]}`),
      ...product.processKeys.map((key) => `${t.products_card_process}: ${t[key]}`),
      ...product.specKeys.map((spec) => `${t[spec.titleKey]}: ${t[spec.valueKey]} - ${t[spec.descKey]}`),
    ];
    const image = `${siteUrl}${product.image}`;
    const productContent = buildStaticContent(heading, body);

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`)
      .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="product" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
      .replace('</head>', `    ${buildAlternateLinks('PRODUCTS', product.slug)}\n  </head>`)
      .replace('<div id="root"></div>', `${productContent}\n    <div id="root"></div>`);
    html = replaceStructuredData(
      html,
      buildProductJsonLd({ productName, title, canonical, description, image, product, t, seoProfile, language, keywords })
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);
    sitemapEntries.push({
      loc: canonical,
      priority: '0.8',
      changefreq: 'monthly',
    });
  }

  for (const category of Object.keys(blogCategoryLabels)) {
    const categoryPosts = blogPosts.filter((post) => post.category === category);
    const categoryLabel = getCategoryLabel(category, language);
    const paginated = paginatePosts(categoryPosts, 1);
    for (let page = 1; page <= paginated.totalPages; page += 1) {
      const paginatedPage = paginatePosts(categoryPosts, page);
      const pageSlug = page > 1 ? `category/${category}/page/${page}` : `category/${category}`;
      const localizedPath = getLocalizedPath('BLOG', language, pageSlug);
      const canonical = `${siteUrl}${localizedPath}`;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
      const title = `${categoryLabel} ${t.nav_blog}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''} | ${t.company_name_en}`;
      const description = `${t.blog_desc} ${categoryLabel}.`;
      const keywords = buildKeywordContent(getBaseSeoKeywords(language), [categoryLabel]);
      const articles = paginatedPage.items.map((post) => ({
        title: getLocalizedValue(post.title, language),
        excerpt: getLocalizedValue(post.excerpt, language),
        href: getLocalizedPath('BLOG', language, post.slug),
      }));

      let html = baseHtml
        .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
        .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
        .replace('</head>', `    ${buildAlternateLinks('BLOG', pageSlug)}\n  </head>`)
        .replace('<div id="root"></div>', `${buildStaticArticleList(`${categoryLabel} ${t.nav_blog}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`, description, articles)}\n    <div id="root"></div>`);
      html = replaceStructuredData(html, buildJsonLd({ title, canonical, description, language, t, keywords }));

      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, html);
      sitemapEntries.push({
        loc: canonical,
        priority: '0.7',
        changefreq: 'weekly',
      });
    }
  }

  const allTagSlugs = Array.from(
    new Set(blogPosts.flatMap((post) => post.tags.map((tag) => normalizeTagSlug(tag))))
  ).sort();

  for (const tagSlug of allTagSlugs) {
    const tagPosts = blogPosts.filter((post) => post.tags.some((tag) => normalizeTagSlug(tag) === tagSlug));
    const tagLabel = getDisplayTagName(tagSlug);
    const paginated = paginatePosts(tagPosts, 1);
    for (let page = 1; page <= paginated.totalPages; page += 1) {
      const paginatedPage = paginatePosts(tagPosts, page);
      const pageSlug = page > 1 ? `tag/${tagSlug}/page/${page}` : `tag/${tagSlug}`;
      const localizedPath = getLocalizedPath('BLOG', language, pageSlug);
      const canonical = `${siteUrl}${localizedPath}`;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
      const title = `${tagLabel} ${t.blog_tag_archive_title}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''} | ${t.company_name_en}`;
      const description = `${t.blog_tag_archive_desc} ${tagLabel}.`;
      const keywords = buildKeywordContent(getBaseSeoKeywords(language), [tagLabel]);
      const articles = paginatedPage.items.map((post) => ({
        title: getLocalizedValue(post.title, language),
        excerpt: getLocalizedValue(post.excerpt, language),
        href: getLocalizedPath('BLOG', language, post.slug),
      }));

      let html = baseHtml
        .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
        .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
        .replace('</head>', `    ${buildAlternateLinks('BLOG', pageSlug)}\n  </head>`)
        .replace('<div id="root"></div>', `${buildStaticArticleList(`${tagLabel} ${t.blog_tag_archive_title}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`, description, articles)}\n    <div id="root"></div>`);
      html = replaceStructuredData(html, buildJsonLd({ title, canonical, description, language, t, keywords }));

      fs.mkdirSync(path.dirname(outputFile), { recursive: true });
      fs.writeFileSync(outputFile, html);
      sitemapEntries.push({
        loc: canonical,
        priority: '0.7',
        changefreq: 'weekly',
      });
    }
  }

  for (const post of blogPosts) {
    const heading = getLocalizedValue(post.title, language);
    const description = getLocalizedValue(post.seoDescription, language) || getLocalizedValue(post.excerpt, language);
    const body = getLocalizedValue(post.content, language);
    const localizedPath = getLocalizedPath('BLOG', language, post.slug);
    const canonical = `${siteUrl}${localizedPath}`;
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
    const title = getLocalizedValue(post.seoTitle, language) || heading;
    const image = `${siteUrl}${post.coverImage}`;
    const keywords = buildKeywordContent(getBaseSeoKeywords(language), post.tags, [title]);
    const localeCode = localeMap[language]?.html ?? 'en';
    const publishedDate = new Intl.DateTimeFormat(localeCode, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(post.publishedAt));
    const updatedDate = new Intl.DateTimeFormat(localeCode, { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(post.updatedAt));
    const articleMeta = [
      `Author: ${blogAuthorProfile.name}`,
      `Published: ${publishedDate}`,
      `Updated: ${updatedDate}`,
    ];

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="keywords" content=".*?" \/>/, `<meta name="keywords" content="${escapeHtml(keywords)}" />`)
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${escapeHtml(image)}" />`)
      .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta name="twitter:image" content=".*?" \/>/, `<meta name="twitter:image" content="${escapeHtml(image)}" />`)
      .replace(/<meta property="og:type" content=".*?" \/>/, `<meta property="og:type" content="article" />`)
      .replace('</head>', `    ${buildAlternateLinks('BLOG', post.slug)}\n  </head>`)
      .replace('<div id="root"></div>', `${buildStaticArticleContent(heading, articleMeta, body)}\n    <div id="root"></div>`);
    html = replaceStructuredData(
      html,
      buildJsonLd({
        type: 'BlogPosting',
        title,
        canonical,
        description,
        image,
        publishedAt: post.publishedAt,
        updatedAt: post.updatedAt,
        language,
        t,
        keywords,
      })
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);
    sitemapEntries.push({
      loc: canonical,
      lastmod: post.updatedAt,
      priority: '0.8',
      changefreq: 'monthly',
    });
  }
}

writeSitemap(sitemapEntries);
writeRssFeed(blogPosts);
writeJsonFeed(blogPosts);
console.log(`Generated ${sitemapEntries.length} localized prerendered pages.`);
