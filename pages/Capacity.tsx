import React from 'react';
import { AIImage } from '../components/AIImage';
import { Microscope, Settings, Shield, Zap, Target, Award, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
const ux = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const Capacity: React.FC = () => {
  const { t } = useLanguage();

  const equipment = [
    {
      zh: '数控成型机',
      en: 'CNC Forming Machine',
      desc: 'Automated CNC coiling machines ensure high dimensional consistency and repeatability for complex spring geometries.',
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      tag: 'CNC',
      highlight: false,
    },
    {
      zh: '立式弹簧疲劳喷丸机',
      en: 'Vertical Fatigue Shot Peening',
      desc: 'Vertical fatigue shot peening induces compressive stress on spring surfaces, significantly improving fatigue life and maximum load capacity.',
      icon: <Zap className="w-6 h-6 text-blue-600" />,
      tag: 'Surface',
      highlight: false,
    },
    {
      zh: '双端面磨簧机',
      en: 'Double-End Face Grinder',
      desc: 'Simultaneous grinding of both spring ends ensures precise flatness, parallelism, and consistent free length across every production batch.',
      icon: <Target className="w-6 h-6 text-blue-600" />,
      tag: 'Precision',
      highlight: false,
    },
    {
      zh: '磁力探伤设备',
      en: 'Magnetic Flaw Detection',
      desc: 'Non-destructive magnetic particle inspection detects surface and sub-surface defects invisible to the naked eye — critical for military and safety applications.',
      icon: <Microscope className="w-6 h-6 text-blue-600" />,
      tag: 'NDT',
      highlight: false,
    },
    {
      zh: '专利大型强压/静压设备',
      en: 'Patented Presetting & Static Pressure Equipment',
      desc: 'Proprietary presetting equipment eliminates permanent set and stabilizes spring performance under extreme cyclic loading — a unique process advantage.',
      icon: <Award className="w-6 h-6 text-blue-600" />,
      tag: 'Patented',
      highlight: true,
    },
    {
      zh: '双数显弹簧检测设备',
      en: 'Dual Digital Display Load Tester',
      desc: 'High-precision load and displacement testing equipment with dual digital readouts for accurate spring rate, free length, and working load verification.',
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      tag: 'Testing',
      highlight: false,
    },
  ];

  const processes = [
    {
      zh: '异形簧',
      en: 'Special-Shaped Springs',
      steps: ['选料', '调机', '打样', '绕制', '热处理', '检验'],
      stepsEn: ['Material Select', 'Machine Setup', 'Prototyping', 'Coiling', 'Heat Treatment', 'Inspection'],
    },
    {
      zh: '冷卷压簧',
      en: 'Cold-Coiled Compression Springs',
      steps: ['选料', '调机', '绕制', '热处理', '磨簧', '去毛刺', '检验'],
      stepsEn: ['Material Select', 'Machine Setup', 'Coiling', 'Heat Treatment', 'End Grinding', 'Deburring', 'Inspection'],
    },
    {
      zh: '热卷弹簧',
      en: 'Hot-Coiled Springs (Medium-Frequency Induction)',
      steps: ['中频炉', '淬火/回火', '磨头', '气割', '粗磨', '强压', '细磨', '探伤', '测力'],
      stepsEn: ['Induction Furnace', 'Quench/Temper', 'End Grind', 'Gas Cut', 'Rough Grind', 'Presetting', 'Fine Grind', 'Flaw Detect', 'Load Test'],
    },
  ];

  return (
    <div className="pt-20 min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h1 className="text-4xl font-bold text-slate-900 mb-6">{t('capacity_title')}</h1>
            <p className="text-lg text-slate-600 leading-relaxed">
              {t('cap_intro_desc')}
            </p>
          </div>
          <div className="md:w-1/2 h-64 rounded-2xl overflow-hidden shadow-lg">
            <AIImage
              prompt="High-speed CNC spring coiling machine in operation, precise wire forming, clean modern factory environment, blue and silver tones, 8k resolution"
              alt="Production Line"
              fallbackSrc={px('2760241', 800, 400)}
              className="w-full h-full"
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
                <div className="text-xs text-slate-400 font-medium">Dual Certified</div>
                <div className="text-sm font-bold text-white">ISO 9001 + GJB 9001C</div>
              </div>
            </div>
          </div>
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
                <h3 className="font-bold text-slate-900 mb-2">CNC Cold Coiling</h3>
                <p className="text-sm text-slate-500">Auto CNC machines produce cold-coiled and special-shaped springs with ±0.05 mm dimensional tolerance.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">Medium-Freq. Hot Coiling</h3>
                <p className="text-sm text-slate-500">NW China's only medium-frequency induction furnace for large-wire hot-coil springs used in heavy machinery and defense.</p>
              </div>
            </div>

            <div className="h-48 rounded-xl overflow-hidden">
              <AIImage
                prompt="Industrial shot blasting machine in operation, metal parts being treated with steel grit, sparks and metallic dust, heavy machinery, cinematic lighting, dramatic factory atmosphere, 8k"
                alt="Shot Blasting"
                fallbackSrc={px('2760243', 500)}
                className="w-full h-full"
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
                <h3 className="font-bold text-slate-900 mb-2">Dual QMS Certification</h3>
                <p className="text-sm text-slate-500">ISO 9001:2015 (civil) and GJB 9001C-2017 (military) — both certified and actively audited.</p>
              </div>
              <div className="border border-slate-100 rounded-xl p-5 hover:shadow-md transition">
                <h3 className="font-bold text-slate-900 mb-2">Full-Batch NDT</h3>
                <p className="text-sm text-slate-500">Magnetic flaw detection and dual digital-display load/displacement testing performed on all production lots.</p>
              </div>
            </div>

            <div className="h-48 rounded-xl overflow-hidden">
              <AIImage
                prompt="Advanced digital spring load testing machine, showing dual digital displays, precision measurement in a high-tech quality control lab, 8k resolution"
                alt="Testing Equipment"
                fallbackSrc={px('2280571', 500, 350)}
                className="w-full h-full"
              />
            </div>
          </div>

        </div>

        {/* Key Equipment */}
        <div>
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('cap_equipment_title')}</h2>
            <p className="text-slate-500 text-sm">All major equipment meets international advanced standards · 主要设备达到国际先进水平</p>
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
                    {eq.tag}
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 mb-1 text-sm leading-snug">{eq.en}</h3>
                <p className="text-xs text-slate-400 mb-3 font-medium">{eq.zh}</p>
                <p className="text-sm text-slate-600 leading-relaxed">{eq.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Production Process Flows */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">{t('process_title')}</h2>
          <p className="text-slate-500 text-sm text-center mb-12">Three distinct manufacturing flows for different spring types · 三大工艺流程</p>
          <div className="space-y-12">
            {processes.map((proc, pIdx) => (
              <div key={pIdx} className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {pIdx + 1}
                  </div>
                  <div>
                    <span className="font-bold text-slate-900">{proc.en}</span>
                    <span className="text-slate-400 text-sm ml-2">/ {proc.zh}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {proc.steps.map((step, sIdx) => (
                    <React.Fragment key={sIdx}>
                      <div className="flex flex-col items-center text-center">
                        <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm whitespace-nowrap">
                          {proc.stepsEn[sIdx]}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 font-medium">{step}</div>
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

        {/* Quality Metrics */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white">
          <h2 className="text-2xl font-bold mb-2 text-center">{t('cap_metrics_title')}</h2>
          <p className="text-slate-400 text-center mb-10 text-sm">
            Annual performance targets per ISO 9001:2015 & GJB 9001C-2017 quality system records
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-white mb-3">≥99%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_pass_label')}</div>
              <p className="text-slate-400 text-xs">Per QMS target 合格率目标</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-white mb-3">≥95%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_delivery_label')}</div>
              <p className="text-slate-400 text-xs">On-time delivery 履约率目标</p>
            </div>
            <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
              <div className="text-5xl font-bold text-white mb-3">98%</div>
              <div className="text-blue-400 font-semibold text-sm mb-1">{t('cap_metric_satisfaction_label')}</div>
              <p className="text-slate-400 text-xs">Actual rate 实际满意度</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
