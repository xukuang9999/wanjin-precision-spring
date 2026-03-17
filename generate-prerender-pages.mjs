import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

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
  guide: { en: 'Guide', zh: '指南', ru: 'Гайд' },
  news: { en: 'News', zh: '新闻', ru: 'Новости' },
  insight: { en: 'Insight', zh: '洞察', ru: 'Аналитика' },
};

const routeMap = {
  HOME: '/',
  ABOUT: '/about',
  PRODUCTS: '/products',
  CAPACITY: '/capacity',
  FACTORY: '/factory',
  CONTACT: '/contact',
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
    page: 'BLOG',
    title: (t) => `${t.nav_blog} | ${t.company_name_en}`,
    description: (t) => t.blog_desc,
    heading: (t) => t.blog_title,
    body: (t) => [t.blog_desc, t.blog_featured_desc, t.blog_latest_desc],
  },
];

const localeMap = {
  zh: { html: 'zh-CN', og: 'zh_CN' },
  en: { html: 'en', og: 'en_US' },
  es: { html: 'es', og: 'es_ES' },
  ar: { html: 'ar', og: 'ar_AR' },
  hi: { html: 'hi', og: 'hi_IN' },
  pt: { html: 'pt-BR', og: 'pt_BR' },
  ru: { html: 'ru', og: 'ru_RU' },
  ja: { html: 'ja', og: 'ja_JP' },
  de: { html: 'de', og: 'de_DE' },
  fr: { html: 'fr', og: 'fr_FR' },
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
  language === 'zh' ? blogCategoryLabels[category].zh : language === 'ru' ? blogCategoryLabels[category].ru : blogCategoryLabels[category].en;
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

const buildStaticContent = (heading, bodyLines) => {
  const paragraphs = bodyLines.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  return `
<section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
  <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(heading)}</h1>
  <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
    ${paragraphs}
  </div>
</section>
<script>window.addEventListener('DOMContentLoaded',function(){var n=document.getElementById('seo-prerender');if(n){n.remove();}});</script>`;
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
<section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
  <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(heading)}</h1>
  <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
    <p>${escapeHtml(intro)}</p>
  </div>
  ${sectionsHtml}
</section>
<script>window.addEventListener('DOMContentLoaded',function(){var n=document.getElementById('seo-prerender');if(n){n.remove();}});</script>`;
};

const buildAlternateLinks = (page, slug) =>
  Object.keys(localeMap)
    .map((language) => {
      const href = `${siteUrl}${getLocalizedPath(page, language, slug)}`;
      return `<link rel="alternate" hreflang="${language}" href="${href}" />`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${getLocalizedPath(page, defaultLanguage, slug)}" />`)
    .join('\n    ');

const buildJsonLd = ({ type = 'WebPage', title, canonical, description, image = ogImage, publishedAt, updatedAt }) =>
  serializeJsonLd({
    '@context': 'https://schema.org',
    '@type': type,
    name: title,
    headline: title,
    url: canonical,
    description,
    image,
    ...(publishedAt ? { datePublished: publishedAt } : {}),
    ...(updatedAt ? { dateModified: updatedAt } : {}),
  });

const buildProductJsonLd = ({ productName, title, canonical, description, image, product, t, seoProfile }) =>
  serializeJsonLd({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productName,
    alternateName: title,
    url: canonical,
    description,
    image,
    category: t[product.categoryKey],
    keywords: seoProfile.keywords.join(', '),
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
  });

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
const blogPosts = loadBlogPosts();
const products = loadProducts();
const getProductSeoProfile = loadProductSeo();
const sitemapEntries = [];

auditDuplicateProductAssets(products);

