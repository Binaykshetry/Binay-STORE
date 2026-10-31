import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/useUIStore';
import { orderService } from '../services/orderService';
import { NEPAL_PROVINCES, getDeliveryZoneForDistrict } from '../lib/nepal-geo';
import { formatNPR, isValidNepaliPhone } from '../lib/format';
import { PaymentMethod, Address } from '../types/models';
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  Lock,
  QrCode,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  AlertCircle
} from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    items,
    appliedCoupon,
    clearCart,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getVatAmount,
    getGrandTotal,
    selectedDistrict,
    setSelectedDistrict
  } = useCartStore();
  const { currentUser } = useAuthStore();
  const { language, t } = useLanguageStore();
  const { navigate, showToast } = useUIStore();

  // Address Form State
  const [fullName, setFullName] = useState(currentUser?.name || 'Aarav Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '9841234567');
  const [province, setProvince] = useState('Bagmati Province');
  const [district, setDistrict] = useState(selectedDistrict || 'Kathmandu');
  const [municipality, setMunicipality] = useState('Kathmandu Metropolitan City');
  const [ward, setWard] = useState('Ward 3');
  const [street, setStreet] = useState('Lazimpat, Uttardhoka Marg');
  const [landmark, setLandmark] = useState('Opposite French Embassy');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Simulated gateway modals
  const [showEsewaModal, setShowEsewaModal] = useState(false);
  const [showKhaltiModal, setShowKhaltiModal] = useState(false);
  const [showFonepayModal, setShowFonepayModal] = useState(false);
  const [gatewayProcessing, setGatewayProcessing] = useState(false);

  // Available districts based on selected province
  const currentProvinceData = NEPAL_PROVINCES.find(
    (p) => p.nameEn === province || p.nameNe === province
  ) || NEPAL_PROVINCES[2];

  const handleProvinceChange = (provName: string) => {
    setProvince(provName);
    const pData = NEPAL_PROVINCES.find((p) => p.nameEn === provName);
    if (pData && pData.districts.length > 0) {
      setDistrict(pData.districts[0]);
      setSelectedDistrict(pData.districts[0]);
    }
  };

  const handleDistrictChange = (distName: string) => {
    setDistrict(distName);
    setSelectedDistrict(distName);
  };

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const vat = getVatAmount();
  const grandTotal = getGrandTotal();
  const deliveryZone = getDeliveryZoneForDistrict(district);

  // Safe redirect on empty cart
  React.useEffect(() => {
    if (items.length === 0) {
      navigate('cart');
    }
  }, [items.length]);

  // Max COD Limit (Rs. 50,000 per Nepal Commerce regulations)
  const isCodAllowed = grandTotal <= 5000000;

  React.useEffect(() => {
    if (!isCodAllowed && paymentMethod === 'cod') {
      setPaymentMethod('esewa');
    }
  }, [isCodAllowed, paymentMethod]);

  if (items.length === 0) {
    return null;
  }

  const executeOrderPlacement = async (paymentRef?: string) => {
    if (!fullName.trim()) {
      showToast('Please enter your full recipient name', 'error');
      return;
    }
    if (!isValidNepaliPhone(phone)) {
      showToast('Please enter a valid 10-digit Nepali mobile number (98/97...)', 'error');
      return;
    }
    if (!street.trim()) {
      showToast('Please provide your street or tole location', 'error');
      return;
    }
    if (!termsAccepted) {
      showToast('Please accept the Terms and 7-Day Return Policy', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const shippingAddress: Address = {
        id: `addr_${Date.now()}`,
        userId: currentUser?.id || 'guest',
        label: 'Home',
        fullName,
        phone,
        province,
        district,
        municipality,
        ward,
        street,
        landmark,
        isDefault: true
      };

      const newOrder = await orderService.placeOrder({
        userId: currentUser?.id,
        items,
        shippingAddress,
        subtotal,
        discountTotal: discount,
        shippingTotal: shipping,
        taxTotal: vat,
        grandTotal,
        paymentMethod,
        paymentRef,
        couponCode: appliedCoupon?.code,
        deliveryZoneName: deliveryZone.nameEn
      });

      clearCart();
      showToast('Order confirmed! SMS and tracking dispatched.', 'success');
      navigate('order_success', { orderNo: newOrder.orderNo });
    } catch (err: any) {
      showToast(err.message || 'Failed to place order', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'esewa') {
      setShowEsewaModal(true);
      return;
    }
    if (paymentMethod === 'khalti') {
      setShowKhaltiModal(true);
      return;
    }
    if (paymentMethod === 'fonepay') {
      setShowFonepayModal(true);
      return;
    }
    executeOrderPlacement();
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <button onClick={() => navigate('home')} className="hover:text-primary-600">Home</button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <button onClick={() => navigate('cart')} className="hover:text-primary-600">Cart</button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="font-semibold text-gray-800">Checkout</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
        Secure Checkout
      </h1>

      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Address, Delivery, Payment (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Delivery Address */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary-600" />
                <span>Delivery Address (Nepal 77 Districts)</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Recipient Name *</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Mobile Phone (98/97...) *</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9841234567"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Province *</label>
                <select
                  value={province}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-primary-500 font-medium"
                >
                  {NEPAL_PROVINCES.map((p) => (
                    <option key={p.id} value={p.nameEn}>
                      {p.nameEn} ({p.nameNe})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">District *</label>
                <select
                  value={district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full p-2.5 border border-gray-300 rounded-xl bg-white focus:ring-1 focus:ring-primary-500 font-medium"
                >
                  {currentProvinceData.districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Municipality / Rural Municipality *</label>
                <input
                  type="text"
                  required
                  value={municipality}
                  onChange={(e) => setMunicipality(e.target.value)}
                  placeholder="e.g. Kathmandu Metropolitan City"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Ward Number *</label>
                <input
                  type="text"
                  required
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  placeholder="e.g. Ward 3"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Street / Tole / House Location *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g. Lazimpat, Uttardhoka Marg, House #42"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Nearby Landmark (Optional)</label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite French Embassy, near blue temple"
                  className="w-full p-2.5 border border-gray-300 rounded-xl focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>

          {/* STEP 2: Delivery Zone & Speed */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Truck className="w-4 h-4 text-primary-600" />
                <span>Delivery Zone & ETA</span>
              </h2>
            </div>

            <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div>
                <p className="font-bold text-gray-900 text-sm">{deliveryZone.nameEn}</p>
                <p className="text-gray-500 mt-0.5">{deliveryZone.descriptionEn}</p>
                <p className="text-emerald-700 font-semibold mt-1">
                  Estimated Delivery: {deliveryZone.estimatedDays}
                </p>
              </div>
              <span className="text-sm font-black text-primary-600">
                {shipping === 0 ? 'FREE DELIVERY' : formatNPR(shipping)}
              </span>
            </div>
          </div>

          {/* STEP 3: Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-gray-100">
              <div className="w-7 h-7 rounded-full bg-primary-600 text-white font-bold flex items-center justify-center text-xs">
                3
              </div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-primary-600" />
                <span>Select Payment Method</span>
              </h2>
            </div>

            <div className="space-y-3">
              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
                  !isCodAllowed
                    ? 'opacity-50 bg-gray-50 border-gray-200 cursor-not-allowed'
                    : paymentMethod === 'cod'
                    ? 'border-primary-600 bg-primary-50/40 ring-1 ring-primary-600 cursor-pointer'
                    : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  disabled={!isCodAllowed}
                  checked={paymentMethod === 'cod'}
                  onChange={() => isCodAllowed && setPaymentMethod('cod')}
                  className="mt-1 text-primary-600 focus:ring-primary-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-gray-900">
                      Cash on Delivery (COD)
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isCodAllowed ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-700'}`}>
                      {isCodAllowed ? 'Most Popular' : 'Max Rs. 50,000 Limit'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {isCodAllowed
                      ? 'Pay with cash at your doorstep upon safe parcel inspection.'
                      : 'COD unavailable: Orders above Rs. 50,000 require secure digital payment (eSewa / Khalti / Fonepay).'}
                  </p>
                </div>
              </label>

              {/* eSewa */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'esewa'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-1 ring-emerald-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'esewa'}
                  onChange={() => setPaymentMethod('esewa')}
                  className="mt-1 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-emerald-700">
                      eSewa Digital Wallet
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                      Instant Verification
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Pay instantly via Nepal’s leading eSewa wallet portal.
                  </p>
                </div>
              </label>

              {/* Khalti */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'khalti'
                    ? 'border-purple-600 bg-purple-50/40 ring-1 ring-purple-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'khalti'}
                  onChange={() => setPaymentMethod('khalti')}
                  className="mt-1 text-purple-600 focus:ring-purple-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-purple-700">
                      Khalti Digital Wallet
                    </span>
                    <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      Cashback Offers
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Fast payment via Khalti mobile number & MPIN.
                  </p>
                </div>
              </label>

              {/* Fonepay QR */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'fonepay'
                    ? 'border-red-600 bg-red-50/40 ring-1 ring-red-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'fonepay'}
                  onChange={() => setPaymentMethod('fonepay')}
                  className="mt-1 text-red-600 focus:ring-red-500"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-extrabold text-red-700">
                      Fonepay QR / Mobile Banking
                    </span>
                    <span className="text-[10px] font-bold bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      Any Bank App
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Scan dynamic QR using Nabil, Global IME, NIC Asia or any mobile banking app.
                  </p>
                </div>
              </label>

              {/* Direct Bank Transfer */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                  paymentMethod === 'bank'
                    ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bank'}
                  onChange={() => setPaymentMethod('bank')}
                  className="mt-1 text-blue-600 focus:ring-blue-500"
                />
                <div className="flex-1">
                  <span className="text-xs sm:text-sm font-extrabold text-blue-800">
                    Direct Corporate Bank Transfer
                  </span>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Account: NepaleseStore Pvt Ltd (Global IME Bank A/C: 001010100998811).
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Sticky Order Summary (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
              Order Items ({items.length})
            </h3>

            {/* Snippet of items */}
            <div className="max-h-52 overflow-y-auto divide-y divide-gray-100 space-y-2 pr-1">
              {items.map((item) => (
                <div key={item.id} className="pt-2 first:pt-0 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.variant.imageUrl || item.product.images[0]}
                      alt="item"
                      className="w-10 h-10 rounded-md object-cover border border-gray-100 shrink-0"
                    />
                    <div className="truncate max-w-[140px]">
                      <p className="font-semibold text-gray-800 truncate">{item.product.nameEn}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">
                    {formatNPR((item.variant.price || item.product.basePrice) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="pt-3 border-t border-gray-100 space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">{formatNPR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatNPR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Shipping ({deliveryZone.nameEn.split('(')[0]})</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                  {shipping === 0 ? 'FREE' : formatNPR(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>13% VAT (Included)</span>
                <span>{formatNPR(vat)}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">Total Payable</span>
                <span className="text-xl font-black text-primary-600">
                  {formatNPR(grandTotal)}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-2 cursor-pointer text-xs text-gray-600 select-none">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 rounded text-primary-600 focus:ring-primary-500"
                />
                <span>
                  I agree to NepaleseStore’s <span className="text-primary-600 font-semibold">Terms</span> and 7-day return policy.
                </span>
              </label>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-98 transition-all disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? 'Confirming Order...'
                  : paymentMethod === 'cod'
                  ? 'Confirm Order (COD)'
                  : `Pay with ${paymentMethod.toUpperCase()}`}
              </span>
            </button>
          </div>
        </div>
      </form>

      {/* --- SIMULATED PAYMENT MODALS --- */}
      {/* 1. eSewa Modal */}
      {showEsewaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-black">e</span>
            </div>
            <h3 className="text-lg font-black text-emerald-800">eSewa Payment Portal</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Paying <span className="font-bold text-gray-900">{formatNPR(grandTotal)}</span> to NepaleseStore
            </p>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-left text-xs space-y-2 mb-4">
              <p className="text-gray-500">eSewa ID: <span className="font-bold text-gray-800">9841234567</span></p>
              <p className="text-gray-500">Status: <span className="font-bold text-emerald-700">Authorized Session</span></p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowEsewaModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={gatewayProcessing}
                onClick={async () => {
                  setGatewayProcessing(true);
                  await new Promise((r) => setTimeout(r, 900));
                  setShowEsewaModal(false);
                  setGatewayProcessing(false);
                  executeOrderPlacement('ESEWA-EPAY-' + Date.now());
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
              >
                {gatewayProcessing ? 'Authorizing...' : 'Authorize & Pay'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Khalti Modal */}
      {showKhaltiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-black">K</span>
            </div>
            <h3 className="text-lg font-black text-purple-900">Khalti Digital Payment</h3>
            <p className="text-xs text-gray-500 mt-1 mb-4">
              Total: <span className="font-bold text-gray-900">{formatNPR(grandTotal)}</span>
            </p>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-left text-xs mb-4">
              <p className="text-purple-900 font-semibold">Simulated Khalti Gateway</p>
              <p className="text-purple-700 text-[11px] mt-0.5">Test mode verified successfully.</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowKhaltiModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                disabled={gatewayProcessing}
                onClick={async () => {
                  setGatewayProcessing(true);
                  await new Promise((r) => setTimeout(r, 900));
                  setShowKhaltiModal(false);
                  setGatewayProcessing(false);
                  executeOrderPlacement('KHALTI-TXN-' + Date.now());
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md"
              >
                {gatewayProcessing ? 'Processing...' : 'Pay via Khalti'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Fonepay QR Modal */}
      {showFonepayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-in zoom-in-95">
            <h3 className="text-lg font-black text-red-600 mb-1">Fonepay Dynamic QR</h3>
            <p className="text-xs text-gray-500 mb-4">Scan with any Nepali Mobile Banking App</p>

            {/* QR Mockup */}
            <div className="w-48 h-48 bg-white border-2 border-red-500 rounded-xl mx-auto flex flex-col items-center justify-center p-3 shadow-inner relative">
              <QrCode className="w-36 h-36 text-gray-900" />
              <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded-full absolute">
                fonepay
              </span>
            </div>

            <p className="text-sm font-black text-gray-900 mt-4 mb-4">
              Amount: {formatNPR(grandTotal)}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setShowFonepayModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={gatewayProcessing}
                onClick={async () => {
                  setGatewayProcessing(true);
                  await new Promise((r) => setTimeout(r, 900));
                  setShowFonepayModal(false);
                  setGatewayProcessing(false);
                  executeOrderPlacement('FONEPAY-QR-' + Date.now());
                }}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
              >
                {gatewayProcessing ? 'Verifying...' : 'I Have Scanned & Paid'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
