import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Factory as FactoryIcon, Settings, Flame, Disc, Wind, ShieldAlert, BadgeCheck, CheckCircle2, Target, Gauge } from 'lucide-react';

export const Factory: React.FC = () => {
  const { t } = useLanguage();

  const coldSteps = [
    { key: 'step_material', icon: <Settings className="w-5 h-5" /> },
    { key: 'step_setup', icon: <Target className="w-5 h-5" /> },
    { key: 'step_coiling', icon: <Wind className="w-5 h-5" /> },
    { key: 'step_heat', icon: <Flame className="w-5 h-5" /> },
    { key: 'step_grind', icon: <Disc className="w-5 h-5" /> },
    { key: 'step_inspect', icon: <BadgeCheck className="w-5 h-5" /> }
  ];

  const hotSteps = [
    { key: 'step_material', icon: <Settings className="w-5 h-5" /> },
    { key: 'step_induction', icon: <Flame className="w-5 h-5" /> },
    { key: 'step_quench', icon: <Gauge className="w-5 h-5" /> },
    { key: 'step_gas_cut', icon: <Settings className="w-5 h-5" /> },
    { key: 'step_preset', icon: <ShieldAlert className="w-5 h-5" /> },
    { key: 'step_ndt', icon: <CheckCircle2 className="w-5 h-5" /> },
    { key: 'step_load', icon: <BadgeCheck className="w-5 h-5" /> }
  ];

  const controlPoints = [
    {
      title: t('factory_control_traceability'),
      desc: t('factory_control_traceability_desc'),
      icon: <CheckCircle2 className="w-6 h-6 text-blue-600" />
    },
    {
      title: t('factory_control_params'),
      desc: t('factory_control_params_desc'),
      icon: <Settings className="w-6 h-6 text-slate-700" />
    },
    {
      title: t('factory_control_integrity'),
      desc: t('factory_control_integrity_desc'),
      icon: <ShieldAlert className="w-6 h-6 text-red-600" />
    }
  ];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Factory Header */}
      <div className="bg-slate-900 py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
             src="/factory/factory_1.jpg"
             alt="Factory Background"
             className="w-full h-full object-cover"
             loading="eager"
             fetchPriority="high"
             decoding="async"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl">
              <FactoryIcon className="w-10 h-10 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-1">{t('nav_factory')}</h1>
              <p className="text-blue-400 font-medium tracking-wider uppercase text-sm">{t('company_name_full')} / {t('factory_qms_standard')}</p>
            </div>
          </div>
          <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">
            {t('factory_desc')}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        
        {/* Quality Control Points Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {controlPoints.map((cp, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-slate-100 group-hover:bg-blue-50 transition-colors">
                {cp.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{cp.title}</h3>
              <p className="text-slate-600 leading-relaxed">{cp.desc}</p>
            </div>
          ))}
        </div>

        {/* Cold Process Flow */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-sm">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="w-full md:w-1/3 sticky top-24">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('process_cold_title')}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('factory_process_cold_desc')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <BadgeCheck className="w-5 h-5 text-green-500" />
                  <span>{t('factory_iso_verified')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <BadgeCheck className="w-5 h-5 text-green-500" />
                  <span>{t('cap_equip_tag_coiling')}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {coldSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t(step.key)}</h4>
                      <p className="text-sm text-slate-600 leading-snug">{t(`${step.key}_desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hot Process Flow */}
        <div className="bg-white rounded-[40px] p-8 md:p-16 border border-slate-100 shadow-sm bg-gradient-to-br from-white to-slate-50">
          <div className="flex flex-col md:flex-row-reverse gap-12 items-start">
            <div className="w-full md:w-1/3 sticky top-24">
              <span className="inline-block px-4 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">{t('cap_unique')}</span>
              <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('process_hot_title')}</h2>
              <p className="text-slate-600 mb-8 leading-relaxed">
                {t('factory_process_hot_desc')}
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <BadgeCheck className="w-5 h-5 text-orange-500" />
                  <span>{t('factory_high_end_industrial_standard')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                  <BadgeCheck className="w-5 h-5 text-orange-500" />
                  <span>{t('cap_mfg_hot_induction')}</span>
                </div>
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {hotSteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 p-6 bg-white rounded-2xl border border-slate-100 items-start shadow-sm">
                    <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t(step.key)}</h4>
                      <p className="text-sm text-slate-600 leading-snug">{t(`${step.key}_desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="pt-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('factory_gallery_title')}</h2>
            <p className="text-slate-500">{t('factory_gallery_subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[10, 15, 22, 23, 17, 18, 19, 8].map((imgNum) => (
              <div key={imgNum} className="aspect-[4/3] rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all group border border-white">
                <img 
                  src={`/factory/factory_${imgNum}.jpg`} 
                  alt={`Factory view ${imgNum}`} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Factory;
