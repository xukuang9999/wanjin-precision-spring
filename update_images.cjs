const fs = require('fs');
const path = require('path');

const replacement = `const IND_PICS = [
  '1581091226825-a6a2a5aee158', '1504328345606-18bbc8c9d7d1', '1530635334692-72304856f6c9', 
  '1565514020179-026fbcdc7a63', '1587295143322-d7bfaece2637', '1516937941344-00b4eaf3a3d5',
  '1579781442004-6316719aaadc', '1496247749665-49cf5b1022e9'
];
const px = (id: string, w = 800, h = 600) => {
  const hash = Array.from(id).reduce((s,c)=>s+c.charCodeAt(0),0);
  return \`https://images.unsplash.com/photo-\${IND_PICS[hash % IND_PICS.length]}?auto=format&fit=crop&w=\${w}&h=\${h}&q=80\`;
};
const ux = px;`;

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const pexelsRegex = /const px = \(id: string, w = 800, h = 600\) =>[\s\S]*?`https:\/\/images\.unsplash\.com\/photo-\$\{id\}\?auto=format&fit=crop&w=\$\{w\}&q=80`;/m;
      
      if (pexelsRegex.test(content)) {
        content = content.replace(pexelsRegex, replacement);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated images in ${fullPath}`);
      }
    }
  }
};

processDirectory(__dirname);
