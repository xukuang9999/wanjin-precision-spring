import React from 'react';
import { BadgeCheck, CheckCircle2, Disc, Factory as FactoryIcon, Flame, Settings, ShieldAlert, Target, Wind } from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
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
    <div className="page-canvas pt-20 pb-16 sm:pt-24 sm:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('nav_factory')}</h1>
              <p className="apple-body mt-4 max-w-2xl text-slate-200 sm:mt-6">{t('factory_desc')}</p>
              <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
                <span className="page-chip">{t('factory_qms_standard')}</span>
                <span className="page-chip">{t('cap_unique')}</span>
              </div>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[36px] sm:p-4">
              <div className="overflow-hidden rounded-[24px] sm:rounded-[28px]">
                <ResponsiveImage
                  src="/factory/factory_1.jpg"
                  alt={t('nav_factory')}
                  width="1600"
                  height="900"
                  imgClassName="h-full min-h-[220px] w-full object-cover sm:min-h-[420px]"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-12 sm:mt-16">
        <div className="grid gap-5 sm:gap-6 md:grid-cols-3">
          {controlPoints.map((point) => (
            <div key={point.title} className="page-soft-card page-accent-line p-6 sm:p-8">
              <div className="page-icon-badge">{point.icon}</div>
              <h3 className="mt-5 text-lg font-semibold text-slate-950 sm:mt-6 sm:text-xl">{point.title}</h3>
              <p className="mt-3 leading-relaxed text-slate-600">{point.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-20">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
            <div className="page-icon-badge">
              <FactoryIcon className="w-8 h-8 text-accent-500" />
            </div>
            <p className="page-kicker mt-5 sm:mt-6">{t('process_cold_title')}</p>
            <h2 className="apple-card-title mt-4 text-slate-950">{t('process_cold_title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">{t('factory_process_cold_desc')}</p>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2">
              {coldSteps.map((step) => (
                <div key={step.key} className="rounded-[20px] border border-slate-200 bg-white p-4 sm:rounded-[24px] sm:p-5">
                  <div className="page-icon-badge">{step.icon}</div>
                  <h3 className="mt-3 text-base font-semibold text-slate-950 sm:mt-4">{t(step.key)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{t(`${step.key}_desc`)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-[24px] sm:mt-8 sm:rounded-[28px]">
              <ResponsiveImage
                src="/factory/factory_18.jpg"
                alt={t('process_cold_title')}
                width="1200"
                height="800"
                imgClassName="h-44 w-full object-cover sm:h-56"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>

          <div className="page-dark-card p-6 sm:p-8 md:p-10">
            <div className="page-icon-badge">
              <Flame className="w-8 h-8 text-accent-500" />
            </div>
            <p className="page-kicker-gold mt-5 sm:mt-6">{t('process_hot_title')}</p>
            <h2 className="apple-card-title mt-4 text-white">{t('process_hot_title')}</h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200 sm:text-base">{t('factory_process_hot_desc')}</p>
            <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 sm:grid-cols-2">
              {hotSteps.map((step) => (
                <div key={step.key} className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                  <div className="page-icon-badge">{step.icon}</div>
                  <h3 className="mt-3 text-base font-semibold text-white sm:mt-4">{t(step.key)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{t(`${step.key}_desc`)}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-8 sm:gap-3">
              <span className="page-chip">{t('factory_high_end_industrial_standard')}</span>
              <span className="page-chip">{t('cap_mfg_hot_induction')}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-20">
        <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
          <p className="page-kicker">{t('factory_gallery_title')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('factory_gallery_title')}</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 sm:text-base">{t('factory_gallery_subtitle')}</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-4">
            {[10, 15, 22, 23, 17, 18, 19, 8].map((imgNum, index) => (
              <div
                key={imgNum}
                className={`overflow-hidden rounded-[24px] border border-white bg-white shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:rounded-[28px] ${index >= 6 ? 'hidden sm:block' : ''}`}
              >
                <ResponsiveImage
                  src={`/factory/factory_${imgNum}.jpg`}
                  alt={`${t('factory_gallery_title')} ${imgNum}`}
                  width="1200"
                  height="900"
                  imgClassName="aspect-[4/3] w-full object-cover transition duration-700 hover:scale-105"
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
