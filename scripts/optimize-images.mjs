import { promises as fs } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT_DIR = path.resolve('public');
const TARGET_DIRS = ['factory', 'products'].map((segment) => path.join(ROOT_DIR, segment));
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);

const walk = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
      continue;
    }

    if (entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
};

const getWebpOptions = (inputPath) => {
  const lowerName = path.basename(inputPath).toLowerCase();

  if (lowerName.includes('qr') || lowerName.includes('logo')) {
    return { lossless: true, effort: 5 };
  }

  return { quality: 82, effort: 5 };
};

const getAvifOptions = (inputPath) => {
  const lowerName = path.basename(inputPath).toLowerCase();

  if (lowerName.includes('qr') || lowerName.includes('logo')) {
    return { lossless: true, effort: 5 };
  }

  return { quality: 60, effort: 5 };
};

const optimizeImage = async (inputPath) => {
  const webpPath = inputPath.replace(/\.(jpe?g|png)$/i, '.webp');
  const avifPath = inputPath.replace(/\.(jpe?g|png)$/i, '.avif');

  await Promise.all([
    sharp(inputPath)
      .rotate()
      .webp(getWebpOptions(inputPath))
      .toFile(webpPath),
    sharp(inputPath)
      .rotate()
      .avif(getAvifOptions(inputPath))
      .toFile(avifPath),
  ]);

  const [inputStat, webpStat, avifStat] = await Promise.all([
    fs.stat(inputPath),
    fs.stat(webpPath),
    fs.stat(avifPath),
  ]);

  return {
    inputPath,
    inputBytes: inputStat.size,
    outputBytes: webpStat.size + avifStat.size,
  };
};

const files = (await Promise.all(TARGET_DIRS.map((targetDir) => walk(targetDir)))).flat();
const results = await Promise.all(files.map((filePath) => optimizeImage(filePath)));

const totals = results.reduce(
  (accumulator, result) => ({
    inputBytes: accumulator.inputBytes + result.inputBytes,
    outputBytes: accumulator.outputBytes + result.outputBytes,
  }),
  { inputBytes: 0, outputBytes: 0 },
);

console.log(
  `Generated ${results.length} AVIF/WebP image pairs. ` +
    `Input: ${(totals.inputBytes / 1024 / 1024).toFixed(2)} MB, ` +
    `Output: ${(totals.outputBytes / 1024 / 1024).toFixed(2)} MB.`,
);
