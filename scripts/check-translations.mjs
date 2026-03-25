import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const translationFile = path.join(projectRoot, 'utils', 'translations.ts');
const blogFile = path.join(projectRoot, 'data', 'blog', 'content.ts');
const SOURCE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const TRANSLATION_KEY_PATTERN = /^[a-z][a-z0-9]*(?:_[a-z0-9]+)+$/;

const SAFE_IDENTICAL_KEYS = new Set([
  'company_name',
  'company_name_en',
  'company_name_full',
  'phone_val',
  'address_val',
  'location_val_short',
  'home_keyword_1_title',
  'home_keyword_2_title',
  'home_keyword_3_title',
  'home_keyword_4_title',
  'home_keyword_5_title',
  'home_keyword_6_title',
]);

const HOTSPOT_CHECKS = [
  {
    label: 'Hardcoded product helper copy',
    file: 'pages/Products.tsx',
    patterns: [
      'Application fit:',
      'Manufacturing route:',
      'Validation scope:',
      'programs are usually evaluated',
      'Typical project conversations',
      'For teams sourcing into',
    ],
  },
  {
    label: 'Inline blog copy limited to zh/ru/en branches',
    file: 'pages/Blog.tsx',
    patterns: [
      'Buyer Decision Guides',
      'Technical Discussions',
      'Application Selection',
      'Common Buyer Questions',
      'Key Takeaways',
      'Buyer Checklist',
    ],
  },
  {
    label: 'English-only product SEO profiles',
    file: 'utils/productSeo.ts',
    patterns: [
      'Custom Compression Spring Manufacturer',
      'Custom Extension Spring Manufacturer',
      'Torsion spring programs are usually evaluated',
      'Power spring programs are usually evaluated',
    ],
  },
  {
    label: 'Prerendered product checklist copy is English-only',
    file: 'generate-prerender-pages.mjs',
    patterns: ['Application fit:', 'Manufacturing route:', 'Validation scope:'],
  },
];

function loadTranslations() {
  let source = fs.readFileSync(translationFile, 'utf8');
  source = source.replace(/export type Language =[^;]+;\n\n/, '');
  source = source.replace(/export const FULLY_LOCALIZED_LANGUAGES\s*=\s*/, 'const FULLY_LOCALIZED_LANGUAGES = ');
  source = source.replace(/ as const;/g, ';');
  source = source.replace(/export const LANGUAGES\s*:\s*[^=]+=/, 'const LANGUAGES =');
  source = source.replace(/export const TRANSLATIONS\s*:\s*[^=]+=/, 'const TRANSLATIONS =');
  source += '\nthis.LANGUAGES = LANGUAGES; this.FULLY_LOCALIZED_LANGUAGES = FULLY_LOCALIZED_LANGUAGES; this.TRANSLATIONS = TRANSLATIONS;';
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return {
    languages: sandbox.LANGUAGES,
    fullyLocalizedLanguages: sandbox.FULLY_LOCALIZED_LANGUAGES,
    translations: sandbox.TRANSLATIONS,
  };
}

function loadBlogPosts() {
  let source = fs.readFileSync(blogFile, 'utf8');
  source = source.replace(/export const BLOG_POSTS =/, 'const BLOG_POSTS =');
  source += '\nthis.BLOG_POSTS = BLOG_POSTS;';
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  return sandbox.BLOG_POSTS;
}

