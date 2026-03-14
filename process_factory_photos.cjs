const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

const inputDir = path.join(__dirname, '..', 'Factory Floor');
const outputDir = path.join(__dirname, 'public', 'factory');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function processPhotos() {
  const files = fs.readdirSync(inputDir).filter(f => f.match(/\.(jpg|jpeg|png)$/i));
  
  let i = 1;
  for (const file of files) {
    console.log(`Processing ${file}...`);
    try {
      const img = await Jimp.read(path.join(inputDir, file));
      
      // Auto enhance to ensure highest quality presentation
      img.normalize() // normalizes the color channels
         .contrast(0.1) // slight contrast boost
         .quality(90); // high quality JPEG

      const targetPath = path.join(outputDir, `factory_${i}.jpg`);
      await img.writeAsync(targetPath);
      console.log(`Saved as factory_${i}.jpg`);
      i++;
    } catch (e) {
      console.log(`Failed to process ${file}:`, e.message);
    }
  }
}

processPhotos().then(() => console.log('Done'));
