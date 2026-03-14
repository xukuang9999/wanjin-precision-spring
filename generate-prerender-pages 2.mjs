import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const indexPath = path.join(distDir, 'index.html');

const siteName = "Wanjin Precision Spring";
const siteUrl = 'https://wanjinspring.com';
const ogImage = `${siteUrl}/factory/factory_1.jpg`;

const pages = [
  {
    route: '/',
    file: 'index.html',
    title: `${siteName} | Precision Industrial Manufacturing`,
    description:
      "Xi'an Wanjin Precision Spring Co., Ltd. manufactures hot coil springs, disc springs, die springs, precision springs, and custom spring components for industrial applications.",
    heading: 'Precision Spring Manufacturing for Industrial Applications',
    body: [
      "Xi'an Wanjin Precision Spring Co., Ltd. supplies hot coil springs, disc springs, stacked disc spring assemblies, die springs, compression springs, extension springs, torsion springs, wave springs, and custom spring forms.",
      'The company supports power equipment, automotive parts, heavy machinery, industrial control, and precision assembly applications, with capabilities including medium-frequency induction hot coiling, CNC forming, grinding, shot peening, magnetic inspection, and load testing.',
    ],
  },
  {
    route: '/about',
    file: 'about/index.html',
    title: `About | ${siteName}`,
    description:
      "Learn about Xi'an Wanjin Precision Spring Co., Ltd., its manufacturing background, factory scale, quality focus, and industrial spring production capabilities.",
    heading: "About Xi'an Wanjin Precision Spring Co., Ltd.",
    body: [
      "Xi'an Wanjin Precision Spring Co., Ltd. focuses on precision spring manufacturing, heavy-duty hot coil spring production, and customized elastic components for industrial customers.",
      'The company serves customers in power equipment, automotive, heavy machinery, and industrial manufacturing, emphasizing reliability, process control, and stable quality delivery.',
    ],
  },
  {
    route: '/products',
    file: 'products/index.html',
    title: `Products | ${siteName}`,
    description:
      'Explore Wanjin Precision Spring products including hot coil springs, disc springs, die springs, compression springs, wave springs, garter springs, flat springs, and custom spring assemblies.',
    heading: 'Industrial Spring Product Range',
    body: [
      'Wanjin Precision Spring offers hot coil springs, disc springs, stacked disc spring assemblies, die springs, compression springs, extension springs, torsion springs, wave springs, retaining rings, contact springs, flat springs, garter springs, power springs, spiral springs, variable force springs, and custom spring products.',
      'Products are used in power systems, heavy equipment, automotive parts, industrial machinery, and engineered assemblies requiring dependable elastic performance.',
    ],
  },
  {
    route: '/capacity',
    file: 'capacity/index.html',
    title: `Manufacturing Capacity | ${siteName}`,
    description:
      'Review Wanjin Precision Spring manufacturing capacity, inspection methods, hot coiling capability, CNC forming, grinding, NDT, and load testing processes.',
    heading: 'Manufacturing Capacity and Quality Control',
    body: [
      'Wanjin operates cold coiling, hot coiling, grinding, inspection, and testing processes for both standard and custom spring production.',
      'Key capabilities include medium-frequency induction hot coiling, precision CNC forming, double-end grinding, shot peening, magnetic particle inspection, and load-displacement testing for industrial spring validation.',
    ],
  },
  {
    route: '/factory',
    file: 'factory/index.html',
    title: `Factory | ${siteName}`,
    description:
      'See Wanjin Precision Spring factory processes, production workflow, quality control checkpoints, and industrial spring manufacturing environment.',
    heading: 'Factory and Production Process',
    body: [
      'The Wanjin factory page presents cold coiling and hot coiling workflows, key process controls, traceability, and inspection practices for industrial spring manufacturing.',
      'It highlights process discipline, quality checkpoints, and the production environment used to support precision and heavy-duty spring applications.',
    ],
  },
  {
    route: '/contact',
    file: 'contact/index.html',
    title: `Contact | ${siteName}`,
    description:
      "Contact Xi'an Wanjin Precision Spring Co., Ltd. for product inquiries, spring customization, manufacturing capability discussions, and project support.",
    heading: 'Contact Wanjin Precision Spring',
    body: [
      'For product inquiries, custom spring development, and manufacturing support, contact Wanjin Precision Spring by email or phone.',
      'The company supports project communication for industrial spring production, application review, and customer-specific delivery requirements.',
    ],
  },
];

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const buildStaticContent = (page) => {
  const paragraphs = page.body.map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  return `
<section id="seo-prerender" data-prerendered="true" style="max-width:960px;margin:0 auto;padding:120px 24px 40px;color:#0f172a;background:#f8fafc;">
  <h1 style="font-size:2.25rem;line-height:1.2;font-weight:700;margin:0 0 20px;">${escapeHtml(page.heading)}</h1>
  <div style="display:grid;gap:16px;color:#475569;font-size:1rem;line-height:1.8;">
    ${paragraphs}
  </div>
</section>
<script>window.addEventListener('DOMContentLoaded',function(){var n=document.getElementById('seo-prerender');if(n){n.remove();}});</script>`;
};

const pageJsonLd = (page) =>
  JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.title,
      url: `${siteUrl}${page.route === '/' ? '/' : page.route}`,
      description: page.description,
      primaryImageOfPage: ogImage,
    },
    null,
    0
  );

const baseHtml = fs.readFileSync(indexPath, 'utf8');

for (const page of pages) {
  const canonical = `${siteUrl}${page.route === '/' ? '/' : page.route}`;
  let html = baseHtml
    .replace(/<title>.*?<\/title>/, `<title>${escapeHtml(page.title)}</title>`)
    .replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${escapeHtml(page.description)}" />`)
    .replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${escapeHtml(canonical)}" />`)
    .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${escapeHtml(page.description)}" />`)
    .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${escapeHtml(canonical)}" />`)
    .replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`)
    .replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${escapeHtml(page.description)}" />`)
    .replace(
      /<script id="seo-structured-data" type="application\/ld\+json">[\s\S]*?<\/script>/,
      `<script id="seo-structured-data" type="application/ld+json">${pageJsonLd(page)}</script>`
    )
    .replace('<div id="root"></div>', `${buildStaticContent(page)}\n    <div id="root"></div>`);

  const outputPath = path.join(distDir, page.file);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, html);
}

console.log(`Generated ${pages.length} prerendered route files.`);
