import React from 'react';
import { Award, History, TrendingUp, Users } from 'lucide-react';
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
    <div className="page-canvas pt-24 pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-center">
            <div>
              <h1 className="apple-hero-title max-w-4xl text-white">{t('about_title')}</h1>
              <p className="apple-body mt-6 max-w-2xl text-slate-200">{t('about_desc')}</p>

              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                {stats.map((stat) => (
                  <div key={stat.label} className="rounded-[28px] border border-white/12 bg-white/10 p-5 backdrop-blur">
                    <div className="page-icon-badge">{stat.icon}</div>
                    <div className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-white">{stat.value}</div>
                    <div className="mt-2 text-sm font-semibold text-slate-200">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[36px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="overflow-hidden rounded-[28px]">
                <img
                  src="/factory/about-company.jpeg"
                  alt="Wanjin Manufacturing Facility"
                  width="1200"
                  height="800"
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

      <section className="page-shell mt-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          <div className="page-soft-card page-accent-line p-8 md:p-10">
            <p className="page-kicker">{t('company_intro')}</p>
            <h2 className="apple-section-title mt-4 text-slate-950">{t('company_intro')}</h2>
            <div className="apple-body mt-6 space-y-4 text-slate-600">
              <p>{t('about_para1')}</p>
              <p>{t('about_para2')}</p>
              <p>{t('about_para3')}</p>
            </div>
          </div>

          <div className="page-dark-card p-8 md:p-10">
            <p className="page-kicker-gold">{t('our_values')}</p>
            <h2 className="apple-section-title mt-4 text-white">{t('our_values')}</h2>
            <div className="mt-8 space-y-4">
              {valueKeys.map(([titleKey, descKey]) => (
                <div key={titleKey} className="rounded-[24px] border border-white/10 bg-white/10 p-5">
                  <h3 className="text-lg font-semibold text-white">{t(titleKey)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-200">{t(descKey)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-20">
        <div className="page-soft-card page-accent-line p-8 md:p-10">
          <p className="page-kicker">{t('our_history')}</p>
          <h2 className="apple-section-title mt-4 text-slate-950">{t('our_history')}</h2>

          <div className="relative mt-10">
            <div className="absolute bottom-2 left-4 top-2 w-px bg-[linear-gradient(180deg,rgba(250,204,21,0.95)_0%,rgba(18,55,101,0.24)_100%)] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-6">
              {timelineItems.map((item, index) => (
                <div key={item.date} className="relative grid gap-4 md:grid-cols-2 md:gap-10">
                  {index % 2 === 0 ? (
                    <>
                      <div className="pl-12 md:pl-0 md:pr-12 md:text-right">
                        <div className="page-white-card p-6">
                          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{item.date}</div>
                          <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                      <div className="hidden md:block" />
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block" />
                      <div className="pl-12 md:pl-12">
                        <div className="page-white-card p-6">
                          <div className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-500">{item.date}</div>
                          <h3 className="mt-3 text-xl font-semibold text-slate-950">{item.title}</h3>
                          <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.desc}</p>
                        </div>
                      </div>
                    </>
                  )}

                  <div className={`absolute left-4 top-8 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-white shadow-sm ${item.accent} md:left-1/2`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
