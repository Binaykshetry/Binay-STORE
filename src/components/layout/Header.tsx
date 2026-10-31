import React, { useState, useEffect, useRef } from 'react';
import { Logo } from '../ui/Logo';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import { productService } from '../../services/productService';
import { Product } from '../../types/models';
import { formatNPR } from '../../lib/format';
import {
  Search,
  ShoppingBag,
  Heart,
  Globe,
  User as UserIcon,
  Menu,
  ChevronDown,
  Sparkles,
  Zap,
  Tag,
  ShieldCheck,
  Truck,
  Scale,
  Award,
  Store,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const { language, toggleLanguage, t } = useLanguageStore();
  const { getItemCount, getSubtotal, setMiniCartOpen } = useCartStore();
  const { currentUser, loginAs, logout, wishlistProductIds } = useAuthStore();
  const { navigate, setMobileNavOpen, currentPage, currentCategorySlug, openAuthModal } = useUIStore();

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced search autocomplete
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      const results = await productService.search(query);
      setSuggestions(results.slice(0, 5));
    }, 180);
    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearchFocused(false);
      navigate('catalog', { search: query.trim() });
    }
  };

  const handleSuggestionClick = (product: Product) => {
    setIsSearchFocused(false);
    setQuery('');
    navigate('product_detail', { productSlug: product.slug });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-gradient-to-r from-primary-700 via-primary-600 to-secondary-700 text-white text-[11px] sm:text-xs py-1.5 px-4 font-medium flex items-center justify-between">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="bg-gold-500 text-slate-900 text-[10px] font-black px-1.5 py-0.2 rounded">
              OFFER
            </span>
            <span className="truncate">{t('announcement')}</span>
          </div>

          <div className="hidden md:flex items-center gap-3.5 text-[11px]">
            <button
              onClick={() => navigate('track_order')}
              className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 text-emerald-300 font-bold"
            >
              <Truck className="w-3 h-3" />
              <span>Track Order</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => navigate('compare')}
              className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100 text-gold-300 font-bold"
            >
              <Scale className="w-3 h-3" />
              <span>Compare</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => navigate('bazaar')}
              className="hover:underline flex items-center gap-1 opacity-90 hover:opacity-100"
            >
              <Tag className="w-3 h-3 text-gold-400" />
              <span>{t('bazaarAds')}</span>
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => navigate('seller_center')}
              className="hover:underline opacity-90 hover:opacity-100"
            >
              {t('sellerCenter')}
            </button>
            <button
              onClick={() => navigate('admin_panel')}
              className="hover:underline opacity-90 hover:opacity-100 text-gold-300 font-semibold"
            >
              {t('adminPanel')}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Header */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-primary-600 rounded-lg hover:bg-gray-100"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            <button
              onClick={() => navigate('home')}
              className="text-left focus:outline-none"
              aria-label="NepaleseStore Home"
            >
              <Logo size="md" />
            </button>
          </div>

          {/* Search Bar with live autocomplete */}
          <div ref={searchContainerRef} className="relative flex-1 max-w-2xl hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative flex">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-24 py-2.5 bg-gray-50 hover:bg-gray-100/80 focus:bg-white border border-gray-300 focus:border-primary-600 rounded-full text-xs sm:text-sm text-gray-900 focus:ring-2 focus:ring-primary-100 focus:outline-none transition-all shadow-inner"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-20 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-full text-xs font-bold transition-colors flex items-center justify-center gap-1 shadow-xs"
              >
                <span>{t('search')}</span>
              </button>
            </form>

            {/* Autocomplete Suggestions Dropdown */}
            {isSearchFocused && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="p-2 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  Suggested Products
                </div>
                <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                  {suggestions.map((p) => {
                    const title = language === 'ne' ? p.nameNe : p.nameEn;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleSuggestionClick(p)}
                        className="p-3 flex items-center gap-3 hover:bg-red-50/50 cursor-pointer transition-colors"
                      >
                        <img
                          src={p.images[0]}
                          alt={title}
                          className="w-10 h-10 object-cover rounded-md border border-gray-100 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-900 truncate">{title}</p>
                          <p className="text-[11px] text-gray-400">
                            {p.brandName || p.sellerName} · {p.categorySlug}
                          </p>
                        </div>
                        <span className="text-xs font-extrabold text-primary-600 whitespace-nowrap">
                          {formatNPR(p.basePrice)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-gray-200 text-xs font-bold text-gray-700 hover:border-primary-600 hover:text-primary-600 transition-colors"
              title="Switch between English and Nepali"
            >
              <Globe className="w-3.5 h-3.5 text-primary-600" />
              <span>{language === 'en' ? 'नेपाली' : 'English'}</span>
            </button>

            {/* Demo User Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-100 border border-gray-200 text-xs text-gray-800 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                  {currentUser?.name.charAt(0) || <UserIcon className="w-3.5 h-3.5" />}
                </div>
                <div className="hidden md:flex flex-col text-left leading-none">
                  <span className="font-semibold text-gray-900 truncate max-w-[90px]">
                    {currentUser?.name.split(' ')[0] || 'Guest'}
                  </span>
                  <span className="text-[10px] text-primary-600 font-bold uppercase mt-0.5">
                    {currentUser?.role || 'Guest'}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
              </button>

              {/* User / Demo Switcher Dropdown */}
              {isUserMenuOpen && (
                <div
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 p-2 z-50 text-xs animate-in fade-in duration-100"
                >
                  <div className="p-2 border-b border-gray-100 mb-1">
                    <p className="font-bold text-gray-900">{currentUser?.name || 'Guest User'}</p>
                    <p className="text-[11px] text-gray-400">{currentUser?.email || 'Browse & Shop'}</p>
                    {currentUser && (
                      <p className="text-[11px] text-emerald-700 font-bold mt-1">
                        Wallet: {formatNPR(currentUser.walletBalance)}
                      </p>
                    )}
                  </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          openAuthModal('login', 'password');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-primary-50 font-bold text-primary-600 flex items-center justify-between"
                      >
                        <span>🔑 Sign In / Register</span>
                        <span className="text-[10px] bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded">Customer</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('staff_login');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-slate-900 hover:text-white font-bold text-slate-900 flex items-center justify-between bg-slate-50 mb-1"
                      >
                        <span>🛡️ Staff Operations Portal</span>
                        <span className="text-[9px] bg-red-600 text-white font-mono px-1 py-0.2 rounded font-black">RESTRICTED</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('staff_profile');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-purple-50 font-bold text-purple-700 flex items-center justify-between"
                      >
                        <span>🎖️ Staff Profile & Clearance</span>
                        <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">Ranks</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('account');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-gray-100 font-medium text-gray-700"
                      >
                        {t('myOrders')} & Profile
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('brand_portal');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-gray-100 font-bold text-amber-700"
                      >
                        🏷️ Brand Manager Portal
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('helper_portal');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-gray-100 font-bold text-blue-700"
                      >
                        🤝 Helper Support Helpdesk
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('seller_center');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-gray-100 font-medium text-emerald-700"
                      >
                        🏪 {t('sellerCenter')} (Manage Store)
                      </button>
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigate('admin_panel');
                        }}
                        className="w-full text-left px-2.5 py-1.5 rounded-md hover:bg-gray-100 font-bold text-purple-700"
                      >
                        👑 {currentUser?.role === 'owner' ? 'Owner Master Console' : 'Admin Panel'}
                      </button>
                    </div>

                    {/* Switch Demo Persona */}
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 mb-1">
                        Select Role Persona
                      </p>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        <button
                          onClick={() => {
                            loginAs('owner');
                            setIsUserMenuOpen(false);
                            navigate('admin_panel');
                          }}
                          className="p-1.5 rounded bg-purple-50 hover:bg-purple-100 text-purple-900 font-bold text-left"
                        >
                          👑 Owner
                        </button>
                        <button
                          onClick={() => {
                            loginAs('sradmin');
                            setIsUserMenuOpen(false);
                            navigate('admin_panel');
                          }}
                          className="p-1.5 rounded bg-red-50 hover:bg-red-100 text-red-900 font-bold text-left"
                        >
                          🛡️ Sr. Admin
                        </button>
                        <button
                          onClick={() => {
                            loginAs('brand_manager');
                            setIsUserMenuOpen(false);
                            navigate('brand_portal');
                          }}
                          className="p-1.5 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-left"
                        >
                          🏷️ Brand Mgr
                        </button>
                        <button
                          onClick={() => {
                            loginAs('helper');
                            setIsUserMenuOpen(false);
                            navigate('helper_portal');
                          }}
                          className="p-1.5 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 font-bold text-left"
                        >
                          🤝 Helper
                        </button>
                        <button
                          onClick={() => {
                            loginAs('seller');
                            setIsUserMenuOpen(false);
                            navigate('seller_center');
                          }}
                          className="p-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-left"
                        >
                          🏪 Business/Seller
                        </button>
                        <button
                          onClick={() => {
                            loginAs('user');
                            setIsUserMenuOpen(false);
                            navigate('account');
                          }}
                          className="p-1.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-left"
                        >
                          👤 Normal User
                        </button>
                      </div>

                      {currentUser && (
                        <button
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full mt-2 py-1.5 text-center text-[11px] font-bold text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => navigate('account')}
              aria-label="Wishlist"
              className="relative p-2 text-gray-700 hover:text-primary-600 rounded-full hover:bg-gray-100 transition-colors hidden sm:block"
            >
              <Heart className="w-5 h-5" />
              {wishlistProductIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary-600 text-white font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistProductIds.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setMiniCartOpen(true)}
              aria-label="Shopping Cart"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 rounded-full bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-primary-600" />
                {getItemCount() > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-primary-600 text-white font-extrabold text-[10px] min-w-4.5 h-4.5 px-1 rounded-full flex items-center justify-center shadow-xs">
                    {getItemCount()}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block font-extrabold text-xs">
                {formatNPR(getSubtotal())}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search Input Row */}
        <div className="mt-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products & Nepali handicrafts..."
              className="w-full pl-9 pr-16 py-2 bg-gray-100 focus:bg-white border border-gray-200 focus:border-primary-600 rounded-full text-xs text-gray-900 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-primary-600 text-white text-[11px] font-bold rounded-full"
            >
              {t('search')}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Category Bar & Mega Links */}
      <div className="bg-white border-t border-gray-100 hidden md:block">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs font-semibold text-gray-700">
          <div className="flex items-center gap-1 overflow-x-auto py-2 no-scrollbar">
            <button
              onClick={() => navigate('catalog', { categorySlug: 'all' })}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                currentPage === 'catalog' && !currentCategorySlug
                  ? 'bg-primary-50 text-primary-600 font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              <Menu className="w-3.5 h-3.5 text-primary-600" />
              <span>{t('allCategories')}</span>
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'nepali-handicrafts' })}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                currentCategorySlug === 'nepali-handicrafts'
                  ? 'bg-primary-50 text-primary-600 font-bold'
                  : 'hover:bg-gray-100 text-secondary-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-gold-500" />
              <span>{t('nepaliSpecials')}</span>
            </button>

            <button
              onClick={() => navigate('deals')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                currentPage === 'deals'
                  ? 'bg-red-50 text-primary-600 font-bold'
                  : 'hover:bg-gray-100 text-red-600'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>{t('flashDeals')}</span>
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'electronics' })}
              className="px-3 py-1.5 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              Electronics & Gadgets
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'mens-fashion' })}
              className="px-3 py-1.5 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              Men’s Fashion
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'womens-fashion' })}
              className="px-3 py-1.5 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              Women’s Fashion
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'groceries' })}
              className="px-3 py-1.5 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              Groceries & Organics
            </button>

            <button
              onClick={() => navigate('catalog', { categorySlug: 'home-kitchen' })}
              className="px-3 py-1.5 rounded-md hover:bg-gray-100 whitespace-nowrap"
            >
              Home & Kitchen
            </button>
          </div>

          <div className="flex items-center gap-3 shrink-0 py-2 pl-4 border-l border-gray-100">
            <button
              onClick={() => navigate('brand_store')}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-800 font-bold whitespace-nowrap"
            >
              <Award className="w-3.5 h-3.5" />
              <span>Official Brands</span>
            </button>

            <button
              onClick={() => navigate('collections')}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 font-bold whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Festive Collections</span>
            </button>

            <button
              onClick={() => navigate('bazaar')}
              className="flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold whitespace-nowrap"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Hamro Bazaar</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
