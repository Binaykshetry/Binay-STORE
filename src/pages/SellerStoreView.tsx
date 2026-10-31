import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { Product, Seller } from '../types/models';
import { ProductCard } from '../components/ui/ProductCard';
import { SEED_SELLERS } from '../mocks/seed-data';
import {
  Store,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  Phone,
  MessageCircle,
  ArrowLeft,
  ShoppingBag,
  Award,
  CheckCircle2
} from 'lucide-react';

export const SellerStoreView: React.FC = () => {
  const { currentProductSlug, navigate, showToast } = useUIStore();

  const [sellers, setSellers] = useState<Seller[]>(SEED_SELLERS);
  const [selectedSeller, setSelectedSeller] = useState<Seller>(SEED_SELLERS[0]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'about' | 'reviews'>('products');

  useEffect(() => {
    async function loadSellerProducts() {
      setLoading(true);
      const all = await productService.getAll();
      const sellerProducts = all.filter((p) => p.sellerId === selectedSeller.id || p.sellerName === selectedSeller.storeName);
      // Fallback: if no products directly match id, show general handicraft products
      setProducts(sellerProducts.length > 0 ? sellerProducts : all.slice(0, 4));
      setLoading(false);
    }
    loadSellerProducts();
  }, [selectedSeller]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="font-bold text-gray-800">Seller Storefront</span>
      </div>

      {/* Seller Switcher Header for Demo testing */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 text-xs">
        <span className="text-gray-400 font-bold uppercase text-[10px] shrink-0">Browse Verified Sellers:</span>
        {sellers.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSeller(s)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedSeller.id === s.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-700 hover:border-primary-400'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{s.storeName}</span>
          </button>
        ))}
      </div>

      {/* Seller Profile Banner */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img
              src={selectedSeller.logoUrl || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
              alt={selectedSeller.storeName}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-primary-100 p-0.5 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  VERIFIED NEPALESE SELLER
                </span>
                <span className="text-xs text-gray-400">PAN: {selectedSeller.panNumber}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 mt-1">
                {selectedSeller.storeName}
              </h1>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-gray-400" />
                  {selectedSeller.city}, Nepal
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  Joined 2025
                </span>
              </p>
            </div>
          </div>

          {/* Seller Ratings & Chat */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Store Rating</span>
              <span className="text-base font-black text-gray-900 flex items-center justify-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                {selectedSeller.ratingAvg.toFixed(1)} / 5
              </span>
            </div>

            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center min-w-[90px]">
              <span className="text-[10px] font-bold text-gray-400 block uppercase">Fulfillment</span>
              <span className="text-base font-black text-emerald-700">98.4%</span>
            </div>

            <button
              onClick={() => showToast(`Live chat connection established with ${selectedSeller.storeName}`, 'info')}
              className="px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Message Seller</span>
            </button>
          </div>
        </div>

        {/* Storefront Tabs */}
        <div className="flex items-center gap-6 mt-6 border-b border-gray-100 text-xs font-bold">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'products'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Store Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'about'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>About the Artisan</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>Customer Feedback ({products.length * 6})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'products' && (
            <div>
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
          )}

          {activeTab === 'about' && (
            <div className="max-w-2xl text-xs text-gray-700 space-y-4 leading-relaxed">
              <p>
                <b>{selectedSeller.storeName}</b> is a certified Nepali handicraft workshop dedicated to preserving authentic handloom techniques and local artisan communities. Every product is handcrafted by local women weavers in Palpa, Bhaktapur, and eastern Nepal.
              </p>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-950 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Official Seller Commitments:
                </p>
                <p>• 100% Genuine raw materials and traditional natural dyes.</p>
                <p>• 7-day hassle-free returns for unused items with original tag.</p>
                <p>• Standard 2-day dispatch from Kathmandu fulfillment hub.</p>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-3 max-w-xl text-xs">
              {[
                { name: 'Pooja Karki', rating: 5, date: '3 days ago', comment: 'Quality is exceptional! Authentic Dhaka pattern and very soft lining.' },
                { name: 'Suman Thapa', rating: 5, date: '1 week ago', comment: 'Fast delivery to Pokhara. Packaged nicely with a thank-you note.' },
                { name: 'Rabin Maharjan', rating: 4, date: '2 weeks ago', comment: 'Good fitting and exactly as shown in the picture.' }
              ].map((rev, i) => (
                <div key={i} className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-gray-900">{rev.name}</span>
                    <span className="text-[11px] text-gray-400">{rev.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600">{rev.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

