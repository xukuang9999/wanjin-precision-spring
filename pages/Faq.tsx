import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { PageView } from '../types';
import { type Language } from '../utils/languages';

interface FaqProps {
  onNavigate: (page: PageView, language?: Language, slug?: string, search?: string) => void;
}

const FAQ_KEYS = [
  ['faq_q1', 'faq_a1'],
  ['faq_q2', 'faq_a2'],
  ['faq_q3', 'faq_a3'],
  ['faq_q4', 'faq_a4'],
  ['faq_q5', 'faq_a5'],
  ['faq_q6', 'faq_a6'],
  ['faq_q7', 'faq_a7'],
  ['faq_q8', 'faq_a8'],
  ['faq_q9', 'faq_a9'],
  ['faq_q10', 'faq_a10'],
  ['faq_q11', 'faq_a11'],
  ['faq_q12', 'faq_a12'],
] as const;

export const Faq: React.FC<FaqProps> = ({ onNavigate }) => {
  const { language, t } = useLanguage();

  return (
    <div className="page-canvas pt-20 pb-16 sm:pt-24 sm:pb-24">
      <section className="page-shell">
        <div className="page-hero-panel">
          <div className="page-hero-grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="max-w-4xl">
              <p className="page-kicker">{t('blog_questions_title')}</p>
              <h1 className="apple-hero-title mt-4 text-white">{t('nav_faq')}</h1>
              <p className="apple-body mt-4 max-w-3xl text-slate-200 sm:mt-6">{t('blog_questions_desc')}</p>
            </div>

            <div className="rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(250,204,21,0.12)_0%,rgba(255,255,255,0.08)_100%)] p-6 sm:rounded-[32px] sm:p-7">
              <p className="page-kicker-gold">{t('faq_title')}</p>
              <div className="mt-3 text-4xl font-semibold text-white">{FAQ_KEYS.length}</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-200">{t('email_us_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell mt-14 sm:mt-20">
        <div className="grid gap-5 sm:gap-6 lg:grid-cols-2">
          {FAQ_KEYS.map(([questionKey, answerKey], index) => (
            <article key={questionKey} className="page-soft-card page-accent-line p-6 sm:p-8">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                {t('nav_faq')} {index + 1}
              </div>
              <h2 className="mt-4 text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
                {t(questionKey)}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">{t(answerKey)}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-shell mt-14 sm:mt-20">
        <div className="page-dark-card p-6 sm:p-8 md:p-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-2xl font-bold text-white md:text-3xl">{t('contact_title')}</h2>
              <p className="mt-3 text-slate-300 leading-relaxed">{t('email_us_desc')}</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate(PageView.CONTACT, language)}
              className="page-secondary-button w-full sm:w-auto"
            >
              {t('btn_contact')} <ArrowRight className="page-button-icon h-4 w-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Faq;
