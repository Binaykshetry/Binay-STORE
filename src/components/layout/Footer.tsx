import React from 'react';
import { Logo } from '../ui/Logo';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useUIStore } from '../../store/useUIStore';
import { ShieldCheck, Truck, RefreshCw, Headphones, MapPin, Phone, Mail, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { navigate } = useUIStore();

  return (
    <footer className="bg-slate-900 text-gray-300 text-xs mt-16 border-t border-slate-800">
      {/* Trust Badges Strip */}
      <div className="bg-slate-950/80 border-b border-slate-800 py-6 px-4">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-900/40 border border-primary-700/50 flex items-center justify-center text-primary-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">77 Districts Delivery</h4>
              <p className="text-[11px] text-gray-400">Kathmandu valley fast 24h & nationwide</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-900/40 border border-emerald-700/50 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">100% Genuine & Safe</h4>
              <p className="text-[11px] text-gray-400">Verified Nepali artisans & sellers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-900/40 border border-blue-700/50 flex items-center justify-center text-blue-400 shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">7 Days Easy Return</h4>
              <p className="text-[11px] text-gray-400">Hassle-free replacement & refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-700/50 flex items-center justify-center text-amber-400 shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-xs sm:text-sm">Dedicated Nepal Support</h4>
              <p className="text-[11px] text-gray-400">Phone & WhatsApp +977-1-4412345</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <Logo size="lg" />
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm">
              NepaleseStore is Nepal’s premier online bazaar and multi-vendor marketplace, dedicated to authentic Nepali handicrafts, organic mountain teas, genuine tech gadgets, and direct classifieds.
            </p>

            <div className="flex flex-col gap-2 text-xs text-gray-400 mt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                <span>Lazimpat, Ward 3, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+977 1 4412345 / 9801122334 (Mon - Sat, 9 AM - 7 PM)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>support@nepalesestore.com.np</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Shop Categories</h5>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>
                <button onClick={() => navigate('catalog', { categorySlug: 'nepali-handicrafts' })} className="hover:text-white transition-colors">
                  Nepali Handicrafts
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { categorySlug: 'electronics' })} className="hover:text-white transition-colors">
                  Electronics & Gadgets
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { categorySlug: 'mens-fashion' })} className="hover:text-white transition-colors">
                  Men’s Fashion & Daura
                </button>
              </li>
              <li>
                <button onClick={() => navigate('catalog', { categorySlug: 'groceries' })} className="hover:text-white transition-colors">
                  Ilam Tea & Spices
                </button>
              </li>
              <li>
                <button onClick={() => navigate('deals')} className="hover:text-white transition-colors text-gold-400 font-semibold">
                  Dashain Flash Deals
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Customer Care</h5>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>
                <button onClick={() => navigate('account')} className="hover:text-white transition-colors">
                  Track My Order
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  7-Day Return Policy
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-white transition-colors">
                  Delivery Zones & Rates
                </button>
              </li>
              <li>
                <button onClick={() => navigate('contact')} className="hover:text-white transition-colors">
                  Contact Support
                </button>
              </li>
              <li>
                <button onClick={() => navigate('faq')} className="hover:text-white transition-colors">
                  Help & FAQs
                </button>
              </li>
            </ul>
          </div>

          {/* Marketplace & Business */}
          <div>
            <h5 className="font-bold text-white text-sm mb-3">Marketplace & More</h5>
            <ul className="flex flex-col gap-2 text-gray-400">
              <li>
                <button onClick={() => navigate('seller_center')} className="hover:text-white transition-colors text-primary-400 font-semibold">
                  Become a Seller
                </button>
              </li>
              <li>
                <button onClick={() => navigate('bazaar')} className="hover:text-white transition-colors text-emerald-400 font-semibold">
                  Hamro Bazaar (Free Ads)
                </button>
              </li>
              <li>
                <button onClick={() => navigate('admin_panel')} className="hover:text-white transition-colors">
                  Admin & Moderation
                </button>
              </li>
              <li>
                <button onClick={() => navigate('staff_profile')} className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <span>Staff Profile & Ranks</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('staff_login')} className="hover:text-gold-400 text-slate-400 transition-colors flex items-center gap-1 font-mono text-[11px]">
                  <span>🔒 Staff Operations Portal</span>
                </button>
              </li>
              <li>
                <button onClick={() => navigate('about')} className="hover:text-white transition-colors">
                  Privacy Policy & Terms
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Accepted Payment Gateways Strip */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="text-gray-400 text-xs font-semibold">Supported Payments in Nepal:</span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded bg-slate-800 text-emerald-400 font-black text-[11px] border border-slate-700">
                eSewa
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-purple-400 font-black text-[11px] border border-slate-700">
                Khalti
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-red-400 font-black text-[11px] border border-slate-700">
                Fonepay QR
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-amber-400 font-bold text-[11px] border border-slate-700">
                Cash on Delivery (COD)
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-800 text-blue-400 font-semibold text-[11px] border border-slate-700">
                Bank Transfer
              </span>
            </div>
          </div>

          <div className="text-[11px] text-gray-500 text-center md:text-right">
            PAN: 609823411 | Company Reg: 184920/078/079 | Nepal Rastra Bank Guidelines Compliant
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-slate-800/60 text-center text-[11px] text-gray-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© {new Date().getFullYear()} NepaleseStore.np — All rights reserved.</span>
          <span className="flex items-center gap-1 text-gray-400">
            Crafted with pride in Kathmandu, Nepal 🇳🇵
          </span>
        </div>
      </div>
    </footer>
  );
};
