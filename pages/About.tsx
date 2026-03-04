import React from 'react';
import { AIImage } from '../components/AIImage';
import { Award, TrendingUp, Users, History } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
const ux = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20 pb-20 bg-white">
      {/* Header */}
      <div className="bg-slate-900 py-20 text-white mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-4">{t('about_title')}</h1>
          <p className="text-slate-400 max-w-2xl">
            Xi'an Wanjin Precision Spring Co., Ltd. is committed to becoming a leader in the field of precision elastic element manufacturing. We manufacture not just springs, but reliability.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">

        {/* Company Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('company_intro')}</h2>
            <div className="prose prose-slate text-slate-600">
              <p className="mb-4">{t('about_para1')}</p>
              <p className="mb-4">{t('about_para2')}</p>
              <p>{t('about_para3')}</p>
            </div>
          </div>
          <div className="h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <AIImage
              prompt="Modern small factory exterior, clean industrial park in China, blue sky, professional building sign, 8k"
              alt="Factory Exterior"
              fallbackSrc={ux('1513828583688-c52646db42da', 800)}
              className="w-full h-full"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <History className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">1982</div>
            <div className="text-sm text-slate-500">{t('stat_founded')}</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <Users className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">20+</div>
            <div className="text-sm text-slate-500">{t('stat_experts')}</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <Award className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">ISO+GJB</div>
            <div className="text-sm text-slate-500">{t('stat_certifications')}</div>
          </div>
          <div className="text-center p-6 bg-slate-50 rounded-xl">
            <TrendingUp className="w-8 h-8 mx-auto text-blue-600 mb-3" />
            <div className="text-3xl font-bold text-slate-900 mb-1">≥99%</div>
            <div className="text-sm text-slate-500">{t('stat_regional')}</div>
          </div>
        </div>

        {/* History / Timeline */}
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-12 text-center">{t('our_history')}</h2>
          <div className="relative">
            {/* Vertical line: left-4 on mobile, centered on desktop */}
            <div className="absolute top-2 bottom-2 w-0.5 bg-slate-200 left-4 md:left-1/2 md:-translate-x-1/2"></div>

            <div className="space-y-10">
              {/* April 2018 — LEFT on desktop */}
              <div className="relative grid grid-cols-1 md:grid-cols-2">
                <div className="pl-12 md:pl-0 md:pr-12 md:text-right">
                  <span className="text-blue-600 font-bold block mb-1">{t('timeline_april_2018')}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('timeline_establishment')}</h3>
                  <p className="text-slate-500 text-sm">{t('timeline_establishment_desc')}</p>
                </div>
                <div className="hidden md:block"></div>
                <div className="absolute left-4 md:left-1/2 top-1 w-4 h-4 rounded-full bg-blue-600 border-4 border-white shadow-sm -translate-x-1/2"></div>
              </div>

              {/* 2022 — RIGHT on desktop */}
              <div className="relative grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:block"></div>
                <div className="pl-12 md:pl-12">
                  <span className="text-slate-500 font-bold block mb-1">{t('timeline_2022')}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('timeline_expansion')}</h3>
                  <p className="text-slate-500 text-sm">{t('timeline_expansion_desc')}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm -translate-x-1/2"></div>
              </div>

              {/* Oct 2023 — LEFT on desktop */}
              <div className="relative grid grid-cols-1 md:grid-cols-2">
                <div className="pl-12 md:pl-0 md:pr-12 md:text-right">
                  <span className="text-slate-500 font-bold block mb-1">{t('timeline_oct_2023')}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('timeline_milestone')}</h3>
                  <p className="text-slate-500 text-sm">{t('timeline_milestone_desc')}</p>
                </div>
                <div className="hidden md:block"></div>
                <div className="absolute left-4 md:left-1/2 top-1 w-4 h-4 rounded-full bg-slate-300 border-4 border-white shadow-sm -translate-x-1/2"></div>
              </div>

              {/* 2024-2025 — RIGHT on desktop */}
              <div className="relative grid grid-cols-1 md:grid-cols-2">
                <div className="hidden md:block"></div>
                <div className="pl-12 md:pl-12">
                  <span className="text-slate-900 font-bold block mb-1">{t('timeline_2024_2025')}</span>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{t('timeline_innovation')}</h3>
                  <p className="text-slate-500 text-sm">{t('timeline_innovation_desc')}</p>
                </div>
                <div className="absolute left-4 md:left-1/2 top-1 w-4 h-4 rounded-full bg-slate-900 border-4 border-white shadow-sm -translate-x-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Culture / Values */}
        <div className="bg-slate-50 rounded-3xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">{t('our_values')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-lg font-bold text-slate-900 mb-2">{t('val_refined')}</div>
                <p className="text-sm text-slate-600">{t('val_refined_desc')}</p>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 mb-2">{t('val_integrity')}</div>
                <p className="text-sm text-slate-600">{t('val_integrity_desc')}</p>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 mb-2">{t('val_responsibility')}</div>
                <p className="text-sm text-slate-600">{t('val_responsibility_desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
