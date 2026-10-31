import React, { useState, useEffect } from 'react';
import { productService } from '../services/productService';
import { Product } from '../types/models';
import { ProductCard } from '../components/ui/ProductCard';
import { Zap, Clock, Sparkles } from 'lucide-react';
import { SEED_COUPONS } from '../mocks/seed-data';

export const DealsView: React.FC = () => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    async function load() {
      const data = await productService.getFlashDeals();
      setDeals(data);
    }
    load();
  }, []);

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

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl pb-16 space-y-8">
      {/* Deals Header */}
      <div className="bg-gradient-to-r from-red-600 via-primary-600 to-amber-600 text-white rounded-3xl p-6 sm:p-10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="bg-gold-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Zap className="w-3.5 h-3.5 fill-current" />
            DASHAIN & TIHAR MEGA SALE
          </span>
          <h1 className="text-2xl sm:text-4xl font-black mt-3 tracking-tight">
            Limited-Time Flash Deals
          </h1>
          <p className="text-xs sm:text-sm text-red-100 mt-1 max-w-xl">
            Save up to 50% on verified authentic Nepali handicrafts, smartphones, and winter fashion. Stock is limited!
          </p>
        </div>

        {/* Live Timer */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 flex flex-col items-center">
          <span className="text-[11px] font-bold text-red-100 uppercase tracking-wider mb-2">Deal Window Closes In:</span>
          <div className="flex items-center gap-2 text-slate-950 font-mono font-black text-sm sm:text-base">
            <div className="bg-white px-3 py-2 rounded-xl text-center">
              <span>{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="block text-[9px] text-gray-500 font-sans font-medium">HOURS</span>
            </div>
            <span className="text-white text-lg">:</span>
            <div className="bg-white px-3 py-2 rounded-xl text-center">
              <span>{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="block text-[9px] text-gray-500 font-sans font-medium">MINS</span>
            </div>
            <span className="text-white text-lg">:</span>
            <div className="bg-white px-3 py-2 rounded-xl text-center text-primary-600">
              <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="block text-[9px] text-gray-500 font-sans font-medium">SECS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Festival Coupons */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-600" />
          Active Festival Promo Coupons (Apply at Checkout):
        </h3>
        <div className="flex flex-wrap gap-3">
          {SEED_COUPONS.map((c) => (
            <div key={c.code} className="bg-white px-3 py-1.5 rounded-xl border border-amber-200 text-xs flex items-center gap-2 shadow-2xs">
              <span className="font-mono font-black text-primary-600">{c.code}</span>
              <span className="text-gray-500">· {c.descriptionEn}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {deals.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
