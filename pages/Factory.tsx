import React from 'react';
import { BadgeCheck, CheckCircle2, Disc, Factory as FactoryIcon, Flame, Settings, ShieldAlert, Target, Wind } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Factory: React.FC = () => {
  const { t } = useLanguage();

  const coldSteps = [
    { key: 'step_material', icon: <Settings className="w-5 h-5 text-accent-500" /> },
    { key: 'step_setup', icon: <Target className="w-5 h-5 text-accent-500" /> },
    { key: 'step_coiling', icon: <Wind className="w-5 h-5 text-accent-500" /> },
    { key: 'step_heat', icon: <Flame className="w-5 h-5 text-accent-500" /> },
    { key: 'step_grind', icon: <Disc className="w-5 h-5 text-accent-500" /> },
    { key: 'step_inspect', icon: <BadgeCheck className="w-5 h-5 text-accent-500" /> },
  ];

  const hotSteps = [
    { key: 'step_material', icon: <Settings className="w-5 h-5 text-accent-500" /> },
    { key: 'step_induction', icon: <Flame className="w-5 h-5 text-accent-500" /> },
    { key: 'step_quench', icon: <Target className="w-5 h-5 text-accent-500" /> },
    { key: 'step_gas_cut', icon: <Settings className="w-5 h-5 text-accent-500" /> },
    { key: 'step_preset', icon: <ShieldAlert className="w-5 h-5 text-accent-500" /> },
    { key: 'step_ndt', icon: <CheckCircle2 className="w-5 h-5 text-accent-500" /> },
    { key: 'step_load', icon: <BadgeCheck className="w-5 h-5 text-accent-500" /> },
  ];

  const controlPoints = [
    {
      title: t('factory_control_traceability'),
      desc: t('factory_control_traceability_desc'),
      icon: <CheckCircle2 className="w-6 h-6 text-accent-500" />,
    },
    {
      title: t('factory_control_params'),
      desc: t('factory_control_params_desc'),
      icon: <Settings className="w-6 h-6 text-accent-500" />,
    },
    {
      title: t('factory_control_integrity'),
      desc: t('factory_control_integrity_desc'),
      icon: <ShieldAlert className="w-6 h-6 text-accent-500" />,
    },
  ];

  return (
    <div className="page-canvas pt-24 pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('nav_factory')}</h1>
              <p className="apple-body mt-6 max-w-2xl text-slate-200">{t('factory_desc')}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <span className="page-chip">{t('factory_qms_standard')}</span>
                <span className="page-chip">{t('cap_unique')}</span>
              </div>
            </div>

            <div className="rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="overflow-hidden rounded-[28px]">
                <img
                  src="/factory/factory_1.jpg"
                  alt="Factory Background"
                  width="1600"
                  height="900"
                  className="h-full min-h-[420px] w-full object-cover"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-16">
        <div className="grid gap-6 md:grid-cols-3">
          {controlPoints.map((point) => (
            <div key={point.title} className="page-soft-card page-accent-line p-8">
              <div className="page-icon-badge">{point.icon}</div>
              <h3 className="mt-6 text-xl font-semibold text-slate-950">{point.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{point.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="page-soft-card page-accent-line p-8 md:p-10">
            <div className="page-icon-badge">
              <FactoryIcon className="w-8 h-8 text-accent-500" />
            </div>
            <p className="page-kicker mt-6">{t('process_cold_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('process_cold_title')}</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">{t('factory_process_cold_desc')}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {coldSteps.map((step) => (
                <div key={step.key} className="rounded-[24px] border border-slate-200 bg-white p-5">
                  <div className="page-icon-badge">{step.icon}</div>
                  <h3 className="mt-4 text-base font-semibold text-slate-950">{t(step.key)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${step.key}_desc`)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 overflow-hidden rounded-[28px]">
              <img
                src="/factory/factory_18.jpg"
                alt={t('process_cold_title')}
                width="1200"
                height="800"
                className="h-56 w-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="page-dark-card p-8 md:p-10">
            <div className="page-icon-badge">
              <Flame className="w-8 h-8 text-accent-500" />
            </div>
            <p className="page-kicker-gold mt-6">{t('process_hot_title')}</p>
            <h2 className="apple-card-title mt-4 text-white">{t('process_hot_title')}</h2>
            <p className="mt-4 text-slate-200 leading-relaxed">{t('factory_process_hot_desc')}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {hotSteps.map((step) => (
                <div key={step.key} className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                  <div className="page-icon-badge">{step.icon}</div>
                  <h3 className="mt-4 text-base font-semibold text-white">{t(step.key)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{t(`${step.key}_desc`)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="page-chip">{t('factory_high_end_industrial_standard')}</span>
              <span className="page-chip">{t('cap_mfg_hot_induction')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="page-soft-card page-accent-line p-8 md:p-10">
          <p className="page-kicker">{t('factory_gallery_title')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('factory_gallery_title')}</h2>
          <p className="mt-3 text-slate-600">{t('factory_gallery_subtitle')}</p>
          <div className="mt-8 grid gap-6 grid-cols-2 lg:grid-cols-4">
            {[10, 15, 22, 23, 17, 18, 19, 8].map((imgNum) => (
              <div key={imgNum} className="overflow-hidden rounded-[28px] border border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
                <img
                  src={`/factory/factory_${imgNum}.jpg`}
                  alt={`Factory view ${imgNum}`}
                  width="1200"
                  height="900"
                  className="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Factory;
