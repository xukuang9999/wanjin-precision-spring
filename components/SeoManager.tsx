import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEFAULT_LANGUAGE, getLocalizedPath, PageView } from '../types';
import { Language, LANGUAGES } from '../utils/translations';

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
};

const setMeta = (selector: string, attribute: 'content' | 'href', value: string) => {
  const node = document.head.querySelector(selector);
  if (node) {
    node.setAttribute(attribute, value);
  }
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

export const SeoManager: React.FC<SeoManagerProps> = ({ currentPage }) => {
  const { language, t } = useLanguage();

  useEffect(() => {
    const pageMap: Record<PageView, { title: string; description: string }> = {
      [PageView.HOME]: {
        title: `${t('company_name_en')} | ${t('hero_title')}`,
        description: t('hero_desc'),
      },
      [PageView.ABOUT]: {
        title: `${t('about_title')} | ${t('company_name_en')}`,
        description: t('about_desc'),
      },
      [PageView.PRODUCTS]: {
        title: `${t('nav_products')} | ${t('company_name_en')}`,
        description: t('product_header_desc'),
      },
      [PageView.CAPACITY]: {
        title: `${t('nav_capacity')} | ${t('company_name_en')}`,
        description: t('cap_intro_desc'),
      },
      [PageView.FACTORY]: {
        title: `${t('nav_factory')} | ${t('company_name_en')}`,
        description: t('factory_desc'),
      },
      [PageView.CONTACT]: {
        title: `${t('nav_contact')} | ${t('company_name_en')}`,
        description: t('email_us_desc'),
      },
    };

    const pageSeo = pageMap[currentPage];
    const pagePath = getLocalizedPath(currentPage, language);
    const pageUrl = `${SITE_URL}${pagePath}`;
    const locale = language === 'zh' ? 'zh_CN' : language === 'ja' ? 'ja_JP' : language === 'de' ? 'de_DE' : language === 'fr' ? 'fr_FR' : language === 'es' ? 'es_ES' : language === 'pt' ? 'pt_BR' : language === 'ru' ? 'ru_RU' : language === 'ar' ? 'ar_AR' : language === 'hi' ? 'hi_IN' : 'en_US';

    document.title = pageSeo.title;
    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';

    setMeta('meta[name="description"]', 'content', pageSeo.description);
    setMeta('meta[property="og:title"]', 'content', pageSeo.title);
    setMeta('meta[property="og:description"]', 'content', pageSeo.description);
    setMeta('meta[property="og:url"]', 'content', pageUrl);
    setMeta('meta[property="og:locale"]', 'content', locale);
    setMeta('meta[name="twitter:title"]', 'content', pageSeo.title);
    setMeta('meta[name="twitter:description"]', 'content', pageSeo.description);
    setMeta('link[rel="canonical"]', 'href', pageUrl);

    (Object.keys(LANGUAGES) as Language[]).forEach((lang) => {
      const href = `${SITE_URL}${getLocalizedPath(currentPage, lang)}`;
      ensureAltLink(lang, href);
    });
    ensureAltLink('x-default', `${SITE_URL}${getLocalizedPath(currentPage, DEFAULT_LANGUAGE)}`);

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
    };

    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: pageSeo.title,
      url: pageUrl,
      inLanguage: language,
      description: pageSeo.description,
      isPartOf: {
        '@type': 'WebSite',
        name: t('company_name_en'),
        url: SITE_URL,
      },
    };

    const pageSpecificSchema =
      currentPage === PageView.PRODUCTS
        ? {
            '@context': 'https://schema.org',
            '@type': 'OfferCatalog',
            name: `${t('company_name_en')} Product Catalog`,
            itemListElement: PAGE_PRODUCT_KEYS.map((key, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              item: {
                '@type': 'Product',
                name: t(key),
                category: t('nav_products'),
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

    const schemaTag = document.getElementById('seo-structured-data');
    if (schemaTag) {
      schemaTag.textContent = JSON.stringify([commonOrg, websiteSchema, webPageSchema, pageSpecificSchema, faqSchema].filter(Boolean));
    }
  }, [currentPage, language, t]);

  return null;
};
