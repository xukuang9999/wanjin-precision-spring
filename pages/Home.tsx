import React from 'react';
import { ArrowRight, CheckCircle2, Factory, Zap, ShieldCheck, Microscope, Cpu, Wrench, Cog } from 'lucide-react';
import { getLocalizedPath, PageView } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { PRODUCT_IMAGES } from '../utils/productImages';
import { Language } from '../utils/translations';

interface HomeProps {
  onNavigate: (page: PageView, language?: Language) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t, language } = useLanguage();

  return (
    <div className="pt-24 space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative min-h-[700px] flex items-center">
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
          <img
            src="/factory/factory_1.jpg"
            alt="Wanjin Manufacturing"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-slate-200 mb-8 font-light">
              {t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate(PageView.PRODUCTS)}
                className="px-8 py-4 bg-accent-500 text-slate-900 rounded-md font-bold hover:bg-accent-400 transition flex items-center justify-center gap-2"
              >
                {t('btn_explore')} <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href={getLocalizedPath(PageView.CONTACT, language)}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(PageView.CONTACT);
                }}
                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition backdrop-blur-sm text-center"
              >
                {t('btn_contact')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Factory className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_professional_title',
              descKey: 'feat_professional_desc',
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_certified_title',
              descKey: 'feat_certified_desc',
            },
            {
              icon: <Zap className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_wide_app_title',
              descKey: 'feat_wide_app_desc',
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t(item.titleKey)}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quality Metrics - Moved from Capacity to Home Top */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-3xl -mr-32 -mt-32 rounded-full"></div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
              <div className="text-5xl font-bold text-white mb-2">≥99%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_pass_label')}</div>
              <p className="text-slate-400 text-xs">{t('cap_metric_pass_target')}</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
              <div className="text-5xl font-bold text-white mb-2">≥95%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_delivery_label')}</div>
              <p className="text-slate-400 text-xs">{t('cap_metric_delivery_target')}</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition">
              <div className="text-5xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_satisfaction_label')}</div>
              <p className="text-slate-400 text-xs">{t('cap_metric_satisfaction_target')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('core_products')}</h2>
          <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              nameKey: "product_hot_name",
              src: PRODUCT_IMAGES.hot
            },
            {
              nameKey: "product_disc_stack_name",
              src: PRODUCT_IMAGES.discStack
            },
            {
              nameKey: "product_comp_name",
              src: PRODUCT_IMAGES.compression
            },
            {
              nameKey: "product_disc_name",
              src: PRODUCT_IMAGES.disc
            },
          ].map((product, idx) => (
            <div key={idx} className="group cursor-pointer" onClick={() => onNavigate(PageView.PRODUCTS)}>
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg border border-slate-100 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-4">
                <img
                  src={product.src}
                  alt={t(product.nameKey)}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{t(product.nameKey)}</h3>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate(PageView.PRODUCTS)}
            className="text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2 mx-auto"
          >
            {t('view_all')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Partner Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('trusted_by')}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t('client_section_desc')}
              </p>
              <ul className="space-y-3">
                {[t('partner_major_group'), t('partner_auto_oem'), t('partner_custom_machinery')].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Zap className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">{t('industry_power_sector')}</span>
                <span className="text-xs text-slate-400">{t('industry_hv')}</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Cog className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">{t('industry_auto')}</span>
                <span className="text-xs text-slate-400">{t('industry_oem')}</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Wrench className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">{t('industry_heavy')}</span>
                <span className="text-xs text-slate-400">{t('industry_machine')}</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Cpu className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">{t('industry_elec')}</span>
                <span className="text-xs text-slate-400">{t('industry_power')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-12">
          <div className="max-w-4xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('seo_scope_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('seo_scope_desc')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('faq_title')}</h2>
          <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ['faq_q1', 'faq_a1'],
            ['faq_q2', 'faq_a2'],
            ['faq_q3', 'faq_a3'],
            ['faq_q4', 'faq_a4'],
          ].map(([questionKey, answerKey]) => (
            <div key={questionKey} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t(questionKey)}</h3>
              <p className="text-slate-600 leading-relaxed">{t(answerKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
