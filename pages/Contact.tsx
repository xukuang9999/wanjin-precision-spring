import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { AIImage } from '../components/AIImage';
import { useLanguage } from '../contexts/LanguageContext';

const px = (id: string, w = 800, h = 600) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&dpr=1`;

export const Contact: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 h-64 w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <AIImage
            prompt="Aerial view of modern industrial manufacturing facility, clean factory complex, professional"
            alt="Industrial Facility"
            fallbackSrc={px('236698', 1200, 400)}
            className="w-full h-full"
          />
        </div>
        <h1 className="text-4xl font-bold text-white relative z-10">{t('contact_title')}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Contact Form */}
          <div className="p-8 md:p-12 md:w-3/5">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{t('send_message')}</h2>
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_name')}</label>
                  <input type="text" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_phone')}</label>
                  <input type="tel" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_email')}</label>
                <input type="email" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('form_desc')}</label>
                <textarea rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"></textarea>
              </div>
              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition">
                {t('form_submit')}
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="bg-slate-50 p-8 md:p-12 md:w-2/5 border-l border-slate-100 flex flex-col justify-center">
            <h3 className="text-xl font-bold text-slate-900 mb-8">{t('contact_info')}</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('form_phone')}</div>
                  <div className="text-lg font-bold text-slate-900 font-mono">{t('phone_val')}</div>
                  <div className="text-xs text-slate-400">Manager Ma / 马经理</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('form_email')}</div>
                  <div className="text-lg font-bold text-slate-900 break-all">76088157@qq.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('address_label')}</div>
                  <div className="text-base text-slate-900">{t('address_val')}</div>
                </div>
              </div>
            </div>

            {/* WeChat Section */}
            <div className="mt-10 p-5 bg-white rounded-xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4 text-green-600" />
                <p className="text-sm font-semibold text-slate-700">{t('wechat_label')}</p>
              </div>
              <div className="w-28 h-28 bg-slate-100 mx-auto rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                <div className="grid grid-cols-3 gap-0.5 p-2 opacity-40">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className={`w-4 h-4 rounded-sm ${[0,1,3,4,5,7,8].includes(i) ? 'bg-slate-800' : 'bg-white'}`} />
                  ))}
                </div>
                <span className="text-[9px] text-slate-400 mt-1">WeChat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
