import type { FC } from 'react';
import {
  Award,
  ExternalLink,
  FileCheck2,
  FileText,
  Gauge,
  Layers3,
  Microscope,
  PackageCheck,
  Settings,
  Shield,
  Target,
  Truck,
  Zap,
} from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useLanguage } from '../contexts/LanguageContext';

export const Capacity: FC = () => {
  const { t } = useLanguage();

  const equipment = [
    {
      nameKey: 'cap_equipment_cnc_name',
      descKey: 'cap_equipment_cnc_desc',
      icon: <Settings className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_coiling',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_shot_name',
      descKey: 'cap_equipment_shot_desc',
      icon: <Zap className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_surface',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_grind_name',
      descKey: 'cap_equipment_grind_desc',
      icon: <Target className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_precision',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_ndt_name',
      descKey: 'cap_equipment_ndt_desc',
      icon: <Microscope className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_ndt',
      highlight: false,
    },
    {
      nameKey: 'cap_equipment_patent_name',
      descKey: 'cap_equipment_patent_desc',
      icon: <Award className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_patented',
      highlight: true,
    },
    {
      nameKey: 'cap_equipment_tester_name',
      descKey: 'cap_equipment_tester_desc',
      icon: <Shield className="w-6 h-6 text-accent-500" />,
      tagKey: 'cap_equip_tag_testing',
      highlight: false,
    },
  ];

  const capabilityBands = [
    {
      valueKey: 'cap_band_cold_value',
      titleKey: 'cap_band_cold_title',
      descKey: 'cap_band_cold_desc',
      icon: <Gauge className="w-6 h-6 text-accent-500" />,
    },
    {
      valueKey: 'cap_band_hot_value',
      titleKey: 'cap_band_hot_title',
      descKey: 'cap_band_hot_desc',
      icon: <Layers3 className="w-6 h-6 text-accent-500" />,
    },
    {
      valueKey: 'cap_band_test_value',
      titleKey: 'cap_band_test_title',
      descKey: 'cap_band_test_desc',
      icon: <FileCheck2 className="w-6 h-6 text-accent-500" />,
    },
    {
      valueKey: 'cap_band_standard_value',
      titleKey: 'cap_band_standard_title',
      descKey: 'cap_band_standard_desc',
      icon: <Shield className="w-6 h-6 text-accent-500" />,
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
      icon: <FileText className="w-6 h-6 text-accent-500" />,
    },
    {
      titleKey: 'cap_delivery_trace_title',
      descKey: 'cap_delivery_trace_desc',
      icon: <Shield className="w-6 h-6 text-accent-500" />,
    },
    {
      titleKey: 'cap_delivery_pack_title',
      descKey: 'cap_delivery_pack_desc',
      icon: <PackageCheck className="w-6 h-6 text-accent-500" />,
    },
    {
      titleKey: 'cap_delivery_ship_title',
      descKey: 'cap_delivery_ship_desc',
      icon: <Truck className="w-6 h-6 text-accent-500" />,
    },
  ];

  const assemblyCapabilities = [
    {
      titleKey: 'cap_assembly_item_spring_title',
      descKey: 'cap_assembly_item_spring_desc',
      icon: <Layers3 className="w-6 h-6 text-accent-500" />,
    },
    {
      titleKey: 'cap_assembly_item_electronics_title',
      descKey: 'cap_assembly_item_electronics_desc',
      icon: <Zap className="w-6 h-6 text-accent-500" />,
    },
    {
      titleKey: 'cap_assembly_item_switch_title',
      descKey: 'cap_assembly_item_switch_desc',
      icon: <Settings className="w-6 h-6 text-accent-500" />,
    },
  ];

  return (
    <div className="page-canvas pt-20 pb-16 sm:pt-24 sm:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('nav_capacity')}</h1>
              <p className="apple-body mt-4 max-w-2xl text-slate-200 sm:mt-6">{t('cap_intro_desc')}</p>
              <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-3">
                <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">≥99%</div>
                  <div className="mt-2 text-sm font-semibold text-[#ffe39a]">{t('cap_metric_pass_label')}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">≥95%</div>
                  <div className="mt-2 text-sm font-semibold text-[#ffe39a]">{t('cap_metric_delivery_label')}</div>
                </div>
                <div className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                  <div className="text-2xl font-semibold text-white sm:text-3xl">98%</div>
                  <div className="mt-2 text-sm font-semibold text-[#ffe39a]">{t('cap_metric_satisfaction_label')}</div>
                </div>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[36px] sm:p-4">
              <div className="overflow-hidden rounded-[24px] sm:rounded-[28px]">
                <ResponsiveImage
                  src="/factory/factory_17.jpg"
                  alt={t('capacity_title')}
                  width="1200"
                  height="800"
                  imgClassName="h-full min-h-[220px] w-full object-cover sm:min-h-[420px]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
              <div className="mt-3 rounded-[20px] border border-white/10 bg-white/10 p-4 sm:mt-4 sm:rounded-[24px] sm:p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#ffe39a]">{t('cap_cert_dual')}</div>
                <div className="mt-2 text-sm font-semibold text-white">{t('cap_certified_high_end_industrial')}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-24 xl:mt-28">
        <div>
          <p className="page-kicker">{t('cap_band_title')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('cap_band_title')}</h2>
        </div>
        <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-10 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {capabilityBands.map((band) => (
            <div key={band.titleKey} className="page-soft-card page-accent-line p-5 sm:p-7 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div className="page-icon-badge">{band.icon}</div>
                <div className="text-right text-2xl font-semibold tracking-[-0.04em] text-slate-950">{t(band.valueKey)}</div>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-950 sm:mt-5">{t(band.titleKey)}</h3>
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t(band.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-24 xl:mt-28">
        <div className="grid gap-6 sm:gap-10 lg:grid-cols-2 xl:gap-12">
          <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
            <div className="page-icon-badge">
              <Settings className="w-8 h-8 text-accent-500" />
            </div>
            <h2 className="apple-card-title mt-5 text-slate-950 sm:mt-6">{t('manufacturing')}</h2>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-8 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
                <h3 className="text-base font-semibold text-slate-950">{t('cap_mfg_cnc_cold')}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{t('cap_mfg_cnc_cold_desc')}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
                <h3 className="text-base font-semibold text-slate-950">{t('cap_mfg_hot_induction')}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{t('cap_mfg_hot_induction_desc')}</p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[24px] sm:mt-10 sm:rounded-[28px]">
              <ResponsiveImage
                src="/factory/factory_18.jpg"
                alt={t('cap_equipment_shot_name')}
                width="1200"
                height="800"
                imgClassName="h-44 w-full object-cover sm:h-56"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
            <div className="page-icon-badge">
              <Microscope className="w-8 h-8 text-accent-500" />
            </div>
            <h2 className="apple-card-title mt-5 text-slate-950 sm:mt-6">{t('quality_control')}</h2>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-8 sm:grid-cols-2">
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
                <h3 className="text-base font-semibold text-slate-950">{t('cap_qc_qms')}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{t('cap_qc_qms_desc')}</p>
              </div>
              <div className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
                <h3 className="text-base font-semibold text-slate-950">{t('cap_qc_ndt')}</h3>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{t('cap_qc_ndt_desc')}</p>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-[24px] sm:mt-10 sm:rounded-[28px]">
              <ResponsiveImage
                src="/factory/factory_19.jpg"
                alt={t('cap_equipment_tester_name')}
                width="1200"
                height="800"
                imgClassName="h-44 w-full object-cover sm:h-56"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-24 xl:mt-28">
        <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
          <div className="grid gap-8 sm:gap-10 xl:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] xl:items-stretch xl:gap-12">
            <div className="flex flex-col justify-between">
              <div>
                <p className="page-kicker">{t('cap_assembly_title')}</p>
                <h2 className="apple-section-title mt-4 text-slate-950">{t('cap_assembly_title')}</h2>
                <p className="apple-body mt-4 max-w-2xl text-slate-600 sm:mt-5">{t('cap_assembly_desc')}</p>
              </div>

              <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4">
                {assemblyCapabilities.map((item) => (
                  <div key={item.titleKey} className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-[0_12px_32px_rgba(15,23,42,0.04)] sm:rounded-[24px] sm:p-5">
                    <div className="page-icon-badge">{item.icon}</div>
                    <h3 className="mt-4 text-base font-semibold text-slate-950 sm:mt-5">{t(item.titleKey)}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(item.descKey)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f3f8fd_100%)] p-3 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:rounded-[32px] sm:p-4">
              <ResponsiveImage
                src="/factory/factory_22.jpg"
                alt={t('cap_assembly_image_alt')}
                width="1200"
                height="900"
                imgClassName="h-full min-h-[260px] w-full rounded-[20px] object-cover sm:min-h-[420px] sm:rounded-[24px]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-24 xl:mt-28">
        <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
          <p className="page-kicker">{t('cap_equipment_title')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('cap_equipment_title')}</h2>
          <div className="mt-8 grid gap-6 sm:mt-12 sm:gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-12">
            {equipment.map((eq) => (
              <div
                key={eq.nameKey}
                className={`rounded-[24px] border p-5 transition sm:rounded-[28px] sm:p-6 ${
                  eq.highlight
                    ? 'border-accent-400/30 bg-[linear-gradient(180deg,#fffdf0_0%,#ffffff_100%)] shadow-[0_18px_40px_rgba(250,204,21,0.08)]'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="page-icon-badge">{eq.icon}</div>
                  <span className={eq.highlight ? 'page-chip-soft' : 'rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 sm:px-3'}>
                    {t(eq.tagKey)}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold leading-snug text-slate-950 sm:mt-5">{t(eq.nameKey)}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t(eq.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-24 xl:mt-28">
        <div className="grid gap-6 sm:gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:gap-12">
          <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
            <p className="page-kicker">{t('cap_delivery_title')}</p>
            <h2 className="apple-section-title mt-4 text-slate-950">{t('cap_delivery_title')}</h2>
            <div className="mt-6 grid gap-4 sm:mt-10 sm:gap-8 md:grid-cols-2">
              {deliveryControls.map((item) => (
                <div key={item.titleKey} className="rounded-[24px] border border-slate-200 bg-white p-5 sm:rounded-[28px] sm:p-6">
                  <div className="page-icon-badge">{item.icon}</div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950 sm:mt-5">{t(item.titleKey)}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t(item.descKey)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="page-white-card p-6 sm:p-8 md:p-10">
            <p className="page-kicker">{t('cap_ref_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('cap_ref_title')}</h2>
            <div className="mt-6 space-y-4 sm:mt-10 sm:space-y-5">
              {publicReferences.map((reference) => (
                <div key={reference.titleKey} className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6faff_100%)] p-4 sm:rounded-[24px] sm:p-5">
                  <h3 className="text-base font-semibold text-slate-950">{t(reference.titleKey)}</h3>
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">{t(reference.descKey)}</p>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-500 hover:text-accent-500"
                  >
                    {t('cap_ref_link_label')} <ExternalLink className="w-4 h-4 text-accent-500" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