function isSafeIdenticalKey(key, value) {
  if (SAFE_IDENTICAL_KEYS.has(key)) {
    return true;
  }

  if (/_value$/.test(key)) {
    return true;
  }

  if (!/[A-Za-z]/.test(value)) {
    return true;
  }

  if (/^(ISO|GB|JIS|OEM|NDT|MPI|WeChat|Wanjin|Xi'an|\+?\d)/.test(value)) {
    return true;
  }

  return false;
}

function collectLocaleReport(languages, strictLanguages, translations) {
  const supportedLanguages = Object.keys(languages);
  const baseKeys = Object.keys(translations.en);
  const report = [];

  for (const language of supportedLanguages) {
    const values = translations[language];
    const keys = Object.keys(values);
    const missing = baseKeys.filter((key) => !(key in values));
    const extra = keys.filter((key) => !(key in translations.en));
    const sameAsEnglish = keys.filter((key) => values[key] === translations.en[key]);
    const suspiciousSameAsEnglish =
      language === 'en' ? [] : sameAsEnglish.filter((key) => !isSafeIdenticalKey(key, values[key]));

    report.push({
      language,
      strict: strictLanguages.includes(language),
      total: keys.length,
      missing,
      extra,
      suspiciousSameAsEnglish,
    });
  }

  return report;
}

function collectBlogCoverage(languages, strictLanguages, posts) {
  const blogFields = ['title', 'excerpt', 'seoTitle', 'seoDescription', 'content', 'takeaways', 'checklist'];

  return Object.keys(languages).map((language) => {
    const missingByField = {};

    for (const field of blogFields) {
      const missingPosts = posts
        .filter((post) => post[field] && !(language in post[field]))
        .map((post) => post.slug);

      if (missingPosts.length > 0) {
        missingByField[field] = missingPosts;
      }
    }

    return {
      language,
      strict: strictLanguages.includes(language),
      missingByField,
    };
  });
}

function collectHotspots() {
  return HOTSPOT_CHECKS.map((check) => {
    const absolutePath = path.join(projectRoot, check.file);
    const lines = fs.readFileSync(absolutePath, 'utf8').split('\n');
    const matches = [];

    lines.forEach((line, index) => {
      if (check.patterns.some((pattern) => line.includes(pattern))) {
        matches.push({
          line: index + 1,
          snippet: line.trim(),
        });
      }
    });

    return {
      ...check,
      absolutePath,
      matches,
    };
  });
}

function getScriptKind(filePath) {
  const extension = path.extname(filePath);

  switch (extension) {
    case '.tsx':
      return ts.ScriptKind.TSX;
    case '.ts':
      return ts.ScriptKind.TS;
    case '.jsx':
      return ts.ScriptKind.JSX;
    case '.js':
    case '.mjs':
      return ts.ScriptKind.JS;
    default:
      return ts.ScriptKind.Unknown;
  }
}

function walkSourceFiles(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === 'dist') {
      continue;
    }

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walkSourceFiles(fullPath, files);
      continue;
    }

    if (SOURCE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }

  return files;
}

function getPropertyName(nameNode) {
  if (ts.isIdentifier(nameNode) || ts.isStringLiteralLike(nameNode) || ts.isNoSubstitutionTemplateLiteral(nameNode)) {
    return nameNode.text;
  }

  return undefined;
}

function isTranslationReference(node) {
  const parent = node.parent;

  if (ts.isCallExpression(parent) && ts.isIdentifier(parent.expression) && parent.expression.text === 't' && parent.arguments[0] === node) {
    return true;
  }

  if (ts.isPropertyAssignment(parent)) {
    const propertyName = getPropertyName(parent.name);

    if (propertyName === 'key' || propertyName?.endsWith('Key')) {
      return true;
    }
  }

  if (ts.isArrayLiteralExpression(parent)) {
    return parent.elements.length > 0 && parent.elements.every((element) => {
      if (!ts.isStringLiteralLike(element) && !ts.isNoSubstitutionTemplateLiteral(element)) {
        return false;
      }

      return TRANSLATION_KEY_PATTERN.test(element.text.trim());
    });
  }

  return false;
}

function collectReferencedTranslationKeys(baseKeys) {
  const baseKeySet = new Set(baseKeys);
  const referenceMap = new Map();
  const missingReferences = [];

  for (const filePath of walkSourceFiles(projectRoot)) {
    const sourceText = fs.readFileSync(filePath, 'utf8');
    const sourceFile = ts.createSourceFile(
      filePath,
      sourceText,
      ts.ScriptTarget.Latest,
      true,
      getScriptKind(filePath)
    );

    const visit = (node) => {
      if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
        const value = node.text.trim();

        if (TRANSLATION_KEY_PATTERN.test(value) && isTranslationReference(node)) {
          const relativePath = path.relative(projectRoot, filePath);
          const position = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
          const existing = referenceMap.get(value) ?? [];

          existing.push({
            file: relativePath,
            line: position.line + 1,
          });
          referenceMap.set(value, existing);

          if (!baseKeySet.has(value)) {
            missingReferences.push({
              key: value,
              file: relativePath,
              line: position.line + 1,
            });
          }
        }
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);
  }

  return {
    totalReferencedKeys: referenceMap.size,
    missingReferences,
  };
}

