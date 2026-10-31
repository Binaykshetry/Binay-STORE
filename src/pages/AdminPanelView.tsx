import React, { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { authService } from '../services/authService';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import { Order, Product, OrderStatus, User, Role } from '../types/models';
import { formatNPR, formatBilingualDate } from '../lib/format';
import { SEED_SELLERS, SEED_COUPONS } from '../mocks/seed-data';
import {
  ShieldAlert,
  BarChart3,
  Users,
  Store,
  Tag,
  Package,
  Settings,
  CheckCircle2,
  XCircle,
  FileText,
  Percent,
  History,
  TrendingUp,
  Crown,
  UserCheck,
  ShieldCheck,
  LifeBuoy,
  Award
} from 'lucide-react';

export const AdminPanelView: React.FC = () => {
  const { showToast, navigate } = useUIStore();
  const { currentUser } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'kpis' | 'orders' | 'products' | 'users' | 'sellers' | 'coupons'>('kpis');

  // Coupon creator state
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(2000);

  const loadData = async () => {
    const ords = await orderService.getAll();
    setOrders(ords);
    const prods = await productService.getAll();
    setProducts(prods);
    const users = await authService.listAllUsers();
    setUsersList(users);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateOrderStatus = async (orderNo: string, nextStatus: OrderStatus) => {
    await orderService.updateOrderStatus(orderNo, nextStatus, 'Status overridden by Administrator', 'SuperAdmin');
    showToast(`Order ${orderNo} marked as ${nextStatus}`, 'success');
    loadData();
  };

  const handleProductStatus = async (productId: string, status: Product['status']) => {
    await productService.updateProductStatus(productId, status);
    showToast(`Product status updated to ${status}`, 'success');
    loadData();
  };

  const handleChangeRole = async (userId: string, newRole: Role) => {
    try {
      await authService.updateUserRole(userId, newRole, currentUser?.role || 'user');
      showToast(`User position re-assigned to ${newRole.toUpperCase()}!`, 'success');
      loadData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    SEED_COUPONS.push({
      code: newCouponCode.trim().toUpperCase(),
      type: 'percent',
      value: newCouponPercent,
      minSpend: newCouponMinSpend * 100,
      usageLimit: 1000,
      usedCount: 0,
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      isActive: true,
      descriptionEn: `${newCouponPercent}% Off Promo Code`,
      descriptionNe: `${newCouponPercent}% छुट कुपन कोड`
    });
    showToast(`Coupon ${newCouponCode.toUpperCase()} activated for shoppers!`, 'success');
    setNewCouponCode('');
  };

  const totalGMV = orders.reduce((acc, o) => acc + o.grandTotal, 0);
  const isOwner = currentUser?.role === 'owner';

  // Strict Role Guard
  if (currentUser?.role !== 'owner' && currentUser?.role !== 'sradmin') {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Restricted Platform Portal</h2>
        <p className="text-xs text-gray-500 mb-6">
          Access Denied: This dashboard is strictly restricted to the Platform Owner and Senior Administrators. Please sign in with verified staff operational clearance.
        </p>
        <button
          onClick={() => navigate('staff_login')}
          className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Go to Staff Operations Portal
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl pb-16">
      {/* Admin Title */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-primary-950 rounded-2xl p-6 text-white shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
            {isOwner ? <Crown className="w-6 h-6 text-gold-400" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black">
                {isOwner ? 'Platform Owner Master Console' : 'Senior Admin Console'}
              </h1>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${isOwner ? 'bg-purple-600 text-white' : 'bg-red-500 text-white'}`}>
                {currentUser?.role.toUpperCase() || 'STAFF'}
              </span>
            </div>
            <p className="text-xs text-gray-300 mt-0.5">
              Logged in as <span className="font-bold text-white">{currentUser?.name}</span> ({currentUser?.email || currentUser?.phone})
            </p>
          </div>
        </div>

        {isOwner && (
          <span className="text-xs bg-purple-500/20 text-purple-300 border border-purple-500/40 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5" />
            Full Role Assignment Privileges
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-6 text-xs font-bold overflow-x-auto no-scrollbar">
        {[
          { id: 'kpis', label: 'Platform KPIs' },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'users', label: `Users & Staff Roles (${usersList.length})` },
          { id: 'products', label: `Catalog Moderation (${products.length})` },
          { id: 'sellers', label: 'Verified Sellers (4)' },
          { id: 'coupons', label: 'Coupons & Campaigns' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 px-3 transition-colors relative whitespace-nowrap ${
              activeTab === tab.id ? 'text-primary-600 font-black' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-primary-600 rounded" />}
          </button>
        ))}
      </div>

      {/* TAB 1: Platform KPIs */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Total Platform GMV</span>
              <p className="text-xl sm:text-2xl font-black text-primary-600 mt-1">
                {formatNPR(totalGMV > 0 ? totalGMV : 42900000)}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
                Includes COD & Digital Wallets
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Gross Orders Placed</span>
              <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{orders.length + 142}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">Nationwide across 77 districts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Active Users & Sellers</span>
              <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{usersList.length}</p>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Role-governed accounts</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
              <span className="text-xs font-bold text-gray-400 uppercase">Average Order Value (AOV)</span>
              <p className="text-xl sm:text-2xl font-black text-gray-900 mt-1">{formatNPR(485000)}</p>
              <span className="text-[11px] text-gray-400 mt-1 block">High artisan & tech basket</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">All Marketplace Orders</h3>
          </div>

          <div className="divide-y divide-gray-100 p-4 space-y-4">
            {orders.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">No orders registered yet.</p>
            ) : (
              orders.map((o) => (
                <div key={o.id} className="pt-4 first:pt-0 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-sm">{o.orderNo}</span>
                      <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mt-1">
                      Customer: <span className="font-semibold">{o.shippingAddress.fullName}</span> ({o.shippingAddress.phone}) · {o.shippingAddress.district}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono mt-0.5">
                      Pay Method: {o.paymentMethod.toUpperCase()} | Total: {formatNPR(o.grandTotal)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleUpdateOrderStatus(o.orderNo, 'confirmed')}
                      className="px-2.5 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold text-[11px]"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.orderNo, 'shipped')}
                      className="px-2.5 py-1 rounded bg-blue-50 text-blue-800 hover:bg-blue-100 font-semibold text-[11px]"
                    >
                      Mark Shipped
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.orderNo, 'delivered')}
                      className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-[11px]"
                    >
                      Mark Delivered
                    </button>
                    <button
                      onClick={() => handleUpdateOrderStatus(o.orderNo, 'cancelled')}
                      className="px-2.5 py-1 rounded bg-red-50 text-red-800 hover:bg-red-100 font-semibold text-[11px]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Users & Staff Roles (Owner Governance) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-gray-900">User Directory & Role Governance</h3>
              <p className="text-xs text-gray-500">
                Manage roles: Owner, Sr Admin, Brand Manager, Helper, Normal User, Seller
              </p>
            </div>
            {isOwner && (
              <span className="text-[11px] bg-purple-100 text-purple-900 font-black px-2.5 py-1 rounded-full">
                👑 Owner Role Assignment Enabled
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="p-3">User Name</th>
                  <th className="p-3">Contact (Phone / Email)</th>
                  <th className="p-3">Signup Type</th>
                  <th className="p-3">Current Role</th>
                  <th className="p-3">Role Assignment (Owner)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usersList.map((u) => {
                  const roleColors: Record<string, string> = {
                    owner: 'bg-purple-100 text-purple-900 border-purple-200',
                    sradmin: 'bg-red-100 text-red-900 border-red-200',
                    brand_manager: 'bg-amber-100 text-amber-900 border-amber-200',
                    helper: 'bg-blue-100 text-blue-900 border-blue-200',
                    seller: 'bg-emerald-100 text-emerald-900 border-emerald-200',
                    user: 'bg-gray-100 text-gray-900 border-gray-200'
                  };

                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="p-3 font-bold text-gray-900">
                        {u.name}
                        {u.businessName && (
                          <span className="block text-[11px] text-gray-500 font-normal">
                            Store: {u.businessName} (PAN: {u.panNumber})
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-mono text-gray-600">
                        {u.phone ? `+977 ${u.phone}` : u.email}
                      </td>
                      <td className="p-3 capitalize font-semibold text-gray-500">
                        {u.accountType || 'phone'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${roleColors[u.role] || 'bg-gray-100'}`}>
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        {u.role === 'owner' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 font-bold text-[11px]">
                            <Crown className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                            <span>Top Owner (Permanent & Immutable)</span>
                          </span>
                        ) : isOwner ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                              className="px-2 py-1.5 border border-purple-300 rounded-lg text-xs font-semibold bg-purple-50/50 text-purple-950 focus:outline-none focus:ring-1 focus:ring-purple-500"
                            >
                              <option value="sradmin">Senior Admin</option>
                              <option value="brand_manager">Brand Manager</option>
                              <option value="helper">Helper (Support Desk)</option>
                              <option value="seller">Business Seller</option>
                              <option value="user">Normal User (Customer)</option>
                            </select>
                            <span className="text-[10px] text-purple-700 font-bold whitespace-nowrap">Owner Override</span>
                          </div>
                        ) : currentUser?.role === 'sradmin' ? (
                          <div className="flex items-center gap-2">
                            <select
                              value={u.role}
                              onChange={(e) => handleChangeRole(u.id, e.target.value as Role)}
                              className="px-2 py-1.5 border border-red-200 rounded-lg text-xs font-semibold bg-red-50/40 text-red-950 focus:outline-none"
                            >
                              <option value="sradmin">Senior Admin</option>
                              <option value="brand_manager">Brand Manager</option>
                              <option value="helper">Helper (Support Desk)</option>
                              <option value="seller">Business Seller</option>
                              <option value="user">Normal User (Customer)</option>
                            </select>
                            <span className="text-[10px] text-red-600 font-bold whitespace-nowrap">Admin Role</span>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-[11px]">Staff Role Managed by Owner/Admin</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: Products */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-sm font-bold text-gray-900">Catalog Moderation & Publishing</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase tracking-wider text-[10px]">
                  <th className="p-3">Product</th>
                  <th className="p-3">Merchant</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 font-semibold text-gray-900">{p.nameEn}</td>
                    <td className="p-3 text-gray-600">{p.sellerName}</td>
                    <td className="p-3 font-bold text-gray-900">{formatNPR(p.basePrice)}</td>
                    <td className="p-3">
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 flex items-center gap-2">
                      <button
                        onClick={() => handleProductStatus(p.id, 'published')}
                        className="text-emerald-600 font-bold hover:underline"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProductStatus(p.id, 'rejected')}
                        className="text-red-600 font-bold hover:underline"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: Sellers */}
      {activeTab === 'sellers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SEED_SELLERS.map((s) => (
            <div key={s.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs text-xs space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 text-sm">{s.storeName}</h4>
                <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase">
                  {s.status}
                </span>
              </div>
              <p className="text-gray-500">{s.description}</p>
              <div className="pt-2 border-t border-gray-100 text-gray-600 space-y-0.5 text-[11px]">
                <p>PAN Number: <span className="font-mono font-bold">{s.panNumber}</span></p>
                <p>Commission: <span className="font-bold">{s.commissionRate}%</span></p>
                <p>Phone: <span className="font-mono">{s.phone}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 6: Coupons */}
      {activeTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs space-y-6">
          <h3 className="text-sm font-bold text-gray-900">Campaign Promo Coupons</h3>

          <form onSubmit={handleCreateCoupon} className="p-4 bg-gray-50 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Coupon Code</label>
              <input
                type="text"
                required
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value)}
                placeholder="e.g. TIHAR2026"
                className="w-full p-2 border border-gray-300 rounded-lg uppercase font-mono font-bold"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Discount %</label>
              <input
                type="number"
                min="1"
                max="90"
                value={newCouponPercent}
                onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="font-bold text-gray-700 block mb-1">Min Spend (Rs.)</label>
              <input
                type="number"
                value={newCouponMinSpend}
                onChange={(e) => setNewCouponMinSpend(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-sm"
            >
              Add Coupon
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            {SEED_COUPONS.map((c) => (
              <div key={c.code} className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
                <span className="font-black text-emerald-800 text-sm font-mono block">{c.code}</span>
                <p className="text-emerald-700 font-semibold mt-0.5">{c.descriptionEn}</p>
                <p className="text-[10px] text-gray-500 mt-1">Min: Rs. {c.minSpend / 100} | Used: {c.usedCount} times</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
