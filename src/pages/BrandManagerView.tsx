import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import {
  Sparkles,
  Award,
  CheckCircle2,
  Plus,
  Tag,
  ShieldCheck,
  TrendingUp,
  Image as ImageIcon,
  X
} from 'lucide-react';

interface BrandItem {
  id: string;
  name: string;
  slug: string;
  category: string;
  manager: string;
  featured: boolean;
  status: 'Verified' | 'Pending Review';
  logoUrl: string;
  bannerUrl: string;
  campaignTitle?: string;
}

export const BrandManagerView: React.FC = () => {
  const { showToast, navigate } = useUIStore();
  const { currentUser } = useAuthStore();

  const [brands, setBrands] = useState<BrandItem[]>([
    {
      id: 'brand_palpali',
      name: 'Palpali Dhaka Official Store',
      slug: 'palpali-dhaka',
      category: 'Nepali Handicrafts & Weaves',
      manager: 'Sita Dahal',
      featured: true,
      status: 'Verified',
      logoUrl: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=120&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
      campaignTitle: '100% Traditional Handloom Guarantee'
    },
    {
      id: 'brand_ilam',
      name: 'Ilam Estate Orthodox Tea',
      slug: 'ilam-estate',
      category: 'Organic Agriculture',
      manager: 'Sita Dahal',
      featured: true,
      status: 'Verified',
      logoUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=120&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
      campaignTitle: 'Himalayan Spring First Flush'
    },
    {
      id: 'brand_samsung',
      name: 'Samsung Nepal Authorized',
      slug: 'samsung-nepal',
      category: 'Electronics & Gadgets',
      manager: 'Sita Dahal',
      featured: true,
      status: 'Verified',
      logoUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=120&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
      campaignTitle: '1-Year Official National Warranty + Screen Replacement'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');
  const [newBrandCat, setNewBrandCat] = useState('Nepali Craft & Heritage');
  const [newCampaignTitle, setNewCampaignTitle] = useState('');
  const [newBrandLogo, setNewBrandLogo] = useState('https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=120&q=80');

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;

    const newBrand: BrandItem = {
      id: `brand_${Date.now()}`,
      name: newBrandName.trim(),
      slug: newBrandName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: newBrandCat,
      manager: currentUser?.name || 'Brand Manager',
      featured: true,
      status: 'Verified',
      logoUrl: newBrandLogo,
      bannerUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
      campaignTitle: newCampaignTitle || 'Verified Official Brand'
    };

    setBrands([newBrand, ...brands]);
    showToast(`Official brand "${newBrandName}" verified and added to directory!`, 'success');
    setShowAddModal(false);
    setNewBrandName('');
    setNewCampaignTitle('');
  };

  if (currentUser?.role !== 'brand_manager' && currentUser?.role !== 'owner' && currentUser?.role !== 'sradmin') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Award className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Brand Management Desk</h2>
        <p className="text-xs text-gray-500 mb-6">
          Access Denied: This portal is restricted to authorized Brand Managers and Platform Governance. Please sign in with staff clearance.
        </p>
        <button
          onClick={() => navigate('staff_login')}
          className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Staff Operations Login
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-16">
      {/* Brand Manager Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-primary-950 rounded-2xl p-6 sm:p-8 text-white shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">Brand Manager Portal</h1>
              <span className="bg-gold-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                BRAND OPS
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Curate authorized brand storefronts, hallmark authenticity badges, and campaign sponsorships.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gold-500 hover:bg-gold-600 text-slate-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Register Official Brand</span>
        </button>
      </div>

      {/* Brand Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Verified Brands</span>
          <p className="text-2xl font-black text-gray-900 mt-1">{brands.length}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">100% Genuine Certified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Featured Campaigns</span>
          <p className="text-2xl font-black text-primary-600 mt-1">4 Active</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Dashain & Tihar Highlights</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">Direct Artisan Brands</span>
          <p className="text-2xl font-black text-amber-600 mt-1">2 Handcraft</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Palpa & Patan Heritage</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
          <span className="text-xs font-bold text-gray-400 uppercase">National Warranty Badge</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">Enabled</p>
          <span className="text-[11px] text-gray-400 mt-1 block">Full Consumer Protection</span>
        </div>
      </div>

      {/* Brands List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-gray-900">Official Brand Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-28 bg-gray-100 overflow-hidden relative">
                  <img src={brand.bannerUrl} alt={brand.name} className="w-full h-full object-cover" />
                  <span className="absolute top-2.5 right-2.5 bg-emerald-700/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Brand
                  </span>
                </div>

                <div className="p-4 pt-0 relative">
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md -mt-7 mb-2 bg-white"
                  />
                  <h3 className="font-extrabold text-sm text-gray-900">{brand.name}</h3>
                  <p className="text-[11px] text-gray-400">{brand.category}</p>

                  {brand.campaignTitle && (
                    <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200/80 text-[11px] text-amber-900 font-medium">
                      🎯 Campaign: {brand.campaignTitle}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 text-[11px]">Managed by {brand.manager}</span>
                <button
                  onClick={() => navigate('catalog', { search: brand.name.split(' ')[0] })}
                  className="text-primary-600 font-bold hover:underline"
                >
                  View Storefront →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Brand Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-black text-gray-900">Register Official Brand Store</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBrand} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Brand Name *</label>
                <input
                  type="text"
                  required
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Goldstar Shoes Official Nepal"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Category</label>
                <input
                  type="text"
                  value={newBrandCat}
                  onChange={(e) => setNewBrandCat(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Campaign Tagline</label>
                <input
                  type="text"
                  value={newCampaignTitle}
                  onChange={(e) => setNewCampaignTitle(e.target.value)}
                  placeholder="e.g. Nepal’s Own Iconic Footwear Brand"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gold-500 hover:bg-gold-600 text-slate-950 font-black rounded-xl shadow-md"
                >
                  Verify Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
