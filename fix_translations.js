const fs = require('fs');
const file = 'utils/translations.ts';
let content = fs.readFileSync(file, 'utf8');

// R&D
content = content.replace(/Focusing on R&D and manufacturing/g, 'Focusing on manufacturing');
content = content.replace(/专注于精密弹簧的研发与制造/g, '专注于精密弹簧的制造');
content = content.replace(/Enfocados en I\+D y fabricación/g, 'Enfocados en la fabricación');
content = content.replace(/Focando em P&D e fabricação/g, 'Focando na fabricação');
content = content.replace(/Fokus auf F&E und Herstellung/g, 'Fokus auf die Herstellung');
content = content.replace(/Axé sur la R&D et la fabrication/g, 'Axé sur la fabrication');

// Exporting
content = content.replace(/ — exporting to US, Canada, Germany, Australia, South Korea & Brazil\./g, '.');
content = content.replace(/ Exporting to US, Germany, Canada, Australia, South Korea & Brazil\./g, '');
content = content.replace(/ Exporta a EE\.UU\., Canadá, Alemania, Australia, Corea y Brasil\./g, '');
content = content.replace(/ Exportaciones a EE\.UU\., Alemania, Canadá, Australia, Corea del Sur y Brasil\./g, '');
content = content.replace(/ Exportações para EUA, Canadá, Alemanha, Austrália, Coreia e Brasil\./g, '');
content = content.replace(/ Exportando para EUA, Alemanha, Canadá, Austrália, Coreia do Sul e Brasil\./g, '');
content = content.replace(/ Export in USA, Kanada, Deutschland, Australien, Südkorea und Brasilien\./g, '');
content = content.replace(/ Export in USA, Deutschland, Kanada, Australien, Südkorea und Brasilien\./g, '');
content = content.replace(/ Export vers USA, Canada, Allemagne, Australie, Corée du Sud et Brésil\./g, '');
content = content.replace(/ Export vers USA, Allemagne, Canada, Australie, Corée du Sud et Brésil\./g, '');
content = content.replace(/出口美国、德国、加拿大、澳大利亚、韩国以及巴西等国家。/g, '');
content = content.replace(/并出口美国、加拿大、德国、澳大利亚、韩国及巴西等国家。/g, '');


fs.writeFileSync(file, content);
