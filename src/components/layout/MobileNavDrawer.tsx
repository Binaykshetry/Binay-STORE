import React from 'react';
import { useUIStore } from '../../store/useUIStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Logo } from '../ui/Logo';
import { SEED_CATEGORIES } from '../../mocks/seed-data';
import {
  X,
  Sparkles,
  Zap,
  Tag,
  Store,
  ShieldAlert,
  User,
  ShoppingBag,
  Globe,
  HelpCircle
} from 'lucide-react';

export const MobileNavDrawer: React.FC = () => {
  const { isMobileNavOpen, setMobileNavOpen, navigate, openAuthModal } = useUIStore();
  const { language, toggleLanguage, t } = useLanguageStore();
  const { currentUser, loginAs } = useAuthStore();

  if (!isMobileNavOpen) return null;

  const handleNav = (action: () => void) => {
    action();
    setMobileNavOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
      <div
        onClick={() => setMobileNavOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-gray-50">
          <Logo size="sm" showSubtitle={false} />
          <button
            onClick={() => setMobileNavOpen(false)}
            className="p-1.5 text-gray-500 hover:text-gray-900 rounded-lg hover:bg-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 bg-primary-50/60 border-b border-primary-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs">
              {currentUser?.name.charAt(0) || 'G'}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{currentUser?.name || 'Guest User'}</p>
              <p className="text-[10px] text-primary-700 font-semibold uppercase">{currentUser?.role || 'Guest'}</p>
            </div>
          </div>

          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1 text-xs font-bold text-gray-700 bg-white px-2.5 py-1 rounded-full border border-gray-200 shadow-2xs"
          >
            <Globe className="w-3.5 h-3.5 text-primary-600" />
            <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs">
          {/* Main sections */}
          <div>
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">
              Browse Sections
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => handleNav(() => navigate('home'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-semibold text-gray-800 flex items-center gap-2"
              >
                <span>🏠 {t('home')}</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('catalog', { categorySlug: 'nepali-handicrafts' }))}
                className="w-full text-left px-3 py-2 rounded-lg bg-red-50 text-primary-700 font-bold flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                <span>{t('nepaliSpecials')}</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('deals'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-red-600 flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>{t('flashDeals')}</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('bazaar'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-emerald-700 flex items-center gap-2"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Hamro Bazaar (Classifieds)</span>
              </button>
              <button
                onClick={() => handleNav(() => openAuthModal('login', 'password'))}
                className="w-full text-left px-3 py-2 rounded-lg bg-primary-600 text-white font-bold flex items-center justify-between"
              >
                <span>🔑 Sign In / Register</span>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded">Access</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('brand_portal'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-amber-700 flex items-center gap-2"
              >
                <span>🏷️ Brand Manager Portal</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('helper_portal'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-blue-700 flex items-center gap-2"
              >
                <span>🤝 Helper Support Desk</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('staff_profile'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-purple-700 flex items-center gap-2"
              >
                <span>🎖️ Staff Profile & Ranks</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('staff_login'))}
                className="w-full text-left px-3 py-2 rounded-lg bg-slate-900 text-gold-300 font-bold flex items-center justify-between"
              >
                <span>🔒 Staff Operations Portal</span>
                <span className="text-[9px] bg-red-600 text-white font-mono px-1 py-0.2 rounded font-black">STAFF</span>
              </button>
              <button
                onClick={() => handleNav(() => navigate('seller_center'))}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 font-bold text-emerald-700 flex items-center gap-2"
              >
                <span>🏪 Seller Center</span>
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">
              Shop Categories
            </h4>
            <div className="space-y-1">
              {SEED_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleNav(() => navigate('catalog', { categorySlug: cat.slug }))}
                  className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-gray-100 text-gray-700 flex items-center justify-between"
                >
                  <span>{language === 'ne' ? cat.nameNe : cat.nameEn}</span>
                  <span className="text-[10px] text-gray-400">({cat.itemCount})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Demo Personas */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px] mb-2">
              Switch Account Role
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => handleNav(() => loginAs('owner'))}
                className="p-2 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 text-left font-bold"
              >
                👑 Owner
              </button>
              <button
                onClick={() => handleNav(() => loginAs('sradmin'))}
                className="p-2 rounded-lg bg-red-50 text-red-900 border border-red-200 text-left font-bold"
              >
                🛡️ Sr. Admin
              </button>
              <button
                onClick={() => handleNav(() => loginAs('brand_manager'))}
                className="p-2 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-left font-bold"
              >
                🏷️ Brand Mgr
              </button>
              <button
                onClick={() => handleNav(() => loginAs('helper'))}
                className="p-2 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 text-left font-bold"
              >
                🤝 Helper
              </button>
              <button
                onClick={() => handleNav(() => loginAs('seller'))}
                className="p-2 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 text-left font-bold"
              >
                🏪 Business/Seller
              </button>
              <button
                onClick={() => handleNav(() => loginAs('user'))}
                className="p-2 rounded-lg bg-gray-100 text-gray-900 border border-gray-200 text-left font-bold"
              >
                👤 Normal User
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <span>Kathmandu, Nepal</span>
          <button onClick={() => handleNav(() => navigate('faq'))} className="flex items-center gap-1 text-primary-600 font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Help</span>
          </button>
        </div>
      </div>
    </div>
  );
};