function printSection(title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(title.length));
}

function main() {
  const { languages, fullyLocalizedLanguages, translations } = loadTranslations();
  const posts = loadBlogPosts();
  const strictLanguages = fullyLocalizedLanguages ?? ['zh', 'en', 'ru'];
  const localeReport = collectLocaleReport(languages, strictLanguages, translations);
  const blogCoverage = collectBlogCoverage(languages, strictLanguages, posts);
  const hotspots = collectHotspots();
  const translationReferenceReport = collectReferencedTranslationKeys(Object.keys(translations.en));

  let hasIssues = false;

  printSection('Translation Key Coverage');
  for (const locale of localeReport) {
    const parts = [`${locale.language}: ${locale.total} keys`];

    if (locale.missing.length > 0) {
      parts.push(`${locale.strict ? 'missing' : 'fallback-missing'} ${locale.missing.length}`);
      hasIssues = hasIssues || locale.strict;
    }

    if (locale.extra.length > 0) {
      parts.push(`extra ${locale.extra.length}`);
      hasIssues = hasIssues || locale.strict;
    }

    if (locale.suspiciousSameAsEnglish.length > 0) {
      parts.push(`${locale.strict ? 'same-as-en' : 'fallback-same-as-en'} ${locale.suspiciousSameAsEnglish.length}`);
      hasIssues = hasIssues || locale.strict;
    }

    console.log(parts.join(' | '));

    if (locale.missing.length > 0) {
      console.log(`  missing sample: ${locale.missing.slice(0, 8).join(', ')}`);
    }

    if (locale.suspiciousSameAsEnglish.length > 0) {
      console.log(`  same-as-en sample: ${locale.suspiciousSameAsEnglish.slice(0, 8).join(', ')}`);
    }
  }

  printSection('Blog Locale Coverage');
  for (const locale of blogCoverage) {
    const fields = Object.entries(locale.missingByField);
    if (fields.length === 0) {
      console.log(`${locale.language}: complete`);
      continue;
    }

    const summary = fields.map(([field, slugs]) => `${field} ${slugs.length}`).join(' | ');
    console.log(`${locale.language}: ${locale.strict ? summary : `fallback ${summary}`}`);
    hasIssues = hasIssues || locale.strict;
  }

  printSection('Hardcoded Copy Hotspots');
  for (const hotspot of hotspots) {
    if (hotspot.matches.length === 0) {
      console.log(`${hotspot.label}: clean`);
      continue;
    }

    hasIssues = true;
    console.log(`${hotspot.label}: ${hotspot.file}`);
    hotspot.matches.slice(0, 6).forEach((match) => {
      console.log(`  L${match.line}: ${match.snippet}`);
    });
  }

  printSection('Translation Reference Coverage');
  if (translationReferenceReport.missingReferences.length === 0) {
    console.log(`Referenced translation keys: ${translationReferenceReport.totalReferencedKeys} | missing: 0`);
  } else {
    hasIssues = true;
    console.log(
      `Referenced translation keys: ${translationReferenceReport.totalReferencedKeys} | missing: ${translationReferenceReport.missingReferences.length}`
    );
    translationReferenceReport.missingReferences.slice(0, 12).forEach((reference) => {
      console.log(`  ${reference.key} -> ${reference.file}:L${reference.line}`);
    });
  }

  if (hasIssues) {
    console.error('\nTranslation audit found issues.');
    process.exitCode = 1;
    return;
  }

  console.log('\nTranslation audit passed.');
}

main();
