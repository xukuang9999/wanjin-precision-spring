import { promises as fs } from 'node:fs';
import path from 'node:path';

const DIST_DIR = path.resolve('dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');
const RUNTIME_MANIFEST = path.join(DIST_DIR, 'app-runtime', 'runtime-manifest.json');

const LEGACY_JS_ASSETS = [
  'index-DtaQAqE7.js',
  'index-Dg12Wp2r.js',
  'index-CGqx82_M.js',
  'index-BF59a-vn.js',
];

const LEGACY_CSS_ASSETS = [
  'index-CryzxaLD.css',
  'style-CFFk4RMx.css',
  'style-ByAJHlIG.css',
  'index-EZGPdeGX.css',
  'style-BiAJpmb5.css',
];

const { runtimeUrl } = JSON.parse(await fs.readFile(RUNTIME_MANIFEST, 'utf8'));

const legacyRuntimeBridge = `(() => {
  const runtimeUrl = ${JSON.stringify(runtimeUrl)};

  const ensureRuntime = () => {
    if (window.__wanjinRuntimePromise) {
      return window.__wanjinRuntimePromise;
    }

    window.__wanjinRuntimePromise = fetch(runtimeUrl, {
      credentials: 'same-origin',
      cache: 'no-store',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(\`Failed to load app runtime: \${response.status}\`);
        }
        return response.text();
      })
      .then((runtimeHtml) => {
        const runtimeDocument = new DOMParser().parseFromString(runtimeHtml, 'text/html');
        const styleSource = runtimeDocument.getElementById('wanjin-runtime-style');
        const scriptSource = runtimeDocument.getElementById('wanjin-runtime-script');

        if (!styleSource || !scriptSource) {
          throw new Error('Runtime bundle markers are missing.');
        }

        if (!document.getElementById('wanjin-runtime-style')) {
          const style = document.createElement('style');
          style.id = 'wanjin-runtime-style';
          style.textContent = styleSource.textContent || '';
          document.head.appendChild(style);
        }

        if (!document.getElementById('wanjin-runtime-script')) {
          const script = document.createElement('script');
          script.id = 'wanjin-runtime-script';
          script.type = 'module';
          script.textContent = scriptSource.textContent || '';
          document.head.appendChild(script);
        }
      })
      .catch((error) => {
        console.error('[wanjin-runtime-legacy]', error);
      });

    return window.__wanjinRuntimePromise;
  };

  window.__wanjinEnsureRuntime = ensureRuntime;
  ensureRuntime();
})();`;

const legacyCssStub = [
  'html,body{margin:0;min-height:100%;background:#f8fafc;color:#0f172a}',
  '#root{min-height:100vh}',
].join('');

await fs.mkdir(ASSETS_DIR, { recursive: true });

await Promise.all([
  ...LEGACY_JS_ASSETS.map((name) =>
    fs.writeFile(path.join(ASSETS_DIR, name), legacyRuntimeBridge),
  ),
  ...LEGACY_CSS_ASSETS.map((name) =>
    fs.writeFile(path.join(ASSETS_DIR, name), legacyCssStub),
  ),
]);

console.log(
  `Generated ${LEGACY_JS_ASSETS.length} legacy JS bridges and ${LEGACY_CSS_ASSETS.length} legacy CSS stubs.`,
);
