const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, 'utils', 'translations.ts');
let content = fs.readFileSync(targetFile, 'utf8');

const replacements = [
  // Chinese
  { search: /数控成型机/g, replace: '全自动卷簧机' },
  { search: /全自动数控卷簧机/g, replace: '高速自动卷簧机' },
  { search: /数控冷卷/g, replace: '自动冷卷' },
  { search: /自动数控机床/g, replace: '先进自动卷簧设备' },
  { search: /数控加工/g, replace: '自动成型' },
  
  // English
  { search: /CNC Forming Machine/g, replace: 'Automatic Spring Coiling' },
  { search: /Automated CNC coiling/g, replace: 'High-speed automated coiling' },
  { search: /CNC Cold Coiling/g, replace: 'Automatic Cold Coiling' },
  { search: /Auto CNC machines/g, replace: 'Advanced automatic coiling equipment' },
  { search: /CNC formers/g, replace: 'automatic coilers' },
  { search: /'CNC'/g, replace: "'Automatic Coiling'" },
  { search: /CNC machined high-precision metal parts/g, replace: 'High-precision metal parts' },
  { search: /'CNC', 'High Precision'/g, replace: "'Auto Coiling', 'High Precision'" },

  // Spanish
  { search: /formadoras CNC/g, replace: 'enrolladoras automáticas' },
  { search: /'CNC'/g, replace: "'Bobinado Automático'" },
  
  // Arabic
  { search: /ماكينات CNC/g, replace: 'آلات اللف الأوتوماتيكية' },
  { search: /'CNC'/g, replace: "'اللف الأوتوماتيكي'" },

  // Hindi
  { search: /CNC मशीनें/g, replace: 'स्वचालित स्प्रिंग कॉइलिंग मशीनें' },
  { search: /CNC फॉर्मर/g, replace: 'स्वचालित कॉइलर' },
  { search: /'CNC'/g, replace: "'स्वचालित कॉइलिंग'" },

  // Portuguese
  { search: /formadoras CNC/g, replace: 'enroladeiras automáticas' },
  { search: /'CNC'/g, replace: "'Bobinamento Automático'" },

  // Japanese
  { search: /CNCフォーマー/g, replace: '全自動コイリングマシン' },
  { search: /'CNC加工'/g, replace: "'自動成形'" },
  { search: /'CNC'/g, replace: "'自動コイリング'" },

  // German
  { search: /CNC-Formmaschinen/g, replace: 'automatische Federwindemaschinen' },
  { search: /'CNC'/g, replace: "'Automatisches Winden'" },

  // French
  { search: /formeuses CNC/g, replace: 'enrouleuses automatiques' },
  { search: /'CNC'/g, replace: "'Bobinage automatique'" },

  // Russian
  { search: /CNC станок/g, replace: 'автоматический станок для навивки' },
  { search: /'ЧПУ'/g, replace: "'Автоматическая навивка'" },
  { search: /станки с ЧПУ/g, replace: 'автоматические станки' },
];

for (const rep of replacements) {
  content = content.replace(rep.search, rep.replace);
}

fs.writeFileSync(targetFile, content, 'utf8');
console.log('Translations updated.');
