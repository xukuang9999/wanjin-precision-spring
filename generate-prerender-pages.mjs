import fs from 'fs';
import path from 'path';
import vm from 'vm';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');
const translationsPath = path.resolve('utils/translations.ts');
const siteUrl = 'https://wanjinspring.com';
const ogImage = `${siteUrl}/factory/factory_1.jpg`;
const defaultLanguage = 'en';

const routeMap = {
  HOME: '/',
  ABOUT: '/about',
  PRODUCTS: '/products',
  CAPACITY: '/capacity',
  FACTORY: '/factory',
  CONTACT: '/contact',
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
    description: (t) => t.product_header_desc,
    heading: (t) => t.nav_products,
    body: (t) => [t.product_header_desc, t.seo_scope_desc ?? t.product_more_desc],
  },
  {
    page: 'CAPACITY',
    title: (t) => `${t.nav_capacity} | ${t.company_name_en}`,
    description: (t) => t.cap_intro_desc,
    heading: (t) => t.nav_capacity,
    body: (t) => [t.cap_intro_desc, t.cap_mfg_desc, t.cap_qc_desc],
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

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getLocalizedPath = (page, language) => {
  const basePath = routeMap[page];
  if (language === defaultLanguage) {
    return basePath;
  }
  return basePath === '/' ? `/${language}` : `/${language}${basePath}`;
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

const buildAlternateLinks = (page) =>
  Object.keys(localeMap)
    .map((language) => {
      const href = `${siteUrl}${getLocalizedPath(page, language)}`;
      return `<link rel="alternate" hreflang="${language}" href="${href}" />`;
    })
    .concat(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${getLocalizedPath(page, defaultLanguage)}" />`)
    .join('\n    ');

const buildJsonLd = ({ title, canonical, description }) =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: title,
      url: canonical,
      description,
      primaryImageOfPage: ogImage,
    },
    null,
    0
  );

const writeSitemap = (entries) => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries
  .map(
    ({ loc, priority, changefreq }) => `  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
};

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const { languages, translations } = loadTranslations();
const sitemapEntries = [];

for (const language of Object.keys(languages)) {
  const locale = localeMap[language];
  const t = translations[language];

  for (const config of pageConfigs) {
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
      .replace(
        /<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
        `<script id="seo-structured-data" type="application/ld+json">${buildJsonLd({ title, canonical, description })}</script>`
      )
      .replace('</head>', `    ${buildAlternateLinks(config.page)}\n  </head>`)
      .replace('<div id="root"></div>', `${buildStaticContent(heading, body)}\n    <div id="root"></div>`);

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });
    fs.writeFileSync(outputFile, html);
    sitemapEntries.push({
      loc: canonical,
      priority: config.page === 'HOME' ? '1.0' : config.page === 'PRODUCTS' ? '0.9' : '0.8',
      changefreq: config.page === 'PRODUCTS' ? 'weekly' : 'monthly',
    });
  }
}

writeSitemap(sitemapEntries);
console.log(`Generated ${sitemapEntries.length} localized prerendered pages.`);
