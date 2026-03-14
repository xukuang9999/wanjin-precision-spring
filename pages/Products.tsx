import React, { useState } from 'react';
import { Search, Filter, Wrench, Cable, Layers3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PRODUCT_IMAGES } from '../utils/productImages';

const PRODUCT_DATA = [
  {
    id: '1',
    nameKey: 'product_hot_name',
    categoryKey: 'cat_heavy',
    descKey: 'product_hot_desc',
    featureKeys: ['feat_large_dia', 'feat_fatigue_res', 'feat_high_strength'],
    image: PRODUCT_IMAGES.hot
  },
  {
    id: '2',
    nameKey: 'product_disc_stack_name',
    categoryKey: 'cat_heavy',
    descKey: 'product_disc_stack_desc',
    featureKeys: ['feat_high_load', 'feat_compact', 'feat_fatigue_res'],
    image: PRODUCT_IMAGES.discStack
  },
  {
    id: '3',
    nameKey: 'product_die_name',
    categoryKey: 'cat_precision',
    descKey: 'product_die_desc',
    featureKeys: ['feat_rectangular', 'feat_color_coded', 'feat_high_impact'],
    image: PRODUCT_IMAGES.die
  },
  {
    id: '5',
    nameKey: 'product_comp_name',
    categoryKey: 'cat_general',
    descKey: 'product_comp_desc',
    featureKeys: ['feat_various_specs', 'feat_custom_ends', 'feat_durable'],
    image: PRODUCT_IMAGES.compression
  },
  {
    id: '6',
    nameKey: 'product_ext_name',
    categoryKey: 'cat_general',
    descKey: 'product_ext_desc',
    featureKeys: ['feat_custom_hooks', 'feat_resilience', 'feat_anti_rust'],
    image: PRODUCT_IMAGES.extension
  },
  {
    id: '7',
    nameKey: 'product_tor_name',
    categoryKey: 'cat_general',
    descKey: 'product_tor_desc',
    featureKeys: ['feat_precise_angle', 'feat_stable_torque', 'feat_complex_form'],
    image: PRODUCT_IMAGES.torsion
  },
  {
    id: '8',
    nameKey: 'product_wave_name',
    categoryKey: 'cat_precision',
    descKey: 'product_wave_desc',
    featureKeys: ['feat_compact', 'feat_high_precision', 'feat_long_life'],
    image: PRODUCT_IMAGES.wave
  },
  {
    id: '9',
    nameKey: 'product_contact_name',
    categoryKey: 'cat_precision',
    descKey: 'product_contact_desc',
    featureKeys: ['feat_high_precision', 'feat_anti_rust', 'feat_small_batch'],
    image: PRODUCT_IMAGES.contact
  },
  {
    id: '10',
    nameKey: 'product_retaining_name',
    categoryKey: 'cat_custom',
    descKey: 'product_retaining_desc',
    featureKeys: ['feat_durable', 'feat_anti_rust', 'feat_small_batch'],
    image: PRODUCT_IMAGES.retaining
  },
  {
    id: '11',
    nameKey: 'product_custom_name',
    categoryKey: 'cat_custom',
    descKey: 'product_custom_desc',
    featureKeys: ['feat_complex', 'feat_blueprint_custom', 'feat_special_alloy'],
    image: PRODUCT_IMAGES.custom
  },
  {
    id: '12',
    nameKey: 'product_constant_force_name',
    categoryKey: 'cat_custom',
    descKey: 'product_constant_force_desc',
    featureKeys: ['feat_long_life', 'feat_compact', 'feat_custom_ends'],
    image: PRODUCT_IMAGES.constantForce
  },
  {
    id: '13',
    nameKey: 'product_garter_name',
    categoryKey: 'cat_precision',
    descKey: 'product_garter_desc',
    featureKeys: ['feat_resilience', 'feat_durable', 'feat_high_precision'],
    image: PRODUCT_IMAGES.garter
  },
  {
    id: '15',
    nameKey: 'product_flat_name',
    categoryKey: 'cat_precision',
    descKey: 'product_flat_desc',
    featureKeys: ['feat_high_precision', 'feat_anti_rust', 'feat_small_batch'],
    image: PRODUCT_IMAGES.flat
  },
  {
    id: '16',
    nameKey: 'product_power_name',
    categoryKey: 'cat_custom',
    descKey: 'product_power_desc',
    featureKeys: ['feat_long_life', 'feat_compact', 'feat_stable_torque'],
    image: PRODUCT_IMAGES.power
  },
  {
    id: '17',
    nameKey: 'product_variable_force_name',
    categoryKey: 'cat_custom',
    descKey: 'product_variable_force_desc',
    featureKeys: ['feat_compact', 'feat_custom_ends', 'feat_durable'],
    image: PRODUCT_IMAGES.variableForce
  },
  {
    id: '18',
    nameKey: 'product_spiral_name',
    categoryKey: 'cat_custom',
    descKey: 'product_spiral_desc',
    featureKeys: ['feat_long_life', 'feat_compact', 'feat_stable_torque'],
    image: PRODUCT_IMAGES.spiral
  },
  {
    id: '19',
    nameKey: 'product_contact_clips_name',
    categoryKey: 'cat_precision',
    descKey: 'product_contact_clips_desc',
    featureKeys: ['feat_high_precision', 'feat_anti_rust', 'feat_small_batch'],
    image: PRODUCT_IMAGES.contactClips
  },
  {
    id: '20',
    nameKey: 'product_multi_wave_name',
    categoryKey: 'cat_precision',
    descKey: 'product_multi_wave_desc',
    featureKeys: ['feat_compact', 'feat_high_load', 'feat_long_life'],
    image: PRODUCT_IMAGES.multiTurnWave
  },
  {
    id: '21',
    nameKey: 'product_disc_name',
    categoryKey: 'cat_precision',
    descKey: 'product_disc_desc',
    featureKeys: ['feat_high_load', 'feat_long_life', 'feat_compact'],
    image: PRODUCT_IMAGES.disc
  }
];

