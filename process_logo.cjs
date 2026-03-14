const Jimp = require('jimp');

async function processLogo() {
  const image = await Jimp.read('public/logo.jpeg');
  
  const counts = {};
  
  image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx];
    const g = this.bitmap.data[idx + 1];
    const b = this.bitmap.data[idx + 2];
    
    // Make white-ish background transparent
    // To cleanly remove jpeg artifacts, we use a broader threshold and a bit of a soft edge.
    // If it's very bright, make fully transparent.
    if (r > 200 && g > 200 && b > 200) {
      if (r > 240 && g > 240 && b > 240) {
        this.bitmap.data[idx + 3] = 0;
      } else {
        // Semi transparent for anti-aliasing edges
        // The closer to 255, the more transparent
        const avg = (r+g+b)/3;
        this.bitmap.data[idx + 3] = Math.max(0, Math.floor((255 - avg) * 2));
      }
    } else {
      // Detect main blue color
      if (b > r && b > g) {
        // Only count solid colors, discarding very dark borders or anti aliased edges
        if (b > 100 && r < 100 && g < 150) {
          // round colors to 10s to group them
           const kr = Math.floor(r/5)*5;
           const kg = Math.floor(g/5)*5;
           const kb = Math.floor(b/5)*5;
           const key = `${kr},${kg},${kb}`;
           counts[key] = (counts[key] || 0) + 1;
        }
      }
    }
  });

  let maxCount = 0;
  let dominant = [30, 58, 138]; // fallback
  for (const [key, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = key.split(',').map(Number);
    }
  }

  const [dr, dg, db] = dominant;
  const hex = `#${dr.toString(16).padStart(2,'0')}${dg.toString(16).padStart(2,'0')}${db.toString(16).padStart(2,'0')}`;
  console.log(`DOMINANT_HEX=${hex}`);
  
  await image.writeAsync('public/logo.png');
}

processLogo().catch(console.error);
