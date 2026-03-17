import React from 'react';
import { Microscope, Settings, Shield, Zap, Target, Award, ChevronRight, ExternalLink, FileCheck2, Gauge, Layers3, PackageCheck, FileText, Truck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Capacity: React.FC = () => {
  const { t } = useLanguage();

  const equipment = [
    {
      nameKey: 'cap_equipment_cnc_name',
      descKey: 'cap_equipment_cnc_desc',
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_coiling',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_shot_name',
      descKey: 'cap_equipment_shot_desc',
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_surface',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_grind_name',
      descKey: 'cap_equipment_grind_desc',
      icon: <Target className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_precision',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_ndt_name',
      descKey: 'cap_equipment_ndt_desc',
      icon: <Microscope className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_ndt',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_patent_name',
      descKey: 'cap_equipment_patent_desc',
      icon: <Award className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_patented',
      highlight: true,
    },
    {
      nameKey: 'cap_equipment_tester_name',
      descKey: 'cap_equipment_tester_desc',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      tagKey: 'cap_equip_tag_testing',
      highlight: false,
    },
  ];

  const processes = [
    {
      titleKey: 'product_custom_name',
      steps: ['step_material', 'step_setup', 'step_proto', 'step_coiling', 'step_heat', 'step_inspect'],
    },
    {
      titleKey: 'product_comp_name',
      steps: ['step_material', 'step_setup', 'step_coiling', 'step_heat', 'step_grind', 'step_deburr', 'step_inspect'],
    },
    {
      titleKey: 'product_hot_name',
      steps: ['step_induction', 'step_quench', 'step_grind_end', 'step_gas_cut', 'step_rough_grind', 'step_preset', 'step_fine_grind', 'step_flaw_detect', 'step_load'],
    },
  ];

  const capabilityBands = [
    {
      valueKey: 'cap_band_cold_value',
      titleKey: 'cap_band_cold_title',
      descKey: 'cap_band_cold_desc',
      icon: <Gauge className="w-6 h-6 text-blue-600" />,
    },
    {
      valueKey: 'cap_band_hot_value',
      titleKey: 'cap_band_hot_title',
      descKey: 'cap_band_hot_desc',
      icon: <Layers3 className="w-6 h-6 text-blue-600" />,
    },
    {
      valueKey: 'cap_band_test_value',
      titleKey: 'cap_band_test_title',
      descKey: 'cap_band_test_desc',
      icon: <FileCheck2 className="w-6 h-6 text-blue-600" />,
    },
    {
      valueKey: 'cap_band_standard_value',
      titleKey: 'cap_band_standard_title',
      descKey: 'cap_band_standard_desc',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
    },
  ];

  const publicReferences = [
    {
      titleKey: 'cap_ref_xd_title',
      descKey: 'cap_ref_xd_desc',
      url: 'https://www.xd.com.cn/info/1029/8503.htm',
    },
    {
      titleKey: 'cap_ref_patent_title',
      descKey: 'cap_ref_patent_desc',
      url: 'https://patents.google.com/patent/CN103604590A/zh',
    },
  ];

  const deliveryControls = [
    {
      titleKey: 'cap_delivery_doc_title',
      descKey: 'cap_delivery_doc_desc',
      icon: <FileText className="w-6 h-6 text-blue-600" />,
    },
    {
      titleKey: 'cap_delivery_trace_title',
      descKey: 'cap_delivery_trace_desc',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
    },
    {
      titleKey: 'cap_delivery_pack_title',
      descKey: 'cap_delivery_pack_desc',
      icon: <PackageCheck className="w-6 h-6 text-blue-600" />,
    },
    {
      titleKey: 'cap_delivery_ship_title',
      descKey: 'cap_delivery_ship_desc',
      icon: <Truck className="w-6 h-6 text-blue-600" />,
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('nav_capacity')}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('cap_intro_desc')}
            </p>
          </div>
          <div className="md:w-1/2 h-64 rounded-2xl overflow-hidden shadow-lg group">
            <img
              src="/factory/factory_17.jpg"
              alt="Production Line"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        </div>
      </div>

      {/* Northwest China Exclusive Banner */}
      <div className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div className="flex-shrink-0">
              <span className="bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                {t('cap_unique')}
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed flex-1">{t('cap_unique_desc')}</p>
            <div className="flex-shrink-0 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <Shield className="w-7 h-7 text-blue-400" />
              <div>
                <div className="text-xs text-slate-400 font-medium">{t('cap_cert_dual')}</div>
                <div className="text-sm font-bold text-white">{t('cap_certified_high_end_industrial')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moved Quality Metrics to top of Capacity page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl overflow-hidden relative">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cap_band_title')}</h2>
          <p className="text-slate-600 max-w-4xl leading-relaxed">{t('cap_band_desc')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {capabilityBands.map((band, idx) => (
            <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="p-3 rounded-2xl bg-blue-50">{band.icon}</div>
                <div className="text-right text-2xl font-bold text-slate-900">{t(band.valueKey)}</div>
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">{t(band.titleKey)}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t(band.descKey)}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">

        {/* Manufacturing + Quality Control */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">

          {/* Manufacturing */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('manufacturing')}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{t('cap_mfg_desc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">{t('cap_mfg_cnc_cold')}</h3>
                <p className="text-sm text-slate-500">{t('cap_mfg_cnc_cold_desc')}</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">{t('cap_mfg_hot_induction')}</h3>
                <p className="text-sm text-slate-500">{t('cap_mfg_hot_induction_desc')}</p>
              </div>
            </div>

            <div className="h-48 rounded-xl overflow-hidden group">
              <img
                src="/factory/factory_18.jpg"
                alt={t('cap_equipment_shot_name')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          {/* Quality Control */}
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Microscope className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">{t('quality_control')}</h2>
            </div>
            <p className="text-slate-600 leading-relaxed">{t('cap_qc_desc')}</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">{t('cap_qc_qms')}</h3>
                <p className="text-sm text-slate-500">{t('cap_qc_qms_desc')}</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">{t('cap_qc_ndt')}</h3>
                <p className="text-sm text-slate-500">{t('cap_qc_ndt_desc')}</p>
              </div>
            </div>

            <div className="h-48 rounded-xl overflow-hidden group">
              <img
                src="/factory/factory_19.jpg"
                alt={t('cap_equipment_tester_name')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

        </div>

        {/* Key Equipment */}
        <div>
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cap_equipment_title')}</h2>
            <p className="text-slate-500 text-sm">{t('cap_equipment_subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {equipment.map((eq, idx) => (
              <div
                key={idx}
                className={`rounded-2xl p-6 border transition hover:shadow-lg ${eq.highlight
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-slate-100 bg-white'
                  }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-white rounded-lg shadow-sm border border-slate-100">
                    {eq.icon}
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${eq.highlight
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-500'
                      }`}
                  >
                    {t(eq.tagKey)}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm leading-snug">{t(eq.nameKey)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(eq.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-10 shadow-sm">
          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cap_delivery_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('cap_delivery_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {deliveryControls.map((item) => (
              <div key={item.titleKey} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="inline-flex rounded-2xl bg-white p-3 shadow-sm">{item.icon}</div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">{t(item.titleKey)}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10">
          <div className="max-w-4xl mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cap_ref_title')}</h2>
            <p className="text-slate-600 leading-relaxed">{t('cap_ref_desc')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publicReferences.map((reference, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{t(reference.titleKey)}</h3>
                <p className="mt-3 text-sm text-slate-600 leading-relaxed">{t(reference.descKey)}</p>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800"
                >
                  {t('cap_ref_link_label')} <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Production Process Flows */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">{t('process_title')}</h2>
          <p className="text-slate-500 text-sm text-center mb-12">{t('cap_process_subtitle')}</p>
          <div className="space-y-12">
            {processes.map((proc, pIdx) => (
              <div key={pIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {pIdx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{t(proc.titleKey)}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {proc.steps.map((stepKey, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm whitespace-nowrap">
                          {t(stepKey)}
                        </div>
                      </div>
                      {sIdx < proc.steps.length - 1 && (
                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
