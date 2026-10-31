import React, { useState, useEffect } from 'react';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product, Banner, Category, Seller } from '../types/models';
import { SEED_BANNERS, SEED_CATEGORIES, SEED_SELLERS } from '../mocks/seed-data';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Star,
  Tag,
  Award,
  Clock,
  TrendingUp,
  Mail
} from 'lucide-react';

export const HomeView: React.FC = () => {
  const { language, t } = useLanguageStore();
  const { navigate, showToast } = useUIStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [nepaliSpecials, setNepaliSpecials] = useState<Product[]>([]);
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  // Live countdown timer for Dashain Flash Sale
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    async function loadData() {
      const all = await productService.getPublished();
      setProducts(all);
      const deals = await productService.getFlashDeals();
      setFlashDeals(deals);
      const specials = await productService.getNepaliSpecials();
      setNepaliSpecials(specials);
    }
    loadData();
  }, []);

  // Countdown ticking
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto advance banner every 6s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % SEED_BANNERS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      showToast('Thank you for subscribing to Dashain festival deals!', 'success');
      setNewsletterEmail('');
    }
  };

  const currentBanner = SEED_BANNERS[currentBannerIndex];

  return (
    <div className="space-y-8 sm:space-y-12 pb-12">
      {/* 1. Hero Carousel Banner */}
      <section className="relative overflow-hidden bg-slate-900 rounded-2xl shadow-lg mx-auto max-w-7xl">
        <div className="relative min-h-[300px] sm:min-h-[420px] md:min-h-[460px] flex items-center">
          {/* Background Image with Gradient Overlay */}
          <img
            src={currentBanner.imageUrl}
            alt={currentBanner.titleEn}
            className="absolute inset-0 w-full h-full object-cover object-center brightness-60 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />

          {/* Banner Content */}
          <div className="relative z-10 max-w-2xl px-6 sm:px-12 py-10 flex flex-col items-start gap-3 sm:gap-4 text-white">
            <span className="bg-gold-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {language === 'ne' ? currentBanner.badgeNe : currentBanner.badgeEn}
            </span>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
              {language === 'ne' ? currentBanner.titleNe : currentBanner.titleEn}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-200 line-clamp-2 max-w-lg">
              {language === 'ne' ? currentBanner.subtitleNe : currentBanner.subtitleEn}
            </p>

            <div className="flex items-center gap-3 mt-2">
              <button
                onClick={() => navigate('deals')}
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-xl flex items-center gap-2 active:scale-98 transition-all"
              >
                <span>Shop Festive Deals</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('catalog', { categorySlug: 'nepali-handicrafts' })}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white font-bold px-5 py-3 rounded-xl text-xs sm:text-sm border border-white/30 transition-all"
              >
                Nepali Crafts
              </button>
            </div>
          </div>

          {/* Banner Navigation Arrows */}
          <button
            onClick={() =>
              setCurrentBannerIndex((prev) => (prev === 0 ? SEED_BANNERS.length - 1 : prev - 1))
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors hidden sm:block"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % SEED_BANNERS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors hidden sm:block"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Indicator dots */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
            {SEED_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentBannerIndex(idx)}
                aria-label={`Slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === currentBannerIndex ? 'w-6 bg-gold-400' : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Category Bubble Scroll Strip */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Explore Categories</span>
            <span className="text-xs font-normal text-gray-500">
              ({SEED_CATEGORIES.length} Departments)
            </span>
          </h2>
          <button
            onClick={() => navigate('catalog', { categorySlug: 'all' })}
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
          >
            View All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
          {SEED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate('catalog', { categorySlug: cat.slug })}
              className="flex flex-col items-center gap-2 group min-w-[80px] sm:min-w-[96px] text-center shrink-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border border-gray-200 group-hover:border-primary-500 overflow-hidden shadow-xs group-hover:shadow-md transition-all p-1">
                <img
                  src={cat.imageUrl}
                  alt={cat.nameEn}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-gray-700 group-hover:text-primary-600 line-clamp-1 leading-tight">
                {language === 'ne' ? cat.nameNe : cat.nameEn}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Flash Deals Strip with Live Countdown */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-red-600 via-primary-600 to-amber-600 rounded-2xl p-4 sm:p-6 text-white shadow-md">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-gold-300 shrink-0">
                <Zap className="w-6 h-6 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black tracking-tight">
                    {t('flashDeals')}
                  </h2>
                  <span className="bg-gold-500 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    Live
                  </span>
                </div>
                <p className="text-xs text-red-100 mt-0.5">
                  Limited stock at special Dashain prices. Ends in:
                </p>
              </div>
            </div>

            {/* Countdown timer blocks */}
            <div className="flex items-center gap-1.5 text-slate-900 font-mono font-black text-xs sm:text-sm">
              <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm">
                <span>{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[9px] block text-gray-500 font-sans font-medium text-center">HRS</span>
              </div>
              <span className="text-white font-bold">:</span>
              <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm">
                <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[9px] block text-gray-500 font-sans font-medium text-center">MIN</span>
              </div>
              <span className="text-white font-bold">:</span>
              <div className="bg-white px-2.5 py-1.5 rounded-lg shadow-sm text-primary-600">
                <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[9px] block text-gray-500 font-sans font-medium text-center">SEC</span>
              </div>
            </div>
          </div>

          {/* Flash Deals Products */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {flashDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pride of Nepal: Authentic Handicrafts & Local Specialties */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
                {t('nepaliSpecials')}
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Directly supporting indigenous artisans in Lalitpur, Palpa, Mustang, and Ilam
            </p>
          </div>
          <button
            onClick={() => navigate('catalog', { categorySlug: 'nepali-handicrafts' })}
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
          >
            See All Crafts <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {nepaliSpecials.map((product) => (
            <ProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </section>

      {/* 5. Promotional Dual Callout Banners: Bazaar & Game Store */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Hamro Bazaar Classifieds */}
          <div
            onClick={() => navigate('bazaar')}
            className="cursor-pointer bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="relative z-10 max-w-sm">
              <span className="bg-emerald-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                FREE ADS
              </span>
              <h3 className="text-xl font-black mt-2 mb-1 group-hover:text-emerald-200 transition-colors">
                Hamro Bazaar Classifieds
              </h3>
              <p className="text-xs text-emerald-100 mb-4 leading-relaxed">
                Buy and sell used motorbikes, cars, apartments, iPhones and electronics with zero platform fees.
              </p>
              <button className="bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Tag className="w-3.5 h-3.5" />
                <span>Post or Browse Free Ads</span>
              </button>
            </div>
            <Tag className="absolute -right-4 -bottom-4 w-36 h-36 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>

          {/* Official Verified Brands Showcase */}
          <div
            onClick={() => navigate('brand_portal')}
            className="cursor-pointer bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 rounded-2xl p-6 text-white shadow-md relative overflow-hidden group hover:shadow-xl transition-all"
          >
            <div className="relative z-10 max-w-sm">
              <span className="bg-amber-400 text-slate-900 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                DIRECT BRAND SHOWCASE
              </span>
              <h3 className="text-xl font-black mt-2 mb-1 group-hover:text-amber-200 transition-colors">
                Official Nepali Brands & Heritage
              </h3>
              <p className="text-xs text-amber-100 mb-4 leading-relaxed">
                Palpali Dhaka handlooms, Ilam orthodox teas, and 100% authentic authorized brand warranty products.
              </p>
              <button className="bg-white text-amber-900 hover:bg-amber-50 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm">
                <Award className="w-3.5 h-3.5" />
                <span>Explore Official Stores</span>
              </button>
            </div>
            <Award className="absolute -right-4 -bottom-4 w-36 h-36 text-white/10 rotate-12 group-hover:scale-110 transition-transform" />
          </div>
        </div>
      </section>

      {/* 6. Trending & More Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-600" />
            <h2 className="text-lg sm:text-xl font-extrabold text-gray-900">
              Trending on NepaleseStore
            </h2>
          </div>
          <button
            onClick={() => navigate('catalog', { categorySlug: 'all' })}
            className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
          >
            Browse All <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Verified Marketplace Sellers */}
      <section className="container mx-auto px-4">
        <div className="bg-gray-100/80 rounded-2xl p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600" />
                <span>Featured Verified Nepali Sellers</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Government registered, PAN verified businesses with proven order delivery records
              </p>
            </div>
            <button
              onClick={() => navigate('seller_center')}
              className="text-xs font-bold text-primary-600 hover:underline"
            >
              Sell With Us
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SEED_SELLERS.map((seller) => (
              <div
                key={seller.id}
                className="bg-white p-4 rounded-xl border border-gray-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={seller.logoUrl}
                      alt={seller.storeName}
                      className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900 line-clamp-1">
                        {seller.storeName}
                      </h4>
                      <p className="text-[11px] text-gray-500">{seller.city}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-3">
                    {seller.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <div className="flex items-center text-gold-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-1" />
                    <span>{seller.ratingAvg}</span>
                    <span className="text-gray-400 font-normal ml-1">({seller.totalOrders}+ orders)</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded">
                    PAN Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Newsletter Signup */}
      <section className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary-900 to-secondary-900 rounded-2xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="max-w-md text-center md:text-left">
            <h3 className="text-lg sm:text-2xl font-black">
              Never Miss a Nepali Bazaar Deal
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Subscribe to get exclusive Dashain & Tihar coupons, flash sale notifications, and new artisan drop alerts directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex w-full md:w-auto max-w-md gap-2">
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400"
              />
            </div>
            <button
              type="submit"
              className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-all shrink-0"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
