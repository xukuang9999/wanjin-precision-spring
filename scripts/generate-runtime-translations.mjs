import fs from 'fs';
import path from 'path';
import vm from 'vm';

const translationsSourcePath = path.resolve('utils/translations.ts');
const outputDir = path.resolve('utils/runtime-translations');

const source = fs.readFileSync(translationsSourcePath, 'utf8');
const executable = source
  .replace(/export type[\s\S]*?;\n\n/, '')
  .replace(/export const LANGUAGES\s*:\s*[^=]+=/, 'const LANGUAGES =')
  .replace(/export const FULLY_LOCALIZED_LANGUAGES\s*=\s*[\s\S]*?as const;\n\n/, '')
  .replace(/export const TRANSLATIONS\s*:\s*[^=]+=/, 'const TRANSLATIONS =')
  .concat('\nthis.TRANSLATIONS = TRANSLATIONS;');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(executable, sandbox);

const translations = sandbox.TRANSLATIONS;

if (!translations || typeof translations !== 'object') {
  throw new Error('Could not extract TRANSLATIONS from utils/translations.ts');
}

fs.mkdirSync(outputDir, { recursive: true });

for (const [language, dictionary] of Object.entries(translations)) {
  const filePath = path.join(outputDir, `${language}.ts`);
  const fileContent = `const translations = ${JSON.stringify(dictionary, null, 2)} as const;\n\nexport default translations;\n`;
  fs.writeFileSync(filePath, fileContent);
}

console.log(`Generated ${Object.keys(translations).length} runtime translation files in ${outputDir}`);
