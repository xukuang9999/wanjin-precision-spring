import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                 <span className="text-slate-900 font-bold text-lg">W</span>
              </div>
              <h3 className="text-xl font-bold text-white">Wanjin Precision</h3>
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              {t('footer_desc')}
            </p>
            <div className="text-xs text-slate-500">
              Code: 91610125MA6UU9L314
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('contact_title')}</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span>{t('address_val')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>{t('phone_val')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>76088157@qq.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400 flex-shrink-0" />
                <span>Mon-Sat 8:00 - 18:00</span>
              </li>
            </ul>
          </div>

          {/* Quick Links / Map Placeholder */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">Location</h4>
            <div className="w-full h-40 bg-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-600 to-slate-900"></div>
               <MapPin className="w-8 h-8 text-white z-10" />
               <span className="text-xs absolute bottom-2 text-slate-500">Xi'an, Shaanxi, China</span>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Wanjin Precision Spring | {t('rights_reserved')}</p>
        </div>
      </div>
    </footer>
  );
};