import React, { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { orderService } from '../services/orderService';
import { Order, OrderStatus } from '../types/models';
import { formatNPR } from '../lib/format';
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  AlertCircle,
  XCircle,
  FileText,
  Phone,
  ShieldCheck,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

export const TrackOrderView: React.FC = () => {
  const { currentOrderNo, navigate, showToast } = useUIStore();

  const [orderNoInput, setOrderNoInput] = useState(currentOrderNo || '');
  const [phoneInput, setPhoneInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery address');

  useEffect(() => {
    async function checkInitial() {
      if (currentOrderNo) {
        setLoading(true);
        const found = await orderService.getByOrderNo(currentOrderNo);
        if (found) {
          setOrder(found);
          setOrderNoInput(found.orderNo);
          setPhoneInput(found.shippingAddress.phone || '');
        }
        setLoading(false);
      } else {
        // If no order selected, look for latest placed order
        const orders = await orderService.getAll();
        if (orders.length > 0) {
          setOrder(orders[0]);
          setOrderNoInput(orders[0].orderNo);
          setPhoneInput(orders[0].shippingAddress.phone || '');
        }
      }
    }
    checkInitial();
  }, [currentOrderNo]);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!orderNoInput.trim()) {
      setErrorMsg('Please enter your Order Number (e.g. NS-20261030-942)');
      return;
    }

    setLoading(true);
    try {
      const found = await orderService.getByOrderNo(orderNoInput.trim());
      if (!found) {
        setErrorMsg(`No order found matching "${orderNoInput.trim()}". Please check your receipt.`);
        setOrder(null);
      } else {
        // Validate phone if provided
        if (phoneInput.trim()) {
          const cleanInputPhone = phoneInput.replace(/[\s-+]/g, '').replace(/^977/, '');
          const cleanOrderPhone = found.shippingAddress.phone.replace(/[\s-+]/g, '').replace(/^977/, '');
          if (cleanInputPhone !== cleanOrderPhone) {
            setErrorMsg('Order number exists, but the phone number does not match delivery details.');
            setOrder(null);
            setLoading(false);
            return;
          }
        }
        setOrder(found);
        showToast(`Tracking details loaded for ${found.orderNo}`, 'success');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve tracking info');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    try {
      const updated = await orderService.cancelOrder(order.orderNo, cancelReason);
      setOrder(updated);
      setCancelModalOpen(false);
      showToast(`Order ${order.orderNo} has been cancelled.`, 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const steps: { status: OrderStatus; label: string; desc: string }[] = [
    { status: 'confirmed', label: 'Order Confirmed', desc: 'Verified and sent to seller' },
    { status: 'packed', label: 'Packed by Seller', desc: 'Quality checked and securely boxed' },
    { status: 'shipped', label: 'Handed to Courier', desc: 'In transit with Nepal Express' },
    { status: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider assigned to your area' },
    { status: 'delivered', label: 'Delivered', desc: 'Package received by customer' }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return 0;
      case 'confirmed':
        return 0;
      case 'packed':
        return 1;
      case 'shipped':
        return 2;
      case 'out_for_delivery':
        return 3;
      case 'delivered':
        return 4;
      default:
        return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;
  const isCancelled = order?.status === 'cancelled';

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb / Back button */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Home</span>
        </button>
        <span>/</span>
        <span className="font-bold text-gray-800">Track Order</span>
      </div>

      {/* Hero Tracker Card */}
      <div className="bg-gradient-to-r from-primary-900 via-primary-800 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl mb-8">
        <div className="max-w-2xl">
          <span className="bg-gold-500/20 text-gold-300 border border-gold-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Live Shipment Tracker
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2 tracking-tight">
            Track Your NepaleseStore Shipment
          </h1>
          <p className="text-xs sm:text-sm text-gray-200 mt-1 leading-relaxed">
            Enter your order reference number and mobile number to see real-time updates from Kathmandu warehouse to your doorstep across all 7 provinces.
          </p>

          <form onSubmit={handleTrack} className="mt-6 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                value={orderNoInput}
                onChange={(e) => setOrderNoInput(e.target.value)}
                placeholder="Order Number (e.g. NS-20261030-942)"
                className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 placeholder-gray-300 focus:placeholder-gray-400 rounded-xl text-xs sm:text-sm font-mono border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
              />
            </div>

            <div className="relative sm:w-48">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Mobile (Optional)"
                className="w-full pl-10 pr-3 py-3 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 placeholder-gray-300 focus:placeholder-gray-400 rounded-xl text-xs sm:text-sm font-mono border border-white/20 focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Tracking...' : 'Track Package'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-3 mb-6 animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Active Order Dossier */}
      {order && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Header Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-black text-gray-900 font-mono">{order.orderNo}</h2>
                <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                  isCancelled
                    ? 'bg-red-100 text-red-800'
                    : order.status === 'delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-primary-100 text-primary-800'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Placed on {new Date(order.placedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(order.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs">
              <div className="text-right">
                <span className="text-[10px] text-gray-400 block uppercase font-bold">Estimated Delivery</span>
                <span className="font-extrabold text-gray-900 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-primary-600" />
                  {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>

              {!['shipped', 'out_for_delivery', 'delivered', 'cancelled'].includes(order.status) && (
                <button
                  onClick={() => setCancelModalOpen(true)}
                  className="px-3 py-1.5 border border-red-200 text-red-700 hover:bg-red-50 rounded-xl font-bold transition-colors text-xs"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>

          {/* Stepper Timeline */}
          {!isCancelled ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-8">
                Delivery Progress
              </h3>

              <div className="relative">
                {/* Horizontal Progress bar for desktop */}
                <div className="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-gray-200 -z-0">
                  <div
                    className="h-full bg-primary-600 transition-all duration-500"
                    style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 sm:gap-2 relative z-10">
                  {steps.map((step, idx) => {
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;

                    return (
                      <div key={step.status} className="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all shrink-0 ${
                            isCurrent
                              ? 'bg-primary-600 text-white ring-4 ring-primary-100 shadow-md scale-110'
                              : isPassed
                              ? 'bg-emerald-600 text-white'
                              : 'bg-gray-100 text-gray-400 border border-gray-200'
                          }`}
                        >
                          {isPassed && !isCurrent ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            idx + 1
                          )}
                        </div>

                        <div>
                          <p className={`text-xs font-bold leading-tight ${isCurrent ? 'text-primary-700' : isPassed ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-tight hidden sm:block">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Courier info footer */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between text-xs text-gray-600 gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-primary-600" />
                  <span>Courier: <b className="text-gray-900">{order.courierName || 'Nepal Express Courier'}</b></span>
                  <span>·</span>
                  <span>Tracking Code: <b className="font-mono text-gray-900">{order.trackingNumber || 'NS-TRK-PENDING'}</b></span>
                </div>

                <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                  ✓ Verified Dispatch
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center text-red-800">
              <XCircle className="w-10 h-10 text-red-600 mx-auto mb-2" />
              <h3 className="font-bold text-base">This Order Has Been Cancelled</h3>
              <p className="text-xs text-red-700 mt-1">
                Any pre-paid amount has been queued for reversal to your original payment method within 2-3 banking days.
              </p>
            </div>
          )}

          {/* Two-Column Details: Shipping Address & Items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Items in shipment */}
            <div className="md:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-4">Items in Shipment ({order.items.length})</h3>
              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.nameEn}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-gray-900">{item.nameEn}</h4>
                        <p className="text-[11px] text-gray-500">{item.variantName} · Qty: {item.quantity}</p>
                        <p className="text-[11px] text-emerald-700 font-bold">13% VAT Inclusive</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-900">
                      {formatNPR(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Col: Address & Settlement */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary-600" />
                  <span>Delivery Address</span>
                </h3>
                <div className="text-xs text-gray-600 space-y-1">
                  <p className="font-bold text-gray-900">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.phone}</p>
                  <p>{order.shippingAddress.street}, Ward {order.shippingAddress.ward}</p>
                  <p>{order.shippingAddress.municipality}, {order.shippingAddress.district}</p>
                  <p className="font-bold text-primary-700">{order.shippingAddress.province}</p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-xs font-bold text-gray-700 mb-2">Payment Breakdown</h4>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>{formatNPR(order.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{order.shippingTotal === 0 ? 'FREE' : formatNPR(order.shippingTotal)}</span>
                    </div>
                    {order.discountTotal > 0 && (
                      <div className="flex justify-between text-emerald-600 font-bold">
                        <span>Discount Voucher:</span>
                        <span>-{formatNPR(order.discountTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black text-gray-900 pt-2 border-t text-sm">
                      <span>Grand Total:</span>
                      <span className="text-primary-700">{formatNPR(order.grandTotal)}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      Payment Mode: <b className="uppercase">{order.paymentMethod}</b> ({order.paymentStatus})
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={() => navigate('contact')}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-800 font-bold text-xs rounded-xl border border-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span>Need Help with Delivery?</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {cancelModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-black text-gray-900 mb-2">Cancel Order</h3>
            <p className="text-xs text-gray-500 mb-4">
              Are you sure you want to cancel order <b>{order?.orderNo}</b>? This action will restock the inventory.
            </p>

            <div className="space-y-2 mb-4">
              {[
                'Change of delivery address',
                'Ordered by mistake',
                'Found a better price elsewhere',
                'Delivery time is too long'
              ].map((reason) => (
                <label key={reason} className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="radio"
                    name="cancelReason"
                    checked={cancelReason === reason}
                    onChange={() => setCancelReason(reason)}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span>{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleCancelOrder}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl transition-colors shadow-md"
              >
                Confirm Cancellation
              </button>
              <button
                onClick={() => setCancelModalOpen(false)}
                className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

