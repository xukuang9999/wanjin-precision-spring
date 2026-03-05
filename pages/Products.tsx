import React, { useState } from 'react';
import { Product } from '../types';
import { AIImage } from '../components/AIImage';
import { Search, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
const ux = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const PRODUCT_DATA: Product[] = [
  {
    id: '1',
    name: '碟形弹簧 (Disc Springs)',
    category: 'Precision',
    description: 'High load capacity, short stroke. Used in heavy machinery and power equipment buffers.',
    features: ['High Load', 'Long Life', 'Compact'],
    imagePrompt: 'Macro photography of high-quality industrial disc springs (Belleville washers) stacked precisely, polished stainless steel material, cinematic lighting, 8k resolution, clean background',
    fallbackSrc: px('14452000', 400, 300)
  },
  {
    id: '2',
    name: '热卷弹簧 (Hot Coil Springs)',
    category: 'Heavy',
    description: 'Hot coiled for large wire diameters. Used in engineering machinery and railway vehicles.',
    features: ['Large Diameter', 'Fatigue Resistant', 'High Strength'],
    imagePrompt: 'Large diameter hot coil spring for heavy machinery, orange-hot metallic texture, industrial manufacturing plant background, professional photography, 8k',
    fallbackSrc: px('2760243', 400, 300)
  },
  {
    id: '3',
    name: '压缩弹簧 (Compression Springs)',
    category: 'General',
    description: 'Most common spring type. Used in various mechanisms, auto suspension, and switches.',
    features: ['Various Specs', 'Custom Ends', 'Durable'],
    imagePrompt: 'Macro shot of multiple high-quality steel compression springs, industrial manufacturing, clean studio lighting, mechanical engineering precision, 8k',
    fallbackSrc: px('2760241', 400, 300)
  },
  {
    id: '4',
    name: '拉伸弹簧 (Extension Springs)',
    category: 'General',
    description: 'Hooks on both ends to withstand axial tension. Used in medical, fitness, and industrial doors.',
    features: ['Custom Hooks', 'Good Resilience', 'Anti-rust'],
    imagePrompt: 'Industrial extension springs with large closed hooks on ends, galvanized steel wire, professional studio shot on technical drawing background, 8k',
    fallbackSrc: px('3760529', 400, 300)
  },
  {
    id: '5',
    name: '扭转弹簧 (Torsion Springs)',
    category: 'General',
    description: 'Uses torque for clamping mechanisms, hinges, and automotive locks.',
    features: ['Precise Angle', 'Stable Torque', 'Complex Form'],
    imagePrompt: 'Close up of industrial torsion springs with long straight legs, made of galvanized steel wire, arranged neatly on an engineering blueprint, professional lighting, technical atmosphere, 8k',
    fallbackSrc: ux('1513828583688-c52646db42da', 400)
  },
  {
    id: '6',
    name: '模具弹簧 (Die Springs)',
    category: 'Precision',
    description: 'Rectangular section for stamping dies, high rigidity and durability.',
    features: ['Rectangular', 'Color Coded', 'High Impact'],
    imagePrompt: 'A collection of industrial die springs in bright red, blue, and green, rectangular wire section, neatly arranged on a metal workbench, modern factory lighting, high resolution, 8k',
    fallbackSrc: ux('1597484661973-ee6cd0b6482c', 400)
  },
  {
    id: '7',
    name: '精密异形弹簧 (Custom Forms)',
    category: 'Custom',
    description: 'Non-standard springs and wire forms tailored to specific needs.',
    features: ['Complex', 'Blueprint Custom', 'Special Alloy'],
    imagePrompt: 'Complex custom-shaped wire forms and non-standard springs, intricate metal bending, industrial design prototypes, macro photography on blueprint, 8k',
    fallbackSrc: px('3760529', 400, 300)
  },
  {
    id: '8',
    name: '机械加工零部件 (Machined Parts)',
    category: 'Machining',
    description: 'General mechanical parts, auto accessories, and electrical components beyond springs.',
    features: ['CNC', 'High Precision', 'Small Batch'],
    imagePrompt: 'CNC machined high-precision metal parts, aluminum and steel components, shining metallic surfaces, engineering laboratory context, 8k',
    fallbackSrc: px('3825581', 400, 300)
  }
];

export const Products: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const categories = ['All', ...Array.from(new Set(PRODUCT_DATA.map(p => p.category)))];

  const filteredProducts = PRODUCT_DATA.filter(p => {
    const matchesCategory = filter === 'All' || p.category === filter;
    const matchesSearch = !searchTerm ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('nav_products')}</h1>
          <p className="text-slate-500 max-w-2xl">
            We offer comprehensive spring manufacturing services, from micro precision springs to large hot coil springs.
            Support custom drawings and samples to meet your industrial needs.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <Filter className="w-5 h-5 text-slate-400 flex-shrink-0" />
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filter === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search_placeholder')}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-slate-400">
            <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No products found for "{searchTerm}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-[4/3] bg-slate-100 relative">
                  <AIImage
                    prompt={product.imagePrompt}
                    alt={product.name}
                    fallbackSrc={product.fallbackSrc}
                    className="w-full h-full"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                    {product.category}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.features.slice(0, 2).map((feature, idx) => (
                      <span key={idx} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-900 hover:text-white transition-colors">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
