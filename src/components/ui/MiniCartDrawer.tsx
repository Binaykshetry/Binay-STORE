import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useLanguageStore } from '../../store/useLanguageStore';
import { useUIStore } from '../../store/useUIStore';
import { formatNPR } from '../../lib/format';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Truck } from 'lucide-react';

export const MiniCartDrawer: React.FC = () => {
  const {
    items,
    isMiniCartOpen,
    setMiniCartOpen,
    updateQuantity,
    removeItem,
    getSubtotal,
    getItemCount
  } = useCartStore();
  const { language, t } = useLanguageStore();
  const { navigate } = useUIStore();

  if (!isMiniCartOpen) return null;

  const subtotal = getSubtotal();
  const freeShippingThreshold = 200000; // Rs. 2,000
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const diffToFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleCheckout = () => {
    setMiniCartOpen(false);
    navigate('checkout');
  };

  const handleViewCart = () => {
    setMiniCartOpen(false);
    navigate('cart');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setMiniCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex items-center justify-between bg-gray-50">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary-600" />
              <h2 className="text-base font-bold text-gray-900">
                {t('cart')} ({getItemCount()})
              </h2>
            </div>
            <button
              onClick={() => setMiniCartOpen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="p-3.5 bg-red-50/80 border-b border-red-100 text-xs">
            <div className="flex items-center gap-1.5 text-red-900 font-medium mb-1.5">
              <Truck className="w-4 h-4 text-primary-600" />
              {diffToFree > 0 ? (
                <span>
                  {t('freeDeliveryProgress', { amount: formatNPR(diffToFree) })}
                </span>
              ) : (
                <span className="font-bold text-emerald-700">
                  🎉 {t('freeDeliveryUnlocked')}
                </span>
              )}
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

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-gray-100">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm font-semibold text-gray-700">Your cart is currently empty</p>
                <p className="text-xs text-gray-400 mt-1 mb-4">Explore Nepali handicrafts & top tech deals</p>
                <button
                  onClick={() => {
                    setMiniCartOpen(false);
                    navigate('home');
                  }}
                  className="px-4 py-2 bg-primary-600 text-white text-xs font-bold rounded-lg hover:bg-primary-700"
                >
                  {t('continueShopping')}
                </button>
              </div>
            ) : (
              items.map((item) => {
                const title = language === 'ne' ? item.product.nameNe : item.product.nameEn;
                const price = item.variant.price || item.product.basePrice;

                return (
                  <div key={item.id} className="py-3 flex gap-3">
                    <img
                      src={item.variant.imageUrl || item.product.images[0]}
                      alt={title}
                      className="w-16 h-16 object-cover rounded-lg border border-gray-100 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-900 line-clamp-1">
                          {title}
                        </h4>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          {item.variant.name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-primary-600">
                          {formatNPR(price * item.quantity)}
                        </span>

                        {/* Quantity Stepper */}
                        <div className="flex items-center border border-gray-200 rounded-md bg-white">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-bold text-gray-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= item.variant.stock}
                            className="p-1 text-gray-500 hover:text-primary-600 disabled:opacity-40"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer with Totals & Actions */}
          {items.length > 0 && (
            <div className="p-4 border-t bg-gray-50 flex flex-col gap-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-gray-500 font-medium">{t('subtotal')}</span>
                <span className="text-base font-extrabold text-gray-900">
                  {formatNPR(subtotal)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">
                Taxes (VAT 13%) and shipping calculated at checkout
              </p>

              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={handleViewCart}
                  className="py-2.5 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 font-bold text-xs hover:bg-gray-100 transition-colors"
                >
                  {t('viewCart')}
                </button>
                <button
                  onClick={handleCheckout}
                  className="py-2.5 px-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{t('checkout')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
