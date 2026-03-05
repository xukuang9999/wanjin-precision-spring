import React from 'react';
import { ArrowRight, CheckCircle2, Factory, Zap, ShieldCheck, Microscope, Cpu, Wrench, Cog } from 'lucide-react';
import { PageView } from '../types';
import { AIImage } from '../components/AIImage';
import { useLanguage } from '../contexts/LanguageContext';

// Verified Pexels image helpers
const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;
const ux = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

interface HomeProps {
  onNavigate: (page: PageView) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center">
        <div className="absolute inset-0 z-0">
          <AIImage
            prompt="Close up cinematic shot of shiny metal industrial springs, clean factory background, depth of field, blue and silver tones, 8k resolution"
            alt="Industrial Springs"
            fallbackSrc={px('2760244', 1920, 1080)}
            className="w-full h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {t('hero_title')} <br />
              <span className="text-slate-300">{t('hero_subtitle')}</span>
            </h1>
            <p className="text-xl text-slate-200 mb-8 font-light">
              {t('hero_desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate(PageView.PRODUCTS)}
                className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-slate-100 transition flex items-center justify-center gap-2"
              >
                {t('btn_explore')} <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => onNavigate(PageView.CONTACT)}
                className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-full font-semibold hover:bg-white/10 transition backdrop-blur-sm"
              >
                {t('btn_contact')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Highlights Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: <Factory className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_professional_title',
              descKey: 'feat_professional_desc',
            },
            {
              icon: <ShieldCheck className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_certified_title',
              descKey: 'feat_certified_desc',
            },
            {
              icon: <Zap className="w-8 h-8 text-blue-600" />,
              titleKey: 'feat_wide_app_title',
              descKey: 'feat_wide_app_desc',
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-1 transition-transform duration-300">
              <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit">{item.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{t(item.titleKey)}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products Preview */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('core_products')}</h2>
          <div className="w-16 h-1 bg-slate-900 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: "碟形弹簧 Disc Springs",
              prompt: "Macro photography of high-quality industrial disc springs (Belleville washers) stacked precisely, polished stainless steel material, cinematic lighting, 8k resolution, clean background",
              fallback: px('14452000', 400, 400)
            },
            {
              name: "压缩弹簧 Compression Springs",
              prompt: "Macro shot of a heavy duty steel compression spring, industrial manufacturing, clean studio lighting, mechanical engineering precision, 8k",
              fallback: px('2760241', 400, 400)
            },
            {
              name: "热卷弹簧 Hot Coil Springs",
              prompt: "Large diameter hot coil spring for heavy machinery, orange-hot metallic texture, industrial manufacturing plant background, professional photography, 8k",
              fallback: px('2760243', 400, 400)
            },
            {
              name: "汽车悬挂 Auto Suspension",
              prompt: "Modern automotive suspension shock absorber and red coil spring, automotive engineering, high detail, clean professional studio shot, 8k",
              fallback: px('2244746', 400, 400)
            },
          ].map((product, idx) => (
            <div key={idx} className="group cursor-pointer" onClick={() => onNavigate(PageView.PRODUCTS)}>
              <div className="aspect-square rounded-2xl overflow-hidden mb-4 shadow-lg border border-slate-100">
                <AIImage
                  prompt={product.prompt}
                  alt={product.name}
                  fallbackSrc={product.fallback}
                  className="w-full h-full"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{product.name}</h3>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate(PageView.PRODUCTS)}
            className="text-slate-600 font-medium hover:text-slate-900 flex items-center gap-2 mx-auto"
          >
            {t('view_all')} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Microscope className="w-6 h-6 text-slate-700" />
            <h2 className="text-2xl font-bold text-slate-900">{t('mfg_excellence')}</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Large: raw materials */}
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden shadow-lg h-96 group">
              <AIImage
                prompt="Macro photography of steel wire raw material texture, industrial metal coils, high detail"
                alt="Raw Materials"
                fallbackSrc={px('2760244', 600, 600)}
                className="w-full h-full"
              />
              <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="font-bold">{t('premium_materials')}</span>
              </div>
            </div>
            {/* Logistics */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <AIImage
                prompt="Commercial cargo ship at a modern container port, global export and trade logistics, sunrise lighting, cinematic atmosphere, 8k"
                alt="Global Logistics"
                fallbackSrc={px('1267337', 300, 200)}
                className="w-full h-full"
              />
            </div>
            {/* Measurement */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg group">
              <AIImage
                prompt="Engineer hands using caliper measuring spring diameter, close up, blue gloves, laboratory"
                alt="Precision Measurement"
                fallbackSrc={px('2280571', 300, 200)}
                className="w-full h-full"
              />
            </div>
            {/* Modern facility */}
            <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-lg h-48 group">
              <AIImage
                prompt="Clean modern factory floor with automated machinery, bokeh background, professional lighting"
                alt="Modern Facility"
                fallbackSrc={px('3862129', 600, 300)}
                className="w-full h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Partner Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('trusted_by')}</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t('client_section_desc')}
              </p>
              <ul className="space-y-3">
                {['China XD Group Supplier', 'Automotive OEM', 'Custom Industrial Machinery'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Zap className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">XD Group</span>
                <span className="text-xs text-slate-400">High Voltage</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Cog className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">Automotive</span>
                <span className="text-xs text-slate-400">OEM Parts</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Wrench className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">Heavy Ind.</span>
                <span className="text-xs text-slate-400">Machinery</span>
              </div>
              <div className="bg-slate-50 h-32 rounded-xl border border-slate-100 flex flex-col items-center justify-center gap-2 p-4 hover:border-slate-300 transition">
                <Cpu className="w-7 h-7 text-slate-400" />
                <span className="text-sm font-semibold text-slate-500">Electronics</span>
                <span className="text-xs text-slate-400">Power Equip.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
