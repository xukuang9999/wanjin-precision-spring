import crypto from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';

const DIST_DIR = path.resolve(process.cwd(), 'dist');
const RUNTIME_SEGMENT = 'app-runtime';
const RUNTIME_ROUTE = `/${RUNTIME_SEGMENT}/`;
const RUNTIME_STYLE_ID = 'wanjin-runtime-style';
const RUNTIME_SCRIPT_ID = 'wanjin-runtime-script';
const RUNTIME_CSS_PATH = `${RUNTIME_ROUTE}runtime.css`;
const RUNTIME_JS_PATH = `${RUNTIME_ROUTE}runtime.js`;
const RUNTIME_MANIFEST_PATH = path.join(DIST_DIR, RUNTIME_SEGMENT, 'runtime-manifest.json');

const getAssetRefs = (html) => {
  const stylesheetHrefs = Array.from(
    html.matchAll(
      /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']*\/assets\/[^"']+\.css(?:\?[^"']*)?)["'][^>]*>/gi,
    ),
    (match) => match[1],
  );
  const modulePreloadHrefs = Array.from(
    html.matchAll(
      /<link\b[^>]*rel=["']modulepreload["'][^>]*href=["']([^"']*\/assets\/[^"']+\.js(?:\?[^"']*)?)["'][^>]*>/gi,
    ),
    (match) => match[1],
  );
  const entryScriptSrc = html.match(
    /<script\b[^>]*src=["']([^"']*\/assets\/[^"']+\.js(?:\?[^"']*)?)["'][^>]*><\/script>/i,
  )?.[1];

  if (!entryScriptSrc) {
    throw new Error('Could not locate the built entry JS asset reference in dist/index.html.');
  }

  return {
    stylesheetHrefs,
    modulePreloadHrefs,
    entryScriptSrc,
  };
};

const stripAssetTags = (html) =>
  html
    .replace(
      new RegExp(`<link\\b[^>]*rel=["']modulepreload["'][^>]*href=["']${RUNTIME_JS_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'][^>]*>\\s*`, 'gi'),
      '',
    )
    .replace(
      new RegExp(`<link\\b[^>]*rel=["']stylesheet["'][^>]*href=["']${RUNTIME_CSS_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'][^>]*>\\s*`, 'gi'),
      '',
    )
    .replace(
      new RegExp(`<script\\b[^>]*src=["']${RUNTIME_JS_PATH.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'][^>]*><\\/script>\\s*`, 'gi'),
      '',
    )
    .replace(
      /<link\b[^>]*rel=["']modulepreload["'][^>]*href=["'][^"']*\/assets\/[^"']+["'][^>]*>\s*/gi,
      '',
    )
    .replace(
      /<link\b[^>]*rel=["']stylesheet["'][^>]*href=["'][^"']*\/assets\/[^"']+\.css(?:\?[^"']*)?["'][^>]*>\s*/gi,
      '',
    )
    .replace(
      /<script\b[^>]*src=["'][^"']*\/assets\/[^"']+\.js(?:\?[^"']*)?["'][^>]*><\/script>\s*/gi,
      '',
    );

const injectBeforeHeadClose = (html, content) => {
  if (/<\/head>/i.test(html)) {
    return html.replace(/<\/head>/i, `${content}\n</head>`);
  }

  return `${html}\n${content}`;
};

const injectBeforeBodyClose = (html, content) => {
  if (/<\/body>/i.test(html)) {
    return html.replace(/<\/body>/i, `${content}\n</body>`);
  }

  return `${html}\n${content}`;
};

const buildRuntimeCssProxy = (stylesheetHrefs) =>
  stylesheetHrefs.map((href) => `@import url(${JSON.stringify(href)});`).join('\n');

const buildRuntimeJsProxy = (modulePreloadHrefs, entryScriptSrc) => {
  const preloadStatements = modulePreloadHrefs.map((href) => {
    return `(() => {
  const href = ${JSON.stringify(href)};
  const selector = 'link[rel="modulepreload"][href="' + href.replace(/"/g, '\\"') + '"]';
  if (document.head.querySelector(selector)) {
    return;
  }
  const preload = document.createElement('link');
  preload.rel = 'modulepreload';
  preload.href = href;
  preload.crossOrigin = '';
  document.head.appendChild(preload);
})();`;
  });

  return `${preloadStatements.join('\n')}
import ${JSON.stringify(entryScriptSrc)};`.trim();
};

const buildRuntimeHtmlStyleMarker = (runtimeCssUrl) =>
  `  <style id="${RUNTIME_STYLE_ID}">\n@import url(${JSON.stringify(runtimeCssUrl)});\n  </style>`;

const buildRuntimeHtmlScriptMarker = (runtimeJsUrl) =>
  `  <script type="module" id="${RUNTIME_SCRIPT_ID}">\nimport ${JSON.stringify(runtimeJsUrl)};\n  </script>`;

const buildPublicHeadTags = (runtimeCssUrl, runtimeJsUrl) =>
  `  <link rel="modulepreload" href="${runtimeJsUrl}" crossorigin>\n  <link rel="stylesheet" href="${runtimeCssUrl}">`;

const buildPublicBodyTag = (runtimeJsUrl) =>
  `  <script type="module" src="${runtimeJsUrl}" crossorigin></script>`;

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
};

const mainHtmlPath = path.join(DIST_DIR, 'index.html');
const mainHtml = await fs.readFile(mainHtmlPath, 'utf8');
const { stylesheetHrefs, modulePreloadHrefs, entryScriptSrc } = getAssetRefs(mainHtml);
const runtimeVersion = crypto
  .createHash('md5')
  .update(JSON.stringify(stylesheetHrefs))
  .update(JSON.stringify(modulePreloadHrefs))
  .update(entryScriptSrc)
  .digest('hex')
  .slice(0, 12);
const runtimeHtmlPath = path.join(DIST_DIR, RUNTIME_SEGMENT, 'index.html');
const runtimeCssProxyPath = path.join(DIST_DIR, RUNTIME_SEGMENT, 'runtime.css');
const runtimeJsProxyPath = path.join(DIST_DIR, RUNTIME_SEGMENT, 'runtime.js');
const runtimeUrl = `${RUNTIME_ROUTE}?v=${runtimeVersion}`;
const runtimeCssUrl = `${RUNTIME_CSS_PATH}?v=${runtimeVersion}`;
const runtimeJsUrl = `${RUNTIME_JS_PATH}?v=${runtimeVersion}`;

// Rebuild the runtime bridge from a clean state so repeated deploys don't
// re-process an older app-runtime directory and inject nested loaders.
await fs.rm(path.join(DIST_DIR, RUNTIME_SEGMENT), { recursive: true, force: true });

const htmlFiles = await walk(DIST_DIR);

let runtimeHtml = stripAssetTags(mainHtml);
runtimeHtml = injectBeforeHeadClose(
  runtimeHtml,
  `  <meta name="robots" content="noindex,nofollow" />\n${buildRuntimeHtmlStyleMarker(runtimeCssUrl)}`,
);
runtimeHtml = injectBeforeBodyClose(runtimeHtml, buildRuntimeHtmlScriptMarker(runtimeJsUrl));

await fs.mkdir(path.dirname(runtimeHtmlPath), { recursive: true });
await fs.writeFile(runtimeHtmlPath, runtimeHtml);
await fs.writeFile(runtimeCssProxyPath, buildRuntimeCssProxy(stylesheetHrefs));
await fs.writeFile(runtimeJsProxyPath, buildRuntimeJsProxy(modulePreloadHrefs, entryScriptSrc));
await fs.writeFile(
  RUNTIME_MANIFEST_PATH,
  JSON.stringify(
    {
      runtimeUrl,
      runtimeCssUrl,
      runtimeJsUrl,
      stylesheetHrefs,
      modulePreloadHrefs,
      entryScriptSrc,
      version: runtimeVersion,
    },
    null,
    2,
  ),
);

for (const htmlPath of htmlFiles) {
  let html = await fs.readFile(htmlPath, 'utf8');
  html = stripAssetTags(html);
  html = injectBeforeHeadClose(html, buildPublicHeadTags(runtimeCssUrl, runtimeJsUrl));
  html = injectBeforeBodyClose(html, buildPublicBodyTag(runtimeJsUrl));
  await fs.writeFile(htmlPath, html);
}

console.log(`Prepared HTML runtime bridge for ${htmlFiles.length} public HTML files.`);
