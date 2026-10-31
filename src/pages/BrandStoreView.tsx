import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product } from '../types/models';
import { ProductCard } from '../components/ui/ProductCard';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Filter,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';

interface OfficialBrandMeta {
  slug: string;
  name: string;
  category: string;
  manager: string;
  bannerUrl: string;
  logoUrl: string;
  tagline: string;
  warranty: string;
  description: string;
}

const OFFICIAL_BRANDS: OfficialBrandMeta[] = [
  {
    slug: 'palpali-dhaka',
    name: 'Palpali Dhaka Official Store',
    category: 'Handicrafts & Traditional Textiles',
    manager: 'Sita Dahal',
    bannerUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=200&q=80',
    tagline: '100% Traditional Handloom Palpa Guarantee',
    warranty: 'Certified Authentic Heritage Handloom',
    description: 'Direct from Palpa artisan weavers. Genuine hand-loomed Topis, Shawls, and Waistcoats crafted with natural cotton threads.'
  },
  {
    slug: 'ilam-estate',
    name: 'Ilam Estate Orthodox Tea',
    category: 'Organic Agriculture & Himalayan Tea',
    manager: 'Sita Dahal',
    bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80',
    tagline: 'High-Altitude Himalayan Spring First Flush',
    warranty: '100% Organic Certified Single-Origin Tea',
    description: 'Grown on mist-covered slopes of eastern Nepal at 6,500ft altitude. Hand-plucked two leaves and a bud with delicate muscatel aroma.'
  },
  {
    slug: 'samsung-nepal',
    name: 'Samsung Nepal Authorized',
    category: 'Electronics & Smart Devices',
    manager: 'Sita Dahal',
    bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
    logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=200&q=80',
    tagline: 'Authorized National Distributor Warranty',
    warranty: '1-Year Official National Service Warranty',
    description: 'Genuine smartphones, tablets, and smart home appliances with official Nepal VAT bill and warranty card redeemable at all service centres.'
  }
];

export const BrandStoreView: React.FC = () => {
  const { navigate } = useUIStore();

  const [selectedBrandSlug, setSelectedBrandSlug] = useState('palpali-dhaka');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [priceFilter, setPriceFilter] = useState<'all' | 'under1000' | 'above1000'>('all');

  const brand = OFFICIAL_BRANDS.find((b) => b.slug === selectedBrandSlug) || OFFICIAL_BRANDS[0];

  useEffect(() => {
    async function loadBrandProducts() {
      setLoading(true);
      const all = await productService.getAll();
      // Match by brand or category keywords
      const filtered = all.filter((p) => {
        if (selectedBrandSlug === 'palpali-dhaka') {
          return p.brandSlug === 'palpali-dhaka' || p.categorySlug === 'handicrafts' || p.nameEn.toLowerCase().includes('dhaka');
        }
        if (selectedBrandSlug === 'ilam-estate') {
          return p.brandSlug === 'ilam-tea' || p.categorySlug === 'groceries' || p.nameEn.toLowerCase().includes('tea');
        }
        if (selectedBrandSlug === 'samsung-nepal') {
          return p.brandSlug === 'samsung' || p.categorySlug === 'electronics';
        }
        return true;
      });
      setProducts(filtered);
      setLoading(false);
    }
    loadBrandProducts();
  }, [selectedBrandSlug]);

  const displayedProducts = products.filter((p) => {
    if (priceFilter === 'under1000') return p.basePrice <= 100000;
    if (priceFilter === 'above1000') return p.basePrice > 100000;
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <button onClick={() => navigate('catalog')} className="hover:text-primary-600">
          Official Brands
        </button>
        <span>/</span>
        <span className="font-bold text-gray-800">{brand.name}</span>
      </div>

      {/* Brand Selector Pills */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider shrink-0 mr-1">
          Explore Official Stores:
        </span>
        {OFFICIAL_BRANDS.map((b) => (
          <button
            key={b.slug}
            onClick={() => setSelectedBrandSlug(b.slug)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedBrandSlug === b.slug
                ? 'bg-amber-500 text-slate-950 font-black shadow-md'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-amber-400 hover:text-amber-700'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-amber-600" />
            <span>{b.name}</span>
          </button>
        ))}
      </div>

      {/* Brand Showcase Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl mb-8 border border-gray-200">
        <div className="h-48 sm:h-64 w-full relative">
          <img
            src={brand.bannerUrl}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Brand Profile Details on Banner */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={brand.logoUrl}
              alt={brand.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-white p-1 border-2 border-white shadow-xl shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-slate-950" />
                  VERIFIED OFFICIAL STORE
                </span>
                <span className="text-xs text-amber-200 font-medium hidden sm:inline">• {brand.category}</span>
              </div>
              <h1 className="text-xl sm:text-3xl font-black mt-1 text-white tracking-tight">
                {brand.name}
              </h1>
              <p className="text-xs text-amber-100/90 mt-1 max-w-xl">
                {brand.tagline}
              </p>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl text-xs sm:text-right shrink-0">
            <span className="text-[10px] uppercase font-bold text-amber-300 block">Trust & Quality Guarantee</span>
            <span className="font-extrabold text-white flex items-center gap-1 sm:justify-end">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              {brand.warranty}
            </span>
          </div>
        </div>
      </div>

      {/* Brand Bio Card */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-5 mb-8 text-xs text-amber-950 flex flex-wrap items-center justify-between gap-4">
        <p className="max-w-2xl leading-relaxed">
          {brand.description}
        </p>
        <span className="text-[11px] font-mono text-amber-800 font-bold">
          Store Manager: {brand.manager} · Official Partner
        </span>
      </div>

      {/* Filter Ribbon & Product Grid */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-gray-900">
            Official Products ({displayedProducts.length})
          </h2>
          <p className="text-xs text-gray-500">Shipped with official VAT invoice and national warranty</p>
        </div>

        {/* Price Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 font-bold uppercase text-[10px]">Filter Price:</span>
          {(['all', 'under1000', 'above1000'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setPriceFilter(mode)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                priceFilter === mode
                  ? 'bg-primary-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mode === 'all' ? 'All Prices' : mode === 'under1000' ? 'Under Rs. 1,000' : 'Above Rs. 1,000'}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : displayedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8">
          <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No products match this filter</h3>
          <p className="text-xs text-gray-500 mt-1">Try switching the price filter above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