export const Products: React.FC = () => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('cat_all');
  const [searchTerm, setSearchTerm] = useState('');
  
  const categories = ['cat_all', 'cat_precision', 'cat_heavy', 'cat_general', 'cat_custom'];

  const filteredProducts = PRODUCT_DATA.filter(p => {
    const matchesCategory = filter === 'cat_all' || p.categoryKey === filter;
    const name = t(p.nameKey);
    const desc = t(p.descKey);
    const features = p.featureKeys.map(k => t(k)).join(' ');
    
    const matchesSearch = !searchTerm ||
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      features.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{t('nav_products')}</h1>
          <p className="text-slate-500 max-w-2xl">
            {t('product_header_desc')}
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
                {t(cat)}
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
            <p className="text-lg">{t('no_products_found')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-[4/3] bg-gradient-to-br from-white via-slate-50 to-slate-100 relative p-4">
                  <img
                    src={product.image}
                    alt={t(product.nameKey)}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-xs font-bold text-slate-800 shadow-sm">
                    {t(product.categoryKey)}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{t(product.nameKey)}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{t(product.descKey)}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {product.featureKeys.slice(0, 3).map((key, idx) => (
                      <span key={idx} className="text-[10px] uppercase tracking-wider bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-200">
                        {t(key)}
                      </span>
                    ))}
                  </div>
                  <a
                    href={`mailto:sales@wanjinspring.com?subject=${encodeURIComponent(`Product Inquiry - ${t(product.nameKey)}`)}`}
                    className="block w-full py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 text-center hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    {t('btn_send_email')}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('seo_scope_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('seo_scope_desc')}</p>
          </div>

          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('product_more_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('product_more_desc')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Cable className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('product_power_eq_name')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t('product_power_eq_desc')}</p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Layers3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('product_high_pressure_name')}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{t('product_high_pressure_desc')}</p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-sm">
                <Wrench className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{t('assembly_service_title')}</h3>
              <p className="text-sm text-slate-700 leading-relaxed">{t('assembly_service_desc')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
