import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product } from '../types/models';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Sparkles,
  Flame,
  Clock,
  Tag,
  ArrowLeft,
  ShoppingBag,
  Award,
  Gift
} from 'lucide-react';

interface CollectionCampaign {
  slug: string;
  title: string;
  nepaliTitle: string;
  badge: string;
  bannerUrl: string;
  description: string;
  discountVoucher: string;
}

const CAMPAIGNS: CollectionCampaign[] = [
  {
    slug: 'dashain-dhamaka',
    title: 'Dashain & Tihar Festive Mela',
    nepaliTitle: 'दशैं तथा तिहार विशेष मेला',
    badge: 'FESTIVAL SPECIAL 2026',
    bannerUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Celebrate Vijaya Dashami & Deepawali with traditional hand-loomed Dhaka topis, copper puja thalis, organic Jumla walnuts, and festive gift boxes.',
    discountVoucher: 'DASHAIN2026'
  },
  {
    slug: 'under-1000',
    title: 'Pocket Friendly: Under Rs. 1,000',
    nepaliTitle: 'रु. १,००० मुनिका उत्कृष्ट सामानहरू',
    badge: 'BUDGET SAVER',
    bannerUrl: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1200&q=80',
    description: 'Affordable authentic Nepali handicrafts, organic teas, spices, and everyday smart gadgets priced under 1,000 Rupees.',
    discountVoucher: 'WELCOME100'
  },
  {
    slug: 'made-in-nepal',
    title: '100% Handcrafted in Nepal',
    nepaliTitle: 'नेपाली मौलिक सीप र हस्तकला',
    badge: 'ARTISAN HERITAGE',
    bannerUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    description: 'Supporting 500+ local women weavers and mountain artisans across Palpa, Bhaktapur, Mustang, and Solukhumbu.',
    discountVoucher: 'FREESHIP'
  }
];

export const CollectionsView: React.FC = () => {
  const { navigate, showToast } = useUIStore();

  const [activeCampaignSlug, setActiveCampaignSlug] = useState('dashain-dhamaka');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Live Festive Countdown Timer (Hours, Mins, Secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 48, minutes: 22, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const campaign = CAMPAIGNS.find((c) => c.slug === activeCampaignSlug) || CAMPAIGNS[0];

  useEffect(() => {
    async function loadCampaignProducts() {
      setLoading(true);
      const all = await productService.getAll();
      if (activeCampaignSlug === 'dashain-dhamaka') {
        setProducts(all.filter((p) => p.isNepaliCraft || p.isFlashDeal || p.categorySlug === 'handicrafts'));
      } else if (activeCampaignSlug === 'under-1000') {
        setProducts(all.filter((p) => p.basePrice <= 100000));
      } else {
        setProducts(all.filter((p) => p.isNepaliCraft || p.categorySlug === 'handicrafts' || p.categorySlug === 'groceries'));
      }
      setLoading(false);
    }
    loadCampaignProducts();
  }, [activeCampaignSlug]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="font-bold text-gray-800">Featured Collections</span>
      </div>

      {/* Campaign Switcher Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 text-xs">
        {CAMPAIGNS.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCampaignSlug(c.slug)}
            className={`px-4 py-2.5 rounded-2xl font-bold transition-all shrink-0 flex items-center gap-2 ${
              activeCampaignSlug === c.slug
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-400'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{c.title}</span>
          </button>
        ))}
      </div>

      {/* Campaign Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8 border border-gray-200">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={campaign.bannerUrl}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>

        {/* Content on Banner */}
        <div className="absolute inset-0 p-6 sm:p-10 text-white flex flex-col justify-end">
          <div className="max-w-2xl">
            <span className="bg-red-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider inline-flex items-center gap-1">
              <Flame className="w-3 h-3 fill-current" />
              {campaign.badge}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black mt-2 text-white tracking-tight">
              {campaign.title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-200 mt-2 leading-relaxed">
              {campaign.description}
            </p>

            {/* Countdown & Voucher Badge */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-xs">
                <Clock className="w-3.5 h-3.5 text-gold-400" />
                <span className="font-mono font-bold text-white">
                  {String(timeLeft.hours).padStart(2, '0')}h : {String(timeLeft.minutes).padStart(2, '0')}m : {String(timeLeft.seconds).padStart(2, '0')}s
                </span>
                <span className="text-[10px] text-gray-300">Remaining</span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(campaign.discountVoucher);
                  showToast(`Voucher code ${campaign.discountVoucher} copied!`, 'success');
                }}
                className="cursor-pointer bg-gold-400 hover:bg-gold-300 text-slate-950 px-3.5 py-1.5 rounded-xl font-mono text-xs font-black shadow-sm flex items-center gap-1.5 transition-colors"
                title="Click to copy voucher"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>CODE: {campaign.discountVoucher} (Copy 15% Off)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products in Collection */}
      <div className="mb-4">
        <h2 className="text-base font-bold text-gray-900">
          Featured in this Collection ({products.length} Items)
        </h2>
        <p className="text-xs text-gray-500">Hand-selected authentic goods with verified buyer protection</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

