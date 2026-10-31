import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';
import { useUIStore } from '../store/useUIStore';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { Order, Product } from '../types/models';
import { formatNPR, formatBilingualDate } from '../lib/format';
import { NEPAL_PROVINCES } from '../lib/nepal-geo';
import {
  Package,
  Heart,
  MapPin,
  Wallet,
  User as UserIcon,
  ShoppingBag,
  Trash2,
  Plus,
  AlertCircle,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle
} from 'lucide-react';

export const AccountView: React.FC = () => {
  const { currentUser, savedAddresses, wishlistProductIds, toggleWishlist, topupWallet, addAddress } =
    useAuthStore();
  const { addItem } = useCartStore();
  const { navigate, showToast, openAuthModal } = useUIStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'addresses' | 'wallet' | 'profile'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>('all');

  // Cancel order modal state
  const [cancellingOrderNo, setCancellingOrderNo] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('Found a better price elsewhere');

  // Return request modal state
  const [returnOrderNo, setReturnOrderNo] = useState<string | null>(null);
  const [returnReason, setReturnReason] = useState('Defective or damaged item');

  // Wallet top up state
  const [topupAmount, setTopupAmount] = useState<number>(1000);
  const [showTopupModal, setShowTopupModal] = useState(false);

  // Add Address state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrFullName, setNewAddrFullName] = useState('');
  const [newAddrPhone, setNewAddrPhone] = useState('');
  const [newAddrProvince, setNewAddrProvince] = useState('Bagmati Province');
  const [newAddrDistrict, setNewAddrDistrict] = useState('Kathmandu');
  const [newAddrMun, setNewAddrMun] = useState('');
  const [newAddrWard, setNewAddrWard] = useState('Ward 4');
  const [newAddrStreet, setNewAddrStreet] = useState('');

  const loadOrders = async () => {
    const list = await orderService.getAll();
    setOrders(list);
  };

  const loadWishlist = async () => {
    const all = await productService.getAll();
    setWishlistProducts(all.filter((p) => wishlistProductIds.includes(p.id)));
  };

  useEffect(() => {
    loadOrders();
    loadWishlist();
  }, [wishlistProductIds]);

  const handleCancelOrder = async () => {
    if (!cancellingOrderNo) return;
    try {
      await orderService.cancelOrder(cancellingOrderNo, cancelReason);
      showToast(`Order ${cancellingOrderNo} has been cancelled and restocked.`, 'success');
      setCancellingOrderNo(null);
      loadOrders();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleReturnSubmit = async () => {
    if (!returnOrderNo) return;
    try {
      await orderService.updateOrderStatus(
        returnOrderNo,
        'return_requested',
        `Return requested: ${returnReason}`,
        'Customer'
      );
      showToast('Return request submitted. Our courier will pick up the parcel within 48h.', 'success');
      setReturnOrderNo(null);
      loadOrders();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleWalletTopupSubmit = () => {
    topupWallet(topupAmount * 100);
    showToast(`Successfully added ${formatNPR(topupAmount * 100)} to store wallet!`, 'success');
    setShowTopupModal(false);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrFullName || !newAddrPhone || !newAddrStreet) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    addAddress({
      label: 'Home',
      fullName: newAddrFullName,
      phone: newAddrPhone,
      province: newAddrProvince,
      district: newAddrDistrict,
      municipality: newAddrMun || 'City',
      ward: newAddrWard,
      street: newAddrStreet,
      isDefault: false
    });
    showToast('New address saved to your address book!', 'success');
    setShowAddressModal(false);
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.status === orderFilter;
  });

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-20 max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Customer Account Access</h2>
        <p className="text-xs text-gray-500 mb-6">
          Please sign in to track your order deliveries, view saved wishlist items, manage delivery addresses, and use your store wallet.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl pb-20">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Account Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs shrink-0">
          {/* User Brief */}
          <div className="p-3 bg-primary-50/70 rounded-xl border border-primary-100 flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-sm shrink-0">
              {currentUser?.name.charAt(0) || 'U'}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-xs text-gray-900 truncate">
                {currentUser?.name || 'Customer Account'}
              </h3>
              <p className="text-[10px] text-gray-500 truncate">{currentUser?.email || currentUser?.phone}</p>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'orders' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Package className="w-4 h-4" />
                <span>My Orders</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${
                activeTab === 'wishlist' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Heart className="w-4 h-4" />
                <span>Wishlist</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === 'wishlist' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {wishlistProductIds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'addresses' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Address Book</span>
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'wallet' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Wallet & Credits</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center gap-2.5 transition-colors ${
                activeTab === 'profile' ? 'bg-primary-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile Details</span>
            </button>

            {['owner', 'sradmin', 'brand_manager', 'helper'].includes(currentUser?.role || '') && (
              <button
                onClick={() => navigate('staff_profile')}
                className="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors font-bold mt-2 border border-purple-200"
              >
                <span>🎖️ Staff Portal & Ranks</span>
                <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-200 text-purple-900 font-black">
                  {currentUser?.role}
                </span>
              </button>
            )}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
          {/* TAB 1: Orders */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-black text-gray-900">My Orders History</h2>
                  <p className="text-xs text-gray-500">Track shipments, download VAT bills, or initiate 7-day returns</p>
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1 overflow-x-auto text-xs font-semibold bg-gray-100 p-1 rounded-xl">
                  {['all', 'confirmed', 'shipped', 'delivered', 'cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize whitespace-nowrap transition-colors ${
                        orderFilter === st ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="py-12 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">No orders found in this category</p>
                  <p className="text-xs text-gray-400 mt-1">Place an order with Cash on Delivery or eSewa/Khalti.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => {
                    const { full: bilingualDate } = formatBilingualDate(order.placedAt);
                    const canCancel = ['confirmed', 'pending_payment'].includes(order.status);
                    const canReturn = order.status === 'delivered';

                    return (
                      <div key={order.id} className="border border-gray-200 rounded-2xl overflow-hidden shadow-2xs">
                        {/* Order Header */}
                        <div className="bg-gray-50/80 p-4 border-b border-gray-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-gray-900 font-mono text-sm">{order.orderNo}</span>
                            <span className="text-gray-400 ml-2">Placed on {bilingualDate}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[11px] font-black uppercase ${
                                order.status === 'delivered'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {order.status.replace('_', ' ')}
                            </span>
                            <span className="font-black text-gray-900 text-sm">
                              {formatNPR(order.grandTotal)}
                            </span>
                          </div>
                        </div>

                        {/* Items */}
                        <div className="p-4 divide-y divide-gray-100">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.imageUrl}
                                  alt={item.nameEn}
                                  className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                                />
                                <div>
                                  <p className="font-bold text-gray-800 line-clamp-1">{item.nameEn}</p>
                                  <p className="text-gray-400 text-[11px]">
                                    {item.variantName} · Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <span className="font-extrabold text-primary-600">
                                {formatNPR(item.lineTotal)}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Actions */}
                        <div className="p-3 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="text-gray-500 font-mono text-[11px]">
                            Tracking: {order.trackingNumber} ({order.courierName})
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate('order_success', { orderNo: order.orderNo })}
                              className="px-3 py-1.5 rounded-lg border border-gray-300 bg-white font-bold text-gray-700 hover:bg-gray-100 flex items-center gap-1"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              <span>View VAT Invoice</span>
                            </button>

                            {canCancel && (
                              <button
                                onClick={() => setCancellingOrderNo(order.orderNo)}
                                className="px-3 py-1.5 rounded-lg border border-red-200 bg-red-50 text-red-700 font-bold hover:bg-red-100"
                              >
                                Cancel Order
                              </button>
                            )}

                            {canReturn && (
                              <button
                                onClick={() => setReturnOrderNo(order.orderNo)}
                                className="px-3 py-1.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 font-bold hover:bg-amber-100 flex items-center gap-1"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Request 7-Day Return</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Wishlist */}
          {activeTab === 'wishlist' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">Saved Wishlist Items</h2>
                <p className="text-xs text-gray-500">Products you have bookmarked for later purchase</p>
              </div>

              {wishlistProducts.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm font-semibold text-gray-700">Your wishlist is empty</p>
                  <p className="text-xs text-gray-400 mt-1">Click the heart icon on any product to save it.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {wishlistProducts.map((p) => (
                    <div key={p.id} className="border border-gray-200 rounded-xl p-3 flex flex-col justify-between">
                      <div className="flex items-center gap-3">
                        <img src={p.images[0]} alt={p.nameEn} className="w-16 h-16 rounded-lg object-cover" />
                        <div>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{p.nameEn}</h4>
                          <span className="text-xs font-extrabold text-primary-600 block mt-1">
                            {formatNPR(p.basePrice)}
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between">
                        <button
                          onClick={() => {
                            addItem(p);
                            showToast(`Added to cart!`, 'success');
                          }}
                          className="text-xs font-bold text-primary-600 hover:underline flex items-center gap-1"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Move to Cart</span>
                        </button>
                        <button
                          onClick={() => toggleWishlist(p.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Address Book */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-black text-gray-900">Saved Shipping Addresses</h2>
                  <p className="text-xs text-gray-500">Manage delivery locations for quick checkout</p>
                </div>
                <button
                  onClick={() => setShowAddressModal(true)}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 text-xs space-y-1 relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900 text-sm">{addr.fullName}</span>
                      <span className="bg-primary-100 text-primary-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {addr.label}
                      </span>
                    </div>
                    <p className="text-gray-600">Phone: {addr.phone}</p>
                    <p className="text-gray-600">{addr.street}, {addr.ward}</p>
                    <p className="text-gray-600">{addr.municipality}, {addr.district}</p>
                    <p className="text-gray-600 font-medium">{addr.province}</p>
                    {addr.landmark && <p className="text-gray-400 italic">Landmark: {addr.landmark}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Wallet & Credits */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h2 className="text-lg font-black text-gray-900">NepaleseStore Wallet</h2>
                  <p className="text-xs text-gray-500">Instant one-click checkout balance and return refunds</p>
                </div>
                <button
                  onClick={() => setShowTopupModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Top Up Balance</span>
                </button>
              </div>

              {/* Wallet Card */}
              <div className="bg-gradient-to-r from-slate-900 via-secondary-900 to-slate-950 p-6 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Available Balance</span>
                  <h3 className="text-3xl font-black text-white mt-1">
                    {formatNPR(currentUser?.walletBalance || 0)}
                  </h3>
                  <p className="text-[11px] text-gray-400 mt-1">User ID: {currentUser?.phone || 'Guest'}</p>
                </div>

                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold">eSewa Top-Up</span>
                  <span className="px-3 py-1 bg-white/10 rounded-lg text-xs font-semibold">Khalti Top-Up</span>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">Recent Wallet Transactions</h4>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">Festive Dashain Bonus Credit</p>
                      <p className="text-[10px] text-gray-400">Oct 28, 2026</p>
                    </div>
                    <span className="font-bold text-emerald-600">+Rs. 500</span>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">Return Refund (Order #NS-202609-842)</p>
                      <p className="text-[10px] text-gray-400">Sep 15, 2026</p>
                    </div>
                    <span className="font-bold text-emerald-600">+Rs. 4,000</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Profile */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-gray-100">
                <h2 className="text-lg font-black text-gray-900">Personal Profile</h2>
                <p className="text-xs text-gray-500">Personal details and communication settings</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.name || 'Aarav Sharma'}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Mobile Phone (Nepal +977)</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.phone || '9841234567'}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.email || 'aarav.sharma@example.com'}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Account Role</label>
                  <input
                    type="text"
                    disabled
                    value={currentUser?.role.toUpperCase() || 'CUSTOMER'}
                    className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-bold"
                  />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Cancel Order Modal */}
      {cancellingOrderNo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-gray-900 mb-1">Cancel Order?</h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to cancel order <span className="font-bold font-mono">{cancellingOrderNo}</span>?
            </p>
            <label className="text-xs font-bold text-gray-700 block mb-1">Reason for cancellation:</label>
            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl text-xs mb-4"
            >
              <option>Found a better price elsewhere</option>
              <option>Ordered by mistake</option>
              <option>Need to change delivery location</option>
              <option>Delivery timeline too late</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setCancellingOrderNo(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {returnOrderNo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-gray-900 mb-1">7-Day Easy Return Request</h3>
            <p className="text-xs text-gray-500 mb-4">
              Order: <span className="font-bold font-mono">{returnOrderNo}</span>
            </p>
            <label className="text-xs font-bold text-gray-700 block mb-1">Return Reason:</label>
            <select
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-xl text-xs mb-4"
            >
              <option>Defective or damaged item</option>
              <option>Item not as pictured / size mismatch</option>
              <option>Missing accessories / parts</option>
              <option>Changed my mind</option>
            </select>
            <div className="flex gap-2">
              <button
                onClick={() => setReturnOrderNo(null)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Close
              </button>
              <button
                onClick={handleReturnSubmit}
                className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Top Up Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-gray-900 mb-1">Top Up Wallet</h3>
            <p className="text-xs text-gray-500 mb-4">Select or enter top-up amount</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setTopupAmount(amt)}
                  className={`py-2 rounded-xl text-xs font-bold border ${
                    topupAmount === amt ? 'bg-emerald-50 border-emerald-600 text-emerald-800' : 'border-gray-200'
                  }`}
                >
                  Rs. {amt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowTopupModal(false)}
                className="flex-1 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleWalletTopupSubmit}
                className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Simulate Top Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-gray-900 mb-3">Add New Address</h3>
            <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddrFullName}
                  onChange={(e) => setNewAddrFullName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newAddrPhone}
                  onChange={(e) => setNewAddrPhone(e.target.value)}
                  placeholder="98xxxxxxxx"
                  className="w-full p-2 border border-gray-300 rounded-lg font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Province</label>
                  <select
                    value={newAddrProvince}
                    onChange={(e) => setNewAddrProvince(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white"
                  >
                    {NEPAL_PROVINCES.map((p) => (
                      <option key={p.id} value={p.nameEn}>{p.nameEn}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">District</label>
                  <input
                    type="text"
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-xl text-xs font-bold text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
