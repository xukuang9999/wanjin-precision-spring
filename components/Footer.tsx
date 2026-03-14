import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const phoneHref = 'tel:+8618729383359';
  const emailHref = 'mailto:sales@wanjinspring.com';

  return (
    <footer className="bg-brand-500 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                <span className="text-slate-900 font-bold text-lg">W</span>
              </div>
              <h3 className="text-xl font-bold text-white">{t('company_name')}</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="text-xs text-slate-600">
              Code: 91610125MA6UU9L314
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('contact_title')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 mt-0.5 flex-shrink-0" />
                <span>{t('address_val')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <a href={phoneHref} className="hover:text-white transition">
                  {t('phone_val')}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <a href={emailHref} className="hover:text-white transition">
                  sales@wanjinspring.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500 flex-shrink-0" />
                <span>{t('working_hours')}</span>
              </li>
            </ul>
          </div>

          {/* Quick Links / Map Placeholder */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('location_label')}</h4>
            <div className="w-full h-40 bg-brand-600 rounded-sm flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-600 to-slate-900"></div>
              <MapPin className="w-8 h-8 text-white z-10" />
              <span className="text-xs absolute bottom-2 text-slate-600">{t('location_val_short')}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-600">
          <p>&copy; {new Date().getFullYear()} {t('company_name_en')} | {t('rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};
