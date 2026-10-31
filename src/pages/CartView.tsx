import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { useLanguageStore } from '../store/useLanguageStore';
import { useUIStore } from '../store/useUIStore';
import { formatNPR } from '../lib/format';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Truck,
  Tag,
  ShieldCheck,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

export const CartView: React.FC = () => {
  const {
    items,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    updateQuantity,
    removeItem,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getVatAmount,
    getGrandTotal,
    getItemCount
  } = useCartStore();
  const { language, t } = useLanguageStore();
  const { navigate, showToast } = useUIStore();

  const [couponInput, setCouponInput] = useState('');

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const vat = getVatAmount();
  const grandTotal = getGrandTotal();

  const freeShippingThreshold = 200000; // Rs. 2,000
  const diffToFree = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (res.success) {
      showToast(res.message, 'success');
      setCouponInput('');
    } else {
      showToast(res.message, 'error');
    }
  };

  // Group items by seller
  const groupedBySeller = items.reduce((acc, item) => {
    const seller = item.product.sellerName || 'NepaleseStore Direct';
    if (!acc[seller]) acc[seller] = [];
    acc[seller].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center max-w-lg">
        <div className="w-20 h-20 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-1">Your Shopping Cart is Empty</h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          Looks like you haven't added anything to your cart yet. Explore authentic Nepali crafts, organic spices, and gadgets!
        </p>
        <button
          onClick={() => navigate('home')}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-xl text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-4">
        <button onClick={() => navigate('home')} className="hover:text-primary-600">
          Home
        </button>
        <ChevronRight className="w-3 h-3 text-gray-400" />
        <span className="font-semibold text-gray-800">Shopping Cart ({getItemCount()} items)</span>
      </nav>

      <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
        {t('cart')} ({getItemCount()} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Cart Items by Seller (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free Shipping Alert Box */}
          <div className="bg-red-50/80 border border-red-200/80 rounded-2xl p-4">
            <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-primary-600" />
                {diffToFree > 0
                  ? t('freeDeliveryProgress', { amount: formatNPR(diffToFree) })
                  : `🎉 ${t('freeDeliveryUnlocked')}`}
              </span>
              <span className="text-[11px] text-primary-700">{progressPercent}%</span>
            </div>
            <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  diffToFree === 0 ? 'bg-emerald-500' : 'bg-primary-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Groups by Seller */}
          {Object.entries(groupedBySeller).map(([sellerName, sellerItems]) => (
            <div key={sellerName} className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-3.5 bg-gray-50/80 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-primary-600" />
                  <span className="text-xs font-bold text-gray-900">
                    Seller: {sellerName}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">
                  {sellerItems.length} item{sellerItems.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="divide-y divide-gray-100 p-4">
                {sellerItems.map((item) => {
                  const title = language === 'ne' ? item.product.nameNe : item.product.nameEn;
                  const price = item.variant.price || item.product.basePrice;

                  return (
                    <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.variant.imageUrl || item.product.images[0]}
                          alt={title}
                          className="w-20 h-20 rounded-xl object-cover border border-gray-100 shrink-0"
                        />
                        <div>
                          <h3
                            onClick={() => navigate('product_detail', { productSlug: item.product.slug })}
                            className="text-xs sm:text-sm font-semibold text-gray-900 hover:text-primary-600 cursor-pointer line-clamp-1"
                          >
                            {title}
                          </h3>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            Variant: {item.variant.name} · SKU: {item.variant.sku}
                          </p>
                          <p className="text-xs font-extrabold text-primary-600 mt-1">
                            {formatNPR(price)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                        {/* Stepper */}
                        <div className="flex items-center border border-gray-300 rounded-lg bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1.5 text-gray-500 hover:text-primary-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="p-1.5 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right">
                          <span className="text-sm font-black text-gray-900 block">
                            {formatNPR(price * item.quantity)}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-primary-600" />
              <span>Apply Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs">
                <div>
                  <span className="font-extrabold text-emerald-800">{appliedCoupon.code}</span>
                  <p className="text-[10px] text-emerald-600">{appliedCoupon.descriptionEn}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-red-600 hover:underline font-bold text-xs"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="e.g. DASHAIN2026, FREESHIP"
                  className="flex-1 p-2 border border-gray-300 rounded-lg text-xs uppercase font-medium focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-3 py-2 rounded-lg"
                >
                  {t('apply')}
                </button>
              </form>
            )}

            <div className="mt-2 flex flex-wrap gap-1.5 text-[10px] text-gray-500">
              <span className="text-gray-400">Try demo codes:</span>
              <button
                onClick={() => setCouponInput('DASHAIN2026')}
                className="bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded font-mono font-bold text-primary-700"
              >
                DASHAIN2026
              </button>
              <button
                onClick={() => setCouponInput('FREESHIP')}
                className="bg-gray-100 hover:bg-gray-200 px-1.5 py-0.5 rounded font-mono font-bold text-primary-700"
              >
                FREESHIP
              </button>
            </div>
          </div>

          {/* Order Summary Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-gray-900 border-b border-gray-100 pb-3">
              {t('orderSummary')}
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span className="font-bold text-gray-900">{formatNPR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>{t('discount')} ({appliedCoupon?.code})</span>
                  <span>-{formatNPR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span className={shipping === 0 ? 'text-emerald-600 font-bold' : 'font-bold text-gray-900'}>
                  {shipping === 0 ? 'FREE' : formatNPR(shipping)}
                </span>
              </div>

              <div className="flex justify-between text-gray-400 text-[11px]">
                <span>{t('tax')}</span>
                <span>{formatNPR(vat)}</span>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline text-sm">
                <span className="font-bold text-gray-900">{t('total')}</span>
                <span className="text-xl font-black text-primary-600">
                  {formatNPR(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate('checkout')}
              className="w-full mt-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigate('home')}
              className="w-full py-2 text-gray-500 hover:text-gray-800 text-xs font-semibold"
            >
              ← {t('continueShopping')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
