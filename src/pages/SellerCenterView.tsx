import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { Product, Order } from '../types/models';
import { formatNPR } from '../lib/format';
import { SEED_CATEGORIES } from '../mocks/seed-data';
import {
  Store,
  DollarSign,
  Package,
  TrendingUp,
  Plus,
  Truck,
  CheckCircle2,
  Clock,
  X,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';

export const SellerCenterView: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { showToast, openAuthModal } = useUIStore();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'finance'>('overview');

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProdNameEn, setNewProdNameEn] = useState('');
  const [newProdNameNe, setNewProdNameNe] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('nepali-handicrafts');
  const [newProdPrice, setNewProdPrice] = useState(2500); // in Rs
  const [newProdStock, setNewProdStock] = useState(25);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState(
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'
  );

  const loadData = async () => {
    const prods = await productService.getAll();
    setProducts(prods);
    const ords = await orderService.getAll();
    setOrders(ords);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdNameEn.trim() || !newProdDesc.trim()) {
      showToast('Please provide product English name and description', 'error');
      return;
    }

    const pricePaisa = newProdPrice * 100;
    const cat = SEED_CATEGORIES.find((c) => c.slug === newProdCategory) || SEED_CATEGORIES[0];

    await productService.addProduct({
      sellerId: currentUser?.id || 'seller_himalayan',
      sellerName: currentUser?.name || 'Himalayan Arts & Heritage',
      sellerRating: 4.9,
      sellerVerified: true,
      categoryId: cat.id,
      categorySlug: cat.slug,
      nameEn: newProdNameEn.trim(),
      nameNe: newProdNameNe.trim() || newProdNameEn.trim(),
      slug: newProdNameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescEn: newProdDesc.slice(0, 100),
      shortDescNe: newProdDesc.slice(0, 100),
      descriptionEn: newProdDesc.trim(),
      descriptionNe: newProdDesc.trim(),
      status: 'published',
      condition: 'new',
      isNepaliCraft: true,
      basePrice: pricePaisa,
      images: [newProdImage],
      attributes: [{ name: 'Origin', value: 'Nepal Handmade' }],
      variants: [
        {
          id: `var_${Date.now()}`,
          productId: `prod_${Date.now()}`,
          sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
          name: 'Standard Edition',
          options: { Standard: 'Default' },
          price: pricePaisa,
          stock: newProdStock,
          reserved: 0
        }
      ],
      ratingAvg: 5.0,
      ratingCount: 1,
      soldCount: 0,
      viewCount: 1,
      weightGrams: 500,
      codAvailable: true
    });

    showToast('New product published successfully to NepaleseStore!', 'success');
    setShowAddProductModal(false);
    loadData();
  };

  const handleFulfillOrder = async (orderNo: string, nextStatus: 'packed' | 'shipped') => {
    await orderService.updateOrderStatus(orderNo, nextStatus, `Updated by merchant`, 'Seller');
    showToast(`Order ${orderNo} marked as ${nextStatus.toUpperCase()}`, 'success');
    loadData();
  };

  // Role Guard for Seller Center
  if (currentUser?.role !== 'seller' && currentUser?.role !== 'owner' && currentUser?.role !== 'sradmin') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-lg text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">NepaleseStore Seller Center</h2>
        <p className="text-xs text-gray-500 mb-6">
          You need an active Business / Merchant Account (with verified 9-digit PAN/VAT) to manage products and fulfill orders. Start selling your goods to customers across all 7 provinces of Nepal.
        </p>
        <button
          onClick={() => openAuthModal('signup')}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Register Business Account (PAN/VAT)
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-16">
      {/* Seller Header */}
      <div className="bg-gradient-to-r from-secondary-900 via-slate-900 to-primary-950 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary-400 font-bold border border-white/20">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {currentUser?.name || 'Himalayan Arts & Heritage'}
              </h1>
              <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                VERIFIED MERCHANT
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-1">
              PAN: 601293847 · Location: Patan, Lalitpur · Standard Commission: 8%
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddProductModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 text-xs font-bold">
        {[
          { id: 'overview', label: 'Store Overview' },
          { id: 'products', label: `My Products (${products.length})` },
          { id: 'orders', label: `Orders Inbox (${orders.length})` },
          { id: 'finance', label: 'Earnings & Payout' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 transition-colors relative ${
              activeTab === tab.id ? 'text-primary-600 font-black' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded" />}
          </button>
        ))}
      </div>

      {/* TAB 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Gross Sales (Oct 2026)</span>
              <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{formatNPR(18425000)}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">↑ 18% vs last month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Orders to Dispatch</span>
              <p className="text-xl sm:text-2xl font-black text-primary-600 mt-1">
                {orders.filter((o) => ['confirmed', 'packed'].includes(o.status)).length}
              </p>
              <span className="text-[11px] text-gray-400 mt-1 block">Same-day courier pickup</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Active Catalog</span>
              <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{products.length} Items</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">100% In-Stock</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Seller Score</span>
              <p className="text-xl sm:text-2xl font-black text-gold-500 mt-1">4.9 / 5.0 ★</p>
              <span className="text-[11px] text-gray-400 mt-1 block">99.4% on-time fulfillment</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-900">Manage Product Catalog</h3>
            <button
              onClick={() => setShowAddProductModal(true)}
              className="bg-primary-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Sold</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.images[0]} alt={p.nameEn} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <p className="font-bold text-gray-900 line-clamp-1">{p.nameEn}</p>
                        <p className="text-[11px] text-gray-400">{p.nameNe}</p>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{p.categorySlug}</td>
                    <td className="p-3 font-bold text-gray-900">{formatNPR(p.basePrice)}</td>
                    <td className="p-3 font-semibold text-emerald-700">
                      {p.variants.reduce((acc, v) => acc + v.stock, 0)} units
                    </td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-gray-700">{p.soldCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Orders Inbox */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Orders to Pack & Dispatch</h3>
          </div>

          <div className="divide-y divide-gray-100 p-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No incoming orders currently pending.</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="pt-4 first:pt-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold font-mono text-gray-900 text-sm">{o.orderNo}</span>
                      <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-gray-500 mt-1">
                      Recipient: <span className="font-semibold">{o.shippingAddress.fullName}</span> ({o.shippingAddress.district})
                    </p>
                    <p className="text-gray-400 text-[11px]">
                      Items: {o.items.map((i) => `${i.nameEn} (x${i.quantity})`).join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {o.status === 'confirmed' && (
                      <button
                        onClick={() => handleFulfillOrder(o.orderNo, 'packed')}
                        className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Mark as Packed
                      </button>
                    )}
                    {o.status === 'packed' && (
                      <button
                        onClick={() => handleFulfillOrder(o.orderNo, 'shipped')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                      >
                        Handover to Courier
                      </button>
                    )}
                    {o.status === 'shipped' && (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Dispatched
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Finance */}
      {activeTab === 'finance' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-gray-900">Seller Earnings & Bank Payouts</h3>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-gray-500">Available Withdrawable Balance:</span>
              <p className="text-2xl font-black text-gray-900 mt-1">{formatNPR(12500000)}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">Linked Account: Global IME Bank (A/C: *******984)</p>
            </div>
            <button
              onClick={() => showToast('Payout request of Rs. 1,25,000 sent for clearance.', 'success')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-sm"
            >
              Request Bank Payout
            </button>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="text-base font-black text-gray-900">Add New Marketplace Product</h3>
              <button onClick={() => setShowAddProductModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name (English) *</label>
                <input
                  type="text"
                  required
                  value={newProdNameEn}
                  onChange={(e) => setNewProdNameEn(e.target.value)}
                  placeholder="e.g. Handmade Lokta Paper Journal"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Name (Nepali - Optional)</label>
                <input
                  type="text"
                  value={newProdNameNe}
                  onChange={(e) => setNewProdNameNe(e.target.value)}
                  placeholder="उदा: हाते लोक्ता डायरी"
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full p-2.5 border border-gray-300 rounded-xl bg-white"
                  >
                    {SEED_CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Retail Price (Rs.) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full p-2.5 border border-gray-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Initial Stock Quantity</label>
                <input
                  type="number"
                  value={newProdStock}
                  onChange={(e) => setNewProdStock(Number(e.target.value))}
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  placeholder="Mention artisan technique, materials, care instructions..."
                  className="w-full p-2.5 border border-gray-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl shadow-md"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
