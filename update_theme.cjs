const fs = require('fs');
const path = require('path');

const applyTheme = (content) => {
  let newContent = content;
  
  // Backgrounds
  newContent = newContent.replace(/bg-white/g, 'bg-industrial-900');
  newContent = newContent.replace(/bg-slate-50/g, 'bg-industrial-950');
  newContent = newContent.replace(/bg-slate-100/g, 'bg-industrial-800');
  newContent = newContent.replace(/bg-slate-900/g, 'bg-brand-500');
  newContent = newContent.replace(/bg-slate-800/g, 'bg-brand-600');
  newContent = newContent.replace(/bg-slate-700/g, 'bg-brand-700');
  
  // Texts
  newContent = newContent.replace(/text-slate-900/g, 'text-zinc-100');
  newContent = newContent.replace(/text-slate-800/g, 'text-zinc-200');
  newContent = newContent.replace(/text-slate-700/g, 'text-zinc-300');
  newContent = newContent.replace(/text-slate-600/g, 'text-zinc-400');
  newContent = newContent.replace(/text-slate-500/g, 'text-zinc-400');
  newContent = newContent.replace(/text-slate-400/g, 'text-zinc-500');
  newContent = newContent.replace(/text-blue-600/g, 'text-brand-500');
  newContent = newContent.replace(/text-blue-500/g, 'text-brand-400');
  
  // Hover Backgrounds
  newContent = newContent.replace(/hover:bg-slate-50/g, 'hover:bg-industrial-800');
  newContent = newContent.replace(/hover:bg-slate-100/g, 'hover:bg-industrial-800');
  newContent = newContent.replace(/hover:bg-slate-800/g, 'hover:bg-brand-600');
  
  // Hover Texts
  newContent = newContent.replace(/hover:text-slate-900/g, 'hover:text-brand-400');
  newContent = newContent.replace(/hover:text-blue-600/g, 'hover:text-brand-400');

  // Borders
  newContent = newContent.replace(/border-slate-100/g, 'border-white\/10');
  newContent = newContent.replace(/border-slate-200/g, 'border-white\/20');
  newContent = newContent.replace(/border-slate-300/g, 'border-white\/30');
  newContent = newContent.replace(/border-slate-900/g, 'border-brand-500');
  
  // Rounding 
  newContent = newContent.replace(/rounded-2xl/g, 'rounded-sm');
  newContent = newContent.replace(/rounded-xl/g, 'rounded-sm');
  newContent = newContent.replace(/rounded-lg/g, 'rounded-sm');
  newContent = newContent.replace(/rounded-full/g, 'rounded-md'); 

  // Shadow
  newContent = newContent.replace(/shadow-xl/g, 'shadow-2xl shadow-black\/50');
  newContent = newContent.replace(/shadow-lg/g, 'shadow-lg shadow-black\/40');

  return newContent;
};

const processDirectory = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        processDirectory(fullPath);
      }
    } else if (fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = applyTheme(content);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
};

processDirectory(__dirname);