for (const language of Object.keys(languages)) {
  const locale = localeMap[language];
  const t = translations[language];

  for (const config of pageConfigs) {
    if (config.page === 'BLOG') {
      const paginated = paginatePosts(blogPosts, 1);
      for (let page = 1; page <= paginated.totalPages; page += 1) {
        const pageSlug = page > 1 ? `page/${page}` : undefined;
        const localizedPath = getLocalizedPath(config.page, language, pageSlug);
        const canonical = `${siteUrl}${localizedPath}`;
        const title = `${config.title(t)}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''}`;
        const description = config.description(t);
        const heading = `${config.heading(t)}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`;
        const body = paginatePosts(blogPosts, page).items.map((post) => getLocalizedValue(post.excerpt, language));
        const dir = language === 'ar' ? 'rtl' : 'ltr';
        const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');

        let html = baseHtml
          .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
          .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
          .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
          .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
          .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
          .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
          .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
          .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
          .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
          .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
          .replace('</head>', `    ${buildAlternateLinks(config.page, pageSlug)}\n  </head>`)
          .replace('<div id="root"></div>', `${buildStaticContent(heading, body)}\n    <div id="root"></div>`);
        html = replaceStructuredData(html, buildJsonLd({ title, canonical, description }));

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
      .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
      .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
      .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
      .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
      .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
      .replace('</head>', `    ${buildAlternateLinks(config.page)}\n  </head>`)
      .replace('<div id="root"></div>', `${buildStaticContent(heading, body)}\n    <div id="root"></div>`);
    html = replaceStructuredData(html, buildJsonLd({ title, canonical, description }));

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
    const seoProfile = getProductSeoProfile(product.slug, t[product.nameKey]);
    const title = language === 'en' ? `${seoProfile.title} | ${t.company_name_en}` : `${t[product.nameKey]} | ${t.company_name_en}`;
    const description = language === 'en' ? seoProfile.description : t[product.descKey];
    const productName = t[product.nameKey];
    const heading = productName;
    const body = [
      t[product.descKey],
      ...product.featureKeys.map((key) => t[key]),
      ...product.industryKeys.map((key) => `${t.products_card_application}: ${t[key]}`),
      ...product.processKeys.map((key) => `${t.products_card_process}: ${t[key]}`),
      ...product.specKeys.map((spec) => `${t[spec.titleKey]}: ${t[spec.valueKey]} - ${t[spec.descKey]}`),
    ];
    const image = `${siteUrl}${product.image}`;
    const productContent =
      language === 'en'
        ? buildStructuredStaticContent(heading, seoProfile.overview, [
            {
              title: 'OEM sourcing and engineering fit',
              paragraphs: [
                seoProfile.description,
                `${t[product.nameKey]} sourcing usually depends on load targets, installation space, material route, and downstream assembly requirements. Buyers using phrases like ${seoProfile.keywords.slice(0, 2).join(' and ')} are generally comparing supplier fit, not just browsing a catalog image.`,
              ],
            },
            {
              title: 'Manufacturing scope and validation',
              paragraphs: [
                `Typical programs combine ${product.featureKeys.map((key) => t[key]).join(', ')} with process requirements such as ${product.processKeys.map((key) => t[key]).join(', ')}.`,
                `Industrial buyers in ${product.industryKeys.map((key) => t[key]).join(', ')} usually need a clearer view of tolerance control, load verification, finish, and batch consistency before they move into sampling.`,
              ],
              items: product.specKeys.map((spec) => `${t[spec.titleKey]}: ${t[spec.valueKey]} - ${t[spec.descKey]}`),
            },
            {
              title: 'What buyers usually confirm before sampling',
              paragraphs: [
                'The fastest quotation path is a clear drawing or sample plus target load, stroke, life expectation, finish requirement, and order volume.',
              ],
              items: [
                `Application fit: ${product.industryKeys.map((key) => t[key]).join(', ')}.`,
                `Manufacturing route: ${product.processKeys.map((key) => t[key]).join(', ')}.`,
                `Validation scope: ${product.specKeys.map((spec) => `${t[spec.titleKey]} ${t[spec.valueKey]}`).join('; ')}.`,
              ],
            },
            {
              title: 'Search terms covered by this page',
              paragraphs: [
                'These phrases are intentionally reflected on the page because overseas buyers often search by manufacturer, supplier, or custom-production intent before they know a factory name.',
              ],
              items: seoProfile.keywords,
            },
          ])
        : buildStaticContent(heading, body);

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
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
      buildProductJsonLd({ productName, title, canonical, description, image, product, t, seoProfile })
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
      const pageSlug = page > 1 ? `category/${category}/page/${page}` : `category/${category}`;
      const localizedPath = getLocalizedPath('BLOG', language, pageSlug);
      const canonical = `${siteUrl}${localizedPath}`;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
      const title = `${categoryLabel} ${t.nav_blog}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''} | ${t.company_name_en}`;
      const description = `${t.blog_desc} ${categoryLabel}.`;
      const body = paginatePosts(categoryPosts, page).items.map((post) => getLocalizedValue(post.excerpt, language));

      let html = baseHtml
        .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
        .replace('</head>', `    ${buildAlternateLinks('BLOG', pageSlug)}\n  </head>`)
        .replace('<div id="root"></div>', `${buildStaticContent(`${categoryLabel} ${t.nav_blog}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`, body)}\n    <div id="root"></div>`);
      html = replaceStructuredData(html, buildJsonLd({ title, canonical, description }));

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
      const pageSlug = page > 1 ? `tag/${tagSlug}/page/${page}` : `tag/${tagSlug}`;
      const localizedPath = getLocalizedPath('BLOG', language, pageSlug);
      const canonical = `${siteUrl}${localizedPath}`;
      const dir = language === 'ar' ? 'rtl' : 'ltr';
      const outputFile = path.join(distDir, localizedPath.replace(/^\//, ''), 'index.html');
      const title = `${tagLabel} ${t.blog_tag_archive_title}${page > 1 ? ` | ${t.blog_page_status} ${page}` : ''} | ${t.company_name_en}`;
      const description = `${t.blog_tag_archive_desc} ${tagLabel}.`;
      const body = paginatePosts(tagPosts, page).items.map((post) => getLocalizedValue(post.excerpt, language));

      let html = baseHtml
        .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
        .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
        .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
        .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(description)}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
        .replace(/<meta property="og:locale" content=".*?" \/>/, `<meta property="og:locale" content="${locale.og}" />`)
        .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(title)}" />`)
        .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(description)}" />`)
        .replace('</head>', `    ${buildAlternateLinks('BLOG', pageSlug)}\n  </head>`)
        .replace('<div id="root"></div>', `${buildStaticContent(`${tagLabel} ${t.blog_tag_archive_title}${page > 1 ? ` - ${t.blog_page_status} ${page}` : ''}`, body)}\n    <div id="root"></div>`);
      html = replaceStructuredData(html, buildJsonLd({ title, canonical, description }));

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

    let html = baseHtml
      .replace(/<html lang="[^"]*">/, `<html lang="${locale.html}" dir="${dir}">`)
      .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(title)}</title>`)
      .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(description)}" />`)
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
      .replace('<div id="root"></div>', `${buildStaticContent(heading, body)}\n    <div id="root"></div>`);
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
