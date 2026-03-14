import React from 'react';
import { Phone, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Contact: React.FC = () => {
  const { t } = useLanguage();
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="bg-slate-900 h-64 w-full flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="/factory/factory_20.jpg"
            alt="Industrial Facility"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <h1 className="text-4xl font-bold text-white relative z-10">{t('contact_title')}</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20 pb-20">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

          {/* Replacement for Contact Form */}
          <div className="p-8 md:p-12 md:w-3/5 flex flex-col justify-center items-center text-center">
            <div className="p-4 bg-blue-50 rounded-full mb-6">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('email_us_title')}</h2>
            <p className="text-slate-600 mb-8 max-w-md">
              {t('email_us_desc')}
            </p>
            <a 
              href={emailHref}
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Mail className="w-5 h-5" />
              {t('btn_send_email')}
            </a>
            <p className="mt-6 text-sm text-slate-400">
              {t('response_time_note')}
            </p>
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
                  <a href={phoneHref} className="text-lg font-bold text-slate-900 font-mono hover:text-blue-600 transition">
                    {t('phone_val')}
                  </a>
                  <div className="text-xs text-slate-400">{t('contact_manager')}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm text-blue-600">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-sm text-slate-500 font-medium">{t('form_email')}</div>
                  <a href={emailHref} className="text-lg font-bold text-slate-900 break-all hover:text-blue-600 transition">
                    sales@wanjinspring.com
                  </a>
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
              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden border border-slate-200 p-2 bg-white">
                <img 
                  src="/factory/wechat_qr.png" 
                  alt="WeChat QR Code" 
                  className="w-full h-full object-contain"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
