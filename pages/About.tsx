import React from 'react';
import { Award, History, TrendingUp, Users } from 'lucide-react';
import { ResponsiveImage } from '../components/ResponsiveImage';
import { useLanguage } from '../contexts/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { icon: <History className="h-5 w-5" />, value: '1982', label: t('stat_founded') },
    { icon: <Users className="h-5 w-5" />, value: '20+', label: t('stat_experts') },
    { icon: <Award className="h-5 w-5" />, value: 'ISO 9001', label: t('stat_certifications') },
    { icon: <TrendingUp className="h-5 w-5" />, value: '≥99%', label: t('stat_regional') },
  ];

  const timelineItems = [
    {
      date: t('timeline_april_2018'),
      title: t('timeline_establishment'),
      desc: t('timeline_establishment_desc'),
      accent: 'bg-accent-400',
    },
    {
      date: t('timeline_2022'),
      title: t('timeline_expansion'),
      desc: t('timeline_expansion_desc'),
      accent: 'bg-brand-400',
    },
    {
      date: t('timeline_oct_2023'),
      title: t('timeline_milestone'),
      desc: t('timeline_milestone_desc'),
      accent: 'bg-slate-400',
    },
    {
      date: t('timeline_2024_2025'),
      title: t('timeline_innovation'),
      desc: t('timeline_innovation_desc'),
      accent: 'bg-brand-500',
    },
  ];

  const valueKeys = [
    ['val_refined', 'val_refined_desc'],
    ['val_integrity', 'val_integrity_desc'],
    ['val_responsibility', 'val_responsibility_desc'],
  ] as const;

  return (
    <div className="page-canvas pt-20 pb-16 sm:pt-24 sm:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('about_title')}</h1>
              <p className="apple-body mt-4 max-w-2xl text-slate-200 sm:mt-6">{t('about_desc')}</p>

              <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[24px] border border-white/12 bg-white/10 p-4 backdrop-blur sm:rounded-[28px] sm:p-5">
                    <div className="page-icon-badge">{stat.icon}</div>
                    <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white sm:mt-5 sm:text-3xl">{stat.value}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[30px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:rounded-[36px] sm:p-4">
              <div className="overflow-hidden rounded-[24px] sm:rounded-[28px]">
                <ResponsiveImage
                  src="/factory/about-company.jpeg"
                  alt={t('about_title')}
                  width="1200"
                  height="800"
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

      <section className="page-shell page-deferred-section mt-14 sm:mt-20">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
            <p className="page-kicker">{t('company_intro')}</p>
            <h2 className="apple-section-title mt-4 text-slate-950">{t('company_intro')}</h2>
            <div className="apple-body mt-5 space-y-3 text-slate-600 sm:mt-6 sm:space-y-4">
              <p>{t('about_para1')}</p>
              <p>{t('about_para2')}</p>
              <p>{t('about_para3')}</p>
            </div>
          </div>

          <div className="page-dark-card p-6 sm:p-8 md:p-10">
            <p className="page-kicker-gold">{t('our_values')}</p>
            <h2 className="apple-section-title mt-4 text-white">{t('our_values')}</h2>
            <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
              {valueKeys.map(([titleKey, descKey]) => (
                <div key={titleKey} className="rounded-[20px] border border-white/10 bg-white/10 p-4 sm:rounded-[24px] sm:p-5">
                  <h3 className="text-base font-semibold text-white sm:text-lg">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell page-deferred-section mt-14 sm:mt-20">
        <div className="page-soft-card page-accent-line p-6 sm:p-8 md:p-10">
          <p className="page-kicker">{t('our_history')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('our_history')}</h2>

          <div className="relative mt-8 sm:mt-10">
            <div className="absolute bottom-1.5 left-3 top-1.5 w-px bg-[linear-gradient(180deg,rgba(250,204,21,0.95)_0%,rgba(18,55,101,0.24)_100%)] sm:left-4 sm:bottom-2 sm:top-2 md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-4 sm:space-y-6">
              {timelineItems.map((item, index) => (
                <div key={item.date} className="relative grid gap-3 sm:gap-4 md:grid-cols-2 md:gap-8 lg:gap-10">
                  {index % 2 === 0 ? (
                    <>
                      <div className="pl-10 sm:pl-12 md:pl-0 md:pr-10 lg:pr-12 md:text-right">
                        <div className="page-white-card p-5 sm:p-6">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 sm:text-sm sm:tracking-[0.2em]">{item.date}</div>
                          <h3 className="mt-3 text-lg font-semibold text-slate-950 sm:text-xl">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="pl-10 sm:pl-12 md:pl-10 lg:pl-12">
                        <div className="page-white-card p-5 sm:p-6">
                          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500 sm:text-sm sm:tracking-[0.2em]">{item.date}</div>
                          <h3 className="mt-3 text-lg font-semibold text-slate-950 sm:text-xl">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className={`absolute left-3 top-7 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-[3px] border-white shadow-sm sm:left-4 sm:top-8 sm:h-4 sm:w-4 sm:border-4 ${item.accent} md:left-1/2`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
